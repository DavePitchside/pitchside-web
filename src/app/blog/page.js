import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import BlogListingClient from "./BlogListingClient";
import { isIndexableContent } from "@/lib/contentPolicy";

export const dynamic = "force-dynamic";

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

function getListingItem(data) {
  const item = {
    id: data.id,
    contentType: data.contentType,
    slug: data.slug,
    title: data.title,
    heroH1: data.heroH1,
    metaDescription: data.metaDescription,
    date: data.date,
    category: data.category,
    thumbnail: data.thumbnail,
    heroBackground: data.heroBackground,
    primaryImage: data.primaryImage,
    featuredImage: data.featuredImage,
    heroImage: data.heroImage,
    image: data.image,
    coverImage: data.coverImage,
    ogImage: data.ogImage,
    mediaUrl: data.mediaUrl,
    createdAt: data.createdAt,
  };

  return serializeDeep(item);
}

export default async function BlogPage() {
  let posts = [];

  try {
    const postsSnap = await getDocs(collection(db, "posts"));

    const fetchedPosts = postsSnap.docs.filter((doc) => isIndexableContent(doc.data())).map((doc) => ({
      id: doc.id,
      contentType: "post",
      ...doc.data(),
    }));

    const getMs = (item) => {
      const t = item.createdAt;
      if (!t) return 0;
      if (typeof t.toMillis === "function") return t.toMillis();
      if (typeof t.seconds === "number") return t.seconds * 1000;
      return 0;
    };

    posts = fetchedPosts.sort((a, b) => getMs(b) - getMs(a)).map(getListingItem);
  } catch (err) {
    console.error("Blog listing: failed to fetch content:", err);
  }

  return <BlogListingClient posts={posts} />;
}
