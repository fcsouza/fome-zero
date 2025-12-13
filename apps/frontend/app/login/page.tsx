'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signIn } from '@/lib/auth-client';
import { logger } from '@/lib/logger';
import {
  toastDismiss,
  toastError,
  toastLoading,
  toastSuccess,
} from '@/lib/toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const loadingToastId = toastLoading('Signing in...');

    try {
      const result = await signIn.email({
        email,
        password,
      });

      toastDismiss(loadingToastId);

      if (result.error) {
        toastError('Login failed', result.error.message);
      } else {
        toastSuccess('Login successful! Redirecting...');
        router.push('/');
      }
    } catch (err) {
      toastDismiss(loadingToastId);
      toastError('An unexpected error occurred');
      logger.error({ err }, 'Login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-900 to-black p-8">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-8">
          <h1 className="mb-6 text-center font-bold text-3xl text-white">
            Sign In
          </h1>

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
                placeholder="your@email.com"
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
                Password
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
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-400">
              Don&apos;t have an account?{' '}
              <Link
                className="text-blue-400 hover:text-blue-300"
                href="/signup"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
