---
patch: patch-04-pb-model-and-record-book
findings-addressed: F13 (Trials-taper phase flags), F14 (Record Book phasing), F15 (PB-model spec — new section)
target-files:
  - docs/design/session-planner-spec.md   # F13 (H3 + inputs), F15 (new PB-model section)
  - docs/design/coach-voice.md             # F13 (§Phase mapping)
  - docs/design/workout-experience.md      # F14 (phasing map)
  - docs/design/skill-progressions.md      # F14 (Q6 + §v0-cut #4)
status: ready-to-apply — READ-ONLY draft; founder applies next session
depends-on: F40 ruling (PB Watch/close-screen PBs fire only on benchmark blocks + Trials; S3/S5 + EDM §1.7 edits handled in F40's own patch). F15 and F40 MUST land together.
rulings-implemented: F40 arbitration ruling (two PB sources only); F8 Calibration-Trials rule (generalized); EDM ⚙M2/I2 (lineage scoping); library-authoring-pipeline §4 (benchmark continuity)
---

# Patch 04 — PB model + Record Book phasing + Trials-taper phase flags

Three Medium findings from the design-layer review. F13 and F14 are mechanical phase-flag corrections whose fix direction the finding already states. F15 WRITES the missing PB-model spec as a new section in the planner spec (the finding names it "owner of the PB table input"). No arbitration ruling is renegotiated; where the review left a genuine judgment open it is flagged FOUNDER CALL.

---

## F13 — Trials-taper is Phase-1 functionality embedded unflagged in Phase 0 specs

Fix per finding: tag H3's taper mode and the Trials-calendar input "Phase 1-activated"; delete the taper claim from the voice doc's phase-mapping paragraph.

### Edit F13.1

**TARGET:** `docs/design/session-planner-spec.md` — §Contract, Inputs list, `history` bullet

**CURRENT:**
> - **history** — recent sessions per member (patterns hit, volumes, dates), benchmark-block schedule state, PB table, Pact state, Trials calendar position

**PROPOSED:**
> - **history** — recent sessions per member (patterns hit, volumes, dates), benchmark-block schedule state, PB table, Pact state, Trials calendar position **(Phase 1-activated — Trials are a Phase 0 non-goal; this field is null in Phase 0)**

**RATIONALE:** Implements F13. The Phase 0 planner contract consumes a Trials calendar that doesn't exist until Phase 1; flagging the input keeps the contract honest without deleting the field the Phase 1 planner needs.

### Edit F13.2

**TARGET:** `docs/design/session-planner-spec.md` — §Hard constraints table, row H3 (Recovery)

**CURRENT:**
> | H3 | **Recovery** | No repeat max-intensity work on the same pattern within 48h per member. Post-Challenge/Trials: next session auto-downshifts intensity. Trials-taper mode: the 2-3 sessions before Trials week reduce volume (see trials-and-challenges.md). |

**PROPOSED:**
> | H3 | **Recovery** | No repeat max-intensity work on the same pattern within 48h per member. Post-Challenge/Trials: next session auto-downshifts intensity. **Trials-taper mode (Phase 1-activated — inert in Phase 0, which ships no Trials):** the 2-3 sessions before Trials week reduce volume (see trials-and-challenges.md). |

**RATIONALE:** Implements F13. The 48h-recovery core of H3 is Phase 0; only the taper sub-mode is Phase 1. Tagging the sub-mode (rather than the whole constraint) preserves the Phase 0 rule while stopping an agent from building taper logic against a nonexistent Trials calendar.

### Edit F13.3

**TARGET:** `docs/design/coach-voice.md` — §6 Implementation notes, §Phase mapping (one flag)

**CURRENT:**
> Roadmap puts "coach voice v1" in Phase 1 and lists "coach-voice polish" as a Phase 0 non-goal — but **Phase 0 ships PB detection ("beat last Tuesday: 64 squats") and Trials-taper messaging, and those *are* coach-voice moments.** Resolution: Phase 0 ships a small **hand-authored starter set** of Tier-1 lines (session open, PB, mid-set, missed-week — roughly the lines in §4, written by the founder, no LLM pipeline). The batch-authoring pipeline, register system, and Tier 2 arrive as coach voice v1 in Phase 1. This keeps the Phase 0 non-goal honest (no *system*, no polish) without shipping the founder's family a PB moment that reads like a debug string.

**PROPOSED:**
> Roadmap puts "coach voice v1" in Phase 1 and lists "coach-voice polish" as a Phase 0 non-goal — but **Phase 0 ships PB detection ("beat last Tuesday: 64 squats"), and that *is* a coach-voice moment.** (Trials-taper messaging is *not* a Phase 0 moment — Trials are a Phase 1 non-goal in Phase 0; the "Trials week announcement" goldens in §4 are Phase 1 content, doc-canon now but not shipped until then.) Resolution: Phase 0 ships a small **hand-authored starter set** of Tier-1 lines (session open, PB, mid-set, missed-week — roughly the lines in §4, written by the founder, no LLM pipeline). The batch-authoring pipeline, register system, and Tier 2 arrive as coach voice v1 in Phase 1. This keeps the Phase 0 non-goal honest (no *system*, no polish) without shipping the founder's family a PB moment that reads like a debug string.

**RATIONALE:** Implements F13. Deletes the false Phase-0-ships-taper-messaging claim while keeping the §4 Trials-announcement goldens as canon (they're Phase 1 content, not a Phase 0 ship claim). The starter-set list already omits taper, so it needs no change.

---

## F14 — Record Book phasing contradicts itself across three docs

Fix per finding: phasing-map row becomes "thin Record Book list: Phase 0; full surface + Trials integration: Phase 1"; mark skills Q6 resolved-by-PLAN. (PLAN §Approach-1 already ratifies the thin Phase 0 list; workout-experience §S5 already chalks PBs in the Phase 0 close — both correct and unchanged. Only the phasing-map row and the skills open questions drift.)

### Edit F14.1

**TARGET:** `docs/design/workout-experience.md` — §Phasing map table (the Trials/Record-Book row)

**CURRENT:**
> | Trials ceremony, judge counter, Trials Report, Record Book surface | 1 |

**PROPOSED:**
> | Thin Family Record Book list (chronological chalk lines: PBs + skill unlocks; PLAN §Approach-1, skills §v0-cut #4) — the §S5 close chalks into this | 0 |
> | Trials ceremony, judge counter, Trials Report, full Record Book surface + Trials integration | 1 |

**RATIONALE:** Implements F14. Splits the conflated row so the phasing map stops contradicting both PLAN §Approach-1 (thin list budgeted in Phase 0) and this doc's own §S5 (Phase 0 close chalks PBs into the Record Book). The full surface + Trials integration correctly stays Phase 1.

### Edit F14.2

**TARGET:** `docs/design/skill-progressions.md` — §Open questions for the founder, item 6

**CURRENT:**
> 6. **Record Book thin slice into Phase 0** — approve the scope add?

**PROPOSED:**
> 6. **Record Book thin slice into Phase 0** — RESOLVED, no founder call needed: PLAN §Approach-1 already ratifies "a thin Family Record Book list (explicitly budgeted)" in Phase 0. (design-review F14; was a duplicate of a settled decision.)

**RATIONALE:** Implements F14. The finding notes Q6 "asks founder approval for what PLAN already ratified." Marking it resolved-by-PLAN removes the phantom open question without deleting the audit trail.

### Edit F14.3  *(recommended — closes the same contradiction inside the build list)*

**TARGET:** `docs/design/skill-progressions.md` — §Skills v0 — the Phase 0 cut, build item 4

**CURRENT:**
> 4. **The unlock moment:** one full-screen takeover (member, rung, date) on the shared display + a permanent Record Book line. **Scope call for the founder:** the roadmap doesn't list the Record Book in Phase 0 — this design pulls a thin slice in (a chronological list surface, skill unlocks + structure ready for Trials PBs), because unlock *permanence* is precisely the hook under test. It's a list; it's cheap.

**PROPOSED:**
> 4. **The unlock moment:** one full-screen takeover (member, rung, date) on the shared display + a permanent Record Book line. **Ratified (not an open scope call):** PLAN §Approach-1 budgets the thin Record Book list in Phase 0 — a chronological list surface, skill unlocks + structure ready for Trials PBs — because unlock *permanence* is precisely the hook under test. It's a list; it's cheap. (design-review F14.)

**RATIONALE:** The same Q6 contradiction is restated as an open "Scope call for the founder" inside build item 4; leaving it there would re-open the question F14.2 just closed. Included as a recommended companion edit so all three docs agree. **FOUNDER CALL:** apply only if you want full internal consistency — F14's literal fix names Q6 only; this is the belt-and-suspenders line.

---

## F15 — PB semantics have no spec (WRITE the PB-model section)

Fix per finding: add a PB-model section to the planner spec (owner of the PB table input). The section below is paste-ready. It implements the F40 ruling (two PB sources only), generalizes the F8 Calibration-Trials rule, and honors EDM §1.7 storage types, EDM ⚙M2/I2 lineage scoping, and library-authoring-pipeline §4 benchmark continuity — it does not restate those types, it defines the semantics they serialize.

### Edit F15.1  *(insertion — new section)*

**TARGET:** `docs/design/session-planner-spec.md` — insert a new section between §"Async slice contract" and §"Coupling to the authoring pipeline"

**CURRENT (the boundary, quoted to locate the insertion point — the first bullet is unchanged; the new section is inserted before the heading):**
> - **Under-⚙11 slices are intensity-capped and require parent-present confirmation at start** (per design-review F20 — extends the kids-only roster rule to solo slices).
>
> ## Coupling to the authoring pipeline

**PROPOSED (same first bullet, then the new section, then the unchanged heading):**
> - **Under-⚙11 slices are intensity-capped and require parent-present confirmation at start** (per design-review F20 — extends the kids-only roster rule to solo slices).
>
> ## PB model & benchmark lineage (added per design-review F15 — owner of the `history.PB table` input)
>
> **Scope.** Defines what a personal best (PB) is, what mints one, how comparability is scoped, and how PB Watch reads it. Storage types live in engine-data-model.md §1.7 (`PBContext`, `PBRecord`, the `pb_cache`); this section is the semantics those types serialize. PBs are a **derived cache** (EDM I3) — recomputable from settled history, never independently authored.
>
> **Two — and only two — PB sources (per design-review F40 ruling).** A PB mints from exactly two contexts, matching `PBContext`:
> 1. **Trials test** — exercise-level, sacred. Lineage key `(memberId, testId)`. Fixed universal standard; no swap chain, no rung.
> 2. **Benchmark block** — block-level. Lineage key `(benchmarkKey, memberId, rung)` (EDM §1.2 benchmark identity). The recurring benchmark block (H7) is the *only* block-level PB source.
>
> **Ordinary (non-benchmark) work blocks mint no PBs and never trigger PB Watch.** Generated sessions rarely repeat whole, so a raw "best-ever count in any session" is not an honest comparison (different fatigue, order, rest) — H7 benchmark blocks exist precisely to manufacture the fair one. This is the F40 resolution: PB Watch (§S3) and the close-screen PB beats (§S5) fire only inside benchmark blocks and Trials.
>
> **What counts as a beat, per metric type.** A settled score is a PB iff it **strictly** improves on the current all-time best *of its lineage*, in the metric's better direction:
> - `reps`, `hold-seconds` → strictly greater.
> - `elapsed-seconds` (for-time / co-op benchmark) → strictly less.
>
> A **tie is not a PB** — no mint, no beat animation, no Progress Points; the existing record's `achievedAt` stands (first to reach the value owns it). Rationale: PP mints against all-time best (CONTEXT: "the only baseline PP mints against"); re-minting on equal performance manufactures the jackpot the anti-gaming design forbids.
>
> **First-attempt baselines (generalizes the Trials calibration rule, F8).** The first settled score in a lineage **establishes the baseline; it is not itself a PB** — nothing to beat, so no beat fires and no Progress Points mint. Beating begins on the second appearance.
> - **Trials instance:** a member's first-ever Trials appearance (`TrialsResult.isCalibration`, EDM §1.8) records baselines for all five tests and mints 0 PP — the **Calibration Trials** rule (trials-and-challenges §Two-axis scoring, design-review F8). Same principle as benchmark baselines, stated once.
> - **Consequence for PB Watch:** a lineage holding only a baseline *does* have an all-time best, so PB Watch can fire on the second appearance (the member is now chasing the baseline value). A freshly-opened lineage (rung change / successor benchmark, below) holds no datum on its first appearance → no PB Watch until it has one.
>
> **Lineage scoping — per-rung (benchmark), per-test (Trials).**
> - Benchmark PBs are scoped to the member's **rung** on the block-slot chain (EDM I2 / ⚙M2). A member who **swaps up or down** between appearances **closes the old lineage and opens a new one** — "first score at the new level" — and never compares across rungs. Normalizing scores across rungs is rejected: it fakes the one comparability benchmarks exist to keep honest.
> - **Lateral swaps** (same rung — CONTEXT: "laterals share a rung") **preserve the lineage** — same difficulty by founder-reviewed construction — *provided the metric type is unchanged*. A lateral that changes the metric (`reps`↔`hold-seconds`) closes the lineage like a rung change (nothing comparable to carry).
> - Trials PBs are scoped to `(memberId, testId)` only — Trials tests are fixed standards with no chain, so rung/swap scoping does not apply.
>
> **Under-⚙11 verification gate (H11).** An under-⚙11 member's PB mint requires a movement-quality-**verified** register (`PBRecord.verified`, EDM I9 — "5 clean reps, parent-verified"), synchronously or in a slice. An unverified under-11 max sets no PB and writes no Record Book line.
>
> **Recall & retired-benchmark interaction (per library-authoring-pipeline §4 "Benchmark continuity").** When a benchmark block's exercise is `recalled`:
> - its PB lineage is **preserved but closed** — recorded bests stand as fact; history is annotated, never rewritten (EDM I1 / §1.2);
> - the planner schedules a **successor benchmark on the nearest chain neighbor** at the normal H7 cadence; the successor is a **new lineage** — its first appearance is a baseline (no PB, no PP) by the first-attempt rule above;
> - no silently-incomparable "beat last time" ever surfaces across the recall boundary.
>
> The same close-and-reopen applies when any published standard is versioned (EDM I1): editing a standard mints a new lineage, never mutates an old best.
>
> **"Relevant all-time best" for PB Watch (resolves the workout-experience §S3 ambiguity).** The best PB Watch measures against is the all-time best **of the exact lineage the member is performing right now** — for a benchmark block `(benchmarkKey, memberId, current rung)`; for a Trials test `(memberId, testId)`. PB Watch enters at ≥90% of that value (CONTEXT: PB Watch). No cross-lineage, no cross-rung, no non-benchmark source.
>
> **Record Book & Progress Points hooks.** Every benchmark or Trials PB mint appends exactly one Record Book chalk line (EDM I9 — the Chalking) and, from Phase 1 once the PP economy lands, one `PPEntry` scaled by margin (EDM ⚙M12; v0 mints nothing and retro-mints via `effectiveAt`). Baselines and ties append neither.
>
> ## Coupling to the authoring pipeline

**RATIONALE:** Implements F15 — writes the missing PB model in the doc the finding names as PB-table owner. Every clause traces to a settled decision: two-source rule = F40 ruling; strict-beat/tie handling and first-attempt baseline = anti-gaming physics of "all-time best" (CONTEXT) plus F8 generalized; per-rung lineage and swap handling = EDM ⚙M2/I2; recall behavior = library-authoring-pipeline §4; verification gate = H11/EDM I9. It cross-references EDM §1.7 types rather than redefining them, keeping EDM the type home and the planner spec the semantics home.

**FOUNDER CALL (F15):**
1. **Lateral-swap comparability.** The spec rules that same-rung lateral variants stay in one benchmark lineage (same difficulty by construction) unless the metric changes. If you judge specific laterals too dissimilar to compare "beat last time" honestly, the correct fix is chain-authoring (split the rung so they aren't laterals), not a special case in the PB model — confirm this stance.
2. **Baseline visibility.** Confirmed behavior: a first-appearance baseline is silent (no beat, no PP) but the value *is* recorded as the current best, so the coach can say "first score at this level" and PB Watch arms next time. Confirm the founder wants no beat on baselines (recommended — a "beat" on a first-ever attempt reads as hollow, and PP would double-count against F8).

---

## Verification checklist (re-read after applying)

- [ ] **F13:** grep `session-planner-spec.md` for "Trials calendar" and "Trials-taper" — both now carry a "Phase 1-activated" flag; H3's 48h recovery core is untouched.
- [ ] **F13:** `coach-voice.md` §Phase mapping no longer claims Phase 0 ships Trials-taper messaging; the §4 "Trials week announcement" goldens remain as Phase 1 canon.
- [ ] **F14:** `workout-experience.md` phasing map has two rows (thin Record Book = Phase 0; full surface + Trials integration = Phase 1); §S5 still chalks PBs in the close (should be unchanged and now consistent).
- [ ] **F14:** `skill-progressions.md` Q6 marked resolved-by-PLAN; if F14.3 applied, build item 4 no longer reads as an open "scope call."
- [ ] **F15:** new §"PB model & benchmark lineage" sits between §Async slice contract and §Coupling to the authoring pipeline; the `history` inputs bullet's "PB table" is now defined by it.
- [ ] **F15↔F40 co-landing:** confirm F40's patch (S3/S5 wording that PB Watch/close PBs fire only on benchmark blocks + Trials; the corrected S5 "MAX — 26 PUSH-UPS" example; EDM §1.7 `PBContext`) lands in the same session — the two are one design and contradict the docs if split.
- [ ] **CONTEXT alignment:** the new section uses "all-time best," "PB Watch," "benchmark block," "Calibration Trials," "rung," "swap chain," "the Chalking," "Record Book" as defined in CONTEXT.md — no new vocabulary introduced.
- [ ] **Fences intact:** no runtime LLM (PB detection is deterministic settlement), no gender in data model, 45-min cap untouched, COPPA H11 verification gate preserved.
