"use client";
import useLenis from "@/lib/useLenis";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, ScanEye, Zap, Server, ShieldCheck, ArrowUpRight } from "lucide-react";

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

  useLenis();

  const techStack = [
    {
      id: "vision",
      icon: ScanEye,
      title: "Spatial Computer Vision",
      desc: "Our proprietary optical engine maps the 3D space of the pitch using standard 2D smartphone footage. It tracks player vectors, ball trajectory, and spatial relationships without requiring calibrated multi-camera setups."
    },
    {
      id: "ai",
      icon: Cpu,
      title: "Autonomous Detection",
      desc: "Trained on thousands of hours of grassroots football. The neural network recognizes biomechanical patterns to instantly categorize tackles, shots, saves, and passes with 98% accuracy."
    },
    {
      id: "hardware",
      icon: ShieldCheck,
      title: "Zero Hardware Required",
      desc: "No GPS vests. No expensive camera rigs. The Pitchside engine processes all telemetry natively via the software layer, democratizing pro-level analytics for every player."
    },
    {
      id: "cloud",
      icon: Server,
      title: "Edge-to-Cloud Pipeline",
      desc: "Footage is pre-processed on-device to reduce payload size, then beamed to our high-performance cloud GPUs where the heavy computational rendering creates broadcast-quality highlights in minutes."
    }
  ];

  return (
    <>
      <div className="flex flex-col w-full font-roobert" style={{ fontFamily: 'var(--font-roobert)' }}>
        
        {/* =========================================
            SECTION 1: HERO
            Outer: Black | Inner: White
            ========================================= */}
        <div className="w-full bg-zinc-950 p-2 md:p-4">
          <section className="relative w-full min-h-[calc(100svh-16px)] md:min-h-[calc(100svh-32px)] flex flex-col justify-center overflow-hidden bg-[#F4F3EF] pt-[120px] md:pt-[130px] pb-16 px-8 md:px-20 lg:px-24 rounded-[1.5rem] md:rounded-[2rem] border border-white/5">
            <FilmGrain />
            
            <CornerMark src="/corner-dark.svg" opacity="opacity-40" className="top-[90px] left-6 md:left-10" />
            <CornerMark src="/corner-dark.svg" opacity="opacity-40" className="top-[90px] right-6 md:right-10 rotate-90" />
            <CornerMark src="/corner-dark.svg" opacity="opacity-40" className="bottom-6 right-6 md:bottom-10 md:right-10 rotate-180" />
            <CornerMark src="/corner-dark.svg" opacity="opacity-40" className="bottom-6 left-6 md:bottom-10 md:left-10 -rotate-90" />

            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:4vw_4vw] pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12 w-full">
              <div className="max-w-3xl">
                <span className="text-zinc-500 font-mono text-[10px] tracking-[0.2em] uppercase mb-6 block font-bold">System Architecture</span>
                
                <h1 
                  className="text-[14vw] sm:text-6xl md:text-8xl lg:text-[10rem] uppercase leading-[0.85] tracking-tighter mb-8"
                  style={{ fontFamily: 'var(--font-alpha)' }}
                >
                  <span style={{ color: "#CCFF00", WebkitTextStroke: "2.5px #050505" }}>THE</span><br />
                  <span className="text-white" style={{ WebkitTextStroke: "2.5px #050505", textShadow: "6px 6px 0px rgba(0,0,0,0.15)" }}>ENGINE.</span>
                </h1>

                <p className="text-zinc-800 text-base md:text-xl font-bold max-w-xl leading-relaxed">
                  We stripped out the vests, the expensive camera rigs, and the manual editing. What remains is a pure, software-driven spatial tracking pipeline built for the grassroots game.
                </p>
              </div>

              {/* Data Blocks - Light Theme (Alignment Fixed) */}
              <div className="flex items-center gap-4 w-full sm:w-auto mt-8 lg:mt-0">
                <div className="flex-1 sm:w-[150px] flex flex-col items-start justify-center bg-white border-2 border-zinc-900 p-4 sm:p-6 rounded-2xl shadow-[4px_4px_0px_#000]">
                  <div className="text-[#CCFF00] text-5xl md:text-6xl mb-1 leading-none tracking-tighter" style={{ fontFamily: 'var(--font-alpha)', WebkitTextStroke: "1.5px #000" }}>98%</div>
                  <div className="text-zinc-900 font-mono text-[8px] sm:text-[9px] font-black uppercase tracking-[0.15em] leading-[1.4] mt-2">
                    Event<br />Accuracy
                  </div>
                </div>
                <div className="flex-1 sm:w-[150px] flex flex-col items-start justify-center bg-white border-2 border-zinc-900 p-4 sm:p-6 rounded-2xl shadow-[4px_4px_0px_#000]">
                  <div className="text-[#CCFF00] text-5xl md:text-6xl mb-1 leading-none tracking-tighter" style={{ fontFamily: 'var(--font-alpha)', WebkitTextStroke: "1.5px #000" }}>&lt;3m</div>
                  <div className="text-zinc-900 font-mono text-[8px] sm:text-[9px] font-black uppercase tracking-[0.15em] leading-[1.4] mt-2">
                    Processing<br />Time
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* =========================================
            SECTION 2: TECHNICAL DEEP DIVE
            Outer: White | Inner: Black
            ========================================= */}
        <div className="w-full bg-[#F4F3EF] p-2 md:p-4">
          <section className="relative w-full min-h-[calc(100svh-16px)] md:min-h-[calc(100svh-32px)] bg-[#050505] text-white overflow-hidden z-20 flex flex-col justify-center rounded-[1.5rem] md:rounded-[2rem] border border-zinc-200 py-24 md:py-32 px-8 md:px-20 lg:px-24">
            
            <CornerMark src="/corner-neon.svg" opacity="opacity-40" className="top-6 left-6 md:top-8 md:left-8" />
            <CornerMark src="/corner-neon.svg" opacity="opacity-40" className="top-6 right-6 md:top-8 md:right-8 rotate-90" />
            <CornerMark src="/corner-neon.svg" opacity="opacity-40" className="bottom-6 right-6 md:bottom-8 md:right-8 rotate-180" />
            <CornerMark src="/corner-neon.svg" opacity="opacity-40" className="bottom-6 left-6 md:bottom-8 md:left-8 -rotate-90" />

            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start relative z-10">
              
              <div className="lg:col-span-6 flex flex-col gap-6">
                <span className="text-white text-4xl md:text-5xl uppercase tracking-tight mb-4 block" style={{ fontFamily: 'var(--font-alpha)' }}>
                  Core Infrastructure
                </span>
                
                {techStack.map((tech) => (
                  <motion.div 
                    key={tech.id}
                    onMouseEnter={() => setHoveredTech(tech.id)}
                    className="group border-[3px] border-[#CCFF00] bg-[#CCFF00] p-6 md:p-8 rounded-[2rem] cursor-crosshair hover:bg-[#050505] transition-all duration-300 shadow-[6px_6px_0px_#000] hover:shadow-[10px_10px_0px_#CCFF00] hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-4 md:gap-5 mb-4 md:mb-5">
                      <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center shadow-md border border-black group-hover:border-[#CCFF00] transition-colors">
                        <tech.icon className="w-6 h-6 text-[#CCFF00]" />
                      </div>
                      <h3 className="text-xl md:text-2xl uppercase tracking-tight text-black group-hover:text-[#CCFF00] transition-colors" style={{ fontFamily: 'var(--font-alpha)' }}>
                        {tech.title}
                      </h3>
                    </div>
                    <p className="text-zinc-900 text-sm md:text-base font-bold leading-relaxed group-hover:text-zinc-300 transition-colors" style={{ fontFamily: 'var(--font-roobert)' }}>
                      {tech.desc}
                    </p>
                  </motion.div>
                ))}
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
                          {hoveredTech === "vision" ? <ScanEye className="w-14 h-14 text-[#CCFF00]" /> :
                           hoveredTech === "ai" ? <Cpu className="w-14 h-14 text-[#CCFF00]" /> :
                           hoveredTech === "hardware" ? <ShieldCheck className="w-14 h-14 text-[#CCFF00]" /> :
                           hoveredTech === "cloud" ? <Server className="w-14 h-14 text-[#CCFF00]" /> :
                           <Zap className="w-14 h-14 text-[#CCFF00]" />}
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

        {/* =========================================
            SECTION 3: CTA
            Outer: Black | Inner: Neon Green
            ========================================= */}
        <div className="w-full bg-[#050505] p-2 md:p-4">
          <section className="relative w-full py-24 md:py-32 bg-[#CCFF00] text-zinc-950 overflow-hidden z-10 flex flex-col justify-center rounded-[1.5rem] md:rounded-[2rem] border-4 border-black">
            
            <CornerMark src="/corner-dark.svg" opacity="opacity-40" className="top-6 left-6 md:top-8 md:left-8" />
            <CornerMark src="/corner-dark.svg" opacity="opacity-40" className="top-6 right-6 md:top-8 md:right-8 rotate-90" />
            <CornerMark src="/corner-dark.svg" opacity="opacity-40" className="bottom-6 right-6 md:bottom-8 md:right-8 rotate-180" />
            <CornerMark src="/corner-dark.svg" opacity="opacity-40" className="bottom-6 left-6 md:bottom-8 md:left-8 -rotate-90" />

            <div className="max-w-5xl mx-auto px-8 md:px-20 w-full flex flex-col items-center text-center relative z-10">
              <h2 className="text-4xl sm:text-5xl md:text-7xl uppercase tracking-tighter mb-6 leading-[0.85] text-black" style={{ fontFamily: 'var(--font-alpha)' }}>
                Experience the Engine
              </h2>
              <p className="text-base md:text-lg font-bold text-zinc-900 mb-10 max-w-lg mx-auto" style={{ fontFamily: 'var(--font-roobert)' }}>
                Get early access to the Pitchside AI beta and start generating pro-level highlights instantly.
              </p>
              
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-pitchside-modal', { detail: { type: 'waitlist' } }))}
                className="inline-flex items-center justify-center gap-2 bg-black text-[#CCFF00] px-8 md:px-10 py-4 md:py-5 rounded-xl font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-zinc-800 transition-colors shadow-[8px_8px_0px_rgba(0,0,0,0.5)] hover:shadow-[10px_10px_0px_rgba(0,0,0,0.6)] hover:-translate-y-1 active:translate-y-0 active:shadow-[4px_4px_0px_rgba(0,0,0,0.8)] duration-200"
                style={{ fontFamily: 'var(--font-roobert)' }}
              >
                Request Access <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          </section>
        </div>

      </div>
    </>
  );
}
