import type { NewTodo, Todo } from '../db/schema';
import type { TodoRepository } from '../repositories/todo.repository';

/**
 * TodoService - Business logic layer for todos
 * Handles business rules and validation for todo operations
 */
export class TodoService {
  private readonly todoRepo: TodoRepository;

  constructor(todoRepo: TodoRepository) {
    this.todoRepo = todoRepo;
  }

  /**
   * Get all todos
   */
  async getAllTodos(): Promise<Todo[]> {
    return await this.todoRepo.findAll();
  }

  /**
   * Get a single todo by ID
   * @throws Error if todo not found
   */
  async getTodoById(id: number): Promise<Todo> {
    const todo = await this.todoRepo.findById(id);
    if (!todo) {
      throw new Error('Todo not found');
    }
    return todo;
  }

  /**
   * Create a new todo
   */
  async createTodo(data: NewTodo): Promise<Todo> {
    return await this.todoRepo.create({ ...data, completed: false });
  }

  /**
   * Update an existing todo
   * @throws Error if todo not found
   */
  async updateTodo(id: number, data: Partial<NewTodo>): Promise<Todo> {
    const todo = await this.todoRepo.update(id, data);
    if (!todo) {
      throw new Error('Todo not found');
    }
    return todo;
  }

  /**
   * Delete a todo
   * @throws Error if todo not found
   */
  async deleteTodo(id: number): Promise<void> {
    const deleted = await this.todoRepo.delete(id);
    if (!deleted) {
      throw new Error('Todo not found');
    }
  }
}
