# Lens 2 — Coach Memory & Context Engineering

_Exploration draft, 2026-07-18. How the coach becomes "the coach who has been in this family's garage for every session" without ever inventing a number. Designs the layer between the settled event log (`engine-data-model.md §4`) and every AI surface. Fence posture: no runtime LLM in the loop, clipboard-not-camera, COPPA-scoped, fact-traceable. All shapes are pure-TS domain, zero Convex imports (ADR-001)._

The substrate already exists: an append-only event log, a settlement layer, an append-only Record Book, and a `CapabilityState` fold. What's **missing and load-bearing** is a named, single read model that turns settled facts into *memory* — and a discipline that makes every AI surface a scoped projection of it, never a reader of the raw log. That is this lens.

---

## M1 — `FamilyMemory`: one derived read model, every surface is a projection

**What:** A pure function `deriveFamilyMemory(settledHistory, library, params) → FamilyMemory` — an I3-class *derived, never stored* projection (recompute must equal cache). It is the coach's whole memory; no AI surface reads settlements or events directly.

```ts
interface FamilyMemory {
  capabilityTrajectories: Record<MemberId, Record<Pattern, WSeries>>; // W over time + trend (fold of §1.3)
  benchmarkLineages: Record<BenchmarkKey, Record<MemberId, LineagePoint[]>>; // beat-last-time history
  pbTable: PBRecord[];                 // §1.7 cache
  streaks: { familyRingWeeks: number; currentWeek: PactWeekView };
  milestoneCanon: RecordBookEntry[];   // the permanent ledger (M3)
  beats: NarrativeBeat[];              // ranked, derived (M4)
  absenceSummary: AbsenceEntry[];      // *that* + tag, never *why* beyond the tag
  asOf: EpochMs; provenanceDigest: string;
}
```

**Why this product:** it operationalizes "one shared state machine; devices are projections" one layer up — *one memory model; AI surfaces are projections.* It is the structural form of "clipboard, not camera": the coach can only know what's in `FamilyMemory`, and everything in `FamilyMemory` traces to a settled fact.
**Phase fit:** v1 / Phase 0 — the adaptive engine, PB detection, and streak ring already *implicitly* consume this; naming it as the shared read model is the missing seam, not new scope.
**Build cost:** S — it composes functions that must exist anyway (`derivePactWeek`, `estimate_capability`, PB cache). Mostly a re-org, not new logic.
**Showcase value:** high — "the AI reads a governed read model, not the database" is exactly the architecture enterprise clients need and rarely have.
**Risks:** projection drift if any surface is allowed a side-channel to raw data — the whole guarantee dies the moment one line reads the log directly. Enforce with a lint/type boundary (M2).

## M2 — The Memory Fact: provenance is a type, not a convention

**What:** Every scalar the coach can utter is a `MemoryFact`, not a bare number:

```ts
interface MemoryFact<T = number> {
  value: T;
  evidence: LogRef[] | SettlementRef; // where it came from
  kind: 'observed-total' | 'benchmark' | 'pb' | 'aggregate' | 'streak' | 'tier';
}
```

The facts-extraction layer is `extractFacts(FamilyMemory, scope, window) → FactsPayload` where **the payload is closed under provenance**: no `MemoryFact` without an evidence ref compiles. This is the same mechanical gate the Reason record (`adaptive-engine §6`) and Tier-2 narration (`coach-voice §6`) already demand — unified into one contract so both surfaces reuse it.

**Why this product:** "every number is traceable" (coach-voice §2.7) stops being a review-time hope and becomes a compile-time invariant. The banned "I saw your form slipping" is unreachable because there is no `MemoryFact` for it — the coach can only address what has an evidence ref, and form has none.
**Phase fit:** v1 / Phase 0.
**Build cost:** S — a wrapper type plus the extractor.
**Showcase value:** high — this *is* the anti-hallucination pattern, made concrete (M7).
**Risks:** over-verbose payloads; mitigate by scoping windows (M5) so the LLM never sees the whole history.

## M3 — Canon: deterministic milestone detection at settlement

**What:** A moment becomes **canon** iff `settle()` matches it against a published, closed set of `MilestoneRule`s — a pure predicate over the settlement, run server-side, that appends exactly one `RecordBookEntry` (I9). Canon is never LLM-decided.

Rule set v1 (each is a test):

| Rule | Trigger | Merit class |
|---|---|---|
| **First-of-category** | first non-zero score on a lineage/skill (first dead hang, first full push-up rung) | 1 (highest) |
| **Skill rung unlock** | witnessed pass (I9) | 1 |
| **Tier crossing** | Capacity tier moves up on a Trials test | 2 |
| **All-time best** | PB mint on Trials/benchmark lineage | 3 (drought-guarded) |
| **Torch pass** | a kid's lineage score first exceeds a parent's on the same benchmark | special (family physics only) |
| **Family milestone** | 100th session, first covered non-sync week, streak crossings (4/8/12 wks) | family-level |

"The night Leo got his first dead hang" is a **First-of-category** on the vertical-pull hold: the entry stores `memberId`, the score, `sessionInstanceId`, date, and — crucially — the roster of that session, because "while his brothers counted it out loud" is a *fact* (who was present), not color. Even the warmth is traceable.

**Why this product:** the biggest emotional moments in the product must be earned by the record, not narrated into existence. A closed rule set makes canon auditable and gives the Highlighted-moment heuristic (firsts > tier crossings > margin) a typed input.
**Phase fit:** core rules v1 / Phase 0 (PB, first, skill unlock); tier-crossing/torch-pass Phase 1 (needs Trials).
**Build cost:** M — the rule engine is small; the care is in the "first-of-category" detector against lineage scoping (I2), so a rung change doesn't fake a "first."
**Showcase value:** med — "deterministic canon detection" is a clean pattern but domain-shaped.
**Risks:** a mislabeled lineage mints a false "first" into permanence; gate behind the same golden-session replay the library uses.

## M4 — Narrative beats: a ranked derivation, disposable prose

**What:** `NarrativeBeat = RecordBookEntry + meritScore + slots`. Beats are *derived and ranked* by the published merit heuristic with the 2-month drought guard (Q15). The **prose is a leaf, never memory**: `RecordBookEntry.line` is frozen rendered text for display, but the *canon* is the structured entry — regenerating the line from the entry must never change a fact. LLM output (Tier 2) narrates beats; it never *creates* one and never writes back into `FamilyMemory`.

**Why this product:** separates "what happened" (permanent, deterministic) from "how it was said" (regenerable, model-swappable). The founder can change the coach's voice model in Phase 2 and every past milestone re-narrates without rewriting history (I4: history is annotated, never rewritten).
**Phase fit:** Phase 1 (Trials Report is the first consumer).
**Build cost:** S given M3.
**Showcase value:** med-high — "LLM prose over an immutable fact spine" is a reusable content pattern.
**Risks:** ranking favoritism; strict per-member rotation (Q15) in Phase 1.

## M5 — Summarization cadence: aggregate continuously, narrate on events, never summarize on a timer

**What:** Two lanes with a hard boundary.

- **Deterministic aggregation** runs at *every settlement* — updates caches, folds capability, appends canon. This is the memory of record. Zero hallucination surface. Safe everywhere, including in-session (the display computes the thin slice offline for Tier-1 lines).
- **LLM summarization** runs *only at Tier-2 events* (monthly Trials Report, milestone blurb, week recap), *only over a frozen `FactsPayload`* from `extractFacts`, with the mechanical traceability gate and a deterministic skeleton fallback.

**The forbidden thing, stated:** there is **no rolling job that asks an LLM to re-summarize the log into memory.** That is the classic drift trap — each summary compounds the last summary's errors until the "memory" is confabulation. The coach answers long-history questions from deterministic aggregates (`streaks`, `capabilityTrajectories`), never from LLM recall. This also enforces coach-voice §2.2: deep-history trivia is a designed milestone (100th session), not ambient LLM recall — and it *can't* be ambient, because the LLM only ever sees a bounded window.

**Why this product:** it is the exact resolution of the offline fence and the hallucination fence at once — in-session memory is deterministic (works in a basement), async memory is LLM but bounded and gated.
**Phase fit:** v1 / Phase 0.
**Build cost:** S — it's a discipline plus the windowing in `extractFacts`.
**Showcase value:** high — "where LLM summarization is safe vs. where it silently rots" is the single most useful thing to teach a client shipping AI-over-data.
**Risks:** temptation to add a "smart weekly digest" LLM job later; pre-commit against it in the doc.

## M6 — Privacy: memory is scoped by projection; COPPA delete re-folds

**What:** `FamilyMemory` is never handed out whole. Surfaces receive `scopeMemory(memory, lens)`:

| Lens | Sees | Never sees |
|---|---|---|
| **Shared screen** (in-session) | family facts, each present member's own current numbers; under-11 PB Watch private-by-default | absent members' private facts |
| **Parent account** | everything (parent owns all sub-profiles) | — |
| **Teen companion (Phase 2)** | own trajectory + PBs, family-level facts/milestones it's part of | siblings' per-member facts; anything violating the sibling-comparison ban; every coach line to the teen is parent-visible |
| **Shareable artifact** | nickname/initials per parent setting | raw identifiers |

**COPPA review/delete:** because memory is a pure fold (I3), parent redaction is a *facts-level* operation — tombstone a member's settlements/Record Book entries → re-derive → memory updates cleanly. This is the **one place append-only permanence (I4) yields to a legal delete right**: a member purge hard-tombstones that member's canon and re-folds family aggregates. It must be designed, not discovered — flagged below.

**Why this product:** the scoping is structural (a member with no login literally has no session-persistent identifier — ADR-003), and the teen-companion review (coach-voice §5.6) gets a concrete contract: a scope function, not a fork.
**Phase fit:** scoping v1; COPPA delete Phase 1 (COPPA gate); teen-view Phase 2.
**Build cost:** M — the delete/re-fold reconciliation with I4 is the real work.
**Showcase value:** high — "privacy as projection + deletable derived state" is a governance story clients pay for.
**Risks:** delete-vs-append-only is a genuine tension; under-specify it and you either leak (no delete) or corrupt family aggregates (naive delete). Needs its own spec.

## M7 — The reusable pattern: fact-traceable personalization over event-sourced logs

Extracted from this product, the client-showcase pattern is four moves: **(1)** append-only event log as source of truth; **(2)** a deterministic read model with provenance on every fact (M1–M2); **(3)** the LLM constrained to narrate a *frozen, scoped* facts payload with a mechanical traceability gate and a deterministic fallback (M4–M5); **(4)** privacy as projection functions with deletable derived state (M6). The pitch to a consulting client: *"an AI assistant over your data that cannot state a number that isn't in the record, degrades to deterministic text offline or on failure, and whose entire memory you can audit and delete."* Every CRM copilot, financial-summary, and health-adjacent build wants exactly this and almost none have it. **Showcase value: high** — it is a trust/governance architecture, demonstrable end-to-end on a real product, not a demo trick.

---

## Fence-compliance check (my own proposals)

- **No runtime LLM in the loop:** ✅ M1/M2/M5 keep in-session memory 100% deterministic and offline-computable; LLM touches memory only async (M4/M5), never in-flight, never writing back.
- **Clipboard-not-camera / traceability:** ✅ M2 makes provenance a type; no `MemoryFact` for un-logged observations exists, so "I saw" is unreachable.
- **COPPA:** ✅ M6 scopes minors' memory, keeps coach broadcast-not-chat (no memory surface adds dialogue), and specifies parent delete. Teen companion stays a scope function with parent-visible lines.
- **No gender / no body data:** ✅ `FamilyMemory` carries only reps, seconds, tiers, dates, roster — no such fields enter the read model.
- **Append-only permanence:** ⚠️ M6's COPPA delete is the one deliberate exception to I4 — surfaced, not hidden.
- **Founder reviews every library item:** ✅ untouched — memory reads facts, not library content; Tier-2 prose still runs the review/eval harness.

## Open founder questions

1. **COPPA delete vs. I4 (highest-leverage):** is a member purge a hard tombstone-and-re-fold, or a soft "hide from surfaces, retain in ledger"? Recommend hard tombstone for a clean delete right; it costs a re-fold spec now.
2. **Co-presence as a beat fact:** is "while his brothers counted it out loud" (roster-derived) warmth you want, or does even that read as too much for you? Recommend keep — it's traceable and it's the product's soul.
3. **Beat merit rotation:** strict per-member round-robin (Q15) locks favoritism out but can bury a genuinely bigger sibling moment. Confirm strict for Phase 1.
4. **Absence in memory:** `absenceSummary` keeps *that + tag*, never *why* beyond the tag. Confirm the coach may reference a family-level gap ("twelve days") from it but never a member's specific absence.
