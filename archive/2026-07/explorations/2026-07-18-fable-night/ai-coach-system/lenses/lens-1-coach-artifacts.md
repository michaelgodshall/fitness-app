# Lens 1 — The Generated Coach Artifact System

_Fable night, 2026-07-18. Expands coach-voice.md §6 Tier 2 (three thin bullets: Trials reports, week recaps, milestone blurbs) into a full product pillar. Design-within-fences; two candidate amendments flagged explicitly. Terms per CONTEXT.md._

---

## Thesis: artifacts are the moat, not the garnish

The in-session voice (Tier 1) is table stakes — every fitness app has cues. The **generated artifact** is what a family *keeps*, forwards to grandparents, prints and tapes to the garage wall. It is the surface where "the coach who has been in this family's garage for every session" becomes legible, and it is the single strongest answer to the bystander-parent problem (the non-training parent who pays but never sees the work) and to virality (a beautiful year-in-review is the recruitment asset the roadmap's Gate 1.5 needs). Tier 2 is under-designed relative to its leverage. This lens gives it a spine.

**One architectural commitment governs everything below:** an artifact is *pure narration over already-settled facts* — the engine's Settlement/Permanence layers (Record Book, PP ledger, Trials cycles, `CapabilityState`, PactWeek) emit a **facts payload**; the model adds zero facts (coach-voice §6, binding). This means artifacts introduce **no new data source, no new authority** — they are a read-only projection of the permanence layer, reusing invariant I4 (append-only) and the Reason-record fact-traceability contract from adaptive-engine §6. That is also exactly why this system is high-value client-showcase material: it is a clean reference implementation of *constrained LLM report generation with mechanical anti-hallucination validation and deterministic fallback* — the pattern every enterprise "AI narrative/report" project actually needs and rarely gets right.

## The shared artifact contract (one spine, nine surfaces)

Every artifact is one row of a single schema, so the pipeline is built once:

```
Artifact {
  trigger        // event or cadence that fires generation
  facts_payload  // typed, engine-emitted, closed set of facts + refs
  prompt_delta   // this doc §1–5 verbatim + register table + payload + per-artifact framing
  gates          // fact-traceability · banned-lexicon · sibling-order · coverage · (+ keepsake gates)
  skeleton       // deterministic Tier-1-style fallback, always renderable offline
  surface        // big-screen moment | parent email | keepsake print | in-app permanent
  keepsake       // ephemeral (consumed) vs. treasured (designed to be saved/printed)
}
```

Generation is **always async, online, non-blocking, post-event** (Tier 2 rule). Pre-session artifacts are pre-rendered at the *previous* session's close / pre-generation moment (already online) and cached, so they display offline. A late-arriving beautiful artifact beats an instant hallucinated one; a plain instant skeleton beats both when the network is down.

### The catalog

| # | Artifact | Trigger / cadence | Surface | Keepsake? | Phase |
|---|---|---|---|---|---|
| 1 | **Pre-session briefing** | pre-gen of tonight's session | big-screen Reveal (pre-rendered) | ephemeral | P1–P2 |
| 2 | **Post-session recap** (Then-vs-Now) | session settlement | parent surface / next-open | ephemeral | P1 |
| 3 | **Weekly Pact digest** | Sun night, family-local | email to **both** parents | ephemeral | P1 (P0 templated) |
| 4 | **Monthly Trials Report** | Trials cycle settles | big-screen ceremony + print | **treasured** | P1 |
| 5 | **Skill graduation certificate** | rung-complete on a path | keepsake print + in-app | **treasured** | P1 |
| 6 | **Record Book chapter / Torch pass** | milestone chalked; torch pass | in-app permanent + share card | **treasured** | P1–P2 |
| 7 | **Season narrative** | quarterly | email + print | **treasured** | P2 |
| 8 | **Year-in-review** | annual (family anniversary) | interactive + print + share | **treasured** | P2 |

---

## Numbered proposals

**1. Pre-session briefing (pre-rendered).** *What:* a 2–3 sentence "here's what tonight is and why" richer than the Tier-1 Reveal line, drawing on the week's pattern debt, taper state, and one member's live streak. *Why this product:* the Reveal is "the product's opening handshake" (CONTEXT.md); a briefing that names *why tonight looks like this* is the adaptive engine's explainability made warm. *Phase:* P1–P2. *Cost:* **S** (payload already exists; it's the Reveal moment + a cache field). *Showcase:* med — "pre-rendered narration, zero runtime latency, offline-safe." *Risk:* if pre-gen is stale (roster changed at the door), briefing mismatches reality → gate on roster-hash match, else fall to Tier-1 Reveal line.

**2. Post-session recap — Then-vs-Now.** *What:* per-session close artifact, one named beat per member measured only against their own history ("Sam's squats: 21 in June, 27 tonight"), plus the family Pact position. Backlog "Then-vs-Now Recap," adopted P1. *Why:* the daily emotional payoff that makes the *next* session feel worth reserving (feeds Tomorrow's Card). *Phase:* P1. *Cost:* **M** (settlement payload + coverage gate + delivery). *Showcase:* high — the canonical "narrate a diff without lying about it" demo. *Risk:* a flat session risks a hollow recap → skeleton must handle "no PBs tonight" gracefully ("Three of you showed up on a Tuesday — that's the streak, not the highlight reel").

**3. Weekly Pact digest to both parents.** *What:* Sunday email: the family ring, each member line, one highlighted moment, the streak count — addressed to **both** parent emails on the account. *Why this product specifically:* this is the single highest-ROI artifact. Pre-mortem theme 5 (billing-parent bystander problem) is a named threat; the non-training parent pays and never witnesses the work. A weekly digest converts them from a churn risk into an advocate, and it's the natural forward-to-a-friend recruitment surface. *Phase:* P1 (a **templated** version ships P0-cheap — the digest need not be LLM to be valuable). *Cost:* **M** (email infra + payload; Clerk/Convex live in P1). *Showcase:* high — "automated weekly narrative digest, personalized, hallucination-gated." *Risk:* email = the one artifact leaving the family account; COPPA §5.3 — minors render as **nickname or initials per parent setting**, never full data. Gate: the digest is parent-addressed commercial-adjacent surface, so **zero coach commercial speech** (billing lives in UI chrome, never here).

**4. Monthly Trials Report — the flagship keepsake.** *What:* coach-voice §4's longest-form moment, promoted to a designed print/screen artifact: family headline (Progress Points) → one named moment per member vs. their own history → highlighted moment (rotated) → forward hook. Never a leaderboard; Dad's flat months framed through consistency. *Why:* Trials is the sacred ritual; the report is its ceremony's take-home. *Phase:* P1. *Cost:* **M** (payload is Trials-cycle settlement + PP ledger; §4 golden already written). *Showcase:* high — the demo centerpiece. *Risk:* the §4 golden currently miscounts a skill ladder (F7 — "step four of seven" vs. a 6-rung path); **goldens must be regenerated against real tables before this ships** or the eval bar is itself wrong. Highlighted-moment rotation needs the drought guard (Q15 ruling) baked into the payload, not the prompt.

**5. Skill graduation certificate.** *What:* on rung completion, a keepsake certificate: the path, the rung, the standard met, the witness, the date — the achievement statement is **hand-authored Tier-1a template text (sacred, verbatim)**; the LLM narrates only the surrounding one-paragraph story from the member's path history. *Why:* skills are the teen-drift answer; permanence *is* the reward (skill-progressions doc). A printable "belt earned" is the aspirational artifact a 14-year-old actually wants on the wall. *Phase:* P1. *Cost:* **M** (skill state + witness record + print template). *Showcase:* med-high — "safety/standard text is deterministic; only the color is generated" is a clean trust-boundary demo. *Risk:* the standard statement must never be LLM-varied (I1 immutable standards; skills rule) — hard separation of the certified fact (template) from the narration (LLM).

**6. Record Book chapter / Torch pass narration.** *What:* when a milestone is chalked or a **torch passes** (a kid finally out-does a parent — CONTEXT.md Torch Board), generate a short "chapter" writeup for the permanent ledger + a share card. *Why:* the torch pass is the product's most-earned emotional beat; it deserves prose, not a row. *Phase:* P1–P2. *Cost:* **M**. *Showcase:* med. *Risk:* torch pass is the one *sanctioned* cross-member comparison (kid-beats-Dad, that direction only, framed as family physics not defeat — coach-voice §5) — the sibling-ordering gate must **allow this specific structure** while still blocking sibling-vs-sibling. Requires a payload flag (`sanctioned_comparison: dad_torch`) so the lint doesn't false-reject.

**7. Season narrative (quarterly).** *What:* a ~1-page arc across three months — the family's trajectory, tier moves, the season's defining moment. *Why:* bridges monthly Trials Reports into a story with shape; the natural re-commit moment at a quarter boundary. *Phase:* P2. *Cost:* **L** (aggregation across cycles; storytelling is the hardest narration). *Showcase:* med. *Risk:* highest hallucination surface (most facts, most rope) → strictest coverage + traceability gates; skeleton must be genuinely good since a season is too important to render as a debug string.

**8. Year-in-review — the virality engine.** *What:* the "Wrapped" moment: an interactive + printable annual retrospective — total sessions, reps moved, every PB, every rung earned, the year's torch passes, per-member growth curves, the family's defining night. *Why this product specifically:* this is the recruitment asset (Gate 1.5 needs cold interest) and the retention re-commit rolled into one; it is the artifact families screenshot and post. *Phase:* P2. *Cost:* **L** (data viz + narrative + share infra). *Showcase:* **high** — the single most impressive client demo in the whole product. *Risk:* share surfaces render minors as nickname/initials (COPPA §5.3); the numbers must be exact (a wrong lifetime rep-count is a trust break) → every figure traces to the append-only ledger, no computed-in-prompt values.

**9. TTS / audio layer for Tier-1 lines (coach-voice OQ2).** *What:* spoken coach lines on the big screen. Because Tier-1 lines are **templated with a closed slot set**, the audio can be **pre-rendered at library-build time** and cached — not synthesized at runtime. *This is already the ruled direction* (digest Q14: "author the starter set audio-capable now; ship pre-rendered — never live-TTS — for the small starter set in Phase 0, cut-eligible"). Strategy: (a) render each *line template* to audio with slot-gaps, and pre-render the high-frequency *slot values* (names Sam/Ryan/Leo/Dad; small integers 1–100; seconds in 5s steps) as a splice library — concatenative playback = **zero runtime latency, offline, deterministic**, no per-family cloud TTS cost; or (b) simpler P0: pre-render only the **slot-free** lines (mid-set cues, missed-week returns, Trials announcements — none carry a number) as whole files, and leave number-carrying PB lines text-only until Phase 1. *Cost:* **S** (option b) / **M** (option a splicing). *Latency:* zero (pre-rendered). *Cost-to-serve:* one-time build-time TTS spend per approved line/value, `~$0` runtime. *Phase:* P0 starter set (cut-eligible), P1 full. *Showcase:* med — "voice with zero runtime inference cost via build-time pre-render + concatenation." *Risk:* concatenative splicing sounds robotic at seams; safety lines (Tier-1a) must be pre-rendered from the **exact hand-authored words**, never a TTS paraphrase; add an `audio_safe` tag to Tier-1 line metadata (some lines read fine but speak badly). **Candidate amendment:** none needed — this fits Tier-1's offline determinism exactly; it is authoring-time rendering, not a runtime call.

## Generation prompt strategy (shared)

One system prompt skeleton, per-artifact `prompt_delta`: **[coach-voice §1–§5 verbatim as hard constraints] + [register table §3] + [the typed facts payload] + [artifact framing: structure, length, surface] + [the moment-map goldens for this artifact type]**. The model's only job is selection and prose *within* the payload. Temperature low; the artifact is a keepsake, not creative writing. Few-shot with the §4 goldens (once F7-corrected).

## Validation gates (extend coach-voice §6)

Mechanical, pre-display, per artifact: (1) **fact-traceability** — every number/date/delta in output ∈ payload (hard); (2) **banned-lexicon lint** — bodies, diet, money, hype-caps, fabrication verbs; (3) **sibling-ordering** — block sibling-vs-sibling, *allow* `sanctioned_comparison` flags (torch, kid-beats-Dad); (4) **per-member coverage** — every participant gets a named moment; (5) **keepsake-only: rotation fairness** — highlighted-moment drought guard (Q15) enforced on the payload; (6) **keepsake-only: certified-text integrity** — Tier-1a standard/safety strings present verbatim, not paraphrased. Any failure → **deterministic skeleton fallback** (facts in a fixed template, always renderable, offline-safe). Founder taste-pass on a sample per model/prompt change; the family is eval zero.

---

## Fence-compliance check (self-audit)

- **No runtime LLM in the workout loop:** ✅ all nine are async post-event or pre-rendered-and-cached; none block a session. Pre-session briefing (#1) and audio (#9) are pre-rendered at online moments, displayed offline.
- **45-min cap / bodyweight / no gender:** ✅ artifacts are read-only projections; they touch no session structure and store no body/gender data.
- **COPPA:** ✅ digest/share/year-in-review render minors as nickname/initials per parent setting; artifacts are broadcast-not-chat; email + notifications are parent-addressed only; zero commercial speech in any coach artifact.
- **Founder reviews every library item:** ✅ Tier-1a certified text and every prompt/skeleton is founder-authored; Tier-2 output is gated + sampled, not merged unreviewed.
- **Offline-during-workout:** ✅ every artifact has a deterministic offline skeleton; audio is pre-rendered.
- **Out-of-scope fences (nutrition, wearables, CV, social feeds):** ✅ no artifact introduces any; share cards are export-to-save, not an in-product social feed.

## Open founder questions

1. **Digest recipients:** both parent emails by default (bystander-parent fix) — opt-out, or opt-in? Recommend **default-on to both**, one-tap unsubscribe; it's the cheapest churn-defense we have.
2. **Keepsake print pipeline:** PDF-to-print DIY vs. a real print partner for certificates/year-in-review? Recommend **PDF export P1**, revisit a print partner only if beta families ask (don't build fulfillment pre-demand).
3. **Torch-pass share card:** is a kid-beats-Dad share card something you'd actually post, or does it read as ranking your kids publicly? Family-test before building #6's share surface.
4. **Audio splicing (#9 option a) vs. whole-line-only (option b):** recommend **b for P0** (slot-free lines only, cut-eligible), earn a into P1 only if the family wants numbers spoken.
5. **Year-in-review timing:** calendar year vs. **family-anniversary** (first-session date)? Recommend anniversary — it personalizes and de-clumps the render load.
6. **Season narrative (#7):** is a quarterly artifact one keepsake too many between monthly Trials Reports and the annual, or the right re-commit beat? Lowest-confidence item; hold for P2 beta signal.
