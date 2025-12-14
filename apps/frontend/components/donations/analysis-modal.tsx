'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from './image-upload';
import { Loading } from '@/components/ui/loading';
import type { FoodAnalysisResult } from '@/lib/api/donations';

interface AnalysisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAnalysisComplete: (result: {
    imageData: string;
    textInput: string;
    aiResponse: FoodAnalysisResult;
  }) => void;
}

export function AnalysisModal({
  open,
  onOpenChange,
  onAnalysisComplete,
}: AnalysisModalProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // Remove data URL prefix
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAnalyze = async () => {
    if (!imageFile) {
      setError('Por favor, selecione uma imagem');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const imageBase64 = await convertFileToBase64(imageFile);

      const response = await fetch('/api/donations/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          image: imageBase64,
          text: textInput || 'Analise este alimento para doação.',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao analisar imagem');
      }

      const aiResponse = (await response.json()) as FoodAnalysisResult;

      onAnalysisComplete({
        imageData: imagePreview || '',
        textInput,
        aiResponse,
      });

      onOpenChange(false);
      // Reset form
      setImageFile(null);
      setImagePreview(null);
      setTextInput('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao analisar imagem'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Análise de Alimento por IA</DialogTitle>
          <DialogDescription>
            Tire uma foto do alimento e adicione informações adicionais para
            análise
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="image">Foto do Alimento</Label>
            <ImageUpload
              onImageSelect={handleImageSelect}
              imagePreview={imagePreview}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="text">Informações Adicionais (opcional)</Label>
            <Textarea
              id="text"
              placeholder="Ex: Marmitas preparadas há 1 hora, mantidas em temperatura adequada..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isAnalyzing}
          >
            Cancelar
          </Button>
          <Button onClick={handleAnalyze} disabled={isAnalyzing || !imageFile}>
            {isAnalyzing ? (
              <>
                <Loading className="mr-2" />
                Analisando...
              </>
            ) : (
              'Analisar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

