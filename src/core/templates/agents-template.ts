import { loadCoreTemplate } from './template-loader.js';

export function getAgentsTemplate(locale?: string): string {
  return loadCoreTemplate('agents.md', locale);
}
