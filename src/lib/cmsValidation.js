import { PRODUCT_STATUS } from "@/lib/productStatus";

export const EDITORIAL_INSTRUCTION_PHRASES = Object.freeze([
  "this page should",
  "this blog supports",
  "this article supports",
  "conversion angle",
  "search intent",
  "cost-objection search intent",
  "primary keyword",
  "target keyword",
  "landing page",
  "supporting blog",
  "supporting article",
  "internal links",
  "seo intent",
  "content cluster",
  "rank for",
  "conversion-focused",
  "product-focused page",
  "send readers deeper",
  "pitchside ecosystem",
  "topical authority",
  "keyword cannibalisation",
  "keyword cannibalization",
  "this section should",
  "cta placement",
  "commercial intent",
  "informational intent",
  "lorem ipsum",
  "example.com",
  "draft notes",
]);

export const UNSUPPORTED_CLAIM_PHRASES = Object.freeze([
  "tracks every player",
  "tracks every ball movement",
  "detects every event",
  "everything captured",
  "fully autonomous",
  "98% accuracy",
  "under three minutes",
  "<3m",
  "trained on thousands of hours",
  "broadcast-quality highlights",
  "proprietary optical engine",
  "records your stats instantly",
  "replaces veo",
  "no margin of error",
  "rivals professional camera systems",
]);

const walkStrings = (value, path = "content", result = []) => {
  if (typeof value === "string") {
    result.push({ path, value });
    return result;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => walkStrings(item, `${path}[${index}]`, result));
    return result;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => walkStrings(item, `${path}.${key}`, result));
  }
  return result;
};

const findPhraseHits = (strings, phrases, severity, message) =>
  strings.flatMap(({ path, value }) => {
    const normalized = value.toLowerCase();
    return phrases
      .filter((phrase) => normalized.includes(phrase))
      .map((phrase) => ({ severity, path, phrase, message }));
  });

export function validateContentForPublication(data = {}) {
  const strings = walkStrings(data);
  const issues = [
    ...findPhraseHits(
      strings,
      EDITORIAL_INSTRUCTION_PHRASES,
      "error",
      "Editorial or SEO planning language cannot be published."
    ),
    ...findPhraseHits(
      strings,
      UNSUPPORTED_CLAIM_PHRASES,
      "error",
      `This product claim is not supported by the central private-beta status (${PRODUCT_STATUS.overallStatus}).`
    ),
  ];

  const metaTitle = String(data.metaTitle || "");
  if (/\|\s*pitchside\s*ai/i.test(metaTitle) || /\|\s*pitchsideai/i.test(metaTitle)) {
    issues.push({
      severity: "error",
      path: "metaTitle",
      phrase: "| Pitchside AI",
      message: "Store a clean meta title. The global template appends the brand.",
    });
  }

  if (!String(data.metaDescription || "").trim()) {
    issues.push({
      severity: "warning",
      path: "metaDescription",
      phrase: "missing meta description",
      message: "Add a meta description before publishing.",
    });
  }

  if (data.ctaBlock?.buttonText && !String(data.ctaBlock?.buttonUrl || "").trim()) {
    issues.push({
      severity: "error",
      path: "ctaBlock.buttonUrl",
      phrase: "empty CTA link",
      message: "CTA buttons need a valid link.",
    });
  }

  return issues;
}
