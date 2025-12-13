import { eq } from 'drizzle-orm';
import { db } from '../db';
import { type NewTodo, type Todo, todos } from '../db/schema';
/**
 * TodoRepository - Data access layer for todos
 * Handles all database operations for the todos table
 */
export class TodoRepository {
  /**
   * Find all todos
   */
  async findAll(): Promise<Todo[]> {
    return await db.select().from(todos);
  }

  /**
   * Find a todo by ID
   */
  async findById(id: number): Promise<Todo | undefined> {
    const result = await db.select().from(todos).where(eq(todos.id, id));
    return result[0];
  }

  /**
   * Create a new todo
   */
  async create(data: NewTodo): Promise<Todo> {
    const [todo] = await db.insert(todos).values(data).returning();
    return todo;
  }

  /**
   * Update a todo by ID
   */
  async update(id: number, data: Partial<NewTodo>): Promise<Todo | undefined> {
    const [todo] = await db
      .update(todos)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(todos.id, id))
      .returning();
    return todo;
  }

  /**
   * Delete a todo by ID
   */
  async delete(id: number): Promise<boolean> {
    const result = await db.delete(todos).where(eq(todos.id, id)).returning();
    return result.length > 0;
  }
}
