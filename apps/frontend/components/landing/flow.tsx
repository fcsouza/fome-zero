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
    <section id="como-funciona" className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Fluxo Completo da Solução
          </h2>
          <p className="text-lg text-gray-600">
            Simples, rápido e seguro.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                  <Icon className="h-8 w-8 text-gray-700" />
                </div>
                <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white shadow-md">
                  {step.number}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

