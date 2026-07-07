# Fitness App — Family Co-Training Coach

AI-native family training coach: generated bodyweight co-training sessions for parents + kids (8-14 sweet spot), 45-min hard cap, per-member scaling, deterministic Trials/Challenges/skill standards. Father-son brand wedge; parent-child-generic product. Solo founder (Michael) + AI agents; path-to-primary-business, milestone-gated.

## Session start ritual
1. Read `docs/01-product-vision.md`, `docs/02-product-strategy.md`, `docs/03-roadmap.md` — they govern. `PLAN.md` is the locked grill artifact; `PLAN-REVIEW-LOG.md` holds the Codex adversarial review trail.
2. Check "Current status" below and the roadmap's "Next 5 working sessions."
3. `docs/legacy/` is the superseded Oct 2025 plan — reference only, never authority.

## Current status (update this section every session)
- **Phase 0 — Family Gate** (summer 2026). Foundation locked 2026-07-06 via grill + Codex review.
- In flight as of 2026-07-06: platform/stack research swarm; monetization research swarm. Platform decision is the next founder decision (ADR in `docs/decisions/`).
- Nothing built yet. First build target: engine data model + walking skeleton (roadmap sessions 2-4).

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
