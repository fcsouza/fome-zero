import { eq } from 'drizzle-orm';
import { db } from '../db';
import type {
  ChecklistResponse,
  NewChecklistResponse,
} from '../db/schema';
import { checklistResponses } from '../db/schema';

/**
 * ChecklistRepository - Data access layer for checklist responses
 */
export class ChecklistRepository {
  /**
   * Find checklist by ID
   */
  async findById(id: string): Promise<ChecklistResponse | undefined> {
    const result = await db
      .select()
      .from(checklistResponses)
      .where(eq(checklistResponses.id, id));
    return result[0];
  }

  /**
   * Find checklist by donation ID
   */
  async findByDonationId(
    donationId: string
  ): Promise<ChecklistResponse | undefined> {
    const result = await db
      .select()
      .from(checklistResponses)
      .where(eq(checklistResponses.donationId, donationId));
    return result[0];
  }

  /**
   * Create a new checklist response
   */
  async create(data: NewChecklistResponse): Promise<ChecklistResponse> {
    const [checklist] = await db
      .insert(checklistResponses)
      .values(data)
      .returning();
    return checklist;
  }

  /**
   * Update a checklist response by ID
   */
  async update(
    id: string,
    data: Partial<NewChecklistResponse>
  ): Promise<ChecklistResponse | undefined> {
    const [checklist] = await db
      .update(checklistResponses)
      .set(data)
      .where(eq(checklistResponses.id, id))
      .returning();
    return checklist;
  }
}

