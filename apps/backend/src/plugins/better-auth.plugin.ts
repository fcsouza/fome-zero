import { Elysia } from 'elysia';
import { auth } from '../auth';

const UNAUTHORIZED_STATUS_CODE = 401;

/**
 * Better Auth middleware with macro for protected routes
 * Mount the auth handler and provide a macro to protect routes
 */
export const betterAuth = new Elysia({ name: 'better-auth' })
  .mount(auth.handler)
  .macro({
    auth: {
      async resolve({ set, request: { headers } }) {
        const session = await auth.api.getSession({
          headers,
        });

        if (!session) {
          set.status = UNAUTHORIZED_STATUS_CODE;
          throw new Error('Unauthorized - Please sign in');
        }

        return {
          user: session.user,
          session: session.session,
        };
      },
    },
  });
