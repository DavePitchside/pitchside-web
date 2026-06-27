import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { tools } from "@/lib/tools";

const DELETED_SLUGS = new Set([
  "football-highlights-app",
  "best-football-stats-apps",
  "sunday-league-football",
]);

export default async function sitemap() {
  const baseUrl = "https://pitchside.ai";

  // 1. Define your static routes
  const staticRoutes = ["", "/about", "/contact", "/technology", "/tools", "/blog", "/privacy", "/terms"].map((route) => ({
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
    dynamicPages = pagesSnap.docs.filter((doc) => !DELETED_SLUGS.has(doc.data().slug)).map((doc) => {
      const data = doc.data();
      const modified = data.updatedAt?.toDate() ?? data.createdAt?.toDate() ?? new Date();
      return {
        url: `${baseUrl}/${data.slug}`,
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
    dynamicPosts = postsSnap.docs.filter((doc) => !DELETED_SLUGS.has(doc.data().slug)).map((doc) => {
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
  return [...staticRoutes, ...toolRoutes, ...dynamicPages, ...dynamicPosts];
}
