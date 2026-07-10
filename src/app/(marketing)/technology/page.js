"use client";
import useLenis from "@/lib/useLenis";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, ScanEye, Zap, Server, ShieldCheck, ArrowUpRight } from "lucide-react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const defaultTechnologyContent = {
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
    {
      h2: "Custom Machine Learning Model for Small-Sided Football",
      content: [
        "Pitchside is powered by a custom machine learning model trained specifically on small-sided football footage. The model was built this way because grassroots football does not look like professional 11-a-side football.",
        "Small-sided games have tighter spaces, shorter passing patterns, faster transitions, different camera angles and more crowded visual cues. A model trained only on professional broadcast footage would miss too much context. Pitchside is designed around the footage real amateur teams can actually capture.",
      ],
    },
    {
      h2: "Why Pitchside Is Trained on 5-a-Side Footage",
      content: [
        "Pitchside started with 5-a-side because it is one of the hardest and most useful grassroots formats to understand. The game is fast, compact and full of repeated actions: goals, saves, passes, tackles, assists and quick turnovers.",
        "The model has been trained using local small-sided game footage, with many hours spent annotating clips frame by frame. This helps Pitchside learn the visual patterns of real grassroots football instead of relying on assumptions from elite-level match footage.",
        "The same approach also supports 6-a-side and 7-a-side football, where the pitch is still smaller than full 11-a-side and the game remains player-moment heavy.",
      ],
    },
    {
      h2: "Computer Vision, Event Detection and Player Identification",
      content: [
        "Pitchside uses computer vision to read match footage and identify football actions from video. The goal is to understand what happened in the game, not just store a recording.",
        "The system is being built to detect key football events, assign those events to teams and players, and turn long recordings into useful match output. That includes statistics, highlights and leaderboards for players who want proof of performance.",
      ],
    },
    {
      h2: "What Pitchside Can Currently Detect",
      content: [
        "The first release is designed to generate full match highlights and assign core football statistics to teams and individual players.",
        "The planned first-release stats include goals, assists, saves, passes and tackles. Pitchside can identify players and assign those same statistics to individuals, which allows teams to create leaderboards and compete across each stat.",
        "This makes Pitchside different from a basic football camera app. The goal is not only to record football matches, but to turn the footage into stats, highlights and player moments.",
      ],
      table: {
        headers: ["Output", "What Pitchside Is Being Built to Do"],
        rows: [
          ["Goals", "Detect and assign goals to teams and players"],
          ["Assists", "Identify assisting actions and connect them to players"],
          ["Saves", "Track goalkeeper saves and key defensive moments"],
          ["Passes", "Assign passing actions to players and teams"],
          ["Tackles", "Detect defensive actions from match footage"],
          ["Highlights", "Generate full match highlights from recorded footage"],
          ["Leaderboards", "Let players compete across individual stats"],
        ],
      },
    },
    {
      h2: "Best Footage Setup for Pitchside AI",
      content: [
        "Pitchside works best when the match is recorded from the halfway line, above head height and facing toward one goal. The ideal setup is two phones: one pointing toward each goal. The app can then combine the data and highlights from both recordings.",
        "A one-phone setup can also work if it captures the full pitch clearly. Ball-tracking tripods may also work well because they can help keep the main action in frame.",
        "Most training footage was captured during British winter conditions: dark outside but floodlit. That is currently where Pitchside sees some of its best results. The system can still operate in sunlight, and performance should improve over time as more footage is processed.",
      ],
    },
    {
      h2: "Current Limitations",
      content: [
        "Pitchside is still improving. Accuracy is not perfect yet, and the system should be presented honestly as a learning model that gets better with more footage.",
        "The current upload process can also take longer than ideal. At the moment, footage may take up to 45 minutes to upload and process because the system waits until the game has finished recording before uploading.",
        "A future improvement is to stream the upload during the recording period, which should reduce waiting time after the match.",
      ],
      table: {
        headers: ["Limitation", "Current Reality", "Planned Direction"],
        rows: [
          ["Accuracy", "Improving, but not perfect yet", "Gets better as more footage is processed"],
          ["Upload time", "Can currently take up to 45 minutes", "Future livestream-style upload during recording"],
          ["Footage quality", "Angle, height and lighting affect results", "Clear recording guidelines help improve output"],
          ["Format", "Best suited to 5, 6 and 7-a-side", "Built around small-sided football first"],
        ],
      },
    },
    {
      h2: "What Improves Over Time",
      content: [
        "Pitchside is built around a learning algorithm, so the product should improve as it processes more match footage. More recordings help the system understand different lighting conditions, player movements, pitch types and camera setups.",
        "The long-term goal is to make football video analysis easier for grassroots players: record the game, upload the footage, receive stats, generate highlights and compete on player leaderboards without needing GPS vests or expensive camera hardware.",
      ],
    },
    {
      h2: "Why This Matters for Grassroots Football",
      content: [
        "Most amateur players do not have analysts, camera operators or expensive football tracking systems. They have phones, teammates and matches worth remembering. Pitchside is being built for that reality.",
        "The technology is designed to support football camera app searches, AI football analysis, football video analysis, Veo alternative comparisons, GPS vest alternative searches and football stats app users, but the product focus is simple: make grassroots match footage useful.",
      ],
    },
  ],
  ctaBlock: {
    headline: "Join the Pitchside AI Beta",
    description: "Pitchside is being built to turn small-sided football footage into stats, highlights and player leaderboards. Join the list and be first to try it.",
    buttonText: "Join the List",
    buttonUrl: "/contact",
  },
};

const iconMap = {
  vision: ScanEye,
  ai: Cpu,
  hardware: ShieldCheck,
  cloud: Server,
};

function shuffleItems(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function normalizeTechnologyContent(data = {}) {
  const legacyTitle = data.heroH1 || "";
  const stats = Array.isArray(data.technologyStats) && data.technologyStats.length
    ? data.technologyStats
    : Array.isArray(data.trustStats) && data.trustStats.length
      ? data.trustStats
      : defaultTechnologyContent.technologyStats;
  const hasStaleStats = JSON.stringify(stats).toLowerCase().includes("98%")
    || JSON.stringify(stats).toLowerCase().includes("<3m")
    || JSON.stringify(stats).toLowerCase().includes("event accuracy")
    || JSON.stringify(stats).toLowerCase().includes("processing time");
  const safeStats = hasStaleStats ? defaultTechnologyContent.technologyStats : stats;
  const stack = Array.isArray(data.technologyStack) && data.technologyStack.length
    ? data.technologyStack
    : defaultTechnologyContent.technologyStack;
  const hasStaleStackClaims = JSON.stringify(stack).toLowerCase().includes("98%")
    || JSON.stringify(stack).toLowerCase().includes("broadcast-quality")
    || JSON.stringify(stack).toLowerCase().includes("instantly categorize")
    || JSON.stringify(stack).toLowerCase().includes("thousands of hours");
  const safeStack = hasStaleStackClaims ? defaultTechnologyContent.technologyStack : stack;
  const sections = Array.isArray(data.technologySections) && data.technologySections.length
    ? data.technologySections
    : Array.isArray(data.sections) && data.sections.length
      ? data.sections
      : defaultTechnologyContent.technologySections;

  return {
    ...defaultTechnologyContent,
    ...data,
    badge: data.badge || data.heroLabel || defaultTechnologyContent.badge,
    heroH1: data.heroH1 || defaultTechnologyContent.heroH1,
    intro: data.intro || data.heroIntro || defaultTechnologyContent.intro,
    technologyStats: safeStats.map((stat, index) => ({
      value: stat?.value || defaultTechnologyContent.technologyStats[index]?.value || "",
      label: stat?.label || defaultTechnologyContent.technologyStats[index]?.label || "",
    })),
    technologyStack: safeStack.map((item, index) => ({
      id: item?.id || `${item?.icon || "tech"}-${index}`,
      icon: item?.icon || defaultTechnologyContent.technologyStack[index]?.icon || "ai",
      title: item?.title || "",
      desc: item?.desc || item?.description || "",
    })),
    technologySections: sections.map((section, sectionIndex) => ({
      id: section?.id || `section-${sectionIndex}`,
      h2: section?.h2 || section?.heading || "",
      content: Array.isArray(section?.content) ? section.content : [],
      table: section?.table || null,
    })),
    ctaBlock: { ...defaultTechnologyContent.ctaBlock, ...(data.cta || {}), ...(data.ctaBlock || {}) },
  };
}

// --- THEME ASSETS & EFFECTS ---
const FilmGrain = () => (
  <div 
    className="absolute inset-0 w-full h-full pointer-events-none z-[100] mix-blend-multiply opacity-[0.04]"
    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
  />
);

const CornerMark = ({ className, src, opacity = "opacity-100" }) => (
  <div className={`absolute w-6 h-6 md:w-10 md:h-10 pointer-events-none z-50 ${opacity} ${className}`}>
    <Image src={src} alt="Corner Marking" fill className="object-contain" />
  </div>
);

export default function TechnologyPage() {
  const [hoveredTech, setHoveredTech] = useState(null);
  const [cmsPage, setCmsPage] = useState({});
  const [relatedItems, setRelatedItems] = useState([]);

  useLenis();

  useEffect(() => {
    let mounted = true;
    const loadTechnologyContent = async () => {
      try {
        const snapshot = await getDoc(doc(db, "pages", "technology"));
        if (mounted && snapshot.exists()) {
          const data = snapshot.data();
          setCmsPage({ id: snapshot.id, slug: "technology", title: "Technology", ...data });
        }
      } catch (error) {
        console.error("Unable to load editable technology content:", error);
      }
    };
    loadTechnologyContent();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadRelatedContent = async () => {
      try {
        const [pagesSnapshot, postsSnapshot] = await Promise.all([
          getDocs(collection(db, "pages")),
          getDocs(collection(db, "posts")),
        ]);
        if (!mounted) return;

        const pages = pagesSnapshot.docs.map((pageDoc) => ({ id: pageDoc.id, ...pageDoc.data() }));
        const posts = postsSnapshot.docs.map((postDoc) => ({ id: postDoc.id, ...postDoc.data() }));
        const technologyPages = pages
          .filter((page) => page.slug && page.parentPage?.url === "/technology")
          .slice(0, 2)
          .map((page) => ({
            id: page.id,
            label: "Technology",
            title: page.heroH1 || page.title || page.slug,
            description: page.metaDescription || page.intro || "",
            href: `/technology/${page.slug}`,
          }));
        const generalPages = pages
          .filter((page) => page.slug && page.slug !== "technology" && page.parentPage?.url !== "/technology")
          .map((page) => ({
            id: page.id,
            label: "Page",
            title: page.heroH1 || page.title || page.slug,
            description: page.metaDescription || page.intro || "",
            href: `/${page.slug}`,
          }));
        const blogPosts = posts
          .filter((post) => post.slug)
          .map((post) => ({
            id: post.id,
            label: "Blog",
            title: post.heroH1 || post.title || post.slug,
            description: post.metaDescription || post.intro || "",
            href: `/blog/${post.slug}`,
          }));

        setRelatedItems([...technologyPages, ...shuffleItems([...blogPosts, ...generalPages]).slice(0, 2)]);
      } catch (error) {
        console.error("Unable to load technology related content:", error);
      }
    };

    loadRelatedContent();
    return () => { mounted = false; };
  }, []);

  const content = normalizeTechnologyContent(cmsPage);
  const fallbackRelatedItems = [
    ...content.technologySections.slice(0, 2).map((section) => ({
      id: section.id,
      label: "Technology",
      title: section.h2,
      description: section.content?.[0] || "",
      href: `#${section.id}`,
    })),
    {
      id: "tools",
      label: "Page",
      title: "Football tools",
      description: "Use Pitchside tools for football teams, players, formats and match planning.",
      href: "/tools",
    },
    {
      id: "blog",
      label: "Blog",
      title: "Football analysis blog",
      description: "Read more Pitchside articles on grassroots football, player stats and match analysis.",
      href: "/blog",
    },
  ];
  const displayRelatedItems = relatedItems.length ? relatedItems : fallbackRelatedItems;

  return (
    <>
      <div className="flex flex-col w-full font-roobert" style={{ fontFamily: 'var(--font-roobert)' }}>
        
        {/* =========================================
            SECTION 1: HERO
            Outer: Black | Inner: White
            ========================================= */}
        <div className="w-full bg-zinc-950 p-2 md:p-4">
          <section className="relative w-full min-h-[calc(100svh-16px)] md:min-h-[calc(100svh-32px)] flex flex-col justify-center overflow-hidden bg-[#F4F3EF] pt-[104px] md:pt-[130px] pb-12 md:pb-16 px-5 sm:px-8 md:px-20 lg:px-24 rounded-[1.5rem] md:rounded-[2rem] border border-white/5">
            <FilmGrain />
            
            <CornerMark src="/corner-dark.svg" opacity="opacity-40" className="top-[90px] left-6 md:left-10" />
            <CornerMark src="/corner-dark.svg" opacity="opacity-40" className="top-[90px] right-6 md:right-10 rotate-90" />
            <CornerMark src="/corner-dark.svg" opacity="opacity-40" className="bottom-6 right-6 md:bottom-10 md:right-10 rotate-180" />
            <CornerMark src="/corner-dark.svg" opacity="opacity-40" className="bottom-6 left-6 md:bottom-10 md:left-10 -rotate-90" />

            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:4vw_4vw] pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 md:gap-12 w-full">
              <div className="max-w-3xl min-w-0">
                <span className="text-zinc-500 font-mono text-[9px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.2em] uppercase mb-4 md:mb-6 block font-bold">{content.badge}</span>

                <h1 className="mb-6 md:mb-8 max-w-full break-words text-[clamp(2.2rem,11vw,4rem)] font-black uppercase leading-[0.92] tracking-normal text-zinc-950 md:text-7xl lg:text-8xl [overflow-wrap:anywhere]" style={{ fontFamily: 'var(--font-alpha)' }}>
                  {content.heroH1}
                </h1>

                <p className="max-w-xl text-sm font-bold leading-relaxed text-zinc-800 sm:text-base md:text-xl">
                  {content.intro}
                </p>
              </div>

              {/* Data Blocks - Light Theme (Alignment Fixed) */}
              <div className="grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 lg:max-w-[560px]">
                {content.technologyStats.map((stat, index) => (
                  <div key={`${stat.value}-${index}`} className="grid min-h-[118px] min-w-0 grid-rows-[1fr_auto] items-stretch rounded-2xl border-2 border-zinc-900 bg-white p-4 shadow-[4px_4px_0px_#000] sm:min-h-[166px]">
                    <div className="flex max-w-full items-start text-[clamp(1.85rem,10vw,2.8rem)] leading-[0.92] tracking-normal text-[#CCFF00] [overflow-wrap:anywhere] sm:text-[clamp(1.35rem,2.7vw,2.25rem)]" style={{ fontFamily: 'var(--font-alpha)', WebkitTextStroke: "1.1px #000" }}>{stat.value}</div>
                    <div className="mt-4 self-end font-mono text-[8px] font-black uppercase leading-[1.35] tracking-[0.15em] text-zinc-900 sm:text-[9px]">
                      {String(stat.label).split("\n").map((line) => <React.Fragment key={line}>{line}<br /></React.Fragment>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* =========================================
            SECTION 2: TECHNICAL DEEP DIVE
            Outer: White | Inner: Black
            ========================================= */}
        <div className="w-full bg-[#F4F3EF] p-2 md:p-4">
          <section className="relative w-full min-h-[calc(100svh-16px)] md:min-h-[calc(100svh-32px)] bg-[#050505] text-white overflow-hidden z-20 flex flex-col justify-center rounded-[1.5rem] md:rounded-[2rem] border border-zinc-200 py-20 md:py-32 px-5 sm:px-8 md:px-20 lg:px-24">
            
            <CornerMark src="/corner-neon.svg" opacity="opacity-40" className="top-6 left-6 md:top-8 md:left-8" />
            <CornerMark src="/corner-neon.svg" opacity="opacity-40" className="top-6 right-6 md:top-8 md:right-8 rotate-90" />
            <CornerMark src="/corner-neon.svg" opacity="opacity-40" className="bottom-6 right-6 md:bottom-8 md:right-8 rotate-180" />
            <CornerMark src="/corner-neon.svg" opacity="opacity-40" className="bottom-6 left-6 md:bottom-8 md:left-8 -rotate-90" />

            <div className="max-w-7xl mx-auto w-full min-w-0 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start relative z-10">
              
              <div className="min-w-0 lg:col-span-6 flex flex-col gap-6">
                <span className="block max-w-full break-words text-3xl uppercase leading-[0.95] tracking-tight text-white md:text-5xl [overflow-wrap:anywhere]" style={{ fontFamily: 'var(--font-alpha)' }}>
                  Core Infrastructure
                </span>
                
                {content.technologyStack.map((tech) => {
                  const TechIcon = iconMap[tech.icon] || Cpu;
                  return (
                  <motion.div 
                    key={tech.id}
                    onMouseEnter={() => setHoveredTech(tech.id)}
                    className="group min-w-0 border-[3px] border-[#CCFF00] bg-[#CCFF00] p-5 md:p-8 rounded-[2rem] cursor-crosshair hover:bg-[#050505] transition-all duration-300 shadow-[6px_6px_0px_#000] hover:shadow-[10px_10px_0px_#CCFF00] hover:-translate-y-1"
                  >
                    <div className="flex min-w-0 items-center gap-4 md:gap-5 mb-4 md:mb-5">
                      <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center shadow-md border border-black group-hover:border-[#CCFF00] transition-colors">
                        <TechIcon className="w-6 h-6 text-[#CCFF00]" />
                      </div>
                      <h3 className="min-w-0 break-words text-xl uppercase tracking-tight text-black transition-colors group-hover:text-[#CCFF00] md:text-2xl [overflow-wrap:anywhere]" style={{ fontFamily: 'var(--font-alpha)' }}>
                        {tech.title}
                      </h3>
                    </div>
                    <p className="max-w-full break-words text-zinc-900 text-sm md:text-base font-bold leading-relaxed group-hover:text-zinc-300 transition-colors [overflow-wrap:anywhere]" style={{ fontFamily: 'var(--font-roobert)' }}>
                      {tech.desc}
                    </p>
                  </motion.div>
                );})}
              </div>

              <div className="lg:col-span-6 sticky top-32 hidden lg:block">
                <div className="w-full aspect-[4/5] bg-[#0A0A0A] border border-white/10 rounded-[2rem] overflow-hidden relative shadow-[12px_12px_0px_rgba(204,255,0,0.1)] flex items-center justify-center">
                  
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(204,255,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(204,255,0,0.05)_1px,transparent_1px)] bg-[size:2vw_2vw]" />
                  
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute w-[150%] h-[150%] bg-[conic-gradient(from_0deg,transparent_70%,rgba(204,255,0,0.15)_100%)] rounded-full origin-center pointer-events-none"
                  />
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-zinc-950 border-[3px] border-[#CCFF00] flex items-center justify-center shadow-[0_0_80px_rgba(204,255,0,0.2)]">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={hoveredTech || "default"}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {(() => {
                            const hovered = content.technologyStack.find((item) => item.id === hoveredTech);
                            const HoverIcon = hovered ? iconMap[hovered.icon] || Cpu : Zap;
                            return <HoverIcon className="w-14 h-14 text-[#CCFF00]" />;
                          })()}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    <div className="mt-8 flex items-center gap-3 bg-black/80 px-5 py-2.5 rounded-full border border-[#CCFF00]/30 backdrop-blur-sm">
                      <span className="w-3 h-3 rounded-full bg-[#CCFF00] animate-pulse" />
                      <span className="font-mono text-[10px] text-[#CCFF00] uppercase tracking-[0.2em] font-bold">Processing Node Active</span>
                    </div>
                  </div>

                  <div className="absolute top-8 left-8 font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                    Telemetry Stream<br/>
                    <span className="text-white">Connecting...</span>
                  </div>
                  <div className="absolute bottom-8 right-8 font-mono text-[10px] text-zinc-500 uppercase tracking-widest text-right font-bold">
                    Render Output<br/>
                    <span className="text-[#CCFF00]">Optimized</span>
                  </div>
                </div>
              </div>

            </div>
          </section>
        </div>

        <div className="w-full bg-[#050505] p-2 md:p-4">
          <section className="relative w-full max-w-full overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-[#F4F3EF] px-5 py-16 text-zinc-950 sm:px-8 md:rounded-[2rem] md:px-20 md:py-28 lg:px-24">
            <FilmGrain />
            <div className="relative z-10 mx-auto grid w-full max-w-7xl min-w-0 gap-10">
              {content.technologySections.map((section) => (
                <article id={section.id} key={section.id} className="grid scroll-mt-28 min-w-0 max-w-full gap-5 border-b-2 border-black/10 pb-10 last:border-b-0 last:pb-0 lg:grid-cols-[0.42fr_0.58fr]">
                  <h2 className="max-w-full break-words text-[clamp(2rem,10vw,3rem)] uppercase leading-[0.95] tracking-normal text-black md:text-5xl [overflow-wrap:anywhere]" style={{ fontFamily: 'var(--font-alpha)' }}>
                    {section.h2}
                  </h2>
                  <div className="min-w-0 max-w-full space-y-5">
                    {section.content.map((paragraph, index) => (
                      <p key={index} className="max-w-full break-words text-sm font-bold leading-relaxed text-zinc-800 sm:text-base md:text-lg [overflow-wrap:anywhere]">
                        {paragraph}
                      </p>
                    ))}
                    {section.table?.headers?.length > 0 && (
                      <div className="max-w-full overflow-hidden rounded-2xl border-2 border-black bg-white shadow-[6px_6px_0px_#000]">
                        <table className="w-full min-w-0 table-fixed border-collapse text-left">
                          <thead className="bg-black text-[#CCFF00]">
                            <tr>
                              {section.table.headers.map((header) => (
                                <th key={header} className="break-words border-r border-white/10 p-3 text-[9px] font-black uppercase tracking-[0.14em] last:border-r-0 md:p-4 md:text-[10px] [overflow-wrap:anywhere]">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {(section.table.rows || []).map((row, rowIndex) => (
                              <tr key={rowIndex} className="border-t border-black/10">
                                {row.map((cell, cellIndex) => (
                                  <td key={cellIndex} className="break-words border-r border-black/10 p-3 text-xs font-bold leading-relaxed text-zinc-800 last:border-r-0 md:p-4 md:text-sm [overflow-wrap:anywhere]">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* =========================================
            SECTION 3: CTA
            Outer: Black | Inner: Neon Green
            ========================================= */}
        <div className="w-full bg-[#050505] p-2 md:p-4">
          <section className="relative w-full py-20 md:py-32 bg-[#CCFF00] text-zinc-950 overflow-hidden z-10 flex flex-col justify-center rounded-[1.5rem] md:rounded-[2rem] border-4 border-black">
            
            <CornerMark src="/corner-dark.svg" opacity="opacity-40" className="top-6 left-6 md:top-8 md:left-8" />
            <CornerMark src="/corner-dark.svg" opacity="opacity-40" className="top-6 right-6 md:top-8 md:right-8 rotate-90" />
            <CornerMark src="/corner-dark.svg" opacity="opacity-40" className="bottom-6 right-6 md:bottom-8 md:right-8 rotate-180" />
            <CornerMark src="/corner-dark.svg" opacity="opacity-40" className="bottom-6 left-6 md:bottom-8 md:left-8 -rotate-90" />

            <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-5 text-center sm:px-8 md:px-20">
              <h2 className="mb-6 max-w-full break-words text-[clamp(2.2rem,12vw,4rem)] uppercase leading-[0.9] tracking-normal text-black md:text-7xl [overflow-wrap:anywhere]" style={{ fontFamily: 'var(--font-alpha)' }}>
                {content.ctaBlock.headline}
              </h2>
              <p className="mx-auto mb-10 max-w-lg break-words text-sm font-bold leading-relaxed text-zinc-900 sm:text-base md:text-lg [overflow-wrap:anywhere]" style={{ fontFamily: 'var(--font-roobert)' }}>
                {content.ctaBlock.description}
              </p>
              
              <button 
                onClick={() => {
                  if (content.ctaBlock.buttonUrl) {
                    window.location.href = content.ctaBlock.buttonUrl;
                    return;
                  }
                  window.dispatchEvent(new CustomEvent('open-pitchside-modal', { detail: { type: 'waitlist', sourcePlacement: 'Technology page engine CTA', sourceComponent: 'Technology page' } }));
                }}
                className="inline-flex items-center justify-center gap-2 bg-black text-[#CCFF00] px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-zinc-800 transition-colors shadow-[8px_8px_0px_rgba(0,0,0,0.5)] hover:shadow-[10px_10px_0px_rgba(0,0,0,0.6)] hover:-translate-y-1 active:translate-y-0 active:shadow-[4px_4px_0px_rgba(0,0,0,0.8)] duration-200"
                style={{ fontFamily: 'var(--font-roobert)' }}
              >
                {content.ctaBlock.buttonText} <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          </section>
        </div>

        <div className="w-full bg-[#F4F3EF] p-2 md:p-4">
          <section className="relative w-full overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-[#050505] px-5 py-16 text-white sm:px-8 md:rounded-[2rem] md:px-20 md:py-24 lg:px-24">
            <div className="mx-auto grid w-full max-w-7xl min-w-0 gap-8">
              <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#CCFF00]">More to read</p>
                  <h2 className="mt-3 max-w-full break-words text-[clamp(2rem,10vw,4rem)] uppercase leading-[0.9] tracking-normal text-white [overflow-wrap:anywhere]" style={{ fontFamily: 'var(--font-alpha)' }}>
                    Technology and football analysis
                  </h2>
                </div>
              </div>
              <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {displayRelatedItems.map((item) => (
                  <a
                    key={`${item.label}-${item.id}`}
                    href={item.href}
                    className="group flex min-h-[220px] min-w-0 flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-white transition hover:border-[#CCFF00] hover:bg-[#CCFF00] hover:text-black"
                  >
                    <span className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-[#CCFF00] group-hover:text-black">{item.label}</span>
                    <span className="mt-8 block max-w-full break-words text-xl uppercase leading-[0.98] tracking-normal [overflow-wrap:anywhere]" style={{ fontFamily: 'var(--font-alpha)' }}>
                      {item.title}
                    </span>
                    <span className="mt-4 line-clamp-3 max-w-full break-words text-xs font-bold leading-relaxed opacity-70 [overflow-wrap:anywhere]">
                      {item.description}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        </div>

      </div>
    </>
  );
}
