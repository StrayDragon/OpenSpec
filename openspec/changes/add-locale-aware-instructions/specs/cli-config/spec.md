## ADDED Requirements
### Requirement: Locale Configuration
The config command SHALL allow reading and writing the `locale` key as a BCP-47 locale tag.

#### Scenario: Set locale
- **WHEN** user executes `openspec config set locale zh-Hans`
- **THEN** store the value as a string
- **AND** display a confirmation message

#### Scenario: Get locale
- **WHEN** user executes `openspec config get locale`
- **THEN** print the configured locale value as a raw string

#### Scenario: Reject invalid locale
- **WHEN** user executes `openspec config set locale not-a-locale`
- **THEN** display an error indicating the locale is invalid
- **AND** do not modify the config file
- **AND** exit with code 1
