# Lens 6 — The Phase-3 Runtime-LLM Era + Honest Frontier Map

_Fable-night exploration, 2026-07-18. What PLAN.md §Approach-6's one-liner ("runtime LLM session generation as the engine upgrade") should actually become — argued against the fences, not around them._

## The thesis: we already built the verifier

The single most important fact about this product's Phase-3 upgrade is that **the hard part is already done and it points the other way from how everyone frames "runtime LLM."** The industry default is "LLM generates the workout." That is exactly the thing the founder killed in v1, for good reasons (trust, offline, eval-at-one-person-scale). But H1–H11 plus the adaptive engine's target formula are not just a v1 planner — they are a **complete, deterministic, unit-tested verifier** for what counts as a legal, safe, in-band family session. Once you own a verifier, the LLM stops being a generator you have to trust and becomes a **proposal engine you get to check.** Every Phase-3 idea below is a variation on one move: *let the model propose inside a space the deterministic system still has final say over.* Nothing ships that fails H1–H11. That is the whole design.

---

## Proposals

### P1 — LLM-proposes / planner-verifies session assembly _(the headline Phase-3 upgrade)_
**What:** The LLM proposes a full candidate session (block sequence + exercise fills + targets) given roster, time dial, pattern debt, and capability state. The existing planner runs it through H1–H11 and the band-hit check as an **acceptance gate**, not as the generator. Fail → reject with the violated constraint as feedback → re-propose (bounded rounds) → fall back to today's deterministic planner if no candidate passes. The planner's role inverts from author to referee.
**Why this product:** It buys the one thing determinism can't — *taste in composition* (a session that "feels" like a coach designed it, not a constraint solver that satisfied it) — without surrendering the trust guarantees the family gate was built on. The founder's "would we both struggle and finish?" band is already the objective function.
**Phase fit:** Phase 3. **Build cost:** L (constrained-decoding harness, re-propose loop, eval parity with deterministic goldens).
**Showcase value:** **High** — "generator-verifier with a deterministic safety envelope" is the single most reusable pattern a consulting client will pay for; it generalizes to any regulated-output LLM system (finance, healthcare, legal).
**Risks:** latency/cost per session; must preserve offline (see P3 — the accepted session is cached, the proposal happens online at planning time, never in the workout loop); a subtly-worse-but-legal session erodes trust more slowly and invisibly than an illegal one — the band-hit eval must gate on quality, not just legality.

### P2 — Constrained decoding into the planner's schema
**What:** Rather than free-text → parse → validate, the LLM emits directly into the planner's typed session schema via constrained/structured decoding (JSON-schema-locked or grammar-constrained sampling over the block-type enums, exercise IDs from the *approved library only*, target integers). The model literally cannot name an exercise that isn't founder-reviewed, cannot invent a block type, cannot emit an out-of-range target.
**Why this product:** It makes the "founder reviews every library item" fence hold *mechanically at runtime* — the model selects from approved IDs, it never authors. This is the cleanest possible reconciliation of "LLM in the loop" with the review fence.
**Phase fit:** Phase 3 (enabling tech for P1). **Build cost:** M. **Showcase value:** **High** — constrained decoding into a domain schema is a crisp, demoable client artifact.
**Risks:** schema rigidity can flatten the very creativity P1 wants; tune how much latitude the grammar allows.

### P3 — The offline invariant is preserved by *when*, not *whether*
**What:** Every runtime-LLM proposal in P1/P2 runs at **planning time** (when "tonight's session" is pre-generated, per the consistency-armor pre-gen already in the library pipeline), online, then cached to the big screen. The workout loop still reads a frozen, verified session from local state. No LLM call ever sits between the family and the timer.
**Why this product:** "Offline-during-workout is a platform requirement" survives Phase 3 untouched — the fence was always about the *workout loop*, and pre-generation already decouples proposal from execution.
**Phase fit:** Phase 3 architectural rule. **Build cost:** S (it's a discipline, not a build — the pre-gen path exists). **Showcase value:** Med. **Risks:** a last-minute roster change ("Sam's home sick") that arrives after pre-gen must fall back to the deterministic planner, which stays permanently resident. The LLM is never the only path to a session.

### P4 — LLM-tuned selection weights (the conservative on-ramp)
**What:** Don't let the LLM assemble the session at all — let it nudge the *selection weights* the deterministic planner already uses (staleness relief, variety, roster feel), as a bounded per-family vector the planner consumes. The planner still does the assembling; the LLM only expresses "this family likes circuits, is bored of push-up variants, responds to the teen's stretch block."
**Why this product:** It's the lowest-risk way to get personalization taste into the engine — the output is a weight vector, not content, so H1–H11 are untouched by construction. A natural Phase-2→3 stepping stone before committing to full P1.
**Phase fit:** Late Phase 2 / Phase 3. **Build cost:** M. **Showcase value:** Med — "LLM tunes a deterministic system's knobs" is a real pattern but less flashy than P1. **Risks:** weight drift could starve library items (the pipeline's selection-share report already detects this — reuse it).

### P5 — Challenge / Trials commentary generation _(pure Tier-2 extension, ships earliest)_
**What:** Extend the coach-voice Tier-2 async-artifact pipeline (already spec'd: structured facts payload → narrate → fact-traceability lint → fallback skeleton) to cover Challenge results and Trials-week storylines — richer, multi-member, arc-aware narration than the current per-report template.
**Why this product:** It's the *cheapest, safest, earliest* runtime-LLM win and it's already 90% designed — Tier 2 exists, this just adds moment types and adversarial fixtures. Async, non-blocking, online, no minor sees an unverified line (family-surface only).
**Phase fit:** Phase 2 (it's Tier 2, which is already Phase 1/2). **Build cost:** S. **Showcase value:** Med — narration-with-a-fact-firewall is a good demo but a familiar one. **Risks:** none new beyond Tier 2's existing lint; this is the model of how *all* runtime LLM should feel.

### P6 — The Phase-2 teen companion AI surface
**What:** The 13+ companion (own device, parent-visible) carries the **moments-not-chat** model in verbatim: broadcast Tier-1 lines + async Tier-2 artifacts, **no open dialogue.** The only new runtime surface is the teen's solo-session opens and skill-progression narration on his own screen — same three-tier architecture, same offline Tier-1, same fact-traceable Tier-2. Every coach line to the teen is mirrored to the parent account (coach-voice §5.6).
**Why this product:** The teen is the validated retention problem; his companion is where "AI that respects a 14-year-old" either lands or dies. Carrying moments-not-chat forward means we get the teen's engagement without opening a minor-chat moderation surface we cannot staff.
**Phase fit:** Phase 2, gated on the teen-companion review coach-voice §5.6 flags as unsolved. **Build cost:** M. **Showcase value:** **High** — "age-appropriate AI for a minor, parent-transparent, no chat" is a category almost nobody gets right and clients with youth products will care intensely.
**Risks:** the pull toward conversational drift is strongest exactly here; the review must ratify moments-not-chat as a *permanent* teen-companion constraint, not a v1 convenience.

---

## Candidate amendment — natural-language request-time constraint parsing

**Framing (honest, both sides):** "Ryan has a game tomorrow, go easy on legs" → an LLM parses this to **typed constraint deltas** (down-weight squat/hinge patterns, cap lower-body intensity, protect H3 recovery) that feed the *unchanged, deterministic, verified* planner. The task prompt flags this as possibly v1-safe. Here is the real argument.

**For (it may not cross the fence):** The fence is "no runtime LLM call *in the workout loop*." This call happens at *request time, before planning* — the parent types it, the LLM emits deltas, the planner runs offline as always, the session caches. The LLM's **only** output is a bounded typed adjustment; it cannot author content, cannot violate H1–H11 (the planner still gates), cannot inject a line a minor sees. Offline-during-workout is untouched (parse happens at planning time). It is arguably closer to P4's weight-nudge than to session generation.

**Against (why it's still an amendment, not a freebie):** It does put an LLM on the *path to tonight's session*, which the v1 vision commitment ("no AI improvisation stands between a family and a workout") reads more broadly than just the timer loop. A misparse ("go easy on legs" → zeroes out all lower body for a week) produces a legal-but-wrong session — H1–H11 won't catch intent errors. And it needs network at request time, so it must degrade to manual typed controls (a "go easy on: [legs] [pushing] [everything]" chip UI) when offline or when the parse is low-confidence.

**Recommendation:** Ship the **manual typed-control version in Phase 1** (chips → same deltas, zero LLM, obviously fence-clean and genuinely useful). Add the **LLM parser as a Phase-2 convenience layer on top**, gated on: (a) output is typed deltas only, schema-constrained; (b) the parse is shown back to the parent for confirmation before it binds ("Easy on legs, protecting tomorrow — right?"); (c) planner stays authoritative; (d) offline falls back to chips. Framed this way it's a Phase-2 amendment with a clean fence story, not a v1 fence-break.
**Build cost:** S (chips) + S (parser). **Showcase value:** **High** — natural-language-to-typed-constraints with a confirmation gate is the single most demoable, most reusable pattern in this whole lens for a consulting audience.

---

## Frontier map — what stays OUT, and the exact condition that reopens it

| Capability | Why it stays out | Reopen condition |
|---|---|---|
| **Live conversational coach (Tier 3)** | Not a gap — a guardrail. Open dialogue with minors is an unstaffable moderation surface; it also breaks the offline guarantee and the "authority = program + record" voice. | The teen-companion review ratifies a **bounded, parent-visible, teen-only** dialogue with a hard scope (skill Q&A over the record, no open chat) **and** an eval harness proves refusal/safety on adversarial minor inputs. Never for under-13s. |
| **Computer-vision form feedback** | The coach is "clipboard, not camera" by design — the entire voice contract rests on it never claiming to *see*. Adds a hardware/latency/privacy surface (camera on a minor) orthogonal to the product's bet. | A **parent-side, opt-in, on-device** rep-counter that never speaks to the child and never persists video clears a dedicated COPPA + youth-S&C review. It reopens as a *logging* input, not a *coaching* voice. |
| **Wearables / heart-rate** | Out through Phase 2 per PLAN; bodyweight-pure v1 has no place to put the signal, and it's another minor-data surface. | Phase 3 conditioning blocks demonstrably need an intensity signal the rep count can't provide **and** a family-owned device path with no new minor-data retention exists. |
| **Free (unverified) LLM session generation** | The trust failure mode the whole architecture exists to prevent. | Never as such. The *only* form it takes is P1 — proposal behind the H1–H11 verifier. "Free generation" has no reopen condition; the verifier is non-negotiable. |

---

## Fence-compliance check (of my own proposals)

- **No runtime LLM in the workout loop (v1):** P1–P6 are all Phase 2/3; none touches v1. P3 keeps every Phase-3 LLM call at planning time, cached — the workout loop stays LLM-free forever. ✅
- **45-min cap:** untouched — H1 is inside the verifier P1 must pass. ✅
- **COPPA / broadcast-not-chat:** P5/P6 are moments-not-chat; the frontier map keeps Tier-3 dialogue out for under-13s permanently and gates the teen version on review. The NL parser is parent-facing, parent-confirmed. ✅
- **No gender in data model:** nothing here adds a field. ✅
- **Founder reviews every library item:** P2's constrained decoding *strengthens* this — the model selects approved IDs, never authors. ✅
- **Offline-during-workout:** P3 is the explicit guarantee; the NL parser degrades to chips offline. ✅
- **Out-of-scope through Phase 2 (CV, wearables, runtime generation):** all held; only the frontier-map reopen conditions could move them, each behind a named review. The one thing I push earlier than "Phase 3" is the **NL request parser (Phase 2, as an amendment)** and I've flagged it as such, not smuggled it. ⚠️→ founder call.

## Open founder questions

1. **P1 vs. P4 as the Phase-3 entry point:** commit to full LLM-proposes/planner-verifies session assembly, or take the conservative weight-nudge on-ramp first and earn P1 with data? (Recommend P4 → P1 — the verifier is the same either way, so the risk ladder is free.)
2. **NL request parser — Phase 1 chips only, or Phase 2 parser-on-top?** (Recommend both, sequenced: chips now, parser as a confirmed-delta convenience later. Your call on whether the parser is worth the amendment.)
3. **Teen companion dialogue:** does "moments-not-chat" become a *permanent* teen-companion fence, or does the Phase-2 review get to consider a bounded skill-Q&A dialogue? This is the highest-stakes reopen in the frontier map.
4. **Where's the quality bar for a "legal but worse" P1 session?** A rejected session is easy; a subtly-flat-but-valid one is the real risk. Is band-hit rate enough, or does P1 need a founder-taste gate on a sample every model change (like Tier 2 already has)?
