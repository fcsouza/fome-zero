import { randomBytes } from 'crypto';
import type {
  Donation,
  NewDonation,
  DonationAnalysis,
} from '../db/schema';
import type { DonationRepository } from '../repositories/donation.repository';
import type { CertificateRepository } from '../repositories/certificate.repository';
import { certificateService } from './certificate.service';
import { createChildLogger } from '../utils/logger';

const logger = createChildLogger({ module: 'donation-service' });

/**
 * DonationService - Business logic layer for donations
 */
export class DonationService {
  private readonly donationRepo: DonationRepository;
  private readonly certificateRepo: CertificateRepository;

  constructor(
    donationRepo: DonationRepository,
    certificateRepo: CertificateRepository
  ) {
    this.donationRepo = donationRepo;
    this.certificateRepo = certificateRepo;
  }

  /**
   * Generate unique ID for donation
   */
  private generateId(): string {
    return randomBytes(16).toString('hex');
  }

  /**
   * Get all donations with filters
   */
  async getAllDonations(filters?: {
    doadorId?: string;
    status?: string;
    ongId?: string;
  }): Promise<Donation[]> {
    return await this.donationRepo.findAll(filters);
  }

  /**
   * Get donation by ID
   * @throws Error if donation not found
   */
  async getDonationById(id: string): Promise<Donation> {
    const donation = await this.donationRepo.findById(id);
    if (!donation) {
      throw new Error('Donation not found');
    }
    return donation;
  }

  /**
   * Create a new donation
   */
  async createDonation(data: Omit<NewDonation, 'id'>): Promise<Donation> {
    const donation = await this.donationRepo.create({
      ...data,
      id: this.generateId(),
    });
    return donation;
  }

  /**
   * Update a donation
   * @throws Error if donation not found
   */
  async updateDonation(
    id: string,
    data: Partial<NewDonation>
  ): Promise<Donation> {
    const donation = await this.donationRepo.update(id, data);
    if (!donation) {
      throw new Error('Donation not found');
    }
    return donation;
  }

  /**
   * Save analysis for a donation
   */
  async saveAnalysis(
    donationId: string,
    imageData: string,
    textInput: string,
    aiResponse: unknown
  ): Promise<DonationAnalysis> {
    const analysis = await this.donationRepo.createAnalysis({
      id: this.generateId(),
      donationId,
      imageData,
      textInput,
      aiResponse: aiResponse as Record<string, unknown>,
    });
    return analysis;
  }

  /**
   * Get analysis for a donation
   */
  async getAnalysisByDonationId(
    donationId: string
  ): Promise<DonationAnalysis | undefined> {
    return await this.donationRepo.findAnalysisByDonationId(donationId);
  }

  /**
   * Generate certificate for a donation
   */
  async generateCertificate(
    donationId: string,
    doadorName: string,
    doadorCnpj?: string
  ): Promise<{
    certificateId: string;
    certificateNumber: string;
    pdfPath: string;
    qrCode: string;
    hashSha256: string;
  }> {
    const donation = await this.getDonationById(donationId);
    const analysis = await this.getAnalysisByDonationId(donationId);

    const certificateId = this.generateId();

    const result = await certificateService.generateCertificate(
      certificateId,
      {
        donation,
        analysis,
        doadorName,
        doadorCnpj,
      }
    );

    // Save certificate metadata to database
    await this.certificateRepo.create({
      id: certificateId,
      donationId,
      certificateNumber: result.certificateNumber,
      pdfUrl: result.pdfPath,
      qrCode: result.qrCode,
      hashSha256: result.hashSha256,
    });

    logger.info(
      { donationId, certificateId, certificateNumber: result.certificateNumber },
      'Certificate generated and saved'
    );

    return {
      certificateId,
      ...result,
    };
  }

  /**
   * Get certificate for a donation
   */
  async getCertificateByDonationId(donationId: string) {
    return await this.certificateRepo.findByDonationId(donationId);
  }
}

