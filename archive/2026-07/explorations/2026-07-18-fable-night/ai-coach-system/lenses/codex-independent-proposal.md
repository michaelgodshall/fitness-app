# Codex Independent AI-System Proposal

- **Date:** 2026-07-18
- **Model:** OpenAI Codex (gpt-5.6-sol), reasoning effort xhigh
- **Invocation:** `codex exec --skip-git-repo-check --sandbox read-only -C /Users/michaelgodshall/Sites/fitness-app "<work order>" < /dev/null` (session id 019f78ed-dba3-7d93-9590-b365193a619b, 75,157 tokens used)
- **Inputs read:** CLAUDE.md, PLAN.md, docs/01-product-vision.md, docs/design/coach-voice.md, docs/design/library-authoring-pipeline.md, docs/design/adaptive-engine.md, docs/design/session-planner-spec.md
- **Scope note (Codex's own):** covers only the seven requested documents; did not audit implementation code, other design docs, legal compliance validity, or exercise-science correctness.

---

The hard fence is correct. Do not add a live LLM merely to make the product look more "AI." The strongest version of this product is a proof-carrying, learning deterministic system: models help author, test, calibrate, and propose; executable policy remains the authority.

## 1. CRITIQUE — the five weakest parts

### 1. "AI-native" currently overstates the user-facing system

V1 is principally a deterministic rules engine with LLM-assisted content operations. The LLM drafts founder-reviewed library entries and prose, while the actual workout logic explicitly contains "zero ML, zero runtime LLM" ([PLAN.md](/Users/michaelgodshall/Sites/fitness-app/PLAN.md:23), [adaptive-engine.md](/Users/michaelgodshall/Sites/fitness-app/docs/design/adaptive-engine.md:186)). That is a sound architecture, but to a family it may be indistinguishable from a sophisticated workout generator with mail-merged coaching text.

The answer is not to weaken the fence. It is to make the intelligence legible: decision provenance, counterfactual explanations, a family digital twin, measurable calibration, and visible evidence that tonight's plan emerged from this family's history.

### 2. The adaptive engine has false precision without an uncertainty model

The current design specifies many exact coefficients and thresholds—age-band priors, `0.85` off-night thresholds, target multipliers, EWMA gains, three-session convergence—from one founder family's experience ([adaptive-engine.md](/Users/michaelgodshall/Sites/fitness-app/docs/design/adaptive-engine.md:48), [adaptive-engine.md](/Users/michaelgodshall/Sites/fitness-app/docs/design/adaptive-engine.md:82), [adaptive-engine.md](/Users/michaelgodshall/Sites/fitness-app/docs/design/adaptive-engine.md:230)). Those are reasonable heuristic starting points, but they are not yet empirical intelligence.

`calibrating | established | stale` is operational state, not statistical uncertainty. The system needs explicit confidence in observations, targets, and grade placement; otherwise sparse or bad logs will produce authoritative-looking decisions from weak evidence. Market the v1 layer honestly as a safety-oriented heuristic kernel and earn the "learned personalization" claim in Phase 2.

### 3. Library generation and evaluation are partially circular

The model self-labels difficulty, age gates, time parameters, and neighboring rungs; those labels then drive the simulations used to assess the same candidate ([library-authoring-pipeline.md](/Users/michaelgodshall/Sites/fitness-app/docs/design/library-authoring-pipeline.md:50), [library-authoring-pipeline.md](/Users/michaelgodshall/Sites/fitness-app/docs/design/library-authoring-pipeline.md:85)). A mislabeled exercise can look valid because both the generator and evaluator share the same mistaken representation.

Founder review helps, but one family's taste is being asked to validate exercise science, developmental suitability, metadata quality, and product fit simultaneously. The youth-S&C review required before beta is good but episodic ([session-planner-spec.md](/Users/michaelgodshall/Sites/fitness-app/docs/design/session-planner-spec.md:35)). Technically credible AI authoring needs provenance, independent disagreement checks, calibrated review prioritization, and validation sources that do not derive from the candidate's own claims.

### 4. The learning objective is narrower than the product mission

Phase 2 proposes optimizing band-hit rate: whether achieved output lands near the prescribed target ([adaptive-engine.md](/Users/michaelgodshall/Sites/fitness-app/docs/design/adaptive-engine.md:94), [adaptive-engine.md](/Users/michaelgodshall/Sites/fitness-app/docs/design/adaptive-engine.md:186)). But the actual north star is sustained shared family training ([01-product-vision.md](/Users/michaelgodshall/Sites/fitness-app/docs/01-product-vision.md:63)). A system can improve band-hit rate by becoming conservative, repetitive, or metric-friendly without improving strength, family participation, teen retention, or enjoyment.

The current telemetry list—swaps, skips, duration residuals, flat voice lines—is useful but not yet a learning specification ([library-authoring-pipeline.md](/Users/michaelgodshall/Sites/fitness-app/docs/design/library-authoring-pipeline.md:139)). It needs a declared multi-objective function, data-quality semantics, causal evaluation, anti-optimization guardrails, and COPPA-compatible training-data governance.

### 5. "Runtime LLM in Phase 3" is a destination, not an architecture

The plan describes runtime LLM generation as an engine upgrade and suggests learned models or LLMs may replace capability and target internals ([PLAN.md](/Users/michaelgodshall/Sites/fitness-app/PLAN.md:16), [adaptive-engine.md](/Users/michaelgodshall/Sites/fitness-app/docs/design/adaptive-engine.md:186)). But it does not define the permitted action space, deterministic validation boundary, shadow deployment, failure budget, or evidence required to displace a heuristic.

A runtime LLM should never directly own targets, safety, or final session structure. It should propose a typed plan using approved library IDs; the existing deterministic kernel should verify, repair only through explicit rules, or reject it. Phase 3 should be gated by shadow-mode evidence, not by the calendar.

## 2. PROPOSAL — concrete AI and architecture moves

Cost assumes 8–10 founder hours/week: **S** ≤2 weeks, **M** roughly 3–6 weeks, **L** a multi-month program.

### 1. Proof-carrying sessions and a "Why tonight?" card

Expand the existing `Reason` record into a complete decision ledger for every generated session. Record candidate blocks considered, hard-constraint rejection codes, soft-objective scores, target evidence, time allocation, library version, parameter version, and seed. Render only two or three useful explanations to the family—"pulling was stalest," "Trials Saturday kept this light"—while retaining an engineer-facing trace. This makes the intelligence visible without inventing conversational AI.

- **Phase:** v1-compatible
- **Novelty:** differentiated
- **Cost:** M
- **Showcase value:** Very high—an excellent demonstration of transparent, auditable AI decisioning.

### 2. An executable safety and policy kernel

Move H1–H11, voice prohibitions, COPPA content restrictions, and library acceptance rules into versioned typed policy definitions. Do not build a general-purpose DSL; TypeScript configuration plus schemas, validators, rejection codes, and generated property tests are sufficient. The same policies should validate authored content, planned sessions, generated reports, and future LLM proposals. A youth-S&C reviewer should be able to review a human-readable policy export and map every approved rule to an executable test.

- **Phase:** v1-compatible
- **Novelty:** differentiated
- **Cost:** M
- **Showcase value:** Very high—policy-as-code is credible to regulated and safety-sensitive clients.

### 3. A training-quality event contract

Define the event stream now so later models do not learn from ambiguous logs. Every observation should distinguish target, achieved result, missing entry, skipped block, down-swap, corrected entry, parent-verified set, timer-derived duration, logger identity, and device reconciliation status. Add bounded feedback such as `easy | right | too much` and reason codes, but no open-ended child text. Every derived feature should retain source event IDs and a data-quality weight.

- **Phase:** v1-compatible
- **Novelty:** table-stakes
- **Cost:** M
- **Showcase value:** Medium—the invisible foundation that makes every later AI claim defensible.

### 4. Library coverage cartography

Turn the property-test harness into a coverage-space explorer across roster shape, ages, capabilities, equipment, time budget, recovery state, and recent history. Compute viable-candidate counts, constraint-failure distributions, selection entropy, and the marginal coverage gained by a proposed exercise family or block. The authoring queue should request the item with the greatest expected reduction in uncovered or brittle states per founder review minute. A visual heatmap of "where the planner has choices versus where it barely survives" would be both operationally valuable and highly demonstrable.

- **Phase:** v1-compatible
- **Novelty:** genuinely novel
- **Cost:** M
- **Showcase value:** Exceptional—a compelling visualization of AI-driven product operations.

### 5. Evidence-grounded library authoring

Separate product taste from safety evidence. Generation should retrieve founder goldens for tone and family fit, plus a small curated corpus of youth-strength guidance for age gates, progressions, and safety claims; each generated metadata field should identify which kind of evidence supports it. Unsupported safety claims should be rejected, while uncertain difficulty ordering should be explicitly escalated to founder testing. Citations assist review but never replace founder or professional approval.

- **Phase:** v1-compatible
- **Novelty:** differentiated
- **Cost:** M
- **Showcase value:** High—grounded generation with field-level provenance is much stronger than prompt-only RAG theater.

### 6. Disagreement-driven review and a founder preference learner

Use separate generation, metadata-critique, safety-critique, and voice-critique passes; use different models when practical, or at minimum prompt-isolated passes with no access to one another's conclusions. Surface disagreements about difficulty ordering, age gates, duplication, and voice directly on the founder's review card. Train a lightweight classifier on `accept/edit/reject + reason` history to prioritize likely failures and high-information examples, but never let it auto-approve. This converts founder judgment into a compounding asset while preserving the 100% review rule.

- **Phase:** v1-compatible, after several labeled batches
- **Novelty:** differentiated
- **Cost:** M
- **Showcase value:** Very high—a concrete human-in-the-loop learning system rather than "AI generates content."

### 7. Claim-graph generation for recaps

Replace "generate prose, then lint it" with a typed claim inventory. The engine emits permitted claims such as `PB_DELTA`, `PACT_COMPLETE`, or `MATCHED_BEST_UNDER_CONSTRAINT`, each carrying subject, evidence IDs, allowed comparison scope, and approved rhetorical treatments. The LLM selects and orders claim IDs; a deterministic renderer or constrained realization step inserts numbers and names. Every displayed sentence can therefore be traced to evidence, and forbidden sibling or body comparisons are structurally unavailable rather than merely caught by a word list.

- **Phase:** v1-compatible for Phase-1 coach voice
- **Novelty:** differentiated
- **Cost:** M
- **Showcase value:** Very high—fact-safe generative UX with sentence-level provenance.

### 8. A family digital twin and scenario laboratory

Develop synthetic family models that generate capability growth, noisy child performance, roster churn, time pressure, swaps, missed weeks, and logging errors. Run thousands of eight- or twelve-week trajectories against planner versions and compare safety violations, target calibration, session diversity, Pact completion, workload equity, and reset behavior. Include deliberately hostile scenarios: sparse libraries, repeated device conflicts, one dominant athlete, a perpetually absent member, and systematic under-logging. This becomes the pre-production proving ground for every planner, library, and parameter change.

- **Phase:** v1-compatible as an offline engineering system
- **Novelty:** genuinely novel
- **Cost:** L
- **Showcase value:** Exceptional—the product can visibly demonstrate its "simulation before children" safety posture.

### 9. COPPA-compatible learning architecture

Separate operational family data from the learning dataset before beta. Training exports should exclude nicknames, exact timestamps, room codes, IP-derived fields, and free text; use pseudonymous family IDs, coarse time windows, explicit consent versions, and purpose-limited feature views. Maintain lineage so parent deletion removes source events and derived training rows, and document whether already-produced model snapshots require retraining or may remain under the approved policy. Publish internal dataset and model cards covering age slices, missingness, exclusions, and known limitations.

- **Phase:** v1-compatible; required before Phase-2 learning
- **Novelty:** table-stakes
- **Cost:** M
- **Showcase value:** High—especially for clients working with minors, healthcare, education, or sensitive personalization.

### 10. Hierarchical Bayesian capability calibration

In Phase 2, replace hand-tuned segment values with an interpretable hierarchical model over age band × movement pattern, with family and member effects shrunk toward well-supported priors. Produce posterior uncertainty for capability and target factors; sparse members remain conservative instead of receiving brittle personalization. Compile reviewed posterior summaries into versioned deterministic parameter snapshots so runtime behavior stays offline, reproducible, and explainable. Require calibration plots, holdout performance, subgroup error analysis, and minimum sample sizes before any parameter update ships.

- **Phase:** Phase-2
- **Novelty:** differentiated
- **Cost:** L
- **Showcase value:** Very high—real statistical personalization without sacrificing deterministic runtime behavior.

### 11. A constrained learned session ranker

Keep candidate generation and all hard constraints deterministic. Train an offline ranker only to order already-valid candidates using a declared multi-objective score: band hit, completion, swaps, duration residual, seven-day voluntary return, roster coverage, and workload equity. Do not optimize raw engagement time, child screen time, or streak preservation; those are misaligned incentives. Ship the ranker as a signed, versioned snapshot with a deterministic fallback to the current hand-authored soft scoring.

- **Phase:** Phase-2, only after meaningful cross-family volume
- **Novelty:** genuinely novel
- **Cost:** L
- **Showcase value:** Exceptional—a clean example of learned preference inside a verified action space.

### 12. Safe N-of-family experimentation

Use the existing one-knob rule as an experimentation protocol. Within founder- and S&C-approved envelopes, occasionally compare safe equivalents—75 versus 60 seconds rest, block order, target-band placement, or circuit versus superset—and estimate individual response using sequential Bayesian tests. Exclude max-effort work, safety rules, child-facing persuasion, and sacred benchmarks from experimentation. Parents should opt in, every experiment should have a stop condition, and the decision ledger should explain exactly what varied.

- **Phase:** Phase-2
- **Novelty:** genuinely novel
- **Cost:** L
- **Showcase value:** Exceptional—causal personalization is far more credible than correlation-driven "AI adaptation."

### 13. A shadow LLM planner

Before allowing any runtime-generated workout, run an LLM planner asynchronously in shadow mode. Give it only structured family state and approved library IDs, ask for a declarative plan, then score it against the deterministic planner and subject it to the full safety kernel without ever showing it to a family. Accumulate constraint failures, novel-but-valid plans, disagreement cases, latency, cost, and explanation quality. This can begin in Phase 2 without violating the workout-loop fence because shadow output has no product effect.

- **Phase:** Phase-2
- **Novelty:** genuinely novel
- **Cost:** M
- **Showcase value:** Exceptional—responsible AI rollout backed by actual pre-deployment evidence.

### 14. Proof-carrying runtime LLM planning

If the Phase-3 fence opens, the LLM should emit a typed intermediate plan containing approved library references, claimed objectives, evidence references, and uncertainty—not executable workout instructions or free-form safety language. The deterministic kernel recomputes time, targets, age gates, recovery, and session-level safety; it accepts the plan only if it can attach a complete proof record. Failure, timeout, unsupported intent, or excessive uncertainty immediately falls back to the deterministic planner. Promotion from shadow mode should require a written safety case and demonstrated value beyond the existing ranker.

- **Phase:** Phase-3-runtime-LLM era; earlier use requires a fence amendment
- **Novelty:** genuinely novel
- **Cost:** L
- **Showcase value:** Exceptional—a credible constrained-agent architecture rather than an LLM wrapper.

## Recommended sequence

The highest-leverage v1 story is:

1. Establish the event contract and executable policy kernel.
2. Add proof-carrying sessions and coverage cartography.
3. Upgrade authoring with provenance and disagreement-driven review.
4. Build claim-graph recaps and the digital-twin lab.
5. Collect Phase-2-quality data before attempting learned ranking or Bayesian personalization.
6. Keep runtime LLM work in shadow mode until it decisively beats the deterministic alternatives.

That produces a stronger consulting showcase than live workout chat would: a system that generates with AI, learns from evidence, protects children through executable policy, explains every decision, and can prove why an output was allowed.

Scope: this opinion covers only the seven requested documents. I did not audit implementation code, the other design documents, legal compliance validity, or the substantive correctness of the exercise-science rules.
