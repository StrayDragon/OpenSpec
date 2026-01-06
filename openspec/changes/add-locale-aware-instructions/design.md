## Context
OpenSpec currently injects English-only instruction content via hard-coded templates (AGENTS.md, root stubs, slash commands, skill templates, schema templates/instructions). Global configuration exists, but it does not support locale selection, and there is no way to validate translation coverage.

## Goals / Non-Goals
- Goals:
  - Allow users to set a BCP-47 `locale` in global config and have all injected instruction content honor it on every run.
  - Provide a clear directory structure for localized templates so translations can be added without editing TypeScript.
  - Provide a CLI validation command to confirm locale tags and translation completeness in automation.
- Non-Goals:
  - Translating content in this change.
  - Localizing CLI runtime output (errors, prompts, logs).
  - Supporting non-BCP-47 locale tags or automatic language detection.

## Decisions
- Decision: Add `locale` to global config with default `en`.
  - Validate using BCP-47 canonicalization (e.g., `Intl.getCanonicalLocales`) and treat invalid values as `en` during resolution.
- Decision: Resolve locale with a fallback chain.
  - Example: `zh-Hans-CN` → `zh-Hans` → `zh` → `en`.
- Decision: Use file-based templates for localization.
  - Core instruction templates live under `templates/<locale>/`:
    - `templates/<locale>/agents.md`
    - `templates/<locale>/agents-root-stub.md`
    - `templates/<locale>/project.md`
    - `templates/<locale>/slash/proposal.md`
    - `templates/<locale>/slash/apply.md`
    - `templates/<locale>/slash/archive.md`
    - `templates/<locale>/skills/openspec-new-change.md`
    - `templates/<locale>/skills/openspec-continue-change.md`
    - `templates/<locale>/skills/openspec-apply-change.md`
  - Schema templates are localized by path:
    - `schemas/<schema>/templates/<locale>/<template>` (e.g., `proposal.md`).
  - Schema text fields (schema `description` plus artifact `description`/`instruction`) are localized via overlays:
    - `schemas/<schema>/locales/<locale>.yaml`, merged onto base schema by `id`.
- Decision: Add `openspec locales validate`.
  - Validates locale tags (BCP-47) and checks that all required template files exist for each locale.
  - Supports `--locale <tag>` for targeted checks and `--json` for automation.

## Translation Inventory
The following OpenSpec-injected content requires localization to fully cover agent prompts:
- Core instruction templates: `templates/<locale>/agents.md`, `templates/<locale>/agents-root-stub.md`, `templates/<locale>/project.md`.
- Slash command templates: `templates/<locale>/slash/{proposal,apply,archive}.md`.
- Skill templates: `templates/<locale>/skills/{openspec-new-change,openspec-continue-change,openspec-apply-change}.md`.
- Schema templates: `schemas/<schema>/templates/<locale>/*.md` for each schema (`spec-driven`, `tdd`).
- Schema text overlays: `schemas/<schema>/locales/<locale>.yaml` (schema/artefact descriptions and instructions).

## Risks / Trade-offs
- Additional file I/O for template loading; mitigate with in-memory caching of loaded templates per run.
- Translation drift versus English base; mitigate with `openspec locales validate` in CI.
- Packaging: new template directories must be included in the npm `files` list.

## Migration Plan
- Default to English when `locale` is missing or invalid.
- Existing config files continue to work (new field is optional).
- Add locale validation command for CI and translation workflows.

## Open Questions
- None.
