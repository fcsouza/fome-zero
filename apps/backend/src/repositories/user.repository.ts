import { eq } from 'drizzle-orm';
import { db } from '../db';
import { type NewUser, type User, user } from '../db/schema';

/**
 * UserRepository - Data access layer for users
 * Handles all database operations for the users table
 */
export class UserRepository {
  /**
   * Find a user by ID
   */
  async findById(id: string): Promise<User | undefined> {
    const result = await db.select().from(user).where(eq(user.id, id));
    return result[0];
  }

  /**
   * Find a user by email
   */
  async findByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(user).where(eq(user.email, email));
    return result[0];
  }

  /**
   * Create a new user
   */
  async create(data: NewUser): Promise<User> {
    const [newUser] = await db.insert(user).values(data).returning();
    return newUser;
  }

  /**
   * Update a user by ID
   */
  async update(id: string, data: Partial<NewUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(user)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(user.id, id))
      .returning();
    return updatedUser;
  }
}
