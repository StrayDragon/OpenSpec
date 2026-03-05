import * as fs from 'node:fs';
import * as path from 'node:path';
import { describe, expect, it } from 'vitest';

function listTemplateFiles(locale: string): string[] {
  const rootDir = path.join(process.cwd(), 'templates', locale);
  const files: string[] = [];

  function walk(dir: string, relativeBase: string): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;
      const relativePath = relativeBase ? `${relativeBase}/${entry.name}` : entry.name;
      const absolutePath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(absolutePath, relativePath);
        continue;
      }
      if (entry.isFile()) {
        files.push(relativePath);
      }
    }
  }

  walk(rootDir, '');
  return files.sort();
}

function readTemplate(locale: string, relativePath: string): string {
  return fs.readFileSync(path.join(process.cwd(), 'templates', locale, ...relativePath.split('/')), 'utf-8');
}

function uniqueMatches(text: string, pattern: RegExp): string[] {
  return Array.from(new Set(text.match(pattern) ?? [])).sort();
}

function missingFrom(source: string[], target: string[]): string[] {
  return source.filter((value) => !target.includes(value));
}

const TAG_PATTERN = /<[a-zA-Z_][a-zA-Z0-9_:-]*>/g;
const OPSX_PATTERN = /\/opsx:[a-z-]+/g;
const SKILL_PATTERN = /openspec-[a-z-]+/g;
const CODE_FENCE_PATTERN = /^```/gm;

describe('locale template token parity', () => {
  const enFiles = listTemplateFiles('en');
  const zhFiles = listTemplateFiles('zh-Hans');

  it('keeps zh-Hans file coverage aligned with en', () => {
    expect(missingFrom(enFiles, zhFiles)).toEqual([]);
  });

  for (const relativePath of enFiles) {
    it(`preserves non-translatable tokens for ${relativePath}`, () => {
      const en = readTemplate('en', relativePath);
      const zh = readTemplate('zh-Hans', relativePath);

      const enOpsxCommands = uniqueMatches(en, OPSX_PATTERN);
      const zhOpsxCommands = uniqueMatches(zh, OPSX_PATTERN);
      expect(missingFrom(enOpsxCommands, zhOpsxCommands)).toEqual([]);

      const enSkillNames = uniqueMatches(en, SKILL_PATTERN);
      const zhSkillNames = uniqueMatches(zh, SKILL_PATTERN);
      expect(missingFrom(enSkillNames, zhSkillNames)).toEqual([]);

      const enTags = uniqueMatches(en, TAG_PATTERN);
      const zhTags = uniqueMatches(zh, TAG_PATTERN);
      expect(missingFrom(enTags, zhTags)).toEqual([]);

      const enFenceCount = (en.match(CODE_FENCE_PATTERN) ?? []).length;
      const zhFenceCount = (zh.match(CODE_FENCE_PATTERN) ?? []).length;
      expect(zhFenceCount).toBe(enFenceCount);
    });
  }
});

