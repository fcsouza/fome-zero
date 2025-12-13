import { Elysia } from 'elysia';
import { TodoRepository } from '../repositories/todo.repository';
import { UserRepository } from '../repositories/user.repository';
import { TodoService } from '../services/todo.service';
import { UserService } from '../services/user.service';

const todoRepo = new TodoRepository();
const userRepo = new UserRepository();

const todoService = new TodoService(todoRepo);
const userService = new UserService(userRepo);

/**
 * Services plugin - provides todoService and userService as decorators
 * Use this plugin to make services available in route handlers with type safety
 */
export const servicesPlugin = new Elysia({ name: 'services' })
  .decorate('todoService', todoService)
  .decorate('userService', userService);
