# DevTools PMF Benchmarks

A source-checked, tier-graded dataset of product-market-fit metrics for developer tools, infrastructure, and security companies. Every number carries a provenance tier and, where it exists, a link to the source.

Maintained by [Evil Martians](https://evilmartians.com). 2026 edition.

## Why this exists

Founders ask the same question and find no honest answer: "what is a good free-to-paid rate / NRR / time-to-value for a company like mine?" Generic SaaS benchmarks do not fit developer products, and most published numbers are aggregator guesses repeated until they look like fact.

This dataset is different in one way that matters: **we grade every data point by how well we can source it, and we say so out loud.** A number you can act on, and a number someone tweeted once, do not look the same here.

## The provenance tiers

| Tier | Meaning |
|------|---------|
| **Verified** | Primary source: an SEC filing, an official company post or press release, or a named spokesperson on record (podcast, interview, conference), with a working link. |
| **Reported** | A single credible secondary source: journalism such as TechCrunch, The Information, Forbes, Bloomberg, with a working link. |
| **Estimated** | An internal estimate, a self-report aggregator (GetLatka, Latka, Sacra), or unsourced. Honestly labeled as not independently confirmed. |

Of the current dataset, roughly 55% of data points are Verified, 12% Reported, 33% Estimated. The Estimated points are the open contribution opportunities (see below).

## What's in it

- **67 companies** across three sub-industries: `tooling`, `infra`, `security`.
- Seven metric fields per company where available: `arr`, `funding_round`, `ttfv` (time to first value), `retention`, `nrr` (net revenue retention), `free_to_paid`, `organic`.
- One file per company in [`data/`](data/), as readable YAML.

Every metric records its value, an as-of date, the provenance tier, the source type, the source URL, the attribution, and often a note on what moved the needle.

## Use the data

Browse [`data/`](data/) directly, or flatten everything into a single CSV:

```bash
npm install
npm run build:csv   # writes build/dataset.csv, one row per data point
```

`build/dataset.csv` is generated. Do not hand-edit it; edit the YAML and re-run.

## Contribute

We want founders of devtools, infra, and security companies to add and correct data points. Two ways:

1. **Open an issue** with the [Add a data point](../../issues/new?template=add-data-point.yml) form. Fill structured fields, no file editing needed.
2. **Open a pull request** that adds or edits a file in `data/`.

If you are submitting your own company's numbers, you can upgrade your company from `Estimated` to `Verified` by adding a real source. Banded or anonymized values are welcome (for example `free_to_paid: "3-5%"`) when you cannot share an exact figure.

Every pull request is automatically validated against [`schema/company.schema.json`](schema/company.schema.json). Read [CONTRIBUTING.md](CONTRIBUTING.md) before you start.

## Methodology and corrections

This dataset was rebuilt by re-sourcing every prior data point against primary sources and grading each one. Numbers that could not be confirmed were downgraded or dropped. We keep correcting in the open: if you find a wrong number, please open an issue.

## License

Data is licensed under [CC BY 4.0](LICENSE). Use it anywhere, including commercially, with attribution to Evil Martians and a link back to this repository. Scripts are MIT.
