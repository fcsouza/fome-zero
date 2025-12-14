import { randomBytes } from 'crypto';
import type {
  ChecklistResponse,
  NewChecklistResponse,
} from '../db/schema';
import type { ChecklistRepository } from '../repositories/checklist.repository';
import { createChildLogger } from '../utils/logger';

const logger = createChildLogger({ module: 'checklist-service' });

/**
 * ChecklistService - Business logic layer for checklists
 */
export class ChecklistService {
  private readonly checklistRepo: ChecklistRepository;

  constructor(checklistRepo: ChecklistRepository) {
    this.checklistRepo = checklistRepo;
  }

  /**
   * Generate unique ID for checklist
   */
  private generateId(): string {
    return randomBytes(16).toString('hex');
  }

  /**
   * Get checklist by ID
   * @throws Error if checklist not found
   */
  async getChecklistById(id: string): Promise<ChecklistResponse> {
    const checklist = await this.checklistRepo.findById(id);
    if (!checklist) {
      throw new Error('Checklist not found');
    }
    return checklist;
  }

  /**
   * Get checklist by donation ID
   */
  async getChecklistByDonationId(
    donationId: string
  ): Promise<ChecklistResponse | undefined> {
    return await this.checklistRepo.findByDonationId(donationId);
  }

  /**
   * Create or update checklist response
   */
  async saveChecklist(
    donationId: string,
    checklistType: string,
    responses: Record<string, unknown>,
    approved: boolean
  ): Promise<ChecklistResponse> {
    // Check if checklist already exists
    const existing = await this.checklistRepo.findByDonationId(donationId);

    if (existing) {
      // Update existing
      const updated = await this.checklistRepo.update(existing.id, {
        checklistType,
        responses: responses as Record<string, unknown>,
        approved,
      });
      if (!updated) {
        throw new Error('Failed to update checklist');
      }
      return updated;
    }

    // Create new
    const checklist = await this.checklistRepo.create({
      id: this.generateId(),
      donationId,
      checklistType,
      responses: responses as Record<string, unknown>,
      approved,
    });

    logger.info(
      { donationId, checklistId: checklist.id, approved },
      'Checklist saved'
    );

    return checklist;
  }

  /**
   * Validate checklist responses based on type
   */
  validateChecklist(
    checklistType: string,
    responses: Record<string, unknown>
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Basic validation - can be extended based on checklist type
    if (!responses || Object.keys(responses).length === 0) {
      errors.push('Checklist responses cannot be empty');
    }

    // Type-specific validation can be added here
    switch (checklistType) {
      case 'marmitas':
        if (!responses.temperatura) {
          errors.push('Temperatura is required for marmitas');
        }
        if (!responses.tempo_preparo) {
          errors.push('Tempo desde preparo is required for marmitas');
        }
        break;
      case 'frutas_legumes':
        if (!responses.condicao_visual) {
          errors.push('Condição visual is required for frutas e legumes');
        }
        break;
      default:
        // Generic validation
        break;
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

