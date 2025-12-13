import { Elysia } from 'elysia';
import { betterAuth } from '../plugins/better-auth.plugin';
import { servicesPlugin } from '../plugins/services.plugin';

/**
 * Protected user routes
 * These routes require authentication using the auth macro
 */
export const userRoute = new Elysia({ prefix: '/user' })
  .use(betterAuth)
  .use(servicesPlugin)
  .get(
    '/profile',
    async ({ user, userService }) => userService.getUserProfile(user.id),
    {
      auth: true,
      detail: {
        summary: 'Get user profile',
        description: 'Returns the authenticated user profile',
        tags: ['User'],
      },
    }
  )
  .get(
    '/me',
    ({ user, session }) => ({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      session: {
        expiresAt: session.expiresAt,
        createdAt: session.createdAt,
      },
    }),
    {
      auth: true,
      detail: {
        summary: 'Get current user session',
        description: 'Returns the current user and session information',
        tags: ['User'],
      },
    }
  );
