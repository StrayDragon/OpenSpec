## 1. Locale configuration
- [x] 1.1 Extend global config schema and defaults to include `locale` (BCP-47 string)
- [x] 1.2 Add locale resolution utility (canonicalization + fallback chain) with unit tests

## 2. Core template localization
- [x] 2.1 Move core instruction templates to locale-addressable files and add a loader with caching + English fallback
- [x] 2.2 Update init/update/configurator paths to use locale-aware templates (AGENTS, root stubs, slash commands, skills, project)

## 3. Schema localization
- [x] 3.1 Support locale-specific schema templates (`schemas/<schema>/templates/<locale>/`) with fallback
- [x] 3.2 Support locale overlays for schema text fields (`schemas/<schema>/locales/<locale>.yaml`) and update instruction loader to use them
- [x] 3.3 Add tests covering schema template and overlay fallback behavior

## 4. Locale validation command
- [x] 4.1 Add `openspec locales validate` with `--locale`, `--all`, and `--json` output options
- [x] 4.2 Validate BCP-47 tags and missing template coverage; ensure exit codes are non-zero on failure

## 5. Packaging and docs
- [x] 5.1 Ensure new template directories are included in npm packaging
- [x] 5.2 Update documentation/help to mention `locale` config and validation command

## 6. Validation
- [x] 6.1 Run `pnpm test` (or targeted tests) for locale resolution and template loading
