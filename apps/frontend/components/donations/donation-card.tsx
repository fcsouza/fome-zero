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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{donation.tipoAlimento}</CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {donation.descricao && (
          <p className="text-sm text-muted-foreground">
            {donation.descricao}
          </p>
        )}

        {donation.quantidade && (
          <div>
            <span className="text-sm font-medium">Quantidade: </span>
            <span className="text-sm text-muted-foreground">
              {donation.quantidade}
            </span>
          </div>
        )}

        {donation.certificate && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Certificado: {donation.certificate.certificateNumber}
            </span>
            {onDownloadCertificate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDownloadCertificate(donation.id)}
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        <div className="flex gap-2">
          {onView && (
            <Button variant="outline" size="sm" onClick={() => onView(donation.id)}>
              Ver Detalhes
            </Button>
          )}

          {userRole === 'ong' && donation.status === 'available' && onAccept && (
            <Button size="sm" onClick={() => onAccept(donation.id)}>
              Aceitar Doação
            </Button>
          )}

          {userRole === 'ong' &&
            donation.status === 'accepted' &&
            onCollect && (
              <Button size="sm" onClick={() => onCollect(donation.id)}>
                Confirmar Coleta
              </Button>
            )}
        </div>
      </CardContent>
    </Card>
  );
}

