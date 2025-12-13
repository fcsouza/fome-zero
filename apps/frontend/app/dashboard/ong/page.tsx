'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { UserProfile } from '@/components/user-profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OngDashboard() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push('/login/ong');
        return;
      }
      if (session.user?.role !== 'ong') {
        router.push('/login/ong');
        return;
      }
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!session || session.user?.role !== 'ong') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <main className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-bold text-4xl">Área da ONG</h1>
          <UserProfile />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bem-vinda, {session.user.name}!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Esta é sua área de ONG. Aqui você pode gerenciar doações,
                campanhas e muito mais.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Funcionalidades da ONG</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-2 pl-5">
                <li>Gerenciar doações recebidas</li>
                <li>Criar e gerenciar campanhas</li>
                <li>Visualizar doadores</li>
                <li>Relatórios e estatísticas</li>
                <li>Configurações da ONG</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

