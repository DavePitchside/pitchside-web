export const CONTENT_AUTHOR = Object.freeze({
  name: "Abdullah Luqman",
  url: "/authors/abdullah-luqman",
});

const AUTHOR_PROFILE_URLS = Object.freeze({
  "abdullah luqman": "/authors/abdullah-luqman",
  "dave coombs": "/authors/dave-coombs",
  "david coombs": "/authors/dave-coombs",
  "david andrew coombs": "/authors/dave-coombs",
});

const LEGACY_AUTHOR_URLS = Object.freeze({
  "https://www.linkedin.com/in/abdullahluqman/": "/authors/abdullah-luqman",
  "https://www.linkedin.com/in/abdullahluqman": "/authors/abdullah-luqman",
  "https://www.linkedin.com/in/david-coombs-pitchside/": "/authors/dave-coombs",
  "https://www.linkedin.com/in/david-coombs-pitchside": "/authors/dave-coombs",
});

export function normalizeAuthorProfileUrl(name = "", url = "") {
  const trimmedUrl = typeof url === "string" ? url.trim() : "";
  const lowerName = String(name || "").trim().toLowerCase();

  if (trimmedUrl === "/abdullah-luqman") return "/authors/abdullah-luqman";
  if (trimmedUrl === "/dave-coombs" || trimmedUrl === "/david-coombs") return "/authors/dave-coombs";
  if (LEGACY_AUTHOR_URLS[trimmedUrl]) return LEGACY_AUTHOR_URLS[trimmedUrl];
  if (AUTHOR_PROFILE_URLS[lowerName]) return AUTHOR_PROFILE_URLS[lowerName];
  return trimmedUrl || CONTENT_AUTHOR.url;
}

export function contentDateToDate(value) {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  if (typeof value?.seconds === "number") return new Date(value.seconds * 1000);

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatContentDate(value) {
  const date = contentDateToDate(value);
  if (!date) return "Not available";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function contentDateToIso(value) {
  return contentDateToDate(value)?.toISOString();
}

const objectData = (data) => data && typeof data === "object" ? data : {};

export function getPublishedDate(data = {}) {
  const content = objectData(data);
  return content.publishedAt || content.createdAt || content.date;
}

export function getUpdatedDate(data = {}) {
  const content = objectData(data);
  return content.updatedAt || getPublishedDate(content);
}

const firstStringValue = (value) => {
  if (Array.isArray(value)) return value.find((item) => typeof item === "string" && item.trim()) || "";
  return typeof value === "string" ? value : "";
};

export function getContentAuthor(data = {}) {
  const content = objectData(data);
  const authorObject = content.author && typeof content.author === "object" && !Array.isArray(content.author)
    ? content.author
    : {};
  const authorList = Array.isArray(content.authors) ? content.authors[0] : null;
  const firstAuthor = authorList && typeof authorList === "object" ? authorList : {};
  const authorName = firstStringValue(content.authorName || authorObject.name || firstAuthor.name || content.authors);
  const authorUrl = firstStringValue(content.authorUrl || authorObject.url || firstAuthor.url);

  return {
    name: authorName || CONTENT_AUTHOR.name,
    url: normalizeAuthorProfileUrl(authorName || CONTENT_AUTHOR.name, authorUrl || CONTENT_AUTHOR.url),
  };
}

export function normalizeBrandName(value = "") {
  return String(value)
    .replace(/\bPitchsideAI\b/g, "Pitchside AI")
    .replace(/\bPitchside Ai\b/g, "Pitchside AI")
    .replace(/\bPitchSide AI\b/g, "Pitchside AI");
}

export function cleanMetaTitle(value = "") {
  return normalizeBrandName(value)
    .replace(/\s*\|\s*Pitchside\s*AI\s*$/i, "")
    .replace(/\s*\|\s*PitchsideAI\s*$/i, "")
    .trim();
}
