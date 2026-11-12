# Skill Progressions v1

_Design doc — July 2026 (Fable session). Designs Phase 0 build item 5 (skills v0 — teen-drift instrumentation) and the fixed skill-standard layer promised in the vision. Pairs with `session-planner-spec.md` (this doc fulfills constraint H8 and soft objective 5) and `trials-and-challenges.md` (skill unlocks feed the Family Record Book and mint Progress Points). Status: draft for founder review. ⚙ marks a standard or parameter that needs founder validation against the 16 months of lived data._

---

## Why skills exist

The 14-year-old drifted because he wanted to train *toward something*. Trials measure where you are; skills are the fixed, aspirational ladder of where you're going. Like Trials standards, skill standards never vary (Principle 7) — a muscle-up earned in this app means exactly one thing, forever. Skills v0 exists to answer one gate question this summer: **does the teen engage the ladder unprompted?**

## Path design rules

1. **Every pass standard is parent-judgeable with a phone.** A rep count or timer value, plus at most two binary form checks a parent can call in real time ("chin over the bar?", "heel stayed down?"). Horizontal-line judgments (levers) use a side-on phone video — the camera doesn't flatter. No subjective form scores anywhere.
2. **Rung names are real calisthenics vocabulary** (tuck front lever, chest-to-bar, pistol negative) — never invented badge names. A 14-year-old's status must be legible outside the app — at the park, at school, on YouTube — or it isn't status. Athletic respect (Principle 3) and the brand voice ("never gamey") both demand this.
3. **Rung spacing targets 2-6 weeks** of 2-3×/week practice through the middle of each path for the member it's aimed at ⚙. Terminal rungs may take months — that's honest, and the ladder shows it honestly. A rung six months away kills the mechanic; the spacing below is the thing most in need of founder calibration.
4. **Safe by construction.** No external load, no loaded impact, no ballistic landings anywhere in any path. Strict reps and isometrics only, with explosive work (muscle-up transition) reachable only through strength standards a child cannot shortcut. Prerequisite gates do most of the safety work; age gates fill the gaps (see safety section).
5. **Uniform test protocol.** A test is *declared* by the member, performed fresh (after warm-up, before conditioning blocks), witnessed and timed by a parent, one attempt per declaration. The witness requirement is both the celebration mechanic and the verification mechanic — benchmarks are sacred, and self-reported unlocks would rot them.
6. **Household surfaces are not equipment.** Stairs, a sturdy chair, a doorframe, a wall — allowed and assumed (they appear below). The H4 equipment fence (`none | pull-up bar`) governs purchases; the library metadata should carry a `household_surface` tag so the planner can state assumptions at presentation.

## The launch paths — five, not four

The brief named four paths (muscle-up, HSPU, pistol, front lever). This design splits out a fifth: **the Pull-Up path**. Reasons: (a) the muscle-up path silently presumes ~10 strict pull-ups — that prerequisite *is* a multi-rung journey and deserves its own named ladder; (b) it gives the 9- and 10-year-olds a live rung from day one, which makes the skill-practice block a genuinely *shared* family moment instead of "the teen's special time" (see integration section); (c) the first strict pull-up is the single most celebrated unlock in bodyweight training — it belongs in the Record Book as a headline, not as an unnamed entry requirement.

| Path | Terminal skill | Primary pattern (H2) | Entry standard |
|---|---|---|---|
| 1. Pull-Up | 10 strict pull-ups | vertical-pull | none — universal on-ramp |
| 2. Muscle-Up | 3 muscle-ups | vertical-pull (explosive) | Pull-Up path complete ⚙ |
| 3. Handstand Push-Up | 5 wall HSPU | vertical-push | 10 strict push-ups ⚙ |
| 4. Pistol Squat | 5 pistols per leg | squat | none |
| 5. Front Lever | 5s full front lever | core + vertical-pull (straight-arm) | Pull-Up rung 5 (Strict 3) ⚙ |

Coverage is deliberately pull-heavy — that matches both the equipment (a bar) and where teen aspiration actually lives. Pattern balance across the week is the planner's job, not the paths' (skill volume counts toward H2/H3; see integration).

**Placement:** on enrollment, a member tests into the highest rung whose standard they pass today — nobody grinds rungs they've outgrown, and the placement session is itself a fun family event.

### Path 1 — Pull-Up

| # | Rung | Pass standard | Practice (skill-block drill) |
|---|---|---|---|
| 1 | Dead Hang | 30s continuous hang, feet clear, no regrip | hang accumulation sets |
| 2 | Active Hang | 10 scapular pulls, elbows locked straight, 1s pause at top | scap pull sets |
| 3 | Negatives | 5 × 5-second negatives, chin-over to full hang, continuous descent (no drop) | chair-assisted reps + negatives |
| 4 | **The Pull-Up** | 1 strict: dead-hang start, chin over bar, no kick or swing | negatives, partials, assisted reps |
| 5 | Strict 3 | 3 consecutive, full elbow extension between reps | sub-max sets |
| 6 | Strict 6 | 6 consecutive, same standard | sub-max sets, rep ladders |
| 7 | Strict 10 | 10 consecutive — path complete; opens Muscle-Up entry | rep ladders, dense sets |

Form checks throughout: chin clearly over; no kip. Rung 4 is the gateway unlock of the whole system.

### Path 2 — Muscle-Up

Entry: Pull-Up path complete (Strict 10) ⚙ — validate against readiness; 8 may be enough for a light teen.

**Equipment reality (design stance, not a footnote):** rungs 3-6 are physically impossible on a doorway bar — there is no clearance above it. They are **park-bar rungs**. This is treated as a feature: muscle-up work becomes a weekend park outing — an *event* — while rungs 1-2 keep weekday practice alive on the doorway bar. ⚙ Founder-validate: chest-to-bar head clearance on the actual home bar, and whether a roughly weekly park cadence is realistic for the family.

| # | Rung | Pass standard | Practice |
|---|---|---|---|
| 1 | Chest-to-Bar | 3 consecutive pull-ups, bar touches at/below collarbone, no kip | explosive pull-up sets |
| 2 | High Pull | 3 explosive pulls, bar reaching sternum height at peak ⚙ (side video judges) | speed pulls, chest-to-bar volume |
| 3 | Bar Support + Dip *(park)* | 10s support hold above bar + 5 straight-bar dips, full lockout | support holds, dip negatives |
| 4 | Muscle-Up Negative *(park)* | 3 × 5-second lowers from support through the transition to dead hang, both arms together | slow negatives |
| 5 | **The Muscle-Up** *(park)* | 1 rep: dead-hang start, controlled hip drive allowed, no swinging kip, both elbows transition together (one-arm-at-a-time "chicken wing" = fail), lockout on top ⚙ | negatives + high pulls |
| 6 | Muscle-Ups ×3 *(park)* | 3 consecutive, same standard | volume work |

⚙ Rung 5's strictness line is a founder call: a zero-momentum strict muscle-up may sit beyond the summer window; controlled hip drive keeps it honest but reachable. The forbidden thing is the swinging kip — that's where shoulders get hurt (see safety).

### Path 3 — Handstand Push-Up

Entry: 10 strict full-ROM push-ups ⚙.

| # | Rung | Pass standard | Practice |
|---|---|---|---|
| 1 | Pike Push-Up | 3×8, hips high, head lightly touches floor ahead of hands each rep | pike sets |
| 2 | Elevated Pike | feet on second stair or sturdy chair, 3×8, head touch each rep | elevated pike sets |
| 3 | Wall Handstand + Bail | wall-walk to chest-to-wall handstand, 30s hold, **plus 3 clean cartwheel bail-outs** (parent-judged) | wall walks, short holds, bail practice |
| 4 | Kick-Up + Hold | kick up to back-to-wall handstand unaided, hold 45s ⚙ | kick-up practice, hold accumulation |
| 5 | HSPU Negative | 3 × 5-second lowers to a folded-towel head-touch, control throughout | negatives, elevated pike volume |
| 6 | **The Wall HSPU** | 1 full rep: head touches towel, press to full lockout, heels on wall | negatives, partial presses |
| 7 | Wall HSPU ×5 | 5 consecutive, full ROM | volume sets |

The bail-out is a **pass standard, not a warning label** — the safety skill is itself a rung requirement (safety without softness). "Beyond" content (freestanding handstand, freestanding HSPU) is explicitly post-v0.

### Path 4 — Pistol Squat

Entry: none. Note for the coach voice: kids routinely beat adults here (mobility) — honest physics, let it ride.

| # | Rung | Pass standard | Practice |
|---|---|---|---|
| 1 | Deep Squat 20 | 20 unbroken, hip crease below knee, heels down | squat volume |
| 2 | Deep Squat Hold | 45s continuous flat-foot bottom hold, hands free ⚙ | hold accumulation (the ankle-mobility gate — the real pistol limiter) |
| 3 | Single-Leg Chair Squat | 3×5 per leg to a knee-height seat: controlled touch (no plop), stand without the other foot down | chair squats, step-downs |
| 4 | Assisted Pistol | 3×5 per leg, full depth, one hand on doorframe/pole | assisted reps |
| 5 | Pistol Negative | 3×3 per leg, 5-second descent to full-depth bottom (recover however) | negatives |
| 6 | **The Pistol** | 1 per leg: full depth, heel down, no support, free leg off the floor, stand to full extension | negatives + assisted singles |
| 7 | Pistol ×5 | 5 consecutive per leg | volume singles |

### Path 5 — Front Lever

Entry: Pull-Up rung 5 (Strict 3) ⚙ — straight-arm work needs a pulling base. Horizontality on rungs 2-7 is judged by side-on phone video.

| # | Rung | Pass standard | Practice |
|---|---|---|---|
| 1 | Hanging Knee Raise | 10 controlled, knees to chest, no swing | knee raise sets |
| 2 | Tuck Lever | 3 × 5s tuck front lever, back parallel to floor | tuck holds |
| 3 | Tuck Lever 15 | 3 × 15s, same standard | longer holds |
| 4 | Advanced Tuck | 3 × 8s, back flat, hips opened (~90°), knees bent | advanced tuck holds, tuck pulls |
| 5 | One-Leg Lever | 3 × 8s, one leg fully extended, hips level | one-leg holds |
| 6 | Half-Lay | 2 × 8s, both legs extended with knees bent 90° ⚙ | half-lay holds |
| 7 | **The Front Lever** | 5s full lever: body straight and horizontal, arms straight | half-lay + band-free negatives |

⚙ Rung 6 uses half-lay instead of the conventional straddle because a doorway frame blocks a straddle's width — validate on the real bar; park-bar families could take straddle as a noted alternative. Physics note: lever difficulty scales with height and weight — light kids will hold levers their dad can't. That's the relative-loading magic on display; the coach voice should own it, not soften it.

## Motivation architecture

The loop: **named rung → measured gap → witnessed test → chalked record.**

1. **The gap is arithmetic, always visible.** Each enrolled path shows a skill card: current rung, the next rung's standard verbatim, best logged practice result, and the delta — "Tuck lever: best 11s. Rung: 15s." This is the core teen mechanic. "Training toward something" stops being a vibe and becomes a number the kid can move every session — and a 4-second gap is a reason to pick up the family device on a rest day.
2. **Status is real-world-portable.** Because rungs carry community-standard names (rule 2), an unlock is a claim the kid can make at the park and have it mean something. The app borrows status from global calisthenics culture instead of minting toy currency.
3. **Unlocks are witnessed events, not notifications.** A declared test stops the room for 60-90 seconds: standard on the big screen, parent timing/judging, family watching — the same judging-role bonding mechanic Trials 2.0 uses. Pass → one full-screen moment (member, rung name, date) → a **permanent line in the Family Record Book**: "Aug 12 — Dylan — Chest-to-Bar (Muscle-Up path, 1/6) — witnessed: Dad." Permanence is the reward. No confetti economy.
4. **Progress Points.** Every rung unlock mints Progress Points — rungs are all-time-firsts by construction, so the anti-gaming property of Trials PP carries over exactly. Later rungs mint more (scaling table lands in the engine design session alongside Trials PP tuning). Skill PP flows into the same family headline and, eventually, the Phase 3 league currency.
5. **Between sessions** (Phase 0, shared device): the gap meter, the next rung's technique cues, and the Record Book are the pull. In Phase 2, the teen companion app makes the skill ladder the teen's home surface and his solo practice logs feed the family Pact — the drift he already demonstrated becomes a feature instead of a loss.
6. **Deliberate absences:** no streak/decay mechanics on skills (the Pact owns consistency; aspiration should never punish absence); no sibling rankings (the Record Book shows everyone's rungs — proximity is visible, the app never editorializes); no cosmetic badges.

## Session-engine integration

This section instantiates planner-spec **H8** and **soft objective 5**; vocabulary is the planner's.

- **The skill-practice block** (≤8 min per H8; v0 fixed at 6 ⚙) is placed as the **first work block after warm-up** — motor-quality work happens fresh, and the block doubles as lower-intensity spacing before conditioning. Structure: **parallel stations** — each member performs their current rung's practice drill (the "Practice" column above) simultaneously: the teen holds tuck-lever sets at the bar while the 9-year-old does chair squats and dad grinds HSPU negatives. Because the Pull-Up path gives everyone a rung, the block reads as *the family's skill minutes*, not one kid's sidebar — the shared-session feel survives.
- **Pattern accounting:** every practice drill is a library entry with `skill_path`/`rung` metadata plus the normal pattern tag, so its volume counts in H2 balance and H3 recovery — a front-lever practice night reduces that session's vertical-pull conditioning volume automatically. No parallel bookkeeping.
- **Frequency and focus:** 2-3×/week per active path (soft objective 5 ⚙); members hold at most **2 active paths** ⚙ (focus, and volume sanity). New hard-ish rule for the planner: straight-arm isometric volume (front lever) capped at 3 practice days and ~90s total hold time per session ⚙ (see safety).
- **Tests:** member-declared, any qualifying session, performed at the top of the skill block per the uniform protocol (rule 5). Attempt-liberal — no cooldowns ⚙: failed max attempts self-limit physically, and scarcity belongs to Trials and Challenges; aspiration is never rationed. Trials-taper sessions (H3) suspend test attempts but keep light practice.
- **Short sessions:** H8 marks the block skippable; when the budget forces a drop, drop-priority should protect members with a small measured gap (a kid 2 seconds from a rung shouldn't lose his block to a 25-minute Tuesday). Recorded as a soft-objective refinement for the engine design session.
- **Planner-spec deltas to fold in:** (a) library metadata gains `skill_path`/`rung` and `household_surface` tags; (b) roster's "active skill stages" concretizes to (path, rung, best_practice_result); (c) soft objective 5 gains gap-proximity drop protection; (d) straight-arm weekly volume cap ⚙.

## Age & safety gating

**Philosophy: prerequisite gates over age gates.** The paths contain no external load, no loaded impact, no ballistic landings — strict reps and isometrics, the modality profile youth strength-and-conditioning guidance treats as lowest-risk under supervision (REPORTED from the general NSCA youth-training position; founder should sanity-check against his own reading). Every stage that *looks* risky sits behind a strength standard a young child cannot shortcut: an 8-year-old physically cannot reach muscle-up transition work without first building Strict 10 — and the strength that unlocks the stage is the strength that makes it safe.

Explicit gates on top of that construction:

| Gate | Mechanism |
|---|---|
| Muscle-Up rungs 3-6 | Parent present, park bar required (spotting + honest judging). H6 age-gate tag: `parent_present`. |
| HSPU rungs 3+ | Bail-out is a rung-3 *pass standard* (can't reach inversion work without demonstrating the escape); parent present for first attempts at each new rung. Cervical rule surfaced every session: **head touches, never rests** — the towel is a target, not a support. |
| Front Lever, under-10s | ⚙ Founder call: pause at rung 4 (advanced tuck) pending observation, or gate by symptom + volume cap only. Connective tissue adapts slower than muscle in growing kids; the volume cap (≤3 days, ~90s holds/session) applies to everyone. Plain-spoken rule at presentation: "Elbow ache is not muscle burn. Ache = stop, tell Dad." |
| Every rung test | Witnessed by a parent, by protocol — the witness *is* the universal gate. |
| Bar sessions | Doorway-bar mount check enters the warm-up whenever a session includes bar work — the most likely real household hazard ⚙ (founder has lived data here). |

Each rung carries a founder-reviewable `safety_note` field (one or two plain lines in the coach voice — "Pain ≠ fatigue. Pain = stop."), authored in the path definition and surfaced at practice and test time per H6. No %1RM, no absolute-load targets anywhere; all standards are bodyweight-relative, so pre-pubertal kids never chase adult numbers.

## Skills v0 — the Phase 0 cut

Skills v0 exists to answer the gate question, nothing else. **Build:**

1. **Path definitions as founder-editable config** — the 5 paths above, every standard founder-reviewed before family use (same discipline as the exercise library).
2. **Per-member state:** enrollment (≤2 paths), rung pointer, practice + test log (date, result, witness).
3. **One skills surface:** per-path ladder view (all rungs, current highlighted, next standard verbatim, measured gap from best logged practice) + a log-test flow (pass/fail, measured value, witness). Text technique cues only.
4. **The unlock moment:** one full-screen takeover (member, rung, date) on the shared display + a permanent Record Book line. **Scope call for the founder:** the roadmap doesn't list the Record Book in Phase 0 — this design pulls a thin slice in (a chronological list surface, skill unlocks + structure ready for Trials PBs), because unlock *permanence* is precisely the hook under test. It's a list; it's cheap.
5. **Planner H8 minimal:** fixed 6-min skill block, parallel stations from the rung's practice drill, pattern accounting, 2×/week target. No readiness detection.
6. **Instrumentation — the actual point:** local counters for skills-surface opens outside sessions (which member's ladder), tests declared, practice sets completed vs. skipped, unlocks. Proposed numeric reading of the gate's "engages skill paths unprompted": the 14-year-old's ladder viewed outside sessions ≥1×/week AND ≥1 self-declared test per 2 weeks, sustained across the 4-week gate window ⚙.

**Cut (explicitly not in v0):** readiness auto-suggestions; any photo/video content (dad demonstrates form live); Progress Points minting (the economy lands with Trials in Phase 1 — v0 preserves full unlock history so summer unlocks retro-mint); celebration polish beyond the single full-screen moment; "beyond" rungs past each terminal skill (freestanding handstand etc.); path-authoring UI; sharing or percentiles; a 6th path; per-member drill variants beyond the rung's prescription.

## Open questions for the founder

1. **Doorway-bar physics:** does chest-to-bar clear on the home bar? Is a ~weekly park outing for Muscle-Up rungs 3-6 realistic, and does framing it as an event land with the 14-year-old?
2. **Placement calibration:** does the 14-year-old pass Muscle-Up entry (Strict 10) on day one? Where do the 9- and 10-year-olds place on the Pull-Up and Pistol paths? The placement spread is the first test of rung spacing (design rule 3).
3. **The first muscle-up's strictness line** — controlled hip drive allowed (as drafted) or stricter?
4. **Front lever for the under-10s** — pause at advanced tuck, or symptom + volume gating only?
5. **Attempt-liberal tests** (no cooldown, as drafted) — or a light cadence limit to protect the moment's weight?
6. **Record Book thin slice into Phase 0** — approve the scope add?
7. **Two active paths per member** — right cap, or will the teen want three?
