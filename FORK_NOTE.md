# Fork Notes

> 先 rebase，再只看 locale 相关四个关键文件冲突，最后跑 `openspec locales validate --all --json` + 四个定向测试。

This file records fork-specific changes and environment caveats.
Read this before making changes or running automation in this fork.

## Current Fork Changes

- Fork objective is locale-first with low-intrusion behavior:
  - Provide Chinese-equivalent prompts/skills/templates for injected content
  - Keep default English behavior as fallback
  - Minimize invasive diffs to ease recurring upstream rebase/merge
- Locale support added for core templates and schema overlays:
  - `src/core/locale.ts`
  - `src/commands/locales.ts`
  - `src/core/templates/template-loader.ts`
- Localized templates added under `templates/en` and `templates/zh-Hans` (including /opsx:verify, /opsx:bulk-archive, and feedback/bulk-archive skill templates), plus schema locale files:
  - `schemas/spec-driven/locales/zh-Hans.yaml`
  - `schemas/tdd/locales/zh-Hans.yaml`
- Verify/feedback templates wired into locale-aware core templates:
  - `templates/en/opsx/verify.md`
  - `templates/en/skills/openspec-verify-change.md`
  - `templates/en/skills/feedback.md`
  - `templates/zh-Hans/opsx/verify.md`
  - `templates/zh-Hans/skills/openspec-verify-change.md`
  - `templates/zh-Hans/skills/feedback.md`
  - `src/core/shared/skill-generation.ts`
- Telemetry disabled by default in CLI:
  - `src/telemetry/index.ts`
- Locale documentation updated with required template coverage:
  - `LOCALES.md`
- 2026-02-07 locale parity completion (non-invasive):
  - Added locale-overridable loading for `explore`/`onboard` skill+command content at generation layer:
    - `src/core/shared/skill-generation.ts`
  - Extended required core template inventory for locale validation:
    - `src/core/templates/template-loader.ts`
    - `LOCALES.md`
  - Added template files for `explore`/`onboard` in both locales:
    - `templates/en/skills/openspec-explore.md`
    - `templates/en/skills/openspec-onboard.md`
    - `templates/en/opsx/explore.md`
    - `templates/en/opsx/onboard.md`
    - `templates/zh-Hans/skills/openspec-explore.md`
    - `templates/zh-Hans/skills/openspec-onboard.md`
    - `templates/zh-Hans/opsx/explore.md`
    - `templates/zh-Hans/opsx/onboard.md`
  - Localized `instructions apply` runtime instruction/messages for zh locales:
    - `src/commands/workflow/instructions.ts`
- CI/test stability tweaks for the fork (pnpm version alignment and CLI build fixes):
  - `.github/workflows/ci.yml`
  - `test/helpers/run-cli.ts`
  - `vitest.setup.ts`

## Upstream Sync Guardrails (Locale Fork)

This fork intentionally keeps locale support as a thin overlay. During rebase/merge,
prioritize preserving this behavior with minimal divergence from upstream:

1. Keep locale behavior additive, not replacing upstream defaults
   - English content remains the default/fallback path
   - Locale-specific behavior should resolve through template loading and fallback chain

2. Watch these files first for conflicts/regressions
   - `src/core/shared/skill-generation.ts` (skill/command template locale override hook)
   - `src/core/templates/template-loader.ts` (`CORE_TEMPLATE_FILES` inventory)
   - `src/commands/workflow/instructions.ts` (apply instruction locale output)
   - `LOCALES.md` (required template list)

3. Preserve template parity across locales for injected content
   - For every required path under `templates/en/...`, maintain equivalent `templates/zh-Hans/...`
   - Especially for opsx/skills that are generated into user projects

4. Post-rebase verification checklist (must run)
   - `openspec locales validate --all --json`
   - Targeted tests:
     - `test/core/locale.test.ts`
     - `test/core/shared/skill-generation.test.ts`
     - `test/core/artifact-graph/instruction-loader.test.ts`
     - `test/commands/artifact-workflow.test.ts`
   - Quick E2E smoke:
     - set locale to `zh-Hans`
     - run `openspec init --tools claude --force` in temp dir
     - verify generated skills + opsx command content are zh-Hans

5. If upstream later introduces native locale support for these paths
   - Prefer adopting upstream mechanism and deleting fork-only glue where possible
   - Keep behavior equivalent: zh-Hans prompts/skills remain complete and fallback-safe

## Upstream Sync

- 2026-02-17: Rebased onto `upstream/main` at `4108563`.
  - Upstream: split skill templates into workflow modules and added parity tests:
    - `src/core/templates/workflows/*.ts`
    - `test/core/templates/skill-templates-parity.test.ts`
  - Upstream: added Kiro CLI support:
    - `src/core/command-generation/adapters/kiro.ts`
    - `docs/supported-tools.md`
  - Upstream: bulk-archived completed changes and added source spec normalization test:
    - `openspec/changes/archive/*`
    - `test/specs/source-specs-normalization.test.ts`
  - Fork: kept upstream `src/core/templates/skill-templates.ts` facade during rebase and ensured locale templates still load via `src/core/shared/skill-generation.ts`.
- 2026-02-07: Completed locale parity for injected prompts/skills with low-intrusion overlay approach.
  - Added zh-Hans + en template files for `explore`/`onboard` skills and opsx commands.
  - Added generator-level locale overrides for `explore`/`onboard` with fallback to upstream default strings.
  - Localized `instructions apply` runtime instruction text for zh locales.
  - Verified via `openspec locales validate --all --json` and targeted tests.
- 2026-02-04: Fetched `upstream/main` (still at `62d4391`) and rebased; no new upstream commits since 2026-02-03.
- 2026-02-03: Rebased onto `upstream/main` at `62d4391`. Upstream change improves Windows test compatibility:
  - `test/commands/spec.test.ts` now reads spec content via `fs.readFile` (no Unix `cat`).
  - `test/commands/validate.enriched-output.test.ts` avoids shell `mkdir -p`/`bash` in favor of `fs` helpers.
  - `test/utils/file-system.test.ts` skips symlink test on Windows (admin-only).
- 2026-02-02: Fetched `upstream/main` (now at `4573c28`) and began rebase. Notable upstream changes since `26ed336` include:
  - Onboarding improvements: fixed preflight check, added Windows PowerShell command alternatives, and corrected archive path guidance.
  - Archive workflow fixes: fallback to copy+remove on EPERM/EXDEV and updated sync/command hints in workflow completion messaging.
  - Removed TDD schema and references; clarified spec naming conventions and task checkbox format.
  - Command/docs updates: OpenCode command reference hyphen format, Windsurf workflow path updates, and migration guide refresh.
  - Misc: global paths support for Codex command generation, plus assorted docs/CI maintenance and releases (v1.1.0/v1.1.1).
- 2026-01-31: Unable to fetch `upstream/main` in this environment (HTTPS connections time out), so no rebase performed. Last known upstream ref remains `26ed336`.
- 2026-01-25: Rebased onto `upstream/main` at `26ed336` (v0.23.0+). New upstream items include:
  - parseTasksFile regex handles trailing whitespace in task lines
  - generateApplyInstructions passes the missing projectRoot param to resolveSchema
- 2026-01-24: Rebased onto `upstream/main` at `847aa81` (v0.23.0+). New upstream items include:
  - Unified init/experimental flow with interactive setup UI and refresh detection
  - Artifact workflow refactor into modular workflow commands and shared helpers
  - Agent Skills spec optional metadata fields
  - README cleanup/revert and minor doc/script maintenance
- 2026-01-22: Rebased onto `upstream/main` at `d485281` (v0.23.0+). New upstream items include:
  - Bulk-archive skill + `/opsx:bulk-archive` support
  - Experimental setup simplification and config creation fixes
  - Instructions JSON output split into context/rules/template fields
  - Multi-provider skill generation support
  - Release workflow tweaks and minor doc/link cleanups
- 2026-01-20: Rebased onto `upstream/main` at `8332a09` (v0.22.0). New upstream items include:
  - Project-level config support (`openspec/config.yaml`) with prompts, schema updates, and tests
  - Project-local schemas and schema management CLI (schema init/validate/which/fork) with docs/tests
  - CI/release workflow tweaks and changelog updates
- 2026-01-17: Rebased onto `upstream/main` at `ed4d965` (v0.20.0). New upstream items include:
  - Nix flake support (`flake.nix`, `flake.lock`) plus update-flake automation
  - Nix CI validation updates and related workflow tweaks
  - New OpenSpec change records documenting the Nix features
## Test Caveats (Sandbox/Root)

These tests fail in the current sandbox/root environment because permission checks
return writable when running as root. Ignore them locally; they pass in CI:

- `test/utils/file-system.test.ts`
  - canWriteFile should return false for read-only file
  - canWriteFile should return false for read-only directory
- `test/core/completions/installers/fish-installer.test.ts`
  - permission error scenarios
- `test/core/completions/installers/powershell-installer.test.ts`
  - permission error scenarios

If you need a clean local run, use a non-root environment or rely on GitHub Actions.

## Telemetry and Network

Sandbox runs do not have network access. Set `OPENSPEC_TELEMETRY=0` to avoid
PostHog network warnings during CLI commands.

## Known Issue (Upstream)

Upstream lacks the file-based core templates for opsx/skill workflows (ff/sync/archive/bulk-archive/verify).
This fork adds them under `templates/en` and `templates/zh-Hans`, so the issue
does not apply here.
