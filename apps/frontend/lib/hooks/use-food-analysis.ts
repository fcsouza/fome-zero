'use client';

import { useState } from 'react';
import { donationsApi, type FoodAnalysisResult } from '../api/donations';

export function useFoodAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FoodAnalysisResult | null>(null);

  const analyze = async (image: string, text?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const analysisResult = await donationsApi.analyzeFood(image, text);
      setResult(analysisResult);
      return analysisResult;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to analyze food';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return {
    analyze,
    result,
    isLoading,
    error,
    reset,
  };
}

