import { DELETED_SLUGS, canonicalRedirectHref } from "@/lib/redirects.mjs";

export { DELETED_SLUGS };

const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "blog",
  "contact",
  "account-deletion",
  "about",
  "home",
  "index",
  "privacy",
  "terms",
  "technology",
  "tools",
]);

export function isIndexableContent(data, { allowReserved = false } = {}) {
  if (!data || typeof data.slug !== "string") return false;

  const slug = data.slug.trim().toLowerCase();
  if (!slug || slug.includes("/") || DELETED_SLUGS.has(slug)) return false;
  if (!allowReserved && RESERVED_SLUGS.has(slug)) return false;

  const status = String(data.status || data.publishStatus || "").toLowerCase();
  if (["draft", "deleted", "archived", "private", "unpublished"].includes(status)) return false;
  if (data.draft === true || data.deleted === true || data.archived === true) return false;
  if (data.published === false || data.isPublished === false || data.noindex === true) return false;
  if (data.robots?.index === false || data.seo?.noindex === true) return false;

  return true;
}

export function canonicalInternalHref(href = "") {
  if (typeof href !== "string") return href;

  let path = href;
  try {
    const url = new URL(href, "https://pitchside.ai");
    if (!/^https?:$/i.test(url.protocol) || !["pitchside.ai", "www.pitchside.ai"].includes(url.hostname)) return href;
    path = `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return href;
  }

  return canonicalRedirectHref(path);
}

export function canonicalizeInternalLinks(html = "") {
  if (typeof html !== "string") return html;
  return html.replace(
    /href=(['"])([^'"]+)\1/gi,
    (_match, quote, href) => `href=${quote}${canonicalInternalHref(href)}${quote}`
  );
}
