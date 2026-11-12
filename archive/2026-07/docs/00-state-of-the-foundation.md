# State of the Foundation

_Capstone — written in the final minutes of the Fable session, 2026-07-06, by the instance that held the whole session. Read this first when you need the top-down view; `docs/04-build-orientation.md` is the tactical companion. This doc is a snapshot — it does not get edited, it gets superseded by a new one at each phase boundary._

---

## The strategic arc in one paragraph

A 2025 plan for a fixed-content father-son fitness app was re-visioned — driven by the founder's own 16 months of training data, which falsified the fixed-content model (exhaustion), the schedule-demanding model (consistency collapse), and the bodyweight-forever model (teen drift) — into an **AI-native family training coach**: deterministic session generation inside founder-validated constraints, adaptive per-member coaching logic, sacred fixed benchmarks, a competition arc for teens, delivered web-first on the big screen families actually train in front of, gated by numeric validation that starts with the founder's own family this summer. The plan survived a full research pass (3 swarms, ~540 agents), an 8-persona pre-mortem, a 30-finding design review, and 5 rounds of cross-model adversarial review (Codex: APPROVED).

## Confidence map — what to trust and how much

**Rock-solid (lived evidence + multi-pass review; build on these without hesitation):**
- The three failure modes and the product thesis that answers them (OBSERVED, 16 months)
- The 45-minute cap, bodyweight-pure v1, relative-loading scaling (OBSERVED)
- Gate discipline: numeric gates, cut lines, kill-switches (5× Codex-hardened)
- Engine architecture: deterministic planner + authoring-time LLM + no runtime LLM in the workout loop (converges from research, capacity math, and safety independently)

**Solid but calibration-dependent (right shape, founder's Phase 0 data sets the numbers):**
- Planner constraints H1-H11, adaptive-engine parameters (every ⚙), skill-rung standards, Pact credit rules
- The authoring pipeline's throughput math (review-hours vs. library-burn)

**Explicit hypotheses (believed, designed-for, but unproven — Phase 0/1 exists to test them):**
- Big-screen-primary + phones-as-controllers form factor (research found analogies, not proof — the A/B is free)
- Shared-session co-training demand beyond the founder's family (the market's populated-but-unclaimed white space reads both ways)
- Teen re-engagement via skills + stretch targets + authorship (the 14-year-old is subject zero)
- Improvement-based family scoring as fair league currency (validated before Phase 3 ships)

**Open (decided later, deliberately):**
- Permanent monetization model (sequenced: free beta → paid founding cohort → data decides)
- Name (verification sweep: Strongside / HomeTeam / Pact)
- Convex long-term (reversibility hedges written; Phase 2 gate re-checks)
- 18 founder questions (`design-review-findings.md` §Founder questions)

## The critical path (nothing else matters until these)

1. **Founder answers the skills placement questions** → calibrates rung spacing and priors
2. **Domain packages + planner + simulation harness** (sessions 2-3) → the engine exists
3. **Paper-session test** (week-2 kill-switch) → the cheapest possible falsification of the core bet
4. **Walking skeleton → family session zero** → the product meets the basement
5. **The gate**: 4 weeks, numbers written in advance, plus one deliberately broken week

Everything else — beta, pricing, competition, name — is downstream of the gate and should not steal hours from it.

## Top falsifiers (watch for these; each one changes the plan honestly)

1. Generated sessions bore the family on paper → the variety thesis is wrong; stop before UI
2. The teen ignores skills + stretch blocks → the retention arc needs rethinking before beta
3. Fall calendars break even the slice model → the sync-first form factor needs deeper revision
4. An incumbent ships shared family workouts (Phase 1 recon) → the wedge must sharpen
5. Founding cohort won't pay → mission continues (free/sponsored path), business thesis revises

## Why this won't feel ad-hoc from here

Today was wide because foundations are wide — research, design, and review had to happen in parallel to fit one Fable window. From tomorrow the shape is narrow and serial: **one session, one roadmap item, one commit**, gates deciding phase transitions, and two standing rituals — the review-loop re-run and competitor teardown at every phase boundary, and this doc superseded with a fresh confidence map each time a gate passes. The strategy is no longer in anyone's head or any single conversation; it is the repo. Any session that reads `docs/00` → `docs/04` → the roadmap's next item knows exactly what to do and — more importantly — what *not* to do.
