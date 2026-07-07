# Roadmap & Operating Model

_Foundation doc v2.0 — July 2026. The arc is milestone-gated, not calendar-gated (one exception, marked ★). Gates are numeric; a missed gate triggers diagnose-and-fix, never silent advancement._

---

## Operating model

- **Founder capacity:** 8-10 protected hours/week (the floor that survives busy client months). If it drops below ~8/week for a sustained month → cut scope at the next gate.
- **Division of labor:** founder does judgment (decisions, content review, family testing, community); AI agents do the build work between founder sessions, governed by these docs + project CLAUDE.md.
- **Docs govern.** Any future session (any model) starts from `docs/01-03` + `PLAN.md`. Scope creep must argue against the written fences.

---

## Phase 0 — Family Gate (summer 2026)

**Purpose:** validate the three lived failure modes — exhaustion, consistency, teen drift — with the founder's own family. ★ *Calendar constraint: family training on the engine before summer ends (high school closes the 14-year-old's window).*

**Build (core adaptive loop + instrumentation, nothing else):**
1. Exercise/block library v1 — founder-curated; LLM-assisted batch authoring with 100% founder review before anything enters the library
2. Session planner v1 — deterministic; inputs: roster + time available + week's training history; constraints: 45-min cap, movement-pattern balance, progressive density, strategic repeat scheduling
3. Workout surface — session display + per-member logging + mid-workout difficulty swaps (form factor per platform decision)
4. PB detection ("beat last Tuesday: 64 squats") + weekly Pact tracking
5. Skills v0 — 5 hand-authored progression paths (pull-up [the on-ramp], muscle-up, HSPU, pistol, front lever); no polish — teen-drift instrumentation (must include the "rung unlocked" feedback beat at session close; see docs/design/skill-progressions.md)
6. Engine eval harness — planner unit tests + a founder review workflow for generated blocks (explicit deliverable, not an afterthought)
7. Async slice-completion substrate — a member who misses the family session can complete their scaled portion solo (any device/time), banking it to their Pact line. Synchronous sessions stay the flagship; the slice is the school-year pressure valve. (Ratified from pre-mortem — see docs/design/pre-mortem-and-backlog.md)

**Non-goals:** accounts, payments, store submission, Trials, Challenges, coach voice beyond a hand-authored starter set. Web app per ADR-001: anonymous, data-minimized Convex session state (no contact info, founder family only); display device owns in-flight sessions (offline-resilient). Scope cut line and order live in PLAN.md §Approach-1.

**GATE 0→1** (operationalized in full in PLAN.md §Approach-2): 3+ sessions/week × 4+ weeks with **≥2/week synchronous shared** (≥20 min, ≥2 members incl. adult); attendance-friction log ≤20% "pushed"; teen ladder-views ≥1×/week outside sessions + ≥1 self-declared rung test/2 weeks; one deliberately **non-synchronous week** in which the family system still holds. Week-2 kill-switch: planner sessions run from a plain screen before UI investment.

## Phase 1 — Beta (fall 2026)

**Gates before recruitment:** COPPA compliance gate (data map incl. persistent identifiers on child surfaces, vendor DPAs, analytics policy, parental review/delete flows, counsel or safe-harbor review) + **youth-S&C sign-off** on the planner's H11 layer.

**Build:** accounts + family model (parent-owned sub-profiles, no child PII); monthly Trials (first Trials = calibration baseline, mints no Progress Points); Challenges; onboarding (<2 min, from legacy flows — they were good); coach voice v1; **both-parent monthly recap**. Web app is already live from Phase 0 — no store submission needed until Phase 2 native.

**Do:** naming/brand sprint (before recruitment); incumbent recon + **substitute map** (YouTube/"dad does it manually," youth sports conditioning, homeschool PE, AI generators); recruit **10-15 families** (≤⅓ founder-close) via intentional-father/church communities + r/daddit — free, founding-year price honored later (no lifetime promises); A/B "adaptive coach" vs "AI coach" framing; monthly voice-of-customer calls.

**GATE 1→2 (dropout-honest):** denominator = all recruited; **≥60% at 3+ sessions/week × 6 weeks AND ≥8 retained families**; WTP proven by **payment** (capped founding cohort converts at ~$79 founding-year price, or live pricing/deposit test) — not interviews. **GATE 1.5:** ≥25 qualified cold waitlist signups or ≥3 cold-recruited families before public-launch spend.

## Phase 2 — Public v1 (winter 2026-27)

- Monetization decision executed (trial-led premium annual-first posture vs. free-first — per research + beta WTP)
- Asynchronous competition seeds: skill milestones and improvement boards — own-history and private community cohorts first; percentiles hidden until per-test/cohort N thresholds; low-stakes, family-level, opt-in until verification standards exist
- **Teen companion access:** 13+, parent-granted, own device; solo sessions feed the family Pact
- Content marketing engine on (founder-authentic scaling demos; build-in-public)

## Phase 3 — Deepening (2027)

- Family-vs-family divisions once liquidity exists — scored on **improvement vs. own baseline** (size- and age-fair); church/community leagues as the seeding structure
- Runtime LLM session generation (premium adaptivity) on top of the proven planner + eval harness
- Dumbbell/hybrid programs (the teen arc) — architecture already supports it
- Audience widening beyond the wedge (product already generic)

---

## Out of scope through Phase 2 (the fences)

Wearables/health integrations · computer-vision form feedback · nutrition · social feeds/chat · user-generated programs · non-English · native TV apps (casting/AirPlay OK) · weights programs · mom/daughter-targeted marketing · real-time head-to-head battles · multi-device sync beyond in-room session controllers, async slice-completion, and teen companion access · runtime LLM generation.

## Open items & how they resolve

| Item | Resolution path | Status / due |
|---|---|---|
| Platform/stack | **RESOLVED** — ADR-001 ratified 2026-07-06 (web-first, Convex, Clerk) | Done |
| Monetization model | **SEQUENCED** — free beta → paid founding cohort → permanent choice from own data (PLAN §5) | Final call at Phase 2 boundary |
| Codex review loop | Round 2 arbitrated; continue to APPROVED or MAX_ROUNDS=5 (PLAN-REVIEW-LOG.md) | Next session |
| Product name/brand | Shortlist done (docs/design/naming.md) → founder verification sweep (Strongside/HomeTeam/Pact) | Before Phase 1 recruitment |
| COPPA compliance gate | Data map (incl. IPs/tokens/logs), DPAs, review/delete flows, counsel or safe-harbor review | Phase 1, before recruiting minors |
| Incumbent recon + substitute map | Apple/Peloton/Nike/Fitbit family features + YouTube/manual/AI-generator substitutes | Phase 1 |
| Skills founder questions (7) | docs/design/skill-progressions.md §Open questions — needs founder's lived data | Before library authoring |

## Next 5 working sessions (concrete)

1. **Close the review loop** — check Codex round 3 verdict, arbitrate remaining findings, commit; answer the 7 skills founder questions; start the naming verification sweep.
2. **Repo scaffold + engine data model** — monorepo (pure-TS domain packages per ADR-001), exercise/block/session/member schema from the planner spec.
3. **Library authoring session #1** — seed ~40-60 exercises with swap chains; stand up the LLM batch-authoring + founder-review workflow + simulation-harness triage.
4. **Paper-session test (week-2 kill-switch)** — planner generates real sessions; family runs them from a plain screen; excitement is the metric.
5. **Walking skeleton + family session zero** — big-screen surface (generate → display → log → save); first real workout; friction notes drive the next iteration.

_A missed week costs nothing but time — the gates don't move, the fences don't move, and the docs remember everything._
