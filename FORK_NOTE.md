# Fork Notes

This file records fork-specific changes and environment caveats.
Read this before making changes or running automation in this fork.

## Current Fork Changes

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
  - `src/core/templates/skill-templates.ts`
- Telemetry disabled by default in CLI:
  - `src/telemetry/index.ts`
- Locale documentation updated with required template coverage:
  - `LOCALES.md`
- CI/test stability tweaks for the fork (pnpm version alignment and CLI build fixes):
  - `.github/workflows/ci.yml`
  - `test/helpers/run-cli.ts`
  - `vitest.setup.ts`

## Upstream Sync

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
