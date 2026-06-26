import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import BlogListingClient from "./BlogListingClient";

export const dynamic = "force-dynamic";

const SYSTEM_CORE_PAGES = [
  "about", "contact", "technology", "privacy", "terms",
  "account-deletion", "admin", "home", "blog", "index", "",
];

function isTimestamp(v) {
  return v !== null && typeof v === "object" &&
    (typeof v.toMillis === "function" || (typeof v.seconds === "number" && typeof v.nanoseconds === "number"));
}

function toIso(v) {
  if (typeof v.toMillis === "function") return new Date(v.toMillis()).toISOString();
  return new Date(v.seconds * 1000).toISOString();
}

function serializeDeep(value) {
  if (isTimestamp(value)) return toIso(value);
  if (Array.isArray(value)) return value.map(serializeDeep);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, serializeDeep(v)]));
  }
  return value;
}

function serializeItem(data) {
  return serializeDeep(data);
}

export default async function BlogPage() {
  let posts = [];

  try {
    const [postsSnap, pagesSnap] = await Promise.all([
      getDocs(collection(db, "posts")),
      getDocs(collection(db, "pages")),
    ]);

    const fetchedPosts = postsSnap.docs.map((doc) => ({
      id: doc.id,
      contentType: "post",
      ...doc.data(),
    }));

    const fetchedPages = pagesSnap.docs
      .map((doc) => ({ id: doc.id, contentType: "page", ...doc.data() }))
      .filter((page) => {
        const s = (page.slug || "").trim().toLowerCase();
        const id = (page.id || "").trim().toLowerCase();
        return !SYSTEM_CORE_PAGES.includes(s) && !SYSTEM_CORE_PAGES.includes(id);
      });

    const getMs = (item) => {
      const t = item.createdAt;
      if (!t) return 0;
      if (typeof t.toMillis === "function") return t.toMillis();
      if (typeof t.seconds === "number") return t.seconds * 1000;
      return 0;
    };

    const merged = [...fetchedPosts, ...fetchedPages].sort((a, b) => getMs(b) - getMs(a));
    posts = merged.map(serializeItem);
  } catch (err) {
    console.error("Blog listing: failed to fetch content:", err);
  }

  return <BlogListingClient posts={posts} />;
}
