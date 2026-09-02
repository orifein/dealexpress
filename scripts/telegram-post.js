#!/usr/bin/env node
/**
 * Posts unposted deals from content/deals/*.json to the DEAL EXPRESS Telegram
 * channel, tracking what's already been sent in content/telegram/posted.json
 * so runs never duplicate a post.
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

function loadDeals() {
  const files = fs.readdirSync(DEALS_DIR).filter((f) => f.endsWith(".json"));
  return files
    .map((f) => JSON.parse(fs.readFileSync(path.join(DEALS_DIR, f), "utf8")))
    .filter((d) => d.demo !== true);
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
  return deal.image.startsWith("http") ? deal.image : `${SITE_BASE_URL}${deal.image}`;
}

function priceLine(deal) {
  if (deal.itemIls) return `מחיר פריט ≈ ₪${deal.itemIls}`;
  if (deal.originalPrice) return `מחיר ${deal.originalPrice.amount} ${deal.originalPrice.currency}`;
  return "";
}

function caption(deal) {
  const lines = [
    `<b>${deal.title}</b>`,
    deal.store ? `🛒 ${deal.store}` : null,
    priceLine(deal) ? `💰 ${priceLine(deal)}` : null,
    deal.shippingNote ? `🚚 ${deal.shippingNote}` : null,
  ].filter(Boolean);
  return lines.join("\n");
}

async function sendDeal(deal) {
  const photo = imageUrl(deal);
  const dealUrl = `${SITE_BASE_URL}/deals/${deal.slug}`;
  const body = {
    chat_id: CHAT_ID,
    caption: caption(deal),
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[{ text: "🛒 לרכישה - לחצו כאן", url: dealUrl }]],
    },
  };

  const endpoint = photo ? "sendPhoto" : "sendMessage";
  if (photo) body.photo = photo;
  else body.text = caption(deal);

  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${endpoint}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(`Telegram error for ${deal.slug}: ${JSON.stringify(json)}`);
  return json.result.message_id;
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

  const pending = deals
    .filter((d) => !posted.has(d.slug))
    .sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt))
    .slice(0, max);

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

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
