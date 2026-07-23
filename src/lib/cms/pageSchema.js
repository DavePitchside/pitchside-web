import { canonicalInternalHref } from "@/lib/contentPolicy";
import { contentDateToIso } from "@/lib/contentMeta";

export const SITE_URL = "https://pitchside.ai";

export const PAGE_TYPES = Object.freeze([
  "product",
  "technology",
  "comparison",
  "hub",
  "trust",
  "legal",
  "author",
  "tool-hub",
  "blog-index",
  "blog-article",
  "tool",
]);

export const DESIGN_OPTION_WHITELISTS = Object.freeze({
  heroVariant: ["centered", "split", "compact", "media-led"],
  sectionDensity: ["comfortable", "compact"],
  cardStyle: ["flat", "bordered", "offset-shadow"],
  backgroundPattern: ["none", "grid", "pitch-lines", "glow"],
  accentMode: ["neon", "restrained"],
  contentWidth: ["narrow", "standard", "wide"],
  showStatusNotice: [true, false],
});

export function routePathToDocId(routePath = "/") {
  const normalized = normalizeRoutePath(routePath);
  if (normalized === "/") return "route-home";
  return `route-${normalized.replace(/^\/+/, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()}`;
}

export function normalizeRoutePath(routePath = "/") {
  if (typeof routePath !== "string") return "/";
  const trimmed = routePath.trim();
  if (!trimmed || trimmed === "/") return "/";
  return `/${trimmed.replace(/^\/+/, "").replace(/\/+$/, "")}`;
}

export function absoluteUrl(pathOrUrl = "") {
  if (!pathOrUrl) return SITE_URL;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

export function getSlugFromRoutePath(routePath = "/") {
  const normalized = normalizeRoutePath(routePath);
  if (normalized === "/") return "home";
  return normalized.split("/").filter(Boolean).at(-1) || "home";
}

export function getParentPathFromRoutePath(routePath = "/") {
  const segments = normalizeRoutePath(routePath).split("/").filter(Boolean);
  if (segments.length <= 1) return null;
  return `/${segments.slice(0, -1).join("/")}`;
}

export function sanitizeDesignOptions(options = {}, templateDefaults = {}) {
  const merged = { ...templateDefaults, ...(options || {}) };
  return Object.fromEntries(
    Object.entries(DESIGN_OPTION_WHITELISTS).map(([key, allowedValues]) => {
      const value = merged[key];
      return [key, allowedValues.includes(value) ? value : templateDefaults[key]];
    })
  );
}

function normalizeSeo(data = {}, routePath = "/") {
  const seo = data.seo || {};
  const metaTitle = seo.metaTitle || data.metaTitle || data.heroH1 || data.title || "";
  const metaDescription = seo.metaDescription || data.metaDescription || data.intro || "";
  return {
    metaTitle,
    metaDescription,
    canonical: normalizeRoutePath(seo.canonical || data.canonical || routePath),
    ogTitle: seo.ogTitle || metaTitle,
    ogDescription: seo.ogDescription || metaDescription,
    ogImage: seo.ogImage || data.primaryImage || data.heroBackground || "/og-image.png",
    robots: seo.robots || (data.noindex ? "noindex,nofollow" : "index,follow"),
  };
}

function normalizeHero(data = {}) {
  const hero = data.hero || {};
  return {
    eyebrow: hero.eyebrow || data.badge || data.category || "",
    h1: hero.h1 || data.heroH1 || data.title || "",
    intro: hero.intro || data.intro || data.metaDescription || "",
    media: hero.media || data.heroBackground || data.primaryImage || "",
    mediaAlt: hero.mediaAlt || data.heroH1 || data.title || "",
    primaryCta: hero.primaryCta || data.ctaBlock || {},
    secondaryCta: hero.secondaryCta || {},
  };
}

function legacyBlocks(data = {}) {
  const blocks = [];

  if (Array.isArray(data.tldrPoints) && data.tldrPoints.some(Boolean)) {
    blocks.push({ id: "summary", type: "limitations", title: "Summary", items: data.tldrPoints.filter(Boolean) });
  }

  if (data.aeoQuickAnswer) {
    blocks.push({ id: "quick-answer", type: "notice", title: "Quick answer", body: data.aeoQuickAnswer });
  }

  for (const block of data.contentBlocks || []) {
    if (block.type === "h2" || block.type === "h3") blocks.push({ ...block, type: "heading", level: block.type === "h3" ? 3 : 2, text: block.content });
    else if (block.type === "paragraph") blocks.push({ ...block, type: "richText", html: block.content });
    else if (block.type === "list") blocks.push({ ...block, type: "limitations", items: block.items || [] });
    else if (block.type === "image") blocks.push({ ...block, type: "image", src: block.content, alt: block.alt || data.title || "" });
    else if (block.type === "table") blocks.push({ ...block, type: "comparisonTable" });
  }

  if (Array.isArray(data.technologyStats) && data.technologyStats.length) {
    blocks.unshift({ id: "technology-stats", type: "statsGrid", items: data.technologyStats });
  }

  if (Array.isArray(data.technologyStack) && data.technologyStack.length) {
    blocks.push({ id: "technology-stack", type: "featureGrid", items: data.technologyStack.map((item) => ({ title: item.title, body: item.desc, icon: item.icon })) });
  }

  if (Array.isArray(data.technologySections) && data.technologySections.length) {
    for (const section of data.technologySections) {
      blocks.push({ id: section.id || section.h2, type: "heading", level: 2, text: section.h2 });
      for (const paragraph of section.content || []) blocks.push({ id: `${section.h2}-${paragraph.slice(0, 16)}`, type: "richText", html: paragraph });
      if (section.table) blocks.push({ id: `${section.h2}-table`, type: "comparisonTable", headers: section.table.headers, rows: (section.table.rows || []).map((row) => ({ cells: row })) });
    }
  }

  if (data.ctaBlock?.headline) blocks.push({ id: "cta", type: "callToAction", ...data.ctaBlock });
  if (Array.isArray(data.faqs) && data.faqs.length) blocks.push({ id: "faqs", type: "faq", items: data.faqs });

  return blocks;
}

export function isPublishedCmsPage(data = {}) {
  const status = String(data.status || data.publishStatus || "").toLowerCase();
  if (["draft", "deleted", "archived", "private", "unpublished"].includes(status)) return false;
  if (data.draft === true || data.deleted === true || data.archived === true) return false;
  if (data.published === false || data.isPublished === false) return false;
  return true;
}

export function normalizeCmsPage(data = {}, routePath = data.routePath || "/") {
  const normalizedRoutePath = normalizeRoutePath(data.routePath || routePath);
  const page = {
    id: data.id || routePathToDocId(normalizedRoutePath),
    routePath: normalizedRoutePath,
    slug: data.slug || getSlugFromRoutePath(normalizedRoutePath),
    parentPath: data.parentPath || data.parentPage?.url || getParentPathFromRoutePath(normalizedRoutePath),
    status: data.status || (data.published === false || data.draft === true ? "draft" : "published"),
    pageType: data.pageType || "product",
    templateKey: data.templateKey || "pitchside-product-hub",
    templateVersion: data.templateVersion || 1,
    title: data.title || data.heroH1 || "",
    seo: normalizeSeo(data, normalizedRoutePath),
    hero: normalizeHero(data),
    blocks: Array.isArray(data.blocks) && data.blocks.length ? data.blocks : legacyBlocks(data),
    author: data.author || { name: data.authorName || "", url: data.authorUrl || "" },
    reviewer: data.reviewer || { name: data.reviewedByName || "", url: data.reviewedByUrl || "" },
    schemaConfig: data.schemaConfig || {},
    designOptions: data.designOptions || {},
    publishedAt: contentDateToIso(data.publishedAt || data.createdAt || data.date),
    updatedAt: contentDateToIso(data.updatedAt || data.publishedAt || data.createdAt || data.date),
  };

  page.seo.canonical = canonicalInternalHref(page.seo.canonical || page.routePath);
  return page;
}
