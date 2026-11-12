# ADR-003: Parent-Only Accounts, No-PII Sub-Profiles, Session-Scoped Controller Identity

_Status: accepted (ratified across the 2026-07-06 grill + Codex rounds 1-2; retro-recorded 2026-07-16). Full trail: PLAN.md §Approach-1/-3, ADR-001 §4, PLAN-REVIEW-LOG.md (Codex findings 7-8, round-2 finding 3)._

Only parents hold accounts. Children exist as **sub-profiles** — nickname and birth year, no login, no contact info — and children's devices join live sessions via **session-scoped room codes**, never credentials. Child-facing surfaces carry no analytics and no persistent identifiers. Teens 13+ may later receive parent-granted companion access with its own consent design (Phase 2).

**Why:** this *minimizes* (not sidesteps — Codex corrected our first overclaim) COPPA scope by construction: the amended Rule attaches heightened verifiable-consent duties to child-PII collection and treats persistent identifiers as personal information, so the cheapest compliant architecture is to never hold the data. It also happens to be the better product: a kid grabbing any browser device as a controller with zero setup is the Jackbox-style frictionless join the experience design wants.

**Considered alternative:** per-child accounts (RollStrong's model) — rejected: heavier consent machinery, credentials on kids' devices, and it fights the shared-session soul of the product.

**Consequences:** the Phase 1 COPPA gate still applies (data map covering IPs, tokens, server/Convex logs; vendor DPAs; parental review/delete flows; counsel or safe-harbor review before recruiting families with minors); teen companion cannot simply reuse this model — it needs its own consent path; and durable family identity without accounts (Phase 0) needs an explicit anonymous-family-document design (open finding F21).
