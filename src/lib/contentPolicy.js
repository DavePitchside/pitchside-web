export const LEGACY_REDIRECTS = Object.freeze({
  "/football-highlights-app": "/technology",
  "/best-football-stats-apps": "/tools",
  "/sunday-league-football": "/tools-for-sunday-league-football",
  "/football-stats-without-gps": "/blog/track-football-stats-without-gps-vest",
});

export const DELETED_SLUGS = new Set(
  Object.keys(LEGACY_REDIRECTS).map((path) => path.slice(1))
);

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

  for (const [oldPath, newPath] of Object.entries(LEGACY_REDIRECTS)) {
    if (path === oldPath || path.startsWith(`${oldPath}?`) || path.startsWith(`${oldPath}#`)) {
      return `${newPath}${path.slice(oldPath.length)}`;
    }
  }
  return href;
}

export function canonicalizeInternalLinks(html = "") {
  if (typeof html !== "string") return html;
  return html.replace(
    /href=(['"])([^'"]+)\1/gi,
    (_match, quote, href) => `href=${quote}${canonicalInternalHref(href)}${quote}`
  );
}
