import { notFound, permanentRedirect } from "next/navigation";
import { cache } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SchemaMarkup from "@/components/SchemaMarkup";
import DynamicPageClient from "./DynamicPageClient";
import { DELETED_SLUGS, isIndexableContent } from "@/lib/contentPolicy";
import { cleanMetaTitle } from "@/lib/contentMeta";
import { getMoreToRead } from "@/lib/recommendations";
import CmsPageRenderer, { generateCmsMetadata } from "@/components/cms/CmsPageRenderer";
import { getCmsPageByPath } from "@/lib/cms/pageLoader";

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

const getPageData = cache(async (slug) => {
  const q = query(collection(db, "pages"), where("slug", "==", slug));
  const pagesSnap = await getDocs(q);
  const pageDoc = pagesSnap.docs.find((docSnapshot) => docSnapshot.data()?.parentPage?.url !== "/technology");
  if (pageDoc && isIndexableContent(pageDoc.data())) {
    return serializeData({ ...pageDoc.data(), _dataSource: "pages" });
  }
  const qPost = query(collection(db, "posts"), where("slug", "==", slug));
  const postsSnap = await getDocs(qPost);
  if (!postsSnap.empty && isIndexableContent(postsSnap.docs[0].data())) {
    return serializeData({ ...postsSnap.docs[0].data(), _dataSource: "posts" });
  }
  return null;
});

const getChildPosts = cache(async (parentUrl) => {
  const childQuery = query(collection(db, "posts"), where("parentPage.url", "==", parentUrl));
  const snapshot = await getDocs(childQuery);

  return snapshot.docs
    .map((postDoc) => ({ id: postDoc.id, ...postDoc.data() }))
    .filter(isIndexableContent)
    .map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.heroH1 || post.title,
      description: post.metaDescription || post.intro || "",
    }));
});

export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (DELETED_SLUGS.has(slug)) return {};
  const cmsPage = await getCmsPageByPath(`/${slug}`, { allowFallback: true });
  if (cmsPage) return generateCmsMetadata(`/${slug}`);

  const data = await getPageData(slug);
  if (!data) return {};

  const title = cleanMetaTitle(data.metaTitle || data.heroH1 || data.title);
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
  if (slug === "how-pitchside-ai-works") permanentRedirect("/technology/how-pitchside-ai-works");
  if (DELETED_SLUGS.has(slug)) notFound();
  const cmsPage = await getCmsPageByPath(`/${slug}`, { allowFallback: true });
  if (cmsPage) return <CmsPageRenderer routePath={`/${slug}`} />;

  const data = await getPageData(slug);
  if (!data) notFound();

  if (data._dataSource === "posts") permanentRedirect(`/blog/${slug}`);

  const { _dataSource: dataSource, ...pageData } = data;
  const childPosts = dataSource === "pages" ? await getChildPosts(`/${slug}`) : [];
  const moreToRead = await getMoreToRead(pageData, `/${slug}`);

  return (
    <>
      <SchemaMarkup data={pageData} type={dataSource === "posts" ? "BlogPosting" : "WebPage"} url={`/${slug}`} />
      <DynamicPageClient data={pageData} dataSource={dataSource} childPosts={childPosts} moreToRead={moreToRead} />
    </>
  );
}
