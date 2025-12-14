'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ChecklistFormProps {
  checklistType: string;
  onSubmit: (responses: Record<string, unknown>) => void;
  isLoading?: boolean;
}

export function ChecklistForm({
  checklistType,
  onSubmit,
  isLoading = false,
}: ChecklistFormProps) {
  const [responses, setResponses] = useState<Record<string, unknown>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(responses);
  };

  const handleChange = (key: string, value: unknown) => {
    setResponses((prev) => ({ ...prev, [key]: value }));
  };

  const renderChecklistFields = () => {
    switch (checklistType) {
      case 'marmitas':
        return (
          <>
            <div>
              <Label htmlFor="temperatura">
                Temperatura no momento do preparo (°C)
              </Label>
              <Input
                id="temperatura"
                type="number"
                placeholder="Ex: 70"
                value={(responses.temperatura as string) || ''}
                onChange={(e) =>
                  handleChange('temperatura', e.target.value)
                }
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="tempo_preparo">
                Tempo desde o preparo (horas)
              </Label>
              <Input
                id="tempo_preparo"
                type="number"
                placeholder="Ex: 2"
                value={(responses.tempo_preparo as string) || ''}
                onChange={(e) =>
                  handleChange('tempo_preparo', e.target.value)
                }
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="armazenamento">Armazenamento</Label>
              <Select
                value={(responses.armazenamento as string) || ''}
                onValueChange={(value) =>
                  handleChange('armazenamento', value)
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="refrigerado">Refrigerado</SelectItem>
                  <SelectItem value="temperatura_ambiente">
                    Temperatura ambiente
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="embalagem">Embalagem</Label>
              <Select
                value={(responses.embalagem as string) || ''}
                onValueChange={(value) => handleChange('embalagem', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fechada_limpa">
                    Fechada e limpa
                  </SelectItem>
                  <SelectItem value="aberta">Aberta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      case 'frutas_legumes':
        return (
          <>
            <div>
              <Label htmlFor="condicao_visual">Condição Visual</Label>
              <Select
                value={(responses.condicao_visual as string) || ''}
                onValueChange={(value) =>
                  handleChange('condicao_visual', value)
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boa">Boa</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="ruim">Ruim</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="conservacao">Conservação</Label>
              <Select
                value={(responses.conservacao as string) || ''}
                onValueChange={(value) => handleChange('conservacao', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="refrigerado">Refrigerado</SelectItem>
                  <SelectItem value="temperatura_ambiente">
                    Temperatura ambiente
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      default:
        return (
          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              placeholder="Descreva as condições do alimento..."
              value={(responses.observacoes as string) || ''}
              onChange={(e) => handleChange('observacoes', e.target.value)}
              className="mt-2"
              rows={4}
            />
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Checklist de Conformidade</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderChecklistFields()}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Salvando...' : 'Salvar Checklist'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

