# Design-Layer Adversarial Review — Findings

_Review doc — 2026-07-06 (adversarial consistency pass). Scope: PLAN.md, docs/01-03, ADR-001, and all seven docs/design/ files. The governing docs survived 5 review rounds; the design docs did not — this pass hunts the drift between them. Findings only; no other doc was edited. Every finding is OBSERVED from reading the current files this session._

**Totals: 4 Critical · 8 High · 13 Medium · 5 Low (30 findings), plus a consolidated founder-question list (§Founder questions)._**

**Disposition status (2026-07-06, same session):** FIXED — F1, F2, F3 (Pact spec now in planner spec), F4 (slice contract + surface), F5, F6, F8, F12, F16, F17, F18, F20, F23, F24, F26 (header). COVERED — F11 (adaptive-engine.md landed: target computation + placement-by-training initialization; fold its §9 deltas into the planner spec alongside F9). **REMAINING for next session (first task, in order):** F7 (regenerate voice goldens against skill tables), F9 (fold skills-doc planner deltas into H8), F10 (unlock-moment timing — recommend test-time + close recap), F13, F14, F15 (PB-model spec), F19 (age-band enum), F21 (durable anonymous family doc), F22 (Trials battery + tier tables — Phase 1 blocker), F25, F27-F30. Founder decisions: §Founder questions below (18 items).

Severity rubric: **Critical** = an agent building Phase 0 from the docs as written ships the wrong product or cannot proceed. **High** = wrong behavior or corrupted quality bar, discoverable only by cross-reading. **Medium** = phase/spec drift that will surface as a bug or a blocked task later. **Low** = staleness/hygiene.

---

## Critical

### F1 — Ratified amendments to workout-experience.md were never applied
**Files:** `pre-mortem-and-backlog.md` §Net effect ↔ `workout-experience.md` §§S1, S3, 2, phasing map
The pre-mortem marks four adopted Phase 0 changes — any-member start, age-gated PB Watch defaults (under-11 private), Ghost Bar, Secret Assignment — as "annotate at next revision (amendments listed here are authoritative)," but workout-experience.md still specifies the pre-amendment design: §S3 puts every member's PB Watch on the shared screen with no age default, §S1 has no any-member-start note, and Ghost Bar / Secret Assignment appear nowhere in the phone-surface table or phasing map. An agent building from the experience doc ships public PB numbers for the 9- and 10-year-old — the exact child-facing exposure the pre-mortem panel flagged.
**Fix:** Apply the four amendments into workout-experience.md (S1 lobby, S3 PB Watch defaults, §2 phone surfaces, phasing map) with a pointer to the pre-mortem ratification.

### F2 — The authoritative Phase 0 build list is not derivable from the docs
**Files:** `docs/03-roadmap.md` §Phase 0 ↔ `PLAN.md` §Approach-1 (cut order) ↔ `pre-mortem-and-backlog.md` §Idea backlog
Three docs imply three different Phase 0 scopes: the roadmap lists 7 build items; PLAN's cut order implies additional in-scope items it never lists as builds (phone controllers, Ghost Bar, Secret Assignment, coach-voice templates, Torch Board, Record Book list); and the pre-mortem's "Adopted into Phase 0" table adds **Tomorrow's Card** and **Session Authorship Token**, which appear in no other doc. An implementing agent cannot tell what Phase 0 actually contains.
**Fix:** Make roadmap §Phase 0 the single canonical build list (add the adopted items or defer them explicitly); founder ratifies or defers Tomorrow's Card and Session Authorship Token.

### F3 — The weekly Pact — the product's retention core — has no spec anywhere
**Files:** all — referenced in `docs/01` P8, `workout-experience.md` S1/S5 (family ring, "Session 2 of 3"), `session-planner-spec.md` (micro-session credit; abort halfway rule), `pre-mortem-and-backlog.md` (per-member "Pact line"), `PLAN.md` §Approach-2 ("session-equivalents," "Pact machinery holds")
No doc defines the Pact: the weekly target (fixed 3? configurable?), family-ring vs per-member-line accounting (both are referenced), what qualifies a session, how solo slices and micro-sessions convert into the gate's "session-equivalents," week boundaries, or reset behavior. It is a Phase 0 build item (roadmap item 4) and load-bearing for Gate 0→1.
**Fix:** Add a Pact spec section (planner spec is the natural home): target, qualifying rules, member-line ↔ family-ring aggregation, slice/micro/solo credit, week boundary and reset.

### F4 — Async slice-completion (Phase 0 build item 7) has no planner contract and no UX
**Files:** `docs/03-roadmap.md` §Phase 0 item 7 / `PLAN.md` §Approach-1 ↔ `session-planner-spec.md` (no mention) ↔ `workout-experience.md` (no mention)
The ratified async-slice substrate — load-bearing for the non-synchronous gate week — appears in the governing docs only: the planner spec has no operation for extracting a member's scaled portion of a session, and the experience doc has no slice surface (how a slice is generated, joined via room-code, displayed, logged, or credited). Solo-member mode (§3) covers a solo *session*, not a slice of a missed shared one.
**Fix:** Add a `plan_slice(session, member)`-style contract to the planner spec and a slice-surface section to workout-experience.md.

---

## High

### F5 — Strategy doc promises a "lifetime discount" that PLAN explicitly bans
**Files:** `docs/02-product-strategy.md` §Monetization ("founding-family lifetime discount honored at launch") ↔ `PLAN.md` §Approach-3/-5 ("no lifetime promises," "never 'lifetime'")
Recruitment materials drafted from the strategy doc would make the exact promise the plan prohibits.
**Fix:** Reword strategy doc to "founding-year price honored (no lifetime promises), per PLAN §Approach-3."

### F6 — Vision doc lists 4 skill paths; everything downstream has 5
**Files:** `docs/01-product-vision.md` §The product ↔ `PLAN.md` §Approach-1, `docs/03-roadmap.md` §Phase 0 item 5, `skill-progressions.md`
The vision's skill-progressions line omits the Pull-Up path — the one PLAN calls the universal on-ramp and the last path in the never-cut order. Agents treating the vision as the top of the doc stack inherit the stale count.
**Fix:** Add pull-up to the vision's path list (5 paths, pull-up first).

### F7 — Coach-voice golden lines contradict the skill ladders they narrate
**Files:** `coach-voice.md` §4 (Skill unlock, Session open) ↔ `skill-progressions.md` paths 2, 4, 5
Four goldens are factually wrong against the ladder tables: "step four of **seven** on the muscle-up path" (path has 6 rungs) followed by "Next: **chest-to-bar**" (chest-to-bar is rung 1, *before* negatives; the actual next is The Muscle-Up); "**Box pistols** unlocked" (no such rung — rung 3 is Single-Leg Chair Squat); "Ten-second tuck front lever… **Advanced tuck is next**" (Tuck Lever 15 is next); and the session-open line schedules muscle-up negatives in a weekday home block though rungs 3–6 are park-bar-only by design. These lines are declared "doc-canon… the eval goldens," so the errors become the quality bar for the whole Tier-1 library and violate the doc's own fact-traceability rule.
**Fix:** Correct the four lines against skill-progressions.md and add "goldens must be consistent with the skill tables" to the §6 eval checklist.

### F8 — The first-Trials calibration rule (no Progress Points) is missing from both Trials design docs
**Files:** `PLAN.md` §Approach-3 / `docs/03-roadmap.md` §Phase 1 ("first Trials = calibration baseline, mints no Progress Points") ↔ `trials-and-challenges.md` (silent) ↔ `workout-experience.md` §4 step 5 (PP "animate onto the family running total," unconditional)
At a family's first Trials every result is an "all-time best," so the trials doc's PP rule as written mints a meaningless jackpot — exactly what PLAN's calibration rule prevents; neither design doc carries it.
**Fix:** Add the calibration-baseline/no-mint rule to trials-and-challenges.md §Two-axis scoring and to the experience doc's Trials ceremony step 5.

### F9 — Skill-block architecture diverges between planner spec and skills doc, and the skills doc's declared planner deltas were never folded in
**Files:** `session-planner-spec.md` H8 ↔ `skill-progressions.md` §Session-engine integration
H8 says ≤8 min, skippable, with an example where only the teen does skill work while "younger kids run their circuit"; the skills doc says fixed 6 min, placed as the first work block after warm-up, all-family **parallel stations** (everyone has a rung via Pull-Up), plus gap-proximity drop protection. The skills doc lists four "planner-spec deltas to fold in" (`skill_path`/`rung`/`household_surface` metadata, concretized skill-stage state, drop protection, straight-arm weekly volume cap) — none is in the planner spec, whose library-metadata list omits all three tags.
**Fix:** Fold the four deltas into the planner spec and restate H8 to match the skills doc's v0 shape (or mark explicitly which doc wins).

### F10 — Rung-unlock moment timing is specified three different ways
**Files:** `docs/03-roadmap.md` §Phase 0 item 5 + `pre-mortem-and-backlog.md` theme 2 ("unlocked beat **at session close**") ↔ `skill-progressions.md` §Motivation 3 / rule 5 (full-screen moment **at test time**, top of the skill block) ↔ `workout-experience.md` S5 (close sequence has PB beats, **no skill-unlock beat at all**)
**Fix:** Pick one (recommend: full-screen moment at test time + one-line recap in the S5 close) and align all three docs.

### F11 — Per-member set targets and day-one capability placement are unspecified
**Files:** `workout-experience.md` §S3/§2 (per-member targets "Dad 15 / Max 12 / Ryan 8," steppers "prefilled with the target") ↔ `session-planner-spec.md` (roster carries "per-pattern capability level" but no target-computation or progression model)
Nothing says how a rep target is computed, how it advances session-to-session (the "progressive density" promise), or how per-pattern capability levels are seeded on day one — onboarding is a Phase 1 build, so Phase 0 has no stated placement mechanism for the general library (skills have placement tests; patterns don't).
**Fix:** Add a target-computation + initial-capability-placement section to the planner spec.

### F12 — Strategy doc still presents the platform decision as open
**Files:** `docs/02-product-strategy.md` §Platform ("research swarm in flight → founder decision before Phase 0 build starts," stack candidates listed) ↔ `adr-001-platform-and-stack.md` (RATIFIED 2026-07-06), `docs/03-roadmap.md` (RESOLVED)
An agent reading docs/02 in order would believe the stack is undecided and could re-litigate it.
**Fix:** Replace the section body with "RESOLVED — see ADR-001" and keep the criteria as historical record.

---

## Medium

### F13 — Trials-taper is Phase-1 functionality embedded unflagged in Phase 0 specs
**Files:** `session-planner-spec.md` H3 + inputs ("Trials calendar position") ↔ `coach-voice.md` §Phase mapping ("Phase 0 ships … Trials-taper messaging") ↔ `docs/03-roadmap.md` (Trials are Phase 1; a Phase 0 non-goal)
The planner spec's Phase 0 contract consumes a Trials calendar that won't exist until Phase 1, and the voice doc asserts Phase 0 ships taper messaging for an event Phase 0 doesn't have.
**Fix:** Tag H3's taper mode and the Trials-calendar input "Phase 1-activated"; delete the taper claim from the voice doc's phase-mapping paragraph.

### F14 — Record Book phasing contradicts itself across three docs
**Files:** `PLAN.md` §Approach-1 (thin Record Book list budgeted in Phase 0) ↔ `workout-experience.md` phasing map ("Record Book surface" = Phase 1) vs its own S5 (Phase 0 close chalks PBs into the Record Book) ↔ `skill-progressions.md` open Q6 (asks founder approval for what PLAN already ratified)
**Fix:** Phasing-map row becomes "thin Record Book list: Phase 0; full surface + Trials integration: Phase 1"; mark skills Q6 resolved-by-PLAN.

### F15 — PB semantics have no spec
**Files:** `docs/03-roadmap.md` §Phase 0 item 4 ("beat last Tuesday: 64 squats") ↔ `session-planner-spec.md` (history includes a "PB table," undefined) ↔ `workout-experience.md` ("relevant all-time best" for PB Watch)
No doc defines what keys a PB (member × exercise × metric? block-level benchmark vs exercise-level all-time best?), what makes a best "relevant" for PB Watch, or how swaps/variants affect comparability.
**Fix:** Add a PB-model section to the planner spec (owner of the PB table input).

### F16 — Strategy doc validates WTP by interviews; PLAN forbids exactly that
**Files:** `docs/02-product-strategy.md` §Monetization ("validate elasticity with beta WTP interviews") ↔ `PLAN.md` §Approach-4 / `docs/03-roadmap.md` Gate 1→2 ("WTP is proven by payment, not interviews")
**Fix:** Reword to "validated by founding-cohort payment (PLAN §Approach-4)."

### F17 — Challenge percentiles claim "no liquidity needed" against PLAN's N-threshold rule
**Files:** `trials-and-challenges.md` §Challenges item 4 ↔ `PLAN.md` §Approach-5 ("percentiles hidden until per-test/cohort N thresholds are met")
A Phase 2 percentile vs. 3 families is exactly what the threshold rule exists to prevent.
**Fix:** Append the N-threshold condition to the trials doc's percentile hook.

### F18 — Benchmark cadence stated two ways
**Files:** `trials-and-challenges.md` §Interaction ("~every 2 weeks") ↔ `session-planner-spec.md` H7 ("every ⚙4-6 sessions per member")
**Fix:** Make H7 authoritative; trials doc references H7 instead of stating a number.

### F19 — Age bands are load-bearing everywhere and enumerated nowhere
**Files:** `session-planner-spec.md` (roster "age band," H6, H11 "under ⚙11") ↔ `coach-voice.md` (age-band line tags, three registers) ↔ `pre-mortem-and-backlog.md` (under-11 defaults)
Library metadata, voice selection, safety gating, and privacy defaults all key off an age-band enum no doc defines.
**Fix:** Define the canonical enum once in the planner spec (e.g., <8 / 8-10 / 11-12 / 13-15 / adult ⚙) and reference it everywhere.

### F20 — The non-synchronous gate week requires under-11s to train solo, with no safety spec for it
**Files:** `PLAN.md` §Approach-2(d) ("every member completes ≥2 solo slices") ↔ `session-planner-spec.md` edge cases (kids-only live rosters are intensity-capped, "no max-effort blocks without an adult present" — silent on solo slices)
**Fix:** Extend the planner edge cases: slices for under-⚙11 members are intensity-capped and require parent-present confirmation at start.

### F21 — Phase 0 family persistence has no specified identity mechanism
**Files:** `PLAN.md` §Approach-1 (anonymous Convex state, "slices join via room-code links") ↔ `workout-experience.md` §2 (4-letter room code is per-session)
Nothing says what durable key ties sessions, history, PBs, and the Pact to "the family" across weeks without accounts (durable family doc vs rotating session codes, device loss, multi-device continuity).
**Fix:** Add a short data-model note: durable anonymous family document + per-session room codes, and what happens if the display device is lost.

### F22 — The 5-test Trials battery is defined only in superseded legacy docs
**Files:** `docs/01-product-vision.md` (categories only: push/pull/legs/core/endurance) ↔ `trials-and-challenges.md` (redesigns scoring/event but never lists the tests, standards, or tier tables; one example: "Champion = 71+ push-ups")
Phase 1 builders have no current-source battery, thresholds, or tier names beyond Rookie→Champion.
**Fix:** State the fixed battery + tier tables in trials-and-challenges.md (Phase 1 blocker, flag now).

### F23 — Voice doc unilaterally "corrects" PLAN with no upstream annotation
**Files:** `coach-voice.md` §6 ("one correction to read PLAN.md by": LLM voice is authoring-time + async artifacts, never live in-session) ↔ `PLAN.md` §Key decisions ("LLM coach voice," unqualified); PLAN's Phase 0 build list also omits the coach-line starter set its own cut order implies exists
The correction is right (it follows from the offline commitment) but a design doc silently narrowing the governing doc is the drift pattern this review exists to catch.
**Fix:** Annotate PLAN's engine-architecture decision with the voice doc's resolution; add "hand-authored coach-line starter set" to the Phase 0 build list.

### F24 — Pre-mortem theme 6 is marked APPLIED to the roadmap, but the roadmap doesn't contain it
**Files:** `pre-mortem-and-backlog.md` theme 6 ("APPLIED (roadmap note)": library breadth target before Phase 1 recruitment) ↔ `docs/03-roadmap.md` (no such note anywhere)
A disposition ledger that misreports application status undermines trust in every other APPLIED marker.
**Fix:** Add the breadth-target gate to roadmap §Phase 1 pre-recruitment items (⚙ size set during Phase 0), or re-mark the theme PROPOSED.

### F25 — Adopted Phase 1/2 backlog items appear in no roadmap phase
**Files:** `pre-mortem-and-backlog.md` (Adopted Phase 1: Rematch Night, Earned Streak Insurance, Then-vs-Now Recap, Apprentice Coach; Adopted Phase 2: Beat Dad's Ghost, Squad Consistency Bar; theme 5's Phase 2 scheduling role) ↔ `docs/03-roadmap.md` Phases 1-2 (none listed)
"Adopted" in one doc and absent from the roadmap leaves agents unsure whether these are committed scope.
**Fix:** Add a one-line "adopted backlog (see pre-mortem)" pointer under each roadmap phase, or downgrade the labels to "candidate."

---

## Low

### F26 — Experience doc's fence flag and platform-status lines are stale
**Files:** `workout-experience.md` header + §6.6 (recommends a fence rewording; quotes the old fence) ↔ `docs/03-roadmap.md`/`PLAN.md` (fence already amended, more broadly than proposed) and ADR-001 (decision ratified)
**Fix:** Replace §6.6 with "resolved — fence amended per roadmap" and update the header status line.

### F27 — Trials doc examples feature a 6-year-old; no doc states an age floor
**Files:** `trials-and-challenges.md` ("Add your 6-year-old," "The 6-year-old's 15 squats") ↔ `docs/01` (8-14 sweet spot)
**Fix:** State the supported age floor (or "any age, H11-capped") once in vision or planner spec.

### F28 — Lobby time dial can't express the planner's full time range
**Files:** `workout-experience.md` S1 (presets 20/30/45 + undefined "nudge control") ↔ `session-planner-spec.md` (accepts 15-45; <15 = micro-session mode)
**Fix:** Specify the dial's range/step and how micro-sessions are invoked.

### F29 — Placeholder families are inconsistent across design docs
**Files:** `coach-voice.md` (declares Dad/Ryan-14/Leo-10/Sam-8 "doc-canon") ↔ `workout-experience.md` (Max, Eli, Ryan) ↔ `skill-progressions.md` (Dylan)
**Fix:** Adopt the voice doc's canonical family in all design-doc examples and fixtures.

### F30 — Absence Ledger has behavior but no surface
**Files:** `session-planner-spec.md` (skips carry a "5-second reason tag") ↔ `workout-experience.md` (no surface, no trigger)
No doc says who tags, where, or when a "skip" is detected (missed Tomorrow's Card? missed planned night?).
**Fix:** Add the tag prompt to the experience doc (e.g., next lobby open after a missed planned session).

---

## Consolidated founder questions (deduplicated)

Every "open question for the founder" across the doc set, in one list. Roadmap currently tracks only two of these groups (skills-7, naming sweep).

### Decisions needed (18)

| # | Question | Source | Doc's own recommendation |
|---|---|---|---|
| 1 | Trials judging: one official counter vs dual-count with reconciliation | workout-experience Q1 | One counter, Phase 1 |
| 2 | Set-based block auto-advance floor for straggler logs | workout-experience Q2 | rest + 10s; tune at session zero |
| 3 | Lobby re-roll button for a disliked plan: yes/no | workout-experience Q3 | No re-roll v1 |
| 4 | Progress Points economy: tier-climbs vs PB-margin, flat vs scaled — **plus** the skill-rung PP scaling table (same engine-design session) | trials Q1 + skills §Motivation-4 | — |
| 5 | Co-op pool formula: age-band quota vs capacity-informed | trials Q2 | — |
| 6 | Grace weekend: always available vs once-per-quarter | trials Q3 | — |
| 7 | Doorway-bar chest-to-bar clearance; is a ~weekly park outing realistic and does the "event" framing land with the 14-year-old | skills Q1 | — |
| 8 | Day-one placement: does the teen pass Muscle-Up entry (Strict 10)? Where do the 9/10-year-olds land on Pull-Up and Pistol | skills Q2 | — |
| 9 | First muscle-up strictness line: controlled hip drive vs stricter | skills Q3 | Hip drive allowed as drafted |
| 10 | Front lever for under-10s: pause at advanced tuck vs symptom + volume gating | skills Q4 | — |
| 11 | Skill-test attempts: fully liberal (as drafted) vs light cadence limit | skills Q5 | Liberal as drafted |
| 12 | Active-path cap: 2 per member, or 3 for the teen | skills Q7 | 2 |
| 13 | Coach name vs "the coach" | coach-voice Q1 | Stays "the coach" through Phase 1 |
| 14 | TTS/audio for the big screen — **now due**: ADR-001 ratified without addressing it | coach-voice Q2 | — |
| 15 | Trials-report highlighted-moment rotation: strict round-robin vs founder-tunable | coach-voice Q3 | Strict in Phase 1 |
| 16 | Naming verification sweep: Strongside / HomeTeam / Pact (+ Homefield if Homefield Apparel clears), incl. in-house kid + wedge-dad tests | naming §5-6; roadmap open item | Strongside if both survive |
| 17 | Ratify or defer the orphaned adopted-Phase-0 items: Tomorrow's Card, Session Authorship Token (see F2) | pre-mortem backlog | — |
| 18 | Family Meter: revisit after the family gate | pre-mortem backlog (held) | Held |

### Already resolved — annotate, don't re-ask (1)

- **Skills Q6 (Record Book thin slice in Phase 0)** — already ratified in PLAN §Approach-1 ("a thin Family Record Book list (explicitly budgeted)"). Mark resolved in skill-progressions.md (see F14).

### Observation & calibration tasks (measured in Phase 0, not asked now)

- **Session-zero watch:** observe the 9- and 10-year-old for public-number aversion before hardening PB Watch age defaults (pre-mortem theme 3).
- **Planner ⚙ list:** pattern-taxonomy granularity · block time-model parameters · density-progression thresholds · benchmark cadence (4-6 sessions?) · skill-frequency target · micro-session Pact rules · kids-only intensity cap (session-planner-spec §Calibration).
- **Skills ⚙ list:** rung spacing (2-6 wk) · entry standards (Strict 10 vs 8; 10 push-ups) · kick-up hold 45s · half-lay standard · high-pull sternum height · straight-arm volume cap · under-10 front-lever gate · mount-check cadence (skill-progressions, ⚙ marks).
- **Library breadth target** (number) before Phase 1 recruitment — set from observed variety-consumption during Phase 0 (pre-mortem theme 6; see F24).

---

## Second pass — engine docs (post-landing review)

_2026-07-06, same session. Scope: `engine-data-model.md` + `adaptive-engine.md` (both written after the first pass) cross-read against `session-planner-spec.md` (incl. the Pact & slice sections), `workout-experience.md`, `skill-progressions.md`, and PLAN.md §Approach-1/-2. Totals: 2 Critical · 4 High · 4 Medium (F31–F40). Every finding OBSERVED from the current files this session._

**ARBITRATION RULINGS (main-loop Fable, end of session — the "which doc wins" decisions are made; next session executes the mechanical merges. F31/F32 MUST be resolved before any engine code is written):**
- **F31:** `adaptive-engine.md`'s `CapabilityState` wins (grade/W/confidence/trend/floor — it's the richer model the coaching logic needs); engine-data-model adopts its fields, drops the 0-100 `Difficulty` scale in favor of integer ladder grades, and declares capability an I3-derived **fold over the log** with parent edits as logged override events (never hand-mutated state). adaptive-engine.md §1.1 becomes the authoritative definition; EDM references it.
- **F32:** `session-planner-spec.md`'s Pact spec wins unconditionally — it is the ratified rule (Codex-loop lineage). EDM restructures `PactWeek`/`PactCredit` around member lines (memberId + date on every credit, required per-member targets, daily cap); ⚙M3 is deleted, replaced by a pointer.
- **F33:** planner spec's `plan_slice → SlicePlan` wins (the declared time budget matters — it's how a 14-minute slice becomes possible on a 25-minute bus ride); EDM adds the type and function.
- **F34-F40:** fix direction as each finding's one-line fix states; F35's per-member sets/rounds override and F40's "PB Watch fires only on benchmark blocks + Trials" (with the S5 example corrected) are confirmed as the intended designs.

### F31 (Critical) — The two new docs define two incompatible capability models
**Files:** `engine-data-model.md` §1.4/⚙M1 ↔ `adaptive-engine.md` §1.1/§9
The data model's `PatternCapability` is `{ level: Difficulty (0-100 shared scale), chainPointers }` with rung resolution "highest chain rung with difficulty ≤ level, pointer wins," while the adaptive engine's `CapabilityState` is `{ grade: int ladder position, W, confidence, trend, last_trained, floor }` resolved as "chain rung nearest the member's grade" — none of the engine's six fields exist on `FamilyMember`, both docs claim to concretize the planner roster's "per-pattern capability level" (EDM ⚙M1 vs AE §9 delta 2), and they even disagree on authority (AE posture 2: pure fold over the log, never hand-mutated; EDM: Family layer is "slow state, parent-edited"). An agent implementing `plan_session` cannot proceed.
**Fix:** Merge into one model in engine-data-model.md (recommend: adopt `CapabilityState`'s fields, pick one difficulty representation, declare it an I3-derived fold with parent edits as logged override events) and have adaptive-engine.md reference it.

### F32 (Critical) — The data model cannot express the ratified Pact spec (member lines, daily cap), and ⚙M3 re-answers a settled question differently
**Files:** `engine-data-model.md` §1.4/§1.8/⚙M3 ↔ `session-planner-spec.md` §Pact & session-credit spec
The planner spec's ratified accounting is member-line-primary (per-member weekly target 1-5 default 3; any completed session credits 1 per participant; **1 credit per member per calendar day**; family ring = aggregate of lines; week complete when every line completes), but EDM makes `Family.pact.sessionsPerWeek` "the ring target," `PactWeek.target` a single family number, `PactCredit` carries no `memberId` and no daily-cap semantics, `FamilyMember.weeklyTarget` is optional and scoped to gate (d) only — and ⚙M3 marks slice→Pact credit open, then recommends an all-members-sliced family mint that contradicts the spec's per-member line credit (which is exactly the "arithmetic" M3 rejects).
**Fix:** Restructure `PactWeek`/`PactCredit` around member lines (memberId + date on every credit, required per-member targets, daily-cap rule stated), and replace ⚙M3 with a pointer to the planner spec's already-ratified rule.

### F33 (High) — The slice contract diverges: `plan_slice → SlicePlan` with re-timing and a declared budget vs. a derived `SliceRef` with a fixed dial
**Files:** `session-planner-spec.md` §Async slice contract ↔ `engine-data-model.md` §1.6/§1.9/§3.5
The planner spec defines `plan_slice(sessionPlan, member) → SlicePlan` that re-times shared-timer blocks for solo pacing and "fits the member's declared time budget (H1 applies; micro-session rules apply under 15 min)," but EDM has no `SlicePlan` type, no `plan_slice` in its §1.9 function surface (only `sliceOffers`), fixes the dial to the slice estimate (no declared budget), and runs frozen parent `PlannedBlock`s with no re-timed representation.
**Fix:** Either add `plan_slice`/`SlicePlan` (re-timed blocks, budget input) to EDM §1.6/1.9 or amend the planner spec to the derived-SliceRef model — state explicitly which doc wins.

### F34 (High) — Adaptive-engine's declared library deltas are absent from the data model's library types
**Files:** `adaptive-engine.md` §9 ↔ `engine-data-model.md` §1.1/§1.3
AE's §3 advancement check and §1.2 initialization are unimplementable against EDM as written: `Exercise` has no `difficulty_grade` or `graduation_volume`, chain edges have no `carryover_ratio`, and `SkillPath` has no skill→pattern mapping table (§9 deltas 1 and 4) — the same fold-in failure the first pass flagged as F9, repeated between two docs written in the same wave.
**Fix:** Fold the §9 deltas into EDM's `Exercise`/`ChainRung`/`SkillPath` types (resolving the grade-vs-Difficulty representation per F31).

### F35 (High) — The under-11 set-shaping rule is inexpressible: sets/rounds are shared block state, not per-member
**Files:** `adaptive-engine.md` §2.3 ↔ `engine-data-model.md` §1.2/§1.5
AE's binding under-11 rule ("the visible per-set number never shrinks — cut sets/rounds, never the number on the wall," plus a property test asserting it) requires per-member set/round counts, but EDM puts `sets`/`rounds` on the shared `BlockDef` and `SlotAssignment` carries only a per-set target — so "8×2 for Sam while Dad does 15×3" cannot be represented.
**Fix:** Add a per-member `sets`/`rounds` override to `SlotAssignment` (or `PlannedBlock.assignments`), defaulting to the def's value.

### F36 (High) — Under-11 solo-slice safety rules (F20 fix) didn't make it into the data model's slice lifecycle
**Files:** `session-planner-spec.md` §Async slice contract ↔ `engine-data-model.md` §1.6/§3.5
The planner spec requires under-⚙11 slices to be intensity-capped and to demand parent-present confirmation at start, but EDM's slice lifecycle and state machine carry only the H11 PB-verification gate — no start confirmation event/phase and no intensity cap on slice planning, recreating the exact gap F20 closed.
**Fix:** Add the parent-present confirmation to the slice entry path (§3.5) and the intensity cap to `sliceOffers`/`eligible()` context.

### F37 (Medium) — Adaptive-engine references block types the data model's closed union doesn't have
**Files:** `adaptive-engine.md` §2.2/§4.1 ↔ `engine-data-model.md` §1.2
AE's density tiers unlock "EMOM" (T2) and "density finishers, complexes" (T3), and its factor table keys "finisher 0.6" as a block type, but EDM's `BlockDef` union has no EMOM or complex kind and explicitly defines finisher as a session *role*, not a structural kind (for-time and skill-stations also get no factor).
**Fix:** Align AE's vocabulary to EDM's `BlockDef` kinds + `role` (adding an EMOM kind to EDM if actually intended) and complete the factor table.

### F38 (Medium) — Adaptive-engine runtime state and Reason records have no storage home
**Files:** `adaptive-engine.md` §1.1/§3/§6 ↔ `engine-data-model.md` §1/§2
`CapabilityState`'s trend window/confidence/floor, the per-(member, chain) advancement arming/decline counters (§3 anti-nag), and Reason records (emitted on every decision, pinned as golden fixtures in §7) appear in neither EDM's §1 types nor its §2 Convex mirror (which lists `pb_cache`/`pact_cache` but no capability or reasons store), and `SessionPlan.coach` holds only `revealLine`/`closeTease` against AE's one-adaptive-line-per-member budget.
**Fix:** Add explicit derived-cache shapes (capability_cache, reasons) to EDM §2 and a per-member adaptive-line slot to `SessionPlan.coach`.

### F39 (Medium) — `TargetScheme` and `compute_target` don't compose
**Files:** `engine-data-model.md` §1.2 ↔ `adaptive-engine.md` §2.2
EDM derives slot targets from `TargetScheme` (`relative: sub-max | moderate | max` or `fixed`) while AE derives them from `W × block_type_factor × position_factor × freshness_factor × β_band` with no input for slot intensity — neither doc says how `sub-max/moderate/max` maps into the formula or that `fixed` bypasses the engine, so the agent emitting `SlotAssignment.target` has two disconnected recipes.
**Fix:** Define the mapping once (recommend: intensity → a factor row in AE §2.2's table; `fixed` bypasses) and cross-reference it from `TargetScheme`.

### F40 (Medium) — PB Watch's "relevant all-time best" has no source for ordinary blocks under the new PB model
**Files:** `workout-experience.md` §S3/§S5 ↔ `engine-data-model.md` §1.7
EDM's `PBContext` mints PBs only from Trials tests and benchmark-block lineages ("PB Watch reads this"), so the experience doc's PB Watch trigger ("inside 90% of a relevant all-time best") and its S5 example ("MAX — 26 PUSH-UPS — all-time best") are underivable in a non-benchmark block — a silent narrowing of the experience doc with no annotation (the F23 drift pattern).
**Fix:** State in both docs that PB Watch and close-screen PBs fire only on benchmark blocks and Trials (and fix the S5 example), or add an exercise-level best cache to EDM.
