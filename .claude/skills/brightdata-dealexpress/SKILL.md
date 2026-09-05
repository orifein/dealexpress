---
name: brightdata-dealexpress
description: How DEAL EXPRESS's pipeline agents (price-refresh, deal-hunter, pricing, qa) should call Bright Data's Web Unlocker API directly instead of plain WebFetch/WebSearch — the exact curl call, its env var/zone, and its limits. Use this whenever one of those agents needs to fetch a store product page (Amazon, AliExpress, iHerb, SHEIN) or verify a link/image and a plain WebFetch is blocked.
---

# Bright Data, customized for DEAL EXPRESS

This repo's pipeline (`.claude/agents/*.md`) fetches pages with `WebFetch`/`WebSearch` by default. That has caused real, logged failures:
- `price-refresh` skips deals it "can't reliably determine" because the source page is blocked or CAPTCHA'd (see `price-refresh.md` step 2).
- `deal-hunter` has to manually `curl` every candidate image to a local file and eyeball it, because naive scraping sometimes grabs a seller badge or banner instead of the real product photo (`deal-hunter.md` step 5).
- `qa` can get a false FAIL when a plain `WebFetch` gets blocked by the same bot detection, not because the link/image is actually dead.

**As of 2026-09-05, this is a direct API call, not a marketplace plugin.** An earlier attempt to use the `brightdata-plugin` marketplace plugin's skills (`brightdata-plugin:scrape`, `:search`, `:price-comparison`) never worked — that plugin was never actually installed in this environment (`ListPlugins` returned empty, none of those skills existed as callable tools, calling one directly errored `Unknown skill`). Don't call `Skill({skill: "brightdata-plugin:..."})` — it doesn't exist here. Instead, DEAL EXPRESS has its own Bright Data account with a **Web Unlocker zone** already configured, and its API token is available in this session as the `BRIGHT_DATA_API_TOKEN` environment variable. This works today, confirmed against a real Amazon product page.

## How to call it

```bash
curl -s -o /tmp/bd_response.html -w "%{http_code}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $BRIGHT_DATA_API_TOKEN" \
  -d '{"zone":"deal_express_web_unblocker","url":"<TARGET_URL>","format":"raw"}' \
  "https://api.brightdata.com/request"
```

- `$BRIGHT_DATA_API_TOKEN` — reference it only as an env var in a `Bash` command. Never print it, echo it, log it, hardcode it in a file, or put it in a commit, a deal JSON, a commit message, or your handback to the Supervisor.
- The zone name is `deal_express_web_unblocker` — this is specific to this account, don't change it.
- The response body is the target page's **raw HTML** (not markdown, not structured JSON) — the same as a WebFetch would give you if it weren't blocked, just without WebFetch's own AI summarization step.
- **Don't `Read` the raw output file directly for a real product page** — pages can be 1MB+ of HTML and will blow up your context for no reason. Instead `grep`/`sed`/`python3 -c` the saved file for exactly what you need (price text, `<title>`, the `og:image` or gallery `<img>` src, "ships to Israel" text, etc.), the same targeted way you'd parse any large HTML file.
- HTTP 200 with real page content (a real `<title>`, real price text) means it got through. A non-200, or a 200 whose body is a CAPTCHA/block page, means even Bright Data couldn't get past this one — treat it exactly like a failed `WebFetch` per each agent's own skip-rather-than-guess rule.

## Which pipeline task uses this

| Pipeline task | Store(s) | Use |
|---|---|---|
| Re-fetch a live product page to read the current price | Amazon, AliExpress, iHerb, SHEIN | the curl call above, in place of a blocked `WebFetch` |
| Confirm a candidate's real product photo before handing it to Content/Site | any | the curl call above to pull the page, `grep` the raw HTML for the real gallery image URL (less likely to snag a seller badge/banner than a naive fetch), then still `curl`+`Read`-the-local-file to visually confirm it, exactly as `deal-hunter.md` step 5 already requires |
| Verify a link/image resolves before QA sign-off | any | the curl call above to confirm a real page/image response, not a 404 or block page |

## What this does NOT cover

- **Israel-market comparison search** (zap.co.il / ksp.co.il / ivory.co.il / general Hebrew) still uses plain `WebSearch` — there is no Bright Data SERP/search zone configured on this account, only the Web Unlocker zone above. Don't invent one.
- **Structured price/title/image extraction** isn't available either — you get raw HTML back, same as an unblocked `WebFetch` would return. Parse it yourself with `grep`/`sed`, same as you'd have to for any raw HTML.
- **Browser Use** (interactive/rendered browser sessions, e.g. for Amazon-over-$75 real cart totals) is a separate, still-unresolved integration — leave that fallback exactly as documented in each agent file for now; this skill doesn't change it.

## Rules that don't change

- Never fabricate a price, image, or Israel comparison. If Bright Data also can't get a real result (page genuinely gone, listing pulled, still CAPTCHA'd), that's still "skip and log why," never a guess — same as today.
- The Amazon-over-$75 rule in `deal-hunter.md` step 3 does **not** go away. A one-shot raw-HTML fetch (Bright Data or otherwise) cannot produce a real Israel-delivery cart total — that still needs an interactive, logged-in session (or Browser Use). Leave those to a manual/interactive sourcing session, same as today.
- AliExpress affiliate-link generation (the `s.click.aliexpress.com` requirement in `README.md`/`pricing.md`/`qa.md`) is a tracking-attribution problem, not a scraping problem — Bright Data doesn't touch it.

## Setup note

This requires `BRIGHT_DATA_API_TOKEN` to be set in the session's environment (cloud environment settings) and the `deal_express_web_unblocker` zone to exist on the Bright Data account. If the env var is empty/missing, or a call returns 401/403, fall back to plain `WebFetch`/`WebSearch` exactly as each agent's own file already describes, and note the fallback in the handback (e.g. `flags: "brightdata unavailable, used WebFetch"`) so the Supervisor knows the result is lower-confidence.
