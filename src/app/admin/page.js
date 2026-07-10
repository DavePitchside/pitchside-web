"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Database, Users, FileText, LayoutTemplate, Activity, Lock, LogOut, Link as LinkIcon, Save, CheckCircle2, UserX, Target, Wrench, ExternalLink, Cpu } from "lucide-react";
import { collection, getDocs, deleteDoc, doc, query, orderBy, setDoc, getDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/lib/firebase"; 
import PageBuilder from "./PageBuilder"; 
import useLenis from "@/lib/useLenis";
import { mergeToolContent, mergeToolsHubContent, tools, toolsHub } from "@/lib/tools";
import { formatContentDate, getPublishedDate, getUpdatedDate } from "@/lib/contentMeta";
import { isDefaultPageImage } from "@/lib/pageImages";

// --- FIXED CORE PAGES ---
const CORE_STATIC_PAGES = [
  { id: "home", title: "Home Page", slug: "/" },
  { id: "technology", title: "Technology", slug: "technology" },
  { id: "about", title: "About Us", slug: "about" },
  { id: "blog", title: "Blog Main Page", slug: "blog" },
  { id: "contact", title: "Contact", slug: "contact" },
  { id: "account-deletion", title: "Account Deletion", slug: "account-deletion" },
  { id: "privacy", title: "Privacy Policy", slug: "privacy" },
  { id: "terms", title: "Terms of Service", slug: "terms" },
  { id: "cookies", title: "Cookie Policy", slug: "cookies" },
];

const TECHNOLOGY_PAGE_DEFAULTS = {
  id: "technology",
  title: "Technology",
  slug: "technology",
  metaTitle: "The Technology Behind Small-Sided Football Analysis",
  metaDescription: "See how Pitchside AI uses custom machine learning and computer vision trained on small-sided football footage to generate stats, highlights and player moments.",
  badge: "Technology",
  heroH1: "The Technology Behind Pitchside AI",
  intro: "Pitchside AI uses a custom machine learning and computer vision model built specifically for small-sided football. Instead of forcing a professional 11-a-side model onto grassroots games, Pitchside is trained around the reality of 5-a-side, 6-a-side and 7-a-side football: tighter pitches, different camera angles, floodlit conditions, faster transitions and player-first moments.",
  technologyStats: [
    { value: "5-a-side trained", label: "Custom Model" },
    { value: "5, 6 and 7-a-side", label: "Supported Formats" },
    { value: "Improving with footage", label: "Beta Status" },
  ],
  technologyStack: [
    {
      id: "vision",
      icon: "vision",
      title: "Custom Small-Sided Football Model",
      desc: "Pitchside is built for 5, 6 and 7-a-side football, where tighter spaces, faster transitions and real grassroots camera angles need a different model from professional 11-a-side broadcast analysis.",
    },
    {
      id: "ai",
      icon: "ai",
      title: "Built for 5, 6 and 7-a-side",
      desc: "The product is focused on small-sided football first, using local match footage and frame-by-frame annotation to learn goals, saves, passes, tackles, assists and player moments.",
    },
    {
      id: "hardware",
      icon: "hardware",
      title: "Accuracy Improving During Beta",
      desc: "Pitchside should be presented honestly as a learning model. Accuracy is improving as more footage is processed across different lighting, pitch types, camera heights and game formats.",
    },
    {
      id: "cloud",
      icon: "cloud",
      title: "Upload Flow Improving",
      desc: "The current upload process can take up to 45 minutes. A future upload flow will reduce the processing wait time by moving upload work into the recording period.",
    },
  ],
  technologySections: [
    { h2: "Custom Machine Learning Model for Small-Sided Football", content: ["Pitchside is powered by a custom machine learning model trained specifically on small-sided football footage. The model was built this way because grassroots football does not look like professional 11-a-side football.", "Small-sided games have tighter spaces, shorter passing patterns, faster transitions, different camera angles and more crowded visual cues. A model trained only on professional broadcast footage would miss too much context. Pitchside is designed around the footage real amateur teams can actually capture."] },
    { h2: "Why Pitchside Is Trained on 5-a-Side Footage", content: ["Pitchside started with 5-a-side because it is one of the hardest and most useful grassroots formats to understand. The game is fast, compact and full of repeated actions: goals, saves, passes, tackles, assists and quick turnovers.", "The model has been trained using local small-sided game footage, with many hours spent annotating clips frame by frame. This helps Pitchside learn the visual patterns of real grassroots football instead of relying on assumptions from elite-level match footage.", "The same approach also supports 6-a-side and 7-a-side football, where the pitch is still smaller than full 11-a-side and the game remains player-moment heavy."] },
    { h2: "Computer Vision, Event Detection and Player Identification", content: ["Pitchside uses computer vision to read match footage and identify football actions from video. The goal is to understand what happened in the game, not just store a recording.", "The system is being built to detect key football events, assign those events to teams and players, and turn long recordings into useful match output. That includes statistics, highlights and leaderboards for players who want proof of performance."] },
    { h2: "What Pitchside Can Currently Detect", content: ["The first release is designed to generate full match highlights and assign core football statistics to teams and individual players.", "The planned first-release stats include goals, assists, saves, passes and tackles. Pitchside can identify players and assign those same statistics to individuals, which allows teams to create leaderboards and compete across each stat.", "This makes Pitchside different from a basic football camera app. The goal is not only to record football matches, but to turn the footage into stats, highlights and player moments."], table: { headers: ["Output", "What Pitchside Is Being Built to Do"], rows: [["Goals", "Detect and assign goals to teams and players"], ["Assists", "Identify assisting actions and connect them to players"], ["Saves", "Track goalkeeper saves and key defensive moments"], ["Passes", "Assign passing actions to players and teams"], ["Tackles", "Detect defensive actions from match footage"], ["Highlights", "Generate full match highlights from recorded footage"], ["Leaderboards", "Let players compete across individual stats"]] } },
    { h2: "Best Footage Setup for Pitchside AI", content: ["Pitchside works best when the match is recorded from the halfway line, above head height and facing toward one goal. The ideal setup is two phones: one pointing toward each goal. The app can then combine the data and highlights from both recordings.", "A one-phone setup can also work if it captures the full pitch clearly. Ball-tracking tripods may also work well because they can help keep the main action in frame.", "Most training footage was captured during British winter conditions: dark outside but floodlit. That is currently where Pitchside sees some of its best results. The system can still operate in sunlight, and performance should improve over time as more footage is processed."] },
    { h2: "Current Limitations", content: ["Pitchside is still improving. Accuracy is not perfect yet, and the system should be presented honestly as a learning model that gets better with more footage.", "The current upload process can also take longer than ideal. At the moment, footage may take up to 45 minutes to upload and process because the system waits until the game has finished recording before uploading.", "A future improvement is to stream the upload during the recording period, which should reduce waiting time after the match."], table: { headers: ["Limitation", "Current Reality", "Planned Direction"], rows: [["Accuracy", "Improving, but not perfect yet", "Gets better as more footage is processed"], ["Upload time", "Can currently take up to 45 minutes", "Future livestream-style upload during recording"], ["Footage quality", "Angle, height and lighting affect results", "Clear recording guidelines help improve output"], ["Format", "Best suited to 5, 6 and 7-a-side", "Built around small-sided football first"]] } },
    { h2: "What Improves Over Time", content: ["Pitchside is built around a learning algorithm, so the product should improve as it processes more match footage. More recordings help the system understand different lighting conditions, player movements, pitch types and camera setups.", "The long-term goal is to make football video analysis easier for grassroots players: record the game, upload the footage, receive stats, generate highlights and compete on player leaderboards without needing GPS vests or expensive camera hardware."] },
    { h2: "Why This Matters for Grassroots Football", content: ["Most amateur players do not have analysts, camera operators or expensive football tracking systems. They have phones, teammates and matches worth remembering. Pitchside is being built for that reality.", "The technology is designed to support football camera app searches, AI football analysis, football video analysis, Veo alternative comparisons, GPS vest alternative searches and football stats app users, but the product focus is simple: make grassroots match footage useful."] },
  ],
  aeoQuickAnswer: "PITCHSIDE.AI uses football-tuned computer vision to detect players, track movement, identify match events, and transform video into coaching and scouting intelligence without requiring specialist stadium hardware.",
  tldrPoints: [
    "Computer vision detects players, ball movement, and match structure from video.",
    "Event intelligence converts raw footage into football actions, phases, and tactical patterns.",
    "Editable technology pages and subpages can be managed from the admin dashboard.",
  ],
  contentBlocks: [
    { id: "technology-core-h2", type: "h2", content: "Core Infrastructure" },
    { id: "technology-core-intro", type: "paragraph", content: "The platform is built around a football-specific analysis layer that reads match footage, normalizes events, and prepares insights for coaches, analysts, clubs, and players." },
    { id: "technology-vision-h3", type: "h3", content: "Spatial Computer Vision" },
    { id: "technology-vision-copy", type: "paragraph", content: "Player and ball tracking are interpreted against the pitch, team shape, pressure zones, and transition moments so the output reflects how football is actually coached." },
    { id: "technology-events-h3", type: "h3", content: "Autonomous Event Detection" },
    { id: "technology-events-copy", type: "paragraph", content: "The system identifies repeatable football actions such as possession changes, attacking sequences, defensive pressure, and chance creation signals." },
    { id: "technology-hardware-h3", type: "h3", content: "No Specialist Hardware Required" },
    { id: "technology-hardware-copy", type: "paragraph", content: "The workflow is designed to work from accessible video sources, reducing the barrier for clubs and academies that need practical analysis without enterprise broadcast infrastructure." },
  ],
  ctaBlock: {
    headline: "Join the Pitchside AI Beta",
    description: "Pitchside is being built to turn small-sided football footage into stats, highlights and player leaderboards. Join the list and be first to try it.",
    buttonText: "Join the List",
    buttonUrl: "/contact",
  },
  faqs: [
    { question: "Can the technology page be edited in admin?", answer: "Yes. Open System Pages, edit Technology, change the content blocks, and publish the page." },
    { question: "Can technology subpages be added?", answer: "Yes. Use Technology Pages in the admin dashboard to create pages under /technology/[slug]." },
  ],
};

const hasOldTechnologyClaim = (value) => {
  const text = JSON.stringify(value || "").toLowerCase();
  return text.includes("98%")
    || text.includes("<3m")
    || text.includes("event accuracy")
    || text.includes("processing time")
    || text.includes("broadcast-quality")
    || text.includes("instantly categorize")
    || text.includes("thousands of hours");
};

const mergeTechnologyPageData = (savedData) => {
  const merged = savedData ? { ...TECHNOLOGY_PAGE_DEFAULTS, ...savedData } : TECHNOLOGY_PAGE_DEFAULTS;
  return {
    ...merged,
    metaTitle: savedData?.metaTitle && !hasOldTechnologyClaim(savedData.metaTitle) ? savedData.metaTitle : TECHNOLOGY_PAGE_DEFAULTS.metaTitle,
    metaDescription: savedData?.metaDescription && !hasOldTechnologyClaim(savedData.metaDescription) ? savedData.metaDescription : TECHNOLOGY_PAGE_DEFAULTS.metaDescription,
    badge: savedData?.badge || savedData?.heroLabel || TECHNOLOGY_PAGE_DEFAULTS.badge,
    heroH1: savedData?.heroH1 && savedData.heroH1.toLowerCase() !== "the engine." ? savedData.heroH1 : TECHNOLOGY_PAGE_DEFAULTS.heroH1,
    intro: savedData?.intro && !hasOldTechnologyClaim(savedData.intro) ? savedData.intro : savedData?.heroIntro || TECHNOLOGY_PAGE_DEFAULTS.intro,
    technologyStats: savedData?.technologyStats?.length && !hasOldTechnologyClaim(savedData.technologyStats) ? savedData.technologyStats : (savedData?.trustStats?.length ? savedData.trustStats : TECHNOLOGY_PAGE_DEFAULTS.technologyStats),
    technologyStack: savedData?.technologyStack?.length && !hasOldTechnologyClaim(savedData.technologyStack) ? savedData.technologyStack : TECHNOLOGY_PAGE_DEFAULTS.technologyStack,
    technologySections: savedData?.technologySections?.length ? savedData.technologySections : (savedData?.sections?.length ? savedData.sections : TECHNOLOGY_PAGE_DEFAULTS.technologySections),
    ctaBlock: savedData?.ctaBlock || savedData?.cta || TECHNOLOGY_PAGE_DEFAULTS.ctaBlock,
  };
};

const getUploadedImages = (item) => {
  const images = [];
  if (item.thumbnail && !isDefaultPageImage(item.thumbnail)) images.push(item.thumbnail);
  if (item.primaryImage && !isDefaultPageImage(item.primaryImage)) images.push(item.primaryImage);
  const contentImage = item.contentBlocks?.find((block) => block.type === "image" && block.content)?.content;
  if (contentImage && !isDefaultPageImage(contentImage)) images.push(contentImage);
  if (item.heroBackground && !isDefaultPageImage(item.heroBackground) && !/\.(mp4|webm|ogg)(?:[?#]|$)|video/i.test(item.heroBackground)) images.push(item.heroBackground);
  return [...new Set(images)];
};

const hasUploadedImage = (item) => getUploadedImages(item).length > 0;

function AdminImagePreview({ item }) {
  const images = getUploadedImages(item);
  const [sourceIndex, setSourceIndex] = useState(0);
  const source = images[sourceIndex];

  if (!source) return null;

  return (
    <Image
      src={source}
      alt={`${item.title || "Blog post"} thumbnail`}
      width={48}
      height={32}
      className="h-8 w-12 rounded-md border border-white/10 object-cover"
      unoptimized
      onError={() => setSourceIndex((current) => current + 1)}
    />
  );
}

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // App State
  const [activeTab, setActiveTab] = useState("core_pages"); 
  const [view, setView] = useState("list"); 
  const [editingItem, setEditingItem] = useState(null);
  const [editorType, setEditorType] = useState("core"); // "core", "landing", "post", or "tool"
  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(true);

  useLenis();

  // Listen for Firebase Session
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAuthError("Invalid email or password.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setEmail("");
      setPassword("");
    } catch (error) {}
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Both core_pages and landing_pages read from the "pages" collection in Firebase
      const targetCollection = (activeTab === "core_pages" || activeTab === "landing_pages" || activeTab === "technology_pages") ? "pages" : activeTab;
      
      if (["posts", "pages", "tools", "leads", "deletions"].includes(targetCollection)) {
        const querySnapshot = targetCollection === "tools"
          ? await getDocs(collection(db, targetCollection))
          : await getDocs(query(collection(db, targetCollection), orderBy("createdAt", "desc")));
        setContentList(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (view === "list" && user && !["footer", "authors"].includes(activeTab)) {
      fetchData();
    }
  }, [activeTab, fetchData, view, user]);

  const handleDelete = async (id) => {
    const isDeletionQueue = activeTab === "deletions";
    const msg = isDeletionQueue 
      ? "Have you scrubbed this user's data from the main database? Click OK to remove this ticket from the queue."
      : "Are you sure you want to permanently delete this record?";

    if (window.confirm(msg)) {
      const targetCollection = (activeTab === "core_pages" || activeTab === "landing_pages" || activeTab === "technology_pages") ? "pages" : activeTab;
      await deleteDoc(doc(db, targetCollection, id));
      setContentList(contentList.filter(item => item.id !== id));
    }
  };

  const handleEdit = (item, type) => {
    setEditorType(type);
    setEditingItem(item);
    setView("builder");
  };

  const handleCreateNew = () => {
    setEditorType(activeTab === "posts" ? "post" : activeTab === "technology_pages" ? "technology" : "landing");
    setEditingItem(null);
    setView("builder");
  };

  if (authLoading) {
    return (
      <div className="w-full min-h-screen bg-zinc-950 flex flex-col items-center justify-center font-roobert gap-4">
        <Activity className="w-8 h-8 text-[#CCFF00] animate-spin" />
        <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase animate-pulse">Establishing Secure Connection...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full min-h-screen bg-zinc-950 p-4 flex flex-col items-center justify-center font-roobert relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4vw_4vw] pointer-events-none z-0" />
        <div className="w-full max-w-md bg-[#050505] p-10 md:p-12 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col relative z-10 overflow-hidden">
          <div className="w-16 h-16 bg-[#CCFF00]/10 rounded-2xl flex items-center justify-center mb-8 border border-[#CCFF00]/20 mx-auto">
            <Lock className="w-8 h-8 text-[#CCFF00]" />
          </div>
          <h1 className="text-3xl font-black uppercase text-white mb-2 text-center" style={{ fontFamily: 'var(--font-alpha)' }}>System Access</h1>
          <p className="text-xs text-zinc-500 font-mono tracking-[0.2em] mb-8 text-center uppercase">Firebase Secure Auth</p>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ADMIN EMAIL" required className="bg-black border-2 border-white/10 text-white px-6 py-4 rounded-xl text-xs font-black tracking-widest uppercase focus:outline-none focus:border-[#CCFF00] transition-colors placeholder:text-zinc-700" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="PASSWORD" required className="bg-black border-2 border-white/10 text-white px-6 py-4 rounded-xl text-xs font-black tracking-widest uppercase focus:outline-none focus:border-[#CCFF00] transition-colors placeholder:text-zinc-700" />
            {authError && <span className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center mt-2">{authError}</span>}
            <button type="submit" disabled={isAuthenticating} className="bg-[#CCFF00] text-black px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white transition-colors mt-2 shadow-[0_0_20px_rgba(204,255,0,0.15)] active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2">
              {isAuthenticating ? <><Activity className="w-4 h-4 animate-spin" /> Authenticating...</> : "Initialize Link"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (view === "builder") {
    return (
      <div className="w-full min-h-screen bg-zinc-950 p-2 md:p-4 flex flex-col font-roobert">
        <main className="w-full flex-1 bg-[#050505] rounded-[1.5rem] md:rounded-[2rem] relative shadow-2xl border border-white/5 overflow-y-auto p-6 md:p-12">
          <div className="max-w-5xl mx-auto w-full">
            <button onClick={() => setView("list")} className="mb-8 text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
              ← Back to Dashboard
            </button>
            {/* Pass the Collection and the PageType so the builder knows what to show */}
            <PageBuilder 
              initialData={editingItem} 
              collectionName={editorType === "post" ? "posts" : editorType === "tool" ? "tools" : "pages"} 
              pageType={editorType}
              onBack={() => setView("list")} 
            />
          </div>
        </main>
      </div>
    );
  }

  const tabs = [
    { id: "core_pages", label: "System Pages", icon: LayoutTemplate },
    { id: "landing_pages", label: "SEO Landing Pages", icon: Target },
    { id: "technology_pages", label: "Technology Pages", icon: Cpu },
    { id: "posts", label: "Blog Engine", icon: FileText },
    { id: "tools", label: "Tools", icon: Wrench },
    { id: "authors", label: "Authors", icon: Users },
    { id: "footer", label: "Global Footer", icon: LinkIcon },
    { id: "leads", label: "Contacts & Leads", icon: Users },
    { id: "deletions", label: "Data Deletions", icon: UserX },
  ];

  return (
    <div className="w-full min-h-screen bg-zinc-950 p-2 md:p-4 flex flex-col font-roobert">
      <main className="w-full flex-1 flex flex-col md:flex-row overflow-hidden bg-[#050505] rounded-[1.5rem] md:rounded-[2rem] relative shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5">
        
        <aside className="w-full md:w-64 lg:w-72 bg-black/50 border-r border-white/5 flex flex-col p-6 md:p-8 shrink-0">
          <div className="text-white text-xl font-black tracking-tighter flex items-center gap-2 mb-12">
            PITCHSIDE.AI<sup className="text-[10px] text-[#CCFF00]">®</sup>
          </div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-600 mb-4 pl-2">System Core</div>
          <nav className="flex flex-col gap-2">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id ? "bg-[#CCFF00] text-black shadow-[0_0_15px_rgba(204,255,0,0.2)]" : (tab.id === 'deletions' && activeTab !== 'deletions' ? "text-red-400/80 hover:bg-red-500/10 hover:text-red-400" : "text-zinc-400 hover:bg-white/5 hover:text-white")}`}>
                <tab.icon className="w-4 h-4 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-widest">{tab.label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-auto pt-8 border-t border-white/5">
            <div className="flex items-center gap-3 px-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                <Activity className="w-4 h-4 text-[#CCFF00]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Admin Active</span>
                <span className="text-[10px] text-white font-medium truncate max-w-[150px]">{user.email}</span>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center gap-2 text-left px-2 text-[10px] font-mono uppercase tracking-[0.2em] text-red-500/60 hover:text-red-500 transition-colors">
              <LogOut className="w-3 h-3" /> [ Terminate Session ]
            </button>
          </div>
        </aside>

        <section className="flex-1 flex flex-col relative overflow-hidden bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4vw_4vw]">
          
          <header className="px-8 md:px-12 py-8 md:py-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md z-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white" style={{ fontFamily: 'var(--font-alpha)' }}>
                {tabs.find(t => t.id === activeTab)?.label}
              </h1>
              <p className="text-zinc-500 text-sm mt-2">
                {activeTab === "core_pages" ? "Manage SEO metadata for your hardcoded system routes." : 
                 activeTab === "landing_pages" ? "Build & deploy dynamic competitor / SEO landing pages." :
                 activeTab === "technology_pages" ? "Build editable subpages under /technology." :
                 activeTab === "tools" ? "Edit SEO, page copy, FAQs, and CTA content for fixed public tools." :
                 activeTab === "authors" ? "Manage blog authors and their LinkedIn profiles." :
                 activeTab === "footer" ? "Manage external links and global footer presence." : 
                 activeTab === "deletions" ? "Process user account deletion requests." :
                 "Manage your platform data and incoming requests."}
              </p>
            </div>
            
            {/* Create New Button is active for Posts & Landing Pages */}
            {(activeTab === "posts" || activeTab === "landing_pages" || activeTab === "technology_pages") && (
              <button onClick={handleCreateNew} className="flex items-center gap-2 bg-transparent border-2 border-[#CCFF00] text-[#CCFF00] px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-[#CCFF00] hover:text-black transition-all shadow-[0_0_20px_rgba(204,255,0,0.1)] active:scale-95">
                <Plus className="w-4 h-4" /> {activeTab === "posts" ? "New Blog Post" : activeTab === "technology_pages" ? "Create Technology Page" : "Create Landing Page"}
              </button>
            )}
          </header>

          <div className="flex-1 overflow-y-auto p-8 md:p-12 z-0">
            {activeTab === "footer" ? (
              <FooterManager />
            ) : activeTab === "authors" ? (
              <AuthorsManager />
            ) : (
            <div className="bg-[#0A0A0A] border border-white/10 rounded-[1.5rem] overflow-hidden shadow-2xl">
              {loading ? (
                <div className="p-12 flex flex-col items-center justify-center text-[#CCFF00]">
                  <Database className="w-8 h-8 mb-4 animate-bounce" />
                  <span className="font-mono text-xs uppercase tracking-widest animate-pulse">Querying Database...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-white/10 bg-black/50">
                        {activeTab === "leads" ? (
                          <>
                            <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Contact Info</th>
                            <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Intent</th>
                            <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Message</th>
                          </>
                        ) : activeTab === "deletions" ? (
                          <>
                            <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">User Email</th>
                            <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Date Requested</th>
                            <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Reason</th>
                          </>
                        ) : (
                          <>
                            <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Title</th>
                            <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{activeTab === "core_pages" || activeTab === "landing_pages" || activeTab === "technology_pages" || activeTab === "tools" ? "Route" : "Slug"}</th>
                            {(activeTab === "landing_pages" || activeTab === "technology_pages" || activeTab === "posts") && <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Image</th>}
                            {(activeTab === "landing_pages" || activeTab === "technology_pages" || activeTab === "posts") && <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Uploaded / Updated</th>}
                            {(activeTab === "core_pages" || activeTab === "tools") && <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Status</th>}
                          </>
                        )}
                        <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      
                      {/* --- TAB 1: CORE SYSTEM PAGES --- */}
                      {activeTab === "core_pages" && CORE_STATIC_PAGES.map((page) => {
                        const fallbackData = page.id === "technology" ? { ...page, ...TECHNOLOGY_PAGE_DEFAULTS } : page;
                        const savedData = contentList.find(c => c.id === page.id);
                        const dbData = page.id === "technology"
                          ? { ...page, ...mergeTechnologyPageData(savedData) }
                          : savedData ? { ...fallbackData, ...savedData } : fallbackData;
                        return (
                          <tr key={page.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                            <td className="p-6 font-bold text-white text-sm">{dbData.title || page.title}</td>
                            <td className="p-6 text-zinc-500 text-xs font-mono">/{dbData.slug || page.slug}</td>
                            <td className="p-6">
                              <span className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest ${contentList.some(c => c.id === page.id) ? 'bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/20' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}>
                                {contentList.some(c => c.id === page.id) ? "Configured" : "Default"}
                              </span>
                            </td>
                            <td className="p-6 text-right">
                              <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit({ id: page.id, ...fallbackData, ...dbData }, "core")} className="p-2.5 text-zinc-400 hover:text-black hover:bg-[#CCFF00] rounded-xl border border-white/10 transition-all shadow-md">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                      {/* --- TAB 2: SEO LANDING PAGES --- */}
                      {activeTab === "landing_pages" && contentList.filter(c => !CORE_STATIC_PAGES.some(core => core.id === c.id)).map((page) => {
                        const isTechnologyChild = page.parentPage?.url === "/technology";
                        const route = isTechnologyChild ? `/technology/${page.slug}` : `/${page.slug}`;
                        return (
                        <tr key={page.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                          <td className="p-6 font-bold text-white text-sm">{page.title}</td>
                          <td className="p-6 text-[#CCFF00] text-xs font-mono">{route}</td>
                          <td className="p-6">
                            <span className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest ${hasUploadedImage(page) ? 'bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/20' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}>
                              {hasUploadedImage(page) ? "Uploaded" : "Missing"}
                            </span>
                          </td>
                          <td className="p-6 text-xs text-zinc-400">
                            <div><span className="text-zinc-600">Uploaded:</span> {formatContentDate(getPublishedDate(page))}</div>
                            <div className="mt-1"><span className="text-zinc-600">Updated:</span> {formatContentDate(getUpdatedDate(page))}</div>
                          </td>
                          <td className="p-6 text-right">
                            <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                              <a href={route} target="_blank" rel="noopener noreferrer" title="Open public landing page" className="p-2.5 text-zinc-400 hover:text-black hover:bg-[#CCFF00] rounded-xl border border-white/10 transition-all shadow-md">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                              <button onClick={() => handleEdit(page, "landing")} className="p-2.5 text-zinc-400 hover:text-black hover:bg-[#CCFF00] rounded-xl border border-white/10 transition-all shadow-md">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDelete(page.id)} className="p-2.5 text-zinc-400 hover:text-white hover:bg-red-500 rounded-xl border border-white/10 transition-all shadow-md">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );})}

                      {/* --- TAB: TECHNOLOGY SUBPAGES --- */}
                      {activeTab === "technology_pages" && contentList.filter(c => c.parentPage?.url === "/technology").map((page) => (
                        <tr key={page.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                          <td className="p-6 font-bold text-white text-sm">{page.title}</td>
                          <td className="p-6 text-[#CCFF00] text-xs font-mono">/technology/{page.slug}</td>
                          <td className="p-6">
                            <span className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest ${hasUploadedImage(page) ? 'bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/20' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}>
                              {hasUploadedImage(page) ? "Uploaded" : "Missing"}
                            </span>
                          </td>
                          <td className="p-6 text-xs text-zinc-400">
                            <div><span className="text-zinc-600">Uploaded:</span> {formatContentDate(getPublishedDate(page))}</div>
                            <div className="mt-1"><span className="text-zinc-600">Updated:</span> {formatContentDate(getUpdatedDate(page))}</div>
                          </td>
                          <td className="p-6 text-right">
                            <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                              <a href={`/technology/${page.slug}`} target="_blank" rel="noopener noreferrer" title="Open public technology page" className="p-2.5 text-zinc-400 hover:text-black hover:bg-[#CCFF00] rounded-xl border border-white/10 transition-all shadow-md">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                              <button onClick={() => handleEdit(page, "technology")} className="p-2.5 text-zinc-400 hover:text-black hover:bg-[#CCFF00] rounded-xl border border-white/10 transition-all shadow-md">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDelete(page.id)} className="p-2.5 text-zinc-400 hover:text-white hover:bg-red-500 rounded-xl border border-white/10 transition-all shadow-md">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {/* --- TAB 3: PUBLIC TOOLS --- */}
                      {activeTab === "tools" && [toolsHub, ...tools].map((tool) => {
                        const docId = tool.id || tool.slug;
                        const dbData = contentList.find(c => c.id === docId) || {};
                        const isConfigured = contentList.some(c => c.id === docId);
                        const merged = tool.slug === "tools"
                          ? mergeToolsHubContent(isConfigured ? dbData : null)
                          : mergeToolContent(tool, isConfigured ? dbData : null);
                        const route = tool.slug === "tools" ? "/tools" : `/tools/${tool.slug}`;
                        return (
                          <tr key={docId} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                            <td className="p-6 font-bold text-white text-sm">{merged.title}</td>
                            <td className="p-6 text-[#CCFF00] text-xs font-mono">{route}</td>
                            <td className="p-6">
                              <span className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest ${isConfigured ? 'bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/20' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}>
                                {isConfigured ? "Configured" : "Default"}
                              </span>
                            </td>
                            <td className="p-6 text-right">
                              <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(merged, "tool")} className="p-2.5 text-zinc-400 hover:text-black hover:bg-[#CCFF00] rounded-xl border border-white/10 transition-all shadow-md">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                      {/* --- TABS: POSTS, LEADS, DELETIONS --- */}
                      {["posts", "leads", "deletions"].includes(activeTab) && contentList.map((item) => (
                        <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                          {activeTab === "leads" ? (
                            <>
                              <td className="p-6">
                                <div className="font-bold text-white text-sm">{item.name}</div>
                                <div className="text-xs text-zinc-500 font-mono mt-1">{item.email}</div>
                              </td>
                              <td className="p-6">
                                <span className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest ${item.intent === 'invest' ? 'bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/20' : 'bg-zinc-900 text-zinc-300 border border-zinc-700'}`}>
                                  {item.intent}
                                </span>
                              </td>
                              <td className="p-6 text-zinc-400 text-xs leading-relaxed max-w-xs truncate">
                                <div>{item.message || "No message provided."}</div>
                                {(item.sourcePage || item.sourcePlacement) && (
                                  <div className="mt-2 text-[10px] font-mono uppercase tracking-widest text-[#CCFF00]">
                                    {item.sourcePage || "Unknown page"} | {item.sourcePlacement || "Unknown placement"}
                                  </div>
                                )}
                              </td>
                            </>
                          ) : activeTab === "deletions" ? (
                            <>
                              <td className="p-6">
                                <div className="font-bold text-red-400 text-sm">{item.email}</div>
                                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Pending Scrub</div>
                              </td>
                              <td className="p-6 text-zinc-400 text-xs font-mono">{item.requestDate || "Unknown Date"}</td>
                              <td className="p-6 text-zinc-400 text-xs leading-relaxed max-w-xs truncate">
                                {item.reason}
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="p-6 font-bold text-white text-sm">{item.title}</td>
                              <td className="p-6 text-zinc-500 text-xs font-mono">/{item.slug}</td>
                              <td className="p-6">
                                <div className="flex items-center gap-3">
                                  {hasUploadedImage(item) && (
                                    <AdminImagePreview item={item} />
                                  )}
                                  <span className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest ${hasUploadedImage(item) ? 'bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/20' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}>
                                    {hasUploadedImage(item) ? "Uploaded" : "Missing"}
                                  </span>
                                </div>
                              </td>
                              <td className="p-6 text-xs text-zinc-400">
                                <div><span className="text-zinc-600">Uploaded:</span> {formatContentDate(getPublishedDate(item))}</div>
                                <div className="mt-1"><span className="text-zinc-600">Updated:</span> {formatContentDate(getUpdatedDate(item))}</div>
                              </td>
                            </>
                          )}
                          <td className="p-6 text-right">
                            <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                              {(activeTab !== "leads" && activeTab !== "deletions") && (
                                <>
                                  <a href={`/blog/${item.slug}`} target="_blank" rel="noopener noreferrer" title="Open public blog post" className="p-2.5 text-zinc-400 hover:text-black hover:bg-[#CCFF00] rounded-xl border border-white/10 transition-all shadow-md">
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                  <button onClick={() => handleEdit(item, "post")} className="p-2.5 text-zinc-400 hover:text-black hover:bg-[#CCFF00] rounded-xl border border-white/10 transition-all shadow-md">
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              <button onClick={() => handleDelete(item.id)} className={`p-2.5 rounded-xl border transition-all shadow-md ${activeTab === 'deletions' ? 'text-zinc-400 hover:text-white hover:bg-green-600 border-white/10' : 'text-zinc-400 hover:text-white hover:bg-red-500 border-white/10'}`} title={activeTab === 'deletions' ? "Mark as Resolved/Deleted" : "Delete Record"}>
                                {activeTab === "deletions" ? <CheckCircle2 className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      
                      {/* Empty State Handlers */}
                      {((activeTab === "landing_pages" && contentList.filter(c => !CORE_STATIC_PAGES.some(core => core.id === c.id)).length === 0) ||
                        (activeTab === "technology_pages" && contentList.filter(c => c.parentPage?.url === "/technology").length === 0) ||
                        (["posts", "leads", "deletions"].includes(activeTab) && contentList.length === 0)) && (
                        <tr>
                          <td colSpan="4" className="p-16 text-center text-zinc-600 font-mono text-xs uppercase tracking-widest">
                            No records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function AuthorsManager() {
  const [authors, setAuthors] = useState([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadAuthors = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const snapshot = await getDocs(collection(db, "authors"));
      setAuthors(snapshot.docs.map((authorDoc) => ({ id: authorDoc.id, ...authorDoc.data() })));
    } catch (loadError) {
      console.error("Unable to load authors:", loadError);
      setError(loadError?.code === "permission-denied"
        ? "Firestore denied access to the authors collection. Add authenticated read/write access for /authors/{authorId} in your Firestore rules."
        : loadError?.message || "Unable to load authors.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAuthors(); }, [loadAuthors]);

  const addAuthor = async (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedUrl = url.trim();
    let linkedInUrl;
    try {
      linkedInUrl = new URL(trimmedUrl);
    } catch {
      linkedInUrl = null;
    }
    if (!trimmedName || linkedInUrl?.protocol !== "https:" || !/(^|\.)linkedin\.com$/i.test(linkedInUrl.hostname)) {
      window.alert("Enter an author name and a valid LinkedIn URL.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const author = { name: trimmedName, url: linkedInUrl.toString(), createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
      await addDoc(collection(db, "authors"), author);
      setName("");
      setUrl("");
      await loadAuthors();
    } catch (saveError) {
      console.error("Unable to add author:", saveError);
      setError(saveError?.code === "permission-denied"
        ? "Firestore denied this save. Add authenticated read/write access for /authors/{authorId} in your Firestore rules."
        : saveError?.message || "Unable to add the author.");
    } finally {
      setSaving(false);
    }
  };

  const removeAuthor = async (author) => {
    if (!window.confirm(`Delete ${author.name} from the author list? Existing posts will keep their saved author.`)) return;
    await deleteDoc(doc(db, "authors", author.id));
    setAuthors((current) => current.filter((item) => item.id !== author.id));
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <form onSubmit={addAuthor} className="space-y-5 rounded-[1.5rem] border border-white/10 bg-[#0A0A0A] p-8 shadow-2xl">
        <h2 className="text-xl font-black uppercase tracking-widest text-white">Add author</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Author name" className="rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#CCFF00]" required />
          <input type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://linkedin.com/in/..." className="rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#CCFF00]" required />
        </div>
        <button disabled={saving} className="rounded-xl bg-[#CCFF00] px-6 py-3 text-xs font-black uppercase tracking-widest text-black disabled:opacity-50">{saving ? "Adding..." : "Add author"}</button>
        {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</p>}
      </form>

      <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0A0A0A]">
        {loading ? <div className="p-8 text-sm text-zinc-500">Loading authors...</div> : authors.length === 0 ? (
          <div className="p-8 text-sm text-zinc-500">No managed authors yet. Abdullah Luqman remains the default author.</div>
        ) : authors.map((author) => (
          <div key={author.id} className="flex items-center justify-between gap-4 border-b border-white/5 p-6 last:border-b-0">
            <div>
              <div className="font-bold text-white">{author.name}</div>
              <a href={author.url} target="_blank" rel="noopener noreferrer" className="mt-1 block text-xs text-[#CCFF00] hover:underline">{author.url}</a>
            </div>
            <button onClick={() => removeAuthor(author)} className="rounded-lg border border-red-500/20 p-2 text-red-400 hover:bg-red-500 hover:text-white" title="Delete author"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- FOOTER MANAGER ---
function FooterManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);
  const [links, setLinks] = useState({
    instagram: "", tiktok: "", x: "", linkedin: "", appStore: "", playStore: ""
  });

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const docSnap = await getDoc(doc(db, "settings", "footer"));
        if (docSnap.exists()) setLinks((currentLinks) => ({ ...currentLinks, ...docSnap.data() }));
      } catch (error) {} finally { setLoading(false); }
    };
    fetchFooterData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "footer"), { ...links, updatedAt: new Date().toISOString() }, { merge: true });
      setSavedStatus(true);
      setTimeout(() => setSavedStatus(false), 3000);
    } catch (error) {} finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center p-12 text-[#CCFF00]"><Activity className="w-8 h-8 animate-spin" /></div>;

  return (
    <form onSubmit={handleSave} className="bg-[#0A0A0A] border border-white/10 rounded-[1.5rem] p-8 md:p-12 shadow-2xl max-w-3xl">
      <h2 className="text-xl font-black uppercase tracking-widest text-white mb-8 border-b border-white/10 pb-6 flex items-center justify-between">
        Social Media & Apps
        {savedStatus && <span className="flex items-center gap-2 text-[#CCFF00] text-[10px] bg-[#CCFF00]/10 px-3 py-1.5 rounded-lg"><CheckCircle2 className="w-3 h-3"/> Saved</span>}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="flex flex-col gap-2"><label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Instagram URL</label><input type="url" value={links.instagram} onChange={(e) => setLinks({...links, instagram: e.target.value})} className="bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#CCFF00]" /></div>
        <div className="flex flex-col gap-2"><label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">TikTok URL</label><input type="url" value={links.tiktok} onChange={(e) => setLinks({...links, tiktok: e.target.value})} className="bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#CCFF00]" /></div>
        <div className="flex flex-col gap-2"><label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">X (Twitter) URL</label><input type="url" value={links.x} onChange={(e) => setLinks({...links, x: e.target.value})} className="bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#CCFF00]" /></div>
        <div className="flex flex-col gap-2"><label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">LinkedIn URL</label><input type="url" value={links.linkedin} onChange={(e) => setLinks({...links, linkedin: e.target.value})} className="bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#CCFF00]" /></div>
      </div>
      <h2 className="text-xl font-black uppercase tracking-widest text-white mb-8 border-b border-white/10 pb-6 mt-12">App Store Links</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="flex flex-col gap-2"><label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Apple App Store</label><input type="url" value={links.appStore} onChange={(e) => setLinks({...links, appStore: e.target.value})} className="bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#CCFF00]" /></div>
        <div className="flex flex-col gap-2"><label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Google Play Store</label><input type="url" value={links.playStore} onChange={(e) => setLinks({...links, playStore: e.target.value})} className="bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#CCFF00]" /></div>
      </div>
      <button disabled={saving} type="submit" className="bg-[#CCFF00] text-black w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs flex justify-center items-center gap-2 hover:bg-white transition-all shadow-[0_0_20px_rgba(204,255,0,0.15)] disabled:opacity-50">
        {saving ? "Saving Changes..." : "Publish Footer Links"} <Save className="w-4 h-4" />
      </button>
    </form>
  );
}
