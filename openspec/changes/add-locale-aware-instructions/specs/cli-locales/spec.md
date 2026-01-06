## ADDED Requirements
### Requirement: Locale Validation Command
The CLI SHALL provide `openspec locales validate` to verify locale tags and translation coverage for instruction templates.

#### Scenario: Validate specific locale
- **WHEN** user executes `openspec locales validate --locale zh-Hans`
- **THEN** validate all required templates for `zh-Hans`
- **AND** exit with code 0 if complete or 1 if any templates are missing

#### Scenario: Validate all locales
- **WHEN** user executes `openspec locales validate --all`
- **THEN** validate every locale directory under `templates/`
- **AND** include schema template and overlay checks for each locale

#### Scenario: JSON output
- **WHEN** user executes `openspec locales validate --locale zh-Hans --json`
- **THEN** output JSON with missing template paths and summary status only

### Requirement: Locale Tag Validation
The locale validation command SHALL reject non-BCP-47 locale tags.

#### Scenario: Invalid locale tag
- **WHEN** user executes `openspec locales validate --locale not-a-locale`
- **THEN** display an error indicating the locale tag is invalid
- **AND** exit with code 1
