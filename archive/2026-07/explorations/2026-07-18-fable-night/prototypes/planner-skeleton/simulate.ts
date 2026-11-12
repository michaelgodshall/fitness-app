// ============================================================================
// simulate.ts — 8-week longitudinal harness (EXPLORATION SKETCH)
// ============================================================================
// The seed of the simulation harness the roadmap requires (planner-spec
// "Testability" §3). Runs 8 weeks x 3 family shapes, prints each session
// compactly, then a drift/repeat/utilization/adherence report.
//
// Capability progression here is a STUB (`settleSession`) — the real engine
// folds capability from the event log (AE §1.1, F31). This just nudges W/grade
// so benchmarks improve and the sim exercises grade variety. See README.
// ============================================================================

import type { Family, Member, History, SessionPlan, Pattern, CapabilityState, AgeBand } from "./types.js";
import { ALL_PATTERNS, EXERCISES } from "./library.js";
import { EXERCISE_BY_ID } from "./library.js";
import { planSession, ageBandFor, patternsHitBy, maxPatternsOf } from "./planner.js";

// --- Canonical placeholder family (doc-canon) -------------------------------
// Dad (42), Ryan (14), Leo (10), Sam (8).

function initCapability(band: AgeBand): Record<Pattern, CapabilityState> {
  const byBand: Record<AgeBand, { grade: number; W: number }> = {
    "6-7": { grade: 1, W: 6 },
    "8-10": { grade: 2, W: 9 },
    "11-13": { grade: 3, W: 11 },
    "14-17": { grade: 3, W: 13 },
    adult: { grade: 4, W: 16 },
  };
  const base = byBand[band];
  const cap = {} as Record<Pattern, CapabilityState>;
  for (const p of ALL_PATTERNS) {
    // pulls start a touch lower than pushes (realistic)
    const dip = p === "vertical-pull" || p === "horizontal-pull" ? 1 : 0;
    cap[p] = {
      grade: Math.max(1, base.grade - dip),
      W: Math.max(4, base.W - dip * 3),
      confidence: "calibrating",
      lastTrainedDay: null,
    };
  }
  return cap;
}

function member(id: string, nickname: string, birthYear: number, isAdult: boolean, color: string): Member {
  return { id, nickname, birthYear, isAdult, color, capability: initCapability(ageBandFor(birthYear)) };
}

export function buildCanonicalFamily(equipment: Family["equipment"] = "pullup-bar"): Family {
  return {
    id: "fam-godshall",
    name: "The Family",
    equipment,
    pactSessionsPerWeek: 3,
    experienceTier: 1,
    members: [
      member("m-dad", "Dad", 1984, true, "#2b6cb0"),
      member("m-ryan", "Ryan", 2012, false, "#dd6b20"),
      member("m-leo", "Leo", 2016, false, "#38a169"),
      member("m-sam", "Sam", 2018, false, "#805ad5"),
    ],
  };
}

// --- Progression stub (folded capability, faked) ----------------------------

const GROWTH: Record<AgeBand, number> = {
  "6-7": 0.05, "8-10": 0.045, "11-13": 0.035, "14-17": 0.03, adult: 0.015,
};
const MAX_GRADE = 6;

/** settleSession — STUB capability update + history append. */
function settleSession(family: Family, plan: SessionPlan, today: number, history: History): void {
  const hit = new Set(patternsHitBy(plan));
  for (const m of family.members) {
    if (!plan.roster.includes(m.id)) continue;
    const band = ageBandFor(m.birthYear);
    for (const p of hit) {
      const st = m.capability[p];
      st.W = st.W * (1 + GROWTH[band]);
      st.lastTrainedDay = today;
      // moving up a rung: W crosses a threshold -> grade++, W re-seeds (carryover ~0.5)
      if (st.W >= 18 && st.grade < MAX_GRADE) {
        st.grade += 1;
        st.W = Math.max(8, Math.round(st.W * 0.5));
      }
      st.confidence = "established";
    }
  }
  const benchmarkPlaced = plan.blocks.some((b) => b.benchmark);
  history.sessions.push({
    day: today,
    roster: plan.roster,
    patternsHit: [...hit],
    maxIntensityPatterns: maxPatternsOf(plan),
    signature: plan.signature.replace("*repeat", ""),
    benchmarkKey: plan.blocks.find((b) => b.benchmark)?.benchmark?.key,
  });
  history.sessionsSinceBenchmark = benchmarkPlaced ? 0 : history.sessionsSinceBenchmark + 1;
}

// --- Compact plan printing --------------------------------------------------

function fmtMin(sec: number): string {
  return `${Math.round(sec / 60)}m`;
}
function fmtTarget(a: { target: { kind: "reps"; reps: number } | { kind: "seconds"; seconds: number } }): string {
  return a.target.kind === "reps" ? `${a.target.reps}r` : `${a.target.seconds}s`;
}
function formatPlan(plan: SessionPlan, family: Family, label: string): string {
  const cap = Math.min(45, plan.timeBudgetMin);
  const over = plan.estimatedSeconds > cap * 60 ? "  !!OVER-CAP" : "";
  const head = `${label}  budget ${plan.timeBudgetMin}m  est ${fmtMin(plan.estimatedSeconds)}${over}`;
  const lines: string[] = [head];
  for (const b of plan.blocks) {
    const bm = b.benchmark ? " [BENCHMARK]" : "";
    const roleTag = b.role === "warm-up" ? "warm" : b.role === "finisher" ? "fin " : "work";
    // show the youngest present member's first-slot target to illustrate scaling
    const youngest = family.members
      .filter((m) => plan.roster.includes(m.id))
      .sort((a, z) => z.birthYear - a.birthYear)[0];
    const ya = b.assignments[youngest.id]?.[0];
    const yEx = ya ? EXERCISE_BY_ID[ya.exerciseId] : undefined;
    const scaled = ya && yEx ? `  ${youngest.nickname}: ${yEx.name} ${fmtTarget(ya)}${ya.setsOverride ? ` x${ya.setsOverride}` : ""}` : "";
    lines.push(`   ${roleTag} ${b.defId.replace("b-", "").padEnd(18)} ${fmtMin(b.estimatedSeconds)}${bm}${scaled}`);
  }
  lines.push(`   coach> ${plan.coach.revealLine}`);
  return lines.join("\n");
}

// --- Scenario runner --------------------------------------------------------

interface Scenario {
  name: string;
  rosterIds: (fam: Family) => string[];
  budget: number;
  equipment: Family["equipment"];
}

const WEEK_DAYS = [0, 2, 4]; // Mon/Wed/Fri within a week

interface Metrics {
  sessions: number;
  overCap: number;
  estRatios: number[];
  signatures: string[];
  repeats: number;
  maxRolling7Spread: number;
  gradeUse: Record<string, Record<Pattern, Set<number>>>;
}

function runScenario(sc: Scenario, seed: string): { lines: string[]; metrics: Metrics } {
  const family = buildCanonicalFamily(sc.equipment);
  const history: History = { sessions: [], sessionsSinceBenchmark: 0 };
  const lines: string[] = [];
  const metrics: Metrics = {
    sessions: 0, overCap: 0, estRatios: [], signatures: [], repeats: 0,
    maxRolling7Spread: 0,
    gradeUse: Object.fromEntries(family.members.map((m) => [m.id,
      Object.fromEntries(ALL_PATTERNS.map((p) => [p, new Set<number>()])) as Record<Pattern, Set<number>>,
    ])),
  };

  for (let week = 0; week < 8; week++) {
    for (let s = 0; s < WEEK_DAYS.length; s++) {
      const today = week * 7 + WEEK_DAYS[s];
      const rosterIds = sc.rosterIds(family);
      const plan = planSession(family, rosterIds, sc.budget, history, seed, today);

      // metrics
      metrics.sessions++;
      const capSec = Math.min(45, sc.budget) * 60;
      if (plan.estimatedSeconds > capSec) metrics.overCap++;
      metrics.estRatios.push(plan.estimatedSeconds / capSec);
      const cleanSig = plan.signature.replace("*repeat", "");
      if (metrics.signatures.slice(-20).includes(cleanSig)) metrics.repeats++;
      metrics.signatures.push(cleanSig);
      for (const b of plan.blocks) {
        for (const mId of rosterIds) {
          for (const a of b.assignments[mId] ?? []) {
            const pat = EXERCISE_BY_ID[a.exerciseId].pattern;
            metrics.gradeUse[mId][pat].add(a.grade);
          }
        }
      }

      lines.push(formatPlan(plan, family, `W${week + 1}D${s + 1}`));
      settleSession(family, plan, today, history);

      // rolling-7d pattern spread (H2 target: <=2)
      const counts = Object.fromEntries(ALL_PATTERNS.map((p) => [p, 0])) as Record<Pattern, number>;
      for (const rec of history.sessions) {
        if (today - rec.day > 7) continue;
        for (const p of rec.patternsHit) counts[p]++;
      }
      const vals = ALL_PATTERNS.map((p) => counts[p]);
      metrics.maxRolling7Spread = Math.max(metrics.maxRolling7Spread, Math.max(...vals) - Math.min(...vals));
    }
  }
  return { lines, metrics };
}

// --- Report -----------------------------------------------------------------

function reportScenario(sc: Scenario, m: Metrics, family: Family): string {
  const avgRatio = m.estRatios.reduce((a, b) => a + b, 0) / m.estRatios.length;
  const minRatio = Math.min(...m.estRatios);
  const uniqueSigs = new Set(m.signatures).size;
  const out: string[] = [];
  out.push(`--- REPORT: ${sc.name} ---`);
  out.push(`sessions: ${m.sessions}   over-cap: ${m.overCap}   (H1)`);
  out.push(`time adherence: avg ${(avgRatio * 100).toFixed(0)}% of cap, min ${(minRatio * 100).toFixed(0)}%   (soft-obj 4)`);
  out.push(`novelty: ${uniqueSigs}/${m.sessions} unique signatures, ${m.repeats} in-window repeats   (H10)`);
  out.push(`pattern balance: max rolling-7d spread ${m.maxRolling7Spread}   (H2 target <=2)`);
  out.push(`rung utilization by member (grades touched per pattern):`);
  for (const mem of family.members) {
    const use = m.gradeUse[mem.id];
    const touched = ALL_PATTERNS.filter((p) => use[p].size > 0);
    if (touched.length === 0) continue;
    const summary = touched
      .map((p) => `${p.split("-").map((w) => w[0]).join("")}:${[...use[p]].sort((a, b) => a - b).join(",")}`)
      .join("  ");
    out.push(`   ${mem.nickname.padEnd(5)} ${summary}`);
  }
  return out.join("\n");
}

// --- Main -------------------------------------------------------------------

const SCENARIOS: Scenario[] = [
  { name: "Full family (Dad+Ryan+Leo+Sam, 45m)", rosterIds: (f) => f.members.map((x) => x.id), budget: 45, equipment: "pullup-bar" },
  { name: "Dad + Ryan (45m)", rosterIds: (f) => ["m-dad", "m-ryan"], budget: 45, equipment: "pullup-bar" },
  { name: "Full family short night (25m)", rosterIds: (f) => f.members.map((x) => x.id), budget: 25, equipment: "pullup-bar" },
];

export function runAll(): string {
  const out: string[] = [];
  out.push("# Planner Skeleton — 8-Week Simulation Output\n");
  out.push("_EXPLORATION SKETCH (2026-07-18 fable-night). Deterministic seed per scenario._\n");
  for (const sc of SCENARIOS) {
    const seed = `seed-${sc.name}`;
    const { lines, metrics } = runScenario(sc, seed);
    out.push(`\n## ${sc.name}\n`);
    out.push("```");
    out.push(...lines);
    out.push("```");
    out.push("\n```");
    out.push(reportScenario(sc, metrics, buildCanonicalFamily(sc.equipment)));
    out.push("```");
  }
  return out.join("\n");
}

// run when invoked directly (not when imported by test.ts)
if (process.argv[1] && /simulate\.ts$/.test(process.argv[1])) {
  console.log(runAll());
}
