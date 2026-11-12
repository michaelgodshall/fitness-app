// ============================================================================
// library.ts — a small but HONEST seed library (EXPLORATION SKETCH)
// ============================================================================
// 10 movement families (swap chains) across the full H2 pattern taxonomy, each
// 4-6 rungs; ~14 block templates across straight-sets / superset / circuit /
// AMRAP / for-time(finisher). Grades are integers per F31/F34 (difficultyGrade),
// with graduationVolume per exercise for AE §3 advancement.
//
// Real vocabulary only (skills rule 2). Numbers are illustrative, not
// founder-calibrated — see README "what's stubbed".
// ============================================================================

import type { Exercise, SwapChain, BlockDef, ChainRung } from "./types.js";
export { ALL_PATTERNS } from "./types.js";

// --- helpers ---------------------------------------------------------------

let _ex = 0;
function ex(
  name: string,
  pattern: Exercise["pattern"],
  metric: Exercise["metric"],
  chainId: string,
  grade: number,
  graduationVolume: number,
  opts: Partial<Exercise> = {},
): Exercise {
  return {
    id: `x${++_ex}-${chainId}-r${grade}`,
    name, pattern, metric, chainId,
    difficultyGrade: grade,
    graduationVolume,
    equipment: opts.equipment ?? "none",
    gates: opts.gates ?? [],
    minAgeBand: opts.minAgeBand,
    secondsPerRep: opts.secondsPerRep ?? (metric === "reps" ? 2.5 : 0),
    holdSeconds: opts.holdSeconds,
    setupSeconds: opts.setupSeconds ?? 5,
    formCue: opts.formCue ?? name,
  };
}

/** Build a chain from a flat exercise list (one exercise per rung here; the
 *  model supports laterals, we keep it single-primary for the sketch). */
function chain(id: string, pattern: SwapChain["pattern"], exercises: Exercise[]): { chain: SwapChain; exercises: Exercise[] } {
  const rungs: ChainRung[] = exercises.map((e, i) => ({
    rungIndex: i,
    difficultyGrade: e.difficultyGrade,
    exerciseIds: [e.id],
  }));
  return { chain: { id, pattern, rungs }, exercises };
}

// ============================================================================
// 10 SWAP CHAINS
// ============================================================================

const push = chain("ch-push", "horizontal-push", [
  ex("Wall Push-Up", "horizontal-push", "reps", "ch-push", 1, 15, { formCue: "Body straight, chest to wall." }),
  ex("Incline Push-Up", "horizontal-push", "reps", "ch-push", 2, 12, { formCue: "Hands on a sturdy chair, ribs down." }),
  ex("Knee Push-Up", "horizontal-push", "reps", "ch-push", 3, 12, { formCue: "Knees down, one line hips to head." }),
  ex("Full Push-Up", "horizontal-push", "reps", "ch-push", 4, 15, { formCue: "Elbows 45 degrees, full lockout." }),
  ex("Diamond Push-Up", "horizontal-push", "reps", "ch-push", 5, 12, { formCue: "Hands together, elbows tucked." }),
  ex("Archer Push-Up", "horizontal-push", "reps", "ch-push", 6, 8, { formCue: "Weight over one arm, other arm long." }),
]);

const pike = chain("ch-pike", "vertical-push", [
  ex("Plank Shoulder Tap", "vertical-push", "reps", "ch-pike", 1, 16, { formCue: "Hips still, tap opposite shoulder." }),
  ex("Pike Hold", "vertical-push", "hold-seconds", "ch-pike", 2, 30, { holdSeconds: 20, formCue: "Hips high, head between arms." }),
  ex("Pike Push-Up", "vertical-push", "reps", "ch-pike", 3, 12, { formCue: "Crown toward floor, press up." }),
  ex("Elevated Pike Push-Up", "vertical-push", "reps", "ch-pike", 4, 10, { formCue: "Feet on chair, more vertical." }),
  ex("Wall Handstand Hold", "vertical-push", "hold-seconds", "ch-pike", 5, 30, {
    holdSeconds: 20, gates: ["inversion", "parent-present"], minAgeBand: "8-10", formCue: "Belly to wall, tight body.",
  }),
]);

const row = chain("ch-row", "horizontal-pull", [
  ex("High Bar Row", "horizontal-pull", "reps", "ch-row", 1, 15, { equipment: "pullup-bar", formCue: "Bar chest-high, lean back slightly." }),
  ex("Incline Row", "horizontal-pull", "reps", "ch-row", 2, 12, { equipment: "pullup-bar", formCue: "More horizontal, pull chest to bar." }),
  ex("Horizontal Row", "horizontal-pull", "reps", "ch-row", 3, 12, { equipment: "pullup-bar", formCue: "Body flat, elbows drive back." }),
  ex("Feet-Elevated Row", "horizontal-pull", "reps", "ch-row", 4, 10, { equipment: "pullup-bar", formCue: "Feet on chair, full flat line." }),
  ex("Tuck Front Lever Row", "horizontal-pull", "reps", "ch-row", 5, 8, { equipment: "pullup-bar", formCue: "Knees tucked, pull hips to bar." }),
]);

const pull = chain("ch-pull", "vertical-pull", [
  ex("Dead Hang", "vertical-pull", "hold-seconds", "ch-pull", 1, 45, { equipment: "pullup-bar", holdSeconds: 20, formCue: "Full grip, shoulders active." }),
  ex("Scapular Pull", "vertical-pull", "reps", "ch-pull", 2, 12, { equipment: "pullup-bar", formCue: "Shrug down without bending elbows." }),
  ex("Assisted Pull-Up", "vertical-pull", "reps", "ch-pull", 3, 10, { equipment: "pullup-bar", formCue: "Toe on chair, drive with back." }),
  ex("Negative Pull-Up", "vertical-pull", "reps", "ch-pull", 4, 8, { equipment: "pullup-bar", formCue: "Jump up, lower slow to a count." }),
  ex("Full Pull-Up", "vertical-pull", "reps", "ch-pull", 5, 10, { equipment: "pullup-bar", formCue: "Chin over bar, no kip." }),
  ex("Tall-Bar Pull-Up", "vertical-pull", "reps", "ch-pull", 6, 8, {
    equipment: "pullup-bar", gates: ["park-bar"], formCue: "Full dead hang, full range on a high bar.",
  }),
]);

const squat = chain("ch-squat", "squat", [
  ex("Assisted Squat", "squat", "reps", "ch-squat", 1, 20, { formCue: "Hold a doorframe, sit back." }),
  ex("Box Squat", "squat", "reps", "ch-squat", 2, 18, { formCue: "Tap a chair, stand tall." }),
  ex("Bodyweight Squat", "squat", "reps", "ch-squat", 3, 20, { formCue: "Knees track toes, chest up." }),
  ex("Split Squat", "squat", "reps", "ch-squat", 4, 12, { formCue: "Long stance, back knee to floor." }),
  ex("Bulgarian Split Squat", "squat", "reps", "ch-squat", 5, 10, { formCue: "Rear foot on chair, drop straight." }),
  ex("Pistol Progression", "squat", "reps", "ch-squat", 6, 8, { formCue: "One leg, control to a box." }),
]);

const hinge = chain("ch-hinge", "hinge", [
  ex("Hip Hinge Drill", "hinge", "reps", "ch-hinge", 1, 20, { formCue: "Push hips back, flat back." }),
  ex("Glute Bridge", "hinge", "reps", "ch-hinge", 2, 20, { formCue: "Drive heels, squeeze at top." }),
  ex("Single-Leg Bridge", "hinge", "reps", "ch-hinge", 3, 12, { formCue: "One foot down, hips level." }),
  ex("Hamstring Walkout", "hinge", "reps", "ch-hinge", 4, 10, { formCue: "Bridge, walk feet out and back." }),
  ex("Nordic Negative", "hinge", "reps", "ch-hinge", 5, 6, { minAgeBand: "11-13", formCue: "Anchor feet, lower slow." }),
]);

const plank = chain("ch-plank", "core", [
  ex("Dead Bug", "core", "reps", "ch-plank", 1, 16, { formCue: "Low back pinned, opposite arm/leg." }),
  ex("Front Plank", "core", "hold-seconds", "ch-plank", 2, 45, { holdSeconds: 25, formCue: "Straight line, ribs down." }),
  ex("Hollow Hold", "core", "hold-seconds", "ch-plank", 3, 40, { holdSeconds: 25, formCue: "Low back glued, arms overhead." }),
  ex("Hollow Rock", "core", "reps", "ch-plank", 4, 20, { formCue: "Rock as one rigid piece." }),
  ex("Tuck L-Sit", "core", "hold-seconds", "ch-plank", 5, 30, { holdSeconds: 15, formCue: "Press down, knees to chest, hips up." }),
]);

const legRaise = chain("ch-legraise", "core", [
  ex("Bent-Knee Raise", "core", "reps", "ch-legraise", 2, 16, { formCue: "Knees up, no swing." }),
  ex("Lying Leg Raise", "core", "reps", "ch-legraise", 3, 15, { formCue: "Legs straight, low back down." }),
  ex("Reverse Crunch", "core", "reps", "ch-legraise", 4, 15, { formCue: "Hips off floor, controlled." }),
  ex("Toes-to-Sky", "core", "reps", "ch-legraise", 5, 12, {
    gates: ["max-effort-spinal-flexion"], formCue: "Hips press to ceiling.",
  }),
]);

const burpee = chain("ch-burpee", "conditioning", [
  ex("Marching in Place", "conditioning", "hold-seconds", "ch-burpee", 1, 60, { holdSeconds: 40, formCue: "Knees up, steady pace." }),
  ex("Step-Back Burpee", "conditioning", "reps", "ch-burpee", 2, 15, { formCue: "Step to plank, no jump." }),
  ex("Half Burpee", "conditioning", "reps", "ch-burpee", 3, 15, { formCue: "Plank, jump feet in, stand." }),
  ex("Full Burpee", "conditioning", "reps", "ch-burpee", 4, 12, {
    gates: ["high-impact-plyo"], formCue: "Chest to floor, jump at top.",
  }),
  ex("Burpee Tuck Jump", "conditioning", "reps", "ch-burpee", 5, 10, {
    gates: ["high-impact-plyo"], minAgeBand: "11-13", formCue: "Explode, knees to chest.",
  }),
]);

const locomotion = chain("ch-loco", "conditioning", [
  ex("Heel Taps", "conditioning", "hold-seconds", "ch-loco", 1, 40, { holdSeconds: 30, formCue: "Quick feet, light steps." }),
  ex("Jumping Jacks", "conditioning", "reps", "ch-loco", 2, 30, { formCue: "Full arms, soft landings." }),
  ex("Bear Crawl", "conditioning", "hold-seconds", "ch-loco", 3, 40, { holdSeconds: 25, formCue: "Knees hover, flat back." }),
  ex("Skater Hops", "conditioning", "reps", "ch-loco", 4, 20, {
    gates: ["high-impact-plyo"], formCue: "Side to side, stick each landing.",
  }),
  ex("Mountain Climber Sprint", "conditioning", "hold-seconds", "ch-loco", 5, 30, { holdSeconds: 25, formCue: "Fast knees, hips low." }),
]);

const chains = [push, pike, row, pull, squat, hinge, plank, legRaise, burpee, locomotion];

export const SWAP_CHAINS: SwapChain[] = chains.map((c) => c.chain);
export const EXERCISES: Exercise[] = chains.flatMap((c) => c.exercises);

export const EXERCISE_BY_ID: Record<string, Exercise> = Object.fromEntries(
  EXERCISES.map((e) => [e.id, e]),
);
export const CHAIN_BY_ID: Record<string, SwapChain> = Object.fromEntries(
  SWAP_CHAINS.map((c) => [c.id, c]),
);

// ============================================================================
// ~14 BLOCK TEMPLATES across the structural taxonomy
// ============================================================================

function slot(chainId: string, intensity: "sub-max" | "moderate" | "max"): { slotId: string; chainId: string; targetScheme: { kind: "relative"; intensity: "sub-max" | "moderate" | "max" } } {
  return { slotId: `s-${chainId}-${intensity}`, chainId, targetScheme: { kind: "relative", intensity } };
}

export const BLOCK_DEFS: BlockDef[] = [
  // --- warm-ups (circuits, fixed low intensity) ---------------------------
  {
    id: "b-ignition", name: "Ignition", kind: "circuit", defaultRole: "warm-up",
    slots: [slot("ch-loco", "sub-max"), slot("ch-squat", "sub-max"), slot("ch-plank", "sub-max")],
    gates: [], benchmarkEligible: false, rosterFeel: "mixed", durationBandMin: [3, 5],
    rounds: 2, stationRestSeconds: 10, workSeconds: 30,
  },
  {
    id: "b-jointprep", name: "Joint Prep", kind: "circuit", defaultRole: "warm-up",
    slots: [slot("ch-hinge", "sub-max"), slot("ch-loco", "sub-max"), slot("ch-push", "sub-max")],
    gates: [], benchmarkEligible: false, rosterFeel: "mixed", durationBandMin: [3, 5],
    rounds: 2, stationRestSeconds: 10, workSeconds: 30,
  },

  // --- straight sets (strength; benchmark-eligible) -----------------------
  {
    id: "b-push-strength", name: "Push Strength", kind: "straight-sets", defaultRole: "work",
    slots: [slot("ch-push", "moderate")],
    gates: [], benchmarkEligible: true, rosterFeel: "mixed", durationBandMin: [6, 10],
    sets: 4, restSeconds: 60,
  },
  {
    id: "b-pull-strength", name: "Pull Strength", kind: "straight-sets", defaultRole: "work",
    slots: [slot("ch-pull", "moderate")],
    gates: [], benchmarkEligible: true, rosterFeel: "older", durationBandMin: [6, 10],
    sets: 4, restSeconds: 75,
  },
  {
    id: "b-squat-strength", name: "Squat Strength", kind: "straight-sets", defaultRole: "work",
    slots: [slot("ch-squat", "moderate")],
    gates: [], benchmarkEligible: true, rosterFeel: "mixed", durationBandMin: [6, 10],
    sets: 4, restSeconds: 60,
  },

  // --- supersets ----------------------------------------------------------
  {
    id: "b-push-pull", name: "Push/Pull Superset", kind: "superset", defaultRole: "work",
    slots: [slot("ch-push", "moderate"), slot("ch-row", "moderate")],
    gates: [], benchmarkEligible: true, rosterFeel: "mixed", durationBandMin: [7, 11],
    rounds: 3, restSeconds: 45,
  },
  {
    id: "b-squat-hinge", name: "Squat/Hinge Superset", kind: "superset", defaultRole: "work",
    slots: [slot("ch-squat", "moderate"), slot("ch-hinge", "moderate")],
    gates: [], benchmarkEligible: true, rosterFeel: "mixed", durationBandMin: [7, 11],
    rounds: 3, restSeconds: 45,
  },
  {
    id: "b-pike-core", name: "Pike/Core Superset", kind: "superset", defaultRole: "work",
    slots: [slot("ch-pike", "moderate"), slot("ch-plank", "moderate")],
    gates: [], benchmarkEligible: false, rosterFeel: "older", durationBandMin: [7, 11],
    rounds: 3, restSeconds: 45,
  },

  // --- circuits (young-roster friendly) -----------------------------------
  {
    id: "b-fullbody-circuit", name: "Full-Body Circuit", kind: "circuit", defaultRole: "work",
    slots: [slot("ch-push", "moderate"), slot("ch-squat", "moderate"), slot("ch-row", "moderate"), slot("ch-plank", "moderate")],
    gates: [], benchmarkEligible: false, rosterFeel: "young", durationBandMin: [8, 12],
    rounds: 3, stationRestSeconds: 15, workSeconds: 30,
  },
  {
    id: "b-mixed-circuit", name: "Mixed Circuit", kind: "circuit", defaultRole: "work",
    slots: [slot("ch-hinge", "moderate"), slot("ch-pike", "moderate"), slot("ch-legraise", "moderate"), slot("ch-loco", "moderate")],
    gates: [], benchmarkEligible: false, rosterFeel: "young", durationBandMin: [8, 12],
    rounds: 3, stationRestSeconds: 15, workSeconds: 30,
  },

  // --- AMRAP (benchmark-eligible) -----------------------------------------
  {
    id: "b-amrap-ladder", name: "AMRAP Ladder", kind: "amrap", defaultRole: "work",
    slots: [slot("ch-squat", "moderate"), slot("ch-push", "moderate"), slot("ch-loco", "moderate")],
    gates: [], benchmarkEligible: true, rosterFeel: "mixed", durationBandMin: [6, 10],
    capSeconds: 420,
  },
  {
    id: "b-amrap-core", name: "Core AMRAP", kind: "amrap", defaultRole: "work",
    slots: [slot("ch-plank", "moderate"), slot("ch-legraise", "moderate")],
    gates: [], benchmarkEligible: true, rosterFeel: "mixed", durationBandMin: [5, 8],
    capSeconds: 300,
  },

  // --- for-time / finishers -----------------------------------------------
  {
    id: "b-burpee-finisher", name: "Burpee Burnout", kind: "for-time", defaultRole: "finisher",
    slots: [slot("ch-burpee", "max")],
    gates: [], benchmarkEligible: true, rosterFeel: "mixed", durationBandMin: [3, 5],
    capSeconds: 240,
  },
  {
    id: "b-condition-finisher", name: "Engine Finisher", kind: "amrap", defaultRole: "finisher",
    slots: [slot("ch-loco", "max"), slot("ch-squat", "max")],
    gates: [], benchmarkEligible: false, rosterFeel: "mixed", durationBandMin: [3, 5],
    capSeconds: 180,
  },
];

export const BLOCK_DEF_BY_ID: Record<string, BlockDef> = Object.fromEntries(
  BLOCK_DEFS.map((b) => [b.id, b]),
);
