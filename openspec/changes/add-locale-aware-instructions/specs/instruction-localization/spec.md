## ADDED Requirements
### Requirement: Locale Resolution
The system SHALL resolve the instruction locale from global configuration, defaulting to `en` and enforcing BCP-47 locale tags.

#### Scenario: No locale configured
- **WHEN** global config has no `locale` value
- **THEN** the resolved locale is `en`

#### Scenario: Invalid locale configured
- **WHEN** global config `locale` is not a valid BCP-47 tag
- **THEN** the resolved locale is `en`

#### Scenario: Fallback chain
- **WHEN** global config `locale` is `zh-Hans-CN`
- **THEN** the fallback chain is `zh-Hans-CN` → `zh-Hans` → `zh` → `en`

### Requirement: Core Template Localization
The system SHALL load core instruction templates (AGENTS, root stubs, project template, slash commands, skills) from `templates/<locale>/` using the resolved locale and fallback chain.

#### Scenario: Localized core template exists
- **WHEN** resolved locale is `zh-Hans`
- **AND** `templates/zh-Hans/agents.md` exists
- **THEN** the localized template is used

#### Scenario: Localized core template missing
- **WHEN** resolved locale is `zh-Hans`
- **AND** `templates/zh-Hans/agents.md` is missing
- **THEN** the system falls back to `templates/en/agents.md`
