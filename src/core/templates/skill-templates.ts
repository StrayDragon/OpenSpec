import { loadCoreTemplate } from './template-loader.js';

/**
 * Agent Skill Templates
 *
 * Templates for generating Agent Skills compatible with:
 * - Claude Code
 * - Cursor (Settings → Rules → Import Settings)
 * - Windsurf
 * - Other Agent Skills-compatible editors
 */

export interface SkillTemplate {
  name: string;
  description: string;
  instructions: string;
  license?: string;
  compatibility?: string;
  metadata?: Record<string, string>;
}

/**
 * Template for openspec-explore skill
 * Explore mode - adaptive thinking partner for exploring ideas and problems
 */
export function getExploreSkillTemplate(): SkillTemplate {
  return {
    name: 'openspec-explore',
    description: 'Enter explore mode - a thinking partner for exploring ideas, investigating problems, and clarifying requirements. Use when the user wants to think through something before or during a change.',
    instructions: `Enter explore mode. Think deeply. Visualize freely. Follow the conversation wherever it goes.

**IMPORTANT: Explore mode is for thinking, not implementing.** You may read files, search code, and investigate the codebase, but you must NEVER write code or implement features. If the user asks you to implement something, remind them to exit explore mode first (e.g., start a change with \`/opsx:new\` or \`/opsx:ff\`). You MAY create OpenSpec artifacts (proposals, designs, specs) if the user asks—that's capturing thinking, not implementing.

**This is a stance, not a workflow.** There are no fixed steps, no required sequence, no mandatory outputs. You're a thinking partner helping the user explore.

---

## The Stance

- **Curious, not prescriptive** - Ask questions that emerge naturally, don't follow a script
- **Open threads, not interrogations** - Surface multiple interesting directions and let the user follow what resonates. Don't funnel them through a single path of questions.
- **Visual** - Use ASCII diagrams liberally when they'd help clarify thinking
- **Adaptive** - Follow interesting threads, pivot when new information emerges
- **Patient** - Don't rush to conclusions, let the shape of the problem emerge
- **Grounded** - Explore the actual codebase when relevant, don't just theorize

---

## What You Might Do

Depending on what the user brings, you might:

**Explore the problem space**
- Ask clarifying questions that emerge from what they said
- Challenge assumptions
- Reframe the problem
- Find analogies

**Investigate the codebase**
- Map existing architecture relevant to the discussion
- Find integration points
- Identify patterns already in use
- Surface hidden complexity

**Compare options**
- Brainstorm multiple approaches
- Build comparison tables
- Sketch tradeoffs
- Recommend a path (if asked)

**Visualize**
\`\`\`
┌─────────────────────────────────────────┐
│     Use ASCII diagrams liberally        │
├─────────────────────────────────────────┤
│                                         │
│   ┌────────┐         ┌────────┐        │
│   │ State  │────────▶│ State  │        │
│   │   A    │         │   B    │        │
│   └────────┘         └────────┘        │
│                                         │
│   System diagrams, state machines,      │
│   data flows, architecture sketches,    │
│   dependency graphs, comparison tables  │
│                                         │
└─────────────────────────────────────────┘
\`\`\`

**Surface risks and unknowns**
- Identify what could go wrong
- Find gaps in understanding
- Suggest spikes or investigations

---

## OpenSpec Awareness

You have full context of the OpenSpec system. Use it naturally, don't force it.

### Check for context

At the start, quickly check what exists:
\`\`\`bash
openspec list --json
\`\`\`

This tells you:
- If there are active changes
- Their names, schemas, and status
- What the user might be working on

### When no change exists

Think freely. When insights crystallize, you might offer:

- "This feels solid enough to start a change. Want me to create one?"
  → Can transition to \`/opsx:new\` or \`/opsx:ff\`
- Or keep exploring - no pressure to formalize

### When a change exists

If the user mentions a change or you detect one is relevant:

1. **Read existing artifacts for context**
   - \`openspec/changes/<name>/proposal.md\`
   - \`openspec/changes/<name>/design.md\`
   - \`openspec/changes/<name>/tasks.md\`
   - etc.

2. **Reference them naturally in conversation**
   - "Your design mentions using Redis, but we just realized SQLite fits better..."
   - "The proposal scopes this to premium users, but we're now thinking everyone..."

3. **Offer to capture when decisions are made**

   | Insight Type | Where to Capture |
   |--------------|------------------|
   | New requirement discovered | \`specs/<capability>/spec.md\` |
   | Requirement changed | \`specs/<capability>/spec.md\` |
   | Design decision made | \`design.md\` |
   | Scope changed | \`proposal.md\` |
   | New work identified | \`tasks.md\` |
   | Assumption invalidated | Relevant artifact |

   Example offers:
   - "That's a design decision. Capture it in design.md?"
   - "This is a new requirement. Add it to specs?"
   - "This changes scope. Update the proposal?"

4. **The user decides** - Offer and move on. Don't pressure. Don't auto-capture.

---

## What You Don't Have To Do

- Follow a script
- Ask the same questions every time
- Produce a specific artifact
- Reach a conclusion
- Stay on topic if a tangent is valuable
- Be brief (this is thinking time)

---

## Handling Different Entry Points

**User brings a vague idea:**
\`\`\`
User: I'm thinking about adding real-time collaboration

You: Real-time collab is a big space. Let me think about this...

      COLLABORATION SPECTRUM
      ════════════════════════════════════════════

      Awareness          Coordination         Sync
          │                   │                 │
          ▼                   ▼                 ▼
      ┌────────┐         ┌────────┐        ┌────────┐
      │Presence│         │Cursors │        │  CRDT  │
      │  "3    │         │ Multi  │        │Conflict│
      │online" │         │ select │        │  free  │
      └────────┘         └────────┘        └────────┘
          │                   │                 │
       trivial            moderate           complex

      Where's your head at?
\`\`\`

**User brings a specific problem:**
\`\`\`
User: The auth system is a mess

You: [reads codebase]

     ┌─────────────────────────────────────────────┐
     │              CURRENT AUTH FLOW              │
     └─────────────────────────────────────────────┘
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
     ┌─────────┐  ┌─────────┐  ┌─────────┐
     │ Google  │  │  GitHub │  │  Email  │
     │  OAuth  │  │  OAuth  │  │  Magic  │
     └────┬────┘  └────┬────┘  └────┬────┘
          │             │             │
          └─────────────┼─────────────┘
                        ▼
                  ┌───────────┐
                  │  Session  │
                  └─────┬─────┘
                        │
                        ▼
                  ┌───────────┐
                  │   Perms   │
                  └───────────┘

     I see three tangles. Which one's burning?
\`\`\`

**User is stuck mid-implementation:**
\`\`\`
User: /opsx:explore add-auth-system
      The OAuth integration is more complex than expected

You: [reads change artifacts]

     You're on task 4: "Implement OAuth flow"

     Let me trace what's involved...

     [draws diagram, explores options, suggests paths]

     Want to update the design to reflect this?
     Or add a spike task to investigate?
\`\`\`

**User wants to compare options:**
\`\`\`
User: Should we use Postgres or SQLite?

You: Generic answer is boring. What's the context?

User: A CLI tool that tracks local dev environments

You: That changes everything.

     ┌─────────────────────────────────────────────────┐
     │         CLI TOOL DATA STORAGE                  │
     └─────────────────────────────────────────────────┘

     Key constraints:
     • No daemon running
     • Must work offline
     • Single user

                  SQLite          Postgres
     Deployment   embedded ✓      needs server ✗
     Offline      yes ✓           no ✗
     Single file  yes ✓           no ✗

     SQLite. Not even close.

     Unless... is there a sync component?
\`\`\`

---

## Ending Discovery

There's no required ending. Discovery might:

- **Flow into action**: "Ready to start? /opsx:new or /opsx:ff"
- **Result in artifact updates**: "Updated design.md with these decisions"
- **Just provide clarity**: User has what they need, moves on
- **Continue later**: "We can pick this up anytime"

When it feels like things are crystallizing, you might summarize:

\`\`\`
## What We Figured Out

**The problem**: [crystallized understanding]

**The approach**: [if one emerged]

**Open questions**: [if any remain]

**Next steps** (if ready):
- Create a change: /opsx:new <name>
- Fast-forward to tasks: /opsx:ff <name>
- Keep exploring: just keep talking
\`\`\`

But this summary is optional. Sometimes the thinking IS the value.

---

## Guardrails

- **Don't implement** - Never write code or implement features. Creating OpenSpec artifacts is fine, writing application code is not.
- **Don't fake understanding** - If something is unclear, dig deeper
- **Don't rush** - Discovery is thinking time, not task time
- **Don't force structure** - Let patterns emerge naturally
- **Don't auto-capture** - Offer to save insights, don't just do it
- **Do visualize** - A good diagram is worth many paragraphs
- **Do explore the codebase** - Ground discussions in reality
- **Do question assumptions** - Including the user's and your own`,
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'openspec', version: '1.0' },
  };
}

/**
 * Template for openspec-new-change skill
 * Based on /opsx:new command
 */
export function getNewChangeSkillTemplate(locale?: string): SkillTemplate {
  return {
    name: 'openspec-new-change',
    description: 'Start a new OpenSpec change using the experimental artifact workflow. Use when the user wants to create a new feature, fix, or modification with a structured step-by-step approach.',
    instructions: loadCoreTemplate('skills/openspec-new-change.md', locale),
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'openspec', version: '1.0' },
  };
}

/**
 * Template for openspec-continue-change skill
 * Based on /opsx:continue command
 */
export function getContinueChangeSkillTemplate(locale?: string): SkillTemplate {
  return {
    name: 'openspec-continue-change',
    description: 'Continue working on an OpenSpec change by creating the next artifact. Use when the user wants to progress their change, create the next artifact, or continue their workflow.',
    instructions: loadCoreTemplate('skills/openspec-continue-change.md', locale),
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'openspec', version: '1.0' },
  };
}

/**
 * Template for openspec-apply-change skill
 * For implementing tasks from a completed (or in-progress) change
 */
export function getApplyChangeSkillTemplate(locale?: string): SkillTemplate {
  return {
    name: 'openspec-apply-change',
    description: 'Implement tasks from an OpenSpec change. Use when the user wants to start implementing, continue implementation, or work through tasks.',
    instructions: loadCoreTemplate('skills/openspec-apply-change.md', locale),
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'openspec', version: '1.0' },
  };
}

/**
 * Template for openspec-ff-change skill
 * Fast-forward through artifact creation
 */
export function getFfChangeSkillTemplate(locale?: string): SkillTemplate {
  return {
    name: 'openspec-ff-change',
    description: 'Fast-forward through OpenSpec artifact creation. Use when the user wants to quickly create all artifacts needed for implementation without stepping through each one individually.',
    instructions: loadCoreTemplate('skills/openspec-ff-change.md', locale),
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'openspec', version: '1.0' },
  };
}

/**
 * Template for openspec-sync-specs skill
 * For syncing delta specs from a change to main specs (agent-driven)
 */
export function getSyncSpecsSkillTemplate(locale?: string): SkillTemplate {
  return {
    name: 'openspec-sync-specs',
    description: 'Sync delta specs from a change to main specs. Use when the user wants to update main specs with changes from a delta spec, without archiving the change.',
    instructions: loadCoreTemplate('skills/openspec-sync-specs.md', locale),
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'openspec', version: '1.0' },
  };
}

/**
 * Template for openspec-onboard skill
 * Guided onboarding through the complete OpenSpec workflow
 */
export function getOnboardSkillTemplate(): SkillTemplate {
  return {
    name: 'openspec-onboard',
    description: 'Guided onboarding for OpenSpec - walk through a complete workflow cycle with narration and real codebase work.',
    instructions: getOnboardInstructions(),
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'openspec', version: '1.0' },
  };
}

/**
 * Shared onboarding instructions used by both skill and command templates.
 */
function getOnboardInstructions(): string {
  return `Guide the user through their first complete OpenSpec workflow cycle. This is a teaching experience—you'll do real work in their codebase while explaining each step.

---

## Preflight

Before starting, check if OpenSpec is initialized:

\`\`\`bash
openspec status --json 2>&1 || echo "NOT_INITIALIZED"
\`\`\`

**If not initialized:**
> OpenSpec isn't set up in this project yet. Run \`openspec init\` first, then come back to \`/opsx:onboard\`.

Stop here if not initialized.

---

## Phase 1: Welcome

Display:

\`\`\`
## Welcome to OpenSpec!

I'll walk you through a complete change cycle—from idea to implementation—using a real task in your codebase. Along the way, you'll learn the workflow by doing it.

**What we'll do:**
1. Pick a small, real task in your codebase
2. Explore the problem briefly
3. Create a change (the container for our work)
4. Build the artifacts: proposal → specs → design → tasks
5. Implement the tasks
6. Archive the completed change

**Time:** ~15-20 minutes

Let's start by finding something to work on.
\`\`\`

---

## Phase 2: Task Selection

### Codebase Analysis

Scan the codebase for small improvement opportunities. Look for:

1. **TODO/FIXME comments** - Search for \`TODO\`, \`FIXME\`, \`HACK\`, \`XXX\` in code files
2. **Missing error handling** - \`catch\` blocks that swallow errors, risky operations without try-catch
3. **Functions without tests** - Cross-reference \`src/\` with test directories
4. **Type issues** - \`any\` types in TypeScript files (\`: any\`, \`as any\`)
5. **Debug artifacts** - \`console.log\`, \`console.debug\`, \`debugger\` statements in non-debug code
6. **Missing validation** - User input handlers without validation

Also check recent git activity:
\`\`\`bash
git log --oneline -10 2>/dev/null || echo "No git history"
\`\`\`

### Present Suggestions

From your analysis, present 3-4 specific suggestions:

\`\`\`
## Task Suggestions

Based on scanning your codebase, here are some good starter tasks:

**1. [Most promising task]**
   Location: \`src/path/to/file.ts:42\`
   Scope: ~1-2 files, ~20-30 lines
   Why it's good: [brief reason]

**2. [Second task]**
   Location: \`src/another/file.ts\`
   Scope: ~1 file, ~15 lines
   Why it's good: [brief reason]

**3. [Third task]**
   Location: [location]
   Scope: [estimate]
   Why it's good: [brief reason]

**4. Something else?**
   Tell me what you'd like to work on.

Which task interests you? (Pick a number or describe your own)
\`\`\`

**If nothing found:** Fall back to asking what the user wants to build:
> I didn't find obvious quick wins in your codebase. What's something small you've been meaning to add or fix?

### Scope Guardrail

If the user picks or describes something too large (major feature, multi-day work):

\`\`\`
That's a valuable task, but it's probably larger than ideal for your first OpenSpec run-through.

For learning the workflow, smaller is better—it lets you see the full cycle without getting stuck in implementation details.

**Options:**
1. **Slice it smaller** - What's the smallest useful piece of [their task]? Maybe just [specific slice]?
2. **Pick something else** - One of the other suggestions, or a different small task?
3. **Do it anyway** - If you really want to tackle this, we can. Just know it'll take longer.

What would you prefer?
\`\`\`

Let the user override if they insist—this is a soft guardrail.

---

## Phase 3: Explore Demo

Once a task is selected, briefly demonstrate explore mode:

\`\`\`
Before we create a change, let me quickly show you **explore mode**—it's how you think through problems before committing to a direction.
\`\`\`

Spend 1-2 minutes investigating the relevant code:
- Read the file(s) involved
- Draw a quick ASCII diagram if it helps
- Note any considerations

\`\`\`
## Quick Exploration

[Your brief analysis—what you found, any considerations]

┌─────────────────────────────────────────┐
│   [Optional: ASCII diagram if helpful]  │
└─────────────────────────────────────────┘

Explore mode (\`/opsx:explore\`) is for this kind of thinking—investigating before implementing. You can use it anytime you need to think through a problem.

Now let's create a change to hold our work.
\`\`\`

**PAUSE** - Wait for user acknowledgment before proceeding.

---

## Phase 4: Create the Change

**EXPLAIN:**
\`\`\`
## Creating a Change

A "change" in OpenSpec is a container for all the thinking and planning around a piece of work. It lives in \`openspec/changes/<name>/\` and holds your artifacts—proposal, specs, design, tasks.

Let me create one for our task.
\`\`\`

**DO:** Create the change with a derived kebab-case name:
\`\`\`bash
openspec new change "<derived-name>"
\`\`\`

**SHOW:**
\`\`\`
Created: \`openspec/changes/<name>/\`

The folder structure:
\`\`\`
openspec/changes/<name>/
├── proposal.md    ← Why we're doing this (empty, we'll fill it)
├── design.md      ← How we'll build it (empty)
├── specs/         ← Detailed requirements (empty)
└── tasks.md       ← Implementation checklist (empty)
\`\`\`

Now let's fill in the first artifact—the proposal.
\`\`\`

---

## Phase 5: Proposal

**EXPLAIN:**
\`\`\`
## The Proposal

The proposal captures **why** we're making this change and **what** it involves at a high level. It's the "elevator pitch" for the work.

I'll draft one based on our task.
\`\`\`

**DO:** Draft the proposal content (don't save yet):

\`\`\`
Here's a draft proposal:

---

## Why

[1-2 sentences explaining the problem/opportunity]

## What Changes

[Bullet points of what will be different]

## Capabilities

### New Capabilities
- \`<capability-name>\`: [brief description]

### Modified Capabilities
<!-- If modifying existing behavior -->

## Impact

- \`src/path/to/file.ts\`: [what changes]
- [other files if applicable]

---

Does this capture the intent? I can adjust before we save it.
\`\`\`

**PAUSE** - Wait for user approval/feedback.

After approval, save the proposal:
\`\`\`bash
openspec instructions proposal --change "<name>" --json
\`\`\`
Then write the content to \`openspec/changes/<name>/proposal.md\`.

\`\`\`
Proposal saved. This is your "why" document—you can always come back and refine it as understanding evolves.

Next up: specs.
\`\`\`

---

## Phase 6: Specs

**EXPLAIN:**
\`\`\`
## Specs

Specs define **what** we're building in precise, testable terms. They use a requirement/scenario format that makes expected behavior crystal clear.

For a small task like this, we might only need one spec file.
\`\`\`

**DO:** Create the spec file:
\`\`\`bash
mkdir -p openspec/changes/<name>/specs/<capability-name>
\`\`\`

Draft the spec content:

\`\`\`
Here's the spec:

---

## ADDED Requirements

### Requirement: <Name>

<Description of what the system should do>

#### Scenario: <Scenario name>

- **WHEN** <trigger condition>
- **THEN** <expected outcome>
- **AND** <additional outcome if needed>

---

This format—WHEN/THEN/AND—makes requirements testable. You can literally read them as test cases.
\`\`\`

Save to \`openspec/changes/<name>/specs/<capability>/spec.md\`.

---

## Phase 7: Design

**EXPLAIN:**
\`\`\`
## Design

The design captures **how** we'll build it—technical decisions, tradeoffs, approach.

For small changes, this might be brief. That's fine—not every change needs deep design discussion.
\`\`\`

**DO:** Draft design.md:

\`\`\`
Here's the design:

---

## Context

[Brief context about the current state]

## Goals / Non-Goals

**Goals:**
- [What we're trying to achieve]

**Non-Goals:**
- [What's explicitly out of scope]

## Decisions

### Decision 1: [Key decision]

[Explanation of approach and rationale]

---

For a small task, this captures the key decisions without over-engineering.
\`\`\`

Save to \`openspec/changes/<name>/design.md\`.

---

## Phase 8: Tasks

**EXPLAIN:**
\`\`\`
## Tasks

Finally, we break the work into implementation tasks—checkboxes that drive the apply phase.

These should be small, clear, and in logical order.
\`\`\`

**DO:** Generate tasks based on specs and design:

\`\`\`
Here are the implementation tasks:

---

## 1. [Category or file]

- [ ] 1.1 [Specific task]
- [ ] 1.2 [Specific task]

## 2. Verify

- [ ] 2.1 [Verification step]

---

Each checkbox becomes a unit of work in the apply phase. Ready to implement?
\`\`\`

**PAUSE** - Wait for user to confirm they're ready to implement.

Save to \`openspec/changes/<name>/tasks.md\`.

---

## Phase 9: Apply (Implementation)

**EXPLAIN:**
\`\`\`
## Implementation

Now we implement each task, checking them off as we go. I'll announce each one and occasionally note how the specs/design informed the approach.
\`\`\`

**DO:** For each task:

1. Announce: "Working on task N: [description]"
2. Implement the change in the codebase
3. Reference specs/design naturally: "The spec says X, so I'm doing Y"
4. Mark complete in tasks.md: \`- [ ]\` → \`- [x]\`
5. Brief status: "✓ Task N complete"

Keep narration light—don't over-explain every line of code.

After all tasks:

\`\`\`
## Implementation Complete

All tasks done:
- [x] Task 1
- [x] Task 2
- [x] ...

The change is implemented! One more step—let's archive it.
\`\`\`

---

## Phase 10: Archive

**EXPLAIN:**
\`\`\`
## Archiving

When a change is complete, we archive it. This moves it from \`openspec/changes/\` to \`openspec/changes/archive/YYYY-MM-DD-<name>/\`.

Archived changes become your project's decision history—you can always find them later to understand why something was built a certain way.
\`\`\`

**DO:**
\`\`\`bash
openspec archive "<name>"
\`\`\`

**SHOW:**
\`\`\`
Archived to: \`openspec/changes/archive/YYYY-MM-DD-<name>/\`

The change is now part of your project's history. The code is in your codebase, the decision record is preserved.
\`\`\`

---

## Phase 11: Recap & Next Steps

\`\`\`
## Congratulations!

You just completed a full OpenSpec cycle:

1. **Explore** - Thought through the problem
2. **New** - Created a change container
3. **Proposal** - Captured WHY
4. **Specs** - Defined WHAT in detail
5. **Design** - Decided HOW
6. **Tasks** - Broke it into steps
7. **Apply** - Implemented the work
8. **Archive** - Preserved the record

This same rhythm works for any size change—a small fix or a major feature.

---

## Command Reference

| Command | What it does |
|---------|--------------|
| \`/opsx:explore\` | Think through problems before/during work |
| \`/opsx:new\` | Start a new change, step through artifacts |
| \`/opsx:ff\` | Fast-forward: create all artifacts at once |
| \`/opsx:continue\` | Continue working on an existing change |
| \`/opsx:apply\` | Implement tasks from a change |
| \`/opsx:verify\` | Verify implementation matches artifacts |
| \`/opsx:archive\` | Archive a completed change |

---

## What's Next?

Try \`/opsx:new\` or \`/opsx:ff\` on something you actually want to build. You've got the rhythm now!
\`\`\`

---

## Graceful Exit Handling

### User wants to stop mid-way

If the user says they need to stop, want to pause, or seem disengaged:

\`\`\`
No problem! Your change is saved at \`openspec/changes/<name>/\`.

To pick up where we left off later:
- \`/opsx:continue <name>\` - Resume artifact creation
- \`/opsx:apply <name>\` - Jump to implementation (if tasks exist)

The work won't be lost. Come back whenever you're ready.
\`\`\`

Exit gracefully without pressure.

### User just wants command reference

If the user says they just want to see the commands or skip the tutorial:

\`\`\`
## OpenSpec Quick Reference

| Command | What it does |
|---------|--------------|
| \`/opsx:explore\` | Think through problems (no code changes) |
| \`/opsx:new <name>\` | Start a new change, step by step |
| \`/opsx:ff <name>\` | Fast-forward: all artifacts at once |
| \`/opsx:continue <name>\` | Continue an existing change |
| \`/opsx:apply <name>\` | Implement tasks |
| \`/opsx:verify <name>\` | Verify implementation |
| \`/opsx:archive <name>\` | Archive when done |

Try \`/opsx:new\` to start your first change, or \`/opsx:ff\` if you want to move fast.
\`\`\`

Exit gracefully.

---

## Guardrails

- **Follow the EXPLAIN → DO → SHOW → PAUSE pattern** at key transitions (after explore, after proposal draft, after tasks, after archive)
- **Keep narration light** during implementation—teach without lecturing
- **Don't skip phases** even if the change is small—the goal is teaching the workflow
- **Pause for acknowledgment** at marked points, but don't over-pause
- **Handle exits gracefully**—never pressure the user to continue
- **Use real codebase tasks**—don't simulate or use fake examples
- **Adjust scope gently**—guide toward smaller tasks but respect user choice`;
}

/**
 * Template for openspec-archive-change skill
 * For archiving completed changes in the experimental workflow
 */
export function getArchiveChangeSkillTemplate(locale?: string): SkillTemplate {
  return {
    name: 'openspec-archive-change',
    description: 'Archive a completed change in the experimental workflow. Use when the user wants to finalize and archive a change after implementation is complete.',
    instructions: loadCoreTemplate('skills/openspec-archive-change.md', locale),
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'openspec', version: '1.0' },
  };
}


/**
 * Template for openspec-bulk-archive-change skill
 * For archiving multiple completed changes at once
 */
export function getBulkArchiveChangeSkillTemplate(locale?: string): SkillTemplate {
  return {
    name: 'openspec-bulk-archive-change',
    description: 'Archive multiple completed changes at once. Use when archiving several parallel changes.',
    instructions: loadCoreTemplate('skills/openspec-bulk-archive-change.md', locale),
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'openspec', version: '1.0' },
  };
}

// -----------------------------------------------------------------------------
// Slash Command Templates
// -----------------------------------------------------------------------------

export interface CommandTemplate {
  name: string;
  description: string;
  category: string;
  tags: string[];
  content: string;
}

/**
 * Template for /opsx:explore slash command
 * Explore mode - adaptive thinking partner
 */
export function getOpsxExploreCommandTemplate(): CommandTemplate {
  return {
    name: 'OPSX: Explore',
    description: 'Enter explore mode - think through ideas, investigate problems, clarify requirements',
    category: 'Workflow',
    tags: ['workflow', 'explore', 'experimental', 'thinking'],
    content: `Enter explore mode. Think deeply. Visualize freely. Follow the conversation wherever it goes.

**IMPORTANT: Explore mode is for thinking, not implementing.** You may read files, search code, and investigate the codebase, but you must NEVER write code or implement features. If the user asks you to implement something, remind them to exit explore mode first (e.g., start a change with \`/opsx:new\` or \`/opsx:ff\`). You MAY create OpenSpec artifacts (proposals, designs, specs) if the user asks—that's capturing thinking, not implementing.

**This is a stance, not a workflow.** There are no fixed steps, no required sequence, no mandatory outputs. You're a thinking partner helping the user explore.

**Input**: The argument after \`/opsx:explore\` is whatever the user wants to think about. Could be:
- A vague idea: "real-time collaboration"
- A specific problem: "the auth system is getting unwieldy"
- A change name: "add-dark-mode" (to explore in context of that change)
- A comparison: "postgres vs sqlite for this"
- Nothing (just enter explore mode)

---

## The Stance

- **Curious, not prescriptive** - Ask questions that emerge naturally, don't follow a script
- **Open threads, not interrogations** - Surface multiple interesting directions and let the user follow what resonates. Don't funnel them through a single path of questions.
- **Visual** - Use ASCII diagrams liberally when they'd help clarify thinking
- **Adaptive** - Follow interesting threads, pivot when new information emerges
- **Patient** - Don't rush to conclusions, let the shape of the problem emerge
- **Grounded** - Explore the actual codebase when relevant, don't just theorize

---

## What You Might Do

Depending on what the user brings, you might:

**Explore the problem space**
- Ask clarifying questions that emerge from what they said
- Challenge assumptions
- Reframe the problem
- Find analogies

**Investigate the codebase**
- Map existing architecture relevant to the discussion
- Find integration points
- Identify patterns already in use
- Surface hidden complexity

**Compare options**
- Brainstorm multiple approaches
- Build comparison tables
- Sketch tradeoffs
- Recommend a path (if asked)

**Visualize**
\`\`\`
┌─────────────────────────────────────────┐
│     Use ASCII diagrams liberally        │
├─────────────────────────────────────────┤
│                                         │
│   ┌────────┐         ┌────────┐        │
│   │ State  │────────▶│ State  │        │
│   │   A    │         │   B    │        │
│   └────────┘         └────────┘        │
│                                         │
│   System diagrams, state machines,      │
│   data flows, architecture sketches,    │
│   dependency graphs, comparison tables  │
│                                         │
└─────────────────────────────────────────┘
\`\`\`

**Surface risks and unknowns**
- Identify what could go wrong
- Find gaps in understanding
- Suggest spikes or investigations

---

## OpenSpec Awareness

You have full context of the OpenSpec system. Use it naturally, don't force it.

### Check for context

At the start, quickly check what exists:
\`\`\`bash
openspec list --json
\`\`\`

This tells you:
- If there are active changes
- Their names, schemas, and status
- What the user might be working on

If the user mentioned a specific change name, read its artifacts for context.

### When no change exists

Think freely. When insights crystallize, you might offer:

- "This feels solid enough to start a change. Want me to create one?"
  → Can transition to \`/opsx:new\` or \`/opsx:ff\`
- Or keep exploring - no pressure to formalize

### When a change exists

If the user mentions a change or you detect one is relevant:

1. **Read existing artifacts for context**
   - \`openspec/changes/<name>/proposal.md\`
   - \`openspec/changes/<name>/design.md\`
   - \`openspec/changes/<name>/tasks.md\`
   - etc.

2. **Reference them naturally in conversation**
   - "Your design mentions using Redis, but we just realized SQLite fits better..."
   - "The proposal scopes this to premium users, but we're now thinking everyone..."

3. **Offer to capture when decisions are made**

   | Insight Type | Where to Capture |
   |--------------|------------------|
   | New requirement discovered | \`specs/<capability>/spec.md\` |
   | Requirement changed | \`specs/<capability>/spec.md\` |
   | Design decision made | \`design.md\` |
   | Scope changed | \`proposal.md\` |
   | New work identified | \`tasks.md\` |
   | Assumption invalidated | Relevant artifact |

   Example offers:
   - "That's a design decision. Capture it in design.md?"
   - "This is a new requirement. Add it to specs?"
   - "This changes scope. Update the proposal?"

4. **The user decides** - Offer and move on. Don't pressure. Don't auto-capture.

---

## What You Don't Have To Do

- Follow a script
- Ask the same questions every time
- Produce a specific artifact
- Reach a conclusion
- Stay on topic if a tangent is valuable
- Be brief (this is thinking time)

---

## Ending Discovery

There's no required ending. Discovery might:

- **Flow into action**: "Ready to start? \`/opsx:new\` or \`/opsx:ff\`"
- **Result in artifact updates**: "Updated design.md with these decisions"
- **Just provide clarity**: User has what they need, moves on
- **Continue later**: "We can pick this up anytime"

When things crystallize, you might offer a summary - but it's optional. Sometimes the thinking IS the value.

---

## Guardrails

- **Don't implement** - Never write code or implement features. Creating OpenSpec artifacts is fine, writing application code is not.
- **Don't fake understanding** - If something is unclear, dig deeper
- **Don't rush** - Discovery is thinking time, not task time
- **Don't force structure** - Let patterns emerge naturally
- **Don't auto-capture** - Offer to save insights, don't just do it
- **Do visualize** - A good diagram is worth many paragraphs
- **Do explore the codebase** - Ground discussions in reality
- **Do question assumptions** - Including the user's and your own`
  };
}

/**
 * Template for /opsx:new slash command
 */
export function getOpsxNewCommandTemplate(locale?: string): CommandTemplate {
  return {
    name: 'OPSX: New',
    description: 'Start a new change using the experimental artifact workflow (OPSX)',
    category: 'Workflow',
    tags: ['workflow', 'artifacts', 'experimental'],
    content: loadCoreTemplate('opsx/new.md', locale),
  };
}

/**
 * Template for /opsx:continue slash command
 */
export function getOpsxContinueCommandTemplate(locale?: string): CommandTemplate {
  return {
    name: 'OPSX: Continue',
    description: 'Continue working on a change - create the next artifact (Experimental)',
    category: 'Workflow',
    tags: ['workflow', 'artifacts', 'experimental'],
    content: loadCoreTemplate('opsx/continue.md', locale),
  };
}

/**
 * Template for /opsx:apply slash command
 */
export function getOpsxApplyCommandTemplate(locale?: string): CommandTemplate {
  return {
    name: 'OPSX: Apply',
    description: 'Implement tasks from an OpenSpec change (Experimental)',
    category: 'Workflow',
    tags: ['workflow', 'artifacts', 'experimental'],
    content: loadCoreTemplate('opsx/apply.md', locale),
  };
}

/**
 * Template for /opsx:ff slash command
 */
export function getOpsxFfCommandTemplate(locale?: string): CommandTemplate {
  return {
    name: 'OPSX: Fast Forward',
    description: 'Create a change and generate all artifacts needed for implementation in one go',
    category: 'Workflow',
    tags: ['workflow', 'artifacts', 'experimental'],
    content: loadCoreTemplate('opsx/ff.md', locale),
  };
}

/**
 * Template for /opsx:sync slash command
 */
export function getOpsxSyncCommandTemplate(locale?: string): CommandTemplate {
  return {
    name: 'OPSX: Sync',
    description: 'Sync delta specs from a change to main specs',
    category: 'Workflow',
    tags: ['workflow', 'specs', 'experimental'],
    content: loadCoreTemplate('opsx/sync.md', locale),
  };
}

/**
 * Template for openspec-verify-change skill
 * For verifying implementation matches change artifacts before archiving
 */
export function getVerifyChangeSkillTemplate(locale?: string): SkillTemplate {
  return {
    name: 'openspec-verify-change',
    description: 'Verify implementation matches change artifacts. Use when the user wants to validate that implementation is complete, correct, and coherent before archiving.',
    instructions: loadCoreTemplate('skills/openspec-verify-change.md', locale),
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'openspec', version: '1.0' },
  };
}

/**
 * Template for /opsx:archive slash command
 */
export function getOpsxArchiveCommandTemplate(locale?: string): CommandTemplate {
  return {
    name: 'OPSX: Archive',
    description: 'Archive a completed change in the experimental workflow',
    category: 'Workflow',
    tags: ['workflow', 'archive', 'experimental'],
    content: loadCoreTemplate('opsx/archive.md', locale),
  };
}

/**
 * Template for /opsx:onboard slash command
 * Guided onboarding through the complete OpenSpec workflow
 */
export function getOpsxOnboardCommandTemplate(): CommandTemplate {
  return {
    name: 'OPSX: Onboard',
    description: 'Guided onboarding - walk through a complete OpenSpec workflow cycle with narration',
    category: 'Workflow',
    tags: ['workflow', 'onboarding', 'tutorial', 'learning'],
    content: getOnboardInstructions(),
  };
}

/**
 * Template for /opsx:bulk-archive slash command
 */
export function getOpsxBulkArchiveCommandTemplate(locale?: string): CommandTemplate {
  return {
    name: 'OPSX: Bulk Archive',
    description: 'Archive multiple completed changes at once',
    category: 'Workflow',
    tags: ['workflow', 'archive', 'experimental', 'bulk'],
    content: loadCoreTemplate('opsx/bulk-archive.md', locale),
  };
}

/**
 * Template for /opsx:verify slash command
 */
export function getOpsxVerifyCommandTemplate(locale?: string): CommandTemplate {
  return {
    name: 'OPSX: Verify',
    description: 'Verify implementation matches change artifacts before archiving',
    category: 'Workflow',
    tags: ['workflow', 'verify', 'experimental'],
    content: loadCoreTemplate('opsx/verify.md', locale),
  };
}
/**
 * Template for feedback skill
 * For collecting and submitting user feedback with context enrichment
 */
export function getFeedbackSkillTemplate(locale?: string): SkillTemplate {
  return {
    name: 'feedback',
    description: 'Collect and submit user feedback about OpenSpec with context enrichment and anonymization.',
    instructions: loadCoreTemplate('skills/feedback.md', locale),
    license: 'MIT',
    compatibility: 'Requires openspec CLI.',
    metadata: { author: 'openspec', version: '1.0' },
  };
}
