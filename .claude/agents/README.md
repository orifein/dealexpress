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

## Approval gate (current policy: autonomous, as of 2026-09-03)

The full pipeline runs autonomously, end to end: `Hunter → Pricing → Content → Site → QA → Marketing`. On a QA `FAIL`, the Supervisor routes issues back to `site`/`content` instead of proceeding. On a QA `PASS`, `marketing` publishes immediately — no human approval step. (An earlier, more conservative version of this policy required Ori's sign-off per deal before Marketing ran; that was deliberately relaxed after one supervised dry run proved the pipeline out, and Ori asked for everything to run on schedules with no further prompting.)

**Facebook is the one piece not yet fully autonomous**: no browser tool exists in a scheduled/cloud run, so `marketing` queues the post to `content/facebook/pending.json` instead of posting it directly. An interactive session (with a live logged-in browser) posts the queue and records it in `content/facebook/posted.json`. This is a bridge until Facebook posting itself is automated (tracked as follow-up work).

## Scheduled routine

A single Claude Code routine ("DealExpress Supervisor pipeline") runs this whole chain on a cron schedule, replacing the two older, simpler routines ("DealExpress deal sourcing" and "DealExpress Telegram poster" — now disabled). See https://claude.ai/code/routines for the live routine list.
