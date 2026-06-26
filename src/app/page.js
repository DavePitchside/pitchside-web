"use client";

import useLenis from "@/lib/useLenis";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { tools } from "@/lib/tools";

import { 
  Star, ArrowUpRight, ChevronLeft, ChevronRight, Target, CornerDownLeft, 
  Zap, Crosshair, ShieldCheck, Activity, Clock, Quote, PlayCircle, Apple, Video
} from "lucide-react";

// --- ANIMATION CONSTANTS ---
const SMOOTH_EASE = [0.16, 1, 0.3, 1];
const MECH_EASE = [0.76, 0, 0.24, 1];
const seededParticleValue = (index, multiplier, offset = 0) => {
  const raw = Math.sin(index * multiplier + offset) * 10000;
  return raw - Math.floor(raw);
};
const HERO_PARTICLES = Array.from({ length: 30 }).map((_, i) => ({
  id: i,
  size: Number((seededParticleValue(i + 1, 12.9898) * 4 + 2).toFixed(3)),
  x: Number((seededParticleValue(i + 1, 78.233, 1) * 100).toFixed(3)),
  y: Number((seededParticleValue(i + 1, 37.719, 2) * 100).toFixed(3)),
  drift: Number((seededParticleValue(i + 1, 15.157, 3) * 10 - 5).toFixed(3)),
  duration: seededParticleValue(i + 1, 49.417, 4) * 15 + 10,
  delay: seededParticleValue(i + 1, 91.173, 5) * 5,
}));

const HERO_STATS = [
  { label: "100%", sub: "Autonomous AI" },
  { label: "Zero", sub: "Wearables" },
  { label: "Studio", sub: "Highlights" },
];

// --- REUSABLE COMPONENTS ---
const LoadingCurtain = ({ onComplete }) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{ y: "-100%" }}
    transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
    onAnimationComplete={onComplete}
    className="fixed inset-0 z-[9999] bg-[#CCFF00] flex items-center justify-center origin-top transform-gpu will-change-transform"
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: SMOOTH_EASE }}
      className="relative w-24 h-24 md:w-32 md:h-32 transform-gpu"
    >
      <Image src="/logo.png" alt="Pitchside AI" fill className="object-contain drop-shadow-xl" priority />
    </motion.div>
  </motion.div>
);

// OPTIMIZATION: Added transform-gpu and will-change to bake the SVG noise into a hardware layer
const FilmGrain = () => (
  <div 
    className="absolute inset-0 w-full h-full pointer-events-none z-[100] opacity-[0.04] transform-gpu will-change-transform"
    style={{ 
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
    }}
  />
);

const CornerMark = ({ className, src, opacity = "opacity-100" }) => (
  <div className={`absolute w-6 h-6 md:w-10 md:h-10 pointer-events-none z-50 ${opacity} ${className} transform-gpu`}>
    <Image src={src} alt="Corner Marking" fill className="object-contain" />
  </div>
);

const EnhancedPlayerTrackingFrames = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden hidden md:block">
      <motion.div 
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: [0.3, 0.8, 0.3], scale: 1 }} 
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[100px] bottom-[5%] left-[5%] right-[5%] lg:left-[6%] lg:right-[6%] transform-gpu will-change-transform"
      >
        <CornerMark src="/corner-neon.svg" className="-top-6 -left-6 w-10 h-10 md:w-12 md:h-12" opacity="opacity-100" />
        <CornerMark src="/corner-neon.svg" className="-top-6 -right-6 w-10 h-10 md:w-12 md:h-12 rotate-90" opacity="opacity-100" />
        <CornerMark src="/corner-neon.svg" className="-bottom-6 -right-6 w-10 h-10 md:w-12 md:h-12 rotate-180" opacity="opacity-100" />
        <CornerMark src="/corner-neon.svg" className="-bottom-6 -left-6 w-10 h-10 md:w-12 md:h-12 -rotate-90" opacity="opacity-100" />

        <div className="absolute top-2 right-4 bg-[#CCFF00]/15 border-2 border-[#CCFF00]/60 px-3 py-1.5 text-[9px] font-mono text-[#CCFF00] uppercase tracking-[0.2em] backdrop-blur-md shadow-[0_0_20px_rgba(204,255,0,0.3)] rounded-sm transform-gpu">
          <motion.span animate={{ opacity: [0.5, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
            ● TRACKING
          </motion.span>
        </div>

        <div className="absolute bottom-4 left-4 text-[8px] font-mono text-[#CCFF00]/70 uppercase tracking-widest transform-gpu">
          <motion.div animate={{ opacity: [0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
            RANGE: 45m
          </motion.div>
        </div>

        <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-10 md:h-10 transform-gpu">
          <Image src="/Artboard.svg" alt="Center Tracking Artboard" fill className="object-contain" priority />
        </motion.div>
      </motion.div>
    </div>
  );
};

const ScrambleText = ({ text, className, style }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = "!<>-_\\/[]{}—=+*^?#________";
  const intervalRef = useRef(null);

  const scramble = () => {
    let iteration = 0;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDisplayText((prev) =>
        text.split("").map((letter, index) => {
          if (index < iteration) return text[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );
      if (iteration >= text.length) clearInterval(intervalRef.current);
      iteration += 1 / 3; 
    }, 30);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setDisplayText(text);
  };

  return (
    <motion.span 
      onMouseEnter={scramble} 
      onMouseLeave={reset} 
      className={`block cursor-crosshair transition-colors duration-300 transform-gpu ${className}`} 
      style={style}
    >
      {displayText}
    </motion.span>
  );
};

const CinematicParticles = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden transform-gpu">
      {HERO_PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bg-[#CCFF00] rounded-full shadow-[0_0_15px_rgba(204,255,0,0.8)] will-change-transform"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ y: [`${p.y}%`, `${p.y - 20}%`, `${p.y}%`], x: [`${p.x}%`, `${p.x + p.drift}%`, `${p.x}%`], opacity: [0, 0.8, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
};

// --- MAIN HOME PAGE ---
export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeFeature, setActiveFeature] = useState(0);
  const [currentMockup, setCurrentMockup] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useLenis();
  
  const mockupImages = ["/mockup-1.jpg", "/mockup-2.jpg", "/mockup-3.jpg", "/mockup-4.jpg"];

  // Hardware Accelerated Mouse Tracking
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  const maskImage = useMotionTemplate`radial-gradient(circle 350px at ${smoothX}px ${smoothY}px, black 0%, transparent 100%)`;

  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 1000], [0, 200]); 

  useEffect(() => {
    if (isLoading) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [isLoading]);

  useEffect(() => {
    const handleMouseMove = (e) => { 
      mouseX.set(e.clientX); 
      mouseY.set(e.clientY); 
    };
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", checkMobile);
    checkMobile();
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", checkMobile);
    };
  }, [mouseX, mouseY]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentMockup((prev) => (prev + 1) % mockupImages.length), 4000); 
    return () => clearInterval(timer);
  }, [mockupImages.length]);

  const nextMockup = () => setCurrentMockup((prev) => (prev + 1) % mockupImages.length);
  const prevMockup = () => setCurrentMockup((prev) => (prev - 1 + mockupImages.length) % mockupImages.length);

  const getCarouselPosition = (index) => {
    if (index === currentMockup) return "center";
    if (index === (currentMockup - 1 + mockupImages.length) % mockupImages.length) return "left";
    if (index === (currentMockup + 1) % mockupImages.length) return "right";
    return "hidden";
  };

  const features = [
    { id: 0, title: "RECORD.", img: "/mockup-4.jpg", subtitle: "Zero Wearables Required", desc: "Hit record with the full pitch in view. Our state-of-the-art spatial AI tracks every player, ball movement, and key event autonomously." },
    { id: 1, title: "PLAY.", img: "/mockup-2.jpg", subtitle: "Focus on the Game", desc: "Play your best game and have fun. The engine processes the footage in real-time, knowing any moments of magic will be captured safely." },
    { id: 2, title: "REPLAY.", img: "/mockup-3.jpg", subtitle: "Studio-Grade Analysis", desc: "Enjoy post-match analysis with your squad. Generate broadcast-quality highlights, heatmaps, and shareable clips instantly." }
  ];

  return (
    <div className="flex flex-col w-full font-roobert overflow-x-hidden bg-[#050505]">

      <AnimatePresence>
        {isLoading && <LoadingCurtain onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>
      
      {/* =========================================
          SECTION 1: HERO
          ========================================= */}
      <section className="group fixed inset-x-0 top-0 z-0 w-screen h-[100svh] md:h-screen flex flex-col justify-center overflow-hidden bg-[#050505]">
        <h1 className="sr-only">Own the Cage — AI Football Camera &amp; Highlights App for Amateur &amp; Grassroots Players</h1>
        <FilmGrain />
        
        <div className="absolute inset-0 z-0 bg-[#050505]">
          {/* OPTIMIZATION: Hardware accelerated parallax images */}
          <motion.div 
            style={{ y: yParallax, scale: 1.05 }} 
            className="absolute inset-0 w-full h-full transform-gpu will-change-transform"
          >
            <Image src="/1.png" alt="Cinematic Hero Background" fill className="object-cover object-[74%_center] sm:object-[78%_center] md:object-[85%_center] opacity-95 md:opacity-80" priority />
          </motion.div>

          <motion.div 
            style={{ y: yParallax, scale: 1.05, maskImage: maskImage, WebkitMaskImage: maskImage }} 
            className="absolute inset-0 hidden md:block w-full h-full z-10 pointer-events-none transform-gpu will-change-transform"
          >
            <Image src="/1-neon.png" alt="Revealed Neon Background" fill className="object-cover object-[78%_center] md:object-[85%_center] opacity-100" priority />
          </motion.div>
          
          <div className="absolute inset-0 z-20 bg-gradient-to-b from-[#050505]/62 via-[#050505]/10 to-[#050505]/84 md:bg-gradient-to-r md:from-[#050505] md:via-[#050505]/70 md:to-transparent md:w-[70%] pointer-events-none transform-gpu" />
          <div className="absolute inset-0 z-20 bg-gradient-to-b from-[#050505]/42 via-transparent to-[#050505]/42 pointer-events-none transform-gpu" />
          <div className="absolute inset-x-0 top-[29%] z-20 h-px bg-gradient-to-r from-transparent via-[#CCFF00]/30 to-transparent md:hidden" />
          <div className="absolute left-6 right-6 top-[32%] z-20 h-28 rounded-full border border-[#CCFF00]/10 md:hidden" />
          <div className="absolute right-0 top-[12%] z-20 h-[48%] w-24 bg-[#CCFF00]/10 blur-[70px] md:hidden" />
        </div>

        <EnhancedPlayerTrackingFrames />
        <CinematicParticles />

        <div className="absolute inset-x-6 top-24 bottom-7 z-20 pointer-events-none md:hidden">
          <CornerMark src="/corner-neon.svg" className="-top-4 -left-4 w-8 h-8" opacity="opacity-90" />
          <CornerMark src="/corner-neon.svg" className="-top-4 -right-4 w-8 h-8 rotate-90" opacity="opacity-90" />
          <CornerMark src="/corner-neon.svg" className="-bottom-4 -right-4 w-8 h-8 rotate-180" opacity="opacity-90" />
          <CornerMark src="/corner-neon.svg" className="-bottom-4 -left-4 w-8 h-8 -rotate-90" opacity="opacity-90" />
        </div>

        <div className="relative z-30 flex min-h-[100svh] w-full flex-col justify-center px-6 pb-8 pt-24 pointer-events-none md:hidden">
          <div className="pointer-events-auto">
            <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.05, ease: SMOOTH_EASE }} className="relative w-full">
              <ScrambleText text="OWN THE" className="font-alpha text-[clamp(4rem,18vw,5.8rem)] uppercase tracking-normal text-[#CCFF00] drop-shadow-[0_0_60px_rgba(204,255,0,0.28)] leading-[0.82]" style={{ fontFamily: 'var(--font-alpha)' }} />
              <ScrambleText text="PITCH." className="font-alpha text-[clamp(4rem,18vw,5.8rem)] uppercase tracking-normal text-[#CCFF00] drop-shadow-[0_0_60px_rgba(204,255,0,0.28)] leading-[0.82]" style={{ fontFamily: 'var(--font-alpha)' }} />
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.18, ease: SMOOTH_EASE }} className="mt-8 max-w-[20rem] text-sm font-medium leading-relaxed text-zinc-300">
              Capture every moment of your game with AI-powered spatial tracking. No wearables. No setup. Just pure performance data and highlight-reel moments.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.28, ease: SMOOTH_EASE }} className="mt-8 grid w-full max-w-[22rem] grid-cols-3 gap-4">
              {HERO_STATS.map((feat) => (
                <div key={feat.sub} className="min-w-0 border-l-2 border-[#CCFF00] pl-3">
                  <span className="block text-xl font-black leading-none text-white">{feat.label}</span>
                  <span className="mt-2 block break-words font-mono text-[9px] uppercase leading-tight tracking-[0.16em] text-zinc-500">{feat.sub}</span>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.38, ease: SMOOTH_EASE }} className="mt-10 flex w-full max-w-[16rem] flex-col gap-4">
              <button onClick={() => window.dispatchEvent(new CustomEvent('open-pitchside-modal', { detail: { type: 'waitlist' } }))} className="w-full rounded-lg bg-[#CCFF00] px-6 py-4 text-sm font-black uppercase tracking-widest text-black transition-all duration-300 hover:bg-white active:scale-95">
                Join The List
              </button>
              <button onClick={() => window.dispatchEvent(new CustomEvent('open-pitchside-modal', { detail: { type: 'invest' } }))} className="w-full rounded-lg border-2 border-white/30 bg-white/5 px-6 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 hover:border-white/50 hover:bg-white/10 active:scale-95">
                Want To Invest?
              </button>
            </motion.div>
          </div>
        </div>

        <div className="relative z-30 hidden w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 md:flex flex-col justify-center min-h-screen pt-20 pb-10 pointer-events-none">
          <div className="w-full md:w-[60%] flex flex-col leading-[0.9] pointer-events-auto mb-0 md:mb-8">
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: SMOOTH_EASE }}>
              <ScrambleText text="OWN THE" className="font-alpha md:text-[clamp(3.95rem,14vw,9rem)] uppercase tracking-normal md:tracking-tighter text-[#CCFF00] drop-shadow-[0_0_80px_rgba(204,255,0,0.3)] leading-[0.9]" style={{ fontFamily: 'var(--font-alpha)' }} />
            </motion.div>
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.1, ease: SMOOTH_EASE }}>
              <ScrambleText text="CAGE." className="font-alpha md:text-[clamp(3.95rem,14vw,9rem)] uppercase tracking-normal md:tracking-tighter text-[#CCFF00] drop-shadow-[0_0_80px_rgba(204,255,0,0.3)] leading-[0.9]" style={{ fontFamily: 'var(--font-alpha)' }} />
            </motion.div>
          </div>

          <div className="w-full md:contents">
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: SMOOTH_EASE }} className="font-roobert md:text-base text-zinc-300/90 md:max-w-xl mb-8 leading-relaxed pointer-events-auto">
              Capture every moment of your game with AI-powered spatial tracking. No wearables. No setup. Just pure performance data and highlight-reel moments.
            </motion.p>
            
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: SMOOTH_EASE }} className="flex flex-wrap gap-8 mb-10 pointer-events-auto">
              {HERO_STATS.map((feat, i) => (
                <div key={i} className="flex min-w-0 flex-col items-start border-l-2 border-[#CCFF00] pl-3 md:pl-4">
                  <span className="text-white font-bold text-base sm:text-lg md:text-xl leading-none">{feat.label}</span>
                  <span className="text-zinc-500 font-mono text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.12em] md:tracking-widest mt-1 leading-tight break-words">{feat.sub}</span>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4, ease: SMOOTH_EASE }} className="flex w-full max-w-[21.5rem] sm:max-w-none flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 pointer-events-auto">
              <button onClick={() => window.dispatchEvent(new CustomEvent('open-pitchside-modal', { detail: { type: 'waitlist' } }))} className="w-full sm:w-auto bg-[#CCFF00] text-black px-6 sm:px-8 py-4 sm:py-4 rounded-lg font-black uppercase tracking-widest text-xs sm:text-sm hover:bg-white transition-all duration-300 active:scale-95 sm:min-w-[180px]">
                Join The List
              </button>
              <button onClick={() => window.dispatchEvent(new CustomEvent('open-pitchside-modal', { detail: { type: 'invest' } }))} className="w-full sm:w-auto bg-white/5 border-2 border-white/30 text-white px-6 sm:px-8 py-4 sm:py-4 rounded-lg font-bold uppercase tracking-widest text-xs sm:text-sm hover:bg-white/10 hover:border-white/50 transition-all duration-300 active:scale-95 sm:min-w-[212px]">
                Want To Invest?
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================
          SECTION 2
          ========================================= */}
      <div className="relative z-30 mt-[100vh] w-full bg-[#050505]">
        <section className="relative w-full min-h-screen h-auto py-16 md:py-32 bg-[#F4F3EF] text-zinc-950 overflow-hidden z-30 border border-zinc-200 flex flex-col justify-center">
          <FilmGrain />
          <div className="max-w-7xl mx-auto px-6 md:px-20 lg:px-24 flex flex-col lg:flex-row items-center justify-between gap-10 md:gap-16 w-full relative z-10">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: SMOOTH_EASE }} className="w-full lg:w-1/2 relative z-10 flex justify-center lg:justify-start">
              <div className="group relative w-full max-w-[280px] sm:max-w-sm lg:max-w-md aspect-[4/5] bg-zinc-300 rounded-3xl overflow-hidden shadow-2xl border border-white/10 transform-gpu">
                <Image src="/portrait-action.jpg" alt="Action Shot" fill className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110 will-change-transform" />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.1, ease: SMOOTH_EASE }} className="w-full lg:w-1/2 relative z-20 flex flex-col justify-center text-center lg:text-left">
              <h2 className="font-alpha text-[clamp(3.5rem,14vw,8rem)] uppercase leading-[0.8] tracking-tighter text-[#CCFF00] transform-gpu" style={{ fontFamily: 'var(--font-alpha)', WebkitTextStroke: "2px #050505" }}>
                NO ACTION<br /><span className="text-transparent" style={{ WebkitTextStroke: "2px #71717a" }}>MISSED</span>
              </h2>
              
              <div className="mt-6 md:mt-8 w-full flex flex-col items-center lg:items-start mx-auto lg:mx-0">
                <p className="font-roobert text-sm sm:text-base text-zinc-600 font-medium leading-relaxed mb-8 max-w-md">
                  Shots. Goals. Assists. Tackles. Dribbles. Everything captured for your own highlight reel, instantly available to share on your socials.
                </p>

                <ul className="font-roobert grid grid-cols-2 gap-x-2 gap-y-4 mb-8 text-right w-200px max-w-md">
                  {[
                    { icon: Target, label: "GOAL" }, { icon: CornerDownLeft, label: "ASSIST" }, 
                    { icon: Zap, label: "TACKLE" }, { icon: Crosshair, label: "CRITICAL PASS" }, 
                    { icon: ShieldCheck, label: "BALL RECOVERY" }, { icon: Activity, label: "SUCCESSFUL DRIBBLE" }, 
                    { icon: Clock, label: "INTERCEPTIONS" }, { icon: Target, label: "SAVES" }
                  ].map(({ icon: Icon, label }, index) => (
                    <li key={index} className="flex items-center justify-start gap-2 text-zinc-700 hover:text-black transition-colors cursor-default">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-black flex-shrink-0" />
                      <span className="text-[9px] sm:text-[11px] font-bold tracking-tight uppercase">{label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* =========================================
          SECTION 3 & 4
          ========================================= */}
      <div className="w-full bg-[#F4F3EF] flex flex-col">
        <section className="relative w-full min-h-screen h-auto py-24 md:py-32 bg-[#050505] text-white overflow-hidden z-20 flex flex-col justify-center border border-white/5">
          <FilmGrain />
          <div className="max-w-7xl mx-auto px-8 md:px-20 lg:px-24 w-full flex flex-col lg:flex-row gap-12 lg:gap-16 items-center justify-between relative z-10">
            <div className="flex flex-col gap-4 md:gap-8 w-full lg:w-1/2 justify-center order-2 lg:order-1">
              {features.map((feature) => (
                <motion.div key={feature.id} onClick={() => isMobile && setActiveFeature(feature.id)} onMouseEnter={() => !isMobile && setActiveFeature(feature.id)} className={`group cursor-pointer relative py-2 transform-gpu ${isMobile ? 'bg-white/5 border border-white/10 rounded-lg p-4 transition-all' : ''}`}>
                  <motion.div animate={{ height: activeFeature === feature.id ? '100%' : '0%' }} className="absolute left-[-15px] md:left-[-30px] top-0 w-1 bg-[#CCFF00] rounded-full transform-gpu" />
                  <motion.h2 animate={{ color: activeFeature === feature.id ? '#CCFF00' : 'transparent', WebkitTextStroke: activeFeature === feature.id ? '0px' : '2px #3f3f46', x: activeFeature === feature.id ? 10 : 0 }} transition={{ duration: 0.3 }} className="font-alpha text-[clamp(2.5rem,10vw,6.5rem)] uppercase leading-[0.8] tracking-tighter transform-gpu" style={{ fontFamily: 'var(--font-alpha)' }}>
                    {feature.title}
                  </motion.h2>
                  <AnimatePresence mode="wait">
                    {activeFeature === feature.id && (
                      <motion.div initial={{ opacity: 0, height: 0, y: -10 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0, y: -10 }} transition={{ duration: 0.3 }} className="mt-4 md:mt-6 overflow-hidden max-w-md transform-gpu">
                        <h4 className="font-roobert text-white font-bold text-xs md:text-sm uppercase tracking-widest mb-2 flex items-center gap-2"><PlayCircle className="w-4 h-4 text-[#CCFF00]" /> {feature.subtitle}</h4>
                        <p className="font-roobert text-zinc-400 text-sm md:text-base font-medium leading-relaxed">{feature.desc}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            <div className="relative flex items-center justify-center w-full lg:w-1/2 h-[45vh] sm:h-[50vh] md:h-[60vh] order-1 lg:order-2">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[350px] bg-[#CCFF00]/15 blur-[80px] rounded-full pointer-events-none transform-gpu" />
              <AnimatePresence mode="wait">
                <motion.div key={activeFeature} initial={{ opacity: 0, scale: 0.9, y: 20, rotateY: 10 }} animate={{ opacity: 1, scale: 1, y: 0, rotateY: 0 }} exit={{ opacity: 0, scale: 0.9, y: -20, rotateY: -10 }} transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }} className="absolute w-[140px] sm:w-[180px] md:w-[260px] lg:w-[320px] aspect-[1/2] drop-shadow-[0_30px_50px_rgba(0,0,0,0.8)] transform-gpu will-change-transform">
                  <Image src={features[activeFeature].img} alt={features[activeFeature].title} fill className="object-contain" priority />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        <section className="relative w-full min-h-screen h-auto py-24 md:py-32 bg-[#F4F3EF] text-zinc-950 flex flex-col items-center justify-center overflow-hidden z-20 border border-zinc-200">
          <FilmGrain />
          <div className="text-center z-10 px-8 mb-8 md:mb-16 flex-shrink-0">
            <h2 className="font-alpha text-[clamp(2rem,10vw,5.5rem)] uppercase leading-[0.8] tracking-tighter text-[#CCFF00]" style={{ fontFamily: 'var(--font-alpha)', WebkitTextStroke: "1px #050505", textShadow: "2px 2px 0px rgba(0,0,0,0.5)" }}>
              YOUR MATCH STATS &<br className="hidden md:block" /> HIGHLIGHTS APP
            </h2>
            <p className="font-roobert text-[10px] md:text-sm text-zinc-500 font-bold tracking-[0.3em] mt-4 uppercase">Up to 7-A-Side</p>
          </div>

          <div className="relative flex items-center justify-center w-full max-w-6xl px-4 overflow-visible h-[400px] md:h-[600px]">
            <button onClick={prevMockup} className="absolute left-2 sm:left-4 md:left-12 z-40 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border-2 border-black bg-[#CCFF00] text-black shadow-xl hover:bg-white transition-all active:scale-90" aria-label="Previous mockup">
              <ChevronLeft className="w-5 h-5 text-current"/>
            </button>
            
            <div className="relative w-full h-full flex items-center justify-center">
              {mockupImages.map((img, index) => {
                const position = getCarouselPosition(index);
                const variants = {
                  center: { x: "0%", scale: 1, zIndex: 30, opacity: 1 }, left: { x: "-100%", scale: 0.75, zIndex: 20, opacity: 0.5 }, right: { x: "100%", scale: 0.75, zIndex: 20, opacity: 0.5 }, hidden: { x: "0%", scale: 0.6, zIndex: 10, opacity: 0 }
                };
                return (
                  <motion.div key={index} animate={position} variants={variants} transition={{ duration: 0.5, ease: SMOOTH_EASE }} className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-[90%] max-h-[550px] aspect-[1/2] drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] transform-gpu will-change-transform">
                    <Image src={img} alt={`App View ${index}`} fill className="object-contain" />
                  </motion.div>
                );
              })}
            </div>
            
            <button onClick={nextMockup} className="absolute right-2 sm:right-4 md:right-12 z-40 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border-2 border-black bg-[#CCFF00] text-black shadow-xl hover:bg-white transition-all active:scale-90" aria-label="Next mockup">
              <ChevronRight className="w-5 h-5 text-current" />
            </button>
          </div>
        </section>
      </div>

      <div className="w-full bg-[#F4F3EF]">
        <section className="relative w-full h-auto py-20 md:py-28 bg-[#050505] text-white overflow-hidden z-10 flex flex-col justify-center border border-white/5">
          <FilmGrain />
          <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24 w-full relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-10 md:mb-14">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#CCFF00] mb-4">Free Football Tools</p>
                <h2 className="font-alpha text-[clamp(2.5rem,9vw,6rem)] uppercase leading-[0.82] tracking-tight text-white" style={{ fontFamily: 'var(--font-alpha)' }}>
                  Plan the game<br className="hidden md:block" /> before kickoff.
                </h2>
              </div>
              <Link href="/tools" className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-[#CCFF00] px-6 py-4 text-xs font-black uppercase tracking-widest text-black shadow-[4px_4px_0px_#000] transition-transform hover:-translate-y-1">
                Open Tools <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
              {tools.map((tool) => (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group min-h-48 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[4px_4px_0px_#CCFF00] transition-transform hover:-translate-y-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-white">{tool.shortTitle}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-400">{tool.intro}</p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#CCFF00] group-hover:text-white">
                    Use tool <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* =========================================
          SECTION 5
          ========================================= */}
      <div className="w-full bg-[#F4F3EF]">
        <section className="relative w-full min-h-screen h-auto py-24 md:py-32 bg-[#F4F3EF] text-zinc-950 overflow-hidden z-10 flex flex-col justify-center border border-zinc-200">
          <FilmGrain />
          <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24 w-full flex flex-col justify-center">
            <motion.h2 className="font-alpha text-[clamp(2rem,10vw,6.5rem)] uppercase mb-12 md:mb-16 leading-[0.8] tracking-tighter text-[#CCFF00] text-center md:text-left drop-shadow-md transform-gpu" style={{ fontFamily: 'var(--font-alpha)', WebkitTextStroke: "1px #050505" }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: SMOOTH_EASE }}>
              CHEERS FROM<br className="md:hidden" /> OUR FANS...
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                { text: "Finally, an app that gives amateur players pro-level highlights and stats! Can't wait to try it." },
                { text: "This will change the game for 5-a-side leagues—stats, highlights, and leaderboards all in one place!" },
                { text: "Love the idea of sharing my best goals and skills straight to Instagram and TikTok!" }
              ].map((review, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: index * 0.1, ease: SMOOTH_EASE }} className="flex flex-col justify-center bg-[#CCFF00] border-2 md:border-4 border-black rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-[4px_4px_0px_#000] md:shadow-[8px_8px_0px_#CCFF00] hover:-translate-y-1 md:hover:shadow-[12px_12px_0px_#CCFF00] transition-all duration-300 cursor-default transform-gpu">
                  <div className="flex gap-1 mb-4 md:mb-6 text-black">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 md:w-6 md:h-6 fill-current stroke-black stroke-1" />)}
                  </div>
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 w-6 h-6 text-black/10" strokeWidth={1} />
                    <p className="font-roobert text-sm sm:text-base md:text-xl font-bold leading-snug tracking-tight relative z-10 text-black">
                      {review.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
