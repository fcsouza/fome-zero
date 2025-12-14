'use client';

import { Camera, FileCheck, ShieldCheck, Truck } from 'lucide-react';

const steps = [
  {
    icon: Camera,
    number: '1',
    title: 'Registro Visual',
    description: 'Capture fotos do lote de alimentos via app.',
  },
  {
    icon: FileCheck,
    number: '2',
    title: 'Validação IA',
    description: 'O sistema analisa e preenche o checklist.',
  },
  {
    icon: ShieldCheck,
    number: '3',
    title: 'Certificação',
    description: 'Documento legal gerado automaticamente.',
  },
  {
    icon: Truck,
    number: '4',
    title: 'Destinação',
    description: 'Doação segura com a ONG receptora.',
  },
];

export function Flow() {
  return (
    <section id="como-funciona" className="bg-slate-50 dark:bg-slate-950 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            Fluxo Completo da Solução
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Simples, rápido e seguro.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                  <Icon className="h-8 w-8 text-slate-700 dark:text-slate-200" />
                </div>
                <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white shadow-md">
                  {step.number}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
