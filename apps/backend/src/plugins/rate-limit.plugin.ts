import { Elysia } from 'elysia';
import { rateLimit } from 'elysia-rate-limit';

export const rateLimitPlugin = new Elysia({ name: 'rate-limit' }).use(
  rateLimit({
    duration: 60_000,
    max: 100,
    generator: (req) => {
      const forwarded = req.headers.get('x-forwarded-for');
      const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
      return ip;
    },
  })
);

export const authRateLimitPlugin = new Elysia({ name: 'auth-rate-limit' }).use(
  rateLimit({
    duration: 60_000,
    max: 5,
    generator: (req) => {
      const forwarded = req.headers.get('x-forwarded-for');
      const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
      return `auth:${ip}`;
    },
    errorResponse: new Error(
      'Too many authentication attempts. Please try again later.'
    ),
  })
);
