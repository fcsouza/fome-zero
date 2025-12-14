'use client';

import { Target, ClipboardCheck, ShieldCheck, Clock } from 'lucide-react';

const pillars = [
  {
    icon: Target,
    title: 'Validação Visual',
    description: 'Análise fotos em tempo real',
  },
  {
    icon: ClipboardCheck,
    title: 'Orientação',
    description: 'Checklists de conformidade',
  },
  {
    icon: ShieldCheck,
    title: 'Proteção Legal',
    description: 'Certificados automáticos',
  },
  {
    icon: Clock,
    title: 'Rastreio',
    description: 'Histórico completo',
  },
];

export function Pillars() {
  return (
    <section id="solucao" className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-green-500">
            NOSSA METODOLOGIA
          </p>
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            4 Pilares da Doação Segura
          </h2>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div key={index} className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <Icon className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {pillar.title}
                </h3>
                <p className="text-sm text-gray-600">{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

