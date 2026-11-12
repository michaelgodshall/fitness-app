# Adaptive Engine — Capability, Targets, Progression v1

_Design doc — July 2026 (Fable session). The decision logic that makes the planner a coach: what each member can do tonight, what tonight asks of them, and when to suggest moving up. Sits inside `session-planner-spec.md`'s constraint layer (H1–H11 always win) and concretizes the roster input the planner contract requires ("per-pattern capability level"). Pairs with `skill-progressions.md` (skill rungs are fixed and member-declared — this engine reads them, never drives them) and `trials-and-challenges.md` (benchmarks and Trials are inputs here, never outputs). Status: draft for founder review; ⚙ = founder-calibration parameter, collected in the §8 registry._

---

## 0. Contract & posture

Three pure functions, called by `plan_session`:

```
estimate_capability(member_log, params) → CapabilityState   // a fold over the session log — replayable
compute_target(state, block_ctx, params) → { target, reason }
advancement_check(state, chain, params)  → suggestion | null // suggest, never force
```

Posture rules:

1. **Deterministic, no RNG.** The seed lives in planner candidate selection; nothing in this layer rolls dice. Same log + same params → same state, targets, suggestions.
2. **State is a fold over the log.** Capability is never hand-mutated; it is recomputed by replaying logged sessions through the update rule. Retune a ⚙ parameter → replay history → new state. This is also what makes Phase 2 parameter tuning free (§5).
3. **Every decision carries its why.** Each state change, target, and suggestion emits a Reason record renderable as one founder-approved coach line (§6). A heuristic that can't be voiced in one line gets redesigned, not documented harder.
4. **The engine never infers motive.** A bad night, a sandbagged set, and an off mood are identical in the log. The engine doesn't guess which; it makes downward movement structurally slow (§1.3) so that compassion and anti-gaming are the same mechanism.
5. **Guiding band, from the founder's own question:** _"Would we both struggle and finish?"_ A target is correct when the member completes it with real effort. Everything below operationalizes that sentence.

---

## 1. Capability state — per member × pattern

### 1.1 Shape

One record per (member, pattern) over the H2 taxonomy (horizontal-push, vertical-push, horizontal-pull, vertical-pull, squat, hinge, core, conditioning):

```
CapabilityState {
  grade: int            // position on the pattern's difficulty ladder (library metadata, §9)
  W: number             // working volume: reps (or seconds) per set at grade, straight-set context, fresh
  confidence: calibrating | established | stale
  trend: last-6 implied-W observations   // the classifier's window (§1.4)
  last_trained: date
  floor: number | null  // benchmark-anchored minimum for W (§2.4)
}
```

- **Grade** replaces "which swap-chain rung." Library delta (§9): every exercise carries a `difficulty_grade` within its pattern, assigned at authoring, founder-reviewed; a swap chain traverses adjacent grades of one movement family. Capability then transfers across chains in the same pattern — the planner picks, per exercise slot, the chain rung nearest the member's grade (this is also what H5 roster-coverage checks against).
- **W is the single anchor number.** One canonical unit per pattern (reps or seconds, from library metadata), defined in the straight-set, fresh, full-rest context. All other block types derive from W via shared factors (§2.2) rather than keeping per-block-type estimates — per-block-type state would fragment a kid's scarce data across four weak estimators; factors keep the state legible and the data pooled. (Decision, revisit only if Phase 0 shows block-type-specific drift the factors can't express.)
- **Confidence** gates update gain: `calibrating` (first ⚙3 sessions per pattern, and after any grade change) learns fast; `established` learns slow; `stale` (pattern untrained ≥ ⚙21 days) returns at a re-entry discount and re-learns fast.

### 1.2 Initialization — placement by training, not by test

The family just starts. No test day; session one is the placement instrument:

1. **Age-band priors** ⚙ seed (grade, W) per pattern — a small table (age band × pattern), seeded from the founder's 16 months of lived data (illustrative row: 8–10yr / horizontal-push → grade "incline push-up," W 8; the whole table is ⚙, founder-authored before family session zero).
2. **First-session discount:** session-one targets run at ⚙0.7 × prior W. Undershooting the prior costs one easy night; overshooting costs trust. The first session should feel like a win, by design.
3. **Calibration mode:** all patterns start `calibrating` — update gain doubled, and swaps are strong signals (a member swapping up and completing in calibration jumps the grade immediately; later, swaps are slower evidence, §3).
4. **Skill placement cross-seeds.** Enrollment placement on skill paths ("test into the highest rung you pass today") is a real observed max — it seeds the mapped pattern via the skill→pattern mapping table (§9): a kid who places at Pull-Up rung 4 doesn't spend three sessions proving he can hang.

Convergence target: state leaves calibration inside ⚙3 sessions per pattern — roughly week one for a 3×/week family.

### 1.3 Update rule — what moves it, what dampens it

After every logged session, per (member, pattern) touched:

```
implied_W = achieved / (block_type_factor × position_factor × freshness_factor)   // normalize back to anchor context
W ← W + α × clamp(implied_W − W, down_clamp, up_clamp)
```

Aggregation across blocks of the same pattern in one session: volume-weighted **median** ⚙ of implied_W (median resists one blown block).

| Signal | Authority | Effect on state |
|---|---|---|
| **Benchmark block result** (H7) | High | Snap: α = ⚙0.6, both directions — fresh, structurally identical, fair by construction. Refreshes `floor` (§2.4). |
| **Trials result** | High, **up only** | Max effort ≠ working volume: converts via ⚙max→working ratio (~0.65). A bad Trials is nerves or an off day — sacred benchmarks never write capability *down*. |
| **Skill rung unlock** | High | Floor-raise on the mapped pattern's grade (a member with Strict 3 unlocked never re-proves assisted pull-ups). |
| **Nightly logged totals** | Medium | EWMA above: α = ⚙0.15 established / ⚙0.3 calibrating; up_clamp +10%/session ⚙; down_clamp −5%/session ⚙, and a down-move applies **only with corroboration** — ⚙2 of the last 3 sessions on that pattern under 0.85 × target. One bad night writes nothing down. |
| **Voluntary up-swap, completed** | Medium-high | Grade evidence (feeds §3) + seeds W at the new grade via the chain edge's `carryover_ratio` (§9). |
| **Down-swap mid-session** | Low | That block is excluded from W update (the member changed the denominator); logs a grade-pressure tick only. |
| **Off-night session** (§1.4) | None | Excluded from all updates. |

**Under-11 evidence weighting** (H11 corollary): an 8-year-old's raw nightly counts carry form-decay noise, so for under-⚙11s, benchmark results and parent-verified sets weigh ⚙2× nightly totals, mirroring the H11 rule that under-11 PBs are quality-gated rather than raw-volume-chased.

### 1.4 Bad night vs. plateau vs. capability jump

Three signatures, one deterministic classifier over the `trend` window:

| Signature | Detector | Response | Coach line (register per coach-voice §3) |
|---|---|---|---|
| **Off-night / off-week** | ≥2 patterns each under ⚙0.85 × target *in the same session* (life-noise hits everything at once; real regression is pattern-specific). Two consecutive off-nights, or an Absence-Ledger-tagged week, = off-week. | Session excluded from updates; next session biased one density notch easier (§4.3), targets held. Never a full Reset Rep (that's for lapses). | "Tuesday was one night. The numbers hold." |
| **Plateau** | ⚙4+ consecutive sessions on a pattern with implied_W inside the deadband (0.95–1.05 × W) and no benchmark improvement across ⚙3 weeks. | Stimulus change, not a target hike: rotate to a lateral variant at the same grade → vary block type → if W sits at the grade's graduation volume, arm the advancement check (§3). | "Push-ups have gone quiet for three weeks. Same pattern, new shape tonight." |
| **Capability jump** | implied_W ≥ ⚙1.15 × W for ⚙2 consecutive sessions, or a benchmark beaten by > ⚙20%. Kids get stronger by growing — the estimate must chase reality, fast. | Recalibration mode for that pattern: α and up_clamp revert to calibration values (⚙+20%/session) for ⚙3 sessions, and the advancement check runs. | "Sam's been past target three sessions straight. Targets move to match him." — always attributed to training, never to growing (coach-voice §5, binding). |

---

## 2. Target computation

### 2.1 The band contract

"Challenging but achievable," formalized: a target is in-band when the expected outcome is **completion with effort** — completion ratio r = achieved/target landing in [⚙0.9, ⚙1.1] with the member finishing. The engine's quality metric is **band-hit rate**: the fraction of logged blocks landing in-band (§7 makes it the simulation objective; §5 makes it the Phase 2 tuning objective).

### 2.2 The formula

```
target = round_meaningful( W × block_type_factor × position_factor × freshness_factor × β_band )
```

| Factor | Values ⚙ (all founder-calibrated) | Notes |
|---|---|---|
| `block_type_factor` | straight sets 1.0 (anchor, definitional) · superset 0.85 · circuit station 0.75 · finisher 0.6 · AMRAP: pace model, expected total = W × amrap_factor(duration) | One shared factor family, not per-member state (§1.1 decision) |
| `position_factor` | first work block 1.0 · mid 0.95 · late 0.85 | Fatigue discount by session position |
| `freshness_factor` | ≤ ⚙10 days since pattern trained: 1.0 · longer: 0.9 re-entry discount · high same-pattern volume inside 72h: 0.9 light-day (beneath H3's hard 48h rule) · session immediately before a scheduled benchmark on this pattern: 0.9 (protect soft objective 2 — benchmarks land fresh) | |
| `β_band` | under-11: ⚙0.9 · teen: ⚙1.05 · adult: ⚙1.0 | Placement inside the band, §2.3 |
| `round_meaningful` | whole reps; seconds in 5s steps ⚙; change suppressed under a ⚙2.5% deadband | No target jitter |

**Benchmark blocks override the formula:** target = previous benchmark result + smallest meaningful increment (⚙+1 rep / +5s). The reason *is* the target — "⚑ beat last Tuesday: 64" (experience-doc canon).

**Target stability is a feature.** Within a ⚙2-week window the engine prefers holding a target identical rather than micro-stepping — comparable numbers are what make "beat last time" legible. Step, don't drift.

**Time-model coupling (H1):** targets feed the per-block time model (reps × tempo, holds × duration); a target increase that would blow the budget loses to H1 and the planner trims sets, not the cap.

### 2.3 Band placement per member — the three failure modes, by design

- **The youngest must finish in public** (pre-mortem theme 3: the shared screen re-announces the weakest member). Under-11 β sits at the low edge — expected r ≈ 1.0–1.1: Sam finishes, often beats it, in front of everyone. Plus the **set-shaping rule:** for under-⚙11s the *visible per-set number never shrinks* — capability softening or a tight budget cuts sets/rounds, never the number on the wall ("8 push-ups × 2," never "5 × 3" after a "8 × 3" week). The only path to a smaller per-set number is a grade change, which is member/parent-controlled by swap. Downward-target Reason lines for under-11s never render on the shared screen (matches the age-informed PB-Watch defaults already adopted).
- **The teen must feel it's hard.** Teen β sits at the top edge — expected r ≈ 0.9–1.0; the last set should genuinely threaten failure. Additionally the planner marks **one block per session as the stretch block** for teen+ members ⚙ (β×1.1, placed where H3 allows): every session contains one thing Ryan might not finish. This is also the natural seam for Secret Assignment (backlog, adopted Phase 0-1) — a private stretch directive, zero "teen mode" fork.
- **Sandbag-proof by structure, not detection.** Targets derive from dampened history: down-moves are clamped (−5%/session ⚙), need 2-of-3 corroboration, and W is floored (§2.4). Deliberately halving output for two straight weeks moves a target down ≲ ⚙15% total — and the next benchmark block, a public "beat last time" event, snaps W back. There is no payoff loop, so the engine never needs to accuse anyone (it couldn't tell a sandbag from a slump anyway — see posture rule 4; the response is identical: hold the numbers).

### 2.4 The floor

`W.floor = ⚙0.85 × implied_W(most recent benchmark on this pattern within ⚙8 weeks)`. Nightly down-drift never takes W below it. Anchored to *recent* benchmark, not all-time best — an honest floor acknowledges detraining; the 8-week expiry keeps it truthful after a long lapse (where Reset Rep owns re-entry anyway).

---

## 3. Swap-rung advancement — suggest, never force

Swaps stay member-controlled (experience doc, tenet 4 and §2). The engine's whole authority here is one earned sentence.

**Evidence threshold (arm the suggestion), either path:**

- **Earned path:** W ≥ the exercise's `graduation_volume` (library metadata, §9 — e.g., "incline push-up graduates at 12") AND r ≥ 1.0 on that chain in ⚙3 of the last 4 sessions touching it AND no down-swap on the chain in the window.
- **Ratify path:** the member voluntarily swapped up and completed ≥ ⚙90% of the equivalent target, ⚙2 times. The member already proved it; the engine just makes it the default.

**How it lands:** at session close, one line — then the next session that includes the chain plans the new rung *as the default*, with the old rung one shame-free swap away (phone-private request, plain rendering). The canon line is already written: _"Leo — full push-ups tonight; the incline earned you that."_

**Anti-nag mechanics:** the suggestion voices **once per arming**. If the member swaps back down ⚙2 times, the default reverts to the old rung, the coach drops the subject entirely, and the trigger re-arms only on *new* evidence at a higher bar (a benchmark result or a fresh voluntary up-swap — not the same nightly streak re-firing). A suggestion the member declined twice is an answer, not a backlog item.

**Downward, the engine never suggests.** De-escalation runs volume-before-grade: trim sets → trim density → and only in Reset Rep / H11 safety contexts does the planner quietly assemble easier work. A lower rung is always the member's swap, never the coach's verdict.

**Boundary with skill paths:** skill rungs advance by member-declared, witnessed tests only (skill-progressions rule 5). This engine never schedules, suggests, or auto-detects a skill rung test — aspiration stays member-owned. It only consumes unlocks as capability floors (§1.3) and counts skill-block volume in pattern accounting (already spec'd).

---

## 4. Progression across weeks — the Progressive Density Model, operationalized

### 4.1 Family experience tier (the density axis is family-level)

Density — shorter rests, denser block types — is a capability of the *room* (conditioning + logistics + kid attention), not of any one member; member-level progression lives in targets and grades. One family-level tier drives H9's density profile:

| Tier | Default rest ⚙ | Block types available ⚙ |
|---|---|---|
| T0 — starting | 90s | straight sets, simple circuits |
| T1 — establishing | 75s | + supersets |
| T2 — conditioned | 60s | + AMRAP / EMOM |
| T3 — dense | 45s | + density finishers, complexes |

- **Advance:** ⚙3 consecutive Pact-complete weeks at the current tier. Consistency advances the family, not performance — density is earned by showing up.
- **Drop:** a lapse ≥ ⚙10 days or 2 missed-Pact weeks drops one tier (rendered, not erased — it climbs back the same way).
- **H11 clamp:** members under ⚙11 keep per-member rest floors (never < ⚙45s between hard sets) and plyo-contact caps regardless of family tier; the tier sets the ceiling, H11 clamps the member. ⚙ Open question 6: whether a family training with an under-11 caps at T2 outright.

### 4.2 The one-knob rule

Week over week the engine moves **one lever at a time**: a rest reduction, or a block-type escalation, or a member's target step — never a family density bump and a member target bump on the same pattern in the same session ⚙. One knob preserves causal attribution (for the engine's estimates and the athlete's felt sense) and keeps every change voiceable in one line.

### 4.3 Backing off — the deload logic, generalized from Reset Rep

| Trigger | Response | Already spec'd where |
|---|---|---|
| Lapse ≥ ⚙7 days | **Reset Rep:** next session short, easy, PB-free; tier rendered one lower for ⚙1–2 sessions | planner spec (verbatim) |
| Post-Trials / post-Challenge | Next session ×⚙0.85 targets on tested patterns | H3 auto-downshift — this is its target-layer implementation |
| Trials-taper window | Volume reduced 2–3 sessions out; benchmark blocks and skill tests suspended, light practice kept | H3 + trials doc + skill doc |
| Off-week classifier (§1.4) | Next session one density notch easier; targets held, never raised; no down-writes | this doc |
| Absence Ledger recurring reason | Planner biases toward the scaled shape that worked last time | planner spec |

**Deliberate omission — no separate scheduled deload week in v1.** The monthly Trials cycle already carves the wave: taper (light) → Trials (test) → downshift (light) → three-ish loading weeks. Adding an independent deload calendar would double-count recovery and fight the ritual. ⚙ Open question 7 if Phase 0 shows the family accumulating fatigue anyway.

---

## 5. v1 → Phase 2 → Phase 3

- **v1 (this doc):** pure deterministic functions; every numeric in the ⚙ registry (§8) lives in one founder-editable config — tuning is editing a table, not shipping code. Zero ML, zero runtime LLM, fully unit-testable (§7). The founder's 16 months + Phase 0 family sessions set the initial values; the family gate is the calibration instrument.
- **Phase 2 (logged data across families):** same interfaces, tuned parameters. Band-hit rate (§2.1) becomes the explicit objective; an offline batch job fits ⚙ values per segment (age band × pattern) from logged r distributions, with per-family adjustments shrunk toward segment priors (empirical Bayes — still deterministic at runtime). Proposed parameter diffs go through founder review like a library batch, and the replayable-fold property (§0.2) means retuned parameters re-derive every family's state consistently. No interface changes.
- **Phase 3 (per PLAN):** learned response models or runtime-LLM planning may replace the *internals* of `estimate_capability` / `compute_target` — behind the same three signatures and, critically, the same Reason contract: **an implementation that cannot emit a valid, fact-traceable Reason record does not ship.** Explainability is an interface invariant, not a v1 courtesy.

---

## 6. Explainability contract

Every state change, target decision, and suggestion emits a **Reason record**:

```
{ decision, delta, evidence: [log refs], line_key, slots }
```

`line_key` selects a founder-approved Tier-1 coach line (coach-voice §6); `slots` fill from `evidence` only. Same mechanical check as Tier 2 narration: **every number in the rendered line must exist in the evidence.** The design rule, enforced in review: if a trigger can't be stated as "X happened N times" or "your number crossed Y," the heuristic is too clever — redesign it.

Canonical decision → line table (doc-canon, eval goldens; canonical family per coach-voice):

| Decision | Line |
|---|---|
| Target step up | "Targets up tonight, Leo — you've beaten your number three sessions straight." |
| Hold after off-night | "Tuesday was one night. The numbers hold." |
| Capability-jump recalibration | "Sam's been past target three sessions straight. Targets move to match him." |
| Rung advancement suggestion | "Leo — full push-ups tonight; the incline earned you that." |
| Density escalation | "Rest drops to 60 seconds tonight. Three straight weeks bought that." |
| Post-Trials downshift | "Easy night, by design. You tested Saturday." |
| Plateau rotation | "Push-ups have gone quiet for three weeks. Same pattern, new shape tonight." |
| Reset Rep | (missed-week lines are canon in coach-voice §4 — sacred, zero shame) |
| Benchmark target | The flag is the line: "⚑ beat last Tuesday: 64." |

**Silence rules:** holds are silent (the coach doesn't narrate non-events). Budget: at most **one adaptive line per member per session** — it rides the Reveal's single coach line or the close. Priority when decisions collide ⚙: safety (H11, always speaks) > rung suggestion > target change > density change > plateau rotation. Under-11 downward lines never render on the shared surface (§2.3).

---

## 7. Testability (Phase 0 deliverable, extends the planner's harness)

1. **Property tests:** monotonicity (more achieved reps never lower the next target); sandbag bound (adversarial 50%-output athlete moves targets ≤ ⚙15% over 2 weeks); band property (synthetic in-band performance keeps targets in-band); explainability totality (every state-changing decision yields a valid Reason record with traceable slots); under-11 invariant (zero shrinking visible per-set numbers across any generated sequence).
2. **Synthetic athlete models** for the longitudinal simulation (planner spec §Testability, extended): steady-improving kid, noisy 8-year-old (±30% night variance), plateaued adult, sandbagging teen, capability-jump kid, lapse-and-return family. Assert over 8-week runs: band-hit rate ≥ ⚙70% overall and ≥ ⚙50% for every member; state converges from priors within ⚙3 sessions; capability-jump estimate catches up within ⚙3 sessions; off-weeks produce zero down-writes.
3. **Golden reasons:** fixture logs with pinned Reason-record outputs, diffed on regression — the adaptive twin of the planner's golden sessions.

---

## 8. ⚙ Parameter registry (the founder-editable config, one table)

| Group | Parameters (defaults) |
|---|---|
| Priors & init | age-band × pattern (grade, W) table (founder-authored) · first-session discount 0.7 · calibration length 3 sessions · stale threshold 21 days |
| Update gains | α established 0.15 / calibrating 0.3 / benchmark 0.6 · up_clamp +10%/session (jump mode +20%) · down_clamp −5%/session · down corroboration 2-of-3 under 0.85 · under-11 verified-evidence weight 2× · max→working conversion 0.65 |
| Classifier | off-night: ≥2 patterns < 0.85 same session · plateau: 4 sessions in 0.95–1.05 deadband + 3 benchmark-flat weeks · jump: ≥1.15 × 2 sessions or benchmark +20% |
| Targets | block-type factors 1.0 / 0.85 / 0.75 / 0.6 + amrap pace model · position 1.0 / 0.95 / 0.85 · re-entry 0.9 after 10 days · pre-benchmark shave 0.9 · β under-11 0.9 / teen 1.05 / adult 1.0 · stretch block ×1.1 · deadband 2.5% · hold-target window 2 weeks · benchmark increment +1 rep / +5s · floor 0.85 × last benchmark within 8 weeks |
| Advancement | graduation_volume per exercise (library) · earned path 3-of-4 sessions · ratify path 2 completions ≥90% · decline re-arm after 2 swap-backs |
| Density tiers | rests 90/75/60/45s · tier advance 3 Pact weeks · tier drop 10-day lapse or 2 missed Pacts · under-11 rest floor 45s · post-Trials 0.85 · Reset Rep threshold 7 days |
| Quality bar | band-hit target 70% (50% per-member floor) |

---

## 9. Library-metadata & spec deltas (to fold in, same pattern as skill-progressions §deltas)

1. Exercises gain `difficulty_grade` (int, within pattern) and `graduation_volume`; swap-chain edges gain `carryover_ratio` ⚙ (seed W across a grade change: "full push-ups ≈ 40% of your incline reps"). All authoring-time, founder-reviewed — labeling discipline per planner spec.
2. Planner-spec roster's "per-pattern capability level" concretizes to `CapabilityState` (§1.1).
3. H7 benchmark blocks: target = previous result + minimum increment (this doc owns the increment rule).
4. Skill path config gains a skill→pattern mapping table (rung unlock → pattern grade floor).
5. Coach-voice Tier-1 library gains the §6 decision-line moments (target step, hold, recalibration, density, plateau) as tagged templates.

---

## 10. Open questions for the founder

1. **Teen hardness calibration:** is β 1.05 + one ×1.1 stretch block per session actually *hard* to a 14-year-old you know, or does it need more teeth? Your read on Ryan-equivalents beats any default.
2. **Priors table:** seed the age-band × pattern (grade, W) table from the 16 months of lived data before family session zero — this is the highest-leverage ⚙ in the doc.
3. **Benchmark down-moves:** as drafted, a worse benchmark writes W down (honest, fresh, comparable). Or should benchmarks ratchet-only like Trials? Recommend: allow down — the floor (§2.4) already bounds the damage, and honest state beats flattering state.
4. **Advancement default-with-decline** (new rung planned as default, old rung one swap away) vs. opt-in acceptance tap? Recommend: default-with-decline — the canon coach line already speaks this way, and an accept tap adds friction to the product's best moment.
5. **Under-11 set-shaping** ("visible per-set number never shrinks") — right call, or does Sam-equivalent not care and it over-constrains the planner? Family session zero observation item, alongside the existing public-number-aversion watch.
6. **Density ceiling with young kids:** cap the family tier at T2 while an under-11 trains, or rely on per-member H11 clamps alone?
7. **Trials cycle as the only deload wave** — sufficient, or add a scheduled light week every ⚙6–8 weeks if Phase 0 shows accumulating fatigue?
