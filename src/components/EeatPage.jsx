"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BadgeCheck, FileText } from "lucide-react";
import useLenis from "@/lib/useLenis";
import { EEAT_LAST_UPDATED } from "@/lib/eeatPages";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const smoothEase = [0.16, 1, 0.3, 1];

const FilmGrain = () => (
  <div
    className="absolute inset-0 h-full w-full pointer-events-none z-[100] opacity-[0.04]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }}
  />
);

const CornerMark = ({ className, src, opacity = "opacity-100" }) => (
  <div className={`absolute h-6 w-6 md:h-10 md:w-10 pointer-events-none z-50 ${opacity} ${className}`}>
    <Image src={src} alt="Corner Marking" fill className="object-contain" />
  </div>
);

export default function EeatPage({ page, isAuthor = false, documentStyle = false }) {
  useLenis();
  const [cmsContent, setCmsContent] = useState(null);
  useEffect(() => {
    let active = true;
    const documentId = page.canonical?.split("/").filter(Boolean).at(-1);
    if (!documentId) return undefined;
    getDoc(doc(db, "pages", documentId))
      .then((snapshot) => {
        if (active && snapshot.exists()) setCmsContent(snapshot.data());
      })
      .catch(() => {});
    return () => { active = false; };
  }, [page.canonical]);

  const contentBlocks = cmsContent?.contentBlocks || [];
  const cmsSections = contentBlocks.reduce((sections, block) => {
    if (block.type === "h2") return [...sections, { heading: block.content, body: [], bullets: [] }];
    const current = sections.at(-1);
    if (!current) return sections;
    if (block.type === "paragraph" && block.content) current.body.push(block.content);
    if (block.type === "list") current.bullets.push(...(block.items || []));
    return sections;
  }, []);
  const displayPage = cmsContent && contentBlocks.length
    ? {
        ...page,
        title: cmsContent.heroH1 || cmsContent.title || page.title,
        eyebrow: cmsContent.badge || page.eyebrow,
        description: cmsContent.intro || cmsContent.metaDescription || page.description,
        sections: cmsSections,
      }
    : page;
  const Icon = isAuthor ? BadgeCheck : FileText;
  const isInternalProfileUrl = displayPage.profileUrl?.startsWith("/");
  const surfaceClasses = documentStyle ? "bg-[#F4F3EF] text-zinc-950" : "bg-[#050505] text-white";
  const borderClass = documentStyle ? "border-zinc-200" : "border-white/5";
  const cornerAsset = documentStyle ? "/corner-dark.svg" : "/corner-neon.svg";
  const gridClass = "bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]";
  const mutedText = documentStyle ? "text-zinc-700" : "text-zinc-400";
  const headingText = documentStyle ? "text-zinc-950" : "text-white";

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F4F3EF] font-roobert">
      <section className={`relative min-h-[calc(100svh-16px)] w-full overflow-hidden border ${borderClass} ${surfaceClasses} px-6 pb-24 pt-32 md:min-h-[calc(100svh-32px)] md:px-12 md:pb-32 md:pt-40 lg:px-24`}>
        <FilmGrain />
        {!documentStyle && <>
          <CornerMark src={cornerAsset} opacity="opacity-40" className="left-6 top-6 md:left-8 md:top-8" />
          <CornerMark src={cornerAsset} opacity="opacity-40" className="right-6 top-6 rotate-90 md:right-8 md:top-8" />
          <CornerMark src={cornerAsset} opacity="opacity-40" className="bottom-6 right-6 rotate-180 md:bottom-8 md:right-8" />
          <CornerMark src={cornerAsset} opacity="opacity-40" className="bottom-6 left-6 -rotate-90 md:bottom-8 md:left-8" />
        </>}
        {!documentStyle && <div className={`absolute inset-0 z-0 ${gridClass} bg-[size:4vw_4vw] pointer-events-none`} />}

        <div className="relative z-10 mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: smoothEase }}>
            <Link href="/" className="mb-12 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 transition-colors hover:text-[#CCFF00]">
              <ArrowLeft className="h-4 w-4" /> Return to Platform
            </Link>
          </motion.div>

          <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: smoothEase }} className={`mb-14 border-b ${documentStyle ? "border-zinc-300" : "border-white/10"} pb-10`}>
            <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl border ${documentStyle ? "border-zinc-950 bg-[#CCFF00]" : "border-[#CCFF00]/20 bg-[#CCFF00]/10"}`}>
              <Icon className={`h-6 w-6 ${documentStyle ? "text-zinc-950" : "text-[#CCFF00]"}`} />
            </div>
            <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#CCFF00]">{displayPage.eyebrow}</p>
            <h1 className={`mb-5 text-5xl uppercase leading-[0.9] tracking-tighter ${headingText} md:text-7xl`} style={{ fontFamily: "var(--font-alpha)" }}>
              {displayPage.title}
            </h1>
            <p className={`max-w-2xl text-base font-medium leading-relaxed ${mutedText} md:text-lg`}>{displayPage.description}</p>
            <div className="mt-6 flex flex-wrap gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
              <span>Last updated: {EEAT_LAST_UPDATED}</span>
              {displayPage.role && <span className="text-[#CCFF00]">{displayPage.role}</span>}
            </div>
            {displayPage.profileUrl && (
              isInternalProfileUrl ? (
                <Link href={displayPage.profileUrl} className="mt-6 inline-flex text-xs font-black uppercase tracking-widest text-[#CCFF00] hover:underline">
                  View public profile
                </Link>
              ) : (
                <a href={displayPage.profileUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex text-xs font-black uppercase tracking-widest text-[#CCFF00] hover:underline">
                  View public profile
                </a>
              )
            )}
          </motion.header>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }} className="space-y-12">
            {displayPage.sections.map((section) => (
              <section key={section.heading}>
                <h2 className={`mb-5 text-xl font-black uppercase tracking-widest ${headingText}`}>{section.heading}</h2>
                {section.body?.map((paragraph) => (
                  <p key={paragraph} className={`mb-4 text-sm font-medium leading-relaxed ${mutedText} md:text-base`}>{paragraph}</p>
                ))}
                {section.bullets && (
                  <ul className="space-y-3 pl-0">
                    {section.bullets.map((item) => (
                      <li key={item} className={`flex gap-3 text-sm font-medium leading-relaxed ${mutedText} md:text-base`}>
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#CCFF00]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
