# Fork Notes

This file records fork-specific changes and environment caveats.
Read this before making changes or running automation in this fork.

## Current Fork Changes

- Localized templates added for `/opsx:verify` and feedback skills:
  - `templates/en/opsx/verify.md`
  - `templates/en/skills/openspec-verify-change.md`
  - `templates/en/skills/feedback.md`
  - `templates/zh-Hans/opsx/verify.md`
  - `templates/zh-Hans/skills/openspec-verify-change.md`
  - `templates/zh-Hans/skills/feedback.md`
- Template loading updated to use locale-aware core templates for verify/feedback:
  - `src/core/templates/skill-templates.ts`
  - `src/core/templates/template-loader.ts`
- Locale documentation updated with new required templates:
  - `LOCALES.md`

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

`openspec artifact-experimental-setup` currently fails because the template
`skills/openspec-ff-change.md` is missing from `templates/`. This is an upstream
issue; avoid using that command unless the missing template is added.
