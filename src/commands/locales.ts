import { Command } from 'commander';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { isValidLocaleTag } from '../core/locale.js';
import { DEFAULT_LOCALE } from '../core/locale.js';
import { CORE_TEMPLATE_FILES, getPackageTemplatesDir } from '../core/templates/template-loader.js';
import { getSchemaDir, listSchemas } from '../core/artifact-graph/resolver.js';

interface LocaleValidationResult {
  locale: string;
  validTag: boolean;
  missing: string[];
}

function listLocaleDirectories(): string[] {
  const templatesDir = getPackageTemplatesDir();
  if (!fs.existsSync(templatesDir)) {
    return [];
  }

  return fs
    .readdirSync(templatesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith('.'))
    .sort();
}

function listSchemaBaseTemplates(schemaDir: string): string[] {
  const templatesDir = path.join(schemaDir, 'templates');
  if (!fs.existsSync(templatesDir)) {
    return [];
  }

  return fs
    .readdirSync(templatesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort();
}

function validateLocale(locale: string): LocaleValidationResult {
  const missing: string[] = [];
  const validTag = isValidLocaleTag(locale);

  if (!validTag) {
    return { locale, validTag, missing };
  }

  const templatesDir = getPackageTemplatesDir();
  for (const templatePath of CORE_TEMPLATE_FILES) {
    const candidate = path.join(templatesDir, locale, templatePath);
    if (!fs.existsSync(candidate)) {
      missing.push(path.relative(process.cwd(), candidate));
    }
  }

  for (const schemaName of listSchemas()) {
    const schemaDir = getSchemaDir(schemaName);
    if (!schemaDir) {
      continue;
    }

    const baseTemplates = listSchemaBaseTemplates(schemaDir);
    for (const template of baseTemplates) {
      if (locale === DEFAULT_LOCALE) {
        continue;
      }
      const localizedPath = path.join(schemaDir, 'templates', locale, template);
      if (!fs.existsSync(localizedPath)) {
        missing.push(path.relative(process.cwd(), localizedPath));
      }
    }

    if (locale !== DEFAULT_LOCALE) {
      const overlayPath = path.join(schemaDir, 'locales', `${locale}.yaml`);
      if (!fs.existsSync(overlayPath)) {
        missing.push(path.relative(process.cwd(), overlayPath));
      }
    }
  }

  return { locale, validTag, missing };
}

export function registerLocalesCommand(program: Command): void {
  const localesCmd = program
    .command('locales')
    .description('Validate locale templates and overlays');

  localesCmd
    .command('validate')
    .description('Validate locale tags and template coverage')
    .option('--locale <tag>', 'Validate a specific locale tag')
    .option('--all', 'Validate all locales under templates/')
    .option('--json', 'Output results as JSON')
    .action((options: { locale?: string; all?: boolean; json?: boolean }) => {
      if (!options.locale && !options.all) {
        console.error('Error: --locale or --all is required');
        process.exitCode = 1;
        return;
      }

      if (options.locale && options.all) {
        console.error('Error: Use either --locale or --all, not both');
        process.exitCode = 1;
        return;
      }

      const locales = options.locale
        ? [options.locale]
        : listLocaleDirectories();

      if (locales.length === 0) {
        console.error('Error: No locale directories found under templates/');
        process.exitCode = 1;
        return;
      }

      const results = locales.map(validateLocale);
      const hasFailures = results.some((result) => !result.validTag || result.missing.length > 0);

      if (options.json) {
        const output = {
          valid: !hasFailures,
          locales: results.map((result) => ({
            locale: result.locale,
            validTag: result.validTag,
            missing: result.missing,
          })),
        };
        console.log(JSON.stringify(output, null, 2));
        if (hasFailures) {
          process.exitCode = 1;
        }
        return;
      }

      for (const result of results) {
        if (!result.validTag) {
          console.error(`Invalid locale tag: ${result.locale}`);
          continue;
        }

        if (result.missing.length === 0) {
          console.log(`Locale ${result.locale}: OK`);
          continue;
        }

        console.error(`Locale ${result.locale}: Missing templates`);
        for (const missingPath of result.missing) {
          console.error(`  - ${missingPath}`);
        }
      }

      if (hasFailures) {
        process.exitCode = 1;
      }
    });
}
