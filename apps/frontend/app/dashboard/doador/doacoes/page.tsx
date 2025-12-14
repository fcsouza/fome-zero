'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { UserProfile } from '@/components/user-profile';
import { DonationCard } from '@/components/donations/donation-card';
import { Button } from '@/components/ui/button';
import { useDonation } from '@/lib/hooks/use-donation';
import { donationsApi } from '@/lib/api/donations';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function DoadorDoacoesPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const { getDonations, isLoading } = useDonation();
  const [donations, setDonations] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('all');

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

  useEffect(() => {
    if (session?.user?.role === 'doador') {
      loadDonations();
    }
  }, [session, filter]);

  const loadDonations = async () => {
    try {
      const filters = filter !== 'all' ? { status: filter } : undefined;
      const data = await getDonations(filters);
      setDonations(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao carregar doações'
      );
    }
  };

  const handleDownloadCertificate = async (donationId: string) => {
    try {
      await donationsApi.downloadCertificate(donationId);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Erro ao baixar certificado'
      );
    }
  };

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
      <main className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-bold text-4xl">Minhas Doações</h1>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/doador/nova-doacao">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Doação
              </Button>
            </Link>
            <UserProfile />
          </div>
        </div>

        <div className="mb-6 flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            Todas
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
          >
            Pendentes
          </Button>
          <Button
            variant={filter === 'available' ? 'default' : 'outline'}
            onClick={() => setFilter('available')}
          >
            Disponíveis
          </Button>
          <Button
            variant={filter === 'accepted' ? 'default' : 'outline'}
            onClick={() => setFilter('accepted')}
          >
            Aceitas
          </Button>
          <Button
            variant={filter === 'collected' ? 'default' : 'outline'}
            onClick={() => setFilter('collected')}
          >
            Coletadas
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p>Carregando...</p>
          </div>
        ) : donations.length === 0 ? (
          <div className="rounded-lg border p-12 text-center">
            <p className="text-muted-foreground">
              Nenhuma doação encontrada.
            </p>
            <Link href="/dashboard/doador/nova-doacao">
              <Button className="mt-4">Criar Primeira Doação</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {donations.map((donation) => (
              <DonationCard
                key={donation.id}
                donation={donation}
                userRole="doador"
                onDownloadCertificate={handleDownloadCertificate}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

