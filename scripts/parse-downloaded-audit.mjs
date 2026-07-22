import fs from "fs";

const urls = [
  "/",
  "/football-analysis-app",
  "/football-stats-app",
  "/ai-football-analysis",
  "/football-video-analysis",
  "/ai-football-highlights",
  "/football-camera-app",
  "/record-football-matches",
  "/grassroots-football-app",
  "/technology",
  "/technology/how-pitchside-ai-works",
  "/pricing",
  "/product-status",
  "/security-and-data",
  "/editorial-policy",
  "/comparison-methodology",
  "/affiliate-disclosure",
  "/authors/dave-coombs",
  "/authors/abdullah-luqman",
  "/about",
  "/best-veo-alternative-football",
  "/blog/veo-camera-alternative",
  "/blog/cheapest-veo-alternative",
  "/blog/how-to-record-a-football-match-on-your-phone",
  "/technology/football-recording-setup",
];

const statuses = [
  200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200,
  404,
];

const phrases = [
  "do not publish",
  "this page should",
  "the site must",
  "approved launch",
  "canonical source",
  "in this draft",
  "should live",
  "should confirm",
  "designed to support searches",
  "the final list must",
  "this page sells",
  "approved product flow",
  "should be added",
  "Link:",
  "placeholder",
  "lorem ipsum",
  "TBD",
  "TODO",
];

const strip = (value = "") =>
  value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

const getAttr = (tag = "", name) => {
  const match = tag.match(new RegExp(`${name}=["']([^"']*)`, "i"));
  return match?.[1] || "";
};

const toAbsolute = (href) => {
  try {
    return new URL(href, "https://pitchside.ai").toString();
  } catch {
    return href;
  }
};

const results = urls.map((route, index) => {
  const html = fs.readFileSync(`/tmp/pitchside-audit-${index + 1}.html`, "utf8");
  const title = strip(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
  const descriptionTag = html.match(/<meta[^>]+name=["']description["'][^>]*>/i)?.[0] || "";
  const canonicalTag = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0] || "";
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => strip(match[1]));
  const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((match) => strip(match[1]));
  const links = [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)].map((match) => ({
    href: toAbsolute(match[1]),
    text: strip(match[2]).slice(0, 120),
    rel: getAttr(match[0], "rel"),
    target: getAttr(match[0], "target"),
  }));
  const lowerText = strip(html).toLowerCase();
  const instructionPhraseMatches = phrases.filter((phrase) => lowerText.includes(phrase.toLowerCase()));

  return {
    url: `https://pitchside.ai${route}`,
    status: statuses[index],
    title,
    metaDescription: getAttr(descriptionTag, "content"),
    canonical: getAttr(canonicalTag, "href"),
    h1s,
    h2s,
    internalLinks: links.filter((link) => link.href.startsWith("https://pitchside.ai")),
    externalLinks: links.filter(
      (link) => !link.href.startsWith("https://pitchside.ai") && !link.href.startsWith("mailto:") && !link.href.startsWith("tel:"),
    ),
    instructionPhraseMatches,
  };
});

fs.mkdirSync("audits", { recursive: true });
fs.writeFileSync("audits/2026-07-23-live-page-audit.json", JSON.stringify({ crawledAt: new Date().toISOString(), urls: results }, null, 2));

console.log("audits/2026-07-23-live-page-audit.json");
for (const result of results) {
  console.log(
    `${result.status} ${result.url} | title:${result.title.slice(0, 70)} | h1:${result.h1s.length} | suspect:${result.instructionPhraseMatches.join(",") || "-"}`,
  );
}
