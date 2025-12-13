import pino from 'pino';

/**
 * Logger utility module
 * Provides structured logging using Pino with environment-based configuration
 *
 * Features:
 * - Pretty printing in development (human-readable)
 * - JSON output in production (machine-readable)
 * - ISO timestamp format
 * - Environment-aware log levels
 * - Child logger support for contextual logging
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

const getLogLevel = (): pino.Level => {
  if (isTest) {
    return 'info' as pino.Level;
  }
  if (isDevelopment) {
    return 'debug' as pino.Level;
  }
  return (process.env.LOG_LEVEL as pino.Level) || ('info' as pino.Level);
};

/**
 * Get transport configuration for Pino
 * Only uses pino-pretty in development environment
 * Returns undefined for production/staging to use JSON output
 */
const getTransport = (): pino.TransportSingleOptions | undefined => {
  if (!isDevelopment) {
    return;
  }

  return {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  };
};

const transport = getTransport();

const logger = pino({
  name: 'fomezero-backend',
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
 * Use this for general application logging
 *
 * @example
 * ```typescript
 * import { logger } from './utils/logger';
 * logger.info('Server started');
 * logger.error({ err }, 'Failed to connect');
 * ```
 */
export { logger };

export default logger;
