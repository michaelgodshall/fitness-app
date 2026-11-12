# Product Strategy

_Foundation doc v2.0 — July 2026. Supersedes `docs/legacy/competitive-analysis.md` and `docs/legacy/brand-strategy.md` where they conflict. Market claims below are REPORTED from the July 2026 research swarm (50 verified sources, adversarially red-teamed) unless marked OBSERVED (founder's lived experience)._

---

## Category & positioning

**Category:** family co-training platform.
**Position:** *the AI coach for families that train together* — generated sessions that never go stale, scaled per member from age 8 to adult, on the family's schedule.

**One-line differentiation:** every competitor either hands you fixed content that runs out (AthleanX model — OBSERVED failure in the founder's own family), or personalizes for individuals in isolation (Fitbod/Freeletics model). Nobody generates *shared* sessions for *different-strength people training together in the same room*.

## Competitive reality (July 2026)

The Oct 2025 "zero direct competitors" claim is **dead**. The category woke up:

| Entrant | What it is | Why it isn't us |
|---|---|---|
| RollStrong (Feb 2026) | Parent-child strength app; $19.99 adult/$9.99 kid/$199 yr | Separate age-tiered accounts — no shared session, no co-training mechanic |
| Fitly (waitlist) | "One plan. Adapted for everyone." | Converging on our exact promise — strongest signal that speed matters |
| FitDad (Jun 2026) | Dad-fitness, $19.99/mo | Single-user; dad content, not co-training |
| Swolemates, Budy, Fam HIIT Squad | Social/family fitness | No per-member scaling, no shared-session engine |
| PUPG, mogisthenics | Live push-up battles, ELO | Validates teen competition appetite; not family products |

All entrants are tiny (1-6 App Store ratings). Honest read, both ways: the white space is *populated but unclaimed* — and thin traction is also consistent with "unproven demand." We resolve that with our own gates, not optimism.

**Known blind spot (Phase 1 checklist):** incumbent recon — what Apple Fitness+/Family Sharing, Peloton, and Nike actually ship for shared/family workouts. A platform player could close this space; verify before public launch.

## Moat logic (in order of durability)

1. **Ground truth.** 16 months of real family training data and counting — the engine's constraints are lived, not guessed. Every founder-family session (and later beta-family session) deepens tuning nobody can copy from a feature list.
2. **The engine.** Feature sets are copyable; a session-generation engine tuned on real family co-training data is not quickly copyable by content-library companies.
3. **Wedge distribution.** Authentic founder story (dad + three sons) into intentional-father and church communities the founder actually belongs to — warm channels competitors would have to cold-buy.
4. **Later: network effects.** Phase 2-3 competition layer (percentiles → improvement leagues between families/communities) compounds retention and referral.

## Brand & distribution

- **Voice (survives from legacy):** the experienced coach who gets it — direct, encouraging, athletic, never gamey, never patronizing.
- **Wedge:** father-son story everywhere in marketing; parent-child-generic everywhere in product.
- **Channels, in order:** (1) intentional-father/church communities — warm, values-aligned, league-ready; (2) founder-authentic content (training with his sons: the scaling demo *is* the ad); (3) r/daddit and dad-fitness communities — value-first, per legacy playbook (still good); (4) build-in-public — doubles as marketing for the founder's dev-services business (explicit secondary payoff: worst case, this project is a world-class portfolio piece and lead magnet).

## Monetization (posture locked; model research-gated)

- **Posture:** premium product, one price covers the whole family, annual-first. Priced on value ($99-119/yr zone), not on the $9.99 legacy anchor — 2026 comps run $15.99-19.99/mo (REPORTED, from unproven entrants; elasticity validated by founding-cohort **payment**, per PLAN §Approach-4 — never by interviews).
- **Sequenced, not pre-committed** (monetization research, July 2026): free beta → capped time-boxed **paid founding cohort** (~$79/yr founding-year price, NOT locked-forever) as the real WTP instrument → permanent model chosen from own retention data. Both finalists stay live: annual-led trial (the category default — but survivorship-biased evidence, and a hard 14-day trial mismatches a ~66-day family habit) vs. generous freemium (RevenueCat's own community-growth carve-out favors free tiers for referral-driven, multi-person products — every free family is a referral node in the church/dad-group wedge). A **sponsored-family path** stays open regardless (mission + consulting-funnel value).
- **Billing economics note:** Google's 2026 US fee structure charges the same base fee on subscriptions regardless of billing route, and Apple's 0% external-link regime is paused/litigated — web-primary Stripe is still right for entitlement simplicity, but fee savings are not a load-bearing argument.
- **Billing:** web-primary billing (Stripe) is attractive if the big-screen/web surface wins the platform decision; do NOT build economics on the temporary 0% US external-purchase fee (SCOTUS pending).
- **Beta families:** free, with the founding-year price honored at launch (no lifetime promises — PLAN §Approach-3).

## Platform — RESOLVED: see `docs/decisions/adr-001-platform-and-stack.md` (ratified 2026-07-06)

_Web-first on Convex + Clerk; big screen = browser; phones as controllers. The section below is preserved as the historical decision criteria; ADR-001 is authoritative._

- **Settled:** PWA-first is dead (iOS PWA push unreliability + install friction vs. a retention model that rides on weekly re-engagement). Native or hybrid.
- **Live hypothesis — big-screen-primary:** the founder's family trains with a laptop/32" monitor as the shared display (OBSERVED). Possible native form factor: **big screen displays the shared session; phones act as per-member controllers/loggers** (Jackbox pattern) — solving the who-taps-the-counter problem and giving teens a surface of their own. Nobody in the market builds interactive family training for the living-room screen.
- **Stack candidates:** Expo/React Native universal vs. web (Next.js) + Expo mobile sharing a TS core. Backend: Convex (founder-positive; real-time model fits live multi-device sessions) vs. Supabase (founder-meh) vs. Railway+Postgres. Auth: Clerk / WorkOS.
- **Decision criteria (priority order):** real-time multi-device session sync; offline-during-workout; push reliability; solo-founder + AI-agent velocity; COPPA fit; cost 0→10k users; longevity.
- **Decision owner:** platform research swarm (in flight) → founder decision before Phase 0 build starts.

## Compliance posture

**COPPA pattern locked:** under-13s exist only as parent-owned sub-profiles — nickname + birth year, no email, no login, verifiable parental consent at creation, data-minimized. Teens 13+ may receive parent-granted companion access (Phase 2). Full compliance design is a Phase 1 deliverable; no minors' data leaves the family account.

## Top risks & mitigations

| Risk | Mitigation |
|---|---|
| Shared-session demand unproven in market | Numeric gates: founder family (Phase 0), 10-15 beta families (Phase 1), before any public spend |
| Generated-workout quality burns trust | No runtime LLM in the loop v1; founder-reviewed library; planner unit tests; family eats the dogfood first |
| Incumbent closes the space | Phase 1 incumbent recon; speed; wedge communities incumbents can't authentically enter |
| Kids age out (dyad lifecycle churn) | Skills paths + teen companion + Phase 3 weights arc; model honestly at Phase 2 |
| Founder capacity (8-10 hrs/wk floor) | Milestone gates, agent-executed builds, scope cut at gates — never silent timeline stretch |
| Fitly/RollStrong iterate faster | ASSUMPTION (REPORTED, unverified): their content models appear fixed/library-based; verify at each phase-boundary teardown rather than architect against it. Our engine + community wedge is the counter either way |
