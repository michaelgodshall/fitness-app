# Morning Brief — Fable Night, 2026-07-18 → 07-19

Michael — you handed me the reins at 22:42 and I ran ~30 agents across 8 streams until the 00:59 cutoff. **Nothing outside this folder was touched.** Nothing here is a decision; everything is a proposal for your review. Nothing is committed — review first, then `git add explorations/ && git commit` if you want to keep it.

---

## The 15-minute path (if you only read three things)

1. **`ai-coach-system/ai-system-vision.md`** — the flagship. The full AI system you asked for, organized around one thesis: **the one-way ledger** — *the engine is the only author of facts; the LLM borrows them under mechanical gates and may add zero of its own; an agent fleet staffs the company.* It was adversarially reviewed by Codex mid-pipeline (verdict REVISE, 14 findings — including 2 critical fence issues — all fixed, response log at the end of the doc). Read §1 (exec summary), §4 (phased portfolio), §7 (the 6 candidate fence amendments), §9 (your 10 questions).
2. **`prototypes/big-screen-session/index.html`** — double-click it. The Tuesday-night session, start to Sam's PB ceremony. Then open `phone-controller/index.html` and `review-console/index.html`.
3. **This file's "Urgent" and "Your decision queue" sections below.**

## Urgent (both found independently by two research streams)

- **Budy — flagged urgent by the market swarm, then RESOLVED by a dedicated teardown** (`ai-coach-system/research/budy-teardown.md`): it's a *solo-user* mobile AI trainer (budy.fit, launched ~Apr 2026, ~1.2K installs, 0 store reviews) whose "family" angle is programmatic SEO — zero shared-session/multi-member features, runtime-LLM-in-loop (our inverse), and a real COPPA gap (9+ rating, ungated LLM coach, no children's section in their privacy policy). **The white space is still open.** Worth stealing: their SEO playbook and review-and-confirm coach action cards. Phase-1 recon: verify hands-on whether onboarding ever asks about household members. (Caution from the teardown: the $4.2M funding record online belongs to the unrelated budy.bot — don't conflate.)
- **COPPA 2025 amendments** — the mixed-audience compliance deadline **already passed (April 22, 2026)**. Persistent identifiers, image-derived data, and voice data are now covered PI (voiceprints = biometric — relevant if coach TTS ever records anything). PLAN's Phase 1 COPPA gate is the right container; the audit prep should not slip. Sources in both research docs.

## What the research validated (good news)

- **Deterministic-in-loop is industry convergence** (Whoop, Fitly, Apple WorkoutKit all keep raw LLM out of execution) — so the architecture is right, but it's not the moat; the shared family session is.
- **Users punish confabulation against their own data and reward memory + specificity** — exactly the failure your engine cannot commit and the strength your event-sourced log feeds. The LLM budget belongs in the async narrative layer, which is where the vision doc puts it.
- **Broadcast/ambient coaching outperforms chat in sentiment** — your broadcast-not-chat conviction was a design choice before it was a compliance strategy; that ordering is the story.

## What's in each folder

| Folder | Contents |
|---|---|
| `ai-coach-system/` | The vision doc; 6 design lenses + the independent Codex proposal (`lenses/`); Codex review round 1 (`reviews/`); market + LLM-patterns + Budy research (`research/`) |
| `plan-patches/` | **6 paste-ready patch proposals** covering the F31–F40 engine merges (patch-01 — the item blocking engine implementation), the planner-spec folds (patch-02), voice goldens F7/F10 (patch-03), PB model + Record Book F13–F15 (patch-04), small findings F19/F27–F30 (patch-05), identity + Trials battery + roadmap F21/F22/F25 (patch-06). Each quotes current text, gives replacement text, cites the ruling it implements, and flags FOUNDER CALL where no ruling existed. |
| `prototypes/` | 5 self-contained prototypes, all browser-verified: big-screen session, phone controller, Trials-report AI pipeline (payload → prompt → generated report → rendered keepsake → validation spec), **runnable planner skeleton** (`cd prototypes/planner-skeleton && npx tsx test.ts` — 3/3 property tests pass; `npx tsx simulate.ts` for 8 simulated weeks), founder review console. Each has a `notes.md` with open UX questions. |
| `ideas/` | 15 product-mechanic ideas + 12 AI wildcards, compiled and kill-rated in `idea-portfolio.md` |
| `context/` | `doc-digest.md` — a 6k-word derived digest of the whole doc corpus (useful for future agent sessions; DERIVED, source docs govern) |
| `run-log.md` | The full stream-by-stream log of the night |

## Found by building: 3 real spec gaps (planner skeleton)

These came from *implementing* the specs, not reading them — arguably the night's most valuable engineering finding:

1. **H10 novelty vs H2 balance have no arbitration rule** — a greedy H2-maximizer re-picks the same top blocks (12/24 unique sessions in sim). The spec needs a decided tie-break + reshuffle loop.
2. **H2 is a rolling-window rule with no window mechanism** — a 25-min session physically can't touch all 8 patterns; the planner must balance across the sequence or explicitly relax H2 under ~30 min.
3. **F31's grade model earns nothing for single-chain patterns** (grade collapses to rungIndex) and reps-vs-holds sharing one `W` breaks "one canonical unit per pattern" the moment a chain mixes metrics (core does immediately). Worth re-checking F31's cost/benefit before applying patch-01 verbatim — noted inside the patch too.

## Your decision queue (highest-leverage first)

1. **Apply patch-01/02** (F31–F40 merges + planner folds) — still the next session's first task per CLAUDE.md; the patches make it a review-and-paste job. Weigh gap #3 above against patch-01's F31 edits first.
2. **The 6 candidate fence amendments** (vision doc §7 + fence check): NL request parser (rec: don't pre-approve; Phase 3 unless you ratify it against PLAN's exact sentence), the Archivist (rec: Phase 3 default), intake offset (rec: accept as Phase 1 spec delta), teen dialogue (rec: permanent no), LLM weight-nudge and shadow-planner run (rec: Phase 3-gated). None ships without your explicit yes.
3. **The 10 open questions** in vision doc §9 — includes the Codex-prompted marketing question: lead the Phase 1 A/B with "adaptive coach," earn "AI coach" via the Why-Tonight card.
4. **Prototype UX calls** — each `notes.md` ends with 2-3 questions; the big-screen under-11 privacy asymmetry and the effort-check-in cadence are the two that shape the walking skeleton.
5. Standing items unchanged: Grithouse smirk test, Crucible yes/no.

## Suggested next real session (your 8-10 hrs)

1. Review + apply patch-01/02 (with gap #3 in hand) → commit → engine implementation is unblocked.
2. Read vision doc §7/§9, mark yes/no on the amendments and questions → decision-log rows for whatever you ratify (the repo rule: same-day rows).
3. Skim the three prototype `notes.md` files, mark UX calls → the walking skeleton inherits real decisions instead of guesses.
4. Keep/kill the vision doc's Phase-0 seams (§8: `FamilyMemory` naming + log-schema fields) — hours of re-org inside work already scheduled, and the only §8 items that precede the paper test.

— Fable, 00:45. Streams, timings, and verification notes in `run-log.md`. The one-line summary of the night: **the plan's AI story is now a system, the thing blocking the engine build is now a paste job, and the product's soul — the big-screen family session — got rendered pixel-real.**
