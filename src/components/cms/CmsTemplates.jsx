import Image from "next/image";
import Link from "next/link";
import ProductStatusNotice from "@/components/ProductStatusNotice";
import CmsBlock from "@/components/cms/CmsBlocks";
import { sanitizeDesignOptions } from "@/lib/cms/pageSchema";
import { getTemplateConfig } from "@/lib/cms/templateRegistry";

const widthClass = {
  narrow: "max-w-3xl",
  standard: "max-w-5xl",
  wide: "max-w-7xl",
};

function Hero({ page, designOptions }) {
  const split = designOptions.heroVariant === "split" || designOptions.heroVariant === "media-led";
  const compact = designOptions.heroVariant === "compact";
  const hasMedia = Boolean(page.hero.media);
  const shell = split ? "grid gap-10 lg:grid-cols-[1.05fr_0.85fr] lg:items-center" : "mx-auto max-w-4xl text-center";

  return (
    <section className={`relative overflow-hidden bg-[#050505] px-6 pb-20 pt-32 text-white md:px-12 md:pb-28 md:pt-40 ${designOptions.backgroundPattern === "pitch-lines" ? "after:absolute after:inset-8 after:rounded-[2rem] after:border after:border-[#CCFF00]/15" : ""}`}>
      {designOptions.backgroundPattern === "grid" && <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:4vw_4vw]" />}
      {designOptions.backgroundPattern === "glow" && <div className="pointer-events-none absolute right-0 top-1/4 h-80 w-80 rounded-full bg-[#CCFF00]/20 blur-[120px]" />}
      <div className={`relative z-10 mx-auto ${widthClass[designOptions.contentWidth] || widthClass.wide} ${shell}`}>
        <div>
          {page.hero.eyebrow && <p className="mb-5 font-mono text-[10px] font-black uppercase tracking-[0.24em] text-[#CCFF00]">{page.hero.eyebrow}</p>}
          <h1 className={`${compact ? "text-[clamp(2.5rem,7vw,5.5rem)]" : "text-[clamp(3rem,9vw,7rem)]"} font-alpha uppercase leading-[0.84] tracking-normal text-[#CCFF00]`} style={{ fontFamily: "var(--font-alpha)" }}>
            {page.hero.h1}
          </h1>
          {page.hero.intro && <p className={`${split ? "max-w-2xl" : "mx-auto max-w-3xl"} mt-6 text-base font-medium leading-relaxed text-zinc-300 md:text-lg`}>{page.hero.intro}</p>}
          {page.hero.primaryCta?.buttonUrl && (
            <Link href={page.hero.primaryCta.buttonUrl} className="mt-8 inline-flex rounded-full bg-[#CCFF00] px-6 py-3 text-xs font-black uppercase tracking-widest text-[#050505]">
              {page.hero.primaryCta.buttonText || "Learn more"}
            </Link>
          )}
        </div>
        {split && (
          <div className="relative min-h-[260px] rounded-2xl border border-[#CCFF00]/25 bg-[#CCFF00]/10 p-4 shadow-2xl">
            {hasMedia ? (
              <Image src={page.hero.media} alt={page.hero.mediaAlt || page.hero.h1} fill className="rounded-2xl object-cover" />
            ) : (
              <div className="grid h-full min-h-[260px] place-items-center rounded-xl border border-[#CCFF00]/20">
                <p className="max-w-xs text-center font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#CCFF00]">{page.templateKey}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function StandardTemplate({ page, designOptions }) {
  return (
    <main className="min-h-screen bg-[#F4F3EF] text-[#050505]">
      <Hero page={page} designOptions={designOptions} />
      <div className={`mx-auto ${widthClass[designOptions.contentWidth] || widthClass.wide} space-y-12 px-6 py-16 md:px-12 md:py-24`}>
        {designOptions.showStatusNotice && <ProductStatusNotice className="!bg-[#050505] !text-zinc-200" />}
        {page.blocks.map((block) => <CmsBlock key={block.id} block={block} />)}
      </div>
    </main>
  );
}

function PitchSetupTemplate({ page, designOptions }) {
  return (
    <main className="min-h-screen bg-[#F4F3EF] text-[#050505]">
      <div className="mx-auto max-w-7xl space-y-10 px-5 pb-14 pt-28 md:px-12 md:pb-20 md:pt-36">
        <header className="max-w-4xl border-b-2 border-[#050505] pb-8 md:pb-10">
          {page.hero.eyebrow && <p className="mb-4 font-mono text-[10px] font-black uppercase tracking-[0.24em] text-[#7a9900]">{page.hero.eyebrow}</p>}
          <h1 className="text-4xl font-black uppercase leading-[0.92] tracking-tight text-[#050505] md:text-6xl">{page.hero.h1}</h1>
          {page.hero.intro && <p className="mt-5 max-w-3xl text-base font-medium leading-relaxed text-zinc-700 md:text-lg">{page.hero.intro}</p>}
          {page.hero.primaryCta?.buttonUrl && (
            <Link href={page.hero.primaryCta.buttonUrl} className="mt-6 inline-flex rounded-full bg-[#050505] px-6 py-3 text-xs font-black uppercase tracking-widest text-[#CCFF00]">
              {page.hero.primaryCta.buttonText || "Learn more"}
            </Link>
          )}
        </header>
        {designOptions.showStatusNotice && <ProductStatusNotice className="!bg-[#050505] !text-zinc-200" />}
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <aside className="rounded-2xl border-2 border-[#050505] bg-white p-6 shadow-[6px_6px_0px_#050505] lg:sticky lg:top-28 lg:h-fit">
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#7a9900]">Recording setup</p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight">Setup rules before kickoff</h2>
            <p className="mt-4 text-sm font-bold leading-relaxed text-zinc-700">Use diagrams as examples only. Venue rules, safety, pitch layout and consent decide the final setup.</p>
          </aside>
          <div className="space-y-12">{page.blocks.map((block) => <CmsBlock key={block.id} block={block} />)}</div>
        </div>
      </div>
    </main>
  );
}

const specializedTemplates = {
  "pitchside-pitch-setup": PitchSetupTemplate,
};

export default function CmsTemplate({ page }) {
  const template = getTemplateConfig(page.templateKey);
  const designOptions = sanitizeDesignOptions(page.designOptions, template.defaultDesignOptions);
  const Template = specializedTemplates[page.templateKey] || StandardTemplate;
  return <Template page={page} designOptions={designOptions} />;
}
