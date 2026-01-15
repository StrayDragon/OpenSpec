import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getConfiguredLocale, getLocaleFallbackChain } from '../locale.js';

const templateCache = new Map<string, string>();

export const CORE_TEMPLATE_FILES = [
  'agents.md',
  'agents-root-stub.md',
  'project.md',
  'slash/proposal.md',
  'slash/apply.md',
  'slash/archive.md',
  'skills/openspec-new-change.md',
  'skills/openspec-continue-change.md',
  'skills/openspec-apply-change.md',
  'skills/openspec-verify-change.md',
  'skills/feedback.md',
  'opsx/new.md',
  'opsx/continue.md',
  'opsx/apply.md',
  'opsx/verify.md',
] as const;

export type CoreTemplatePath = typeof CORE_TEMPLATE_FILES[number];

export function getPackageTemplatesDir(): string {
  const currentFile = fileURLToPath(import.meta.url);
  return path.join(path.dirname(currentFile), '..', '..', '..', 'templates');
}

export function resolveCoreTemplatePath(
  relativePath: string,
  locale?: string
): string {
  const templatesDir = getPackageTemplatesDir();
  const resolvedLocale = locale ?? getConfiguredLocale();
  const fallbackChain = getLocaleFallbackChain(resolvedLocale);

  for (const candidate of fallbackChain) {
    const candidatePath = path.join(templatesDir, candidate, relativePath);
    if (fs.existsSync(candidatePath)) {
      return candidatePath;
    }
  }

  const defaultPath = path.join(templatesDir, relativePath);
  if (fs.existsSync(defaultPath)) {
    return defaultPath;
  }

  throw new Error(`Template not found: ${relativePath}`);
}

export function loadCoreTemplate(relativePath: string, locale?: string): string {
  const templatePath = resolveCoreTemplatePath(relativePath, locale);
  const cached = templateCache.get(templatePath);
  if (cached) {
    return cached;
  }

  const content = fs.readFileSync(templatePath, 'utf-8');
  templateCache.set(templatePath, content);
  return content;
}
