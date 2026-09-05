# 🚀 Facebook + Telegram Auto-Post Setup Checklist

Complete this checklist to get automatic deal posting running.

## Phase 1: Facebook Setup (15 min)

- [ ] Go to [developers.facebook.com](https://developers.facebook.com)
- [ ] Create a Facebook App
- [ ] Add Groups API permission
- [ ] Generate Page/Group Access Token
- [ ] Get your Group ID from Graph API Explorer
- [ ] Copy token to `.env.local`: `FACEBOOK_PAGE_ACCESS_TOKEN=EAA...`
- [ ] Copy Group ID to `.env.local`: `FACEBOOK_GROUP_ID=12345...`

**Test locally:**
```bash
FACEBOOK_GROUP_ID=your_id FACEBOOK_PAGE_ACCESS_TOKEN=your_token node scripts/facebook-post.js --max 1
```

## Phase 2: Vercel Deployment (10 min)

- [ ] Ensure `vercel.json` is committed (✅ done)
- [ ] Ensure `api/cron/deal-pipeline.ts` is committed (✅ done)
- [ ] Push to GitHub: `git push origin claude/facebook-auto-post-woiw7x`
- [ ] Deploy to Vercel: `vercel deploy` (or auto-deploy from GitHub)
- [ ] Go to Vercel dashboard → Settings → Environment Variables
- [ ] Add all environment variables:
  - `TELEGRAM_BOT_TOKEN` = your token
  - `TELEGRAM_CHAT_ID` = -1003973821208
  - `FACEBOOK_PAGE_ACCESS_TOKEN` = your token
  - `FACEBOOK_GROUP_ID` = your group ID
  - `CRON_SECRET` = random string (e.g., `openssl rand -hex 32`)
  - `SITE_BASE_URL` = https://www.dealexpress.co.il

## Phase 3: Verify Cron Job (5 min)

- [ ] Go to Vercel dashboard → Settings → Crons
- [ ] Confirm `/api/cron/deal-pipeline` is listed and **Active**
- [ ] Schedule should show: `0 14 * * *` (daily at 14:00 UTC)
- [ ] Click the three dots → **Invoke Manually** to test
- [ ] Check logs: Deployments → Latest → Logs (filter for `/api/cron`)
- [ ] Verify both Telegram and Facebook posts succeeded

## Phase 4: First Run (24h wait)

- [ ] Wait for scheduled time (14:00 UTC)
- [ ] Check Vercel logs for run status
- [ ] Verify posts appeared in Telegram channel
- [ ] Verify posts appeared in Facebook group
- [ ] Check `content/facebook/posted.json` updated
- [ ] Check `content/telegram/posted.json` updated

## Optional: Customization

### Change posting time:
Edit `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/deal-pipeline",
      "schedule": "0 18 * * *"
    }
  ]
}
```
Then redeploy.

### Change number of posts per run:
Edit `api/cron/deal-pipeline.ts`, change `--max 3` to your preferred number.

### Post more frequently:
Edit schedule to `0 */6 * * *` (every 6 hours).

---

## 📋 File Checklist

**Created/Updated:**
- ✅ `scripts/facebook-post.js` — Facebook posting script
- ✅ `.env.example` — Added Facebook env vars
- ✅ `vercel.json` — Cron job configuration
- ✅ `api/cron/deal-pipeline.ts` — Cron handler
- ✅ `FACEBOOK_AUTO_POST_SETUP.md` — Facebook setup guide
- ✅ `VERCEL_DEPLOYMENT_GUIDE.md` — Vercel cron setup guide
- ✅ `AUTOMATION_SETUP_CHECKLIST.md` — This file

**Already exists:**
- ✅ `scripts/telegram-post.js` — Telegram posting (reuses)
- ✅ `content/facebook/pending.json` — Queued Facebook posts
- ✅ `content/facebook/posted.json` — Posted Facebook tracking
- ✅ `content/telegram/posted.json` — Posted Telegram tracking

---

## Quick Reference: Environment Variables

| Variable | Example | Where |
|----------|---------|-------|
| `FACEBOOK_PAGE_ACCESS_TOKEN` | `EAA...` | developers.facebook.com |
| `FACEBOOK_GROUP_ID` | `123456789` | Graph API Explorer |
| `TELEGRAM_BOT_TOKEN` | `123:ABC...` | BotFather (Telegram) |
| `TELEGRAM_CHAT_ID` | `-1003973821208` | From existing config |
| `CRON_SECRET` | Random hex | Generate with `openssl rand -hex 32` |
| `SITE_BASE_URL` | `https://www.dealexpress.co.il` | Your site URL |

---

## Troubleshooting Quick Links

- **Facebook credentials issue?** → See `FACEBOOK_AUTO_POST_SETUP.md`
- **Vercel cron not running?** → See `VERCEL_DEPLOYMENT_GUIDE.md` → Troubleshooting
- **Cron logs not showing?** → `vercel logs your-project-name --follow`
- **Want to test manually?** → See Phase 1 test command above

---

## Timeline

- **Now**: Complete Phases 1-3 (30 min total)
- **24h later**: Cron runs automatically at 14:00 UTC
- **Daily**: Posts to Telegram and Facebook on schedule

That's it! 🎉
