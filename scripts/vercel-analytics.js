#!/usr/bin/env node
// Pulls per-deal pageview/visitor counts from Vercel's Web Analytics API so
// deal-hunter/pricing can see which categories/stores actually get traffic.
//
// Requires env vars: VERCEL_TOKEN (required), VERCEL_PROJECT_ID (required),
// VERCEL_TEAM_ID (optional, only needed if the project lives under a team).
//
// Usage:
//   node scripts/vercel-analytics.js                # all live deals, last 30 days
//   node scripts/vercel-analytics.js --days 7        # last 7 days
//   node scripts/vercel-analytics.js --slugs a,b,c   # only these slugs

const fs = require("fs");
const path = require("path");

function parseArgs(argv) {
  const args = { days: 30 };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--days") args.days = Number(argv[++i]);
    if (argv[i] === "--slugs") args.slugs = argv[++i].split(",").map((s) => s.trim());
  }
  return args;
}

function loadDealSlugs() {
  const dealsDir = path.join(__dirname, "..", "content", "deals");
  return fs
    .readdirSync(dealsDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const data = JSON.parse(fs.readFileSync(path.join(dealsDir, f), "utf8"));
      return { slug: data.slug, store: data.store, category: data.category, demo: !!data.demo };
    })
    .filter((d) => !d.demo);
}

async function fetchCount(token, projectId, teamId, requestPath, sinceIso) {
  const url = new URL("https://api.vercel.com/v1/query/web-analytics/visits/count");
  url.searchParams.set("projectId", projectId);
  if (teamId) url.searchParams.set("teamId", teamId);
  url.searchParams.set("filter", `requestPath eq '${requestPath}'`);
  url.searchParams.set("since", sinceIso);

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Vercel API ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.json();
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const token = process.env.VERCEL_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;

  if (!token || !projectId) {
    console.log(
      "VERCEL_TOKEN and/or VERCEL_PROJECT_ID not set — Vercel Analytics is not configured for this session.\n" +
        "Add them as environment variables (a token from vercel.com/account/tokens, and the project id from\n" +
        "the project's Settings page) to enable this. Skipping analytics lookup."
    );
    process.exitCode = 0;
    return;
  }

  let deals = loadDealSlugs();
  if (args.slugs) {
    const wanted = new Set(args.slugs);
    deals = deals.filter((d) => wanted.has(d.slug));
  }

  const since = new Date(Date.now() - args.days * 24 * 60 * 60 * 1000).toISOString();
  const results = [];
  for (const deal of deals) {
    try {
      const data = await fetchCount(token, projectId, teamId, `/deal/${deal.slug}`, since);
      results.push({
        slug: deal.slug,
        store: deal.store,
        category: deal.category,
        pageviews: data.pageviews ?? data.total ?? 0,
        visitors: data.visitors ?? null,
      });
    } catch (err) {
      results.push({ slug: deal.slug, store: deal.store, category: deal.category, error: err.message });
    }
  }

  results.sort((a, b) => (b.pageviews || 0) - (a.pageviews || 0));

  console.log(`Vercel Web Analytics — last ${args.days} day(s), ${results.length} deal(s):\n`);
  for (const r of results) {
    if (r.error) {
      console.log(`  ${r.slug} (${r.store}/${r.category}): ERROR — ${r.error}`);
    } else {
      console.log(`  ${r.slug} (${r.store}/${r.category}): ${r.pageviews} pageviews${r.visitors != null ? `, ${r.visitors} visitors` : ""}`);
    }
  }

  // Also roll up by store/category so Hunter can see which segments perform best.
  const byStore = {};
  const byCategory = {};
  for (const r of results) {
    if (r.error) continue;
    byStore[r.store] = (byStore[r.store] || 0) + (r.pageviews || 0);
    byCategory[r.category] = (byCategory[r.category] || 0) + (r.pageviews || 0);
  }
  console.log("\nBy store:");
  for (const [store, views] of Object.entries(byStore).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${store}: ${views}`);
  }
  console.log("\nBy category:");
  for (const [cat, views] of Object.entries(byCategory).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cat}: ${views}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
