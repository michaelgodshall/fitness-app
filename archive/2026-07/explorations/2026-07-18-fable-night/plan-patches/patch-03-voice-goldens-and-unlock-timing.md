---
patch: 03-voice-goldens-and-unlock-timing
findings-addressed: F7 (coach-voice goldens vs. skill ladders), F10 (rung-unlock moment timing specified three ways)
target-files:
  - docs/design/coach-voice.md            (F7: §4 goldens + §6 eval checklist)
  - docs/03-roadmap.md                     (F10: Phase 0 item 5)
  - docs/design/pre-mortem-and-backlog.md  (F10: theme 2 APPLIED bullet)
  - docs/design/workout-experience.md      (F10: S5 close sequence)
  - docs/design/skill-progressions.md      (F10: §Motivation 3)
source-of-truth: docs/design/skill-progressions.md ladder tables (Paths 1–5); CONTEXT.md (Rung; "Avoid: level, step, stage")
ruling-implemented: F10 arbitration in design-review-findings.md §F10 — "full-screen moment at test time + one-line recap in the S5 close." F7 has no separate ruling; goldens regenerated to match ladders, voice bar held ("match or beat").
status: READY TO APPLY — read-only proposal, no source doc edited.
---

# Patch 03 — Voice goldens (F7) + rung-unlock timing (F10)

Two findings, five files. F7 fixes four factually-wrong goldens in coach-voice.md §4 and hardens the §6 eval bar. F10 unifies the rung-unlock moment to **test-time full-screen + close-line recap** across the four docs that currently disagree.

Ladder facts used (from skill-progressions.md, verified this session):
- **Muscle-Up path = 6 rungs** (not 7). Chest-to-Bar=1, High Pull=2, Bar Support+Dip=3*(park)*, Muscle-Up Negative=4*(park)*, The Muscle-Up=5*(park)*, Muscle-Ups×3=6*(park)*. Rungs 3–6 are **park-bar only** by design.
- **Pistol path**: rung 3 = **Single-Leg Chair Squat** (no rung named "box pistols"); rung 4 = Assisted Pistol.
- **Front Lever path**: rung 2 = **Tuck Lever (3×5s)**; rung 3 = **Tuck Lever 15 (3×15s)**; rung 4 = Advanced Tuck.
- Vocabulary: CONTEXT.md canonizes **Rung** and lists "step/level/stage" under _Avoid_ — regenerated lines say "rung," matching skill-progressions rule 2 ("real calisthenics vocabulary").

---

## F7 · Edit 1 — Skill-unlock golden: muscle-up negatives (wrong rung count + wrong "next")

**TARGET:** `docs/design/coach-voice.md` §4 → "Skill unlock" (first golden)

**CURRENT:**
> "Ryan — three clean negatives. Step four of seven on the muscle-up path is done. Next: chest-to-bar. Nobody skips steps to a muscle-up."

**PROPOSED:**
> "Ryan — three clean negatives. Rung four of six on the muscle-up path is done. Next is the muscle-up itself. Nobody skips rungs to get there."

**RATIONALE (F7):** Muscle-Up Negative is rung **4 of 6**, not "four of seven." The next rung is **The Muscle-Up** (rung 5), not Chest-to-Bar (which is rung 1, *before* negatives — the original line pointed the athlete backwards). "Steps"→"rungs" per CONTEXT.md. Voice quality (belt-earned cadence, "nobody skips rungs") preserved/tightened.

---

## F7 · Edit 2 — Skill-unlock golden: "box pistols" (non-existent rung)

**TARGET:** `docs/design/coach-voice.md` §4 → "Skill unlock" (second golden)

**CURRENT:**
> "Box pistols unlocked, Leo. Ride the box until it feels insulting, then we take it away."

**PROPOSED:**
> "Single-leg chair squats, Leo — rung three of the pistol path. Ride that seat till it feels insulting, then it's gone."

**RATIONALE (F7):** No rung named "box pistols" exists. Pistol rung 3 is **Single-Leg Chair Squat** (to a knee-height seat); the next rung removes the seat (Assisted Pistol, rung 4), which the original's "then we take it away" beat already gestures at — so the correction keeps the exact motivational move, just names the real rung.

---

## F7 · Edit 3 — Skill-unlock golden: front-lever tuck (wrong "next" rung)

**TARGET:** `docs/design/coach-voice.md` §4 → "Skill unlock" (third golden)

**CURRENT:**
> "Ten-second tuck front lever, Ryan. Most grown men can't hold that shape. Advanced tuck is next."

**PROPOSED:**
> "Five-second tuck lever, Ryan — rung two of the front lever path. Most grown men can't hold that shape. Fifteen seconds is next."

**RATIONALE (F7):** An unlock line fires on a *passed test*, and tests are rung standards. The rung 2 standard is **3×5s** (Tuck Lever); the next rung is **Tuck Lever 15** (rung 3, 3×15s) — not Advanced Tuck (rung 4). "Ten-second tuck" matched no rung; corrected to the rung-2 standard with the rung-3 target as "next." Best line of the three kept verbatim.

**FOUNDER CALL:** if you'd rather have this golden celebrate rung 3 (the 15s hold) instead, swap to: *"Fifteen-second tuck lever, Ryan — rung three, front lever path. Advanced tuck is next: flatten the back, open the hips."* (Then "Advanced tuck is next" becomes correct.) Either is ladder-legal; pick by which unlock reads better in the garage.

---

## F7 · Edit 4 — Session-open golden: park-only rung scheduled in a weekday home block

**TARGET:** `docs/design/coach-voice.md` §4 → "Session open" (second golden)

**CURRENT:**
> "Dad and Ryan, full 45. Pull day. Ryan, block three is yours — negative muscle-ups, step four of the path."

**PROPOSED:**
> "Dad and Ryan, park day — full 45, pull focus. Ryan, block three is yours: muscle-up negatives, rung four. This bar's the only one tall enough for it."

**RATIONALE (F7):** Muscle-Up Negative (rung 4) is a **park-bar rung** — physically impossible on a doorway bar (no overhead clearance), by explicit design in skill-progressions.md §Path 2. Scheduling it in an unqualified home session contradicts the ladder. Reframing the session as the **park outing** ("event" framing skill-progressions calls for) fixes the violation *and* dovetails with unlock Edit 1 (Ryan passing negatives at the park). "Step four of the path"→"rung four."

**FOUNDER CALL:** if you'd rather keep this golden as a **weekday doorway** session (no park trip implied), assign a doorway-legal rung instead: *"Dad and Ryan, full 45. Pull day. Ryan, block three is yours — high pulls, rung two of the muscle-up path. Bar to the sternum, every rep."* (High Pull = rung 2, doorway-legal.) Recommend the **park-day** version above — it turns the bug into a showcase of the park-bar design.

---

## F7 · Edit 5 — Harden the §6 eval bar (goldens must match the ladders)

**TARGET:** `docs/design/coach-voice.md` §6 → "Founder review & evals", first bullet

**CURRENT:**
> - **This doc is the source of truth.** The moment-map lines are the golden set: candidate Tier-1 lines and sample Tier-2 outputs are judged against them side-by-side. The bar is "match or beat," not "technically compliant."

**PROPOSED:**
> - **This doc is the source of truth.** The moment-map lines are the golden set: candidate Tier-1 lines and sample Tier-2 outputs are judged against them side-by-side. The bar is "match or beat," not "technically compliant." **Fact-consistency gate: every golden or candidate line that cites a rung name, rung number, path length, or "next rung" must match skill-progressions.md's ladder tables exactly, and must not schedule a park-bar rung (Muscle-Up 3–6) in a doorway/home session — a line that narrates the ladder wrongly is a defect no matter how good it sounds.**

**RATIONALE (F7):** Implements the finding's second fix ("add 'goldens must be consistent with the skill tables' to the §6 eval checklist"). Because the goldens *are* the Tier-1 quality bar, an un-checked factual error propagates into the whole generated library — this makes ladder-traceability a mechanical gate alongside the existing fact-traceability check for numbers.

---

## F10 · Edit 6 — Roadmap: reword "at session close" to the unified timing

**TARGET:** `docs/03-roadmap.md` §Phase 0 build list, item 5

**CURRENT:**
> 5. Skills v0 — 5 hand-authored progression paths (pull-up [the on-ramp], muscle-up, HSPU, pistol, front lever); no polish — teen-drift instrumentation (must include the "rung unlocked" feedback beat at session close; see docs/design/skill-progressions.md)

**PROPOSED:**
> 5. Skills v0 — 5 hand-authored progression paths (pull-up [the on-ramp], muscle-up, HSPU, pistol, front lever); no polish — teen-drift instrumentation (must include the rung-unlock feedback beat: a full-screen moment **at test time** plus a one-line recap in the S5 close; see docs/design/skill-progressions.md)

**RATIONALE (F10):** Roadmap was one of the three "at session close" statements; the ruling puts the full moment at **test time** (when the witnessed test is passed) with only a **recap** at close. Reworded to the unified spec so the build item can't be read as "ceremony fires at close."

---

## F10 · Edit 7 — Pre-mortem: same reword on the APPLIED bullet

**TARGET:** `docs/design/pre-mortem-and-backlog.md` §2 (Teen drift), first APPLIED bullet

**CURRENT:**
> - APPLIED: skill-tier **feedback moments** in Phase 0 (skills v0 must include the "tier unlocked" beat at session close, not just a silent progress bar — an instrument the subject can feel is not measuring engagement, it's suppressing it).

**PROPOSED:**
> - APPLIED: skill-tier **feedback moments** in Phase 0 (skills v0 must include the rung-unlock beat — a full-screen moment **at test time** plus a one-line recap in the session close, not just a silent progress bar — an instrument the subject can feel is not measuring engagement, it's suppressing it).

**RATIONALE (F10):** Aligns the pre-mortem's APPLIED disposition with the ruling. Keeps the bullet's argument intact (a feelable instrument); only the *when/how* is corrected. "tier unlocked"→"rung-unlock" also fixes a stale term (skills use rungs, not tiers — tiers are Trials, per CONTEXT.md).

---

## F10 · Edit 8 — Experience doc: add the recap beat to the S5 close (the "no beat at all" gap)

**TARGET:** `docs/design/workout-experience.md` §S5 — The Close, close sequence

**CURRENT:**
> 3. **Pact ring advances** on screen. Filling the final slot (3/3) fires the week-complete moment — the family watches its streak extend together.
> 4. **Next-session tease**, one coach line: *"Thursday we pull. Eli's dead-hang benchmark returns."* Anticipation is built by the engine (same mechanic as the Trials taper).

**PROPOSED:**
> 3. **Pact ring advances** on screen. Filling the final slot (3/3) fires the week-complete moment — the family watches its streak extend together.
> 4. **Rung-unlock recap** (only if a rung was passed tonight): a single line naming who unlocked what — *"Ryan chalked Muscle-Up Negative tonight."* This is a **recap, not the ceremony** — the full-screen unlock moment already fired at test time (top of the skill block, skill-progressions §Motivation 3); the close just re-surfaces it so a rung earned early in the session isn't forgotten by the family moment.
> 5. **Next-session tease**, one coach line: *"Thursday we pull. Eli's dead-hang benchmark returns."* Anticipation is built by the engine (same mechanic as the Trials taper).

**RATIONALE (F10):** S5 previously had *no* skill-unlock beat, contradicting roadmap item 5 and pre-mortem theme 2. The ruling resolves it as a **recap** (the ceremony lives at test time), so this adds a conditional recap line and renumbers the tease to step 5. Note the "60-90 seconds" header budget still holds — the recap is one line, and only when a rung was passed.

**FOUNDER CALL:** the example uses "Ryan / Muscle-Up Negative" to match the coach-voice family; the S5 example family elsewhere is Max/Eli/Ryan (F29 tracks the placeholder-family inconsistency separately). Left as Ryan here; F29's patch will normalize all example families in one pass.

---

## F10 · Edit 9 — Skill-progressions: name the close recap so the test-time doc owns the whole timing

**TARGET:** `docs/design/skill-progressions.md` §Motivation architecture, item 3

**CURRENT:**
> 3. **Unlocks are witnessed events, not notifications.** A declared test stops the room for 60-90 seconds: standard on the big screen, parent timing/judging, family watching — the same judging-role bonding mechanic Trials 2.0 uses. Pass → one full-screen moment (member, rung name, date) → a **permanent line in the Family Record Book**: "Aug 12 — Dylan — Chest-to-Bar (Muscle-Up path, 1/6) — witnessed: Dad." Permanence is the reward. No confetti economy.

**PROPOSED:**
> 3. **Unlocks are witnessed events, not notifications.** A declared test stops the room for 60-90 seconds: standard on the big screen, parent timing/judging, family watching — the same judging-role bonding mechanic Trials 2.0 uses. Pass → one full-screen moment **at test time** (member, rung name, date) → a **permanent line in the Family Record Book**: "Aug 12 — Dylan — Chest-to-Bar (Muscle-Up path, 1/6) — witnessed: Dad." Permanence is the reward. No confetti economy. **The session close (workout-experience §S5) then carries a one-line recap of any rung passed that night — recap only, never a second ceremony;** this is the single unlock-timing spec, and roadmap item 5 / pre-mortem theme 2 defer to it.

**RATIONALE (F10):** skill-progressions was the "test-time" camp and is the natural owner of the unified rule; this makes it explicit that the full moment is test-time and the close is recap-only, and points the other two docs here so there's one authority. Closes the three-way disagreement in the finding's recommended direction.

---

## Verification checklist (re-read after applying)

1. **coach-voice.md §4** — the four regenerated goldens now read: muscle-up negatives = "rung four of six … Next is the muscle-up itself"; pistol = "Single-leg chair squats … rung three"; front lever = "Five-second tuck lever … rung two … Fifteen seconds is next"; session-open = park-day framing (or the doorway/High-Pull alternative if you took that FOUNDER CALL). No line says "step" for a rung.
2. **coach-voice.md §6** — first eval bullet now carries the ladder fact-consistency gate.
3. **Cross-check each regenerated line against skill-progressions.md Paths 2/4/5** — rung numbers, rung names, path lengths, and "next" all match the tables; no park-bar rung (Muscle-Up 3–6) sits in a doorway/home session.
4. **F10 four-doc sweep** — roadmap item 5, pre-mortem theme 2 bullet, workout-experience S5, and skill-progressions §Motivation 3 all now say the same thing: **full-screen moment at test time + one-line recap at close.** No doc still says the ceremony fires "at session close."
5. **workout-experience.md §S5** — steps renumber cleanly (Done stamp / PBs / Pact ring / rung-unlock recap / Next-session tease = 5 steps); "60-90 seconds" header still credible.
6. **Terminology** — regenerated lines and reworded bullets use CONTEXT.md's **Rung** (not step/level/stage) and don't call skills "tiers" (tiers = Trials).
7. **Not touched here (tracked elsewhere):** workout-experience §S4 rest-panel line "Front lever: tuck holds — step 3 of 7" is a *skill-step* reference outside coach-voice §4 (F7's scope) — flag for a follow-up consistency sweep; placeholder-family normalization is F29.
