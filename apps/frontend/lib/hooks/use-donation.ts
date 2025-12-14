'use client';

import { useState, useCallback } from 'react';
import { donationsApi, type Donation, type CreateDonationData } from '../api/donations';

export function useDonation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDonation = useCallback(async (data: CreateDonationData) => {
    setIsLoading(true);
    setError(null);

    try {
      const donation = await donationsApi.createDonation(data);
      return donation;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create donation';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getDonations = useCallback(async (filters?: { status?: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      const donations = await donationsApi.getDonations(filters);
      return donations;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to get donations';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getDonation = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const donation = await donationsApi.getDonation(id);
      return donation;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to get donation';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitChecklist = useCallback(
    async (donationId: string, checklistType: string, responses: Record<string, unknown>) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await donationsApi.submitChecklist(donationId, {
          checklistType,
          responses,
        });
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to submit checklist';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const generateCertificate = useCallback(async (donationId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await donationsApi.generateCertificate(donationId);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to generate certificate';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const acceptDonation = useCallback(async (donationId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await donationsApi.acceptDonation(donationId);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to accept donation';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const collectDonation = useCallback(async (donationId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await donationsApi.collectDonation(donationId);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to collect donation';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createDonation,
    getDonations,
    getDonation,
    submitChecklist,
    generateCertificate,
    acceptDonation,
    collectDonation,
    isLoading,
    error,
  };
}

