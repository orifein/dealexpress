# Facebook Auto-Post Setup Guide

This guide walks you through setting up automatic Facebook posting for DEAL EXPRESS deals.

## Architecture

The system has two parts:
1. **Deal Content Pipeline** → Creates deals with prepared Facebook posts stored in `content/facebook/pending.json`
2. **Auto-Post Script** → `scripts/facebook-post.js` posts deals to your Facebook group on a schedule

## Prerequisites

1. **Facebook Group** where you want to post deals
2. **Facebook Developer Account** (free at developers.facebook.com)
3. **Facebook App** with Groups API permission

## Step 1: Get Facebook Credentials

### 1a. Create a Facebook App
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Click "My Apps" → "Create App"
3. Choose "Business" as the app type
4. Fill in app name, email, and app purpose
5. Click "Create App"

### 1b. Add Groups API
1. In your app dashboard, click "Add Product"
2. Find "Groups" and click "Set Up"
3. Under "Permissions", request `groups_access_member_requests` and `publish_to_groups`

### 1c. Generate Page/Group Access Token
1. Go to "Tools" → "Graph API Explorer"
2. Select your app from the dropdown
3. In the permissions dropdown, find your Group/Page and select it
4. Click "Generate Access Token"
5. Copy the token (it starts with `EAA...`)

**⚠️ Store this token securely in your `.env.local` file (never commit it!)**

### 1d. Get Your Group ID
1. In Graph API Explorer, run this query:
   ```
   GET /me/groups
   ```
2. Find your group in the response and copy its `id`

## Step 2: Configure Environment Variables

Create `.env.local` (or add to existing):

```bash
FACEBOOK_PAGE_ACCESS_TOKEN=your_token_here
FACEBOOK_GROUP_ID=your_numeric_group_id_here
```

Test your credentials:
```bash
FACEBOOK_GROUP_ID=123456 FACEBOOK_PAGE_ACCESS_TOKEN=EAA... node scripts/facebook-post.js --max 1
```

## Step 3: Prepare Deals

The pipeline ensures each deal has a `facebookPost` field in `content/facebook/pending.json`:

```json
{
  "slug": "my-deal",
  "facebookPost": "Post content here...",
  "link": "https://www.dealexpress.co.il/deal/my-deal?utm_source=facebook&utm_medium=social&utm_campaign=deal",
  "queuedAt": "2026-09-05T12:00:00+03:00"
}
```

## Step 4: Schedule Auto-Posting

### Option A: Using cron (Linux/Mac)

```bash
# Post 3 deals every day at 14:00 (2 PM)
0 14 * * * cd /path/to/dealexpress && FACEBOOK_PAGE_ACCESS_TOKEN=$TOKEN FACEBOOK_GROUP_ID=$GROUP_ID node scripts/facebook-post.js --max 3 >> /var/log/dealexpress-facebook.log 2>&1
```

### Option B: Using systemd timer

Create `/etc/systemd/system/dealexpress-facebook.service`:

```ini
[Unit]
Description=DEAL EXPRESS Facebook Auto-Post
After=network.target

[Service]
Type=oneshot
User=www-data
WorkingDirectory=/path/to/dealexpress
Environment="FACEBOOK_PAGE_ACCESS_TOKEN=your_token"
Environment="FACEBOOK_GROUP_ID=your_group_id"
ExecStart=/usr/bin/node /path/to/dealexpress/scripts/facebook-post.js --max 3
StandardOutput=journal
StandardError=journal
```

Create `/etc/systemd/system/dealexpress-facebook.timer`:

```ini
[Unit]
Description=Run DEAL EXPRESS Facebook Auto-Post daily
Requires=dealexpress-facebook.service

[Timer]
# Run at 14:00 every day
OnCalendar=*-*-* 14:00:00
Persistent=true

[Install]
WantedBy=timers.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable dealexpress-facebook.timer
sudo systemctl start dealexpress-facebook.timer
```

### Option C: Using Node.js scheduling (Vercel/Cloud)

Add to your API route or background job:

```javascript
import { CronJob } from 'cron';
import { spawn } from 'child_process';

const job = new CronJob('0 14 * * *', () => {
  spawn('node', ['scripts/facebook-post.js', '--max', '3'], {
    env: {
      ...process.env,
      FACEBOOK_PAGE_ACCESS_TOKEN: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
      FACEBOOK_GROUP_ID: process.env.FACEBOOK_GROUP_ID,
    },
  });
});

job.start();
```

### Option D: Manual Test

```bash
FACEBOOK_GROUP_ID=123 FACEBOOK_PAGE_ACCESS_TOKEN=EAA... node scripts/facebook-post.js --max 1 --gap-seconds 120
```

## Usage Examples

**Post 3 deals with 120s gap between each:**
```bash
node scripts/facebook-post.js --max 3 --gap-seconds 120
```

**Post specific deals by slug:**
```bash
node scripts/facebook-post.js --slugs "deal-1,deal-2,deal-3"
```

**Dry run (see what would post):**
```bash
node scripts/facebook-post.js --max 3 2>&1 | grep "^Posted"
```

## Monitoring

Check posted deals:
```bash
cat content/facebook/posted.json
```

Check pending queue:
```bash
cat content/facebook/pending.json | head -5
```

View logs (if using cron):
```bash
tail -f /var/log/dealexpress-facebook.log
```

## Troubleshooting

### "FACEBOOK_PAGE_ACCESS_TOKEN env var is required"
Set the environment variable:
```bash
export FACEBOOK_PAGE_ACCESS_TOKEN=your_token
```

### "Facebook error: Invalid OAuth token"
Token may have expired. Generate a new one from Graph API Explorer (see Step 1c).

### "Facebook error: User does not have permission to post to this group"
- Verify the token is for your group, not a page
- Check that Groups API is approved for your app
- Regenerate the token with correct permissions

### Rate Limiting
If you get rate-limit errors, increase `--gap-seconds`:
```bash
node scripts/facebook-post.js --max 3 --gap-seconds 300
```

## Integration with Deal Pipeline

The full pipeline is:
```
deal-hunter → pricing → content → site → QA → facebook-post (automatic)
```

Once QA approves a deal (verdict PASS), it's added to `pending.json` ready for posting.

The auto-post script runs on schedule, moving deals from `pending.json` to `posted.json`.

## Security Notes

- **Never** commit `.env.local` or tokens to git
- Add `.env.local` to `.gitignore`
- Tokens should be treated like passwords
- Rotate tokens periodically
- Use different tokens for dev/staging/production
