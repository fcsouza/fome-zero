'use client';

import { Check, ArrowRight, Eye, ClipboardList, FileText, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export function AIFeatures() {
  return (
    <section id="funcionalidades" className="bg-white py-16 md:py-24">
      <div className="container mx-auto space-y-24 px-4">
        {/* Feature 1: Visual Validation */}
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-green-500">
              IA #1: VISÃO COMPUTACIONAL
            </p>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Validação Visual de Alimentos em Segundos
            </h2>
            <p className="mb-6 text-lg text-gray-600">
              Nossa visão computacional analisa fotos dos alimentos,
              identificando frescor, integridade e conformidade visual antes
              mesmo da doação sair de sua empresa. Evite erros humanos e
              padronize a qualidade.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                <span className="text-gray-600">
                  Análise de cor e textura para detectar deterioração.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                <span className="text-gray-600">
                  Detecção automática de embalagens danificadas.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                <span className="text-gray-600">
                  Classificação automática do tipo de alimento.
                </span>
              </li>
            </ul>
          </div>
          <div className="relative">
            <div className="rounded-lg bg-gray-100 p-4 sm:p-8">
              <div className="aspect-[9/16] max-w-[280px] mx-auto rounded-lg bg-gradient-to-br from-green-50 to-green-100" />
            </div>
          </div>
        </div>

        {/* Feature 2: Checklist */}
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <div className="rounded-lg bg-gray-100 p-8">
              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between border-b pb-2">
                    <h3 className="font-semibold text-green-600">
                      Checklist Sanitário
                    </h3>
                    <span className="text-xs text-gray-500">Lei 14.016</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-sm">Temperatura adequada (4°C)?</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-sm">Embalagem primária íntegra?</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span className="text-sm">Data de validade visível?</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-green-500">
              IA #2: CONFORMIDADE
            </p>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Checklist Inteligente e Dinâmico
            </h2>
            <p className="mb-6 text-lg text-gray-600">
              Nada é esquecido. Nossa IA gera checklists dinâmicos baseados no
              tipo de alimento e na legislação vigente. O sistema guia sua
              equipe passo a passo, garantindo que nenhum requisito sanitário
              seja ignorado.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm font-semibold text-green-700">
                  100% Auditável
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm font-semibold text-green-700">
                  0 Erros de processo
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 3: Certificate */}
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-green-500">
              IA #3: JURÍDICO
            </p>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Geração Automática de Documentação Legal
            </h2>
            <p className="mb-6 text-lg text-gray-600">
              Transforme dados em proteção. Após a validação, o Doe Seguro
              emite instantaneamente um "Certificado de Doação Segura", com
              assinatura digital e carimbo de tempo, servindo como prova de
              boa-fé e conformidade.
            </p>
            <Link
              href="#"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700"
            >
              Ver modelo de certificado
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div>
            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-green-500">
                    <Check className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">
                    Certificado de Doação
                  </span>
                </div>
                <div className="space-y-2 border-t pt-4 text-sm text-gray-600">
                  <p>Certificado Nº: DS-2024-00123</p>
                  <p>Data: 12 OUT 2024 - 10:30</p>
                  <p className="pt-4 text-xs text-gray-500">
                    Assinado Digitalmente
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feature 4: Chatbot */}
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <Card className="bg-gray-900 text-white">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-2 border-b border-gray-700 pb-2">
                  <MessageCircle className="h-5 w-5 text-green-400" />
                  <span className="font-semibold">Assistente Doe Seguro</span>
                </div>
                <div className="space-y-4">
                  <div className="rounded-lg bg-gray-800 p-3 text-sm">
                    Olá! Como posso ajudar com sua doação hoje?
                  </div>
                  <div className="ml-auto w-3/4 rounded-lg bg-green-500 p-3 text-sm">
                    Posso doar iogurtes com data de vencimento para amanhã?
                  </div>
                  <div className="rounded-lg bg-gray-800 p-3 text-sm">
                    Sim, desde que a cadeia de frio (0°C a 10°C) tenha sido
                    mantida. O consumo imediato é recomendado. Deseja iniciar?
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="order-1 lg:order-2">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-green-500">
              IA #4: SUPORTE 24/7
            </p>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Orientação Contextual Instantânea
            </h2>
            <p className="mb-6 text-lg text-gray-600">
              Surgiu uma dúvida no meio do processo? Nosso Chatbot especializado
              em segurança alimentar responde perguntas sobre armazenamento,
              transporte e legislação na hora, eliminando a incerteza da equipe
              operacional.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

