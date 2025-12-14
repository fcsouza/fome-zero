import { cors } from '@elysiajs/cors';
import { openapi } from '@elysiajs/openapi';
import { Elysia } from 'elysia';
import { OpenAPI } from './auth';
import { env } from './config/env';
import { betterAuth } from './plugins/better-auth.plugin';
import { errorHandlerPlugin } from './plugins/error-handler.plugin';
import { rateLimitPlugin } from './plugins/rate-limit.plugin';
import { requestLoggerPlugin } from './plugins/request-logger.plugin';
import { securityPlugin } from './plugins/security.plugin';
import { servicesPlugin } from './plugins/services.plugin';
import { todosRoute } from './routes/todos';
import { userRoute } from './routes/user';
import { donationsRoute } from './routes/donations';
import { createChildLogger } from './utils/logger';

const logger = createChildLogger({ module: 'server' });
const DEFAULT_PORT = 3002;
const app = new Elysia()
  .use(errorHandlerPlugin)
  .use(requestLoggerPlugin)
  .use(rateLimitPlugin)
  .use(
    cors({
      credentials: true,
    })
  )
  .use(securityPlugin)
  .use(
    openapi({
      documentation: {
        info: {
          title: 'Fomezero API',
          version: '1.0.0',
          description:
            'Backend API for Fomezero with Todo management and authentication',
        },
        tags: [
          {
            name: 'todos',
            description: 'Todo management endpoints',
          },
          {
            name: 'auth',
            description: 'Authentication endpoints',
          },
          {
            name: 'User',
            description: 'User profile endpoints (protected)',
          },
          {
            name: 'donations',
            description: 'Donation management endpoints',
          },
        ],
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths(),
      },
    })
  )
  .use(betterAuth)
  .use(servicesPlugin)
  .group('/api', (api) =>
    api
      .get('/', () => ({ message: 'Welcome to Fomezero API' }), {
        detail: {
          summary: 'Welcome endpoint',
          description: 'Returns a welcome message',
          tags: ['General'],
        },
      })

      .get(
        '/health',
        () => ({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          environment: process.env.NODE_ENV || 'development',
          version: process.env.npm_package_version || '1.0.0',
          commitSha: process.env.COMMIT_SHA || 'unknown',
        }),
        {
          detail: {
            summary: 'Health check endpoint',
            description: 'Returns the health status of the API',
            tags: ['General'],
          },
        }
      )
      .use(todosRoute)
      .use(userRoute)
      .use(donationsRoute)
  )
  .listen(env.PORT || DEFAULT_PORT);

logger.info(
  {
    hostname: app.server?.hostname,
    port: app.server?.port,
    environment: env.NODE_ENV,
  },
  'Elysia server started'
);

const shutdown = (signal: string) => {
  logger.info(
    { signal },
    'Received shutdown signal, starting graceful shutdown'
  );

  try {
    if (app.server) {
      app.server.stop();
      logger.info('Server closed');
    }

    logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error({ err: error }, 'Error during graceful shutdown');
    process.exit(1);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('uncaughtException', (error) => {
  logger.error({ err: error }, 'Uncaught exception');
  shutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error({ reason, promise }, 'Unhandled promise rejection');
  shutdown('unhandledRejection');
});

export type App = typeof app;
