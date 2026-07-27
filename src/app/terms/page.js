"use client";
import useLenis from "@/lib/useLenis";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, ArrowLeft } from "lucide-react";

// --- THEME ASSETS & EFFECTS ---
const smoothEase = [0.16, 1, 0.3, 1];

const FilmGrain = () => (
  <div 
    className="absolute inset-0 w-full h-full pointer-events-none z-[100] opacity-[0.04]"
    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
  />
);

export default function Page() {
  useLenis();

  return (
    
    <div className="flex flex-col w-full font-roobert bg-[#F4F3EF] min-h-screen">
      <section className="relative w-full min-h-[calc(100svh-16px)] md:min-h-[calc(100svh-32px)] bg-[#F4F3EF] text-zinc-950 overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32 px-6 md:px-12 lg:px-24">
        
        <FilmGrain />
        <div className="max-w-3xl mx-auto relative z-10">
          
          {/* BACK BUTTON */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: smoothEase }}>
            <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-[#CCFF00] font-bold text-xs uppercase tracking-widest transition-colors mb-12">
              <ArrowLeft className="w-4 h-4" /> Return to Platform
            </Link>
          </motion.div>

          {/* HEADER */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: smoothEase }} className="mb-16 border-b border-zinc-300 pb-12">
            <div className="w-12 h-12 rounded-xl bg-[#CCFF00] border border-zinc-950 flex items-center justify-center mb-6">
              <FileText className="w-6 h-6 text-zinc-950" />
            </div>
            <h1 className="text-5xl md:text-7xl uppercase tracking-tighter text-zinc-950 mb-4" style={{ fontFamily: 'var(--font-alpha)' }}>
              Terms & Conditions
            </h1>
            <p className="text-[#CCFF00] font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">
              Last updated: May 2026
            </p>
          </motion.div>

          {/* CONTENT */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }}
            className="prose max-w-none prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-widest prose-headings:text-zinc-950 prose-h2:text-xl prose-h2:mt-12 prose-h2:mb-6 prose-p:text-zinc-700 prose-p:leading-relaxed prose-p:text-sm md:prose-p:text-base prose-li:text-zinc-700 prose-li:text-sm md:prose-li:text-base prose-strong:text-zinc-950"
          >
            
            <h2>Overview</h2>
            <p>
              These Terms and Conditions govern your use of the Pitchside AI website at <strong>pitchside.ai</strong>. By accessing the site or submitting your details, you agree to these terms.
            </p>
            <p>If you do not agree, please do not use the site.</p>

            <h2>Who We Are</h2>
            <p>
              Pitchside AI is operated by Dave Coombs. For any queries, contact us at: <a href="mailto:dave@pitchside.ai" className="text-[#CCFF00] no-underline hover:underline transition-all">dave@pitchside.ai</a>
            </p>

            <h2>Use of This Website</h2>
            <p>You may use the Pitchside AI website to learn about our product and join our waiting list. You agree not to:</p>
            <ul className="list-disc pl-5 marker:text-[#CCFF00] space-y-2 mb-6">
              <li>Use the site for any unlawful purpose</li>
              <li>Submit false or misleading information</li>
              <li>Attempt to gain unauthorised access to any part of our systems</li>
              <li>Reproduce or redistribute our content without permission</li>
            </ul>

            <h2>Waiting List</h2>
            <p>
              By submitting your name and email address, you are expressing interest in Pitchside AI and agreeing to receive updates about the platform. You can unsubscribe at any time by clicking the unsubscribe link in any email we send, or by emailing us directly.
            </p>
            <p>
              Joining the waiting list does not guarantee access to the platform, a specific launch date, or any particular pricing.
            </p>

            <h2>Intellectual Property</h2>
            <p>
              All content on this website — including text, design, branding, and imagery — is owned by Pitchside AI and protected by applicable intellectual property laws. You may not copy, reproduce, or redistribute any content without our written permission.
            </p>

            <h2>Disclaimer</h2>
            <p>
              The Pitchside AI website and its content are provided on an &quot;as is&quot; basis. We make no guarantees regarding the availability, accuracy, or completeness of the site. We reserve the right to make changes to the site or these terms at any time without prior notice.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Pitchside AI shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website.
            </p>

            <h2>Governing Law</h2>
            <p>
              These Terms and Conditions are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>

            <h2>Changes to These Terms</h2>
            <p>
              We may update these Terms and Conditions from time to time. Continued use of the site after changes are posted constitutes your acceptance of the revised terms.
            </p>

          </motion.div>
        </div>
      </section>
    </div>
  );
}
