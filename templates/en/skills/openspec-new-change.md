Start a new change using the experimental artifact-driven approach.

**Input**: The user's request should include a change name (kebab-case) OR a description of what they want to build.

**Steps**

1. **If no clear input provided, ask what they want to build**

   Use the **AskUserQuestion tool** (open-ended, no preset options) to ask:
   > "What change do you want to work on? Describe what you want to build or fix."

   From their description, derive a kebab-case name (e.g., "add user authentication" → `add-user-auth`).

   **IMPORTANT**: Do NOT proceed without understanding what the user wants to build.

2. **Create the change directory**
   ```bash
   openspec new change "<name>"
   ```
   This creates a scaffolded change at `openspec/changes/<name>/`.

3. **Show the artifact status**
   ```bash
   openspec status --change "<name>"
   ```
   This shows which artifacts need to be created and which are ready (dependencies satisfied).

4. **Get instructions for the first artifact**
   The first artifact is always `proposal` (no dependencies).
   ```bash
   openspec instructions proposal --change "<name>"
   ```
   This outputs the template and context for creating the proposal.

5. **STOP and wait for user direction**

**Output**

After completing the steps, summarize:
- Change name and location
- Current status (0/4 artifacts complete)
- The template for the proposal artifact
- Prompt: "Ready to create the proposal? Just describe what this change is about and I'll draft the proposal, or ask me to continue."

**Guardrails**
- Do NOT create any artifacts yet - just show the instructions
- Do NOT advance beyond showing the proposal template
- If the name is invalid (not kebab-case), ask for a valid name
- If a change with that name already exists, suggest continuing that change instead
