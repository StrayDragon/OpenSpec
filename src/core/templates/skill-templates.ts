import { loadCoreTemplate } from './template-loader.js';

/**
 * Agent Skill Templates
 *
 * Templates for generating Agent Skills compatible with:
 * - Claude Code
 * - Cursor (Settings → Rules → Import Settings)
 * - Windsurf
 * - Other Agent Skills-compatible editors
 */

export interface SkillTemplate {
  name: string;
  description: string;
  instructions: string;
}

/**
 * Template for openspec-new-change skill
 * Based on /opsx:new command
 */
export function getNewChangeSkillTemplate(locale?: string): SkillTemplate {
  return {
    name: 'openspec-new-change',
    description: 'Start a new OpenSpec change using the experimental artifact workflow. Use when the user wants to create a new feature, fix, or modification with a structured step-by-step approach.',
    instructions: loadCoreTemplate('skills/openspec-new-change.md', locale),
  };
}

/**
 * Template for openspec-continue-change skill
 * Based on /opsx:continue command
 */
export function getContinueChangeSkillTemplate(locale?: string): SkillTemplate {
  return {
    name: 'openspec-continue-change',
    description: 'Continue working on an OpenSpec change by creating the next artifact. Use when the user wants to progress their change, create the next artifact, or continue their workflow.',
    instructions: loadCoreTemplate('skills/openspec-continue-change.md', locale),
  };
}

/**
 * Template for openspec-apply-change skill
 * For implementing tasks from a completed (or in-progress) change
 */
export function getApplyChangeSkillTemplate(locale?: string): SkillTemplate {
  return {
    name: 'openspec-apply-change',
    description: 'Implement tasks from an OpenSpec change. Use when the user wants to start implementing, continue implementation, or work through tasks.',
    instructions: loadCoreTemplate('skills/openspec-apply-change.md', locale),
  };
}

// -----------------------------------------------------------------------------
// Slash Command Templates
// -----------------------------------------------------------------------------

export interface CommandTemplate {
  name: string;
  description: string;
  category: string;
  tags: string[];
  content: string;
}

/**
 * Template for /opsx:new slash command
 */
export function getOpsxNewCommandTemplate(locale?: string): CommandTemplate {
  return {
    name: 'OPSX: New',
    description: 'Start a new change using the experimental artifact workflow (OPSX)',
    category: 'Workflow',
    tags: ['workflow', 'artifacts', 'experimental'],
    content: loadCoreTemplate('opsx/new.md', locale),
  };
}

/**
 * Template for /opsx:continue slash command
 */
export function getOpsxContinueCommandTemplate(locale?: string): CommandTemplate {
  return {
    name: 'OPSX: Continue',
    description: 'Continue working on a change - create the next artifact (Experimental)',
    category: 'Workflow',
    tags: ['workflow', 'artifacts', 'experimental'],
    content: loadCoreTemplate('opsx/continue.md', locale),
  };
}

/**
 * Template for /opsx:apply slash command
 */
export function getOpsxApplyCommandTemplate(locale?: string): CommandTemplate {
  return {
    name: 'OPSX: Apply',
    description: 'Implement tasks from an OpenSpec change (Experimental)',
    category: 'Workflow',
    tags: ['workflow', 'artifacts', 'experimental'],
    content: loadCoreTemplate('opsx/apply.md', locale),
  };
}
