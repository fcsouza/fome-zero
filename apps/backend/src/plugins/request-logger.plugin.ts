import { Elysia } from 'elysia';
import { createChildLogger } from '../utils/logger';

const logger = createChildLogger({ module: 'request' });
const OK_STATUS_CODE = 200;

interface RequestWithMetadata extends Request {
  startTime?: number;
}

export const requestLoggerPlugin = new Elysia({ name: 'request-logger' })
  .onRequest(({ request }) => {
    const startTime = Date.now();
    (request as RequestWithMetadata).startTime = startTime;

    const isHealthCheck = new URL(request.url).pathname === '/api/health';
    if (isHealthCheck && process.env.NODE_ENV === 'production') {
      return;
    }

    logger.info(
      {
        method: request.method,
        url: request.url,
        headers: {
          'user-agent': request.headers.get('user-agent'),
          'x-forwarded-for': request.headers.get('x-forwarded-for'),
        },
      },
      'Incoming request'
    );
  })
  .onAfterHandle(({ request, set }) => {
    const startTime = (request as RequestWithMetadata).startTime;
    const duration = startTime ? Date.now() - startTime : 0;

    const isHealthCheck = new URL(request.url).pathname === '/api/health';
    if (isHealthCheck && process.env.NODE_ENV === 'production') {
      return;
    }

    logger.info(
      {
        method: request.method,
        url: request.url,
        status: set.status || OK_STATUS_CODE,
        duration: `${duration}ms`,
      },
      'Request completed'
    );
  })
  .onError(({ request, code, error }) => {
    const startTime = (request as RequestWithMetadata).startTime;
    const duration = startTime ? Date.now() - startTime : 0;

    logger.error(
      {
        method: request.method,
        url: request.url,
        code,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: `${duration}ms`,
      },
      'Request failed'
    );
  });
