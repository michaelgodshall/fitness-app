# Decision Log

_The single ledger of every product decision, retro-built 2026-07-16 from the 2026-07-06 foundation session (this is the ledger a grill-with-docs flow would have maintained inline; kept current from now on). Statuses: **RATIFIED** (founder-approved, in force) · **RULED** (debate-judged recommendation awaiting founder ✅ in docs/design/founder-decision-briefs.md) · **PENDING** (awaiting founder input) · **RESEARCH-GATED** (decision scheduled, evidence named). Full ADRs exist only where a decision is hard to reverse, surprising without context, AND a real trade-off — everything else lives here._

| # | Decision | Status | Where documented |
|---|---|---|---|
| D1 | Product = AI-native family coach + phase-2 competition arc (Vision A+C) | RATIFIED | docs/01, PLAN.md §Goal |
| D2 | Bodyweight-pure v1 (pull-up bar in); weights = Phase 3 arc | RATIFIED | docs/01, PLAN §Key decisions |
| D3 | Father-son wedge in brand/distribution; parent-child-generic product schema, no gender in data model | RATIFIED | docs/02 §Brand |
| D4 | 8-10 protected founder-hrs/week; milestone-gated roadmap (one ★ calendar exception: family on engine before summer ends) | RATIFIED | docs/03 §Operating model |
| D5 | Engine: deterministic planner + authoring-time LLM + tiered voice; no runtime LLM in the workout loop; runtime generation = Phase 3 upgrade | RATIFIED | **ADR-002** |
| D6 | Platform: web-first, one app = big-screen display + phone controllers; Convex + Clerk; big-screen-authoritative sync; Expo native Phase 2; domain logic in pure-TS packages | RATIFIED | **ADR-001** |
| D7 | Parent-only accounts; no-PII child sub-profiles; session-scoped controller identity; no analytics on child surfaces | RATIFIED | **ADR-003** |
| D8 | Async slice-completion is a Phase 0/1 substrate; synchronous sessions stay the flagship; Gate 0→1 includes a deliberately non-synchronous week | RATIFIED (pre-mortem, founder-approved) | PLAN §Approach-1/-2, pre-mortem-and-backlog.md |
| D9 | Gates are numeric, dropout-honest, and don't move; Gate 1.5 requires cold-channel signal + billing live before public spend | RATIFIED (Codex rounds 1-4) | PLAN §Approach-2/-4, PLAN-REVIEW-LOG.md |
| D10 | Monetization sequenced, not pre-committed: free beta → capped paid founding cohort (~$79 founding-year, never "lifetime") → permanent model from own retention data; sponsored-family path stays open | RATIFIED | PLAN §Approach-5, docs/02 §Monetization |
| D11 | Scope fences through Phase 2 (wearables, CV form-check, nutrition, social feeds, UGC, non-English, native TV, weights, head-to-head battles… out) | RATIFIED | docs/03 §Fences |
| D12 | Skills v0 = 5 paths incl. Pull-Up on-ramp; thin Record Book budgeted; teen gate metrics numeric | RATIFIED (Codex round 2 / skills doc) | PLAN §Approach-1, skill-progressions.md |
| D13 | Trials 2.0 two-axis scoring: Capacity (sacred universal tiers) + Progress Points (family headline); first Trials = calibration, mints nothing; grace-weekend + split-battery flexibility | RATIFIED (calibration rule via Codex) | trials-and-challenges.md, PLAN §Approach-3 |
| D14 | Week-2 paper-session kill-switch: family runs planner output from a plain screen before UI investment | RATIFIED (Codex round 1, finding 20 kernel) | PLAN §Approach-2 |
| D15 | Phase 0 canonical build list (roadmap items 1-10) + ordered cut line; anything unlisted is not Phase 0 | RATIFIED | docs/03 §Phase 0, PLAN §Approach-1 |
| D16 | Trials judging: one official counter, judge role rotates per test | RULED | founder-decision-briefs.md Q1 |
| D17 | Progress Points economy: published stepped table (flat PB points + tier-weighted climb bonus + stage-tiered rung mints); no formulas | RULED | briefs Q4 |
| D18 | Co-op pool: age-band quota v1; capped ±15% capacity-hybrid pre-registered for Phase 2 | RULED | briefs Q5 |
| D19 | Grace weekend always available, flagged late, telemetry-watched | RULED | briefs Q6 |
| D20 | Report highlight: earned via published heuristic, founder-confirmed, 2-month drought guard | RULED | briefs Q15 |
| D21 | First muscle-up: controlled hip drive counts (binary video check); "The Strict Muscle-Up" pre-registered as next rung | RULED | briefs Q9 |
| D22 | Front lever under-10s: hard pause at Advanced Tuck, printed on the ladder | RULED | briefs Q10 |
| D23 | Rung tests attempt-liberal in Phase 0; 48h post-fail cooldown pre-registered as fallback | RULED | briefs Q11 |
| D24 | Path cap 2 default; third slot earned by standard, universal | RULED | briefs Q12 |
| D25 | Set-blocks: auto-advance backstop (rest+10s) + any-member tap accelerator | RULED | briefs Q2 |
| D26 | Re-roll: none in Phase 0; one constrained re-roll (no preview, anchors pinned) ships Phase 1 | RULED | briefs Q3 |
| D27 | Coach stays unnamed through Phase 1; family folklore harvested later | RULED | briefs Q13 |
| D28 | Coach audio: starter set authored audio-capable now; pre-rendered spoken lines Phase 0 cut-eligible; live TTS never | RULED | briefs Q14 |
| D29 | Tomorrow's Card stays Phase 0, respecced as session-close prompt; Session Authorship Token defers to Phase 1 | RULED | briefs Q17 |
| D30 | Family Meter: hold stands + one-line S5 cumulative-total experiment in Phase 0 | RULED | briefs Q18 |
| D31 | "The Crucible" = the Challenge system's name (Trials stays Trials); brand-independent | PENDING founder yes/no | naming.md R2.5 |
| D32 | Product name: Grithouse front-runner pending smirk test; Kinforge/SquadStrong owned; Strongside/IronPact secondary; Ironside out | PENDING dinner-table + verification sweep | naming.md R2.7 |
| D33 | Permanent monetization model (annual-led trial vs. generous freemium) | RESEARCH-GATED → Phase 2 boundary with founding-cohort payment data | PLAN §Approach-5 |
| D34 | Convex long-term (vs. Postgres fallback) | RESEARCH-GATED → Phase 2 backend review; watch items in ADR-001 | ADR-001 §Hedges |
| D35 | Engine-doc conflicts F31-F40: CapabilityState wins; ratified Pact spec wins; plan_slice wins — merges are next build-session's first task | RATIFIED (arbitration rulings) | design-review-findings.md §Second pass |

_Maintenance rule: every future decision gets a row the day it's made; rows change status, never silently disappear. New ADRs only when hard-to-reverse + surprising + real trade-off all hold._
