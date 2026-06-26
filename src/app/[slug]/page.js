import { notFound } from "next/navigation";
import { cache } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SchemaMarkup from "@/components/SchemaMarkup";
import DynamicPageClient from "./DynamicPageClient";

const SITE_URL = "https://pitchside.ai";

function serializeData(data) {
  if (!data) return data;
  const result = { ...data };
  if (result.createdAt?.seconds !== undefined) {
    result.createdAt = new Date(result.createdAt.seconds * 1000).toISOString();
  }
  if (result.updatedAt?.seconds !== undefined) {
    result.updatedAt = new Date(result.updatedAt.seconds * 1000).toISOString();
  }
  return result;
}

const getPageData = cache(async (slug) => {
  const q = query(collection(db, "pages"), where("slug", "==", slug));
  const pagesSnap = await getDocs(q);
  if (!pagesSnap.empty) {
    return serializeData({ ...pagesSnap.docs[0].data(), _dataSource: "pages" });
  }
  const qPost = query(collection(db, "posts"), where("slug", "==", slug));
  const postsSnap = await getDocs(qPost);
  if (!postsSnap.empty) {
    return serializeData({ ...postsSnap.docs[0].data(), _dataSource: "posts" });
  }
  return null;
});

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getPageData(slug);
  if (!data) return {};

  const title = data.metaTitle || data.heroH1 || data.title;
  const image = data.primaryImage || data.heroBackground || `${SITE_URL}/og-image.png`;

  return {
    title,
    description: data.metaDescription,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title,
      description: data.metaDescription,
      url: `${SITE_URL}/${slug}`,
      siteName: "Pitchside AI",
      type: data._dataSource === "posts" ? "article" : "website",
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

export default async function DynamicPage({ params }) {
  const { slug } = await params;
  const data = await getPageData(slug);
  if (!data) notFound();

  const { _dataSource: dataSource, ...pageData } = data;

  return (
    <>
      <SchemaMarkup data={pageData} type={dataSource === "posts" ? "BlogPosting" : "WebPage"} url={`/${slug}`} />
      <DynamicPageClient data={pageData} dataSource={dataSource} />
    </>
  );
}
