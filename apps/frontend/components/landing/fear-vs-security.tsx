'use client';

import { AlertTriangle, FileQuestion, AlertCircle, UserX } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const problems = [
  {
    icon: AlertTriangle,
    iconColor: 'text-red-500',
    title: 'Risco Legal',
    description:
      'Receio de processos judiciais caso o alimento cause algum problema.',
  },
  {
    icon: FileQuestion,
    iconColor: 'text-orange-500',
    title: 'Falta de Processo',
    description:
      'Desconhecimento das normas complexas da ANVISA e documentação.',
  },
  {
    icon: AlertCircle,
    iconColor: 'text-yellow-500',
    title: 'Incerteza Sanitária',
    description:
      'Dúvidas sobre a qualidade real do alimento no momento da doação.',
  },
  {
    icon: UserX,
    iconColor: 'text-blue-500',
    title: 'Risco de Reputação',
    description:
      'Medo de expor a marca negativamente na mídia.',
  },
];

export function FearVsSecurity() {
  return (
    <section id="problema" className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            O Medo de Doar vs. A Segurança de Doar
          </h2>
          <p className="text-lg text-gray-600">
            Muitas empresas preferem o desperdício à insegurança jurídica. Nós
            mudamos essa lógica com tecnologia.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <Card key={index} className="bg-white">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <Icon className={`h-8 w-8 ${problem.iconColor}`} />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    {problem.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {problem.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

