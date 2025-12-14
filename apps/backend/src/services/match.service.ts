import { randomBytes } from 'crypto';
import type { DonationMatch, NewDonationMatch } from '../db/schema';
import type { MatchRepository } from '../repositories/match.repository';
import type { DonationRepository } from '../repositories/donation.repository';
import { createChildLogger } from '../utils/logger';

const logger = createChildLogger({ module: 'match-service' });

/**
 * MatchService - Business logic layer for donation matches
 */
export class MatchService {
  private readonly matchRepo: MatchRepository;
  private readonly donationRepo: DonationRepository;

  constructor(
    matchRepo: MatchRepository,
    donationRepo: DonationRepository
  ) {
    this.matchRepo = matchRepo;
    this.donationRepo = donationRepo;
  }

  /**
   * Generate unique ID for match
   */
  private generateId(): string {
    return randomBytes(16).toString('hex');
  }

  /**
   * Get all matches with filters
   */
  async getAllMatches(filters?: {
    donationId?: string;
    ongId?: string;
    status?: string;
  }): Promise<DonationMatch[]> {
    return await this.matchRepo.findAll(filters);
  }

  /**
   * Get match by ID
   * @throws Error if match not found
   */
  async getMatchById(id: string): Promise<DonationMatch> {
    const match = await this.matchRepo.findById(id);
    if (!match) {
      throw new Error('Match not found');
    }
    return match;
  }

  /**
   * ONG accepts a donation
   */
  async acceptDonation(
    donationId: string,
    ongId: string
  ): Promise<DonationMatch> {
    // Check if donation exists and is available
    const donation = await this.donationRepo.findById(donationId);
    if (!donation) {
      throw new Error('Donation not found');
    }

    if (donation.status !== 'available') {
      throw new Error(
        `Donation is not available. Current status: ${donation.status}`
      );
    }

    // Check if there's already an active match
    const existingMatch =
      await this.matchRepo.findActiveMatchByDonationId(donationId);
    if (existingMatch) {
      throw new Error('Donation already has an active match');
    }

    // Create match
    const match = await this.matchRepo.create({
      id: this.generateId(),
      donationId,
      ongId,
      status: 'accepted',
      acceptedAt: new Date(),
    });

    // Update donation status
    await this.donationRepo.update(donationId, { status: 'accepted' });

    logger.info(
      { donationId, ongId, matchId: match.id },
      'Donation accepted by ONG'
    );

    return match;
  }

  /**
   * ONG confirms collection
   */
  async confirmCollection(matchId: string): Promise<DonationMatch> {
    const match = await this.getMatchById(matchId);

    if (match.status !== 'accepted') {
      throw new Error(
        `Match is not in accepted status. Current status: ${match.status}`
      );
    }

    // Update match
    const updated = await this.matchRepo.update(matchId, {
      status: 'collected',
      collectedAt: new Date(),
    });

    if (!updated) {
      throw new Error('Failed to update match');
    }

    // Update donation status
    await this.donationRepo.update(match.donationId, {
      status: 'collected',
    });

    logger.info({ matchId, donationId: match.donationId }, 'Collection confirmed');

    return updated;
  }

  /**
   * Cancel a match
   */
  async cancelMatch(matchId: string): Promise<DonationMatch> {
    const match = await this.getMatchById(matchId);

    if (match.status === 'collected') {
      throw new Error('Cannot cancel a collected match');
    }

    // Update match
    const updated = await this.matchRepo.update(matchId, {
      status: 'cancelled',
    });

    if (!updated) {
      throw new Error('Failed to update match');
    }

    // Update donation status back to available
    await this.donationRepo.update(match.donationId, {
      status: 'available',
    });

    logger.info({ matchId, donationId: match.donationId }, 'Match cancelled');

    return updated;
  }
}

