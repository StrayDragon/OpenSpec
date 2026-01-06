## Why
Teams need to run OpenSpec prompts in their preferred language to compare SDD outcomes across locales and to reduce translation friction. Today, all injected instructions and templates are hard-coded in English, making locale experiments impossible without forking the code.

## What Changes
- Add a `locale` setting to global config (BCP-47, default `en`) and expose it via `openspec config`.
- Introduce locale resolution + fallback so all OpenSpec-injected instruction content is selected by locale on every run.
- Move core instruction templates (AGENTS, root stubs, slash commands, skills, project template) into locale-addressable sources and wire the loaders to pick the configured locale with English fallback.
- Support localized schema templates and schema text overlays for `openspec instructions` output.
- Add a `openspec locales validate` command to verify locale tags and template completeness for automation.

## Impact
- Affected specs: global-config, cli-config, cli-init, cli-update, instruction-loader, new instruction-localization, new cli-locales
- Affected code: src/core/global-config.ts, src/core/config-schema.ts, src/commands/config.ts, src/core/templates/*, src/core/update.ts, src/core/init.ts, src/core/configurators/*, src/core/artifact-graph/*, src/commands/artifact-workflow.ts, src/cli/index.ts
- New assets: locale template directories, schema locale overlay files
