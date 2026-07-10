import { PRODUCT_STATUS_NOTICE } from "@/lib/productStatus";

export default function ProductStatusNotice({ className = "" }) {
  return (
    <aside
      className={`rounded-2xl border border-[#CCFF00]/30 bg-[#CCFF00]/8 px-5 py-4 text-sm font-medium leading-relaxed text-zinc-200 ${className}`}
    >
      <span className="font-black uppercase tracking-[0.18em] text-[#CCFF00]">Product status</span>
      <p className="mt-2">{PRODUCT_STATUS_NOTICE}</p>
    </aside>
  );
}
