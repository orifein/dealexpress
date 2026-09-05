#!/usr/bin/env node
/**
 * Posts queued deals from content/facebook/pending.json to Facebook Group,
 * tracking posted deals in content/facebook/posted.json to prevent duplicates.
 *
 * Usage: FACEBOOK_PAGE_ACCESS_TOKEN=xxx node scripts/facebook-post.js [--max 3] [--gap-seconds 60] [--slugs slug-a,slug-b]
 *
 * SETUP:
 * 1. Create a Facebook App at developers.facebook.com
 * 2. Add "Groups API" permission to the app
 * 3. Generate a Page Access Token for your page/group
 * 4. Set FACEBOOK_PAGE_ACCESS_TOKEN environment variable
 * 5. Set FACEBOOK_GROUP_ID to your group's numeric ID
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PENDING_FILE = path.join(ROOT, "content", "facebook", "pending.json");
const POSTED_FILE = path.join(ROOT, "content", "facebook", "posted.json");

const GROUP_ID = process.env.FACEBOOK_GROUP_ID;
const ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

function parseArgs(argv) {
  const args = { max: 3, gapSeconds: 60, slugs: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--max") args.max = Number(argv[++i]);
    if (argv[i] === "--gap-seconds") args.gapSeconds = Number(argv[++i]);
    if (argv[i] === "--slugs") args.slugs = argv[++i].split(",").map((s) => s.trim());
  }
  return args;
}

function loadPending() {
  if (!fs.existsSync(PENDING_FILE)) return [];
  return JSON.parse(fs.readFileSync(PENDING_FILE, "utf8"));
}

function loadPosted() {
  if (!fs.existsSync(POSTED_FILE)) return [];
  return JSON.parse(fs.readFileSync(POSTED_FILE, "utf8"));
}

function savePending(pending) {
  fs.mkdirSync(path.dirname(PENDING_FILE), { recursive: true });
  fs.writeFileSync(PENDING_FILE, JSON.stringify(pending, null, 2) + "\n");
}

function savePosted(posted) {
  fs.mkdirSync(path.dirname(POSTED_FILE), { recursive: true });
  fs.writeFileSync(POSTED_FILE, JSON.stringify(posted, null, 2) + "\n");
}

async function postToFacebook(message, link) {
  const url = `https://graph.facebook.com/v18.0/${GROUP_ID}/feed`;

  const body = new URLSearchParams();
  body.append("message", message);
  if (link) body.append("link", link);
  body.append("access_token", ACCESS_TOKEN);

  const res = await fetch(url, {
    method: "POST",
    body,
  });

  const json = await res.json();
  if (json.error) {
    throw new Error(`Facebook error: ${JSON.stringify(json.error)}`);
  }
  return json.id;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  if (!ACCESS_TOKEN) {
    console.error("FACEBOOK_PAGE_ACCESS_TOKEN env var is required");
    process.exit(1);
  }

  if (!GROUP_ID) {
    console.error("FACEBOOK_GROUP_ID env var is required");
    process.exit(1);
  }

  const { max, gapSeconds, slugs } = parseArgs(process.argv.slice(2));
  const pending = loadPending();
  const posted = loadPosted();
  const postedSlugs = new Set(posted.map((p) => p.slug));

  const toPost = slugs
    ? slugs.map((slug) => {
        const deal = pending.find((d) => d.slug === slug);
        if (!deal) throw new Error(`Not in pending queue: ${slug}`);
        if (postedSlugs.has(slug)) throw new Error(`Already posted, refusing to duplicate: ${slug}`);
        return deal;
      })
    : pending.filter((d) => !postedSlugs.has(d.slug)).slice(0, max);

  if (toPost.length === 0) {
    console.log("No deals queued for posting.");
    return;
  }

  for (let i = 0; i < toPost.length; i++) {
    const deal = toPost[i];
    const postId = await postToFacebook(deal.facebookPost, deal.link);
    posted.push({
      slug: deal.slug,
      postedAt: new Date().toISOString(),
      facebookPostId: postId,
    });
    savePosted(posted);

    // Remove from pending queue
    const pendingIdx = pending.findIndex((d) => d.slug === deal.slug);
    if (pendingIdx !== -1) {
      pending.splice(pendingIdx, 1);
      savePending(pending);
    }

    console.log(`Posted ${deal.slug} (post_id=${postId})`);
    if (i < toPost.length - 1) await sleep(gapSeconds * 1000);
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { loadPending, loadPosted };
