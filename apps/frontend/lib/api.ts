import { treaty } from '@elysiajs/eden';
import type { App } from '@fomezero/backend/src/index';

export const api = treaty<App>(
  typeof window !== 'undefined' ? window.origin : 'http://localhost:3000',
  {
    fetch: {
      credentials: 'include',
    },
  }
);
