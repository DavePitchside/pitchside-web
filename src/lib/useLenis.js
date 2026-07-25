"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

const DEFAULT_LENIS_OPTIONS = {
  duration: 1.05,
  smoothWheel: true,
  smoothTouch: false,
  wheelMultiplier: 0.9,
  anchors: {
    offset: -96,
  },
};

let activeLenis = null;
let activeAnimationFrame = null;
let consumerCount = 0;

function canUseSmoothScroll() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const usesCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const lowCoreDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
  const lowMemoryDevice = navigator.deviceMemory && navigator.deviceMemory <= 4;

  return !prefersReducedMotion && !usesCoarsePointer && !lowCoreDevice && !lowMemoryDevice;
}

export default function useLenis(options = DEFAULT_LENIS_OPTIONS) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!canUseSmoothScroll()) return undefined;

    consumerCount += 1;

    if (!activeLenis) {
      activeLenis = new Lenis(options);

      const raf = (time) => {
        activeLenis?.raf(time);
        activeAnimationFrame = requestAnimationFrame(raf);
      };

      activeAnimationFrame = requestAnimationFrame(raf);
    }

    lenisRef.current = activeLenis;

    const stopForReducedMotion = () => {
      if (!reducedMotionQuery.matches) return;
      activeLenis?.destroy();
      activeLenis = null;
      if (activeAnimationFrame) cancelAnimationFrame(activeAnimationFrame);
      activeAnimationFrame = null;
      lenisRef.current = null;
    };

    reducedMotionQuery.addEventListener("change", stopForReducedMotion);

    return () => {
      reducedMotionQuery.removeEventListener("change", stopForReducedMotion);
      consumerCount = Math.max(0, consumerCount - 1);
      if (consumerCount === 0) {
        activeLenis?.destroy();
        activeLenis = null;
        if (activeAnimationFrame) cancelAnimationFrame(activeAnimationFrame);
        activeAnimationFrame = null;
      }
    };
  }, [options]);

  return lenisRef;
}
