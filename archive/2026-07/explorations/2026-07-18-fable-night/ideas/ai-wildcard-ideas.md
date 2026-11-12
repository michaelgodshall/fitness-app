# AI Wildcard Ideas — the weird-but-maybe-brilliant tier

_Fable-night exploration, 2026-07-18. Twelve unconventional AI features, ranked with kill-rate honesty. Every idea is checked against the hard fences (no runtime LLM in the workout loop in v1; 45-min cap; COPPA broadcast-not-chat, nickname+birth-year, no PII from minors; no gender; founder reviews every library item; offline-during-workout; no wearables/CV-form/nutrition/social through Phase 2). The design constraint that shapes all of these: **the coach's authority is the family's own record, and the LLM only ever touches authoring-time or async artifacts — never the live session.** The good ideas exploit that; the bad ones fight it._

**Bar:** these must beat the brief's own examples (year-end letter, trading cards, commissioner, log poetry). No sycophancy — most of these should die or defer. Top 3 marked ★.

---

## 1. ★ The Sealed Letter From This Year
The coach writes each member a one-page letter at season's end — **not** to their future self as a greeting-card gesture, but a letter *from the year that actually happened*, in the coach's constrained voice, built only from logged facts: "In March you couldn't hold a dead hang. You closed the year at 30 seconds and counted your brother's out loud." Sealed on the big screen, opened next season, and it re-writes itself every year as a permanent Record-Book companion. This is the single most product-true idea here because *memory is the entire thesis* (coach-voice §2) — the letter is what a coach who's been in the garage for a year would actually write, and no competitor without the log can fake it.
- **What/why-this-product:** the async Tier-2 pipeline already emits structured facts and validates every number against them; a letter is a Trials-report sibling with a longer horizon. Uniquely ours because it's mechanically un-fakeable without the family's record.
- **Phase fit:** Phase 1 (rides coach-voice v1 + Tier-2 harness). **Cost:** S — new prompt + fixture, no new engine.
- **Showcase value:** high — "structured facts → emotionally-load-bearing prose with 100% fact-traceability and a banned-topic linter" is the exact demo a consulting client wants, and it's safe to show because there's no live minor interaction.
- **Devil's advocate:** the emotional bar is brutal — a flat letter is worse than none, and the Amnesiac/Fabricator failure modes are unforgiving at length. Founder taste-pass is mandatory; this is not a ship-and-forget artifact.

## 2. ★ The Torch Pass Prophecy
At each Trials the async engine already knows every member's capability trend and the gap to Dad's standing records; it computes the projected date a kid crosses each one and writes a single dated, hedged line into the Record Book: "On current pace, Leo passes Dad's pull-up record around March 2027 — the Torch Board is watching." It aims a real number at the exact emotional center of the father-son brand wedge, turning the abstract Torch Board into a countdown the family feels. Because it's derived from logged trend + gap meter (adaptive-engine §1), it's honest math, not hype — and the moment it finally happens is the product's biggest designed payoff.
- **What/why-this-product:** the brand is literally "kid eventually beats Dad"; nothing else productizes anticipation of that moment. Fact-derived, async, renders only in-family.
- **Phase fit:** Phase 1 (needs a few Trials cycles of trend). **Cost:** M — a projection function + confidence framing + Record-Book write path.
- **Showcase value:** high — predictive + narrative + honesty-guardrail in one; demos well.
- **Devil's advocate:** projections that slip past the predicted date breed quiet disappointment, and a too-eager estimate reads as pressure on the kid. Must ship with wide honest bands and a rule that it never *counts down* out loud to an under-11 (PB-visibility age gate, CONTEXT §PB Watch).

## 3. ★ The Archivist — ask your own history
A parent-surface Q&A that answers questions against the family's own logged record in natural language: "When did Leo first do a real push-up?" → "Session 34, October 12 — after nine weeks on the incline." It's the coach's clipboard made queryable, and it turns a year of event-sourced logs (engine-data-model) into something the parent actually explores, which is retention gold. This is the most *consulting-showcase-valuable* idea in the set: RAG over a structured domain log with a COPPA-clean boundary (parent-only, about their own kids, no open-ended minor dialogue).
- **What/why-this-product:** the log is rich and structured; semantic retrieval over it is cheap and uniquely ours. Answers cite the exact session, so it inherits the fact-traceability discipline.
- **Phase fit:** Phase 1/2. **Requires a bounded amendment:** an LLM call at *query time* on the parent surface — this is explicitly **not** the workout loop and **not** a minor-facing chat, so the v1 fence holds, but it must be framed honestly as a new online surface, parent-authenticated, never reachable from a controller.
- **Cost:** M — retrieval index + answer-with-citations + strict "no number not in the log" validator.
- **Devil's advocate:** any free-text LLM surface is a jailbreak/PII-leak surface; it must be parent-gated, read-only over the family's own data, and never able to speak *to or about* a minor outside family surfaces. If that boundary feels fragile, defer to Phase 2 with a full review.

## 4. The "Why Tonight Looks Like This" note
The planner already emits a Reason record for every decision (adaptive-engine §0.3); an async weekly note turns those into a short parent-facing explanation of the programming — "I kept Tuesday light because Trials land Saturday; Leo's push volume is up so his targets moved." It builds the parent's trust in a deterministic black box by making it legible, which is a real retention lever for a coach with no human behind it.
- **Phase fit:** v1-adjacent (Phase 1 async; the Reason records exist from day one). **Cost:** S — narrate existing Reason records, no new logic.
- **Showcase value:** high — "explainable planner as a content surface" is a clean agentic-transparency demo.
- **Devil's advocate:** risks becoming The Academic (coach-voice anti-pattern) — nobody asked for a lecture. Keep it to three sentences, opt-in, parent-only; if the founder's family ignores it twice, kill it.

## 5. The Season Saga
A year-end long-form chronicle of the family's season in the coach's voice — not a poem gimmick, a *mythologized-but-true* legend read aloud at the big screen: the night of the first muscle-up negative, the twelve-day lapse and the return, the torch that nearly passed. Better than the brief's trading-card and poetry examples because it's narrative continuity, not a novelty artifact, and it's the kind of thing a family re-reads.
- **Phase fit:** Phase 1 async (Tier-2). **Cost:** S-M — a longer Trials-report sibling with a multi-month facts payload.
- **Showcase value:** med-high — long-form generation under a hard fact/lexicon constraint.
- **Devil's advocate:** overlaps heavily with #1 (the Letter) and the monthly Trials Report; three retrospective artifacts is one too many. Likely **merge into #1 or the Trials Report** rather than ship standalone.

## 6. Trials Scouting Report
The night before Trials week, an async per-member note names the single test where they're closest to a tier crossing — "Sam, your squat is one good day from Trainee" — turning the sacred benchmark into a personal target without ever gaming the fixed standard. Derived from capability state vs. tier thresholds; motivational, not manipulative.
- **Phase fit:** Phase 1 async. **Cost:** S — threshold-distance calc + one line per member.
- **Showcase value:** med.
- **Devil's advocate:** must respect the under-11 PB-visibility gate (render private by default) and never imply a kid *should* have crossed a line they didn't — the missed-week zero-shame discipline extends here. Medium kill risk if it starts to feel like pressure.

## 7. Belt Ceremony scripts for rung unlocks
When a skill rung unlocks, the coach generates a short witnessed-ceremony script for the family to perform live — the witness declares it, the Torch Board line is read, the next rung is named. Templated at authoring time (offline-safe, slot-filled), it makes the "belt earned" framing coach-voice already wants (§4 skill unlock) into a repeatable family ritual.
- **Phase fit:** Phase 1 (authoring-time templates, in-session slot-fill — fence-clean, no runtime LLM). **Cost:** S.
- **Showcase value:** low-med.
- **Devil's advocate:** ceremony scripts are one bad line away from the Entertainer anti-pattern; a 14-year-old will cringe. Keep it dead-simple and founder-authored, or it dies in the garage.

## 8. The Ghost of Last Tuesday
On a benchmark block, the big screen renders a deterministic *pace-ghost* of the member's own prior best — a racing-game ghost of last time's rep cadence — so "beat last time" becomes visceral and offline. Honest disclosure: this is barely "AI" (it's a deterministic replay of the log, no model), but it's the most *product-true* idea here and it makes the engine's core "beat last Tuesday: 64" moment (experience-doc canon) land physically.
- **Phase fit:** v1 (deterministic, offline, in-loop — fully fence-compliant *because* it's not an LLM). **Cost:** M — needs per-rep timing in the log and a big-screen animation.
- **Showcase value:** low as an *AI* demo (it isn't one); high as product.
- **Devil's advocate:** requires per-rep timestamps the log may not capture in v1 (controllers are optimistic loggers, not rep-timers), and a ghost you're losing to could shame a kid — needs the same zero-shame framing. Include for completeness, but it's a UX bet, not an AI bet.

## 9. The Commissioner (Phase-3 league agent)
For Phase-3 squad leagues, a persistent agent that runs a season: mints matchups across the 4-6 family Squad, arbitrates the fixed rules, writes standings recaps, flags a family drifting toward a missed Pact. The brief's example, sharpened into a genuine multi-agent showcase.
- **Phase fit:** Phase 3. **Requires amendment** by definition (runtime/persistent LLM, community surfaces both out-of-scope through Phase 2). **Cost:** L.
- **Showcase value:** high — a real agentic-orchestration story for clients.
- **Devil's advocate:** everything hard about it (community moderation, minor-safety across families, fabrication in recaps) is unsolved and years out. Strong *demo*, weak *near-term product*; park it as a Phase-3 north star, don't let it pull scope forward.

## 10. Playground Scout
The founder points a phone at a park or playground; a vision model proposes bodyweight movements that use that equipment and drafts library candidates (with pattern tags, swap-chain position) into the founder-review queue. It attacks the real bottleneck — library breadth at founder-review throughput (authoring-pipeline §2) — and the "park-bar rung as an outing" concept (CONTEXT) makes real-world equipment product-relevant.
- **Phase fit:** Phase 1 authoring. **Fence check:** CV used at *authoring* time as a founder input, never runtime form feedback — but this sits *right next to* the out-of-scope CV fence and will read as creep.
- **Cost:** M. **Showcase value:** med (multimodal authoring).
- **Devil's advocate:** the founder's 16 months of lived data already generates better candidates than a photo will, and it burns review budget triaging speculative items — the pipeline is explicitly demand-driven, not breadth-hungry. **Probable kill / defer.**

## 11. Synthetic Rival "ghost family"
For solo or small families, the sim generates a synthetic rival family with an authored personality to pace against in co-op Challenges — a house AI opponent that's honest about being synthetic.
- **Phase fit:** Phase 2 (Squads/Challenges). **Cost:** M.
- **Showcase value:** med.
- **Devil's advocate:** collides head-on with the Fabricator anti-pattern (coach-voice §1) — the coach must *never* imply the rival is real, and a synthetic opponent for kids flirts with exactly the fake-competition the product's "measured against your own past self" thesis rejects. **Likely kill** — the real Squad mechanic (real families) is the honest version.

## 12. Earned Trading Cards, mechanically-true
The brief's trading-card idea, fixed: cards mint from *actual* Trials capacity tiers plus the member's signature pattern (their strongest movement), so the stats are real and un-inflatable — a card is a certificate, not a toy. Season art is an **abstract generated crest/emblem, never a likeness of the child.**
- **Phase fit:** Phase 2. **Cost:** M. **Showcase value:** med.
- **Devil's advocate:** any generated *image* of or for a minor is a COPPA/likeness/shareability minefield, and cards edge toward the XP-dispenser anti-pattern the coach voice bans. Keep the stats, kill any child-likeness art, and question whether this earns its build over the Record Book it duplicates. **Medium kill risk.**

---

## Fence-compliance check (my own proposals)

| # | Idea | Runtime-LLM-in-loop? | COPPA | Offline | Other fences | Verdict |
|---|------|------|-------|---------|--------------|---------|
| 1 | Sealed Letter | No — async Tier-2 | In-family, nickname | N/A (async) | Clean | **Ship-track** |
| 2 | Torch Prophecy | No — async | Age-gate PB visibility | N/A | Clean | **Ship-track** |
| 3 | Archivist | Query-time, parent surface — **not** workout loop, **not** minor chat | Parent-gated, read-only own-data | Online (parent, non-session) | Needs explicit amendment framing | **Ship w/ bounded amendment** |
| 4 | Why-Tonight note | No — narrates existing Reason records | Parent-only | N/A | Clean | Ship-track |
| 5 | Season Saga | No — async | In-family | N/A | Clean but redundant | Merge into #1 |
| 6 | Scouting Report | No — async | Under-11 PB gate applies | N/A | Clean | Ship-track (watch pressure) |
| 7 | Belt Ceremony | No — authoring-time templates, in-loop slot-fill only | In-family | Offline-safe | Clean | Ship-track (cringe risk) |
| 8 | Ghost | No — deterministic, not an LLM | Zero-shame framing | **Offline by design** | Clean; needs per-rep timing | Ship-track (UX not AI) |
| 9 | Commissioner | Yes (Phase 3) | Cross-family minor safety unsolved | N/A | Community out-of-scope thru P2 | **Requires amendment / Phase 3** |
| 10 | Playground Scout | No — authoring-time CV | Founder-only | N/A | **Adjacent to CV out-of-scope fence** | Defer/kill |
| 11 | Synthetic Rival | No | — | — | **Fabricator anti-pattern** | Likely kill |
| 12 | Trading Cards | No | **Child-likeness art = COPPA risk** | N/A | XP-dispenser adjacency | Kill the art, question the rest |

No idea proposes an LLM call inside the live workout loop. The three that touch new surfaces are flagged: **#3 Archivist** is the only one needing an explicit *candidate amendment* (a parent-facing, non-session, read-own-data LLM query surface — argued honestly: it is outside the workout loop and outside minor-facing chat, so it does not breach the v1 spirit, but it is a new online surface that deserves its own COPPA/security review before build). **#9 Commissioner** and the community/CV-adjacent ideas (#10, #11, #12-art) are correctly parked beyond Phase 2.

## Open founder questions

1. **Retrospective-artifact count:** Sealed Letter (#1), Season Saga (#5), and the monthly Trials Report already overlap. Recommendation: **ship #1, fold #5's ambition into it, keep the Trials Report monthly** — three nostalgia surfaces dilutes each. Agree?
2. **Archivist (#3) — is a parent-facing free-text LLM surface in-appetite at all before Phase 3?** My rec: yes but Phase 2, with a hard read-only-own-data boundary; it's the strongest client showcase and the COPPA story is defensible. Your call on whether any free-text surface is worth the jailbreak/PII exposure this early.
3. **Torch Prophecy (#2) honesty dial:** how hedged, and do we ever surface the projected date to an under-11, or parent-only until they cross? Rec: parent-only until the actual pass, then a full family Reveal.
4. **Ghost (#8):** worth capturing per-rep timing in the v1 log to enable it later, or is that log-schema weight we don't want against optimistic controllers? Rec: log rep timestamps opportunistically (they're cheap when a controller is present), decide the feature later.
5. **Kill confirmations:** I'm recommending we kill/defer #10, #11, and the art half of #12 now. Any of them you want kept alive as an experiment?
