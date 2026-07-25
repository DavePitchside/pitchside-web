import Image from "next/image";
import Link from "next/link";
import { canonicalizeInternalLinks, canonicalInternalHref } from "@/lib/contentPolicy";
import { pricingPlans } from "@/lib/pricing";
import PitchDiagram from "@/components/cms/PitchDiagram";
import SplitTextReveal from "@/components/motion/SplitTextReveal";

const stripHtml = (value = "") => String(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

function RichHtml({ html, className = "" }) {
  return <SplitTextReveal html={canonicalizeInternalLinks(html || "")} className={className} />;
}

function Card({ children }) {
  return <div className="rounded-none border-2 border-[#050505] bg-white p-5 shadow-[5px_5px_0px_#050505]">{children}</div>;
}

function HeadingBlock({ block }) {
  const Tag = Number(block.level) === 3 ? "h3" : "h2";
  return <SplitTextReveal as={Tag} html={block.text} className={Tag === "h3" ? "text-2xl font-black uppercase tracking-tight text-zinc-900" : "text-4xl font-black uppercase tracking-tight text-zinc-950 md:text-5xl"} />;
}

function StatsGrid({ block }) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {(block.items || []).map((item, index) => (
        <Card key={item.id || item.label || index}>
          <p className="text-3xl font-black uppercase tracking-tight text-[#050505]">{item.value}</p>
          <p className="mt-2 whitespace-pre-line font-mono text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{item.label}</p>
        </Card>
      ))}
    </section>
  );
}

function FeatureGrid({ block }) {
  return (
    <section>
      {block.title && <h2 className="mb-6 text-3xl font-black uppercase tracking-tight">{block.title}</h2>}
      <div className="grid gap-5 md:grid-cols-2">
        {(block.items || []).map((item, index) => (
          <Card key={item.id || item.title || index}>
            <h3 className="text-xl font-black uppercase tracking-tight">{item.title}</h3>
            <p className="mt-3 text-sm font-bold leading-relaxed text-zinc-700">{item.body || item.desc || item.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function TableBlock({ block }) {
  const rows = block.rows || [];
  return (
    <section>
      {block.title && <h2 className="mb-5 text-3xl font-black uppercase tracking-tight">{block.title}</h2>}
      <div className="overflow-x-auto rounded-none border-4 border-[#050505] shadow-[6px_6px_0px_#050505]">
        <table className="w-full min-w-[640px] border-collapse bg-white text-left">
          <thead className="bg-[#050505] text-[#CCFF00]">
            <tr>{(block.headers || []).map((header) => <th key={header} className="p-4 text-xs font-black uppercase tracking-widest">{header}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const cells = row.cells || row;
              return (
                <tr key={row.id || index} className="border-t border-zinc-200">
                  {cells.map((cell, cellIndex) => <td key={cellIndex} className="p-4 text-sm font-bold text-zinc-700"><RichHtml html={cell} /></td>)}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function PricingTeaser({ block }) {
  return (
    <section className="rounded-none border-4 border-[#050505] bg-[#CCFF00] p-6 text-[#050505] shadow-[8px_8px_0px_#050505] md:p-8">
      <h2 className="text-3xl font-black uppercase tracking-tight md:text-5xl">{block.title || "Planned launch pricing"}</h2>
      {block.description && <p className="mt-4 max-w-3xl text-sm font-black leading-relaxed">{block.description}</p>}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {pricingPlans.map((plan) => (
          <div key={plan.id} className="rounded-none border-2 border-[#050505] bg-white p-5">
            <h3 className="text-2xl font-black uppercase">{plan.name}</h3>
            <p className="mt-2 text-3xl font-black">{plan.price}</p>
            <p className="mt-3 text-sm font-bold text-zinc-700">{plan.allowance}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs font-black uppercase tracking-widest">Subscriptions are not currently purchasable.</p>
    </section>
  );
}

function WorkflowSteps({ block }) {
  return (
    <section>
      {block.title && <h2 className="mb-6 text-3xl font-black uppercase tracking-tight">{block.title}</h2>}
      <div className="grid gap-4 md:grid-cols-5">
        {(block.steps || block.items || []).map((step, index) => (
          <Card key={step.id || step.title || index}>
            <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#7a9900]">Step {index + 1}</p>
            <h3 className="mt-3 text-lg font-black uppercase tracking-tight">{step.title}</h3>
            <p className="mt-3 text-sm font-bold leading-relaxed text-zinc-700">{step.body || step.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function ListPanel({ block }) {
  return (
    <section className="rounded-none border-2 border-[#050505] bg-[#F4F3EF] p-6">
      {block.title && <h2 className="mb-5 text-2xl font-black uppercase tracking-tight">{block.title}</h2>}
      <ul className="space-y-3">
        {(block.items || []).map((item, index) => (
          <li key={item.id || item.title || item || index} className="flex gap-3 text-sm font-bold leading-relaxed text-zinc-700">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#CCFF00]" />
            <span>{typeof item === "string" ? item : item.body || item.title}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function AffiliateCards({ block }) {
  return (
    <section>
      <div className="mb-6">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#7a9900]">Paid link disclosure</p>
        <h2 className="mt-2 text-3xl font-black uppercase tracking-tight">{block.title || "Mount options by venue"}</h2>
        <p className="mt-3 text-sm font-bold text-zinc-600">{block.disclosure || "Some links may be affiliate links. Check suitability and venue rules before buying or using any mount."}</p>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {(block.items || []).map((item) => (
          <Card key={item.id || item.title}>
            {item.image && <div className="relative mb-4 aspect-video overflow-hidden rounded-none bg-zinc-100"><Image src={item.image} alt={item.title} fill className="object-cover" /></div>}
            <p className="mb-2 inline-flex rounded-full bg-[#CCFF00] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#050505]">Paid link</p>
            <h3 className="text-xl font-black uppercase tracking-tight">{item.title}</h3>
            <p className="mt-2 text-sm font-bold text-zinc-700">{item.bestFor}</p>
            <p className="mt-3 text-xs font-black uppercase tracking-widest text-zinc-500">{item.experienceLevel || "researched"} recommendation</p>
            {item.limitations && <p className="mt-3 text-sm font-medium text-zinc-600">{item.limitations}</p>}
            <a href={item.url} target="_blank" rel="sponsored nofollow noopener" className="mt-5 inline-flex rounded-full border-2 border-[#050505] bg-[#050505] px-5 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-[#CCFF00] hover:text-[#050505]">
              {item.ctaText || "View product"}
            </a>
            {item.lastChecked && <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Last checked: {item.lastChecked}</p>}
          </Card>
        ))}
      </div>
    </section>
  );
}

function FaqBlock({ block }) {
  const items = (block.items || []).filter((faq) => faq?.question);
  if (!items.length) return null;
  return (
    <section>
      <h2 className="mb-6 text-3xl font-black uppercase tracking-tight">Frequently asked questions</h2>
      <div className="space-y-3">
        {items.map((faq) => (
          <details key={faq.question} className="rounded-none border-2 border-[#050505] bg-white p-5">
            <summary className="cursor-pointer text-base font-black uppercase tracking-tight">{faq.question}</summary>
            <RichHtml html={faq.answer} className="mt-4 text-sm font-bold leading-relaxed text-zinc-700" />
          </details>
        ))}
      </div>
    </section>
  );
}

function CtaBlock({ block }) {
  const href = canonicalInternalHref(block.buttonUrl || "/contact");
  return (
    <section className="rounded-none border-4 border-[#050505] bg-[#050505] p-8 text-white shadow-[8px_8px_0px_#CCFF00]">
      <h2 className="text-3xl font-black uppercase tracking-tight">{block.headline}</h2>
      {block.description && <RichHtml html={block.description} className="mt-4 max-w-2xl text-sm font-bold leading-relaxed text-zinc-300" />}
      <Link href={href} className="mt-6 inline-flex rounded-full bg-[#CCFF00] px-6 py-3 text-xs font-black uppercase tracking-widest text-[#050505]">
        {block.buttonText || "Learn more"}
      </Link>
    </section>
  );
}

export function getVisibleFaqs(blocks = []) {
  return blocks
    .filter((block) => block.type === "faq" && block.hidden !== true)
    .flatMap((block) => block.items || [])
    .filter((faq) => faq?.question);
}

export default function CmsBlock({ block }) {
  if (!block || block.hidden === true) return null;
  if (block.type === "heading") return <HeadingBlock block={block} />;
  if (block.type === "richText") return <RichHtml html={block.html} className="text-base font-medium leading-relaxed text-zinc-700 [&_a]:font-black [&_a]:underline [&_a]:decoration-[#CCFF00] [&_a]:decoration-2 [&_a]:underline-offset-4" />;
  if (block.type === "image" && block.src) return <figure className="relative aspect-video overflow-hidden rounded-none border-4 border-[#050505] shadow-[6px_6px_0px_#050505]"><Image src={block.src} alt={block.alt || stripHtml(block.caption) || ""} fill className="object-cover" />{block.caption && <figcaption className="absolute inset-x-0 bottom-0 bg-black/70 p-3 text-xs font-bold text-white">{block.caption}</figcaption>}</figure>;
  if (block.type === "statsGrid") return <StatsGrid block={block} />;
  if (block.type === "featureGrid" || block.type === "evidencePanel" || block.type === "mediaGallery") return <FeatureGrid block={block} />;
  if (block.type === "comparisonTable" || block.type === "statusTable") return <TableBlock block={block} />;
  if (block.type === "pricingTeaser") return <PricingTeaser block={block} />;
  if (block.type === "workflowSteps" || block.type === "timeline") return <WorkflowSteps block={block} />;
  if (block.type === "limitations" || block.type === "notice") return <ListPanel block={{ ...block, items: block.items || [block.body].filter(Boolean) }} />;
  if (block.type === "affiliateProductCards") return <AffiliateCards block={block} />;
  if (block.type === "pitchDiagram") return <PitchDiagram block={block} />;
  if (block.type === "faq") return <FaqBlock block={block} />;
  if (block.type === "callToAction") return <CtaBlock block={block} />;
  if (block.type === "divider") return <hr className="border-zinc-200" />;
  return null;
}
