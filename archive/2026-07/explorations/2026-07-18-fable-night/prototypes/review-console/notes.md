# Founder Batch-Review Console — prototype notes

_Overnight exploration, 2026-07-18. A **prototype**, not a decision — a preview of the Phase-1 "thin batch-review page" from `library-authoring-pipeline.md §5`, doubling as client-showcase material for human-in-the-loop AI pipelines. Open `index.html` by double-clicking; zero external requests._

## What it is
The human-in-the-loop surface where Michael reviews LLM-generated **library candidates** (exercises, blocks, coach-voice lines) for one gap brief. Governing spec: `library-authoring-pipeline.md §3` (review ergonomics) + `coach-voice.md §6` (review loop). It is the surface that makes the "nothing enters without founder approval" rule *survivable* — triage kills garbage first, the founder spends attention only on judgment.

## What the demo proves
1. **Triage before human review** — 12 generated → 4 auto-rejected (each with the gauntlet rule that killed it: metadata-incoherence, schema/enum, duplicate, sim-invariant) → 8 for review. The founder never sees the 4.
2. **The chain strip catches mis-ordering at a glance** — the load-bearing check. Each exercise renders the family's rungs in difficulty order with the candidate slotted between its *declared* neighbors. A mis-ordered candidate shows as a **non-monotonic difficulty sequence + age-gate inversion**, computed live and flagged red. `ex-002` (Negative Chin-Up) is the planted finding: declared "easier than Band-Assisted" but truly d6/11+ → the strip renders d2 → **d6** → d4 and calls it.
3. **Near-dup vs. chain-distinct** — `ex-003` (Box Jackknife) is flagged a 71% near-dup of `ex-001` and rejects; `ex-005` (Towel-Assisted) is *also* a cousin but the assist mechanism is genuinely different (44%, below threshold) → survives. The nuance the triage threshold has to get right.
4. **Voice: match-or-beat the golden** — candidate rendered slot-filled with the canonical family (Dad 42 / Ryan 14 / Leo 10 / Sam 8), side-by-side with the moment×register golden. `vx-002` plants **four findable violations** (Fabricator "I watched", sibling comparison "even Ryan at eight", banned lexicon "Level up!", Amnesiac — never names the record), each highlighted inline and mapped to its coach-voice rule.
5. **Keyboard review + live keep-rate health** — j/k navigate, A accept, E edit-then-accept, R → one-tap reason tags (1–6). Keep-rate gauge updates live with the `<30%` (broken) / `>85%` (rubber-stamp) warning bands drawn on the meter.
6. **Decisions → git** — end-of-batch summary shows the `decisions.json` that would be committed back (library stays master), the acceptance-stack that runs before merge, and the **batch coda**: one sim-generated 30-min session with the accepted items (`ex-001`, `ex-005`, `bk-001`, `vx-001`) sitting in context next to real neighbors.

## Suggested review path (to see everything)
Accept `01`, reject `02` (mislabeled-difficulty / reason 1), reject `03` (duplicate / reason 4), edit `04`, accept `05`, accept `06`, reject `07` (voice-off / reason 6), edit `08`. → keep rate lands ~62% (healthy band). Then **Batch summary →** (or press `S`).

## The 8 candidates
| # | id | type | role in the demo |
|---|---|---|---|
| 01 | ex-001 | exercise | clean accept · monotonic chain, strong sim evidence (22/40) |
| 02 | ex-002 | exercise | **mis-ordered chain** (the planted finding) — non-monotonic + age inversion; sim "never selected in under-10 rosters" reinforces the mislabel |
| 03 | ex-003 | exercise | **near-duplicate** of ex-001 (71%) |
| 04 | ex-004 | exercise | clean, but **low-confidence time-model flag** → edit-then-accept |
| 05 | ex-005 | exercise | cousin of ex-001 but **chain-distinct** (44%) → survives |
| 06 | vx-001 | voice | clean session-open line, matches golden |
| 07 | vx-002 | voice | **4 planted coach-voice violations**, findable |
| 08 | bk-001 | block | structure diagram + time-model estimate (9.5m) vs sim realized (11.2m) → edit |

## What's faked (would be real in Phase 1)
- **All candidate data is hand-authored fiction** — no real LLM batch, no real generator run.
- **Triage rules don't execute** — the 4 auto-rejects and their reasons are canned, not computed. Real triage is the planner-spec script.
- **Sim evidence ("selected in N of 40") is invented** — real numbers come from the 8-week longitudinal harness.
- **Chain-strip check is the one thing that IS real logic** — monotonicity + age-gate inversion are computed live from the candidate's declared neighbors. This is the mechanic worth keeping.
- **Keep-rate math is live** (accept÷reviewed); the bands are the spec's `<30%`/`>85%`.
- **"Commit decisions" is a no-op.** The `decisions.json` is generated from live state but nothing is written.
- The approved chain (Dead Hang → Active Hang → Band-Assisted → Negative → Chin-Up → Pull-Up) is illustrative, not the real seed library.
- Rung tags like "Pull-Up · rung 2.5" are placeholders — the real skill-path uses integer rungs; assisted variants aren't skill-path rungs, they're swap-chain positions. (Deliberately loose here to show the chip; flag for a real spec pass.)

## Design decisions
- **Dark "forge console"** — intentional single theme (an overnight garage tool for a developer-founder). Premium/athletic, never gamey.
- **Three-way type split, on purpose:** geometric display (Futura) for chrome, mono (SF Mono/Menlo) for machine data/chips/JSON, **serif (Charter) for coach voice** — so human speech reads as visibly distinct from tooling. Reinforces the coach-voice review as a *taste* judgment, not a data-entry task.
- **Fonts are all local** (offline constraint: no web fonts). Stacks degrade gracefully off-Mac.
- Keyboard-first with a persistent legend; every action has a hotkey, matching the spec's "reviewable in found minutes" intent.

## Founder questions
1. **Is the chain strip the right primary artifact?** It's built as the at-a-glance mis-ordering check per §3. Does a horizontal difficulty ladder with d-scores read faster than, say, a vertical list — and is a made-up integer "difficulty score" (d1–d8) the right internal representation, or should ordering be purely relative (position, no number)?
2. **Reason-tag set** — the six here match the spec (`mislabeled-difficulty, unsafe-cue, not-real-vocabulary, duplicate, my-family-wouldn't, voice-off`). Missing any you'd actually reach for? Should voice-lint auto-suggest a tag (it already knows the violation)?
3. **Keep-rate as a live nag** — showing it update per-decision could bias the reviewer toward the healthy band mid-batch (anchoring). Show it live, or only reveal at end-of-batch? Spec treats it as a per-batch signal, not a live one.
4. **Edit-then-accept fidelity** — right now edit is one free-text field. Real edits touch structured metadata (re-slot a chain position, fix a time-model constant, reword a line). Does edit need per-field forms, or is "capture the intent as text, agent applies it" enough for Phase 1?
5. **Should the coda re-plan live** as decisions change, or is a fixed end-of-batch coda fine? (Here it's built from final accept state on open.)
6. **Voice violation highlighting** — the four planted violations in `vx-002` are hover-titled and lint-listed. In real use the lint runs pre-review (triage). Should a voice line with *hard* lint failures even reach the founder, or only "clean-but-taste" lines, per the §3 gauntlet?
