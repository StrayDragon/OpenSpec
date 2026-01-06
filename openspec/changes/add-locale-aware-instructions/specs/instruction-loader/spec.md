## ADDED Requirements
### Requirement: Localized Template Loading
The system SHALL load locale-specific schema templates based on the resolved locale, falling back to the default templates when localized templates are missing.

#### Scenario: Localized template exists
- **WHEN** instructions are generated with resolved locale `zh-Hans`
- **AND** `schemas/<schema>/templates/zh-Hans/<template>` exists
- **THEN** the localized template content is used

#### Scenario: Localized template missing
- **WHEN** instructions are generated with resolved locale `zh-Hans`
- **AND** `schemas/<schema>/templates/zh-Hans/<template>` is missing
- **THEN** the system falls back to `schemas/<schema>/templates/<template>`

### Requirement: Localized Schema Text
The system SHALL apply locale-specific schema overlays for schema and artifact text fields used in instructions.

#### Scenario: Locale overlay exists
- **WHEN** instructions are generated with resolved locale `zh-Hans`
- **AND** `schemas/<schema>/locales/zh-Hans.yaml` exists
- **THEN** schema and artifact `description`/`instruction` fields use the overlay values

#### Scenario: Locale overlay missing
- **WHEN** instructions are generated with resolved locale `zh-Hans`
- **AND** the locale overlay file is missing
- **THEN** schema and artifact text fall back to the base schema values
