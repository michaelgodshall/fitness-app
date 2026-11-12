# Planner Skeleton — deterministic session planner (EXPLORATION SKETCH)

> **This is a throwaway de-risking prototype, not the real engine.** Built
> overnight 2026-07-18 (fable-night) for Michael to read in the morning. It
> exists to answer *"is the deterministic-planner design in the specs actually
> buildable, and where does it fight itself?"* — not to be shipped. Numbers are
> illustrative; nothing here is founder-calibrated.

Governing specs: `docs/design/session-planner-spec.md` (H1–H11 + soft
objectives) and `docs/design/engine-data-model.md`. Where those two docs
conflict (F31–F40), this sketch follows the arbitration rulings in
`docs/design/design-review-findings.md` — see **"Conflicts & rulings applied"**.

## Run it

```bash
cd explorations/2026-07-18-fable-night/prototypes/planner-skeleton
npm install          # tsx + typescript (dev only); already run
npm test             # property checks — expect: PASS 3 passed, 0 failed
npm run sim          # prints the 8-week simulation (also saved to sample-output.md)
```

Requires Node ≥ 20 (uses `structuredClone`). Built and verified on Node v24.6.0.

## Files

| File | What it is |
|---|---|
| `types.ts` | Faithful **subset** of the engine data model: members with age band + per-pattern **integer-grade** capability (F31), swap chains, block templates, session plan, history. |
| `library.ts` | Honest seed: **10 swap chains** across all 8 H2 patterns (4–6 rungs each) + **14 block templates** (straight-sets / superset / circuit / AMRAP / for-time-finisher). |
| `planner.ts` | The deterministic planner (seeded PRNG). Every function tags the H it serves. |
| `simulate.ts` | 8 weeks × 3 family shapes; compact per-session print + drift/repeat/utilization/adherence report. The seed of the roadmap's simulation harness. |
| `test.ts` | `node:assert` property checks — no framework. |
| `sample-output.md` | Saved `npm run sim` output. |

Canonical placeholder family (doc-canon): **Dad (42), Ryan (14), Leo (10), Sam (8).**

## What's REAL vs STUBBED

**Real (load-bearing, keep in the real build):**
- **Determinism** — seeded PRNG (`mulberry32`⟵string hash); same `(family, roster, budget, history, seed, day)` → byte-identical plan (I6). Asserted.
- **`eligible()` as the single gate predicate (I10)** — H4 equipment + H6 age gates in one function, run at plan-time (and designed to run at swap-time). Keep this shape.
- **H5 coverage via chains** — `resolveRung` picks the hardest eligible rung ≤ the member's grade, else the easiest eligible rung; a block is only scheduled if every present member is covered in every slot. This is why chains (not lone exercises) are the unit of coverage.
- **The AE §2.2 target formula** — `W × block_type_factor × position_factor × freshness_factor × β_band × intensity_factor`, with F39's intensity→factor mapping. Per-member scaling falls out of this.
- **Structural time model (H1)** — `estimateBlock` per kind; the block waits for the slowest member. Cap enforcement is a hard filter, never a trim-the-cap.

**Stubbed (throw away / replace):**
- **Capability is mutated in `simulate.ts`, not folded from a log.** F31/AE §1.1 say capability is an **I3-derived fold over the event log**. Here `settleSession` just nudges `W`/`grade`. The real build must fold from logged sessions.
- **No settlement / event model.** No `SessionEvent`, no merge law (I5), no PB minting, no Pact/slice accounting. History is a thin `SessionRecord`.
- **Benchmark `lastScore` is always `undefined`** — benchmark results aren't stored in the sketch's history, so "beat last time" numbers aren't wired. The H7 *scheduling* is real; the comparison payload is stubbed.
- **Reps/holds share one W.** AE says one canonical unit per pattern; real chains mix reps and holds, so hold targets are faked as `W × 3s`. Needs a real per-metric capability representation.
- **Coach voice is placeholder** — register-plausible (plain, no emoji), but not run against `coach-voice.md` golden lines.
- **Single-primary chains** — no lateral variants; `patternsHitBy` reads only `roster[0]`.

## H-constraints: implemented vs not

**Implemented (subset, as required):**
- **H1** time cap ≤ min(45, budget) — hard filter, asserted over 200 runs.
- **H2** pattern balance — rolling-7-day debt scoring, stalest-first block selection.
- **H4** equipment fence — via `eligible()`.
- **H5** roster coverage — every present member reachable in every slot.
- **H6** age gates — `minAgeBand` + gate tags (plyo/inversion/spinal gated for under-11; `parent-present` needs an adult).
- **H7** benchmark cadence — schedules a benchmark every ~5 sessions when H2/H3 allow (light).
- **H9** session grammar — warm-up → 2–4 work → optional finisher.
- **H10** novelty — structural signature (benchmark-exempt); repeats are *detected & flagged*.
- Plus **per-member scaling** (AE formula) and **F35 set-shaping** (under-11 loses sets, never the per-set number).

**NOT implemented (real build must add):**
- **H3** full recovery/taper — only a light "no benchmark on a pattern maxed <48h" guard; no Trials-taper, no post-Challenge downshift.
- **H8** skill weaving — no skill blocks / skill-stage frequency.
- **H11** full session-level combination caps — per-exercise gating only; no "don't stack two max-effort spinal-flexion blocks," no plyo-ground-contact budget.
- **H10 retry loop** — repeats are flagged, not resolved. See friction #1.
- Soft objectives 1–5 are only partially expressed (staleness relief yes; PB-freshness placement, roster-feel biasing, tight time-fit, skill frequency: no/partial).
- Reset Rep, Absence Ledger, micro-session Pact credit, slices — out of scope for a planner skeleton.

## Conflicts & rulings applied (F31–F40)

- **F31 (Critical)** — capability is AE's **integer `grade` + `W`** model, *not* EDM's 0-100 `Difficulty`. `types.ts:CapabilityState` follows AE §1.1; the difficulty scalar is dropped.
- **F34** — `Exercise` carries `difficultyGrade` + `graduationVolume` (AE §9 library deltas folded in).
- **F35** — per-member `setsOverride` lives on `SlotAssignment`; under-11 set-shaping cuts sets, never the per-set number.
- **F39** — `TargetScheme` intensity (`sub-max/moderate/max`) maps to an `INTENSITY_FACTOR` row in the AE formula; `fixed` bypasses the engine.
- **F32/F33/F36/F40** (Pact member-lines, `plan_slice`/`SlicePlan`, under-11 slice safety, PB-Watch source) — **not exercised** here (no settlement/slice/Pact layer in a planner skeleton); flagged for the real build, no contradicting choice made.

## The 3 hardest frictions against the specs (founder gold)

1. **H10 novelty vs H2 optimality fight — and the sketch loses.** A *deterministic*
   planner that greedily maximizes H2 pattern-balance keeps re-picking the same
   top-scored blocks: the full-family sim gets only **12/24 unique** sessions.
   H10 needs an actual reshuffle-on-repeat loop, and it will pull against "always
   pick the objectively stalest blocks." **The specs never say how novelty and
   soft-objective optimization arbitrate.** Decide the tie-break rule before build.

2. **H2 is a rolling-window constraint but nothing enforces the window.** On the
   25-minute short night, only 1–2 work blocks fit, so a single session can't
   touch all 8 patterns — the rolling-7-day spread hits **4** (H2's target is ≤2).
   Balancing greedily *per session* doesn't keep the *window* balanced when
   sessions are small. The real planner must plan H2 across the coming *sequence*
   of sessions (or explicitly relax H2 for sub-30-min budgets). The spec states
   H2 as a window rule but gives no mechanism for small-session weeks.

3. **F31's grade model only pays off where a pattern has multiple chains — and
   most don't.** "Capability transfers across chains in a pattern; pick the rung
   nearest the member's grade" is the whole point of grades-over-rungs. But with
   one chain per pattern (true for push/pull/squat/hinge here), `grade` and
   `rungIndex` collapse into near-synonyms and the abstraction earns nothing. It
   only bites for core/conditioning (2 chains each). **The library must ship
   multiple chains per pattern for the F31 model to be worth its complexity** —
   otherwise EDM's simpler rung-index would have been fine. Worth revisiting the
   F31 ruling's cost/benefit once the real library's chain-per-pattern count is known.

_(Bonus friction: reps-vs-holds sharing one `W` per pattern — AE's "one canonical
unit per pattern" breaks the moment a pattern's chain mixes a rep exercise and a
hold exercise, which core does immediately. Needs resolving in the capability model.)_
