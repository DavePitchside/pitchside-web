"use client";

import { motion } from "framer-motion";

export default function InfiniteTicker({ textItems, speed = 20 }) {
  return (
    <div className="relative w-full overflow-hidden bg-zinc-950 py-6 border-y border-zinc-900 flex items-center">
      
      {/* Optional: Gradient fades on the edges to make it blend into the screen */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />

      {/* The Moving Track */}
      <motion.div
        className="flex whitespace-nowrap w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: speed, // Lower number = faster scroll
        }}
      >
        {/* We render the array TWICE to create the seamless loop illusion */}
        {[...Array(2)].map((_, arrayIndex) => (
          <div key={arrayIndex} className="flex gap-16 px-8 items-center">
            {textItems.map((item, index) => (
              <div key={index} className="flex items-center gap-16">
                <span className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-800 hover:text-[#CCFF00] transition-colors duration-300 cursor-default">
                  {item}
                </span>
                {/* The dot separator */}
                <span className="w-3 h-3 bg-[#CCFF00] rounded-full" />
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}