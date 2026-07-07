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
5. Skills v0 — 4-5 hand-authored progression paths (muscle-up, HSPU, pistol, front lever); no polish — this is teen-drift instrumentation (must include the "tier unlocked" feedback beat at session close)
6. Engine eval harness — planner unit tests + a founder review workflow for generated blocks (explicit deliverable, not an afterthought)
7. Async slice-completion substrate — a member who misses the family session can complete their scaled portion solo (any device/time), banking it to their Pact line. Synchronous sessions stay the flagship; the slice is the school-year pressure valve. (Ratified from pre-mortem — see docs/design/pre-mortem-and-backlog.md)

**Non-goals:** accounts, payments, store submission, Trials, Challenges, coach-voice polish. Dev build on founder devices; local-first storage.

**GATE 0→1** (operationalized in full in PLAN.md §Approach-2): 3+ sessions/week × 4+ weeks with **≥2/week synchronous shared** (≥20 min, ≥2 members incl. adult); attendance-friction log ≤20% "pushed"; teen ladder-views ≥1×/week outside sessions + ≥1 self-declared rung test/2 weeks; one deliberately **non-synchronous week** in which the family system still holds. Week-2 kill-switch: planner sessions run from a plain screen before UI investment.

## Phase 1 — Beta (fall 2026)

**Gates before recruitment:** COPPA compliance gate (data map incl. persistent identifiers on child surfaces, vendor DPAs, analytics policy, parental review/delete flows, counsel or safe-harbor review) + **youth-S&C sign-off** on the planner's H11 layer.

**Build:** accounts + family model (parent-owned sub-profiles, no child PII); monthly Trials (first Trials = calibration baseline, mints no Progress Points); Challenges; onboarding (<2 min, from legacy flows — they were good); coach voice v1; **both-parent monthly recap**. Web app is already live from Phase 0 — no store submission needed until Phase 2 native.

**Do:** naming/brand sprint (before recruitment); incumbent recon + **substitute map** (YouTube/"dad does it manually," youth sports conditioning, homeschool PE, AI generators); recruit **10-15 families** (≤⅓ founder-close) via intentional-father/church communities + r/daddit — free, founding-year price honored later (no lifetime promises); A/B "adaptive coach" vs "AI coach" framing; monthly voice-of-customer calls.

**GATE 1→2 (dropout-honest):** denominator = all recruited; **≥60% at 3+ sessions/week × 6 weeks AND ≥8 retained families**; WTP proven by **payment** (capped founding cohort converts at ~$79 founding-year price, or live pricing/deposit test) — not interviews. **GATE 1.5:** ≥25 qualified cold waitlist signups or ≥3 cold-recruited families before public-launch spend.

## Phase 2 — Public v1 (winter 2026-27)

- Monetization decision executed (trial-led premium annual-first posture vs. free-first — per research + beta WTP)
- Asynchronous competition seeds: global Trials percentiles, monthly improvement leaderboards, skill milestones (no liquidity required)
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

| Item | Resolution path | Due |
|---|---|---|
| Platform/stack (big-screen hypothesis, Expo vs web+mobile, Convex vs alternatives, Clerk/WorkOS) | Research swarm (in flight) → founder decision | Before Phase 0 build |
| Monetization model | Research swarm (in flight) + beta WTP | Phase 2 boundary |
| Product name/brand | Naming sprint | Before Phase 1 recruitment |
| COPPA implementation detail | Compliance design task | Phase 1 build |
| Incumbent recon | Structured check of Apple/Peloton/Nike/Fitbit family features | Phase 1 |

## Next 5 working sessions (concrete)

1. **Platform decision session** — read the platform research brief, decide stack + form factor, record an ADR in `docs/decisions/`.
2. **Engine design session** — data model for exercises/blocks/sessions/members; planner constraint spec; eval harness design. (This is the deepest design work in Phase 0 — bring judgment.)
3. **Library authoring session #1** — seed ~40-60 exercises with swap chains from the legacy library concept; set up the LLM batch-authoring + founder-review workflow.
4. **Build session(s)** — scaffold app + backend; workout surface walking skeleton (generate → display → log → save).
5. **Family session zero** — first real workout on the walking skeleton; capture friction notes; iterate.

_A missed week costs nothing but time — the gates don't move, the fences don't move, and the docs remember everything._
