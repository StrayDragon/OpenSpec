import { getGlobalConfig } from './global-config.js';

export const DEFAULT_LOCALE = 'en';

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

  if (!chain.includes(defaultLocale)) {
    chain.push(defaultLocale);
  }

  return chain;
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
