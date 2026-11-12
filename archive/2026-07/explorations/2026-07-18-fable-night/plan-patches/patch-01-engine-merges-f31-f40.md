---
patch-id: patch-01-engine-merges-f31-f40
title: Engine-doc merges — execute the F31–F40 arbitration rulings
priority: 1 (BLOCKS all engine code — CLAUDE.md session-start ritual)
findings-addressed: F31, F32, F33, F34, F35, F36, F37, F38, F39, F40
rulings-source: docs/design/design-review-findings.md §"Second pass — engine docs" (ARBITRATION RULINGS block)
target-files:
  - docs/design/engine-data-model.md            (EDM — primary; adopts the merged model)
  - docs/design/adaptive-engine.md              (AE — §1.1 stays authoritative; small vocab/annotation edits)
  - docs/design/session-planner-spec.md         (planner spec — Pact & slice specs WIN, one roster-line annotation)
  - docs/design/workout-experience.md           (F40 S3/S5 wording + example correction)
apply-order: E1→E25 (EDM), then A1→A4 (AE), then P1 (planner), then W1–W2 (experience). No edit touches another edit's exact text.
review-note: >
  Every edit below implements an already-recorded ruling; none renegotiates one. Where a ruling
  mandates a mechanism but leaves a sub-choice open, it is marked FOUNDER CALL and defaults to the
  least-surprising option. Vocabulary follows CONTEXT.md (Grade, capability state, member line, slice,
  benchmark block). Fences untouched: 45-min cap, no runtime LLM, no gender field, COPPA sub-profiles,
  numeric gates.
---

# Patch 01 — Engine-doc merges (F31–F40)

This patch makes `engine-data-model.md` able to express what `adaptive-engine.md` and
`session-planner-spec.md` already ratified, per the recorded rulings. **F31 and F32 are the
implementation blockers** — they come first and are the most thorough. F33–F40 follow their
one-line fixes exactly as the ruling directs.

Ruling recap (verbatim intent from the findings doc):
- **F31** — AE's `CapabilityState` wins; EDM drops the 0-100 `Difficulty` scale for integer ladder **grades**; capability is an **I3-derived fold over the log**, parent edits are **logged override events**; AE §1.1 is the authoritative definition, EDM references it.
- **F32** — planner-spec Pact spec wins **unconditionally**; EDM restructures `PactWeek`/`PactCredit` around **member lines** (`memberId` + date on every credit, required per-member targets, daily cap); **⚙M3 deleted → pointer**.
- **F33** — planner-spec `plan_slice → SlicePlan` wins; EDM adds the type + function.
- **F34–F40** — fix direction per each finding's one-line fix; **F35** per-member sets/rounds override and **F40** "PB Watch fires only on benchmark blocks + Trials (S5 corrected)" are the confirmed designs.

---

## PART A — engine-data-model.md (EDM)

### E1 · F31 — Retire the `Difficulty` type for an integer `Grade`
**TARGET:** EDM §1.0 Primitives & vocabulary (type aliases block)

**CURRENT**
```ts
export type RungIndex = number;           export type Difficulty = number;         // 0-100 shared scale ⚙M1
```

**PROPOSED**
```ts
export type RungIndex = number;           export type Grade = number;              // integer ladder position within a pattern (adaptive-engine §1.1/§9); ⚙M1
```

**RATIONALE** F31 ruling: EDM "drops the 0-100 `Difficulty` scale in favor of integer ladder grades." `Grade` is the single representation the merged `CapabilityState` and the swap chains both key off. Every downstream reference to `Difficulty` is retargeted below.

---

### E2 · F31 — Add capability to the "derivations" split
**TARGET:** EDM §0 Shape (the facts-vs-derivations sentence)

**CURRENT**
> The load-bearing split is **facts vs. derivations**: sessions record what happened; everything a family sees as "state" (Pact ring, pattern debt, PB tables, challenge unlocks) is a pure function over settled facts, never independently stored.

**PROPOSED**
> The load-bearing split is **facts vs. derivations**: sessions record what happened; everything a family sees as "state" (Pact ring, pattern debt, PB tables, challenge unlocks, **per-pattern capability**) is a pure function over settled facts, never independently stored.

**RATIONALE** F31 ruling declares capability "an I3-derived **fold over the log**." The Shape section is where EDM states what is derived vs stored; capability now belongs on the derivations side alongside the other caches, resolving the authority conflict F31 flagged (AE "pure fold" vs EDM "parent-edited slow state").

---

### E3 · F31 — Remove capability from parent-edited slow state
**TARGET:** EDM §0 Shape (layer table, Family row)

**CURRENT**
```
| **Family** | Family, FamilyMember, capability, skill enrollment, absence ledger | slow state, parent-edited |
```

**PROPOSED**
```
| **Family** | Family, FamilyMember, skill enrollment, absence ledger | slow state, parent-edited (capability excepted — I3-derived fold, §1.4) |
```

**RATIONALE** F31 ruling: capability is "never hand-mutated." Listing it as parent-edited slow state is the exact drift the ruling resolves; it is a derived cache, and parent edits enter as logged override facts (E8, E10).

---

### E4 · F31 + F34 — `ChainRung.difficulty` → `grade`; add `carryoverRatio`
**TARGET:** EDM §1.1 Exercise & swap chains (`ChainRung` interface)

**CURRENT**
```ts
export interface ChainRung {
  difficulty: Difficulty;                // shared scale ⚙M1; authoring-labeled, founder-reviewed
  exercises: ExerciseId[];               // [primary, ...lateral variants] — swap UI: easier / lateral / harder
}
```

**PROPOSED**
```ts
export interface ChainRung {
  grade: Grade;                          // integer ladder position within the pattern (adaptive-engine §1.1/§9); authoring-labeled, founder-reviewed. Laterals on a rung share it; an exercise's grade IS its rung's grade
  exercises: ExerciseId[];               // [primary, ...lateral variants] — swap UI: easier / lateral / harder
  carryoverRatio?: number;               // ⚙ (adaptive-engine §9): W carried from the previous (easier) rung across a grade change ("full push-ups ≈ 0.4 × incline reps")
}
```

**RATIONALE** F31 sets the grade representation; F34 folds AE §9 delta 1's `carryover_ratio` edge property into EDM. Grade lives on the rung (laterals share it), which satisfies AE's "every exercise carries a difficulty_grade" without duplicating the field — an exercise's grade is `chain.rungs[rung].grade`. FOUNDER CALL: default `carryoverRatio` values are per-chain ⚙ calibration, not set here.

---

### E5 · F34 — `Exercise` gains `graduationVolume`
**TARGET:** EDM §1.1 (`Exercise` interface, `chain` field line)

**CURRENT**
```ts
  chain: { chainId: SwapChainId; rung: RungIndex };
```

**PROPOSED**
```ts
  chain: { chainId: SwapChainId; rung: RungIndex };  // grade = chain.rungs[rung].grade (adaptive-engine §1.1)
  graduationVolume?: number;             // ⚙ (adaptive-engine §3/§9): W at which advancement arms — "incline push-up graduates at 12"
```

**RATIONALE** F34 ruling: AE's §3 advancement check is "unimplementable against EDM as written — `Exercise` has no `graduation_volume`." This is per-exercise (a lateral variant can graduate at a different count), so it lives on `Exercise`, not `ChainRung`.

---

### E6 · F34 — Skill→pattern mapping: `SkillPath.pattern` + `SkillRung.unlockGradeFloor`
**TARGET:** EDM §1.3 (`SkillPath` and `SkillRung` interfaces)

**CURRENT**
```ts
export interface SkillPath {
  id: SkillPathId; name: string;
  entryRequirement?: { pathId: SkillPathId; rung: RungIndex } | { exerciseStandard: string }; // ⚙ per skills doc
  rungs: SkillRung[];
}
export interface SkillRung {
  name: string;                           // real vocabulary — "Tuck Lever", never badge names
  passStandard: { metric: 'reps' | 'hold-seconds'; value: number; formChecks: string[] };  // ≤2 binary checks
  practiceDrills: ExerciseId[];           // library entries carrying skill tags
  gates: GateTag[];                       // e.g. park-bar, parent-present
  safetyNote: string;                     // hand lane, verbatim forever
}
```

**PROPOSED**
```ts
export interface SkillPath {
  id: SkillPathId; name: string;
  pattern: Pattern;                       // F34 (adaptive-engine §1.2/§1.3/§9): the pattern a rung unlock raises a capability grade floor on
  entryRequirement?: { pathId: SkillPathId; rung: RungIndex } | { exerciseStandard: string }; // ⚙ per skills doc
  rungs: SkillRung[];
}
export interface SkillRung {
  name: string;                           // real vocabulary — "Tuck Lever", never badge names
  passStandard: { metric: 'reps' | 'hold-seconds'; value: number; formChecks: string[] };  // ≤2 binary checks
  practiceDrills: ExerciseId[];           // library entries carrying skill tags
  unlockGradeFloor?: Grade;               // F34 (adaptive-engine §1.3): on witnessed pass, raises the capability floor on SkillPath.pattern to this grade
  gates: GateTag[];                       // e.g. park-bar, parent-present
  safetyNote: string;                     // hand lane, verbatim forever
}
```

**RATIONALE** F34 ruling folds AE §9 delta 4 (skill→pattern mapping table, "rung unlock → pattern grade floor") into EDM. AE §1.3 reads skill unlocks as capability floors; the mapping must be storable on the standard. FOUNDER CALL: the concrete `pattern` per skill path and `unlockGradeFloor` per rung are authoring values set with the Tier-1 library.

---

### E7 · F32 — `Family.pact` is a per-member default; the ring is an aggregate
**TARGET:** EDM §1.4 (`Family` interface, `pact` field)

**CURRENT**
```ts
  pact: { sessionsPerWeek: number };      // the ring target (default 3)
```

**PROPOSED**
```ts
  pact: { defaultWeeklyTarget: number };  // per-member DEFAULT target (⚙3, configurable 1-5 per member); the ring is the AGGREGATE of member lines, not a single family number (planner spec §Pact — F32)
```

**RATIONALE** F32 ruling: the planner spec's member-line-primary accounting wins unconditionally. EDM made `sessionsPerWeek` "the ring target" (a single family number) — exactly what F32 says the model cannot keep. The family value is only the default seed for each member line; the ring is `Σ` of lines (E20).

---

### E8 · F31 + F32 — `FamilyMember`: capability becomes `CapabilityState` (derived); `weeklyTarget` required
**TARGET:** EDM §1.4 (`FamilyMember` interface, closing fields)

**CURRENT**
```ts
  capability: Record<Pattern, PatternCapability>;
  skillPaths: SkillPathState[];           // ≤2 active ⚙ (skills doc)
  weeklyTarget?: number;                  // personal session-equivalents — non-sync-week gate (d) arithmetic;
}                                         //   the family ring target lives on Family.pact
```

**PROPOSED**
```ts
  capability: Record<Pattern, CapabilityState>;  // DERIVED cache (I3): an estimate_capability fold over the log (adaptive-engine §1.1, authoritative). Never hand-mutated; parent edits enter as logged CapabilityOverride facts (§1.4/§4). Materialized in capability_cache (§2)
  skillPaths: SkillPathState[];           // ≤2 active ⚙ (skills doc)
  weeklyTarget: number;                   // per-member Pact target (⚙3, configurable 1-5); the member line's target for the WHOLE Pact, not just gate (d) (planner spec §Pact — F32)
}
```

**RATIONALE** F31: capability adopts `CapabilityState` and is derived. F32: the planner spec makes every member's weekly target load-bearing for the whole Pact (any completed session credits the line), so `weeklyTarget` is required and no longer scoped to "gate (d) arithmetic" — that narrowing was the F32 defect.

---

### E9 · F31 — Replace `PatternCapability` with `CapabilityState` (mirrors AE §1.1)
**TARGET:** EDM §1.4 (`PatternCapability` interface)

**CURRENT**
```ts
export interface PatternCapability {      // ⚙M1 — the capability model
  level: Difficulty;                      // planning scalar: highest chain rung with difficulty ≤ level is reachable
  chainPointers?: Partial<Record<SwapChainId, RungIndex>>;  // sticky per-chain overrides, taught by accepted swaps
}                                         //   pointer wins over level where present; settlement updates pointers
```

**PROPOSED**
```ts
export interface CapabilityState {        // ⚙M1 — AUTHORITATIVE definition in adaptive-engine.md §1.1; this mirrors it. DERIVED (I3): an estimate_capability fold over the log, never hand-mutated (F31)
  grade: Grade;                           // integer ladder position within the pattern; planner picks, per slot, the chain rung whose grade is nearest this (this is what H5 roster-coverage checks against)
  W: number;                              // working volume: reps (or seconds) per set at grade, straight-set, fresh — the single anchor (adaptive-engine §1.1); all block types derive via §2.2 factors
  confidence: 'calibrating' | 'established' | 'stale';   // gates update gain (adaptive-engine §1.1)
  trend: number[];                        // last-6 implied-W observations — the classifier window (adaptive-engine §1.4)
  lastTrained: ISODate;
  floor: number | null;                   // benchmark-anchored minimum for W (adaptive-engine §2.4)
}
```

**RATIONALE** F31 ruling: adopt `CapabilityState`'s fields exactly; AE §1.1 is authoritative and EDM references it. The old `{ level, chainPointers }` model is superseded — grade replaces "which swap-chain rung," and per-chain pointers are unnecessary because capability transfers across chains of one pattern via grade.

---

### E10 · F31 — Log parent capability edits as `CapabilityOverride` facts
**TARGET:** EDM §1.4 (`Family.absenceLedger` field, and the `AbsenceEntry` type immediately following)

**CURRENT**
```ts
  absenceLedger: AbsenceEntry[];          // 5-second skip tags; recurring reason biases the planner (Reset Rep input)
}
export interface AbsenceEntry { at: ISODate; memberId?: MemberId; reason: 'busy' | 'tired' | 'sick' | 'away' | 'other' }
```

**PROPOSED**
```ts
  absenceLedger: AbsenceEntry[];          // 5-second skip tags; recurring reason biases the planner (Reset Rep input)
  capabilityOverrides: CapabilityOverride[];  // F31: parent capability edits as append-only logged facts — estimate_capability folds these in; capability state is never hand-mutated
}
export interface AbsenceEntry { at: ISODate; memberId?: MemberId; reason: 'busy' | 'tired' | 'sick' | 'away' | 'other' }
export interface CapabilityOverride {     // F31: a parent edit is a logged fact, not a mutation — the fold reads it as a high-authority observation
  at: EpochMs; memberId: MemberId; pattern: Pattern;
  set: { grade?: Grade; W?: number };     // partial override applied at `at`
  by: MemberId;                           // the adult who set it (isAdult)
}
```

**RATIONALE** F31 ruling: "parent edits as logged override events (never hand-mutated state)." This is the mechanism — an append-only fact the `estimate_capability` fold consumes, preserving the replayable-fold property (AE §0.2) and CONTEXT.md's "capability state … updated only from logged training, never hand-set." FOUNDER CALL: storing overrides on `Family` (vs a separate event stream) is a placement choice; the ruling mandates only that they be logged facts.

---

### E11 · F31 — Rewrite ⚙M1 to the resolved model
**TARGET:** EDM §6 ⚙ Open modeling calls (row M1)

**CURRENT**
```
| M1 | Capability representation | Per-pattern scalar `level` on a shared 0-100 difficulty scale + sticky per-chain rung pointers taught by accepted swaps. Pointer wins where present; scalar places members on chains they've never touched. Pure per-chain-only rejected (new chains would have no placement); pure scalar rejected (real bodies aren't uniform within a pattern). |
```

**PROPOSED**
```
| M1 | Capability representation | **RESOLVED (design-review F31): `CapabilityState` wins** (adaptive-engine §1.1, authoritative). Per (member, pattern): `{ grade, W, confidence, trend, lastTrained, floor }`. Integer ladder **grade** replaces the 0-100 `Difficulty` scale; capability is a **derived I3 fold over the log** (estimate_capability), never hand-mutated — parent edits enter as logged `CapabilityOverride` facts. The earlier scalar-`level` + chain-pointer sketch is superseded. |
```

**RATIONALE** M1 previously recommended the very model F31 rejected; leaving it would re-open the settled question. It now records the ruling.

---

### E12 · F33 — Add `SlicePlan`; mark `SliceRef` as the offer handle; add intensity cap
**TARGET:** EDM §1.6 (`SliceRef` interface)

**CURRENT**
```ts
export interface SliceRef {
  parentPlanId: SessionPlanId;
  memberId: MemberId;
  blockIds: BlockId[];                     // ⊆ parent plan blocks (I8) — the member's scaled portion
}
```

**PROPOSED**
```ts
export interface SliceRef {                // the OFFER handle (candidate) — sliceOffers yields these
  parentPlanId: SessionPlanId;
  memberId: MemberId;
  blockIds: BlockId[];                     // ⊆ parent plan blocks (I8) — the member's scaled portion
  intensityCapped?: boolean;              // F36/F20: true for under-⚙11 members — no max-effort blocks offered
}
export interface SlicePlan {               // F33: plan_slice OUTPUT — the member's re-timed solo portion (planner spec §Async slice contract)
  parentPlanId: SessionPlanId;
  memberId: MemberId;
  seed: string;                            // deterministic re-time (parent seed ⊕ memberId)
  timeBudgetMin: number;                   // the member's DECLARED budget (H1 applies; micro-session rules under 15) — NOT merely the slice estimate
  blocks: PlannedBlock[];                  // parent blocks re-timed for solo pacing (shared-timer → member-paced, same work/rest structure); benchmark identity (benchmarkKey) preserved
  estimatedSeconds: number;                // ≤ min(45, budget)
}
```

**RATIONALE** F33 ruling: "planner spec's `plan_slice → SlicePlan` wins (the declared time budget matters — it's how a 14-minute slice becomes possible on a 25-minute bus ride); EDM adds the type and function." EDM previously had only a derived `SliceRef` with the dial fixed to the estimate. `SliceRef` stays as the candidate handle `sliceOffers` returns; `SlicePlan` is the re-timed plan the slice instance runs. `intensityCapped` also seeds F36.

---

### E13 · F32 + F33 + F36 — Slice-lifecycle prose: declared budget, member-line credit, under-11 safety
**TARGET:** EDM §1.6 (Slice lifecycle paragraph — two sentences)

**CURRENT (sentence 1)**
> A slice runs the same machine with the lobby collapsed (auto-join, dial fixed to the slice estimate) — solo-member mode *is* the slice projection.

**PROPOSED (sentence 1)**
> A slice runs `plan_slice(parentPlan, member, budget) → SlicePlan` on the same machine with the lobby collapsed (auto-join, dial fixed to the **member's declared budget**, not merely the slice estimate; blocks re-timed for solo pacing, benchmark identity preserved) — solo-member mode *is* the slice projection. **Under-⚙11 slices are intensity-capped (`sliceOffers` sets `intensityCapped`; no max-effort blocks) and require an adult-present confirmation before START (§3.5)** — the planner-spec F20/F36 rule, made structural.

**CURRENT (sentence 2, end of paragraph)**
> under-⚙11 members can't mint PBs solo without a verified register (H11 — unchanged by slicing). Family Pact credit from slices: ⚙M3.

**PROPOSED (sentence 2)**
> under-⚙11 members can't mint PBs solo without a verified register (H11 — unchanged by slicing). **A completed slice credits the member's own Pact line (1, daily cap applies); the family ring is the aggregate of lines — no separate family mint** (planner spec §Pact; supersedes ⚙M3, F32).

**RATIONALE** F33 fixes the dial to the declared budget and names `plan_slice`; F32 replaces the `⚙M3` family-mint pointer with the ratified member-line rule; F36 injects the under-11 intensity cap + start-confirmation into the lifecycle text. All three are the recorded rulings applied to the same paragraph.

---

### E14 · F32 — `Settlement` emits one `PactCredit` per crediting participant
**TARGET:** EDM §1.7 (`Settlement` interface, `pactCredit` field)

**CURRENT**
```ts
  pactCredit?: PactCredit;                 // derived then cached (I3)
```

**PROPOSED**
```ts
  pactCredits: PactCredit[];               // one per crediting participant's line (member-line-primary, F32); derived then cached (I3)
```

**RATIONALE** F32: a shared session credits *each* participant's line, so a single optional `PactCredit` cannot express settlement. This is the settlement-side half of the member-line restructure (E20 is the view side).

---

### E15 · F38 — Per-member adaptive coach line on `SessionPlan`
**TARGET:** EDM §1.5 (`SessionPlan` interface, `coach` field)

**CURRENT**
```ts
  coach: { revealLine: string; closeTease: string };  // rendered at plan time (coach-voice selection is deterministic too)
```

**PROPOSED**
```ts
  coach: { revealLine: string; closeTease: string; adaptiveLines?: Record<MemberId, string> };  // rendered at plan time (deterministic). adaptiveLines: ≤1 adaptive line per member per session (adaptive-engine §6 budget) — F38
```

**RATIONALE** F38 ruling: "add … a per-member adaptive-line slot to `SessionPlan.coach`." AE §6 budgets exactly one adaptive line per member per session; EDM had only two shared strings, with no home for it.

---

### E16 · F37 — Add an `emom` block kind to EDM's closed union
**TARGET:** EDM §1.2 (`BlockDef` union, and the `AmrapDef` line)

**CURRENT (union)**
```ts
export type BlockDef =
  | StraightSetsDef | SupersetDef | CircuitDef | AmrapDef | ForTimeDef | SkillStationsDef | TestDef;
```

**PROPOSED (union)**
```ts
export type BlockDef =
  | StraightSetsDef | SupersetDef | CircuitDef | AmrapDef | EmomDef | ForTimeDef | SkillStationsDef | TestDef;
```

**CURRENT (AmrapDef line)**
```ts
export interface AmrapDef         extends BlockDefBase { kind: 'amrap'; capSeconds: number; scoring: 'per-member' | 'shared-pool' } // shared-pool = co-op grammar (Family 500)
```

**PROPOSED (AmrapDef line + new EmomDef)**
```ts
export interface AmrapDef         extends BlockDefBase { kind: 'amrap'; capSeconds: number; scoring: 'per-member' | 'shared-pool' } // shared-pool = co-op grammar (Family 500)
export interface EmomDef          extends BlockDefBase { kind: 'emom'; roundSeconds: number; rounds: number } // every-minute-on-the-minute; density tier T2 (adaptive-engine §4.1) — F37
```

**RATIONALE** F37 ruling direction: "adding an EMOM kind to EDM if actually intended." AE §4.1's density-tier table unlocks EMOM at T2, so it is intended — the union must carry it or AE references a block type that cannot exist. **FOUNDER CALL:** F37 also mentions "complexes" (T3); this patch does **not** add a `ComplexDef` — recommend modeling a complex as a `circuit` variant (or deferring to a later density patch) rather than a new kind, pending your read on whether complexes are a v1 shape. Flag if you want it typed now.

---

### E17 · F35 — Per-member `sets`/`rounds` override on `PlannedBlock`
**TARGET:** EDM §1.5 (`PlannedBlock` interface, `poolTarget`/`estimatedSeconds` tail)

**CURRENT**
```ts
  poolTarget?: number;                     // shared-pool AMRAP: deterministic roster formula output
  estimatedSeconds: number;
}
```

**PROPOSED**
```ts
  poolTarget?: number;                     // shared-pool AMRAP: deterministic roster formula output
  perMemberSets?: Record<MemberId, { sets?: number; rounds?: number }>;  // F35: per-member sets/rounds override, defaults to the def's value. Under-11 set-shaping (adaptive-engine §2.3): cut sets/rounds, NEVER the visible per-set number
  estimatedSeconds: number;
}
```

**RATIONALE** F35 ruling confirms "F35's per-member sets/rounds override … as the intended design." AE §2.3's binding under-11 rule ("cut sets/rounds, never the number on the wall") requires per-member counts; EDM kept `sets`/`rounds` only on the shared `BlockDef`, so "8×2 for Sam while Dad does 15×3" was inexpressible. Placed on `PlannedBlock` (not `SlotAssignment`) because sets/rounds are block-level, and the per-set rep target is already per-member on `SlotAssignment.target`. **FOUNDER CALL:** whether to also formalize "visible per-set number never shrinks" as an EDM invariant (I11) or leave it to AE §7's property test — recommend leaving it in AE §7 (it needs cross-session history EDM invariants don't carry).

---

### E18 · F39 — Cross-reference `TargetScheme` to the `compute_target` formula
**TARGET:** EDM §1.2 (`TargetScheme` type)

**CURRENT**
```ts
export type TargetScheme =
  | { kind: 'relative'; intensity: 'sub-max' | 'moderate' | 'max' }   // scaled off member capacity history
  | { kind: 'fixed'; target: number };                                 // warm-up staples
```

**PROPOSED**
```ts
export type TargetScheme =
  | { kind: 'relative'; intensity: 'sub-max' | 'moderate' | 'max' }   // F39: maps to an intensity factor row in adaptive-engine §2.2's compute_target formula
  | { kind: 'fixed'; target: number };                                 // warm-up staples — F39: bypasses the engine; target used verbatim
```

**RATIONALE** F39 ruling direction (recommend accepted): "intensity → a factor row in AE §2.2's table; `fixed` bypasses." EDM's `TargetScheme` and AE's `W × factors` formula were two disconnected target recipes; this ties them. The AE-side factor row is A2 below.

---

### E19 · F38 + F31 — Add `capability_cache` and `reasons` to the Convex mirror
**TARGET:** EDM §2 (Convex mirror table, `pb_cache`/`pact_cache` row)

**CURRENT**
```
| `pb_cache`, `pact_cache` | derived views | settlement refresh | derived (I3) — recompute must equal |
```

**PROPOSED**
```
| `pb_cache`, `pact_cache`, `capability_cache` | derived views (capability_cache: Record<MemberId, Record<Pattern, CapabilityState>>) | settlement / plan refresh | derived (I3) — recompute must equal |
| `reasons` | ReasonRecord[] (§1.7) | settlement / plan emit | derived-emit — golden fixtures (adaptive-engine §7) |
```

**RATIONALE** F38 ruling: "Add explicit derived-cache shapes (capability_cache, reasons) to EDM §2." AE's `CapabilityState` and Reason records had no storage home in the mirror (which listed only `pb_cache`/`pact_cache`). `capability_cache` is the materialization of the E8/E9 fold; `reasons` stores the E-below `ReasonRecord`s pinned as golden fixtures.

---

### E20 · F32 — Restructure `PactWeek`/`PactCredit` around member lines
**TARGET:** EDM §1.8 (`PactWeek` and `PactCredit` interfaces)

**CURRENT**
```ts
export interface PactWeek {                // VIEW — always derivePactWeek(family, settledSessions, weekStart) (I3)
  weekStart: ISODate; target: number;
  credits: PactCredit[];
  memberSliceCounts: Record<MemberId, number>;       // gate (d): "every member completes ≥2 solo slices"
  complete: boolean;
}
export interface PactCredit {
  sessionInstanceId: SessionInstanceId;
  kind: 'shared' | 'solo' | 'slice-settled' | 'micro';
  sharedQualifying: boolean;               // ≥20 min ∧ ≥2 members ∧ adult present — gate (a) arithmetic
}
```

**PROPOSED**
```ts
export interface PactWeek {                // VIEW — always derivePactWeek(family, settledSessions, weekStart) (I3). Member-line-primary per planner spec §Pact (F32)
  weekStart: ISODate;                                // Monday 00:00 family-local
  lines: Record<MemberId, PactLine>;                 // the primary accounting
  ringTarget: number;                                // Σ lines[*].target — the S1 family-ring surface (aggregate, not a stored family number)
  ringCredited: number;                              // Σ lines[*].credited
  credits: PactCredit[];                             // raw crediting facts (pre-daily-cap)
  memberSliceCounts: Record<MemberId, number>;       // gate (d): "every member completes ≥2 solo slices"
  complete: boolean;                                 // true iff every line.complete
}
export interface PactLine {
  memberId: MemberId;
  target: number;                          // member.weeklyTarget snapshot (1-5, default ⚙3)
  credited: number;                        // distinct crediting CALENDAR DAYS this week (daily cap: ≤1 credit per member per day)
  complete: boolean;                       // credited ≥ target
}
export interface PactCredit {
  memberId: MemberId;                      // member-line-primary (F32)
  date: ISODate;                           // family-local calendar day — the daily-cap key (≤1 credit per member per day)
  sessionInstanceId: SessionInstanceId;
  kind: 'shared' | 'solo' | 'slice-settled' | 'micro';   // any completed session credits the line; completion is the unit, not minutes
  sharedQualifying: boolean;               // ≥20 min ∧ ≥2 members ∧ adult present — gate (a) synchronous-arithmetic tag (not a credit precondition)
}
```

**RATIONALE** F32 ruling: "restructure `PactWeek`/`PactCredit` around member lines (memberId + date on every credit, required per-member targets, daily-cap rule stated)." This makes EDM express the planner spec verbatim: member line has target + credited-days; family ring is the aggregate; every credit carries `memberId` + `date` so `derivePactWeek` can enforce the ≤1/member/day cap by de-duplicating on `(memberId, date)`. The single-family-`target` field is gone.

---

### E21 · F32 — Rewrite ⚙M3 to a pointer
**TARGET:** EDM §6 ⚙ Open modeling calls (row M3)

**CURRENT**
```
| M3 | Slice → family Pact credit | Family session-equivalent mints when **all planned members'** slices of one parent plan settle within the Pact week; member slice counts are tracked independently for gate (d). Per-slice fractional family credit rejected (turns the ring into arithmetic nobody feels). |
```

**PROPOSED**
```
| M3 | Slice → Pact credit | **RESOLVED (design-review F32) — see session-planner-spec.md §Pact.** Member-line-primary: a completed slice credits the member's OWN line (1, daily cap applies); the family ring is the aggregate of lines — there is no separate family mint. The earlier all-members-sliced family mint is superseded (it was exactly the "arithmetic nobody feels" the ratified spec avoids). Member slice counts still track gate (d). |
```

**RATIONALE** F32 ruling: "⚙M3 is deleted, replaced by a pointer." M3's all-members-sliced family mint contradicted the ratified per-line credit; the pointer removes the second, conflicting Pact rule.

---

### E22 · F31 + F33 + F38 — Add the adaptive/slice functions to the pure-function surface
**TARGET:** EDM §1.9 (the pure function surface, `sliceOffers`/`estimateSession` tail)

**CURRENT**
```ts
sliceOffers(plan, settlements, now): SliceRef[]
estimateSession(plan, calib): number
```

**PROPOSED**
```ts
sliceOffers(plan, settlements, now): SliceRef[]
planSlice(sessionPlan, member, timeBudget, seed): SlicePlan                 // F33 — re-timed solo portion (planner spec §Async slice)
estimateCapability(memberLog, overrides, params): Record<Pattern, CapabilityState>  // F31/F38 — the fold; adaptive-engine §0/§1 (overrides = CapabilityOverride facts)
computeTarget(state, blockCtx, params): { target: number; reason: ReasonRecord }    // adaptive-engine §2
advancementCheck(state, chain, params): ReasonRecord | null                 // adaptive-engine §3 — suggest, never force
estimateSession(plan, calib): number
```

**RATIONALE** F33 adds `plan_slice` to the function surface (was absent — EDM had only `sliceOffers`). F31/F38: the three adaptive functions AE defines are called by `plan_session` but had no listing in EDM's "unit-test surface," and their outputs (`CapabilityState`, `ReasonRecord`) are now EDM types.

---

### E23 · F31 — Extend invariant I3 to cover capability
**TARGET:** EDM §5 Invariants (row I3)

**CURRENT**
```
| I3 | **Derived, never stored.** Pact ring, member slice counts, challenge unlocks, pattern debt, benchmark-due, PB caches: `recompute(pure fn, settled history) === cached value`, always | randomized histories; recompute-vs-cache equality after every settlement |
```

**PROPOSED**
```
| I3 | **Derived, never stored.** Pact ring/lines, member slice counts, challenge unlocks, pattern debt, benchmark-due, PB caches, **capability state**: `recompute(pure fn, settled history + overrides) === cached value`, always. Capability is an estimate_capability fold; parent edits are logged `CapabilityOverride` facts, never hand-mutations (F31) | randomized histories; recompute-vs-cache equality after every settlement |
```

**RATIONALE** F31 makes capability derived; I3 is the invariant that "derived === recompute," and it must now name capability (and its override-fold inputs) so the property test covers it.

---

### E24 · F36 — Under-11 slice START requires adult-present confirmation
**TARGET:** EDM §3.5 (Slices in the machine — first sentence)

**CURRENT**
> A slice instance enters at `reveal` (lobby collapsed, dial fixed), runs blocks `slice.blockIds` only, and closes with the personal-lens close (family beats — Pact ring movement — render if the slice settlement mints them).

**PROPOSED**
> A slice instance enters at `reveal` (lobby collapsed, dial fixed to the member's declared budget), runs blocks `slice.blockIds` only, and closes with the personal-lens close (family beats — Pact ring movement — render if the slice settlement mints them). **For an under-⚙11 member the `reveal → block(0)` START is guarded by a logged adult-present confirmation fact, and `sliceOffers` has already stripped max-effort blocks (`intensityCapped`)** — the F20/F36 safety rule, made structural in the slice lifecycle (mirrors the kids-only-roster edge case).

**RATIONALE** F36 ruling: "Add the parent-present confirmation to the slice entry path (§3.5) and the intensity cap to `sliceOffers`/`eligible()` context." EDM's slice lifecycle carried only the H11 PB-verification gate, re-opening the exact gap F20 closed. The intensity-cap field is E12; this is the start-confirmation half. FOUNDER CALL: whether the confirmation is its own `SessionEvent` kind or a reuse of an existing JOIN/START fact — recommend a lightweight logged confirmation on the START transition (no new event type needed).

---

### E25 · F40 — State the two-source PB rule on `PBContext`
**TARGET:** EDM §1.7 (`PBContext` type)

**CURRENT**
```ts
export type PBContext =
  | { kind: 'trials-test'; testId: TrialsTestId }                       // exercise-level, sacred, Trials-only
  | { kind: 'benchmark-block'; key: BenchmarkKey; rung: RungIndex };    // block-level lineage (§1.2)
```

**PROPOSED**
```ts
export type PBContext =                                                  // F40: the ONLY two PB sources — PB Watch and close-screen PBs fire ONLY on benchmark blocks + Trials; an ordinary block mints no PB (no exercise-level best cache in v1)
  | { kind: 'trials-test'; testId: TrialsTestId }                       // exercise-level, sacred, Trials-only
  | { kind: 'benchmark-block'; key: BenchmarkKey; rung: RungIndex };    // block-level lineage (§1.2)
```

**RATIONALE** F40 ruling: "'PB Watch fires only on benchmark blocks + Trials' … confirmed as the intended design" (the alternative — an exercise-level best cache — was **not** chosen). EDM's `PBContext` was already correct; this annotation makes the narrowing explicit so the experience-doc fix (W1/W2) has a cited engine source instead of being a silent drift (the F23 pattern).

---

## PART B — adaptive-engine.md (AE)

AE §1.1 stays the authoritative `CapabilityState` definition (F31) — **not edited**. These are the vocabulary/annotation edits its own findings direct.

### A1 · F39 + F37 — Add `intensity_factor` to the `compute_target` formula
**TARGET:** AE §2.2 (the formula line)

**CURRENT**
```
target = round_meaningful( W × block_type_factor × position_factor × freshness_factor × β_band )
```

**PROPOSED**
```
target = round_meaningful( W × block_type_factor × intensity_factor × position_factor × freshness_factor × β_band )
```

**RATIONALE** F39 recommend: map `TargetScheme.relative` intensity into the formula as a factor. This is the formula half; A2 adds the factor rows.

---

### A2 · F37 + F39 — Complete the factor table (block kinds + intensity + role)
**TARGET:** AE §2.2 (factor table, `block_type_factor` row)

**CURRENT**
```
| `block_type_factor` | straight sets 1.0 (anchor, definitional) · superset 0.85 · circuit station 0.75 · finisher 0.6 · AMRAP: pace model, expected total = W × amrap_factor(duration) | One shared factor family, not per-member state (§1.1 decision) |
```

**PROPOSED**
```
| `block_type_factor` | straight sets 1.0 (anchor) · superset 0.85 · circuit station 0.75 · EMOM 0.8 ⚙ · for-time 0.9 ⚙ · **finisher 0.6 — session ROLE, not a kind: keys off `PlannedBlock.role` (EDM §1.2)** · skill-stations n/a (targets are skill-rung drills, not W-derived) · AMRAP: pace model, expected total = W × amrap_factor(duration) | One shared factor family (§1.1); vocabulary matches EDM `BlockDef` kinds + `role` (F37) |
| `intensity_factor` | `TargetScheme.relative`: sub-max 0.8 ⚙ · moderate 1.0 · max 1.15 ⚙ · `TargetScheme.fixed` **bypasses the engine** (target used verbatim) | Maps EDM `TargetScheme` into the formula (F39) — the slot's intended intensity, distinct from block type |
```

**RATIONALE** F37 ruling: "Align AE's vocabulary to EDM's `BlockDef` kinds + `role` … and complete the factor table" — EDM defines finisher as a role and has no EMOM factor; the row now keys finisher on `role`, adds EMOM/for-time, and marks skill-stations n/a. F39: the `intensity_factor` row is the mapping from `TargetScheme`. **FOUNDER CALL:** all ⚙ factor values (EMOM 0.8, for-time 0.9, sub-max 0.8, max 1.15) are calibration defaults, not ruled numbers — tune at session zero; add them to the §8 ⚙ registry.

---

### A3 · F31 — Note parent edits enter as logged override facts
**TARGET:** AE §0 Contract & posture (posture rule 2)

**CURRENT**
> 2. **State is a fold over the log.** Capability is never hand-mutated; it is recomputed by replaying logged sessions through the update rule. Retune a ⚙ parameter → replay history → new state. This is also what makes Phase 2 parameter tuning free (§5).

**PROPOSED**
> 2. **State is a fold over the log.** Capability is never hand-mutated; it is recomputed by replaying logged sessions through the update rule. **A parent capability edit is not a mutation either — it enters the log as a `CapabilityOverride` fact (engine-data-model §1.4/§4, F31) that the fold reads as a high-authority observation.** Retune a ⚙ parameter → replay history → new state. This is also what makes Phase 2 parameter tuning free (§5).

**RATIONALE** F31 ruling requires "parent edits as logged override events." AE asserts capability is never hand-mutated but never says how a parent correction enters — this closes that gap consistently with EDM E10, and with CONTEXT.md's "never hand-set."

---

### A4 · F34 — Mark §9 deltas as folded into EDM
**TARGET:** AE §9 (section heading)

**CURRENT**
```
## 9. Library-metadata & spec deltas (to fold in, same pattern as skill-progressions §deltas)
```

**PROPOSED**
```
## 9. Library-metadata & spec deltas (FOLDED INTO engine-data-model.md per design-review F31/F34 — this section is now the rationale; EDM §1.1/§1.3 is the implementation)
```

**RATIONALE** F34 ruling folds §9's deltas into EDM (E4/E5/E6). The heading previously said "to fold in," which — left as-is — would read as still-pending work and re-trigger the F9/F34 fold-failure. Now it points at the implementation.

---

## PART C — session-planner-spec.md (planner)

The Pact spec (§Pact) and slice contract (§Async slice) **win and are not edited** (F32/F33). One annotation only.

### P1 · F31 — Roster line names `CapabilityState`
**TARGET:** planner spec §Contract → Inputs (roster bullet)

**CURRENT**
> - **roster** — members training tonight; each member: age band, per-pattern capability level (which swap-chain rung they work at), active skill stages, recent participation

**PROPOSED**
> - **roster** — members training tonight; each member: age band, per-pattern **capability state** (`CapabilityState`: grade / W / confidence / trend / floor — engine-data-model §1.4, adaptive-engine §1.1), active skill stages, recent participation

**RATIONALE** F31 concretizes the planner's "per-pattern capability level" to `CapabilityState` (AE §9 delta 2). This is the one planner-spec touch the merge requires; the phrase "which swap-chain rung they work at" is superseded by grade-based resolution.

---

## PART D — workout-experience.md (F40 only)

### W1 · F40 — PB Watch fires only inside a benchmark block or Trials
**TARGET:** workout-experience.md §S3 (member-columns / PB Watch sentence, ~line 50)

**CURRENT**
> When a member is inside 90% of a relevant all-time best, their column enters **PB Watch** (color shift + distance-to-best) — the room sees it coming.

**PROPOSED**
> When a member is inside 90% of a relevant all-time best **during a benchmark block or a Trials test** (the only two PB sources — engine-data-model §1.7 `PBContext`), their column enters **PB Watch** (color shift + distance-to-best) — the room sees it coming. Ordinary work blocks do not mint PBs and never enter PB Watch.

**RATIONALE** F40 ruling: PB Watch fires only on benchmark blocks + Trials. The experience doc's unqualified "relevant all-time best" was underivable in a non-benchmark block under EDM's `PBContext` — the F23 silent-narrowing pattern, now made explicit and cited.

---

### W2 · F40 — Correct the S5 close example to a benchmark PB
**TARGET:** workout-experience.md §S5 (close sequence, PBs-one-at-a-time step, ~line 66)

**CURRENT**
> 2. **PBs, one at a time, full screen each:** *"MAX — 26 PUSH-UPS — all-time best, +3"* → chalk-line animation writing it into the Family Record Book. Each PB gets its own beat; two PBs = two moments.

**PROPOSED**
> 2. **PBs, one at a time, full screen each:** *"MAX — 26 PUSH-UPS — benchmark best, +3"* (a PB fires only from a benchmark block or Trials — engine-data-model §1.7) → chalk-line animation writing it into the Family Record Book. Each PB gets its own beat; two PBs = two moments.

**RATIONALE** F40 ruling: "with the S5 example corrected." The old example implied any push-up set mints an all-time best; reframing it as a benchmark-block best keeps the ceremony but makes it derivable. **FOUNDER CALL:** exact copy ("benchmark best" vs "beat last time: 26") is yours — the constraint is only that the source be a benchmark/Trials context.

---

## Verification checklist (re-read after applying)

1. **No dangling `Difficulty` / `PatternCapability`.** Grep EDM for `Difficulty` and `PatternCapability` — both should be gone (replaced by `Grade` / `CapabilityState`). Check `PlannedMember.capabilitySnapshot` in §1.5 — **NOTE:** it still reads `Record<Pattern, Difficulty>`; if you want full fidelity change it to `Record<Pattern, CapabilityState>` (flagged — not in the numbered edits; decide whether a plan snapshots full state or just grade).
2. **Capability is derived everywhere.** §0 prose (E2), §0 table (E3), §1.4 (E8/E9), I3 (E23), §2 mirror (E19) all agree capability is an I3 fold with `CapabilityOverride` facts — no "parent-edited" claim survives for capability. AE §0.2 (A3) matches.
3. **Pact is member-line-primary end-to-end.** `Family.pact` (E7) = default only; `FamilyMember.weeklyTarget` required (E8); `PactWeek.lines`/`PactLine`/`PactCredit.memberId+date` (E20); `Settlement.pactCredits[]` (E14); ⚙M3 is a pointer (E21); slice credits the line, not a family mint (E13). Cross-check against planner spec §Pact — they must read identically (planner spec wins).
4. **Daily cap is expressible.** `PactCredit` carries `date`; `PactLine.credited` counts distinct days; confirm `derivePactWeek` de-dupes on `(memberId, date)`.
5. **Slice: `SlicePlan` exists and is used.** `plan_slice` in §1.9 (E22); `SlicePlan` type (E12); §1.6 + §3.5 prose reference declared budget + under-11 confirmation + `intensityCapped` (E13/E24). No remaining "dial fixed to the slice estimate."
6. **AE §9 deltas are all in EDM.** `Exercise.graduationVolume` (E5), `ChainRung.grade`+`carryoverRatio` (E4), `SkillPath.pattern`+`SkillRung.unlockGradeFloor` (E6), skill→pattern floor. AE §9 heading now says "folded" (A4).
7. **Block vocabulary reconciled.** EDM `BlockDef` has `emom` (E16); AE §2.2 factor table keys finisher on `role`, lists EMOM/for-time/skill-stations, and no longer names a block kind EDM lacks (A2). Complexes: confirm your defer/model decision (E16 FOUNDER CALL).
8. **Target recipes compose.** `TargetScheme` cross-refs AE §2.2 (E18); AE formula has `intensity_factor` (A1) with sub-max/moderate/max/`fixed`-bypass rows (A2).
9. **Reason records have a home.** `ReasonRecord` type (E19-adjacent §1.7), `reasons` mirror row (E19), `SessionPlan.coach.adaptiveLines` (E15). AE §6/§7 reference these.
10. **PB rule single-sourced.** EDM `PBContext` (E25) + experience §S3/§S5 (W1/W2) all say benchmark-block + Trials only; no exercise-level best cache introduced.
11. **CONTEXT.md terms intact.** grade/capability state/member line/family ring/slice/benchmark block/Grace weekend usage unchanged; no new avoided terms (no "difficulty scale," no "session-equivalent" as the concept).
12. **Fences untouched.** No edit weakened H1 (45-min), added a runtime LLM to the loop, introduced gender, altered COPPA sub-profile fields, or moved a numeric gate.
