## ADDED Requirements
### Requirement: Locale-Aware Generated Templates
The init command SHALL select localized templates for OpenSpec-generated files based on the configured locale, falling back to English for any missing localized templates.

#### Scenario: Locale-specific templates present
- **WHEN** global config `locale` is set to `zh-Hans`
- **AND** localized templates exist for `openspec/AGENTS.md`, `project.md`, and slash commands
- **THEN** `openspec init` generates those files using the `zh-Hans` templates

#### Scenario: Locale-specific template missing
- **WHEN** global config `locale` is set to `zh-Hans`
- **AND** a localized template is missing for a file being generated
- **THEN** `openspec init` falls back to the English template for that file
