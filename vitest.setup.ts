import { ensureCliBuilt } from './test/helpers/run-cli.js';
import os from 'os';
import path from 'path';
import fs from 'fs/promises';

let tempConfigDir: string | null = null;
let originalXdgConfig: string | undefined;
let originalForceBuild: string | undefined;

// Ensure the CLI bundle exists before tests execute
export async function setup() {
  originalXdgConfig = process.env.XDG_CONFIG_HOME;
  tempConfigDir = await fs.mkdtemp(path.join(os.tmpdir(), 'openspec-config-'));
  process.env.XDG_CONFIG_HOME = tempConfigDir;
  originalForceBuild = process.env.OPEN_SPEC_FORCE_BUILD;
  process.env.OPEN_SPEC_FORCE_BUILD = '1';
  await ensureCliBuilt();
  if (originalForceBuild === undefined) {
    delete process.env.OPEN_SPEC_FORCE_BUILD;
  } else {
    process.env.OPEN_SPEC_FORCE_BUILD = originalForceBuild;
  }
}

// Global teardown to ensure clean exit
export async function teardown() {
  // Clear any remaining timers
  // This helps prevent hanging handles from keeping the process alive
  if (tempConfigDir) {
    await fs.rm(tempConfigDir, { recursive: true, force: true });
    tempConfigDir = null;
  }
  if (originalXdgConfig === undefined) {
    delete process.env.XDG_CONFIG_HOME;
  } else {
    process.env.XDG_CONFIG_HOME = originalXdgConfig;
  }
  if (originalForceBuild === undefined) {
    delete process.env.OPEN_SPEC_FORCE_BUILD;
  } else {
    process.env.OPEN_SPEC_FORCE_BUILD = originalForceBuild;
  }
  // Force exit after a short grace period if the process hasn't exited cleanly.
  // This handles cases where child processes or open handles keep the worker alive.
  setTimeout(() => {
    process.exit(0);
  }, 1000).unref();
}
