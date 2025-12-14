'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { Loading } from '@/components/ui/loading';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'doador' | 'ong';
  redirectTo?: string;
}

export function AuthGuard({
  children,
  requiredRole,
  redirectTo,
}: AuthGuardProps) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push(redirectTo || '/login');
        return;
      }
      if (requiredRole && session.user?.role !== requiredRole) {
        router.push(redirectTo || `/login/${requiredRole}`);
        return;
      }
    }
  }, [session, isPending, router, requiredRole, redirectTo]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loading message="Carregando..." />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (requiredRole && session.user?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}

