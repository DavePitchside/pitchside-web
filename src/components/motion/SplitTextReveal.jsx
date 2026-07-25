"use client";

import { animate, stagger, useInView } from "framer-motion";
import SplitType from "split-type";
import { useEffect, useRef } from "react";

export const LUXURY_EASE = [0.16, 1, 0.3, 1];

export default function SplitTextReveal({ as: Tag = "p", html, className = "", delay = 0 }) {
  const textRef = useRef(null);
  const isInView = useInView(textRef, { once: true, amount: 0.35 });

  useEffect(() => {
    const element = textRef.current;
    if (!element || !isInView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const split = new SplitType(element, { types: "words" });
    const controls = animate(
      split.words,
      { opacity: [0, 1], y: [18, 0] },
      { duration: 0.72, delay: stagger(0.018, { startDelay: delay }), ease: LUXURY_EASE }
    );

    return () => {
      controls.stop();
      split.revert();
    };
  }, [delay, isInView]);

  return <Tag ref={textRef} className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
