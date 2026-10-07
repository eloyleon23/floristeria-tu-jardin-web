import type { ImageRef } from "@/types/catalog";
import { asset } from "@/lib/paths";

/**
 * Imagen pre-optimizada (WebP) con variante pequeña para pantallas estrechas.
 * Las imágenes se generan con scripts/import-wordpress.ts.
 */
export function Picture({
  image,
  sizes = "100vw",
  className = "",
  priority = false,
  alt,
}: {
  image: ImageRef;
  sizes?: string;
  className?: string;
  priority?: boolean;
  alt?: string;
}) {
  const smallWidth = Math.min(image.width, image.width >= 900 ? 600 : 450);
  return (
    <img
      src={asset(image.src)}
      srcSet={`${asset(image.thumb)} ${smallWidth}w, ${asset(image.src)} ${image.width}w`}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={alt ?? image.alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={className}
    />
  );
}
