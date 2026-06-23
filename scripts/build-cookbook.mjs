// Generates the DevTools Cookbook from the plays in data/*.yml.
// The Cookbook is a view of the dataset: every recipe is a sourced "play",
// and tags become the A-Z cross-reference index. Output: cookbook/README.md.
// Run: npm run build:cookbook

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "data");
const outDir = path.join(root, "cookbook");
fs.mkdirSync(outDir, { recursive: true });

const CATEGORY_LABEL = { tooling: "Tooling", infra: "Infrastructure", security: "Security" };

// Collect every play across all companies.
const recipes = [];
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".yml") || f.endsWith(".yaml"))) {
  const doc = yaml.load(fs.readFileSync(path.join(dir, f), "utf8"));
  for (const p of doc.plays || []) {
    recipes.push({
      company: doc.company,
      url: doc.url,
      sub_industry: doc.sub_industry,
      title: p.title,
      summary: p.summary,
      metric_moved: p.metric_moved || "",
      result: p.result || "",
      tier: p.tier,
      source_url: p.source_url || "",
      attribution: p.attribution || "",
      tags: (p.tags || []).slice().sort(),
    });
  }
}

// Order recipes by category, then company, then title; assign stable ids.
const CAT_ORDER = { tooling: 0, infra: 1, security: 2 };
recipes.sort((a, b) =>
  (CAT_ORDER[a.sub_industry] - CAT_ORDER[b.sub_industry]) ||
  a.company.localeCompare(b.company) ||
  a.title.localeCompare(b.title)
);
recipes.forEach((r, i) => (r.id = `recipe-${i + 1}`));

// Build the tag index.
const byTag = new Map();
for (const r of recipes) for (const t of r.tags) {
  if (!byTag.has(t)) byTag.set(t, []);
  byTag.get(t).push(r);
}
const tagsSorted = [...byTag.keys()].sort();

const companies = new Set(recipes.map((r) => r.company));
const md = [];

md.push("# The DevTools Cookbook");
md.push("");
md.push("Reusable growth and product-market-fit recipes from real developer tools, infrastructure, and security companies. Every recipe is a documented play with a source. This file is generated from the dataset in [`data/`](../data); edit the plays there, not here.");
md.push("");
md.push(`**${recipes.length} recipes** from **${companies.size} companies**, cross-referenced by **${tagsSorted.length} tags**.`);
md.push("");

// ---- Index by tag (the A-Z cross-reference) ----
md.push("## Index by tag");
md.push("");
md.push("Jump to every recipe that used a given tactic or channel.");
md.push("");
for (const t of tagsSorted) {
  const list = byTag.get(t);
  md.push(`### \`${t}\` <sup>${list.length}</sup>`);
  md.push("");
  for (const r of list) md.push(`- [${r.title} — ${r.company}](#${r.id})`);
  md.push("");
}

// ---- Recipes, grouped by category ----
md.push("## Recipes");
md.push("");
let currentCat = null;
for (const r of recipes) {
  if (r.sub_industry !== currentCat) {
    currentCat = r.sub_industry;
    md.push(`### ${CATEGORY_LABEL[currentCat] || currentCat}`);
    md.push("");
  }
  md.push(`<a id="${r.id}"></a>`);
  md.push("");
  md.push(`#### ${r.title}`);
  md.push("");
  const meta = [`**[${r.company}](https://${r.url.replace(/^https?:\/\//, "")})**`];
  if (r.metric_moved) meta.push(`moved: \`${r.metric_moved}\``);
  meta.push(`_${r.tier}_`);
  md.push(meta.join(" · "));
  md.push("");
  md.push(r.summary);
  md.push("");
  if (r.result) md.push(`**Result:** ${r.result}`);
  if (r.source_url) {
    md.push(`**Source:** [${r.attribution || "link"}](${r.source_url})`);
  } else if (r.attribution) {
    md.push(`**Source:** ${r.attribution} _(unlinked)_`);
  }
  md.push(`**Tags:** ${r.tags.map((t) => `\`${t}\``).join(" ")}`);
  md.push("");
  md.push("---");
  md.push("");
}

fs.writeFileSync(path.join(outDir, "README.md"), md.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n");
console.log(`Wrote cookbook/README.md: ${recipes.length} recipes, ${companies.size} companies, ${tagsSorted.length} tags.`);
