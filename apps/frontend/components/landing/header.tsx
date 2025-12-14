'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-500">
            <Check className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-slate-900 dark:text-white">
            Doe Seguro
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          <a
            href="#problema"
            className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors hover:text-emerald-500 dark:hover:text-emerald-400"
          >
            O Problema
          </a>
          <a
            href="#solucao"
            className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors hover:text-emerald-500 dark:hover:text-emerald-400"
          >
            A Solução
          </a>
          <a
            href="#funcionalidades"
            className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors hover:text-emerald-500 dark:hover:text-emerald-400"
          >
            Funcionalidades
          </a>
          <a
            href="#como-funciona"
            className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors hover:text-emerald-500 dark:hover:text-emerald-400"
          >
            Como Funciona
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/login/doador" className="hidden sm:block">
            <Button variant="ghost" size="sm" className="text-slate-700 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400">
              Login
            </Button>
          </Link>
          <Link href="/signup/doador">
            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <span className="hidden sm:inline">Começar Agora</span>
              <span className="sm:hidden">Começar</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
