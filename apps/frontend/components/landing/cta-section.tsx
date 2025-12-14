'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="bg-white dark:bg-slate-900 py-16 md:py-24 border-t border-slate-100 dark:border-slate-800">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            Sua empresa pronta para doar com segurança?
          </h2>
          <p className="mb-8 text-lg text-slate-600 dark:text-slate-400">
            Junte-se a centenas de empresas que transformaram o desperdício em
            impacto social sem riscos.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/signup/doador">
              <Button
                size="lg"
                className="w-full bg-emerald-500 text-white hover:bg-emerald-600 sm:w-auto"
              >
                Cadastrar Empresa
              </Button>
            </Link>
            <Link href="#contato">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Falar com Consultor
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
