import { loadCoreTemplate } from './template-loader.js';

export interface ProjectContext {
  projectName?: string;
  description?: string;
  techStack?: string[];
  conventions?: string;
}

function renderTemplate(template: string, values: Record<string, string>): string {
  let output = template;
  for (const [key, value] of Object.entries(values)) {
    output = output.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  return output;
}

export const projectTemplate = (
  context: ProjectContext = {},
  locale?: string
): string => {
  const template = loadCoreTemplate('project.md', locale);
  const techStack = context.techStack?.length
    ? context.techStack.map((tech) => `- ${tech}`).join('\n')
    : '- [List your primary technologies]\n- [e.g., TypeScript, React, Node.js]';

  return renderTemplate(template, {
    projectName: context.projectName || 'Project',
    description: context.description || "[Describe your project's purpose and goals]",
    techStack,
  });
};
