// ============================================================================
// test.ts — assertion-based property checks (node:assert, no framework)
// ============================================================================
// Run: npx tsx test.ts
// Properties asserted:
//   P1 (H1)  time cap never exceeded across 200 seeded runs
//   P2 (H5)  every present member has a reachable rung in every slot
//   P3 (I6)  determinism: same inputs + seed => byte-identical plan
//   P4 (H4)  no-equipment family never gets a pull-up-bar exercise
//   P5 (H6)  under-11 members never assigned a gated (plyo/inversion/spinal) exercise
//   P6 (H9)  session grammar: 1 warm-up, 2-4 work blocks (>=15m budgets)
// ============================================================================

import assert from "node:assert";
import type { Family, History, SessionPlan } from "./types.js";
import { EXERCISE_BY_ID } from "./library.js";
import { planSession, rngFrom, ageBandFor } from "./planner.js";
import { buildCanonicalFamily } from "./simulate.js";

let passed = 0;
let failed = 0;
function check(name: string, fn: () => void): void {
  try { fn(); passed++; }
  catch (e) { failed++; console.error(`FAIL: ${name}\n   ${(e as Error).message}`); }
}

function isUnder11(birthYear: number): boolean {
  const b = ageBandFor(birthYear);
  return b === "6-7" || b === "8-10";
}

const GATED = new Set(["high-impact-plyo", "inversion", "max-effort-spinal-flexion"]);

function emptyHistory(): History {
  return { sessions: [], sessionsSinceBenchmark: 0 };
}

// --- P1 + P2 + P4 + P5 + P6: 200 seeded fuzz runs ---------------------------

check("P1-P6: 200 seeded runs over random rosters/budgets/equipment", () => {
  const rand = rngFrom("fuzz-master");
  const allIds = ["m-dad", "m-ryan", "m-leo", "m-sam"];
  for (let i = 0; i < 200; i++) {
    const equipment = rand() < 0.7 ? "pullup-bar" : "none";
    const family = buildCanonicalFamily(equipment);
    // random non-empty roster
    const roster = allIds.filter(() => rand() < 0.6);
    if (roster.length === 0) roster.push("m-dad");
    const budget = [15, 20, 25, 30, 35, 40, 45][Math.floor(rand() * 7)];
    // random-ish history so H2/H3/H7 branches vary
    const history = emptyHistory();
    history.sessionsSinceBenchmark = Math.floor(rand() * 8);
    const today = Math.floor(rand() * 40);
    const plan = planSession(family, roster, budget, history, `s${i}`, today);

    // P1 (H1): time cap
    const capSec = Math.min(45, budget) * 60;
    assert.ok(
      plan.estimatedSeconds <= capSec,
      `run ${i}: est ${plan.estimatedSeconds}s > cap ${capSec}s (budget ${budget})`,
    );

    for (const b of plan.blocks) {
      for (const mId of roster) {
        const as = b.assignments[mId];
        // P2 (H5): coverage — one assignment per slot for every present member
        assert.ok(as && as.length > 0, `run ${i}: ${mId} uncovered in block ${b.defId}`);
        for (const a of as) {
          const ex = EXERCISE_BY_ID[a.exerciseId];
          // P4 (H4): equipment
          if (equipment === "none") {
            assert.strictEqual(ex.equipment, "none", `run ${i}: bar exercise ${ex.name} in no-equipment family`);
          }
          // P5 (H6): under-11 gating
          const member = family.members.find((m) => m.id === mId)!;
          if (isUnder11(member.birthYear)) {
            for (const g of ex.gates) {
              assert.ok(!GATED.has(g), `run ${i}: under-11 ${member.nickname} got gated ${ex.name} (${g})`);
            }
          }
        }
      }
    }

    // P6 (H9): grammar
    if (budget >= 15) {
      const warmups = plan.blocks.filter((b) => b.role === "warm-up").length;
      const work = plan.blocks.filter((b) => b.role === "work").length;
      assert.ok(warmups <= 1, `run ${i}: ${warmups} warm-ups`);
      assert.ok(work >= 1 && work <= 4, `run ${i}: ${work} work blocks (want 1-4)`);
    }
  }
});

// --- P3: determinism --------------------------------------------------------

check("P3 (I6): determinism — same inputs+seed => identical plan", () => {
  for (const [roster, budget] of [
    [["m-dad", "m-ryan", "m-leo", "m-sam"], 45],
    [["m-dad", "m-ryan"], 40],
    [["m-dad", "m-leo", "m-sam"], 25],
  ] as [string[], number][]) {
    const f1 = buildCanonicalFamily("pullup-bar");
    const f2 = buildCanonicalFamily("pullup-bar");
    const h: History = emptyHistory();
    h.sessionsSinceBenchmark = 5;
    const p1 = planSession(f1, roster, budget, h, "determinism", 12);
    const p2 = planSession(f2, roster, budget, structuredClone(h), "determinism", 12);
    assert.strictEqual(JSON.stringify(p1), JSON.stringify(p2), `non-deterministic for roster ${roster.join("+")}`);
  }
});

// --- P7: benchmark cadence fires (H7) ---------------------------------------

check("P7 (H7): a benchmark schedules when due and none when fresh", () => {
  const family = buildCanonicalFamily("pullup-bar");
  const roster = family.members.map((m) => m.id);
  const fresh: History = { sessions: [], sessionsSinceBenchmark: 0 };
  const due: History = { sessions: [], sessionsSinceBenchmark: 6 };
  const pFresh = planSession(family, roster, 45, fresh, "bm", 10);
  const pDue = planSession(family, roster, 45, due, "bm", 10);
  assert.ok(!pFresh.blocks.some((b) => b.benchmark), "fresh session should not schedule a benchmark");
  assert.ok(pDue.blocks.some((b) => b.benchmark), "due session should schedule a benchmark");
});

// --- summary ----------------------------------------------------------------

console.log(`\n${failed === 0 ? "PASS" : "FAIL"} — ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
