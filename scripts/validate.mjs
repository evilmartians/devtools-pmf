// Validates every data/*.yml file against schema/company.schema.json.
// Run: npm run validate   (CI runs this on every PR)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const schema = JSON.parse(fs.readFileSync(path.join(root, "schema", "company.schema.json"), "utf8"));

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

const dir = path.join(root, "data");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".yml") || f.endsWith(".yaml"));

let failed = 0;
const seenSlugs = new Map();

for (const f of files) {
  const full = path.join(dir, f);
  let doc;
  try {
    doc = yaml.load(fs.readFileSync(full, "utf8"));
  } catch (e) {
    console.error(`x ${f}: YAML parse error: ${e.message}`);
    failed++;
    continue;
  }

  if (!validate(doc)) {
    failed++;
    console.error(`x ${f}:`);
    for (const err of validate.errors) {
      console.error(`    ${err.instancePath || "/"} ${err.message}`);
    }
    continue;
  }

  // Filename must match the slug, and slugs must be unique.
  const expected = `${doc.slug}.yml`;
  if (f !== expected) {
    console.error(`x ${f}: filename should be ${expected} (matches slug)`);
    failed++;
  }
  if (seenSlugs.has(doc.slug)) {
    console.error(`x ${f}: duplicate slug "${doc.slug}" (also in ${seenSlugs.get(doc.slug)})`);
    failed++;
  }
  seenSlugs.set(doc.slug, f);
}

if (failed) {
  console.error(`\n${failed} problem(s) across ${files.length} files.`);
  process.exit(1);
}
console.log(`OK: all ${files.length} files valid.`);
