import pino from 'pino';

/**
 * Logger utility module for Next.js frontend
 * Provides structured logging using Pino with environment-based configuration
 *
 * Features:
 * - Works in both server and client components
 * - Pretty printing in development (human-readable)
 * - JSON output in production (machine-readable)
 * - ISO timestamp format
 * - Environment-aware log levels
 * - Child logger support for contextual logging
 * - Browser-friendly client-side logging
 */

const isServer = typeof window === 'undefined';
const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

const getLogLevel = (): pino.Level => {
  if (isTest) {
    return 'info' as pino.Level;
  }
  if (isDevelopment) {
    return 'debug' as pino.Level;
  }
  const envLevel = isServer
    ? (process.env.LOG_LEVEL as pino.Level)
    : (process.env.NEXT_PUBLIC_LOG_LEVEL as pino.Level);
  return envLevel || ('info' as pino.Level);
};

const createServerLogger = () => {
  const transport = isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined;

  return pino({
    name: 'fomezero-frontend',
    level: getLogLevel(),
    timestamp: pino.stdTimeFunctions.isoTime,
    base: {
      env: process.env.NODE_ENV || 'development',
      pid: process.pid,
    },
    formatters: {
      level: (label) => ({ level: label }),
    },
    ...(transport && { transport }),
  });
};

const createClientLogger = () =>
  pino({
    name: 'fomezero-frontend',
    level: getLogLevel(),
    timestamp: pino.stdTimeFunctions.isoTime,
    browser: {
      asObject: true,
    },
    formatters: {
      level: (label) => ({ level: label }),
    },
  });

const logger = isServer ? createServerLogger() : createClientLogger();

/**
 * Create a child logger with additional context
 * Useful for adding module/service-specific context to logs
 *
 * @param bindings - Additional context to include in all logs from this child logger
 * @returns A child logger instance
 *
 * @example
 * ```typescript
 * const moduleLogger = createChildLogger({ module: 'auth' });
 * moduleLogger.info('User authenticated');
 * // Output: {"level":30,"time":"...","module":"auth","msg":"User authenticated"}
 * ```
 */
export function createChildLogger(
  bindings: Record<string, unknown>
): pino.Logger {
  return logger.child(bindings);
}

/**
 * Default logger instance
 * Use this for general application logging in both server and client components
 *
 * @example
 * ```typescript
 * // Server Component
 * import { logger } from '@/lib/logger';
 * logger.info('Server action executed');
 *
 * // Client Component
 * 'use client';
 * import { logger } from '@/lib/logger';
 * logger.error({ err }, 'Failed to submit form');
 * ```
 */
export { logger };

export default logger;
