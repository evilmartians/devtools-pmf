# Editor's Choice

A curated rating of the most surprising, instructive plays across the 66 company cards in `data/`. Intended to feed the "Editor's Choice" leaderboard next to the NRR leaderboard.

## Method

Seven independent editorial reviews, each scoring plays through a different lens: open-source economics, developer experience and time-to-value, free-tier and pricing theory, bootstrapped efficiency, technical distribution, growth mechanics, and verifiable operational detail. Each review picked its top 10 most surprising learnings and scored them 1-10. Summary rating = sum of scores across reviews (a play absent from a review's top 10 scores 0). Judged 2026-07-01.

## Top 12

| # | Company | Play | Total | Reviews |
|---|---------|------|-------|---------|
| 1 | Zscaler | Your account is the person who deployed you, and they take it to their next job | **35** | 4 |
| 1 | PlanetScale | Kill free when free subsidizes users who will never pay | **35** | 4 |
| 3 | Render | Be the one-sentence answer LLMs give to "where do I deploy this?" | **34** | 4 |
| 4 | Neon | Make your primitive cheap enough for agents to spawn | **32** | 4 |
| 5 | CodeRabbit | Give the full paid tier away on public work | **27** | 3 |
| 6 | Railway | Win switchers on the incumbent's broken promise, then meter the abuse | **26** | 3 |
| 7 | Tailscale | Hold the bottom of the market | **24** | 3 |
| 8 | Elastic | Developers Google "open source X" and source-available falls off the list | **19** | 2 |
| 9 | Datadog | Three-year contracts let you lie to yourself about churn | **18** | 2 |
| 9 | PostHog | Bundle products until ripping you out is too painful | **18** | 2 |
| 11 | Snyk | Optimize a recurring habit, and retention follows | **17** | 2 |
| 12 | ngrok | Put your brand inside the artifact users share | **17** | 2 |

Ties: Zscaler and PlanetScale tie at 35 with identical averages.

### Why each made the cut

1. **Zscaler**: the first hard quantification of the champion-job-change funnel everyone assumes is unmeasurable, tracked as a first-class metric (~285 CXOs bought at two or more companies).
2. **PlanetScale**: deliberately torched half the user base to reach profitability, then rebuilt the funnel as a $5 card-attached floor; the strongest documented counterexample to free-tier orthodoxy.
3. **Render**: ChatGPT referrals grew from ~1% to ~10% of signups; the first well-measured case of LLMs as a primary acquisition channel.
4. **Neon**: 80% of databases and 97% of branches created by AI agents; the buyer of devtools is becoming a machine, validated by a ~$1B acquisition.
5. **CodeRabbit**: $600K+/year paid to OSS maintainers explicitly to keep branded review comments default-on in 100K+ public repos; maintainer funding priced as a distribution surface.
6. **Railway**: a rare disclosed ledger of free-tier abuse economics (~$500K/month in bot losses against ~$50K revenue) and the decision rule that follows.
7. **Tailscale**: ~50% free-to-paid conversion versus the 2-5% devtools norm, by deliberately delaying enterprise features; "easy to move upmarket later, very hard to move down."
8. **Elastic**: the AGPL return frames an OSI-approved license as a measurable discovery channel; buyers literally search "open source X" and source-available drops off the list.
9. **Datadog**: month-to-month billing against investor pressure so churn surfaces in weeks, reinforced by rotating every engineer through support; fed 146% NDR at IPO.
9. **PostHog**: a disclosed sales-comp formula (0.7x base, +0.2x per product) that pays reps for account depth; median customer triples spend within 18 months.
11. **Snyk**: one behavioral metric (unique fix-days per 30-day window) predicting a 5-7% vs ~80% twelve-month retention spread.
12. **ngrok**: paywalling removal of your brand from every shared URL grew 6M developers fully bootstrapped, 4,000+ signups/day on word of mouth alone.

## Bubbling under (13-20)

| Company | Play | Total |
|---------|------|-------|
| Replit | Your dormant free base is unpriced willingness-to-pay | 17 |
| Tailscale | Every forced upgrade is a re-evaluation, and a chance to churn | 16 |
| CrowdStrike | Turn the outage make-good into a renewal event | 16 |
| Docker | Charge the developer who gets the value, skip the ops buyer above them | 16 |
| Snyk | Turn your proprietary data into a million-page SEO moat | 16 |
| Mintlify | Turn every customer deployment into a node in your distribution network | 16 |
| GitLab | On a multi-module platform, shallow usage churns before low spend does | 16 |
| Semgrep | Become a bigger platform's default implementation | 15 |

## Wildcard picks

Plays that earned a 9-10 from a single review; strong candidates for rotating spotlight slots on the leaderboard:

- **Linear, "Publish the efficiency metrics your rivals hide"**: a VC-backed company winning by publishing calm-company metrics (profitable since 2021, 4 salespeople, ~0.5% of revenue on marketing).
- **Blacksmith, "Ship the teardown of the problem the incumbent left broken"**: protocol-level teardown as marketing, 4 people at $3.5M ARR.
- **Wiz, "Run the demo inside the prospect's own live cloud environment"**: 15-minute time-to-value executed inside an enterprise sales call; fastest $1M→$100M in cybersecurity.
- **JFrog, "Never cold-call; only harvest accounts developers already pulled in"**: S-1 on record that the company never made a single outbound field sales call, at 139% NDR.
- **Vultr, "Match the deposit to make them put money in first"**: $125M ARR and 1M+ customers with zero salespeople.
- **Lovable, "When the product sells itself, the founder is the only salesperson you need"**: ~$2-2.5M ARR per employee, ~10x the SaaS benchmark.
