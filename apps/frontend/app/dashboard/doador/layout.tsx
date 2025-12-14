'use client';

import { AuthGuard } from '@/components/dashboard/auth-guard';
import { Sidebar } from '@/components/dashboard/sidebar';

export default function DoadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRole="doador" redirectTo="/login/doador">
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="ml-64 flex-1">{children}</main>
      </div>
    </AuthGuard>
  );
}

