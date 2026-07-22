"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, BadgeCheck, FileText } from "lucide-react";
import useLenis from "@/lib/useLenis";
import { EEAT_LAST_UPDATED } from "@/lib/eeatPages";

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

export default function EeatPage({ page, isAuthor = false }) {
  useLenis();
  const Icon = isAuthor ? BadgeCheck : FileText;

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F4F3EF] p-2 font-roobert md:p-4">
      <section className="relative min-h-[calc(100svh-16px)] w-full overflow-hidden rounded-[1.5rem] border border-white/5 bg-[#050505] px-6 pb-24 pt-32 text-white md:min-h-[calc(100svh-32px)] md:rounded-[2rem] md:px-12 md:pb-32 md:pt-40 lg:px-24">
        <FilmGrain />
        <CornerMark src="/corner-neon.svg" opacity="opacity-40" className="left-6 top-6 md:left-8 md:top-8" />
        <CornerMark src="/corner-neon.svg" opacity="opacity-40" className="right-6 top-6 rotate-90 md:right-8 md:top-8" />
        <CornerMark src="/corner-neon.svg" opacity="opacity-40" className="bottom-6 right-6 rotate-180 md:bottom-8 md:right-8" />
        <CornerMark src="/corner-neon.svg" opacity="opacity-40" className="bottom-6 left-6 -rotate-90 md:bottom-8 md:left-8" />
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4vw_4vw] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: smoothEase }}>
            <Link href="/" className="mb-12 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 transition-colors hover:text-[#CCFF00]">
              <ArrowLeft className="h-4 w-4" /> Return to Platform
            </Link>
          </motion.div>

          <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: smoothEase }} className="mb-14 border-b border-white/10 pb-10">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-[#CCFF00]/20 bg-[#CCFF00]/10">
              <Icon className="h-6 w-6 text-[#CCFF00]" />
            </div>
            <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#CCFF00]">{page.eyebrow}</p>
            <h1 className="mb-5 text-5xl uppercase leading-[0.9] tracking-tighter text-white md:text-7xl" style={{ fontFamily: "var(--font-alpha)" }}>
              {page.title}
            </h1>
            <p className="max-w-2xl text-base font-medium leading-relaxed text-zinc-400 md:text-lg">{page.description}</p>
            <div className="mt-6 flex flex-wrap gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
              <span>Last updated: {EEAT_LAST_UPDATED}</span>
              {page.role && <span className="text-[#CCFF00]">{page.role}</span>}
            </div>
            {page.profileUrl && (
              <a href={page.profileUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex text-xs font-black uppercase tracking-widest text-[#CCFF00] hover:underline">
                View public profile
              </a>
            )}
          </motion.header>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }} className="space-y-12">
            {page.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="mb-5 text-xl font-black uppercase tracking-widest text-white">{section.heading}</h2>
                {section.body?.map((paragraph) => (
                  <p key={paragraph} className="mb-4 text-sm font-medium leading-relaxed text-zinc-400 md:text-base">{paragraph}</p>
                ))}
                {section.bullets && (
                  <ul className="space-y-3 pl-0">
                    {section.bullets.map((item) => (
                      <li key={item} className="flex gap-3 text-sm font-medium leading-relaxed text-zinc-400 md:text-base">
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
