import { eq } from 'drizzle-orm';
import { db } from '../db';
import type { Certificate, NewCertificate } from '../db/schema';
import { certificates } from '../db/schema';

/**
 * CertificateRepository - Data access layer for certificates
 */
export class CertificateRepository {
  /**
   * Find certificate by ID
   */
  async findById(id: string): Promise<Certificate | undefined> {
    const result = await db
      .select()
      .from(certificates)
      .where(eq(certificates.id, id));
    return result[0];
  }

  /**
   * Find certificate by donation ID
   */
  async findByDonationId(
    donationId: string
  ): Promise<Certificate | undefined> {
    const result = await db
      .select()
      .from(certificates)
      .where(eq(certificates.donationId, donationId));
    return result[0];
  }

  /**
   * Find certificate by certificate number
   */
  async findByCertificateNumber(
    certificateNumber: string
  ): Promise<Certificate | undefined> {
    const result = await db
      .select()
      .from(certificates)
      .where(eq(certificates.certificateNumber, certificateNumber));
    return result[0];
  }

  /**
   * Create a new certificate
   */
  async create(data: NewCertificate): Promise<Certificate> {
    const [certificate] = await db
      .insert(certificates)
      .values(data)
      .returning();
    return certificate;
  }

  /**
   * Update a certificate by ID
   */
  async update(
    id: string,
    data: Partial<NewCertificate>
  ): Promise<Certificate | undefined> {
    const [certificate] = await db
      .update(certificates)
      .set(data)
      .where(eq(certificates.id, id))
      .returning();
    return certificate;
  }
}

