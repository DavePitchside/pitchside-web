"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import useLenis from "@/lib/useLenis";
import { DEFAULT_PAGE_IMAGE, getPageImage } from "@/lib/pageImages";

const customEase = [0.16, 1, 0.3, 1];

const RevealText = ({ text, delay = 0 }) => (
  <div className="overflow-hidden inline-block">
    <motion.span
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, delay: delay, ease: customEase }}
      className="inline-block"
    >
      {text}
    </motion.span>
  </div>
);

export default function BlogListingClient({ posts }) {
  useLenis();

  const { scrollY } = useScroll();
  const heroContentY = useTransform(scrollY, [0, 1000], [0, 250]);
  const heroContentOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroContentScale = useTransform(scrollY, [0, 800], [1, 0.95]);
  const glowX = useTransform(scrollY, [0, 1200], [0, -100]);
  const glowY = useTransform(scrollY, [0, 1200], [0, 60]);
  const glowScale = useTransform(scrollY, [0, 1000], [1, 1.4]);

  return (
    <div className="flex flex-col w-full bg-[#050505] text-zinc-900 font-roobert selection:bg-[#CCFF00] selection:text-black min-h-screen">

      <header className="fixed top-0 left-0 w-full h-screen bg-[#050505] overflow-hidden flex flex-col items-center justify-center text-center z-0 px-6">
        <motion.div
          className="absolute top-[-10%] right-10 w-[600px] h-[600px] bg-[#CCFF00]/15 blur-[150px] rounded-full pointer-events-none"
          style={{ x: glowX, y: glowY, scale: glowScale }}
        />
        <motion.div
          className="max-w-[1000px] mx-auto relative z-10 flex flex-col items-center w-full"
          style={{ y: heroContentY, opacity: heroContentOpacity, scale: heroContentScale }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex items-center gap-4 mb-10"
          >
            <span className="bg-[#CCFF00] text-black px-4 py-1.5 rounded-full font-mono text-[10px] tracking-[0.2em] uppercase font-bold">
              Editorial
            </span>
            <span className="w-8 h-[1px] bg-zinc-700" />
            <span className="text-zinc-500 font-mono text-[10px] tracking-[0.2em] uppercase">
              {new Date().getFullYear()} Collection
            </span>
          </motion.div>

          <h1
            className="text-[13vw] md:text-[8rem] lg:text-[10rem] leading-[0.85] uppercase tracking-tighter text-white"
            style={{ fontFamily: "var(--font-alpha)" }}
          >
            <RevealText text="The" delay={0.1} />
            <br />
            <RevealText text="Journal" delay={0.2} />
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-12 text-zinc-400 text-base md:text-lg font-light max-w-md leading-relaxed text-center"
          >
            <p>
              Insights, updates, and tactical analysis at the intersection of
              artificial intelligence and grassroots football.
            </p>
          </motion.div>
        </motion.div>
      </header>

      <div className="relative z-20 w-full bg-white rounded-t-[2.5rem] md:rounded-t-[4rem] shadow-[0_-20px_60px_rgba(0,0,0,0.6)] pt-24 md:pt-32 pb-32 px-6 md:px-12 lg:px-24 mt-[100vh] min-h-screen">
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-zinc-200 rounded-full" />

        {posts.length === 0 ? (
          <div className="w-full h-[40vh] flex items-center justify-center text-zinc-500 tracking-widest text-sm uppercase bg-white">
            No transmissions found.
          </div>
        ) : (
          <div className="max-w-[1300px] mx-auto w-full">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-8 mb-16">
              <h2
                className="text-2xl font-bold uppercase tracking-tighter text-zinc-900"
                style={{ fontFamily: "var(--font-alpha)" }}
              >
                Latest Transmissions
              </h2>
              <span className="text-zinc-400 font-mono text-[10px] tracking-[0.2em] uppercase">
                {posts.length} Articles
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
              {posts.map((post, i) => {
                const imageSrc = getPageImage(post);
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.9, delay: (i % 3) * 0.15, ease: customEase }}
                  >
                    <Link
                      href={post.contentType === "page" ? `/${post.slug}` : `/blog/${post.slug}`}
                      className="group flex flex-col h-full cursor-pointer"
                    >
                      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-zinc-100">
                        <Image
                          src={imageSrc}
                          alt={post.title || "Blog Post"}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          quality={72}
                          className="object-cover object-center scale-[1.02] group-hover:scale-105 transition-transform duration-[1.4s] ease-out"
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_PAGE_IMAGE;
                            e.currentTarget.srcset = "";
                          }}
                        />
                      </div>

                      <div className="flex flex-col flex-1 px-1">
                        <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-400 uppercase tracking-[0.2em] mb-4">
                          <span>{post.date || "Recent"}</span>
                          <span className="w-1 h-1 rounded-full bg-[#CCFF00]" />
                          <span className="text-zinc-800 font-bold">{post.category || "Article"}</span>
                        </div>

                        <h3
                          className="text-2xl md:text-3xl uppercase tracking-tighter text-zinc-900 leading-[1.1] mb-4 group-hover:text-zinc-500 transition-colors duration-500"
                          style={{ fontFamily: "var(--font-alpha)" }}
                        >
                          {post.heroH1 || post.title || "Untitled Post"}
                        </h3>

                        <p className="text-zinc-500 font-light leading-relaxed mb-8 line-clamp-3 text-[15px]">
                          {post.metaDescription ||
                            "Explore the tactical depths and data-driven insights in this latest breakdown."}
                        </p>

                        <div className="mt-auto flex items-center text-zinc-900 font-bold text-[10px] uppercase tracking-[0.2em] opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                          Read Story <ArrowUpRight className="w-3.5 h-3.5 ml-1.5 text-[#CCFF00]" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
