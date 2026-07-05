import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { isIndexableContent } from "@/lib/contentPolicy";
import { tools } from "@/lib/tools";

const hash = (value) => Array.from(value).reduce((total, char) => ((total * 31) + char.charCodeAt(0)) >>> 0, 0);

const normalizeSelected = (items = []) => items
  .filter((item) => item?.title && item?.url)
  .map((item) => ({
    type: item.type === "tool" ? "tool" : "blog",
    title: item.title,
    url: item.url,
    description: item.description || "",
  }));

export async function getMoreToRead(content, currentUrl, limit = 4) {
  const selected = normalizeSelected(content?.moreToRead);
  if (selected.length) return selected.filter((item) => item.url !== currentUrl).slice(0, limit);

  let blogItems = [];
  try {
    const snapshot = await getDocs(collection(db, "posts"));
    blogItems = snapshot.docs
      .map((postDoc) => ({ id: postDoc.id, ...postDoc.data() }))
      .filter(isIndexableContent)
      .map((post) => ({
        type: "blog",
        title: post.heroH1 || post.title,
        url: `/blog/${post.slug}`,
        description: post.metaDescription || post.intro || "",
      }));
  } catch (error) {
    console.error("Unable to load blog recommendations:", error);
  }

  const toolItems = tools.map((tool) => ({
    type: "tool",
    title: tool.title,
    url: `/tools/${tool.slug}`,
    description: tool.metaDescription || tool.description || "",
  }));

  return [...blogItems, ...toolItems]
    .filter((item) => item.url !== currentUrl)
    .sort((a, b) => hash(`${currentUrl}:${a.url}`) - hash(`${currentUrl}:${b.url}`))
    .slice(0, limit);
}
