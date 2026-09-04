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
| `marketing` | commits, pushes, posts Telegram + Facebook | `PUBLISHED` |

## Price-Refresh policy (as of 2026-09-04)

Before Hunter sources anything new, `price-refresh` re-checks the live price of every already-published real deal against its actual source:
- **Price unchanged** → deal stays exactly as-is, untouched.
- **Price changed, still cheaper than a real Israel-market price** → update the price on the site, deal stays live.
- **Price changed, no longer cheaper than a real Israel-market price** → deal is removed from the site (it's not a deal anymore).
- **Price changed, no Israel equivalent exists at all** → just update the price, deal stays live regardless of direction (there's nothing local to have stopped beating).

Same discipline as everywhere else in this pipeline: never fabricate a price or a comparison, only ever use what was actually fetched or searched. See `.claude/agents/price-refresh.md` for the full logic.

## Fetch fallback policy (as of 2026-09-04)

`WebFetch` is still the default way any agent reads a page (product pages, Israel-comparison listings, link/image checks). When a fetch clearly fails because of bot detection, a CAPTCHA, or a JS wall — not because the listing is genuinely gone — and the **Browser Use** and/or **Bright Data** plugins are enabled for the session, fall back in this order before giving up on that page:

1. **Bright Data** (Web Unlocker/scrape) — a near drop-in replacement for a blocked `WebFetch`: URL in, content out, with built-in bot-detection/CAPTCHA bypass. Try this first; it's cheaper and faster than driving a real browser.
2. **Browser Use** (cloud browser) — only if Bright Data also can't get through. This drives an actual browser session turn-by-turn, which costs more time/tokens, so it's reserved for pages that genuinely need real interaction or that Bright Data's unlocker still can't pass.

If neither plugin is enabled for the session (check your available tools), keep the pre-2026-09-04 behavior exactly as documented in each agent file: never guess — skip the item/page and log why (e.g. `page blocked/captcha, no fallback tool available`) rather than fabricate a price, image, or link status.

This applies to `deal-hunter`, `price-refresh`, and `qa` — see each file for where it plugs into their existing "can't verify → skip, don't guess" logic. Mechanically: Bright Data is invoked as a **skill** (e.g. `Skill({ skill: "brightdata-plugin:scrape" })`), so those three agent files carry `Skill` in their `tools:` allowlist. Browser Use is a separate **MCP server** — its exact tool name(s) weren't visible yet as of 2026-09-04 (no live session had it loaded), so it isn't yet in any subagent's `tools:` allowlist; add the real `mcp__browser-use__...` tool name there once it's been seen in an actual run, or that fallback step will silently be unreachable from inside a subagent even though the plugin is enabled account-wide.

## Approval gate (current policy: autonomous, as of 2026-09-03)

The full pipeline runs autonomously, end to end: `Price-Refresh → Hunter → Pricing → Content → Site → QA → Marketing`. On a QA `FAIL`, the Supervisor routes issues back to `site`/`content` instead of proceeding. On a QA `PASS`, `marketing` publishes immediately — no human approval step. (An earlier, more conservative version of this policy required Ori's sign-off per deal before Marketing ran; that was deliberately relaxed after one supervised dry run proved the pipeline out, and Ori asked for everything to run on schedules with no further prompting.)

**Facebook is the one piece not yet fully autonomous**: no browser tool exists in a scheduled/cloud run, so `marketing` queues the post to `content/facebook/pending.json` instead of posting it directly. An interactive session (with a live logged-in browser) posts the queue and records it in `content/facebook/posted.json`. This is a bridge until Facebook posting itself is automated (tracked as follow-up work).

## Scheduled routine

A single Claude Code routine ("DealExpress Supervisor pipeline") runs this whole chain on a cron schedule, replacing the two older, simpler routines ("DealExpress deal sourcing" and "DealExpress Telegram poster" — now disabled). See https://claude.ai/code/routines for the live routine list.

## Known hazard: Telegram dedup relies on a git-tracked file that can go stale

`content/telegram/posted.json` is the only thing `scripts/telegram-post.js` checks before re-sending a deal. It is not authoritative against the real channel — it's just a file, and more than one process writes to it: the scheduled Supervisor routine, and a separate, external "Grok bot" automation that also posts to `@dealexpress_il` outside this pipeline entirely. Any session/branch whose copy of this file is behind `main` will think an already-posted deal is new and re-post it — a real, visible duplicate on the live channel, not a harmless no-op. This happened for real on 2026-09-04 (an interactive session running on a long-lived feature branch re-sent several already-posted deals before being caught and stopped).

Rule: **always sync with `main` (fetch + merge/rebase) immediately before running `scripts/telegram-post.js`**, in any session, scheduled or interactive. If you're triaging a suspected duplicate, `git diff <your-branch> origin/main -- content/telegram/posted.json` will show you what your branch was missing. See `.claude/agents/marketing.md` for the full checklist.
