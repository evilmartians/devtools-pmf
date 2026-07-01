// Compiles data/*.yml plays into site/src/data/cookbook.json for the Astro site.
// Uses the reviewed goal, splits the large Acquisition goal into channel "tracks",
// and carries the Learning + when-it-works so cards can lead with the lesson.
// Run: node scripts/build-site-data.mjs   (also runs as the site's prebuild step)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "data");
const outFile = path.join(root, "site", "src", "data", "cookbook.json");

const CAT = { tooling: "Tooling", infra: "Infrastructure", security: "Security" };

// The filter/chapter dimension. The Acquisition goal is split into 5 channel
// tracks; the rest of the funnel stays as single tracks.
// Acquisition is split into explicit channel tracks (each play carries `track`,
// assigned by review). The rest of the funnel stays one track per goal.
const TRACKS = [
  { track: "Open-source", group: "Get users", blurb: "Turn the open-source project into the funnel, one pattern played many ways: what to give away, what to charge for, how to handle free-riders." },
  { track: "Launches & build-in-public", group: "Get users", blurb: "Win attention with launches and building in public." },
  { track: "Community & DevRel", group: "Get users", blurb: "Grow through community, events, and developer relations." },
  { track: "Content & SEO", group: "Get users", blurb: "Pull demand with content, docs, and search." },
  { track: "Integrations & ecosystem", group: "Get users", blurb: "Ride another platform's marketplace, integrations, or embeds." },
  { track: "Word-of-mouth & outbound", group: "Get users", blurb: "Referrals and virality, or founder-led outreach and partnerships." },
  { track: "Activation", group: "Convert & grow", blurb: "Get new users to value fast." },
  { track: "Conversion", group: "Convert & grow", blurb: "Turn free users into paying ones." },
  { track: "Retention", group: "Convert & grow", blurb: "Keep customers and cut churn." },
  { track: "Expansion", group: "Convert & grow", blurb: "Grow the accounts you already won." },
  { track: "Revenue", group: "Convert & grow", blurb: "Pricing and monetization moves." },
];
const TRACK_INDEX = Object.fromEntries(TRACKS.map((t, i) => [t.track, i]));

function trackOf(goal, play) {
  if (goal !== "Acquisition") return goal;
  return play.track || "Word-of-mouth & outbound"; // explicit channel from review; safe default
}

// Surface each company's verified benchmark numbers on its cards (the
// "what's good for a company like mine?" data, which previously never
// reached the site). Show the highest-signal few, cleaned and tier-stamped.
const METRIC_LABEL = { nrr: "NRR", free_to_paid: "Free→paid", retention: "Retention", ttfv: "TTFV", organic: "Organic", arr: "ARR" };
const METRIC_PRIORITY = ["nrr", "free_to_paid", "retention", "ttfv", "organic", "arr"];
// Headline figure: drop trailing parentheticals / alternates, but DON'T truncate.
function cleanMetric(v) {
  return String(v || "").split(/\s*[(/]/)[0].trim();
}
// Split "ARR $600M annualized run-rate" -> figure "$600M", qualifier "annualized run-rate"
// so the card can render the number large and glowing with the rest small.
function splitFigure(cleaned) {
  const m = cleaned.match(/^(\S+)\s*(.*)$/);
  return { figure: m ? m[1] : cleaned, qualifier: m ? m[2].trim() : "" };
}
// Round headline factoids for glanceability: whole numbers for M/K/% (>=1),
// one decimal for B. Leave ranges, sub-1% values (meaningful precisely because
// tiny), multipliers, durations, and plain counts untouched.
function roundFigure(fig) {
  if (!fig) return fig;
  if (/[-–]/.test(fig)) return fig; // ranges like "$12M-$16M", "155-170%"
  const m = fig.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!m) return fig; // no number (e.g. "minutes", "instant")
  const [, prefix, numStr, suffix] = m;
  const num = parseFloat(numStr.replace(/,/g, ""));
  if (!Number.isFinite(num)) return fig;
  const commas = (n) => n.toLocaleString("en-US");
  if (/^B/i.test(suffix)) return `${prefix}${num.toFixed(1)}${suffix}`; // billions: 1 decimal
  if (/^%/.test(suffix)) return num < 1 ? fig : `${prefix}${commas(Math.round(num))}${suffix}`;
  if (/^[MK]/i.test(suffix)) return `${prefix}${commas(Math.round(num))}${suffix}`;
  return fig; // x-multipliers, ms, h, plain counts: leave as-is
}
function companyMetricStrip(metrics) {
  const by = {};
  for (const m of metrics || []) by[m.field] = m;
  const out = [];
  for (const f of METRIC_PRIORITY) {
    const m = by[f];
    if (m && m.value) {
      const cleaned = cleanMetric(m.value);
      if (cleaned) { const { figure, qualifier } = splitFigure(cleaned); out.push({ label: METRIC_LABEL[f], figure: roundFigure(figure), qualifier, tier: m.tier }); }
    }
    if (out.length >= 4) break;
  }
  return out;
}

const recipes = [];
const companyRecords = [];
for (const f of fs.readdirSync(dataDir).filter((f) => f.endsWith(".yml") || f.endsWith(".yaml"))) {
  const doc = yaml.load(fs.readFileSync(path.join(dataDir, f), "utf8"));
  const companyMetrics = companyMetricStrip(doc.metrics);
  companyRecords.push({ company: doc.company, sub_industry: doc.sub_industry, gtm: doc.gtm, metrics: doc.metrics || [] });
  for (const p of doc.plays || []) {
    const goal = p.goal || "Acquisition";
    recipes.push({
      company: doc.company,
      url: (doc.url || "").replace(/^https?:\/\//, ""),
      sub_industry: doc.sub_industry,
      categoryLabel: CAT[doc.sub_industry] || doc.sub_industry,
      gtm: doc.gtm,
      companyMetrics,
      goal,
      track: trackOf(goal, p),
      title: p.title,
      learning: p.learning || "",
      when_it_works: p.when_it_works || "",
      summary: p.summary,
      result: p.result || "",
      tradeoff: p.tradeoff || "",
      metric_moved: p.metric_moved || "",
      tier: p.tier,
      source_url: p.source_url || "",
      attribution: p.attribution || "",
      tags: (p.tags || []).slice().sort(),
    });
  }
}

recipes.sort((a, b) =>
  (TRACK_INDEX[a.track] - TRACK_INDEX[b.track]) ||
  a.company.localeCompare(b.company) ||
  a.title.localeCompare(b.title)
);
recipes.forEach((r, i) => { r.id = `r${i + 1}`; r.no = String(i + 1).padStart(3, "0"); });

// ---- Records & Benchmarks leaderboards (Verified-tier disclosures only) ----
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
// For each company, the plays that explain an NRR figure: Expansion (the
// upsell/cross-sell that drives NRR up), Retention, and Revenue. Shown on the
// leaderboard as little numbered cards that link to the real card.
const NRR_TRACKS = ["Expansion", "Retention", "Revenue"];
const explainCards = {};
for (const r of recipes) {
  if (!NRR_TRACKS.includes(r.track)) continue;
  (explainCards[r.company] = explainCards[r.company] || []).push({ no: r.no, anchor: `${slugify(r.company)}-${r.no}`, track: r.track, title: r.title });
}
for (const co in explainCards) explainCards[co].sort((a, b) => NRR_TRACKS.indexOf(a.track) - NRR_TRACKS.indexOf(b.track) || a.no.localeCompare(b.no));
const parsePct = (v) => { const m = String(v).match(/(\d+(?:\.\d+)?)/); return m ? parseFloat(m[1]) : null; };
// Show the reporting period per row so a "ranked by current" board stays honest
// (some disclosures are years old). "2025-03" -> "Mar 2025"; bare year stays.
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmtPeriod = (s) => {
  if (!s) return "";
  const ym = String(s).match(/^(\d{4})-(\d{2})/);
  if (ym) return `${MON[+ym[2] - 1]} ${ym[1]}`;
  const y = String(s).match(/^\d{4}/);
  return y ? y[0] : String(s);
};
// A few companies disclose a historical PEAK first in the value string; rank by
// the CURRENT figure instead so the board reflects where they are now, not 2019.
const NRR_CURRENT = { CrowdStrike: 115, Datadog: 120, Honeycomb: 138 };
// A "current" board shouldn't rank stale disclosures. Drop anything older than
// this year (e.g. Twilio's 2016 NRR) and log what was removed.
const MIN_YEAR = 2022;
function buildBoard(field, parse, fmt, max, overrides = {}) {
  const rows = [];
  const stale = [];
  for (const c of companyRecords) {
    const m = (c.metrics || []).find((x) => x.field === field && x.tier === "Verified" && x.value);
    if (!m) continue;
    let num = parse(m.value);
    if (overrides[c.company] != null) num = overrides[c.company];
    if (num == null) continue;
    const yr = (String(m.as_of).match(/\d{4}/) || [])[0];
    if (yr && +yr < MIN_YEAR) { stale.push(`${c.company} (${m.as_of})`); continue; }
    rows.push({ company: c.company, value: m.value, figure: fmt(num), num, as_of: m.as_of || "", period: fmtPeriod(m.as_of), tier: m.tier, cat: CAT[c.sub_industry] || c.sub_industry, gtm: c.gtm, source_url: m.source_url || "", cards: explainCards[c.company] || [] });
  }
  if (stale.length) console.log(`  ${field} board: dropped ${stale.length} stale (<${MIN_YEAR}): ${stale.join(", ")}`);
  rows.sort((a, b) => b.num - a.num);
  return rows.slice(0, max).map((r, i) => ({ rank: i + 1, ...r }));
}
const leaderboards = {
  nrr: { label: "Highest net revenue retention", note: "Ranked by each company's current Verified disclosure. NRR varies by GTM model and reporting period, read alongside the date and source.", rows: buildBoard("nrr", parsePct, (n) => `${Math.round(n)}%`, 12, NRR_CURRENT) },
};

// The review let agents invent free-form tags, fragmenting the taxonomy.
// Keep only tags used by >= MIN_TAG recipes; drop the long tail from display.
const MIN_TAG = 3;
const tagMap = new Map();
for (const r of recipes) for (const t of r.tags) tagMap.set(t, (tagMap.get(t) || 0) + 1);
const canonical = new Set([...tagMap].filter(([, c]) => c >= MIN_TAG).map(([t]) => t));
for (const r of recipes) r.tags = r.tags.filter((t) => canonical.has(t));
const tags = [...tagMap].filter(([, c]) => c >= MIN_TAG).map(([tag, count]) => ({ tag, count })).sort((a, b) => a.tag.localeCompare(b.tag));

const trackCounts = {};
const gtmCounts = {};
for (const r of recipes) { trackCounts[r.track] = (trackCounts[r.track] || 0) + 1; gtmCounts[r.gtm] = (gtmCounts[r.gtm] || 0) + 1; }

const out = {
  generatedAt: new Date().toISOString().slice(0, 10),
  stats: { recipes: recipes.length, companies: new Set(recipes.map((r) => r.company)).size, tactics: tags.length },
  tracks: TRACKS.map((t) => ({ ...t, count: trackCounts[t.track] || 0 })),
  motions: ["PLG", "Sales-assisted", "Enterprise"].filter((m) => gtmCounts[m]),
  categories: Object.entries(CAT).map(([key, label]) => ({ key, label })),
  tags,
  leaderboards,
  recipes,
};

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(out, null, 2) + "\n");
console.log(`Wrote ${path.relative(root, outFile)}: ${recipes.length} recipes. Tracks: ${out.tracks.map((t) => t.track + "=" + t.count).join(" ")}.`);
