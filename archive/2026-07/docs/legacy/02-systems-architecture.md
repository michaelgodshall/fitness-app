# PHASE 2: CORE SYSTEMS ARCHITECTURE

---

## OVERVIEW

This phase defines the 7 core systems that power the MVP, how they interconnect, and the rules that govern their behavior. These systems were designed to work together seamlessly while maintaining clear separation of concerns.

**The 7 Core Systems:**

1. Workout Engine (unified flow for all workout types)
2. Team Training & Swaps (1-4 member co-training)
3. Trials System (monthly standardized testing)
4. Challenge System (earned max-effort events)
5. Pact System (weekly consistency tracking)
6. Personal Best Tracking (two-context achievement)
7. Exercise Library (content foundation)

---

## QUICK NAVIGATION

**Core Systems:**

- **[§1: Workout Engine](#1-workout-engine-unified-flow)** - Pre-Workout → Active → Review → End (4 stages)
  - Universal flow for Program, Quick, Trials, and Challenges
  - Data persistence rules and counter increments
- **[§2: Team Training & Swaps](#2-team-training--swaps)** - 1-4 member co-training with difficulty scaling
  - Team selection, swap system, per-member logging
  - Equipment-aware filtering
- **[§3: Trials System](#3-trials-system)** - Monthly standardized skill testing
  - First Mon-Sun of each month, 5 fixed tests
  - Simple Average scoring (rounded down)
- **[§4: Challenge System](#4-challenge-system)** - Earned max-effort events
  - Unlock after 6 workouts, one family attempt
  - AMRAP, For-Time, and AFRAP formats
- **[§5: Pact System](#5-pact-system)** - Weekly consistency commitment
  - Per-member customizable targets (1-5 workouts/week)
  - Streak tracking and encouraging messaging
- **[§6: Personal Best Tracking](#6-personal-best-tracking)** - Two-context achievement system
  - Trials PBs (exercise-level) vs Workout PBs (template-level)
  - No crossover between contexts
- **[§7: Exercise Library](#7-exercise-library)** - Content foundation
  - Swap relationships, equipment tagging, Trials criteria
  - 50-75 core exercises for MVP

**Integration & Data Flow:**

- **[System Integration Summary](#system-integration-summary)** - How all systems connect
  - Counter increment rules, family scoring, equipment filtering

---

## WHEN TO READ WHAT

**Implementing Workout Flows:**

- Start with §1 (Workout Engine) - understand the 4 stages
- Reference §2 (Team Training) - team selection and swaps
- Reference §6 (Personal Bests) - PB detection and display
- Reference §7 (Exercise Library) - exercise data and swaps

**Implementing Trials:**

- Read §3 (Trials System) - structure and scoring
- Reference §1.2-1.4 (Active Workout → End Screen)
- Reference §5 (Pact) - Trials count toward Pact
- Reference §6 (Personal Bests) - Trials PB context

**Implementing Challenges:**

- Read §4 (Challenge System) - unlock mechanic and formats
- Reference §1.2-1.4 (Active Workout → End Screen)
- Reference §5 (Pact) - Challenges count toward Pact
- Reference §6 (Personal Bests) - Workout PB context

**Implementing Pact/Progress Tracking:**

- Read §5 (Pact System) - structure and display
- Reference Integration Summary - what counts toward Pact
- Reference §6 (Personal Bests) - PB display on End Screen

**Understanding Data Models:**

- Each system section includes data model subsections
- Integration Summary shows how data flows between systems

---

## 1. WORKOUT ENGINE (Unified Flow)

### Design Philosophy

**ONE shared flow for all workout types** (Program, Quick, Trials, Challenges). This architectural decision dramatically reduces complexity and creates consistent UX across the entire app.

### Flow Stages

```
[Pre-Workout] → [Active Workout] → [Review & Save] → [End Screen]
```

---

### 1.1 Pre-Workout Stage

**Purpose:** Confirm participants, preview exercises, and (where allowed) select swaps before starting.

**Universal Elements (all workout types):**

- **Team Selection:** Select 1-4 family members participating (default: all selected)
- **Workout Summary:** Title, estimated duration, equipment needed (if any)
- **Safety Screen (Trials/Challenges only):** Max-effort warning with rules
- **Start CTA:** Enters Active Workout (client-side only, no persistence yet)

**Type-Specific Elements:**

**Program & Quick Workouts:**

- **Exercise Preview (full list):** Scrollable list showing all exercises
- **Per-Member Swap Selection:** Each member can adjust difficulty per exercise
  - Easier / Default / Harder (when available)
  - Visual: Swap buttons per member per exercise
  - Changes saved to session state (not persisted until Review)
- **Equipment Check (first-time Intermediate only):**

  ```
  "Intermediate programs include pull-up exercises.
  Do you have a doorway pull-up bar?
  [Yes] [No]

  You can update this anytime in Settings."
  ```

  - Stores preference: `pull_up_bar: true/false`
  - Affects exercise options in future swap selections
  - Shown once at first Intermediate start, updateable in Settings

**Trials:**

- **Fixed Exercise List:** 5 tests with names + standards
- **No Swap Selection:** Fixed workout ensures consistent tier comparison
- **Family Scoring Reminder:** "Second + Gap Bonus" rule explained
- **Safety Screen Required:** Max-effort warning

**Challenges:**

- **Fixed Workout Preview:** Movements, standards, tier table
- **No Swap Selection:** Fixed workout ensures fair tier comparison
- **One-Attempt Reminder:** "This counts as your one attempt"
- **Safety Screen Required:** Max-effort warning

**Safety Screen (Trials & Challenges):**

```
⚠️ MAX-EFFORT WORKOUT

This workout pushes your limits. Athletes know when to push and when to stop.

Rules:
• Warm up first (5+ min)
• Pain ≠ Fatigue. Pain = stop immediately.
• Form breaks down = rep doesn't count
• One attempt only

Champions train smart, not just hard.

[I'm Ready →]
```

**Performance Requirements:**

- Pre-workout screen load: **< 500ms** from tap
- Swap options pre-loaded for selected members only
- Exercise media pre-cached where available
- Works fully offline after initial download

---

### 1.2 Active Workout Stage

**Purpose:** Capture performance with minimal friction during the workout.

**Core UI Elements:**

- **Top Bar:** Workout title, elapsed time, pause/exit buttons
- **Exercise Display:** Current exercise(s) with demo thumbnail/video
- **Per-Member Input:** Reps/time/rounds counters with +1/+5/-1 buttons
- **Rest Timer:** Countdown between sets (60-90 seconds typical)
- **Progress Indicator:** Exercise X of Y, or block progress
- **Swap Button (Program/Quick only):** Mid-workout swap option per member

**Exercise Demos & Swaps UX (Decision Documented):**

- **Solution:** Inline looping video/gif demos shown throughout workflow
- **Implementation:**
  - Pre-Workout: Looping demos for all exercises (tap to expand)
  - Active Workout: Looping demo for current exercise (tap to expand)
  - Review Screen: Looping demos per exercise block (visual verification)
  - Swap Modal: Looping demos for all swap options (Easier/Default/Harder)
- **Benefits:**
  - Visual clarity without requiring taps to view
  - Helps families verify correct exercise during review
  - Kids learn proper form through repeated viewing
  - No "hidden" demos behind links
- **Performance requirement:** Swap modal must still load <150ms (demos pre-cached)
- **Fallback:** Static images if video/gif not available yet

**Block Types Supported:**

_Note: Code examples below are illustrative recommendations for AI coding agents, not prescriptive requirements. Final data model should be evaluated during architecture phase._

**Straight Sets:**

```json
{
  "block_type": "straight_sets",
  "exercises": ["push-ups"],
  "sets": 3,
  "rest_seconds": 60,
  "tracking_method": "total_reps"
}
```

User logs: Total reps across all sets (e.g., 15 + 14 + 13 = 42 total)

**Supersets:**

```json
{
  "block_type": "superset",
  "exercises": ["push-ups", "rows"],
  "rounds": 3,
  "rest_seconds": 60,
  "tracking_method": "per_exercise_totals"
}
```

User logs: Total per exercise (e.g., Push-ups: 42, Rows: 38)

**Circuits:**

```json
{
  "block_type": "circuit",
  "exercises": ["push-ups", "squats", "mountain-climbers"],
  "rounds": 4,
  "rest_seconds": 90,
  "tracking_method": "rounds_completed"
}
```

User logs: Total rounds (e.g., 4 rounds complete)

**AMRAP (As Many Rounds As Possible):**

```json
{
  "block_type": "amrap",
  "exercises": ["burpees", "squats", "push-ups"],
  "duration_seconds": 600,
  "rest_seconds": 0,
  "tracking_method": "rounds_completed"
}
```

User logs: Rounds completed in time (e.g., 8 rounds)

**For-Time (Task Completion):**

```json
{
  "block_type": "for_time",
  "exercises": ["push-ups", "squats"],
  "target_reps": { "push-ups": 100, "squats": 100 },
  "time_cap_seconds": 1800,
  "tracking_method": "completion_time"
}
```

User logs: Time to complete (e.g., 12:34) or DNF if exceeds cap

**Logging Interaction (per member):**

```
BLOCK: 3 Straight Sets - Push-ups
Previous best: 42 reps

MEMBER: Dad
Current total: 0 reps
[+1] [+5] [-1]

MEMBER: Son 1
Current total: 0 reps
[+1] [+5] [-1]

[Rest 60 sec...] (after each set)
[Next Block →] (after all sets)
```

**Button Behaviors:**

- **Tap +1:** Increment by 1
- **Hold +1:** Rapid increment (every 200ms)
- **Tap +5:** Increment by 5
- **Hold +5:** Rapid increment by 5s
- **Tap -1:** Decrement by 1 (minimum 0)
- Counter persists across sets within block
- Counter resets when advancing to next block

**Mid-Workout Swaps (Program/Quick only):**

- "Swap" button available on each exercise card
- Opens per-member modal in **< 150ms** (local state, no API)
- Same Easier/Default/Harder interface as Pre-Workout
- If no swaps exist: Button disabled with tooltip "No swaps available"
- Change takes effect immediately for that member only
- Other members' selections unchanged

**Rest Periods:**

- Countdown timer between sets (60-90 seconds typical)
- Can skip rest to proceed immediately
- Visual progress indicator
- Optional: Encouraging copy ("Great effort! Rest up.")

**Exit/Pause Handling:**

- Tap Exit → Confirmation modal:

  ```
  Leave workout?
  Your progress won't be saved.

  [Leave] [Resume]
  ```

- Exit confirmed = discard all data, no persistence
- Pause = freeze timers, preserve state, allow resume

**Performance Requirements:**

- Exercise transition: **< 200ms**
- Counter updates: Immediate visual feedback
- Swap modal: **< 150ms** load time
- All interactions work offline

---

### 1.3 Review & Save Stage

**Purpose:** Verify results before persistence. This is the ONLY point where data is saved.

**Critical Rule:**

- **NO persistence until user completes Review and taps "Save & Continue"**
- Exit before Review = workout discarded (with warning prompt)
- This is "Local Storage First" - saves to device, queues for background sync

**Review Screen UI:**

```
WORKOUT COMPLETE!

Today's Results:
• Dad: 124 total reps
• Son 1: 98 total reps

[Save & Continue →]
```

**Capabilities:**

- View all results (collapsible per block/exercise)
- Edit any recorded value (inline)
- Add optional notes (not displayed back to user in MVP)
- Results editable until saved

**Save Action:**

1. Writes to **local storage** (device)
2. Queues for **background sync** when online
3. Increments **per-member Pact counters** (+1 workout for each participant)
4. Resets **Challenge unlock counter** if Challenge completed
5. Increments **Challenge unlock counter** (+1) if non-Challenge workout
6. Computes **Personal Bests** (compare to previous)
7. Generates **End Screen** content
8. Navigates to End Screen

**Counter Increment Rules (Critical for Offline Support):**

- All counters increment **immediately after local save succeeds**
- Does NOT wait for cloud sync to complete
- Pact counters update per participating member
- Challenge unlock counter updates for family
- This ensures offline workouts count toward progress
- Background sync reconciles with server when reconnected

**Offline Behavior:**

- Save always succeeds to local storage
- Shows "Saved locally" status
- Background sync retries automatically when reconnected
- End Screen accessible immediately (even offline)
- All progress counters updated locally (Pact, Challenge unlock, streaks)

**Performance Requirements:**

- Review screen load: **< 300ms**
- Save action: **< 500ms** to local storage
- Background sync: Non-blocking, queued

---

### 1.4 End Screen Stage

**Purpose:** Celebrate results, show progress, provide closure.

**Display Priority (top to bottom):**

**1. Family Results (Trials & Challenges only):**

```
🏆 FAMILY RESULT
Advanced (Tier 4)

Dad: Elite (5)
Son 1: Skilled (3)
```

**2. Individual Results with PB Badges:**

```
DAD'S RESULTS:
• Push-ups (straight sets): 48 reps 🎉 NEW PB! (Previous: 44)
• Superset A: 80 total reps 🎉 NEW PB!
• AMRAP: 8 rounds

SON 1'S RESULTS:
• Push-ups (straight sets): 32 reps
• Superset A: 64 total reps 🎉 NEW PB!
• AMRAP: 6 rounds
```

**3. Pact Update:**

```
✅ WEEKLY PACT PROGRESS
3/3 workouts this week
Current streak: 5 weeks ⚡
```

**4. Workout Counts:**

```
📊 TEAM TRAINING
12 workouts together this month
156 total sessions all-time
```

**5. Sync Status:**

```
[✓ icon] Workout saved
```

(or "[↻ icon] Syncing..." or "[○ icon] Saved locally" with auto-retry)

**End Screen Actions:**

- **[Done]** → Returns to Home
- **[View Program]** → Goes to Workouts tab
- **[Share Results]** → Post-MVP feature

**Key Behaviors:**

- PB badges only shown for actual improvements
- Family results shown first (when applicable)
- Individual results grouped by member
- Pact update prominent (reinforces consistency goal)
- Sync status visible but not intrusive

---

### 1.5 System Integration Points

**What increments after Review Save:**

- ✅ **Pact counter** (+1 for any workout type)
- ✅ **Challenge unlock counter** (+1 for Program/Quick/Trials, not Challenges)
- ✅ **Team Sessions count** (all-time)
- ✅ **Monthly workout count**
- ✅ **Program progress** (if Program workout)

**What does NOT increment:**

- ❌ Abandoned workouts (exited before Review)
- ❌ Partial workouts (not completed)
- ❌ Workouts not saved (local storage failure)

---

_See [Quick Navigation](#quick-navigation) for related systems and [Integration Summary](#system-integration-summary) for data flow._

---

## 2. TEAM TRAINING & SWAPS

_Note: This section intentionally expands on Team Training & Swaps introduced in Section 1 (Workout Engine). Section 1 shows how these features integrate into the unified flow; Section 2 provides comprehensive specification of the team training system itself._

### Core Mechanic

Up to **4 family members** train together on one device with difficulty scaling per person.

---

### 2.1 Team Selection

**When:** Always occurs at start of workout (Pre-Workout stage)

**UI:**

```
WHO'S TRAINING TODAY?

[✓ Dad] [✓ Son 1] [✓ Son 2] [ Son 3]

Must select at least 1 to proceed.

[Continue →]
```

**Rules:**

- All members pre-selected by default
- Can deselect any member (minimum 1 required)
- Deselected members hidden from all later UI (swaps, logging, results)
- Can't change mid-workout (restart required)
- Selection saved to session, not persisted

---

### 2.2 Swap System

**Concept:** Each member can adjust exercise difficulty independently while maintaining the same workout structure.

**Swap Relationships (Exercise Library):**

```
exercise {
  id
  name
  difficulty_level: "easier" | "default" | "harder"
  easier_swap_id: string | null
  harder_swap_id: string | null
  equipment_required: "none" | "pull-up-bar"
}
```

**Example Progression:**

```
Knee Push-ups (easier) ← Standard Push-ups (default) → Decline Push-ups (harder)

easier_swap_id: "knee_pushups"
harder_swap_id: "decline_pushups"
```

**Swap Availability Logic:**

```
if (exercise.easier_swap_id === null && exercise.harder_swap_id === null) {
  // No swaps available
  disable_swap_button();
  show_tooltip("No swaps available for this exercise");
}

if (user.equipment.pull_up_bar === false && exercise.equipment_required === 'pull-up-bar') {
  // Filter out pull-up bar exercises in swap options
  show_alternative_options(); // e.g., doorway rows
}
```

**Swap Scenarios:**

1. **No Swaps:** Button disabled, tooltip shown
2. **Easier Only:** Default + Easier options
3. **Harder Only:** Default + Harder options
4. **Both:** Easier + Default + Harder options

**Equipment-Aware Filtering:**

- If `pull_up_bar: false`, exercises requiring pull-up bar are filtered from harder swap options
- Alternative exercises shown (e.g., doorway rows instead of pull-ups)
- Settings > Equipment allows updating preference anytime

---

### 2.3 Logging Per Member

**Display:**

```
MEMBER: DAD
Current total: 15 reps
[+1] [+5] [-1]

MEMBER: SON 1
Current total: 12 reps
[+1] [+5] [-1]
```

**Rules:**

- Each member has independent counter
- Counters persist across sets within block
- Totals saved per member per exercise/block
- Required: Final total before advancing to next block
- Optional: Log between sets (counter accumulates)

**Validation:**

- System checks all members have logged totals before proceeding
- If any member at 0 and block complete: "Did [Member] complete any reps? Tap to log or skip."
- Allow skipping if member stopped early (records 0)

---

### 2.4 Tracking Metrics

**Team Sessions This Week:**

- Counts toward Pact (any workout with 2+ members)
- Displayed on End Screen
- Resets every Monday

**All-Time Total:**

- Cumulative team workouts across all time
- Milestone achievements (10, 25, 50, 100 sessions)
- Displayed on End Screen and Progress tab

**Individual Completion Counts:**

- Per member per program
- Used for catch-up indicators
- Not prominently displayed (focus on team)

---

### 2.5 Performance Requirements

**Swap Modal:**

- Must load in **< 150ms** (cold start)
- Use local state, no API calls mid-workout
- Pre-load swap relationships for selected members

**Logging:**

- Counter updates: Immediate visual feedback (< 50ms)
- Large tap targets (56-64px minimum, especially during fatigue)
- High contrast (visible in bright light)
- Works with sweaty fingers

---

_See [Quick Navigation](#quick-navigation) for related systems and [Integration Summary](#system-integration-summary) for data flow._

---

## 3. TRIALS SYSTEM

### Concept

Monthly global skill testing event providing standardized assessment across all families.

---

### 3.1 Structure

**Cadence:** **First Monday through Sunday of each month**

**Format:** **5 fixed tests** (no rotation in MVP)

**Categories:** Push, Pull, Legs, Core, Endurance

**Attempts:** **One family attempt during Trials Week** (no makeups in MVP)

**Test Battery (MVP - Final Confirmation Needed):**

- **Push:** Standard Push-ups (max reps)
- **Pull:** Dead Hang (max time) OR Inverted Rows (max reps)
- **Legs:** Bodyweight Squats (max reps)
- **Core:** Plank Hold (max time)
- **Endurance:** Burpees in 3 min (max reps)

---

### 3.2 Scoring System

**Individual Tier Per Test:**
Each test has 6 tier thresholds (Rookie → Trainee → Skilled → Advanced → Elite → Champion)

**Example Tier Thresholds (Push-ups):**

```
Push-ups:
• Rookie (1): 1-10 reps
• Trainee (2): 11-20 reps
• Skilled (3): 21-35 reps
• Advanced (4): 36-50 reps
• Elite (5): 51-70 reps
• Champion (6): 71+ reps
```

**Family Scoring: Simple Average (Rounded Down)**

_Note: After evaluation, Simple Average was chosen over Second + Gap Bonus for clarity and inclusivity. Every family member contributes equally, formula is dead simple, and there's no confusion about "who counts."_

For each test category:

1. Sum all participating members' tiers
2. Divide by number of participants
3. Round down to nearest integer
4. This is the family category score (1-6)

**Example:**

```
Test: Push-ups
Dad: 55 reps = Elite (Tier 5)
Son: 32 reps = Skilled (Tier 3)

Family score = (5 + 3) / 2 = 4.0 = 4 (Advanced)
```

**Example with 3 members:**

```
Test: Squats
Dad: Tier 6
Son 1: Tier 3
Son 2: Tier 2

Family score = (6 + 3 + 2) / 3 = 3.67 = 3 (Skilled)
```

**Family Total Score:**

- Sum of all 5 category scores = **0-30 points**

**Family Rank Mapping:**

```
• Rookie: 1-6 points
• Trainee: 7-12 points
• Skilled: 13-18 points
• Advanced: 19-24 points
• Elite: 25-27 points
• Champion: 28-30 points
```

---

### 3.3 Personal Best Tracking (Trials Context)

**Trials PBs tracked per Exercise:**

- Global across all time for that specific Exercise TestID
- When same exercise returns in future months (post-MVP rotation), PB comparisons apply
- Example: "Max Push-ups: 52 reps (Previous: 48 reps)"
- Separate from Workout PBs (different context)

**Storage:**

```
personal_best {
  family_member_id: 123
  context_type: 'trial'
  exercise_test_id: 'max_pushups_2min'
  best_score: 52
  achieved_at: '2025-11-15'
}
```

---

### 3.4 User Flow

1. **Trials Week begins** (first Monday of month)
2. **Home screen** shows "Trials This Week" badge on Trials module
3. User taps **Trials module → Safety screen**
4. **Team selection** (who's participating)
5. **Trials Brief:** 5 tests shown with standards
6. **Complete 5 tests** in sequence (one after another)
7. **End screen** shows:
   - Family total score (e.g., 22/30)
   - Family rank (e.g., Elite)
   - Individual tier per test
   - PB badges where applicable
8. **Results saved**, can't retake until next month

---

### 3.5 Safety Messaging

**Displayed before starting Trials:**

```
⚠️ MAX-EFFORT WORKOUT

This workout pushes your limits. Athletes know when to push and when to stop.

Rules:
• Warm up first (5+ min)
• Pain ≠ Fatigue. Pain = stop immediately.
• Form breaks down = rep doesn't count
• One attempt only

Champions train smart, not just hard.

[I'm Ready →]
```

---

### 3.6 Data Model

```
trials_event {
  id
  month_year: "2025-11"
  start_date: "2025-11-03" (first Monday)
  end_date: "2025-11-09" (first Sunday)
  tests: [exercise_test_id array]
}

trials_result {
  id
  trials_event_id
  family_id
  participant_id
  exercise_test_id
  score: number (reps or time_seconds)
  tier: 1-6
  is_personal_best: boolean
  completed_at: timestamp
}

trials_family_scoring {
  trials_event_id
  family_id
  category_scores: {push: 4, pull: 3, legs: 5, core: 4, endurance: 3}
  total_score: 19
  family_rank: "Advanced"
}
```

---

### 3.7 Integration with Other Systems

**Pact System:**

- Trials completion **counts toward Pact** (+1 workout)

**Challenge System:**

- Trials completion **counts toward Challenge unlock** (+1 of 6 workouts)

**Program System:**

- Trials is independent, doesn't affect program progress
- Can be done on any day during Trials Week
- Families continue regular programs alongside Trials

---

_See [Quick Navigation](#quick-navigation) for related systems and [Integration Summary](#system-integration-summary) for data flow._

---

## 4. CHALLENGE SYSTEM

### Concept

High-intensity motivation spikes earned through consistency, preventing overtraining.

---

### 4.1 Unlock Mechanic

**Rule:** Challenges unlock after completing **6 workouts** from any source

**What counts toward unlock:**

- ✅ Program workouts
- ✅ Quick workouts
- ✅ Trials
- ❌ Challenge attempts (prevents farming)

**Counter behavior:**

- Increments by 1 when any qualifying workout completes
- Resets to 0 after Challenge completion
- Prominently displayed on Home screen: "4/6 workouts to unlock"
- One family attempt per unlock
- No expiration once unlocked (optional, take when ready)

**Effective cadence:**

- 3 days/week = ~2 weeks between unlocks
- 4 days/week = ~1.5 weeks between unlocks
- Prevents overtraining while maintaining motivation

**Why Unlock vs. Scheduled:**

- Prevents "farming" (repeatedly doing Challenges to boost tiers = injury risk)
- Rewards consistency regardless of workout source
- Flexible for families mixing Program/Quick workouts
- Encourages regular training to unlock next Challenge

---

### 4.2 Challenge Formats

**1. AMRAP (As Many Rounds As Possible):**

```
Example: "The Grinder"
20 minutes:
• 10 Push-ups
• 15 Squats
• 10 Mountain Climbers
• 5 Burpees

Score: Total rounds completed

Tier Thresholds:
• Rookie (1): 5-7 rounds
• Trainee (2): 8-10 rounds
• Skilled (3): 11-13 rounds
• Advanced (4): 14-16 rounds
• Elite (5): 17-19 rounds
• Champion (6): 20+ rounds
```

**2. For-Time (Task Completion with Time Cap):**

```
Example: "The 400"
Complete for time (30 min cap):
• 100 Push-ups
• 100 Squats
• 100 Mountain Climbers
• 100 Jumping Jacks

Score: Completion time (or DNF if >30 min)

Tier Thresholds:
• Rookie (1): 25-30 min or DNF
• Trainee (2): 20-24 min
• Skilled (3): 16-19 min
• Advanced (4): 13-15 min
• Elite (5): 10-12 min
• Champion (6): Under 10 min
```

**3. AFRAP (As Few Rests As Possible):**

```
Example: "No Quit"
Max push-ups to failure
Rest 2 minutes
Perform 1.5x initial number

Score: Number of knee-touches to complete

Tier Thresholds:
• Rookie (1): 8+ touches
• Trainee (2): 6-7 touches
• Skilled (3): 4-5 touches
• Advanced (4): 2-3 touches
• Elite (5): 1 touch
• Champion (6): 0 touches
```

---

### 4.3 Challenge Requirements

- **Duration:** 30-40 minutes (fits in 45-min cap with warm-up)
- **Scoring:** Clear objective (rounds/time/rests)
- **No exercise swaps allowed** (maintains fairness for PB comparisons)
- **Tier thresholds defined** per Challenge
- **Universal standards** (not age-adjusted)
- **Safety messaging** before every Challenge (same as Trials)

---

### 4.4 Scoring System

**Individual Tier:**
Each Challenge has 6 tier thresholds (Rookie → Champion)

**Family Scoring: Simple Average (Rounded Down)**
(Same as Trials - unified scoring model)

**Formula:**

1. Sum all participating members' tiers
2. Divide by number of participants
3. Round down to nearest integer
4. This is the family tier (1-6)

**Example:**

```
Challenge: "The Grinder"
Dad: 18 rounds = Elite (Tier 5)
Son 1: 12 rounds = Skilled (Tier 3)
Son 2: 9 rounds = Trainee (Tier 2)

Family Tier = (5 + 3 + 2) / 3 = 3.33 = 3 (Skilled)
```

---

### 4.5 Personal Best Tracking (Challenge Context)

**Challenge PBs tracked per challenge_id:**

- When same Challenge repeats, compare to previous performance
- Example: "The Grinder: 14 rounds (Previous: 12 rounds) - New PB!"
- Part of Workout PB context (not Trials context)

**Storage:**

```
personal_best {
  family_member_id: 123
  context_type: 'workout'
  challenge_id: 'the_grinder_20m_amrap'
  best_score: 14
  achieved_at: '2025-11-20'
}
```

---

### 4.6 User Flow

1. Home screen shows **"Challenge Unlocked!"** or **"4/6 workouts to unlock"**
2. When unlocked, tap → **Safety screen**
3. **Team selection**
4. **Challenge Preview:** Movements, standards, tier table, one-attempt reminder
5. **Challenge workout** (no pre-workout swap screen)
6. **End screen:**
   - Family Tier achieved
   - Individual tiers
   - Family average
   - PB badge if applicable
7. **Counter resets** to 0/6 for next unlock

---

### 4.7 Data Model

```
challenge {
  id
  name
  description
  format: "amrap" | "for_time" | "afrap"
  tier_thresholds: {rookie: X, trainee: Y, ...}
  exercises: [array]
  no_swaps: true
}

challenge_result {
  id
  challenge_id
  family_id
  participant_id
  score: number (rounds/time/rests)
  tier: 1-6
  is_personal_best: boolean
  completed_at: timestamp
}

challenge_unlock_progress {
  family_id
  workouts_completed: 0-6
  last_updated: timestamp
}
```

---

### 4.8 Integration with Other Systems

**Pact System:**

- Challenge completion **counts toward Pact** (+1 workout)

**Trials System:**

- Independent systems
- Both can be available simultaneously
- No conflict

**Program System:**

- Challenges don't affect program progress
- Can be done on any day after unlock
- Families continue regular programs alongside Challenges

---

_See [Quick Navigation](#quick-navigation) for related systems and [Integration Summary](#system-integration-summary) for data flow._

---

## 5. PACT SYSTEM

### Concept

Weekly consistency commitment with streak tracking, encouraging sustainable habits. **Each family member has their own Pact commitment**, customizable based on their program and preferences.

---

### 5.1 Structure

**Target:** **Per-member, customizable** (default suggested by program selection)

**Pact Commitment Range:** **1-5 workouts/week per member**

- Enforced in UI dropdown (prevents unrealistic commitments)
- Encourages realistic, sustainable targets
- 3-4 workouts/week is the sweet spot for most families
- Range allows flexibility for different schedules and ages

**Pact Customization Flow (MVP):**

1. **During Program Selection:** User prompted to set Pact commitment
   - Default: Recommended weekly cadence for selected program
   - Foundation: 3 workouts/week (default)
   - Intermediate: 4 workouts/week (default)
   - User can adjust up or down per member (1-5 range)
2. **In Settings:** Pact commitment adjustable anytime
   - Navigate to Settings > Pact Commitment
   - Adjust per family member (1-5 dropdown)
   - Changes take effect next Monday (week boundary)

**Per-Member Pact Commitments:**

- Each family member has individual target (e.g., Dad: 4/week, Son 1: 3/week, Son 2: 2/week)
- Pact completion **does NOT require training together** (solo or team workouts both count)
- Family Pact = sum of all individual Pact requirements
- Individual progress tracked separately, aggregated for display

**What counts:**

- ✅ Program workouts (solo or team)
- ✅ Quick workouts (solo or team)
- ✅ Trials
- ✅ Challenges
- ❌ Partial/abandoned workouts (not saved)

**Reset:** Every Monday at midnight (per member and family aggregate)

**Streak:** Consecutive weeks hitting Pact target (family-level: all members meet their individual targets)

---

### 5.2 Display

**Home Screen Module (Family Pact Prominent):**

```
[📅 icon] WEEKLY PACT
Family: 7/9 workouts complete
Current streak: 4 weeks [⚡ icon]

[Tap to expand individual progress ↓]

[View History →]
```

**Expanded View (Individual Per-Member Progress):**

```
[📅 icon] WEEKLY PACT
Family: 7/9 workouts complete
Current streak: 4 weeks [⚡ icon]

Dad: 3/4 complete [progress bar]
Son 1: 2/3 complete [progress bar]
Son 2: 2/2 complete [✓ icon]

[View History →]
```

**States:**

- **On track** (≥ target pace): "7/9 workouts complete. {days_left} days left in week."
- **Behind pace**: "7/9 workouts complete. 2 more workouts to stay on track."
- **Complete**: "[✓ icon] Pact complete! 4-week streak [🔥 icon]"

**Visual Design:**

- Family Pact progress bar (prominent, primary)
- **Streak displayed prominently** next to family progress (not buried)
- Individual member progress shown smaller underneath (tap/click to expand)
- Icons used throughout (no emojis in final UI)
- Mini calendar showing completed days (M Tu W Th F Sa Su) in expanded view

---

### 5.3 Messaging Tone

**Encouraging (not punishing):**

- ✅ "Great consistency! 2/3 this week."
- ✅ "Pact complete! Keep the streak alive."
- ✅ "One more workout to keep your streak!"
- ✅ "Start a new streak this week!"

**Never say:**

- ❌ "Failed to meet Pact"
- ❌ "Streak broken"
- ❌ "You missed your goal"

---

### 5.4 Streak Logic

**Increment:**

- When Pact target reached (3/3 workouts)
- At week boundary (Monday 00:00)
- Example: Complete 3 workouts by Sunday → Streak increments Monday

**Reset:**

- When week ends without hitting target
- No punishment messaging
- Just start fresh: "Week 1" instead of highlighting "Streak: 0"

**Display:**

- Show current streak: "4 weeks ⚡"
- Celebrate milestones: 4 weeks, 8 weeks, 12 weeks, etc.
- Post-MVP: Badge achievements for long streaks

---

### 5.5 History View

**Expanded Pact History:**

```
WEEKLY PACT HISTORY

━━━ THIS WEEK ━━━
Monday: Rest day
Tuesday: ✅ Foundation W2D1
Wednesday: Rest day
Thursday: ✅ Quick Workout
Friday: Rest day
Saturday: ☐ (today)
Sunday: ☐

2/3 workouts complete
Current streak: 4 weeks

━━━ LAST 8 WEEKS ━━━
Week of Oct 7:  ✅ 3/3 (streak: 4)
Week of Sep 30: ✅ 4/3 (streak: 3)
Week of Sep 23: ✅ 3/3 (streak: 2)
Week of Sep 16: ✅ 3/3 (streak: 1)
Week of Sep 9:  ❌ 2/3 (streak: 0)
...

[View Full History →]
```

---

### 5.6 Integration with Other Systems

**All Workout Types:**

- Any completed workout increments Pact counter
- Unified system (no separate tracking per type)

**Trials & Challenges:**

- Both count toward Pact (no special treatment)
- Encourages participation in all workout types

**Program Progress:**

- Pact is separate from program progress
- Pact = consistency goal
- Program = structured progression goal
- Both matter, both shown, separate concerns

---

### 5.7 Data Model

```
pact_progress {
  family_id
  week_start_date: "2025-11-03" (Monday)
  workouts_completed: 0-3+
  target: 3 (default)
  streak_weeks: 4
}
```

---

_See [Quick Navigation](#quick-navigation) for related systems and [Integration Summary](#system-integration-summary) for data flow._

---

## 6. PERSONAL BEST TRACKING

### Concept

Two-context PB system: Trials (exercise-level) and Workouts (template-level).

---

### 6.1 Two Contexts

**Context 1: Trials PBs**

- **Tracked at:** Exercise level (Exercise TestID)
- **Updated when:** Completing Trials workout
- **Compared to:** Global all-time best for that exercise
- **Display:** "Max Push-ups: 52 reps (Previous: 48 reps)"
- **Persistence:** When same exercise returns in future Trials (post-MVP rotation)

**Context 2: Workout PBs**

- **Tracked at:** Workout template + block level
- **Updated when:** Same workout repeats (Program/Quick/Challenge)
- **Compared to:** Previous performance on same workout template
- **Display:** "Foundation W2D1 - Push-ups: 48 reps (Previous: 44 reps)"
- **Persistence:** When same workout template repeats

---

### 6.2 No Crossover

**Key Principle:** Trials PBs and Workout PBs are separate

**Why:**

- Trials = max capability on standard tests (global benchmark)
- Workouts = beating previous performance on specific workout structure
- Different contexts, different motivations
- Clear mental model prevents confusion

**Example:**

- User does 50 push-ups in Program workout → New Workout PB ✓
- User does 45 push-ups in Trials → Not new Trials PB (previous was 52)
- Both PBs tracked separately, no conflict

---

### 6.3 PB Detection Flow

**Workflow:**

1. Workout starts
2. System checks: "Has this workout/exercise been done before?"
3. If yes: Retrieve previous performance from `personal_best` table
4. Display on Pre-Workout screen: "Previous best: X"
5. During Active Workout: Show target for reference (optional)
6. Workout completes → Review stage
7. Compare new performance to previous
8. If improvement: Create new PB entry, show badge on End Screen
9. If not: No badge, show previous best for reference

---

### 6.4 Storage

**Trials PBs:**

```
personal_best {
  family_member_id: 123
  context_type: 'trial'
  exercise_test_id: 'max_pushups_2min'
  best_score: 52
  achieved_at: '2025-11-15'
}
```

**Workout PBs:**

```
personal_best {
  family_member_id: 123
  context_type: 'workout'
  workout_template_id: 'foundation_w2d1'
  block_identifier: 'straight_sets_pushups'
  best_score: 48
  achieved_at: '2025-11-18'
}
```

---

### 6.5 Display on End Screen

**Example End Screen:**

```
DAD'S RESULTS:
• Push-ups (straight sets): 48 reps 🎉 NEW PB! (Previous: 44)
• Superset A: 80 total reps 🎉 NEW PB! (Previous: 76)
• AMRAP: 8 rounds

SON 1'S RESULTS:
• Push-ups (straight sets): 32 reps
• Superset A: 64 total reps 🎉 NEW PB! (Previous: 60)
• AMRAP: 6 rounds
```

**PB Badge:**

- Icon (medal/badge/star) + "NEW PB!" text
- Only shown when actual improvement
- Previous score shown in parentheses for context
- Design system: Use consistent icon style throughout app, no emojis

---

_See [Quick Navigation](#quick-navigation) for related systems and [Integration Summary](#system-integration-summary) for data flow._

---

## 7. EXERCISE LIBRARY

### Concept

Content foundation enabling all workouts, swaps, and Trials.

---

### 7.1 Required Attributes

**Minimum Viable Exercise Entry:**

```json
{
  "id": "standard-pushups",
  "name": "Standard Push-ups",
  "difficulty_level": "default",
  "easier_swap_id": "knee-pushups",
  "harder_swap_id": "decline-pushups",
  "equipment_required": "none",
  "primary_category": "push",
  "metric_types_supported": ["reps"],
  "suitable_for_trials": true,
  "video_url": "https://...",
  "form_cues": [
    "Hands shoulder-width apart",
    "Body in straight line",
    "Lower until chest nearly touches ground",
    "Push back to start position"
  ],
  "safety_notes": "Stop if you feel shoulder pain. Keep core engaged."
}
```

---

### 7.2 Swap Relationships

**Rules:**

- Maximum ONE `easier_swap_id` and ONE `harder_swap_id` per exercise
- Not all exercises have swaps (many have null values)
- Swaps must maintain same movement pattern (push-up → push-up variation)
- Equipment-aware (filter based on user's `pull_up_bar` setting)

**Example Progressions:**

```
Push-ups:
Wall Push-ups → Incline Push-ups → Knee Push-ups →
Standard Push-ups → Decline Push-ups → Pike Push-ups →
Handstand Push-ups

Pull-ups:
Table Rows → Doorway Rows → Inverted Rows (bar) →
Assisted Pull-ups → Standard Pull-ups → Weighted Pull-ups
```

---

### 7.3 Equipment Tagging

**Values:**

- `none` - No equipment (Foundation programs)
- `pull-up-bar` - Requires pull-up bar (Intermediate/Advanced)

**Filtering Logic:**

```
if (user.equipment.pull_up_bar === false) {
  filter_out_exercises(equipment_required: 'pull-up-bar')
  show_alternatives(primary_category: matching_category, equipment_required: 'none')
}
```

---

### 7.4 Trials Exercise Criteria

**Must Have:**

- Single clear metric (reps OR time, not both)
- Standardized form (can be judged consistently)
- Safe for max effort
- Representative of category
- Reasonable duration (<10 minutes per test)

**Good for Trials:**

- ✅ Max push-ups
- ✅ Max pull-ups
- ✅ Max plank hold
- ✅ Max squats

**Bad for Trials:**

- ❌ Complex circuits
- ❌ Skill movements requiring extensive setup
- ❌ Exercises with ambiguous completion criteria

---

### 7.5 Content Needs (Per Exercise)

**1. Video Demonstration (10-15 seconds):**

- Shows full range of motion
- Clear form from multiple angles (front/side)
- Demonstrates common mistakes to avoid
- MVP: Stock footage or simple recordings acceptable

**2. Form Cues (3-5 bullet points):**

- Key body positioning
- Movement execution steps
- Breathing pattern
- Common form checks

**3. Safety Notes:**

- When to stop (pain vs. fatigue)
- Injury prevention cues
- Contraindications (if any)

**4. Primary Muscle Groups:**

- Main muscles worked
- Secondary muscles engaged

**5. Difficulty Indicators:**

- Beginner/Intermediate/Advanced level

---

### 7.6 MVP Exercise Count

**Target:** 50-75 core exercises

**Focus:**

- Exercises used in Foundation + 1 Intermediate program
- Cover all 6 movement patterns (horizontal/vertical push/pull, legs, core)
- Add more post-launch based on program needs

**Strategy:**

- Start with 50 exercises (lean MVP)
- Can expand to 75 during development if capacity allows
- Use AI-generated form cues as starting point
- Use smartphone recordings for video initially

---

_See [Quick Navigation](#quick-navigation) for related systems and [Integration Summary](#system-integration-summary) for data flow._

---

## SYSTEM INTEGRATION SUMMARY

### How Systems Work Together

**Pact System:**

- Increments from: Program, Quick, Trials, Challenges
- Counter resets: Every Monday
- Streak increments: When target hit
- Display: Always shows current week + streak

**Challenge Unlock:**

- Increments from: Program, Quick, Trials (not Challenges)
- Threshold: 6 workouts = 1 unlock
- Resets: After Challenge completion
- Tracking: Global counter on Home

**PB Tracking:**

- Context 1 (Trials): Exercise-level, global
- Context 2 (Workouts): Template-level, repeat comparison
- No crossover between contexts

**Family Scoring:**

- Applies to: Trials and Challenges only
- Formula: Simple Average (rounded down) - unified rule for both
- Display: Family result first, then individual
- Every member contributes equally

**Equipment Filtering:**

- Affects: Swap selection, Quick Workout visibility
- Setting: `pull_up_bar: true/false`
- Updated: Settings anytime, checked before Intermediate start

---

**End of Phase 2**

---

## CHECKPOINT QUESTIONS FOR REVIEW

1. **Unified Workout Flow:** Does the Pre-Workout → Active → Review → End Screen flow make sense? Clear separation of concerns?

2. **Team Training & Swaps:** Is the swap system clear? Equipment filtering logical? Per-member logging intuitive?

3. **Trials System:** Structure clear? Simple Average (rounded down) scoring finalized and documented. Should Trials count toward Challenge unlock? (Decision: YES, Trials count toward unlock)

4. **Challenge System:** Unlock mechanic (6 workouts) clear? Simple Average (rounded down) scoring consistent with Trials for unified family scoring model.

5. **Pact System:** 3 workouts/week target appropriate? Should Trials count toward Pact? (I believe YES based on mvp-spec)

6. **Personal Best Tracking:** Two-context approach clear? No confusion between Trials PBs and Workout PBs?

7. **Exercise Library:** 50-75 exercises enough for MVP? Required attributes complete?

8. **System Integration:** How systems work together clear? Any conflicts or unclear dependencies?

9. **Overall:** Anything missing, unclear, or misaligned with your vision?
