# ADR-002: Deterministic Planner + Authoring-Time LLM — No Runtime LLM in the Workout Loop

_Status: accepted (ratified 2026-07-06 during the grill; retro-recorded as an ADR 2026-07-16). Full trail: PLAN.md §Key decisions, docs/design/session-planner-spec.md, docs/design/library-authoring-pipeline.md, docs/design/coach-voice.md §6._

We market an "AI-native family coach," yet no LLM call stands between a family and tonight's workout — a future reader will reasonably wonder why. Sessions are assembled by a deterministic, seeded planner from a founder-reviewed library; LLMs work **offline at authoring time** (generating library candidates the founder approves) and in the **voice layer** (Tier 1: pre-approved templated lines slot-filled at runtime; Tier 2: async artifacts like the Trials Report, fact-traceability-checked — never live in-session, never a chat surface).

**Why:** kids perform this content (a stochastic generator in that loop demands eval infrastructure a solo founder doesn't have yet); workouts must survive total connectivity loss mid-session; per-session inference cost at scale is real; and a deterministic planner is unit-testable by one person. The "AI" users feel is adaptivity + memory + voice — which this architecture delivers — not generation-at-runtime.

**Considered alternatives:** runtime LLM generation with a validation layer (max freshness; rejected for v1 on trust/offline/eval burden — **explicitly scheduled as the Phase 3 upgrade** behind the same interfaces, so this ADR expires by design); fully-authored fixed programs (rejected — recreates the content-exhaustion failure the founder's own family proved).

**Consequences:** the library authoring pipeline is on the critical path; marketing language must be honest ("adaptive coach" framing is A/B-tested against "AI coach" in Phase 1); planner constraints (H1-H11) are enforced as tests, not conventions.
