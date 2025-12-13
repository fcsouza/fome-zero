import { Elysia } from 'elysia';
import { createChildLogger } from '../utils/logger';

const logger = createChildLogger({ module: 'error-handler' });
const BAD_REQUEST_STATUS_CODE = 400;
const NOT_FOUND_STATUS_CODE = 404;
const UNAUTHORIZED_STATUS_CODE = 401;
const FORBIDDEN_STATUS_CODE = 403;
const CONFLICT_STATUS_CODE = 409;
const INTERNAL_SERVER_ERROR_STATUS_CODE = 500;

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

export const errorHandlerPlugin = new Elysia({ name: 'error-handler' })
  .error({
    NOT_FOUND: NotFoundError,
    UNAUTHORIZED: UnauthorizedError,
    FORBIDDEN: ForbiddenError,
    BAD_REQUEST: BadRequestError,
    CONFLICT: ConflictError,
  })
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: _
  .onError(({ code, error, set, request }) => {
    const isProduction = process.env.NODE_ENV === 'production';

    logger.error({
      code,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error && !isProduction ? error.stack : undefined,
      path: new URL(request.url).pathname,
      method: request.method,
    });

    if (code === 'VALIDATION') {
      set.status = BAD_REQUEST_STATUS_CODE;

      if (isProduction) {
        return {
          error: 'Validation Error',
          message: 'The request data is invalid',
        };
      }

      return {
        error: 'Validation Error',
        message: error.message,
        details:
          error &&
          typeof error === 'object' &&
          'all' in error &&
          typeof error.all === 'object'
            ? error.all
            : undefined,
      };
    }

    if (code === 'NOT_FOUND') {
      set.status = NOT_FOUND_STATUS_CODE;
      return {
        error: 'Not Found',
        message: error.message,
      };
    }

    if (code === 'UNAUTHORIZED') {
      set.status = UNAUTHORIZED_STATUS_CODE;
      return {
        error: 'Unauthorized',
        message: error.message,
      };
    }

    if (code === 'FORBIDDEN') {
      set.status = FORBIDDEN_STATUS_CODE;
      return {
        error: 'Forbidden',
        message: error.message,
      };
    }

    if (code === 'BAD_REQUEST') {
      set.status = BAD_REQUEST_STATUS_CODE;
      return {
        error: 'Bad Request',
        message: error.message,
      };
    }

    if (code === 'CONFLICT') {
      set.status = CONFLICT_STATUS_CODE;
      return {
        error: 'Conflict',
        message: error.message,
      };
    }

    if (code === 'PARSE') {
      set.status = BAD_REQUEST_STATUS_CODE;
      return {
        error: 'Parse Error',
        message: 'Invalid request format',
      };
    }

    set.status = INTERNAL_SERVER_ERROR_STATUS_CODE;

    if (isProduction) {
      return {
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
      };
    }

    return {
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error && !isProduction ? error.stack : undefined,
    };
  });
