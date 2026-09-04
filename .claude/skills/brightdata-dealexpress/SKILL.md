---
name: brightdata-dealexpress
description: How DEAL EXPRESS's pipeline agents (price-refresh, deal-hunter, pricing, qa) should use the brightdata-plugin's skills instead of plain WebFetch/WebSearch — which store/task maps to which Bright Data skill, and why. Use this whenever one of those agents needs to fetch a store product page (Amazon, AliExpress, iHerb, SHEIN), verify a link/image, or search for an Israel-market comparison price.
---

# Bright Data, customized for DEAL EXPRESS

This repo's pipeline (`.claude/agents/*.md`) currently does all scraping with plain `WebFetch`/`WebSearch`. That has caused real, logged failures:
- `price-refresh` skips deals it "can't reliably determine" because the source page is blocked or CAPTCHA'd (see `price-refresh.md` step 2).
- `deal-hunter` has to manually `curl` every candidate image to a local file and eyeball it, because naive scraping sometimes grabs a seller badge or banner instead of the real product photo (`deal-hunter.md` step 5).
- `pricing`/`price-refresh` both do Israel-market comparison via generic `site:zap.co.il`/`site:ksp.co.il`/`site:ivory.co.il` searches with no structured result, so parsing the real price out of a search snippet is guesswork.

The `brightdata-plugin` exists to fix exactly this class of problem (bot-detection/CAPTCHA-resistant scraping, structured extraction from 40+ sites including Amazon, and a Google-search skill with structured JSON). This file maps its skills onto DEAL EXPRESS's four stores and pipeline stages — don't reach for its general-purpose skills (`competitive-intel`, `brand-listening`, `seo-audit`, `rag-pipeline`, SDK/CLI skills) for pipeline work; they're not needed here.

## Which skill, for which job

| Pipeline task | Store(s) | Use | Instead of |
|---|---|---|---|
| Re-fetch a live product page to read the current price | Amazon, AliExpress, iHerb, SHEIN | `brightdata-plugin:scrape` (markdown, handles bot detection/CAPTCHA) | `WebFetch` — which is exactly what's causing `price-refresh`'s "skipped, couldn't verify" cases |
| Pull a structured price/title/image for a candidate or existing listing | Amazon, AliExpress, iHerb, SHEIN | `brightdata-plugin:price-comparison` (structured extraction, purpose-built for exactly this) | Parsing raw HTML by hand |
| Confirm a candidate's real product photo before handing it to Content/Site | any | `brightdata-plugin:scrape` to pull the page, then verify the resolved image URL is the actual gallery image, not a badge/banner | the current `curl` + manual `Read`-the-local-file workaround in `deal-hunter.md` step 5 |
| Israel-market comparison search (zap.co.il / ksp.co.il / ivory.co.il / general Hebrew) | n/a (comparison step in `pricing`/`price-refresh`) | `brightdata-plugin:search` (Google search, structured JSON, not a scraped snippet) | `WebSearch` |
| Verify a link/image resolves before QA sign-off | any | `brightdata-plugin:scrape` to confirm a real page/image response, not a 404 or block page | `WebFetch` in `qa.md` steps 2-3, which can itself get blocked and produce a false FAIL |

## Rules that don't change

Bright Data only changes *how* a page gets fetched — every other discipline in this pipeline still applies exactly as written in each agent's own file:
- Never fabricate a price, image, or Israel comparison. If Bright Data also can't get a real result (page genuinely gone, listing pulled), that's still "skip and log why," never a guess — same as today.
- The Amazon-over-$75 rule in `deal-hunter.md` step 3 does **not** go away. Bright Data's Browser API can render a page, but getting a real Israel-delivery cart total still needs an interactive, logged-in session with an Israel address — a one-shot scrape (Bright Data or otherwise) cannot produce that number. Leave those to a manual/interactive sourcing session, same as today.
- AliExpress affiliate-link generation (the `s.click.aliexpress.com` requirement in `README.md`/`pricing.md`/`qa.md`) is a tracking-attribution problem, not a scraping problem — Bright Data doesn't touch it.

## Setup note

This skill assumes `brightdata-plugin` is enabled for this project. If an agent invokes a `brightdata-plugin:*` skill and it isn't available, fall back to `WebFetch`/`WebSearch` exactly as the agent's own file already describes, and note the fallback in the handback (e.g. `flags: "brightdata unavailable, used WebFetch"`) so the Supervisor knows the result is lower-confidence.
