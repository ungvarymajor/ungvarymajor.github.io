const refModules = import.meta.glob<string>("@/assets/site/ref-*.jpg", {
  eager: true,
  import: "default",
});

function refIndex(path: string): number {
  const match = path.match(/ref-(\d+)\.jpg$/i);
  return match ? Number(match[1]) : 0;
}

/** ref-0.jpg … ref-18.jpg (19 images), sorted numerically */
export const REFERENCE_SLIDES: string[] = Object.entries(refModules)
  .sort(([a], [b]) => refIndex(a) - refIndex(b))
  .map(([, src]) => src);
