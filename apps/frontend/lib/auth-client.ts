import { stripeClient } from '@better-auth/stripe/client';
import { nextCookies } from 'better-auth/next-js';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL:
    process.env.NODE_ENV === 'production' ||
    process.env.NODE_ENV === 'development'
      ? ''
      : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002',
  fetchOptions: {
    credentials: 'include',
  },
  plugins: [
    stripeClient({
      subscription: true,
    }),
    nextCookies(),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
