'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { UserProfile } from '@/components/user-profile';
import { DonationCard } from '@/components/donations/donation-card';
import { Button } from '@/components/ui/button';
import { useDonation } from '@/lib/hooks/use-donation';
import { toast } from 'sonner';

export default function OngDoacoesPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const { getDonations, acceptDonation, collectDonation, isLoading } =
    useDonation();
  const [donations, setDonations] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('available');

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

  useEffect(() => {
    if (session?.user?.role === 'ong') {
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

  const handleAccept = async (donationId: string) => {
    try {
      await acceptDonation(donationId);
      toast.success('Doação aceita com sucesso!');
      loadDonations();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao aceitar doação'
      );
    }
  };

  const handleCollect = async (donationId: string) => {
    try {
      await collectDonation(donationId);
      toast.success('Coleta confirmada com sucesso!');
      loadDonations();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao confirmar coleta'
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

  if (!session || session.user?.role !== 'ong') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <main className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-bold text-4xl">Doações Disponíveis</h1>
          <UserProfile />
        </div>

        <div className="mb-6 flex gap-2">
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
              Nenhuma doação disponível no momento.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {donations.map((donation) => (
              <DonationCard
                key={donation.id}
                donation={donation}
                userRole="ong"
                onAccept={handleAccept}
                onCollect={handleCollect}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

