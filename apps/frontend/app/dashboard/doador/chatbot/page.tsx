'use client';

import { ChatInterface } from '@/components/chat/chat-interface';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ChatbotPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-3xl text-gray-900">Chatbot</h1>
        <p className="text-gray-600">
          Converse com nosso assistente de IA para tirar dúvidas sobre doações,
          certificados e a plataforma
        </p>
      </div>

      <Card className="h-[calc(100vh-12rem)]">
        <CardHeader>
          <CardTitle className="text-gray-900">Assistente Virtual</CardTitle>
          <CardDescription>
            Faça perguntas e receba respostas em tempo real
          </CardDescription>
        </CardHeader>
        <div className="h-[calc(100%-8rem)] px-6 pb-6">
          <ChatInterface />
        </div>
      </Card>
    </div>
  );
}
