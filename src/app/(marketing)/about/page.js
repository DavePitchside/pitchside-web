"use client";
import useLenis from "@/lib/useLenis";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Plus, Video, BarChart2, Share2, Users, Minus, ArrowUpRight } from "lucide-react";

// --- THEME ASSETS & EFFECTS ---
const smoothEase = [0.16, 1, 0.3, 1];

const FilmGrain = () => (
  <div 
    className="absolute inset-0 w-full h-full pointer-events-none z-[100] opacity-[0.04]"
    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
  />
);

const CornerMark = ({ className, src, opacity = "opacity-100" }) => (
  <div className={`absolute w-6 h-6 md:w-10 md:h-10 pointer-events-none z-50 ${opacity} ${className}`}>
    <Image src={src} alt="Corner Marking" fill className="object-contain object-center" />
  </div>
);

// Tactical Pitch Overlay 
const TacticalPitch = () => (
  <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.15] overflow-hidden">
    <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-[#CCFF00] -translate-x-1/2" />
    <div className="absolute top-1/2 left-1/2 w-[50vw] max-w-[600px] aspect-square border-[2px] border-[#CCFF00] rounded-full -translate-x-1/2 -translate-y-1/2" />
    <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-[#CCFF00] rounded-full -translate-x-1/2 -translate-y-1/2" />
    <div className="absolute top-0 left-1/2 w-[40vw] max-w-[400px] h-[15vh] border-b-[2px] border-l-[2px] border-r-[2px] border-[#CCFF00] -translate-x-1/2" />
    <div className="absolute bottom-0 left-1/2 w-[40vw] max-w-[400px] h-[15vh] border-t-[2px] border-l-[2px] border-r-[2px] border-[#CCFF00] -translate-x-1/2" />
  </div>
);

const LinkedinIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function AboutPage() {
  
  const [openFaq, setOpenFaq] = useState(null);

  useLenis();
  
  // Parallax Scroll Hook for the Massive Hero Text
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 1000], [0, 300]);

  const faqs = [
    { q: "What is Pitchside AI?", a: "Pitchside AI is an AI-powered platform that automatically generates highlight reels and performance statistics for amateur and grassroots footballers across the UK. Using machine learning, it captures every goal, save, and tackle – so no great moment is ever lost after the final whistle." },
    { q: "Who is Pitchside AI designed for?", a: "Pitchside AI is built for amateur and grassroots players – Sunday league teams, 5-a-side regulars, and anyone who plays for the love of the game. It is not for professional clubs, who already have dedicated media teams. It is for everyone else." },
    { q: "How does the AI highlight reel work?", a: "Our AI analyses match footage to automatically identify key moments – goals, assists, saves, tackles – and assembles personalised highlight reels for each player. No manual editing. No hours of scrubbing through video. Just your best moments, ready to share." },
    { q: "Who founded Pitchside AI?", a: "Pitchside AI was founded by Dave Coombs, a UK-based marketing professional and lifelong amateur footballer. Dave taught himself machine learning and built the platform from the ground up during nights and weekends, driven by a personal frustration with brilliant football moments going unrecorded." }
  ];

  return (
    <>
      <div className="flex flex-col w-full font-roobert" style={{ fontFamily: 'var(--font-roobert)' }}>
        
        {/* =========================================
            SECTION 1: THE "JUUN.J" HERO
            Outer: Black | Inner: White
            ========================================= */}
        <div className="w-full bg-[#050505] p-2 md:p-4">
          <section className="relative w-full h-[calc(100svh-16px)] md:h-[calc(100svh-32px)] overflow-hidden bg-[#F4F3EF] rounded-[1.5rem] md:rounded-[2rem] border border-white/5">
            <FilmGrain />
            <TacticalPitch />
            
            {/* FIXED CORNERS: Top corners pushed down to top-[90px] */}
            <CornerMark src="/corner-dark.svg" opacity="opacity-40" className="top-[90px] left-6 md:left-8" />
            <CornerMark src="/corner-dark.svg" opacity="opacity-40" className="top-[90px] right-6 md:right-8 rotate-90" />
            <CornerMark src="/corner-dark.svg" opacity="opacity-40" className="bottom-6 right-6 md:bottom-8 md:right-8 rotate-180" />
            <CornerMark src="/corner-dark.svg" opacity="opacity-40" className="bottom-6 left-6 md:bottom-8 md:left-8 -rotate-90" />

            {/* 1. MASSIVE BACKGROUND TEXT (Neon Green with Thick Black Stroke) */}
            <div className="absolute top-[18%] md:top-[20%] left-0 w-full flex justify-center z-10 pointer-events-none select-none">
              <motion.h1 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: smoothEase }}
                className="text-[26vw] md:text-[22vw] text-[#CCFF00] uppercase leading-[0.75] tracking-tighter m-0 p-0 drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]"
                style={{ 
                  fontFamily: 'var(--font-alpha)', 
                  y: parallaxY, 
                  WebkitTextStroke: "4px #050505" 
                }}
              >
                OUR STORY
              </motion.h1>
            </div>

            {/* 2. CENTER PORTRAIT (Overlapping Text, Pure Cutout, Bottom Aligned) */}
            <motion.a 
              href="https://www.linkedin.com/in/david-coombs-pitchside/" target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: smoothEase }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] sm:w-[450px] md:w-[550px] lg:w-[650px] h-[70%] md:h-[80%] z-40 group block"
            >
              <Image 
                src="/davidcoombs-cutout.png"
                alt="Dave Coombs" 
                fill 
                sizes="(max-width: 639px) 90vw, (max-width: 767px) 450px, (max-width: 1023px) 550px, 650px"
                className="object-contain object-bottom transition-transform duration-700 group-hover:scale-[1.02]" 
                priority 
              />
              {/* Hover overlay indicator */}
              <div className="absolute inset-x-0 bottom-12 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="bg-black text-[#CCFF00] font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-full flex items-center gap-2 shadow-2xl border border-[#CCFF00]/30">
                  <LinkedinIcon className="w-4 h-4" /> Connect
                </span>
              </div>
            </motion.a>

            {/* 3. LEFT FLANKING CONTENT (Bottom Left) */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }}
              className="absolute bottom-8 md:bottom-24 left-6 md:left-12 lg:left-24 z-50 w-full max-w-[200px] md:max-w-[280px] pointer-events-auto"
            >
              <div className="flex flex-col gap-2 md:gap-4 bg-[#F4F3EF]/60 backdrop-blur-md p-4 rounded-xl border border-black/10 shadow-xl">
                <p className="text-xs md:text-sm font-bold text-zinc-500 uppercase tracking-widest" style={{ fontFamily: 'var(--font-alpha)' }}>The Catalyst</p>
                <p className="text-sm md:text-xl font-bold text-black leading-snug">
                  &quot;I remember thinking there has to be a better way. A way we could all relive these moments.&quot;
                </p>
              </div>
            </motion.div>

            {/* 4. RIGHT FLANKING CONTENT (Middle Right) */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4, ease: smoothEase }}
              className="absolute top-[35%] md:top-[45%] right-6 md:right-12 lg:right-24 z-50 w-full max-w-[180px] md:max-w-[320px] text-right md:text-left pointer-events-auto"
            >
              <div className="flex flex-col gap-2 md:gap-4 items-end md:items-start bg-[#F4F3EF]/60 backdrop-blur-md p-4 rounded-xl border border-black/10 shadow-xl">
                <h3 className="text-xl md:text-3xl lg:text-4xl uppercase tracking-tighter text-black leading-[0.9]" style={{ fontFamily: 'var(--font-alpha)' }}>
                  A MOMENT WORTH<br/>REMEMBERING
                </h3>
                <p className="text-xs md:text-base font-medium text-zinc-700 leading-relaxed hidden md:block">
                  Every amateur footballer knows the feeling. You&apos;ve just scored the goal of your life. The lads go wild. Then, 24 hours later, it&apos;s already fading.
                </p>
                <a href="#full-story" className="inline-flex items-center gap-1 md:gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-black hover:text-[#CCFF00] transition-colors group mt-1 md:mt-2 bg-black px-4 py-2 rounded-lg text-white">
                  Read the story <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
              </div>
            </motion.div>

          </section>
        </div>

        {/* =========================================
            SECTION 2: THE ORIGIN & TRACTION
            Outer: White | Inner: Dark
            ========================================= */}
        <div id="full-story" className="w-full bg-[#F4F3EF] p-2 md:p-4">
          <section className="relative w-full min-h-[calc(100svh-16px)] h-auto py-24 md:py-32 bg-[#0A0A0A] text-white overflow-hidden z-20 flex flex-col justify-center rounded-[1.5rem] md:rounded-[2rem] border border-white/5 px-8 md:px-20 lg:px-24">
            <FilmGrain />
            <CornerMark src="/corner-neon.svg" opacity="opacity-40" className="top-6 left-6 md:top-8 md:left-8" />
            <CornerMark src="/corner-neon.svg" opacity="opacity-40" className="top-6 right-6 md:top-8 md:right-8 rotate-90" />
            <CornerMark src="/corner-neon.svg" opacity="opacity-40" className="bottom-6 right-6 md:bottom-8 md:right-8 rotate-180" />
            <CornerMark src="/corner-neon.svg" opacity="opacity-40" className="bottom-6 left-6 md:bottom-8 md:left-8 -rotate-90" />

            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
              
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: smoothEase }} className="flex flex-col gap-6">
                <span className="text-zinc-500 font-mono text-[10px] tracking-[0.2em] uppercase block font-bold">The Origin</span>
                <h2 className="text-4xl md:text-6xl uppercase tracking-tighter leading-[0.9] text-[#CCFF00]" style={{ fontFamily: 'var(--font-alpha)' }}>
                  FRUSTRATION BRED<br />INNOVATION.
                </h2>
                
                <div className="text-zinc-400 text-sm md:text-base font-medium leading-relaxed space-y-6 mt-4">
                  <p>That frustration of losing moments is where Pitchside AI was born. Dave had played casually for years before the game became a full obsession. But every great moment disappeared the second the final whistle blew. Goals. Saves. Howlers for the ages. Gone.</p>
                  <p>Dave isn&apos;t a lifelong engineer or a Silicon Valley veteran. He&apos;s a <strong className="text-white font-black">marketing professional with a lifelong passion for football</strong> who, at 30, decided to stop waiting for someone else to build the tool he needed.</p>
                  <p>With no formal machine learning background, Dave spent nights and weekends teaching himself AI. He leaned on a decade of relationships with talented collaborators to bring the vision to life.</p>
                </div>

                <div className="mt-4">
                  <a href="https://www.linkedin.com/in/david-coombs-pitchside/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#CCFF00] text-black px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white transition-colors shadow-md active:scale-95 w-fit">
                    <LinkedinIcon className="w-5 h-5" /> Connect with Dave
                  </a>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }} className="flex flex-col gap-8">
                <div className="bg-black/50 border-2 border-white/10 p-8 md:p-12 rounded-[2rem] shadow-2xl backdrop-blur-sm">
                  <span className="text-[#CCFF00] font-mono text-[10px] tracking-[0.2em] uppercase mb-8 block font-bold">Early traction</span>
                  
                  <div className="space-y-8">
                    <div>
                      <span className="block text-5xl md:text-7xl text-white mb-2" style={{ fontFamily: 'var(--font-alpha)' }}>250+</span>
                      <span className="text-xs text-zinc-500 font-bold uppercase tracking-wide">Waiting list sign-ups in the first week</span>
                    </div>
                    <div className="w-full h-px bg-white/10" />
                    <div>
                      <span className="block text-5xl md:text-7xl text-white mb-2" style={{ fontFamily: 'var(--font-alpha)' }}>1 yr</span>
                      <span className="text-xs text-zinc-500 font-bold uppercase tracking-wide">Of nights & weekends building the engine</span>
                    </div>
                    <div className="w-full h-px bg-white/10" />
                    <div>
                      <span className="block text-5xl md:text-7xl text-white mb-2" style={{ fontFamily: 'var(--font-alpha)' }}>1st</span>
                      <span className="text-xs text-zinc-500 font-bold uppercase tracking-wide">Autonomous AI platform for UK grassroots</span>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </section>
        </div>

        {/* =========================================
            SECTION 3: MISSION GRID
            Outer: Black | Inner: Neon Green
            ========================================= */}
        <div className="w-full bg-[#050505] p-2 md:p-4">
          <section className="relative w-full py-24 md:py-32 bg-[#CCFF00] text-zinc-950 overflow-hidden z-10 flex flex-col justify-center rounded-[1.5rem] md:rounded-[2rem] border-4 border-black">
            <CornerMark src="/corner-dark.svg" opacity="opacity-40" className="top-6 left-6 md:top-8 md:left-8" />
            <CornerMark src="/corner-dark.svg" opacity="opacity-40" className="top-6 right-6 md:top-8 md:right-8 rotate-90" />
            <CornerMark src="/corner-dark.svg" opacity="opacity-40" className="bottom-6 right-6 md:bottom-8 md:right-8 rotate-180" />
            <CornerMark src="/corner-dark.svg" opacity="opacity-40" className="bottom-6 left-6 md:bottom-8 md:left-8 -rotate-90" />

            <div className="max-w-7xl mx-auto px-8 md:px-20 lg:px-24 w-full flex flex-col">
              
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <span className="text-zinc-700 font-mono text-[10px] tracking-[0.2em] uppercase mb-4 block font-bold">Our mission</span>
                <h2 className="text-4xl md:text-6xl lg:text-7xl uppercase tracking-tighter mb-6 leading-[0.9] text-black" style={{ fontFamily: 'var(--font-alpha)' }}>Every player deserves their moment.</h2>
                <p className="text-zinc-800 text-sm md:text-lg font-bold leading-relaxed mb-12 max-w-3xl">Professional footballers have their every touch analysed. Pitchside AI exists to give the Sunday league defender, the 5-a-side keeper, and the casual midfielder that exact same experience.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {[
                    { icon: Video, title: "Automatic Highlights", desc: "AI analyses your match footage and assembles a personalised highlight reel automatically." },
                    { icon: BarChart2, title: "Real Player Stats", desc: "Goals, assists, key moments – tracked automatically for definitive proof of your performance." },
                    { icon: Share2, title: "Built for Sharing", desc: "Designed for the group chat, with shareable clips and player moments being tested during private beta." },
                    { icon: Users, title: "Built for Grassroots", desc: "From Sunday leagues to casual kickabouts – made for the millions who play for the love of the game." }
                  ].map((card, i) => {
                    const Icon = card.icon; 
                    return (
                      <motion.div key={i} whileHover={{ y: -5 }} className="bg-white border-4 border-black p-8 rounded-[1.5rem] shadow-[6px_6px_0px_#000] hover:shadow-[10px_10px_0px_#000] transition-all cursor-default">
                        <div className="w-14 h-14 rounded-xl bg-[#CCFF00] border-2 border-black flex items-center justify-center mb-6 shadow-sm">
                          <Icon className="w-7 h-7 text-black" />
                        </div>
                        <h3 className="text-2xl uppercase tracking-tight mb-3 text-black" style={{ fontFamily: 'var(--font-alpha)' }}>{card.title}</h3>
                        <p className="text-zinc-700 font-medium text-sm leading-relaxed">{card.desc}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

            </div>
          </section>
        </div>

        {/* =========================================
            SECTION 4: FAQ & CTA
            Outer: White | Inner: Black
            ========================================= */}
        <div className="w-full bg-[#F4F3EF] p-2 md:p-4">
          <section className="relative w-full py-24 md:py-32 bg-[#050505] text-white overflow-hidden z-10 flex flex-col justify-center rounded-[1.5rem] md:rounded-[2rem] border border-white/5">
            <FilmGrain />
            <CornerMark src="/corner-neon.svg" opacity="opacity-40" className="top-6 left-6 md:top-8 md:left-8" />
            <CornerMark src="/corner-neon.svg" opacity="opacity-40" className="top-6 right-6 md:top-8 md:right-8 rotate-90" />
            <CornerMark src="/corner-neon.svg" opacity="opacity-40" className="bottom-6 right-6 md:bottom-8 md:right-8 rotate-180" />
            <CornerMark src="/corner-neon.svg" opacity="opacity-40" className="bottom-6 left-6 md:bottom-8 md:left-8 -rotate-90" />

            <div className="max-w-4xl mx-auto px-8 md:px-20 lg:px-24 w-full flex flex-col">
              
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <span className="text-[#CCFF00] font-mono text-[10px] tracking-[0.2em] uppercase mb-4 block font-bold text-center">System Specs</span>
                <h2 className="text-4xl md:text-6xl uppercase tracking-tighter mb-12 leading-[0.9] text-white text-center" style={{ fontFamily: 'var(--font-alpha)' }}>Frequently Asked Questions</h2>
                
                <div className="flex flex-col border-t-2 border-white/10">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b-2 border-white/10">
                      <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full py-6 md:py-8 flex items-center justify-between text-left text-white hover:text-[#CCFF00] transition-colors focus:outline-none group">
                        <span className="text-base md:text-xl font-bold pr-8 tracking-tight uppercase" style={{ fontFamily: 'var(--font-roobert)' }}>{faq.q}</span>
                        <motion.div animate={{ rotate: openFaq === index ? 180 : 0 }}>
                          {openFaq === index ? <Minus className="w-6 h-6 shrink-0 text-[#CCFF00]" /> : <Plus className="w-6 h-6 shrink-0 text-zinc-500 group-hover:text-[#CCFF00] transition-colors" />}
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {openFaq === index && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <p className="pb-8 text-zinc-400 font-medium leading-relaxed pr-8 text-sm md:text-base">{faq.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-24 text-center border border-[#CCFF00]/20 bg-[#CCFF00]/5 p-10 md:p-16 rounded-[2rem] relative overflow-hidden">
                <div className="absolute inset-0 bg-[#CCFF00]/10 blur-[80px] pointer-events-none rounded-full" />
                <div className="relative z-10">
                  <h2 className="text-4xl md:text-6xl uppercase tracking-tighter mb-4 leading-[0.85] text-white" style={{ fontFamily: 'var(--font-alpha)' }}>Your moment is waiting</h2>
                  <p className="text-sm md:text-lg font-medium text-zinc-400 mb-10 max-w-lg mx-auto">Join thousands of amateur players who are done letting their best moments fade into memory.</p>
                  
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('open-pitchside-modal', { detail: { type: 'waitlist', sourcePlacement: 'About page final CTA', sourceComponent: 'About page' } }))}
                    className="inline-flex items-center gap-2 bg-[#CCFF00] text-black px-8 py-4 md:py-5 rounded-xl font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-white transition-colors shadow-[0_0_30px_rgba(204,255,0,0.3)] active:scale-95"
                  >
                    Join the Waiting List <ArrowUpRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>

            </div>
          </section>
        </div>

      </div>
    </>
  );
}
