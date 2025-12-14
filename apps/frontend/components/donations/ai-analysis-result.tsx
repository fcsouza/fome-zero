'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface FoodAnalysisResult {
  proprio_para_doacao: boolean;
  tipo_alimento: string;
  criterios: {
    dentro_validade: string;
    conservacao_adequada: boolean;
    integridade_preservada: boolean;
    embalagem_integra: string;
    seguranca_sanitaria: boolean;
    propriedades_nutricionais_mantidas: boolean;
  };
  observacoes: string;
  recomendacao: string;
  justificativa: string;
}

interface AIAnalysisResultProps {
  result: FoodAnalysisResult;
}

export function AIAnalysisResult({ result }: AIAnalysisResultProps) {
  const getStatusIcon = () => {
    if (result.proprio_para_doacao) {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusBadge = () => {
    if (result.proprio_para_doacao) {
      return (
        <Badge className="bg-green-500">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Próprio para doação
        </Badge>
      );
    }
    return (
      <Badge variant="destructive">
        <XCircle className="mr-1 h-3 w-3" />
        Não recomendado
      </Badge>
    );
  };

  const getCriterioStatus = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      ) : (
        <XCircle className="h-4 w-4 text-red-500" />
      );
    }
    if (value === 'sim' || value === 'true') {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
    if (value === 'não' || value === 'false') {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            {getStatusIcon()}
            Análise de IA
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
            Tipo de Alimento
          </p>
          <p className="text-base font-medium text-gray-900">{result.tipo_alimento}</p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-gray-900">Critérios de Avaliação</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-3">
              <span className="text-sm font-medium text-gray-900">Conservação adequada</span>
              {getCriterioStatus(result.criterios.conservacao_adequada)}
            </div>
            <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-3">
              <span className="text-sm font-medium text-gray-900">Integridade preservada</span>
              {getCriterioStatus(result.criterios.integridade_preservada)}
            </div>
            <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-3">
              <span className="text-sm font-medium text-gray-900">Segurança sanitária</span>
              {getCriterioStatus(result.criterios.seguranca_sanitaria)}
            </div>
            <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-3">
              <span className="text-sm font-medium text-gray-900">
                Propriedades nutricionais mantidas
              </span>
              {getCriterioStatus(
                result.criterios.propriedades_nutricionais_mantidas
              )}
            </div>
            <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-3">
              <span className="text-sm font-medium text-gray-900">Dentro da validade</span>
              <span className="text-sm text-gray-600">
                {result.criterios.dentro_validade}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-3">
              <span className="text-sm font-medium text-gray-900">Embalagem</span>
              <span className="text-sm text-gray-600">
                {result.criterios.embalagem_integra}
              </span>
            </div>
          </div>
        </div>

        {result.observacoes && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="mb-2 text-sm font-semibold text-gray-900">Observações</p>
            <p className="text-sm leading-relaxed text-gray-600">
              {result.observacoes}
            </p>
          </div>
        )}

        {result.recomendacao && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="mb-2 text-sm font-semibold text-gray-900">Recomendação</p>
            <p className="text-sm leading-relaxed text-gray-600">
              {result.recomendacao}
            </p>
          </div>
        )}

        {result.justificativa && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="mb-2 text-sm font-semibold text-gray-900">Justificativa</p>
            <p className="text-sm leading-relaxed text-gray-600">
              {result.justificativa}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

