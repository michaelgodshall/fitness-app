# Workout Experience — The Live Session

_Design doc — July 2026 (Fable session). Designs the end-to-end live session around the big-screen hypothesis (docs/02 §Platform): big screen as shared family display, phones as per-member controllers (Jackbox pattern). Status: draft for founder review. Screen specs here are input to the platform decision, not downstream of it._

---

## Design tenets for the room

Derived from the principles (docs/01) applied to a sweaty living room, viewers 6-10 feet away, kids 8-14 plus a parent:

1. **The big screen is never touched mid-workout.** All input comes from phones or (degraded mode) the display device between sets. Nobody walks to the laptop with sweaty hands mid-AMRAP.
2. **One focal element at a time.** At 6-10 ft the screen carries one huge thing (timer, count, name) plus quiet context. No dashboards. Primary numbers sized for the back of the room; body text is banned during work.
3. **Phones add, never gate.** Every session is 100% operable from the display surface alone. Controllers are an upgrade, not a dependency — this makes degradation continuous instead of modal, and makes the Phase 0 A/B (laptop-only vs. laptop+phones) free.
4. **The shared screen never shames.** Swaps render as plain exercise names (no "easier" labels), lagging loggers get a gentle pulse (never "waiting on Eli…" text), and comparisons on the shared surface are always vs. your own past, never member-vs-member. The personal lens (phone) is where individual detail lives.
5. **Shared frame, personal lens.** Big screen = what we're doing together (block, timer, everyone's live totals). Phone = what it means for me (my target, my PB distance, my swap options, my skill step).
6. **Ceremony is earned, not constant.** Daily sessions are workmanlike with 2-3 designed emotional beats (reveal, PB, close). Full ceremony treatment is reserved for Trials and Challenges — scarcity keeps it potent (principle 7).

---

## 1. The session arc on the big screen

Five screens. Total non-training overhead: under 2 minutes on both ends.

### S1 — Lobby ("who's in / how much time")

The open ritual. Someone opens the session URL on the laptop/monitor/TV (or AirPlays a tab).

- **Top:** family name + the weekly Pact ring, already part-filled ("Session 2 of 3 this week"). The week's state greets you before anyone commits — showing up advances something visible.
- **Center:** member tiles, greyed. A tile lights (member color + streak count) when that member joins from a phone, or when tapped directly on the display. Joining is the check-in; there is no separate roll call.
- **Corner:** QR code + 4-letter room code for phone join (see §2).
- **Time dial:** "How much time?" — three big presets (20 / 30 / 45) plus a nudge control. Settable from any joined phone or the display; last write wins with attribution ("Dad set 30 min"). 45 is the ceiling, always (principle 4).
- **Go:** one big "Build tonight's session" button. This tap is deliberately on the display — it's the communal trigger, and it doubles as the user gesture that unlocks audio for the rest of the session (browser autoplay policy — see §6).

### S2 — The Reveal

The plan materializes as a shared object the whole room watches — blocks slide in one at a time, ~2 seconds total (fast and real; no fake "AI thinking" theater):

> Warm-up 4' → **Block A** Push ladder 10' → **Block B** Legs + core circuit 12' → **Finisher** Family AMRAP 4'

- One coach line, why-shaped, max ~15 words: *"Heavy pull Tuesday, so tonight is push and legs. Ryan — your benchmark block is in B."*
- Strategic-repeat PB targets flag inline on their block ("⚑ beat last Tuesday: 64").
- Honest total time shown; never exceeds the dial. "Start" advances to S3.

### S3 — Block view (the workhorse)

Layout, top to bottom:

- **Block strip:** block name + the block/interval timer — the largest element on screen. Timer-driven blocks auto-advance with an audio count-in ("3-2-1"); the room trains to the screen's clock, not to whoever owns the phone.
- **Exercise focus:** current exercise name + one-line form cue (text only — no video feeds, per fence). E.g., *"Push-ups — chest to floor, elbows ~45°."*
- **Member columns:** one column per member: name/color, *this-set target* (per-member — this is the relative-loading magic made visible: Dad 15 / Max 12 / Ryan 8 on the same screen), and live logged total that ticks up as sets land from phones. When a member is inside 90% of a relevant all-time best, their column enters **PB Watch** (color shift + distance-to-best) — the room sees it coming.
- **Bottom strip:** up next (next exercise / next block) + rest indicator.

Advancement: timer blocks advance on the clock; set-based blocks advance when all members have logged or a timer floor expires (unlogged sets stay editable through the next rest — logging never blocks training). Swaps land silently: the member's column re-renders with the new exercise name and a small swap glyph, nothing more.

### S4 — Rest screen

- **Giant countdown** — the single focal element. Audio cue at 5 seconds.
- **Next-up preview** per member column (exercise + target), so everyone sets up during rest instead of after it.
- **One rotating micro-panel** (one per rest, never a feed): PB Watch callout, or the teen's skill-path spotlight ("Front lever: tuck holds — step 3 of 7"), or Pact status. This is where skills v0 gets ambient screen time in front of the 14-year-old without a dedicated ceremony.

### S5 — The Close

Sequence, 60-90 seconds, paced not rushed:

1. **Done stamp:** session complete + family totals (total reps, total work time).
2. **PBs, one at a time, full screen each:** *"MAX — 26 PUSH-UPS — all-time best, +3"* → chalk-line animation writing it into the Family Record Book. Each PB gets its own beat; two PBs = two moments.
3. **Pact ring advances** on screen. Filling the final slot (3/3) fires the week-complete moment — the family watches its streak extend together.
4. **Next-session tease**, one coach line: *"Thursday we pull. Eli's dead-hang benchmark returns."* Anticipation is built by the engine (same mechanic as the Trials taper).

Simultaneously, each phone shows the personal lens: your numbers, your PB deltas, your next skill step.

---

## 2. Phones as controllers

### Join (no accounts, no install — Phase 0)

Scan the lobby QR (or type the 4-letter code) → phone browser opens the controller → pick your member tile. Identity is **session-scoped**: the phone holds a session token mapped to a family-member profile that lives on the family's own display device/account. No login, no email, nothing persistent on the kid's phone. This keeps Phase 0 account-free, keeps the COPPA surface at zero (no child credentials, no child PII on child devices), and stays inside the spirit of the shared-family-device fence — see §6 for the fence-wording flag.

### What lives on the phone

| Surface | Big screen (shared frame) | Phone (personal lens) |
|---|---|---|
| Plan | Tonight's blocks, everyone's targets | My next target, my PB distance |
| During work | Timer, live totals, PB Watch | My log control for this set |
| Adjustments | Result only (renamed exercise) | Swap request + options |
| Between blocks | Rest countdown, next-up | My next block detail; edit my last entry |
| Close | Family moment (PBs, Pact) | My summary, my skill step |

### Logging patterns (per set type)

- **Rep sets:** at set end, phone shows a stepper **prefilled with the target** — big +/−, giant CONFIRM. Hit your target exactly = one tap. Nobody tap-counts their own push-ups.
- **Timed holds:** phone is a stopwatch a partner runs (big start/stop), or a seconds stepper for self-report. Partner-timing is deliberately social — it's the judge mechanic in miniature.
- **AMRAP / co-op pools:** chunk buttons (+1 / +5) tapped between mini-sets; running total mirrors to the big screen live. Totals stay editable until the block closes.

### Swaps

"Swap" on the phone → 2-3 options from the exercise's swap chain (easier / lateral / harder — labeled plainly *on the phone only*) → confirm → applies from the next set. The teen uses the same control to swap *up*. Private request, public result, zero shame (tenet 4).

### Parent proxy (logging for a young kid)

A parent's phone can **claim multiple tiles**. A segmented control switches the active member, and at set end the parent gets a **log strip** — one prefilled row per claimed member, one pass, done. Ritual detail: the kid does the reps, the parent dials the number, *the kid taps CONFIRM* — the moment of ownership stays with the athlete. A kid with any browser device (old iPad, iPod) can self-serve the same controller; a kid with nothing is fully served from the display in degraded mode.

### Latency and feel

- Phone shows an optimistic local echo **instantly** (<100ms).
- Big screen reflects the log at **<250ms p50, <1s p95**. The big-screen animation *is* the acknowledgment — people look up after logging, not down. This choreography (log → look up → see your number land on the wall) is the core controller feel and the number the stack must hit.
- Sync delay never blocks anything: the phone marks the entry "pending" subtly and the session proceeds. Writes are idempotent and re-orderable (set-scoped, not append-only ticks).
- Phones must not sleep mid-session (Wake Lock — §6).

---

## 3. Graceful degradation

The rule that makes this cheap: **the session is one shared state machine; displays and controllers are projections of it.** Big screen, phone controller, single tablet, and solo phone are render/input roles against the same session document — not separate builds. This is the single most important thing the experience design asks of the architecture.

### Single shared device (tablet/laptop, no phones) — must be first-class

This is the founder family's fallback, the offline path, and possibly the Phase 0 default while the controller A/B runs. Same five screens, with input affordances rendered on the display:

- Lobby: tap tiles to check members in.
- Set end: a **log strip** sheet slides up — one row per member, prefilled targets, tap-to-confirm down the line (the device passes down the line, or the parent runs it in one pass — both work; ~5 seconds per member).
- Swaps: long-press a member's column → same swap options.
- Everything else — reveal, timers, PB Watch, close — is identical. Degraded mode loses zero emotional beats; it only loses parallel input and the private personal lens.

### Solo-member mode

One person, one phone: the phone renders the display projection compressed (block + timer + own target) with logging inline. Same arc — reveal, blocks, close — with family surfaces (Pact ring, Record Book writes) intact. In Phase 0-1 this is a member training alone on the family device; in Phase 2 it is the teen companion surface, and solo sessions feed the family Pact — teen drift gets captured by the family system instead of leaving it.

### Mid-session failures (continuous, not modal)

- **Phone dies:** its tile flips to display-logged automatically; that member's sets log from the log strip. No mode switch, no restart.
- **Internet drops:** the display device owns authoritative in-flight session state; timers, logging (via log strip), PB detection, and the close all run local; writes queue and sync on reconnect. A family mid-AMRAP must never stare at a spinner. Phone controllers may degrade to display-logging during the outage — acceptable; the workout is sacred, the controllers are not.
- **Display device dies mid-session:** any joined phone can "promote" to display and resume from last synced state; local-only unsynced sets are lost at worst. Rare enough to accept.

---

## 4. Trials on the big screen (Phase 1)

Trials get the full ceremony treatment (per docs/design/trials-and-challenges.md): restrained champion dress — darker palette, deliberate pacing — athletic respect, not game-show. Runs per-test, so a split battery (2-3 sessions across Trials week) keeps the treatment per session.

Per test:

1. **Test card:** test name, universal standard, one-line form rule. Tier ladder (Rookie → Champion) drawn once with each member's current tier marked — the fixed thresholds, visibly sacred. For max-effort tests, the safety line renders plainly beneath: *"Pain ≠ fatigue. Pain = stop."*
2. **Order:** default youngest-first, parent last. Kids perform while fresh and attentive; the arc builds; and the finale is the inversion — kids officiating dad's max effort.
3. **Performer lane:** performer's name + **all-time best, huge** + tier thresholds as tick marks on a progress bar that fills live.
4. **The judge:** one designated member's phone becomes the **official counter** — giant tap target, one tap per clean rep (this is where tap-per-rep lives; the judge taps, not the athlete), or the official stopwatch for timed tests. Each tap lands on the big screen at full-screen scale with a click of audio. The count is *the judge's* — an 8-year-old's taps are the official record of dad's test. Non-judging members are the crowd; the up-next strip shows their coming turn.
5. **PB Watch → the moment:** at 90% of all-time best the lane shifts state; crossing the best fires the beat; crossing a tier line gets its own. Judge confirms the final number, performer (or parent) accepts, and **Progress Points** animate onto the family running total — the visible reminder that every member's PB pays into one family score (their progress is your points; the inclusion physics from Trials 2.0, on the wall).
6. **Battery complete:** Trials Report screen — per-member deltas, Progress Points, tier movements, one highlighted moment — then the Record Book chalking sequence. The report is the artifact (and the Phase 2 shareable).

**Co-op Challenges** reuse this grammar with one inversion: instead of one performer and a count going up, the whole roster is live against **one huge number burning down** ("THE FAMILY 500 — 347 remaining — 25:00 cap"), member chips showing who's tagged in, every logged chunk visibly slamming the pool with attribution. One effort, one number, one screen.

---

## 5. Magic moments (only possible here)

1. **The Reveal.** Tonight's session materializes on the wall in front of the whole family at once — a shared object built from *who showed up tonight*, not a plan on dad's phone that everyone else obeys. The check-in → reveal → start ritual is the product's opening handshake, every session.
2. **PB Watch.** The room knows Max is 3 reps from his all-time best *while he's still moving* — the screen shifts, everyone counts him in out loud. A phone-only app tells one person, afterward. This screen makes a PB a room event, and it costs one query and a color change.
3. **The Judged Trial.** A 9-year-old holds the official counter for his dad's max push-up test, and his taps are the record. The authority inversion is a bonding mechanic no individual-fitness product has a surface for — and it keeps young kids engaged between their own turns.
4. **The Family 500.** One shared number burning down as four different-strength people pull from the same pool — the 8-year-old's 15 squats slam the counter exactly like dad's. Shared struggle rendered as a single shared object in the room.
5. **The Chalking.** PBs and milestones get written into the Family Record Book on the biggest screen in the house, with everyone watching the same wall — the digital version of a height mark on a door frame. Milestone sessions ("100th family session") fire here, for everyone simultaneously.

---

## 6. Platform & stack constraints flagged

Inputs to the platform decision (docs/02 criteria; research swarm in flight):

1. **The big screen must be a URL.** Founder's real setup is a laptop/32" monitor — i.e., a browser. Smart-TV browsers and AirPlay/Chromecast tab-casting extend it with zero native TV app (fence intact). Consequence: **the stack must include a first-class web rendering surface** (Next.js, or Expo with genuinely production-grade web output). Any mobile-only stack is disqualified by this design.
2. **Real-time sync budget:** phone log → big screen render <250ms p50 / <1s p95, with optimistic UI and idempotent set-scoped writes. Convex's subscription model fits naturally; Supabase Realtime or a plain WebSocket layer can also hit it — but it must be a first-class criterion, not an afterthought.
3. **Offline-during-workout means local-authoritative sessions.** The display device must own in-flight session state and survive total internet loss mid-workout (§3). This challenges a purely cloud-authoritative model — whatever backend wins needs a local-first in-flight session doc (or an explicitly designed reconnect-and-replay), and it makes degraded single-device mode the natural offline fallback rather than a separate feature.
4. **Session-scoped controller identity** (QR/room-code join, no accounts on kids' phones) is both the Phase 0 no-accounts path and the long-term COPPA posture: children never hold credentials; profiles live in the parent-owned account. Design once, keep forever.
5. **Browser platform requirements:** Wake Lock API on display and controllers (no sleeping mid-session); audio unlocked via the lobby "Build session" gesture (autoplay policy); layout tested at TV distance (10-ft type scale) and on 2015-era smart-TV browsers only as a *check*, not a target — laptop/monitor is the primary display class.
6. **Fence wording tension — recommend amending.** Roadmap out-of-scope lists "multi-device sync beyond teen companion," while the live hypothesis *is* phones-as-controllers. These are compatible only if the fence is read as cross-location/multi-account sync. Recommend rewording to: *"multi-device sync beyond in-room session controllers and teen companion access."* Flagging rather than assuming.

## Phasing map

| Capability | Phase |
|---|---|
| S1-S5 arc, single shared device (log strip, swaps, PB Watch, close) | 0 |
| Phone controllers via QR join (A/B vs. laptop-only, founder family) | 0 (cheap A/B per PLAN) |
| Parent proxy / multi-tile claim | 0 (needed for the 9- and 10-year-old) |
| Rest-screen skill spotlight (teen instrumentation) | 0 |
| Trials ceremony, judge counter, Trials Report, Record Book surface | 1 |
| Co-op Challenge (Family 500 screen) | 1 |
| Teen companion solo mode feeding family Pact | 2 |
| Shareable result cards, percentile overlays | 2 |

## Open questions for the founder

1. **Judge discipline in Trials:** one official counter only (clean, simple) vs. dual-count with discrepancy resolution (more "real" officiating, more friction)? Recommend: one official counter, Phase 1.
2. **Set-based block advancement floor:** how long does the screen wait for stragglers' logs before auto-advancing (suggest: rest-length + 10s, entries stay editable)? Tune in family session zero.
3. **Reveal regeneration:** if the family hates tonight's plan, is there a one-tap "re-roll" in the lobby, or does trust in the planner mean no re-roll (recommend: no re-roll v1 — swaps are the pressure valve; a re-roll button invites plan-shopping and undermines the coach)?
