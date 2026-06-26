export const DEFAULT_PAGE_IMAGE = "/1.png";

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
