import { defineConfig } from "astro/config";

// `site` drives canonical URLs and Open Graph URLs. The sitemap is a static
// file in public/ (single-page site, no integration needed).
// NOTE before launch: set this to the final domain. This assumes a ROOT deploy
// (custom domain). If you deploy to the default github.io/devtools-pmf subpath,
// also set `base: "/devtools-pmf"` and update the absolute /fonts and /og.png
// references (CSS + <head>) to include the base, or they will 404.
export default defineConfig({
  site: "https://devtools-pmf.evilmartians.com",
  output: "static",
  compressHTML: true,
});
