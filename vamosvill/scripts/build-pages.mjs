/**
 * GitHub Pages build entrypoint. Sets GITHUB_PAGES so vite.config.ts applies
 * base /vamosvill/, disables Cloudflare, and enables prerender.
 */
import { spawnSync } from "node:child_process";

process.env.GITHUB_PAGES = "true";

const vite = spawnSync("npx", ["vite", "build"], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

if (vite.status !== 0) {
  process.exit(vite.status ?? 1);
}

const postbuild = spawnSync("node", ["scripts/gh-pages-postbuild.mjs"], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

process.exit(postbuild.status ?? 1);
