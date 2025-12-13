'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signIn, useSession, type AuthUser } from '@/lib/auth-client';
import { logger } from '@/lib/logger';
import {
  toastDismiss,
  toastError,
  toastLoading,
  toastSuccess,
} from '@/lib/toast';

export default function DoadorLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const loadingToastId = toastLoading('Entrando...');

    try {
      const result = await signIn.email({
        email,
        password,
      });

      toastDismiss(loadingToastId);

      if (result.error) {
        toastError('Falha no login', result.error.message);
      } else {
        // Verificar se o usuário tem o role correto
        const user = result.data?.user as AuthUser | undefined;
        if (user?.role === 'doador') {
          toastSuccess('Login realizado com sucesso! Redirecionando...');
          router.push('/dashboard/doador');
        } else {
          toastError('Esta conta não é de um doador. Por favor, acesse a área correta.');
        }
      }
    } catch (err) {
      toastDismiss(loadingToastId);
      toastError('Ocorreu um erro inesperado');
      logger.error({ err }, 'Login error');
    } finally {
      setLoading(false);
    }
  };

  // Se já estiver logado e for doador, redirecionar
  if (session?.user?.role === 'doador') {
    router.push('/dashboard/doador');
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-900 to-black p-8">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-8">
          <h1 className="mb-2 text-center font-bold text-3xl text-white">
            Área do Doador
          </h1>
          <p className="mb-6 text-center text-sm text-zinc-400">
            Faça login para acessar sua área
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                className="mb-2 block font-medium text-sm text-zinc-300"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="w-full rounded border border-zinc-700 bg-zinc-900 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                type="email"
                value={email}
              />
            </div>

            <div>
              <label
                className="mb-2 block font-medium text-sm text-zinc-300"
                htmlFor="password"
              >
                Senha
              </label>
              <input
                className="w-full rounded border border-zinc-700 bg-zinc-900 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                type="password"
                value={password}
              />
            </div>

            <button
              className="w-full rounded bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-zinc-600"
              disabled={loading}
              type="submit"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-400">
              Não tem uma conta?{' '}
              <Link
                className="text-blue-400 hover:text-blue-300"
                href="/signup/doador"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

