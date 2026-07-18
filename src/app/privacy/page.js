"use client";
import useLenis from "@/lib/useLenis";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft } from "lucide-react";

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
    <Image src={src} alt="Corner Marking" fill className="object-contain" />
  </div>
);

export default function PrivacyPolicy() {
  useLenis();

  return (
    <>
      <div className="flex flex-col w-full font-roobert bg-[#F4F3EF] min-h-screen p-2 md:p-4">
        
        {/* =========================================
            LEGAL DOCUMENT CONTAINER
            Outer: White | Inner: Black
            ========================================= */}
        <section className="relative w-full min-h-[calc(100svh-16px)] md:min-h-[calc(100svh-32px)] bg-[#050505] text-white overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border border-white/5 pt-32 pb-24 md:pt-40 md:pb-32 px-6 md:px-12 lg:px-24">
          
          <FilmGrain />
          <CornerMark src="/corner-neon.svg" opacity="opacity-40" className="top-6 left-6 md:top-8 md:left-8" />
          <CornerMark src="/corner-neon.svg" opacity="opacity-40" className="top-6 right-6 md:top-8 md:right-8 rotate-90" />
          <CornerMark src="/corner-neon.svg" opacity="opacity-40" className="bottom-6 right-6 md:bottom-8 md:right-8 rotate-180" />
          <CornerMark src="/corner-neon.svg" opacity="opacity-40" className="bottom-6 left-6 md:bottom-8 md:left-8 -rotate-90" />

          {/* BACKGROUND TEXTURE */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4vw_4vw] pointer-events-none z-0" />

          <div className="max-w-3xl mx-auto relative z-10">
            
            {/* BACK BUTTON */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: smoothEase }}>
              <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-[#CCFF00] font-bold text-xs uppercase tracking-widest transition-colors mb-12">
                <ArrowLeft className="w-4 h-4" /> Return to Platform
              </Link>
            </motion.div>

            {/* HEADER */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: smoothEase }} className="mb-16 border-b border-white/10 pb-12">
              <div className="w-12 h-12 rounded-xl bg-[#CCFF00]/10 border border-[#CCFF00]/20 flex items-center justify-center mb-6">
                <ShieldAlert className="w-6 h-6 text-[#CCFF00]" />
              </div>
              <h1 className="text-5xl md:text-7xl uppercase tracking-tighter text-white mb-4" style={{ fontFamily: 'var(--font-alpha)' }}>
                Privacy Policy
              </h1>
              <p className="text-[#CCFF00] font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">
                Last updated: May 2026
              </p>
            </motion.div>

            {/* CONTENT */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }}
              className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-widest prose-headings:text-white prose-h2:text-xl prose-h2:mt-12 prose-h2:mb-6 prose-p:text-zinc-400 prose-p:leading-relaxed prose-p:text-sm md:prose-p:text-base prose-li:text-zinc-400 prose-li:text-sm md:prose-li:text-base prose-strong:text-white"
            >
              
              <h2>Who We Are</h2>
              <p>
                Pitchside AI is an AI-powered football highlights platform for amateur and grassroots players across the UK. Our website is located at <strong>pitchside.ai</strong>.
              </p>
              <p>
                If you have any questions about this policy, contact us at: <a href="mailto:dave@pitchside.ai" className="text-[#CCFF00] no-underline hover:underline transition-all">dave@pitchside.ai</a>
              </p>

              <h2>What Data We Collect</h2>
              <p>We collect only the following personal information:</p>
              <ul className="list-disc pl-5 marker:text-[#CCFF00] space-y-2 mb-6">
                <li>Your name</li>
                <li>Your email address</li>
              </ul>
              <p>
                We collect this data when you submit our waiting list or contact form. We also use Google Analytics 4 to understand website usage and improve the site. We do not collect payment information, location data, or any other personal data at this stage.
              </p>

              <h2>Why We Collect It</h2>
              <p>We collect your name and email address solely to:</p>
              <ul className="list-disc pl-5 marker:text-[#CCFF00] space-y-2 mb-6">
                <li>Add you to the Pitchside AI waiting list</li>
                <li>Send you updates about the platform launch</li>
                <li>Respond to any enquiries you send us</li>
              </ul>
              <p>
                We will never use your data for anything else without asking you first.
              </p>

              <h2>Legal Basis for Processing (UK GDPR)</h2>
              <p>
                We process your personal data on the basis of legitimate interest — specifically, to communicate with people who have actively expressed interest in Pitchside AI — and, where applicable, consent given at the point of form submission.
              </p>

              <h2>How We Store Your Data</h2>
              <p>
                Your data is stored securely. We retain your name and email address for as long as necessary to fulfil the purposes above, or until you ask us to delete it.
              </p>
              <p>
                We do not sell, rent, or share your personal data with third parties for marketing purposes.
              </p>

              <h2>Your Rights</h2>
              <p>Under UK GDPR, you have the right to:</p>
              <ul className="list-disc pl-5 marker:text-[#CCFF00] space-y-2 mb-6">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data (&quot;the right to be forgotten&quot;)</li>
                <li>Withdraw consent at any time</li>
                <li>Lodge a complaint with the ICO (Information Commissioner&apos;s Office) at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-[#CCFF00] no-underline hover:underline transition-all">ico.org.uk</a></li>
              </ul>
              <p>
                To exercise any of these rights, email us at: <a href="mailto:hello@pitchside.ai" className="text-[#CCFF00] no-underline hover:underline transition-all">dave@pitchside.ai</a>
              </p>

              <h2>Third-Party Services</h2>
              <p>
                We may use trusted third-party tools (such as an email platform) to store and manage your waiting list data. These providers are bound by their own privacy policies and GDPR-compliant data processing agreements.
              </p>

              <h2>Changes to This Policy</h2>
              <p>
                If we start collecting additional data in the future, we will update this policy and notify waiting list members by email before doing so.
              </p>

            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
