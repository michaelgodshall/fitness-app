# Build Orientation — How to Run a Session on This Project

_Foundation doc — July 2026. For every future working session (founder + whichever Claude model). The Fable window that produced this foundation is closed; this doc is how its judgment keeps steering._

---

## Session protocol

1. Read project `CLAUDE.md` → "Current status" tells you where the last session stopped.
2. Read the governing doc(s) for today's build area (authority map below).
3. Do the work. **Update CLAUDE.md's Current status + commit before ending.** A session that doesn't commit didn't happen.
4. Anything that contradicts a governing doc requires either (a) stopping, or (b) amending the doc *first*, with the founder's sign-off, logged in the doc itself. Silent drift is the failure mode this whole structure exists to prevent — it's what Codex round 2 caught, and the review loop won't be running continuously anymore.

## Doc authority map

| Building… | Governed by |
|---|---|
| Anything (scope, phase, gates) | `PLAN.md` (Codex-approved) + `docs/03-roadmap.md` |
| Why / product intent | `docs/01-product-vision.md` |
| Positioning, pricing, channels | `docs/02-product-strategy.md` |
| Stack, backend, form factor | `docs/decisions/adr-001-platform-and-stack.md` |
| Session planner / generation logic | `docs/design/session-planner-spec.md` (H1-H11 are unit tests, not suggestions) |
| Live session UI (big screen, phones, degraded modes) | `docs/design/workout-experience.md` |
| Data model, state machine, sync/logging semantics | `docs/design/engine-data-model.md` |
| Exercise/block/voice content creation | `docs/design/library-authoring-pipeline.md` |
| Trials, Challenges, Progress Points, Record Book | `docs/design/trials-and-challenges.md` |
| Skill paths, rungs, safety gating | `docs/design/skill-progressions.md` |
| Any coach-facing copy | `docs/design/coach-voice.md` (goldens are the eval bar) |
| Feature ideas / risk mitigations | `docs/design/pre-mortem-and-backlog.md` (dispositions are decisions) |
| Cross-doc conflicts | `docs/design/design-review-findings.md` first, then founder |

## Model routing (from the founder's global rules)

- **Opus (or best available)**: design decisions, architecture, arbitration of review findings, anything touching gate criteria or governing docs, coach-voice content review.
- **Sonnet agents**: spec-driven implementation, test writing, batch content generation, exploration. Every subagent gets its model set explicitly and its governing doc named in the prompt.
- **Codex (cross-model)**: re-run adversarial review at each phase boundary (`PLAN-REVIEW-LOG.md` documents the working invocation — note `--skip-git-repo-check` and `< /dev/null`; MAX_ROUNDS discipline applies).
- Weak executor output → rerun on a stronger model or fix the spec; never let a subagent renegotiate a locked decision.

## Build-order spine (Phase 0)

Roadmap "Next 5 sessions" is authoritative; the dependency spine behind it:

```
pure-TS domain packages (types, planner, state machine)   ← engine-data-model.md
    → planner + property tests + simulation harness        ← session-planner-spec.md
    → library seed via authoring pipeline                   ← library-authoring-pipeline.md
    → PAPER-SESSION TEST (week-2 kill-switch — family runs planner output before UI exists)
    → web app: big-screen surface, log strip, room-code controllers  ← workout-experience.md
    → skills v0 + Record Book thin slice                    ← skill-progressions.md
    → family session zero → iterate on friction notes
```

**Non-negotiables for every implementing agent:** domain logic has zero Convex imports · no LLM call in the workout loop · 45-min cap is a hard constraint · no gender in the data model · child-facing surfaces carry no analytics or persistent identifiers · H11 youth-safety constraints are release-blocking tests.

## Rhythm at 8-10 founder-hours/week

Two blocks: one **decision/review block** (founder + main loop: arbitrate findings, review content batches, unblock) and one **build block** (agents execute against specs; founder spot-checks). Family training sessions are the third block and they are not project hours — they're the product working. If a month averages under ~8 hours, invoke the PLAN cut line at the next gate rather than stretching silently.

## When something feels wrong

Re-read the vision doc's three failure modes (exhaustion, consistency collapse, teen drift). Every hard call this project faces resolves against one question: **does this keep the family training together?** If a clever feature, a tempting refactor, or a scope debate doesn't serve that, it loses. The founder's family is the instrument — when the docs and the living room disagree, the living room is right, and the docs get amended to match.
