"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

const FilmGrain = () => (
  <div
    className="absolute inset-0 z-[40] h-full w-full pointer-events-none opacity-[0.04]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }}
  />
);

const CornerMark = ({ className, src = "/corner-neon.svg", opacity = "opacity-40" }) => (
  <div className={`absolute z-30 h-6 w-6 pointer-events-none md:h-10 md:w-10 ${opacity} ${className}`}>
    <Image src={src} alt="" fill className="object-contain" aria-hidden="true" />
  </div>
);

function TeamPreview({ data = {} }) {
  const teams = data.teams?.length
    ? data.teams
    : [
        { name: "Team A", players: ["Alex · Forward", "Chris · Goalkeeper", "Dani · Midfielder"] },
        { name: "Team B", players: ["Ben · Defender", "Elliot · Winger", "Jules · Forward"] },
      ];
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {teams.map((team) => (
        <div key={team.name} className="rounded-xl border border-white/10 bg-white/[0.06] p-3">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-alpha text-2xl uppercase leading-none text-white" style={{ fontFamily: "var(--font-alpha)" }}>{team.name}</span>
            <span className="h-2 w-2 rounded-full bg-[#CCFF00] shadow-[0_0_14px_#CCFF00]" />
          </div>
          <div className="space-y-2">
            {(team.players || team.rows || []).map((row, index) => (
              <div key={row} className={`items-center justify-between border-b border-white/10 pb-2 text-xs font-bold text-zinc-300 last:border-b-0 last:pb-0 ${index > 1 ? "hidden sm:flex" : "flex"}`}>
                <span>{row.split(" · ")[0]}</span>
                <span className="text-zinc-500">{row.split(" · ")[1]}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FormationPreview({ data = {} }) {
  const dots = data.positions?.length
    ? data.positions.map((position) => [position.left, position.top, position.label])
    : [
        ["50%", "83%", "GK"],
        ["50%", "62%", "CB"],
        ["32%", "43%", "LW"],
        ["68%", "43%", "RW"],
        ["50%", "21%", "ST"],
      ];
  return (
    <div className="relative mx-auto aspect-[4/5] max-h-[320px] w-full max-w-[15rem] overflow-hidden rounded-xl border border-[#CCFF00]/50 bg-[#0f2818] sm:max-w-xs">
      <div className="absolute inset-4 rounded-xl border border-[#CCFF00]/40" />
      <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#CCFF00]/35" />
      <div className="absolute inset-x-4 top-1/2 h-px bg-[#CCFF00]/35" />
      {dots.map(([left, top, label]) => (
        <div key={label} className="absolute -translate-x-1/2 -translate-y-1/2 text-center" style={{ left, top }}>
          <div className="mx-auto grid h-8 w-8 place-items-center rounded-full border-2 border-black bg-[#CCFF00] text-[9px] font-black text-black shadow-[0_0_18px_rgba(204,255,0,0.35)] sm:h-10 sm:w-10 sm:text-[10px]">{label}</div>
        </div>
      ))}
      <div className="absolute left-4 top-4 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#CCFF00]/80">{data.shape || "1-2-1"}</div>
    </div>
  );
}

function NamesPreview({ data = {} }) {
  const names = data.names?.length ? data.names : ["Cage Kings", "Postcode Press", "North Stand Five", "Pivot Society"];
  return (
    <div className="grid gap-3">
      {names.map((name, index) => (
        <div key={name} className={`rounded-xl border p-3 ${index === 0 ? "border-[#CCFF00]/60 bg-[#CCFF00] text-black" : "border-white/10 bg-white/[0.06] text-white"}`}>
          <p className="font-alpha text-2xl uppercase leading-none" style={{ fontFamily: "var(--font-alpha)" }}>{name}</p>
          <p className={`mt-2 text-[10px] font-black uppercase tracking-[0.2em] ${index === 0 ? "text-black/60" : "text-zinc-500"}`}>Generated idea</p>
        </div>
      ))}
    </div>
  );
}

function TablePreview({ data = {} }) {
  const rows = data.rows?.length
    ? data.rows
    : [
        ["Pitchside FC", "12", "+8"],
        ["Astro United", "9", "+3"],
        ["Five Alive", "7", "0"],
        ["Late Kickoff", "3", "-6"],
      ];
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.06]">
      <div className="grid grid-cols-[1fr_56px_56px] border-b border-white/10 bg-black/30 px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#CCFF00]">
        <span>Team</span><span>Pts</span><span>GD</span>
      </div>
      {rows.map((row, index) => (
        <div key={row[0]} className="grid grid-cols-[1fr_56px_56px] border-b border-white/10 px-4 py-2.5 text-sm font-bold text-white last:border-b-0">
          <span>{index + 1}. {row[0]}</span><span>{row[1]}</span><span className={index === 0 ? "text-[#CCFF00]" : "text-zinc-500"}>{row[2]}</span>
        </div>
      ))}
    </div>
  );
}

function StatsPreview({ data = {} }) {
  const stats = data.stats?.length ? data.stats : ["3 Goals", "2 Assists", "8 Saves"];
  return (
    <div className="grid gap-3">
      <div className="rounded-xl border border-[#CCFF00]/50 bg-[#CCFF00] p-4 text-black">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/60">Player of the match</p>
        <div className="mt-3 flex items-end justify-between">
          <span className="font-alpha text-4xl uppercase leading-none" style={{ fontFamily: "var(--font-alpha)" }}>{data.player || "Alex"}</span>
          <span className="text-3xl font-black">{data.rating || "9.1"}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {stats.map((item) => (
          <div key={item} className="rounded-xl border border-white/10 bg-white/[0.06] p-3 text-center">
            <p className="text-lg font-black text-white">{item.split(" ")[0]}</p>
            <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">{item.split(" ")[1]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HubPreview({ tools = [], data = {} }) {
  const toolNames = data.tools?.length ? data.tools : tools.slice(0, 5).map((tool) => tool.shortTitle);
  return (
    <div className="grid gap-3">
      {toolNames.slice(0, 5).map((name, index) => (
        <div key={name} className={`group items-center justify-between rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 ${index > 1 ? "hidden sm:flex" : "flex"}`}>
          <div>
            <p className="text-sm font-black uppercase tracking-tight text-white">{name}</p>
            <p className={`mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500 ${index > 0 ? "hidden sm:block" : ""}`}>{data.notes?.[index % data.notes.length] || (index === 0 ? "Plan before kickoff" : "Free utility")}</p>
          </div>
          <span className="h-px w-10 bg-[#CCFF00]/60" />
        </div>
      ))}
    </div>
  );
}

function ToolPreview({ type, tools, data }) {
  if (type === "hub") return <HubPreview tools={tools} data={data} />;
  if (type === "formation") return <FormationPreview data={data} />;
  if (type === "names") return <NamesPreview data={data} />;
  if (type === "table") return <TablePreview data={data} />;
  if (type === "stats") return <StatsPreview data={data} />;
  return <TeamPreview data={data} />;
}

export function PremiumToolHero({
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel = "Join the waitlist",
  previewLabel,
  previewType,
  backHref,
  backLabel,
  tools,
  previewData,
}) {
  return (
    <div className="w-full bg-[#050505] p-2 md:p-4">
      <section className="relative flex min-h-[100svh] w-full flex-col justify-center overflow-hidden rounded-[1.5rem] border border-white/5 bg-[#050505] px-5 pb-6 pt-[92px] md:min-h-[calc(100svh-32px)] md:rounded-[2rem] md:px-10 md:pb-10 md:pt-[112px] lg:px-16 xl:px-20">
        <FilmGrain />
        <CornerMark className="left-6 top-[88px] hidden md:block md:left-10 md:top-[96px]" />
        <CornerMark className="right-6 top-[88px] hidden rotate-90 md:right-10 md:top-[96px] md:block" />
        <CornerMark className="bottom-6 right-6 hidden rotate-180 md:bottom-10 md:right-10 md:block" />
        <CornerMark className="bottom-6 left-6 hidden -rotate-90 md:bottom-10 md:left-10 md:block" />

        <div className="absolute inset-0 z-0">
          <Image src="/1.png" alt="" fill sizes="100vw" className="object-cover object-[70%_center] opacity-35 md:object-[82%_center] md:opacity-45" aria-hidden="true" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/92 to-[#050505]/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/82 via-[#050505]/18 to-[#050505]/90" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(204,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:48px_48px] opacity-45" />
          <div className="absolute left-[52%] top-[18%] hidden h-56 w-56 rounded-full bg-[#CCFF00]/8 blur-3xl md:block" />
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#050505] to-transparent" />
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-6 lg:grid-cols-[minmax(0,0.98fr)_minmax(320px,440px)] lg:gap-10 xl:gap-14">
          <div className="max-w-3xl">
            {backHref && (
              <Link href={backHref} className="mb-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500 transition-colors hover:text-[#CCFF00] focus:outline-none focus:ring-4 focus:ring-[#CCFF00]/30 md:mb-5">
                <ArrowLeft className="h-4 w-4" /> {backLabel}
              </Link>
            )}
            <p className="mb-4 border-l-2 border-[#CCFF00] pl-4 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-400 md:mb-5">{eyebrow}</p>
            <h1 className="max-w-[11ch] font-alpha text-[clamp(2.95rem,8.4vw,8.6rem)] uppercase leading-[0.86] text-white drop-shadow-[0_0_58px_rgba(204,255,0,0.10)] sm:max-w-[12ch] md:text-[clamp(4.6rem,8vw,8.6rem)] lg:text-[clamp(4.8rem,7.1vw,8.2rem)]" style={{ fontFamily: "var(--font-alpha)", letterSpacing: 0 }}>
              {title}
            </h1>
            <p className="mt-4 max-w-xl text-sm font-medium leading-relaxed text-zinc-300 md:mt-5 md:text-base lg:text-lg">{description}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-7">
              <a href={primaryHref} className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-8 py-4 text-xs font-black uppercase tracking-widest text-black transition-all duration-300 hover:bg-[#CCFF00] focus:outline-none focus:ring-4 focus:ring-[#CCFF00]/35 active:scale-95">
                {primaryLabel}
              </a>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("open-pitchside-modal", { detail: { type: "waitlist" } }))}
                className="inline-flex min-h-12 items-center justify-center rounded-lg border-2 border-white/25 bg-white/[0.04] px-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 hover:border-white/50 hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-[#CCFF00]/25 active:scale-95"
              >
                {secondaryLabel}
              </button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[420px] self-center lg:mx-0 lg:justify-self-end">
            <div className="absolute -inset-3 hidden rounded-[2rem] bg-[#CCFF00]/10 blur-xl motion-reduce:hidden md:block" />
            <div className="relative overflow-hidden rounded-[1.25rem] border border-white/10 bg-black/58 p-3 shadow-[0_22px_55px_rgba(0,0,0,0.48)] md:max-h-[430px] md:rounded-[1.5rem] md:p-4">
              <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#CCFF00]">{previewLabel}</p>
                <span className="h-2 w-2 rounded-full bg-[#CCFF00] shadow-[0_0_14px_#CCFF00]" />
              </div>
              <ToolPreview type={previewType} tools={tools} data={previewData} />
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-1 text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-600 xl:flex">
          <span>Tool below</span>
          <span className="h-8 w-px bg-gradient-to-b from-[#CCFF00] to-transparent" />
        </div>
      </section>
    </div>
  );
}

export function ToolCTA({ cta }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-black bg-[#CCFF00] p-6 md:p-8 text-black shadow-[8px_8px_0px_#000]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight">{cta?.headline || "Join the Pitchside waitlist"}</h2>
          <p className="mt-3 text-sm md:text-base font-medium leading-relaxed text-black/75">
            {cta?.description || "Get early access to Pitchside as the platform develops."}
          </p>
        </div>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("open-pitchside-modal", { detail: { type: "waitlist" } }))}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-black bg-black px-6 py-4 text-xs font-black uppercase tracking-widest text-[#CCFF00] transition-colors hover:bg-white hover:text-black"
        >
          {cta?.buttonText || "Join the waitlist"} <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function ToolFAQ({ faqs = [] }) {
  const visibleFaqs = faqs.filter((faq) => faq?.question);
  if (!visibleFaqs.length) return null;

  return (
    <section className="border-t-2 border-black pt-10">
      <h2 className="font-alpha text-4xl md:text-6xl uppercase tracking-tight text-black" style={{ fontFamily: "var(--font-alpha)" }}>
        FAQs
      </h2>
      <div className="mt-8 grid gap-4">
        {visibleFaqs.map((faq, index) => (
          <details key={`${faq.question}-${index}`} className="group rounded-2xl border-2 border-black bg-white p-5 shadow-[4px_4px_0px_#000]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-black uppercase tracking-tight text-black">
              {faq.question}
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-black text-[#CCFF00] transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-4 max-w-3xl text-sm md:text-base leading-relaxed text-zinc-700" dangerouslySetInnerHTML={{ __html: faq.answer || "" }} />
          </details>
        ))}
      </div>
    </section>
  );
}

export function ToolContentBlocks({ blocks = [] }) {
  const visibleBlocks = blocks.filter((block) => block?.content || block?.items?.length || block?.headers?.length);
  if (!visibleBlocks.length) return null;

  return (
    <section className="space-y-6">
      {visibleBlocks.map((block, index) => {
        if (block.type === "h2") {
          return (
            <h2 key={block.id || index} className="pt-6 text-3xl md:text-5xl font-black uppercase tracking-tight text-black">
              {block.content}
            </h2>
          );
        }
        if (block.type === "h3") {
          return (
            <h3 key={block.id || index} className="text-2xl font-black uppercase tracking-tight text-black">
              {block.content}
            </h3>
          );
        }
        if (block.type === "paragraph") {
          const containsBlockHtml = /<\/?(pre|div|table|ul|ol|li|h[1-6]|blockquote|section)\b/i.test(block.content || "");
          if (containsBlockHtml) {
            return (
              <div key={block.id || index} className="max-w-3xl [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:text-xs md:[&_pre]:text-sm" dangerouslySetInnerHTML={{ __html: block.content }} />
            );
          }
          return (
            <p key={block.id || index} className="max-w-3xl text-base md:text-lg leading-relaxed text-zinc-700" dangerouslySetInnerHTML={{ __html: block.content }} />
          );
        }
        if (block.type === "list") {
          return (
            <ul key={block.id || index} className="grid gap-3">
              {block.items.filter(Boolean).map((item, itemIndex) => (
                <li key={itemIndex} className="flex gap-3 text-zinc-700">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#CCFF00] ring-2 ring-black" />
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "table") {
          return (
            <div key={block.id || index} className="overflow-x-auto rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000]">
              <table className="w-full min-w-[640px] border-collapse bg-white text-left">
                <thead className="bg-black text-[#CCFF00]">
                  <tr>
                    {block.headers.map((header, headerIndex) => (
                      <th key={headerIndex} className="p-4 text-xs font-black uppercase tracking-widest">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(block.rows || []).map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-t border-zinc-200">
                      {(row.cells || []).map((cell, cellIndex) => (
                        <td key={cellIndex} className="p-4 text-sm font-medium text-zinc-700" dangerouslySetInnerHTML={{ __html: cell }} />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        return null;
      })}
    </section>
  );
}

export function ToolShell({ tool, children }) {
  const hero = tool.hero || {};
  return (
    <main className="min-h-screen bg-[#050505] font-roobert text-white">
      <PremiumToolHero
        eyebrow={hero.eyebrow || tool.badge || "Pitchside tools"}
        title={hero.displayTitle || tool.title}
        description={tool.intro || tool.metaDescription}
        primaryLabel={hero.primaryCtaLabel || "Use the tool"}
        primaryHref="#tool-start"
        secondaryLabel={hero.secondaryCtaLabel || "Join the waitlist"}
        previewLabel={hero.previewLabel || tool.outputLabel || "Tool preview"}
        previewType={hero.previewType || "teams"}
        previewData={hero.previewData}
        backHref="/tools"
        backLabel="Tools"
      />
      <section className="overflow-hidden bg-[#F4F3EF] px-0 py-3 text-zinc-950 md:px-4 md:py-4">
        <div className="max-w-full overflow-hidden rounded-[1.25rem] border-2 border-black bg-[#F4F3EF] px-1 py-8 shadow-[0_0_60px_rgba(0,0,0,0.35)] md:rounded-[2rem] md:px-8 md:py-16">
          <div className="mx-auto grid max-w-7xl min-w-0 gap-12">
            {children}
            <ToolContentBlocks blocks={tool.contentBlocks} />
            {tool.links?.length > 0 && (
              <section className="rounded-3xl border-2 border-black bg-white p-6 shadow-[6px_6px_0px_#000]">
                <h2 className="text-xl font-black uppercase tracking-tight text-black">Related Pitchside tools</h2>
                <div className="mt-5 flex flex-wrap gap-3">
                  {tool.links.map((link) => (
                    <Link key={link.href} href={link.href} className="inline-flex items-center gap-2 rounded-xl border-2 border-black px-4 py-3 text-xs font-black uppercase tracking-widest text-black transition-colors hover:bg-black hover:text-[#CCFF00]">
                      {link.label} <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </section>
            )}
            <ToolCTA cta={tool.ctaBlock} />
            <ToolFAQ faqs={tool.faqs} />
          </div>
        </div>
      </section>
    </main>
  );
}
