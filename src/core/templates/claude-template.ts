import { getAgentsRootStubTemplate } from './agents-root-stub.js';

export function getClaudeTemplate(locale?: string): string {
  return getAgentsRootStubTemplate(locale);
}
