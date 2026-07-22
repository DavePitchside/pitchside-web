import fs from "fs";
import { execFileSync } from "child_process";

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

const toAbsolute = (href) => {
  try {
    return new URL(href, "https://pitchside.ai").toString();
  } catch {
    return href;
  }
};

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

const results = [];

for (const path of urls) {
  const url = toAbsolute(path);
  let html = "";
  let status = null;

  try {
    const tempPath = `/tmp/pitchside-audit-${encodeURIComponent(path).replace(/%/g, "_")}.html`;
    const statusLine = execFileSync("curl", ["-sL", "-A", "Mozilla/5.0 PitchsideAudit/1.0", "-o", tempPath, "-w", "%{http_code}", url], {
      encoding: "utf8",
      maxBuffer: 1024 * 1024,
    });
    status = Number(statusLine.trim());
    html = fs.readFileSync(tempPath, "utf8");
  } catch (error) {
    results.push({ url, error: error.message });
    continue;
  }

  const title = strip(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
  const descriptionTag =
    html.match(/<meta[^>]+name=["']description["'][^>]*>/i)?.[0] ||
    html.match(/<meta[^>]+property=["']og:description["'][^>]*>/i)?.[0] ||
    "";
  const canonicalTag = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0] || "";
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => strip(match[1]));
  const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((match) => strip(match[1]));
  const links = [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)].map((match) => ({
    href: toAbsolute(match[1]),
    text: strip(match[2]).slice(0, 120),
    rel: getAttr(match[0], "rel"),
    target: getAttr(match[0], "target"),
  }));
  const internalLinks = links.filter((link) => link.href.startsWith("https://pitchside.ai"));
  const externalLinks = links.filter(
    (link) => !link.href.startsWith("https://pitchside.ai") && !link.href.startsWith("mailto:") && !link.href.startsWith("tel:"),
  );
  const text = strip(html).toLowerCase();
  const instructionPhraseMatches = phrases.filter((phrase) => text.includes(phrase.toLowerCase()));
  const jsonLdTypes = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map((match) => {
    try {
      return JSON.parse(match[1])["@type"] || "unknown";
    } catch {
      return "unparseable";
    }
  });

  results.push({
    url,
    status,
    title,
    metaDescription: getAttr(descriptionTag, "content"),
    canonical: getAttr(canonicalTag, "href"),
    h1s,
    h2s,
    internalLinks,
    externalLinks,
    instructionPhraseMatches,
    jsonLdTypes,
  });
}

fs.mkdirSync("audits", { recursive: true });
const outputPath = "audits/2026-07-23-live-page-audit.json";
fs.writeFileSync(outputPath, JSON.stringify({ crawledAt: new Date().toISOString(), urls: results }, null, 2));
console.log(outputPath);
for (const result of results) {
  console.log(
    `${result.status} ${result.url} | h1:${result.h1s?.length ?? 0} | suspect:${result.instructionPhraseMatches?.join(",") || "-"} | canonical:${result.canonical || "-"}`,
  );
}
