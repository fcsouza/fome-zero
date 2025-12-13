import { t } from 'elysia';
import { logger } from '../utils/logger';

const MIN_PORT = 1;
const MAX_PORT = 65_535;

const envSchema = t.Object({
  NODE_ENV: t.Union([
    t.Literal('development'),
    t.Literal('test'),
    t.Literal('staging'),
    t.Literal('production'),
  ]),
  PORT: t.String(),
  DATABASE_URL: t.String(),
  BETTER_AUTH_SECRET: t.Optional(t.String()),
  BETTER_AUTH_URL: t.Optional(t.String()),
  FRONTEND_URL: t.String(),
  STRIPE_SECRET_KEY: t.Optional(t.String()),
  STRIPE_WEBHOOK_SECRET: t.Optional(t.String()),
  STRIPE_BASIC_PRICE_ID: t.Optional(t.String()),
  STRIPE_PRO_PRICE_ID: t.Optional(t.String()),
  RESEND_API_KEY: t.Optional(t.String()),
  COMMIT_SHA: t.Optional(t.String()),
});

type EnvInput = typeof envSchema.static;

export function validateEnv(): EnvInput & { PORT: number } {
  const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || '3002',
    DATABASE_URL: process.env.DATABASE_URL || '',
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_BASIC_PRICE_ID: process.env.STRIPE_BASIC_PRICE_ID,
    STRIPE_PRO_PRICE_ID: process.env.STRIPE_PRO_PRICE_ID,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    COMMIT_SHA: process.env.COMMIT_SHA,
  };

  if (!env.DATABASE_URL) {
    logger.error('DATABASE_URL environment variable is required');
    process.exit(1);
  }

  const portNumber = Number.parseInt(env.PORT, 10);
  if (
    Number.isNaN(portNumber) ||
    portNumber < MIN_PORT ||
    portNumber > MAX_PORT
  ) {
    logger.error(
      `PORT must be a valid number between ${MIN_PORT} and ${MAX_PORT}, got: ${env.PORT}`
    );
    process.exit(1);
  }

  if (env.NODE_ENV === 'production') {
    if (!env.BETTER_AUTH_SECRET) {
      logger.warn(
        'BETTER_AUTH_SECRET is not set. This is required for production.'
      );
    }
    if (!env.BETTER_AUTH_URL) {
      logger.warn(
        'BETTER_AUTH_URL is not set. This is required for production.'
      );
    }
  }

  return {
    ...env,
    PORT: portNumber,
  } as EnvInput & { PORT: number };
}

export type Env = ReturnType<typeof validateEnv>;
export const env = validateEnv();
