## ADDED Requirements
### Requirement: Locale-Aware Instruction Updates
The update command SHALL refresh instruction templates using the configured locale, falling back to English for any missing localized templates.

#### Scenario: Locale-specific templates present
- **WHEN** global config `locale` is set to `zh-Hans`
- **AND** localized templates exist for `openspec/AGENTS.md`, root stubs, and slash commands
- **THEN** `openspec update` refreshes those files using the `zh-Hans` templates

#### Scenario: Locale-specific template missing
- **WHEN** global config `locale` is set to `zh-Hans`
- **AND** a localized template is missing for a file being refreshed
- **THEN** `openspec update` falls back to the English template for that file
