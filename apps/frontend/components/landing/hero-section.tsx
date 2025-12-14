'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left: Text Content */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
              Transforme a Incerteza em{' '}
              <span className="text-green-500">Impacto Social</span>
            </h1>

            <p className="text-lg text-gray-600 md:text-xl">
              O medo de processos e normas complexas impede sua empresa de
              doar? O Doe Seguro utiliza Inteligência Artificial para garantir
              validação jurídica e sanitária em cada doação.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/signup/doador">
                <Button
                  size="lg"
                  className="w-full bg-green-500 text-white hover:bg-green-600 sm:w-auto"
                >
                  Doar com Segurança
                </Button>
              </Link>
              <Link href="#como-funciona">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Ver Como Funciona
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-2 text-sm text-green-600">
              <Check className="h-4 w-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm">
                Certificado Digital em conformidade com a Lei 14.016/2020
              </span>
            </div>
          </div>

          {/* Right: Image with Overlay */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-lg bg-gray-100">
              {/* Placeholder for image */}
              <div className="aspect-[4/3] bg-gradient-to-br from-green-50 to-green-100" />
              
              {/* Overlay Status Box */}
              <div className="absolute bottom-4 right-4 rounded-lg bg-white/95 p-4 shadow-lg backdrop-blur">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500">
                      STATUS DA DOAÇÃO
                    </p>
                    <p className="text-sm font-bold text-green-600">
                      Validada por IA & Aprovada
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

