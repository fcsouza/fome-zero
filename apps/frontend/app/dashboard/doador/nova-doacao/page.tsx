'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AnalysisModal } from '@/components/donations/analysis-modal';
import { AIAnalysisResult } from '@/components/donations/ai-analysis-result';
import { ChecklistForm } from '@/components/donations/checklist-form';
import { useDonation } from '@/lib/hooks/use-donation';
import { useFoodAnalysis } from '@/lib/hooks/use-food-analysis';
import { donationsApi, type FoodAnalysisResult } from '@/lib/api/donations';
import { toast } from 'sonner';

export default function NovaDoacaoPage() {
  const router = useRouter();
  const { createDonation, submitChecklist, generateCertificate, isLoading } =
    useDonation();
  const { reset: resetAnalysis } = useFoodAnalysis();

  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [analysisData, setAnalysisData] = useState<{
    imageData: string;
    textInput: string;
    aiResponse: FoodAnalysisResult;
  } | null>(null);

  const [formData, setFormData] = useState({
    tipoAlimento: '',
    descricao: '',
    quantidade: '',
    temperatura: '',
    prazoConsumo: '',
  });

  const [currentStep, setCurrentStep] = useState<
    'form' | 'analysis' | 'checklist' | 'certificate' | 'complete'
  >('form');
  const [donationId, setDonationId] = useState<string | null>(null);
  const [checklistType, setChecklistType] = useState<string>('generic');

  const handleAnalysisComplete = (data: {
    imageData: string;
    textInput: string;
    aiResponse: FoodAnalysisResult;
  }) => {
    setAnalysisData(data);
    setFormData((prev) => ({
      ...prev,
      tipoAlimento: data.aiResponse.tipo_alimento || prev.tipoAlimento,
    }));

    // Determine checklist type based on food type
    const foodType = data.aiResponse.tipo_alimento.toLowerCase();
    if (foodType.includes('marmita') || foodType.includes('prato')) {
      setChecklistType('marmitas');
    } else if (
      foodType.includes('fruta') ||
      foodType.includes('legume') ||
      foodType.includes('verdura')
    ) {
      setChecklistType('frutas_legumes');
    } else {
      setChecklistType('generic');
    }

    setCurrentStep('analysis');
  };

  const handleCreateDonation = async () => {
    if (!analysisData) {
      toast.error('Por favor, realize a análise primeiro');
      return;
    }

    try {
      const donation = await createDonation({
        ...formData,
        imageData: analysisData.imageData,
        textInput: analysisData.textInput,
        aiResponse: analysisData.aiResponse,
      });

      setDonationId(donation.id);
      setCurrentStep('checklist');
      toast.success('Doação criada com sucesso!');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao criar doação'
      );
    }
  };

  const handleChecklistSubmit = async (responses: Record<string, unknown>) => {
    if (!donationId) {
      return;
    }

    try {
      await submitChecklist(donationId, checklistType, responses);
      setCurrentStep('certificate');
      toast.success('Checklist aprovado!');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao salvar checklist'
      );
    }
  };

  const handleGenerateCertificate = async () => {
    if (!donationId) {
      return;
    }

    try {
      await generateCertificate(donationId);
      setCurrentStep('complete');
      toast.success('Certificado gerado com sucesso!');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Erro ao gerar certificado'
      );
    }
  };

  const handleDownloadCertificate = async () => {
    if (!donationId) {
      return;
    }

    try {
      await donationsApi.downloadCertificate(donationId);
      toast.success('Certificado baixado!');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Erro ao baixar certificado'
      );
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-3xl text-gray-900">Nova Doação</h1>
        <p className="text-gray-600">
          Crie uma nova doação com análise de IA e certificação legal
        </p>
      </div>
      <div className="space-y-6">
          {currentStep === 'form' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Informações da Doação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="tipoAlimento">Tipo de Alimento *</Label>
                  <Input
                    id="tipoAlimento"
                    value={formData.tipoAlimento}
                    onChange={(e) =>
                      setFormData({ ...formData, tipoAlimento: e.target.value })
                    }
                    placeholder="Ex: Marmitas, Frutas, Legumes..."
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) =>
                      setFormData({ ...formData, descricao: e.target.value })
                    }
                    placeholder="Descreva os alimentos..."
                    className="mt-2"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantidade">Quantidade</Label>
                    <Input
                      id="quantidade"
                      value={formData.quantidade}
                      onChange={(e) =>
                        setFormData({ ...formData, quantidade: e.target.value })
                      }
                      placeholder="Ex: 30 unidades"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="temperatura">Temperatura</Label>
                    <Input
                      id="temperatura"
                      value={formData.temperatura}
                      onChange={(e) =>
                        setFormData({ ...formData, temperatura: e.target.value })
                      }
                      placeholder="Ex: 65°C"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="prazoConsumo">Prazo para Consumo</Label>
                  <Input
                    id="prazoConsumo"
                    value={formData.prazoConsumo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        prazoConsumo: e.target.value,
                      })
                    }
                    placeholder="Ex: 4 horas"
                    className="mt-2"
                  />
                </div>

                <Button
                  onClick={() => setIsAnalysisModalOpen(true)}
                  className="w-full bg-green-500 text-white hover:bg-green-600"
                >
                  Analisar Alimento com IA
                </Button>
              </CardContent>
            </Card>
          )}

          {currentStep === 'analysis' && analysisData && (
            <div className="space-y-4">
              <AIAnalysisResult result={analysisData.aiResponse} />

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentStep('form');
                    resetAnalysis();
                  }}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Voltar
                </Button>
                <Button 
                  onClick={handleCreateDonation} 
                  disabled={isLoading}
                  className="bg-green-500 text-white hover:bg-green-600"
                >
                  {isLoading ? 'Criando...' : 'Criar Doação'}
                </Button>
              </div>
            </div>
          )}

          {currentStep === 'checklist' && donationId && (
            <div className="space-y-4">
              <ChecklistForm
                checklistType={checklistType}
                onSubmit={handleChecklistSubmit}
                isLoading={isLoading}
              />
            </div>
          )}

          {currentStep === 'certificate' && donationId && (
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Gerar Certificado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Gere o certificado de conformidade para sua doação. Este
                  certificado protege você juridicamente conforme a Lei
                  14.016/2020.
                </p>
                <Button
                  onClick={handleGenerateCertificate}
                  disabled={isLoading}
                  className="w-full bg-green-500 text-white hover:bg-green-600"
                >
                  {isLoading ? 'Gerando...' : 'Gerar Certificado'}
                </Button>
              </CardContent>
            </Card>
          )}

          {currentStep === 'complete' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Doação Criada com Sucesso!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Sua doação foi criada e está disponível para ONGs. O
                  certificado foi gerado e está disponível para download.
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={handleDownloadCertificate}
                    className="flex-1 bg-green-500 text-white hover:bg-green-600"
                  >
                    Baixar Certificado
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/dashboard/doador/doacoes')}
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Ver Minhas Doações
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

      <AnalysisModal
        open={isAnalysisModalOpen}
        onOpenChange={setIsAnalysisModalOpen}
        onAnalysisComplete={handleAnalysisComplete}
      />
      </div>
    </div>
  );
}

