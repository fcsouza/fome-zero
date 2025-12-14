'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-green-500">
              <Check className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-800">
              Doe Seguro
            </span>
          </Link>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link
              href="/termos"
              className="text-sm text-gray-600 transition-colors hover:text-gray-900"
            >
              Termos de Uso
            </Link>
            <Link
              href="/privacidade"
              className="text-sm text-gray-600 transition-colors hover:text-gray-900"
            >
              Privacidade
            </Link>
            <Link
              href="/ajuda"
              className="text-sm text-gray-600 transition-colors hover:text-gray-900"
            >
              Ajuda
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-gray-600">
            © 2025 Doe Seguro. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

