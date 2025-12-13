'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authClient, signUp } from '@/lib/auth-client';
import { logger } from '@/lib/logger';
import {
  toastDismiss,
  toastError,
  toastLoading,
  toastSuccess,
} from '@/lib/toast';

export default function OngSignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toastError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    const loadingToastId = toastLoading('Criando conta...');

    try {
      const result = await signUp.email({
        email,
        password,
        name,
        role: 'ong',
      });

      toastDismiss(loadingToastId);

      if (result.error) {
        toastError('Falha no cadastro', result.error.message);
      } else {
        toastSuccess('Conta criada com sucesso! Verifique seu email.');
        setShowVerificationMessage(true);
      }
    } catch (err) {
      toastDismiss(loadingToastId);
      toastError('Ocorreu um erro inesperado');
      logger.error({ err }, 'Signup error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      toastError('Email é obrigatório');
      return;
    }

    setResendLoading(true);
    const loadingToastId = toastLoading('Enviando email de verificação...');

    try {
      const result = await authClient.sendVerificationEmail({
        email,
        callbackURL: '/dashboard/ong',
      });

      toastDismiss(loadingToastId);

      if (result.error) {
        toastError('Falha ao enviar email', result.error.message);
      } else {
        toastSuccess('Email de verificação enviado! Verifique sua caixa de entrada.');
      }
    } catch (err) {
      toastDismiss(loadingToastId);
      toastError('Ocorreu um erro inesperado');
      logger.error({ err }, 'Resend verification error');
    } finally {
      setResendLoading(false);
    }
  };

  if (showVerificationMessage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-900 to-black p-8">
        <div className="w-full max-w-md">
          <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-8">
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-600/20">
                <svg
                  aria-label="Ícone de verificação de email"
                  className="h-8 w-8 text-blue-400"
                  fill="none"
                  role="img"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <h1 className="mb-4 text-center font-bold text-3xl text-white">
                Verifique seu Email
              </h1>
              <p className="mb-2 text-zinc-300">
                Enviamos um link de verificação para
              </p>
              <p className="mb-6 font-medium text-blue-400">{email}</p>
              <p className="mb-6 text-sm text-zinc-400">
                Clique no link do email para verificar sua conta. O link expira
                em 1 hora.
              </p>
              <div className="space-y-3">
                <button
                  className="w-full rounded bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-zinc-600"
                  disabled={resendLoading}
                  onClick={handleResendVerification}
                  type="button"
                >
                  {resendLoading
                    ? 'Enviando...'
                    : 'Reenviar Email de Verificação'}
                </button>
                <button
                  className="w-full rounded border border-zinc-700 bg-transparent px-6 py-3 font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
                  onClick={() => {
                    setShowVerificationMessage(false);
                    setName('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                  }}
                  type="button"
                >
                  Voltar ao Cadastro
                </button>
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-zinc-400">
                  Já verificou?{' '}
                  <Link
                    className="text-blue-400 hover:text-blue-300"
                    href="/login/ong"
                  >
                    Entrar
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-900 to-black p-8">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-8">
          <h1 className="mb-2 text-center font-bold text-3xl text-white">
            Cadastro de ONG
          </h1>
          <p className="mb-6 text-center text-sm text-zinc-400">
            Crie sua conta para gerenciar sua ONG
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                className="mb-2 block font-medium text-sm text-zinc-300"
                htmlFor="name"
              >
                Nome da ONG
              </label>
              <input
                className="w-full rounded border border-zinc-700 bg-zinc-900 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                disabled={loading}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome da sua ONG"
                required
                type="text"
                value={name}
              />
            </div>

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
                placeholder="contato@ong.org"
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
                minLength={8}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                type="password"
                value={password}
              />
              <p className="mt-1 text-xs text-zinc-500">
                Mínimo de 8 caracteres
              </p>
            </div>

            <div>
              <label
                className="mb-2 block font-medium text-sm text-zinc-300"
                htmlFor="confirmPassword"
              >
                Confirmar Senha
              </label>
              <input
                className="w-full rounded border border-zinc-700 bg-zinc-900 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                disabled={loading}
                minLength={8}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                type="password"
                value={confirmPassword}
              />
            </div>

            <button
              className="w-full rounded bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-zinc-600"
              disabled={loading}
              type="submit"
            >
              {loading ? 'Criando conta...' : 'Cadastrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-400">
              Já tem uma conta?{' '}
              <Link
                className="text-blue-400 hover:text-blue-300"
                href="/login/ong"
              >
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

