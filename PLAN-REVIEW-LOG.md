# Plan Review Log: Fitness App Revival — Product Foundation

Act 1 (grill) complete — plan locked with the user. MAX_ROUNDS=5.

## Round 1 — Codex

VERDICT: REVISE — 20 findings (full text preserved below, condensed):

1. Gate 0 partly fake-numeric ("voluntarily," "unprompted," "still holds" gradeable by vibes)
2. 3-sessions/week gameable by micro-sessions/solo slices
3. Phase 0 scope doesn't close against 8-10 founder-hrs/week; no cut line
4. Skills v0 already scope-creeping (5 paths + Record Book + instrumentation)
5. PLAN says platform research in flight while a proposed ADR sits in repo
6. "Local-first, no accounts" conflicts with async slices + Convex phone controllers
7. COPPA posture too shallow (persistent identifiers, processors, analytics, review/delete, retention)
8. "Parent-only sidesteps COPPA" overconfident once kids touch browser controllers
9. Youth-S&C review buried in a design doc, not a roadmap gate
10. Gate 1 stats weak (6-9 warm families can pass on founder affinity; dropouts uncounted)
11. WTP interviews are cheap talk after promising free beta + lifetime discount
12. No cold-acquisition validation before public launch (needs a Gate 1.5)
13. "Percentiles need no liquidity" is false — cohort-size thresholds required
14. Improvement scoring not fair "by construction" (first-baseline sandbagging, growth effects, rebounds, plateaus)
15. Competition integrity underdesigned (parent-judged reps, form variance)
16. Substitute map missing (YouTube, whiteboard, youth sports conditioning, AI generators)
17. Unverified architecture claims about Fitly/RollStrong
18. Billing-parent fix identified but not in the Phase 1 build list
19. "AI coach" framing may trigger parent trust resistance — test messaging
20. A concierge/manual prototype might beat building the engine

### Claude's response (arbitration)

**Accepted and applied (1-13, 15-19), with modifications where noted:**
- **1:** Gate 0→1 now fully operationalized: teen metrics copied from skill-progressions.md (ladder views ≥1×/wk outside sessions + ≥1 self-declared test/2wks); voluntary return measured by a per-session attendance-friction log (willing/pushed/refused; pass = ≤20% "pushed," zero sustained refusal in weeks 3-4); non-sync week pass defined (every member ≥2 slices, ≥3 family session-equivalents, Pact machinery intact).
- **2:** Counting rule added — ≥2 of the 3+ weekly sessions must be synchronous shared sessions (≥20 min, ≥2 members incl. an adult); micro-sessions/slices fill the remainder only.
- **3:** Phase 0 cut line added with an ordered cut-first list and a mid-August trigger; founder-hours are review/decide/test (agents build), but the cut discipline now exists in writing.
- **4:** Skills v0 locked to 4 paths; Record Book thin slice explicitly budgeted (unlock permanence is the hypothesis under test — keeping it is a reasoned scope add, not creep).
- **5:** Moot between review rounds — ADR-001 ratified by founder; PLAN/roadmap wording updated.
- **6:** Phase 0 data boundary defined: anonymous cloud session state on Convex, no auth, nicknames only, no child PII; slices via room-code links. "Local-first" now means display-device-authoritative in-flight sessions, not no-cloud.
- **7 + 9:** COPPA elevated from task to **Phase 1 gate** (data map incl. persistent identifiers, vendor DPA checklist, analytics policy, parental review/delete flows, counsel or safe-harbor review) alongside youth-S&C sign-off — both before beta recruitment.
- **8:** ADR-001 wording corrected: parent-only model *minimizes* COPPA scope, doesn't sidestep it; child-facing controller surfaces are child-directed (session-scoped tokens, no analytics/persistent identifiers on those surfaces).
- **10:** Gate 1→2 hardened: dropouts count in the denominator; ≥8 retained families at 3+/wk×6wk; ≤⅓ founder-close families; segment by family shape.
- **11:** WTP interviews replaced by a **capped paid founding cohort** (~$79 founding-year price — year one, NOT locked-forever, per monetization research) as the Phase 1→2 WTP instrument. Converges with independent monetization research findings.
- **12:** Gate 1.5 added: cold-channel signal (≥25 qualified non-network waitlist signups or ≥3 cold-recruited beta families) before public-launch spend.
- **13:** Percentiles hidden until per-test/cohort N thresholds; own-history and private community cohorts first.
- **14 (modified):** All-time-best baselines already kill *ongoing* sandbagging; accepted the residual fixes — first Trials = calibration only (mints no Progress Points), per-test caps, participation floors; rookie/established divisions deferred to Phase 3 league design where the stakes exist.
- **15:** Explicit constraint added: competition stays low-stakes, family-level, opt-in until verification standards exist.
- **16 + 17:** Substitute map (incl. "dad does it manually with YouTube," the real free competitor) added to Phase 1 recon; Fitly/RollStrong architecture claims re-marked as REPORTED assumptions; teardown cadence set at phase boundaries.
- **18:** Both-parent recap moved into the Phase 1 build list proper.
- **19:** "AI coach" vs "adaptive coach" message test added to Phase 1 recruitment + naming sprint.

**Rejected (logged reasons):**
- **20 (concierge prototype instead of engine) — rejected as a replacement, accepted as a sequencing principle.** The demand question is already answered for family #1 by 16 months of lived co-training; Phase 0 tests whether the *engine* fixes exhaustion/consistency/teen-drift, which a spreadsheet structurally cannot (the intervention IS generation + adaptivity + feedback moments). Kernel kept: a week-2 "paper session test" kill-switch — planner output run by the family from a plain screen/printout before UI investment; if generated sessions don't excite the family on paper, stop building UI.
- **14 (partial):** "rolling baselines" rejected for within-family use — beating your all-time best is the honest bar and the emotional product ("beat your best," not "beat your recent average"); rolling baselines return only if Phase 3 league math needs them.
