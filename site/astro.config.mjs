import { defineConfig } from "astro/config";

// Static output. If deploying to GitHub Pages under a subpath, set `base`
// (e.g. base: "/devtools-pmf") and `site` accordingly.
export default defineConfig({
  output: "static",
  compressHTML: true,
});
