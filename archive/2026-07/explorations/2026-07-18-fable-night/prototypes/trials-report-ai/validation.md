# Tier-2 Validation Gates + Tier-1 Fallback

_EXPLORATION / PROTOTYPE — 2026-07-18 Fable night. The mechanical validators every Tier-2 Trials Report passes BEFORE the family ever sees it (coach-voice.md §6). No gate is a taste judgment — each is a deterministic check a unit test can run. A report that fails ANY gate is discarded silently and the Tier-1 skeleton (bottom of this doc) renders instead. Sequence: **generate → validate → display-or-fallback.** The family never sees a failure; they see a plainer report or a late one._

---

## The pipeline

```
emit facts payload  →  Tier-2 generate  →  validate(report, payload)  →  ┐
                                                                          ├─ all pass → display Tier-2 report
                                                                          └─ any fail → log failure + display Tier-1 skeleton(payload)
offline / model unreachable  ─────────────────────────────────────────────→ display Tier-1 skeleton(payload)
```

Every failure is logged with the failing gate, the offending span, and the payload id — this is the eval signal that tightens the prompt over time. A high fallback rate is a prompt bug, not a runtime feature.

---

## Gate 1 — Fact traceability (the load-bearing gate)

**Claim:** every number the report prints exists in the payload. This is the mechanical enforcement of "may add zero facts."

```
function gate_fact_traceability(report, payload):
    # 1. Build the allow-set: every numeric fact the engine emitted.
    allowed = number_multiset_from_payload(payload)
        # pulls: every score, priorBest, delta (abs), tier threshold in play,
        #        progressPoints (member + total + breakdown), ppHistory totals,
        #        ageForCopy, streakCompleteWeeks, sessionsThisMonth, sessionCount,
        #        nextTrials.date parts, and any threshold label (e.g. 20, 60).
        # Also register spelled-out forms: 27 ~ "twenty-seven", 6 ~ "six".

    # 2. Extract every number the report emitted, digit and word form.
    printed = extract_numbers(report)          # regex \d+ + a spelled-number parser

    # 3. Each printed number must be in the allow-set.
    for n in printed:
        if n not in allowed:
            return FAIL("untraceable-number", span=locate(report, n))

    return PASS
```

**Nuance the prototype surfaces:**
- **Deltas must be pre-computed in the payload.** The report says "Six more" (Sam +6). `6` is in the payload as `delta`. The model is forbidden to *subtract* 27−21 itself; the engine already did and shipped `delta: 6`. Any delta the model states that isn't a payload `delta` field fails. (This is why the payload carries `delta` explicitly rather than expecting arithmetic.)
- **Spelled-out numbers count.** "seventy seconds — 72" → both `70` (a tier-adjacent round-off) and `72` must trace. `72` is `score`; `70` is a *problem* unless whitelisted. **Design decision:** the payload should carry a `roundLabels` allow-list for legitimate prose rounding, OR the prompt forbids approximations. Recommendation: forbid approximations in the prompt and require exact figures ("crossed seventy" → must be "72" or the Skilled threshold `60`). The illustrative report says "crossed seventy seconds — 72"; to pass strictly, either add `70` to a `roundLabels` allow-list or rewrite to "crossed the Skilled line at 72." **Flagged as the first tuning decision (see notes.md Q1).**
- Dates: "November 8" traces to `forwardHook.nextTrialsDateLabel`. Match the label string, not a reparsed date.

## Gate 2 — Banned-lexicon lint

**Claim:** no banned topic or forbidden framing appears.

```
BANNED_TOPIC = [ body, weight, pounds, lbs, kg, size, skinny, lean, tone/toning,
                 diet, calorie, nutrition, eat/eating, protein,
                 puberty, growing/grew (as cause), "for his age", "for your age",
                 XP, level up, quest, unlock (as fanfare), champ (as hype) ]
BANNED_CAMERA = [ "I saw", "I noticed", "I watched", "I've been watching",
                  "looked strong", "your form", "dug deep", "I could tell" ]
BANNED_SELL   = [ $, price, upgrade, premium, subscribe, unlock more, plan ]
BANNED_FEELING= [ "I'm so proud", "how are you feeling", "I feel" ]

function gate_banned_lexicon(report):
    text = normalize(report)                     # lowercase, strip punctuation runs
    for term in BANNED_TOPIC ∪ BANNED_CAMERA ∪ BANNED_SELL ∪ BANNED_FEELING:
        if contains_word_boundary(text, term):
            return FAIL("banned-lexicon", term=term, span=locate(report, term))
    return PASS
```

Word-boundary matching avoids false positives ("plank" must not trip "plan"; "great" must not trip nothing). Maintain the list in one shared module with the Tier-1 line linter — same banned set, two call sites.

## Gate 3 — Sibling-ordering check

**Claim:** members appear in the authoritative `displayOrder`; the report does not rank siblings or order them by performance.

```
function gate_sibling_order(report, payload):
    order = payload.family.displayOrder                 # [m_sam, m_leo, m_ryan, m_dad]
    names = [ member(id).nickname for id in order ]     # [Sam, Leo, Ryan, Dad]

    # 3a. First mention of each member follows displayOrder exactly.
    first_positions = [ first_index_of(report, name) for name in names ]
    if first_positions != sorted(first_positions):
        return FAIL("member-order-violation", got=order_of_appearance(report, names))

    # 3b. No comparative sibling framing.
    RANK_PATTERNS = [ "biggest jump", "most improved", "best of the",
                      "more than <sibling>", "beat <sibling>", "ahead of <sibling>",
                      "<sibling> and <sibling> both", ordinal + sibling ]
    for p in RANK_PATTERNS:
        if matches(report, p over minor-vs-minor pairs):
            return FAIL("sibling-comparison", span=...)

    # 3c. Kid-out-earning-Dad is allowed; kid-vs-kid is not. Only block minor↔minor pairs.
    return PASS
```

The check is intentionally about *minors vs. minors*. Kid-out-earns-Dad is explicitly permitted (family physics), so Dad is excluded from the sibling-pair matrix.

## Gate 4 — Member coverage

**Claim:** every tested member gets exactly one named moment; nobody is dropped or doubled into a leaderboard.

```
function gate_member_coverage(report, payload):
    tested = [ m.memberId for m in payload.members ]     # all 4
    for id in tested:
        name = member(id).nickname
        mentions = count_named_moments(report, name)     # sentence(s) attributing a result/number to name
        if mentions == 0:
            return FAIL("member-uncovered", member=name)
        # highlighted member legitimately gets elevated but should still read as one beat
    # Flat-month members must be present AND not framed as decline.
    for id in payload.flatMonthMembers():
        if not present(report, member(id).nickname):
            return FAIL("flat-member-dropped", member=member(id).nickname)
        if matches_decline_frame(report, member(id).nickname):   # "fell", "down", "lost", "behind", "slipping"
            return FAIL("decline-framing", member=member(id).nickname)
    return PASS
```

## Gate 5 — Highlighted-moment presence + structure

```
function gate_highlight(report, payload):
    hid = payload.highlightedMoment.memberId             # m_leo
    if not marks_a_single_moment_of_the_month(report):   # exactly one "moment of the month"-class beat
        return FAIL("no-highlight")
    if the marked highlight ∉ moments about member(hid):
        return FAIL("wrong-highlight", expected=member(hid).nickname)
    if count_highlights(report) > 1:
        return FAIL("multiple-highlights")               # the report must feature ONE
    return PASS
```

## Gate 6 — Shape / length sanity (cheap guards)

```
function gate_shape(report):
    if word_count(report) not in [90, 240]:  return FAIL("length", n=word_count)
    if contains_markdown_headers_or_bullets(report): return FAIL("format")
    if contains_emoji(report): return FAIL("emoji")
    if starts_with_preamble(report): return FAIL("preamble")   # "Here is", "Sure,"
    return PASS
```

---

## Applying the gates to the illustrative report

| Gate | Result on `generated-report.md` | Note |
|---|---|---|
| 1 Fact traceability | PASS* | All figures trace: 14, 21, 27, 6, 12, 10, 20, 15, 72, 58, 60, 15 (pull-ups), 11 (sessions), Nov 8. *Single caveat: "seventy" as a round-off of 72 needs either a `roundLabels` allow-list entry or a rewrite to "the Skilled line at 72." This is the one strict-mode flag — see Q1. |
| 2 Banned lexicon | PASS | No body/diet/puberty/camera/sell/feeling terms. "kept his / keeping his reps" is trajectory, not body talk. |
| 3 Sibling order | PASS | First mentions: Sam → Leo → Ryan → Dad = displayOrder. No kid-vs-kid comparison. "Ryan running the count, Sam calling the seconds" describes logged judge roles, not a performance comparison. |
| 4 Member coverage | PASS | All four named once. Dad framed as consistency/hold, zero decline words. |
| 5 Highlight | PASS | Exactly one "moment of the month," on Leo. |
| 6 Shape | PASS | ~205 words, no markdown, no emoji, no preamble. |

The report clears the harness in strict mode after the one-word "seventy" rounding is resolved. That single flag is *exactly* the kind of thing the mechanical gate is designed to catch — a beautiful sentence the human eye waves through, caught by the diff.

---

## Tier-1 fallback: the skeleton report (offline OR any gate fails)

Deterministic, template-filled, zero LLM, zero network — built exactly like the Tier-1 line library (slot-fill + selection rules). It is not as warm, and that is fine: a plain instant truth beats a late beautiful one when the network is down, and beats a hallucinated one always. It uses ONLY payload fields, in `displayOrder`, with fixed phrasing.

**Template:**

```
{trials.label} — {familyHeadline.progressPointsTotal} Progress Points{sinceClause}.

{per member m in displayOrder, one line:}
  {if m has ≥1 all-time-best test T (largest-delta first):}
     {m.nickname} — {T.name}: {T.score} (best was {T.priorBest}){tierClause(T)}.
  {elif m.flatMonth:}
     {m.nickname} — held steady this month. Best on record stands.
  {else:}
     {m.nickname} — {bestTest.name}: {bestTest.score}, matching best.

Record Book updated: {count(recordBookChanges)} new marks.
Next Trials: {forwardHook.nextTrialsDateLabel}.

  sinceClause      = ", best month since {headlineComparison.isBestSince.label}" if present else ""
  tierClause(T)    = ". New {T.tier}." if T.tierCrossed else ""
```

**Rendered against this payload:**

```
October Trials — 14 Progress Points, best month since June.

Sam — Air Squats: 27 (best was 21). New Trainee.
Leo — Dead Hang: 20s (best was 15s). New Trainee.
Ryan — Plank: 72s (best was 58s). New Skilled.
Dad — held steady this month. Best on record stands.

Record Book updated: 4 new marks.
Next Trials: November 8.
```

Properties: every line is a payload lookup (Gate 1 passes by construction); `displayOrder` is hard-coded (Gate 3 passes by construction); every member appears (Gate 4); Dad's line is the canonical flat-month template — never decline (Gate 4 decline-check passes by construction). The skeleton is boring on purpose: it is the one place where identical and safe is correct, same principle as Tier-1a safety lines.

**Selection between fallback flavors:** offline → skeleton immediately, no model call. Model reachable but output failed validation → skeleton now, and the failed generation is queued for a retry pass (one retry at lower temperature); if the retry passes, the family's saved artifact is upgraded in place and a quiet "your full report is ready" refresh replaces the skeleton. The keepsake heals toward the good version; it never regresses.
