"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X, Send, CheckCircle2 } from 'lucide-react';
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Header() {
  const pathname = usePathname() || '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredPath, setHoveredPath] = useState(null);
  const [headerTheme, setHeaderTheme] = useState('dark'); // 'dark' = green logo, 'light' = black logo

  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: 'waitlist' });
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [submitStatus, setSubmitStatus] = useState('idle'); 

  // --- BULLETPROOF SCROLL & THEME DETECTION ---
  useEffect(() => {
    const handleScroll = () => {
      // 1. Trigger the capsule transformation when scrolled past 50px
      setIsScrolled(window.scrollY > 50);

      // 2. Explicit Section Scanning (Ignores borders/gradients)
      const sections = document.querySelectorAll('section');
      const headerHitZoneY = 60; // The Y-coordinate we check (middle of the header)
      let currentTheme = 'dark'; // Default to dark background (green logo)
      
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        
        // If this specific section is currently sitting under the header
        if (rect.top <= headerHitZoneY && rect.bottom >= headerHitZoneY) {
           // Explicitly check if the section uses your light background class
           if (section.classList.contains('bg-[#F4F3EF]') || section.classList.contains('bg-white')) {
             currentTheme = 'light';
           } else {
             currentTheme = 'dark';
           }
        }
      });
      
      setHeaderTheme(currentTheme);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initialize on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when menus are open
  useEffect(() => {
    if (isMobileMenuOpen || modalConfig.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen, modalConfig.isOpen]);

  const navLinks = [
    { name: 'Technology', path: '/technology' },
    { name: 'Tools', path: '/tools' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const activeHoverPath = hoveredPath ?? pathname;

  const openModal = useCallback((type) => {
    setIsMobileMenuOpen(false);
    setSubmitStatus('idle');
    setModalConfig({ isOpen: true, type });
  }, []);

  const closeModal = useCallback(() => {
    setModalConfig((current) => ({ ...current, isOpen: false }));
    setTimeout(() => {
      setSubmitStatus('idle');
      setFormData({ name: '', email: '' });
    }, 300);
  }, []);

  // --- CUSTOM EVENT LISTENER ---
  useEffect(() => {
    const handleOpenModal = (e) => {
      openModal(e.detail?.type || 'waitlist');
    };
    window.addEventListener('open-pitchside-modal', handleOpenModal);
    return () => window.removeEventListener('open-pitchside-modal', handleOpenModal);
  }, [openModal]);

  // --- HIDE ON ADMIN ROUTE ---
  if (pathname.startsWith('/admin')) return null;

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("submitting");
    
    try {
      await addDoc(collection(db, "leads"), {
        ...formData,
        intent: modalConfig.type,
        message: "Quick capture from UI", 
        createdAt: new Date().toISOString(),
      });
      setSubmitStatus("success");
      setTimeout(() => closeModal(), 2500);
    } catch (error) {
      console.error("Error adding document: ", error);
      setSubmitStatus("error");
    }
  };

  return (
    <>
      {/* HEADER WRAPPER */}
      <div className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 pointer-events-none ${!isScrolled ? 'bg-gradient-to-b from-black/90 via-black/40 to-transparent pb-10' : ''}`}>
        <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 pt-5 md:pt-6 flex items-center justify-between">
          
          {/* 1. LOGO AREA (Anchored Left) */}
          <div className="flex-1 flex justify-start pointer-events-auto">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center hover:opacity-80 transition-opacity">
              
              {/* DESKTOP LOGO (Hidden on Mobile) */}
              <div className="relative hidden md:block w-[130px] h-[28px] md:w-[150px] md:h-[32px] transition-all duration-500">
                <Image 
                  src={headerTheme === 'light' ? "/logoblack.png" : "/logogreen.webp"} 
                  alt="Pitchside AI Logo" 
                  fill 
                  sizes="150px"
                  className="object-contain object-left transition-all duration-500" 
                  priority 
                />
              </div>

              {/* MOBILE LOGO (Hidden on Desktop) */}
              {/* FIXED: Removed the invert class completely to keep original colors */}
              <div className="relative block md:hidden w-[32px] h-[32px] transition-all duration-500">
                <Image 
                  src="/logo.png" 
                  alt="Pitchside AI Icon" 
                  fill 
                  sizes="32px"
                  className="object-contain object-left" 
                  priority 
                />
              </div>

            </Link>
          </div>

          {/* 2. TINY CAPSULE NAVIGATION (Anchored Center) */}
          <div className="flex-shrink-0 flex justify-center pointer-events-auto hidden lg:flex">
            <nav 
              className={`flex items-center justify-center transition-all duration-500 ease-out
                ${isScrolled 
                  ? 'bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-full px-2 py-1.5 shadow-[0_20px_40px_rgba(0,0,0,0.6)] gap-1' 
                  : 'bg-transparent border-transparent px-0 py-0 gap-2'
                }
              `}
              onMouseLeave={() => setHoveredPath(null)}
            >
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  href={link.path} 
                  onMouseEnter={() => setHoveredPath(link.path)}
                  className={`relative group transition-all duration-500 ${isScrolled ? 'px-4 py-2' : 'px-4 py-2'}`}
                >
                  {/* The fluid hover pill inside the capsule */}
                  {activeHoverPath === link.path && (
                    <motion.div 
                      layoutId="hoverNavPill" 
                      className="absolute inset-0 bg-white/10 rounded-full z-0" 
                      transition={{ type: "spring", stiffness: 400, damping: 30 }} 
                    />
                  )}
                  
                  <span className={`relative z-10 text-sm font-medium tracking-wide transition-colors duration-300 ${isActive(link.path) ? "text-white" : "text-white/60 group-hover:text-white"}`}>
                    {link.name}
                  </span>

                  {/* Active neon dot */}
                  {isActive(link.path) && (
                    <motion.div layoutId="activeNavDot" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#CCFF00] rounded-full shadow-[0_0_10px_#CCFF00]" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* 3. BUTTONS AREA (Anchored Right) */}
          <div className="flex-1 hidden md:flex items-center justify-end gap-3 pointer-events-auto">
            <button 
              onClick={() => openModal('waitlist')} 
              className={`bg-transparent border rounded-full font-bold tracking-widest uppercase transition-all duration-500 active:scale-95 whitespace-nowrap px-5 py-2.5 text-xs
                ${headerTheme === 'light' 
                  ? 'border-black/30 text-black hover:border-black hover:bg-black hover:text-[#CCFF00]' 
                  : 'border-white/20 text-white hover:border-[#CCFF00] hover:text-[#CCFF00]'}
              `}
            >
              Join the List
            </button>
            <button 
              onClick={() => openModal('invest')} 
              className={`rounded-full font-bold tracking-widest uppercase transition-all duration-500 shadow-lg active:scale-95 whitespace-nowrap px-6 py-2.5 text-xs
                ${headerTheme === 'light'
                  ? 'bg-black text-white hover:text-[#CCFF00]'
                  : 'bg-white text-black hover:bg-[#CCFF00]'}
              `}
            >
              Invest
            </button>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="lg:hidden flex-1 flex justify-end items-center pointer-events-auto">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`w-10 h-10 backdrop-blur-md border rounded-full flex flex-col items-center justify-center gap-1.5 focus:outline-none relative transition-colors ${headerTheme === 'light' ? 'bg-black/5 border-black/10' : 'bg-black/50 border-white/10'}`}>
              <motion.span animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className={`w-5 h-[2px] block transition-colors ${isMobileMenuOpen ? 'bg-[#CCFF00]' : (headerTheme === 'light' ? 'bg-black' : 'bg-white')}`} />
              <motion.span animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }} className={`w-5 h-[2px] block transition-opacity ${headerTheme === 'light' ? 'bg-black' : 'bg-white'}`} />
              <motion.span animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className={`w-5 h-[2px] block transition-colors ${isMobileMenuOpen ? 'bg-[#CCFF00]' : (headerTheme === 'light' ? 'bg-black' : 'bg-white')}`} />
            </button>
          </div>

        </div>
      </div>

      {/* QUICK CAPTURE MODAL OVERLAY */}
      <AnimatePresence>
        {modalConfig.isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl z-10 overflow-hidden"
            >
              <button onClick={closeModal} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>

              <div className="mb-8">
                <span className="text-[#CCFF00] font-mono text-[10px] tracking-[0.2em] uppercase mb-2 block font-bold">
                  {modalConfig.type === 'invest' ? 'Investor Relations' : 'Early Access'}
                </span>
                <h3 className="text-3xl font-black uppercase tracking-tighter text-white">
                  {modalConfig.type === 'invest' ? 'Want to Invest?' : 'Join the List'}
                </h3>
              </div>

              {submitStatus === "success" ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-16 h-16 bg-[#CCFF00]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#CCFF00]/20">
                    <CheckCircle2 className="w-8 h-8 text-[#CCFF00]" />
                  </div>
                  <h4 className="text-xl font-bold uppercase text-white mb-2">Received.</h4>
                  <p className="text-zinc-400 text-sm">Your details are in our system. We will be in touch shortly.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleModalSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Full Name</label>
                    <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-black border border-white/10 rounded-xl px-5 py-3.5 text-white text-sm focus:outline-none focus:border-[#CCFF00] transition-colors placeholder:text-zinc-700" placeholder="Jane Doe" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Email Address</label>
                    <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="bg-black border border-white/10 rounded-xl px-5 py-3.5 text-white text-sm focus:outline-none focus:border-[#CCFF00] transition-colors placeholder:text-zinc-700" placeholder="jane@example.com" />
                  </div>
                  
                  {submitStatus === "error" && (
                    <div className="text-red-500 text-xs font-bold text-center mt-2">Error connecting to system. Please try again.</div>
                  )}

                  <button disabled={submitStatus === "submitting"} type="submit" className="mt-4 bg-[#CCFF00] text-black w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs flex justify-center items-center gap-2 hover:bg-white transition-all shadow-[0_0_20px_rgba(204,255,0,0.15)] disabled:opacity-50 active:scale-95">
                    {submitStatus === "submitting" ? "Transmitting..." : (modalConfig.type === 'invest' ? "Request Info" : "Secure My Spot")} 
                    {submitStatus !== "submitting" && <Send className="w-4 h-4 ml-1" />}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: "-100%" }} animate={{ opacity: 1, y: "0%" }} exit={{ opacity: 0, y: "-100%" }} transition={{ ease: [0.76, 0, 0.24, 1], duration: 0.6 }} className="fixed inset-0 z-[90] bg-[#050505] flex flex-col pt-32 px-8 pb-12 overflow-y-auto">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:8vw_8vw] pointer-events-none z-0" />
            <nav className="flex flex-col gap-8 mt-8 relative z-10">
              {navLinks.map((link, i) => (
                <motion.div key={link.path} initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ delay: 0.2 + (i * 0.1), type: "spring", stiffness: 300, damping: 24 }}>
                  <Link href={link.path} onClick={() => setIsMobileMenuOpen(false)} className="group flex items-center justify-between">
                    <span className={`text-[10vw] font-black uppercase tracking-tighter transition-colors ${isActive(link.path) ? 'text-[#CCFF00]' : 'text-zinc-600 hover:text-white'}`}>{link.name}</span>
                    {isActive(link.path) && <span className="w-3 h-3 rounded-full bg-[#CCFF00] shadow-[0_0_15px_rgba(204,255,0,0.6)] animate-pulse" />}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ delay: 0.5 }} className="mt-auto pt-12 border-t border-white/10 w-full flex flex-col gap-4 relative z-10">
              <button onClick={() => openModal('waitlist')} className="bg-transparent border-2 border-white/20 text-white flex items-center justify-center gap-2 py-4 rounded-xl font-black uppercase tracking-widest text-xs active:scale-95 transition-all hover:border-[#CCFF00] hover:text-[#CCFF00]">Join the List</button>
              <button onClick={() => openModal('invest')} className="bg-[#CCFF00] text-zinc-950 flex items-center justify-center gap-2 py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(204,255,0,0.2)] active:scale-95 transition-transform">Invest <ArrowUpRight className="w-4 h-4" /></button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
