'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useSession } from '@/lib/auth-client';
import { logger } from '@/lib/logger';
import { toastError } from '@/lib/toast';

type UserProfile = {
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  image?: string | null;
  createdAt: Date;
};

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: _
    const loadProfile = async () => {
      if (isPending) {
        return;
      }

      if (!session?.user) {
        router.push('/login');
        return;
      }

      try {
        const response = await api.api.user.profile.get();

        if (response.error) {
          toastError('Failed to load profile');
        } else if (response.data) {
          setProfile(response.data as UserProfile);
        }
      } catch (err) {
        toastError('An error occurred while loading profile');
        logger.error({ err }, 'Profile error');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [session, isPending, router]);

  if (isPending || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-900 to-black">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <Link
            className="text-blue-400 transition-colors hover:text-blue-300"
            href="/"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-8">
          <h1 className="mb-6 font-bold text-3xl text-white">User Profile</h1>

          {profile && (
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 font-semibold text-4xl text-white">
                  {profile.name[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h2 className="font-semibold text-2xl text-white">
                    {profile.name}
                  </h2>
                  <p className="text-zinc-400">{profile.email}</p>
                </div>
              </div>

              <div className="space-y-4 border-zinc-700 border-t pt-6">
                <div>
                  <label
                    className="mb-1 block font-medium text-sm text-zinc-400"
                    htmlFor="userId"
                  >
                    User ID
                  </label>
                  <p className="rounded bg-zinc-900 p-2 font-mono text-sm text-white">
                    {profile.id}
                  </p>
                </div>

                <div>
                  <label
                    className="mb-1 block font-medium text-sm text-zinc-400"
                    htmlFor="emailVerified"
                  >
                    Email Verified
                  </label>
                  <p className="text-white">
                    {profile.emailVerified ? (
                      <span className="text-green-400">✓ Verified</span>
                    ) : (
                      <span className="text-yellow-400">⚠ Not verified</span>
                    )}
                  </p>
                </div>

                <div>
                  <label
                    className="mb-1 block font-medium text-sm text-zinc-400"
                    htmlFor="createdAt"
                  >
                    Account Created
                  </label>
                  <p className="text-white">
                    {new Date(profile.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="border-zinc-700 border-t pt-6">
                <h3 className="mb-4 font-semibold text-lg text-white">
                  Protected Route Demo
                </h3>
                <div className="rounded-lg border border-green-500 bg-green-500/10 p-4">
                  <p className="text-green-400 text-sm">
                    ✓ This page is protected by authentication. Only
                    authenticated users can access this page and the
                    /user/profile API endpoint.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
