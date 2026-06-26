"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

export default function HeroHeatmap() {
  // Generate random "dew drops" (telemetry nodes) only once on mount
  const dewDrops = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1.5, // slightly larger dots
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
    }));
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#050505] z-0 pointer-events-none">
      
      {/* 1. THE HEATMAP BLOBS */}
      <div className="absolute inset-0 opacity-60 mix-blend-screen blur-[80px] z-0">
        {/* Neon Green Hotspot */}
        <motion.div
          animate={{
            x: ["0vw", "20vw", "-10vw", "0vw"],
            y: ["0vh", "-20vh", "10vh", "0vh"],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[30%] w-[45vw] h-[45vw] rounded-full bg-[#CCFF00]"
        />
        {/* High-Intensity Orange/Red Hotspot */}
        <motion.div
          animate={{
            x: ["0vw", "-30vw", "10vw", "0vw"],
            y: ["0vh", "20vh", "-10vh", "0vh"],
            scale: [1, 1.5, 0.8, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] right-[20%] w-[40vw] h-[40vw] rounded-full bg-[#ff3300]"
        />
      </div>

      {/* 2. VIGNETTE FADE (Moved UNDER the grid so it doesn't wash out the lines) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505] opacity-90 z-[5]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505] opacity-50 z-[5]" />

      {/* 3. THE DIGITAL PITCH GRID ("GRASS") - Increased stroke and opacity */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-60">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="pitch-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              {/* Thicker stroke (1.5) and fully solid color so it pops */}
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#CCFF00" strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pitch-grid)" />
        </svg>
      </div>

      {/* 4. THE "DEW DROPS" (Twinkling Telemetry) */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {dewDrops.map((drop) => (
          <motion.div
            key={drop.id}
            className="absolute rounded-full bg-white shadow-[0_0_12px_3px_rgba(204,255,0,0.9)]"
            style={{
              left: `${drop.x}%`,
              top: `${drop.y}%`,
              width: `${drop.size}px`,
              height: `${drop.size}px`,
            }}
            animate={{
              opacity: [0.1, 1, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: drop.duration,
              repeat: Infinity,
              delay: drop.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
    </div>
  );
}