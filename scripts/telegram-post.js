#!/usr/bin/env node
/**
 * Posts unposted deals from content/deals/*.json to the DEAL EXPRESS Telegram
 * channel, tracking what's already been sent in content/telegram/posted.json
 * so runs never duplicate a post.
 *
 * Deal JSON files use two field naming schemes (title/store/itemIls for
 * AliExpress+iHerb "item-only" deals, titleHe/storeName/landedIls for Amazon
 * "landed price" deals, sometimes mixed) — normalizeDeal() below mirrors the
 * fallback chain in lib/deals.ts so every deal renders correctly regardless
 * of which fields the file actually has.
 *
 * Usage: TELEGRAM_BOT_TOKEN=xxx node scripts/telegram-post.js [--max 5] [--gap-seconds 120]
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DEALS_DIR = path.join(ROOT, "content", "deals");
const STATE_FILE = path.join(ROOT, "content", "telegram", "posted.json");

const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "-1003973821208";
const SITE_BASE_URL = process.env.SITE_BASE_URL || "https://dealexpress-live.vercel.app";
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

function parseArgs(argv) {
  const args = { max: 5, gapSeconds: 120 };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--max") args.max = Number(argv[++i]);
    if (argv[i] === "--gap-seconds") args.gapSeconds = Number(argv[++i]);
  }
  return args;
}

function loadRawDeals() {
  const files = fs.readdirSync(DEALS_DIR).filter((f) => f.endsWith(".json"));
  return files.map((f) => JSON.parse(fs.readFileSync(path.join(DEALS_DIR, f), "utf8")));
}

function normalizeDeal(raw) {
  const title = raw.titleHe ?? raw.title ?? raw.slug;
  const store = raw.storeName ?? raw.store ?? "";
  const summary =
    raw.summaryHe ??
    (Array.isArray(raw.highlightsHe) && raw.highlightsHe.length
      ? raw.highlightsHe.slice(0, 2).join(" · ")
      : Array.isArray(raw.specs) && raw.specs.length
        ? raw.specs.slice(0, 2).join(" · ")
        : null);
  const shippingNote = raw.shippingNoteHe ?? raw.shippingNote ?? null;

  let priceLine = null;
  if (typeof raw.itemIls === "number") {
    priceLine = `מחיר פריט ≈ ₪${raw.itemIls}`;
  } else if (typeof raw.landedIls === "number") {
    priceLine =
      typeof raw.compareIls === "number"
        ? `מחיר סופי משוער ≈ ₪${raw.landedIls} (מול ≈ ₪${raw.compareIls} בארץ)`
        : `מחיר סופי משוער ≈ ₪${raw.landedIls}`;
  } else if (raw.originalPrice) {
    priceLine = `מחיר ${raw.originalPrice.amount} ${raw.originalPrice.currency}`;
  }

  return {
    slug: raw.slug,
    demo: Boolean(raw.demo),
    title,
    store,
    summary,
    priceLine,
    shippingNote,
    image: raw.image ?? "",
    publishedAt: raw.publishedAt,
  };
}

function loadDeals() {
  return loadRawDeals()
    .map(normalizeDeal)
    .filter((d) => !d.demo);
}

function loadState() {
  if (!fs.existsSync(STATE_FILE)) return [];
  return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
}

function saveState(state) {
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + "\n");
}

function imageUrl(deal) {
  if (!deal.image) return null;
  const url = deal.image.startsWith("http") ? deal.image : `${SITE_BASE_URL}${deal.image}`;
  // Telegram can't process AVIF; SHEIN's CDN (img.ltwebstatic.com) serves the
  // same image as a real .jpg if you strip any "_..." transform suffix.
  if (url.endsWith(".avif") && url.includes("ltwebstatic.com")) {
    return url.replace(/_[^/]*\.avif$/, ".jpg").replace(/\.avif$/, ".jpg");
  }
  return url;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function caption(deal) {
  const lines = [
    `<b>${escapeHtml(deal.title)}</b>`,
    deal.summary ? escapeHtml(deal.summary) : null,
    deal.store ? `🛒 ${escapeHtml(deal.store)}` : null,
    deal.priceLine ? `💰 ${escapeHtml(deal.priceLine)}` : null,
    deal.shippingNote ? `🚚 ${escapeHtml(deal.shippingNote)}` : null,
  ].filter(Boolean);
  return lines.join("\n");
}

async function downloadImage(url) {
  const res = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });
  if (!res.ok) return null;
  const buffer = Buffer.from(await res.arrayBuffer());
  return buffer;
}

async function sendDeal(deal) {
  const photo = imageUrl(deal);
  const dealUrl = `${SITE_BASE_URL}/deal/${deal.slug}`;
  const replyMarkup = {
    inline_keyboard: [[{ text: "🛒 לרכישה - לחצו כאן", url: dealUrl }]],
  };

  let res;
  if (photo) {
    // Some CDNs (e.g. SHEIN's) block Telegram's own server-side fetch of the
    // photo url, so download it ourselves and upload the bytes directly.
    const imageBuffer = await downloadImage(photo);
    if (!imageBuffer) throw new Error(`Could not download image for ${deal.slug}: ${photo}`);

    const form = new FormData();
    form.set("chat_id", CHAT_ID);
    form.set("caption", caption(deal));
    form.set("parse_mode", "HTML");
    form.set("reply_markup", JSON.stringify(replyMarkup));
    form.set("photo", new Blob([imageBuffer]), "photo.jpg");

    res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
      method: "POST",
      body: form,
    });
  } else {
    res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: caption(deal),
        parse_mode: "HTML",
        reply_markup: replyMarkup,
      }),
    });
  }

  const json = await res.json();
  if (!json.ok) throw new Error(`Telegram error for ${deal.slug}: ${JSON.stringify(json)}`);
  return json.result.message_id;
}

/**
 * Round-robins across stores (oldest-first within each store) so a batch
 * doesn't clump every AliExpress deal together, then every iHerb deal, etc.
 * Store order itself is shuffled each run for variety.
 */
function pickMixedByStore(pendingDeals, max) {
  const byStore = new Map();
  for (const deal of pendingDeals) {
    const key = deal.store || "other";
    if (!byStore.has(key)) byStore.set(key, []);
    byStore.get(key).push(deal);
  }
  for (const list of byStore.values()) {
    list.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
  }
  const storeQueues = Array.from(byStore.values());
  for (let i = storeQueues.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [storeQueues[i], storeQueues[j]] = [storeQueues[j], storeQueues[i]];
  }

  const picked = [];
  let remaining = storeQueues.some((q) => q.length > 0);
  while (remaining && picked.length < max) {
    remaining = false;
    for (const queue of storeQueues) {
      if (queue.length === 0) continue;
      picked.push(queue.shift());
      remaining = remaining || queue.length > 0;
      if (picked.length >= max) break;
    }
  }
  return picked;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  if (!BOT_TOKEN) {
    console.error("TELEGRAM_BOT_TOKEN env var is required");
    process.exit(1);
  }

  const { max, gapSeconds } = parseArgs(process.argv.slice(2));
  const deals = loadDeals();
  const state = loadState();
  const posted = new Set(state.map((s) => s.slug));

  const pending = pickMixedByStore(
    deals.filter((d) => !posted.has(d.slug)),
    max,
  );

  if (pending.length === 0) {
    console.log("No new deals to post.");
    return;
  }

  for (let i = 0; i < pending.length; i++) {
    const deal = pending[i];
    const messageId = await sendDeal(deal);
    state.push({ slug: deal.slug, postedAt: new Date().toISOString(), messageId });
    saveState(state);
    console.log(`Posted ${deal.slug} (message_id=${messageId})`);
    if (i < pending.length - 1) await sleep(gapSeconds * 1000);
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { loadDeals, caption, BOT_TOKEN, CHAT_ID, SITE_BASE_URL };
