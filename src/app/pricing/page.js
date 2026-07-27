"use client";

import Link from "next/link";
import { ArrowUpRight, Check, ShieldCheck, Smartphone, Timer, X } from "lucide-react";
import { featureGroups, pricingFaqs, pricingPlans } from "@/lib/pricing";
import { companyInfo } from "@/lib/companyInfo";

const statusStyles = {
  "Available at launch": "border-[#CCFF00]/30 bg-[#CCFF00]/10 text-[#CCFF00]",
  "Planned for launch": "border-[#CCFF00]/30 bg-[#CCFF00]/10 text-[#CCFF00]",
  "Beta/limited": "border-[#CCFF00]/30 bg-white/5 text-[#CCFF00]",
  Planned: "border-white/15 bg-white/5 text-zinc-300",
};

function openEarlyAccess(planName) {
  window.dispatchEvent(new CustomEvent("open-pitchside-modal", {
    detail: {
      type: "waitlist",
      sourcePlacement: `Pricing ${planName} card`,
      sourceComponent: "PricingPage",
    },
  }));
}

function PlanCard({ plan }) {
  const isDark = plan.featured;

  return (
    <article className={`flex h-full min-h-[34rem] flex-col rounded-[1.75rem] border p-6 shadow-xl transition-transform hover:-translate-y-1 ${isDark ? "border-[#CCFF00] bg-black text-white shadow-[0_0_30px_rgba(204,255,0,0.2)]" : "border-black/10 bg-[#F4F3EF] text-black"}`}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className={`mb-2 text-[10px] font-black uppercase tracking-[0.22em] ${isDark ? "text-[#CCFF00]" : "text-black/50"}`}>
            {plan.billingType === "free" ? "Free launch tier" : "Paid launch tier"}
          </p>
          <h2 className="text-3xl font-black uppercase tracking-tight">{plan.name}</h2>
        </div>
        {plan.featured && <span className="rounded-full bg-[#CCFF00] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-black">Paid</span>}
      </div>

      <div className="mb-5">
        <span className={`text-5xl font-black tracking-tight ${isDark ? "text-[#CCFF00]" : "text-black"}`}>{plan.price}</span>
        <span className={`ml-2 text-sm font-bold ${isDark ? "text-zinc-400" : "text-black/60"}`}>{plan.cadence}</span>
        {plan.equivalent && <p className={`mt-2 text-sm font-bold ${isDark ? "text-zinc-300" : "text-black/70"}`}>{plan.equivalent}</p>}
        {plan.saving && <p className={`mt-1 text-xs font-black uppercase tracking-widest ${isDark ? "text-[#CCFF00]" : "text-black/50"}`}>{plan.saving}</p>}
      </div>

      <p className={`mb-5 text-sm font-bold leading-relaxed ${isDark ? "text-zinc-300" : "text-black/70"}`}>{plan.positioning}</p>
      <p className={`mb-6 rounded-xl border px-4 py-3 text-xs font-black uppercase tracking-widest ${isDark ? "border-white/10 bg-white/5 text-zinc-200" : "border-black/10 bg-white/60 text-black"}`}>
        {plan.allowance}
      </p>

      <ul className="mb-8 space-y-3">
        {plan.highlights.map((item) => (
          <li key={item} className="flex gap-3 text-sm font-bold">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#CCFF00] text-black">
              <Check className="h-3.5 w-3.5" />
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {plan.billingOptions && (
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-[#CCFF00]">Paid billing options</p>
          <ul className="space-y-2">
            {plan.billingOptions.map((option) => (
              <li key={option} className="text-sm font-bold text-zinc-200">{option}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={() => openEarlyAccess(plan.name)}
        className={`mt-auto inline-flex items-center justify-center gap-2 rounded-full px-5 py-4 text-xs font-black uppercase tracking-widest transition-colors active:scale-95 ${isDark ? "bg-white text-black hover:bg-[#CCFF00]" : "border border-black/10 bg-white/70 text-black hover:bg-[#CCFF00]"}`}
      >
        {plan.action} <ArrowUpRight className="h-4 w-4" />
      </button>
    </article>
  );
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#F4F3EF] text-white">
      <section className="flex min-h-screen items-center bg-[#F4F3EF] px-5 pb-16 pt-32 text-black md:px-12 md:pt-36">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">Free and Paid launch tiers</h1>
            <p className="mx-auto mt-4 max-w-3xl text-sm font-bold leading-relaxed text-zinc-600 md:text-lg">
              Weekly, monthly and annual are billing options for the same Paid tier, not separate feature plans.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {pricingPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-12 md:px-12">
        <div className="mx-auto max-w-7xl border border-white/10 bg-[#0A0A0A] p-6 md:p-10">
          <h2 className="mb-8 text-3xl font-black uppercase tracking-tight md:text-5xl">Complete feature comparison</h2>
          <div className="space-y-10">
            {featureGroups.map((group) => (
              <div key={group.name}>
                <h3 className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-[#CCFF00]">{group.name}</h3>
                <div className="overflow-hidden rounded-2xl border border-white/10">
                  <div className="grid grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr] bg-black/60 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    <span>Feature</span>
                    <span>Free</span>
                    <span>Paid</span>
                    <span>Status</span>
                  </div>
                  {group.rows.map((row) => (
                    <div key={row.feature} className="grid grid-cols-1 gap-3 border-t border-white/10 px-4 py-5 text-sm md:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr] md:items-center">
                      <span className="font-bold text-white">{row.feature}</span>
                      <span className="text-zinc-400">{row.free}</span>
                      <span className="text-zinc-400">{row.paid}</span>
                      <span className={`w-fit rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${statusStyles[row.status] || statusStyles.Planned}`}>{row.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-12 md:px-12">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
          {[
            {
              icon: Smartphone,
              title: "What counts as a recording",
              body: "One submitted match recording is expected to count as one recording. Duration, format, file-size, failed-upload and two-phone handling will be confirmed before subscriptions go live.",
            },
            {
              icon: Timer,
              title: "How processing works",
              body: "The current private-beta workflow can take up to 45 minutes depending on upload quality, queue volume, footage length and connection speed. Processing is fair-use limited while the model and upload flow improve.",
            },
            {
              icon: ShieldCheck,
              title: "Billing details",
              body: "Subscriptions are not purchasable yet. Prices are shown in GBP. Tax, regional store pricing, renewal, cancellation, refund and supported-country details will be published before checkout or app-store purchase is enabled.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <Icon className="mb-5 h-7 w-7 text-[#CCFF00]" />
                <h2 className="mb-3 text-2xl font-black uppercase tracking-tight">{item.title}</h2>
                <p className="text-sm font-medium leading-relaxed text-zinc-400">{item.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-5 py-12 md:px-12">
        <div className="mx-auto max-w-7xl border border-[#CCFF00]/30 bg-[#CCFF00] p-6 text-black md:p-10">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-black/60">Physical product separation</p>
          <h2 className="mb-4 text-3xl font-black uppercase tracking-tight md:text-5xl">The phone mount is separate</h2>
          <p className="max-w-3xl text-sm font-bold leading-relaxed text-black/75 md:text-lg">
            The Pitchside double-phone mount is a separate physical product and is not included in app subscriptions unless a future offer explicitly bundles it. Mount pricing, availability and shipping terms will be published when they are approved.
          </p>
        </div>
      </section>

      <section className="px-5 py-12 md:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-[#CCFF00]">FAQ</p>
            <h2 className="text-3xl font-black uppercase tracking-tight md:text-5xl">Pricing questions</h2>
          </div>
          <div className="space-y-3">
            {pricingFaqs.map((faq) => (
              <details key={faq.question} className="group rounded-2xl border border-white/10 bg-white/5 p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-black uppercase tracking-tight text-white">
                  {faq.question}
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/10 text-[#CCFF00] group-open:hidden">+</span>
                  <span className="hidden h-7 w-7 shrink-0 place-items-center rounded-full border border-white/10 text-[#CCFF00] group-open:grid">-</span>
                </summary>
                <p className="mt-4 text-sm font-medium leading-relaxed text-zinc-400">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-12 pb-24 md:px-12">
        <div className="mx-auto max-w-7xl border border-white/10 bg-[#F4F3EF] p-6 text-zinc-950 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-zinc-500">Trust and next step</p>
              <h2 className="mb-4 text-3xl font-black uppercase tracking-tight md:text-5xl">Choose a plan when Pitchside launches</h2>
              <p className="max-w-2xl text-sm font-bold leading-relaxed text-zinc-700 md:text-lg">
                {companyInfo.displayName}, registered in England and Wales No. {companyInfo.companyNumber}. Support is available through the contact page. Pricing is shown in GBP and tax/VAT wording will be confirmed before purchase is enabled.
              </p>
              <div className="mt-5 flex flex-wrap gap-4 text-sm font-black uppercase tracking-widest">
                <Link href="/terms" className="underline decoration-[#CCFF00] decoration-4 underline-offset-4">Terms</Link>
                <Link href="/privacy" className="underline decoration-[#CCFF00] decoration-4 underline-offset-4">Privacy</Link>
                <Link href="/contact" className="underline decoration-[#CCFF00] decoration-4 underline-offset-4">Support</Link>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={() => openEarlyAccess("Final CTA")} className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-4 text-xs font-black uppercase tracking-widest text-[#CCFF00] transition-colors hover:bg-[#CCFF00] hover:text-black">
                Join early access <ArrowUpRight className="h-4 w-4" />
              </button>
              <p className="flex items-start gap-2 text-xs font-bold leading-relaxed text-zinc-600">
                <X className="mt-0.5 h-4 w-4 shrink-0" />
                No payment is taken on this page.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
