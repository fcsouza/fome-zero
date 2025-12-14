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
    <section id="solucao" className="bg-white dark:bg-slate-900 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-500">
            NOSSA METODOLOGIA
          </p>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            4 Pilares da Doação Segura
          </h2>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div key={index} className="text-center group">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 transition-colors group-hover:bg-emerald-500/10">
                  <Icon className="h-8 w-8 text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                  {pillar.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
