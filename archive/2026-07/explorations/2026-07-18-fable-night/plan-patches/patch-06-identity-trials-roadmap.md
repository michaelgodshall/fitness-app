---
patch: patch-06-identity-trials-roadmap
findings: F21 (Phase 0 family identity mechanism), F22 (Trials battery + tier tables — Phase 1 blocker), F25 (adopted backlog → roadmap placement)
targets:
  - docs/design/engine-data-model.md §1.4 (F21 — durable family-doc note)
  - docs/design/workout-experience.md §2 (F21 — join paragraph continuity note)
  - docs/design/trials-and-challenges.md ("## Trials 2.0" → new battery section) (F22)
  - docs/03-roadmap.md §Phase 1, §Phase 2 (F25)
status: proposals only — no doc edited tonight; every proposed change is additive
rulings-applied: none exist for F21/F22/F25 (all in the "REMAINING for next session" list) → best-reasoned proposals; FOUNDER CALLs flagged inline
fences-honored: no auth in Phase 0 · COPPA persistent-identifier caution · no gender in data model · Capacity tiers never age-adjusted · numeric gates untouched
note: PLAN §Approach-1 (an F21-named file) needs NO edit — it already states the anonymous-Convex/room-code data boundary; the gap F21 flags is the *mechanism note*, which this patch adds to the data model + experience doc (the boundary's owners), leaving the locked PLAN untouched.
---

# Patch 06 — Family identity (F21), Trials battery (F22), roadmap backlog placement (F25)

---

## EDIT 1 — F21: durable anonymous family document (engine-data-model.md §1.4)

**TARGET:** `docs/design/engine-data-model.md` — §1.4 Family & members (intro, before the `Family` interface)

**CURRENT** (exact):
```
### 1.4 Family & members

```ts
export interface Family {
```

**PROPOSED** (replacement — inserts a prose note between the heading and the code fence; the `Family` interface below is unchanged):
```
### 1.4 Family & members

**Identity & persistence (Phase 0, no accounts).** A `Family` is a **durable anonymous document** minted server-side on the first-ever session — its `FamilyId` is the one stable key that ties every session, slice, PB, Record-Book line, and Pact week to "this family" across weeks, with no login, email, or account (PLAN §Approach-1 data boundary; Phase 1 layers Clerk accounts on top of the same doc, per ADR-001). The display device is the family's home: it persists the `FamilyId` in local storage and re-opens straight into the family. **Room codes are ephemeral, not identity** — a fresh per-session join code (workout-experience §2) is a short-lived slice *over* the durable doc; it rotates every session and never keys history. **Continuity without login** rides on (display local store + the server doc keyed by `FamilyId`); to survive display-device loss or add a second display, the family is shown a **re-open code** once at creation (the `FamilyId` rendered as a memorable word-pair, retrievable in settings) that re-attaches a new device to the existing doc. Lost with no re-open code at Phase 0 scale = the server doc is orphaned, not destroyed (acceptable, founder-family only). **COPPA caution:** `FamilyId`, the re-open code, session tokens, and Convex/IP/hosting logs are *persistent identifiers* → they belong in the Phase 1 COPPA data map (already required by PLAN §Approach-3 / roadmap COPPA gate). The re-open code is **family-level, never child-level**, and nothing persistent ever lands on a child's device (§2 / §6.4 session-scoped controller identity).

```ts
export interface Family {
```

**RATIONALE:** Implements F21 — the docs specified "anonymous Convex state" and "slices join via room-code links" but never named the durable key that survives across weeks or the device-loss story. This states the mechanism inside the Family doc's owning type, consistent with PLAN's data boundary and the COPPA persistent-identifier caution PLAN §Approach-3 already flags. Additive prose only; does not touch the F31/F32-pending capability/Pact fields, so it is safe to apply ahead of those merges.

**FOUNDER CALL — re-open-code UX.** Recommend a memorable **word-pair** re-open code shown once at family creation ("your family's re-open code: *anvil-harbor*") plus a "bookmark this page" fallback. Alternatives: a printable QR, or defer any recovery affordance to Phase 1 accounts (founder-family can just not lose the laptop). Recommend the word-pair now — it is a few hours of work and removes a single-point-of-failure on the one device the whole product lives on this summer.

---

## EDIT 2 — F21: continuity note on the join paragraph (workout-experience.md §2)

**TARGET:** `docs/design/workout-experience.md` — §2 "Join (no accounts, no install — Phase 0)"

**CURRENT** (exact):
```
Scan the lobby QR (or type the 4-letter code) → phone browser opens the controller → pick your member tile. Identity is **session-scoped**: the phone holds a session token mapped to a family-member profile that lives on the family's own display device/account. No login, no email, nothing persistent on the kid's phone. This keeps Phase 0 account-free, keeps the COPPA surface at zero (no child credentials, no child PII on child devices), and stays inside the spirit of the shared-family-device fence — see §6 for the fence-wording flag.
```

**PROPOSED** (replacement — appends two sentences; existing text unchanged):
```
Scan the lobby QR (or type the 4-letter code) → phone browser opens the controller → pick your member tile. Identity is **session-scoped**: the phone holds a session token mapped to a family-member profile that lives on the family's own display device/account. No login, no email, nothing persistent on the kid's phone. This keeps Phase 0 account-free, keeps the COPPA surface at zero (no child credentials, no child PII on child devices), and stays inside the spirit of the shared-family-device fence — see §6 for the fence-wording flag. The **4-letter room code rotates every session and is not the family's identity** — it is an ephemeral join code over the family's durable anonymous document (engine-data-model §1.4), which is what actually persists sessions, PBs, and the Pact across weeks. Losing the room code costs nothing; the display device re-opens the family from local storage, and a family-level **re-open code** (never a child credential) re-attaches a replacement or second display to the same family doc.
```

**RATIONALE:** Implements F21's second named file. §2 currently says the profile "lives on the family's own display device/account" but leaves per-session room code vs. durable identity ambiguous — this pins the room code as ephemeral and points to the §1.4 durable-doc mechanism, closing the drift without altering the session-scoped-controller COPPA posture the paragraph establishes.

---

## EDIT 3 — F22: the fixed Trials battery + tier tables (trials-and-challenges.md)

**TARGET:** `docs/design/trials-and-challenges.md` — insert a new section between the `## Trials 2.0` heading and `### Two-axis scoring: Capacity + Progress`

**CURRENT** (exact):
```
## Trials 2.0

### Two-axis scoring: Capacity + Progress
```

**PROPOSED** (replacement — inserts `### The battery (fixed 5 tests)` before the scoring subsection):
```
## Trials 2.0

### The battery (fixed 5 tests)

The Trials battery is **fixed forever** (CONTEXT: Trials = "the sacred, never-varying benchmark") — five tests, one per movement category, each a single all-out attempt. Every standard is parent-judgeable with a phone (a rep count or a timer value), the same bar the skill paths hold to. Splittable across up to 3 sessions in Trials week (§Trials Week).

| # | Category | Test | Metric | Standard (parent-judged) |
|---|---|---|---|---|
| 1 | Push | Max strict push-ups | reps | chest to fist-height, full lockout, no piking/resting |
| 2 | Pull | Max dead hang | seconds | feet clear, no regrip; the timer stops on release (anchors Pull-Up path rung 1 = 30s) |
| 3 | Legs | Max bodyweight squats | reps | crease-below-knee depth, full stand, no pausing at bottom |
| 4 | Core | Max plank hold | seconds | forearm plank, flat line hips-to-shoulders; timer stops when the line breaks |
| 5 | Endurance | Burpees in 3 min | reps | chest to floor + full stand each rep; count what's completed at 3:00 |

**No equipment beyond a pull-up bar** (dead hang), consistent with the H4 fence. **No gender in any threshold and no age adjustment** — this is the **Capacity** axis (CONTEXT: "each member's universal tier per test; never age-adjusted"); a young child and an adult are scored against the identical table, which is exactly why the family headline is Progress Points, not Capacity (§Two-axis scoring). Skill-path standards stay separate from Trials (a Trials test is a max-effort measure; a rung is a fixed unlock) but are numerically consistent where they touch (dead-hang 30s = Pull-Up rung 1; the push-up battery shares the strict-rep standard that gates the HSPU path's entry of 10).

### Tier tables (Capacity, universal — Rookie → Champion)

Six universal threshold bands per test, fixed forever (CONTEXT: Tier). A result below the Rookie floor is **Unranked** — no tier yet, but it still records a valid all-time-best baseline that Progress Points mint against next Trials. Push-up bands are carried forward verbatim from the legacy battery (`docs/legacy/02-systems-architecture.md` §3.2); the other four tables are **new proposals** and every one is a founder-calibration call against the 16 months of lived data.

| Test (metric) | Rookie | Trainee | Skilled | Advanced | Elite | Champion |
|---|---|---|---|---|---|---|
| Push-ups (reps) | 1–10 | 11–20 | 21–35 | 36–50 | 51–70 | 71+ |
| Dead hang (sec) ⚙ | 1–15 | 16–30 | 31–50 | 51–75 | 76–105 | 106+ |
| Squats (reps) ⚙ | 1–20 | 21–40 | 41–65 | 66–95 | 96–130 | 131+ |
| Plank (sec) ⚙ | 1–30 | 31–60 | 61–100 | 101–150 | 151–210 | 211+ |
| Burpees/3 min (reps) ⚙ | 1–20 | 21–35 | 36–50 | 51–65 | 66–80 | 81+ |

⚙ = founder-validate the four non-push-up tables against lived data before Phase 1 (they are the Capacity honesty bar and, once families train against them, they are fixed forever — get them right before the first beta family sees them).

### Two-axis scoring: Capacity + Progress
```

**RATIONALE:** Implements F22, the flagged Phase 1 blocker — the battery, standards, and tier tables existed only in superseded legacy docs. The battery mirrors the legacy MVP categories; the push-up table is carried verbatim (the one legacy table with real thresholds) and the four missing tables are proposed and ⚙-flagged. It honors the no-gender / never-age-adjusted rule (Capacity axis per CONTEXT) and aligns the pull test and push standard with the skill-progression standards (dead-hang 30s, strict-10 push entry). It slots ahead of the existing scoring subsection so "tier" is defined before the two-axis text references it.

**FOUNDER CALL — the Pull test: dead hang vs. max strict pull-ups.** The legacy doc offered "Dead Hang **OR** Inverted Rows." Recommend **max dead hang**: (a) every member scores (a 9-year-old with zero pull-ups still holds a hang, so the Capacity table never zeros a child), (b) it anchors cleanly to Pull-Up path rung 1, (c) it needs only the bar the product already assumes. The cost: it measures grip/scapular endurance, not pulling strength, and the Pull-Up skill path already carries the true pulling ladder. Alternative if the founder wants pull-strength in the battery: **max strict pull-ups** (truer, but zeros pre-pull-up kids on the flagship metric — mitigated only because Progress Points, not Capacity, are the headline). Recommend dead hang.

---

## EDIT 4 — F25: adopted Phase 1 backlog → roadmap §Phase 1 (docs/03-roadmap.md)

**TARGET:** `docs/03-roadmap.md` — §Phase 1, end of the `**Do:**` paragraph

**CURRENT** (exact):
```
**Do:** naming/brand sprint (before recruitment); incumbent recon + **substitute map** (YouTube/"dad does it manually," youth sports conditioning, homeschool PE, AI generators); recruit **10-15 families** (≤⅓ founder-close) via intentional-father/church communities + r/daddit — free, founding-year price honored later (no lifetime promises); A/B "adaptive coach" vs "AI coach" framing; monthly voice-of-customer calls.
```

**PROPOSED** (replacement — appends one adopted-backlog line):
```
**Do:** naming/brand sprint (before recruitment); incumbent recon + **substitute map** (YouTube/"dad does it manually," youth sports conditioning, homeschool PE, AI generators); recruit **10-15 families** (≤⅓ founder-close) via intentional-father/church communities + r/daddit — free, founding-year price honored later (no lifetime promises); A/B "adaptive coach" vs "AI coach" framing; monthly voice-of-customer calls.

**Adopted backlog (committed scope; specs in docs/design/pre-mortem-and-backlog.md §Idea backlog):** Rematch Night · Earned Streak Insurance · Then-vs-Now Recap · Apprentice Coach.
```

**RATIONALE:** Implements F25 — these four were labeled "Adopted Phase 1" in the pre-mortem but appeared in no roadmap phase, leaving their scope status ambiguous. Adds the pointer line the finding's fix recommends (rather than downgrading to "candidate") because the pre-mortem marks them adopted, not candidate.

---

## EDIT 5 — F25: adopted Phase 2 backlog → roadmap §Phase 2 (docs/03-roadmap.md)

**TARGET:** `docs/03-roadmap.md` — §Phase 2, after the Teen-companion bullet

**CURRENT** (exact):
```
- **Teen companion access:** 13+, parent-granted, own device; solo sessions feed the family Pact
- Content marketing engine on (founder-authentic scaling demos; build-in-public)
```

**PROPOSED** (replacement — inserts one adopted-backlog bullet between them):
```
- **Teen companion access:** 13+, parent-granted, own device; solo sessions feed the family Pact
- **Adopted backlog (committed scope; specs in docs/design/pre-mortem-and-backlog.md):** Beat Dad's Ghost (teen races the parent's real logged performance at the same age/stage) · Squad Consistency Bar (4-6 households, one shared weekly bar) · standing-training-window scheduling as a first-class role for the non-training parent (theme 5)
- Content marketing engine on (founder-authentic scaling demos; build-in-public)
```

**RATIONALE:** Implements the Phase 2 half of F25 — Beat Dad's Ghost, Squad Consistency Bar, and theme 5's Phase 2 scheduling role were all adopted in the pre-mortem but absent from the roadmap's Phase 2. (Theme 5's Phase 1 half — the both-parent monthly recap — is already in the Phase 1 Build list, so it is not re-added here.)

---

## Verification checklist (re-read after applying)

1. **F21 consistency:** engine-data-model §1.4 note and workout-experience §2 addition agree — room code ephemeral, `FamilyId`/durable doc persistent, re-open code family-level only. Confirm neither contradicts PLAN §Approach-1's "anonymous Convex state / no auth" or §6.4's session-scoped controller identity. Confirm the F31/F32-pending `Family`/`PactWeek` fields were not touched (this patch adds prose above the `Family` interface only).
2. **F22 no-gender / no-age-adjust:** grep the new battery section for any age or gender qualifier on a threshold — there must be none; tiers are the Capacity axis and universal. Confirm the tier names match CONTEXT (Rookie/Trainee/Skilled/Advanced/Elite/Champion) and that "Calibration Trials mints 0 PP" (F8, already in the doc) still reads correctly directly below the new section.
3. **F22 skill alignment:** dead-hang Trainee band still contains 30s (Pull-Up rung 1) and the push-up standard still matches the HSPU-entry "10 strict push-ups" in skill-progressions.md §Path 3.
4. **F22 founder homework:** the four ⚙ tables and the Pull-test FOUNDER CALL are on Michael's decision list before Phase 1 library authoring (they are fixed-forever once a beta family trains against them).
5. **F25:** every "Adopted Phase 1/Phase 2" row in pre-mortem-and-backlog.md now appears in exactly one roadmap phase; theme 5's recap (Phase 1) is not double-listed. Confirm the F2 line "Anything not listed here is not Phase 0" is not contradicted — all added items are Phase 1/2, none leak into Phase 0.
