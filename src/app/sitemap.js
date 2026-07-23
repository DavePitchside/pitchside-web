import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { tools } from "@/lib/tools";
import { isIndexableContent } from "@/lib/contentPolicy";
import { contentDateToDate } from "@/lib/contentMeta";

export const dynamic = "force-dynamic";

const STATIC_LAST_MODIFIED = "2026-07-23";

function sitemapDate(...values) {
  for (const value of values) {
    const date = contentDateToDate(value);
    if (date) return date;
  }
  return undefined;
}

function withOptionalLastModified(route, lastModified) {
  return lastModified ? { ...route, lastModified } : route;
}

export default async function sitemap() {
  const baseUrl = "https://pitchside.ai";

  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/technology",
    "/technology/football-recording-setup",
    "/tools",
    "/pricing",
    "/blog",
    "/privacy",
    "/terms",
    "/authors/dave-coombs",
    "/authors/abdullah-luqman",
    "/editorial-policy",
    "/comparison-methodology",
    "/affiliate-disclosure",
    "/product-status",
    "/recording-consent-and-privacy",
    "/security-and-data",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency: "monthly",
    priority: route === "" ? 1.0 : route === "/tools" ? 0.9 : 0.8,
  }));

  const toolRoutes = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  let dynamicPages = [];
  try {
    const pagesSnap = await getDocs(collection(db, "pages"));
    dynamicPages = pagesSnap.docs.filter((doc) => isIndexableContent(doc.data())).map((doc) => {
      const data = doc.data();
      const path = data.parentPage?.url === "/technology" ? `/technology/${data.slug}` : `/${data.slug}`;
      return withOptionalLastModified({
          url: `${baseUrl}${path}`,
          changeFrequency: "weekly",
          priority: 0.9,
        },
        sitemapDate(data.updatedAt, data.createdAt, data.publishedAt, data.date)
      );
    });
  } catch (e) {
    console.warn("sitemap: could not fetch pages from Firestore:", e.message);
  }

  let dynamicPosts = [];
  try {
    const postsSnap = await getDocs(collection(db, "posts"));
    dynamicPosts = postsSnap.docs.filter((doc) => isIndexableContent(doc.data())).map((doc) => {
      const data = doc.data();
      return withOptionalLastModified({
          url: `${baseUrl}/blog/${data.slug}`,
          changeFrequency: "weekly",
          priority: 0.7,
        },
        sitemapDate(data.updatedAt, data.createdAt, data.publishedAt, data.date)
      );
    });
  } catch (e) {
    console.warn("sitemap: could not fetch posts from Firestore:", e.message);
  }

  const routes = [...staticRoutes, ...toolRoutes, ...dynamicPages, ...dynamicPosts];
  return [...new Map(routes.map((route) => [route.url, route])).values()];
}
