import { getAgentsRootStubTemplate } from './agents-root-stub.js';

export function getCostrictTemplate(locale?: string): string {
  return getAgentsRootStubTemplate(locale);
}
