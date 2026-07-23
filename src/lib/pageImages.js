export const DEFAULT_PAGE_IMAGE = "/1.webp";
const DEFAULT_IMAGE_PATHS = new Set([DEFAULT_PAGE_IMAGE, "/og-image.png", "/logo.png"]);

export function isDefaultPageImage(value) {
  if (typeof value !== "string" || !value.trim()) return false;

  try {
    const url = new URL(value, "https://pitchside.ai");
    if (["example.com", "www.example.com"].includes(url.hostname)) return true;
    return ["pitchside.ai", "www.pitchside.ai"].includes(url.hostname)
      && (DEFAULT_IMAGE_PATHS.has(url.pathname) || url.pathname.startsWith("/images/"));
  } catch {
    return DEFAULT_IMAGE_PATHS.has(value.trim());
  }
}

const IMAGE_FIELDS = [
  "thumbnail",
  "heroBackground",
  "primaryImage",
  "featuredImage",
  "heroImage",
  "image",
  "coverImage",
  "ogImage",
  "mediaUrl",
];

export function getPageImage(item, fallback = DEFAULT_PAGE_IMAGE) {
  const image = IMAGE_FIELDS.map((field) => item?.[field])
    .find((value) => typeof value === "string" && value.trim() !== "");

  return image?.trim() || fallback;
}

export function getPageMedia(item) {
  return getPageImage(item, "");
}

export function isVideoUrl(url) {
  return typeof url === "string" && (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url) || url.includes("video"));
}
