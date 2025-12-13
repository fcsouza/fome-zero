import { Elysia } from 'elysia';

/**
 * Security Plugin
 * Adds security headers and basic protection to the API
 */
export const securityPlugin = new Elysia({ name: 'security' }).onBeforeHandle(
  ({ set }) => {
    set.headers['X-Content-Type-Options'] = 'nosniff';
    set.headers['X-Frame-Options'] = 'DENY';
    set.headers['X-XSS-Protection'] = '1; mode=block';
    set.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';
    set.headers['Permissions-Policy'] =
      'geolocation=(), microphone=(), camera=()';
  }
);
