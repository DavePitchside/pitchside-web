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

export function getContentAuthor(data = {}) {
  return {
    name: data.authorName || CONTENT_AUTHOR.name,
    url: data.authorUrl || CONTENT_AUTHOR.url,
  };
}
