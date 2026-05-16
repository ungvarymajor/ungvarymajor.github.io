import { copyFile, access, writeFile, readdir } from "node:fs/promises";
import path from "node:path";

const clientDir = path.resolve("dist/client");
const indexPath = path.join(clientDir, "index.html");
const notFoundPath = path.join(clientDir, "404.html");
const nojekyllPath = path.join(clientDir, ".nojekyll");

try {
  await access(indexPath);
} catch {
  console.error(
    "[gh-pages] dist/client/index.html is missing. Run build:pages (GITHUB_PAGES=true) so prerender runs.",
  );
  process.exit(1);
}

await copyFile(indexPath, notFoundPath);
await writeFile(nojekyllPath, "");
console.log("[gh-pages] Wrote dist/client/404.html and .nojekyll");

const topLevel = await readdir(clientDir, { withFileTypes: true });
const names = topLevel.map((e) => (e.isDirectory() ? `${e.name}/` : e.name));
console.log("[gh-pages] Artifact root (upload dist/client as-is):");
for (const name of names.sort()) {
  console.log(`  - ${name}`);
}

if (!names.includes("assets/")) {
  console.warn("[gh-pages] Warning: assets/ folder missing at artifact root.");
}
