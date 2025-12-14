'use client';

import { Download, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';
import { type Donation, donationsApi } from '@/lib/api/donations';
import { useSession } from '@/lib/auth-client';
import { useDonation } from '@/lib/hooks/use-donation';

type Certificate = {
  id: string;
  donationId: string;
  certificateNumber: string;
  createdAt: Date | string;
  tipoAlimento: string;
  descricao?: string | null;
  quantidade?: string | null;
};

export default function CertificadosPage() {
  const { data: session } = useSession();
  const { getDonations, isLoading } = useDonation();
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    if (session?.user?.role === 'doador') {
      const loadCertificates = async () => {
        try {
          const donations = await getDonations();
          
          // Filter donations that have certificates and map to certificate format
          const certs: Certificate[] = donations
            .filter((d: Donation) => d.certificate)
            .map((d: Donation) => ({
              id: d.id,
              donationId: d.id,
              certificateNumber: d.certificate?.certificateNumber || '',
              createdAt: d.createdAt,
              tipoAlimento: d.tipoAlimento,
              descricao: d.descricao,
              quantidade: d.quantidade,
            }));
          
          setCertificates(certs);
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : 'Erro ao carregar certificados'
          );
        }
      };
      
      loadCertificates();
    }
  }, [session, getDonations]);

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return `Hoje, ${d.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    }
    if (d.toDateString() === yesterday.toDateString()) {
      return `Ontem, ${d.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    }
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleDownloadCertificate = async (donationId: string) => {
    try {
      await donationsApi.downloadCertificate(donationId);
      toast.success('Certificado baixado com sucesso!');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao baixar certificado'
      );
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="mb-2 font-bold text-2xl text-gray-900 md:text-3xl">
          Meus Certificados
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Visualize e baixe todos os seus certificados de doação
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loading message="Carregando certificados..." />
        </div>
      )}
      {!isLoading && certificates.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center md:p-12">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <p className="mb-2 font-medium text-gray-900 text-lg">
            Nenhum certificado encontrado
          </p>
          <p className="text-gray-600 text-sm md:text-base">
            Você ainda não possui certificados. Os certificados são gerados
            automaticamente quando suas doações são aceitas.
          </p>
        </div>
      )}
      {!isLoading && certificates.length > 0 && (
        <div className="space-y-4">
          {certificates.map((cert) => (
            <Card className="overflow-hidden" key={cert.id}>
              <CardContent className="p-0">
                <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between md:p-6">
                  <div className="flex min-w-0 flex-1 items-start gap-4">
                    <div className="flex-shrink-0 rounded-lg bg-red-100 p-3">
                      <FileText className="h-5 w-5 text-red-600 md:h-6 md:w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          Certificado #{cert.certificateNumber}
                        </h3>
                        <p className="mt-1 text-gray-500 text-sm">
                          Emitido em {formatDate(cert.createdAt)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900 text-sm">
                          {cert.tipoAlimento}
                        </p>
                        {cert.descricao && (
                          <p className="line-clamp-2 text-gray-600 text-sm">
                            {cert.descricao}
                          </p>
                        )}
                        {cert.quantidade && (
                          <p className="text-gray-500 text-xs">
                            Quantidade: {cert.quantidade}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Button
                      className="w-full bg-green-500 text-white hover:bg-green-600 md:w-auto"
                      onClick={() => handleDownloadCertificate(cert.donationId)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Baixar PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
