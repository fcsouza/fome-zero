'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Sua empresa pronta para doar com segurança?
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            Junte-se a centenas de empresas que transformaram o desperdício em
            impacto social sem riscos.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/signup/doador">
              <Button
                size="lg"
                className="w-full bg-green-500 text-white hover:bg-green-600 sm:w-auto"
              >
                Cadastrar Empresa
              </Button>
            </Link>
            <Link href="#contato">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
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

