"use client";
import useLenis from "@/lib/useLenis";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Send } from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Subtle noise texture to keep it feeling premium
const FilmGrain = () => (
  <div 
    className="absolute inset-0 w-full h-full pointer-events-none z-[100] mix-blend-multiply opacity-[0.05]"
    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
  />
);

const CornerMark = ({ className, src = "/corner-dark.svg", opacity = "opacity-100" }) => (
  <div className={`absolute w-8 h-8 md:w-12 md:h-12 pointer-events-none ${opacity} ${className}`}>
    <Image src={src} alt="Corner Marking" fill className="object-contain object-center" />
  </div>
);

export default function ContactPage() {
  const [intent, setIntent] = useState("waitlist"); // 'waitlist' or 'invest'
  const [status, setStatus] = useState("idle"); // 'idle', 'submitting', 'success', 'error'
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  useLenis();

  const smoothEase = [0.22, 1, 0.36, 1];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    
    try {
      // Pushing data to the 'leads' collection in Firebase
      await addDoc(collection(db, "leads"), {
        ...formData,
        intent,
        sourcePage: "/contact",
        sourceUrl: typeof window !== "undefined" ? window.location.href : "/contact",
        sourcePlacement: "Contact page form",
        sourceComponent: "ContactPage",
        createdAt: new Date().toISOString(),
      });
      setStatus("success");
    } catch (error) {
      console.error("Error adding document: ", error);
      setStatus("error");
    }
  };

  return (
    <>

      {/* OUTER PADDING WRAPPER: Matches site-wide Nixtio framing */}
      <div className="w-full min-h-screen bg-zinc-950 p-2 md:p-4 flex flex-col">
        
        {/* MAIN CONTENT CONTAINER: The Brutalist #CCFF00 Design */}
        <main className="w-full flex-1 flex items-center justify-center bg-[#CCFF00] text-zinc-950 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)] pt-32 pb-24 px-6 md:px-12">
          <FilmGrain />
          
          {/* Brutalist Camera Crop Marks (Fixed Top Positioning) */}
          <CornerMark src="/corner-dark.svg" opacity="opacity-40" className="top-[90px] left-8 hidden md:block" />
          <CornerMark src="/corner-dark.svg" opacity="opacity-40" className="top-[90px] right-8 rotate-90 hidden md:block" />
          <CornerMark src="/corner-dark.svg" opacity="opacity-40" className="bottom-8 right-8 rotate-180 hidden md:block" />
          <CornerMark src="/corner-dark.svg" opacity="opacity-40" className="bottom-8 left-8 -rotate-90 hidden md:block" />

          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 relative z-10">
            
            {/* Left: Huge Typography */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: smoothEase }}
              className="flex flex-col justify-center text-center lg:text-left"
            >
              <h1 className="text-[5rem] sm:text-[6.5rem] lg:text-[7.5rem] xl:text-[9rem] font-black uppercase tracking-tighter leading-[0.85] text-zinc-950">
                GET IN<br />TOUCH.
              </h1>
              <p className="text-lg md:text-xl font-bold mt-8 max-w-md mx-auto lg:mx-0 text-zinc-800 leading-relaxed">
                Whether you are looking to invest, run a league, or just want early access. Drop us a line.
              </p>
            </motion.div>

            {/* Right: Functional Brutalist Form */}
            <div className="flex flex-col justify-center w-full max-w-xl mx-auto lg:mx-0">
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="border-4 border-zinc-950 rounded-2xl p-10 md:p-16 text-center flex flex-col items-center bg-transparent backdrop-blur-sm"
                  >
                    <div className="w-20 h-20 bg-zinc-950 rounded-2xl flex items-center justify-center mb-8">
                      <CheckCircle2 className="w-10 h-10 text-[#CCFF00]" />
                    </div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 text-zinc-950">Transmission Received</h3>
                    <p className="text-zinc-800 text-base font-medium leading-relaxed mb-8">
                      We&apos;ve securely logged your information into our system. Our team will be in touch shortly.
                    </p>
                    <button 
                      onClick={() => { setStatus("idle"); setFormData({ name: "", email: "", message: "" }); }}
                      className="text-zinc-950 border-b-2 border-zinc-950 pb-1 text-sm font-black uppercase tracking-widest hover:text-zinc-600 transition-colors"
                    >
                      Submit Another
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="form"
                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }}
                  >
                    {/* Intent Toggle */}
                    <div className="flex p-1.5 bg-zinc-950 rounded-[1rem] mb-8 shadow-xl">
                      <button
                        type="button"
                        onClick={() => setIntent("waitlist")}
                        className={`flex-1 py-4 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${intent === "waitlist" ? "bg-[#CCFF00] text-zinc-950 shadow-md" : "text-zinc-500 hover:text-zinc-300"}`}
                      >
                        Join Waitlist
                      </button>
                      <button
                        type="button"
                        onClick={() => setIntent("invest")}
                        className={`flex-1 py-4 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${intent === "invest" ? "bg-[#CCFF00] text-zinc-950 shadow-md" : "text-zinc-500 hover:text-zinc-300"}`}
                      >
                        Want to Invest
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-black uppercase tracking-widest text-zinc-950 pl-1">Full Name</label>
                          <input 
                            required 
                            type="text" 
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                            className="w-full bg-transparent border-[3px] border-zinc-950 px-5 py-4 text-base md:text-lg font-bold focus:outline-none focus:bg-zinc-950 focus:text-[#CCFF00] transition-colors rounded-xl placeholder:text-zinc-950/30 uppercase" 
                            placeholder="JOHN DOE" 
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-black uppercase tracking-widest text-zinc-950 pl-1">Email Address</label>
                          <input 
                            required 
                            type="email" 
                            value={formData.email} 
                            onChange={(e) => setFormData({...formData, email: e.target.value})} 
                            className="w-full bg-transparent border-[3px] border-zinc-950 px-5 py-4 text-base md:text-lg font-bold focus:outline-none focus:bg-zinc-950 focus:text-[#CCFF00] transition-colors rounded-xl placeholder:text-zinc-950/30 uppercase" 
                            placeholder="JOHN@EMAIL.COM" 
                          />
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black uppercase tracking-widest text-zinc-950 pl-1">Message (Optional)</label>
                        <textarea 
                          rows="4" 
                          value={formData.message} 
                          onChange={(e) => setFormData({...formData, message: e.target.value})} 
                          className="w-full bg-transparent border-[3px] border-zinc-950 px-5 py-4 text-base md:text-lg font-bold focus:outline-none focus:bg-zinc-950 focus:text-[#CCFF00] transition-colors rounded-xl resize-none placeholder:text-zinc-950/30 uppercase" 
                          placeholder={intent === 'invest' ? "TELL US ABOUT YOUR FUND..." : "ANY SPECIFIC TEAM YOU PLAY FOR?"} 
                        />
                      </div>

                      {status === "error" && (
                        <div className="text-red-600 text-xs font-black uppercase tracking-widest text-center mt-2">
                          Error connecting to the database. Please try again.
                        </div>
                      )}

                      <button 
                        disabled={status === "submitting"} 
                        type="submit" 
                        className="mt-4 w-full bg-zinc-950 text-[#CCFF00] border-[3px] border-zinc-950 px-8 py-5 text-sm md:text-base font-black uppercase tracking-[0.2em] hover:bg-transparent hover:text-zinc-950 transition-colors flex justify-center items-center gap-3 rounded-xl disabled:opacity-50 active:scale-95 shadow-xl"
                      >
                        {status === "submitting" ? "TRANSMITTING..." : "SEND MESSAGE"} 
                        {status !== "submitting" && <Send className="w-5 h-5" />}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
