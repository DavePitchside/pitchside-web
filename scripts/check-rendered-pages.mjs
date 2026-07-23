const base = process.env.CHECK_BASE_URL || "http://localhost:3000";
const routes = [
  "/",
  "/pricing",
  "/football-analysis-app",
  "/football-stats-app",
  "/record-football-matches",
  "/technology",
  "/technology/football-recording-setup",
  "/blog",
  "/blog/how-to-record-a-football-match-on-your-phone",
  "/authors/dave-coombs",
  "/product-status",
  "/affiliate-disclosure",
];

function stripHtml(value = "") {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function tagAttribute(tag, attrName) {
  return tag.match(new RegExp(`${attrName}=["']([^"']*)["']`, "i"))?.[1] || "";
}

function metaContent(html, name) {
  const tag = [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map((match) => match[0])
    .find((item) => tagAttribute(item, "name").toLowerCase() === name);
  return tag ? tagAttribute(tag, "content") : "";
}

function linkHref(html, rel) {
  const tag = [...html.matchAll(/<link\b[^>]*>/gi)]
    .map((match) => match[0])
    .find((item) => tagAttribute(item, "rel").toLowerCase() === rel);
  return tag ? tagAttribute(tag, "href") : "";
}

const results = [];

for (const route of routes) {
  const response = await fetch(`${base}${route}`);
  const html = await response.text();
  const title = stripHtml(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
  const metaDescription = metaContent(html, "description");
  const canonical = linkHref(html, "canonical");
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => stripHtml(match[1]));
  const missingImages = [...html.matchAll(/<img\b[^>]+src=["']([^"']*)["']/gi)]
    .map((match) => match[1])
    .filter((src) => src.startsWith("/_next/image") && src.includes("url=%2F"))
    .map((src) => decodeURIComponent(src.match(/url=([^&]+)/)?.[1] || ""));

  results.push({
    route,
    status: response.status,
    title,
    metaDescription,
    canonical,
    h1Count: h1s.length,
    h1s,
    localNextImageSources: [...new Set(missingImages)],
  });
}

console.log(JSON.stringify(results, null, 2));
