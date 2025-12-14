import OpenAI from 'openai';
import { env } from '../config/env';
import { createChildLogger } from '../utils/logger';

const logger = createChildLogger({ module: 'chat-service' });

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

/**
 * Chat Service - Handles OpenAI Assistants API for chat conversations
 */
export class ChatService {
  private readonly assistantId: string;

  constructor() {
    this.assistantId = 'asst_lrekfZtxTt4nNiEV2yr2vShH';
  }

  /**
   * Create a new thread for conversation
   */
  async createThread(): Promise<string> {
    try {
      const thread = await openai.beta.threads.create();
      logger.info({ threadId: thread.id }, 'Thread created');
      return thread.id;
    } catch (error) {
      logger.error({ err: error }, 'Failed to create thread');
      throw new Error('Failed to create conversation thread');
    }
  }

  /**
   * Process delta event and extract text content
   */
  private extractDeltaText(
    delta: { content?: Array<{ type: string; text?: { value?: string } }> }
  ): string[] {
    const texts: string[] = [];
    if (delta.content && Array.isArray(delta.content)) {
      for (const content of delta.content) {
        if (content.type === 'text' && content.text?.value) {
          texts.push(content.text.value);
        }
      }
    }
    return texts;
  }

  /**
   * Send a message to the assistant and get streaming response
   * @param threadId - Thread ID (creates new if not provided)
   * @param message - User message
   * @returns Generator that yields SSE events
   */
  async *streamMessage(
    threadId: string | null,
    message: string
  ): AsyncGenerator<{ type: string; data: unknown }> {
    if (!env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    try {
      // Create thread if not provided
      let currentThreadId = threadId;
      if (!currentThreadId) {
        currentThreadId = await this.createThread();
        yield { type: 'thread', data: { threadId: currentThreadId } };
      }

      // Add user message to thread
      await openai.beta.threads.messages.create(currentThreadId, {
        role: 'user',
        content: message,
      });

      logger.info({ threadId: currentThreadId }, 'User message added to thread');

      // Create run with streaming
      const stream = await openai.beta.threads.runs.stream(
        currentThreadId,
        {
          assistant_id: this.assistantId,
        }
      );

      let fullResponse = '';

      // Process stream events
      for await (const event of stream) {
        const streamEvent = event as {
          event: string;
          data?: {
            delta?: {
              content?: Array<{ type: string; text?: { value?: string } }>;
            };
            last_error?: { message?: string };
          };
        };

        if (streamEvent.event === 'thread.message.delta') {
          const delta = streamEvent.data?.delta;
          if (delta) {
            const texts = this.extractDeltaText(delta);
            for (const text of texts) {
              fullResponse += text;
              yield {
                type: 'delta',
                data: { content: text, threadId: currentThreadId },
              };
            }
          }
        } else if (streamEvent.event === 'thread.run.completed') {
          logger.info({ threadId: currentThreadId }, 'Run completed');
          yield {
            type: 'done',
            data: { threadId: currentThreadId, fullResponse },
          };
          break;
        } else if (streamEvent.event === 'thread.run.failed') {
          const error = streamEvent.data?.last_error?.message;
          logger.error({ threadId: currentThreadId, error }, 'Run failed');
          yield {
            type: 'error',
            data: { error: error || 'Assistant run failed' },
          };
          break;
        }
      }
    } catch (error) {
      logger.error({ err: error }, 'Error streaming chat message');
      yield {
        type: 'error',
        data: {
          error:
            error instanceof Error
              ? error.message
              : 'Failed to process chat message',
        },
      };
    }
  }
}

export const chatService = new ChatService();
