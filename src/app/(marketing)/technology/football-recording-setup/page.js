import Link from "next/link";
import { ArrowUpRight, Check, ShieldCheck, Smartphone, TriangleAlert } from "lucide-react";

const SITE_URL = "https://pitchside.ai";

export const metadata = {
  title: "How to Set Up Phones to Record a Football Match",
  description:
    "Set up one or two phones to record football, reduce blind spots and choose the right fence mount, post mount or tripod for your pitch.",
  alternates: { canonical: `${SITE_URL}/technology/football-recording-setup` },
  openGraph: {
    title: "How to Set Up Phones to Record a Football Match",
    description:
      "Set up one or two phones to record football, reduce blind spots and choose the right fence mount, post mount or tripod for your pitch.",
    url: `${SITE_URL}/technology/football-recording-setup`,
    siteName: "Pitchside AI",
    type: "article",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "Pitchside football recording setup guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Set Up Phones to Record a Football Match",
    description:
      "Set up one or two phones to record football, reduce blind spots and choose the right fence mount, post mount or tripod for your pitch.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

const affiliateLinks = [
  {
    title: "Mounting on rigid fencing",
    bestFor: "Caged 5-a-side pitches with secure fencing or railings",
    limitation: "Not suitable for loose netting or places where the phone could be struck by the ball.",
    copy: "A budget flexible fence mount can be a practical starting point when the venue has solid fencing. This is the inexpensive style of mount Dave has used himself.",
    href: "https://amzn.to/44FurlS",
    cta: "View the budget fence mount on Amazon - paid link",
  },
  {
    title: "Mounting with additional cover",
    bestFor: "Fenced pitches where glare or changeable weather is a concern",
    limitation: "A hood is not a waterproofing guarantee. Stop recording if weather could damage the phone or make the setup unsafe.",
    copy: "A covered fence mount gives the phone more surrounding cover and may help with direct sunlight or light rain.",
    href: "https://amzn.to/4fpobUq",
    cta: "View the covered fence mount on Amazon - paid link",
  },
  {
    title: "Mounting on a supporting post",
    bestFor: "Pitches with netting and a suitable solid supporting post",
    limitation: "Do not attach equipment to loose netting or anywhere the mount could fall into play.",
    copy: "Where venue rules allow it, a post mount can be more stable than attaching directly to perimeter netting.",
    href: "https://amzn.to/4bnus1N",
    cta: "View the post mount on Amazon - paid link",
  },
];

const checklist = [
  "Confirm the venue allows recording and mounting equipment.",
  "Get the necessary recording consent before filming.",
  "Use landscape orientation.",
  "Keep both goals and the important playing area visible.",
  "Keep the mount outside the playing area and emergency routes.",
  "Check battery, storage and lens cleanliness.",
  "Record a short test clip and watch it before kickoff.",
  "Do not leave recording equipment unattended.",
];

function Diagram({ type }) {
  const twoPhone = type === "two";
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl border-2 border-[#7a9900] bg-[#CCFF00]/10">
        <div className="absolute inset-y-0 left-1/2 w-px bg-[#7a9900]/50" />
        <div className="absolute left-3 top-1/2 h-16 w-8 -translate-y-1/2 rounded-r-full border-2 border-[#7a9900]/50 border-l-0" />
        <div className="absolute right-3 top-1/2 h-16 w-8 -translate-y-1/2 rounded-l-full border-2 border-[#7a9900]/50 border-r-0" />
        <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#7a9900]/50" />
        {twoPhone ? (
          <>
            <div className="absolute bottom-3 left-[43%] rounded-full bg-black px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#CCFF00]">Phone 1</div>
            <div className="absolute top-3 right-[43%] rounded-full bg-black px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#CCFF00]">Phone 2</div>
            <div className="absolute bottom-10 left-[19%] h-16 w-[28%] rounded-full border border-black/20 bg-black/5" />
            <div className="absolute right-[19%] top-10 h-16 w-[28%] rounded-full border border-black/20 bg-black/5" />
          </>
        ) : (
          <>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#CCFF00]">Phone</div>
            <div className="absolute bottom-11 left-[24%] h-20 w-[52%] rounded-full border border-black/20 bg-black/5" />
          </>
        )}
      </div>
      <p className="mt-3 text-xs font-bold leading-relaxed text-zinc-500">
        Example only. Exact placement depends on the venue, safe mounting points and what the test clip shows.
      </p>
    </div>
  );
}

export default function FootballRecordingSetupPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Set Up Your Phone to Record a Football Match",
    description: metadata.description,
    author: { "@type": "Person", name: "Abdullah Luqman", url: `${SITE_URL}/authors/abdullah-luqman` },
    publisher: { "@type": "Organization", name: "Pitchside AI", logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` } },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/technology/football-recording-setup` },
    datePublished: "2026-07-23",
    dateModified: "2026-07-23",
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Technology", item: `${SITE_URL}/technology` },
      { "@type": "ListItem", position: 3, name: "Football recording setup", item: `${SITE_URL}/technology/football-recording-setup` },
    ],
  };

  return (
    <main data-header-theme="light" className="min-h-screen bg-[#F4F3EF] px-5 pb-24 pt-32 text-zinc-950 md:px-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <article className="mx-auto max-w-4xl">
        <p className="mb-4 text-[10px] font-black uppercase tracking-[0.24em] text-[#7a9900]">Recording setup</p>
        <h1 className="font-alpha text-5xl uppercase leading-[0.88] tracking-tighter md:text-7xl" style={{ fontFamily: "var(--font-alpha)" }}>
          How to Set Up Your Phone to Record a Football Match
        </h1>
        <p className="mt-6 max-w-3xl text-lg font-medium leading-relaxed text-zinc-700">
          A useful football recording starts before kickoff. The number of phones, their height and the shape of the pitch all affect what the footage captures. This guide explains one-phone and two-phone setups, common blind spots and which type of mount suits different venues.
        </p>
        <div className="mt-6 rounded-2xl border border-[#CCFF00]/40 bg-[#CCFF00]/15 p-5 text-sm font-bold leading-relaxed text-zinc-800">
          Pitchside is currently in private beta. Check <Link href="/product-status" className="underline decoration-[#CCFF00] decoration-4 underline-offset-4">Product Status</Link> for current app and mount availability.
        </div>

        <section className="mt-16 space-y-5">
          <h2 className="text-3xl font-black uppercase tracking-tight">Before you arrive</h2>
          <p className="text-lg leading-relaxed text-zinc-700">Check the pitch size, available fencing or posts, venue rules, safe mounting locations, required consent, battery, storage and weather. The right setup is the one that keeps the important playing area in frame without creating a safety risk.</p>
        </section>

        <section className="mt-16 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight">One-phone setup</h2>
            <p className="mt-5 text-lg leading-relaxed text-zinc-700">One phone works best on smaller pitches when a wide, stable landscape view can capture the important playing area. A central elevated position is usually the most balanced option. A raised corner or behind-goal position can work on compact small-sided pitches.</p>
            <p className="mt-4 text-lg leading-relaxed text-zinc-700">Test the frame before kickoff, avoid digital zoom and avoid unnecessary panning. One phone does not guarantee complete coverage.</p>
          </div>
          <Diagram type="one" />
        </section>

        <section className="mt-16 grid gap-8 md:grid-cols-2">
          <Diagram type="two" />
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight">Two-phone setup</h2>
            <p className="mt-5 text-lg leading-relaxed text-zinc-700">Two phones can cover opposing halves or different angles. Record an obvious synchronisation moment on both phones, such as kickoff or a visible clap before the game.</p>
            <p className="mt-4 text-lg leading-relaxed text-zinc-700">Secure both phones before kickoff and keep orientation and settings consistent where possible. Two phones reduce blind spots, but they do not remove every obstruction.</p>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-black uppercase tracking-tight">Common blind spots</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {[
              "Players blocking the view at pitch level",
              "Action disappearing into a far corner",
              "Goal-area obstruction",
              "Substitutes or spectators walking across the lens",
              "Netting, posts or fencing crossing the lens",
              "Sun glare or rain on the lens",
              "Excessive zoom",
              "Mount movement caused by wind or impact",
            ].map((item) => (
              <div key={item} className="rounded-xl border border-zinc-200 bg-white p-4 text-sm font-bold text-zinc-700">{item}</div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-black uppercase tracking-tight">Choose a mount for the venue</h2>
          <p className="mt-5 text-lg leading-relaxed text-zinc-700">The right mount depends less on your phone and more on what surrounds the pitch. Before buying anything, check whether the venue has rigid fencing, netting posts or completely open grass.</p>
          <p className="mt-5 rounded-2xl border border-zinc-200 bg-white p-5 text-sm font-bold leading-relaxed text-zinc-700">
            Affiliate disclosure: Some links below are paid links. If you buy through them, Pitchside may earn a commission at no additional cost to you. Our recommendations are based on suitability for different pitch setups, not commission rates. As an Amazon Associate I earn from qualifying purchases.
          </p>
          <div className="mt-6 grid gap-5">
            {affiliateLinks.map((item) => (
              <article key={item.title} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h3 className="text-2xl font-black uppercase tracking-tight">{item.title}</h3>
                <p className="mt-3 text-sm font-black uppercase tracking-widest text-[#7a9900]">Best for: {item.bestFor}</p>
                <p className="mt-4 text-base font-medium leading-relaxed text-zinc-700">{item.copy}</p>
                <p className="mt-3 flex gap-2 text-sm font-bold leading-relaxed text-zinc-500"><TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#7a9900]" /> {item.limitation}</p>
                <p className="mt-3 text-xs font-black uppercase tracking-widest text-zinc-500">Affiliate status: paid link</p>
                <a href={item.href} target="_blank" rel="sponsored nofollow noopener" className="mt-5 inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-xs font-black uppercase tracking-widest text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black">
                  {item.cta} <ArrowUpRight className="h-4 w-4" />
                </a>
              </article>
            ))}
            <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="text-2xl font-black uppercase tracking-tight">Recording on open grass</h3>
              <p className="mt-3 text-sm font-black uppercase tracking-widest text-[#7a9900]">Best for: Sunday league and open grass pitches with nothing secure to attach to</p>
              <p className="mt-4 text-base font-medium leading-relaxed text-zinc-700">A freestanding tripod is usually the most practical option when there is no suitable fencing, railing or post. Position it outside the playing area and pedestrian routes, and use appropriate ballast when conditions allow.</p>
              <p className="mt-3 flex gap-2 text-sm font-bold leading-relaxed text-zinc-500"><TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#7a9900]" /> The supplied tripod link duplicates the post-mount link, so no tripod buying button is included.</p>
            </article>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-black uppercase tracking-tight">Battery, storage and interruptions</h2>
          <p className="mt-5 text-lg leading-relaxed text-zinc-700">Charge the phone before leaving, free enough storage for one uninterrupted recording and turn on a suitable focus mode so calls or notifications do not interrupt the match. Recording settings affect file size and battery use, so test your own device before relying on it for a full match.</p>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-black uppercase tracking-tight">Consent and safety</h2>
          <p className="mt-5 text-lg leading-relaxed text-zinc-700">Only record where the venue and competition allow it. Inform players and organisers before kickoff, and review <Link href="/recording-consent-and-privacy" className="underline decoration-[#CCFF00] decoration-4 underline-offset-4">recording consent and privacy guidance</Link> before sharing clips.</p>
        </section>

        <section className="mt-16 rounded-2xl border border-zinc-200 bg-white p-6">
          <ShieldCheck className="mb-4 h-7 w-7 text-[#7a9900]" />
          <h2 className="text-3xl font-black uppercase tracking-tight">Pitchside double-phone mount status</h2>
          <p className="mt-5 text-lg leading-relaxed text-zinc-700">Pitchside is developing its own double-phone mounting option for players and teams that want a more consistent two-phone setup. Compatibility, pricing and availability will be published after testing.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/contact" className="rounded-full bg-[#CCFF00] px-5 py-3 text-xs font-black uppercase tracking-widest text-black">Join early access</Link>
            <Link href="/product-status" className="rounded-full border border-black/10 px-5 py-3 text-xs font-black uppercase tracking-widest text-black hover:bg-black hover:text-[#CCFF00]">Check Product Status</Link>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-black uppercase tracking-tight">Final checklist</h2>
          <ul className="mt-6 space-y-3">
            {checklist.map((item) => (
              <li key={item} className="flex gap-3 text-base font-bold text-zinc-700">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#CCFF00] text-black"><Check className="h-3 w-3" /></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-black uppercase tracking-tight">Troubleshooting</h2>
          <div className="mt-6 space-y-4">
            {[
              ["Is one phone enough?", "Yes, if a wide and stable view captures the important playing area. Use two phones when one angle leaves repeated blind spots."],
              ["Where should I position the phone?", "Start with a central elevated position and adjust after watching a short test clip."],
              ["Can I attach a phone directly to football netting?", "Usually no. Loose netting moves and can put the phone at risk. Use a secure post only if venue rules allow it."],
              ["What should I use on open grass?", "Use a stable freestanding tripod positioned away from players, spectators and emergency routes."],
            ].map(([question, answer]) => (
              <div key={question} className="rounded-2xl border border-zinc-200 bg-white p-5">
                <h3 className="text-xl font-black tracking-tight">{question}</h3>
                <p className="mt-2 text-base leading-relaxed text-zinc-700">{answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] bg-black p-8 text-white md:p-10">
          <Smartphone className="mb-5 h-8 w-8 text-[#CCFF00]" />
          <h2 className="text-4xl font-black uppercase tracking-tight">Turn your recording into more than a video</h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-300">Pitchside is being built to connect suitable phone-recorded footage with supported match statistics, highlights, personal records and leaderboards.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="rounded-full bg-[#CCFF00] px-6 py-4 text-xs font-black uppercase tracking-widest text-black">Join the Launch List</Link>
            <Link href="/product-status" className="rounded-full border border-white/15 px-6 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-white hover:text-black">Check Product Status</Link>
          </div>
        </section>
      </article>
    </main>
  );
}
