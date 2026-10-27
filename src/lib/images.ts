import type { ImageMetadata } from 'astro';

const projectImages = import.meta.glob<{ default: ImageMetadata }>('/src/assets/projects/*/*.png', {
  eager: true,
});

/** Resolve an image from src/assets/projects/<slug>/<file>; fails the build if it is missing. */
export function projectImage(slug: string, file: string): ImageMetadata {
  const mod = projectImages[`/src/assets/projects/${slug}/${file}`];
  if (!mod) throw new Error(`Missing project image: ${slug}/${file}`);
  return mod.default;
}
