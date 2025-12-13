import type { NewUser, User } from '../db/schema';
import type { UserRepository } from '../repositories/user.repository';

/**
 * UserService - Business logic layer for users
 * Handles business rules and validation for user operations
 */
export class UserService {
  private readonly userRepo: UserRepository;

  constructor(userRepo: UserRepository) {
    this.userRepo = userRepo;
  }

  /**
   * Get a user by ID
   * @throws Error if user not found
   */
  async getUserById(id: string): Promise<User> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Get a user by email
   * @throws Error if user not found
   */
  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Update user profile
   * @throws Error if user not found
   */
  async updateUser(id: string, data: Partial<NewUser>): Promise<User> {
    const user = await this.userRepo.update(id, data);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Get user profile (sanitized for external use)
   */
  async getUserProfile(id: string): Promise<User> {
    const user = await this.getUserById(id);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      stripeCustomerId: user.stripeCustomerId,
    };
  }
}
