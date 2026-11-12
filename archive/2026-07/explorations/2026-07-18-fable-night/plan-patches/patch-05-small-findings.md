---
patch_id: patch-05-small-findings
findings_addressed: F19, F27, F28, F29, F30
target_files:
  - docs/design/session-planner-spec.md
  - docs/design/coach-voice.md
  - docs/design/workout-experience.md
  - docs/design/skill-progressions.md
  - docs/design/trials-and-challenges.md
  - docs/01-product-vision.md
status: READY FOR FOUNDER REVIEW — apply next session
---

## F19 — Age-band enum: canonicalize, don't redefine

**Finding text said "enumerated nowhere," but it already exists**: `engine-data-model.md:44` —
`export type AgeBand = '6-7' | '8-10' | '11-13' | '14-17' | 'adult';` — landed after the
finding was written. No new enum needed. The fix is reference discipline, not invention.

TARGET: docs/design/engine-data-model.md, line 44 (no change — this becomes the canonical
anchor other docs point to)
CURRENT: (unchanged)
PROPOSED: Add a trailing comment: `// canonical enum — session-planner-spec.md, coach-voice.md, workout-experience.md, trials-and-challenges.md, skill-progressions.md all key off this exact set; do not restate the band boundaries elsewhere.`
RATIONALE: Prevents future drift by marking the single source of truth inline, per F19's intent (enumerate once, reference everywhere).

Sites that use age-band-shaped language but never cite the enum — add a pointer at each:

1. `session-planner-spec.md:16` — roster field "age band" → append `(AgeBand, engine-data-model.md §1)`.
2. `session-planner-spec.md:35` (H11) and `:53` — "under ⚙11" → this is a *boundary drawn across* AgeBand (6-7, 8-10 are under-11; 11-13+ are not), not a band itself. Add a footnote: "under-11 = AgeBand '6-7' | '8-10'."
3. `coach-voice.md:229` — "selection tags (moment, age band, roster size, tone weight)" → append `(AgeBand enum, engine-data-model.md)`.
4. `coach-voice.md` §3 register table (line 58) — the three registers (Sam/Ryan/Dad) are illustrative examples, not a 1:1 map to the 5-band enum. Add one line above the table: "These three registers are chosen by AgeBand: '6-7'/'8-10' → Sam register, '11-13'/'14-17' → Ryan register, 'adult' → Dad register." (FOUNDER CALL: confirm 11-13 doesn't want a fourth intermediate register — the doc's own §3 note about "13-15" in the findings summary suggests this was debated; the enum now says 11-13/14-17, so re-check register mapping isn't off by one band.)
5. `trials-and-challenges.md:48` (co-op pool) — "per-member quota by age-band" → append `(AgeBand, engine-data-model.md; table itself is M11, still open)`.
6. `skill-progressions.md` prerequisite-gate language (§ safety, "age gates fill the gaps") → append pointer to AgeBand + H6/GateTag.
7. `engine-data-model.md:66` (`gates: GateTag[]` comment "member age band") → already correct, no edit needed, listed for completeness.

VERIFICATION: grep every doc in target_files for `age band|age-band` post-edit; each hit should either be inside engine-data-model.md's definition or carry a `(AgeBand, engine-data-model.md)`-style pointer. No doc should restate `'6-7' | '8-10' | ...` literals.

---

## F27 — Age floor: state it

FOUNDER CALL — no ruling on record. Evidence: `engine-data-model.md`'s AgeBand enum already
starts at `'6-7'`, and `trials-and-challenges.md` uses a 6-year-old in its running example — the
design has been *building* to a 6-year floor without ever saying so, while `01-product-vision.md`
states only the 8-14 *primary* sweet spot. These aren't contradictory (primary ≠ floor) but the
floor itself is unstated. Recommend ratifying 6 as the floor, matching what's already built.

TARGET: docs/01-product-vision.md, after line 45 ("Primary: intentional fathers (30-50)
training with kids in the 8-14 sweet spot...")
CURRENT:
"**Primary:** intentional fathers (30-50) training with kids in the **8-14 sweet spot**, with engagement designed to stretch to ~16 via skills and (later) competition."
PROPOSED (insert new bullet immediately after):
"- **Supported floor:** 6 years old (AgeBand '6-7', engine-data-model.md). Below the primary sweet spot the product still works — H11 youth session-level safety and prerequisite-gated skill paths carry the load — but 8-14 is the design center; nothing below 6 is supported (no data model, no safety review, no voice register)."
RATIONALE: Matches the enum floor already shipped in engine-data-model.md and the 6-year-old already used as a live example in trials-and-challenges.md, closing F27 without inventing new scope. FOUNDER CALL: confirm 6 (not e.g. 5 or 7) — this is a safety-adjacent product decision, not a documentation nit.

---

## F28 — Lobby time dial: reconcile with planner's 15-45 range

TARGET: docs/design/workout-experience.md, §S1
CURRENT:
"**Time dial:** \"How much time?\" — three big presets (20 / 30 / 45) plus a nudge control. Settable from any joined phone or the display; last write wins with attribution (\"Dad set 30 min\"). 45 is the ceiling, always (principle 4)."
PROPOSED:
"**Time dial:** \"How much time?\" — three big presets (20 / 30 / 45) plus a nudge control that steps ±5 min across the planner's full accepted range (15-45; session-planner-spec.md `time_budget`). Dragging or stepping the nudge below 15 crosses into **micro-session mode** (session-planner-spec.md: warm-up + one circuit, still Pact-eligible) — the dial shows a visual mode-change (e.g., label swaps to \"Quick one\") rather than a silent number change, so the room knows the session shape just shifted, not just its length. Settable from any joined phone or the display; last write wins with attribution (\"Dad set 30 min\"). 45 is the ceiling, always (principle 4); 15 is the floor before micro-session mode engages."
RATIONALE: Closes the gap the finding names — the dial previously had no way to reach 15-19 min (a legitimate planner range) or to signal micro-session mode, which is a different *shape* of session, not just a shorter one, and the room should see that distinction per the coach-voice "the shared screen never shames" principle (comparable UI honesty concern).

---

## F30 — Absence Ledger: minimal surface

TARGET: docs/design/workout-experience.md, §S1 (lobby open)
CURRENT (last sentence of §S1):
"The lobby also surfaces **catch-up cards** for this week's missed sessions (\"W2D2 — your part, ~14 min\" → slice mode, §3)."
PROPOSED (append new bullet after the catch-up-card sentence):
"- **Absence tag prompt:** the first time a member's tile lights (joins) after a session they were rostered for but missed, a single low-friction chip appears next to their tile for that one lobby only: three tap-targets (Busy / Sick / Forgot) plus dismiss-without-answering. No text entry, no required response, never blocks Go. This is the Absence Ledger's only UI surface (session-planner-spec.md: \"skips carry a 5-second reason tag\") — coach-voice.md's absence rules (§2.3: never asks *why* in the moment, never names it in front of siblings) are satisfied because the tag is self-reported by the missing member on their own return, not solicited by the coach or visible to others."
RATIONALE: Implements the finding's fix directly (tag prompt at next lobby open after a missed session) while satisfying coach-voice's existing constraint that the coach itself never asks for or displays absence reasons — the prompt is a silent UI affordance the returning member can ignore, not a coach-voice line. FOUNDER CALL: confirm three fixed reasons (Busy/Sick/Forgot) are the right taxonomy — session-planner-spec.md only says "a recurring reason biases the planner" without naming the reason set, so this list is proposed, not ratified.

---

## F29 — Placeholder families: standardize on Dad(42)/Ryan(14)/Leo(10)/Sam(8)

Canonical per `coach-voice.md:5` ("doc-canon: they double as the eval goldens"). Deviations to fix:

TARGET: docs/design/workout-experience.md, line 14
CURRENT: "lagging loggers get a gentle pulse (never \"waiting on Eli…\" text)"
PROPOSED: "lagging loggers get a gentle pulse (never \"waiting on Leo…\" text)"

TARGET: docs/design/workout-experience.md, line 50
CURRENT: "Dad 15 / Max 12 / Ryan 8 on the same screen"
PROPOSED: "Dad 15 / Ryan 8 / Leo 12 on the same screen" (FOUNDER CALL: pick which two members illustrate the relative-loading example — original used two kids' names (Max, Ryan) alongside Dad; canon family has three kids (Ryan 14, Leo 10, Sam 8), so this patch arbitrarily picked Ryan+Leo — swap in whichever pairing reads best.)

TARGET: docs/design/workout-experience.md, line 68
CURRENT: "\"Thursday we pull. Eli's dead-hang benchmark returns.\""
PROPOSED: "\"Thursday we pull. Ryan's dead-hang benchmark returns.\""

TARGET: docs/design/workout-experience.md, line 158
CURRENT: "The room knows Max is 3 reps from his all-time best"
PROPOSED: "The room knows Ryan is 3 reps from his all-time best"

TARGET: docs/design/skill-progressions.md, line 119
CURRENT: "\"Aug 12 — Dylan — Chest-to-Bar (Muscle-Up path, 1/6) — witnessed: Dad.\""
PROPOSED: "\"Aug 12 — Ryan — Chest-to-Bar (Muscle-Up path, 1/6) — witnessed: Dad.\"" (Ryan is the 14-year-old in canon family and the doc's own muscle-up-aspiration narrative elsewhere refers to "the 14-year-old" — this is the correct canon substitution, not arbitrary.)

RATIONALE (all five edits): F29 as written — adopt coach-voice.md's canonical family everywhere. Straight name-swap, no content change; Eli/Max/Dylan never had defined ages elsewhere so no downstream age-logic breaks.

---

## Verification checklist (re-read after applying)

1. `grep -rn "\bMax\b\|\bEli\b\|\bDylan\b" docs/design/` → zero hits outside this patch file and design-review-findings.md's own F29 citation.
2. `grep -rn "age band\|age-band" docs/design/ docs/01-product-vision.md` → every hit either in engine-data-model.md's definition or carrying an explicit `(AgeBand, engine-data-model.md)` pointer.
3. Re-read `coach-voice.md` §3 register table against the AgeBand enum boundaries (6-7/8-10/11-13/14-17/adult) to confirm the FOUNDER CALL on register-to-band mapping got resolved, not skipped.
4. Re-read `workout-experience.md` §S1 top-to-bottom for narrative flow after inserting the dial reconciliation and absence-tag bullet — both were appended, confirm they don't collide with the existing catch-up-card sentence.
5. Re-read `01-product-vision.md`'s member section to confirm the new age-floor bullet doesn't read as contradicting the 8-14 primary sweet spot (floor vs. center distinction should be legible on first read).
6. Cross-check `docs/design/design-review-findings.md` header's "REMAINING for next session" line — once applied, F19/F27/F28/F29/F30 should be struck or moved to a "FIXED (patch-05)" note in that doc (edit deferred to founder per task constraints — this patch does not touch findings.md).
