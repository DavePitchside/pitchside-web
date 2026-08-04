"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function SquareScannerCursor() {
  const pathname = usePathname();
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const smoothX = useSpring(cursorX, { damping: 50, stiffness: 400 });
  const smoothY = useSpring(cursorY, { damping: 50, stiffness: 400 });

  useEffect(() => {
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const lowCoreDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    const lowMemoryDevice = navigator.deviceMemory && navigator.deviceMemory <= 4;
    if (!hasFinePointer || lowCoreDevice || lowMemoryDevice) return undefined;

    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [cursorX, cursorY]);

  if (pathname === "/pricing") return null;

  return (
    <motion.div
      className="hidden md:flex fixed pointer-events-none z-[9999] flex-col items-center justify-center w-16 h-16 origin-center mix-blend-difference transform-gpu will-change-transform"
      style={{ x: smoothX, y: smoothY, translateX: "-50%", translateY: "-50%" }}
    >
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#CCFF00]" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#CCFF00]" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#CCFF00]" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#CCFF00]" />
      <div className="w-1.5 h-1.5 bg-[#CCFF00] rounded-full" />
    </motion.div>
  );
}
