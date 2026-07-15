# AI Search / GEO Rules

Generative Engine Optimization (GEO) work — making content visible/citable to ChatGPT,
Perplexity, Claude, Gemini, Copilot, and Google AI Overviews — follows different rules than
classic SEO. These are the guardrails.

- **Treat AI-visibility work as a measurement system, not a promise.** Running the 30-query
  baseline tells you whether Bartlett is currently mentioned/cited; it does not guarantee any
  engine will rank or cite Bartlett going forward.
- **Schema must render in raw HTML, not just after JavaScript runs.** AI crawlers generally skip
  JS execution. Always check View Source, not the rendered DOM, when verifying JSON-LD.
- **Separate search/index crawlers from training crawlers.** Don't assume GPTBot (a training
  crawler) controls ChatGPT's search visibility — that's OAI-SearchBot's job. Verify against
  current official crawler documentation before making a claim about any specific bot.
- **Treat `llms.txt` as optional and experimental for non-Google systems**, not a Google ranking
  factor and not a guaranteed lever for any specific AI engine.
- **40–60 word direct-answer intros are the highest-leverage GEO formatting change** — lead
  priority pages with a concise, literal answer to the query they target.
- **Raise evidence density, but only with real, verifiable facts.** Local projects, service
  details, reviews, certifications, photos, dates. Never invent statistics, weather facts, permit
  claims, service-area details, or review counts to make a page sound more authoritative.
- **One AI response is not proof of anything.** Log date, query, engine/tool, result, and
  confidence level every time — see `data/ai-visibility-baseline.json` (currently
  `status: "pending"` until the 30-query baseline is actually run).
- **For any AI/GEO/robots/crawler claim, verify against current official docs** before stating it
  as fact, and phrase recommendations conservatively — this space changes fast and yesterday's
  guidance can be stale.

See `data/tasks.json` for the specific GEO-phase tasks (schema verification, robots.txt audit,
author bylines, evidence density) and `data/verification-queue.json` for open claims pending
confirmation.
