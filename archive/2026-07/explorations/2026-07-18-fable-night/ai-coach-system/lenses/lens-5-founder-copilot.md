# Lens 5 — The Founder Copilot

_AI-native company ops for a solo founder running a beta at 8-10 hrs/week. Fable-night exploration, 2026-07-18. The operating model is fixed: **founder does judgment, agents do the build**, and the copilot **never decides** — it reads, drafts, and pre-sorts so the founder's scarce hours land only on judgment. This is also the meta-showcase: one human + an agent fleet is the case study the consulting practice sells._

The signals this lens mines are already named by the product's own docs — the copilot doesn't invent instrumentation, it harvests what the engine and pipeline already emit: swap-away rate, skip rate, time-model residuals, band-hit rate, voice "landed-flat" kills (library-authoring-pipeline §4), and the numeric gates in PLAN.md. The design principle throughout: **every output is a draft with its evidence attached and a founder decision at the end** — accept / edit / reject, mirroring the library review card the founder already lives in.

---

## 1. The Weekly Founder Brief (telemetry insight miner)

**What:** A Sunday-night agent run that reads the week's Convex session logs + git library version and produces one markdown brief: 5-8 ranked findings, each = signal + evidence trace + a drafted action (a gap brief, a recall nomination, a chain-reorder proposal). Sourced signals: swap-away rate flagging mislabeled chain positions (the single strongest "difficulty is wrong" signal per §4), skip rate per block, time-model residuals (estimated vs. actual duration — the ⚙ calibration data the planner spec asks for), band-hit rate drift, never-selected library items.

**Why this product:** the pipeline explicitly says "the planner tells us where the pool is thin; we don't guess" — but only if someone reads the telemetry weekly. At 8-10 hrs/week the founder won't hand-query Convex. The brief is the read.

**Phase fit:** v1 (founder-family) as a script over local logs; Phase 1 as a scheduled Convex-reading agent.
**Build cost:** S (v1: a query + a markdown template) → M (Phase 1: scheduled, multi-family aggregation).
**Showcase value:** high — "my telemetry writes its own weekly PM brief with drafted tickets" is a clean, legible agent-ops demo for consulting clients.
**Risks:** false-positive signals (a swap-away that's preference, not mislabeling) reaching the founder as if true — mitigate by attaching the raw trace and forcing an accept/reject, never auto-applying.

## 2. Retention Early-Warning (per-family, gate-aware)

**What:** A per-family health monitor that watches the exact patterns the gates fail on: attendance-friction trend (willing/pushed/refused, Gate 0→1 criterion b), covered-session cadence against the ≥3/week + ≥2-synchronous rule, Absence Ledger tag clustering, teen skill-ladder view frequency (Gate 0→1 criterion c), and Pact-ring completion slope. Output: a per-family status chip (green/watch/at-risk) with the specific gate metric trending wrong and a drafted intervention — never an auto-nudge to the family.

**Why this product:** the gates are numeric and don't move (hard rule). A founder running 10-15 families needs to see a family drifting toward a gate miss in week 2, not discover it at the 6-week denominator. Dropouts count as failures in Gate 1→2 — early warning is the only lever.

**Phase fit:** v1 for the founder's own family (one row); Phase 1 for the cohort. **Fence-sensitive:** interventions are drafted for the *parent* surface only, never coach-initiated pings to a child (coach-voice §5.5).
**Build cost:** S → M.
**Showcase value:** med-high — churn prediction is a common client ask; the "drafted intervention, human sends" pattern is the responsible-AI story.
**Risks:** over-alerting turns the founder numb; cap at the 2-3 most at-risk families per week. Attendance-friction data is self-reported and sparse early — label confidence explicitly.

## 3. Support Triage

**What:** Beta families email/message the founder (there is no in-app chat — COPPA fence). An agent reads the inbox, classifies (bug / library-quality complaint / billing / feature request / praise), links each to the relevant signal (a "this exercise is too hard" complaint auto-joins that exercise's swap-away rate and sim evidence), drafts a reply in the founder's voice, and files library-quality complaints straight into the gap-brief queue. Founder approves/edits every send.

**Why this product:** a library-quality complaint IS a recall signal (§4 recall ratchet) — triage that connects support to the authoring pipeline closes the loop the founder would otherwise close by hand.
**Phase fit:** Phase 1 (needs beta families + an inbox).
**Build cost:** M.
**Showcase value:** high — "support triage that files its own engineering tickets" is a flagship consulting demo.
**Risks:** drafted replies that overpromise or invent a fix; the founder reviews every send, and the agent may cite only logged facts (mirrors the coach's "clipboard not camera" discipline).

## 4. Beta-Recruitment Content Drafting

**What:** Drafts channel-appropriate recruitment content from the authentic father-son story: r/daddit post, intentional-father community pitch, church-community one-pager, waitlist landing copy. Runs the PLAN.md A/B framing ("adaptive coach" vs "AI coach") as two variants per channel. Produces the Gate 1.5 qualification funnel copy (verified email + target-family fit + 3×/week willingness).

**Why this product:** recruitment is founder-voice-critical and channel-fragmented; the wedge is a real story only the founder can vouch for, so the agent drafts and the founder authenticates — never posts autonomously.
**Phase fit:** Phase 1 (recruitment window).
**Build cost:** S.
**Showcase value:** med — competent but common; the A/B-variant discipline lifts it.
**Risks:** inauthentic voice on a story whose whole value is authenticity — founder rewrites, agent drafts scaffolding only. **Fence:** no commercial content targeting minors; all copy addresses parents.

## 5. Competitor-Recon Runs (phase-boundary ritual)

**What:** A standing ritual (docs/00 names it: "competitor teardown at every phase boundary") — at each gate transition an agent re-runs the incumbent teardown (Apple Fitness+ / Peloton / Nike / Fitbit family features) **plus the substitute map** PLAN.md §3 requires (YouTube + whiteboard, youth sports conditioning, homeschool PE, AI workout generators), flags what changed since last teardown (RollStrong/Fitly convergence is live per PLAN risks), and drafts the "does the wedge still hold / must it sharpen" memo for founder ruling.

**Why this product:** the white space is populating fast; PLAN says "speed matters more than it did in 2025." A boundary-triggered recon keeps the wedge honest without a standing founder cost.
**Phase fit:** Phase 1 boundary onward; a lightweight v1 dry-run is cheap.
**Build cost:** M (needs web research tooling — an Exa/research-swarm run).
**Showcase value:** high — "market recon that fires on my roadmap's phase gates" is a memorable ops-automation story.
**Risks:** stale or hallucinated competitor claims; require primary-source citations per finding (the research-swarm corroboration gate), and the memo is REPORTED until the founder verifies.

## 6. The Session Prep-Pack (weekly judgment queue)

**What:** The keystone. Every founder work session opens with a pre-sorted pack: (a) **what needs judgment this week**, ranked — the library review batch (§3 decision cards), gate-metric status, at-risk families, pending decisions from the decision-log; (b) **what agents did since last session** and what's awaiting approval; (c) **the one hard call** the founder should make first. It reads the roadmap's "next roadmap item," the decision-log, the gate tracker, and the pending-batch queue, and lays the 8-10 hours out as a judgment agenda.

**Why this product:** the operating model only works if the founder's scarce hours never touch garbage collection. The prep-pack is the mechanism that guarantees "founder does judgment" — it's the copilot's thesis rendered as a Monday-morning artifact.
**Phase fit:** v1 (even solo, it sequences the week); compounds through Phase 1.
**Build cost:** S → M.
**Showcase value:** high — this is the meta-showcase made concrete: the company's own operating cadence is agent-orchestrated, founder-adjudicated.
**Risks:** becoming a dashboard nobody reads — keep it a ranked queue with decisions attached, not a metrics wall.

---

## Schedule & data map (what runs on what, reading what)

| Cadence | Run | Reads | Drafts (never decides) |
|---|---|---|---|
| Weekly (Sun) | Founder Brief (#1) | Convex session logs, git library version | gap briefs, recall noms, chain-reorder proposals |
| Weekly | Retention early-warning (#2) | attendance-friction, Pact rings, teen ladder views | per-family status + parent-surface intervention |
| Per session-start | Prep-pack (#6) | roadmap, decision-log, gate tracker, pending batches | ranked judgment agenda |
| Continuous / daily | Support triage (#3) | founder inbox | classified, signal-linked reply drafts |
| Recruitment window | Content drafting (#4) | father-son story assets, channel norms | A/B post variants, funnel copy |
| Phase boundary | Competitor recon (#5) | web (cited), prior teardown | wedge-integrity memo |

**Reads, uniformly:** Convex (session/log tables), the git library repo (versions are commits — §5), the decision-log and roadmap docs. **Writes, uniformly:** nothing to production — only drafts into the founder's review queue (a PR, a markdown pack, or the batch-review page once it exists in Phase 1). The copilot shares the library pipeline's substrate: git is the audit trail, the founder is the merge gate.

**The moat, stated once:** the copilot decides nothing. It surfaces signals, attaches evidence, drafts actions, and stops. Founder judgment — which family is really drifting, whether a swap-away is mislabeling or taste, whether the wedge still holds — is the durable advantage no agent replicates. Automating the judgment away would delete the moat.

---

## Fence-compliance check (my own proposals)

- **No runtime LLM in the workout loop:** every proposal is ops-side, async, between sessions — nothing here sits between a family and a session. ✅
- **COPPA:** #2 and #3 draft only to parent surfaces; no copilot output pings a child's device; #4 targets parents; analytics stays off controller surfaces (the copilot reads session logs, not controller telemetry — consistent with PLAN's "no analytics on controller surfaces"). Retention signals about minors render only inside the founder's own ops view, not shared. ✅
- **Founder reviews everything:** #1/#3's library outputs enter the existing §3 review gauntlet; nothing merges without founder approval. ✅
- **Gates don't move:** #2 warns *toward* the numeric gates, never adjusts them. ✅
- **No new authority:** the copilot proposes; it never edits docs, CLAUDE.md, or config — consistent with agents-execute-founder-judges. ✅

**Candidate amendment: none required.** All six fit inside the fences as ops tooling.

---

## Open founder questions

1. **Brief cadence honesty** — is Sunday-night a real slot, or should the brief fold into the prep-pack (#6) so there's one weekly artifact, not two? Recommendation: **merge them** at v1 — one pack — and split only if telemetry volume at beta scale demands a dedicated brief.
2. **Alert budget** — cap retention warnings at how many families/week before it numbs you? Recommendation: **3**.
3. **Draft-voice for support** — do you want the agent drafting in your voice from day one (needs a few golden replies), or classify-only until Phase 1? Recommendation: **classify-only for the family gate; add voice at beta.**
4. **Recon trigger** — phase-boundary only, or also a lightweight monthly "did a competitor ship shared family workouts" watch (the docs/00 scenario)? Recommendation: **boundary + a cheap monthly headline scan.**
5. **Showcase carve-out** — do you want the copilot itself documented as a public consulting case study (with data anonymized), and if so, does that change what it may log? Recommendation: **yes, design the ops logs shareable-by-construction now** — it's the cheapest time to decide.
