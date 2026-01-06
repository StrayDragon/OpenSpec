## ADDED Requirements
### Requirement: Locale Configuration Field
The system SHALL support an optional top-level `locale` value in global configuration for selecting localized instruction content.

#### Scenario: Locale stored in config
- **WHEN** `config.json` contains `{ "locale": "zh-Hans" }`
- **THEN** `getGlobalConfig()` returns a configuration with `locale` set to `zh-Hans`

## MODIFIED Requirements
### Requirement: Default Configuration
The system SHALL provide a default configuration that is used when no config file exists.

#### Scenario: Default config structure
- **WHEN** no config file exists
- **THEN** the default configuration includes an empty `featureFlags` object
- **AND** the default configuration sets `locale` to `en`
