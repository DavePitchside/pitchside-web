import { notFound } from "next/navigation";
import { cache } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SchemaMarkup from "@/components/SchemaMarkup";
import DynamicPageClient from "@/app/[slug]/DynamicPageClient";
import { isIndexableContent } from "@/lib/contentPolicy";
import { cleanMetaTitle } from "@/lib/contentMeta";
import { getMoreToRead } from "@/lib/recommendations";

export const dynamic = "force-dynamic";

const SITE_URL = "https://pitchside.ai";

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

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getTechnologyPage(slug);
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
  const data = await getTechnologyPage(slug);
  if (!data) notFound();

  const moreToRead = await getMoreToRead(data, `/technology/${slug}`);

  return (
    <>
      <SchemaMarkup data={data} type="WebPage" url={`/technology/${slug}`} />
      <DynamicPageClient data={data} dataSource="pages" childPosts={[]} moreToRead={moreToRead} />
    </>
  );
}
