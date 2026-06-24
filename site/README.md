# The DevTools Cookbook — site

A static [Astro](https://astro.build) site presenting the Cookbook recipes with an 80s retro-futurist, Evil Martians-branded design. It reads the `plays` from `../data/*.yml`, so it is always a view of the dataset.

## Develop

```bash
npm install
npm run dev      # regenerates data, then starts Astro dev server
```

## Build

```bash
npm run build    # writes static output to dist/
npm run preview  # serve the built site locally
```

The `prebuild`/`predev` step runs `../scripts/build-site-data.mjs`, which compiles the YAML plays into `src/data/cookbook.json` (generated, gitignored).

## Notes

- Fonts are Evil Martians' open-source **Martian Mono** and **Martian Grotesk** (`public/fonts/`).
- Brand red is `#E43C0C`.
- The "Test your company" CTA points to a placeholder in `src/pages/index.astro` (`BENCHMARK_URL`); set it to the real PMF Compass URL on evilmartians.com.
