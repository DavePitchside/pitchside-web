import { notFound } from "next/navigation";
import { cache } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SchemaMarkup from "@/components/SchemaMarkup";
import DynamicPageClient from "@/app/[slug]/DynamicPageClient";
import { isIndexableContent } from "@/lib/contentPolicy";
import { cleanMetaTitle } from "@/lib/contentMeta";
import { getMoreToRead } from "@/lib/recommendations";
import CmsPageRenderer, { generateCmsMetadata } from "@/components/cms/CmsPageRenderer";
import { getCmsPageByPath } from "@/lib/cms/pageLoader";

export const dynamic = "force-dynamic";

const SITE_URL = "https://pitchside.ai";

const fallbackTechnologyPages = {
  "how-pitchside-ai-works": {
    id: "technology-how-pitchside-ai-works",
    title: "How Pitchside AI Works",
    heroH1: "How Pitchside AI Works",
    metaTitle: "How Pitchside AI Works",
    metaDescription: "Learn how Pitchside turns suitable phone-recorded small-sided football footage into supported stats, highlights and player records during private beta.",
    slug: "how-pitchside-ai-works",
    category: "Technology",
    landingLayout: "compact",
    parentPage: { title: "Technology", url: "/technology" },
    authorName: "Abdullah Luqman",
    authorUrl: "/authors/abdullah-luqman",
    reviewedByName: "Dave Coombs",
    reviewedByUrl: "/authors/dave-coombs",
    publishedAt: "2026-07-23T00:00:00.000Z",
    updatedAt: "2026-07-23T00:00:00.000Z",
    tldrPoints: [
      "Pitchside is in private beta and focuses on suitable phone-recorded small-sided football footage.",
      "The beta is testing supported events including goals, assists, saves, passes and tackles.",
      "Detected events and player assignments should be reviewed before treating the match record as final.",
    ],
    aeoQuickAnswer: "Pitchside analyses suitable phone-recorded football footage, tests event detection and player assignment, then returns supported stats, highlights and records for review.",
    contentBlocks: [
      { id: "record-the-match", type: "h2", content: "Record the match" },
      { id: "record-the-match-copy", type: "paragraph", content: "Pitchside starts with suitable phone-recorded footage from small-sided football. A stable landscape recording, clear view of the important playing area and safe mounting position all improve the chance of useful output." },
      { id: "upload-for-processing", type: "h2", content: "Upload for processing" },
      { id: "upload-for-processing-copy", type: "paragraph", content: "After recording, footage is uploaded for analysis. Current upload and processing can take up to 45 minutes during testing, depending on file size, connection quality and queue conditions." },
      { id: "event-detection", type: "h2", content: "Event detection in private beta" },
      { id: "event-detection-copy", type: "paragraph", content: "The beta is testing supported events around goals, assists, saves, passes and tackles. Output can vary by footage quality, camera position, lighting, obstruction and kit similarity." },
      { id: "reviewable-output", type: "h2", content: "Reviewable output" },
      { id: "reviewable-output-copy", type: "paragraph", content: "Pitchside output should be reviewed before it is treated as final. Detected moments, player assignments and match records may need correction or reporting during beta." },
      { id: "what-pitchside-does-not-claim", type: "h2", content: "What Pitchside does not claim" },
      { id: "what-pitchside-does-not-claim-copy", type: "paragraph", content: "Pitchside does not currently claim perfect accuracy, instant processing, public app-store availability or GPS-style physical load metrics. Check <a href=\"/product-status\">Product Status</a> for the latest confirmed capabilities." },
    ],
    faqs: [
      { question: "Is Pitchside publicly available?", answer: "Pitchside is currently in private beta. Public availability will be confirmed on Product Status." },
      { question: "Does Pitchside guarantee perfect stats?", answer: "No. Detected events and player assignments should be reviewed before treating the match record as final." },
      { question: "What footage does Pitchside focus on?", answer: "Pitchside currently focuses on suitable phone-recorded 5-a-side, 6-a-side and 7-a-side football footage." },
    ],
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

const getTechnologyPage = cache(async (slug) => {
  const pageQuery = query(collection(db, "pages"), where("slug", "==", slug));
  const snapshot = await getDocs(pageQuery);
  const pageDoc = snapshot.docs.find((docSnapshot) => docSnapshot.data()?.parentPage?.url === "/technology");

  if (!pageDoc || !isIndexableContent(pageDoc.data())) return null;
  return serializeData({ id: pageDoc.id, ...pageDoc.data() });
});

const getTechnologyPageOrFallback = cache(async (slug) => {
  const data = await getTechnologyPage(slug);
  return data || fallbackTechnologyPages[slug] || null;
});

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const routePath = `/technology/${slug}`;
  const cmsPage = await getCmsPageByPath(routePath, { allowFallback: true });
  if (cmsPage) return generateCmsMetadata(routePath);

  const data = await getTechnologyPageOrFallback(slug);
  if (!data) return {};

  const title = cleanMetaTitle(data.metaTitle || data.heroH1 || data.title);
  const image = data.primaryImage || data.heroBackground || `${SITE_URL}/og-image.png`;

  return {
    title,
    description: data.metaDescription,
    alternates: { canonical: `/technology/${slug}` },
    openGraph: {
      title,
      description: data.metaDescription,
      url: `${SITE_URL}/technology/${slug}`,
      siteName: "Pitchside AI",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@pitchsideai",
      title,
      description: data.metaDescription,
      images: [image],
    },
  };
}

export default async function TechnologySubpage({ params }) {
  const { slug } = await params;
  const routePath = `/technology/${slug}`;
  const cmsPage = await getCmsPageByPath(routePath, { allowFallback: true });
  if (cmsPage) return <CmsPageRenderer routePath={routePath} />;

  const data = await getTechnologyPageOrFallback(slug);
  if (!data) notFound();

  const moreToRead = await getMoreToRead(data, `/technology/${slug}`);

  return (
    <>
      <SchemaMarkup data={data} type="WebPage" url={`/technology/${slug}`} />
      <DynamicPageClient data={data} dataSource="pages" childPosts={[]} moreToRead={moreToRead} />
    </>
  );
}
