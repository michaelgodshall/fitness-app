// ============================================================================
// types.ts — faithful SUBSET of the engine data model (EXPLORATION SKETCH)
// ============================================================================
// Governing specs: docs/design/engine-data-model.md (EDM) + adaptive-engine.md (AE)
// + session-planner-spec.md. Where EDM and AE conflict, we follow the recorded
// arbitration rulings in docs/design/design-review-findings.md (F31-F40).
//
// KEY RULING APPLIED — F31 (Critical): AE's `CapabilityState` wins over EDM's
// `PatternCapability`. Capability is an INTEGER `grade` on a per-pattern ladder
// (NOT a 0-100 `Difficulty` scalar), plus a working-volume anchor `W`. So this
// file models capability the AE way. (EDM ⚙M1's 0-100 Difficulty is dropped.)
//
// Other rulings honored below: F35 (per-member sets/rounds override on the
// assignment, marked), F34 (Exercise carries difficultyGrade + graduationVolume).
// This is a de-risking sketch, not the real engine — see README.
// ============================================================================

// --- Vocabulary (CONTEXT.md is the ubiquitous language) ---------------------

/** H2 pattern taxonomy — the categories the planner balances across the week. */
export type Pattern =
  | "horizontal-push" | "vertical-push"
  | "horizontal-pull" | "vertical-pull"
  | "squat" | "hinge" | "core" | "conditioning";

export const ALL_PATTERNS: Pattern[] = [
  "horizontal-push", "vertical-push", "horizontal-pull", "vertical-pull",
  "squat", "hinge", "core", "conditioning",
];

/** H4 equipment fence — v1 is bodyweight-pure; a pull-up bar is the only add. */
export type Equipment = "none" | "pullup-bar";

/** Derived from birthYear, never stored raw / displayed raw (COPPA posture). */
export type AgeBand = "6-7" | "8-10" | "11-13" | "14-17" | "adult";

/** H6 maturity gates — closed enum, versions with the library. */
export type GateTag =
  | "parent-present" | "high-impact-plyo" | "max-effort-spinal-flexion"
  | "inversion" | "park-bar";

export type Metric = "reps" | "hold-seconds";

// --- Library layer (founder-published, immutable per version) ---------------

/**
 * Exercise. F34: carries `difficultyGrade` (integer, within its pattern) and
 * `graduationVolume` (W at which it "graduates" upward). These are the AE §9
 * library deltas folded in.
 */
export interface Exercise {
  id: string;
  name: string;                 // real community vocabulary (skills rule 2)
  pattern: Pattern;
  metric: Metric;
  equipment: Equipment;
  chainId: string;
  difficultyGrade: number;      // F34/F31: integer ladder position within pattern
  graduationVolume: number;     // AE §3 earned-advancement threshold on W
  gates: GateTag[];             // H6
  minAgeBand?: AgeBand;         // H6
  secondsPerRep: number;        // time model (H1) — for reps
  holdSeconds?: number;         // time model (H1) — for holds (fixed work time)
  setupSeconds: number;         // per-set transition into the movement
  formCue: string;              // one line, big-screen-legible
}

/** A movement family expressed as an ordered swap chain (easiest -> hardest). */
export interface SwapChain {
  id: string;
  pattern: Pattern;
  rungs: ChainRung[];           // ordered by difficultyGrade ascending
}
export interface ChainRung {
  rungIndex: number;
  difficultyGrade: number;      // the grade this rung sits at (H5 coverage key)
  exerciseIds: string[];        // [primary, ...laterals] — swap UI easier/lateral/harder
}

/**
 * BlockDef — library template. EDM defines finisher as a session ROLE, not a
 * structural kind (see FRICTION note in README). The task asked for finisher as
 * a structural type, so we model `kind` as the true structure and let a template
 * declare `defaultRole: "finisher"` when it is meant to close a session.
 */
export type BlockKind = "straight-sets" | "superset" | "circuit" | "amrap" | "for-time";
export type BlockRole = "warm-up" | "work" | "finisher" | "skill";

export interface Slot {
  slotId: string;
  chainId: string;
  /** F39: how per-member targets derive. `relative` maps to an AE intensity row;
   *  `fixed` bypasses the engine (warm-up staples). */
  targetScheme:
    | { kind: "relative"; intensity: "sub-max" | "moderate" | "max" }
    | { kind: "fixed"; target: number };
}

export interface BlockDef {
  id: string;
  name: string;
  kind: BlockKind;
  defaultRole: BlockRole;
  slots: Slot[];
  gates: GateTag[];                       // block-level maturity tags (H6/H11)
  benchmarkEligible: boolean;             // H7 — may be scheduled as a benchmark
  rosterFeel: "young" | "mixed" | "older"; // soft-objective 3
  durationBandMin: [number, number];      // advisory min/max minutes
  // structural params (only the relevant ones are read per kind):
  sets?: number;                          // straight-sets
  rounds?: number;                        // superset / circuit
  restSeconds?: number;                   // straight-sets / superset
  stationRestSeconds?: number;            // circuit
  workSeconds?: number;                   // circuit timed stations
  capSeconds?: number;                    // amrap / for-time
}

// --- Family layer -----------------------------------------------------------

/**
 * F31 CapabilityState — AE §1.1. One record per (member, pattern).
 * In the real engine this is an I3-derived FOLD over the session log; here we
 * carry it on the member and mutate it in the sim harness (README: STUBBED).
 */
export interface CapabilityState {
  grade: number;                          // ladder position within pattern
  W: number;                              // working volume: reps/seconds per set, straight-set, fresh
  confidence: "calibrating" | "established" | "stale";
  lastTrainedDay: number | null;          // day index; drives freshness_factor
}

export interface Member {
  id: string;
  nickname: string;                       // the only name (data minimization)
  birthYear: number;
  isAdult: boolean;                       // kids-only intensity cap + witness eligibility
  color: string;
  capability: Record<Pattern, CapabilityState>;
}

export interface Family {
  id: string;
  name: string;
  equipment: Equipment;                   // H4
  pactSessionsPerWeek: number;            // ring target (F32: member-line-primary in real engine)
  experienceTier: number;                 // H9 density progression (family-level)
  members: Member[];
}

// --- Planning layer (deterministic; frozen at reveal) -----------------------

export interface SlotAssignment {
  slotId: string;
  exerciseId: string;                     // resolved from chain at member's rung (H4/H5/H6)
  rung: number;
  grade: number;
  target: { kind: "reps"; reps: number } | { kind: "seconds"; seconds: number }; // per set
  /** F35 (High): per-member sets/rounds override — sets/rounds are per-member,
   *  NOT shared block state. Under-11 set-shaping cuts THIS, never the per-set
   *  number. Defaults to the def's value when undefined. */
  setsOverride?: number;
}

export interface PlannedBlock {
  blockId: string;                        // instance-unique
  defId: string;
  kind: BlockKind;
  role: BlockRole;
  assignments: Record<string, SlotAssignment[]>; // memberId -> per-slot (H5: everyone covered)
  benchmark?: {                           // H7 output — the beat-last-time flag
    key: string;
    perMember: Record<string, { lineageGrade: number; lastScore?: number }>;
  };
  estimatedSeconds: number;
}

export interface SessionPlan {
  id: string;
  familyId: string;
  seed: string;                           // logged with every session (planner contract)
  day: number;                            // sim day index
  kind: "standard" | "micro" | "reset-rep";
  roster: string[];                       // memberIds actually training
  timeBudgetMin: number;                  // 15-45
  blocks: PlannedBlock[];                 // warm-up -> 2-4 work -> optional finisher
  estimatedSeconds: number;              // H1: <= min(45, budget)*60
  signature: string;                      // H10 novelty key (benchmark-exempt content)
  coach: { revealLine: string; closeTease: string };
}

// --- History (planner input) ------------------------------------------------

/** One settled session's facts, per the H2/H3/H7/H10 planner inputs. */
export interface SessionRecord {
  day: number;
  roster: string[];
  patternsHit: Pattern[];                 // patterns the session touched (H2 accounting)
  maxIntensityPatterns: Pattern[];        // H3 48h ledger, per session
  signature: string;                      // H10 dedupe
  benchmarkKey?: string;                  // H7 cadence tracking
}

export interface History {
  sessions: SessionRecord[];              // most recent last
  sessionsSinceBenchmark: number;         // H7 cadence counter (family-level, simplified)
}
