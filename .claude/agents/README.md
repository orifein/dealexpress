# DEAL EXPRESS agent team

Mirrors the team GrokBot ran (Hunter, Pricing, Content, Site, QA, Marketing, with a Supervisor as the single point of contact). Each file here is a Claude Code subagent — `Agent({ subagent_type: "<name>" })` dispatches to it.

## Pipeline (sequential)

```
Hunter → Pricing → Content → Site → QA → Marketing
```

The **Supervisor** is not a separate file — it's whichever Claude session runs the pipeline (the scheduled cron routine, or you talking to Claude directly). It calls each agent in order, passes the previous agent's structured output forward as the next agent's input, and only calls Marketing once QA returns `PASS`. You talk to the Supervisor; you don't need to message the sub-agents individually — same as GrokBot's setup.

| Agent | Job | Hands off |
|---|---|---|
| `deal-hunter` | finds candidates | `CANDIDATE` blocks |
| `pricing` | landed ILS + affiliate tags | `PRICED` blocks |
| `content` | all copy (site + Telegram + Facebook), one voice | `COPY` blocks |
| `site` | writes the deal JSON, keeps the build green | `INTEGRATED` |
| `qa` | last gate — links, tags, dupes, schema | `QA_RESULT: PASS/FAIL` |
| `marketing` | commits, pushes, posts Telegram + Facebook | `PUBLISHED` |

On a QA `FAIL`, the Supervisor routes the issues back to `site` or `content` rather than forcing `marketing` to run.
