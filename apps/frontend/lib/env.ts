/**
 * Frontend environment variable validation
 * Validates required environment variables at runtime
 */

type Env = {
  NEXT_PUBLIC_API_URL: string;
  NODE_ENV: 'development' | 'production' | 'test';
  NEXT_PUBLIC_LOG_LEVEL?: 'debug' | 'info' | 'error';
};

const URL_PATTERN = /^https?:\/\//;

function validateEnv(): Env {
  const env = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
    NODE_ENV: (process.env.NODE_ENV || 'development') as Env['NODE_ENV'],
    NEXT_PUBLIC_LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL as
      | 'debug'
      | 'info'
      | 'error'
      | undefined,
  };

  // Validate NEXT_PUBLIC_API_URL in production
  if (env.NODE_ENV === 'production' && !env.NEXT_PUBLIC_API_URL) {
    throw new Error(
      'NEXT_PUBLIC_API_URL environment variable is required in production'
    );
  }

  // Validate URL format if provided
  if (env.NEXT_PUBLIC_API_URL && !URL_PATTERN.test(env.NEXT_PUBLIC_API_URL)) {
    console.warn(
      'NEXT_PUBLIC_API_URL should be a valid URL starting with http:// or https://'
    );
  }

  // Validate log level if provided
  if (
    env.NEXT_PUBLIC_LOG_LEVEL &&
    !['debug', 'info', 'error'].includes(env.NEXT_PUBLIC_LOG_LEVEL)
  ) {
    console.warn(
      `Invalid NEXT_PUBLIC_LOG_LEVEL: ${env.NEXT_PUBLIC_LOG_LEVEL}. Must be one of: debug, info, error`
    );
  }

  return env;
}

export const env = validateEnv();
