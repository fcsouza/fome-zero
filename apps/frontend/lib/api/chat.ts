export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export type ChatEvent = {
  type: 'thread' | 'delta' | 'done' | 'error';
  data: {
    threadId?: string;
    content?: string;
    fullResponse?: string;
    error?: string;
  };
};

/**
 * Send a message to the chat API and return an EventSource for SSE streaming
 */
export function sendMessage(
  message: string,
  threadId?: string,
  onEvent?: (event: ChatEvent) => void
): EventSource {
  const apiUrl = '/api/chat/message';
  
  // Use fetch with POST to send message, then create EventSource
  // Since EventSource doesn't support POST, we'll use a different approach
  // We'll use fetch with ReadableStream instead
  
  const eventSource = new EventSource(
    `${apiUrl}?message=${encodeURIComponent(message)}${threadId ? `&threadId=${threadId}` : ''}`
  );

  if (onEvent) {
    eventSource.addEventListener('thread', (e) => {
      try {
        const data = JSON.parse(e.data);
        onEvent({ type: 'thread', data });
      } catch (error) {
        console.error('Error parsing thread event:', error);
      }
    });

    eventSource.addEventListener('delta', (e) => {
      try {
        const data = JSON.parse(e.data);
        onEvent({ type: 'delta', data });
      } catch (error) {
        console.error('Error parsing delta event:', error);
      }
    });

    eventSource.addEventListener('done', (e) => {
      try {
        const data = JSON.parse(e.data);
        onEvent({ type: 'done', data });
        eventSource.close();
      } catch (error) {
        console.error('Error parsing done event:', error);
      }
    });

    eventSource.addEventListener('error', (e) => {
      try {
        const data = JSON.parse((e as MessageEvent).data);
        onEvent({ type: 'error', data });
        eventSource.close();
      } catch (error) {
        console.error('Error parsing error event:', error);
      }
    });

    eventSource.onerror = () => {
      onEvent({
        type: 'error',
        data: { error: 'Connection error occurred' },
      });
      eventSource.close();
    };
  }

  return eventSource;
}

/**
 * Handle thread event
 */
function handleThreadEvent(
  eventData: ChatEvent['data'],
  onChunk: (chunk: ChatEvent) => void
): string | null {
  if (eventData.threadId) {
    onChunk({ type: 'thread', data: eventData });
    return eventData.threadId;
  }
  return null;
}

/**
 * Handle other event types
 */
function handleOtherEvent(
  type: 'delta' | 'done' | 'error',
  eventData: ChatEvent['data'],
  onChunk: (chunk: ChatEvent) => void
): void {
  if (type === 'delta' && eventData.content) {
    onChunk({ type: 'delta', data: eventData });
  } else if (type === 'done' && eventData.fullResponse !== undefined) {
    onChunk({ type: 'done', data: eventData });
  } else if (type === 'error' && eventData.error) {
    onChunk({ type: 'error', data: eventData });
  }
}

/**
 * Process a parsed SSE event and call the appropriate callback
 */
function processSSEEvent(
  eventType: string,
  data: unknown,
  onChunk: (chunk: ChatEvent) => void
): string | null {
  const type = eventType as ChatEvent['type'];
  const eventData = data as ChatEvent['data'];
  
  if (type === 'thread') {
    return handleThreadEvent(eventData, onChunk);
  }
  
  handleOtherEvent(type, eventData, onChunk);
  return null;
}

/**
 * Process a complete SSE event
 */
function processCompleteEvent(
  event: { type?: string; data?: string },
  onChunk: (chunk: ChatEvent) => void
): string | null {
  if (!event.type) {
    return null;
  }
  if (!event.data) {
    return null;
  }
  
  try {
    const data = JSON.parse(event.data);
    return processSSEEvent(event.type, data, onChunk);
  } catch (error) {
    console.error('Error parsing SSE data:', error, event);
    return null;
  }
}

/**
 * Process a single SSE line
 */
function processSSELine(
  line: string,
  currentEvent: { type?: string; data?: string }
): { isEventComplete: boolean; updatedEvent: { type?: string; data?: string } } {
  const trimmedLine = line.trim();
  
  if (!trimmedLine) {
    return { isEventComplete: true, updatedEvent: {} };
  }
  
  if (trimmedLine.startsWith('event: ')) {
    return {
      isEventComplete: false,
      updatedEvent: { ...currentEvent, type: trimmedLine.slice(7).trim() },
    };
  }
  
  if (trimmedLine.startsWith('data: ')) {
    return {
      isEventComplete: false,
      updatedEvent: { ...currentEvent, data: trimmedLine.slice(6) },
    };
  }
  
  return { isEventComplete: false, updatedEvent: currentEvent };
}

/**
 * Parse SSE lines and extract events
 */
function parseSSELines(
  lines: string[],
  currentEvent: { type?: string; data?: string },
  onChunk: (chunk: ChatEvent) => void
): { newThreadId: string | null; updatedEvent: { type?: string; data?: string } } {
  let newThreadId: string | null = null;
  let updatedEvent = { ...currentEvent };

  for (const line of lines) {
    const result = processSSELine(line, updatedEvent);
    
    if (result.isEventComplete) {
      const threadIdResult = processCompleteEvent(updatedEvent, onChunk);
      if (threadIdResult) {
        newThreadId = threadIdResult;
      }
      updatedEvent = result.updatedEvent;
    } else {
      updatedEvent = result.updatedEvent;
    }
  }

  return { newThreadId, updatedEvent };
}

/**
 * Send message using fetch with POST and ReadableStream for SSE
 */
export async function sendMessageStream(
  message: string,
  threadId: string | undefined,
  onChunk: (chunk: ChatEvent) => void
): Promise<string | null> {
  try {
    const response = await fetch('/api/chat/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ message, threadId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let newThreadId: string | null = null;
    let currentEvent: { type?: string; data?: string } = {};

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      const result = parseSSELines(lines, currentEvent, onChunk);
      if (result.newThreadId) {
        newThreadId = result.newThreadId;
      }
      currentEvent = result.updatedEvent;
    }
    
    // Process any remaining event in buffer
    if (currentEvent.type && currentEvent.data) {
      try {
        const data = JSON.parse(currentEvent.data);
        const threadIdResult = processSSEEvent(
          currentEvent.type,
          data,
          onChunk
        );
        if (threadIdResult) {
          newThreadId = threadIdResult;
        }
      } catch (error) {
        console.error('Error parsing final SSE data:', error);
      }
    }

    return newThreadId;
  } catch (error) {
    console.error('Error sending message:', error);
    onChunk({
      type: 'error',
      data: {
        error: error instanceof Error ? error.message : 'Failed to send message',
      },
    });
    return null;
  }
}
