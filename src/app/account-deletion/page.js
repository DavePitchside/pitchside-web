"use client";

import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { AlertTriangle, Send, CheckCircle2, Smartphone } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SEOUpdater from "@/components/SEOUpdater";
import useLenis from "@/lib/useLenis";

// Neon Corner Marks for the black page background
const CornerMark = ({ className, src, opacity = "opacity-100" }) => (
  <div className={`absolute w-10 h-10 md:w-12 md:h-12 pointer-events-none z-0 ${opacity} ${className}`}>
    <Image src={src} alt="Corner Marking" fill className="object-contain" />
  </div>
);

export default function AccountDeletionPage() {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  // Defaulted to 'apple' since 'website' is removed
  const [platform, setPlatform] = useState("apple"); 
  const [confirmed, setConfirmed] = useState(false);
  const [status, setStatus] = useState("idle"); 

  useLenis();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!confirmed) return alert("You must confirm that you understand the consequences.");
    
    setStatus("submitting");
    try {
      await addDoc(collection(db, "deletions"), {
        email,
        platform,
        reason: reason || "No reason provided",
        status: "pending",
        createdAt: serverTimestamp(),
        requestDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });
      setStatus("success");
    } catch (error) {
      console.error("Error submitting deletion request:", error);
      setStatus("error");
    }
  };

  return (
    <>
   
      
      <SEOUpdater pageId="account-deletion" />
      {/* Main container with deep black bg */}
      <div className="min-h-screen bg-[#050505] font-roobert text-white flex flex-col relative overflow-hidden pt-32 pb-12">
        
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4vw_4vw] pointer-events-none z-0" />
        
        {/* FIXED: Top Neon Corners pushed down to top-24/top-32 so they sit nicely below the global header */}
        <CornerMark src="/corner-neon.svg" opacity="opacity-30" className="top-24 left-8 md:top-32 md:left-12" />
        <CornerMark src="/corner-neon.svg" opacity="opacity-30" className="top-24 right-8 md:top-32 md:right-12 rotate-90" />
        <CornerMark src="/corner-neon.svg" opacity="opacity-30" className="bottom-8 right-8 md:bottom-12 md:right-12 rotate-180" />
        <CornerMark src="/corner-neon.svg" opacity="opacity-30" className="bottom-8 left-8 md:bottom-12 md:left-12 -rotate-90" />

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 md:p-8">

          {/* --- THE SOLID NEON GREEN BOX --- */}
          <div className="w-full max-w-xl bg-[#CCFF00] rounded-[2rem] p-8 md:p-12 shadow-[0_0_80px_rgba(204,255,0,0.15)] relative overflow-hidden text-black mt-4">
            
            {/* Dark Icon Block */}
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-8 shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
              <AlertTriangle className="w-8 h-8 text-[#CCFF00]" />
            </div>

            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4 text-black" style={{ fontFamily: 'var(--font-alpha)' }}>
              Data Deletion Request
            </h1>
            <p className="text-zinc-800 text-sm font-medium leading-relaxed mb-8">
              Use this form to request the permanent deletion of your Pitchside AI account and all associated performance data. <strong className="text-black font-black">This action cannot be undone.</strong>
            </p>

            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-10 text-center bg-black rounded-2xl relative overflow-hidden shadow-2xl">
                <CheckCircle2 className="w-12 h-12 text-[#CCFF00] mb-4" />
                <h3 className="text-xl font-bold uppercase tracking-widest text-white mb-2">Request Received</h3>
                <p className="text-zinc-400 text-sm max-w-xs">Our admin team will process your data deletion within 7-14 business days.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Platform Selector (Now only 2 options) */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black pl-1">Where did you create your account?</label>
                  {/* Changed to grid-cols-2 */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'apple', label: 'Apple', icon: Smartphone },
                      { id: 'google', label: 'Google', icon: Smartphone }
                    ].map(p => {
                      const Icon = p.icon;
                      const isActive = platform === p.id;
                      return (
                        <button 
                          key={p.id} 
                          type="button" 
                          onClick={() => setPlatform(p.id)} 
                          className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-[2px] text-xs font-black transition-all duration-150 
                            ${isActive 
                              ? 'bg-black border-black text-[#CCFF00] shadow-[4px_4px_0px_rgba(0,0,0,0.3)] translate-y-[-2px]' 
                              : 'bg-transparent border-black text-black hover:bg-black/5'}`}
                        >
                          <Icon className="w-5 h-5" /> {p.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black pl-1">Account Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="player@example.com" 
                    className="w-full bg-white border-2 border-black rounded-xl px-5 py-4 text-black text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black transition-all placeholder:text-zinc-500 shadow-[2px_2px_0px_rgba(0,0,0,0.1)]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black pl-1">Reason for deletion (Optional)</label>
                  <textarea 
                    rows="2"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="I no longer play football, etc..." 
                    className="w-full bg-white border-2 border-black rounded-xl px-5 py-4 text-black text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black transition-all placeholder:text-zinc-500 shadow-[2px_2px_0px_rgba(0,0,0,0.1)]"
                  />
                </div>

                {/* Final Confirmation */}
                <label className="flex items-start gap-4 cursor-pointer group mt-4 bg-white/40 p-4 rounded-xl border-2 border-transparent hover:border-black/10 transition-colors">
                  <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                    <input 
                      type="checkbox" 
                      required
                      checked={confirmed}
                      onChange={(e) => setConfirmed(e.target.checked)}
                      className="peer appearance-none w-5 h-5 border-2 border-black rounded bg-white checked:bg-black checked:border-black transition-colors cursor-pointer shadow-sm"
                    />
                    <CheckCircle2 className="absolute w-3 h-3 text-[#CCFF00] opacity-0 peer-checked:opacity-100 pointer-events-none" />
                  </div>
                  <span className="text-xs text-zinc-900 font-bold leading-relaxed">
                    I understand that deleting my account is permanent and will instantly sever my access to all my generated highlights, videos, and stats.
                  </span>
                </label>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={status === "submitting" || !confirmed}
                  className="w-full bg-black text-[#CCFF00] py-4 rounded-xl font-black uppercase tracking-widest text-xs flex justify-center items-center gap-2 hover:bg-zinc-900 transition-all shadow-[6px_6px_0px_rgba(0,0,0,0.3)] disabled:opacity-50 disabled:shadow-none active:scale-95 active:shadow-[2px_2px_0px_rgba(0,0,0,0.3)] active:translate-y-1 mt-4"
                >
                  {status === "submitting" ? "Processing..." : "Submit Deletion Request"} <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
