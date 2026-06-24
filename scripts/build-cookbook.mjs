// Generates the DevTools Cookbook from the plays in data/*.yml.
// Each recipe leads with its transferable Learning; the company is the proof.
// Grouped by goal, with an A-Z tag cross-reference. Output: cookbook/README.md.
// Run: npm run build:cookbook

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "data");
const outDir = path.join(root, "cookbook");
fs.mkdirSync(outDir, { recursive: true });

const GOAL_ORDER = ["Acquisition", "Activation", "Conversion", "Retention", "Expansion", "Revenue"];

const recipes = [];
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".yml") || f.endsWith(".yaml"))) {
  const doc = yaml.load(fs.readFileSync(path.join(dir, f), "utf8"));
  for (const p of doc.plays || []) {
    recipes.push({
      company: doc.company,
      url: (doc.url || "").replace(/^https?:\/\//, ""),
      goal: p.goal || "Acquisition",
      title: p.title,
      learning: p.learning || "",
      when_it_works: p.when_it_works || "",
      summary: p.summary,
      result: p.result || "",
      tier: p.tier,
      source_url: p.source_url || "",
      attribution: p.attribution || "",
      tags: (p.tags || []).slice().sort(),
    });
  }
}

recipes.sort((a, b) =>
  (GOAL_ORDER.indexOf(a.goal) - GOAL_ORDER.indexOf(b.goal)) ||
  a.company.localeCompare(b.company) ||
  a.title.localeCompare(b.title)
);
recipes.forEach((r, i) => (r.id = `recipe-${i + 1}`));

// Keep only tags used by >= 3 recipes (drop the agent-invented long tail).
const tagFreq = new Map();
for (const r of recipes) for (const t of r.tags) tagFreq.set(t, (tagFreq.get(t) || 0) + 1);
for (const r of recipes) r.tags = r.tags.filter((t) => tagFreq.get(t) >= 3);
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
md.push("Reusable growth and product-market-fit recipes from real developer tools, infrastructure, and security companies. Each recipe leads with the transferable play and names the company that ran it as proof. Generated from [`data/`](../data); edit the plays there, not here.");
md.push("");
md.push(`**${recipes.length} recipes** from **${companies.size} companies**, cross-referenced by **${tagsSorted.length} tags**.`);
md.push("");

md.push("## Index by tag");
md.push("");
for (const t of tagsSorted) {
  md.push(`### \`${t}\` <sup>${byTag.get(t).length}</sup>`);
  md.push("");
  for (const r of byTag.get(t)) md.push(`- [${r.title} — ${r.company}](#${r.id})`);
  md.push("");
}

md.push("## Recipes");
md.push("");
let currentGoal = null;
for (const r of recipes) {
  if (r.goal !== currentGoal) { currentGoal = r.goal; md.push(`### ${currentGoal}`); md.push(""); }
  md.push(`<a id="${r.id}"></a>`);
  md.push("");
  md.push(`#### ${r.title}`);
  md.push("");
  if (r.learning) { md.push(`**The play:** ${r.learning}`); md.push(""); }
  md.push(`**How [${r.company}](https://${r.url}) did it** _(${r.tier})_ — ${r.summary}`);
  md.push("");
  if (r.result) md.push(`**Result:** ${r.result}`);
  if (r.when_it_works) md.push(`**When it works:** ${r.when_it_works}`);
  if (r.source_url) md.push(`**Source:** [${r.attribution || "link"}](${r.source_url})`);
  md.push(`**Tags:** ${r.tags.map((t) => `\`${t}\``).join(" ")}`);
  md.push("");
  md.push("---");
  md.push("");
}

fs.writeFileSync(path.join(outDir, "README.md"), md.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n");
console.log(`Wrote cookbook/README.md: ${recipes.length} recipes, ${companies.size} companies, ${tagsSorted.length} tags.`);
