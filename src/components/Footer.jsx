"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Apple } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { companyInfo } from "@/lib/companyInfo";
import { motion, useScroll, useTransform } from "framer-motion";

const PlayStoreIcon = () => (
  <svg className="w-6 h-6 mb-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 2.5V21.5L18.5 12L3 2.5Z" fill="url(#play-grad-1)"/>
    <path d="M3 2.5L13.5 13L18.5 12L3 2.5Z" fill="url(#play-grad-2)"/>
    <path d="M3 21.5L13.5 11L18.5 12L3 21.5Z" fill="url(#play-grad-3)"/>
    <defs>
      <linearGradient id="play-grad-1" x1="3" y1="2.5" x2="18.5" y2="12" gradientUnits="userSpaceOnUse"><stop stopColor="#00EAFF"/><stop offset="1" stopColor="#008CFF"/></linearGradient>
      <linearGradient id="play-grad-2" x1="3" y1="2.5" x2="18.5" y2="12" gradientUnits="userSpaceOnUse"><stop stopColor="#FF3300"/><stop offset="1" stopColor="#FF008C"/></linearGradient>
      <linearGradient id="play-grad-3" x1="3" y1="21.5" x2="18.5" y2="12" gradientUnits="userSpaceOnUse"><stop stopColor="#FFD500"/><stop offset="1" stopColor="#FF8C00"/></linearGradient>
    </defs>
  </svg>
);

export default function Footer() {
  const pathname = usePathname() || '/';
  const footerRef = useRef(null); // Reference point for our scroll animation
  
  const [socialLinks, setSocialLinks] = useState({
    instagram: "#",
    tiktok: "#",
    x: "#",
    linkedin: "https://www.linkedin.com/in/david-coombs-pitchside/", 
    appStore: "#",
    playStore: "#"
  });

  useEffect(() => {
    const fetchFooterLinks = async () => {
      try {
        const docRef = doc(db, "settings", "footer");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSocialLinks(prev => ({ ...prev, ...docSnap.data() }));
        }
      } catch (error) {
        console.error("Error fetching footer links:", error);
      }
    };
    fetchFooterLinks();
  }, []);

  // --- PREMIUM SCROLL ANIMATION LOGIC ---
  const { scrollYProgress } = useScroll();

  // The Logo scales up, fades in, and slides up smoothly as you scroll down
  const logoScale = useTransform(scrollYProgress, [0.4, 1], [0.8, 1]);
  const logoOpacity = useTransform(scrollYProgress, [0.4, 1], [0, 1]);
  const logoY = useTransform(scrollYProgress, [0.4, 1], [100, 0]);

  const triggerModal = (type, sourcePlacement) => {
    window.dispatchEvent(new CustomEvent('open-pitchside-modal', { detail: { type, sourcePlacement, sourceComponent: 'Footer' } }));
  };

  if (pathname.startsWith('/admin')) return null;

  return (
    <div ref={footerRef} className="w-full bg-[#050505] flex flex-col font-roobert">
      <footer className="w-full bg-[#050505] border border-white/5 relative overflow-hidden flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3vw_3vw] pointer-events-none z-0 transform-gpu" />

        <div className="relative z-10 flex flex-col w-full">
          
          <div className="w-full px-8 md:px-16 pt-16 md:pt-24 pb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            <div className="flex flex-col items-start gap-4">
              <span className="text-[#CCFF00] font-mono text-[10px] font-bold uppercase tracking-widest mb-2">Take Action</span>
              <button onClick={() => triggerModal('waitlist', 'Footer take action join button')} className="text-white text-sm font-bold uppercase tracking-widest hover:text-[#CCFF00] transition-colors">Join the List</button>
              <button onClick={() => triggerModal('invest', 'Footer take action investor relations button')} className="text-white text-sm font-bold uppercase tracking-widest hover:text-[#CCFF00] transition-colors">Investor Relations</button>
            </div>

            <div className="flex flex-col items-start gap-4">
              <span className="text-zinc-500 font-mono text-[10px] font-bold uppercase tracking-widest mb-2">Platform</span>
              <Link href="/technology" className="text-zinc-400 text-sm font-medium hover:text-white transition-colors">Technology</Link>
              <Link href="/tools" className="text-zinc-400 text-sm font-medium hover:text-white transition-colors">Free Football Tools</Link>
              <Link href="/about" className="text-zinc-400 text-sm font-medium hover:text-white transition-colors">About Us</Link>
              <Link href="/blog" className="text-zinc-400 text-sm font-medium hover:text-white transition-colors">Blog & News</Link>
              <Link href="/account-deletion" className="text-zinc-400 text-sm font-medium hover:text-white transition-colors">Account Deletion</Link>
              <Link href="/contact" className="text-zinc-400 text-sm font-medium hover:text-white transition-colors">Contact</Link>
            </div>

            <div className="flex flex-col items-start gap-4">
              <span className="text-zinc-500 font-mono text-[10px] font-bold uppercase tracking-widest mb-2">Legal</span>
              <Link href="/privacy" className="text-zinc-400 text-sm font-medium hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-zinc-400 text-sm font-medium hover:text-white transition-colors">Terms of Service</Link>
            </div>

            <div className="flex flex-col items-start gap-4">
              <span className="text-zinc-500 font-mono text-[10px] font-bold uppercase tracking-widest mb-2">Connect</span>
              <div className="flex flex-col gap-3">
                {socialLinks.instagram && socialLinks.instagram !== "#" && (<a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-zinc-400 text-sm font-medium hover:text-white transition-colors">Instagram</a>)}
                {socialLinks.tiktok && socialLinks.tiktok !== "#" && (<a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="text-zinc-400 text-sm font-medium hover:text-white transition-colors">TikTok</a>)}
                {socialLinks.x && socialLinks.x !== "#" && (<a href={socialLinks.x} target="_blank" rel="noopener noreferrer" className="text-zinc-400 text-sm font-medium hover:text-white transition-colors">X (Twitter)</a>)}
                {socialLinks.linkedin && socialLinks.linkedin !== "#" && (<a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-zinc-400 text-sm font-medium hover:text-white transition-colors">LinkedIn</a>)}
              </div>
            </div>
          </div>

          <div className="px-8 md:px-16 flex flex-wrap items-center gap-4 mb-16">
            <a href={socialLinks.appStore !== "#" ? socialLinks.appStore : "/contact"} target={socialLinks.appStore !== "#" ? "_blank" : "_self"} rel="noopener noreferrer" className="flex items-center justify-center gap-3 bg-black border border-white/10 text-white px-4 py-2.5 rounded-xl hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors w-full sm:w-auto shadow-md">
              <Apple className="w-6 h-6 mb-0.5" fill="currentColor" />
              <div className="text-left flex flex-col"><span className="text-[9px] leading-none text-zinc-400 uppercase tracking-wider">{socialLinks.appStore !== "#" ? "Available on the" : "Coming soon to"}</span><span className="text-[13px] font-bold leading-none mt-1">App Store</span></div>
            </a>
            <a href={socialLinks.playStore !== "#" ? socialLinks.playStore : "/contact"} target={socialLinks.playStore !== "#" ? "_blank" : "_self"} rel="noopener noreferrer" className="flex items-center justify-center gap-3 bg-black border border-white/10 text-white px-4 py-2.5 rounded-xl hover:border-[#CCFF00] transition-colors w-full sm:w-auto shadow-md">
              <PlayStoreIcon />
              <div className="text-left flex flex-col"><span className="text-[9px] leading-none text-zinc-400 uppercase tracking-wider">{socialLinks.playStore !== "#" ? "Available on" : "Coming soon to"}</span><span className="text-[13px] font-bold leading-none mt-1">Google Play</span></div>
            </a>
          </div>

          {/* Animated Giant Logo Bottom Band */}
          <div className="w-full relative px-6 md:px-12 pb-8 flex flex-col items-center">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />
            
            {/* The Logo applies the transforms linked directly to your scroll position */}
            <motion.div 
              style={{ scale: logoScale, opacity: logoOpacity, y: logoY }}
              className="w-full max-w-7xl relative aspect-[5/1] sm:aspect-[6/1] md:aspect-[8/1] lg:aspect-[10/1] mb-8 will-change-transform transform-gpu"
            >
              <Image 
                src="/logogreen.webp" 
                alt="Pitchside AI Logo" 
                fill 
                className="object-contain object-bottom opacity-90 hover:opacity-100 transition-opacity drop-shadow-[0_0_15px_rgba(204,255,0,0.15)]" 
                priority
              />
            </motion.div>
            
            <div className="w-full flex flex-col sm:flex-row justify-between items-center text-zinc-600 text-xs font-medium px-4 gap-4 text-center sm:text-left">
              <span>© {new Date().getFullYear()} {companyInfo.displayName}. All rights reserved.</span>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                <a href={companyInfo.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-zinc-400 transition-colors">
                  Registered in England and Wales No. {companyInfo.companyNumber}
                </a>
                <span className="hidden sm:block w-1 h-1 bg-zinc-700 rounded-full" />
                <span>Designed for the Grassroots.</span>
                <span className="hidden sm:block w-1 h-1 bg-zinc-700 rounded-full" />
                <span className="flex items-center gap-1.5">
                  Platform by <a href="https://klarai.uk" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-[#CCFF00] transition-colors font-bold tracking-widest uppercase text-[10px]">Klar AI</a>
                </span>
              </div>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
