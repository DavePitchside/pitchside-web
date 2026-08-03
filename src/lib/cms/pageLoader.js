import { cache } from "react";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cmsSeedPages } from "@/lib/cms/seedPages";
import { isPublishedCmsPage, normalizeCmsPage, normalizeRoutePath, routePathToDocId } from "@/lib/cms/pageSchema";

function serializeTimestamps(value) {
  if (!value) return value;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (typeof value.seconds === "number") return new Date(value.seconds * 1000).toISOString();
  if (Array.isArray(value)) return value.map(serializeTimestamps);
  if (typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, serializeTimestamps(item)]));
  return value;
}

function withId(snapshot) {
  return serializeTimestamps({ id: snapshot.id, ...snapshot.data() });
}

async function getByDeterministicDocId(routePath) {
  const snapshot = await getDoc(doc(db, "pages", routePathToDocId(routePath)));
  if (!snapshot.exists()) return null;
  const data = withId(snapshot);
  return normalizeRoutePath(data.routePath || routePath) === routePath ? data : null;
}

async function getUniqueByRoutePath(routePath) {
  const pageQuery = query(collection(db, "pages"), where("routePath", "==", routePath));
  const snapshot = await getDocs(pageQuery);
  if (snapshot.docs.length > 1) {
    throw new Error(`Duplicate CMS routePath documents found for ${routePath}: ${snapshot.docs.map((item) => item.id).join(", ")}`);
  }
  return snapshot.docs[0] ? withId(snapshot.docs[0]) : null;
}

export const getCmsPageByPath = cache(async (requestedRoutePath, { includeDraft = false, allowFallback = true } = {}) => {
  const routePath = normalizeRoutePath(requestedRoutePath);

  try {
    const directDoc = await getByDeterministicDocId(routePath);
    const routeDoc = directDoc || await getUniqueByRoutePath(routePath);
    if (routeDoc) {
      const page = normalizeCmsPage(routeDoc, routePath);
      if (includeDraft || isPublishedCmsPage(page)) return page;
      return null;
    }
  } catch (error) {
    console.error("CMS routePath lookup failed:", error);
    if (allowFallback && cmsSeedPages[routePath]) {
      console.warn(`Using local CMS seed content for ${routePath} because Firestore is unavailable.`);
      return normalizeCmsPage(cmsSeedPages[routePath], routePath);
    }
    throw error;
  }

  if (!allowFallback || !cmsSeedPages[routePath]) return null;
  return normalizeCmsPage(cmsSeedPages[routePath], routePath);
});
