import * as fs from 'node:fs';
import * as path from 'node:path';
import { describe, expect, it } from 'vitest';

const STRICT_TEMPLATE_PATHS = [
  'opsx/onboard.md',
  'skills/openspec-onboard.md',
  'opsx/explore.md',
  'skills/openspec-explore.md',
] as const;

function readTemplate(locale: string, relativePath: string): string {
  return fs.readFileSync(path.join(process.cwd(), 'templates', locale, relativePath), 'utf-8');
}

function uniqueMatches(text: string, pattern: RegExp): string[] {
  return Array.from(new Set(text.match(pattern) ?? [])).sort();
}

function missingFrom(source: string[], target: string[]): string[] {
  return source.filter((value) => !target.includes(value));
}

describe('locale template structural parity', () => {
  for (const relativePath of STRICT_TEMPLATE_PATHS) {
    it(`keeps zh-Hans aligned with en for ${relativePath}`, () => {
      const en = readTemplate('en', relativePath);
      const zh = readTemplate('zh-Hans', relativePath);

      const enLineCount = en.split('\n').length;
      const zhLineCount = zh.split('\n').length;
      expect(zhLineCount).toBeGreaterThanOrEqual(Math.floor(enLineCount * 0.85));

      const headingPattern = /^##+\s+/gm;
      const codeFencePattern = /^```/gm;
      expect((zh.match(headingPattern) ?? []).length).toBe((en.match(headingPattern) ?? []).length);
      expect((zh.match(codeFencePattern) ?? []).length).toBe((en.match(codeFencePattern) ?? []).length);

      const enOpsxCommands = uniqueMatches(en, /\/opsx:[a-z-]+/g);
      const zhOpsxCommands = uniqueMatches(zh, /\/opsx:[a-z-]+/g);
      expect(missingFrom(enOpsxCommands, zhOpsxCommands)).toEqual([]);

      const enPlaceholders = uniqueMatches(en, /<[^>\n]+>/g);
      const zhPlaceholders = uniqueMatches(zh, /<[^>\n]+>/g);
      expect(missingFrom(enPlaceholders, zhPlaceholders)).toEqual([]);
    });
  }
});
