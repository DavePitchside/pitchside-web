"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";
import { collection, doc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { Edit2, ExternalLink, Eye, Plus, Save, Trash2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { blockOptions } from "@/lib/cms/blockRegistry";
import { templateOptions } from "@/lib/cms/templateRegistry";
import { normalizeRoutePath, routePathToDocId } from "@/lib/cms/pageSchema";

const emptyPage = {
  title: "",
  routePath: "/new-page",
  slug: "new-page",
  parentPath: null,
  status: "draft",
  pageType: "product",
  templateKey: "pitchside-product-hub",
  templateVersion: 1,
  seo: { metaTitle: "", metaDescription: "", canonical: "/new-page", robots: "index,follow" },
  hero: { eyebrow: "", h1: "", intro: "", media: "", mediaAlt: "", primaryCta: {}, secondaryCta: {} },
  blocks: [],
  author: {},
  reviewer: {},
  schemaConfig: {},
  designOptions: {
    heroVariant: "split",
    sectionDensity: "comfortable",
    cardStyle: "offset-shadow",
    backgroundPattern: "grid",
    accentMode: "neon",
    contentWidth: "wide",
    showStatusNotice: true,
  },
};

function routeToSlug(routePath) {
  if (routePath === "/") return "home";
  return routePath.split("/").filter(Boolean).at(-1) || "home";
}

function newBlock(type) {
  const id = `${type}-${Date.now()}`;
  if (type === "heading") return { id, type, level: 2, text: "New heading" };
  if (type === "richText") return { id, type, html: "New paragraph." };
  if (type === "featureGrid") return { id, type, title: "Feature grid", items: [{ title: "Feature", body: "Describe the feature." }] };
  if (type === "pitchDiagram") return {
    id,
    type,
    title: "One-phone setup",
    description: "Example camera position for a compact small-sided pitch.",
    pitchFormat: "5-a-side",
    variant: "one-phone-sideline",
    cameras: [{ id: "camera-1", label: "Phone 1", x: 50, y: 94, rotation: 270, coverageAngle: 80, coverageDepth: 75 }],
    blindSpots: [],
    markers: [],
    notes: ["Example only. Confirm venue rules and safe mounting points."],
    caption: "Example only. Final placement depends on the pitch and safe mounting points.",
  };
  if (type === "affiliateProductCards") return { id, type, title: "Mount options", disclosure: "Some links may be affiliate links.", items: [] };
  if (type === "faq") return { id, type, items: [{ question: "Question?", answer: "Answer." }] };
  if (type === "callToAction") return { id, type, headline: "Call to action", description: "", buttonText: "Contact us", buttonUrl: "/contact" };
  return { id, type };
}

function validatePage(page) {
  const issues = [];
  if (!page.title.trim()) issues.push("Add an internal title.");
  if (!page.routePath.startsWith("/")) issues.push("Route must start with /.");
  if (!page.seo.metaTitle.trim()) issues.push("Add an SEO meta title.");
  if (!page.seo.metaDescription.trim()) issues.push("Add an SEO meta description.");
  if (!page.hero.h1.trim()) issues.push("Add exactly one hero H1.");
  if ((page.blocks || []).some((block) => block.type === "image" && !block.alt)) issues.push("Image blocks need alt text.");
  return issues;
}

function Field({ label, children }) {
  return <label className="block space-y-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-500">{label}{children}</label>;
}

function TextInput(props) {
  return <input {...props} className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm normal-case tracking-normal text-white outline-none focus:border-[#CCFF00]" />;
}

function TextArea(props) {
  return <textarea {...props} className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm normal-case tracking-normal text-white outline-none focus:border-[#CCFF00]" />;
}

export default function CmsPageManager() {
  const [pages, setPages] = useState([]);
  const [editingPage, setEditingPage] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [previewSize, setPreviewSize] = useState("desktop");
  const [selectedBlockType, setSelectedBlockType] = useState("richText");
  const validationIssues = useMemo(() => editingPage ? validatePage(editingPage) : [], [editingPage]);

  const loadPages = async () => {
    const snapshot = await getDocs(collection(db, "pages"));
    setPages(snapshot.docs.map((pageDoc) => ({ id: pageDoc.id, ...pageDoc.data() })).sort((a, b) => String(a.routePath || a.slug || "").localeCompare(String(b.routePath || b.slug || ""))));
  };

  useEffect(() => {
    loadPages().catch((loadError) => setError(loadError.message));
  }, []);

  const startCreate = () => setEditingPage({ ...emptyPage });
  const startEdit = (page) => setEditingPage({
    ...emptyPage,
    ...page,
    routePath: normalizeRoutePath(page.routePath || (page.parentPage?.url === "/technology" ? `/technology/${page.slug}` : `/${page.slug || ""}`)),
    seo: { ...emptyPage.seo, ...(page.seo || {}), metaTitle: page.seo?.metaTitle || page.metaTitle || "", metaDescription: page.seo?.metaDescription || page.metaDescription || "" },
    hero: { ...emptyPage.hero, ...(page.hero || {}), h1: page.hero?.h1 || page.heroH1 || page.title || "", intro: page.hero?.intro || page.intro || "" },
    blocks: page.blocks || page.contentBlocks || [],
  });

  const updatePage = (patch) => setEditingPage((current) => ({ ...current, ...patch }));
  const updateSeo = (patch) => setEditingPage((current) => ({ ...current, seo: { ...(current.seo || {}), ...patch } }));
  const updateHero = (patch) => setEditingPage((current) => ({ ...current, hero: { ...(current.hero || {}), ...patch } }));
  const updateDesign = (field, value) => setEditingPage((current) => ({ ...current, designOptions: { ...(current.designOptions || {}), [field]: value } }));
  const updateBlock = (index, patch) => setEditingPage((current) => ({ ...current, blocks: current.blocks.map((block, blockIndex) => blockIndex === index ? { ...block, ...patch } : block) }));
  const removeBlock = (index) => {
    if (!window.confirm("Delete this block?")) return;
    setEditingPage((current) => ({ ...current, blocks: current.blocks.filter((_, blockIndex) => blockIndex !== index) }));
  };
  const moveBlock = (index, delta) => setEditingPage((current) => {
    const blocks = [...current.blocks];
    const target = index + delta;
    if (target < 0 || target >= blocks.length) return current;
    [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
    return { ...current, blocks };
  });

  const savePage = async (publish = false) => {
    if (!editingPage) return;
    setStatus("saving");
    setError("");
    const routePath = normalizeRoutePath(editingPage.routePath);
    const pageToSave = {
      ...editingPage,
      routePath,
      slug: routeToSlug(routePath),
      parentPath: routePath === "/" ? null : `/${routePath.split("/").filter(Boolean).slice(0, -1).join("/")}` || null,
      status: publish ? "published" : editingPage.status || "draft",
      seo: { ...(editingPage.seo || {}), canonical: normalizeRoutePath(editingPage.seo?.canonical || routePath) },
    };
    const issues = validatePage(pageToSave);
    if (publish && issues.length) {
      setStatus("error");
      setError(issues.join(" "));
      return;
    }

    const duplicateSnapshot = await getDocs(query(collection(db, "pages"), where("routePath", "==", routePath)));
    const duplicateIds = duplicateSnapshot.docs.map((item) => item.id).filter((id) => id !== editingPage.id);
    if (duplicateIds.length) {
      setStatus("error");
      setError(`Duplicate routePath exists in pages: ${duplicateIds.join(", ")}`);
      return;
    }

    const docId = editingPage.id || routePathToDocId(routePath);
    await setDoc(doc(db, "pages", docId), {
      ...pageToSave,
      updatedAt: serverTimestamp(),
      ...(publish ? { publishedAt: pageToSave.publishedAt || serverTimestamp() } : {}),
    }, { merge: true });

    setStatus("success");
    setEditingPage(null);
    await loadPages();
  };

  if (editingPage) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={() => setEditingPage(null)} className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white">Back to all pages</button>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setPreviewSize(previewSize === "desktop" ? "mobile" : "desktop")} className="rounded-xl border border-white/10 px-4 py-3 text-xs font-black uppercase tracking-widest text-zinc-300"><Eye className="mr-2 inline h-4 w-4" /> {previewSize} preview</button>
            <button type="button" onClick={() => savePage(false)} className="rounded-xl border border-white/10 px-4 py-3 text-xs font-black uppercase tracking-widest text-zinc-300"><Save className="mr-2 inline h-4 w-4" /> Save draft</button>
            <button type="button" onClick={() => savePage(true)} className="rounded-xl bg-[#CCFF00] px-4 py-3 text-xs font-black uppercase tracking-widest text-black">Publish</button>
          </div>
        </div>

        {error && <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm font-bold text-red-300">{error}</div>}
        {validationIssues.length > 0 && <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-xs font-bold text-yellow-200">{validationIssues.join(" ")}</div>}

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <section className="space-y-4 rounded-2xl border border-white/10 bg-[#0A0A0A] p-6">
            <h2 className="text-xl font-black uppercase text-white">Page settings</h2>
            <Field label="Internal title"><TextInput value={editingPage.title} onChange={(event) => updatePage({ title: event.target.value })} /></Field>
            <Field label="Live route"><TextInput value={editingPage.routePath} onChange={(event) => {
              const routePath = normalizeRoutePath(event.target.value);
              updatePage({ routePath, slug: routeToSlug(routePath) });
              updateSeo({ canonical: routePath });
            }} /></Field>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Page type"><TextInput value={editingPage.pageType} onChange={(event) => updatePage({ pageType: event.target.value })} /></Field>
              <Field label="Status"><select value={editingPage.status} onChange={(event) => updatePage({ status: event.target.value })} className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-white"><option value="draft">Draft</option><option value="published">Published</option><option value="unpublished">Unpublished</option></select></Field>
            </div>
            <Field label="Template"><select value={editingPage.templateKey} onChange={(event) => updatePage({ templateKey: event.target.value })} className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-white">{templateOptions.map((template) => <option key={template.templateKey} value={template.templateKey}>{template.label}</option>)}</select></Field>
          </section>

          <section className="space-y-4 rounded-2xl border border-white/10 bg-[#0A0A0A] p-6">
            <h2 className="text-xl font-black uppercase text-white">SEO and hero</h2>
            <Field label="Meta title"><TextInput value={editingPage.seo?.metaTitle || ""} onChange={(event) => updateSeo({ metaTitle: event.target.value })} /></Field>
            <Field label="Meta description"><TextArea rows={3} value={editingPage.seo?.metaDescription || ""} onChange={(event) => updateSeo({ metaDescription: event.target.value })} /></Field>
            <Field label="H1"><TextInput value={editingPage.hero?.h1 || ""} onChange={(event) => updateHero({ h1: event.target.value })} /></Field>
            <Field label="Intro"><TextArea rows={3} value={editingPage.hero?.intro || ""} onChange={(event) => updateHero({ intro: event.target.value })} /></Field>
          </section>
        </div>

        <section className="space-y-4 rounded-2xl border border-white/10 bg-[#0A0A0A] p-6">
          <h2 className="text-xl font-black uppercase text-white">Design options</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {["heroVariant", "sectionDensity", "cardStyle", "backgroundPattern", "accentMode", "contentWidth"].map((field) => (
              <Field key={field} label={field}><TextInput value={editingPage.designOptions?.[field] || ""} onChange={(event) => updateDesign(field, event.target.value)} /></Field>
            ))}
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-white/10 bg-[#0A0A0A] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-black uppercase text-white">Blocks</h2>
            <div className="flex gap-2">
              <select value={selectedBlockType} onChange={(event) => setSelectedBlockType(event.target.value)} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-xs text-white">{blockOptions.map((block) => <option key={block.type} value={block.type}>{block.label}</option>)}</select>
              <button type="button" onClick={() => updatePage({ blocks: [...editingPage.blocks, newBlock(selectedBlockType)] })} className="rounded-xl bg-[#CCFF00] px-4 py-3 text-xs font-black uppercase tracking-widest text-black"><Plus className="mr-2 inline h-4 w-4" /> Add</button>
            </div>
          </div>
          <div className="space-y-3">
            {editingPage.blocks.map((block, index) => (
              <div key={block.id || index} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-black uppercase tracking-widest text-[#CCFF00]">{block.type}</span>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => moveBlock(index, -1)} className="text-xs text-zinc-400">Up</button>
                    <button type="button" onClick={() => moveBlock(index, 1)} className="text-xs text-zinc-400">Down</button>
                    <button type="button" onClick={() => updatePage({ blocks: [...editingPage.blocks.slice(0, index + 1), { ...block, id: `${block.id}-copy-${Date.now()}` }, ...editingPage.blocks.slice(index + 1)] })} className="text-xs text-zinc-400">Duplicate</button>
                    <button type="button" onClick={() => removeBlock(index)} className="text-xs text-red-400"><Trash2 className="inline h-4 w-4" /></button>
                  </div>
                </div>
                <TextArea rows={5} value={JSON.stringify(block, null, 2)} onChange={(event) => {
                  try {
                    updateBlock(index, JSON.parse(event.target.value));
                  } catch {}
                }} />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-6">
          <h2 className="mb-3 text-xl font-black uppercase text-white">Preview</h2>
          <div className={`${previewSize === "mobile" ? "max-w-sm" : "max-w-full"} rounded-xl border border-white/10 bg-zinc-950 p-4 text-zinc-300`}>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#CCFF00]">{editingPage.templateKey}</p>
            <p className="mt-3 text-3xl font-black uppercase text-white">{editingPage.hero?.h1 || editingPage.title}</p>
            <p className="mt-3 text-sm text-zinc-400">{editingPage.hero?.intro}</p>
            <p className="mt-4 text-xs text-zinc-500">{editingPage.blocks.length} block(s)</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase text-white">All Pages</h2>
          <p className="mt-2 text-sm text-zinc-500">RoutePath-first CMS pages. Blog posts and tool algorithms stay in their existing systems.</p>
        </div>
        <button type="button" onClick={startCreate} className="rounded-xl bg-[#CCFF00] px-5 py-3 text-xs font-black uppercase tracking-widest text-black"><Plus className="mr-2 inline h-4 w-4" /> Create page</button>
      </div>
      {status === "success" && <div className="rounded-xl border border-[#CCFF00]/30 bg-[#CCFF00]/10 p-4 text-sm font-bold text-[#CCFF00]">Saved.</div>}
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0A0A0A]">
        <table className="w-full min-w-[960px] text-left">
          <thead className="border-b border-white/10 bg-black/40 text-[10px] font-black uppercase tracking-widest text-zinc-500">
            <tr><th className="p-4">Title</th><th className="p-4">Route</th><th className="p-4">Type</th><th className="p-4">Template</th><th className="p-4">Status</th><th className="p-4">Updated</th><th className="p-4 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {pages.map((page) => {
              const route = normalizeRoutePath(page.routePath || (page.parentPage?.url === "/technology" ? `/technology/${page.slug}` : `/${page.slug || ""}`));
              return (
                <tr key={page.id} className="border-b border-white/5">
                  <td className="p-4 text-sm font-bold text-white">{page.title || page.heroH1 || "Untitled"}</td>
                  <td className="p-4 font-mono text-xs text-[#CCFF00]">{route}</td>
                  <td className="p-4 text-xs text-zinc-400">{page.pageType || "legacy"}</td>
                  <td className="p-4 text-xs text-zinc-400">{page.templateKey || "legacy"}</td>
                  <td className="p-4 text-xs text-zinc-400">{page.status || (page.published === false ? "draft" : "published")}</td>
                  <td className="p-4 text-xs text-zinc-500">{page.updatedAt?.seconds ? new Date(page.updatedAt.seconds * 1000).toLocaleDateString() : ""}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <a href={route} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-white/10 p-2 text-zinc-400 hover:text-[#CCFF00]"><ExternalLink className="h-4 w-4" /></a>
                      <button type="button" onClick={() => startEdit(page)} className="rounded-lg border border-white/10 p-2 text-zinc-400 hover:text-[#CCFF00]"><Edit2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
