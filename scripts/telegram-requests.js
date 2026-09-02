#!/usr/bin/env node
/**
 * Polls Telegram for direct messages sent to the DEAL EXPRESS bot and logs
 * them as deal requests in content/deal-requests.json, so Grok (or anyone
 * sourcing deals) has a running list of what followers actually want.
 *
 * Usage: TELEGRAM_BOT_TOKEN=xxx node scripts/telegram-requests.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const REQUESTS_FILE = path.join(ROOT, "content", "deal-requests.json");
const OFFSET_FILE = path.join(ROOT, "content", "telegram", "requests-offset.json");

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

function loadJson(file, fallback) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function saveJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
}

async function main() {
  if (!BOT_TOKEN) {
    console.error("TELEGRAM_BOT_TOKEN env var is required");
    process.exit(1);
  }

  const offsetState = loadJson(OFFSET_FILE, { lastUpdateId: 0 });
  const requests = loadJson(REQUESTS_FILE, []);

  const res = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${offsetState.lastUpdateId + 1}&timeout=0`,
  );
  const json = await res.json();
  if (!json.ok) {
    throw new Error(`Telegram getUpdates error: ${JSON.stringify(json)}`);
  }

  let added = 0;
  let maxUpdateId = offsetState.lastUpdateId;

  for (const update of json.result) {
    maxUpdateId = Math.max(maxUpdateId, update.update_id);
    const msg = update.message;
    if (!msg || msg.chat.type !== "private" || !msg.text) continue;
    if (msg.text.startsWith("/")) continue; // skip bot commands like /start

    requests.push({
      id: msg.message_id,
      chatId: msg.chat.id,
      from: [msg.from.first_name, msg.from.last_name].filter(Boolean).join(" "),
      username: msg.from.username ?? null,
      text: msg.text,
      requestedAt: new Date(msg.date * 1000).toISOString(),
      status: "new",
    });
    added++;
  }

  if (added > 0) {
    saveJson(REQUESTS_FILE, requests);
    console.log(`Logged ${added} new deal request(s).`);
  } else {
    console.log("No new deal requests.");
  }

  saveJson(OFFSET_FILE, { lastUpdateId: maxUpdateId });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
