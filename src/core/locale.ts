import { getGlobalConfig } from './global-config.js';

export const DEFAULT_LOCALE = 'en';
const TRADITIONAL_CHINESE_REGIONS = new Set(['TW', 'HK', 'MO']);

function inferChineseScriptFallback(canonical: string): string | null {
  if (!canonical.toLowerCase().startsWith('zh')) {
    return null;
  }

  const parts = canonical.split('-');
  const explicitScript = parts.find((part) => /^[A-Z][a-z]{3}$/.test(part));
  if (explicitScript) {
    return `zh-${explicitScript}`;
  }

  const region = parts.find((part) => /^[A-Z]{2}$/.test(part) || /^\d{3}$/.test(part));
  if (region && TRADITIONAL_CHINESE_REGIONS.has(region)) {
    return 'zh-Hant';
  }

  return 'zh-Hans';
}

export function canonicalizeLocaleTag(tag: string): string | null {
  if (!tag || typeof tag !== 'string') {
    return null;
  }

  try {
    const [canonical] = Intl.getCanonicalLocales(tag);
    return canonical ?? null;
  } catch {
    return null;
  }
}

export function isValidLocaleTag(tag: string): boolean {
  return canonicalizeLocaleTag(tag) !== null;
}

export function getLocaleFallbackChain(
  locale?: string | null,
  defaultLocale: string = DEFAULT_LOCALE
): string[] {
  const canonical = locale ? canonicalizeLocaleTag(locale) : null;
  if (!canonical) {
    return [defaultLocale];
  }

  const parts = canonical.split('-');
  const chain: string[] = [];
  for (let i = parts.length; i >= 1; i--) {
    chain.push(parts.slice(0, i).join('-'));
  }

  const chineseScriptFallback = inferChineseScriptFallback(canonical);
  if (chineseScriptFallback && !chain.includes(chineseScriptFallback)) {
    const baseLanguage = parts[0];
    const baseLanguageIndex = chain.indexOf(baseLanguage);
    const defaultIndex = chain.indexOf(defaultLocale);
    const insertBeforeBaseLanguage = baseLanguageIndex > 0;
    const insertAt = insertBeforeBaseLanguage
      ? baseLanguageIndex
      : defaultIndex >= 0
        ? defaultIndex
        : chain.length;
    chain.splice(insertAt, 0, chineseScriptFallback);
  }

  if (!chain.includes(defaultLocale)) {
    chain.push(defaultLocale);
  }

  return Array.from(new Set(chain));
}

export function resolveLocale(
  locale?: string | null,
  defaultLocale: string = DEFAULT_LOCALE
): string {
  const chain = getLocaleFallbackChain(locale, defaultLocale);
  return chain[0] ?? defaultLocale;
}

export function getConfiguredLocale(): string {
  const config = getGlobalConfig();
  return resolveLocale(config.locale, DEFAULT_LOCALE);
}
