"use client";

import React, { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import { ChevronDown, ArrowLeft, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SchemaMarkup from "@/components/SchemaMarkup";
import useLenis from "@/lib/useLenis";

const customEase = [0.16, 1, 0.3, 1];

export default function DynamicSEOPage(props) {
  const params = use(props.params);
  const slug = params.slug;

  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);
  const [dataSource, setDataSource] = useState(null); // "pages" | "posts"
  const [isNotFound, setIsNotFound] = useState(false);

  // --- LENIS SMOOTH SCROLL INIT ---
  const lenisRef = useLenis();

  // --- READING PROGRESS BAR HOOKS ---
  const { scrollYProgress, scrollY } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // --- PARALLAX TRANSFORMS (Fixed Hero Depth) ---
  // Because the hero is fixed, we drive parallax purely from scrollY.
  // The content slides over the hero, so we animate the hero contents 
  // to create depth as the white layer covers it.
  const heroContentY = useTransform(scrollY, [0, 1200], [0, 150]);
  const heroContentOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroContentScale = useTransform(scrollY, [0, 800], [1, 0.9]);
  
  const glowX = useTransform(scrollY, [0, 1200], [0, -100]);
  const glowY = useTransform(scrollY, [0, 1200], [0, 60]);
  const glowScale = useTransform(scrollY, [0, 1000], [1, 1.4]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "pages"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setPageData(querySnapshot.docs[0].data());
          setDataSource("pages");
        } else {
          const qPost = query(collection(db, "posts"), where("slug", "==", slug));
          const queryPostSnapshot = await getDocs(qPost);
          if (!queryPostSnapshot.empty) {
            setPageData(queryPostSnapshot.docs[0].data());
            setDataSource("posts");
          } else {
            setIsNotFound(true);
          }
        }
      } catch (error) {
        console.error("Error loading page:", error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchData();
  }, [slug]);

  if (isNotFound) notFound();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-zinc-800 border-t-[#CCFF00] animate-spin" />
      </div>
    );
  }

  if (!pageData) return null;

  // --- EXTRACT TABLE OF CONTENTS ---
  const tocItems = pageData.contentBlocks?.filter(block => block.type === 'h2' || block.type === 'h3') || [];

  const scrollToElement = (id) => {
    const element = document.getElementById(id);
    if (element && lenisRef.current) {
      lenisRef.current.scrollTo(element, { offset: -100, lerp: 0.05 });
    } else if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const hasMedia = !!pageData.heroBackground || !!pageData.primaryImage;
  const mediaSrc = pageData.heroBackground || pageData.primaryImage;
  const isVideo = hasMedia && (mediaSrc.match(/\.(mp4|webm|ogg)/i) || mediaSrc.includes('video'));

  return (
    <main className="relative flex flex-col w-full font-roobert overflow-x-hidden bg-[#050505] text-zinc-900 selection:bg-[#CCFF00] selection:text-black">
      <SchemaMarkup data={pageData} type="WebPage" url={`/${slug}`} />

      {/* =========================================
          RIGHT-SIDE READING PROGRESS BAR
          ========================================= */}
      <div className="fixed top-0 right-0 w-1.5 md:w-2 h-full bg-zinc-800 z-[9000]">
        <motion.div 
          className="w-full bg-[#CCFF00] origin-top"
          style={{ scaleY, height: "100%" }}
        />
      </div>
     
      {/* =========================================
          FIXED PARALLAX HERO (LOCKED TO VIEWPORT)
          position: fixed keeps this hero pinned. 
          It never moves. The content below has 
          margin-top: 100vh so it starts exactly 
          after the viewport, then scrolls OVER 
          this layer due to higher z-index.
          ========================================= */}
      <header className="fixed top-0 left-0 w-full h-screen bg-[#050505] overflow-hidden flex flex-col items-center justify-center text-center z-0 px-6">
        
        {/* Decorative background glow with parallax */}
        <motion.div 
          className="absolute top-[-10%] right-10 w-[600px] h-[600px] bg-[#CCFF00]/15 blur-[150px] rounded-full pointer-events-none"
          style={{ x: glowX, y: glowY, scale: glowScale }}
        />

        {/* Hero content with parallax drift + fade as content covers it */}
        <motion.div 
          className="max-w-[1000px] mx-auto relative z-10 flex flex-col items-center"
          style={{ 
            y: heroContentY, 
            opacity: heroContentOpacity, 
            scale: heroContentScale 
          }}
        >
          {dataSource === "posts" && (
            <Link href="/blog" className="inline-flex items-center text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 hover:text-[#CCFF00] transition-colors mb-12">
              <ArrowLeft className="w-4 h-4 mr-3" /> Return to Journal
            </Link>
          )}
          
          <div className="flex items-center justify-center gap-4 text-[10px] font-mono tracking-[0.2em] uppercase mb-8">
            <span className="bg-[#CCFF00] text-black px-4 py-1.5 rounded-full font-bold">{pageData.category || "Editorial"}</span>
            <span className="text-zinc-500">{pageData.date || "Recent"}</span>
          </div>
            
          <motion.h1 
            initial={{ y: 30, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ duration: 1, ease: customEase }}
            className="font-alpha text-[clamp(2.5rem,6vw,6rem)] uppercase tracking-tighter text-[#CCFF00] leading-[0.9] mb-8 text-balance drop-shadow-2xl"
            style={{ fontFamily: 'var(--font-alpha)' }}
          >
            {pageData.heroH1 || pageData.title}
          </motion.h1>

          {pageData.metaDescription && (
            <motion.p
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ duration: 1, delay: 0.1, ease: customEase }}
              className="text-zinc-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl"
            >
              {pageData.metaDescription}
            </motion.p>
          )}
        </motion.div>
      </header>

      {/* =========================================
          SLIDING CONTENT AREA (OVERLAPS FIXED HERO)
          margin-top: 100vh pushes this down exactly 
          one screen so it starts after the fixed hero.
          z-20 sits it above the hero. Rounded top 
          corners + shadow create the "card sliding 
          over" physical illusion.
          ========================================= */}
      <div className="relative z-20 w-full bg-white rounded-t-[2.5rem] md:rounded-t-[4rem] shadow-[0_-20px_60px_rgba(0,0,0,0.6)] pt-16 md:pt-24 pb-32 px-6 md:px-12 lg:px-24 mt-[100vh]">
        
        {/* Subtle top indicator bar */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-zinc-200 rounded-full" />

        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 relative mt-8">

          {/* LEFT SIDEBAR: Table of Contents */}
          {tocItems.length > 0 && (
            <aside className="hidden lg:block w-[280px] flex-shrink-0">
              <div className="sticky top-32">
                <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#CCFF00] mb-6 border-b border-zinc-200 pb-4">
                  Contents
                </span>
                <ul className="space-y-4">
                  {tocItems.map((item, idx) => (
                    <li key={idx} className={`${item.type === 'h3' ? 'ml-4' : ''}`}>
                      <button 
                        onClick={() => scrollToElement(item.id)}
                        className="text-left text-sm font-medium text-zinc-500 hover:text-black hover:translate-x-1 transition-all duration-300"
                      >
                        {item.content}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}

          {/* RIGHT COLUMN: Main Article Body */}
          <article className="w-full max-w-[800px] mx-auto lg:mx-0">
            
            {/* Hero Image inside content area */}
            {hasMedia && (
              <motion.div
                initial={{ opacity: 0, y: 40 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 1, ease: customEase }}
                className="w-full aspect-video rounded-3xl overflow-hidden bg-zinc-100 mb-16 relative shadow-xl"
              >
                {isVideo ? (
                  <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                    <source src={mediaSrc} />
                  </video>
                ) : (
                  <Image src={mediaSrc} alt="Hero Content" fill priority className="object-cover" />
                )}
              </motion.div>
            )}

            {/* Neon Green TL;DR Box */}
            {pageData.tldrPoints && pageData.tldrPoints.length > 0 && pageData.tldrPoints[0] !== "" && (
              <div className="bg-[#CCFF00]/5 border-[1.5px] border-[#CCFF00] rounded-3xl p-8 md:p-10 mb-16 shadow-lg shadow-[#CCFF00]/5">
                <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-900 mb-6 font-bold flex items-center gap-3">
                  <Zap className="w-4 h-4 text-[#CCFF00] fill-[#CCFF00]" /> Executive Summary
                </h3>
                <ul className="space-y-4">
                  {pageData.tldrPoints.map((point, i) => (
                    point && (
                      <li key={i} className="flex items-start gap-4 text-zinc-800 text-lg font-medium leading-relaxed">
                        <span dangerouslySetInnerHTML={{ __html: point }} />
                      </li>
                    )
                  ))}
                </ul>
              </div>
            )}

            {pageData.aeoQuickAnswer && (
              <div className="text-2xl md:text-3xl font-light text-zinc-900 leading-snug mb-16 border-l-[3px] border-[#CCFF00] pl-8 py-2 bg-gradient-to-r from-[#CCFF00]/10 to-transparent">
                <p dangerouslySetInnerHTML={{ __html: pageData.aeoQuickAnswer }}></p>
              </div>
            )}

            <div className="flex flex-col space-y-6 text-lg md:text-xl text-zinc-700 font-light leading-relaxed">
              {pageData.contentBlocks?.map((block) => {
                
                if (block.type === 'image' && block.content) {
                  return (
                    <div key={block.id} className="my-16 -mx-4 md:-mx-12 rounded-3xl overflow-hidden relative aspect-video bg-zinc-100 shadow-md">
                      <Image src={block.content} alt="Article media" fill className="object-cover" />
                    </div>
                  );
                }
                
                if (block.type === 'h2' && block.content) {
                  return <h2 id={block.id} key={block.id} className="font-alpha text-3xl md:text-4xl uppercase tracking-tighter text-zinc-900 mt-20 mb-6 scroll-mt-32" style={{ fontFamily: 'var(--font-alpha)' }}>{block.content}</h2>;
                }
                
                if (block.type === 'h3' && block.content) {
                  return <h3 id={block.id} key={block.id} className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900 mt-12 mb-4 scroll-mt-32">{block.content}</h3>;
                }
                
                if (block.type === 'paragraph' && block.content) {
                  return <p key={block.id} dangerouslySetInnerHTML={{ __html: block.content }}></p>;
                }
                
                if (block.type === 'list' && block.items.length > 0) {
                  return (
                    <ul key={block.id} className="space-y-4 my-8 pl-4">
                      {block.items.map((item, idx) => (
                        item && (
                          <li key={idx} className="flex items-start gap-4 text-zinc-700">
                            <span className="text-[#CCFF00] font-mono text-xl font-bold leading-none">/</span>
                            <span dangerouslySetInnerHTML={{ __html: item }}></span>
                          </li>
                        )
                      ))}
                    </ul>
                  );
                }
                
                if (block.type === 'table' && block.headers.length > 0) {
                  return (
                    <div key={block.id} className="w-full overflow-x-auto my-16 rounded-2xl border border-zinc-200 bg-[#FAFAFA]">
                      <table className="w-full min-w-[600px] text-left border-collapse">
                        <thead>
                          <tr className="border-b border-zinc-200 bg-zinc-100">
                            {block.headers.map((th, i) => (
                              <th key={i} className={`p-5 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-900 font-bold ${i === 0 ? 'w-1/3' : 'text-center'}`}>
                                {th}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {block.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="border-b border-zinc-100 last:border-0 hover:bg-white transition-colors">
                              {row.cells?.map((td, cIdx) => (
                                <td key={cIdx} className={`p-5 font-light text-zinc-700 text-base ${cIdx !== 0 && 'text-center'}`}>
                                  <span dangerouslySetInnerHTML={{ __html: td }}></span>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }
                return null;
              })}
            </div>

            {/* --- FAQS IN CONTENT --- */}
            {pageData.faqs && pageData.faqs.length > 0 && pageData.faqs[0].question !== "" && (
              <section className="mt-24 pt-16 border-t border-zinc-200">
                <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-12">Frequently Asked Questions</h2>
                <div className="space-y-2">
                  {pageData.faqs.map((faq, index) => (
                    faq.question && (
                      <div key={index} className="border-b border-zinc-200">
                        <button 
                          onClick={() => setActiveFaq(activeFaq === index ? null : index)} 
                          className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
                        >
                          <span className="font-bold text-lg md:text-xl text-zinc-900 pr-8 group-hover:text-[#CCFF00] transition-colors duration-300">{faq.question}</span>
                          <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform duration-500 flex-shrink-0 ${activeFaq === index ? "rotate-180 text-zinc-900" : ""}`} />
                        </button>
                        <AnimatePresence>
                          {activeFaq === index && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                              <p className="pb-8 text-zinc-600 font-light leading-relaxed pr-8" dangerouslySetInnerHTML={{ __html: faq.answer }}></p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  ))}
                </div>
              </section>
            )}

            {/* --- CTA BLOCK IN CONTENT --- */}
            {pageData.ctaBlock?.headline && (
              <div className="bg-[#050505] text-white p-12 md:p-16 rounded-[2rem] text-center my-24 relative overflow-hidden isolate shadow-2xl">
                <div className="absolute inset-0 bg-[#CCFF00]/10 blur-[100px] rounded-full pointer-events-none" />
                <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-none" style={{ fontFamily: 'var(--font-alpha)' }}>{pageData.ctaBlock.headline}</h3>
                <p className="text-lg font-light mb-10 max-w-md mx-auto text-zinc-400">{pageData.ctaBlock.description}</p>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('open-pitchside-modal', { detail: { type: 'waitlist' } }))}
                  className="inline-block bg-[#CCFF00] text-black text-[11px] font-bold uppercase tracking-[0.2em] px-10 py-5 rounded-full hover:bg-white transition-colors"
                >
                  {pageData.ctaBlock.buttonText || "Take Action"}
                </button>
              </div>
            )}
          </article>

        </div>
      </div>
    </main>
  );
}
