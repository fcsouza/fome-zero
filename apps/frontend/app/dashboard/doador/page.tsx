'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { UserProfile } from '@/components/user-profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DoadorDashboard() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push('/login/doador');
        return;
      }
      if (session.user?.role !== 'doador') {
        router.push('/login/doador');
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

  if (!session || session.user?.role !== 'doador') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <main className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-bold text-4xl">Área do Doador</h1>
          <UserProfile />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bem-vindo, {session.user.name}!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Esta é sua área de doador. Aqui você pode ver suas doações,
                histórico e muito mais.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Funcionalidades do Doador</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-2 pl-5">
                <li>Visualizar doações realizadas</li>
                <li>Histórico de contribuições</li>
                <li>ONGs que você apoia</li>
                <li>Configurações da conta</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

