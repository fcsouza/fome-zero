'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { DonationCard } from '@/components/donations/donation-card';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { useDonation } from '@/lib/hooks/use-donation';
import { donationsApi } from '@/lib/api/donations';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function DoadorDoacoesPage() {
  const { data: session } = useSession();
  const { getDonations, isLoading } = useDonation();
  const [donations, setDonations] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('all');

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

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mb-2 text-2xl md:text-3xl font-bold text-gray-900">Minhas Doações</h1>
          <p className="text-sm md:text-base text-gray-600">
            Gerencie e acompanhe todas as suas doações
          </p>
        </div>
        <Link href="/dashboard/doador/nova-doacao" className="w-full md:w-auto">
          <Button className="w-full md:w-auto bg-green-500 text-white hover:bg-green-600">
            <Plus className="mr-2 h-4 w-4" />
            Nova Doação
          </Button>
        </Link>
      </div>

      <div className="space-y-4 md:space-y-6">

      <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={
              filter === 'all'
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }
          >
            Todas
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
            className={
              filter === 'pending'
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }
          >
            Pendentes
          </Button>
          <Button
            variant={filter === 'available' ? 'default' : 'outline'}
            onClick={() => setFilter('available')}
            className={
              filter === 'available'
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }
          >
            Disponíveis
          </Button>
          <Button
            variant={filter === 'accepted' ? 'default' : 'outline'}
            onClick={() => setFilter('accepted')}
            className={
              filter === 'accepted'
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }
          >
            Aceitas
          </Button>
          <Button
            variant={filter === 'collected' ? 'default' : 'outline'}
            onClick={() => setFilter('collected')}
            className={
              filter === 'collected'
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }
          >
            Coletadas
          </Button>
        </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loading message="Carregando doações..." />
        </div>
      ) : donations.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 md:p-12 text-center">
          <p className="text-sm md:text-base text-gray-600 mb-4">
            Nenhuma doação encontrada.
          </p>
          <Link href="/dashboard/doador/nova-doacao">
            <Button className="bg-green-500 text-white hover:bg-green-600">
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeira Doação
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      </div>
    </div>
  );
}

