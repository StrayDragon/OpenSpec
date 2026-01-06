import { describe, it, expect } from 'vitest';

import {
  canonicalizeLocaleTag,
  isValidLocaleTag,
  getLocaleFallbackChain,
  resolveLocale,
  DEFAULT_LOCALE,
} from '../../src/core/locale.js';

describe('locale utilities', () => {
  it('canonicalizes locale tags', () => {
    expect(canonicalizeLocaleTag('EN-us')).toBe('en-US');
  });

  it('returns null for invalid locale tags', () => {
    expect(canonicalizeLocaleTag('not_a_locale')).toBeNull();
  });

  it('validates locale tags', () => {
    expect(isValidLocaleTag('zh-Hans')).toBe(true);
    expect(isValidLocaleTag('not_a_locale')).toBe(false);
  });

  it('builds fallback chain for locale', () => {
    expect(getLocaleFallbackChain('zh-Hans-CN')).toEqual([
      'zh-Hans-CN',
      'zh-Hans',
      'zh',
      DEFAULT_LOCALE,
    ]);
  });

  it('falls back to default locale for invalid tags', () => {
    expect(getLocaleFallbackChain('not_a_locale')).toEqual([DEFAULT_LOCALE]);
  });

  it('resolves locale to default for invalid tags', () => {
    expect(resolveLocale('not_a_locale')).toBe(DEFAULT_LOCALE);
  });
});
