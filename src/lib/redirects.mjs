export const LEGACY_REDIRECTS = Object.freeze({
  "/football-stats-without-gps": "/blog/track-football-stats-without-gps-vest",
  "/football-highlights-app": "/technology",
  "/best-football-stats-apps": "/tools",
  "/sunday-league-football": "/tools-for-sunday-league-football",
  "/how-pitchside-ai-works": "/technology/how-pitchside-ai-works",
  "/best-way-to-track-5aside-stats": "/blog/what-stats-matter-in-5-a-side-football",
  "/football-performance-analysis": "/football-analysis-app",
  "/football-player-tracking": "/ai-football-analysis",
});

export const DELETED_SLUGS = new Set(
  Object.keys(LEGACY_REDIRECTS).map((path) => path.slice(1))
);

export function redirectEntries() {
  return Object.entries(LEGACY_REDIRECTS).map(([source, destination]) => ({
    source,
    destination,
    permanent: true,
  }));
}

export function canonicalRedirectHref(href = "") {
  if (typeof href !== "string") return href;

  let path = href;
  let origin = "";
  try {
    const url = new URL(href, "https://pitchside.ai");
    if (!/^https?:$/i.test(url.protocol) || !["pitchside.ai", "www.pitchside.ai"].includes(url.hostname)) return href;
    path = `${url.pathname}${url.search}${url.hash}`;
    origin = href.startsWith("http") ? `${url.protocol}//${url.hostname}` : "";
  } catch {
    return href;
  }

  for (const [oldPath, newPath] of Object.entries(LEGACY_REDIRECTS)) {
    if (path === oldPath || path.startsWith(`${oldPath}?`) || path.startsWith(`${oldPath}#`)) {
      return `${origin}${newPath}${path.slice(oldPath.length)}`;
    }
  }

  return href;
}
