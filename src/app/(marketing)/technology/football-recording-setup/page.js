import { cache } from "react";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SchemaMarkup from "@/components/SchemaMarkup";
import DynamicPageClient from "@/app/[slug]/DynamicPageClient";
import { cleanMetaTitle } from "@/lib/contentMeta";
import { getMoreToRead } from "@/lib/recommendations";

export const dynamic = "force-dynamic";

const SITE_URL = "https://pitchside.ai";
const PAGE_ID = "technology-football-recording-setup";
const PAGE_SLUG = "football-recording-setup";
const PAGE_ROUTE = "/technology/football-recording-setup";

const fallbackPage = {
  id: PAGE_ID,
  title: "Football Recording Setup",
  heroH1: "How to Set Up Your Phone to Record a Football Match",
  metaTitle: "How to Set Up Phones to Record a Football Match",
  metaDescription: "Set up one or two phones to record football, reduce blind spots and choose the right fence mount, post mount or tripod for your pitch.",
  slug: PAGE_SLUG,
  category: "Setup Guide",
  badge: "Recording setup",
  landingLayout: "compact",
  parentPage: { title: "Technology", url: "/technology" },
  authorName: "Abdullah Luqman",
  authorUrl: "/authors/abdullah-luqman",
  reviewedByName: "Dave Coombs",
  reviewedByUrl: "/authors/dave-coombs",
  publishedAt: "2026-07-23T00:00:00.000Z",
  updatedAt: "2026-07-23T00:00:00.000Z",
  tldrPoints: [
    "Use one phone when a stable wide view covers the important playing area.",
    "Use two phones when one angle repeatedly misses the far half or key moments.",
    "Choose the mount from the venue: secure fencing, a solid post or a stable freestanding tripod.",
  ],
  aeoQuickAnswer: "A useful football recording starts before kickoff. Check the venue, consent, mounting point, battery, storage and framing before the match starts.",
  contentBlocks: [
    { id: "before-you-arrive", type: "h2", content: "Before you arrive" },
    { id: "before-you-arrive-copy", type: "paragraph", content: "Check the pitch size, available fencing or posts, venue rules, safe mounting locations, required consent, battery, storage and weather. The right setup is the one that keeps the important playing area in frame without creating a safety risk." },
    { id: "one-phone-setup", type: "h2", content: "One-phone setup" },
    { id: "one-phone-setup-copy", type: "paragraph", content: "One phone works best on smaller pitches when a wide, stable landscape view can capture the important playing area. A central elevated position is usually the most balanced option. A raised corner or behind-goal position can work on compact small-sided pitches." },
    { id: "one-phone-setup-limit", type: "paragraph", content: "Test the frame before kickoff, avoid digital zoom and avoid unnecessary panning. One phone does not guarantee complete coverage." },
    { id: "two-phone-setup", type: "h2", content: "Two-phone setup" },
    { id: "two-phone-setup-copy", type: "paragraph", content: "Two phones can cover opposing halves or different angles. Record an obvious synchronisation moment on both phones, such as kickoff or a visible clap before the game." },
    { id: "two-phone-setup-limit", type: "paragraph", content: "Secure both phones before kickoff and keep orientation and settings consistent where possible. Two phones reduce blind spots, but they do not remove every obstruction." },
    { id: "common-blind-spots", type: "h2", content: "Common blind spots" },
    {
      id: "common-blind-spots-list",
      type: "list",
      items: [
        "Players blocking the view at pitch level.",
        "Action disappearing into a far corner.",
        "Goal-area obstruction.",
        "Substitutes or spectators walking across the lens.",
        "Netting, posts or fencing crossing the lens.",
        "Sun glare or rain on the lens.",
        "Excessive zoom.",
        "Mount movement caused by wind or impact.",
      ],
    },
    { id: "mounting-on-rigid-fencing", type: "h2", content: "Mounting on rigid fencing" },
    { id: "mounting-on-rigid-fencing-copy", type: "paragraph", content: "A budget flexible fence mount can be a practical starting point when the venue has solid fencing. This is the inexpensive style of mount Dave has used himself. It is not suitable for loose netting or places where the phone could be struck by the ball." },
    { id: "mounting-on-a-supporting-post", type: "h2", content: "Mounting on a supporting post" },
    { id: "mounting-on-a-supporting-post-copy", type: "paragraph", content: "Where venue rules allow it, a post mount can be more stable than attaching directly to perimeter netting. Check that the post is secure and that the mount cannot fall into the playing area." },
    { id: "recording-on-open-grass", type: "h2", content: "Recording on open grass" },
    { id: "recording-on-open-grass-copy", type: "paragraph", content: "A freestanding tripod is usually the most practical option when there is no suitable fencing, railing or post. Position it outside the playing area and pedestrian routes, and use appropriate ballast when conditions allow." },
    { id: "battery-storage-and-interruptions", type: "h2", content: "Battery, storage and interruptions" },
    { id: "battery-storage-and-interruptions-copy", type: "paragraph", content: "Charge the phone before leaving, free enough storage for one uninterrupted recording and turn on a suitable focus mode so calls or notifications do not interrupt the match. Recording settings affect file size and battery use, so test your own device before relying on it for a full match." },
    { id: "consent-and-safety", type: "h2", content: "Consent and safety" },
    { id: "consent-and-safety-copy", type: "paragraph", content: "Only record where the venue and competition allow it. Inform players and organisers before kickoff, and review <a href=\"/recording-consent-and-privacy\">recording consent and privacy guidance</a> before sharing clips." },
    { id: "pitchside-double-phone-mount-status", type: "h2", content: "Pitchside double-phone mount status" },
    { id: "pitchside-double-phone-mount-status-copy", type: "paragraph", content: "Pitchside is developing its own double-phone mounting option for players and teams that want a more consistent two-phone setup. Compatibility, pricing and availability will be published after testing. Check <a href=\"/product-status\">Product Status</a> for the latest confirmed status." },
    { id: "final-checklist", type: "h2", content: "Final checklist" },
    {
      id: "final-checklist-list",
      type: "list",
      items: [
        "Confirm the venue allows recording and mounting equipment.",
        "Get the necessary recording consent before filming.",
        "Use landscape orientation.",
        "Keep both goals and the important playing area visible.",
        "Keep the mount outside the playing area and emergency routes.",
        "Check battery, storage and lens cleanliness.",
        "Record a short test clip and watch it before kickoff.",
        "Do not leave recording equipment unattended.",
      ],
    },
  ],
  faqs: [
    { question: "Is one phone enough to record a football match?", answer: "Yes, if a wide and stable view captures the important playing area. Use two phones when one angle leaves repeated blind spots." },
    { question: "Where should I position the phone?", answer: "Start with a central elevated position and adjust after watching a short test clip." },
    { question: "Can I attach a phone directly to football netting?", answer: "Usually no. Loose netting moves and can put the phone at risk. Use a secure post only if venue rules allow it." },
    { question: "What mount should I use on an open grass pitch?", answer: "Use a stable freestanding tripod positioned away from players, spectators and emergency routes." },
  ],
  ctaBlock: {
    headline: "Turn your recording into more than a video",
    description: "Pitchside is being built to connect suitable phone-recorded footage with supported match statistics, highlights, personal records and leaderboards.",
    buttonText: "Join the Launch List",
    buttonUrl: "/contact",
  },
};

function serializeData(data) {
  if (!data) return data;
  const result = { ...data };
  for (const field of ["publishedAt", "createdAt", "updatedAt"]) {
    if (result[field]?.seconds !== undefined) {
      result[field] = new Date(result[field].seconds * 1000).toISOString();
    }
  }
  return result;
}

function normalizeSetupPage(data = {}) {
  return {
    ...fallbackPage,
    ...data,
    id: data.id || PAGE_ID,
    slug: PAGE_SLUG,
    parentPage: { title: "Technology", url: "/technology" },
  };
}

function isRenderablePage(data) {
  const status = String(data?.status || data?.publishStatus || "").toLowerCase();
  return !["draft", "deleted", "archived", "private", "unpublished"].includes(status)
    && data?.draft !== true
    && data?.deleted !== true
    && data?.archived !== true
    && data?.published !== false
    && data?.isPublished !== false
    && data?.noindex !== true
    && data?.robots?.index !== false
    && data?.seo?.noindex !== true;
}

const getFootballRecordingSetupPage = cache(async () => {
  try {
    const directSnapshot = await getDoc(doc(db, "pages", PAGE_ID));
    if (directSnapshot.exists() && isRenderablePage(directSnapshot.data())) {
      return normalizeSetupPage(serializeData({ id: directSnapshot.id, ...directSnapshot.data() }));
    }

    const slugQuery = query(collection(db, "pages"), where("slug", "==", PAGE_SLUG));
    const slugSnapshot = await getDocs(slugQuery);
    const pageDoc = slugSnapshot.docs.find((docSnapshot) => docSnapshot.data()?.parentPage?.url === "/technology");
    if (pageDoc && isRenderablePage(pageDoc.data())) {
      return normalizeSetupPage(serializeData({ id: pageDoc.id, ...pageDoc.data() }));
    }
  } catch (error) {
    console.warn("football recording setup: using fallback content:", error.message);
  }

  return fallbackPage;
});

export async function generateMetadata() {
  const data = await getFootballRecordingSetupPage();
  const title = cleanMetaTitle(data.metaTitle || data.heroH1 || data.title);
  const description = data.metaDescription || fallbackPage.metaDescription;
  const image = data.primaryImage || data.heroBackground || `${SITE_URL}/og-image.png`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}${PAGE_ROUTE}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${PAGE_ROUTE}`,
      siteName: "Pitchside AI",
      type: "article",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@pitchsideai",
      title,
      description,
      images: [image],
    },
  };
}

export default async function FootballRecordingSetupPage() {
  const data = await getFootballRecordingSetupPage();
  const moreToRead = await getMoreToRead(data, PAGE_ROUTE);

  return (
    <>
      <SchemaMarkup data={data} type="Article" url={PAGE_ROUTE} />
      <DynamicPageClient data={data} dataSource="pages" childPosts={[]} moreToRead={moreToRead} />
    </>
  );
}
