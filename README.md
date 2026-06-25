# DevTools PMF

An open, source-checked dataset of how **67 developer-tools, infrastructure, and security companies** reached product-market fit. Every data point carries a provenance tier and, where it exists, a link to its source.

Maintained by [Evil Martians](https://evilmartians.com). 2026 edition.

It has two halves, built from the same per-company files:

- **The Benchmarks** — the *numbers*. ARR, NRR, free-to-paid, time-to-value, retention, organic share, with provenance tiers. Answers "what is good for a company like mine?"
- **The [Cookbook](cookbook/README.md)** — the *plays*. 198 transferable growth and PMF tactics, each generalized into a lesson you can run, backed by the company that ran it. Answers "what did they actually do?"

The companion **site** ([`site/`](site/)) presents the Cookbook with a filter-by-goal interface and surfaces each company's benchmark numbers inline.

## Why this exists

Founders ask the same questions and find no honest answer: "what's a good free-to-paid rate or NRR for a company like mine, and what did the companies that hit it actually do?" Generic SaaS benchmarks don't fit developer products, and most published numbers are aggregator guesses repeated until they look like fact.

This is different in one way that matters: **every data point is graded by how well we can source it, and we say so out loud.** A number you can act on and a number someone tweeted once do not look the same here.

## Provenance tiers

| Tier | Meaning |
|------|---------|
| **Verified** | Primary source: an SEC filing, an official company post or press release, or a named spokesperson on record (podcast, interview, conference), with a working link. |
| **Reported** | A single credible secondary source: journalism such as TechCrunch, The Information, Bloomberg, with a working link. |
| **Estimated** | An internal estimate, a self-report aggregator (GetLatka, Sacra), or widely reported with no single primary link. Honestly labeled as not independently confirmed. |

## What's in it

One readable YAML file per company in [`data/`](data/), with two kinds of data point:

- **`metrics`** (the Benchmarks): `arr`, `funding_round`, `ttfv`, `retention`, `nrr`, `free_to_paid`, `organic`. Each records a value, as-of date, tier, source.
- **`plays`** (the Cookbook): each has a `title`, a `goal` (Acquisition / Activation / Conversion / Retention / Expansion / Revenue) and, for acquisition, a channel `track`; a generalized **`learning`**, a **`when_it_works`** condition, the company's `result`, tags, and a sourced tier.

## Use the data

```bash
npm install
npm run build:csv        # Benchmarks -> build/dataset.csv (one row per metric)
npm run build:cookbook   # Cookbook   -> cookbook/README.md (recipes + tag index)

cd site && npm install && npm run dev    # the site, locally
```

Generated files (`build/`, `cookbook/README.md`, the site's data) are derived from `data/`. Don't hand-edit them; edit the YAML and re-run.

## Contribute

We want founders of devtools, infra, and security companies to add and correct data. Open an issue with the [Add a data point](../../issues/new?template=add-data-point.yml) form (structured fields, no file editing), or open a pull request against a file in [`data/`](data/).

If you're submitting your own company, you can upgrade it from `Estimated` to `Verified` by adding a real source. Banded or anonymized values are welcome (for example `free_to_paid: "3-5%"`) when you can't share an exact figure. Every PR is validated against [`schema/company.schema.json`](schema/company.schema.json) in CI. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Methodology

Every prior data point was re-sourced against primary sources and graded; numbers that couldn't be confirmed were downgraded or dropped. Each play was reviewed for whether it gives a founder an actionable advantage; generic or common-knowledge tactics were cut. We keep correcting in the open, if you find a wrong number, open an issue.

## License

Data is [CC BY 4.0](LICENSE): use it anywhere, including commercially, with attribution to Evil Martians and a link back to this repository. Scripts are MIT.
