# Lens 3 — The Authoring Pipeline as an Agent Factory (and the Eval System as a Product)

_Fable night, 2026-07-18. Lens on `library-authoring-pipeline.md` + `coach-voice.md` §6 + `adaptive-engine.md` §9. Thesis: the pipeline the doc already specs as "agent work between founder sessions" should be built as a **standing, event-driven multi-agent content factory** whose only human touchpoint is the founder's weekly review card — and whose eval harness is a reusable TS package that is itself the single most sellable thing Michael builds this year. Everything below lives at **authoring time**; nothing here runs in the workout loop._

---

## The core reframe

`library-authoring-pipeline.md` describes a *procedure* (batch → triage → review → sim-accept). This lens makes it a **system that runs itself**: the planner's library-gap signals are events; events fan out to generation agents; a critic agent ranks and predicts the founder's verdict; sim-acceptance gates the merge; and the weekly review sheet lands **pre-triaged and pre-ranked** in the founder's queue every Sunday. The founder never triggers a run — he consumes its output. The pipeline's job is unchanged (protect the 100%-review rule by killing garbage before he sees it); what changes is that it becomes continuous, self-scheduling, and self-improving from reject history.

## Proposal 1 — The agent roster (7 named roles, model-tiered)

What it is: the pipeline as a directed graph of single-purpose agents, each with a pinned model, running as discrete jobs (not one long-lived process):

| Agent | Model | Job | Reads / writes |
|---|---|---|---|
| **Gap Sensor** | none (pure TS) | Reads planner sim telemetry, emits ranked gap briefs | Convex telemetry → `briefs/` queue |
| **Brief Writer** | Sonnet | Turns a raw gap ("thin vertical-pull pool for under-10s") into a full batch brief with enums + few-shot pack | brief → batch spec |
| **Generator** | Opus (taste content), Sonnet (metadata-heavy chains) | Drafts 10-15 candidates with mandatory self-labeled metadata | batch spec → candidates |
| **Triage** | none (pure TS lints) + Haiku (borderline dup adjudication) | Schema/enum/coherence/lint/dup gauntlet (§3) | candidates → survivors + reject log |
| **Sim Runner** | none (pure TS) | Injects survivors into a library copy, runs 8-week longitudinal sims | survivors → sim evidence, invariant kills |
| **Critic / Pre-reviewer** | Opus | Ranks survivors, **predicts founder verdict** from reject-reason history, writes the review sheet | survivors → ranked sheet |
| **Merge Agent** | Sonnet | Applies founder's A/E/R decisions, runs acceptance stack, mints library version | decisions → git commit |

Why this product: the pipeline doc already splits "LLM lane vs hand lane" and "triage before human review" — this just assigns each stage an owner and a model tier so cost tracks judgment (per global model-routing rules: Opus on taste/critic, Sonnet on spec-shaped work, Haiku/pure-TS on mechanical). Phase fit: roster is **Phase 0** as scripts (Generator + Triage + Sim), **Phase 1** adds the Critic and Gap Sensor as the loop closes. Build cost: **M** (mostly prompt + glue; the hard part is the shared candidate schema, which the engine docs already define). Showcase value: **high** — "here is a named-role agent org chart with a model-cost rationale per role" is exactly the artifact consulting clients cannot draw for themselves. Risks: role sprawl; mitigate by keeping Triage and Sim as **pure TS**, not agents — determinism where determinism is possible.

## Proposal 2 — Gap-signal → brief autogeneration (the demand-driven loop)

What it is: the Gap Sensor is a scheduled pure-TS job that reads the planner's own sparse-pool signal (`library-authoring-pipeline.md` §1: "the planner tells us where the pool is thin") plus adaptive-engine telemetry (swap-away rate = mislabeled difficulty; per-cell voice coverage gaps) and emits **ranked briefs** into a queue. Demand-driven briefs outrank speculative breadth, automatically — the doc's stated priority, mechanized. Each brief carries the conditional-candidate-pool deficit it's meant to close ("after H1-H9 filter for roster={8yo,adult}, budget=20min, vertical-pull has 1 valid rung; need ≥3").

Why this product: the doc explicitly says "we don't guess" where to author — the planner emits the demand. Nothing else could generate these briefs; they're a function of *this* library's holes against *this* family's roster shapes. Phase fit: **Phase 1** (needs live planner telemetry). Build cost: **S** (it's a query + a ranking function over data the engine already logs). Showcase value: **high** — "the system decides its own work from production signals" is the line that separates an agent *factory* from a prompt library. Risks: garbage briefs if telemetry is thin early; mitigate with a founder-seeded breadth backlog that fills quiet weeks until real signal accrues.

## Proposal 3 — The Critic agent: verdict prediction + the few-shot negatives flywheel

What it is: an Opus agent that sits between triage-survivors and the founder. It (a) **ranks** survivors best-first, (b) attaches a **predicted verdict** (`likely-accept / borderline / likely-reject-because-X`) learned from the accumulated reject-reason log (§2 few-shot negatives), and (c) writes the decision cards. The prediction is not a gate — it **orders the founder's attention** (low-confidence + likely-reject float to the top, per the doc's "low-confidence flags route to top") and, critically, becomes the pipeline's self-measurement: every week we score the Critic's predictions against the founder's actual A/E/R. When prediction accuracy climbs past a threshold ⚙, recurring `likely-reject` reasons graduate into **automated triage rules** — the reject log stops being training data and becomes code. This is the recall-ratchet (§4) generalized to the whole review.

Why this product: coach-voice §6 already says "expected keep rate is a quality signal"; the Critic turns keep-rate into a *closed loop* — it learns the founder's taste and proves it's learning with a measurable prediction-accuracy curve. This is the human-in-the-loop learning story in one agent. Phase fit: **Phase 1** (needs a reject-reason corpus, which Phase 0 PR review generates for free). Build cost: **M**. Showcase value: **high (top of the deck)** — "an agent that predicts the human reviewer's verdict, measured, improving weekly, and eventually compiles its own rules" is a genuinely rare, demonstrable artifact. Risks: the Critic could teach the founder to rubber-stamp its ranking (coach-voice's >80%-keep numbness); mitigate by **hiding the predicted verdict until after the founder decides on the top-ranked N each week** as a periodic calibration check.

## Proposal 4 — Where it runs (the schedule + substrate map)

What it is: concrete placement, honoring "source of truth is the repo, permanently" (§5):

1. **GitHub Actions (the factory floor).** Generation, triage, sim, and critic run as scheduled + event-triggered workflows. A weekly cron (`Sun 06:00`) drains the brief queue → opens one **batch PR per brief** with the rendered review sheet as markdown (Phase 0's exact model, now automated). Anthropic API key in Actions secrets; candidates + reject log are committed files, so the whole run is auditable and re-runnable. This is the right home because the deliverable *is* a git commit.
2. **Convex crons (the sensor + telemetry rollup).** The Gap Sensor and per-cell coverage/keep-rate rollups run as Convex scheduled functions over live telemetry, writing briefs back to the repo via a small dispatch (Actions `workflow_dispatch`). Convex owns *signals*, never *authoring master*.
3. **Local (founder-in-the-loop only).** Phase 0 review is the founder reading the PR sheet; Phase 1 review is the thin batch-review route (§5) writing decisions back as a commit. The Merge Agent runs in Actions on decision-file change.

Why this product: matches the doc's "repo files + scripts + PR review, build ~0 new surface" for Phase 0 and its Phase-1 thin-page trigger, with nothing invented. Phase fit: **Phase 0** (Actions + PR), **Phase 1** (Convex sensor + review route). Build cost: **S-M**. Showcase value: **high** — "which agent runs on Actions vs Convex crons vs local, and why" is the deployment-topology question every client asks and few can answer cleanly. Risks: Actions API-cost runaway on a bad prompt; mitigate with the doc's small-batch rule (10-15) + a hard per-run candidate cap + keep-rate circuit breaker (`<30%` halts the queue, §3).

## Proposal 5 — The eval harness as a first-class, reusable TS package (`@coach/evals`)

What it is: extract the eval + regression logic (§4 of the pipeline doc, §6 of coach-voice) into a standalone pure-TS package with a small public surface, dependency-free of Convex/React so it runs identically in Actions, in the Merge Agent's acceptance gate, and in local dev:

```
runGoldens(libVersion)        // determinism + expected-vs-structural drift diff (§4)
voiceLint(line)               // banned lexicon, fabricated-observation verbs, sibling-ordering, register (coach-voice §5)
factTrace(output, factsPayload) // every number in output ∈ input facts (Tier-2 gate, coach-voice §6)
keepRate(batch) / coverageReport(libVersion)  // per-cell health analytics
regress(modelA, modelB, fixtures)  // model/prompt-change diff over frozen fixtures
```

Why this product: coach-voice §6 already specs each of these checks as prose — packaging them makes them (a) the Merge Agent's mint-a-version gate, (b) the CI regression suite on any model/prompt bump, and (c) **a portable case-study artifact Michael can genericize and reuse for clients** without carrying any family data. The goldens are the canonical placeholder family (Dad42/Ryan14/Leo10/Sam8) — **synthetic by construction**, so the package ships as a showcase with zero COPPA exposure. Phase fit: `voiceLint` + `factTrace` + `keepRate` are **Phase 0** (needed the day the first line generates); `runGoldens`/`regress` are **Phase 1** (need a versioned library). Build cost: **M**. Showcase value: **high** — "an eval-as-code package that gates every model change with measurable quality" is the anti-vibes story consultants desperately want. Risks: over-abstracting for reuse before the app needs it — build it app-shaped first, genericize only when a client engagement actually pays for it.

## Proposal 6 — The consulting case study (framing, built into the repo)

What it is: a `docs/case-study/agentic-content-factory.md` written *as the pipeline is built*, structured as the client-facing narrative: **problem** (100%-human-review at throughput = burnout, pre-mortem theme 6) → **architecture** (Proposals 1-5) → **the measurable gates** (keep-rate bands, Critic prediction accuracy, recall-ratchet convergence-toward-zero, fact-traceability pass rate) → **the human-in-the-loop principle** (the founder's time is never the shock absorber; agents do build, human does judgment). The metrics are the whole pitch: this is not "we used AI," it's "we built a content factory with named quality gates and a learning curve you can chart."

Why this product: Michael's explicit goal is client-showcase material; this is the highest-leverage such artifact because it's a *complete, honest, measurable* human-in-the-loop agentic system, not a demo. Phase fit: **Phase 0 onward**, written incrementally. Build cost: **S** (it's the design docs, re-narrated for an external reader). Showcase value: **high** — this is the deck. Risks: leaking anything family-specific; mitigate by writing it entirely against the synthetic canonical family and published enums, never real telemetry.

---

## Fence-compliance check (my own proposals, honestly)

- **No runtime LLM in the workout loop:** clean. Every agent here runs at **authoring time** (Actions/Convex crons/local review), never inside a session. The eval package is pure TS. No proposal puts a model call between a family and a workout.
- **45-min cap / bodyweight / no gender:** untouched — this lens produces library content that the existing planner + engine already constrain; it invents no new session-time behavior.
- **COPPA (nickname+birth-year, broadcast-not-chat, no minor dialogue):** clean and deliberately reinforced — the factory operates only on the **synthetic canonical placeholder family**; no real minor data enters generation, briefs, or the eval package. The Critic predicts the *founder's* verdicts, not anything about a child. No agent addresses a minor.
- **Founder reviews every library item:** preserved as the one unbending rule. The Critic **ranks and predicts**; it never accepts. Sim-acceptance **nominates**, never merges. The founder's A/E/R is still the sole gate that mints content. Proposal 3's risk note (hiding predicted verdicts as a calibration check) exists specifically to keep this rule real, not rubber-stamped.
- **Requires-amendment items:** none. Every proposal instantiates behavior the pipeline/coach-voice docs already commit to; this lens schedules and packages it, it doesn't change scope.

## Open founder questions

1. **Critic autonomy ceiling ⚙:** at what measured prediction-accuracy do recurring `likely-reject` reasons auto-compile into triage rules vs. stay advisory? (Recommendation: advisory until ≥85% accuracy over ≥5 batches, then auto-compile *with* a founder-visible changelog per new rule.)
2. **Sunday-cron cadence:** one batch PR per gap brief every week, or drain the whole queue into one mega-sheet? (Recommendation: one PR per brief — the doc's small-batch rule keeps a single bad prompt from burning a review session.)
3. **Eval package genericization timing:** build `@coach/evals` app-shaped now and extract for clients only when an engagement funds it, or design for reuse from day one? (Recommendation: app-shaped now; premature generalization is the classic consulting-showcase tax.)
4. **Does the founder want the Critic's predicted verdict visible during review, or hidden until after he decides** (Proposal 3 anti-numbness lever)? This is a taste call only he can make.
