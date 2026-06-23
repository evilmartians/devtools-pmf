# Contributing to DevTools PMF Benchmarks

Thank you for helping build an honest dataset. The value here is trust, so the rules below are mostly about provenance: where a number comes from and how confident we are in it.

## Two ways to contribute

### 1. Issue form (easiest)

Open the [Add a data point](../../issues/new?template=add-data-point.yml) issue form and fill the fields. A maintainer turns it into a data file. You never touch YAML.

### 2. Pull request

Add or edit a file in [`data/`](data/). One file per company, named `<slug>.yml`. Every PR is validated in CI against [`schema/company.schema.json`](schema/company.schema.json), so you get fast feedback if something is off.

```bash
npm install
npm run validate    # check your file before pushing
```

## The provenance tiers

Grade every data point into one of three tiers. This is the heart of the dataset.

- **Verified** — a primary source. An SEC filing, an official company post or press release, or a named spokesperson on record (podcast, interview, conference). Requires a working `source_url`.
- **Reported** — a single credible secondary source, such as journalism from TechCrunch, The Information, Forbes, or Bloomberg. Requires a working `source_url`.
- **Estimated** — an internal estimate, a self-report aggregator (GetLatka, Latka, Sacra), or unsourced. No URL required, but say where it came from in `attribution`.

If you are unsure, grade down. An honest `Estimated` is worth more than an optimistic `Verified`.

## File format

```yaml
company: "Acme"
slug: "acme"
url: "acme.com"
sub_industry: "tooling"      # tooling | infra | security
gtm: "PLG"                   # PLG | Sales-assisted | Enterprise
verified_at: "2026-06-22"
metrics:
  - field: "nrr"             # arr | funding_round | ttfv | retention | nrr | free_to_paid | organic
    value: "140%"            # always a string, include units
    as_of: "2026-03"
    tier: "Verified"         # Verified | Reported | Estimated
    source_type: "spokesperson"  # filing | press | spokesperson | journalism | aggregator | estimate
    source_url: "https://..."
    attribution: "CEO on X, Mar 2026"
    note: "Optional context."
    moved_the_needle: "Optional. The story behind the number; this powers the cookbook."
```

Rules the validator enforces:

- `slug` is lowercase, hyphenated, and matches the filename.
- `sub_industry`, `gtm`, `field`, `tier`, and `source_type` use the allowed values above.
- A `Verified` or `Reported` metric must have a non-empty `source_url`.
- `value` is always a quoted string.

## Founders submitting their own company

You are the best source for your own funnel numbers, which is exactly the data nobody else can provide.

- **Upgrade your tier.** If your company is currently `Estimated`, add a real source and move it to `Verified`.
- **Banded or anonymized is welcome.** If you cannot share an exact figure, a band is still useful: `free_to_paid: "3-5%"`. Set the tier honestly and explain in `attribution`.
- **Tell the story.** The `moved_the_needle` field is where you describe what changed the number. This is the most valuable part for other founders.

## Review

A maintainer reviews every submission for source quality and tier accuracy. We may ask for a source or adjust a tier. The goal is a dataset every reader can trust, so expect a friendly push for provenance.
