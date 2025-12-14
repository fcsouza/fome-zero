import { eq, and, desc } from 'drizzle-orm';
import { db } from '../db';
import type {
  Donation,
  NewDonation,
  DonationAnalysis,
  NewDonationAnalysis,
} from '../db/schema';
import { donations, donationAnalyses } from '../db/schema';

/**
 * DonationRepository - Data access layer for donations
 */
export class DonationRepository {
  /**
   * Find all donations with optional filters
   */
  async findAll(filters?: {
    doadorId?: string;
    status?: string;
    ongId?: string;
  }): Promise<Donation[]> {
    const conditions = [];

    if (filters?.doadorId) {
      conditions.push(eq(donations.doadorId, filters.doadorId));
    }

    if (filters?.status) {
      conditions.push(eq(donations.status, filters.status));
    }

    let query = db.select().from(donations);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(donations.createdAt));
  }

  /**
   * Find a donation by ID
   */
  async findById(id: string): Promise<Donation | undefined> {
    const result = await db
      .select()
      .from(donations)
      .where(eq(donations.id, id));
    return result[0];
  }

  /**
   * Create a new donation
   */
  async create(data: NewDonation): Promise<Donation> {
    const [donation] = await db.insert(donations).values(data).returning();
    return donation;
  }

  /**
   * Update a donation by ID
   */
  async update(
    id: string,
    data: Partial<NewDonation>
  ): Promise<Donation | undefined> {
    const [donation] = await db
      .update(donations)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(donations.id, id))
      .returning();
    return donation;
  }

  /**
   * Delete a donation by ID
   */
  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(donations)
      .where(eq(donations.id, id))
      .returning();
    return result.length > 0;
  }

  /**
   * Create donation analysis
   */
  async createAnalysis(
    data: NewDonationAnalysis
  ): Promise<DonationAnalysis> {
    const [analysis] = await db
      .insert(donationAnalyses)
      .values(data)
      .returning();
    return analysis;
  }

  /**
   * Find analysis by donation ID
   */
  async findAnalysisByDonationId(
    donationId: string
  ): Promise<DonationAnalysis | undefined> {
    const result = await db
      .select()
      .from(donationAnalyses)
      .where(eq(donationAnalyses.donationId, donationId));
    return result[0];
  }
}

