export function frameToJpeg(
  src: HTMLVideoElement | HTMLImageElement,
  max = 768,
  quality = 0.86,
) {
  const canvas = document.createElement("canvas");
  const sw =
    src instanceof HTMLVideoElement ? src.videoWidth : src.naturalWidth;
  const sh =
    src instanceof HTMLVideoElement ? src.videoHeight : src.naturalHeight;
  if (!sw || !sh) return null;
  const scale = Math.min(1, max / Math.max(sw, sh));
  canvas.width = Math.round(sw * scale);
  canvas.height = Math.round(sh * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(src, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", quality);
}

export async function fileToJpeg(file: File) {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return frameToJpeg(img);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function urlToJpeg(src: string) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = src;
  await img.decode();
  return frameToJpeg(img);
}
