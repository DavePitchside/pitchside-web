import Link from "next/link";

export default function MoreToRead({ items = [], compact = false }) {
  if (!items.length) return null;

  return (
    <section className={compact ? "mt-10 border-t border-zinc-200 pt-8" : "mt-20 border-t-2 border-zinc-950 pt-12"}>
      <p className={compact ? "mb-5 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#7a9900]" : "mb-8 text-xs font-black uppercase tracking-[0.2em] text-zinc-500"}>
        More to read
      </p>
      <div className={compact ? "space-y-5" : "grid gap-4 md:grid-cols-2"}>
        {items.map((item) => (
          <Link
            key={`${item.type}:${item.url}`}
            href={item.url}
            className={compact
              ? "group block"
              : "group rounded-xl border-2 border-zinc-950 bg-white p-6 shadow-[4px_4px_0px_#000] transition-transform hover:-translate-y-1"}
          >
            <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#7a9900]">{item.type === "tool" ? "Tool" : "Article"}</span>
            <h3 className={`${compact ? "mt-1 text-sm" : "mt-2 text-lg"} font-bold leading-snug text-zinc-900 group-hover:text-[#7a9900]`}>{item.title}</h3>
            {!compact && item.description && <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-zinc-600">{item.description}</p>}
          </Link>
        ))}
      </div>
    </section>
  );
}
