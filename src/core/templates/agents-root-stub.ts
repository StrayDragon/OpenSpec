import { loadCoreTemplate } from './template-loader.js';

export function getAgentsRootStubTemplate(locale?: string): string {
  return loadCoreTemplate('agents-root-stub.md', locale);
}
