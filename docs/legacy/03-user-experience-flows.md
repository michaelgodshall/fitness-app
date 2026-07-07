# PHASE 3: USER EXPERIENCE FLOWS

---

## OVERVIEW

This phase defines the complete user journey from first launch through daily use. It covers onboarding, navigation structure, and detailed flows for every major interaction pattern.

**Key Principles:**

- **Minimize friction** - Remove barriers between intention and action
- **Offline-first** - Every interaction works without network
- **One device, multiple members** - Clear member selection at decision points
- **Progressive disclosure** - Show what's needed when it's needed
- **Celebrate progress** - Positive reinforcement throughout

---

## 1. ONBOARDING FLOW

### Design Philosophy

Get families training as fast as possible. Collect only what's essential to start first workout.

---

### 1.1 First Launch Flow

**Goal:** Complete in < 2 minutes, start first workout immediately after.

```
[App Launch]
    ↓
[Welcome Screen]
    ↓
[Create Account / Sign In]
    ↓
[Family Setup]
    ↓
[Equipment Check]
    ↓
[Program Selection]
    ↓
[Pact Commitment Setup]
    ↓
[Home Screen] → Ready to train
```

---

### 1.2 Welcome Screen

**Purpose:** Set expectations, communicate value proposition.

```
━━━━━━━━━━━━━━━━━━━━━━━
TRAIN TOGETHER.
BUILD CHAMPIONS.

Father-son athletic training
designed for your team.

[Get Started →]

Already have an account? [Sign In]
━━━━━━━━━━━━━━━━━━━━━━━
```

**Single screen, no carousel.**

- Value proposition clear immediately
- One primary CTA
- Quick access to sign in

**Alternative Value Propositions Considered:**

- "Build Strength. Build Character. Build Together."
- "Athletic Training for Fathers and Sons."
- "Real Training. Real Results. Together."
- "Where Champions Are Built, Not Born."

**Chosen:** "Train Together. Build Champions." - Short, aspirational, emphasizes both teamwork and outcome.

---

### 1.3 Account Creation

**Required Fields:**

- First Name
- Last Name
- Email address
- Password
- Agree to Terms & Privacy (checkbox)

**Why collect name:** Free trial model requires name for account management. Last name used to suggest team name in Family Setup.

**Screen:**

```
CREATE ACCOUNT

First Name: [____________]
Last Name: [____________]
Email: [____________]
Password: [____________]

[ ] I agree to Terms & Privacy Policy

[Create Account →]

[← Back]
```

**Validation:**

- Email format check
- Password: 8+ characters minimum
- Inline error messages
- "Create Account" submits if valid

**Backend:**

- Creates family account (1 family per account for MVP)
- Generates family_id
- Stores first_name, last_name for account owner
- Proceeds to Family Setup immediately after creation

---

### 1.4 Family Setup

**Purpose:** Create team identity and add family members who will train together.

**Step 1: Team Name**

```
WHAT'S YOUR TEAM NAME?

Team name: [Team Godshall]
           (How you'll be known in the app)

[Continue →]

[← Back]
```

**Rules:**

- Pre-populated with "Team [LastName]" from account creation
- Fully editable
- Example suggestions shown in placeholder if empty: "Team Smith, Smith Crew, The Champions"

---

**Step 2: Member 1 Setup (Account Owner)**

```
MEMBER 1 (YOU)

What do you want to be called in the app?

Name: [____________]
      (e.g., Dad, Mom, Coach, Papa, Uncle)

Choose your color & icon:

COLORS:
[○Red] [○Blue] [○Green] [○Orange]
[○Purple] [○Yellow] [○Teal] [○Navy]

ICONS:
[Shield] [Star] [Flame] [Lightning] [Heart] [Mountain]
[Fist] [Trophy] [Target] [Rocket] [Bolt] [Crown]

Selected: [Blue circle with Shield icon]

[Continue →]

[← Back]
```

**Rules:**

- Name required
- Question focuses on family context ("What do you want to be called?")
- Placeholder examples guide without assuming gender/role
- Color + Icon required (one each)
- Selected preview shown at bottom

---

**Step 3: Additional Members (Optional)**

```
WHO ELSE IS ON YOUR TEAM?

Add 1-3 more members (optional)

MEMBER 2
First Name: [____________]
Type: [Adult ▼] [Child ▼]

{If "Child" selected, shows immediately:}
[ ] I am the parent/guardian and give consent
    for this child (under 13) to use the app.

Choose color & icon:
[Color palette] [Icon grid]
Selected: [Green circle with Star icon]

[+ Add Another Member]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Continue →]  [Skip - Train Solo]

[← Back]
```

**Rules:**

- Minimum 1 member total (Member 1)
- Maximum 4 members total for MVP
- First name required for each additional member (last name only collected for account owner in signup)
- Type selector: Adult (default) or Child
- **COPPA Compliance:** If "Child" selected, parental consent checkbox required
- Each member must have unique color + icon combination
- Already-selected colors/icons grayed out
- "Skip - Train Solo" proceeds with just Member 1

**Validation:**

- All first names must be unique within family
- Each member must select color + icon
- No duplicate color+icon combinations
- If member type = "Child", parental consent checkbox must be checked
- Continue enabled once all selected members have complete info

---

**Data Captured:**

```json
{
  "family_id": "uuid",
  "team_name": "Team Godshall",
  "members": [
    {
      "display_name": "Dad",
      "type": "adult",
      "color": "blue",
      "icon": "shield",
      "is_account_owner": true
    },
    {
      "display_name": "Dylan",
      "type": "child",
      "parental_consent": true,
      "color": "green",
      "icon": "star",
      "is_account_owner": false
    },
    {
      "display_name": "Ryan",
      "type": "child",
      "parental_consent": true,
      "color": "orange",
      "icon": "flame",
      "is_account_owner": false
    }
  ]
}
```

**COPPA Compliance Note:**

- Members marked as "Child" (under 13) require explicit parental consent
- Consent tracked per child member in database
- Account owner (Member 1) is responsible party for all consents

**Color Palette (8 colors):**

- Red, Blue, Green, Orange, Purple, Yellow, Teal, Grey
- Must be compatible with Shadcn's semantic color system

**Icon Library (12 icons):**

- Shield, Star, Flame, Lightning, Swords, Mountain, Fist, Anvil, Target, Rocket, Feather, Activity

**All fields editable later in Settings:**

- Team name
- Member display names
- Member types (Adult/Child) + consent
- Member colors & icons
- Add/remove members (up to 4 total)

---

### 1.5 Equipment Check

**Purpose:** Determine if family has pull-up bar for Intermediate programs.

**When Shown:**

- Always during onboarding (even if starting Foundation)
- Determines future program availability
- Can be updated later in Settings

**Screen:**

```
EQUIPMENT CHECK

Do you have a doorway pull-up bar?

Intermediate programs include pull-up exercises.
No bar? No problem - we'll show alternatives.

[Yes, I have one] [No, I don't]

You can update this anytime in Settings.

[← Back]
```

**Behavior:**

- Selection saves to `family.equipment.pull_up_bar: true/false`
- Affects exercise swap options in all future workouts
- Affects which programs are recommended (but doesn't block access)
- "No" shows alternative exercises (e.g., doorway rows instead of pull-ups)

---

### 1.6 Program Selection

**Purpose:** Choose starting training program.

**Screen:**

```
CHOOSE YOUR PROGRAM

FOUNDATION (Recommended for most)
Bodyweight only • 3x/week • 30-40 min
Perfect for: Building base strength, no equipment needed

[Select Foundation →]

INTERMEDIATE
Includes pull-ups • 4x/week • 35-45 min
Perfect for: Families with training experience
{Requires pull-up bar or alternatives available}

[Select Intermediate →]

[← Back]
```

**Logic:**

- Foundation recommended by default (highlighted)
- Intermediate available regardless of equipment setting
- If `pull_up_bar: false`, show note about alternatives
- Selection determines default Pact commitment in next step

**Data:**

```json
{
  "family_id": "uuid",
  "program_id": "foundation-8wk-v1",
  "started_at": "2025-10-11"
}
```

---

### 1.7 Pact Commitment Setup

**Purpose:** Set per-member weekly workout targets.

**Screen:**

```
SET YOUR WEEKLY PACT

Your Pact is your weekly training commitment.
Consistency builds champions—not perfection.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Recommended for Foundation: 3 workouts/week
Most families see best results training 3-4 days/week.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dad (Michael): [3 ▼] workouts/week
Son 1 (Dylan): [3 ▼] workouts/week
Son 2 (Ryan): [2 ▼] workouts/week

Family Total: 8 workouts/week

You can adjust this anytime in Settings.

[Start Training →]

[← Back]
```

**Rules:**

- Default per program recommendation (Foundation: 3, Intermediate: 4)
- Dropdown range: **1-5 workouts/week** per member
  - Encourages realistic targets (3-4 is sweet spot)
  - Prevents burnout from overly ambitious commitments
- Family Total = sum of all member commitments
- Different members can have different targets
- Adjustable later in Settings

**Education:**

- Explains what "Pact" means (weekly commitment)
- Sets expectation: consistency over perfection
- Shows program recommendation prominently
- Guides toward 3-4 days/week for optimal results

**Data:**

```json
{
  "family_id": "uuid",
  "pact_commitments": [
    { "member_id": "uuid1", "target_workouts_per_week": 3 },
    { "member_id": "uuid2", "target_workouts_per_week": 3 },
    { "member_id": "uuid3", "target_workouts_per_week": 2 }
  ]
}
```

**After Submission:**

- Navigates to Home Screen
- Today's Workout already visible (first workout of program)
- User ready to start training immediately

---

### 1.8 Onboarding Complete State

**What's set up:**

- ✅ Account created
- ✅ Family members added (1-4)
- ✅ Equipment preferences saved
- ✅ Program selected and activated
- ✅ Pact commitments configured
- ✅ First workout ready on Home Screen

**What's NOT required yet:**

- Profile photos
- Detailed measurements
- Goal setting
- Social connections

**Time to Complete:** < 2 minutes

---

## 2. HOME SCREEN & NAVIGATION

### Design Philosophy

The Home Screen is mission control. It answers three questions instantly:

1. **What should I do today?** (Today's Workout)
2. **Am I on track?** (Pact + Progress)
3. **What's available now?** (Trials, Challenges, Milestones)

---

### 2.1 Home Screen Hierarchy

**Responsive Navigation:**

- **Mobile/narrow (< 768px):** Bottom tab navigation
- **Desktop/wide (≥ 768px):** Left sidebar navigation
- All content optimized for both mobile and desktop use

**Priority Order (Top to Bottom):**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[🛡️ Blue Shield] TEAM GODSHALL
[Dad 🛡️] [Dylan ⭐] [Ryan 🔥]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. TODAY'S WORKOUT (Primary CTA)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Foundation - Week 2, Day 1
Push Focus • 35 min • Bodyweight

[Start Workout →]

Short on time? [Quick Workout →]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. WEEKLY PACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[📅 icon] WEEKLY PACT
Family: 5/8 workouts complete
Current streak: 3 weeks [⚡ icon]

[Tap to expand ↓]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. TRIALS (always shown, adaptive states)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[🏆 icon] TRIALS THIS WEEK
Monthly skill testing • 40 min
Ends in 3 days

[Start Trials →]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OR (when inactive)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[🏆 icon] NEXT TRIALS
Nov 3-9, 2025
[⏱️ Countdown: 12 days]

[View Last Results →]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OR (when completed)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[🏆 icon] TRIALS COMPLETE!
Family: Advanced (22/30)

Next Trials: Nov 3-9

[View Results →]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{Conditional: When catch-up available}
4. TEAM TRAINING OPPORTUNITIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 WORKOUTS WHERE MEMBERS CAN IMPROVE

W2D3 - Legs: Dylan (first attempt) • Dad (beat your best)
W2D1 - Push: Ryan (first attempt)
W1D2 - Pull: Dylan (first attempt) • Dad (beat your best)

[Tap any workout to start]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. CHALLENGE (status indicator)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[🎯 icon] CHALLENGE PROGRESS
4/6 workouts to unlock
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OR (when unlocked)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[🎯 icon] CHALLENGE UNLOCKED!
"The Grinder" • 20 min AMRAP

[Start Challenge →]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. RECENT ACTIVITY (5 most recent)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Yesterday: Foundation W2D1 (Dad, Dylan)
Oct 10: Quick Workout (Dad, Dylan, Ryan)
Oct 8: Foundation W1D3 (Dad, Dylan)
Oct 6: Foundation W1D2 (Dylan, Ryan)
Oct 4: Quick Workout (Dad, Ryan)

[View All →]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Bottom Tab Navigation - Mobile Only]
[Home] [Workouts] [Progress] [Settings]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Left Sidebar Navigation - Desktop/Wide Screens]
[Home] [Workouts] [Progress] [Settings]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Navigation Changes:**

- **Removed:** Notifications icon (post-MVP feature)
- **Removed:** Profile tab (redundant with Settings)
- **Updated:** 4-tab navigation (Home, Workouts, Progress, Settings)
- **Settings:** Included in main navigation on both mobile and desktop
- **Team Identity:** Team name + member icons shown at top of Home and Workouts screens
- **Desktop:** Left sidebar replaces bottom tabs on wide screens (≥ 768px)

---

### 2.2 Today's Workout Module (Adaptive)

**Purpose:** Always show the next logical workout.

**State 1: Program Workout Available**

```
TODAY'S WORKOUT

Foundation - Week 2, Day 1
Push Focus • 35 min • Bodyweight

Exercises: Push-ups, Squats, Plank, Mountain Climbers

[Start Workout →]
```

**State 2: Program Complete**

```
🎉 PROGRAM COMPLETE!

Foundation (8 weeks)
Completed: Oct 11, 2025

You've built an incredible foundation together.
Ready for the next challenge?

[View Progress →]  [Choose Next Program →]
```

**State 3: Catch-Up Available**

```
TODAY'S WORKOUT

Foundation - Week 1, Day 3
Dylan can catch up on this workout

Pull Focus • 35 min • Bodyweight

Exercises: Rows, Dead Hang, Squats

[Start Workout →]
```

- Today's Workout = next workout NOT completed by ANY member
- If Dad completed W2D3 but Dylan hasn't, W2D3 is shown
- Call out WHO needs to catch up (encouraging, coach-like tone)
- No "behind schedule" language (no schedule enforcement)
- No "Skip to Current Week" option (programs aren't time-bound)

**State 5: No Active Program**

```
READY TO START?

No active program selected.

[Browse Programs →]  [Quick Workout →]
```

---

### 2.3 Weekly Pact Module (Expanded State)

**Collapsed (Default):**

```
[📅 icon] WEEKLY PACT
Family: 5/8 workouts complete
Current streak: 3 weeks [⚡ icon]

[Tap to expand ↓]
```

**Expanded (After Tap):**

```
[📅 icon] WEEKLY PACT
Family: 5/8 workouts complete
Current streak: 3 weeks [⚡ icon]

Dad (Michael): 2/3 complete [██░]
Son 1 (Dylan): 2/3 complete [██░]
Son 2 (Ryan): 1/2 complete [█░]

━━━ THIS WEEK ━━━
Mon: (no workouts)
Tue: ✅ Foundation W2D1 (Dad, Dylan)
Wed: (no workouts)
Thu: ✅ Quick Workout (Dad, Ryan)
Fri: ✅ Foundation W2D2 (Dylan, Ryan)
Sat: ☐ (today)
Sun: ☐

[Tap to collapse ↑]
```

**Interaction:**

- Tap module → Expands in-place
- Shows per-member progress bars
- Shows this week's calendar (Mon-Sun current week only for MVP)
- Days without workouts shown as "(no workouts)" not "Rest day" (no scheduled rest days)
- Tap again → Collapses back to summary
- **Full history removed for MVP** - just show current week

**Purpose vs Recent Activity:**

- **Pact Expanded:** Focused on weekly commitment tracking, per-member progress toward targets
- **Recent Activity:** Last 5 completed workouts across all time, shows what family did together
- Different purposes: Pact = commitment/consistency, Recent = activity log

---

### 2.4 Trials Module (Always Shown)

**Display Strategy:** Always shown on Home Screen with adaptive states, positioned BEFORE Challenge module (higher priority).

**State 1: Active (Trials Week - Before Completion)**

```
[🏆 icon] TRIALS THIS WEEK
Monthly skill testing • 40 min
Ends in 3 days

5 tests: Push, Pull, Legs, Core, Endurance

[Start Trials →]
```

**State 2: Active (Trials Week - After Completion)**

```
[🏆 icon] TRIALS COMPLETE!
Family Rank: Advanced (22/30)

Dad: Elite (26/30)
Dylan: Skilled (18/30)

[View Results →]

Next Trials: Nov 3-9
```

**State 3: Inactive (Outside Trials Week)**

```
[🏆 icon] NEXT TRIALS
Nov 3-9, 2025
[⏱️ Countdown: 12 days]

[View Last Results →]
```

**Rationale:**

- Keeps Trials top-of-mind year-round
- Countdown creates anticipation
- Always discoverable, no need to dig through tabs
- Clean state transitions communicate progress

---

### 2.5 Challenge Module (Always Shown)

**State 1: Progress Toward Unlock**

```
[🎯 icon] CHALLENGE PROGRESS
4/6 workouts to unlock

Complete 2 more workouts to earn your next Challenge.
```

**State 2: Unlocked & Available**

```
[🎯 icon] CHALLENGE UNLOCKED!

"The Grinder"
20 min AMRAP • Max effort

[Start Challenge →]
```

- Prominent visual treatment (border, highlight)
- One-tap access to start

**State 3: Recently Completed**

```
[🎯 icon] LAST CHALLENGE RESULT

"The Grinder" • Oct 9
Family: Skilled (Tier 3)

Progress: 2/6 workouts to unlock next

[View Result →]
```

---

### 2.6 Bottom Tab Navigation

**4 Tabs:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[🏠 Home]  [💪 Workouts]  [📊 Progress]  [⚙️ Settings]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**1. Home**

- Adaptive dashboard (described above)
- Always accessible
- Default landing after onboarding

**2. Workouts**

- Program browser
- Quick Workout library
- Trials access
- Challenge library (post-unlock)

**3. Progress**

- Program progress tracker
- Pact history
- Personal Bests
- Trials results archive
- Challenge results archive

**4. Settings**

- Family member management
- Equipment preferences
- Pact commitment adjustments
- Account settings
- Help & Support
- About

---

### 2.7 Settings Access

**Location:** Main navigation tab (4th tab in bottom navigation on mobile, sidebar on desktop)

**Settings Structure:**

```
SETTINGS

Family Members
  → Add/edit member names, ages
  → Manage who appears in team selection

Equipment
  → Pull-up bar: [Yes / No]
  → Affects exercise swaps in workouts

Pact Commitment
  → Dad: [3 ▼] workouts/week
  → Son 1: [3 ▼] workouts/week
  → Son 2: [2 ▼] workouts/week
  → Changes take effect next Monday

Notifications
  → Workout reminders: [On/Off]
  → Pact check-ins: [On/Off]
  → Trials reminders: [On/Off]

Account
  → Email: michael@example.com
  → Change password
  → Sign out

Help & Support
  → FAQs
  → Contact support
  → Report issue

About
  → Version 1.0.0
  → Terms of Service
  → Privacy Policy
```

---

## 3. WORKOUTS TAB

### Purpose

Browse and access all workout types. Secondary navigation for program management.

---

### 3.1 Workouts Tab Structure

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[🛡️ Blue Shield] TEAM GODSHALL
[Dad 🛡️] [Dylan ⭐] [Ryan 🔥]

WORKOUTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACTIVE PROGRAM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Foundation (8 Weeks)
Week 2 of 8 • 6/24 workouts complete
[████████░░░░░░░░] 25%

NEXT UP:
Day 4: Push Focus • 35 min
Exercises: Push-ups, Squats, Plank

[Start Workout →]

━━━ THIS WEEK ━━━
✅ Mon: W2D1 - Push (Dad 🛡️, Dylan ⭐)
✅ Wed: W2D2 - Pull (Dad 🛡️, Dylan ⭐)
🔄 Fri: W2D3 - Legs: Dylan (first attempt) • Dad (beat your best)
☐ Today: W2D4 - Push

[Tap any workout to start]

[View Full Program →] [Switch Program]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

QUICK WORKOUTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
10-20 min • No program required

[Card] Push Power • 15 min
[Card] Leg Burner • 12 min
[Card] Full Body Flow • 18 min

[Tap any card to start]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TRIALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{Badge: "ACTIVE THIS WEEK" or countdown}

Monthly skill testing • First Mon-Sun
Next: Nov 3-9, 2025

[View Details →]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CHALLENGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4/6 workouts complete
2 more to earn next Challenge

RECENT ATTEMPT:
"The Grinder" • Oct 9
Family: Skilled (Tier 3)

[View Results →]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Key Features:**

- **Team identity at top** - Name + member icons
- **Progress bar** - Visual indicator of program completion
- **"Next Up" workout inline** - Start button accessible immediately
- **This week view** - Shows recent activity + catch-up opportunities
- **Team training opportunity framing** - Reframes catch-up as positive for whole team
- **Quick Workouts inline** - All 3-5 cards shown, no separate page needed
- **Challenge recent attempt** - Shows last result, progress toward next

---

### 3.2 Program Details View

**Screen: Active Program Details**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[← Back]

FOUNDATION (8 Weeks)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Week 2 of 8
6/24 workouts complete (25%)

[Progress bar: ██████░░░░░░░░░░░░░░]

━━━ OVERVIEW ━━━
Bodyweight only • 3x/week • 30-40 min
Perfect for: Building base strength

━━━ WEEKLY SCHEDULE ━━━

WEEK 1 (Completed)
✅ Day 1: Push Focus (Oct 1)
✅ Day 2: Pull Focus (Oct 3)
✅ Day 3: Legs & Core (Oct 5)

WEEK 2 (Current)
✅ Day 1: Push Focus (Oct 8)
☐ Day 2: Pull Focus (Next)
☐ Day 3: Legs & Core

WEEK 3
☐ Day 1: Push Focus
☐ Day 2: Pull Focus
☐ Day 3: Legs & Core

... (collapsed, expand to view)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Start Next Workout →]
[Switch Program]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Display Approach:**

- **All weeks shown expanded by default** (not collapsed)
- This is primary way families view full program structure
- Team training opportunities shown inline with completion status
- Per-member icons show who participated

**Interaction:**

- Tap any workout → Opens Pre-Workout screen directly
- Completed workouts show member icons who participated
- Team training opportunities tappable (opens Pre-Workout)
- "Start Next Workout" → Navigates to next uncompleted workout
- "Switch Program" → Shows program browser with confirmation

---

### 3.3 Quick Workouts Library

**Screen: Quick Workouts Browse**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[← Back]

QUICK WORKOUTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

No program required. Train anytime.

━━━ AVAILABLE WORKOUTS ━━━

[Card: "Push Power"]
20 min • Push focus • Bodyweight
Last completed: 3 days ago

[Card: "Leg Burner"]
25 min • Legs focus • Bodyweight
Never completed

[Card: "Full Body Flow"]
30 min • Full body • Bodyweight
Last completed: 1 week ago

{Pull-up bar required badge if applicable}

[Card: "Upper Pull"]
25 min • Pull focus • Pull-up bar
Never completed

... (scroll for more)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Features:**

- Filter by duration (10-20, 20-30, 30-40 min)
- Filter by equipment (Bodyweight only, Pull-up bar)
- Sort by: Recent, Name, Duration
- Each card tappable → Quick Workout detail → Start Workout

---

### 3.4 Trials Details View

**Screen: Trials Details**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[← Back]

TRIALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{Badge: "ACTIVE THIS WEEK" or "Next: Nov 3-9"}

Monthly proving ground. Five tests. Show what you're made of.

First Mon-Sun of each month • One family attempt

━━━ PERFORMANCE GRID ━━━

                Rookie Trainee Skilled Advanced Elite Champion
                (1)    (2)     (3)     (4)      (5)   (6)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Push-ups        |      |       | [⭐Dylan]| [🛡️Dad]|  |
Dead Hang       |      |[⭐Dylan]|        | [🛡️Dad]|  |
Squats          |      |       | [⭐Dylan]|        |[🛡️Dad]|
Plank Hold      |[⭐Dylan]|     |        |        |[🛡️Dad]|
Burpees         |      |       |        |[⭐Dylan🛡️Dad]|  |
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Family Score: Advanced (22/30)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{If active: [Start Trials →]}
{If complete: [View Last Results →]}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Grid View Benefits:**

- Visual at-a-glance comparison using member color+icon
- Easy to see where improvement opportunities are
- Gamifies in a serious way (tier progression visible)
- Same grid approach works for Challenges
- More engaging than text list

---

### 3.5 Challenge Organization & Placement

**MVP: 6 Challenges total, difficulty-ordered**

**Challenge Rotation Logic:**

**First 6 Attempts (1-6):**

- Challenges presented in difficulty order
- Challenge 1 (easiest) → Challenge 6 (hardest)
- Natural progression prevents early frustration
- Families earn one Challenge at a time sequentially

**After Completing All 6:**

- **Smart Randomization** with guards:
  - Don't repeat Challenge attempted in last 2 attempts
  - Randomize from remaining pool
  - As new Challenges added post-MVP, expand pool

**Example Rotation:**

```
Attempts 1-6: Challenge 1, 2, 3, 4, 5, 6 (in order)
Attempt 7: Random from {1, 2, 3, 4} (exclude 5,6 - last 2)
Attempt 8: Random from {1, 2, 3, 5, 6} (exclude 4, 7's choice)
Attempt 9: Random from all 6 (exclude 7, 8's choices)
```

**Display on Workouts Tab:**

```
CHALLENGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4/6 workouts complete
2 more to earn next Challenge

RECENT ATTEMPT:
"The Grinder" • Oct 9
Family: Skilled (Tier 3)

[View Results →]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Display on Progress Tab:**

```
CHALLENGE HISTORY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Completed: 3/6

✅ Challenge 1: "Foundation Test" - Skilled (3)
✅ Challenge 2: "The Grinder" - Skilled (3)
✅ Challenge 3: "No Quit" - Trainee (2)
🔒 Challenge 4: (Not yet attempted)
🔒 Challenge 5: (Not yet attempted)
🔒 Challenge 6: (Not yet attempted)

[Tap completed for details]
[Locked shows no details - maintain mystery]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Why Split Between Workouts & Progress:**

- **Workouts Tab:** Action-focused (what's next, recent result)
- **Progress Tab:** Historical view (all attempts, completion status)
- Different user intents served by each

**Language Updates:**

- Avoid "unlock" → Use "earn next Challenge" or "complete X workouts to earn"
- Maintains serious athletic tone

---

## 4. PROGRESS TAB (VISUAL REDESIGN)

### Purpose

Visually engaging progress tracking for fathers and kids. More visual, less text. Intuitive for 8-year-olds.

**Design Principle:** Show, don't just tell. Use grids, icons, and visual indicators instead of lists.

---

### 4.1 Progress Tab Structure

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PACT STREAK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Current: 3 weeks [⚡ icon] | Longest: 5 weeks
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROGRAM PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Foundation (8 Weeks) • Week 2 of 8
[████████░░░░░░░░] 25% (6/24 workouts)

[View Program Details →]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TRIALS PERFORMANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[October 2025 ▼] (dropdown to select month)

                Rookie Trainee Skilled Advanced Elite Champion
                (1)    (2)     (3)     (4)      (5)   (6)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Push-ups        |      |       | [⭐Dylan]| [🛡️Dad]|  |
Dead Hang       |      |[⭐Dylan]|        | [🛡️Dad]|  |
Squats          |      |       | [⭐Dylan]|        |[🛡️Dad]|
Plank Hold      |[⭐Dylan]|     |        |        |[🛡️Dad]|
Burpees         |      |       |        |[⭐Dylan🛡️Dad]|  |
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Family Score: Advanced (22/30)

[View Previous Months ▼]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CHALLENGE PERFORMANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Completed: 3/6

                        Rookie Trainee Skilled Advanced Elite Champion
                        (1)    (2)     (3)     (4)      (5)   (6)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Foundation Test         |      | [⭐🛡️]  |        |      |     |
The Grinder             |      |        | [⭐🛡️]  |      |     |
No Quit                 |      | [⭐🛡️]  |        |      |     |
Challenge 4             🔒 Not yet attempted
Challenge 5             🔒 Not yet attempted
Challenge 6             🔒 Not yet attempted
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Tap any completed challenge for details]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PERSONAL BESTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Recent Improvements (Last 7 days):

🛡️ Dad: Push-ups 48 reps ↑ +4
⭐ Dylan: Squats 64 reps ↑ +4
🔥 Ryan: Plank 1:15 ↑ +10 sec

[View All Personal Bests →]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Key Features:**

- **Visual grids** for Trials and Challenges (not lists)
- **Inline display** (no separate pages for Trials/Challenges in MVP)
- **Member icons** plotted on tier grids for at-a-glance comparison
- **Recent improvements** for PBs with delta indicators
- **Dropdown** to view past Trials months
- **Progress bar** for program completion

---

### 4.2 Personal Bests View (Modal/Page)

**Screen: Personal Bests Full List**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[← Back]

PERSONAL BESTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

View: [All Family ▼]  Sort: [Newest First ▼]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Oct 11: 🛡️ Dad - Push-ups (W2D1) 48 reps ↑+4
Oct 11: ⭐ Dylan - Squats (W2D1) 64 reps ↑+4
Oct 9:  🛡️ Dad - Plank (Trials) 2:15 ↑+17 sec
Oct 9:  ⭐ Dylan - Burpees (Trials) 52 reps ↑+6
Oct 5:  🔥 Ryan - Mountain Climbers (Quick Workout) 72 reps ↑+7
Oct 3:  🛡️ Dad - Dead Hang (Trials) 1:45 ↑+12 sec
Sep 30: ⭐ Dylan - Push-ups (Challenge) 38 reps ↑+3
Sep 28: 🛡️ Dad - Squats (W1D3) 82 reps ↑+5
...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Filters:**

- **View:** All Family / Dad / Dylan / Ryan / etc (member filter)
- **Sort:** Newest First / Oldest First (date sort)

**Format:**

- Date: Member icon + name - Exercise (Context) Value ↑Delta
- Context shown in parentheses (Trials, Challenge name, W#D#, Quick Workout)
- Delta shows improvement from previous best
- Default: All Family, Newest First

**Empty State (no PBs yet):**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PERSONAL BESTS

No personal bests yet.

Personal bests are tracked when you
repeat exercises. Keep training!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 5. PRE-WORKOUT FLOW (Detailed)

**Entry Points:**

- Home Screen → "Start Workout" button
- Workouts Tab → Program/Quick/Trials/Challenge
- End Screen → "Start Another Workout"

---

### 5.1 Pre-Workout Screen (Program/Quick)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[← Back]

FOUNDATION - WEEK 2, DAY 1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Push Focus • 35 min • Bodyweight

━━━ WHO'S TRAINING? ━━━

[✓ Dad] [✓ Dylan] [ Ryan]

Must select at least 1 to proceed.

━━━ WORKOUT OVERVIEW ━━━

Block 1: 3 Straight Sets - Push-ups
Block 2: Superset - Squats + Mountain Climbers
Block 3: 10 min AMRAP - Burpees, Plank Hold

Equipment: None

━━━ EXERCISES ━━━

[Looping demo] Push-ups
[Looping demo] Squats
[Looping demo] Mountain Climbers
[Looping demo] Burpees
[Looping demo] Plank Hold

Tap any demo to view larger version

━━━ SWAP OPTIONS ━━━

{Shown only for selected members}

Dad:
  Push-ups: [Easier] [Default ✓] [Harder]
  Squats: [Default ✓] (no swaps available)

  {Swap demos shown below selected exercises}
  Push-ups - Easier: [Looping demo] Knee Push-ups
  Push-ups - Harder: [Looping demo] Decline Push-ups

Dylan:
  Push-ups: [Easier ✓] [Default] [Harder]
  Squats: [Default ✓] (no swaps available)

  {Swap demos shown below selected exercises}
  Push-ups - Easier: [Looping demo] Knee Push-ups
  Push-ups - Default: [Looping demo] Standard Push-ups
  Push-ups - Harder: [Looping demo] Decline Push-ups

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Start Workout →]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Interactions:**

- Tap member name → Toggle selection (✓ / empty)
- Swap selection → Radio buttons per member per exercise
- "Start Workout" → Navigates to Active Workout (timer starts)

**Performance:**

- Screen loads in < 500ms
- Swap options pre-loaded for all members
- Exercise demos pre-cached

---

### 5.2 Pre-Workout Screen (Trials)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[← Back]

TRIALS - OCTOBER 2025
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ MAX-EFFORT WORKOUT

This workout pushes your limits. Athletes know
when to push and when to stop.

Rules:
• Warm up first (5+ min)
• Pain ≠ Fatigue. Pain = stop immediately.
• Form breaks down = rep doesn't count
• One attempt only

Champions train smart, not just hard.

━━━ WHO'S TRAINING? ━━━

[✓ Dad] [✓ Dylan] [ Ryan]

Must select at least 1 to proceed.

━━━ 5 TESTS (40 min total) ━━━

1. Push: Max Push-ups (2 min)
   [Looping demo] Push-ups

2. Pull: Dead Hang (max time)
   [Looping demo] Dead Hang

3. Legs: Max Squats (2 min)
   [Looping demo] Squats

4. Core: Plank Hold (max time)
   [Looping demo] Plank Hold

5. Endurance: Burpees (3 min)
   [Looping demo] Burpees

Tap any demo to view larger version

Family Scoring: Average of all tiers, rounded down

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[I'm Ready - Start Trials →]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Key Differences from Program/Quick:**

- Safety screen always shown (can't be dismissed)
- No swap options (fixed exercises)
- One-attempt reminder
- Family scoring explanation

---

### 5.3 Pre-Workout Screen (Challenge)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[← Back]

CHALLENGE: "THE GRINDER"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ MAX-EFFORT WORKOUT

{Minimal instruction text specific to this Challenge}
Example: "The Grinder tests mental toughness through
high-volume rounds. Pace yourself early."

Rules:
• Warm up first (5+ min)
• Pain ≠ Fatigue. Pain = stop immediately.
• Form breaks down = rep doesn't count
• One attempt only

Champions train smart, not just hard.

━━━ WHO'S TRAINING? ━━━

[✓ Dad] [✓ Dylan] [ Ryan]

Must select at least 1 to proceed.

━━━ CHALLENGE DETAILS ━━━

Format: 20 min AMRAP
• 10 Push-ups
• 15 Squats
• 10 Mountain Climbers
• 5 Burpees

Score: Total rounds completed

━━━ EXERCISES ━━━

[Looping demo] Push-ups
[Looping demo] Squats
[Looping demo] Mountain Climbers
[Looping demo] Burpees

Tap any demo to view larger version

━━━ TIER THRESHOLDS ━━━
Rookie (1): 5-7 rounds
Trainee (2): 8-10 rounds
Skilled (3): 11-13 rounds
Advanced (4): 14-16 rounds
Elite (5): 17-19 rounds
Champion (6): 20+ rounds

Family Scoring: Average of all tiers, rounded down

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[I'm Ready - Start Challenge →]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Instruction Text Note:**

- Each Challenge/Trials can include brief workout-specific instruction (2-3 lines max)
- Kept minimal, focuses on strategy or key considerations
- Not required for every workout, only when adds value

---

### 5.4 Equipment Check Trigger (Intermediate Start)

**When:** First time starting any Intermediate workout

**Modal (Overlays Pre-Workout screen):**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EQUIPMENT CHECK

This workout includes pull-up exercises.

Do you have a doorway pull-up bar?

[Yes, I have one] [No, show alternatives]

You can update this anytime in Settings.

[Cancel]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Behavior:**

- Shown only once (first Intermediate workout)
- "Yes" → Saves `pull_up_bar: true`, dismisses modal, proceeds
- "No" → Saves `pull_up_bar: false`, updates swap options, proceeds
- "Cancel" → Returns to previous screen
- Setting persists, affects all future workouts

---

## 6. ACTIVE WORKOUT FLOW (Detailed)

**Core Principle:** Minimize taps, maximize focus. Large touch targets, high contrast, immediate feedback.

---

### 6.1 Active Workout Screen Layout

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[|| Pause]    Foundation W2D1    [X Exit]
              Elapsed: 08:42
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BLOCK 1 of 3: Straight Sets - Push-ups
Set 1 of 3 • Rest 60 sec between sets

[Looping demo]
Standard Push-ups
Tap to view larger version

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DAD (Michael)
Total reps: 0

[  -1  ] [  +1  ] [  +5  ]

Previous best: 44 reps

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DYLAN (Son 1)
Total reps: 0

[  -1  ] [  +1  ] [  +5  ]

Previous best: 32 reps

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Swap Exercise] (per member, if available)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Done with Set 1 →]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Button Sizes:**

- Minimum 56px touch targets (WCAG AAA)
- Large +1/+5 buttons for easy tapping during fatigue
- High contrast (readable in bright sunlight)

---

### 6.2 Counter Interactions

**Tap +1:** Increment by 1
**Hold +1 (500ms):** Rapid increment every 200ms
**Tap +5:** Increment by 5
**Hold +5 (500ms):** Rapid increment by 5s every 200ms
**Tap -1:** Decrement by 1 (minimum 0)

**Visual Feedback:**

- Number updates immediately (< 50ms)
- Button press animation (scale + color change)
- Haptic feedback on tap (if device supports)

---

### 6.3 Rest Timer Screen

**After completing a set:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REST PERIOD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Great effort! Catch your breath.

Next up: Set 2 of 3 - Push-ups

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

           00:47

[Progress circle: 47/60 seconds]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Skip Rest →]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Behavior:**

- Countdown from 60 seconds (or workout-specified rest period)
- Visual progress circle
- Optional encouraging copy
- "Skip Rest" allows early continuation
- Auto-advances when timer reaches 0

---

### 6.4 Mid-Workout Swap Modal

**Triggered by:** "Swap Exercise" button tap

**Modal (Overlay):**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SWAP EXERCISE

Who's swapping?

[ ] Dad
[✓] Dylan

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dylan's Push-up Options:

( ) Easier: Knee Push-ups
    [Looping demo]

(•) Default: Standard Push-ups
    [Looping demo]

( ) Harder: Decline Push-ups
    [Looping demo]

Tap any demo to view larger version

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Apply Swap]  [Cancel]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Interaction:**

- Select member(s) to swap
- Select swap option per member
- "View demo" opens full-screen video (dismissable)
- "Apply Swap" updates exercise for selected members immediately
- "Cancel" dismisses modal, no changes

**Performance:**

- Modal loads in < 150ms
- Swap applies immediately (no API call, local state)
- Exercise demo video pre-cached

---

### 6.5 Pause Modal

**Triggered by:** Pause button (top-left)

**Modal:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WORKOUT PAUSED

Elapsed: 12:34

[Resume Workout]

[Exit Workout]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Behavior:**

- Freezes all timers
- Preserves all logged data
- "Resume" → Returns to exact workout state
- "Exit" → Shows confirmation modal (see below)

---

### 6.6 Exit Confirmation Modal

**Triggered by:** Exit button (top-right) OR "Exit Workout" from Pause

**Modal:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LEAVE WORKOUT?

Your progress won't be saved.

[Leave Workout]  [Keep Training]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Behavior:**

- "Leave Workout" → Discards all data, returns to Home
- "Keep Training" → Dismisses modal, returns to workout

---

## 7. REVIEW & SAVE FLOW (Detailed)

**Entry:** After completing all blocks in workout

---

### 7.1 Review Screen (Exercise-Grouped Layout)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WORKOUT COMPLETE!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Foundation W2D1 • 34:12 elapsed

━━━ TODAY'S RESULTS ━━━

BLOCK 1: PUSH-UPS (3 Straight Sets)
[Looping demo]

🛡️ Dad: 48 reps [  -1  ] [  +1  ]
⭐ Dylan: 34 reps [  -1  ] [  +1  ]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BLOCK 2: SUPERSET (Squats + Mountain Climbers)
[Looping demo]

🛡️ Dad: 156 total reps [  -1  ] [  +1  ]
⭐ Dylan: 128 total reps [  -1  ] [  +1  ]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BLOCK 3: 10 MIN AMRAP (Burpees, Plank Hold)
[Looping demo]

🛡️ Dad: 8 rounds [  -1  ] [  +1  ]
⭐ Dylan: 6 rounds [  -1  ] [  +1  ]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Save & Continue →]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Design Rationale:**

- **Exercise-first grouping** - Shows exercise/block, then all members' results
- **Looping demos inline** - Visual reminder of what was done
- **Condensed counters (+1/-1)** - Quick adjustments for missed reps
- **Always editable** - No separate edit state needed
- **Member icons** - Quick visual identification

**Why This Approach:**

- More scannable on mobile (vertical scroll, one exercise at a time)
- Easier to compare family performance per exercise
- Looping demos help verify correct data entry
- No expand/collapse cognitive load
- Consistent with active workout counter pattern

---

### 7.2 Save Action & Loading State

**When "Save & Continue" tapped:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SAVING WORKOUT...

[Spinner icon]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Backend Actions (all happen before End Screen):**

1. Write to local storage (device)
2. Queue for background sync
3. Increment Pact counters (per member)
4. Increment Challenge unlock counter (if applicable)
5. Compute Personal Bests (compare to previous)
6. Generate End Screen content
7. Navigate to End Screen

**Timing:**

- Save to local: < 500ms
- End Screen display: < 800ms total

---

## 8. END SCREEN FLOW (Detailed)

**Purpose:** Celebrate results, show progress, reinforce positive behaviors.

---

### 8.1 End Screen Layout

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 WORKOUT COMPLETE!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Foundation W2D1
Completed: Oct 11, 2025 • 34:12 elapsed

━━━ DAD'S RESULTS ━━━

• Push-ups: 48 reps [🎖️] NEW PB! (Prev: 44)
• Superset: 156 total reps [🎖️] NEW PB!
• AMRAP: 8 rounds

━━━ DYLAN'S RESULTS ━━━

• Push-ups: 34 reps [🎖️] NEW PB! (Prev: 30)
• Superset: 128 total reps
• AMRAP: 6 rounds

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[✅ icon] WEEKLY PACT UPDATE
Family: 7/8 workouts this week
Dad: 3/3 complete [✓]
Dylan: 3/3 complete [✓]
Ryan: 1/2 complete

Current streak: 3 weeks [⚡ icon]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[🎯 icon] CHALLENGE PROGRESS
5/6 workouts to unlock
One more workout to earn your next Challenge!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[📊 icon] TEAM TRAINING
9 workouts together this month
163 total sessions all-time

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Done - Return Home]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### 8.2 End Screen Variants

**Variant 1: Program Complete**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏆 PROGRAM COMPLETE!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Foundation (8 Weeks)
Completed: Oct 11, 2025

You've built an incredible foundation together.
Dad and Dylan completed all 24 workouts.

━━━ PROGRAM STATS ━━━

Total Workouts: 24
Total Time: 14 hours 23 min
Personal Bests Set: 47

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT'S NEXT?

Ready for the next challenge?

[Browse Programs →]

[View Progress →]

[Return Home]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Variant 2: Challenge Unlocked (immediately after save)**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 WORKOUT COMPLETE!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{Standard results display}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 CHALLENGE UNLOCKED!

"The Grinder"
20 min AMRAP • Max effort

You've earned this through consistency.

[View Challenge →]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Done - Return Home]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Variant 3: Trials Result**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏆 TRIALS COMPLETE!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

October 2025 Trials

━━━ FAMILY RESULT ━━━

ADVANCED (22/30 points)

                Rookie Trainee Skilled Advanced Elite Champion
                (1)    (2)     (3)     (4)      (5)   (6)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Push-ups        |      |       | [⭐Dylan]| [🛡️Dad]|  |
Dead Hang       |      |[⭐Dylan]|        | [🛡️Dad]|  |
Squats          |      |       | [⭐Dylan]|        |[🛡️Dad]| [🎖️ Dylan NEW PB!]
Plank Hold      |[⭐Dylan]|     |        |        |[🛡️Dad]|
Burpees         |      |       |        |[⭐Dylan🛡️Dad]|  | [🎖️ Both NEW PB!]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Individual Scores:
🛡️ Dad: Elite (26/30)
⭐ Dylan: Skilled (18/30)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{Standard Pact update, Challenge progress, etc.}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Done - Return Home]

[View Progress →]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Notes:**

- Uses same tier grid as Progress Tab
- Highlights NEW PBs inline on grid
- Links to Progress Tab (not separate Trials History page in MVP)

---

**Variant 4: Challenge Result**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏆 CHALLENGE COMPLETE!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"The Grinder" • Oct 11, 2025

━━━ FAMILY RESULT ━━━

SKILLED (Tier 3)

                        Rookie Trainee Skilled Advanced Elite Champion
                        (1)    (2)     (3)     (4)      (5)   (6)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The Grinder             |      |        | [⭐🛡️]  |      |     |
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Individual Results:
🛡️ Dad: 14 rounds (Tier 4 - Advanced) [🎖️ NEW PB!]
⭐ Dylan: 11 rounds (Tier 3 - Skilled) [🎖️ NEW PB!]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{Standard Pact update, Challenge progress, etc.}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Done - Return Home]

[View Progress →]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Notes:**

- Uses same tier grid as Progress Tab
- Single row for this Challenge
- Shows both family tier and individual results
- Highlights NEW PBs

---

### 8.3 Sync Status Indicators (Displayed During Save, Section 7.3)

**Saved Successfully:**

```
[✓ icon] Workout saved
```

**Syncing:**

```
[↻ icon] Syncing...
```

- Spinner animation
- Auto-updates when complete

**Saved Locally (Offline):**

```
[○ icon] Saved locally
```

- Will sync automatically when reconnected
- User can proceed normally

---

## 9. NAVIGATION PATTERNS & GESTURES

### 9.1 Back Navigation

**Standard Pattern:**

- Top-left [← Back] button on all secondary screens
- Returns to previous screen in stack
- Native back gesture support (swipe from left edge on iOS/Android)

**Exceptions (Confirmation Required):**

- Active Workout → Exit confirmation modal
- Review Screen → Cannot go back (must save or exit via Home)

---

### 9.2 Navigation Persistence (Mobile vs Desktop)

**Mobile (Bottom Tabs):**

- Bottom tab nav always visible except during:
  - Active Workout (full-screen focus)
  - Modals (overlays)
  - Onboarding (until complete)
- Current tab highlighted with icon + label
- Other tabs dimmed

**Desktop/Tablet (Side Navigation):**

- Left sidebar always visible (same exceptions as mobile)
- Current section highlighted
- Sidebar can be collapsed on smaller tablets if needed
- More vertical space for main content area

**Cross-Platform Consistency:**

- Same navigation items (Home, Workouts, Progress, Settings)
- Same interaction patterns (tap/click to navigate)
- Layout adapts to screen size, behavior remains consistent

---

### 9.3 Scroll Behavior

**Home Screen:**

- Vertical scroll only
- Modules stack vertically
- Smooth scroll animation

**Workout Lists:**

- Vertical scroll
- Pull-to-refresh on list views (sync latest content)

**Program Week View:**

- All weeks shown expanded by default
- Vertical scroll through full program
- Scroll position preserved when navigating back

---

## 10. ERROR STATES & EDGE CASES

### 10.1 No Active Program

**Home Screen:**

```
READY TO START?

No active program selected.

[Browse Programs →]  [Quick Workout →]
```

---

### 10.2 Offline Mode

**Visual Indicator:**

```
[○ icon] Offline mode
```

- Shown in top bar when no connection
- All features work normally
- Sync queued automatically

**Behavior:**

- All workouts work offline (pre-cached)
- Counters update locally
- Background sync resumes when reconnected
- No blocking dialogs

---

### 10.3 Failed Save (Critical Error)

**Scenario:** Local storage fails (device full, corruption)

**Modal:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SAVE FAILED

Your workout couldn't be saved due to a
storage error. Please free up space and try again.

Your results:
{Display results summary}

[Try Again]  [Copy Results]  [Exit]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Actions:**

- "Try Again" → Retry save operation
- "Copy Results" → Copy text to clipboard
- "Exit" → Return to Home without saving

---

### 10.4 Team Training Opportunities (Catch-Up Workouts)

**Scenario:** Some family members haven't completed workouts that others have

**Key Principle:** Programs are NOT time-bound. There's no concept of "behind schedule" or "current week." Every workout is an opportunity to train and improve personal bests.

**Home Screen - Today's Workout Module:**

```
TODAY'S WORKOUT

Foundation - Week 2, Day 3
Dylan's first attempt • Dad can beat your best

Legs Focus • 40 min • Bodyweight

Exercises: Squats, Lunges, Jump Squats, Wall Sit

[Start Workout →]
```

**Home Screen - Team Training Opportunities Module:**

```
🔄 TEAM TRAINING OPPORTUNITIES

Workouts where members can improve:

W2D3 - Legs: Dylan (first attempt) • Dad (beat your best)
W2D1 - Push: Ryan (first attempt)
W1D2 - Pull: Dylan (first attempt) • Dad (beat your best)

[Tap any workout to start]
```

**Design Approach:**

- **Positive framing:** "First attempt" or "beat your best"
- **No skip option:** Every workout is valuable (no skipping ahead)
- **No time pressure:** Programs aren't calendar-based
- **Team focus:** Emphasize who can benefit from each workout
- **Always accessible:** All workouts remain available in Program Details view

**Edge Case - Large Gap:**
If Dad has completed 15 workouts but Dylan has only completed 3:

- Today's Workout shows Dylan's next uncompleted workout (W1D4 or similar)
- Team Training Opportunities lists several workouts Dylan can catch up on
- No negative messaging about the gap
- Program Details view shows full history with completion status per member
- Allow both catch-up and skip-ahead paths
- Default: recommend catch-up, but don't force it

---

## 11. PERFORMANCE TARGETS (Summary)

| Screen/Action             | Target       | Critical? |
| ------------------------- | ------------ | --------- |
| Home Screen load          | < 500ms      | Yes       |
| Pre-Workout load          | < 500ms      | Yes       |
| Active Workout transition | < 200ms      | Yes       |
| Swap modal open           | < 150ms      | Yes       |
| Counter update (tap)      | < 50ms       | Yes       |
| Review Screen load        | < 300ms      | Yes       |
| Save to local storage     | < 500ms      | Yes       |
| End Screen display        | < 800ms      | Yes       |
| Exercise demo video start | < 1s         | No        |
| Background sync           | Non-blocking | Yes       |

---

## 12. DESIGN PRINCIPLES (Recap)

1. **Offline-First:** Every feature works without network
2. **One Device:** Clear member selection at decision points
3. **Minimal Friction:** Remove barriers between intention and action
4. **Immediate Feedback:** < 50ms counter updates, instant visual responses
5. **Progressive Disclosure:** Show what's needed when it's needed
6. **Celebrate Progress:** PB badges, streak tracking, positive messaging
7. **No Punishment:** Encouraging tone, never shame for missed workouts
8. **Large Touch Targets:** 56px minimum (WCAG AAA) for fatigued users
9. **High Contrast:** Readable in bright light, outdoor training
10. **Works with Sweaty Fingers:** Reliable touch detection

---

**End of Phase 3**

---

## CHECKPOINT QUESTIONS FOR REVIEW

1. **Onboarding:** < 2 minutes realistic? Any critical info missing?
2. **Home Screen:** Priority order make sense? Today's Workout adaptive states clear?
3. **Navigation:** Bottom tabs vs. drawer menu - is 4-tab approach sufficient for MVP?
4. **Program Catch-Up:** Recommend vs. force - does "Skip to Current Week" option solve this well?
5. **Equipment Check:** Triggered during onboarding + first Intermediate start - sufficient?
6. **Pre-Workout:** Swap selection clear? Safety screens appropriate for Trials/Challenges?
7. **Active Workout:** Counter interactions intuitive? Mid-workout swaps smooth?
8. **Review & Save:** Editable results sufficient, or need more features?
9. **End Screen:** Priority order correct? PB badges + Pact + Challenge progress - anything missing?
10. **Error States:** Offline mode + catch-up + failed save - covered adequately?
11. **Performance:** Targets realistic for MVP? Any concerns about achieving < 150ms swap modal?
12. **Overall:** Any UX flows unclear? Any critical user journeys missing?
