# Vercel Deployment & Cron Setup Guide

This guide sets up automatic deal posting via Vercel Cron Jobs.

## Overview

The pipeline runs automatically every day at 14:00 UTC:
```
api/cron/deal-pipeline.ts → Telegram + Facebook posts
```

## Prerequisites

- Vercel account connected to your GitHub repo
- Facebook API credentials (from FACEBOOK_AUTO_POST_SETUP.md)
- Telegram Bot Token (from existing setup)

## Step 1: Set Environment Variables on Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your `dealexpress` project
3. Click **Settings** → **Environment Variables**
4. Add these variables (all environments):

```
TELEGRAM_BOT_TOKEN = your_bot_token
TELEGRAM_CHAT_ID = -1003973821208
FACEBOOK_PAGE_ACCESS_TOKEN = your_page_token
FACEBOOK_GROUP_ID = your_group_id
CRON_SECRET = your_random_secret_key
SITE_BASE_URL = https://www.dealexpress.co.il
```

**⚠️ CRON_SECRET:**
Generate a random, long string (e.g., using `openssl rand -hex 32`):
```bash
openssl rand -hex 32
```
Use this same value in your Vercel environment variables.

## Step 2: Deploy to Vercel

The easiest way:
```bash
# Vercel CLI
vercel deploy

# Or push to GitHub and let Vercel auto-deploy
git push origin claude/facebook-auto-post-woiw7x
```

Vercel will automatically read `vercel.json` and configure the cron job.

## Step 3: Verify Cron Job

1. After deployment, go to **Settings** → **Crons**
2. You should see:
   - **Endpoint**: `/api/cron/deal-pipeline`
   - **Schedule**: `0 14 * * *` (daily at 14:00 UTC)
   - **Status**: Active

## Step 4: Test the Cron Job

### Manual Test (via CLI):
```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-vercel-url.vercel.app/api/cron/deal-pipeline
```

### Manual Test (via Vercel Dashboard):
1. Go to **Settings** → **Crons**
2. Click the three dots on the cron job
3. Select **Invoke Manually**

### Check Logs:
1. Go to **Deployments** → Latest → **Logs**
2. Filter for `/api/cron/deal-pipeline`

## Cron Schedule Reference

Change the schedule in `vercel.json` under `crons[0].schedule`:

```json
{
  "crons": [
    {
      "path": "/api/cron/deal-pipeline",
      "schedule": "0 14 * * *"
    }
  ]
}
```

| Schedule | Meaning |
|----------|---------|
| `0 14 * * *` | Daily at 14:00 UTC (2 PM) |
| `0 8,14,20 * * *` | Three times daily (8 AM, 2 PM, 8 PM UTC) |
| `0 14 * * 1-5` | Weekdays only at 14:00 UTC |
| `0 0 * * *` | Daily at 00:00 UTC (midnight) |
| `0 */6 * * *` | Every 6 hours |

**Tip:** UTC timestamps. Your time zone offset:
- IST (Israel) = UTC +2 (summer) or UTC +3 (winter)
- So 14:00 UTC = 16:00-17:00 IST

## Monitoring & Alerts

### View Logs
```bash
# Stream logs from the last 2 hours
vercel logs your-project-name --follow

# Or via dashboard:
# Settings → Monitoring → Functions (in beta)
```

### Set Up Alerts (Vercel Enterprise)
1. Settings → Monitoring → Alert Rules
2. Alert on failed cron runs (HTTP status 500)

### Manual Fallback
If you need to run the pipeline outside the schedule:
```bash
# Run manually (useful for testing)
vercel env pull  # Download .env.local
FACEBOOK_PAGE_ACCESS_TOKEN=... FACEBOOK_GROUP_ID=... node scripts/facebook-post.js --max 3
TELEGRAM_BOT_TOKEN=... node scripts/telegram-post.js --max 3
```

## Troubleshooting

### "Cron job not running at scheduled time"
- Check that `vercel.json` is in your repo root
- Redeploy after making schedule changes: `vercel deploy`
- Verify the cron is **Active** in Vercel dashboard (Settings → Crons)

### "401 Unauthorized"
- **CRON_SECRET** doesn't match between code and environment variables
- Regenerate and update both places

### "API returns 500 error"
Check logs for:
1. Missing environment variables
2. API rate limiting (increase `--gap-seconds`)
3. Token expiration (regenerate credentials)

Logs location:
- **Vercel Dashboard**: Deployments → Functions → Logs
- **CLI**: `vercel logs your-project-name`

### "Facebook/Telegram tokens keep expiring"
- Facebook tokens: Regenerate from Graph API Explorer every 60 days
- Telegram tokens: Generally don't expire, but verify in BotFather

### Only posting to one platform (not both)
Check the cron logs. If one fails, the other might still succeed. Look for specific platform errors.

## Advanced: Custom Scheduling

### Option A: Different times for different stores
Edit `vercel.json` to run multiple crons:

```json
{
  "crons": [
    {
      "path": "/api/cron/deal-pipeline?source=amazon",
      "schedule": "0 10 * * *"
    },
    {
      "path": "/api/cron/deal-pipeline?source=aliexpress",
      "schedule": "0 14 * * *"
    },
    {
      "path": "/api/cron/deal-pipeline?source=iherb",
      "schedule": "0 18 * * *"
    }
  ]
}
```

Then update `api/cron/deal-pipeline.ts` to filter by `req.query.source`.

### Option B: More frequent posting
```json
{
  "crons": [
    {
      "path": "/api/cron/deal-pipeline",
      "schedule": "0 */4 * * *"
    }
  ]
}
```
Posts every 4 hours.

## Cost & Limits

**Vercel Free Plan:**
- ✅ Unlimited cron jobs
- ✅ 500K function invocations/month
- ✅ 100 seconds execution time per function

**Your usage:**
- 1 daily cron = 30 invocations/month ✅
- ~2-5 seconds per run (Telegram + Facebook) ✅
- Plenty of room to scale

## Security Notes

- Never commit `.env.local` with real tokens
- CRON_SECRET protects unauthorized cron triggering
- Tokens stored only in Vercel environment (encrypted at rest)
- Use read-only tokens where possible (Facebook doesn't support this yet)

## Next Steps

1. ✅ Push changes to GitHub
2. ✅ Deploy to Vercel (auto-deploy or `vercel deploy`)
3. ✅ Add environment variables in Vercel dashboard
4. ✅ Test manually: invoke cron from Vercel dashboard
5. ✅ Wait for scheduled time and check logs
6. ✅ Monitor first few runs in Vercel logs
