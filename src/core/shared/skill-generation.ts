/**
 * Skill Generation Utilities
 *
 * Shared utilities for generating skill and command files.
 */

import {
  getExploreSkillTemplate,
  getNewChangeSkillTemplate,
  getContinueChangeSkillTemplate,
  getApplyChangeSkillTemplate,
  getFfChangeSkillTemplate,
  getSyncSpecsSkillTemplate,
  getArchiveChangeSkillTemplate,
  getBulkArchiveChangeSkillTemplate,
  getVerifyChangeSkillTemplate,
  getOnboardSkillTemplate,
  getOpsxProposeSkillTemplate,
  getOpsxExploreCommandTemplate,
  getOpsxNewCommandTemplate,
  getOpsxContinueCommandTemplate,
  getOpsxApplyCommandTemplate,
  getOpsxFfCommandTemplate,
  getOpsxSyncCommandTemplate,
  getOpsxArchiveCommandTemplate,
  getOpsxBulkArchiveCommandTemplate,
  getOpsxVerifyCommandTemplate,
  getOpsxOnboardCommandTemplate,
  getOpsxProposeCommandTemplate,
  type SkillTemplate,
} from '../templates/skill-templates.js';
import { loadCoreTemplate } from '../templates/template-loader.js';
import type { CommandContent } from '../command-generation/index.js';

/**
 * Skill template with directory name and workflow ID mapping.
 */
export interface SkillTemplateEntry {
  template: SkillTemplate;
  dirName: string;
  workflowId: string;
}

/**
 * Command template with ID mapping.
 */
export interface CommandTemplateEntry {
  template: ReturnType<typeof getOpsxExploreCommandTemplate>;
  id: string;
}

function loadLocalizedTemplateOrFallback(relativePath: string, fallbackContent: string): string {
  try {
    return loadCoreTemplate(relativePath);
  } catch {
    return fallbackContent;
  }
}

function withLocalizedSkillInstructions(template: SkillTemplate, relativePath: string): SkillTemplate {
  return {
    ...template,
    instructions: loadLocalizedTemplateOrFallback(relativePath, template.instructions),
  };
}

function withLocalizedCommandContent(
  template: ReturnType<typeof getOpsxExploreCommandTemplate>,
  relativePath: string
): ReturnType<typeof getOpsxExploreCommandTemplate> {
  return {
    ...template,
    content: loadLocalizedTemplateOrFallback(relativePath, template.content),
  };
}

/**
 * Gets skill templates with their directory names, optionally filtered by workflow IDs.
 *
 * @param workflowFilter - If provided, only return templates whose workflowId is in this array
 */
export function getSkillTemplates(workflowFilter?: readonly string[]): SkillTemplateEntry[] {
  const all: SkillTemplateEntry[] = [
    {
      template: withLocalizedSkillInstructions(getExploreSkillTemplate(), 'skills/openspec-explore.md'),
      dirName: 'openspec-explore',
      workflowId: 'explore',
    },
    {
      template: withLocalizedSkillInstructions(getNewChangeSkillTemplate(), 'skills/openspec-new-change.md'),
      dirName: 'openspec-new-change',
      workflowId: 'new',
    },
    {
      template: withLocalizedSkillInstructions(
        getContinueChangeSkillTemplate(),
        'skills/openspec-continue-change.md'
      ),
      dirName: 'openspec-continue-change',
      workflowId: 'continue',
    },
    {
      template: withLocalizedSkillInstructions(getApplyChangeSkillTemplate(), 'skills/openspec-apply-change.md'),
      dirName: 'openspec-apply-change',
      workflowId: 'apply',
    },
    {
      template: withLocalizedSkillInstructions(getFfChangeSkillTemplate(), 'skills/openspec-ff-change.md'),
      dirName: 'openspec-ff-change',
      workflowId: 'ff',
    },
    {
      template: withLocalizedSkillInstructions(getSyncSpecsSkillTemplate(), 'skills/openspec-sync-specs.md'),
      dirName: 'openspec-sync-specs',
      workflowId: 'sync',
    },
    {
      template: withLocalizedSkillInstructions(getArchiveChangeSkillTemplate(), 'skills/openspec-archive-change.md'),
      dirName: 'openspec-archive-change',
      workflowId: 'archive',
    },
    {
      template: withLocalizedSkillInstructions(
        getBulkArchiveChangeSkillTemplate(),
        'skills/openspec-bulk-archive-change.md'
      ),
      dirName: 'openspec-bulk-archive-change',
      workflowId: 'bulk-archive',
    },
    {
      template: withLocalizedSkillInstructions(getVerifyChangeSkillTemplate(), 'skills/openspec-verify-change.md'),
      dirName: 'openspec-verify-change',
      workflowId: 'verify',
    },
    {
      template: withLocalizedSkillInstructions(getOnboardSkillTemplate(), 'skills/openspec-onboard.md'),
      dirName: 'openspec-onboard',
      workflowId: 'onboard',
    },
    {
      template: withLocalizedSkillInstructions(getOpsxProposeSkillTemplate(), 'skills/openspec-propose.md'),
      dirName: 'openspec-propose',
      workflowId: 'propose',
    },
  ];

  if (!workflowFilter) return all;

  const filterSet = new Set(workflowFilter);
  return all.filter((entry) => filterSet.has(entry.workflowId));
}

/**
 * Gets command templates with their IDs, optionally filtered by workflow IDs.
 *
 * @param workflowFilter - If provided, only return templates whose id is in this array
 */
export function getCommandTemplates(workflowFilter?: readonly string[]): CommandTemplateEntry[] {
  const all: CommandTemplateEntry[] = [
    { template: withLocalizedCommandContent(getOpsxExploreCommandTemplate(), 'opsx/explore.md'), id: 'explore' },
    { template: withLocalizedCommandContent(getOpsxNewCommandTemplate(), 'opsx/new.md'), id: 'new' },
    { template: withLocalizedCommandContent(getOpsxContinueCommandTemplate(), 'opsx/continue.md'), id: 'continue' },
    { template: withLocalizedCommandContent(getOpsxApplyCommandTemplate(), 'opsx/apply.md'), id: 'apply' },
    { template: withLocalizedCommandContent(getOpsxFfCommandTemplate(), 'opsx/ff.md'), id: 'ff' },
    { template: withLocalizedCommandContent(getOpsxSyncCommandTemplate(), 'opsx/sync.md'), id: 'sync' },
    { template: withLocalizedCommandContent(getOpsxArchiveCommandTemplate(), 'opsx/archive.md'), id: 'archive' },
    {
      template: withLocalizedCommandContent(getOpsxBulkArchiveCommandTemplate(), 'opsx/bulk-archive.md'),
      id: 'bulk-archive',
    },
    { template: withLocalizedCommandContent(getOpsxVerifyCommandTemplate(), 'opsx/verify.md'), id: 'verify' },
    { template: withLocalizedCommandContent(getOpsxOnboardCommandTemplate(), 'opsx/onboard.md'), id: 'onboard' },
    { template: withLocalizedCommandContent(getOpsxProposeCommandTemplate(), 'opsx/propose.md'), id: 'propose' },
  ];

  if (!workflowFilter) return all;

  const filterSet = new Set(workflowFilter);
  return all.filter((entry) => filterSet.has(entry.id));
}

/**
 * Converts command templates to CommandContent array, optionally filtered by workflow IDs.
 *
 * @param workflowFilter - If provided, only return contents whose id is in this array
 */
export function getCommandContents(workflowFilter?: readonly string[]): CommandContent[] {
  const commandTemplates = getCommandTemplates(workflowFilter);
  return commandTemplates.map(({ template, id }) => ({
    id,
    name: template.name,
    description: template.description,
    category: template.category,
    tags: template.tags,
    body: template.content,
  }));
}

/**
 * Generates skill file content with YAML frontmatter.
 *
 * @param template - The skill template
 * @param generatedByVersion - The OpenSpec version to embed in the file
 * @param transformInstructions - Optional callback to transform the instructions content
 */
export function generateSkillContent(
  template: SkillTemplate,
  generatedByVersion: string,
  transformInstructions?: (instructions: string) => string
): string {
  const instructions = transformInstructions
    ? transformInstructions(template.instructions)
    : template.instructions;

  return `---
name: ${template.name}
description: ${template.description}
license: ${template.license || 'MIT'}
compatibility: ${template.compatibility || 'Requires openspec CLI.'}
metadata:
  author: ${template.metadata?.author || 'openspec'}
  version: "${template.metadata?.version || '1.0'}"
  generatedBy: "${generatedByVersion}"
---

${instructions}
`;
}
