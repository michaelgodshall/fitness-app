// ============================================================================
// planner.ts — the deterministic session planner (EXPLORATION SKETCH)
// ============================================================================
// Implements a meaningful subset of the H1-H11 hard constraints from
// session-planner-spec.md, using the AE (adaptive-engine.md) target formula and
// the F31 integer-grade capability model. Every function tags the H it serves.
//
// Contract (planner-spec): planSession(roster, timeBudget, history, seed) -> SessionPlan
// Same inputs + same seed => byte-identical plan (I6 determinism).
//
// H coverage in this sketch:  H1 (time cap), H2 (pattern balance vs 7d history),
//   H3 (light — no benchmark/max on a pattern maxed <48h), H4 (equipment),
//   H5 (roster coverage), H6 (age gates), H7 (light benchmark cadence),
//   H9 (session grammar warm-up->2-4 work->finisher), H10 (novelty),
//   plus AE per-member scaling. NOT implemented: full H8 skill weaving, full H11
//   session-level combination caps, H3 taper. See README.
// ============================================================================

import type {
  Family, Member, SessionPlan, PlannedBlock, SlotAssignment, History,
  Pattern, AgeBand, Exercise, SwapChain, BlockDef, GateTag,
} from "./types.js";
import {
  SWAP_CHAINS, EXERCISE_BY_ID, CHAIN_BY_ID, BLOCK_DEFS, BLOCK_DEF_BY_ID, ALL_PATTERNS,
} from "./library.js";

// --- Seeded PRNG (deterministic; I6) ---------------------------------------

function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}
function mulberry32(a: number): () => number {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/** Deterministic RNG from a string seed. */
export function rngFrom(seed: string): () => number {
  return mulberry32(xmur3(seed)());
}
function seededShuffle<T>(arr: T[], rand: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// --- Calibration constants (⚙ — all STUBBED, not founder-calibrated) --------

const CALIB = {
  warmupSeconds: 240,          // fixed warm-up allowance (H1: always counted)
  transitionSeconds: 20,       // between blocks
  revealCloseSeconds: 60,      // reveal + close overhead
  logStripSecondsPerSet: 3,    // per member per set logging overhead
  benchmarkEverN: 5,           // H7 cadence (4-6 window; pick 5)
  noveltyWindow: 20,           // H10 no exact repeat within N
  holdSecondsPerRepUnit: 3,    // stub: convert reps-canonical W -> hold seconds
};

// --- Age helpers (H6) -------------------------------------------------------

const AGE_ORDER: AgeBand[] = ["6-7", "8-10", "11-13", "14-17", "adult"];
export function ageBandFor(birthYear: number, currentYear = 2026): AgeBand {
  const age = currentYear - birthYear;
  if (age <= 7) return "6-7";
  if (age <= 10) return "8-10";
  if (age <= 13) return "11-13";
  if (age <= 17) return "14-17";
  return "adult";
}
function isUnder11(band: AgeBand): boolean {
  return band === "6-7" || band === "8-10";
}
function meetsMinAge(band: AgeBand, min?: AgeBand): boolean {
  if (!min) return true;
  return AGE_ORDER.indexOf(band) >= AGE_ORDER.indexOf(min);
}

// --- Planning context -------------------------------------------------------

interface Ctx {
  family: Family;
  roster: Member[];
  adultPresent: boolean;
  equipment: Set<string>;
}

/**
 * eligible() — THE gate predicate (I10). Runs identically at plan-time and would
 * run at swap-time. Enforces H4 (equipment), H6 (age gates + minAgeBand).
 */
export function eligible(ex: Exercise, member: Member, ctx: Ctx): boolean {
  const band = ageBandFor(member.birthYear);
  // H4 equipment
  if (!ctx.equipment.has(ex.equipment)) return false;
  // H6 minimum age band
  if (!meetsMinAge(band, ex.minAgeBand)) return false;
  // H6 / H11 gate tags
  for (const g of ex.gates) {
    if (g === "parent-present" && !ctx.adultPresent) return false;
    if (g === "high-impact-plyo" && isUnder11(band)) return false;
    if (g === "inversion" && isUnder11(band)) return false;
    if (g === "max-effort-spinal-flexion" && isUnder11(band)) return false;
    // "park-bar": treated as an outing flag, not a blocker (per CONTEXT.md)
  }
  return true;
}

/**
 * H5 roster coverage — resolve a reachable chain rung for one member. Picks the
 * hardest eligible rung at or below the member's grade; falls back to the
 * easiest eligible rung so everyone always gets something. null => H5 fail.
 */
export function resolveRung(
  chain: SwapChain, member: Member, ctx: Ctx,
): { rungIndex: number; exerciseId: string; grade: number } | null {
  const grade = member.capability[chain.pattern].grade;
  const usable = chain.rungs
    .map((r) => ({ r, ex: EXERCISE_BY_ID[r.exerciseIds[0]] }))
    .filter(({ ex }) => eligible(ex, member, ctx));
  if (usable.length === 0) return null; // H5: no reachable rung => block invalid
  const atOrBelow = usable.filter(({ r }) => r.difficultyGrade <= grade);
  const chosen = atOrBelow.length > 0
    ? atOrBelow.reduce((a, b) => (b.r.difficultyGrade > a.r.difficultyGrade ? b : a))
    : usable.reduce((a, b) => (b.r.difficultyGrade < a.r.difficultyGrade ? b : a));
  return { rungIndex: chosen.r.rungIndex, exerciseId: chosen.ex.id, grade: chosen.r.difficultyGrade };
}

/** A block is valid tonight iff every present member has a reachable rung in
 *  every slot (H5) — the coverage gate. */
function blockCovers(def: BlockDef, ctx: Ctx): boolean {
  return def.slots.every((s) =>
    ctx.roster.every((m) => resolveRung(CHAIN_BY_ID[s.chainId], m, ctx) !== null),
  );
}

// --- AE target formula (per-member scaling; F39 intensity mapping) ----------

const BLOCK_TYPE_FACTOR: Record<BlockDef["kind"], number> = {
  "straight-sets": 1.0, superset: 0.85, circuit: 0.75, amrap: 0.7, "for-time": 0.6,
};
const INTENSITY_FACTOR = { "sub-max": 0.7, moderate: 1.0, max: 1.1 } as const;

function betaBand(band: AgeBand): number {
  if (isUnder11(band)) return 0.9;      // under-11 sits at the low edge (AE §2.3)
  if (band === "adult") return 1.0;
  return 1.05;                          // teen
}
function positionFactor(workIndex: number): number {
  if (workIndex <= 0) return 1.0;
  if (workIndex === 1) return 0.95;
  return 0.85;
}
function freshnessFactor(state: Member["capability"][Pattern], today: number): number {
  if (state.lastTrainedDay == null) return 1.0;
  return today - state.lastTrainedDay > 10 ? 0.9 : 1.0; // AE §2.2 re-entry discount
}
const round5 = (x: number) => Math.max(5, Math.round(x / 5) * 5);
const roundReps = (x: number) => Math.max(1, Math.round(x));

/**
 * computeTarget — AE §2.2 formula. Per-member scaling: this is why the whole
 * family shares one block but each member sees their own number.
 */
export function computeTarget(
  member: Member, ex: Exercise, kind: BlockDef["kind"],
  intensity: "sub-max" | "moderate" | "max", workIndex: number, today: number,
): { kind: "reps"; reps: number } | { kind: "seconds"; seconds: number } {
  const band = ageBandFor(member.birthYear);
  const state = member.capability[ex.pattern];
  const base =
    state.W *
    BLOCK_TYPE_FACTOR[kind] *
    positionFactor(workIndex) *
    freshnessFactor(state, today) *
    betaBand(band) *
    INTENSITY_FACTOR[intensity];
  if (ex.metric === "hold-seconds") {
    return { kind: "seconds", seconds: round5(base * CALIB.holdSecondsPerRepUnit) };
  }
  return { kind: "reps", reps: roundReps(base) };
}

// --- Time estimation (H1) ---------------------------------------------------

type WAssign = SlotAssignment & { __memberId: string };

function workSecondsForSlot(assignments: WAssign[], ctx: Ctx): number {
  // The block waits for the slowest member (room trains to the screen clock).
  let maxSec = 0;
  for (const m of ctx.roster) {
    const a = assignments.find((x) => x.__memberId === m.id);
    if (!a) continue;
    const ex = EXERCISE_BY_ID[a.exerciseId];
    const sec = a.target.kind === "reps"
      ? a.target.reps * ex.secondsPerRep + ex.setupSeconds
      : a.target.seconds + ex.setupSeconds;
    maxSec = Math.max(maxSec, sec);
  }
  return maxSec;
}

/** estimateBlock — pure time model per structural kind (H1). */
function estimateBlock(def: BlockDef, perSlot: WAssign[][], ctx: Ctx, setsOverride: number): number {
  const members = ctx.roster.length;
  const slotWork = perSlot.map((sa) => workSecondsForSlot(sa, ctx));
  const logOverhead = (units: number) => units * members * CALIB.logStripSecondsPerSet;
  switch (def.kind) {
    case "straight-sets": {
      const sets = setsOverride;
      const w = slotWork[0];
      return sets * (w + (def.restSeconds ?? 45)) + logOverhead(sets);
    }
    case "superset": {
      const rounds = setsOverride;
      const perRound = slotWork.reduce((s, w) => s + w, 0) + (def.restSeconds ?? 45);
      return rounds * perRound + logOverhead(rounds);
    }
    case "circuit": {
      const rounds = setsOverride;
      const perRound = slotWork.reduce(
        (s, w) => s + Math.max(w, def.workSeconds ?? 0) + (def.stationRestSeconds ?? 15), 0,
      );
      return rounds * perRound + logOverhead(rounds);
    }
    case "amrap":
    case "for-time":
      return def.capSeconds ?? 300; // fixed cap dominates (worst case for H1 safety)
  }
}

// --- Assignment building ----------------------------------------------------

function buildAssignments(
  def: BlockDef, role: PlannedBlock["role"], workIndex: number, ctx: Ctx, today: number,
): { assignments: Record<string, SlotAssignment[]>; perSlot: WAssign[][]; setsByMember: Record<string, number> } {
  const assignments: Record<string, SlotAssignment[]> = {};
  const perSlot: WAssign[][] = def.slots.map(() => []);
  const baseSets = def.sets ?? def.rounds ?? 3;
  const setsByMember: Record<string, number> = {};

  for (const m of ctx.roster) {
    assignments[m.id] = [];
    const band = ageBandFor(m.birthYear);
    // F35 set-shaping: under-11 gets one fewer set for late/finisher blocks —
    // we cut SETS, never the per-set number on the wall.
    let sets = baseSets;
    if (isUnder11(band) && (role === "finisher" || workIndex >= 2)) {
      sets = Math.max(2, baseSets - 1);
    }
    setsByMember[m.id] = sets;

    def.slots.forEach((s, si) => {
      const chain = CHAIN_BY_ID[s.chainId];
      const resolved = resolveRung(chain, m, ctx)!; // H5 guaranteed by blockCovers()
      const ex = EXERCISE_BY_ID[resolved.exerciseId];
      const intensity = s.targetScheme.kind === "relative" ? s.targetScheme.intensity : "moderate";
      const target = s.targetScheme.kind === "fixed"
        ? ({ kind: "reps", reps: s.targetScheme.target } as const)
        : computeTarget(m, ex, def.kind, intensity, workIndex, today);
      const a: SlotAssignment = {
        slotId: s.slotId, exerciseId: ex.id, rung: resolved.rungIndex,
        grade: resolved.grade, target,
        setsOverride: sets !== baseSets ? sets : undefined,
      };
      assignments[m.id].push(a);
      perSlot[si].push({ ...a, __memberId: m.id });
    });
  }
  return { assignments, perSlot, setsByMember };
}

// --- H2 pattern-balance scoring ---------------------------------------------

/** Rolling 7-day pattern counts across the present roster's recent sessions. */
function patternDebt(history: History, today: number): Record<Pattern, number> {
  const counts = Object.fromEntries(ALL_PATTERNS.map((p) => [p, 0])) as Record<Pattern, number>;
  for (const s of history.sessions) {
    if (today - s.day > 7) continue;
    for (const p of s.patternsHit) counts[p]++;
  }
  return counts;
}
/** H3 light: patterns hit at MAX intensity within the last 48h. */
function recentlyMaxed(history: History, today: number): Set<Pattern> {
  const set = new Set<Pattern>();
  for (const s of history.sessions) {
    if (today - s.day <= 2) for (const p of s.maxIntensityPatterns) set.add(p);
  }
  return set;
}

function primaryPatternsOf(def: BlockDef): Pattern[] {
  return def.slots.map((s) => CHAIN_BY_ID[s.chainId].pattern);
}

// --- Coach voice (plain register, no emoji, no gamey copy) ------------------

const PATTERN_LABEL: Record<Pattern, string> = {
  "horizontal-push": "pushing", "vertical-push": "overhead press",
  "horizontal-pull": "rowing", "vertical-pull": "pulling",
  squat: "squats", hinge: "hinge work", core: "the midline", conditioning: "the engine",
};
function revealLine(focus: Pattern, benchmark: boolean): string {
  if (benchmark) return `Tonight has a benchmark. You have a number to beat.`;
  return `Tonight leans on ${PATTERN_LABEL[focus]}. Warm up, then get to work.`;
}
function closeTease(next: Pattern): string {
  return `Next time we come back to ${PATTERN_LABEL[next]}. Same time works.`;
}

// ============================================================================
// planSession — the contract entry point
// ============================================================================

export function planSession(
  family: Family, rosterIds: string[], timeBudgetMin: number, history: History, seed: string,
  today: number = history.sessions.length,   // calendar day index (H2 7-day / H3 48h)
): SessionPlan {
  const day = today;
  const rand = rngFrom(`${seed}|${day}|${rosterIds.join(",")}`);
  const roster = family.members.filter((m) => rosterIds.includes(m.id));
  const adultPresent = roster.some((m) => m.isAdult);
  const ctx: Ctx = {
    family, roster, adultPresent,
    equipment: family.equipment === "pullup-bar" ? new Set(["none", "pullup-bar"]) : new Set(["none"]),
  };
  const capMin = Math.min(45, timeBudgetMin);   // H1 ceiling (45 inviolable)
  const capSec = capMin * 60;
  const micro = timeBudgetMin < 15;             // micro-session mode

  const debt = patternDebt(history, day);
  const maxed = recentlyMaxed(history, day);    // H3
  const stalest = [...ALL_PATTERNS].sort((a, b) => debt[a] - debt[b] || a.localeCompare(b));
  const stalestRank = Object.fromEntries(stalest.map((p, i) => [p, ALL_PATTERNS.length - i]));

  const blocks: PlannedBlock[] = [];
  // warm-up time is counted via the warm-up block's own estimate (H1: always
  // included and counted); only reveal/close overhead is pre-charged here.
  let used = CALIB.revealCloseSeconds;
  let bid = 0;
  const mkId = () => `blk-${day}-${++bid}`;

  const addBlock = (def: BlockDef, role: PlannedBlock["role"], workIndex: number, benchmark: boolean): boolean => {
    const { assignments, perSlot, setsByMember } = buildAssignments(def, role, workIndex, ctx, day);
    const repSets = setsByMember[roster[0].id];
    const est = estimateBlock(def, perSlot, ctx, repSets) + CALIB.transitionSeconds;
    if (used + est > capSec) return false; // H1
    const pb: PlannedBlock = {
      blockId: mkId(), defId: def.id, kind: def.kind, role, assignments,
      estimatedSeconds: est,
    };
    if (benchmark) {
      const key = `bm-${def.id}`;
      pb.benchmark = {
        key,
        perMember: Object.fromEntries(roster.map((m) => {
          const last = lastBenchmarkScore(history, key, m.id);
          return [m.id, { lineageGrade: m.capability[primaryPatternsOf(def)[0]].grade, lastScore: last }];
        })),
      };
    }
    blocks.push(pb);
    used += est;
    return true;
  };

  // --- H9 grammar: warm-up first ---
  const warmups = BLOCK_DEFS.filter((d) => d.defaultRole === "warm-up" && blockCovers(d, ctx));
  const warm = seededShuffle(warmups, rand)[0];
  if (warm) addBlock(warm, "warm-up", 0, false);

  // --- candidate work blocks (H4/H5/H6 pre-filtered via blockCovers) ---
  let workCandidates = BLOCK_DEFS.filter((d) => d.defaultRole === "work" && blockCovers(d, ctx));
  // Kids-only intensity cap: no max-effort blocks without an adult present.
  if (!adultPresent) {
    workCandidates = workCandidates.filter((d) => d.kind !== "amrap" && d.kind !== "for-time");
  }
  // H2 scoring: prefer blocks that hit the stalest patterns; seeded tie-break.
  const scored = workCandidates.map((d) => ({
    d,
    score: primaryPatternsOf(d).reduce((s, p) => s + (stalestRank[p] ?? 0), 0),
    jitter: rand(),
  }));
  scored.sort((a, b) => b.score - a.score || a.jitter - b.jitter);

  // H7 benchmark cadence: due?
  const benchmarkDue = !micro && history.sessionsSinceBenchmark >= CALIB.benchmarkEverN;
  let benchmarkPlaced = false;

  const targetWorkBlocks = micro ? 1 : 3; // H9: 2-4 work blocks (aim 3)
  const usedPatterns = new Set<Pattern>();
  let workIx = 0;
  for (const { d } of scored) {
    if (workIx >= targetWorkBlocks) break;
    // encourage pattern diversity across the session (H2)
    const pats = primaryPatternsOf(d);
    const overlap = pats.filter((p) => usedPatterns.has(p)).length;
    if (overlap === pats.length && workIx > 0) continue; // fully redundant block
    // H3: don't put a benchmark or max block on a pattern maxed <48h
    const h3Block = pats.some((p) => maxed.has(p));
    let asBenchmark = false;
    if (benchmarkDue && !benchmarkPlaced && d.benchmarkEligible && !h3Block) {
      asBenchmark = true;
    }
    const ok = addBlock(d, "work", workIx, asBenchmark);
    if (ok) {
      workIx++;
      pats.forEach((p) => usedPatterns.add(p));
      if (asBenchmark) benchmarkPlaced = true;
    }
  }

  // --- optional finisher (H9) — only with budget and an adult present ---
  if (!micro && adultPresent) {
    const finishers = BLOCK_DEFS.filter((d) => d.defaultRole === "finisher" && blockCovers(d, ctx));
    for (const f of seededShuffle(finishers, rand)) {
      if (addBlock(f, "finisher", workIx, false)) break;
    }
  }

  // --- H10 novelty: signature over non-benchmark content ---
  const signature = sessionSignature(blocks, roster[0].id);
  const isRepeat = history.sessions
    .slice(-CALIB.noveltyWindow)
    .some((s) => s.signature === signature);
  // (One-shot: we record the signature; a full retry loop is noted in README.)

  const focus = stalest[0];
  const nextFocus = stalest[1] ?? stalest[0];
  const estimatedSeconds = used;
  const kind: SessionPlan["kind"] = micro ? "micro" : "standard";

  return {
    id: `plan-${family.id}-${day}`,
    familyId: family.id,
    seed, day, kind,
    roster: rosterIds,
    timeBudgetMin,
    blocks,
    estimatedSeconds,
    signature: isRepeat ? signature + "*repeat" : signature,
    coach: {
      revealLine: revealLine(focus, benchmarkPlaced),
      closeTease: closeTease(nextFocus),
    },
  };
}

// --- signature + history readers -------------------------------------------

/** H10: structural signature excluding benchmark blocks (they SHOULD recur). */
export function sessionSignature(blocks: PlannedBlock[], repMemberId: string): string {
  return blocks
    .filter((b) => !b.benchmark)
    .map((b) => {
      const exIds = (b.assignments[repMemberId] ?? []).map((a) => a.exerciseId).join("+");
      return `${b.defId}:${exIds}`;
    })
    .join("|");
}

function lastBenchmarkScore(history: History, key: string, memberId: string): number | undefined {
  // In this sketch, benchmark scores aren't stored in history records; the sim
  // seeds them via capability. Returns undefined (first appearance) — noted in README.
  void history; void key; void memberId;
  return undefined;
}

/** Patterns a plan touched — feeds H2 accounting when the session settles. */
export function patternsHitBy(plan: SessionPlan): Pattern[] {
  const set = new Set<Pattern>();
  for (const b of plan.blocks) {
    if (b.role === "warm-up") continue;
    for (const a of b.assignments[plan.roster[0]] ?? []) {
      set.add(EXERCISE_BY_ID[a.exerciseId].pattern);
    }
  }
  return [...set];
}

/** Max-intensity patterns for the H3 48h ledger (benchmark + finisher blocks). */
export function maxPatternsOf(plan: SessionPlan): Pattern[] {
  const set = new Set<Pattern>();
  for (const b of plan.blocks) {
    if (b.benchmark || b.role === "finisher") {
      for (const a of b.assignments[plan.roster[0]] ?? []) {
        set.add(EXERCISE_BY_ID[a.exerciseId].pattern);
      }
    }
  }
  return [...set];
}
