'use client';

import { Loader2, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  type ChatEvent,
  type ChatMessage,
  sendMessageStream,
} from '@/lib/api/chat';

type ChatInterfaceProps = {
  className?: string;
};

function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        h1: ({ children }) => (
          <h1 className="mt-4 mb-2 font-bold text-xl first:mt-0">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="mt-4 mb-2 font-bold text-lg first:mt-0">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-3 mb-2 font-semibold text-base first:mt-0">
            {children}
          </h3>
        ),
        ul: ({ children }) => (
          <ul className="mb-2 list-inside list-disc space-y-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-2 list-inside list-decimal space-y-1">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="ml-2">{children}</li>,
        strong: ({ children }) => (
          <strong className="font-semibold">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        code: ({ children, className }) => {
          const isInline = !className;
          return isInline ? (
            <code className="rounded bg-gray-200 px-1 py-0.5 font-mono text-sm">
              {children}
            </code>
          ) : (
            <code className="block overflow-x-auto rounded bg-gray-200 p-2 font-mono text-sm">
              {children}
            </code>
          );
        },
        blockquote: ({ children }) => (
          <blockquote className="my-2 border-gray-300 border-l-4 pl-4 italic">
            {children}
          </blockquote>
        ),
        a: ({ children, href }) => (
          <a
            className="text-blue-600 hover:underline"
            href={href}
            rel="noopener noreferrer"
            target="_blank"
          >
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export function ChatInterface({ className }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentAssistantMessageRef = useRef<string>('');

  // biome-ignore lint/correctness/useExhaustiveDependencies: We want to scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Chat event handling requires multiple conditional branches
  const handleSend = async () => {
    if (!input.trim() || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    currentAssistantMessageRef.current = '';

    // Create placeholder for assistant message
    const assistantMessageId = `assistant-${Date.now()}`;
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);

    const handleThreadEvent = (threadIdValue: string) => {
      setThreadId(threadIdValue);
    };

    const handleDeltaEvent = (content: string) => {
      currentAssistantMessageRef.current += content;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: currentAssistantMessageRef.current }
            : msg
        )
      );
    };

    const handleDoneEvent = (fullResponse?: string) => {
      setIsLoading(false);
      if (fullResponse) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: fullResponse }
              : msg
          )
        );
      }
    };

    const handleErrorEvent = (error: string) => {
      setIsLoading(false);
      toast.error(error);
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== assistantMessageId)
      );
    };

    const handleEvent = (event: ChatEvent) => {
      switch (event.type) {
        case 'thread':
          if (event.data.threadId) {
            handleThreadEvent(event.data.threadId);
          }
          break;
        case 'delta':
          if (event.data.content) {
            handleDeltaEvent(event.data.content);
          }
          break;
        case 'done':
          handleDoneEvent(event.data.fullResponse);
          break;
        case 'error':
          handleErrorEvent(event.data.error || 'Erro ao processar mensagem');
          break;
        default:
          // Unknown event type, ignore
          break;
      }
    };

    try {
      const newThreadId = await sendMessageStream(
        userMessage.content,
        threadId || undefined,
        handleEvent
      );

      if (newThreadId && !threadId) {
        setThreadId(newThreadId);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(
        error instanceof Error ? error.message : 'Erro ao enviar mensagem'
      );
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== assistantMessageId)
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessageContent = (message: ChatMessage) => {
    if (message.role === 'assistant' && message.content) {
      return (
        <div className="prose prose-sm max-w-none break-words">
          <MarkdownRenderer content={message.content} />
        </div>
      );
    }
    if (message.content) {
      return (
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      );
    }
    return (
      <span className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Digitando...
      </span>
    );
  };

  return (
    <div className={`flex h-full flex-col ${className || ''}`}>
      <Card className="flex flex-1 flex-col overflow-hidden">
        <CardContent className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="mb-2 font-medium text-lg">
                  Olá! Como posso ajudá-lo hoje?
                </p>
                <p className="text-sm">
                  Faça perguntas sobre doações, certificados ou qualquer dúvida
                  relacionada à plataforma.
                </p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
              key={message.id}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {renderMessageContent(message)}
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </CardContent>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              className="resize-none"
              disabled={isLoading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              rows={2}
              value={input}
            />
            <Button
              className="bg-green-500 text-white hover:bg-green-600"
              disabled={!input.trim() || isLoading}
              onClick={handleSend}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

