# ADR-001: Platform & Stack — Web-First on Convex

_Status: **RATIFIED** by founder 2026-07-06. Sources: platform research swarm (144 agents, red-teamed), `docs/design/workout-experience.md` platform constraints, founder's observed usage._

## Decision

**Phase 0-1: one web application. Phase 2: add native mobile via Expo consuming shared TypeScript domain packages.**

1. **Web-first, one app, two projections.** The big screen the founder's family already trains with *is a browser* (laptop/32" monitor; TVs later via casting or their built-in browsers). The same web app serves: the **big-screen display** (10-ft typography, timers, session state) and the **phone controller** (join via QR/room-code URL — no install, no app store, no accounts on kids' devices). This also makes the form-factor hypothesis free to A/B in Phase 0: laptop-only vs. laptop+phones is the same build.
2. **Sync architecture: big-screen-authoritative.** The display device holds the stable, foreground, always-connected socket and owns in-flight session state (survives total internet loss mid-workout). Phones are fire-and-forget optimistic loggers that resync on reconnect. We do NOT attempt sub-second bidirectional sync to pocketed, iOS-suspended phones — that's the version that fails silently in a living room.
3. **Backend: Convex.** Founder-positive experience; its reactive query model natively delivers the phone-log→big-screen-update happy path without WebSocket plumbing; first-class TypeScript; strong AI-agent DX. **With eyes open:** the research red-team flagged that competitors weren't benchmarked and Convex is pre-profitability — so see reversibility hedges below.
4. **Auth: Clerk** (Phase 1; Phase 0 needs no auth — founder devices only). B2C-native, founder-positive. Account model: **parent-only accounts, children as no-PII sub-profiles** — this *minimizes* COPPA scope (avoids the heightened verifiable-consent tier the amended Rule attaches to child-PII disclosure for AI training), but it does not eliminate obligations: once a child uses a browser controller, that surface is child-directed — so controller surfaces carry session-scoped tokens only, no analytics, no persistent identifiers, and IP handling is designed for data minimization. Full COPPA data map + counsel/safe-harbor review is a Phase 1 gate (per Codex review round 1). Teen companion access (Phase 2) gets its own consent design.
5. **Native (Phase 2): Expo RN** consuming the same domain packages, for push-reliable notifications, store discovery, and the teen companion surface. Expo's web support and monorepo support make this path mechanically clean **provided sharing happens at the domain-logic layer, not the UI layer** (research: Next+Expo UI sharing is officially unsupported/partial; don't chase it — the big-screen UI, phone-controller UI, and native UI are different surfaces anyway).
6. **Billing (Phase 2): web-primary Stripe** with a single server-side entitlements table; store IAP (via RevenueCat webhooks into the same table) added only if/where required. Never derive entitlement from client receipts; never build economics on the currently-paused external-link fee regime (SCOTUS, Oct 2026 term).

## Reversibility hedges (conditions of the Convex bet)

- **Domain logic lives in pure-TS packages** (planner, session state machine, scoring) with zero Convex imports — portable to any backend by construction.
- **Phase 2 gate includes a backend review:** benchmark a boring-Postgres fallback (Supabase Realtime or Railway + LISTEN/NOTIFY) against the observed sync workload before public scale; migrate if Convex health signals degrade (pricing shock, distress, protocol lock-in pain) or stay if it's earning its keep.
- Watch items: Convex TanStack integration leaving beta; company cash-flow-positive milestone.

## What would change this decision

- Living-room evidence (Phase 0!) that phone logging is ergonomically wrong mid-workout → lean harder on big-screen-only + log-strip mode (already first-class in the experience design).
- Families defaulting to propped tablets over the big screen → the same web app already serves that; only the display-class priorities shift.
- SCOTUS restoring a meaningful external-purchase fee → re-run billing economics IAP-led.
- Convex health degradation → execute the Postgres migration hedge.

## Rejected alternatives

- **Expo universal single codebase (RN-web renders the big screen):** ties the flagship surface to react-native-web quality and an RN toolchain for what is fundamentally a web product in Phases 0-1; TV support requires a version-pinned fork with a separate build target — and the browser already covers TV-class screens.
- **Native-first (Expo or Swift):** store review friction and install friction land exactly where the product needs zero friction (kids' phones as instant controllers); the founder's primary display isn't a phone; halves iteration speed for a solo founder in the validation phases.
- **PWA-first as previously planned (2025):** superseded — retention push unreliability on iOS, install friction; and the parts of "web" that mattered survive in this decision anyway (Phase 2 native covers push/notifications properly).
- **Supabase / Railway+Postgres now:** founder-negative/neutral experience, no reactive layer as naturally fitted to live shared sessions; retained as the explicit Phase 2 fallback rather than the starting point.
