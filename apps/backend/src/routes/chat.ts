import { Elysia, sse, t } from 'elysia';
import { betterAuth } from '../plugins/better-auth.plugin';
import { servicesPlugin } from '../plugins/services.plugin';

const sendMessageModel = t.Object({
  message: t.String({ minLength: 1 }),
  threadId: t.Optional(t.String()),
});

export const chatRoute = new Elysia({ prefix: '/chat' })
  .use(betterAuth)
  .use(servicesPlugin)
  .post(
    '/message',
    async function* ({ body, chatService, set }) {
      try {
        set.headers = {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        };

        for await (const event of chatService.streamMessage(
          body.threadId || null,
          body.message
        )) {
          yield sse({
            event: event.type,
            data: JSON.stringify(event.data),
          });
        }
      } catch (error) {
        yield sse({
          event: 'error',
          data: JSON.stringify({
            error:
              error instanceof Error
                ? error.message
                : 'Failed to process message',
          }),
        });
      }
    },
    {
      auth: true,
      body: sendMessageModel,
      detail: {
        summary: 'Send chat message',
        description:
          'Send a message to the AI assistant and receive streaming response via SSE',
        tags: ['chat'],
      },
    }
  );
