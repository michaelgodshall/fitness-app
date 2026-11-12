# Lens 4 — Onboarding & Intake AI

_Exploration, 2026-07-18. Not authority; the design docs govern. Proposes an AI intake layer that produces a typed `FamilyProfile` feeding the adaptive engine's initialization (adaptive-engine §1.2), the planner's equipment/roster inputs, and the coach's register system. All amendments are flagged as candidate amendments with the argument made honestly._

## Frame: what intake is and is not

The adaptive engine's day-one placement is **placement-by-training** (adaptive-engine §1.2): a flat age-band × pattern priors table seeds session one at a 0.7× discount, everything starts `calibrating`, and the state converges from the log inside ~3 sessions. That is the mechanism, and it is correct — the log is the only real evidence. Intake AI does not replace it. Intake AI's job is narrower and honest: **pick a better cell in that priors table, and collect the four things the log can never tell you** — which nights are real, what's in the room, how each kid takes pressure, and what the family is training toward.

Critical framing that governs everything below: **the interview personalizes the _initialization_; it never injects log events.** This preserves the engine's replayable-fold property (posture rule 2). The age-band table is already the init; the interview offsets within it. The moment a real session lands, the standard update rule (§1.3) runs and `implied_W` dominates inside calibration's doubled gain. The log outranks the interview by construction, not by policy — because the interview is a parameter, not a fact in the fold.

Fence position: intake is a **parent-only** conversation that happens **outside the workout loop**, online, async-tolerant. The v1 fence bans runtime LLM _between a family and tonight's workout_; intake is never in that path. It is COPPA-clean because it never touches a child (coach-voice §5.1–5.2). But it is honestly a **new runtime-LLM surface** the plan does not currently have — even Tier 2 is post-hoc, not interactive — so Proposal 2 makes the conversational layer optional over a deterministic floor.

---

## Proposals

### 1. The `FamilyProfile` — one typed artifact, every field confirmable and sourced

```ts
FamilyProfile {
  members: {
    nickname: string; birthYear: number; callSign: string   // sub-profile shape ONLY — no more
    capabilityPriors: { pattern: Pattern; gradeHint: int; confidence: 'guess'|'stated'|'skill-seeded' }[]
    skillInterest: SkillPath[]                                // seeds gap meter, not placement
    temperamentFlags: Enum[]   // e.g. timer_averse, competition_averse, needs_win_first
  }[]
  schedule: { realNights: Weekday[]; typicalWindow: 15|30|45; intendedSessions: int }
  equipment: { pullUpBar: 'none'|'doorway'|'park'; householdSurfaces: SurfaceTag[] }
  goals: { familyGoal: Enum; perMemberAspiration?: string }
  provenance: { field: path; source: 'parent-stated'|'inferred'|'default'; confirmed: bool }[]
}
```

- **What:** the single output of intake; a closed schema, versioned with the library enums.
- **Why this product:** every consumer already exists and is starving for exactly these inputs — `capabilityPriors` → the engine's §1.2 seed; `householdSurfaces` → the `household_surface` tags the library-authoring-pipeline already carries; `realNights` → Tomorrow's Card / Absence-Ledger priors; `temperamentFlags` → the coach register + PB-Watch defaults. Intake doesn't invent a surface; it fills slots the specs left blank.
- **Phase fit:** **Phase 1** (see closing). Schema drafted Phase 0.
- **Build cost:** **S** — it's a type plus a store.
- **Showcase value:** **high** — "a typed, validated, human-confirmed object as the product of a conversation" is the exact pattern consulting clients want to see; the profile _is_ the demo artifact.
- **Risks:** schema creep — the temptation to store rich free-text about a kid. Guardrail in Proposal 3.

### 2. Schema-constrained extraction over a deterministic form floor

- **What:** the parent talks; the LLM fills the `FamilyProfile` schema via constrained/structured output (tool-call-shaped, never free prose), asking only for fields still `default` or low-confidence. **Underneath sits a plain deterministic form that produces the identical schema with zero LLM.** The conversation is an enhancement over the form, not a replacement for it.
- **Why this product:** a two-parent, one-kid-at-soccer, tired-Tuesday-signup household will not finish a 40-field form. Conversation lifts completion. But the form floor keeps intake **fence-honest and offline-degradable** — if the model is down, mis-behaves, or the founder cuts it under the mid-August scope line, onboarding still works. It also means the LLM is never load-bearing for correctness; it's load-bearing for _friction_.
- **Phase fit:** form floor **Phase 1**; conversational layer **Phase 1, cut-eligible** (mirrors the coach-voice starter-set/pipeline split).
- **Build cost:** form **S**; conversational + extraction eval **M**.
- **Showcase value:** **high** — natural-language-to-structured-object with a deterministic fallback is a governance-grade pattern; "the AI never touches correctness, only convenience" is a strong client story.
- **Risks:** the model volunteers advice or asks a follow-up that drifts toward the child — bound the system prompt to slot-filling only, banned-topic lint reused from coach-voice §5.

### 3. Confirmation UX = the consent gate _and_ the data-minimization gate

- **What:** before anything commits, the parent sees every extracted fact as an editable card, grouped (members / schedule / equipment / goals), **lowest-confidence first** (the library-pipeline "flag to top" pattern). Nothing persists until confirmed. Two hard rules: (a) the **raw transcript is discarded** — only typed enum/int fields survive; (b) per-child, the only stored fields are `nickname + birthYear + callSign` plus typed flags, exactly the sub-profile shape.
- **Why this product:** this single screen is simultaneously the verifiable-parental-consent moment (Phase 1 COPPA gate), the moment the parent sees precisely what's stored about each kid, and the mechanism that keeps a chatty conversation from becoming a PII lake. Schema-constrained extraction is _also_ data minimization: the funnel from rich talk to typed flags is the privacy control.
- **Phase fit:** **Phase 1** — it's part of the COPPA compliance gate, not before it.
- **Build cost:** **M** — real UX plus the consent-record plumbing.
- **Showcase value:** **high** — "human-in-the-loop confirmation as a compliance primitive" is a directly reusable consulting deliverable.
- **Risks:** confirmation fatigue → parents rubber-stamp. Keep it to ~6–10 cards; default-confirm the high-confidence ones, force-touch only the flagged.

### 4. Priors that decay because they were never facts

- **What:** intake writes `capabilityPriors` as an offset into the age-band table, bounded to **±1 grade and W within [0.7×, 1.3×]** of the age-band default. State still enters `calibrating`, still takes the 0.7× first-session discount. `skill-seeded` priors are the exception — an enrollment skill placement is a _real observed max_ (§1.2.4) and gets full weight. After session one, §1.3's update rule runs; by calibration exit (~3 sessions) interview influence is gone.
- **Why this product:** kids' capability is the field parents guess worst; letting a parent's "he can do 20 pull-ups" set an unclamped target burns trust on night one — the product's most fragile moment. Clamping means the interview can only _nudge_ the starting guess; the first-session discount and the fold absorb the error fast.
- **Phase fit:** **Phase 1.** (Candidate amendment to adaptive-engine §1.2: add an optional `interview_offset` to the prior, clamped as above — argued honestly: it strictly narrows, never widens, the existing seed, and preserves replayability.)
- **Build cost:** **S** — a clamp and a tag.
- **Showcase value:** **med** — a clean "AI estimate as a bounded prior the ground truth overrides" story, but internal.
- **Risks:** over-trusting the parent (the core failure mode) — the clamp _is_ the mitigation; a wrong estimate costs at most one easy night.

### 5. Temperament & schedule flags tune structure, never speech

- **What:** `temperamentFlags` are typed config the planner and coach-register read: `timer_averse` → suppress visible countdowns / bias away from AMRAP framing for that member; `needs_win_first` → hold β at the band's low edge an extra session; `competition_averse` → PB-Watch private by default. `realNights`/`intendedSessions` seed Tomorrow's Card and the Pact target.
- **Why this product:** "Sam melts down when timed" is real, actionable, and un-loggable. But it must _never_ become coach speech about the child — coach-voice §2.4 bans behavioral-pattern commentary; "I know timers stress you" is exactly the banned framing. The flag changes the _structure_ (no timer on Sam's tile), silently.
- **Phase fit:** flags stored **Phase 1**; planner/register consumption **Phase 1**, incrementally.
- **Build cost:** **M** — each flag is a small planner/register branch.
- **Showcase value:** **med** — "sensitive human input as silent config, never as generated speech" is a tasteful boundary clients notice.
- **Risks:** a flag leaking into a rendered line. Guardrail: flags are inputs to selection/suppression only, never slots in a coach template; add a lint that fails if a flag value reaches a rendered string.

### 6. Re-intake as typed, minimal-touch triggers

- **What:** three re-intake moments, each scoped tight: **season boundary** (school starts) → schedule-only re-ask ("which nights are real now?"), no capability re-intake; **new member** → a single-member intake slice; **post-gap return** → **no capability re-intake at all** — Reset Rep owns re-entry and the floor's 8-week expiry (§2.4) handles detraining. At most a one-tap "anything change at home?" that can update `equipment`/`schedule` only.
- **Why this product:** the non-synchronous gate week and fall-schedule collapse are the validated killers (pre-mortem theme 1). Schedule reality drifts; capability doesn't need re-interviewing because the log already knows it. Re-intaking capability on _return_ would add friction at the exact fragile moment the whole product is built to make frictionless.
- **Phase fit:** season/new-member **Phase 1**; the return case is deliberately a **no-op** by design.
- **Build cost:** **S** — reuses Proposal 2's pipeline with narrower field sets.
- **Showcase value:** **low** — internal lifecycle logic.
- **Risks:** re-intake nagging. Rule: never coach-initiated mid-lapse; season re-intake fires only from a parent-surface prompt, never a child surface (§5.5).

---

## Phase-fit verdict (the honest answer)

**Intake AI is a Phase 1 onboarding feature, not Phase 0 — and it should not jump the queue.** Phase 0 is the founder's own family, whom he knows better than any interview could extract; his placement mechanism is already specified (placement-by-training) and his highest-leverage move is authoring the age-band priors table directly from 16 months of lived data (adaptive-engine open question 2), _not_ interviewing himself. F11's own resolution treats onboarding as Phase 1. The correct Phase 0 footprint is a **late-Phase-0 dry run**: the founder runs the schema + extraction against his own family purely to shake out the tooling and the prompt (the exact pattern library-authoring-pipeline uses for the voice-pipeline dry run). Everything real — the parent-facing conversation, the consent-gate confirmation UX, the COPPA data map — lands in **Phase 1**, gated behind the same compliance review as accounts.

## Fence-compliance check of these proposals

- **No runtime LLM in the workout loop:** ✅ intake is pre-session, parent-only, and Proposal 2's deterministic form floor means correctness never depends on the model. It _is_ a new interactive runtime-LLM surface (flagged, Proposal 2) but sits entirely outside the session path.
- **COPPA / no open-ended dialogue with a minor:** ✅ parent-only by construction; Proposal 3 discards the transcript and stores only sub-profile-shaped fields; Proposal 5 keeps temperament out of coach speech.
- **No gender in the data model:** ✅ `callSign` only, no gender field (Proposal 1).
- **Founder reviews every library item:** ✅ intake produces per-family runtime data, not library content — the review rule is untouched; the age-band priors table it offsets from remains founder-authored.
- **45-min cap / bodyweight-pure:** ✅ intake feeds `time dial` defaults and `pull-up bar` equipment only; it cannot widen either fence.
- **Replayable-fold integrity:** ✅ Proposal 4 keeps the interview a bounded initialization parameter, never a log event.

## Open founder questions

1. **Is a conversational intake worth a new runtime-LLM surface at all,** or is the deterministic form (Proposal 2 floor) enough for 10–15 beta parents who are motivated by definition? Recommendation: ship the form for beta; add conversation only if intake-completion telemetry shows drop-off.
2. **The prior clamp (±1 grade, W ∈ [0.7×, 1.3×]):** does that match how wrong you expect parents to be about their kids? Your read on real beta-parent estimation error should set this before Phase 1.
3. **Temperament flag vocabulary** — which flags are worth a planner/register branch (`timer_averse`, `needs_win_first`, `competition_averse` proposed)? Each one is real build cost; keep the enum small and earned.
4. **Return-case no-op** — comfortable that post-gap return does zero capability re-intake and leans entirely on Reset Rep + the 8-week floor expiry, or do you want a single optional "anything change?" touch?
