"use client";
/* eslint-disable react-hooks/purity, react-hooks/set-state-in-effect, react-hooks/static-components */

import { useState, useRef, useEffect } from "react";
import NextImage from "next/image";
import { ArrowLeft, Save, Plus, Trash2, Lock, ShieldAlert, Heading2, Heading3, AlignLeft, List as ListIcon, ArrowUp, ArrowDown, Table as TableIcon, Image as ImageIcon, Star, UploadCloud, FileJson, Video, Link2 } from "lucide-react";
import { collection, addDoc, updateDoc, doc, serverTimestamp, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase"; // Ensure storage is exported from your firebase.js config
import { createImageThumbnailBlob } from "@/lib/imageThumbnails";
import { canonicalInternalHref } from "@/lib/contentPolicy";
import { cleanMetaTitle, CONTENT_AUTHOR, formatContentDate, getContentAuthor, getPublishedDate, getUpdatedDate, normalizeAuthorProfileUrl } from "@/lib/contentMeta";
import { tools, toolsHub } from "@/lib/tools";
import { validateContentForPublication } from "@/lib/cmsValidation";

const cleanStorageFileName = (fileName) => fileName.replace(/[^a-zA-Z0-9.]/g, '');
const isLegacyPlaceholderImage = (url = "") => /^https?:\/\/(?:www\.)?pitchside\.ai\/images\//i.test(url);
const defaultCtaBlock = { headline: "", description: "", buttonText: "", buttonUrl: "" };
const llmDescriptionPlanningReplacements = [
  [/\blanding page\b/gi, "page"],
  [/\bsupporting blog\b/gi, "article"],
  [/\bsupporting article\b/gi, "article"],
  [/\bSEO\b/g, "search"],
  [/\bseo\b/g, "search"],
];

const safeTechnologyStats = [
  { value: "Private beta", label: "Current\nStatus" },
  { value: "5, 6 and 7-a-side", label: "Supported\nFormats" },
  { value: "Review required", label: "Output\nStatus" },
];

const safeTechnologyStack = [
  {
    id: "vision",
    icon: "vision",
    title: "Small-Sided Football Model",
    desc: "Pitchside is being developed around phone-recorded 5-a-side, 6-a-side and 7-a-side football footage.",
  },
  {
    id: "events",
    icon: "ai",
    title: "Event Detection in Testing",
    desc: "The beta is testing supported events such as goals, assists, saves, passes and tackles. Output can vary by footage quality and should be reviewed.",
  },
  {
    id: "review",
    icon: "hardware",
    title: "Reviewable Match Output",
    desc: "Detected events and player assignments should be checked before treating the match record as final.",
  },
  {
    id: "upload",
    icon: "cloud",
    title: "Private Beta Upload Flow",
    desc: "Current upload and processing can take up to 45 minutes during testing.",
  },
];

const staleTechnologyClaimPattern = /98%|<3m|under three minutes|trained on thousands of hours|broadcast-quality|proprietary optical engine|event accuracy|processing time/i;

const hasStaleTechnologyClaim = (value) => staleTechnologyClaimPattern.test(JSON.stringify(value || ""));

const sanitizeTechnologyFields = (data = {}) => ({
  ...data,
  technologyStats: Array.isArray(data.technologyStats) && data.technologyStats.length && !hasStaleTechnologyClaim(data.technologyStats)
    ? data.technologyStats
    : safeTechnologyStats,
  technologyStack: Array.isArray(data.technologyStack) && data.technologyStack.length && !hasStaleTechnologyClaim(data.technologyStack)
    ? data.technologyStack
    : safeTechnologyStack,
});

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const escapeHtmlAttribute = (value) => value
  .replaceAll("&", "&amp;")
  .replaceAll('"', "&quot;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

const normalizeInternalHref = (value) => {
  if (typeof value !== "string") return null;

  const href = value.trim();
  if (!href) return null;

  if (href.startsWith("/")) return canonicalInternalHref(href);

  try {
    const url = new URL(href);
    if (!/^https?:$/i.test(url.protocol) || !["pitchside.ai", "www.pitchside.ai"].includes(url.hostname.toLowerCase())) return null;
    return canonicalInternalHref(`${url.pathname}${url.search}${url.hash}`);
  } catch {
    return null;
  }
};

const cleanLlmDescription = (value, fallback = "") => {
  const source = typeof value === "string" && value.trim() ? value : fallback;
  if (typeof source !== "string") return "";

  return llmDescriptionPlanningReplacements
    .reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), source)
    .replace(/\s+/g, " ")
    .trim();
};

const getLandingPageRoute = (data = {}) => {
  const slug = data.slug || "slug";
  return data.parentPage?.url === "/technology" ? `/technology/${slug}` : `/${slug}`;
};

const getAuthorKey = (author = {}) => `${author.name || ""}|${author.url || ""}`;

const getAuthorOptions = (managedAuthors = []) => {
  const authorMap = new Map();
  [CONTENT_AUTHOR, ...managedAuthors].forEach((author) => {
    const normalizedAuthor = {
      ...author,
      url: normalizeAuthorProfileUrl(author.name, author.url),
    };
    const key = getAuthorKey(normalizedAuthor);
    if (normalizedAuthor.name && normalizedAuthor.url && !authorMap.has(key)) authorMap.set(key, normalizedAuthor);
  });
  return Array.from(authorMap.values());
};

const applyInternalLinksToImport = (data) => {
  if (!Array.isArray(data.internalLinks) || data.internalLinks.length === 0) {
    return { data, linksAdded: 0 };
  }

  const links = data.internalLinks
    .map((link) => {
      const linkLabel = link?.text ?? link?.anchor;
      const text = typeof linkLabel === "string" ? linkLabel.trim() : "";
      const href = normalizeInternalHref(link?.url ?? link?.href);
      const requestedMax = Number(link?.maxUses);
      const maxUses = Number.isInteger(requestedMax) && requestedMax > 0 ? requestedMax : 1;
      return text && href ? { text, href, maxUses, used: 0 } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.text.length - a.text.length);
  const linkPattern = links.length
    ? new RegExp(links.map((link) => escapeRegExp(link.text)).join("|"), "gi")
    : null;

  let linksAdded = 0;
  const linkText = (value) => {
    if (typeof value !== "string" || !value) return value;

    // Keep existing anchors and HTML tags intact. Replacements only run in text nodes.
    const parts = value.split(/(<a\b[^>]*>[\s\S]*?<\/a>|<[^>]+>)/gi);
    return parts.map((part) => {
      if (/^</.test(part)) return part;

      if (!linkPattern) return part;
      return part.replace(linkPattern, (match) => {
        const link = links.find((candidate) => candidate.text.toLowerCase() === match.toLowerCase());
        if (!link || link.used >= link.maxUses) return match;

        link.used += 1;
        linksAdded += 1;
        return `<a href="${escapeHtmlAttribute(link.href)}">${match}</a>`;
      });
    }).join("");
  };

  const contentBlocks = Array.isArray(data.contentBlocks)
    ? data.contentBlocks.map((block) => {
        if (block?.type === "section") {
          return { ...block, heading: linkText(block.heading), body: linkText(block.body) };
        }
        if (block?.type === "list") return { ...block, items: (block.items || []).map(linkText) };
        if (block?.type === "table") {
          return {
            ...block,
            rows: (block.rows || []).map((row) => ({ ...row, cells: (row.cells || []).map(linkText) })),
          };
        }
        if (["paragraph", "h2", "h3"].includes(block?.type)) return { ...block, content: linkText(block.content) };
        return block;
      })
    : data.contentBlocks;

  const { internalLinks: _internalLinks, ...dataWithoutImportLinks } = data;

  return {
    linksAdded,
    data: {
      ...dataWithoutImportLinks,
      llmDescription: cleanLlmDescription(data.llmDescription, data.metaDescription || data.intro),
      contentBlocks,
      faqs: Array.isArray(data.faqs)
        ? data.faqs.map((faq) => ({ ...faq, answer: linkText(faq?.answer) }))
        : data.faqs,
      aeoQuickAnswer: linkText(data.aeoQuickAnswer),
      tldrPoints: Array.isArray(data.tldrPoints) ? data.tldrPoints.map(linkText) : data.tldrPoints,
      intro: linkText(data.intro),
      ctaBlock: data.ctaBlock
        ? { ...data.ctaBlock, description: linkText(data.ctaBlock.description) }
        : data.ctaBlock,
    },
  };
};

const getBlockKey = (block, index) => block.id || `${block.type || "block"}-${index}`;
const technologyParentPage = { type: "landing", id: "technology", title: "Technology", url: "/technology" };

function LinkableTextarea({ value, onChange, rows = 4 }) {
  const textareaRef = useRef(null);
  const [selection, setSelection] = useState(null);

  const captureSelection = (event) => {
    const { selectionStart, selectionEnd } = event.currentTarget;
    setSelection(selectionEnd > selectionStart ? { start: selectionStart, end: selectionEnd } : null);
  };

  const addLink = () => {
    if (!selection) return;

    const enteredUrl = window.prompt("Enter the link URL:", "https://");
    if (!enteredUrl) return;

    const url = enteredUrl.trim();
    if (!/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(url)) {
      window.alert("Use a full URL beginning with https://, or a relative URL beginning with /. ");
      return;
    }

    const safeUrl = url.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    const selectedText = value.slice(selection.start, selection.end);
    const linkedText = `<a href="${safeUrl}">${selectedText}</a>`;
    const nextValue = `${value.slice(0, selection.start)}${linkedText}${value.slice(selection.end)}`;
    onChange(nextValue);
    setSelection(null);

    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        placeholder="Write your content here..."
        rows={rows}
        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-300 focus:border-[#CCFF00] outline-none leading-relaxed"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onSelect={captureSelection}
      />
      {selection && (
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={addLink}
          className="absolute right-2 top-2 flex items-center gap-1.5 rounded-lg border border-[#CCFF00]/30 bg-black px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-[#CCFF00] shadow-lg"
        >
          <Link2 className="h-3 w-3" /> Add link
        </button>
      )}
    </div>
  );
}

const normalizeContentBlocks = (blocks = []) => {
  const seenIds = new Set();

  const uniqueId = (requestedId, fallbackId) => {
    const baseId = requestedId || fallbackId;
    let id = baseId;
    let suffix = 1;
    while (seenIds.has(id)) {
      id = `${baseId}-${suffix}`;
      suffix += 1;
    }
    seenIds.add(id);
    return id;
  };

  return blocks.flatMap((block, index) => {
    if (!block || typeof block !== "object") return [];

    // Accept the concise AI/content-writer schema as well as native editor blocks.
    if (block.type === "section") {
      const sectionBlocks = [];
      if (typeof block.heading === "string" && block.heading.trim()) {
        sectionBlocks.push({
          id: uniqueId(block.id, `section-${index}-heading`),
          type: "h2",
          content: block.heading.trim(),
        });
      }
      if (typeof block.body === "string" && block.body.trim()) {
        sectionBlocks.push({
          id: uniqueId(null, `section-${index}-body`),
          type: "paragraph",
          content: block.body.trim(),
        });
      }
      return sectionBlocks;
    }

    const fallbackId = `${block.type || "block"}-${index}`;
    const id = uniqueId(block.id, fallbackId);

    if (block.type === "list") {
      return [{ ...block, id, items: block.items || [] }];
    }

    if (block.type === "table") {
      return [{ ...block, id, headers: block.headers || [], rows: block.rows || [] }];
    }

    return [{ ...block, id, content: block.content || "" }];
  });
};

const uploadStorageFile = async (path, file, metadata) => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file, metadata);
  return getDownloadURL(snapshot.ref);
};

const uploadThumbnailForImage = async (file, baseFolder, cleanFileName) => {
  const thumbnailBlob = await createImageThumbnailBlob(file);
  if (!thumbnailBlob) return "";

  const thumbnailName = cleanFileName.replace(/\.[^.]+$/, "") || "image";
  return uploadStorageFile(
    `${baseFolder}/thumbnails/${Date.now()}_${thumbnailName}.webp`,
    thumbnailBlob,
    { contentType: "image/webp" }
  );
};

export default function PageBuilder({ initialData, collectionName, pageType, onBack }) {
  const [status, setStatus] = useState("idle");
  const [showJsonImport, setShowJsonImport] = useState(false);
  const [importString, setImportString] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [parentOptions, setParentOptions] = useState([]);
  const [authorOptions, setAuthorOptions] = useState([]);
  const [recommendationOptions, setRecommendationOptions] = useState([]);
  const initialAuthor = getContentAuthor(initialData);
  
  const isStaticCorePage = pageType === "core";
  const isStaticAuthorityPage = pageType === "authority";
  const isManagedStaticPage = isStaticCorePage || isStaticAuthorityPage;
  const isToolPage = pageType === "tool";
  const isTechnologyCorePage = isStaticCorePage && initialData?.id === "technology";
  const isEditableContentPage = !isStaticCorePage || isTechnologyCorePage;
  const isArticlePage = pageType === "post" || pageType === "landing" || pageType === "technology" || isTechnologyCorePage;
  const isSlugLocked = isManagedStaticPage || isToolPage;
  const initialSafeData = pageType === "technology" || isTechnologyCorePage
    ? sanitizeTechnologyFields(initialData || {})
    : (initialData || {});

  // INITIALIZE STATE
  const [formData, setFormData] = useState({
    title: initialSafeData?.title || "",
    metaTitle: initialSafeData?.metaTitle || "",
    slug: initialSafeData?.slug || "",
    metaDescription: initialSafeData?.metaDescription || "",
    intro: initialSafeData?.intro || "",
    badge: initialSafeData?.badge || "",
    llmDescription: initialSafeData?.llmDescription || "",
    landingLayout: initialSafeData?.landingLayout || "centered",
    authorName: initialAuthor.name,
    authorUrl: initialAuthor.url,
    parentPage: initialSafeData?.parentPage || (pageType === "technology" ? technologyParentPage : null),
    moreToRead: initialSafeData?.moreToRead || [],
    thumbnail: initialSafeData?.thumbnail || "",
    primaryImage: initialSafeData?.primaryImage || "", 
    
    heroBackground: initialSafeData?.heroBackground || "",
    technologyStats: initialSafeData?.technologyStats?.length ? initialSafeData.technologyStats : safeTechnologyStats,
    technologyStack: initialSafeData?.technologyStack?.length ? initialSafeData.technologyStack : safeTechnologyStack,
    technologySections: initialSafeData?.technologySections || [],

    heroH1: initialSafeData?.heroH1 || "",
    hero: initialSafeData?.hero || {
      eyebrow: "",
      primaryCtaLabel: "",
      secondaryCtaLabel: "",
      previewLabel: "",
      previewType: "",
      previewData: {},
    },
    tldrPoints: initialSafeData?.tldrPoints || [""], 
    aeoQuickAnswer: initialSafeData?.aeoQuickAnswer || "",
    contentBlocks: initialSafeData?.contentBlocks?.length
      ? normalizeContentBlocks(initialSafeData.contentBlocks).filter((block) => !isToolPage || block.type !== "image")
      : [],
    ctaBlock: { ...defaultCtaBlock, ...(initialSafeData?.ctaBlock || {}) },
    faqs: initialSafeData?.faqs || [{ question: "", answer: "" }]
  });

  const DRAFT_KEY = `pitchside_draft_${collectionName}`;
  const livePreviewPath = initialData ? getLandingPageRoute(initialData) : "";

  useEffect(() => {
    if (!isArticlePage) return;

    const loadBlogRelationships = async () => {
      try {
        const postsSnapshot = await getDocs(collection(db, "posts"));
        const blogOptions = postsSnapshot.docs
          .map((postDoc) => ({ id: postDoc.id, ...postDoc.data() }))
          .filter((post) => post.slug && post.slug !== formData.slug)
          .map((post) => ({ type: "blog", id: post.id, title: post.heroH1 || post.title || post.slug, url: `/blog/${post.slug}`, description: post.metaDescription || post.intro || "" }));
        const toolRecommendations = tools.map((tool) => ({ type: "tool", id: tool.id || tool.slug, title: tool.title, url: `/tools/${tool.slug}`, description: tool.metaDescription || tool.description || "" }));
        setRecommendationOptions([...blogOptions, ...toolRecommendations]);

        if (pageType !== "post") return;

        const pagesSnapshot = await getDocs(collection(db, "pages"));
        const reservedSlugs = new Set([
          "",
          "/",
          "home",
          "technology",
          "about",
          "blog",
          "contact",
          "pricing",
          "account-deletion",
          "privacy",
          "terms",
          "cookies",
          "editorial-policy",
          "comparison-methodology",
          "affiliate-disclosure",
          "product-status",
          "recording-consent-and-privacy",
          "security-and-data",
          "authors/dave-coombs",
          "authors/abdullah-luqman",
        ]);
        const landingPages = pagesSnapshot.docs
          .map((pageDoc) => ({ id: pageDoc.id, ...pageDoc.data() }))
          .filter((page) => page.slug && !reservedSlugs.has(page.slug))
          .map((page) => ({ type: "landing", id: page.id, title: page.title || page.heroH1 || page.slug, url: `/${page.slug}` }));
        const toolPages = [toolsHub, ...tools].map((tool) => ({
          type: "tool",
          id: tool.id || tool.slug,
          title: tool.title,
          url: tool.slug === "tools" ? "/tools" : `/tools/${tool.slug}`,
        }));
        setParentOptions([...landingPages, ...toolPages]);

        try {
          const authorsSnapshot = await getDocs(collection(db, "authors"));
          const managedAuthors = authorsSnapshot.docs.map((authorDoc) => ({ id: authorDoc.id, ...authorDoc.data() }));
          setAuthorOptions(getAuthorOptions(managedAuthors));
        } catch (error) {
          console.error("Unable to load managed authors:", error);
          setAuthorOptions(getAuthorOptions());
        }
      } catch (error) {
        console.error("Unable to load blog relationships:", error);
        setParentOptions([toolsHub, ...tools].map((tool) => ({ type: "tool", id: tool.id || tool.slug, title: tool.title, url: tool.slug === "tools" ? "/tools" : `/tools/${tool.slug}` })));
        setAuthorOptions(getAuthorOptions());
        setRecommendationOptions(tools.map((tool) => ({ type: "tool", id: tool.id || tool.slug, title: tool.title, url: `/tools/${tool.slug}`, description: tool.metaDescription || tool.description || "" })));
      }
    };

    loadBlogRelationships();
  }, [formData.slug, isArticlePage, pageType]);

  // --- AUTO-SAVE & DRAFT RECOVERY ---
  useEffect(() => {
    if (!initialData) {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        if (window.confirm("An unsaved draft was found. Would you like to restore it?")) {
          setFormData(JSON.parse(savedDraft));
        } else {
          localStorage.removeItem(DRAFT_KEY);
        }
      }
    }
  }, [DRAFT_KEY, initialData]);

  useEffect(() => {
    if (!initialData && formData.title) {
      const timeout = setTimeout(() => {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [DRAFT_KEY, formData, initialData]);


  // --- JSON IMPORT ENGINE ---
  const handleJsonImport = () => {
    try {
      const parsedData = JSON.parse(importString);
      if (!parsedData || Array.isArray(parsedData) || typeof parsedData !== "object") {
        throw new Error("The imported JSON must be an object.");
      }
      const mappedData = isTechnologyCorePage
        ? {
            ...parsedData,
            badge: parsedData.badge || parsedData.heroLabel,
            intro: parsedData.intro || parsedData.heroIntro,
            technologyStats: parsedData.technologyStats || parsedData.trustStats,
            technologySections: parsedData.technologySections || parsedData.sections,
            ctaBlock: parsedData.ctaBlock || parsedData.cta,
          }
        : parsedData;
      const { data: linkedData, linksAdded } = applyInternalLinksToImport(mappedData);
      const importedAuthor = getContentAuthor(linkedData);
      setFormData(prev => ({
        ...prev,
        ...linkedData,
        authorName: importedAuthor.name,
        authorUrl: importedAuthor.url,
        contentBlocks: linkedData.contentBlocks ? normalizeContentBlocks(linkedData.contentBlocks) : prev.contentBlocks,
        ctaBlock: { ...defaultCtaBlock, ...(prev.ctaBlock || {}), ...(linkedData.ctaBlock || {}) },
      }));
      setImportString("");
      setShowJsonImport(false);
      alert(`JSON imported successfully. ${linksAdded} internal link${linksAdded === 1 ? "" : "s"} added.`);
    } catch (e) {
      alert("Invalid JSON format. Please check your syntax.");
    }
  };


  // --- FIREBASE UPLOAD: GENERAL MEDIA ---
  const handleBlockImageUpload = async (e, blockId) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Safety check: Prevent dragging multiple images
    if (files.length > 1) {
      alert("Upload restricted: You can only upload one image at a time.");
      e.target.value = null;
      return;
    }

    const file = files[0];
    setIsUploading(true);
    
    try {
      // Firebase Storage Logic
      const cleanFileName = cleanStorageFileName(file.name);
      const publicUrl = await uploadStorageFile(`content-images/${Date.now()}_${cleanFileName}`, file);
      const thumbnailUrl = await uploadThumbnailForImage(file, "content-images", cleanFileName);

      updateBlockContent(blockId, publicUrl);
      setFormData(prev => ({
        ...prev,
        primaryImage: !prev.primaryImage || isLegacyPlaceholderImage(prev.primaryImage) ? publicUrl : prev.primaryImage,
        thumbnail: thumbnailUrl || publicUrl,
      }));
    } catch (err) {
      console.error("Firebase upload error:", err);
      alert("Failed to upload image. Check console for details.");
    } finally {
      setIsUploading(false);
      e.target.value = null;
    }
  };

  // --- FIREBASE UPLOAD: HERO BACKGROUND ---
  const handleHeroBackgroundUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Safety check: Prevent dragging multiple images
    if (files.length > 1) {
      alert("Upload restricted: You can only upload one media file at a time.");
      e.target.value = null;
      return;
    }

    const file = files[0];
    setIsUploading(true);
    
    try {
      // Firebase Storage Logic
      const cleanFileName = cleanStorageFileName(file.name);
      const publicUrl = await uploadStorageFile(`hero-backgrounds/${Date.now()}_${cleanFileName}`, file);
      const thumbnailUrl = await uploadThumbnailForImage(file, "hero-backgrounds", cleanFileName);

      setFormData(prev => ({
        ...prev,
        heroBackground: publicUrl,
        thumbnail: thumbnailUrl || publicUrl,
      }));
    } catch (err) {
      console.error("Firebase upload error:", err);
      alert("Failed to upload media. Check console for details.");
    } finally {
      setIsUploading(false);
      e.target.value = null;
    }
  };

  // --- INLINE BLOCK INSERTER ---
  const insertContentBlock = (index, type) => {
    let newBlock;
    if (type === "list") newBlock = { id: Date.now().toString(), type, items: [""] };
    else if (type === "table") newBlock = { id: Date.now().toString(), type, headers: ["Column 1", "Column 2"], rows: [{ cells: ["Data 1", "Data 2"] }] };
    else if (type === "image") newBlock = { id: Date.now().toString(), type, content: "" };
    else newBlock = { id: Date.now().toString(), type, content: "" };

    const newBlocks = [...formData.contentBlocks];
    newBlocks.splice(index, 0, newBlock); 
    setFormData({ ...formData, contentBlocks: newBlocks });
  };

  const removeContentBlock = (id) => setFormData({ ...formData, contentBlocks: formData.contentBlocks.filter(b => b.id !== id) });
  const updateBlockContent = (id, newContent) => setFormData({ ...formData, contentBlocks: formData.contentBlocks.map(b => b.id === id ? { ...b, content: newContent } : b) });
  const moveBlock = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === formData.contentBlocks.length - 1)) return;
    const newBlocks = [...formData.contentBlocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index + direction];
    newBlocks[index + direction] = temp;
    setFormData({ ...formData, contentBlocks: newBlocks });
  };

  const updateListBlockItem = (blockId, itemIndex, value) => setFormData({ ...formData, contentBlocks: formData.contentBlocks.map(b => b.id === blockId ? { ...b, items: b.items.map((it, i) => i === itemIndex ? value : it) } : b) });
  const addListBlockItem = (blockId) => setFormData({ ...formData, contentBlocks: formData.contentBlocks.map(b => b.id === blockId ? { ...b, items: [...b.items, ""] } : b) });
  const removeListBlockItem = (blockId, itemIndex) => setFormData({ ...formData, contentBlocks: formData.contentBlocks.map(b => b.id === blockId ? { ...b, items: b.items.filter((_, i) => i !== itemIndex) } : b) });

  const addTableColumn = (blockId) => setFormData({ ...formData, contentBlocks: formData.contentBlocks.map(b => b.id === blockId ? { ...b, headers: [...b.headers, "New Col"], rows: b.rows.map(row => ({ cells: [...row.cells, ""] })) } : b)});
  const removeTableColumn = (blockId, colIndex) => setFormData({ ...formData, contentBlocks: formData.contentBlocks.map(b => b.id === blockId ? { ...b, headers: b.headers.filter((_, i) => i !== colIndex), rows: b.rows.map(row => ({ cells: row.cells.filter((_, i) => i !== colIndex) })) } : b)});
  const addTableRow = (blockId) => setFormData({ ...formData, contentBlocks: formData.contentBlocks.map(b => b.id === blockId ? { ...b, rows: [...b.rows, { cells: new Array(b.headers.length).fill("") }] } : b)});
  const removeTableRow = (blockId, rowIndex) => setFormData({ ...formData, contentBlocks: formData.contentBlocks.map(b => b.id === blockId ? { ...b, rows: b.rows.filter((_, i) => i !== rowIndex) } : b)});
  const updateTableHeader = (blockId, colIndex, value) => setFormData({ ...formData, contentBlocks: formData.contentBlocks.map(b => b.id === blockId ? { ...b, headers: Object.assign([...b.headers], {[colIndex]: value}) } : b)});
  const updateTableCell = (blockId, rowIndex, colIndex, value) => setFormData({ ...formData, contentBlocks: formData.contentBlocks.map(b => { if (b.id !== blockId) return b; const newRows = [...b.rows]; newRows[rowIndex] = { cells: [...newRows[rowIndex].cells] }; newRows[rowIndex].cells[colIndex] = value; return { ...b, rows: newRows }; })});

  const handleArrayChange = (field, index, value) => { const newArray = [...formData[field]]; newArray[index] = value; setFormData({ ...formData, [field]: newArray }); };
  const addArrayItem = (field, emptyValue) => setFormData({ ...formData, [field]: [...formData[field], emptyValue] });
  const removeArrayItem = (field, index) => setFormData({ ...formData, [field]: formData[field].filter((_, i) => i !== index) });
  const updateHeroField = (field, value) => setFormData({ ...formData, hero: { ...(formData.hero || {}), [field]: value } });
  const updateTechnologyStat = (index, field, value) => setFormData({
    ...formData,
    technologyStats: formData.technologyStats.map((stat, statIndex) => statIndex === index ? { ...stat, [field]: value } : stat),
  });
  const addTechnologyStat = () => setFormData({ ...formData, technologyStats: [...formData.technologyStats, { value: "", label: "" }] });
  const removeTechnologyStat = (index) => setFormData({ ...formData, technologyStats: formData.technologyStats.filter((_, statIndex) => statIndex !== index) });
  const updateTechnologyStack = (index, field, value) => setFormData({
    ...formData,
    technologyStack: formData.technologyStack.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item),
  });
  const addTechnologyStackItem = () => setFormData({
    ...formData,
    technologyStack: [
      ...formData.technologyStack,
      { id: `tech-${Date.now()}`, icon: "ai", title: "New Technology Section", desc: "" },
    ],
  });
  const removeTechnologyStackItem = (index) => setFormData({ ...formData, technologyStack: formData.technologyStack.filter((_, itemIndex) => itemIndex !== index) });
  const updateTechnologySection = (index, field, value) => setFormData({
    ...formData,
    technologySections: formData.technologySections.map((section, sectionIndex) => sectionIndex === index ? { ...section, [field]: value } : section),
  });
  const addTechnologySection = () => setFormData({
    ...formData,
    technologySections: [...formData.technologySections, { h2: "New Technology Section", content: [""], table: null }],
  });
  const removeTechnologySection = (index) => setFormData({ ...formData, technologySections: formData.technologySections.filter((_, sectionIndex) => sectionIndex !== index) });
  const updateTechnologyParagraph = (sectionIndex, paragraphIndex, value) => setFormData({
    ...formData,
    technologySections: formData.technologySections.map((section, index) => index === sectionIndex
      ? { ...section, content: (section.content || []).map((paragraph, pIndex) => pIndex === paragraphIndex ? value : paragraph) }
      : section),
  });
  const addTechnologyParagraph = (sectionIndex) => setFormData({
    ...formData,
    technologySections: formData.technologySections.map((section, index) => index === sectionIndex
      ? { ...section, content: [...(section.content || []), ""] }
      : section),
  });
  const removeTechnologyParagraph = (sectionIndex, paragraphIndex) => setFormData({
    ...formData,
    technologySections: formData.technologySections.map((section, index) => index === sectionIndex
      ? { ...section, content: (section.content || []).filter((_, pIndex) => pIndex !== paragraphIndex) }
      : section),
  });
  const addTechnologyTable = (sectionIndex) => setFormData({
    ...formData,
    technologySections: formData.technologySections.map((section, index) => index === sectionIndex
      ? { ...section, table: section.table || { headers: ["Column 1", "Column 2"], rows: [["", ""]] } }
      : section),
  });
  const removeTechnologyTable = (sectionIndex) => setFormData({
    ...formData,
    technologySections: formData.technologySections.map((section, index) => index === sectionIndex ? { ...section, table: null } : section),
  });
  const updateTechnologyTableHeader = (sectionIndex, headerIndex, value) => setFormData({
    ...formData,
    technologySections: formData.technologySections.map((section, index) => index === sectionIndex
      ? { ...section, table: { ...(section.table || {}), headers: (section.table?.headers || []).map((header, hIndex) => hIndex === headerIndex ? value : header) } }
      : section),
  });
  const updateTechnologyTableCell = (sectionIndex, rowIndex, cellIndex, value) => setFormData({
    ...formData,
    technologySections: formData.technologySections.map((section, index) => index === sectionIndex
      ? { ...section, table: { ...(section.table || {}), rows: (section.table?.rows || []).map((row, rIndex) => rIndex === rowIndex ? row.map((cell, cIndex) => cIndex === cellIndex ? value : cell) : row) } }
      : section),
  });
  const addTechnologyTableRow = (sectionIndex) => setFormData({
    ...formData,
    technologySections: formData.technologySections.map((section, index) => {
      if (index !== sectionIndex) return section;
      const headers = section.table?.headers || ["Column 1", "Column 2"];
      return { ...section, table: { ...section.table, headers, rows: [...(section.table?.rows || []), headers.map(() => "")] } };
    }),
  });
  const updateHeroPreviewJson = (value) => {
    let parsed = formData.hero?.previewData || {};
    try {
      parsed = value.trim() ? JSON.parse(value) : {};
    } catch (error) {
      // Keep the raw draft visible until the JSON is valid.
    }
    setFormData({ ...formData, hero: { ...(formData.hero || {}), previewDataJson: value, previewData: parsed } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("saving");
    try {
      const cleanData = JSON.parse(JSON.stringify(formData));
      if (isArticlePage) {
        const author = getContentAuthor(formData);
        cleanData.authorName = author.name;
        cleanData.authorUrl = author.url;
        delete cleanData.author;
        delete cleanData.authors;
      }
      if (cleanData.metaTitle) {
        cleanData.metaTitle = cleanMetaTitle(cleanData.metaTitle);
      }
      cleanData.llmDescription = cleanLlmDescription(
        cleanData.llmDescription,
        cleanData.metaDescription || cleanData.intro
      );
      if (pageType === "technology") {
        cleanData.parentPage = technologyParentPage;
      }
      if (pageType === "technology" || isTechnologyCorePage) {
        Object.assign(cleanData, sanitizeTechnologyFields(cleanData));
      }
      if (isToolPage && cleanData.hero) {
        let previewData = cleanData.hero.previewData;
        if (previewData === undefined && typeof cleanData.hero.previewDataJson === "string") {
          try {
            previewData = JSON.parse(cleanData.hero.previewDataJson);
          } catch {
            throw new Error("Cannot save tool: hero preview data is not valid JSON.");
          }
        }
        cleanData.hero.previewDataJson = JSON.stringify(previewData || {});
        delete cleanData.hero.previewData;
      }
      if (isToolPage) {
        cleanData.contentBlocksJson = JSON.stringify((cleanData.contentBlocks || []).filter((block) => block.type !== "image"));
        delete cleanData.contentBlocks;
        delete cleanData.thumbnail;
        delete cleanData.primaryImage;
        delete cleanData.heroBackground;
      }
      const validationIssues = validateContentForPublication(cleanData);
      const blockingIssues = validationIssues.filter((issue) => issue.severity === "error");
      if (blockingIssues.length) {
        const message = blockingIssues
          .slice(0, 8)
          .map((issue) => `${issue.path}: "${issue.phrase}" - ${issue.message}`)
          .join("\n");
        throw new Error(`Cannot publish until these content issues are fixed:\n${message}`);
      }
      if (isToolPage) {
        const toolDocumentId = initialData?.id || initialData?.slug || cleanData.slug;
        if (!toolDocumentId) throw new Error("Cannot save tool: missing document ID and slug.");
        const { deleteField, setDoc } = await import("firebase/firestore");
        await setDoc(doc(db, "tools", toolDocumentId), {
          ...cleanData,
          slug: initialData?.slug || cleanData.slug || toolDocumentId,
          contentBlocks: deleteField(),
          heroBackground: deleteField(),
          primaryImage: deleteField(),
          thumbnail: deleteField(),
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }
      else if (initialData?.id && !isManagedStaticPage) await updateDoc(doc(db, collectionName, initialData.id), { ...cleanData, updatedAt: serverTimestamp() });
      else if (isManagedStaticPage) await updateDoc(doc(db, "pages", initialData.id), { ...cleanData, updatedAt: serverTimestamp() }).catch(async () => { const { setDoc } = await import("firebase/firestore"); await setDoc(doc(db, "pages", initialData.id), { ...cleanData, createdAt: serverTimestamp() }); });
      else await addDoc(collection(db, collectionName), {
        ...cleanData,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        publishedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      localStorage.removeItem(DRAFT_KEY);
      setStatus("success");
      onBack();
    } catch (error) {
      console.error(error);
      if (typeof window !== "undefined") {
        window.alert(error.message || "Could not save this content. Check the console for details.");
      }
      setStatus("error");
    }
  };

  const InlineAdder = ({ index }) => (
    <div className="relative flex items-center justify-center my-4 group/adder opacity-0 hover:opacity-100 transition-opacity">
      <div className="absolute w-full h-[1px] bg-[#CCFF00]/30"></div>
      <div className="relative bg-zinc-950 px-4 flex gap-2">
        <button type="button" onClick={() => insertContentBlock(index, "h2")} className="p-2 text-zinc-500 hover:text-[#CCFF00] hover:bg-zinc-900 rounded-lg transition-colors"><Heading2 className="w-4 h-4" /></button>
        <button type="button" onClick={() => insertContentBlock(index, "h3")} className="p-2 text-zinc-500 hover:text-[#CCFF00] hover:bg-zinc-900 rounded-lg transition-colors"><Heading3 className="w-4 h-4" /></button>
        <button type="button" onClick={() => insertContentBlock(index, "paragraph")} className="p-2 text-zinc-500 hover:text-[#CCFF00] hover:bg-zinc-900 rounded-lg transition-colors"><AlignLeft className="w-4 h-4" /></button>
        <button type="button" onClick={() => insertContentBlock(index, "list")} className="p-2 text-zinc-500 hover:text-[#CCFF00] hover:bg-zinc-900 rounded-lg transition-colors"><ListIcon className="w-4 h-4" /></button>
        {!isToolPage && <button type="button" onClick={() => insertContentBlock(index, "image")} className="p-2 text-zinc-500 hover:text-[#CCFF00] hover:bg-zinc-900 rounded-lg transition-colors"><ImageIcon className="w-4 h-4" /></button>}
        <button type="button" onClick={() => insertContentBlock(index, "table")} className="p-2 text-zinc-500 hover:text-[#CCFF00] hover:bg-zinc-900 rounded-lg transition-colors"><TableIcon className="w-4 h-4" /></button>
      </div>
    </div>
  );

  return (
    <div className="w-full pb-32">
      {/* TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-zinc-900 pb-8 gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-zinc-900 rounded-full hover:bg-[#CCFF00] hover:text-black transition-colors"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">
              {isTechnologyCorePage ? "Technology Page Editor" : isStaticAuthorityPage ? "Authority Page Editor" : isStaticCorePage ? "System Route Meta" : isToolPage ? "Tool Content Editor" : pageType === "post" ? "Blog Editor" : pageType === "technology" ? "Technology Subpage Builder" : "SEO Landing Page Builder"}
            </h1>
            {!initialData && <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mt-1">Auto-saving draft locally...</p>}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {isEditableContentPage && (
            <>
              <button type="button" onClick={() => { setShowJsonImport(true); setImportString(""); }} className="flex items-center gap-2 bg-purple-500/10 text-purple-400 border border-purple-500/30 px-4 py-3 font-bold uppercase tracking-widest text-xs hover:bg-purple-500 hover:text-white transition-all rounded-xl">
                <FileJson className="w-4 h-4" /> Import JSON
              </button>
            </>
          )}
          <button onClick={handleSubmit} disabled={status === "saving" || isUploading} className="flex items-center justify-center gap-2 bg-[#CCFF00] text-black px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-white transition-all shadow-[0_0_20px_rgba(204,255,0,0.15)] rounded-xl active:scale-95 disabled:opacity-50">
            <Save className="w-4 h-4" /> {status === "saving" ? "Saving..." : "Publish Page"}
          </button>
        </div>
      </div>

      {/* IMPORT MODALS */}
      {showJsonImport && (
        <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-6 mb-8 space-y-4">
          <h2 className="text-purple-400 font-bold uppercase tracking-widest text-xs">Strict JSON Import</h2>
          <textarea value={importString} onChange={(e) => setImportString(e.target.value)} rows="6" className="w-full rounded-xl border border-purple-500/30 bg-black/50 p-4 font-mono text-xs text-zinc-300 focus:outline-none" placeholder="Paste JSON here..."></textarea>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowJsonImport(false)} className="px-4 py-2 text-zinc-400 text-xs font-bold uppercase tracking-widest">Cancel</button>
            <button type="button" onClick={handleJsonImport} className="rounded-lg bg-purple-500 px-6 py-2 text-xs font-bold uppercase tracking-widest text-white">Process & Import</button>
          </div>
        </div>
      )}

      <form className="space-y-12">
        {/* 1. URL & Metadata */}
        <div className="bg-zinc-900 p-6 rounded-[1.5rem] border border-zinc-800 space-y-4 shadow-xl">
          <h2 className="text-[#CCFF00] font-bold uppercase tracking-widest text-xs mb-4">1. URL & SEO Metadata</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5"><label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Internal Title</label><input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-[#CCFF00] outline-none" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} /></div>
            <div className="space-y-1.5 relative"><label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Route / Slug</label><input type="text" className={`w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-400 font-mono outline-none ${isSlugLocked ? 'opacity-60 cursor-not-allowed' : 'focus:border-[#CCFF00]'}`} value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} disabled={isSlugLocked} />{isSlugLocked && <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />}</div>
          </div>
          {pageType === "landing" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Publish Location</label>
                <select
                  value={formData.parentPage?.url === "/technology" ? "/technology" : ""}
                  onChange={(event) => setFormData({ ...formData, parentPage: event.target.value === "/technology" ? technologyParentPage : null })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-white outline-none focus:border-[#CCFF00]"
                >
                  <option value="">Root route: /{formData.slug || "slug"}</option>
                  <option value="/technology">Technology route: /technology/{formData.slug || "slug"}</option>
                </select>
                <div className="rounded-xl border border-[#CCFF00]/20 bg-[#CCFF00]/5 px-3 py-2 text-xs font-mono text-[#CCFF00]">
                  Public URL: {getLandingPageRoute(formData)}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Landing Page Layout Style</label>
                <select
                  value={formData.landingLayout}
                  onChange={(event) => setFormData({ ...formData, landingLayout: event.target.value })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-white outline-none focus:border-[#CCFF00]"
                >
                  <option value="centered">Centered hero (default)</option>
                  <option value="split">Split editorial hero</option>
                  <option value="compact">Compact hero for long headlines</option>
                </select>
                <div className="rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-500">
                  Use compact for long H1 pages. Split gives the landing page a different editorial layout.
                </div>
              </div>
            </div>
          )}
          <div className="space-y-1.5 mt-2"><label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Meta Title</label><input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-bold focus:border-[#CCFF00] outline-none" value={formData.metaTitle} onChange={(e) => setFormData({...formData, metaTitle: e.target.value})} /></div>
          <div className="space-y-1.5"><label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Meta Description</label><textarea rows="2" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-[#CCFF00] outline-none" value={formData.metaDescription} onChange={(e) => setFormData({...formData, metaDescription: e.target.value})} /></div>
        </div>

        {isTechnologyCorePage && (
          <>
            <div className="bg-zinc-900 p-6 rounded-[1.5rem] border border-zinc-800 space-y-6 shadow-xl">
              <h2 className="text-[#CCFF00] font-bold uppercase tracking-widest text-xs">2. Technology Hero</h2>
              <div className="space-y-1.5">
                <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest pl-1">H1 Heading</label>
                <input
                  type="text"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white text-xl font-black focus:border-[#CCFF00] outline-none"
                  value={formData.heroH1}
                  onChange={(e) => setFormData({...formData, heroH1: e.target.value})}
                  placeholder="The Technology Behind Pitchside AI"
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest pl-1">Eyebrow</label>
                  <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-[#CCFF00] outline-none" value={formData.badge} onChange={(e) => setFormData({...formData, badge: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest pl-1">Hero Paragraph</label>
                <LinkableTextarea rows={3} value={formData.intro} onChange={(value) => setFormData({...formData, intro: value})} />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Hero Stat Boxes</h3>
                  <button type="button" onClick={addTechnologyStat} className="text-[#CCFF00] text-[10px] font-bold uppercase tracking-widest">+ Add Stat</button>
                </div>
                {formData.technologyStats.map((stat, index) => (
                  <div key={index} className="grid grid-cols-1 gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4 md:grid-cols-[1fr_2fr_auto]">
                    <input type="text" placeholder="5-a-side trained" className="rounded-xl border border-zinc-800 bg-black p-3 text-white outline-none focus:border-[#CCFF00]" value={stat.value || ""} onChange={(e) => updateTechnologyStat(index, "value", e.target.value)} />
                    <textarea rows={2} placeholder={"Event\nAccuracy"} className="rounded-xl border border-zinc-800 bg-black p-3 text-white outline-none focus:border-[#CCFF00]" value={stat.label || ""} onChange={(e) => updateTechnologyStat(index, "label", e.target.value)} />
                    <button type="button" onClick={() => removeTechnologyStat(index)} className="rounded-xl p-3 text-red-400 hover:bg-red-500 hover:text-white"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900 p-6 rounded-[1.5rem] border border-zinc-800 space-y-5 shadow-xl">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-[#CCFF00] font-bold uppercase tracking-widest text-xs">3. Core Infrastructure Cards</h2>
                <button type="button" onClick={addTechnologyStackItem} className="text-[#CCFF00] text-[10px] font-bold uppercase tracking-widest">+ Add Card</button>
              </div>
              {formData.technologyStack.map((item, index) => (
                <div key={item.id || index} className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Card {index + 1}</span>
                    <button type="button" onClick={() => removeTechnologyStackItem(index)} className="rounded-lg p-2 text-red-400 hover:bg-red-500 hover:text-white"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-[160px_1fr]">
                    <select className="rounded-xl border border-zinc-800 bg-black p-3 text-white outline-none focus:border-[#CCFF00]" value={item.icon || "ai"} onChange={(e) => updateTechnologyStack(index, "icon", e.target.value)}>
                      <option value="vision">Vision icon</option>
                      <option value="ai">AI chip icon</option>
                      <option value="hardware">Shield icon</option>
                      <option value="cloud">Server icon</option>
                    </select>
                    <input type="text" placeholder="Card title" className="rounded-xl border border-zinc-800 bg-black p-3 text-white outline-none focus:border-[#CCFF00]" value={item.title || ""} onChange={(e) => updateTechnologyStack(index, "title", e.target.value)} />
                  </div>
                  <LinkableTextarea rows={3} value={item.desc || ""} onChange={(value) => updateTechnologyStack(index, "desc", value)} />
                </div>
              ))}
            </div>

            <div className="bg-zinc-900 p-6 rounded-[1.5rem] border border-zinc-800 space-y-5 shadow-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-[#CCFF00] font-bold uppercase tracking-widest text-xs">4. EEAT Technology Sections</h2>
                  <p className="mt-2 text-xs text-zinc-500">Edit the long-form Technology page sections, paragraphs, and comparison tables.</p>
                </div>
                <button type="button" onClick={addTechnologySection} className="text-[#CCFF00] text-[10px] font-bold uppercase tracking-widest">+ Add Section</button>
              </div>
              {formData.technologySections.map((section, sectionIndex) => (
                <div key={section.id || sectionIndex} className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Section {sectionIndex + 1}</span>
                    <button type="button" onClick={() => removeTechnologySection(sectionIndex)} className="rounded-lg p-2 text-red-400 hover:bg-red-500 hover:text-white"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <input
                    type="text"
                    placeholder="Section heading"
                    className="w-full rounded-xl border border-zinc-800 bg-black p-3 text-white outline-none focus:border-[#CCFF00]"
                    value={section.h2 || ""}
                    onChange={(e) => updateTechnologySection(sectionIndex, "h2", e.target.value)}
                  />
                  <div className="space-y-3">
                    {(section.content || []).map((paragraph, paragraphIndex) => (
                      <div key={paragraphIndex} className="grid gap-2 md:grid-cols-[1fr_auto]">
                        <LinkableTextarea rows={3} value={paragraph || ""} onChange={(value) => updateTechnologyParagraph(sectionIndex, paragraphIndex, value)} />
                        <button type="button" onClick={() => removeTechnologyParagraph(sectionIndex, paragraphIndex)} className="rounded-xl p-3 text-red-400 hover:bg-red-500 hover:text-white"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addTechnologyParagraph(sectionIndex)} className="text-[#CCFF00] text-[10px] font-bold uppercase tracking-widest">+ Add Paragraph</button>
                  </div>
                  {section.table ? (
                    <div className="space-y-3 rounded-xl border border-[#CCFF00]/20 bg-black/40 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#CCFF00]">Editable Table</span>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => addTechnologyTableRow(sectionIndex)} className="rounded-lg border border-white/10 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10">+ Row</button>
                          <button type="button" onClick={() => removeTechnologyTable(sectionIndex)} className="rounded-lg border border-red-500/30 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-500 hover:text-white">Remove Table</button>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] border-collapse">
                          <thead>
                            <tr>
                              {(section.table.headers || []).map((header, headerIndex) => (
                                <th key={headerIndex} className="border border-zinc-800 p-2">
                                  <input className="w-full bg-zinc-950 p-2 text-xs font-bold uppercase tracking-widest text-white outline-none focus:text-[#CCFF00]" value={header || ""} onChange={(e) => updateTechnologyTableHeader(sectionIndex, headerIndex, e.target.value)} />
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {(section.table.rows || []).map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                  <td key={cellIndex} className="border border-zinc-800 p-2">
                                    <textarea rows={2} className="w-full rounded-lg bg-zinc-950 p-2 text-sm text-zinc-300 outline-none focus:text-white" value={cell || ""} onChange={(e) => updateTechnologyTableCell(sectionIndex, rowIndex, cellIndex, e.target.value)} />
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <button type="button" onClick={() => addTechnologyTable(sectionIndex)} className="text-[#CCFF00] text-[10px] font-bold uppercase tracking-widest">+ Add Table</button>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-[#050505] p-6 rounded-[1.5rem] border border-[#CCFF00]/30 space-y-4 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[#CCFF00]/5 pointer-events-none" />
              <h2 className="text-[#CCFF00] font-bold uppercase tracking-widest text-xs relative z-10">5. Technology CTA</h2>
              <input type="text" placeholder="Headline" className="w-full bg-black border border-white/10 rounded-xl p-3 text-white relative z-10 focus:border-[#CCFF00] outline-none" value={formData.ctaBlock.headline || ""} onChange={(e) => setFormData({...formData, ctaBlock: {...formData.ctaBlock, headline: e.target.value}})} />
              <LinkableTextarea rows={3} value={formData.ctaBlock.description || ""} onChange={(value) => setFormData({...formData, ctaBlock: {...formData.ctaBlock, description: value}})} />
              <div className="flex gap-2 relative z-10">
                <input type="text" placeholder="Button Text" className="w-1/2 bg-black border border-white/10 rounded-xl p-3 text-white focus:border-[#CCFF00] outline-none" value={formData.ctaBlock.buttonText || ""} onChange={(e) => setFormData({...formData, ctaBlock: {...formData.ctaBlock, buttonText: e.target.value}})} />
                <input type="text" placeholder="URL (/contact)" className="w-1/2 bg-black border border-white/10 rounded-xl p-3 text-white focus:border-[#CCFF00] outline-none" value={formData.ctaBlock.buttonUrl || ""} onChange={(e) => setFormData({...formData, ctaBlock: {...formData.ctaBlock, buttonUrl: e.target.value}})} />
              </div>
            </div>
          </>
        )}

        {isEditableContentPage && !isTechnologyCorePage && (
          <>
            {pageType === "landing" && livePreviewPath && (
              <section className="overflow-hidden rounded-[1.5rem] border border-zinc-800 bg-zinc-900 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 px-6 py-4">
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-[#CCFF00]">2. Live page preview</h2>
                    <p className="mt-1 text-xs text-zinc-500">This is the real public route, including the live header and page layout.</p>
                  </div>
                  <a href={livePreviewPath} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-[#CCFF00]/40 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#CCFF00] transition-colors hover:bg-[#CCFF00] hover:text-black">
                    Open full page
                  </a>
                </div>
                <div className="bg-black p-3 md:p-5">
                  <div className="overflow-hidden rounded-xl border border-zinc-700 bg-white shadow-2xl">
                    <iframe
                      key={livePreviewPath}
                      title={`Live preview: ${formData.title || formData.slug}`}
                      src={livePreviewPath}
                      className="h-[720px] w-full bg-white"
                    />
                  </div>
                </div>
              </section>
            )}
            {isArticlePage && (
              <div className="grid gap-4 rounded-[1.5rem] border border-zinc-800 bg-zinc-900 p-6 shadow-xl md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Author</label>
                  <select
                    value={`${formData.authorName}|${formData.authorUrl}`}
                    onChange={(event) => {
                      const selected = authorOptions.find((author) => getAuthorKey(author) === event.target.value);
                      if (selected) setFormData({ ...formData, authorName: selected.name, authorUrl: selected.url });
                    }}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-white outline-none focus:border-[#CCFF00]"
                  >
                    {!authorOptions.some((author) => getAuthorKey(author) === `${formData.authorName}|${formData.authorUrl}`) && (
                      <option value={`${formData.authorName}|${formData.authorUrl}`}>{formData.authorName}</option>
                    )}
                    {authorOptions.map((author) => <option key={author.id || author.url} value={getAuthorKey(author)}>{author.name}</option>)}
                  </select>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">Uploaded</span>
                  <span className="mt-2 block text-sm font-bold text-white">{initialData ? formatContentDate(getPublishedDate(initialData)) : "Set automatically on publish"}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">Last updated</span>
                  <span className="mt-2 block text-sm font-bold text-white">{initialData ? formatContentDate(getUpdatedDate(initialData)) : "Set automatically on publish"}</span>
                </div>
              </div>
            )}
            {pageType === "post" && (
              <div className="rounded-[1.5rem] border border-[#CCFF00]/20 bg-zinc-900 p-6 shadow-xl">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Parent landing page or tool</label>
                  <select
                    value={formData.parentPage?.url || ""}
                    onChange={(event) => {
                      const selected = parentOptions.find((option) => option.url === event.target.value) || null;
                      setFormData({ ...formData, parentPage: selected });
                    }}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-white outline-none focus:border-[#CCFF00]"
                  >
                    <option value="">No parent page</option>
                    <optgroup label="SEO landing pages">
                      {parentOptions.filter((option) => option.type === "landing").map((option) => <option key={option.url} value={option.url}>{option.title}</option>)}
                    </optgroup>
                    <optgroup label="Tools">
                      {parentOptions.filter((option) => option.type === "tool").map((option) => <option key={option.url} value={option.url}>{option.title}</option>)}
                    </optgroup>
                  </select>
                </div>
              </div>
            )}
            {/* Hero & AEO */}
            <div className="bg-zinc-900 p-6 rounded-[1.5rem] border border-zinc-800 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <h2 className="text-[#CCFF00] font-bold uppercase tracking-widest text-xs">{pageType === "landing" && livePreviewPath ? "3." : "2."} Hero Section & TL;DR</h2>
              </div>
              
              {/* HERO BACKGROUND UPLOADER */}
              {!isToolPage && <div className="space-y-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                <label className="text-[#CCFF00] text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                  <Video className="w-4 h-4" /> Hero Background Media (Optional)
                </label>
                <p className="text-zinc-500 text-xs">Upload an MP4 video or Image for the top background. If left blank, it defaults to a premium Royal Greenish-White.</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input type="text" placeholder="Or paste media URL here..." value={formData.heroBackground} onChange={(e) => setFormData({...formData, heroBackground: e.target.value})} className="flex-1 bg-black border border-zinc-800 rounded-xl p-3 text-white focus:border-[#CCFF00] outline-none text-sm" />
                  <label className={`cursor-pointer border px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center shrink-0 ${isUploading ? "bg-white/10 border-white/20 text-zinc-500" : "bg-white/5 border-white/10 hover:bg-white/10 text-white"}`}>
                    {isUploading ? "Uploading..." : "Upload MP4 / Image"}
                    <input type="file" accept="video/mp4,video/webm,image/*" className="hidden" onChange={handleHeroBackgroundUpload} disabled={isUploading} />
                  </label>
                </div>
                {formData.heroBackground && (
                  <div className="mt-2 flex items-center gap-2">
                     <div className="w-16 h-16 rounded-lg overflow-hidden bg-black border border-zinc-700 relative">
                       {formData.heroBackground.includes('.mp4') || formData.heroBackground.includes('video') ? (
                         <video src={formData.heroBackground} className="object-cover w-full h-full" muted />
                       ) : (
                         <NextImage src={formData.heroBackground} className="object-cover w-full h-full" alt="Bg preview" fill unoptimized />
                       )}
                     </div>
                     <button type="button" onClick={() => setFormData({...formData, heroBackground: ""})} className="text-red-500 text-xs hover:underline">Remove Background</button>
                  </div>
                )}
              </div>}

              <div className="space-y-2">
                <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest pl-1">Main Page Headline (H1)</label>
                <input type="text" placeholder="e.g. The Best Veo Alternative..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white text-xl font-black focus:border-[#CCFF00] outline-none" value={formData.heroH1} onChange={(e) => setFormData({...formData, heroH1: e.target.value})} />
              </div>
              {isToolPage && (
                <div className="grid gap-4 rounded-2xl border border-[#CCFF00]/20 bg-black/30 p-4">
                  <div>
                    <h3 className="text-[#CCFF00] text-[10px] uppercase font-bold tracking-widest">Tool Hero Content</h3>
                    <p className="mt-1 text-xs text-zinc-500">Controls the public tools hero copy, CTA labels, and premium preview card. Keep this concise and pre-launch safe.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest pl-1">Eyebrow / Label</label>
                      <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-[#CCFF00] outline-none" value={formData.hero?.eyebrow || formData.badge || ""} onChange={(e) => { setFormData({...formData, badge: e.target.value, hero: { ...(formData.hero || {}), eyebrow: e.target.value }}); }} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest pl-1">Preview Type</label>
                      <select className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-[#CCFF00] outline-none" value={formData.hero?.previewType || ""} onChange={(e) => updateHeroField("previewType", e.target.value)}>
                        <option value="hub">Hub</option>
                        <option value="teams">Teams</option>
                        <option value="formation">Formation</option>
                        <option value="names">Names</option>
                        <option value="table">League table</option>
                        <option value="stats">Stats</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest pl-1">Hero Paragraph</label>
                    <LinkableTextarea rows={3} value={formData.intro} onChange={(value) => setFormData({...formData, intro: value})} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest pl-1">Primary CTA</label>
                      <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-[#CCFF00] outline-none" value={formData.hero?.primaryCtaLabel || ""} onChange={(e) => updateHeroField("primaryCtaLabel", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest pl-1">Secondary CTA</label>
                      <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-[#CCFF00] outline-none" value={formData.hero?.secondaryCtaLabel || ""} onChange={(e) => updateHeroField("secondaryCtaLabel", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest pl-1">Preview Label</label>
                      <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-[#CCFF00] outline-none" value={formData.hero?.previewLabel || ""} onChange={(e) => updateHeroField("previewLabel", e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest pl-1">Preview Data JSON</label>
                    <textarea rows="7" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-300 font-mono text-xs focus:border-[#CCFF00] outline-none" value={formData.hero?.previewDataJson ?? JSON.stringify(formData.hero?.previewData || {}, null, 2)} onChange={(e) => updateHeroPreviewJson(e.target.value)} />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest pl-1">AEO Quick Answer</label>
                <LinkableTextarea value={formData.aeoQuickAnswer} onChange={(value) => setFormData({...formData, aeoQuickAnswer: value})} />
              </div>
              <div className="space-y-2">
                <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest pl-1">TL;DR Summary Points</label>
                {formData.tldrPoints.map((point, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="flex-1"><LinkableTextarea rows={2} value={point} onChange={(value) => handleArrayChange("tldrPoints", i, value)} /></div>
                    <button type="button" onClick={() => removeArrayItem("tldrPoints", i)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem("tldrPoints", "")} className="text-[#CCFF00] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 mt-2 pl-1"><Plus className="w-3 h-3"/> Add TL;DR Point</button>
              </div>
            </div>

            {/* 3. DYNAMIC CONTENT BLOCKS WITH NESTING UI */}
            <div className="space-y-2">
              <h2 className="text-[#CCFF00] font-bold uppercase tracking-widest text-xs mb-6 border-b border-zinc-800 pb-4 pl-2">3. Article Content (Visually Grouped)</h2>
              
              <InlineAdder index={0} />

              {formData.contentBlocks.map((block, index) => {
                const isH2 = block.type === 'h2';
                
                return (
                  <div key={getBlockKey(block, index)}>
                    {/* Visual Styling: H2 gets a big border box. Children get an indented left-border box */}
                    <div className={`group relative p-5 rounded-2xl border transition-all duration-300 ${isH2 ? 'bg-zinc-900/80 border-[#CCFF00]/50 ml-0 mt-8 mb-4 shadow-lg' : 'bg-zinc-900/30 border-zinc-800 ml-8 border-l-4 border-l-zinc-700 hover:border-l-[#CCFF00]'}`}>
                      
                      {/* LABELS */}
                      <div className="flex items-center justify-between mb-3 border-b border-zinc-800/50 pb-2">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#CCFF00]/80">
                          {block.type === 'image' && <><ImageIcon className="w-3 h-3"/> Image Block</>}
                          {block.type === 'h2' && <><Heading2 className="w-4 h-4 text-[#CCFF00]"/> Master Section (H2)</>}
                          {block.type === 'h3' && <><Heading3 className="w-3 h-3"/> H3 Sub-heading</>}
                          {block.type === 'paragraph' && <><AlignLeft className="w-3 h-3"/> Paragraph</>}
                          {block.type === 'list' && <><ListIcon className="w-3 h-3"/> Bullet List</>}
                          {block.type === 'table' && <><TableIcon className="w-3 h-3"/> Matrix Table</>}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button type="button" onClick={() => moveBlock(index, -1)} className="p-1.5 text-zinc-500 hover:text-white bg-zinc-950 rounded border border-zinc-800"><ArrowUp className="w-3 h-3" /></button>
                          <button type="button" onClick={() => moveBlock(index, 1)} className="p-1.5 text-zinc-500 hover:text-white bg-zinc-950 rounded border border-zinc-800"><ArrowDown className="w-3 h-3" /></button>
                          <button type="button" onClick={() => removeContentBlock(block.id)} className="p-1.5 text-red-500 hover:text-white bg-zinc-950 hover:bg-red-500 rounded border border-zinc-800 transition-colors"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      </div>

                      {/* --- INLINE IMAGE BLOCK --- */}
                      {block.type === "image" && (
                        <div className="space-y-4 pr-4">
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input type="url" placeholder="Paste Image URL here..." value={block.content || ""} onChange={(e) => updateBlockContent(block.id, e.target.value)} className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-[#CCFF00] outline-none" />
                            <label className={`cursor-pointer border px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center ${isUploading ? "bg-white/10 border-white/20 text-zinc-500" : "bg-white/5 border-white/10 hover:bg-white/10 text-white"}`}>
                              {isUploading ? "Uploading..." : "Upload File"}
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleBlockImageUpload(e, block.id)} disabled={isUploading} />
                            </label>
                          </div>
                          
                          {block.content && (
                            <div className={`relative inline-block mt-2 border-2 rounded-xl overflow-hidden transition-colors ${formData.primaryImage === block.content ? 'border-[#CCFF00]' : 'border-zinc-800'}`}>
                              <NextImage src={block.content} className="max-h-64 object-contain" alt="Preview" width={640} height={360} unoptimized />
                              {formData.primaryImage === block.content ? (
                                <div className="absolute top-2 left-2 bg-[#CCFF00] text-black text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded shadow-md flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-current" /> Primary Thumbnail
                                </div>
                              ) : (
                                <button type="button" onClick={() => setFormData({...formData, primaryImage: block.content})} className="absolute top-2 left-2 bg-black/80 text-zinc-300 hover:text-[#CCFF00] text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded shadow-md flex items-center gap-1 border border-white/10 backdrop-blur-sm transition-colors">
                                  <Star className="w-3 h-3" /> Set as Primary
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* TEXT BLOCKS */}
                      {block.type === "h2" && <input type="text" placeholder="Main Section Title..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-[#CCFF00] font-black text-xl focus:border-[#CCFF00] outline-none" value={block.content || ""} onChange={(e) => updateBlockContent(block.id, e.target.value)} />}
                      {block.type === "h3" && <input type="text" placeholder="Sub-section Title..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-bold text-lg focus:border-[#CCFF00] outline-none" value={block.content || ""} onChange={(e) => updateBlockContent(block.id, e.target.value)} />}
                      {block.type === "paragraph" && <LinkableTextarea value={block.content || ""} onChange={(value) => updateBlockContent(block.id, value)} />}
                      
                      {/* LIST BLOCK */}
                      {block.type === "list" && (
                        <div className="space-y-2 pr-4">
                          {(block.items || []).map((item, i) => (
                            <div key={i} className="flex gap-2 items-start">
                              <div className="mt-3 w-1.5 h-1.5 rounded-full bg-[#CCFF00] shrink-0" />
                              <div className="flex-1"><LinkableTextarea rows={2} value={item || ""} onChange={(value) => updateListBlockItem(block.id, i, value)} /></div>
                              <button type="button" onClick={() => removeListBlockItem(block.id, i)} className="p-3 bg-red-500/5 text-red-500/50 rounded-xl hover:bg-red-500 hover:text-white transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          ))}
                          <button type="button" onClick={() => addListBlockItem(block.id)} className="text-[#CCFF00] text-[10px] font-bold uppercase tracking-widest mt-2 pl-4">+ Add Item</button>
                        </div>
                      )}

                      {/* TABLE BLOCK */}
                      {block.type === "table" && (
                        <div className="w-full overflow-x-auto pr-4">
                          <div className="flex justify-end items-center mb-4 gap-2">
                              <button type="button" onClick={() => addTableRow(block.id)} className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded text-white hover:bg-white/20">+ Row</button>
                              <button type="button" onClick={() => addTableColumn(block.id)} className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded text-white hover:bg-white/20">+ Column</button>
                          </div>
                          <table className="w-full min-w-[500px] border-collapse bg-black rounded-lg overflow-hidden border border-zinc-800">
                            <thead>
                              <tr className="bg-zinc-900 border-b border-zinc-800">
                                {(block.headers || []).map((hdr, cIdx) => (
                                  <th key={cIdx} className="p-2 relative group/th border-r border-zinc-800 last:border-r-0">
                                    <input type="text" className="w-full bg-transparent text-[11px] font-bold text-zinc-300 uppercase tracking-widest text-center focus:outline-none focus:text-[#CCFF00]" value={hdr || ""} onChange={(e) => updateTableHeader(block.id, cIdx, e.target.value)} />
                                    {block.headers.length > 1 && <button type="button" onClick={() => removeTableColumn(block.id, cIdx)} className="absolute -top-3 right-1 opacity-0 group-hover/th:opacity-100 bg-red-500 text-white rounded-full p-0.5"><Trash2 className="w-3 h-3"/></button>}
                                  </th>
                                ))}
                                <th className="w-10"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {(block.rows || []).map((row, rIdx) => (
                                <tr key={rIdx} className="border-b border-zinc-800 last:border-b-0 hover:bg-white/5 group/tr">
                                  {(row.cells || []).map((cell, cIdx) => (
                                    <td key={cIdx} className="p-2 border-r border-zinc-800 last:border-r-0">
                                      <LinkableTextarea rows={2} value={cell || ""} onChange={(value) => updateTableCell(block.id, rIdx, cIdx, value)} />
                                    </td>
                                  ))}
                                  <td className="w-10 text-center">
                                    {block.rows.length > 1 && <button type="button" onClick={() => removeTableRow(block.id, rIdx)} className="opacity-0 group-hover/tr:opacity-100 text-red-500 hover:scale-110"><Trash2 className="w-4 h-4 mx-auto"/></button>}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                    </div>
                    
                    {/* Inline Adder BELOW the block */}
                    <InlineAdder index={index + 1} />
                  </div>
                );
              })}

              {formData.contentBlocks.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-600 text-xs font-mono uppercase tracking-widest mt-8">
                  Start building your post. Hover here to add a block.
                  <InlineAdder index={0} />
                </div>
              )}
            </div>

            {/* 4. FAQs & CTA */}
            <div className="rounded-[1.5rem] border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-[#CCFF00]">More to read</h2>
                  <p className="mt-2 text-xs text-zinc-500">Select up to four articles or tools. Leave everything unchecked to show automatic suggestions.</p>
                </div>
                <span className="text-xs font-bold text-zinc-500">{formData.moreToRead.length}/4</span>
              </div>
              {formData.moreToRead.length > 0 && (
                <div className="mb-6 space-y-3 rounded-2xl border border-[#CCFF00]/20 bg-black/30 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Selected links — title and URL are editable</p>
                  {formData.moreToRead.map((item, index) => (
                    <div key={`${index}:${item.url}`} className="grid gap-2 rounded-xl border border-zinc-800 bg-zinc-950 p-3 md:grid-cols-[120px_1fr_1fr_auto]">
                      <select
                        value={item.type || "blog"}
                        onChange={(event) => setFormData((current) => ({ ...current, moreToRead: current.moreToRead.map((entry, entryIndex) => entryIndex === index ? { ...entry, type: event.target.value } : entry) }))}
                        className="rounded-lg border border-zinc-800 bg-black p-2 text-xs text-white outline-none focus:border-[#CCFF00]"
                      >
                        <option value="blog">Article</option>
                        <option value="tool">Tool</option>
                      </select>
                      <input
                        type="text"
                        value={item.title || ""}
                        placeholder="Link title"
                        onChange={(event) => setFormData((current) => ({ ...current, moreToRead: current.moreToRead.map((entry, entryIndex) => entryIndex === index ? { ...entry, title: event.target.value } : entry) }))}
                        className="rounded-lg border border-zinc-800 bg-black p-2 text-sm text-white outline-none focus:border-[#CCFF00]"
                      />
                      <input
                        type="text"
                        value={item.url || ""}
                        placeholder="/blog/article-slug"
                        onChange={(event) => setFormData((current) => ({ ...current, moreToRead: current.moreToRead.map((entry, entryIndex) => entryIndex === index ? { ...entry, url: event.target.value } : entry) }))}
                        className="rounded-lg border border-zinc-800 bg-black p-2 font-mono text-xs text-white outline-none focus:border-[#CCFF00]"
                      />
                      <button type="button" onClick={() => setFormData((current) => ({ ...current, moreToRead: current.moreToRead.filter((_, entryIndex) => entryIndex !== index) }))} className="rounded-lg p-2 text-red-400 hover:bg-red-500 hover:text-white" title="Remove link">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="mb-4 flex items-center justify-between gap-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Choose existing content</p>
                <button
                  type="button"
                  disabled={formData.moreToRead.length >= 4}
                  onClick={() => setFormData((current) => ({ ...current, moreToRead: [...current.moreToRead, { type: "blog", title: "", url: "", description: "" }] }))}
                  className="rounded-lg border border-[#CCFF00]/30 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                >
                  + Custom link
                </button>
              </div>
              <div className="grid max-h-72 gap-2 overflow-y-auto pr-2 md:grid-cols-2">
                {recommendationOptions.map((option) => {
                  const selected = formData.moreToRead.some((item) => item.url === option.url);
                  const disabled = !selected && formData.moreToRead.length >= 4;
                  return (
                    <label key={`${option.type}:${option.url}`} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${selected ? "border-[#CCFF00]/50 bg-[#CCFF00]/10" : "border-zinc-800 bg-zinc-950"} ${disabled ? "cursor-not-allowed opacity-40" : "hover:border-zinc-600"}`}>
                      <input
                        type="checkbox"
                        checked={selected}
                        disabled={disabled}
                        onChange={() => setFormData((current) => ({
                          ...current,
                          moreToRead: selected
                            ? current.moreToRead.filter((item) => item.url !== option.url)
                            : [...current.moreToRead, option],
                        }))}
                        className="mt-1 accent-[#CCFF00]"
                      />
                      <span>
                        <span className="block text-[9px] font-bold uppercase tracking-widest text-[#CCFF00]">{option.type}</span>
                        <span className="mt-1 block text-sm font-bold leading-snug text-white">{option.title}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 5. FAQs & CTA */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-zinc-900">
              <div className="bg-zinc-900 p-6 rounded-[1.5rem] border border-zinc-800 space-y-4 shadow-xl">
                <h2 className="text-[#CCFF00] font-bold uppercase tracking-widest text-xs mb-4">4. FAQs (Schema Ready)</h2>
                {formData.faqs.map((faq, i) => (
                  <div key={i} className="space-y-2 p-4 bg-zinc-950 border border-zinc-800 rounded-xl relative">
                    <button type="button" onClick={() => removeArrayItem("faqs", i)} className="absolute top-4 right-4 text-zinc-600 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4"/></button>
                    <input type="text" placeholder="Question" className="w-full bg-transparent border-b border-zinc-800 pb-2 pr-8 text-white font-bold outline-none focus:border-[#CCFF00]" value={faq.question || ""} onChange={(e) => { const newFaqs = [...formData.faqs]; newFaqs[i].question = e.target.value; setFormData({...formData, faqs: newFaqs}); }} />
                    <LinkableTextarea rows={3} value={faq.answer || ""} onChange={(value) => { const newFaqs = [...formData.faqs]; newFaqs[i].answer = value; setFormData({...formData, faqs: newFaqs}); }} />
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem("faqs", { question: "", answer: "" })} className="text-[#CCFF00] text-[10px] font-bold uppercase tracking-widest mt-2 pl-1">+ Add FAQ</button>
              </div>

              <div className="bg-[#050505] p-6 rounded-[1.5rem] border border-[#CCFF00]/30 space-y-4 shadow-2xl relative overflow-hidden h-fit">
                <div className="absolute inset-0 bg-[#CCFF00]/5 pointer-events-none" />
                <h2 className="text-[#CCFF00] font-bold uppercase tracking-widest text-xs mb-4 relative z-10">5. Premium CTA Box</h2>
                <input type="text" placeholder="Headline" className="w-full bg-black border border-white/10 rounded-xl p-3 text-white relative z-10 focus:border-[#CCFF00] outline-none" value={formData.ctaBlock.headline || ""} onChange={(e) => setFormData({...formData, ctaBlock: {...formData.ctaBlock, headline: e.target.value}})} />
                <LinkableTextarea rows={3} value={formData.ctaBlock.description || ""} onChange={(value) => setFormData({...formData, ctaBlock: {...formData.ctaBlock, description: value}})} />
                <div className="flex gap-2 relative z-10">
                  <input type="text" placeholder="Button Text" className="w-1/2 bg-black border border-white/10 rounded-xl p-3 text-white focus:border-[#CCFF00] outline-none" value={formData.ctaBlock.buttonText || ""} onChange={(e) => setFormData({...formData, ctaBlock: {...formData.ctaBlock, buttonText: e.target.value}})} />
                  <input type="text" placeholder="URL (/contact)" className="w-1/2 bg-black border border-white/10 rounded-xl p-3 text-white focus:border-[#CCFF00] outline-none" value={formData.ctaBlock.buttonUrl || ""} onChange={(e) => setFormData({...formData, ctaBlock: {...formData.ctaBlock, buttonUrl: e.target.value}})} />
                </div>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
