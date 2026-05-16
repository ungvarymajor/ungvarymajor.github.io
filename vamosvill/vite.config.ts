// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
const GITHUB_PAGES_BASE = "/vamosvill/";
const isGitHubPages =
  process.env.GITHUB_PAGES === "true" || process.env.GITHUB_PAGES === "1";

export default defineConfig({
  // Cloudflare worker bundle is incompatible with GitHub Pages (static files only).
  cloudflare: isGitHubPages ? false : undefined,
  tanstackStart: {
    server: { entry: "server" },
    ...(isGitHubPages
      ? {
          router: { basepath: GITHUB_PAGES_BASE.replace(/\/$/, "") },
          prerender: { enabled: true, crawlLinks: true },
        }
      : {}),
  },
  vite: {
    base: isGitHubPages ? GITHUB_PAGES_BASE : undefined,
  },
});
