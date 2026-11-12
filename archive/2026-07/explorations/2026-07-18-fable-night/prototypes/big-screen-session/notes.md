# Big-Screen Live Session — prototype notes

_Fable night, 2026-07-18. **A prototype / exploration, not a decision.** Governing spec: `docs/design/workout-experience.md`. Terms per `CONTEXT.md`; coach lines per `docs/design/coach-voice.md` §4._

Open `index.html` by double-clicking (fully self-contained, zero external requests). **Space or click advances**; left-arrow goes back. Rest auto-advances on its countdown; timers/logs auto-run inside a beat. A "Sound on/off" toggle sits top-center — the count-in and PB chime are synthesized (WebAudio), unlocked by the first tap, mirroring the spec's "Build session unlocks audio" gesture (§6).

## What it demonstrates

The full S1–S5 arc from the spec, as one advanceable Tuesday-night walkthrough for the canonical family (Dad 42, Ryan 14, Leo 10, Sam 8):

1. **Lobby (S1).** Room code `GRIT` + decorative QR, members join one-by-one (a *kid* joins first — the any-member-start amendment, §S1 pre-mortem theme 1; Sam gets a "Starter" tag and the build button reads "Sam can start us"), streaks per tile, time dial (20/30/45, 30 selected, "Dad set 30 min" attribution), Pact ring pre-filled to "Session 2 of 3."
2. **The Reveal (S2).** Blocks slide in one at a time (warm-up → Block A push ladder → Block B legs/core → Family AMRAP finisher), honest 30:00 total under the dial, the "⚑ repeats last week — beat your number" strategic-repeat flag on Block A, Ryan's benchmark flag on Block B, one why-shaped coach line.
3. **Live block (S3).** Largest element is the block timer; audio "3-2-1-GO" count-in; per-member columns showing **per-swap-chain scaling** (Dad/Ryan full push-ups, Leo full "swapped up," **Sam incline**); live totals land from "phone" reports with a flash; one mid-set coach cue ("Breathe. Two more. That's the whole job." — verbatim golden); Ryan crosses into **PB Watch** (ember glow, "the room sees it coming").
4. **Rest (S4).** Giant clock-driven countdown, per-member next-up preview, one rotating micro-panel (Ryan's Front-lever skill spotlight, step 3 of 7).
5. **Finisher.** Family AMRAP pool counting up with per-member attribution chips.
6. **The Close (S5).** Done stamp + family totals → **Sam's PB ceremony full-screen** (huge 12, prior best 9 struck through, +3 all-time best, chalk line writing into the Record Book, verbatim golden coach line — the biggest emotional beat, designed as one) → Pact ring advances 1→2 ("two down, one more") → next-session tease ("Thursday we pull. Ryan — your dead-hang benchmark returns.").

Design language: dark, premium-athletic, forge-ember signal accent, member colors, tabular scoreboard numerals, 10-ft type scale, film-grain + vignette atmosphere. No emoji in coach speech; comparisons are always vs. own past.

## UX decisions the spec left open — each is a founder question

1. **Under-11 on-screen treatment (the sharpest one).** §S3 age-gates under-11 PB Watch *and personal targets* to the personal lens. I honored it literally: Leo (10) and Sam (8) show their swap-chain **exercise name** (needed to make scaling visible, and swaps render as plain names anyway) and their **live total**, but **no target number and no PB Watch** on the wall — Dad and Ryan (11+) show full targets + PB Watch. **This creates a visible asymmetry** (the adults' numbers are public, the little kids' aren't) that could read as the youngest being second-class. **Founder Q:** is "name + total, no target, no watch" the right shared-screen treatment for under-11, or should their whole column be more neutral, or should the lobby surface a per-member opt-in so a proud 8-year-old can go public? (Spec already says session zero observes for public-number aversion — this is where that observation gets designed.)

2. **Multiple / tied PBs at close.** §S5 says "two PBs = two moments." I gave **Sam the sole full-screen ceremony** and resolved Ryan's as an inline "Matched best" during the block (he tied 12, didn't beat), keeping ceremony scarce (tenet 6). **Founder Q:** when 2+ members set true PBs the same night, what's the ordering (youngest-first? biggest-margin-last?), and does a *tie/matched-best* earn any close-screen beat at all, or only genuine all-time bests?

3. **A target number on the AMRAP finisher.** I labeled the finisher "The Tuesday 150" with a soft 150-rep goal counting **up** — deliberately *not* the Family-500 burn-**down** pattern (that's the Phase-1 Co-op Challenge). **Founder Q:** does putting any number on a daily AMRAP finisher motivate, or does it blur the line with Challenges and erode the scarcity that makes Trials/Challenges feel sacred? (Safer alt: an unnumbered "keep moving" finisher.)

4. **PB Watch resolution live vs. at close.** Ryan's live PB Watch resolves quietly inline ("Matched best") rather than firing a room beat mid-block; I reserved all ceremony for the close. **Founder Q:** should crossing (or tying) a best mid-block get its own live audible/visual room callout ("everyone counts him in"), or stay ambient until the close to protect the workflow rhythm?

5. **Does the screen credit who started?** I dramatized the any-member-start by naming Sam as starter on the lobby. Nice for kid agency; could also feel like singling out. **Founder Q:** credit the starter by name, or stay neutral ("someone started us")?

6. **Big-screen Pact = family ring only.** At close I animate the **aggregate family ring** (3 segments), not per-member Member Lines — showing a lagging member's incomplete line on the shared wall risks the no-shame tenet (4). **Founder Q:** is aggregate-only correct for the shared surface, with per-member lines living on the phone (personal lens)?

7. **Reveal has no re-roll** (per spec open-Q3 recommendation: swaps are the pressure valve, a re-roll invites plan-shopping). Implemented as such — flagging that I took the recommendation, not that it's settled.

8. **Audio scope.** Count-in beeps + a PB chime only; TTS coach voice deferred (coach-voice.md OQ2, and §6 audio flag). **Founder Q:** how much sound belongs on the big screen — is a PB *chime* right, or should the PB moment be silent-but-huge?

## What's faked (nothing here is real)

- **All data is hardcoded** — reps, targets, all-time bests, streaks, totals, Progress Points. No planner ran; the "generated" session is a fixed script.
- **Phone controllers are simulated** — logs "arrive" on `setTimeout`, not from real devices. No room-code join, no sync, no `<250ms` choreography (that's the real architecture's job). Ryan's separate phone-controller prototype (sibling agent, port 8731) is not wired to this screen.
- **The QR code is a decorative static pattern**, not scannable.
- **Timers are cosmetic** — the block clock and rest countdown animate but drive nothing; block advance is manual (real spec: advance when all logged or a floor expires).
- **Coach lines are pre-written**: PB and mid-set lines are **verbatim goldens** from coach-voice.md §4; open/Pact/tease lines are matched-quality, not from the (unbuilt) line library. No LLM ran.
- **Audio is synthesized oscillator tones**, placeholder for designed sound.
- **No persistence, no Record Book write, no Convex, no Clerk** — the chalk animation is theater.
- Avatars are initials; member colors are prototype picks, not brand-locked.

## Top 3 open UX questions to bring back

1. **Under-11 shared-screen treatment** — the name-but-no-number asymmetry (decision #1). Highest-stakes; test it in the garage at session zero.
2. **Multiple / tied PB ceremony** — ordering, and whether ties get a beat (decision #2).
3. **Numbered AMRAP finisher** — motivating, or does it blur the Challenge scarcity line (decision #3)?
