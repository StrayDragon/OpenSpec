/**
 * Telemetry module for anonymous usage analytics.
 *
 * Privacy-first design:
 * - Only tracks command name and version
 * - No arguments, file paths, or content
 * - Opt-out via OPENSPEC_TELEMETRY=0 or DO_NOT_TRACK=1
 * - Auto-disabled in CI environments
 * - Anonymous ID is a random UUID with no relation to the user
 */
import { createRequire } from 'module';
import { randomUUID } from 'crypto';
import { getTelemetryConfig, updateTelemetryConfig } from './config.js';

// PostHog API key - public key for client-side analytics
// This is safe to embed as it only allows sending events, not reading data
const POSTHOG_API_KEY = 'phc_Hthu8YvaIJ9QaFKyTG4TbVwkbd5ktcAFzVTKeMmoW2g';
// Using reverse proxy to avoid ad blockers and keep traffic on our domain
const POSTHOG_HOST = 'https://edge.openspec.dev';

type PostHogClient = {
  capture: (payload: {
    distinctId: string;
    event: string;
    properties: Record<string, unknown>;
  }) => void;
  shutdown: () => Promise<void>;
};

type PostHogConstructor = new (
  apiKey: string,
  options: {
    host: string;
    flushAt: number;
    flushInterval: number;
  }
) => PostHogClient;

let posthogClient: PostHogClient | null = null;
let posthogConstructor: PostHogConstructor | null | undefined;
let anonymousId: string | null = null;

/**
 * Check if telemetry is enabled.
 *
 * Disabled when:
 * - OPENSPEC_TELEMETRY=0
 * - DO_NOT_TRACK=1
 * - CI=true (any CI environment)
 */
export function isTelemetryEnabled(): boolean {
  // Check explicit opt-out
  if (process.env.OPENSPEC_TELEMETRY === '0') {
    return false;
  }

  // Respect DO_NOT_TRACK standard
  if (process.env.DO_NOT_TRACK === '1') {
    return false;
  }

  // Auto-disable in CI environments
  if (process.env.CI === 'true') {
    return false;
  }

  return true;
}

/**
 * Get or create the anonymous user ID.
 * Lazily generates a UUID on first call and persists it.
 */
export async function getOrCreateAnonymousId(): Promise<string> {
  // Return cached value if available
  if (anonymousId) {
    return anonymousId;
  }

  // Try to load from config
  const config = await getTelemetryConfig();
  if (config.anonymousId) {
    anonymousId = config.anonymousId;
    return anonymousId;
  }

  // Generate new UUID and persist
  anonymousId = randomUUID();
  await updateTelemetryConfig({ anonymousId });
  return anonymousId;
}

/**
 * Get the PostHog client instance.
 * Creates it on first call with CLI-optimized settings.
 */
function loadPostHogConstructor(): PostHogConstructor | null {
  if (posthogConstructor !== undefined) {
    return posthogConstructor;
  }

  const injected = (globalThis as { __OPENSPEC_POSTHOG__?: { PostHog?: PostHogConstructor } })
    .__OPENSPEC_POSTHOG__;
  if (injected?.PostHog) {
    posthogConstructor = injected.PostHog;
    return posthogConstructor;
  }

  try {
    const require = createRequire(import.meta.url);
    const mod = require('posthog-node') as { PostHog?: PostHogConstructor };
    posthogConstructor = mod.PostHog ?? null;
  } catch {
    posthogConstructor = null;
  }

  return posthogConstructor;
}

function getClient(): PostHogClient | null {
  if (!posthogClient) {
    const PostHogCtor = loadPostHogConstructor();
    if (!PostHogCtor) {
      return null;
    }
    posthogClient = new PostHogCtor(POSTHOG_API_KEY, {
      host: POSTHOG_HOST,
      flushAt: 1, // Send immediately, don't batch
      flushInterval: 0, // No timer-based flushing
    });
  }
  return posthogClient;
}

/**
 * Track a command execution.
 *
 * @param commandName - The command name (e.g., 'init', 'change:apply')
 * @param version - The OpenSpec version
 */
export async function trackCommand(commandName: string, version: string): Promise<void> {
  if (!isTelemetryEnabled()) {
    return;
  }

  try {
    const userId = await getOrCreateAnonymousId();
    const client = getClient();
    if (!client) {
      return;
    }

    client.capture({
      distinctId: userId,
      event: 'command_executed',
      properties: {
        command: commandName,
        version: version,
        surface: 'cli',
        $ip: null, // Explicitly disable IP tracking
      },
    });
  } catch {
    // Silent failure - telemetry should never break CLI
  }
}

/**
 * Show first-run telemetry notice if not already seen.
 */
export async function maybeShowTelemetryNotice(): Promise<void> {
  if (!isTelemetryEnabled()) {
    return;
  }

  try {
    const config = await getTelemetryConfig();
    if (config.noticeSeen) {
      return;
    }

    // Display notice
    console.log(
      'Note: OpenSpec collects anonymous usage stats. Opt out: OPENSPEC_TELEMETRY=0'
    );

    // Mark as seen
    await updateTelemetryConfig({ noticeSeen: true });
  } catch {
    // Silent failure - telemetry should never break CLI
  }
}

/**
 * Shutdown the PostHog client and flush pending events.
 * Call this before CLI exit.
 */
export async function shutdown(): Promise<void> {
  if (!posthogClient) {
    return;
  }

  try {
    await posthogClient.shutdown();
  } catch {
    // Silent failure - telemetry should never break CLI exit
  } finally {
    posthogClient = null;
  }
}
