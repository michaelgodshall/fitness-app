# Fitness App — Family Co-Training Coach

AI-native family training coach: generated bodyweight co-training sessions for parents + kids (8-14 sweet spot), 45-min hard cap, per-member scaling, deterministic Trials/Challenges/skill standards. Father-son brand wedge; parent-child-generic product. Solo founder (Michael) + AI agents; path-to-primary-business, milestone-gated.

## Session start ritual
1. Read `docs/04-build-orientation.md` FIRST (session protocol + doc authority map), then `docs/01-product-vision.md`, `docs/02-product-strategy.md`, `docs/03-roadmap.md` — they govern. `PLAN.md` is the locked grill artifact; `PLAN-REVIEW-LOG.md` holds the Codex adversarial review trail.
2. Check "Current status" below and the roadmap's "Next 5 working sessions."
3. `docs/legacy/` is the superseded Oct 2025 plan — reference only, never authority.

## Current status (update this section every session)
- **Phase 0 — Family Gate** (summer 2026). Foundation locked 2026-07-06 via grill + research swarms + pre-mortem + Codex adversarial review.
- **ADR-001 RATIFIED:** web-first (one web app = big-screen display + phone controllers via QR/room-code), Convex + Clerk, big-screen-authoritative sync, Expo native deferred to Phase 2. Domain logic must stay in pure-TS packages (reversibility hedge).
- **Monetization sequenced** (see PLAN §5): free beta → capped paid founding cohort (~$79 founding-year, never "lifetime") → permanent model from own data. Sponsored-family path stays open.
- **Codex review: APPROVED at round 5/5** (2026-07-06). 35 findings arbitrated across 4 REVISE rounds — full trail in PLAN-REVIEW-LOG.md. The plan is implementation-ready.
- Design docs complete in `docs/design/` (7 docs: experience, planner spec, trials/challenges, skills, voice, naming, pre-mortem+backlog). Skills doc ends with 7 founder questions; naming needs founder verification sweep (Strongside / HomeTeam / Pact first).
- **Design-layer adversarial review complete** (docs/design/design-review-findings.md): 30 findings; Criticals + fast Highs fixed in-session (incl. the new Pact spec and async-slice contract in session-planner-spec.md); the findings doc's "REMAINING for next session" list is the next session's first task, and its §Founder questions (18 decisions) is Michael's homework.
- **Possibly still landing from background Fable agents:** docs/design/engine-data-model.md and docs/design/adaptive-engine.md were being written at session end — if present and uncommitted, review briefly and commit; if absent, roadmap session 2 recreates them (prompts preserved in this session's transcript).
- Git initialized 2026-07-06 (root commit 9dde436). Nothing built yet. First build target: engine data model + walking skeleton, honoring the week-2 paper-session kill-switch (PLAN §Approach-2).

## Hard rules
- **Gates are numeric and don't move** (see roadmap). Missed gate → diagnose and fix, never advance.
- **Fences hold through Phase 2** (see roadmap out-of-scope list). Scope creep must argue against the doc, in the doc.
- **No runtime LLM in the workout loop in v1.** Deterministic planner over a founder-reviewed library; LLM only at authoring time (founder reviews every batch) + coach voice.
- **45-minute cap is inviolable.** Bodyweight-pure v1 (pull-up bar OK). No gender in the data model.
- **COPPA:** under-13s are parent-owned sub-profiles (nickname + birth year only, no login, verifiable consent).
- Kebab-case filenames. Decisions get ADRs in `docs/decisions/`.

## Founder context
- 8-10 protected hrs/week; client work is primary income. Agents execute between founder sessions; founder does judgment, content review, family testing, community.
- Backend leanings: positive Convex + Clerk/WorkOS experience; unenthusiastic about Supabase. Big-screen usage is real: family trains with a laptop/32" monitor as shared display — the big-screen + phones-as-controllers hypothesis is live until the platform ADR settles it.
- The founder's family is validation gate #1. If a change would make Tuesday night training worse, it's wrong.
