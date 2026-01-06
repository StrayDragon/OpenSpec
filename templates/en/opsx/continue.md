Continue working on a change by creating the next artifact.

**Input**: Optionally specify `--change <name>` after `/opsx:continue`. If omitted, MUST prompt for available changes.

**Steps**

1. **If no change name provided, prompt for selection**

   Run `openspec list --json` to get available changes sorted by most recently modified. Then use the **AskUserQuestion tool** to let the user select which change to work on.

   Present the top 3-4 most recently modified changes as options, showing:
   - Change name
   - Status (e.g., "0/5 tasks", "complete", "no tasks")
   - How recently it was modified (from `lastModified` field)

   Mark the most recently modified change as "(Recommended)" since it's likely what the user wants to continue.

   **IMPORTANT**: Do NOT guess or auto-select a change. Always let the user choose.

2. **Check current status**
   ```bash
   openspec status --change "<name>" --json
   ```
   Parse the JSON to understand current state.

3. **Act based on status**:

   ---

   **If all artifacts are complete (`isComplete: true`)**:
   - Congratulate the user
   - Show final status
   - Suggest: "All artifacts created! You can now implement this change or archive it."
   - STOP

   ---

   **If artifacts are ready to create** (status shows artifacts with `status: "ready"`):
   - Pick the FIRST artifact with `status: "ready"` from the status output
   - Get its instructions:
     ```bash
     openspec instructions <artifact-id> --change "<name>" --json
     ```
   - Parse the JSON to get template, dependencies, and what it unlocks
   - **Create the artifact file** using the template as a starting point:
     - Read any completed dependency files for context
     - Fill in the template based on context and user's goals
     - Write to the output path specified in instructions
   - Show what was created and what's now unlocked
   - STOP after creating ONE artifact

   ---

   **If no artifacts are ready (all blocked)**:
   - This shouldn't happen with a valid schema
   - Show status and suggest checking for issues

4. **After creating an artifact, show progress**
   ```bash
   openspec status --change "<name>"
   ```

**Output**

After each invocation, show:
- Which artifact was created
- Current progress (N/M complete)
- What artifacts are now unlocked
- Prompt: "Run `/opsx:continue` to create the next artifact"

**Artifact Creation Guidelines**

When filling in templates:

- **proposal.md**: Ask user about the change if not clear. Fill in Why, What Changes, Capabilities, Impact.
  - **IMPORTANT**: The Capabilities section is critical. Before filling it in:
    - Check `openspec/specs/` for existing capabilities
    - List new capabilities with kebab-case names (e.g., `user-auth`, `data-export`)
    - List modified capabilities that need spec updates
  - Each capability listed will need a corresponding spec file in the next phase.
- **specs/*.md**: Create one spec per capability listed in the proposal. Use `specs/<capability-name>/spec.md` path.
- **design.md**: Document technical decisions, architecture, and implementation approach.
- **tasks.md**: Break down implementation into checkboxed tasks based on specs and design.

**Guardrails**
- Create ONE artifact per invocation
- Always read dependency artifacts before creating a new one
- Never skip artifacts or create out of order
- If context is unclear, ask the user before creating
- Verify the artifact file exists after writing before marking progress
