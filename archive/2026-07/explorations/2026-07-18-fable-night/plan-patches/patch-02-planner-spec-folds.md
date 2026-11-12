---
patch: patch-02-planner-spec-folds
findings addressed: F9 (skill-progressions planner deltas → planner spec) · adaptive-engine §9 deltas 1–4 (→ planner spec side) · consistent with rulings F31/F33/F34/F35
target files (edits below):
  - docs/design/session-planner-spec.md        (6 edits — the substantive folds)
  - docs/design/skill-progressions.md           (1 edit — "now folded" annotation)
  - docs/design/adaptive-engine.md              (1 edit — "now folded" annotation)
goal: make session-planner-spec.md the single self-contained authority for the planner-facing
  roster/library/H7/H8/soft-objective contracts; the skills and adaptive-engine docs keep the
  design rationale but their "deltas to fold in" lists become resolved pointers.
scope guard: READ-ONLY on all docs — this file is a proposal, nothing was edited. Apply next session.
out of scope (tracked elsewhere, do NOT try to fold here):
  - adaptive-engine §9 delta 5 (coach-voice Tier-1 decision-line templates) → targets coach-voice.md; belongs to the F7 voice patch, not the planner spec.
  - The EDM-type side of §9 deltas 1–4 (adding difficulty_grade/graduation_volume/carryover_ratio/skill→pattern to engine-data-model.md types) → ruling F34, a separate EDM patch.
  - Target-computation / capability-fold logic itself → lives in adaptive-engine.md; this patch only concretizes the roster *reference* to it, it does not copy the formula.
---

# Patch 02 — Fold skill + adaptive §9 planner deltas into the session planner spec

Implements the two "same pattern as F9" folds the status notes name as a next-session task:
(a) skill-progressions.md §Session-engine integration "Planner-spec deltas to fold in" (a)–(d), and
(b) adaptive-engine.md §9 deltas 1–4 (the planner-facing subset).
Ruling constraints honored: **F31** — capability is `CapabilityState` (grade/W/confidence/trend/last_trained/floor), an I3-derived fold over the log, never hand-set; integer ladder **grade** replaces "which swap-chain rung"; the working rung is *derived* (nearest chain rung to grade). **F34** — library gains difficulty_grade/graduation_volume/carryover_ratio/skill→pattern mapping. **F35** — per-member set/round shaping is an adaptive-engine concern, referenced not duplicated here.

---

## EDIT 1 — Inputs: concretize the roster's capability + skill fields

**TARGET:** `docs/design/session-planner-spec.md` → `## Contract` → **Inputs:** → the `roster` bullet.

**CURRENT (exact):**
> - **roster** — members training tonight; each member: age band, per-pattern capability level (which swap-chain rung they work at), active skill stages, recent participation

**PROPOSED (paste-ready replacement):**
> - **roster** — members training tonight; each member:
>   - **age band** (canonical enum — see F19 patch)
>   - **per-pattern capability** — one `CapabilityState` per (member, pattern) over the H2 taxonomy: `{ grade, W, confidence, trend, last_trained, floor }` (adaptive-engine.md §1.1 is the authoritative shape). `grade` is the member's integer position on the pattern's difficulty ladder; the planner **derives** the swap-chain rung each slot uses as the chain rung nearest that grade (H5 roster-coverage checks against `grade`, not a stored rung). Capability is an I3-derived **fold over the session log** — recomputed by replay, never hand-mutated; parent corrections enter as logged override events (ruling F31). The target/advancement math that reads this state lives in adaptive-engine.md and runs *inside* H1–H11.
>   - **active skill stages** — per enrolled path, `(skill_path, rung, best_practice_result)`; `best_practice_result` vs. the next rung's standard is the gap meter H8/soft-obj-5 protect. Cap: ≤2 active paths per member ⚙.
>   - **recent participation** — sessions/dates for H2/H3 windows and Pact accounting.

**RATIONALE:** Implements skill-delta (b) and adaptive §9 delta 2. F31 ruling: `CapabilityState` wins, `grade` replaces "which swap-chain rung," rung is derived, capability is a replayable fold (never hand-set — matches CONTEXT.md "Capability state … updated only from logged training, never hand-set"). Makes the roster input self-describing so an agent building `plan_session` no longer has to cross-read two docs to know what a member *is*.

---

## EDIT 2 — Inputs: fold the library-metadata deltas into the `library` bullet

**TARGET:** `docs/design/session-planner-spec.md` → `## Contract` → **Inputs:** → the `library` bullet.

**CURRENT (exact):**
> - **library** — founder-approved exercises (pattern, equipment, swap chain, metric type, age gates, time model) and blocks (typed structures with per-block time models)

**PROPOSED (paste-ready replacement):**
> - **library** — founder-approved, authoring-time-labeled content the planner draws from:
>   - **exercises** — pattern, equipment, metric type, age gates, time model, plus (adaptive §9 / skill deltas): `difficulty_grade` (int within pattern), `graduation_volume` (the W at which the advancement check may arm), and — on skill drills — `skill_path` / `rung` and `household_surface` (stairs/chair/doorframe/wall; not equipment under H4, surfaced as an assumption at presentation).
>   - **swap chains** — ordered variants of one movement; each edge carries `carryover_ratio` ⚙ (how W seeds across a grade change, e.g. "full push-ups ≈ 40% of incline reps").
>   - **skill→pattern mapping** — table mapping each rung unlock to the pattern grade-floor it raises (adaptive §9 delta 4; consumed at initialization and as a capability floor).
>   - **blocks** — typed structures (straight sets, superset, circuit, AMRAP, for-time) with per-block time models.
>   - All metadata is self-labeled by the LLM authoring batch, founder-reviewed, and smoke-tested by the simulation harness — labeling accuracy is a review checklist item (see §Coupling).

**RATIONALE:** Implements skill-delta (a) and adaptive §9 deltas 1 & 4 on the planner-spec side (F34 folds the same fields into EDM types separately). The planner's H5/H7/H8 and the adaptive advancement check all key off metadata that was previously named only in the other two docs; naming it in the planner's own `library` input closes the F9/F34 fold-in gap. Uses CONTEXT.md block vocabulary (straight sets/superset/circuit/AMRAP/for-time).

---

## EDIT 3 — H7: state the benchmark-increment rule the planner enforces

**TARGET:** `docs/design/session-planner-spec.md` → `## Hard constraints` table → row **H7 (Benchmark cadence)**, Rule cell.

**CURRENT (exact):**
> | H7 | **Benchmark cadence** | A benchmark block — structurally identical to its previous appearance — is scheduled every ⚙4-6 sessions per member, but only when H2/H3 allow a fair comparison (never the day after same-pattern max effort). This manufactures "beat last time" moments inside otherwise-fresh sessions (generated sessions rarely repeat whole, so template-level workout PBs from the legacy design are replaced by block-level benchmarks). |

**PROPOSED (paste-ready replacement):**
> | H7 | **Benchmark cadence** | A benchmark block — structurally identical to its previous appearance — is scheduled every ⚙4-6 sessions per member, but only when H2/H3 allow a fair comparison (never the day after same-pattern max effort). This manufactures "beat last time" moments inside otherwise-fresh sessions (generated sessions rarely repeat whole, so template-level workout PBs from the legacy design are replaced by block-level benchmarks). **Benchmark target = the member's previous benchmark result on this block + the smallest meaningful increment** (⚙+1 rep / +5s); this overrides the adaptive target formula — the flag *is* the target ("⚑ beat last Tuesday: 64"). The increment value is owned in the ⚙ registry (adaptive-engine §2.2/§8). A benchmark block is the only block-level source of PBs (CONTEXT: Benchmark block). |

**RATIONALE:** Implements adaptive §9 delta 3. The planner is what *schedules and structures* the benchmark block, so its behavioral rule (target = last + increment, override formula) belongs in H7 for self-containment; the numeric increment stays a single-owner ⚙ in adaptive-engine's registry to avoid a duplicate source of truth.

---

## EDIT 4 — H8: restate to the skills-doc v0 shape

**TARGET:** `docs/design/session-planner-spec.md` → `## Hard constraints` table → row **H8 (Skill weaving)**, Rule cell.

**CURRENT (exact):**
> | H8 | **Skill weaving** | Members with active skill stages get a skill-practice block (≤8 min, skippable without invalidating the session), scheduled compatibly with H2/H3 — e.g., the teen holds tuck front-lever sets while younger kids run their circuit. |

**PROPOSED (paste-ready replacement):**
> | H8 | **Skill weaving** | Members with active skill stages get a **skill-practice block**: v0 fixed **6 min ⚙** under a hard **≤8-min** ceiling, **skippable** without invalidating the session, placed as the **first work block after warm-up** (motor-quality work happens fresh; the block doubles as lower-intensity spacing before conditioning). Structure = **parallel stations**: each present member simultaneously performs their current rung's practice drill (the Pull-Up path gives everyone a live rung, so this reads as *the family's skill minutes*, not one kid's sidebar). Each drill is a library entry with `skill_path`/`rung` metadata **plus** a normal pattern tag, so its volume counts in H2 balance and H3 recovery — no parallel bookkeeping. **Tests** are member-declared, at the top of the block, per the uniform witness protocol (skill-progressions rule 5); Trials-taper sessions (H3) suspend tests but keep light practice. **Drop protection:** when the budget forces cutting the block, protect members with the smallest measured gap to their next rung (see soft-obj 5). **Straight-arm isometric volume cap ⚙:** front-lever practice capped at ≤3 practice days/week and ~90s total hold/session per member (safety, skill-progressions §safety). Frequency target: 2–3×/week per active path ⚙; ≤2 active paths per member ⚙. |

**RATIONALE:** Implements F9's core ("restate H8 to match the skills doc's v0 shape") and skill-deltas (a) pattern-accounting, (c) drop protection, (d) straight-arm cap. Reconciles the two prior shapes: the skills doc's "fixed 6 min / first block / parallel stations" is the v0 instantiation *inside* H8's ≤8-min hard ceiling — 6 is the ⚙ default, 8 is the invariant. The old "teen does skill work while younger kids run their circuit" example contradicted the parallel-stations design (everyone has a rung via Pull-Up) and is dropped.

**FOUNDER CALL — straight-arm cap altitude:** the skills doc calls it a "new hard-ish rule for the planner." Recommend keeping it *inside* H8 as a bounded sub-rule (it is skill-path-specific, not a whole-session invariant) rather than minting a new numbered hard constraint H12. Flag if you'd rather it be its own H-row with its own property test.

---

## EDIT 5 — Soft objective 5: add gap-proximity drop protection

**TARGET:** `docs/design/session-planner-spec.md` → `## Soft objectives` → item 5.

**CURRENT (exact):**
> 5. **Skill-stage progress** — active stages get practice at effective frequency (⚙2-3×/week per stage)

**PROPOSED (paste-ready replacement):**
> 5. **Skill-stage progress** — active stages get practice at effective frequency (⚙2-3×/week per stage); when a tight budget forces the H8 block or specific stations to drop, **drop-priority protects members with the smallest measured gap to their next rung** (a kid 2 seconds from a rung shouldn't lose his block to a 25-minute Tuesday) — gap is `next-rung standard − best_practice_result` from the roster.

**RATIONALE:** Implements skill-delta (c). The protection reads the gap meter now named in the roster input (Edit 1), so the soft objective is fully derivable from the planner's own inputs.

---

## EDIT 6 — Coupling section: expand the required-metadata list

**TARGET:** `docs/design/session-planner-spec.md` → `## Coupling to the authoring pipeline` → first sentence.

**CURRENT (exact):**
> Every library entry carries the metadata the planner needs (pattern, time model, swap chain, age gates, member-range suitability). The LLM batch-authoring flow generates candidates *with* self-labeled metadata; founder review approves/edits; the simulation harness smoke-tests each accepted batch.

**PROPOSED (paste-ready replacement):**
> Every library entry carries the metadata the planner needs (pattern, time model, swap chain, age gates, member-range suitability, `difficulty_grade`, `graduation_volume`, edge `carryover_ratio`, and — for skill drills — `skill_path`/`rung`/`household_surface`; skill-path config additionally carries the skill→pattern mapping table — see §Contract Inputs). The LLM batch-authoring flow generates candidates *with* self-labeled metadata; founder review approves/edits; the simulation harness smoke-tests each accepted batch.

**RATIONALE:** Keeps the labeling-discipline paragraph consistent with the expanded `library` input (Edit 2) so the review checklist actually covers the new grade/graduation/skill fields the planner and adaptive engine now depend on.

---

## EDIT 7 — Annotate skill-progressions.md: deltas now folded

**TARGET:** `docs/design/skill-progressions.md` → `## Session-engine integration` → the **"Planner-spec deltas to fold in"** bullet.

**CURRENT (exact):**
> - **Planner-spec deltas to fold in:** (a) library metadata gains `skill_path`/`rung` and `household_surface` tags; (b) roster's "active skill stages" concretizes to (path, rung, best_practice_result); (c) soft objective 5 gains gap-proximity drop protection; (d) straight-arm weekly volume cap ⚙.

**PROPOSED (paste-ready replacement):**
> - **Planner-spec deltas — FOLDED (2026-07-18, patch-02):** all four are now specified in `session-planner-spec.md`, which is the authority: (a) `skill_path`/`rung`/`household_surface` → §Contract Inputs `library` + §Coupling; (b) roster "active skill stages" → `(skill_path, rung, best_practice_result)` in §Contract Inputs `roster`; (c) gap-proximity drop protection → soft objective 5 + H8; (d) straight-arm volume cap → H8. This section keeps the design rationale; the planner spec governs the contract.

**RATIONALE:** F9 requires the deltas land in one authoritative place; this converts the skills doc's open to-do into a resolved pointer so the drift can't silently reopen.

---

## EDIT 8 — Annotate adaptive-engine.md §9: planner-side deltas now folded

**TARGET:** `docs/design/adaptive-engine.md` → `## 9. Library-metadata & spec deltas (to fold in, same pattern as skill-progressions §deltas)` → the intro line and delta list.

**CURRENT (exact — the section header line):**
> ## 9. Library-metadata & spec deltas (to fold in, same pattern as skill-progressions §deltas)

**PROPOSED (paste-ready replacement — header + a status note inserted directly under it, above the numbered list):**
> ## 9. Library-metadata & spec deltas
>
> **Fold status (2026-07-18, patch-02):** deltas 1–4's **planner-spec side** is now folded into `session-planner-spec.md` (delta 1 → §Contract Inputs `library` + §Coupling; delta 2 → §Contract Inputs `roster` as `CapabilityState`; delta 3 → H7; delta 4 → §Contract Inputs `library` skill→pattern mapping). Their **engine-data-model type side** is tracked separately (ruling F34, EDM patch). **Delta 5** (coach-voice Tier-1 decision-line templates) is unfolded here — it targets `coach-voice.md` and rides the F7 voice patch. This section remains the design-rationale source; the planner spec and EDM govern the respective contracts.

**RATIONALE:** Adaptive §9 explicitly invites the same fold pattern as F9; this records where each delta landed and preserves the F34 (EDM) and F7 (coach-voice) boundaries so no delta is double-owned or dropped. Note: delta list items 1–5 themselves are left intact below the status note.

**FOUNDER CALL — none.** Boundaries follow existing rulings (F31/F34) and the delta-5 target is unambiguous (coach-voice).

---

## Verification checklist (re-read after applying, to confirm consistency)

1. **session-planner-spec.md §Contract Inputs** — roster now names `CapabilityState` with `grade` (not "which swap-chain rung"); library lists difficulty_grade/graduation_volume/carryover_ratio/skill_path/rung/household_surface/skill→pattern. No remaining "per-pattern capability level (which swap-chain rung)" phrasing.
2. **H5** still reads coherently now that coverage checks against derived rung-from-grade (Edit 1 states this; H5 text itself is unchanged — confirm no contradiction).
3. **H7 ↔ adaptive-engine §2.2/§8** — increment rule stated in H7, numeric still single-owned in the ⚙ registry (no duplicated number).
4. **H8 ↔ skill-progressions §Session-engine integration** — 6-min-under-8 ceiling, first-block, parallel-stations, pattern-accounting, drop protection, straight-arm cap, tests-at-top all present and non-contradictory; the old "teen while younger kids run their circuit" example is gone.
5. **Soft objective 5** — gap definition matches the roster's `best_practice_result` field (Edit 1).
6. **CONTEXT.md** terms honored: Pattern, Swap chain, Benchmark block, Capability state, Skill path, Rung, Gap meter, Block (straight sets/superset/circuit/AMRAP/for-time) — grep the edited sections for any stray "level/step/stage" for rung or "workout" in specs.
7. **skill-progressions.md** delta bullet and **adaptive-engine.md** §9 note both say "FOLDED → session-planner-spec.md"; neither still reads as an open to-do.
8. **No fence touched:** 45-min cap (H1) unchanged; no runtime LLM introduced (adaptive engine is pure functions); no gender field added; COPPA sub-profile model untouched; numeric gates untouched.
9. **Out-of-scope untouched:** engine-data-model.md not edited here (F34), coach-voice.md not edited here (delta 5 / F7).
