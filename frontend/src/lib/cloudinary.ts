const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;

if (!CLOUD_NAME) {
  console.warn("[cloudinary] VITE_CLOUDINARY_CLOUD_NAME is not set.");
}

export interface CloudinaryOptions {
  width?: number;
  height?: number;
  /** Cloudinary crop mode. Defaults to "fill". */
  crop?: "fill" | "fit" | "scale" | "thumb" | "crop";
  /** Image quality. Defaults to "auto". */
  quality?: number | "auto";
  /** Output format. Defaults to "auto" (serves WebP/AVIF where supported). */
  format?: "auto" | "webp" | "jpg" | "png";
}

/**
 * Builds a Cloudinary delivery URL from a stored public ID.
 *
 * @param publicId  The public ID as stored in the database,
 *                  e.g. "montessori-wooden-puzzle-fish"
 * @param options   Optional Cloudinary transformations
 *
 * @example
 * getCloudinaryUrl("montessori-wooden-puzzle-fish", { width: 600, height: 600 })
 * // → "https://res.cloudinary.com/dgxkwhplx/image/upload/w_600,h_600,c_fill,q_auto,f_auto/montessori-wooden-puzzle-fish"
 */
export function getCloudinaryUrl(
  publicId: string,
  options: CloudinaryOptions = {}
): string {
  if (!publicId) return "";

  const {
    width,
    height,
    crop = "fill",
    quality = "auto",
    format = "auto",
  } = options;

  const transforms: string[] = [];

  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width || height) transforms.push(`c_${crop}`);
  transforms.push(`q_${quality}`);
  transforms.push(`f_${format}`);

  const transformStr = transforms.join(",");

  const url = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformStr}/${publicId}`;
  console.log("[cloudinary] publicId:", publicId, "→", url);
  return url;
}

/**
 * Returns the first usable image URL from a product's images array.
 * Falls back to a placeholder if the array is empty.
 */
export function getFirstImage(
  images: string[],
  options: CloudinaryOptions = {}
): string {
  const publicId = images?.[0];
  if (!publicId) return "https://placehold.co/600x600?text=ISA+Designs";
  return getCloudinaryUrl(publicId, options);
}
