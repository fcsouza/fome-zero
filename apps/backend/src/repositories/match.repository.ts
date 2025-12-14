import { eq, and, or, desc, type SQL } from 'drizzle-orm';
import { db } from '../db';
import type { DonationMatch, NewDonationMatch } from '../db/schema';
import { donationMatches } from '../db/schema';

/**
 * MatchRepository - Data access layer for donation matches
 */
export class MatchRepository {
  /**
   * Find all matches with optional filters
   */
  async findAll(filters?: {
    donationId?: string;
    ongId?: string;
    status?: string;
  }): Promise<DonationMatch[]> {
    const conditions: SQL[] = [];

    if (filters?.donationId) {
      conditions.push(eq(donationMatches.donationId, filters.donationId));
    }

    if (filters?.ongId) {
      conditions.push(eq(donationMatches.ongId, filters.ongId));
    }

    if (filters?.status) {
      conditions.push(eq(donationMatches.status, filters.status));
    }

    if (conditions.length > 0) {
      return await db
        .select()
        .from(donationMatches)
        .where(and(...conditions))
        .orderBy(desc(donationMatches.createdAt));
    }

    return await db
      .select()
      .from(donationMatches)
      .orderBy(desc(donationMatches.createdAt));
  }

  /**
   * Find match by ID
   */
  async findById(id: string): Promise<DonationMatch | undefined> {
    const result = await db
      .select()
      .from(donationMatches)
      .where(eq(donationMatches.id, id));
    return result[0];
  }

  /**
   * Find active match for donation (accepted or pending)
   */
  async findActiveMatchByDonationId(
    donationId: string
  ): Promise<DonationMatch | undefined> {
    const result = await db
      .select()
      .from(donationMatches)
      .where(
        and(
          eq(donationMatches.donationId, donationId),
          or(
            eq(donationMatches.status, 'pending'),
            eq(donationMatches.status, 'accepted')
          )
        )
      );
    return result[0];
  }

  /**
   * Create a new match
   */
  async create(data: NewDonationMatch): Promise<DonationMatch> {
    const [match] = await db
      .insert(donationMatches)
      .values(data)
      .returning();
    return match;
  }

  /**
   * Update a match by ID
   */
  async update(
    id: string,
    data: Partial<NewDonationMatch>
  ): Promise<DonationMatch | undefined> {
    const [match] = await db
      .update(donationMatches)
      .set(data)
      .where(eq(donationMatches.id, id))
      .returning();
    return match;
  }
}

