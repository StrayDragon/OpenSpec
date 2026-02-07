/**
 * Instructions Command
 *
 * Generates enriched instructions for creating artifacts or applying tasks.
 * Includes both artifact instructions and apply instructions.
 */

import ora from 'ora';
import path from 'path';
import * as fs from 'fs';
import {
  loadChangeContext,
  generateInstructions,
  resolveSchema,
  type ArtifactInstructions,
} from '../../core/artifact-graph/index.js';
import { getConfiguredLocale, getLocaleFallbackChain } from '../../core/locale.js';
import {
  validateChangeExists,
  validateSchemaExists,
  type TaskItem,
  type ApplyInstructions,
} from './shared.js';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface InstructionsOptions {
  change?: string;
  schema?: string;
  json?: boolean;
}

export interface ApplyInstructionsOptions {
  change?: string;
  schema?: string;
  json?: boolean;
}

function isChineseLocale(locale: string): boolean {
  return getLocaleFallbackChain(locale).some((tag) => tag.toLowerCase().startsWith('zh'));
}

function localizeSchemaApplyInstruction(
  schemaName: string,
  instruction: string | null,
  locale: string
): string | null {
  if (!instruction) {
    return null;
  }

  if (!isChineseLocale(locale)) {
    return instruction;
  }

  if (
    schemaName === 'spec-driven' &&
    instruction.includes('work through pending tasks')
  ) {
    return '阅读上下文文件，按顺序完成未完成任务，并在完成后及时勾选。\n遇到阻塞或需要澄清时先暂停并确认。';
  }

  return instruction;
}

// -----------------------------------------------------------------------------
// Artifact Instructions Command
// -----------------------------------------------------------------------------

export async function instructionsCommand(
  artifactId: string | undefined,
  options: InstructionsOptions
): Promise<void> {
  const spinner = ora('Generating instructions...').start();

  try {
    const projectRoot = process.cwd();
    const changeName = await validateChangeExists(options.change, projectRoot);

    // Validate schema if explicitly provided
    if (options.schema) {
      validateSchemaExists(options.schema, projectRoot);
    }

    // loadChangeContext will auto-detect schema from metadata if not provided
    const context = loadChangeContext(projectRoot, changeName, options.schema);

    if (!artifactId) {
      spinner.stop();
      const validIds = context.graph.getAllArtifacts().map((a) => a.id);
      throw new Error(
        `Missing required argument <artifact>. Valid artifacts:\n  ${validIds.join('\n  ')}`
      );
    }

    const artifact = context.graph.getArtifact(artifactId);

    if (!artifact) {
      spinner.stop();
      const validIds = context.graph.getAllArtifacts().map((a) => a.id);
      throw new Error(
        `Artifact '${artifactId}' not found in schema '${context.schemaName}'. Valid artifacts:\n  ${validIds.join('\n  ')}`
      );
    }

    const instructions = generateInstructions(context, artifactId, projectRoot);
    const isBlocked = instructions.dependencies.some((d) => !d.done);

    spinner.stop();

    if (options.json) {
      console.log(JSON.stringify(instructions, null, 2));
      return;
    }

    printInstructionsText(instructions, isBlocked);
  } catch (error) {
    spinner.stop();
    throw error;
  }
}

export function printInstructionsText(instructions: ArtifactInstructions, isBlocked: boolean): void {
  const {
    artifactId,
    changeName,
    schemaName,
    changeDir,
    outputPath,
    description,
    instruction,
    context,
    rules,
    template,
    dependencies,
    unlocks,
  } = instructions;

  // Opening tag
  console.log(`<artifact id="${artifactId}" change="${changeName}" schema="${schemaName}">`);
  console.log();

  // Warning for blocked artifacts
  if (isBlocked) {
    const missing = dependencies.filter((d) => !d.done).map((d) => d.id);
    console.log('<warning>');
    console.log('This artifact has unmet dependencies. Complete them first or proceed with caution.');
    console.log(`Missing: ${missing.join(', ')}`);
    console.log('</warning>');
    console.log();
  }

  // Task directive
  console.log('<task>');
  console.log(`Create the ${artifactId} artifact for change "${changeName}".`);
  console.log(description);
  console.log('</task>');
  console.log();

  // Project context (AI constraint - do not include in output)
  if (context) {
    console.log('<project_context>');
    console.log('<!-- This is background information for you. Do NOT include this in your output. -->');
    console.log(context);
    console.log('</project_context>');
    console.log();
  }

  // Rules (AI constraint - do not include in output)
  if (rules && rules.length > 0) {
    console.log('<rules>');
    console.log('<!-- These are constraints for you to follow. Do NOT include this in your output. -->');
    for (const rule of rules) {
      console.log(`- ${rule}`);
    }
    console.log('</rules>');
    console.log();
  }

  // Dependencies (files to read for context)
  if (dependencies.length > 0) {
    console.log('<dependencies>');
    console.log('Read these files for context before creating this artifact:');
    console.log();
    for (const dep of dependencies) {
      const status = dep.done ? 'done' : 'missing';
      const fullPath = path.join(changeDir, dep.path);
      console.log(`<dependency id="${dep.id}" status="${status}">`);
      console.log(`  <path>${fullPath}</path>`);
      console.log(`  <description>${dep.description}</description>`);
      console.log('</dependency>');
    }
    console.log('</dependencies>');
    console.log();
  }

  // Output location
  console.log('<output>');
  console.log(`Write to: ${path.join(changeDir, outputPath)}`);
  console.log('</output>');
  console.log();

  // Instruction (guidance)
  if (instruction) {
    console.log('<instruction>');
    console.log(instruction.trim());
    console.log('</instruction>');
    console.log();
  }

  // Template
  console.log('<template>');
  console.log('<!-- Use this as the structure for your output file. Fill in the sections. -->');
  console.log(template.trim());
  console.log('</template>');
  console.log();

  // Success criteria placeholder
  console.log('<success_criteria>');
  console.log('<!-- To be defined in schema validation rules -->');
  console.log('</success_criteria>');
  console.log();

  // Unlocks
  if (unlocks.length > 0) {
    console.log('<unlocks>');
    console.log(`Completing this artifact enables: ${unlocks.join(', ')}`);
    console.log('</unlocks>');
    console.log();
  }

  // Closing tag
  console.log('</artifact>');
}

// -----------------------------------------------------------------------------
// Apply Instructions Command
// -----------------------------------------------------------------------------

/**
 * Parses tasks.md content and extracts task items with their completion status.
 */
function parseTasksFile(content: string): TaskItem[] {
  const tasks: TaskItem[] = [];
  const lines = content.split('\n');
  let taskIndex = 0;

  for (const line of lines) {
    // Match checkbox patterns: - [ ] or - [x] or - [X]
    const checkboxMatch = line.match(/^[-*]\s*\[([ xX])\]\s*(.+)\s*$/);
    if (checkboxMatch) {
      taskIndex++;
      const done = checkboxMatch[1].toLowerCase() === 'x';
      const description = checkboxMatch[2].trim();
      tasks.push({
        id: `${taskIndex}`,
        description,
        done,
      });
    }
  }

  return tasks;
}

/**
 * Checks if an artifact output exists in the change directory.
 * Supports glob patterns (e.g., "specs/*.md") by verifying at least one matching file exists.
 */
function artifactOutputExists(changeDir: string, generates: string): boolean {
  // Normalize the generates path to use platform-specific separators
  const normalizedGenerates = generates.split('/').join(path.sep);
  const fullPath = path.join(changeDir, normalizedGenerates);

  // If it's a glob pattern (contains ** or *), check for matching files
  if (generates.includes('*')) {
    // Extract the directory part before the glob pattern
    const parts = normalizedGenerates.split(path.sep);
    const dirParts: string[] = [];
    let patternPart = '';
    for (const part of parts) {
      if (part.includes('*')) {
        patternPart = part;
        break;
      }
      dirParts.push(part);
    }
    const dirPath = path.join(changeDir, ...dirParts);

    // Check if directory exists
    if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
      return false;
    }

    // Extract expected extension from pattern (e.g., "*.md" -> ".md")
    const extMatch = patternPart.match(/\*(\.[a-zA-Z0-9]+)$/);
    const expectedExt = extMatch ? extMatch[1] : null;

    // Recursively check for matching files
    const hasMatchingFiles = (dir: string): boolean => {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isDirectory()) {
            // For ** patterns, recurse into subdirectories
            if (generates.includes('**') && hasMatchingFiles(path.join(dir, entry.name))) {
              return true;
            }
          } else if (entry.isFile()) {
            // Check if file matches expected extension (or any file if no extension specified)
            if (!expectedExt || entry.name.endsWith(expectedExt)) {
              return true;
            }
          }
        }
      } catch {
        return false;
      }
      return false;
    };

    return hasMatchingFiles(dirPath);
  }

  return fs.existsSync(fullPath);
}

/**
 * Generates apply instructions for implementing tasks from a change.
 * Schema-aware: reads apply phase configuration from schema to determine
 * required artifacts, tracking file, and instruction.
 */
export async function generateApplyInstructions(
  projectRoot: string,
  changeName: string,
  schemaName?: string
): Promise<ApplyInstructions> {
  // loadChangeContext will auto-detect schema from metadata if not provided
  const context = loadChangeContext(projectRoot, changeName, schemaName);
  const changeDir = path.join(projectRoot, 'openspec', 'changes', changeName);

  // Get the full schema to access the apply phase configuration
  const schema = resolveSchema(context.schemaName, projectRoot);
  const applyConfig = schema.apply;

  // Determine required artifacts and tracking file from schema
  // Fallback: if no apply block, require all artifacts
  const requiredArtifactIds = applyConfig?.requires ?? schema.artifacts.map((a) => a.id);
  const tracksFile = applyConfig?.tracks ?? null;
  const schemaInstruction = localizeSchemaApplyInstruction(
    context.schemaName,
    applyConfig?.instruction?.trim() ?? null,
    context.locale
  );
  const useChinese = isChineseLocale(context.locale);

  // Check which required artifacts are missing
  const missingArtifacts: string[] = [];
  for (const artifactId of requiredArtifactIds) {
    const artifact = schema.artifacts.find((a) => a.id === artifactId);
    if (artifact && !artifactOutputExists(changeDir, artifact.generates)) {
      missingArtifacts.push(artifactId);
    }
  }

  // Build context files from all existing artifacts in schema
  const contextFiles: Record<string, string> = {};
  for (const artifact of schema.artifacts) {
    if (artifactOutputExists(changeDir, artifact.generates)) {
      contextFiles[artifact.id] = path.join(changeDir, artifact.generates);
    }
  }

  // Parse tasks if tracking file exists
  let tasks: TaskItem[] = [];
  let tracksFileExists = false;
  if (tracksFile) {
    const tracksPath = path.join(changeDir, tracksFile);
    tracksFileExists = fs.existsSync(tracksPath);
    if (tracksFileExists) {
      const tasksContent = await fs.promises.readFile(tracksPath, 'utf-8');
      tasks = parseTasksFile(tasksContent);
    }
  }

  // Calculate progress
  const total = tasks.length;
  const complete = tasks.filter((t) => t.done).length;
  const remaining = total - complete;

  // Determine state and instruction
  let state: ApplyInstructions['state'];
  let instruction: string;

  if (missingArtifacts.length > 0) {
    state = 'blocked';
    if (useChinese) {
      instruction = `当前还不能进入实现阶段，缺少以下工件：${missingArtifacts.join(', ')}。\n请先使用 openspec-continue-change 生成缺失工件。`;
    } else {
      instruction = `Cannot apply this change yet. Missing artifacts: ${missingArtifacts.join(', ')}.\nUse the openspec-continue-change skill to create the missing artifacts first.`;
    }
  } else if (tracksFile && !tracksFileExists) {
    // Tracking file configured but doesn't exist yet
    const tracksFilename = path.basename(tracksFile);
    state = 'blocked';
    if (useChinese) {
      instruction = `${tracksFilename} 文件缺失，必须先创建。\n请使用 openspec-continue-change 生成该跟踪文件。`;
    } else {
      instruction = `The ${tracksFilename} file is missing and must be created.\nUse openspec-continue-change to generate the tracking file.`;
    }
  } else if (tracksFile && tracksFileExists && total === 0) {
    // Tracking file exists but contains no tasks
    const tracksFilename = path.basename(tracksFile);
    state = 'blocked';
    if (useChinese) {
      instruction = `${tracksFilename} 已存在，但没有任何任务。\n请在 ${tracksFilename} 中补充任务，或用 openspec-continue-change 重新生成。`;
    } else {
      instruction = `The ${tracksFilename} file exists but contains no tasks.\nAdd tasks to ${tracksFilename} or regenerate it with openspec-continue-change.`;
    }
  } else if (tracksFile && remaining === 0 && total > 0) {
    state = 'all_done';
    if (useChinese) {
      instruction = '所有任务均已完成！该变更已可归档。\n归档前建议先运行测试并完成代码审阅。';
    } else {
      instruction = 'All tasks are complete! This change is ready to be archived.\nConsider running tests and reviewing the changes before archiving.';
    }
  } else if (!tracksFile) {
    // No tracking file configured in schema - ready to apply
    state = 'ready';
    if (schemaInstruction) {
      instruction = schemaInstruction;
    } else if (useChinese) {
      instruction = '所有必需工件已齐备，可以开始实现。';
    } else {
      instruction = 'All required artifacts complete. Proceed with implementation.';
    }
  } else {
    state = 'ready';
    if (schemaInstruction) {
      instruction = schemaInstruction;
    } else if (useChinese) {
      instruction = '阅读上下文文件，逐项处理未完成任务，并在完成后打勾。\n如遇阻塞或需要澄清，请先暂停并确认。';
    } else {
      instruction = 'Read context files, work through pending tasks, mark complete as you go.\nPause if you hit blockers or need clarification.';
    }
  }

  return {
    changeName,
    changeDir,
    schemaName: context.schemaName,
    contextFiles,
    progress: { total, complete, remaining },
    tasks,
    state,
    missingArtifacts: missingArtifacts.length > 0 ? missingArtifacts : undefined,
    instruction,
  };
}

export async function applyInstructionsCommand(options: ApplyInstructionsOptions): Promise<void> {
  const spinner = ora('Generating apply instructions...').start();

  try {
    const projectRoot = process.cwd();
    const changeName = await validateChangeExists(options.change, projectRoot);

    // Validate schema if explicitly provided
    if (options.schema) {
      validateSchemaExists(options.schema, projectRoot);
    }

    // generateApplyInstructions uses loadChangeContext which auto-detects schema
    const instructions = await generateApplyInstructions(projectRoot, changeName, options.schema);

    spinner.stop();

    if (options.json) {
      console.log(JSON.stringify(instructions, null, 2));
      return;
    }

    printApplyInstructionsText(instructions);
  } catch (error) {
    spinner.stop();
    throw error;
  }
}

export function printApplyInstructionsText(instructions: ApplyInstructions): void {
  const { changeName, schemaName, contextFiles, progress, tasks, state, missingArtifacts, instruction } = instructions;
  const useChinese = isChineseLocale(getConfiguredLocale());

  console.log(useChinese ? `## 应用阶段：${changeName}` : `## Apply: ${changeName}`);
  console.log(useChinese ? `工作流：${schemaName}` : `Schema: ${schemaName}`);
  console.log();

  // Warning for blocked state
  if (state === 'blocked' && missingArtifacts) {
    console.log(useChinese ? '### ⚠️ 已阻塞' : '### ⚠️ Blocked');
    console.log();
    console.log(
      useChinese
        ? `缺失工件：${missingArtifacts.join(', ')}`
        : `Missing artifacts: ${missingArtifacts.join(', ')}`
    );
    console.log(
      useChinese
        ? '请先使用 openspec-continue-change 生成这些工件。'
        : 'Use the openspec-continue-change skill to create these first.'
    );
    console.log();
  }

  // Context files (dynamically from schema)
  const contextFileEntries = Object.entries(contextFiles);
  if (contextFileEntries.length > 0) {
    console.log(useChinese ? '### 上下文文件' : '### Context Files');
    for (const [artifactId, filePath] of contextFileEntries) {
      console.log(`- ${artifactId}: ${filePath}`);
    }
    console.log();
  }

  // Progress (only show if we have tracking)
  if (progress.total > 0 || tasks.length > 0) {
    console.log(useChinese ? '### 进度' : '### Progress');
    if (state === 'all_done') {
      console.log(
        useChinese
          ? `${progress.complete}/${progress.total} 已完成 ✓`
          : `${progress.complete}/${progress.total} complete ✓`
      );
    } else {
      console.log(
        useChinese
          ? `${progress.complete}/${progress.total} 已完成`
          : `${progress.complete}/${progress.total} complete`
      );
    }
    console.log();
  }

  // Tasks
  if (tasks.length > 0) {
    console.log(useChinese ? '### 任务' : '### Tasks');
    for (const task of tasks) {
      const checkbox = task.done ? '[x]' : '[ ]';
      console.log(`- ${checkbox} ${task.description}`);
    }
    console.log();
  }

  // Instruction
  console.log(useChinese ? '### 指令' : '### Instruction');
  console.log(instruction);
}
