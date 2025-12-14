'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface DonationCardProps {
  donation: {
    id: string;
    tipoAlimento: string;
    descricao?: string | null;
    quantidade?: string | null;
    status: string;
    createdAt: Date | string;
    certificate?: {
      certificateNumber: string;
    } | null;
  };
  onView?: (id: string) => void;
  onAccept?: (id: string) => void;
  onCollect?: (id: string) => void;
  onDownloadCertificate?: (id: string) => void;
  userRole?: 'doador' | 'ong';
}

export function DonationCard({
  donation,
  onView,
  onAccept,
  onCollect,
  onDownloadCertificate,
  userRole,
}: DonationCardProps) {
  const getStatusBadge = () => {
    switch (donation.status) {
      case 'pending':
        return (
          <Badge variant="outline">
            <Clock className="mr-1 h-3 w-3" />
            Pendente
          </Badge>
        );
      case 'available':
        return (
          <Badge className="bg-green-500">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Disponível
          </Badge>
        );
      case 'accepted':
        return (
          <Badge className="bg-blue-500">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Aceita
          </Badge>
        );
      case 'collected':
        return (
          <Badge className="bg-gray-500">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Coletada
          </Badge>
        );
      default:
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            {donation.status}
          </Badge>
        );
    }
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold leading-tight text-gray-900">
            {donation.tipoAlimento}
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col space-y-4">
        {donation.descricao && (
          <p className="text-sm leading-relaxed text-gray-600">
            {donation.descricao}
          </p>
        )}

        <div className="space-y-2">
          {donation.quantidade && (
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-900">Quantidade</span>
              <span className="text-gray-600">{donation.quantidade}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-900">Data</span>
            <span className="text-gray-600">
              {formatDate(donation.createdAt)}
            </span>
          </div>
        </div>

        {donation.certificate && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">
                  Certificado
                </p>
                <p className="text-sm font-mono text-gray-900">
                  {donation.certificate.certificateNumber}
                </p>
              </div>
              {onDownloadCertificate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDownloadCertificate(donation.id)}
                  className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Baixar certificado</span>
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {onView && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(donation.id)}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Ver Detalhes
            </Button>
          )}

          {userRole === 'ong' && donation.status === 'available' && onAccept && (
            <Button 
              size="sm" 
              onClick={() => onAccept(donation.id)} 
              className="flex-1 bg-green-500 text-white hover:bg-green-600"
            >
              Aceitar Doação
            </Button>
          )}

          {userRole === 'ong' &&
            donation.status === 'accepted' &&
            onCollect && (
              <Button
                size="sm"
                onClick={() => onCollect(donation.id)}
                className="flex-1 bg-green-500 text-white hover:bg-green-600"
              >
                Confirmar Coleta
              </Button>
            )}
        </div>
      </CardContent>
    </Card>
  );
}

