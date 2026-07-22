import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { tools } from "@/lib/tools";
import { isIndexableContent } from "@/lib/contentPolicy";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const baseUrl = "https://pitchside.ai";

  // 1. Define your static routes
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
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1.0 : route === "/tools" ? 0.9 : 0.8,
  }));

  const toolRoutes = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  // 2. Fetch Dynamic Landing Pages from Firebase
  let dynamicPages = [];
  try {
    const pagesSnap = await getDocs(collection(db, "pages"));
    dynamicPages = pagesSnap.docs.filter((doc) => isIndexableContent(doc.data())).map((doc) => {
      const data = doc.data();
      const modified = data.updatedAt?.toDate() ?? data.createdAt?.toDate() ?? new Date();
      const path = data.parentPage?.url === "/technology" ? `/technology/${data.slug}` : `/${data.slug}`;
      return {
        url: `${baseUrl}${path}`,
        lastModified: modified,
        changeFrequency: "weekly",
        priority: 0.9,
      };
    });
  } catch (e) {
    console.warn("sitemap: could not fetch pages from Firestore:", e.message);
  }

  // 3. Fetch Dynamic Blog Posts from Firebase
  let dynamicPosts = [];
  try {
    const postsSnap = await getDocs(collection(db, "posts"));
    dynamicPosts = postsSnap.docs.filter((doc) => isIndexableContent(doc.data())).map((doc) => {
      const data = doc.data();
      const modified = data.updatedAt?.toDate() ?? data.createdAt?.toDate() ?? new Date();
      return {
        url: `${baseUrl}/blog/${data.slug}`,
        lastModified: modified,
        changeFrequency: "weekly",
        priority: 0.7,
      };
    });
  } catch (e) {
    console.warn("sitemap: could not fetch posts from Firestore:", e.message);
  }

  // Combine and return all routes
  const routes = [...staticRoutes, ...toolRoutes, ...dynamicPages, ...dynamicPosts];
  return [...new Map(routes.map((route) => [route.url, route])).values()];
}
