# DEAL EXPRESS agent team

Mirrors the team GrokBot ran (Hunter, Pricing, Content, Site, QA, Marketing, with a Supervisor as the single point of contact). Each file here is a Claude Code subagent — `Agent({ subagent_type: "<name>" })` dispatches to it.

## Pipeline (sequential)

```
Price-Refresh → Hunter → Pricing → Content → Site → QA → Marketing
```

The **Supervisor** is not a separate file — it's whichever Claude session runs the pipeline (the scheduled cron routine, or you talking to Claude directly). It calls each agent in order and passes the previous agent's structured output forward as the next agent's input. You talk to the Supervisor; you don't need to message the sub-agents individually — same as GrokBot's setup.

| Agent | Job | Hands off |
|---|---|---|
| `price-refresh` | re-checks every published deal's live price before anything new is sourced | `PRICE_REFRESH_RESULT` |
| `deal-hunter` | finds candidates | `CANDIDATE` blocks |
| `pricing` | landed ILS + affiliate tags | `PRICED` blocks |
| `content` | all copy (site + Telegram + Facebook), one voice | `COPY` blocks |
| `site` | writes the deal JSON, keeps the build green | `INTEGRATED` |
| `qa` | last gate — links, tags, dupes, schema | `QA_RESULT: PASS/FAIL` |
| `marketing` | commits, pushes, posts Telegram + Facebook — for the whole batch of QA-passed deals at once (see "Batch merge policy" below), not one deal at a time | `PUBLISHED` |

## Price-Refresh policy (as of 2026-09-04)

Before Hunter sources anything new, `price-refresh` re-checks the live price of every already-published real deal against its actual source:
- **Price unchanged** → deal stays exactly as-is, untouched.
- **Price changed, still cheaper than a real Israel-market price** → update the price on the site, deal stays live.
- **Price changed, no longer cheaper than a real Israel-market price** → deal is removed from the site (it's not a deal anymore).
- **Price changed, no Israel equivalent exists at all** → just update the price, deal stays live regardless of direction (there's nothing local to have stopped beating).

Same discipline as everywhere else in this pipeline: never fabricate a price or a comparison, only ever use what was actually fetched or searched. See `.claude/agents/price-refresh.md` for the full logic.

## Fetch fallback policy (as of 2026-09-04)

`WebFetch` is still the default way any agent reads a page (product pages, Israel-comparison listings, link/image checks). When a fetch clearly fails because of bot detection, a CAPTCHA, or a JS wall — not because the listing is genuinely gone — fall back in this order before giving up on that page:

1. **Bright Data Web Unlocker** — a near drop-in replacement for a blocked `WebFetch`: URL in, raw HTML out, with built-in bot-detection/CAPTCHA bypass. Try this first; it's cheaper and faster than driving a real browser. Requires `BRIGHT_DATA_API_TOKEN` to be set in the session environment.
2. **Browser Use** (cloud browser, if the plugin is enabled for the session) — only if Bright Data also can't get through. This drives an actual browser session turn-by-turn, which costs more time/tokens, so it's reserved for pages that genuinely need real interaction or that Bright Data's unlocker still can't pass.

If Bright Data's token isn't available and Browser Use isn't enabled for the session (check your available tools), keep the pre-2026-09-04 behavior exactly as documented in each agent file: never guess — skip the item/page and log why (e.g. `page blocked/captcha, no fallback tool available`) rather than fabricate a price, image, or link status.

This applies to all four page-fetching agents — `deal-hunter`, `price-refresh`, `pricing`, and `qa` — each with the full Bright Data → Browser Use chain (see each file for exactly where it plugs into their own "can't verify → skip, don't guess" logic). Mechanically: Bright Data is called directly over `Bash` — `curl https://api.brightdata.com/request` with `Authorization: Bearer $BRIGHT_DATA_API_TOKEN` and the account's `deal_express_web_unblocker` zone (see `.claude/skills/brightdata-dealexpress/SKILL.md` for the exact command) — **not** via the `brightdata-plugin` marketplace plugin, which was never actually installed in this environment (confirmed 2026-09-05). Browser Use is a separate **MCP server** — its real tool names (`mcp__browser-use__browser_navigate`, `browser_get_state`, `browser_extract_content`, `browser_scroll`, `browser_close_session`, plus `browser_click`/`browser_type`/`browser_list_sessions` for agents that need to interact rather than just read) are in every agent's `tools:` allowlist that can reach this fallback — every use of them is still gated on checking they're actually present in the tool list first, since that plugin may not be enabled for a given session either.

## Approval gate (current policy: autonomous, as of 2026-09-03)

The full pipeline runs autonomously, end to end: `Price-Refresh → Hunter → Pricing → Content → Site → QA → Marketing`. On a QA `FAIL`, the Supervisor routes issues back to `site`/`content` instead of proceeding. On a QA `PASS`, `marketing` publishes immediately — no human approval step. (An earlier, more conservative version of this policy required Ori's sign-off per deal before Marketing ran; that was deliberately relaxed after one supervised dry run proved the pipeline out, and Ori asked for everything to run on schedules with no further prompting.)

**Facebook posting** uses the `browser-use` plugin (real Chrome or a Browser Use Cloud browser via MCP) when it's enabled for the session: `marketing` tries posting directly to the group, and only falls back to queuing the post to `content/facebook/pending.json` if the plugin isn't enabled, the browser session isn't actually logged into Facebook (a fresh cloud browser has no saved login), or the post attempt can't be confirmed. When it falls back, an interactive session (with a live logged-in browser, or `browser-use` pointed at Ori's own Chrome) posts the queue and records it in `content/facebook/posted.json`. See `.claude/agents/marketing.md` for the exact flow — the queue-file bridge stays as a permanent safety net even with `browser-use` available, not just a stopgap.

**`browser-use` also unblocks two other things that used to need a manual/interactive session**, when the plugin is enabled: `deal-hunter` can source Amazon items over the old $75 cap by getting a real cart total with an Israeli delivery address (see `.claude/agents/deal-hunter.md`), and `price-refresh` can retry a page WebFetch couldn't read (blocked/captcha) with a real rendered browser (see `.claude/agents/price-refresh.md`). All three are pure fallback/enhancement — every agent checks whether the `mcp__browser-use__*` tools are actually present before attempting to use them, and every existing WebFetch/WebSearch-only path still works unchanged when the plugin isn't enabled.

## Batch merge policy (as of 2026-09-06)

Earlier runs merged each deal to `main` individually — Site integrates → QA validates → Marketing commits/pushes → Supervisor opens+merges a PR → confirms live → Marketing posts — repeated once per candidate. That's correct but slow: every candidate pays for its own full PR/merge/sync/build round-trip even when several candidates clear QA in the same run. As of 2026-09-06 the pipeline batches instead:

1. **Site integrates every surviving candidate first**, one file each (parallel-safe — each candidate only touches its own `content/deals/<slug>.json`, plus `lib/categories.ts` only if a genuinely new category is needed). In batch mode Site skips its own full `npm run build`/`npm run lint` per file (see `.claude/agents/site.md`) — just a JSON-validity check — because running several full production builds concurrently has previously corrupted `node_modules`/`.next` (this happened for real on 2026-09-05 and cost ~15 minutes to diagnose and fix).
2. **The Supervisor runs one consolidated `npm run build && npm run lint`** after every candidate in the batch has been written, catching anything Site's lightweight check missed.
3. **QA validates each surviving candidate** (still one dispatch per candidate — QA is read-only and safe to parallelize; a FAIL still gets one fix-and-recheck round before that candidate is dropped, same as before).
4. **Marketing stages every QA-`PASS`ed deal in one commit** and pushes once (see the "Batch publish policy" section of `.claude/agents/marketing.md`) — not one commit per deal.
5. **The Supervisor opens and merges one PR for the whole batch**, confirms every file landed on `origin/main`, then Marketing (or the Supervisor) posts the whole batch to Telegram in **one** `telegram-post.js --slugs <slug1>,<slug2>,...` call (the script already accepts a comma-separated list, still spaced `--gap-seconds` apart) and handles Facebook per-deal in one dispatch.

A candidate that fails QA twice is simply dropped from the batch before step 4 — it never blocks the rest of the batch from merging.

### Why Marketing can't merge its own PRs here

Confirmed 2026-09-05: the `marketing` (and `price-refresh`/`site`/`qa`) subagent sessions do **not** have GitHub MCP tools or the `gh` CLI available, even though the Supervisor session does. So in this environment, only the **Supervisor** can open/merge a PR — every subagent that needs a merge (any time its own branch isn't `main`) must commit, push, and hand back to the Supervisor rather than attempting `gh pr create`/`gh pr merge` itself. This is why the batch policy above routes all merging through the Supervisor rather than through Marketing directly.

## Amazon floor: 3 per run, no exceptions (as of 2026-09-06)

Ori wants **3 real Amazon links (US or DE, either counts) every run**, not just "2-3 as a target." `deal-hunter.md`'s store mix now lists this as a hard floor — Hunter should genuinely exhaust reasonable search effort on both Amazon.com and Amazon.de before handing back fewer than 3. The other stores (AliExpress, iHerb, SHEIN) stay soft targets — shift their share around based on what's actually verifiable that run.

## Traffic signal from Vercel Web Analytics (as of 2026-09-06)

The site already ships `@vercel/analytics` (see `app/layout.tsx`). `scripts/vercel-analytics.js` queries Vercel's public Web Analytics REST API (`GET https://api.vercel.com/v1/query/web-analytics/visits/count`, filtered per deal's `/deal/<slug>` path) to show which live deals are actually getting clicked, rolled up by store and category — `deal-hunter` checks this before sourcing (see `.claude/agents/deal-hunter.md`) as a soft signal to skew toward what's already working.

**This requires `VERCEL_TOKEN` and `VERCEL_PROJECT_ID` to be set in the session environment** (a token from vercel.com/account/tokens, and the project id from the project's Vercel dashboard Settings page — add `VERCEL_TEAM_ID` too if the project lives under a team). Neither was configured as of 2026-09-06, so the script currently no-ops with a clear message rather than failing — same fallback discipline as `BRIGHT_DATA_API_TOKEN` being unset. Once Ori adds those two env vars, this starts working with no further code changes needed.

## Facebook toggle (as of 2026-09-05)

Facebook publishing is currently **off**: Ori disabled it site-wide, site + Telegram only until he says otherwise. This is a persistent flag in `content/config.json` (`facebookEnabled: false`), not a conversational note — since the scheduled routine starts a fresh session every run with no memory of past chat, the flag has to live in a file. `content/content.md` still writes a `facebookPost` for every deal (no functional change there), but `marketing.md` checks the flag first and skips Facebook entirely — no browser-use attempt, no queueing to `content/facebook/pending.json` — while it's `false`. Flip it to `true` in `content/config.json` when Ori wants Facebook back on; nothing else needs to change.

## AliExpress pending-link queue (as of 2026-09-05)

AliExpress is still fully in scope for `deal-hunter` to source. The blocker is downstream: until a real `s.click.aliexpress.com` portal link exists (hand-generated at portals.aliexpress.com, or once the pending AliExpress Affiliate API app is approved), `qa` fails any AliExpress deal whose `affiliateUrl` is just a plain product URL or a `tracking_id`-decorated one (confirmed non-functional for attribution). Retrying `content`/`site` can't fix this — only Ori supplying a real link, or the API coming through, can. So instead of the normal "fail twice → drop" loop, this specific failure gets queued to `content/aliexpress-pending-links.json` (see `.claude/agents/qa.md`) and dropped from that run's publish batch. The Supervisor's end-of-run report must list anything sitting in that file and explicitly ask Ori for links (or confirm the API is still pending) rather than letting AliExpress candidates just quietly disappear.

## Competitor check (as of 2026-09-05)

`deal-hunter` explicitly checks what the two direct competitors — ALIBUY (ali-buy.com, t.me/AliBuy4) and רעות תקני לי (reutbuyitforme.com) — are currently listing before finalizing candidates each run. A candidate either beats a competitor's current listing on price/shipping/coupon (direct match), or is a similar/adjacent item in the same niche that the competitor doesn't currently carry. This is a soft sourcing signal recorded in the candidate's `notes` field (see `.claude/agents/deal-hunter.md`), not a hard gate and not something referenced in public copy — `content` still writes its own voice, it doesn't name competitors in posts.

## Scheduled routine

A single Claude Code routine ("DealExpress Supervisor pipeline") runs this whole chain on a cron schedule, replacing the two older, simpler routines ("DealExpress deal sourcing" and "DealExpress Telegram poster" — now disabled). See https://claude.ai/code/routines for the live routine list.

## Per-agent model choice (as of 2026-09-04)

This pipeline runs 3x/day, so token cost adds up. Agents doing mostly mechanical, rule-following work (`price-refresh`, `pricing`, `site`, `qa`) run on **Haiku**. Agents where output quality genuinely depends on judgment or fluency stay on **Sonnet**: `deal-hunter` (judging "unique/niche" vs. generic, avoiding near-duplicates is a fuzzy call), `content` (Hebrew copywriting quality), and `marketing` (posts to production — this is the stage that's already caused two real incidents, a duplicate Telegram post and a link going live before its merge, so it keeps the stronger model on its ordering logic). Revisit this split if a Haiku-run stage starts producing worse results than the token savings are worth.

## Bright Data Web Unlocker, customized for this pipeline (as of 2026-09-05)

`price-refresh`, `deal-hunter`, `pricing`, and `qa` all check `.claude/skills/brightdata-dealexpress/SKILL.md` before falling back to plain `WebFetch`/`WebSearch`. That skill documents a direct `curl` call to Bright Data's Web Unlocker API (`https://api.brightdata.com/request`, zone `deal_express_web_unblocker`, auth via the `BRIGHT_DATA_API_TOKEN` environment variable) — confirmed working (2026-09-05) against a real Amazon product page, past Amazon's own bot detection.

This replaces an earlier plan to use the `brightdata-plugin` marketplace plugin's skills (`brightdata-plugin:scrape`/`:search`/`:price-comparison`), which never actually worked: that plugin was never installed in this environment (`ListPlugins` returned empty, none of its skills existed as callable tools). The direct API call only covers what Bright Data calls **Web Unlocker** — a raw-HTML page fetch past bot-detection/CAPTCHA. There's no Bright Data search/SERP zone on this account, so the Israel-market comparison search in `pricing`/`price-refresh` still goes through plain `WebSearch`. Every agent still has its original `WebFetch`/`WebSearch` fallback if the token/zone is ever unavailable — log it in `flags`, never fail silently.

## Known hazard: Telegram dedup relies on a git-tracked file that can go stale

`content/telegram/posted.json` is the only thing `scripts/telegram-post.js` checks before re-sending a deal. It is not authoritative against the real channel — it's just a file, and more than one process writes to it: the scheduled Supervisor routine, and a separate, external "Grok bot" automation that also posts to `@dealexpress_il` outside this pipeline entirely. Any session/branch whose copy of this file is behind `main` will think an already-posted deal is new and re-post it — a real, visible duplicate on the live channel, not a harmless no-op. This happened for real on 2026-09-04 (an interactive session running on a long-lived feature branch re-sent several already-posted deals before being caught and stopped).

Rule: **always sync with `main` (fetch + merge/rebase) immediately before running `scripts/telegram-post.js`**, in any session, scheduled or interactive. If you're triaging a suspected duplicate, `git diff <your-branch> origin/main -- content/telegram/posted.json` will show you what your branch was missing. See `.claude/agents/marketing.md` for the full checklist.
