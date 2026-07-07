# Engine Data Model v1

_Design doc — July 2026 (Fable session). The types and state machine everything else hangs off: what the planner emits, what the room mutates, what history remembers. Satisfies the planner-spec contract (`plan_session(roster, time_budget, history, library, seed) → Session`), instantiates workout-experience §3's hard rule — **one shared state machine; devices are projections** — and gives trials-and-challenges and skill-progressions their storage shape. Pure-TS domain per ADR-001 (zero Convex imports; library data files live in the same package per authoring-pipeline §5). Status: draft for founder review. ⚙ marks open modeling calls — each carries a recommendation, collected in §6._

---

## 0. Shape

Six layers, one dependency direction (down is upstream of up). The load-bearing split is **facts vs. derivations**: sessions record what happened; everything a family sees as "state" (Pact ring, pattern debt, PB tables, challenge unlocks) is a pure function over settled facts, never independently stored.

| Layer | Contents | Mutability |
|---|---|---|
| **Library** | Exercise, SwapChain, BlockDef, SkillPath, TrialsTest, ChallengeDef | founder-published, immutable per version (git is master; authoring-pipeline §5) |
| **Family** | Family, FamilyMember, capability, skill enrollment, absence ledger | slow state, parent-edited |
| **Planning** | SessionPlan | insert-only; deterministic; frozen at reveal |
| **Live** | SessionInstance phase machine, SessionEvents, ControllerBindings | display-authoritative in flight |
| **Settlement** | Settlement (volumes, PB mints, Pact credit), TrialsResult, ChallengeAttempt | server-authoritative, written exactly once |
| **Permanence** | RecordBookEntry, PPEntry | append-only, forever |

## 1. Domain types

`packages/domain` — pure TS, zero backend imports (ADR-001 reversibility hedge). Convex mirror in §2.

### 1.0 Primitives & vocabulary

```ts
type Id<K extends string> = string & { readonly __kind?: K };
export type FamilyId = Id<'family'>;      export type MemberId = Id<'member'>;
export type ExerciseId = Id<'exercise'>;  export type SwapChainId = Id<'chain'>;
export type BlockDefId = Id<'blockdef'>;  export type BlockId = Id<'block'>;       // plan-instance-unique
export type SlotId = Id<'slot'>;          export type SessionPlanId = Id<'plan'>;
export type SessionInstanceId = Id<'session'>; export type DeviceId = Id<'device'>;
export type SkillPathId = Id<'skillpath'>; export type TrialsTestId = Id<'trialstest'>;
export type ChallengeId = Id<'challenge'>; export type PPEntryId = Id<'pp'>;
export type BenchmarkKey = Id<'benchmark'>;
export type EpochMs = number;             export type ISODate = string;            // '2026-07-06'
export type RungIndex = number;           export type Difficulty = number;         // 0-100 shared scale ⚙M1

export type Pattern =                                        // H2 (⚙ granularity versions with library)
  | 'horizontal-push' | 'vertical-push' | 'horizontal-pull' | 'vertical-pull'
  | 'squat' | 'hinge' | 'core' | 'conditioning';
export type Equipment = 'none' | 'pullup-bar';               // H4 fence (purchases)
export type HouseholdSurface = 'wall' | 'chair' | 'stairs' | 'doorframe' | 'floor' | 'towel';
export type AgeBand = '6-7' | '8-10' | '11-13' | '14-17' | 'adult';   // derived from birthYear
export type GateTag =                                        // H6/H11 vocabulary; closed enum, versions with library
  | 'parent-present' | 'high-impact-plyo' | 'max-effort-spinal-flexion'
  | 'inversion' | 'straight-arm-isometric' | 'park-bar';
export type Tier = 'rookie' | 'trainee' | 'skilled' | 'advanced' | 'elite' | 'champion'; // legacy ladder, sacred
export type Score = { metric: 'reps' | 'hold-seconds' | 'elapsed-seconds'; value: number };
```

### 1.1 Exercise & swap chains

Chains are the unit of coverage (authoring-pipeline: H5 makes a lone exercise nearly useless). Every exercise sits on exactly one chain; laterals share a rung.

```ts
export interface Exercise {
  id: ExerciseId;
  name: string;                          // real community vocabulary (skills rule 2)
  pattern: Pattern;
  secondaryPatterns?: Pattern[];         // e.g. front-lever drills: core + vertical-pull; count in H2/H3
  metric: 'reps' | 'hold-seconds';
  equipment: Equipment;
  surfaces?: HouseholdSurface[];         // assumed, stated at presentation (skills rule 6)
  chain: { chainId: SwapChainId; rung: RungIndex };
  gates: GateTag[];                      // H6; interpreted against member age band + roster (adult present?)
  minAgeBand?: AgeBand;
  timeModel: { setupSeconds: number; secondsPerRep?: number };  // holds: work time = target seconds. ⚙H1 calib
  formCue: string;                       // one line, big-screen-legible
  safetyNote?: string;                   // Tier-1a canonical stop language referenced, never paraphrased
  skill?: { pathId: SkillPathId; rung: RungIndex };  // practice drills — normal pattern accounting, no parallel books
  status: 'published' | 'recalled';      // recall: planner never selects; history annotated, never rewritten
}

export interface SwapChain {
  id: SwapChainId;
  pattern: Pattern;
  rungs: ChainRung[];                    // ordered easiest → hardest; ordering is a named review-checklist item
}
export interface ChainRung {
  difficulty: Difficulty;                // shared scale ⚙M1; authoring-labeled, founder-reviewed
  exercises: ExerciseId[];               // [primary, ...lateral variants] — swap UI: easier / lateral / harder
}
```

### 1.2 Blocks & benchmark identity

`BlockDef` is the library template (chain-level slots); `PlannedBlock` (§1.5) is its roster-resolved instantiation. "Finisher" is a session *role*, "benchmark" a scheduling *identity* — neither is a structural kind.

```ts
export type BlockDef =
  | StraightSetsDef | SupersetDef | CircuitDef | AmrapDef | ForTimeDef | SkillStationsDef | TestDef;

interface BlockDefBase {
  id: BlockDefId;
  name: string;
  slots: Slot[];                          // chain-level; planner resolves per-member rungs (H5)
  gates: GateTag[];                       // block-level maturity tags (H6/H11)
  suitability: { rosterFeel: 'young' | 'mixed' | 'older'; durationBandMin: [number, number] }; // soft-obj 3
  benchmarkEligible: boolean;             // may be scheduled under H7
  status: 'published' | 'recalled';
}
export interface Slot {
  slotId: SlotId;
  chainId: SwapChainId;
  targetScheme: TargetScheme;             // how per-member targets derive ⚙ (planner calibration, H1/H9)
}
export type TargetScheme =
  | { kind: 'relative'; intensity: 'sub-max' | 'moderate' | 'max' }   // scaled off member capacity history
  | { kind: 'fixed'; target: number };                                 // warm-up staples

export interface StraightSetsDef  extends BlockDefBase { kind: 'straight-sets'; sets: number; restSeconds: number }
export interface SupersetDef      extends BlockDefBase { kind: 'superset'; rounds: number; restSeconds: number }
export interface CircuitDef       extends BlockDefBase { kind: 'circuit'; rounds: number; workSeconds?: number; stationRestSeconds: number }
export interface AmrapDef         extends BlockDefBase { kind: 'amrap'; capSeconds: number; scoring: 'per-member' | 'shared-pool' } // shared-pool = co-op grammar (Family 500)
export interface ForTimeDef       extends BlockDefBase { kind: 'for-time'; capSeconds: number }        // score: elapsed-seconds, less-is-better
export interface SkillStationsDef extends BlockDefBase { kind: 'skill-stations'; budgetSeconds: number } // H8; slots resolved from each member's active rung drills; skippable
export interface TestDef          extends BlockDefBase { kind: 'test'; testId: TrialsTestId }           // Trials only; judge grammar §3/§4
```

**Benchmark identity (I1, I2).** `benchmarkKey = stableHash(kind, scheme params, ordered slot (chainId, targetScheme))` — computed at publish. Structural identity **excludes** member rungs and member targets: the *block* is identical across appearances (H7's "structurally identical"); what a member does inside it depends on their rung. The member-facing comparison lineage is therefore `(benchmarkKey, memberId, rung)` — a member who swaps up between appearances **closes the old lineage and opens a new one** ("first score at the new level"), never compares across rungs ⚙M2. A recalled exercise retires its benchmarks: lineage preserved but closed; planner schedules a successor on the nearest chain neighbor (authoring-pipeline §4).

Block time estimation is a pure function, not stored data: `estimateBlock(def, assignments, library, calib)` where `calib` holds the ⚙H1 Phase-0 parameters (`transitionSeconds`, `logStripSecondsPerMember`, `spreadFactor` for slowest-member allowance in circuits).

### 1.3 Skill paths, Trials tests, Challenge defs

All three are **published-immutable standards** (I1): editing a standard mints a new version/lineage; it never mutates in place — comparability is the product promise.

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

export interface TrialsTest {
  id: TrialsTestId; name: string; metric: 'reps' | 'hold-seconds';
  tiers: Record<Tier, number>;            // universal thresholds, never age-adjusted
  formRule: string; safetyLine: string;
}

export interface ChallengeDef {
  id: ChallengeId; name: string;
  format: 'amrap' | 'for-time' | 'coop-pool';
  blockDefId: BlockDefId;                 // the fixed workout (comparability)
  tiers?: Record<Tier, number>;           // individual formats
  poolFormula?: { quotaByAgeBand: Record<AgeBand, number> };  // co-op: deterministic roster scaling ⚙M11
  safetyScreen: string;
}
```

### 1.4 Family & members

```ts
export interface Family {
  id: FamilyId;
  name: string;
  equipment: Equipment;                   // H4
  pact: { sessionsPerWeek: number };      // the ring target (default 3)
  experienceTier: number;                 // H9 density progression ⚙ thresholds
  timezone: string;                       // Pact week + Trials window boundaries
  trialsAnchor: { weekOfMonth: number };  // Trials-week scheduling ⚙
  absenceLedger: AbsenceEntry[];          // 5-second skip tags; recurring reason biases the planner (Reset Rep input)
}
export interface AbsenceEntry { at: ISODate; memberId?: MemberId; reason: 'busy' | 'tired' | 'sick' | 'away' | 'other' }

export interface FamilyMember {
  id: MemberId; familyId: FamilyId;
  nickname: string;                       // the only name — data minimization (PLAN Phase 0 boundary)
  birthYear: number;                      // ageBand derived; never displayed raw
  callSign?: string;                      // "Dad" / "Mom" / "Coach" — role label; no gender field anywhere
  color: string;                          // member color across all projections
  isAdult: boolean;                       // kids-only intensity cap + witness/proxy eligibility
  capability: Record<Pattern, PatternCapability>;
  skillPaths: SkillPathState[];           // ≤2 active ⚙ (skills doc)
  weeklyTarget?: number;                  // personal session-equivalents — non-sync-week gate (d) arithmetic;
}                                         //   the family ring target lives on Family.pact

export interface PatternCapability {      // ⚙M1 — the capability model
  level: Difficulty;                      // planning scalar: highest chain rung with difficulty ≤ level is reachable
  chainPointers?: Partial<Record<SwapChainId, RungIndex>>;  // sticky per-chain overrides, taught by accepted swaps
}                                         //   pointer wins over level where present; settlement updates pointers
```

### 1.5 SessionPlan — the planned

Deterministic planner output. **Frozen at reveal** (I6): actuals, swaps, and everything the room does live on the instance.

```ts
export interface SessionPlan {
  id: SessionPlanId; familyId: FamilyId;
  seed: string;                           // logged with every session (planner contract)
  libraryVersion: string;                 // git commit — replay of any historical session is free and exact
  inputsDigest: string;                   // hash(roster snapshot, budget, history cursor) — determinism audit
  generatedAt: EpochMs;
  source: 'pre-generated' | 'lobby';      // consistency armor: opening the app starts a workout
  kind: 'standard' | 'micro' | 'reset-rep' | 'trials' | 'challenge';
  roster: PlannedMember[];                // snapshot — plans outlive capability edits
  timeBudgetMin: number;                  // 15-45
  blocks: PlannedBlock[];                 // H9 grammar: warm-up → 2-4 work → optional finisher
  estimatedSeconds: number;               // H1: ≤ min(45, budget) incl. warm-up
  coach: { revealLine: string; closeTease: string };  // rendered at plan time (coach-voice selection is deterministic too)
}
export interface PlannedMember {
  memberId: MemberId; ageBand: AgeBand;
  capabilitySnapshot: Record<Pattern, Difficulty>;
}
export interface PlannedBlock {
  blockId: BlockId;                       // instance-unique — log keys, checkpoints, and slices reference it
  defId: BlockDefId; kind: BlockDef['kind'];
  role: 'warm-up' | 'work' | 'finisher' | 'skill';
  assignments: Record<MemberId, SlotAssignment[]>;   // H5: every present member covered, or the block was invalid
  benchmark?: {                            // H7 scheduling output — the ⚑ beat-last-time flags
    key: BenchmarkKey;
    perMember: Record<MemberId, { lineageRung: RungIndex; lastScore?: Score }>;
  };
  poolTarget?: number;                     // shared-pool AMRAP: deterministic roster formula output
  estimatedSeconds: number;
}
export interface SlotAssignment {
  slotId: SlotId;
  exerciseId: ExerciseId;                  // resolved from chain at member's rung — H4/H5/H6-checked (I10)
  rung: RungIndex;
  target: { kind: 'reps'; reps: number } | { kind: 'seconds'; seconds: number };  // per set
}
```

### 1.6 SessionInstance — the actual (and slices)

The instance is `plan + fold(events)` (§4). It exists for family sessions, solo sessions, and slices alike — one machine, three roster shapes.

```ts
export interface SessionInstance {
  id: SessionInstanceId; planId: SessionPlanId; familyId: FamilyId;
  kind: 'family' | 'solo' | 'slice';
  slice?: SliceRef;                        // present iff kind === 'slice'
  roster: MemberId[];                      // who actually joined; lobby overrides plan; late join ⚙M8
  startedAt?: EpochMs;
  phase: SessionPhase;                     // §3 — display-authoritative in flight
  authority: { deviceId: DeviceId; epoch: number };   // promotion increments epoch (I7)
  checkpoints: BlockCheckpoint[];          // one per settled block — abort + promotion recovery grain
  settlement?: Settlement;                 // §1.7 — written exactly once, server-side
}
export interface SliceRef {
  parentPlanId: SessionPlanId;
  memberId: MemberId;
  blockIds: BlockId[];                     // ⊆ parent plan blocks (I8) — the member's scaled portion
}
export interface BlockCheckpoint {
  blockId: BlockId; completedAt: EpochMs;
  logDigest: string;                       // hash of merged registers at block settle — audit + recovery
}
```

**Slice lifecycle.** Slice offers are *derived*, never authored: `sliceOffers(plan, settlements, now)` yields open `SliceRef`s for (a) a planned member the family session settled without, and (b) every member of a non-sync-week plan run fully sliced. Offers expire at Pact-week end ⚙M4 — a stale slice would inject a stale pattern mix into H2/H3 history. A slice runs the same machine with the lobby collapsed (auto-join, dial fixed to the slice estimate) — solo-member mode *is* the slice projection. At settlement, the slice's volumes date to **slice performance day** (not the parent's) for H2/H3 correctness; benchmark blocks inside a slice keep the parent's `benchmarkKey`, so a kid can beat-last-time solo on a Tuesday afternoon; under-⚙11 members can't mint PBs solo without a verified register (H11 — unchanged by slicing). Family Pact credit from slices: ⚙M3.

### 1.7 Settlement, PBs, permanence

```ts
export interface Settlement {              // computed by settle() — one pure function, two hosts (§2)
  settledAt: EpochMs;
  outcome: 'closed' | 'aborted';
  completedWorkBlocks: number; plannedWorkBlocks: number;   // abort halfway rule ⚙M6
  perMember: Record<MemberId, MemberSettlement>;
  pactCredit?: PactCredit;                 // derived then cached (I3)
  pbMints: PBRecord[];
  recordBookEntryIds: Id<'rb'>[];
  chainPointerUpdates: Array<{ memberId: MemberId; chainId: SwapChainId; rung: RungIndex }>; // swaps teach capability
  friction?: Record<MemberId, 'willing' | 'pushed' | 'refused'>;   // Gate 0→1(b), tagged at close
}
export interface MemberSettlement {
  patternVolumes: Partial<Record<Pattern, number>>;  // H2 accounting; abort: completed blocks full, in-flight ⚙ partial weight
  maxIntensityPatterns: Pattern[];                   // H3 48h ledger
  totals: { reps: number; workSeconds: number };
}

export type PBContext =
  | { kind: 'trials-test'; testId: TrialsTestId }                       // exercise-level, sacred, Trials-only
  | { kind: 'benchmark-block'; key: BenchmarkKey; rung: RungIndex };    // block-level lineage (§1.2)
export interface PBRecord {                // CACHE — recomputable from settlements (I3); PB Watch reads this
  memberId: MemberId; context: PBContext;
  score: Score;
  sessionInstanceId: SessionInstanceId; achievedAt: EpochMs;
  verified?: boolean;                      // H11: required truthy for under-⚙11 mints
}

export interface RecordBookEntry {         // append-only chalk line (I4)
  id: Id<'rb'>; familyId: FamilyId; at: EpochMs;
  kind: 'trials-pb' | 'benchmark-pb' | 'skill-unlock' | 'family-milestone' | 'challenge-result';
  memberId?: MemberId;                     // undefined = family-level milestone ("100th session")
  line: string;                            // rendered text, frozen at write — history annotated, never rewritten
  refs: { sessionInstanceId?: SessionInstanceId; witnessMemberId?: MemberId; ppEntryId?: PPEntryId };
}

export interface PPEntry {                 // Progress Points ledger — append-only (I4); totals = fold
  id: PPEntryId; familyId: FamilyId; memberId: MemberId;
  points: number;                          // ⚙M12 scaling tables land in the PP-tuning session
  source:
    | { kind: 'trials-pb'; testId: TrialsTestId; margin: number }
    | { kind: 'skill-unlock'; pathId: SkillPathId; rung: RungIndex }
    | { kind: 'correction'; reverses: PPEntryId };   // corrections compensate, never mutate
  mintedAt: EpochMs;
  effectiveAt: EpochMs;                    // v0 retro-mint: summer unlocks mint in Phase 1 with effectiveAt = unlock date
}
```

### 1.8 Pact, skills, Trials, Challenges

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
// Note an intended asymmetry inherited from the planner spec: a completed 12-min micro earns credit;
// a 20-minutes-elapsed abort short of halfway ⚙M6 earns none. Completion is the unit, not minutes. Flagged, not hidden.

export interface SkillPathState {
  pathId: SkillPathId; memberId: MemberId;
  enrolledAt: EpochMs;
  placementRung: RungIndex;                // test-in on enrollment — nobody grinds outgrown rungs
  rung: RungIndex;                         // pointer = highest passed + 1; advances ONLY via witnessed pass (I9)
  practiceLog: Array<{ at: ISODate; drill: ExerciseId; result: Score }>;  // best-per-rung derived → the gap meter
  testLog: SkillTestEntry[];
}
export interface SkillTestEntry {
  at: EpochMs; rung: RungIndex;
  declaredBy: MemberId;                    // member-declared, always; attempt-liberal (no cooldown ⚙)
  result: 'pass' | 'fail'; measured: Score;
  witnessMemberId: MemberId;               // a parent; the universal gate — self-reported unlocks would rot the ladder
  sessionInstanceId?: SessionInstanceId;
}

export interface TrialsCycle {
  id: Id<'trials'>; familyId: FamilyId; monthKey: string;      // '2026-09'
  windowStart: ISODate; graceUsed: boolean;                     // grace weekend → results flagged late, streak intact
  sessionInstanceIds: SessionInstanceId[];                      // split battery, ≤3 sessions in the week
  results: TrialsResult[];
  reportLine?: string;                                          // the coach-generated highlighted moment
}
export interface TrialsResult {
  testId: TrialsTestId; memberId: MemberId;
  score: Score; tier: Tier;
  judgeMemberId: MemberId;                 // the official counter — an 8-year-old's taps are dad's record ⚙M14
  isCalibration: boolean;                  // member's FIRST-ever Trials appearance: baseline, mints 0 PP (per member, not per family)
  ppEntryId?: PPEntryId;
}

// ChallengeState is derived (I3): earnedUnlocks = floor(qualifyingSettledSessions since last attempt / 6) ⚙M10.
export interface ChallengeAttempt {        // one attempt consumes one unlock; recorded at settlement
  id: Id<'attempt'>; challengeId: ChallengeId;
  sessionInstanceId: SessionInstanceId; rosterSnapshot: MemberId[];
  result:
    | { kind: 'individual'; perMember: Record<MemberId, { score: Score; tier: Tier }> }
    | { kind: 'coop'; poolTarget: number; completed: number; elapsedSeconds: number; capped: boolean };
}
```

### 1.9 The pure function surface

Every host calls these; no host reimplements them. This list is the unit-test surface.

```ts
planSession(roster, timeBudget, history, library, seed): SessionPlan        // the planner-spec contract
validate(plan, ctx): HViolation[]                       // H1-H11 incl. session-level H11 caps; [] = valid
eligible(member, exercise, roster, ctx): boolean        // THE gate predicate — plan-time AND swap-time (I10)
resolveAssignments(plan, memberId, fromBlockIx): SlotAssignment[]           // late join ⚙M8 / slice projection
reduce(plan, events: SessionEvent[]): LiveState         // the fold; commutative over facts (I5)
project(role, state, memberId?): Projection             // display | controller | log-strip | solo — devices are projections
settle(plan, instance, events, history): Settlement     // volumes, PB detection, Pact credit, mints — one function, two hosts
derivePactWeek(family, settled, weekStart): PactWeek
deriveUnlocks(settled, attempts): number
sliceOffers(plan, settlements, now): SliceRef[]
estimateSession(plan, calib): number
```

## 2. Convex mirror & server authority

Convex tables mirror the aggregates 1:1; the domain package never imports Convex, Convex functions are thin adapters that call §1.9 functions (Postgres-fallback benchmark in Phase 2 swaps the adapter, not the model).

| Convex table | Mirrors | Written by | Authority |
|---|---|---|---|
| `families`, `members` | §1.4 | parent device via mutation | server |
| `library_*` (exercises, chains, block_defs, skill_paths, trials_tests, challenge_defs) | §1.1-1.3 | publish deploy from git | **repo is master**; Convex serves, never authors |
| `session_plans` | SessionPlan | insert-only (planner runs on display client or server — pure, either host reproduces byte-identically) | plan immutable (I6) |
| `session_instances` | phase snapshot + epoch + checkpoints | display, epoch-guarded | **display in flight**; server validates epoch |
| `session_events` | LogWrite / Swap / SkillTest / Friction | any bound device, merge-upsert mutation | merge law (§4) |
| `controller_bindings` | §3.3 tokens | join mutation | server; **zero PII** — opaque ids only (COPPA posture, ADR-001 §4) |
| `settlements`, `trials_cycles`, `challenge_attempts` | §1.7-1.8 | `settleSession` mutation, exactly once | **server — sole writer of permanence** |
| `record_book`, `pp_ledger` | permanence | settlement appends | append-only (I4) |
| `pb_cache`, `pact_cache` | derived views | settlement refresh | derived (I3) — recompute must equal |

**Authority in one sentence each.** *Server* owns identity, library serving, epoch arbitration, and settlement plus everything downstream (PB mints, Record Book, PP, Pact cache). *Display* owns the in-flight phase machine and survives total internet loss — it runs `reduce`/`settle` locally, shows a provisional close (same pure functions ⇒ same result), and queues the settlement mutation for reconnect; the server's run is the authoritative one. *Controllers* own nothing — they emit facts.

## 3. The session lifecycle state machine

One machine; big screen, phone controller, log strip, and solo/slice phone are `project()` renderings of it (workout-experience §3, hard requirement). Phase transitions are **authority writes** (valid only from the current display epoch); logging/swaps are **facts** (valid from any bound device, any time, merged by §4).

```ts
export type SessionPhase =
  | { k: 'lobby'; joined: MemberId[]; dial: { minutes: number; setBy?: MemberId } }
  | { k: 'reveal' }
  | { k: 'block'; ix: number; sub: BlockSub }
  | { k: 'paused'; resume: { ix: number; sub: BlockSub }; since: EpochMs }
  | { k: 'closing'; step: 'totals' | 'pb-beats' | 'pact' | 'tease' }
  | { k: 'closed' }
  | { k: 'aborted' };

export type BlockSub =
  | { k: 'countdown'; endsAt: EpochMs }                       // "3-2-1" audio count-in
  | { k: 'work'; setIx: number; endsAt?: EpochMs }            // endsAt present iff timer-driven
  | { k: 'skill-test'; memberId: MemberId; rung: RungIndex }  // declared-test room-stop inside the skill block
  | { k: 'rest'; endsAt: EpochMs }
  | { k: 'log-grace'; endsAt: EpochMs };                      // set-based straggler floor ⚙M5
```

### 3.1 Transitions

| # | Event | From → To | Rule / guard | Emitter |
|---|---|---|---|---|
| T1 | OPEN | — → lobby | pre-generated plan already exists (consistency armor); Pact ring greets first | display |
| T2 | JOIN(m) / LEAVE(m) | lobby | tile lights; joining is the check-in — no separate roll call | phone or display tap |
| T3 | SET_DIAL(min) | lobby | last-write-wins with attribution; 15 ≤ min ≤ 45, 45 always the ceiling | any joined device |
| T4 | BUILD | lobby → reveal | display-only (communal trigger + audio unlock). Adopts the pre-generated plan iff (roster, dial) match its inputs, else replans (new seed, logged). **Plan freezes here** (I6) | display |
| T5 | START | reveal → block(0, countdown) | honest total time already shown | display |
| T6 | clock | countdown → work(0) | — | clock |
| T7 | clock | work → rest \| next | timer blocks auto-advance; the room trains to the screen's clock | clock |
| T8 | ALL_LOGGED ∨ floor | work → log-grace → rest | set-based blocks: advance when every present member's register is written, or floor expires ⚙M5; late writes accepted through the next rest | clock/facts |
| T9 | clock | rest → work(setIx+1) \| block(ix+1, countdown) \| closing | — | clock |
| T10 | LOG / SWAP | *(no transition)* | facts (§4); swap effective next set, renders silently with a glyph | bound devices |
| T11 | DECLARE_TEST(m) | block(skill).work → skill-test | top of skill block, member-declared; standard on screen, parent witnesses | member device |
| T12 | TEST_RESULT | skill-test → work | witnessed pass/fail + measure recorded (fact); pass queues the unlock beat for close | witness confirms on display |
| T13 | PAUSE / RESUME | block ↔ paused | display or an adult-bound controller ⚙M7; paused > 24h → auto-abort | display / adult |
| T14 | ABORT | any in-flight → aborted | display, confirmed; settles from checkpoints (§3.2) | display |
| T15 | BLOCK_SETTLE | on leaving block ix | checkpoint (blockId, logDigest) written; queued offline | display |
| T16 | close sequence | closing: totals → pb-beats → pact → tease → closed | display paces it (60-90s); PBs one at a time, each its own beat | display |
| T17 | PROMOTE(device) | any in-flight | server increments epoch; resumes from last snapshot + merged facts; stale-epoch transition writes rejected (I7); local-only unsynced display state lost at worst | any joined phone |

### 3.2 Abort & checkpoint semantics

Checkpoints land at every block settle (T15) — the planner spec's "save checkpoint at each completed block," made structural. On abort: completed blocks settle at full pattern weight; the in-flight block settles its written registers at ⚙ partial weight (planner calibration); **Pact credit iff `completedWorkBlocks ≥ ⌈plannedWorkBlocks / 2⌉`** ⚙M6 — block-count halfway, not elapsed-time (matches the checkpoint grain; clock-based rules are gameable by resting). An aborted session is a settled session: its volumes feed H2/H3, its friction tags still collect, and `sliceOffers` opens the missing members' portions.

### 3.3 Controller lifecycle (join / leave / death)

```ts
export interface ControllerBinding {       // session-scoped; zero PII — the COPPA posture is structural
  token: Id<'ctrl'>;                        // opaque, lives only in the phone tab
  deviceId: DeviceId;
  memberIds: MemberId[];                    // >1 = parent proxy multi-claim (log strip on the phone)
  boundAt: EpochMs; lastSeenAt: EpochMs;
}
```

QR/room-code join → binding created → tile lights. A member holds at most one *self* binding (a new self-claim revokes the old) plus any number of parent proxy claims. **Death is not an event** — staleness (`lastSeenAt` > ⚙M13 15s) flips the tile to display-logged; the log strip covers that member; rejoin re-binds. No mode switch, no restart: degradation is continuous because controllers were never load-bearing (experience tenet 3).

### 3.4 Display promotion

Any joined phone can promote (T17). The server is the arbiter: it increments `authority.epoch`, and every transition write carries the writer's epoch — stale writes bounce (I7). The promoted phone hydrates from the last server snapshot plus the merged fact log (facts are never epoch-guarded, so nothing logged is lost except the dead display's unsynced local state — the accepted worst case). The old display, if it returns, sees the newer epoch and demotes to a controller.

### 3.5 Slices in the machine

A slice instance enters at `reveal` (lobby collapsed, dial fixed), runs blocks `slice.blockIds` only, and closes with the personal-lens close (family beats — Pact ring movement — render if the slice settlement mints them). Settlement conservation is I8: a (member, blockId) pair settles at most once across the parent session and all its slices, so a member who trained Tuesday night can't re-run their slice for double pattern credit or a second PB window.

## 4. Event-sourced logging

The write model that hits the experience doc's budget: phone echo <100ms local, big screen <250ms p50 / <1s p95, nothing ever blocks on sync.

```ts
export type SessionEvent = LogWrite | SwapEvent | SkillTestEvent | FrictionEvent | TransitionEvent;

export interface LogWrite {
  key: string;                     // `${sessionId}/${blockId}/${slotId}/${memberId}/${setIx}` — cell identity
  value: number;                   // ABSOLUTE (reps done, seconds held, running pool total) — never a delta
  revision: number;                // per-key monotonic per writer
  writerDevice: DeviceId;
  writerMember?: MemberId;         // self, parent proxy, or Trials judge (the judge's taps are the record ⚙M14)
  verified?: boolean;              // "clean reps, parent-verified" — H11 under-⚙11 PB gate
  clientAt: EpochMs;
}
export interface SwapEvent {       // fact, member-scoped; options pre-filtered by eligible() (I10)
  memberId: MemberId; blockId: BlockId; slotId: SlotId;
  toExerciseId: ExerciseId; toRung: RungIndex; fromSetIx: number;
  writerDevice: DeviceId; clientAt: EpochMs;
}
```

**Merge law (I5).** Per key, keep the write with the greatest `(revision, clientAt, writerDevice)` lexicographic ⚙M9. The merge is idempotent, commutative, and associative — duplicated sends, out-of-order arrival, and full replays all converge to the same state. That is the entire reconciliation story; there is no conflict-resolution UI.

**Set-scoped, not append-only.** Rep sets: one register per set, prefilled with the target, one-tap confirm writes it. Timed holds: partner stopwatch or stepper writes seconds. AMRAP/co-op pools: chunk taps (+1/+5) mutate the phone's local running total; **the wire carries the absolute total** at `setIx 0` — a lost or repeated packet is harmless by construction. Edits re-write the same key at a higher revision; registers stay writable until settlement (the UI narrows sooner — "editable through the next rest" is choreography, not a data rule).

**Optimistic echo reconciliation.** Phone applies the write locally (echo), marks it pending, sends the mutation; the display's subscription re-render is the acknowledgment people actually watch (log → look up → number lands on the wall). The pending mark clears when the server acks a revision ≥ the phone's for that key. On reconnect after any gap, the phone re-flushes every key since its last ack — idempotence makes the flush mindless.

| Failure path | Behavior |
|---|---|
| Phone offline blip | writes queue locally, pending glyph; flush on reconnect; session never waits |
| Phone dies | ⚙M13 staleness flips tile to display-logged; log strip covers; rejoin re-binds |
| Display offline | display stays authoritative locally (timers, log strip, provisional close via the same pure `settle`); controllers degrade to display-logging; all queued writes flush on reconnect and the merge law reconciles both sides |
| Display dies | promotion (§3.4); facts survive, unsynced display-local state is the accepted loss |

## 5. Invariants (every one is a test)

| # | Invariant | Test sketch |
|---|---|---|
| I1 | **Published standards are immutable.** Library entries, block structures, `benchmarkKey`s, Trials tiers, skill rung standards never mutate — edits mint new versions/lineages; `benchmarkKey` is a pure hash of structure | hash stability across serialization round-trips; version-bump-on-edit property |
| I2 | **Benchmark lineage scoping.** PB comparison only within `(benchmarkKey, memberId, rung)`; a rung change closes the lineage; recalled exercises retire lineages (preserved, closed) | inject rung change / recall into synthetic history → no cross-lineage comparison ever surfaces |
| I3 | **Derived, never stored.** Pact ring, member slice counts, challenge unlocks, pattern debt, benchmark-due, PB caches: `recompute(pure fn, settled history) === cached value`, always | randomized histories; recompute-vs-cache equality after every settlement |
| I4 | **Append-only permanence.** Record Book and PP ledger never update or delete; corrections are compensating entries; family PP total = fold(ledger); appends happen only inside settlement, and settlement is idempotent (double-settle = one settlement) | replay settlement twice → identical permanence; mutation fuzzing rejects updates |
| I5 | **Log-write algebra.** Registers are absolute and set-scoped; merge is idempotent/commutative/associative — any subset duplication + any permutation of events reduces to identical totals | property test: shuffle + duplicate event logs → same `reduce` output |
| I6 | **Plan determinism & freeze.** Same (roster, budget, history, library version, seed) → byte-identical plan; nothing mutates a plan after reveal — actuals live on the instance | golden replay per pinned library version (authoring-pipeline §4); mutation attempt fails type/runtime |
| I7 | **Single authority.** Exactly one display epoch is live; phase transitions from stale epochs are rejected; facts are never epoch-guarded | concurrent promotion race → one winner, no lost facts |
| I8 | **Slice conservation.** `slice.blockIds ⊆ parent.blocks`; each (member, blockId) settles at most once across parent + slices; slice volumes date to performance day | double-settle a slice + parent overlap → second settle is a no-op with violation flag |
| I9 | **Witnessed permanence.** Skill rung pointer advances only via a witnessed passed test; under-⚙11 PB mints require a `verified` register; every unlock/PB mint has exactly one Record Book line | settlement over unwitnessed pass / unverified under-11 max → no mint |
| I10 | **One gate predicate.** Plan-time assignment and mid-session swap options run the identical `eligible()` (equipment, coverage, age gates, H11 session caps) — no swap can produce a session the planner would have refused | fuzz swaps over generated sessions → `validate()` stays clean |

## 6. ⚙ Open modeling calls (with recommendations)

| ⚙ | Call | Recommendation |
|---|---|---|
| M1 | Capability representation | Per-pattern scalar `level` on a shared 0-100 difficulty scale + sticky per-chain rung pointers taught by accepted swaps. Pointer wins where present; scalar places members on chains they've never touched. Pure per-chain-only rejected (new chains would have no placement); pure scalar rejected (real bodies aren't uniform within a pattern). |
| M2 | Benchmark lineage across a rung change | Close the old lineage, open a new one; coach frames it as "first score at the new level." Normalizing scores across rungs rejected — it fakes comparability, which is the one thing benchmarks exist to keep honest. |
| M3 | Slice → family Pact credit | Family session-equivalent mints when **all planned members'** slices of one parent plan settle within the Pact week; member slice counts are tracked independently for gate (d). Per-slice fractional family credit rejected (turns the ring into arithmetic nobody feels). |
| M4 | Slice offer expiry | End of the Pact week. Stale slices inject stale pattern mixes into H2/H3. |
| M5 | Set-based advance floor | `restSeconds + 10s` (experience open Q2); entries stay editable through the next rest. Tune in family session zero. |
| M6 | Abort "halfway" rule | Completed work blocks ≥ ⌈planned work blocks / 2⌉ — block-based matches checkpoint grain; time-based is gameable by resting. |
| M7 | Pause ownership | Display + any adult-bound controller; paused > 24h auto-aborts with checkpoint settlement. |
| M8 | Mid-session late join | Re-resolve remaining blocks for the joiner via `resolveAssignments` (pure, no replan); a block where H5 fails for them renders display-targets-only for that member. |
| M9 | Concurrent-writer tiebreak | `(revision, clientAt, writerDevice)` lexicographic — approximates latest human intent, fully deterministic. |
| M10 | Challenge-unlock qualifying sessions | Settled non-micro sessions only. Micro counts toward the Pact, not unlock pace — cadence-limiting max-effort events is the counter's entire job. |
| M11 | Co-op pool formula | Published age-band quota table v1 (trials doc open Q2); capacity-informed pooling deferred until Trials data exists to couple to. |
| M12 | PP scaling | Ledger stores the basis (margin / rung index); tables land in the PP-tuning session. v0 mints nothing and retro-mints via `effectiveAt` (skills doc cut list). |
| M13 | Controller staleness threshold | 15s without heartbeat flips the tile to display-logged. |
| M14 | Trials judge write discipline | The designated judge's device is the only accepted writer for a test block's performer register (one official counter — experience open Q1). |

**Reconciliations with existing docs, made explicit:** (1) trials-and-challenges says benchmark blocks recur "~every 2 weeks" while planner H7 says "every ⚙4-6 sessions per member" — this model keys cadence off H7 (sessions, not weeks); at 3 sessions/week they agree, at lower cadence H7 governs. (2) The Pact asymmetry noted in §1.8 (completed micro earns credit; a longer-elapsed sub-halfway abort earns none) follows the planner spec deliberately — completion, not minutes, is the unit — but the founder should see it stated once.
