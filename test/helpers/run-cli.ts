import { spawn } from 'child_process';
import { existsSync, mkdtempSync, openSync, closeSync, readFileSync, rmSync } from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..', '..');
const cliEntry = path.join(projectRoot, 'dist', 'cli', 'index.js');

let buildPromise: Promise<void> | undefined;

interface RunCommandOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
}

interface RunCLIOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  input?: string;
  timeoutMs?: number;
}

export interface RunCLIResult {
  exitCode: number | null;
  signal: NodeJS.Signals | null;
  stdout: string;
  stderr: string;
  timedOut: boolean;
  command: string;
}

function runCommand(command: string, args: string[], options: RunCommandOptions = {}) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? projectRoot,
      env: { ...process.env, ...options.env },
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });

    child.on('error', (error) => reject(error));
    child.on('close', (code, signal) => {
      if (code === 0) {
        resolve();
      } else {
        const reason = signal ? `signal ${signal}` : `exit code ${code}`;
        reject(new Error(`Command failed (${reason}): ${command} ${args.join(' ')}`));
      }
    });
  });
}

export async function ensureCliBuilt() {
  if (existsSync(cliEntry) && process.env.OPEN_SPEC_FORCE_BUILD !== '1') {
    return;
  }

  if (!buildPromise) {
    buildPromise = runCommand('pnpm', ['run', 'build']).catch((error) => {
      buildPromise = undefined;
      throw error;
    });
  }

  await buildPromise;

  if (!existsSync(cliEntry)) {
    throw new Error('CLI entry point missing after build. Expected dist/cli/index.js');
  }
}

export async function runCLI(args: string[] = [], options: RunCLIOptions = {}): Promise<RunCLIResult> {
  await ensureCliBuilt();

  const finalArgs = Array.isArray(args) ? args : [args];
  const invocation = [cliEntry, ...finalArgs].join(' ');
  const tempDir = mkdtempSync(path.join(os.tmpdir(), 'openspec-cli-'));
  const stdoutPath = path.join(tempDir, 'stdout.txt');
  const stderrPath = path.join(tempDir, 'stderr.txt');
  const stdoutFd = openSync(stdoutPath, 'w');
  const stderrFd = openSync(stderrPath, 'w');

  return new Promise<RunCLIResult>((resolve, reject) => {
    const child = spawn(process.execPath, [cliEntry, ...finalArgs], {
      cwd: options.cwd ?? projectRoot,
      env: {
        ...process.env,
        OPEN_SPEC_INTERACTIVE: '0',
        ...options.env,
      },
      stdio: ['pipe', stdoutFd, stderrFd],
      windowsHide: true,
    });

    // Prevent child process from keeping the event loop alive
    child.unref();

    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const timeout = options.timeoutMs
      ? setTimeout(() => {
          timedOut = true;
          child.kill('SIGKILL');
        }, options.timeoutMs)
      : undefined;

    child.on('error', (error) => {
      if (timeout) clearTimeout(timeout);
      child.stdin?.destroy();
      closeSync(stdoutFd);
      closeSync(stderrFd);
      rmSync(tempDir, { recursive: true, force: true });
      reject(error);
    });

    child.on('close', (code, signal) => {
      if (timeout) clearTimeout(timeout);
      child.stdin?.destroy();
      closeSync(stdoutFd);
      closeSync(stderrFd);
      stdout = readFileSync(stdoutPath, 'utf-8');
      stderr = readFileSync(stderrPath, 'utf-8');
      rmSync(tempDir, { recursive: true, force: true });
      resolve({
        exitCode: code,
        signal,
        stdout,
        stderr,
        timedOut,
        command: `node ${invocation}`,
      });
    });

    if (options.input && child.stdin) {
      child.stdin.end(options.input);
    } else if (child.stdin) {
      child.stdin.end();
    }
  });
}

export const cliProjectRoot = projectRoot;
