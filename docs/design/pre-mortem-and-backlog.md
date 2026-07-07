# Pre-Mortem Findings & Idea Backlog — Dispositioned

_July 2026 (Fable session). Source: 8-persona pre-mortem panel + 7-lens ideation (17 agents), synthesized and judged, then dispositioned by the main-loop review below. Every finding is marked: **APPLIED** (already folded into a governing doc), **PROPOSED** (needs founder ratification — changes a locked decision), or **REJECTED** (with reason)._

---

## The foundational threat — RATIFIED 2026-07-06 (both parts applied to PLAN.md + roadmap)

**The session loop assumes synchronous co-presence, and the Phase 0 summer gate is structurally blind to that assumption failing.** Themes 1-3 below are symptoms of one premise: the engine plans for "who's here tonight," but once school resumes, the non-overlapping evening is the *median* case for 8-14-year-olds with practices and staggered bedtimes — and summer (when Phase 0 runs) is exactly when synchrony is easiest. The gate can pass on an artificially synchronous sample, lock in the architecture, then break in fall Phase 1 — one phase too late to cheaply reverse. The only real fix (async completion) is currently fenced out until Phase 2.

**Recommended amendment (2 parts):**
1. **Async slice-completion becomes a Phase 0/1 substrate:** a member who misses the family session can complete *their scaled portion of it* solo (on the shared device or any phone), banking it toward their Pact line and the family system. The experience doc's "session = one shared state machine, devices are projections" architecture makes this nearly free structurally; the synchronous big-screen session remains the flagship and the default — the slice is the pressure valve that keeps the family system whole when the calendar fails. (This also *is* the "teen solo mode pulled earlier" mitigation from theme 2.)
2. **Gate amendment:** before declaring Gate 0→1 passed, deliberately run one **non-synchronous week** (simulate fall: members training in slices on different days) and verify the family system still holds.

## Recurring themes

### 1. Consistency collapse via single-adult, same-night initiation — APPLIED
Three single points of failure stack on the operating adult at the worst moment: same-night config decision, adult-only initiation, full co-presence requirement. **Applied to planner spec:** default-session pre-generation (opening the app *starts* a workout), Reset Rep (post-lapse return session is deliberately easy and PB-free), Absence Ledger (skip-reason tags teach the planner). **Remaining piece** — any-member start (a kid can launch the session) — folds into the experience doc's lobby design; adopted, Phase 0.

### 2. Teen drift: every individual/competitive hook lands after the teen's window closes — PARTIALLY APPLIED + 1 PROPOSED + 1 REJECTED
- APPLIED: skill-tier **feedback moments** in Phase 0 (skills v0 must include the "tier unlocked" beat at session close, not just a silent progress bar — an instrument the subject can feel is not measuring engagement, it's suppressing it).
- APPLIED (via foundational amendment): async slices give the teen a legitimate solo lane inside the family system in Phase 0/1 rather than Phase 2.
- PROPOSED: none beyond the above — see Backlog for **Session Authorship Token** and **Ghost Bar** (adopted).
- REJECTED: *anonymized age-bracket Trials percentiles in Phase 1.* Percentiles need population; 10-15 beta families make meaningless brackets. **Beat Dad's Ghost** (Backlog, below) achieves the same "external number to chase" with a population of one family — better mechanic, zero liquidity need.
- REJECTED (for v1): *loaded bodyweight (weighted vest) in v1 difficulty tiers.* Bodyweight-pure v1 was a deliberate founder decision; the teen ceiling is better answered by the skills system (front lever/planche-class paths are *years* of headroom, unlike variant ladders) plus authorship/ghost mechanics. Vest/loading joins the Phase 3 weights arc. Revisit only if the Phase 0 teen signal fails *specifically* on difficulty ceiling.

### 3. The shared screen publicly re-announces the weakest member — PARTIALLY APPLIED + observation task
The experience doc already bans easier/harder labels and member-vs-member comparison on the shared surface. Remaining exposure: side-by-side rep targets and public PB Watch for the youngest. **Applied:** no cross-member deltas ever, anywhere. **Adopted defaults:** PB Watch and personal targets on the *shared* screen become age-informed per-member settings — under-11 defaults to private (personal lens/parent phone), teens/adults default public. **Observation task:** family session zero explicitly watches the 9- and 10-year-old for public-number aversion before hardening these defaults; the founder's own kids are the instrument.

### 4. Relative loading scales strength, not developmental readiness — APPLIED
Block-level review cannot catch bad *combinations* the planner assembles. **Applied to planner spec as H11:** session-level youth constraint layer (plyo contact caps, no stacked max-effort spinal-flexion, consecutive max-effort limits, quality-gated under-11 PBs), with external youth-S&C sign-off required before Phase 1 beta (Phase 0 proceeds on founder judgment over his own kids).

### 5. The billing/non-training parent is a bystander at renewal — APPLIED (Phase 1-2 backlog)
Value is surfaced only to participants; the calendar-owning, often-billing parent gets secondhand enthusiasm and cancels rationally. **Adopted:** monthly family recap addressed to *both* parents (sessions, PBs, streak state, one coach note), standing-training-window scheduling as a first-class role for the non-training parent. Phase 1 (recap) / Phase 2 (scheduling role).

### 6. 100% founder review recreates content exhaustion at beta scale — APPLIED (roadmap note)
Founder review at 8-10 hrs/week is fixed-throughput; 10-15 families burn combinatorial variety faster than reviewed batches refill it. **Adopted:** the simulation harness is the first-pass triage (auto-reject constraint-violating candidates so founder review spends only on quality/taste), plus a **library breadth target before Phase 1 recruitment** (⚙ size set during Phase 0 from observed variety-consumption rate). The planner's "library gap" signals (already in spec) drive the authoring queue.

---

## Idea backlog (judged top 14 of 35; scores from the Opus judge panel)

**Adopted into Phase 0** (cheap, serve the gate directly):
| Idea | What | Score |
|---|---|---|
| Tomorrow's Card | Night-before "reserve tomorrow" (roster + window) — moves the go/no-go decision to a calm moment; implementation-intention design | 9 |
| Absence Ledger | Skip-reason tags; coach visibly learns this family's failure patterns | 9 |
| Reset Rep | Post-lapse return session is deliberately short, easy, celebratory | 8.5 |
| Torch Board | Family Record Book extension: current holder + lineage + named "torch pass" events (kid finally out-reps a parent) | 8.5 |
| Session Authorship Token | Teen milestone earns the right to author one session slot (finisher/AMRAP scheme) inside planner constraints — autonomy, not free authoring | 8 |
| Ghost Bar | Phone-private live pace bar racing your own best mid-set; shared screen shows only the family aggregate | 7.5 |

**Adopted into Phase 0-1 conditional on phone controllers:** Secret Assignment (private per-member directives revealed at cooldown; gives the teen an invisible difficulty layer with zero "teen mode" fork) — 8.

**Adopted Phase 1:** Rematch Night (planner resurrects an exact past session as a ritual; family-level before/after narration) — 8; Earned Streak Insurance (bonus effort banks a protected week — earned buffer, not free freeze) — 8; Then-vs-Now Recap (post-Trials trajectory narration; screenshot-ready) — 7.5; Apprentice Coach (rotating coach/MC duties incl. kids; teen gets real "run this component" role) — 7.5.

**Adopted Phase 2:** Beat Dad's Ghost (teen races parent's real logged performance at the same age/stage — turns the founder's 16 months of proprietary data into a teen mechanic needing zero other users) — 8.5; Squad Consistency Bar (4-6 households, one shared weekly bar, no ranking — the church/men's-group wedge as a mechanic) — 7.5.

**Held (candidate, not committed):** Family Meter (collective reps toward a landmark visual) — 8.5 but overlaps Torch Board/Record Book emotionally; revisit after family gate.

---

## Net effect on locked docs

- `session-planner-spec.md` — H11 youth safety layer + default-session pre-generation + Reset Rep/Absence Ledger behaviors: **applied**.
- `workout-experience.md` — any-member start, age-gated PB Watch defaults, Ghost Bar, Secret Assignment: **annotate at next revision** (agent doc just landed; amendments listed here are authoritative).
- `docs/03-roadmap.md` + `PLAN.md` — async-slice substrate + non-synchronous gate week: **RATIFIED and applied 2026-07-06**.
- Trials/Challenges, monetization, platform: no changes required by these findings.
