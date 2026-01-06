import { getAgentsTemplate } from './agents-template.js';
import { projectTemplate, ProjectContext } from './project-template.js';
import { getClaudeTemplate } from './claude-template.js';
import { getClineTemplate } from './cline-template.js';
import { getCostrictTemplate } from './costrict-template.js';
import { getAgentsRootStubTemplate } from './agents-root-stub.js';
import { getSlashCommandBody, SlashCommandId } from './slash-command-templates.js';

export interface Template {
  path: string;
  content: string | ((context: ProjectContext) => string);
}

export class TemplateManager {
  static getTemplates(context: ProjectContext = {}, locale?: string): Template[] {
    return [
      {
        path: 'AGENTS.md',
        content: getAgentsTemplate(locale)
      },
      {
        path: 'project.md',
        content: projectTemplate(context, locale)
      }
    ];
  }

  static getClaudeTemplate(locale?: string): string {
    return getClaudeTemplate(locale);
  }

  static getClineTemplate(locale?: string): string {
    return getClineTemplate(locale);
  }

  static getCostrictTemplate(locale?: string): string {
    return getCostrictTemplate(locale);
  }

  static getAgentsStandardTemplate(locale?: string): string {
    return getAgentsRootStubTemplate(locale);
  }

  static getSlashCommandBody(id: SlashCommandId, locale?: string): string {
    return getSlashCommandBody(id, locale);
  }
}

export { ProjectContext } from './project-template.js';
export type { SlashCommandId } from './slash-command-templates.js';
