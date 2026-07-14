export const CONTENT_AUTHOR = Object.freeze({
  name: "Abdullah Luqman",
  url: "https://www.linkedin.com/in/abdullahluqman/",
});

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

export function getPublishedDate(data = {}) {
  return data.publishedAt || data.createdAt || data.date;
}

export function getUpdatedDate(data = {}) {
  return data.updatedAt || getPublishedDate(data);
}

const firstStringValue = (value) => {
  if (Array.isArray(value)) return value.find((item) => typeof item === "string" && item.trim()) || "";
  return typeof value === "string" ? value : "";
};

export function getContentAuthor(data = {}) {
  const authorObject = data.author && typeof data.author === "object" && !Array.isArray(data.author)
    ? data.author
    : {};
  const authorList = Array.isArray(data.authors) ? data.authors[0] : null;
  const firstAuthor = authorList && typeof authorList === "object" ? authorList : {};
  const authorName = firstStringValue(data.authorName || authorObject.name || firstAuthor.name || data.authors);
  const authorUrl = firstStringValue(data.authorUrl || authorObject.url || firstAuthor.url);

  return {
    name: authorName || CONTENT_AUTHOR.name,
    url: authorUrl || CONTENT_AUTHOR.url,
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
