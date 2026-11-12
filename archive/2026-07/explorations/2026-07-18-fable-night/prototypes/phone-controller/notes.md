# Phone Controller — prototype notes

_Exploration prototype, 2026-07-18 Fable night. **Not a decision** — a clickable straw-man for Michael to react to in the morning._

Governing spec: `docs/design/workout-experience.md` §2 (Phones as controllers) + `§1` (session arc, for lobby/close mirroring) + `CONTEXT.md` ubiquitous language + `docs/design/coach-voice.md` §3 (14-year-old register) for the close line.

Persona: **Ryan, 14** — the product's hardest retention problem (teen drift). Everything is tuned to the teen register: straight talk, real rationale, no hype, no cartoon.

File: `index.html` — single self-contained file, zero external requests, inline CSS/JS, embedded fake data. Double-click to run, or serve over localhost. Designed at 390px, centered in a phone-frame chrome so it presents on desktop too.

---

## Flow covered (the 6 asked-for states, in order)

1. **Join** — 4-letter room code (prefilled `GRIT` for the demo; per-box entry, auto-advance) + QR affordance. Copy reinforces the COPPA posture: "No account, no install — you're in for tonight only."
2. **Pick who you are** — member tiles (Dad 42 / Ryan 14 / Leo 10 / Sam 8, the doc-canon family). Ryan auto-preselects (his tile lit ember). Tiles show live join state (Dad joined, Leo "on Dad's phone" = parent proxy, Sam open).
3. **Lobby / ready** — mirrors the big screen: Pact ring ("Session 2 of 3 this week"), roster chips with join state, time dial (30 min, "Dad set 30 · 45 is the ceiling"), and an **any-member start** button ("Everyone in — Start") with the note that it mirrors the big screen (spec S1: a kid can start the night).
4. **Per-set logging** — block strip + live session clock; exercise at Ryan's rung ("◆ Your rung · Full push-up"); big **rep stepper prefilled with the target** (84px thumb targets), giant tabular-mono counter, full-width **Log set**. On log: optimistic local echo + a **"Tonight" strip** that shows each entry flip from `pending` → `synced`.
5. **Difficulty swap** — "Too hard ↓ / Too easy ↑" opens a sheet offering the **adjacent swap-chain rungs** (Knee ← Full → Decline), labeled plainly *on the phone only*; **applies from the next set** (toast: "…in on your next set. The room just sees the new name."). Locked on the **benchmark** set ("measured — locked").
6. **Bounded effort check-in** — fires **once, after set 1**: "That set — how'd it land?" → **Easy / Right / Too much**, three buttons, explicit "no free text, by design" note. This is the only open input, per COPPA.
7. **Done** — total reps, per-exercise summary (squat flagged **NEW PB** in ember), one **coach line in Ryan's register** (numbers + trajectory + the muscle-up hook + a forward tease, every number traceable to the log), and a note that the PB is **chalking into the Record Book on the big screen** (the family moment lives there, not here).

**Big-screen authority** is reflected throughout: a top-bar **SYNCED / Syncing** pill, per-entry pending→synced ticks, and copy that always frames the phone as the personal lens and the big screen as where the family moment (PBs, Pact, Chalking) actually plays. The phone is an optimistic logger; nothing it does blocks training.

---

## Key design decisions

- **Dark, premium-athletic, instrument-panel numerals.** Tabular monospace for every count/timer/clock (a gym-timer/stopwatch feel); clean sans for text. Ryan's member color is an **ember/torch** accent (grit/iron/Torch-Board motif). No emoji in coach speech; functional glyphs only in UI chrome (◆ ⚑ ✓), which coach-voice.md §1 explicitly permits.
- **Swap applies from the *next* set, not the current one** (spec §2). Teaches the correct mental model and avoids mid-set rewrites. Benchmark sets are swap-locked for fairness (Trials/benchmark integrity).
- **Effort check-in is deliberately post-hoc and non-blocking** ("tunes tomorrow's targets, not tonight's") so it never feels like a gate. Fires once so it stays cheap; a real build would fire on a sampling cadence, not every set.
- **Coach line is slot-filled from the actual logged numbers**, not hardcoded — if the squat misses the best, the line switches to the down-session template ("The log doesn't need a reason — it needs Thursday."). Keeps it fact-traceable (coach-voice §2, "clipboard not camera").
- **No brand name committed.** The join screen says "Controller," not a product name — naming is undecided (Grithouse is only the front-runner pending the kid smirk-test). A sibling big-screen prototype in this same session did commit to "GRITHOUSE / The Godshalls"; if that's the house style Michael wants, this file should adopt it, but I left it neutral on purpose.

## What's faked / stubbed

- **All data is embedded**: one hardcoded 4-set track for Ryan (2× push-ups, 1 benchmark squat set, 1 hollow hold). No planner, no swap-chain data model, no capability state.
- **"Sync" is a setTimeout**, not a real subscription — pending flips to synced after ~850ms to *feel* the optimistic-log → big-screen-ack choreography. No actual big screen, no room, no reconnect/replay.
- **Room code accepts anything** (GRIT prefilled); no validation, no QR scan.
- **Rest timer is real** (counts down, skippable) but the durations are demo values (45s / 60s for benchmark).
- **The effort answer changes only a toast**, not any target math. Capability-state feedback is not modeled.
- **Parent-proxy, timed-hold-as-partner-stopwatch, AMRAP chunk buttons, Ghost Bar, Secret Assignment, slice/catch-up entry** — all out of scope for this pass (single logging pattern shown: prefilled stepper).
- Phone-frame chrome (island, status bar, 5G) is cosmetic.

---

## Top open UX questions for the founder

1. **Effort check-in cadence & placement.** After set 1 only (here), every set, or sampled? And does the answer visibly do anything, or stay silent input to the engine? Every-set risks nag fatigue with a 14-year-old; never-visible risks feeling pointless. My lean: sampled (1st set of a new exercise) + silent, with a rare "coach nudged your target" surfacing.
2. **Swap on the phone vs. the shared-frame shame rule.** The phone labels rungs plainly (easier/harder) — correct per spec — but should Ryan even *see* "Too hard" as a word, or is a neutral "Adjust" better for the teen's ego? The spec says plain labels are phone-private; worth a garage gut-check on whether "Too hard" stings at 14.
3. **How loud should the phone's PB moment be, given the big screen owns the ceremony?** Here the phone stays quiet (ember number, small "chalking on the big screen" line) so it doesn't steal the room's beat. But a solo/slice session has *no* big screen — does the phone then need to become the ceremony surface, and how do we keep one component doing both without either feeling wrong?

## Try it

Open `index.html` directly, or: `python3 -m http.server` in this folder, then load `index.html`. GRIT is prefilled — tap through Join → Ryan → Start, then log sets; bump the squat set above 18 to trigger the PB path (target 20 already does).
