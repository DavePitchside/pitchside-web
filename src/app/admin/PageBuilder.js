"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Save, Plus, Trash2, Lock, ShieldAlert, Heading2, Heading3, AlignLeft, List as ListIcon, ArrowUp, ArrowDown, Table as TableIcon, Code, FileText, Image as ImageIcon, Star, UploadCloud, FileJson, Video } from "lucide-react";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase"; // Ensure storage is exported from your firebase.js config
import { createImageThumbnailBlob } from "@/lib/imageThumbnails";

const cleanStorageFileName = (fileName) => fileName.replace(/[^a-zA-Z0-9.]/g, '');
const defaultCtaBlock = { headline: "", description: "", buttonText: "", buttonUrl: "" };

const getBlockKey = (block, index) => block.id || `${block.type || "block"}-${index}`;

const normalizeContentBlocks = (blocks = []) => {
  const seenIds = new Set();

  return blocks.map((block, index) => {
    const fallbackId = `${block.type || "block"}-${index}`;
    const baseId = block.id || fallbackId;
    const id = seenIds.has(baseId) ? `${baseId}-${index}` : baseId;
    seenIds.add(id);

    if (block.type === "list") {
      return { ...block, id, items: block.items || [] };
    }

    if (block.type === "table") {
      return { ...block, id, headers: block.headers || [], rows: block.rows || [] };
    }

    return { ...block, id, content: block.content || "" };
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
  const [showHtmlImport, setShowHtmlImport] = useState(false);
  const [showJsonImport, setShowJsonImport] = useState(false);
  const [importString, setImportString] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef(null);
  const isStaticCorePage = pageType === "core";
  const isToolPage = pageType === "tool";
  const isSlugLocked = isStaticCorePage || isToolPage;

  // INITIALIZE STATE
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    metaTitle: initialData?.metaTitle || "",
    slug: initialData?.slug || "",
    metaDescription: initialData?.metaDescription || "",
    intro: initialData?.intro || "",
    badge: initialData?.badge || "",
    llmDescription: initialData?.llmDescription || "",
    thumbnail: initialData?.thumbnail || "",
    primaryImage: initialData?.primaryImage || "", 
    
    heroBackground: initialData?.heroBackground || "",

    heroH1: initialData?.heroH1 || "",
    hero: initialData?.hero || {
      eyebrow: "",
      primaryCtaLabel: "",
      secondaryCtaLabel: "",
      previewLabel: "",
      previewType: "",
      previewData: {},
    },
    tldrPoints: initialData?.tldrPoints || [""], 
    aeoQuickAnswer: initialData?.aeoQuickAnswer || "",
    contentBlocks: initialData?.contentBlocks?.length ? normalizeContentBlocks(initialData.contentBlocks) : [],
    ctaBlock: { ...defaultCtaBlock, ...(initialData?.ctaBlock || {}) },
    faqs: initialData?.faqs || [{ question: "", answer: "" }]
  });

  const DRAFT_KEY = `pitchside_draft_${collectionName}`;

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
  }, []);

  useEffect(() => {
    if (!initialData && formData.title) {
      const timeout = setTimeout(() => {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [formData, initialData]);


  // --- JSON IMPORT ENGINE ---
  const handleJsonImport = () => {
    try {
      const parsedData = JSON.parse(importString);
      setFormData(prev => ({
        ...prev,
        ...parsedData,
        contentBlocks: parsedData.contentBlocks ? normalizeContentBlocks(parsedData.contentBlocks) : prev.contentBlocks,
        ctaBlock: { ...defaultCtaBlock, ...(prev.ctaBlock || {}), ...(parsedData.ctaBlock || {}) },
      }));
      setImportString("");
      setShowJsonImport(false);
      alert("JSON Imported Successfully!");
    } catch (e) {
      alert("Invalid JSON format. Please check your syntax.");
    }
  };


  // --- HTML / DOCX ENGINE ---
  const processHtmlToBlocks = (rawHtml) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawHtml, 'text/html');
      
      const newMetaTitle = doc.querySelector('title')?.innerText || null;
      const newMetaDesc = doc.querySelector('meta[name="description"]')?.content || null;
      const newH1 = doc.querySelector('h1')?.innerText || null;

      const newBlocks = [];
      const elements = doc.body.querySelectorAll('h2, h3, p, ul, table, img');
      
      elements.forEach((el, index) => {
        const id = Date.now().toString() + index;
        if (el.tagName === 'H2') newBlocks.push({ id, type: 'h2', content: el.innerText.replace(/Section \d+/g, '').trim() });
        else if (el.tagName === 'H3') newBlocks.push({ id, type: 'h3', content: el.innerText.trim() });
        else if (el.tagName === 'P') { if (el.innerText.trim()) newBlocks.push({ id, type: 'paragraph', content: el.innerHTML.trim() }); }
        else if (el.tagName === 'UL') {
          const items = Array.from(el.querySelectorAll('li')).map(li => li.innerHTML.trim());
          if (items.length > 0) newBlocks.push({ id, type: 'list', items });
        }
        else if (el.tagName === 'IMG') { if (el.src) newBlocks.push({ id, type: 'image', content: el.src }); }
        else if (el.tagName === 'TABLE') {
          const headers = Array.from(el.querySelectorAll('th')).map(th => th.innerText.trim());
          const rows = Array.from(el.querySelectorAll('tbody tr')).map(tr => ({ cells: Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim()) }));
          if (headers.length > 0 || rows.length > 0) newBlocks.push({ id, type: 'table', headers: headers.length > 0 ? headers : ["Col 1", "Col 2"], rows: rows });
        }
      });

      setFormData(prev => ({
        ...prev,
        metaTitle: newMetaTitle || prev.metaTitle,
        metaDescription: newMetaDesc || prev.metaDescription,
        heroH1: newH1 || prev.heroH1,
        contentBlocks: [...prev.contentBlocks, ...newBlocks]
      }));
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleHtmlImport = () => {
    if (processHtmlToBlocks(importString)) {
      setImportString(""); setShowHtmlImport(false); alert("HTML Parsed Successfully!");
    } else alert("Failed to parse HTML.");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setStatus("saving"); 
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target.result;
        const mammoth = await import("mammoth/mammoth.browser");
        const htmlResult = await mammoth.convertToHtml({ arrayBuffer });
        if (processHtmlToBlocks(htmlResult.value)) alert(".DOCX Parsed Successfully!");
        else alert("Failed to parse .DOCX file.");
        setStatus("idle");
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      alert("Error reading file.");
      setStatus("idle");
    }
    e.target.value = null;
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
        primaryImage: prev.primaryImage || publicUrl,
        thumbnail: prev.thumbnail || thumbnailUrl || publicUrl,
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
        thumbnail: thumbnailUrl || prev.thumbnail,
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
      if (cleanData.hero?.previewDataJson !== undefined) delete cleanData.hero.previewDataJson;
      if (isToolPage) {
        const { setDoc } = await import("firebase/firestore");
        await setDoc(doc(db, "tools", initialData.id), { ...cleanData, updatedAt: serverTimestamp() }, { merge: true });
      }
      else if (initialData?.id && !isStaticCorePage) await updateDoc(doc(db, collectionName, initialData.id), { ...cleanData, updatedAt: serverTimestamp() });
      else if (isStaticCorePage) await updateDoc(doc(db, "pages", initialData.id), { ...cleanData, updatedAt: serverTimestamp() }).catch(async () => { const { setDoc } = await import("firebase/firestore"); await setDoc(doc(db, "pages", initialData.id), { ...cleanData, createdAt: serverTimestamp() }); });
      else await addDoc(collection(db, collectionName), { ...cleanData, date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), createdAt: serverTimestamp() });
      
      localStorage.removeItem(DRAFT_KEY);
      setStatus("success");
      onBack();
    } catch (error) {
      console.error(error);
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
        <button type="button" onClick={() => insertContentBlock(index, "image")} className="p-2 text-zinc-500 hover:text-[#CCFF00] hover:bg-zinc-900 rounded-lg transition-colors"><ImageIcon className="w-4 h-4" /></button>
        <button type="button" onClick={() => insertContentBlock(index, "table")} className="p-2 text-zinc-500 hover:text-[#CCFF00] hover:bg-zinc-900 rounded-lg transition-colors"><TableIcon className="w-4 h-4" /></button>
      </div>
    </div>
  );

  return (
    <div className="w-full pb-32">
      <input type="file" accept=".docx" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />

      {/* TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-zinc-900 pb-8 gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-zinc-900 rounded-full hover:bg-[#CCFF00] hover:text-black transition-colors"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">
              {isStaticCorePage ? "System Route Meta" : isToolPage ? "Tool Content Editor" : pageType === "post" ? "Blog Editor" : "SEO Landing Page Builder"}
            </h1>
            {!initialData && <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mt-1">Auto-saving draft locally...</p>}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {!isStaticCorePage && (
            <>
              <button type="button" onClick={() => { setShowJsonImport(true); setShowHtmlImport(false); setImportString(""); }} className="flex items-center gap-2 bg-purple-500/10 text-purple-400 border border-purple-500/30 px-4 py-3 font-bold uppercase tracking-widest text-xs hover:bg-purple-500 hover:text-white transition-all rounded-xl">
                <FileJson className="w-4 h-4" /> Import JSON
              </button>
              <button type="button" onClick={() => fileInputRef.current.click()} className="flex items-center gap-2 bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/30 px-4 py-3 font-bold uppercase tracking-widest text-xs hover:bg-[#CCFF00] hover:text-black transition-all rounded-xl">
                <FileText className="w-4 h-4" /> Import .DOCX
              </button>
              <button type="button" onClick={() => { setShowHtmlImport(true); setShowJsonImport(false); setImportString(""); }} className="flex items-center gap-2 bg-zinc-900 text-white border border-zinc-700 px-4 py-3 font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all rounded-xl">
                <Code className="w-4 h-4" /> Import HTML
              </button>
            </>
          )}
          <button onClick={handleSubmit} disabled={status === "saving" || isUploading} className="flex items-center justify-center gap-2 bg-[#CCFF00] text-black px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-white transition-all shadow-[0_0_20px_rgba(204,255,0,0.15)] rounded-xl active:scale-95 disabled:opacity-50">
            <Save className="w-4 h-4" /> {status === "saving" ? "Saving..." : "Publish Page"}
          </button>
        </div>
      </div>

      {/* IMPORT MODALS */}
      {(showHtmlImport || showJsonImport) && (
        <div className={`bg-${showHtmlImport ? 'blue' : 'purple'}-500/10 border border-${showHtmlImport ? 'blue' : 'purple'}-500/30 p-6 rounded-2xl mb-8 space-y-4`}>
          <h2 className={`text-${showHtmlImport ? 'blue' : 'purple'}-400 font-bold uppercase tracking-widest text-xs`}>
            {showHtmlImport ? 'HTML Auto-Converter' : 'Strict JSON Import'}
          </h2>
          <textarea value={importString} onChange={(e) => setImportString(e.target.value)} rows="6" className={`w-full bg-black/50 border border-${showHtmlImport ? 'blue' : 'purple'}-500/30 rounded-xl p-4 text-zinc-300 font-mono text-xs focus:outline-none`} placeholder="Paste code here..."></textarea>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => { setShowHtmlImport(false); setShowJsonImport(false); }} className="px-4 py-2 text-zinc-400 text-xs font-bold uppercase tracking-widest">Cancel</button>
            <button type="button" onClick={showHtmlImport ? handleHtmlImport : handleJsonImport} className={`bg-${showHtmlImport ? 'blue' : 'purple'}-500 text-white px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest`}>Process & Import</button>
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
          <div className="space-y-1.5 mt-2"><label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Meta Title</label><input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-bold focus:border-[#CCFF00] outline-none" value={formData.metaTitle} onChange={(e) => setFormData({...formData, metaTitle: e.target.value})} /></div>
          <div className="space-y-1.5"><label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Meta Description</label><textarea rows="2" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-[#CCFF00] outline-none" value={formData.metaDescription} onChange={(e) => setFormData({...formData, metaDescription: e.target.value})} /></div>
        </div>

        {!isStaticCorePage && (
          <>
            {/* 2. Hero & AEO */}
            <div className="bg-zinc-900 p-6 rounded-[1.5rem] border border-zinc-800 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <h2 className="text-[#CCFF00] font-bold uppercase tracking-widest text-xs">2. Hero Section & TL;DR</h2>
              </div>
              
              {/* HERO BACKGROUND UPLOADER */}
              <div className="space-y-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
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
                         <img src={formData.heroBackground} className="object-cover w-full h-full" alt="Bg preview" />
                       )}
                     </div>
                     <button type="button" onClick={() => setFormData({...formData, heroBackground: ""})} className="text-red-500 text-xs hover:underline">Remove Background</button>
                  </div>
                )}
              </div>

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
                    <textarea rows="3" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-[#CCFF00] outline-none" value={formData.intro} onChange={(e) => setFormData({...formData, intro: e.target.value})} />
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
                <textarea rows="3" placeholder="Direct Google Answer..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white border-l-4 border-l-[#CCFF00] focus:border-[#CCFF00] outline-none" value={formData.aeoQuickAnswer} onChange={(e) => setFormData({...formData, aeoQuickAnswer: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest pl-1">TL;DR Summary Points</label>
                {formData.tldrPoints.map((point, i) => (
                  <div key={i} className="flex gap-2">
                    <input type="text" className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-[#CCFF00] outline-none" value={point} onChange={(e) => handleArrayChange("tldrPoints", i, e.target.value)} />
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
                              <img src={block.content} className="max-h-64 object-contain" alt="Preview" />
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
                      {block.type === "paragraph" && <textarea placeholder="Write your content here..." rows="4" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-300 focus:border-[#CCFF00] outline-none leading-relaxed" value={block.content || ""} onChange={(e) => updateBlockContent(block.id, e.target.value)} />}
                      
                      {/* LIST BLOCK */}
                      {block.type === "list" && (
                        <div className="space-y-2 pr-4">
                          {(block.items || []).map((item, i) => (
                            <div key={i} className="flex gap-2 items-start">
                              <div className="mt-3 w-1.5 h-1.5 rounded-full bg-[#CCFF00] shrink-0" />
                              <input type="text" className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-[#CCFF00] outline-none" value={item || ""} onChange={(e) => updateListBlockItem(block.id, i, e.target.value)} />
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
                                      <input type="text" className="w-full bg-transparent text-sm text-zinc-400 text-center focus:outline-none focus:text-white" value={cell || ""} onChange={(e) => updateTableCell(block.id, rIdx, cIdx, e.target.value)} />
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-zinc-900">
              <div className="bg-zinc-900 p-6 rounded-[1.5rem] border border-zinc-800 space-y-4 shadow-xl">
                <h2 className="text-[#CCFF00] font-bold uppercase tracking-widest text-xs mb-4">4. FAQs (Schema Ready)</h2>
                {formData.faqs.map((faq, i) => (
                  <div key={i} className="space-y-2 p-4 bg-zinc-950 border border-zinc-800 rounded-xl relative">
                    <button type="button" onClick={() => removeArrayItem("faqs", i)} className="absolute top-4 right-4 text-zinc-600 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4"/></button>
                    <input type="text" placeholder="Question" className="w-full bg-transparent border-b border-zinc-800 pb-2 pr-8 text-white font-bold outline-none focus:border-[#CCFF00]" value={faq.question || ""} onChange={(e) => { const newFaqs = [...formData.faqs]; newFaqs[i].question = e.target.value; setFormData({...formData, faqs: newFaqs}); }} />
                    <textarea rows="2" placeholder="Answer" className="w-full bg-transparent pt-2 text-zinc-400 outline-none focus:text-white" value={faq.answer || ""} onChange={(e) => { const newFaqs = [...formData.faqs]; newFaqs[i].answer = e.target.value; setFormData({...formData, faqs: newFaqs}); }} />
                  </div>
                ))}
                <button type="button" onClick={() => addArrayItem("faqs", { question: "", answer: "" })} className="text-[#CCFF00] text-[10px] font-bold uppercase tracking-widest mt-2 pl-1">+ Add FAQ</button>
              </div>

              <div className="bg-[#050505] p-6 rounded-[1.5rem] border border-[#CCFF00]/30 space-y-4 shadow-2xl relative overflow-hidden h-fit">
                <div className="absolute inset-0 bg-[#CCFF00]/5 pointer-events-none" />
                <h2 className="text-[#CCFF00] font-bold uppercase tracking-widest text-xs mb-4 relative z-10">5. Premium CTA Box</h2>
                <input type="text" placeholder="Headline" className="w-full bg-black border border-white/10 rounded-xl p-3 text-white relative z-10 focus:border-[#CCFF00] outline-none" value={formData.ctaBlock.headline || ""} onChange={(e) => setFormData({...formData, ctaBlock: {...formData.ctaBlock, headline: e.target.value}})} />
                <textarea placeholder="Description" className="w-full bg-black border border-white/10 rounded-xl p-3 text-white relative z-10 focus:border-[#CCFF00] outline-none" value={formData.ctaBlock.description || ""} onChange={(e) => setFormData({...formData, ctaBlock: {...formData.ctaBlock, description: e.target.value}})} />
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
