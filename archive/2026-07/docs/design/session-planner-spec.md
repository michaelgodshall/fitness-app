# Session Planner — Constraint Specification v1

_Design doc — July 2026 (Fable session). The deterministic core of the product: how tonight's workout gets built. Pairs with PLAN.md's engine architecture (planner + authoring-time LLM). Status: draft for founder review; parameters marked ⚙ need Phase 0 calibration against real family sessions._

---

## Contract

```
plan_session(roster, time_budget, history, library, seed) → Session
```

Same inputs + same seed → same session, always (deterministic, resumable, testable). The seed is logged with every session.

**Inputs:**
- **roster** — members training tonight; each member: age band, per-pattern capability level (which swap-chain rung they work at), active skill stages, recent participation
- **time_budget** — minutes the family actually has (15-45; user-declared at session start)
- **history** — recent sessions per member (patterns hit, volumes, dates), benchmark-block schedule state, PB table, Pact state, Trials calendar position
- **library** — founder-approved exercises (pattern, equipment, swap chain, metric type, age gates, time model) and blocks (typed structures with per-block time models)

## Hard constraints (violation = invalid session; every one is a unit test)

| # | Constraint | Rule |
|---|---|---|
| H1 | **Time cap** | Estimated duration ≤ min(45, time_budget). Warm-up (3-5 min) always included and counted. Time estimate uses per-block time models (⚙ calibrate against real sessions in Phase 0). |
| H2 | **Movement-pattern balance** | Patterns: horizontal-push, vertical-push, horizontal-pull, vertical-pull, squat, hinge, core, conditioning (⚙ taxonomy granularity). Over a rolling 7-day window, no pattern runs >2 sessions ahead of the most-neglected pattern; tonight's session prioritizes the stalest patterns for the present roster. |
| H3 | **Recovery** | No repeat max-intensity work on the same pattern within 48h per member. Post-Challenge/Trials: next session auto-downshifts intensity. Trials-taper mode: the 2-3 sessions before Trials week reduce volume (see trials-and-challenges.md). |
| H4 | **Equipment** | Only exercises whose equipment requirement ⊆ family equipment (none \| pull-up bar). |
| H5 | **Roster coverage** | Every exercise slot must have a swap-chain rung reachable by every present member (per capability + age gates). No valid rung for someone → that block is invalid tonight. |
| H6 | **Age gates** | Exercise/block maturity tags respected per member (e.g., high-impact plyo gated for youngest; isometric skill work open). Safety notes surface at presentation. |
| H7 | **Benchmark cadence** | A benchmark block — structurally identical to its previous appearance — is scheduled every ⚙4-6 sessions per member, but only when H2/H3 allow a fair comparison (never the day after same-pattern max effort). This manufactures "beat last time" moments inside otherwise-fresh sessions (generated sessions rarely repeat whole, so template-level workout PBs from the legacy design are replaced by block-level benchmarks). |
| H8 | **Skill weaving** | Members with active skill stages get a skill-practice block (≤8 min, skippable without invalidating the session), scheduled compatibly with H2/H3 — e.g., the teen holds tuck front-lever sets while younger kids run their circuit. |
| H9 | **Session grammar** | warm-up → 2-4 work blocks → optional finisher → close. Density profile (rest lengths, block types: straight sets → supersets → circuits/AMRAP) follows the progressive-density model and the family's experience tier (⚙ progression thresholds). |
| H10 | **Novelty** | No exact session repeat within ⚙20 sessions (benchmark blocks exempt by design). Exercise-level repetition is fine and expected. |
| H11 | **Youth session-level safety** | Beyond per-exercise age gates (H6), the *assembled session* respects youth constraints for members under ⚙11: cap plyometric ground contacts per session, never stack multiple max-effort spinal-flexion blocks, limit consecutive max-effort blocks, and gate under-11 PBs on movement-quality-verified sets ("5 clean reps, parent-verified") rather than raw-volume chasing. Rationale: relative loading is true for strength-to-mass but NOT for developmental readiness — an 8-year-old's limiter is coordination and joint readiness, and block-level review alone cannot catch bad *combinations* the planner assembles. External youth-S&C review of this constraint layer is required **before Phase 1 beta** (founder's own family in Phase 0 proceeds on founder judgment — he has 16 months of it). |

## Soft objectives (scoring, applied after hard constraints filter candidates)

1. **Staleness relief** — prefer sessions that maximally reduce pattern debt (H2 headroom)
2. **PB opportunity placement** — benchmark blocks land when members are fresh
3. **Roster feel** — younger-heavy rosters bias toward shorter blocks, more rotation, circuit formats (attention span); adult/teen rosters tolerate longer grinds
4. **Time-fit tightness** — use the budget; a 30-min budget should produce ~28-30 min, not 22
5. **Skill-stage progress** — active stages get practice at effective frequency (⚙2-3×/week per stage)

## Default-session pre-generation (consistency armor)

The planner **pre-computes "tonight's session"** from the last-known roster and time budget as soon as the previous session closes. Opening the app *starts* a workout; "who's in / how much time" is an override, not a gate. Rationale (pre-mortem theme 1): on the busy nights that killed the founder's own consistency, a 30-second config step *is* the barrier. Related planner behaviors: **Reset Rep** — after a detected lapse, the next generated session is deliberately shorter, easier, and PB-free (the return workout itself is the intervention); **Absence Ledger** — skips carry a 5-second reason tag, and a recurring reason biases the planner toward the scaled-down shape that worked last time.

## Edge cases (specified now so they never surprise a family)

- **time_budget < 15 min** → micro-session mode: warm-up + one circuit; counts toward Pact (consistency over perfection — a 12-minute Tuesday beats a skipped Tuesday).
- **Solo roster** (one member, incl. a parent alone) → valid; plans normally, logs to family history.
- **Kids-only roster** → allowed but intensity-capped; no max-effort blocks without an adult present (safety posture; ⚙ founder judgment).
- **Sparse library coverage** (constraint filtering leaves too few candidates) → degrade to fewer block types but never violate H1-H10; emit an authoring-backlog signal ("library gap: easier vertical-pull variants") — the planner tells the founder what to author next.
- **Mid-session abort** → partial history recorded; patterns count as partially hit (⚙ weighting); no Pact credit unless past the halfway mark (legacy save-at-review rule adapts: save checkpoint at each completed block).

## Testability (Phase 0 deliverable, not afterthought)

1. **Property tests** — every H-constraint asserted over randomized (roster, budget, history, seed) inputs.
2. **Golden sessions** — founder-reviewed fixture sessions pinned; regressions diff against them.
3. **Longitudinal simulation** — generate 8 weeks of synthetic family history (mixed rosters, missed weeks, a Trials cycle); assert invariants hold over the *sequence*: pattern balance never drifts past H2, benchmark cadence honored, novelty maintained, taper triggers. This simulation is also the eval harness for new library batches: a candidate block is accepted only if simulations that include it stay invariant-clean.

## Pact & session-credit spec (added per design-review F3 — this is the retention core)

- **Member line:** each member has a weekly target (default ⚙3, configurable 1-5). Any *completed* session credits 1 to each participant's line: synchronous, solo, slice, or micro-session alike; an aborted session past the halfway checkpoint also credits (existing rule). **Cap: 1 credit per member per calendar day** (three micro-sessions in an evening is one credit — anti-gaming, per Codex round 1).
- **Family ring** (the S1 lobby surface) = aggregate of member lines vs. aggregate of targets. The family's week is **complete when every member's line is complete** (⚙ v1 rule — revisit if a busy member's line reads as the family's failure; the pre-mortem's "carried, not exposed" principle may argue for an aggregate rule later).
- **Week boundary:** Monday 00:00 family-local; lines and ring reset; **streak** = consecutive complete family weeks. A missed week resets the streak with zero shame mechanics (Reset Rep fires instead).
- **Coverage & "session-equivalents" (the gate term, now defined):** a planned session is **covered** when every intended participant has completed their portion — synchronously or via slice — within the week. The non-synchronous gate week requires ≥3 *covered* sessions. Coverage is also the planner's signal for catch-up offers.

## Async slice contract (added per design-review F4)

`plan_slice(sessionPlan, member) → SlicePlan`
- Extracts the member's per-member track from a shared plan: their blocks, targets, and swap state — **benchmark identity preserved** (a benchmark block in a slice still counts as that benchmark).
- Re-times for solo pacing (shared-timer blocks become member-paced with the same work/rest structure) and fits the member's declared time budget (H1 applies; micro-session rules apply under 15 min).
- Completing a slice: credits the member's Pact line (1, daily cap applies), settles logs idempotently into the parent session's history (same set-scoped write semantics), and marks the member's portion of the parent session covered.
- Entry UX: the lobby shows a **catch-up card** ("W2D2 — your part, ~14 min") for any session from the current week the member missed; slices join via the family's room-code link on any device. (Surface detail in workout-experience.md §3.)
- **Under-⚙11 slices are intensity-capped and require parent-present confirmation at start** (per design-review F20 — extends the kids-only roster rule to solo slices).

## Coupling to the authoring pipeline

Every library entry carries the metadata the planner needs (pattern, time model, swap chain, age gates, member-range suitability). The LLM batch-authoring flow generates candidates *with* self-labeled metadata; founder review approves/edits; the simulation harness smoke-tests each accepted batch. The planner is only as good as the library's labeling discipline — labeling accuracy is a review checklist item, not a hope.

## Founder calibration list (Phase 0, from real sessions)

⚙ pattern taxonomy granularity · block time-model parameters · density progression thresholds · benchmark cadence (4-6?) · skill-frequency target · micro-session Pact rules · kids-only intensity cap. Each gets a measured answer from the family gate — the founder's family is the calibration instrument no competitor has.
