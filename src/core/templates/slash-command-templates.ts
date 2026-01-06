import { loadCoreTemplate } from './template-loader.js';

export type SlashCommandId = 'proposal' | 'apply' | 'archive';

const slashCommandPaths: Record<SlashCommandId, string> = {
  proposal: 'slash/proposal.md',
  apply: 'slash/apply.md',
  archive: 'slash/archive.md',
};

export function getSlashCommandBody(id: SlashCommandId, locale?: string): string {
  return loadCoreTemplate(slashCommandPaths[id], locale);
}
