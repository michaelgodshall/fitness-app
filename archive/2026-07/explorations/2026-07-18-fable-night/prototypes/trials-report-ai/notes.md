# Trials Report AI Pipeline — Notes

_EXPLORATION / PROTOTYPE — 2026-07-18 Fable night. Not a decision. A worked end-to-end demonstration of the Tier-2 artifact pipeline for Michael to react to in the morning._

## What this prototype is

The full Tier-2 pipeline, end to end, for the coach's longest-form generated moment — the monthly Trials Report:

```
engine settles Trials  →  facts-payload.json  →  prompt.md (+ payload)  →  Tier-2 model
                                                                              │
                                              validation.md gates ◄───────────┘
                                              │            │
                                    all pass ▼            ▼ any gate fails / offline
                              generated-report.md   Tier-1 skeleton (validation.md)
                                              │
                                              ▼
                                        index.html (the keepsake the family keeps)
```

Six files:
- **facts-payload.json** — the structured facts the engine emits (also a schema proposal).
- **prompt.md** — the production system prompt, coach-voice §1–§5 inlined, paste-ready for the Claude API.
- **generated-report.md** — Claude Opus acting as the Tier-2 model, run against the real prompt + payload.
- **validation.md** — the six mechanical gates as runnable pseudocode + the deterministic Tier-1 fallback.
- **index.html** — the report rendered as a premium keepsake card, self-contained, print-friendly.
- **notes.md** — this file.

## Why it's client-showcase-worthy

This is the pattern clients keep asking for and rarely see done responsibly: **let an LLM write the beautiful thing without letting it lie.** The showcase is the *architecture*, not the prose.

1. **Structured facts, not a freeform prompt.** The engine emits computed truth. The model gets no access to raw logs and no license to compute — deltas, tier crossings, "best since June," even the highlighted-moment selection are all decided by deterministic code and handed over pre-chewed. The model's entire job is sentence-craft.
2. **Constrained generation.** The system prompt inlines the brand voice as hard constraints (register table, comparison law, banned topics) rather than hoping for tone. "May add zero facts" is stated as the one inviolable rule and then *enforced downstream* — the prompt asks, the validator checks.
3. **Mechanical validation before display.** Six deterministic gates — fact-traceability, banned lexicon, sibling-ordering, member coverage, single highlight, shape. A hallucinated number can't reach the family because it fails a diff, not a taste call. The prototype caught its own soft spot (a "seventy" rounding of 72) exactly the way the gate is supposed to.
4. **Graceful fallback.** Offline or any gate failing drops to a deterministic Tier-1 skeleton built from the same payload — plain, instant, true — and the good version heals in later. A late beautiful report beats an instant hallucinated one; a plain instant one beats both when the network's down. That degradation ladder is the trustworthy-AI story in one artifact.

The demo lands because it maps a real business anxiety ("we can't ship an LLM that fabricates about our customers' kids") onto a concrete, inspectable pipeline: **facts in → constrained voice → mechanical gate → safe fallback.** It generalizes far past fitness — any personalized generated artifact (financial summaries, health recaps, student progress notes) wants this exact shape.

## Did the generated report match or beat the golden (coach-voice.md §4)?

Same skeleton as the golden (headline → per-member → highlight → hook), same facts, and it earns two things the golden gestures at but the payload now makes *traceable*: Leo's moment is grounded in the logged judge roles ("Ryan running the count, Sam calling the seconds") rather than asserted color, and Dad's flat month is carried by real context (matched 15, 11 sessions, two trips) instead of a bare "holding ground" line. It's a touch longer (~205 vs ~110 words); if the founder wants the golden's compression, tighten the prompt's word budget to 120–160. Verdict: matches on voice, beats on traceability, tunable on length.

## Is the payload schema ready to spec?

Close — it is the strongest artifact here and I'd promote `trials-report-facts/v1` to a real spec proposal with four decisions resolved (below). It already carries: per-member per-test scores with priorBest/delta/tier/tierCrossed, per-test and total Progress Points with breakdown, full PP history (so "best since June" is derivable, not asserted), Record Book changes, streak/Pact context, the engine-selected highlighted moment with its full heuristic trace + drought guard, a flat-month block for Dad with an explicit consistency frame, and a `generationConstraints` block that encodes the forbidden moves (sibling ordering, banned topics) so a well-behaved model can't drift. The traceability contract (every renderable number has an id path) is what makes Gate 1 a lookup instead of a judgment.

## Founder questions

1. **Rounding policy (the one strict-mode flag).** Do we forbid all prose approximations ("crossed seventy" for a 72) and require exact figures, or add a `roundLabels` allow-list to the payload for sanctioned rounding? **Recommendation: forbid approximations** — it keeps Gate 1 a pure diff and costs almost nothing in warmth ("crossed the Skilled line at 72" is arguably better).
2. **Report length / register of the whole artifact.** Golden is ~110 words and spare; this run is ~205 and warmer. Which is the keepsake you want — telegram or short letter? **Recommendation: ~150 words**, splitting the difference; test both with the family (eval zero).
3. **Highlighted-moment selection: engine-decides vs. model-suggests.** Here the engine selects (heuristic + drought guard) and the model is told. Confirm the model never ranks — it only elevates the id it's given. **Recommendation: keep engine-decides** (founder-decision Q15 already leans this way); it's the cleanest defense against favoritism and the sibling-ordering gate.
4. **Judge/witness facts as narrative fuel.** The payload logs who judged/counted each test, and the report uses it ("his brothers counted"). This is defensibly "clipboard not camera" (a logged roster role, not an observation) — but it's the closest the coach comes to the line. Comfortable with it, or keep judges out of prose? **Recommendation: keep it, gated** — it's the single biggest source of earned warmth and it's fully traceable; add a payload flag `narrateJudges: true/false` so it's a per-family setting.
5. **Where Tier-2 runs.** Async, online, non-blocking — but on the server (Convex action calling the API) with the skeleton rendered instantly and the full report healing in? **Recommendation: yes** — matches the "keepsake heals toward the good version" model in validation.md and keeps the child-facing surface free of any live model call.

## Explicit limits of this prototype

- Illustrative data; one month, one family, the happy-ish path plus Dad's hard case. The eval harness needs the adversarial fixtures coach-voice §6 names: a month where a kid regressed, a two-member month, a first-ever (calibration) Trials with no history and zero PP.
- The PP values use a placeholder stepped table (flat 2 / tier bonus 2); real numbers wait on the PP-tuning session (engine-data-model ⚙M12, founder-decision Q4).
- Test IDs, tier thresholds, and the 5-test battery are illustrative and must reconcile with the real Trials battery + tier tables (design-review F22, a Phase-1 blocker) before this is more than a mock.
- coach-voice §4's own goldens were flagged factually loose against the skill ladders (F7); this prototype deliberately builds its numbers to be internally consistent so it doesn't inherit that.
