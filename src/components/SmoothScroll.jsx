"use client";

import useLenis from "@/lib/useLenis";

export default function SmoothScroll({ children }) {
  useLenis();
  return children;
}
