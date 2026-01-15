# Locales

This document explains how to configure locale-aware instruction templates and
how to add new locale content for OpenSpec.

## Configure Locale

OpenSpec stores the locale in the global config file.

- Show config path: `openspec config path`
- Set locale: `openspec config set locale zh-Hans`
- Get locale: `openspec config get locale`
- Reset to default: `openspec config unset locale`
- View full config: `openspec config list`

Default locale is `en`. Invalid locale tags are rejected by `openspec config set`.

## Locale Tags (BCP-47)

OpenSpec accepts BCP-47 locale tags only.

Examples:
- `en`
- `zh`
- `zh-Hans`
- `zh-Hans-CN`

## Fallback Chain

Locale resolution falls back by progressively stripping subtags, then to `en`.

Example:

```
zh-Hans-CN -> zh-Hans -> zh -> en
```

## Core Templates

Core instruction templates live under `templates/<locale>/`.
These are injected into AGENTS, root stubs, slash commands, and skills.

Required core template paths:

```
templates/<locale>/agents.md
templates/<locale>/agents-root-stub.md
templates/<locale>/project.md
templates/<locale>/slash/proposal.md
templates/<locale>/slash/apply.md
templates/<locale>/slash/archive.md
templates/<locale>/skills/openspec-new-change.md
templates/<locale>/skills/openspec-continue-change.md
templates/<locale>/skills/openspec-apply-change.md
templates/<locale>/skills/openspec-verify-change.md
templates/<locale>/skills/feedback.md
templates/<locale>/opsx/new.md
templates/<locale>/opsx/continue.md
templates/<locale>/opsx/apply.md
templates/<locale>/opsx/verify.md
```

## Schema Templates

Schema templates can be localized per schema:

```
schemas/<schema>/templates/<locale>/*.md
```

Example:

```
schemas/spec-driven/templates/zh-Hans/proposal.md
```

If a localized template is missing, OpenSpec falls back to the base schema
template in `schemas/<schema>/templates/`.

## Schema Locale Overlays

Schema descriptions and artifact instructions can be localized via overlays.

Path:

```
schemas/<schema>/locales/<locale>.yaml
```

Example:

```
schema:
  description: Localized schema description
artifacts:
  proposal:
    description: Localized proposal description
    instruction: Localized instruction
```

Overlay files are optional. If not present, OpenSpec uses the base schema text.

## Validate Locale Coverage

Use the validation command in automation to confirm coverage:

```
openspec locales validate --locale zh-Hans
openspec locales validate --all --json
```

This checks:
- Locale tag validity (BCP-47)
- Missing core templates for each locale
- Missing schema templates and overlays for each locale

Exit code is non-zero on failure.

## Translation Inventory

To fully localize injected instructions, translate:

- Core templates under `templates/<locale>/`
- Schema templates under `schemas/<schema>/templates/<locale>/`
- Schema overlays under `schemas/<schema>/locales/<locale>.yaml`

## Notes

- Locale applies to injected instruction content only.
- CLI runtime output (errors, prompts) is not localized.
- After adding translations, run `openspec update` to refresh instruction files.
