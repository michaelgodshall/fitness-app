# Trials & Challenges 2.0

_Design doc — July 2026 (Fable session). Redesigns `docs/legacy/02-systems-architecture.md` §3-4 for the new vision. Status: draft for founder review._

---

## What the legacy design got wrong

1. **The family score punishes inclusion.** Legacy family scoring = simple average of member tiers, rounded down. Add your 6-year-old and the family score *drops*. The flagship metric of a product whose mission is "keep the family training together" penalizes training together. This is a bug, not a tradeoff.
2. **Universal tiers give young kids no reachable next rung.** Absolute thresholds (Champion = 71+ push-ups) are sacred for honesty — but an 8-year-old can sit in Rookie for a year with nothing to celebrate.
3. **One attempt, first Mon-Sun, no makeups** is brittle against the #1 observed failure mode: busy weeks. Miss the window, lose the month's ritual.
4. **A 5-test max-effort battery in one sitting** strains young kids' focus (and the 45-min cap, with warm-ups).
5. **Trials is a form, not an event.** No anticipation, no aftermath, no artifact. The emotional shape of a "monthly proving ground" was never designed.

## Trials 2.0

### Two-axis scoring: Capacity + Progress

- **Capacity (individual, absolute, sacred).** Universal tier thresholds per test, Rookie → Champion, unchanged from legacy philosophy. Never age-adjusted. This is the honest measure — athletic respect demands it stays.
- **Progress (the family headline).** **Progress Points**: earned whenever a member sets a new *all-time best* on a test, scaled by margin of improvement. The family's monthly Trials result = total Progress Points + participation.
  - Adding a member can only **add** points — the inclusion bug dies.
  - Kids improve fast and out-earn dad — correct emotional physics (kids should shine; dad's win *is* their progress).
  - Anti-gaming by construction: baseline is *all-time best*, so sandbagging one month buys nothing (you only score by beating your best-ever).
  - **Continuity dividend:** Progress Points are the exact metric phase-3 family-vs-family leagues use — size- and age-fair by construction. We validate the league currency years before the league exists.
- Family absolute tier (legacy average) survives as a secondary stat on the report, not the headline.

### Trials Week, flexible by design

- The 5-test battery may be **split across up to 3 sessions** within Trials week (each test still one attempt). A 20-minute Tuesday can be Trials session 1 of 2.
- **Grace weekend:** miss the week, and the following weekend still counts (flagged "late," streak intact). Consistency-over-perfection applies to the flagship ritual too.

### Trials as an event (the emotional arc)

1. **Taper:** the session engine automatically lightens the 2-3 sessions before Trials week — the coach says why ("Trials Saturday. We go in fresh."). Anticipation is built by the *engine*, not a push notification.
2. **The event:** big-screen ceremony treatment — each test framed, previous bests on screen, one member performing while others count/judge (the judging role is itself a bonding mechanic and keeps young kids engaged between their turns).
3. **The report:** coach-generated Trials Report — per-member deltas, Progress Points, tier movements, one highlighted moment ("Ryan's first 20-second dead hang"). The artifact families keep and (phase 2) share.

### The Family Record Book

Permanent, prominent surface: every member's all-time best per test, skill unlocks, and family milestones (100th session, first family 5-week streak, first muscle-up). Cheap to build, compounds emotionally forever, and is the natural home of Progress Points history. *The gym wall where records get chalked.*

## Challenges 2.0

**Kept from legacy:** earned unlock (6 workouts — cadence-limits max-effort events), fixed workouts with published tier tables (comparability), one attempt per unlock, safety screens.

**Changed:**

1. **New flagship format — the Co-op Challenge.** One shared work pool, whole family against it together: *"The Family 500 — 500 total reps, tag in/out freely, 25-minute cap."* Pool scales deterministically with roster (published formula: per-member quota by age-band... spec in engine design). The 6-year-old's 15 squats count the same as dad's. Scored on completion + time, as a *family*. This is the purest expression of "shared struggle bonds" in the whole product — legacy Challenges were individual efforts scored side-by-side; this is one effort.
2. **Format rotation:** alternate individual-scored (AMRAP, For-Time) and Co-op Challenges so both muscles — personal grit and family unity — get trained.
3. **Legacy AFRAP format is cut.** Its spec was ambiguous in the legacy doc (scoring description didn't cohere); two clean individual formats + Co-op is enough. Revisit only with a clean spec.
4. **Phase 2 hook — Challenge percentiles:** your family's co-op result vs. all families who ran the same challenge (asynchronous, no liquidity needed). The shareable result card lives here too.

## Interaction with the session engine (design note)

Generated sessions mean whole workouts rarely repeat — so legacy "workout PBs" (template-level) mostly die. Replacement: the planner schedules a recurring **benchmark block** (~every 2 weeks, same block structure inside an otherwise fresh session) to manufacture "beat last time" moments deliberately. Trials PBs (exercise-level) are unaffected. This constraint goes into the planner spec.

## Open questions for the founder

1. Progress Points tuning: points for tier-climbs vs. any PB margin — flat vs. scaled? (Engine design session.)
2. Co-op pool formula: per-member quota by age band vs. by demonstrated capacity (Trials-informed)? Capacity-informed is fairer but couples systems.
3. Should the grace weekend be always-available or once-per-quarter (scarcity preserves the ritual's edge)?
