/**
 * Vercel Cron: Run the full deal pipeline
 * Posts to Telegram and Facebook on schedule
 *
 * Schedule: Daily at 14:00 UTC (can be adjusted in vercel.json)
 */

import { exec } from "child_process";
import { promisify } from "util";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const execAsync = promisify(exec);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify cron secret from Vercel
  if (req.headers["authorization"] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    console.log("🚀 Starting deal pipeline...");

    // 1. Post unposted deals to Telegram
    console.log("📱 Posting to Telegram...");
    try {
      const telegramResult = await execAsync(
        "node scripts/telegram-post.js --max 3 --gap-seconds 120",
        {
          env: {
            ...process.env,
            TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
            TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
          },
        }
      );
      console.log("✅ Telegram:", telegramResult.stdout);
    } catch (error) {
      console.error("❌ Telegram error:", error);
    }

    // 2. Post queued deals to Facebook
    console.log("👥 Posting to Facebook...");
    try {
      const facebookResult = await execAsync(
        "node scripts/facebook-post.js --max 3 --gap-seconds 120",
        {
          env: {
            ...process.env,
            FACEBOOK_PAGE_ACCESS_TOKEN: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
            FACEBOOK_GROUP_ID: process.env.FACEBOOK_GROUP_ID,
          },
        }
      );
      console.log("✅ Facebook:", facebookResult.stdout);
    } catch (error) {
      console.error("❌ Facebook error:", error);
    }

    res.status(200).json({
      success: true,
      message: "Pipeline completed",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Pipeline error:", error);
    res.status(500).json({
      error: "Pipeline failed",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
