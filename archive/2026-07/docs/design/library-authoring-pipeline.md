# Library Authoring Pipeline v1

_Design doc — July 2026 (Fable session). How content gets made: the LLM-batch → auto-triage → founder-review → simulation-acceptance loop that fills the library the deterministic planner runs on. Instantiates PLAN.md's engine decision ("LLM at authoring time, founder reviews everything"), the planner spec's "Coupling to the authoring pipeline" section, coach-voice §6 (Tier 1 batch flow), and pre-mortem theme 6 (100% founder review at fixed throughput recreates content exhaustion at beta scale — triage must happen BEFORE human review). Status: draft for founder review. ⚙ marks parameters the founder's 16 months of lived data must calibrate._

**The one rule that never bends:** nothing enters the library without founder approval (PLAN.md hard rule). Everything in this doc exists to make that rule *survivable* — the pipeline's job is to guarantee the founder spends his 1-2 review hours per week on judgment calls, never on garbage collection.

---

## 1. What gets authored

Four content types, one shared lifecycle (draft → triage → founder review → simulation acceptance → versioned library), two authorship lanes:

| Type | LLM lane (drafted by model, approved by founder) | Hand lane (written by founder, linted by pipeline) |
|---|---|---|
| **Exercises** | movement variants with full planner metadata: pattern tag, equipment, swap-chain position, metric type, age/maturity gates, time-model params, `household_surface`, `skill_path`/`rung` (for practice drills), form cues, per-exercise safety notes | — |
| **Blocks** | typed structures (straight sets / superset / circuit / AMRAP / finisher / benchmark), per-block time models, member-range suitability (roster size, age-band feel, attention-span profile) | — |
| **Coach voice Tier 1** | line variants per moment × age band, with slots (`{name}`, `{reps}`, `{prev_best}`…) and selection tags (moment, age band, roster size, tone weight) | **Tier 1a safety lines** — never LLM-drafted, never varied (coach-voice §5) |
| **Skill content** | rung *practice drills* enter the exercise lane like any exercise (they carry `skill_path`/`rung` tags) | **skill-rung `safety_note` fields and path/rung standards** — paths are hand-authored (roadmap item 5); the pipeline only lints them (reading level, banned lexicon, stop-condition present) |

The lane split for safety content is deliberate: anything whose job is "make a child stop" is founder-written words, verbatim forever. The LLM may draft per-exercise form/safety *cues* (they're reviewed like all metadata), but the canonical pain-stop language is Tier 1a, referenced — never restated or paraphrased per item.

### Swap chains are the unit of coverage, not exercises

H5 (roster coverage) means a lone exercise is nearly useless: every slot must offer a rung reachable by every present member, 8-year-old through adult. So the library organizes exercises into **movement families** — a swap chain of 4-7 variants ordered by difficulty (incline push-up → knee push-up → push-up → decline → archer). Authoring briefs request *families or chain extensions*, never isolated exercises. Chain-position ordering is the single hardest label to get right and the one the founder's lived data judges best ⚙ — it is a named review-checklist item (§3), because a mis-ordered chain silently breaks H5 and mid-workout swaps.

### Volumes

**Phase 0 seed (roadmap session #3):**

| Content | Target | Sizing logic |
|---|---|---|
| Exercises | **40-60** (≈ 10-14 families × 4-6 rungs) | Every H2 pattern gets ≥1 full-chain family covering the real family's capability spread (H5 for *this* roster); pull patterns get 2+ (equipment + skill-path demand) |
| Blocks | **15-20 templates** (≥2 per structural type × the H9 grammar slots) | See variety math below |
| Voice lines | **0 via pipeline** — Phase 0 ships the hand-authored starter set (coach-voice §Phase mapping) | Pipeline dry-runs on voice in late Phase 0 to be ready for v1 |
| Skill drills | ~25-30, already enumerated in the five path definitions | Enter the exercise lane with rung tags |

**Variety math (why 15-20 blocks is enough to start):** session identity under H10 = the ordered multiset of blocks *with their exercise fills*. With ~16 block templates and an average of even 3 valid exercise fills per slot post-filtering, distinct session count is in the thousands — H10's "no exact repeat within ⚙20 sessions" is trivially cleared. The binding constraint is never global count; it's the **conditional candidate pool**: after H1-H9 filter for a specific (roster, budget, pattern-debt) state, the planner needs ≥2-3 valid candidates per slot or it hits the sparse-library edge case. That's why the planner's own **library-gap signals drive the authoring queue** (planner spec, edge cases) — the planner tells us where the pool is thin; we don't guess.

**Pre-Phase-1 breadth target — provisional ⚙ (pre-mortem theme 6: the real number is set during Phase 0 from the observed variety-consumption rate of the founder's family, extrapolated to 10-15 families):**

- ~140-160 exercises (25-30 families; every pattern ≥2 full chains, every chain rung-complete for ages 8-adult)
- ~45-60 block templates (adds duration-band depth: micro-session and 45-min-grind variants per type)
- ~350-500 approved Tier-1 voice lines (coach voice v1: ~10-12 moments × up to 3 registers × 8-15 lines per cell — enough that rotation rules never repeat a line within a family's recent history; a per-cell coverage report flags starved cells)
- Skill paths: unchanged (5 paths are the v0/v1 fence)

## 2. The generation workflow

Generation and triage are agent work between founder sessions (operating model: founder does judgment; agents do the build). One batch = one gap brief.

### Batch anatomy

Every generation batch gets exactly this context:

1. **The gap brief** — what's being authored and why, sourced from the planner's library-gap queue ("easier vertical-pull variants for under-10s", "circuit blocks for the 15-25-min band") or a breadth-plan line item. Demand-driven briefs outrank speculative breadth, always.
2. **Constraint vocabulary as closed enums** — the pattern taxonomy, equipment fence (`none | pull-up bar` + `household_surface` tags), age/maturity gate vocabulary, metric types, block-type grammar, time-model schema. The model fills slots in a schema; it never invents vocabulary. (Taxonomy granularity is itself ⚙ — when the founder recalibrates it, the enums version with the library.)
3. **Library index, compressed** — names + pattern + chain position + age gates of everything approved, so the model extends chains coherently and self-declares near-duplicates instead of colliding.
4. **Few-shot exemplars from the founder's 16 months** ⚙ — 5-10 items per content type the founder hand-picks as "this is exactly right for my family," each with a one-line note on *why it lands* (the note matters more than the item). For voice: the moment-map golden lines, verbatim.
5. **Few-shot negatives** — the rejected-with-reason log from prior batches. Every founder reject makes the next batch better; this is the loop that raises survivor quality over time instead of relying on founder speed.

### Self-labeled metadata is mandatory

A candidate without complete planner metadata is not reviewable — it's un-triageable, un-simulatable, and would push labeling work onto the founder (the exact failure mode). Every candidate must emit: all planner fields for its type, **declared chain neighbors** ("harder than X, easier than Y"), a one-line authoring rationale, a self-declared `similar_to` list, and confidence flags on any field the model was unsure of (low-confidence flags route the item to the top of the founder's attention, not the trash).

### Batch sizing and the throughput math

Founder review budget: **60-120 min/week** inside the 8-10 protected hours (call it 90 nominal). Measured-guess review paces, post-triage ⚙ (calibrate in the first two review sessions and re-plan):

| Content | Pace per item | Per 90-min week |
|---|---|---|
| Exercise (card review) | 60-90s | ~60-90 |
| Block (structure + time model + sim evidence) | 2-3 min | ~30-45 |
| Voice line (one line vs. goldens) | 15-20s | ~150+ nominal; cap plans at ~100-120 (taste fatigue is real — coach-voice's keep-rate signal dies when the reviewer numbs) |

With triage expected to kill **30-50%** of candidates pre-review ⚙, generation over-produces ~1.5-2× the review budget. Batch size: **10-15 candidates per gap brief**, several briefs queued per week — small batches keep a single bad prompt from burning a whole review session.

**Does the math close?**

- *Phase 0 seed:* 60 exercises + 20 blocks ≈ **2.5-3 review hours ≈ 2-3 weekly sittings**. Matches roadmap session #3 as a single focused authoring session plus follow-ups.
- *Seed → pre-Phase-1 target:* ~90 exercises + ~30 blocks + ~450 voice lines ≈ **5.5-6.5 review hours ≈ 5-7 weeks at nominal budget**, running through late Phase 0 / early Phase 1 while the beta build proceeds. It fits — *if and only if* triage holds its kill rate with high precision, because a junk item that reaches the founder costs 3-5× an accept (rejects require thought, and reasons).

**If throughput still falls short at beta scale, the levers in order:** (1) deepen triage precision (turn recurring founder-reject reasons into automated rules), (2) go fully demand-driven — author only from the planner's gap queue, zero speculative breadth, (3) temporarily raise the review budget at a phase boundary as an explicit founder decision, (4) re-open the 100%-review rule itself — **only at a gate, in the docs, as a founder call. Never silently, never by sampling on the quiet.**

## 3. The review ergonomics

### The triage gauntlet (what the founder never sees)

Auto-reject, before any human attention:

1. **Schema/enum violations** — missing fields, invented vocabulary, malformed time models, slot-syntax errors in voice lines.
2. **Metadata incoherence** — metric type incompatible with block time model; equipment outside the fence; declared chain position contradicting age gates (an "easier" rung gated *older* than its harder neighbor); block duration that can't fit any legal session grammar; skill-drill tags pointing at nonexistent rungs.
3. **Duplicate similarity** — normalized-name match plus cue-text overlap within the same (pattern, equipment, metric) cell, threshold ⚙. Exact dupes die; near-dupes survive only if chain-distinct, surfaced to the founder as "variant of X" with the diff.
4. **Voice lint** — banned lexicon (bodies, diet, "level up", emoji, hype-caps), fabricated-observation verbs ("I saw/noticed/watched"), sibling-comparison structures, money words, register mismatch vs. declared age band. The coach-voice §5 rules, mechanized.
5. **Simulation smoke** (the planner-spec harness as first-pass triage, per pre-mortem theme 6): the candidate is injected into a copy of the library and 8-week longitudinal simulations run across roster shapes. Two kills: an **invariant violation** in any session containing the item (auto-reject, hard), and **never-selected** across all sims (dead weight — bounced back to the generator with the selection trace, since it usually means mislabeling).

Triage emits a report (counts + reasons + the rejects themselves). The founder spot-checks rejects occasionally ⚙ — a false-positive pattern in triage is itself a library gap, and rule #5's "never selected" doubles as a planner-bug detector.

### What the founder actually sees

**Not a diff, for new items — a decision card.** Diff-style review is for revisions of existing items only. Per sitting, one batch table grouped by gap brief; each row expands to a card; every card ends in three keys: **accept / edit-then-accept / reject-with-reason** (one-tap reason tags: `mislabeled-difficulty`, `unsafe-cue`, `not-real-vocabulary`, `duplicate`, `my-family-wouldn't`, `voice-off`, free text optional). Reason tags are load-bearing — they feed few-shot negatives (§2) and future triage rules.

Per-type card contents:

- **Exercise:** name; pattern chip; **chain strip** — the family's rungs in order with the candidate slotted between its declared neighbors (the mis-ordering check at a glance); form cues; safety note; metadata chips; similarity warnings; sim evidence (selected in N of M synthetic sessions, for which roster shapes).
- **Block:** structure diagram (slots × scheme); time-model estimate vs. the sim's realized durations; member-range suitability claims; whether it's benchmark-eligible and what a fair repeat looks like.
- **Voice line:** rendered **slot-filled with the canonical family** (Dad 42 / Ryan 14 / Leo 10 / Sam 8), displayed directly beside the golden lines for that moment × register. The bar is match-or-beat the golden, not "technically compliant" (coach-voice §6).
- **Batch coda — items in context:** the review sheet ends with 3-5 full sim-generated sessions featuring the batch's items. Labeling errors that survive card review show up here, where an item sits next to real neighbors in a real time budget.

### Quality checklist per content type (labeling accuracy is a review item — planner spec, verbatim)

**Exercise:** (1) real movement, real community name (skills rule 2 — status must be legible at the park); (2) pattern label correct; (3) **chain position honest** — genuinely between its declared neighbors for *this* family's bodies ⚙; (4) age/maturity gates right ⚙; (5) form cues correct and parent-judgeable in real time (skills rule 1 discipline applied library-wide); (6) safety note complete, plain, non-negotiable; (7) time model plausible ⚙; (8) **the taste gate: would my family actually do this on a Tuesday?**

**Block:** legal under the H9 grammar; time model believable at both ends of its duration band ⚙; member-range/attention-span claims honest (soft objective 3); if benchmark-eligible, the repeat comparison is fair; roster feel.

**Voice line:** matches or beats the golden; register correct for the age band (the Sam test: sayable to an adult without embarrassment); zero anti-patterns; slots correct; **specificity — a line sayable to any family is a defect** (the Amnesiac rule); "would I say this to another father I respect."

**Skill safety notes (hand lane):** a kid understands it on first read; names the stop condition; never negotiates with pain; lint-clean.

**Keep-rate as a health metric ⚙:** per batch, `<30%` kept = generation or triage is broken (fix the prompt/rules before the next sitting — don't spend founder hours compensating); `>85%` kept = the bar has probably dropped or the founder is rubber-stamping (coach-voice's >80% signal, generalized). Either band halts the queue for a pipeline fix; the founder's time is never the shock absorber.

## 4. Eval + regression

### Per-batch acceptance run (the gate between "founder approved" and "in the library")

Approval does not merge content — it *nominates* it. The batch then runs the full planner-spec test stack against the candidate library version:

1. **Property tests** — all H-constraints over randomized (roster, budget, history, seed) inputs.
2. **Longitudinal simulation** — 8 synthetic weeks × several family shapes (mixed rosters, missed weeks, a Trials cycle, one non-synchronous week): sequence invariants hold (H2 balance never drifts, benchmark cadence honored, novelty maintained, taper triggers).
3. **Selection-share report** — which new items get picked and which *existing* items starve after the batch lands. A newly-starved veteran item is a labeling smell somewhere in the batch.
4. **Golden-session replay** — see below.

Any failure bounces the batch (or the offending item) with the trace. Only a clean run mints a new library version.

### Golden sessions under a growing library

The planner is deterministic **per library version**, so goldens pin `(roster, budget, history, seed, library_version)` → session. Replaying a golden against its own pinned version must be byte-identical, forever (determinism regression). A new library version legitimately changes what the same inputs produce — so on each version, the harness regenerates the golden inputs under the new version and diffs: **expected drift** (new items appearing in slots) vs. **structural drift** (grammar, duration, pattern-balance, benchmark-cadence changes), which fails the run. Founder re-pins fresh goldens quarterly-ish ⚙ from real family sessions he'd sign.

Voice regression: the moment-map goldens are frozen fixtures; every model or prompt change re-runs lint + a founder taste-pass on a sample (coach-voice §6, unchanged). The rotation-coverage report (lines per moment × register cell) runs per version and feeds gap briefs.

### Live telemetry is the eval of record ⚙

The founder's family (then beta) closes the loop the sims can't: **swap-away rate** (members consistently swapping off an exercise = mislabeled difficulty — the single strongest signal chain positions are wrong), **skip rate** per block, **time-model residuals** (estimated vs. actual block duration — this is the ⚙ time-model calibration data the planner spec asks for), and voice-line "landed flat in the garage" kills (eval zero; the 14-year-old's flat stare outranks every checklist).

### Versioning and recall

- **Library versions are git commits** (see §5): monotonic, immutable, diffable. Every planned session already logs its seed (planner contract); it also logs `library_version`. Replay of any historical session is therefore free and exact.
- **Recall:** a bad item found post-merge gets status `recalled(reason)` in a new version. The planner never selects recalled items. The **pre-generated "tonight's session"** (consistency armor) is re-planned on next open if it references a recalled item — the family never sees the recall happen.
- **History is annotated, never rewritten.** Past sessions and Record Book lines that used a recalled item stand as fact.
- **Benchmark continuity:** a benchmark block whose exercise is recalled *retires* — its PB lineage is preserved but closed, and the planner schedules a successor benchmark on the nearest chain neighbor at the normal H7 cadence. No silently-incomparable "beat last time" moments.
- **The recall ratchet:** every recall gets a one-line post-mortem — *which triage rule or checklist item should have caught it* — and where mechanizable, becomes a new triage rule before the next batch. Recalls converge toward zero or the pipeline isn't learning.

## 5. Tooling: simplest thing that works, phased

**Source of truth is the repo, permanently.** Library content lives as data files in the pure-TS domain package (ADR-001 reversibility hedge); git is the versioning, audit trail, and recall substrate. No CMS, no separate content database — Convex serves the *published* library version to clients; it never becomes the authoring master.

**Phase 0 — repo files + scripts + PR review (build ~0 new surface):**
Generation agents open a batch branch; triage runs as a script (schema, coherence, similarity, lint, simulation smoke) that writes the triage report and the rendered **review sheet** — cards, chain strips, sim evidence, sample sessions — as markdown into the PR. The founder reviews the sheet in the PR, marks A/E/R inline, agents apply decisions and merge. The founder is a developer; at seed volumes (2-3 sittings total) a good markdown sheet in a PR is genuinely the right tool, and building anything more before the paper-session kill-switch clears would be scope creep.

**Phase 1 — a thin batch-review page (build when voice v1 arrives):**
The trigger is voice-line volume: hundreds of one-line judgments want a keyboard-driven table (j/k, A/E/R, reason tag, next) and reviewability in found minutes on a phone — PR review is wrong for that shape of work. Build it as one internal route in the existing web app: it reads a pending batch, captures structured decisions, and **writes decisions back as a commit** (the merge script applies them) — git stays the master. Same page serves exercises and blocks once it exists. Budget: small, one route, no auth beyond the founder's own (Clerk is live in Phase 1 anyway).

**Phase 2+ — only if beta demand forces it:** gap-queue dashboard (planner signals → prioritized briefs), triage-precision analytics, recall console. Each gets built when its manual version measurably eats founder minutes, not before.

---

## Open questions for the founder

1. **Exemplar picks ⚙** — the 5-10 "exactly right" exercises/blocks (with the one-line *why*) that anchor every generation batch. This is the highest-leverage hour of lived-data transfer in the whole pipeline; it should happen before authoring session #1.
2. **Chain-order calibration ⚙** — before the seed batch, rank-order 2-3 existing families by feel (e.g., the push-up and pull-up chains) so the pipeline's difficulty ordering has a founder-truth baseline to check candidates against.
3. **Triage strictness ⚙** — comfortable with duplicate-similarity auto-rejects, or route near-dupes to review for the first few batches until the threshold is trusted?
4. **Review budget honesty** — is 90 min/week real inside the 8-10 hours once family testing and build reviews are also running? If it's 60, the pre-Phase-1 breadth timeline stretches to ~8-10 weeks and should be planned that way now.
5. **Voice pipeline dry-run timing** — late Phase 0 (recommended: one small batch against the hand-authored starter set as goldens, purely to shake out the tooling) or hold everything until Phase 1?
