import { getAgentsRootStubTemplate } from './agents-root-stub.js';

export function getClineTemplate(locale?: string): string {
  return getAgentsRootStubTemplate(locale);
}
