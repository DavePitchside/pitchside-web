"use client";

import Link from "next/link";
import { ArrowUpRight, Dices, LayoutPanelTop, ListOrdered, Trophy, UsersRound } from "lucide-react";
import { PremiumToolHero, ToolContentBlocks, ToolCTA } from "@/components/tools/ToolChrome";
import { tools as defaultTools, toolsHub as defaultToolsHub } from "@/lib/tools";

const icons = {
  "random-5-a-side-team-generator": UsersRound,
  "football-formation-builder": LayoutPanelTop,
  "football-team-name-generator": Dices,
  "football-league-table-generator": ListOrdered,
  "5-a-side-football-stats-tracker": Trophy,
};

export default function ToolsHub({ hub = defaultToolsHub, tools = defaultTools }) {
  const hero = hub.hero || {};
  return (
    <main className="min-h-screen bg-[#050505] font-roobert text-white">
      <PremiumToolHero
        eyebrow={hero.eyebrow || hub.badge || "Pitchside tools"}
        title={hero.displayTitle || hub.title || hub.heroH1 || "Free Football Tools"}
        description={
          hero.description || hub.intro || hub.metaDescription ||
          "Build teams, plan formations, create league tables and track 5-a-side or futsal stats before Pitchside launches."
        }
        primaryLabel={hero.primaryCtaLabel || "Explore tools"}
        primaryHref="#tools-grid"
        secondaryLabel={hero.secondaryCtaLabel || "Get early access"}
        previewLabel={hero.previewLabel || "Tools ecosystem"}
        previewType={hero.previewType || "hub"}
        previewData={hero.previewData}
        tools={tools}
      />

      <section className="bg-[#F4F3EF] px-3 py-3 text-black md:px-4 md:py-4">
        <div className="rounded-[1.5rem] border-2 border-black bg-[#F4F3EF] px-4 py-10 md:rounded-[2rem] md:px-8 md:py-16">
          <div id="tools-grid" className="mx-auto grid max-w-7xl scroll-mt-28 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {tools.map((tool) => {
              const Icon = icons[tool.slug] || Trophy;
              return (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group flex min-h-[300px] flex-col justify-between rounded-3xl border-2 border-black bg-white p-6 shadow-[6px_6px_0px_#000] transition hover:-translate-y-1 hover:shadow-[6px_6px_0px_#CCFF00]">
                  <div>
                    <div className="mb-8 flex items-center justify-between">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl border-2 border-black bg-[#CCFF00] shadow-[0_0_22px_rgba(204,255,0,0.25)]">
                        <Icon className="h-6 w-6" />
                      </div>
                      <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">{tool.title}</h2>
                    <p className="mt-4 text-sm leading-relaxed text-zinc-600">{tool.metaDescription}</p>
                  </div>
                  <span className="mt-8 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">Open tool</span>
                </Link>
              );
            })}
          </div>
          <div className="mx-auto mt-12 grid max-w-7xl gap-10">
            <ToolContentBlocks blocks={hub.contentBlocks} />
            <ToolCTA cta={hub.ctaBlock} />
          </div>
        </div>
      </section>
    </main>
  );
}
