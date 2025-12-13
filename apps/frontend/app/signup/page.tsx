'use client';

import Link from 'next/link';
import { useState } from 'react';
import { authClient, signUp } from '@/lib/auth-client';
import { logger } from '@/lib/logger';
import {
  toastDismiss,
  toastError,
  toastLoading,
  toastSuccess,
} from '@/lib/toast';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toastError('Passwords do not match');
      setLoading(false);
      return;
    }

    const loadingToastId = toastLoading('Creating account...');

    try {
      const result = await signUp.email({
        role: 'user',
        email,
        password,
        name,
      });

      toastDismiss(loadingToastId);

      if (result.error) {
        toastError('Signup failed', result.error.message);
      } else {
        toastSuccess('Account created successfully! Please check your email.');
        setShowVerificationMessage(true);
      }
    } catch (err) {
      toastDismiss(loadingToastId);
      toastError('An unexpected error occurred');
      logger.error({ err }, 'Signup error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      toastError('Email is required');
      return;
    }

    setResendLoading(true);
    const loadingToastId = toastLoading('Sending verification email...');

    try {
      const result = await authClient.sendVerificationEmail({
        email,
        callbackURL: '/',
      });

      toastDismiss(loadingToastId);

      if (result.error) {
        toastError('Failed to send verification email', result.error.message);
      } else {
        toastSuccess('Verification email sent! Please check your inbox.');
      }
    } catch (err) {
      toastDismiss(loadingToastId);
      toastError('An unexpected error occurred');
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
                  aria-label="Email verification icon"
                  aria-labelledby="Email verification icon"
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
                Check Your Email
              </h1>
              <p className="mb-2 text-zinc-300">
                We&apos;ve sent a verification link to
              </p>
              <p className="mb-6 font-medium text-blue-400">{email}</p>
              <p className="mb-6 text-sm text-zinc-400">
                Please click the link in the email to verify your account. The
                link will expire in 1 hour.
              </p>
              <div className="space-y-3">
                <button
                  className="w-full rounded bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-zinc-600"
                  disabled={resendLoading}
                  onClick={handleResendVerification}
                  type="button"
                >
                  {resendLoading ? 'Sending...' : 'Resend Verification Email'}
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
                  Back to Sign Up
                </button>
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-zinc-400">
                  Already verified?{' '}
                  <Link
                    className="text-blue-400 hover:text-blue-300"
                    href="/login"
                  >
                    Sign in
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
          <h1 className="mb-6 text-center font-bold text-3xl text-white">
            Create Account
          </h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                className="mb-2 block font-medium text-sm text-zinc-300"
                htmlFor="name"
              >
                Name
              </label>
              <input
                className="w-full rounded border border-zinc-700 bg-zinc-900 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                disabled={loading}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
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
                minLength={8}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                type="password"
                value={password}
              />
              <p className="mt-1 text-xs text-zinc-500">
                At least 8 characters
              </p>
            </div>

            <div>
              <label
                className="mb-2 block font-medium text-sm text-zinc-300"
                htmlFor="confirmPassword"
              >
                Confirm Password
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
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-400">
              Already have an account?{' '}
              <Link className="text-blue-400 hover:text-blue-300" href="/login">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
