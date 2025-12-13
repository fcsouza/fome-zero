import { beforeAll, describe, expect, it } from 'bun:test';
import { Elysia } from 'elysia';
import type { Todo } from '../db/schema';
import { servicesPlugin } from '../plugins/services.plugin';
import { todosRoute } from './todos';

const OK_STATUS_CODE = 200;
const NOT_FOUND_STATUS_CODE = 404;
describe('Todos API', () => {
  let app: ReturnType<typeof createApp>;
  let createdTodoId: number;

  const createApp = () => new Elysia().use(servicesPlugin).use(todosRoute);

  beforeAll(() => {
    app = createApp();
  });

  it('should create a new todo', async () => {
    const response = await app.handle(
      new Request('http://localhost/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Test Todo',
          description: 'This is a test todo',
        }),
      })
    );

    expect(response.status).toBe(OK_STATUS_CODE);
    const data = (await response.json()) as Todo;
    expect(data).toHaveProperty('id');
    expect(data.title).toBe('Test Todo');
    expect(data.completed).toBe(false);
    createdTodoId = data.id;
  });

  it('should get all todos', async () => {
    const response = await app.handle(
      new Request('http://localhost/todos', {
        method: 'GET',
      })
    );

    expect(response.status).toBe(OK_STATUS_CODE);
    const data = (await response.json()) as Todo[];
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  it('should get a todo by id', async () => {
    const response = await app.handle(
      new Request(`http://localhost/todos/${createdTodoId}`, {
        method: 'GET',
      })
    );

    expect(response.status).toBe(OK_STATUS_CODE);
    const data = (await response.json()) as Todo;
    expect(data.id).toBe(createdTodoId);
  });

  it('should update a todo', async () => {
    const response = await app.handle(
      new Request(`http://localhost/todos/${createdTodoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed: true,
        }),
      })
    );

    expect(response.status).toBe(OK_STATUS_CODE);
    const data = (await response.json()) as Todo;
    expect(data.completed).toBe(true);
  });

  it('should delete a todo', async () => {
    const response = await app.handle(
      new Request(`http://localhost/todos/${createdTodoId}`, {
        method: 'DELETE',
      })
    );

    expect(response.status).toBe(OK_STATUS_CODE);
  });

  it('should return 404 for non-existent todo', async () => {
    const response = await app.handle(
      new Request('http://localhost/todos/99999', {
        method: 'GET',
      })
    );

    expect(response.status).toBe(NOT_FOUND_STATUS_CODE);
  });
});
