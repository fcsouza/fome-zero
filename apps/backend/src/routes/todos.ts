import { Elysia, t } from 'elysia';
import { servicesPlugin } from '../plugins/services.plugin';

const NOT_FOUND_STATUS_CODE = 404;

const todoModel = t.Object({
  id: t.Integer(),
  title: t.String(),
  description: t.Union([t.String(), t.Null()]),
  completed: t.Boolean(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
});

const createTodoModel = t.Object({
  title: t.String({ minLength: 1 }),
  description: t.Optional(t.String()),
});

const updateTodoModel = t.Object({
  title: t.Optional(t.String({ minLength: 1 })),
  description: t.Optional(t.String()),
  completed: t.Optional(t.Boolean()),
});

const errorModel = t.Object({
  message: t.String(),
});

export const todosRoute = new Elysia({ prefix: '/todos' })
  .use(servicesPlugin)
  .get('/', async ({ todoService }) => todoService.getAllTodos(), {
    response: t.Array(todoModel),
    detail: {
      summary: 'Get all todos',
      description: 'Retrieve a list of all todos from the database',
      tags: ['todos'],
    },
  })
  .get(
    '/:id',
    async ({ params: { id }, todoService, set }) => {
      try {
        return await todoService.getTodoById(Number.parseInt(id, 10));
      } catch (error) {
        set.status = NOT_FOUND_STATUS_CODE;
        return {
          message: error instanceof Error ? error.message : 'Todo not found',
        };
      }
    },
    {
      params: t.Object({
        id: t.String({ pattern: '^[0-9]+$' }),
      }),
      response: {
        200: todoModel,
        404: errorModel,
      },
      detail: {
        summary: 'Get a todo by ID',
        description:
          'Retrieve a specific todo item using its unique identifier',
        tags: ['todos'],
      },
    }
  )
  .post('/', async ({ body, todoService }) => todoService.createTodo(body), {
    body: createTodoModel,
    response: todoModel,
    detail: {
      summary: 'Create a new todo',
      description:
        'Create a new todo item with a title and optional description',
      tags: ['todos'],
    },
  })
  .patch(
    '/:id',
    async ({ params: { id }, body, todoService, set }) => {
      try {
        return await todoService.updateTodo(Number.parseInt(id, 10), body);
      } catch (error) {
        set.status = NOT_FOUND_STATUS_CODE;
        return {
          message: error instanceof Error ? error.message : 'Todo not found',
        };
      }
    },
    {
      params: t.Object({
        id: t.String({ pattern: '^[0-9]+$' }),
      }),
      body: updateTodoModel,
      response: {
        200: todoModel,
        404: errorModel,
      },
      detail: {
        summary: 'Update a todo',
        description:
          'Update an existing todo item by ID. You can update title, description, or completion status',
        tags: ['todos'],
      },
    }
  )
  .delete(
    '/:id',
    async ({ params: { id }, todoService, set }) => {
      try {
        await todoService.deleteTodo(Number.parseInt(id, 10));
        return { message: 'Todo deleted successfully' };
      } catch (error) {
        set.status = NOT_FOUND_STATUS_CODE;
        return {
          message: error instanceof Error ? error.message : 'Todo not found',
        };
      }
    },
    {
      params: t.Object({
        id: t.String({ pattern: '^[0-9]+$' }),
      }),
      response: {
        200: t.Object({ message: t.String() }),
        404: errorModel,
      },
      detail: {
        summary: 'Delete a todo',
        description: 'Permanently delete a todo item by its ID',
        tags: ['todos'],
      },
    }
  );
