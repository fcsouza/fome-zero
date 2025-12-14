'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDonation } from '@/lib/hooks/use-donation';
import { donationsApi } from '@/lib/api/donations';
import Link from 'next/link';
import {
  Plus,
  TrendingUp,
  Scale,
  Heart,
  CheckCircle2,
  Eye,
  Pencil,
  Download,
  RefreshCw,
  FileText,
  History,
  Package,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Loading } from '@/components/ui/loading';
import { toast } from 'sonner';

export default function DoadorDashboard() {
  const { data: session } = useSession();
  const { getDonations, isLoading } = useDonation();
  const [donations, setDonations] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getDonations();
      setDonations(data);

      // Get certificates from donations that have them
      const certs = data
        .filter((d) => d.certificate)
        .map((d) => ({
          id: d.id,
          certificateNumber: d.certificate?.certificateNumber,
          createdAt: d.createdAt,
        }))
        .slice(0, 3);
      setCertificates(certs);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    }
  };

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-blue-100 text-blue-700">
            <div className="mr-1 h-2 w-2 rounded-full bg-blue-500"></div>
            Analisando (98%)
          </Badge>
        );
      case 'available':
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Pronto p/ Retirada
          </Badge>
        );
      case 'accepted':
        return (
          <Badge className="bg-gray-100 text-gray-700">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Validado
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-700">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            {status}
          </Badge>
        );
    }
  };

  // Calculate statistics
  const totalDonated = donations.length;
  const livesImpacted = donations.reduce((acc, d) => {
    const qty = parseInt(d.quantidade?.match(/\d+/)?.[0] || '0');
    return acc + qty;
  }, 0);
  const totalCertificates = certificates.length;

  const activeDonations = donations.slice(0, 3);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Olá, Parceiro Doador
          </h1>
          <p className="text-gray-600">
            Você está transformando incerteza em impacto. Hoje é um ótimo dia
            para doar com segurança.
          </p>
        </div>
        <Link href="/dashboard/doador/nova-doacao">
          <Button className="bg-green-500 text-white hover:bg-green-600">
            <Plus className="mr-2 h-4 w-4" />
            Nova Doação
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="mb-1 text-sm font-medium text-gray-600">
                  TOTAL DOADO
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalDonated > 0 ? `${(totalDonated * 0.1).toFixed(1)} Ton` : '0 Ton'}
                </p>
                <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>+12%</span>
                </div>
              </div>
              <div className="rounded-lg bg-green-100 p-3">
                <Scale className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="mb-1 text-sm font-medium text-gray-600">
                  VIDAS IMPACTADAS
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {livesImpacted > 0 ? `${livesImpacted.toLocaleString()} Refeições servidas` : '0 Refeições servidas'}
                </p>
              </div>
              <div className="rounded-lg bg-green-100 p-3">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="mb-1 text-sm font-medium text-gray-600">
                  CERTIFICADOS
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalCertificates}
                </p>
                <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>+8%</span>
                </div>
              </div>
              <div className="rounded-lg bg-green-100 p-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Active Donations */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Doações Ativas</h2>
            </div>
            <Link
              href="/dashboard/doador/doacoes"
              className="text-sm font-medium text-green-600 hover:text-green-700"
            >
              Ver todas
            </Link>
          </div>

          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loading message="Carregando..." />
                </div>
              ) : activeDonations.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-600">Nenhuma doação ativa</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {activeDonations.map((donation) => (
                    <div
                      key={donation.id}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50"
                    >
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                          <Package className="h-8 w-8" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900">
                          {donation.tipoAlimento}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {donation.quantidade || 'Sem quantidade especificada'}
                        </p>
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(donation.createdAt)}
                      </div>
                      <div>{getStatusBadge(donation.status)}</div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {donation.status === 'available' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        {donation.certificate && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900"
                            onClick={() =>
                              donationsApi.downloadCertificate(donation.id)
                            }
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="border-t border-gray-200 bg-gray-50 p-4 text-center">
                <p className="text-xs text-gray-500">
                  Validado com segurança pela IA Doe Seguro
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Certificates */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Certificados</h2>
            </div>
            <Link
              href="/dashboard/doador/certificados"
              className="text-sm font-medium text-green-600 hover:text-green-700"
            >
              Gerenciar
            </Link>
          </div>

          <Card>
            <CardContent className="p-0">
              {certificates.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-gray-600">
                    Nenhum certificado disponível
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {certificates.map((cert, index) => (
                    <div
                      key={cert.id}
                      className="flex items-center justify-between p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-red-100 p-2">
                          <FileText className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Certificado #{cert.certificateNumber}
                          </p>
                          <p className="text-xs text-gray-500">
                            Emitido em {formatDate(cert.createdAt)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900"
                        onClick={() =>
                          donationsApi.downloadCertificate(cert.id)
                        }
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <div className="border-t border-gray-200 p-4">
                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  asChild
                >
                  <Link href="/dashboard/doador/certificados">
                    <History className="mr-2 h-4 w-4" />
                    Ver histórico completo
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
