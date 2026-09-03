# DEAL EXPRESS agent team

Mirrors the team GrokBot ran (Hunter, Pricing, Content, Site, QA, Marketing, with a Supervisor as the single point of contact). Each file here is a Claude Code subagent — `Agent({ subagent_type: "<name>" })` dispatches to it.

## Pipeline (sequential)

```
Hunter → Pricing → Content → Site → QA → Marketing
```

The **Supervisor** is not a separate file — it's whichever Claude session runs the pipeline (the scheduled cron routine, or you talking to Claude directly). It calls each agent in order and passes the previous agent's structured output forward as the next agent's input. You talk to the Supervisor; you don't need to message the sub-agents individually — same as GrokBot's setup.

| Agent | Job | Hands off |
|---|---|---|
| `deal-hunter` | finds candidates | `CANDIDATE` blocks |
| `pricing` | landed ILS + affiliate tags | `PRICED` blocks |
| `content` | all copy (site + Telegram + Facebook), one voice | `COPY` blocks |
| `site` | writes the deal JSON, keeps the build green | `INTEGRATED` |
| `qa` | last gate — links, tags, dupes, schema | `QA_RESULT: PASS/FAIL` |
| `marketing` | commits, pushes, posts Telegram + Facebook | `PUBLISHED` |

## Approval gate (current policy)

`Hunter → Pricing → Content → Site → QA` runs fully autonomously — nothing is public yet at that point, so no approval needed. On a QA `FAIL`, the Supervisor routes the issues back to `site` or `content` instead of proceeding.

On a QA `PASS`, the Supervisor **stops and shows Ori a one-glance summary per deal** — title, price, and the actual Telegram/Facebook post text — and waits for explicit approval before calling `marketing`. This is deliberate: the pipeline is new and unproven, and Marketing posts to a public Facebook group and the Telegram channel, which isn't worth automating blind on day one.

Once a track record builds up, this gate can be relaxed to autonomous QA-pass-only publishing — that's a decision for Ori to make explicitly, not something the Supervisor should assume on its own.
