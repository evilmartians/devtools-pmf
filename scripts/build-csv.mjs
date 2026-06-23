// Flattens data/*.yml into a long-format build/dataset.csv (one row per data point).
// dataset.csv is a generated artifact. Do not hand-edit it; edit the YAML and re-run.
// Run: npm run build:csv

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "data");
const outDir = path.join(root, "build");
fs.mkdirSync(outDir, { recursive: true });

const cols = [
  "company", "slug", "url", "sub_industry", "gtm",
  "field", "value", "as_of", "tier", "source_type", "source_url", "attribution",
];
const esc = (v) => {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};

const rows = [];
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".yml") || f.endsWith(".yaml"))) {
  const doc = yaml.load(fs.readFileSync(path.join(dir, f), "utf8"));
  for (const m of doc.metrics) {
    rows.push({
      company: doc.company, slug: doc.slug, url: doc.url,
      sub_industry: doc.sub_industry, gtm: doc.gtm,
      field: m.field, value: m.value, as_of: m.as_of, tier: m.tier,
      source_type: m.source_type, source_url: m.source_url, attribution: m.attribution,
    });
  }
}
rows.sort((a, b) => a.company.localeCompare(b.company) || a.field.localeCompare(b.field));

const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
fs.writeFileSync(path.join(outDir, "dataset.csv"), csv + "\n");
console.log(`Wrote build/dataset.csv (${rows.length} data points from ${rows.length ? new Set(rows.map((r) => r.slug)).size : 0} companies).`);
