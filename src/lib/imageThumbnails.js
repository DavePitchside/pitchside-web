const DEFAULT_THUMBNAIL_OPTIONS = {
  maxWidth: 900,
  maxHeight: 675,
  quality: 0.78,
  type: "image/webp",
};

export async function createImageThumbnailBlob(file, options = {}) {
  if (!file?.type?.startsWith("image/")) return null;

  const { maxWidth, maxHeight, quality, type } = {
    ...DEFAULT_THUMBNAIL_OPTIONS,
    ...options,
  };

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(objectUrl);
    const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) return null;

    context.drawImage(image, 0, 0, width, height);

    return await new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), type, quality);
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}
