'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserProfile } from '@/components/user-profile';
import { api } from '@/lib/api';
import {
  toastDismiss,
  toastError,
  toastLoading,
  toastSuccess,
} from '@/lib/toast';

type Todo = {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export default function Dashboard() {
  const [apiStatus, setApiStatus] = useState<string>('Loading...');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [newTodoDescription, setNewTodoDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchApiStatus = useCallback(async () => {
    const response = await api.api.get();
    if (response.data) {
      setApiStatus(JSON.stringify(response.data, null, 2));
    } else {
      setApiStatus('Error loading API status');
    }
  }, []);

  const fetchTodos = useCallback(async () => {
    const response = await api.api.todos.get();
    if (response.data) {
      setTodos(response.data as Todo[]);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await fetchApiStatus();
      await fetchTodos();
    };
    loadData();
  }, [fetchApiStatus, fetchTodos]);

  const handleCreateTodo = async () => {
    if (!newTodoTitle.trim()) {
      toastError('Please enter a todo title');
      return;
    }

    setIsLoading(true);
    const loadingToastId = toastLoading('Creating todo...');

    try {
      const response = await api.api.todos.post({
        title: newTodoTitle,
        description: newTodoDescription || undefined,
      });

      toastDismiss(loadingToastId);

      if (response.data) {
        toastSuccess('Todo created successfully!');
        setNewTodoTitle('');
        setNewTodoDescription('');
        await fetchTodos();
      } else if (response.error) {
        toastError('Failed to create todo');
      }
    } catch {
      toastDismiss(loadingToastId);
      toastError('An error occurred while creating todo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTodo = async (id: number, completed: boolean) => {
    const loadingToastId = toastLoading('Updating todo...');

    try {
      const response = await api.api.todos({ id: id.toString() }).patch({
        completed: !completed,
      });

      toastDismiss(loadingToastId);

      if (response.data) {
        toastSuccess(
          completed ? 'Todo marked as incomplete' : 'Todo marked as complete'
        );
        await fetchTodos();
      } else if (response.error) {
        toastError('Failed to update todo');
      }
    } catch {
      toastDismiss(loadingToastId);
      toastError('An error occurred while updating todo');
    }
  };

  const handleDeleteTodo = async (id: number) => {
    const loadingToastId = toastLoading('Deleting todo...');

    try {
      const response = await api.api.todos({ id: id.toString() }).delete();

      toastDismiss(loadingToastId);

      if (response.data) {
        toastSuccess('Todo deleted successfully');
        await fetchTodos();
      } else if (response.error) {
        toastError('Failed to delete todo');
      }
    } catch {
      toastDismiss(loadingToastId);
      toastError('An error occurred while deleting todo');
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <main className="mx-auto max-w-4xl">
        {/* Header with User Profile */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-bold text-4xl">fomezero</h1>
          <UserProfile />
        </div>

        <div className="space-y-6">
          {/* API Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>API Status</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="overflow-auto rounded bg-muted p-4 text-green-600 text-sm dark:text-green-400">
                {apiStatus}
              </pre>
            </CardContent>
          </Card>

          {/* Create Todo Card */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Todo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    onChange={(e) => setNewTodoTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateTodo()}
                    placeholder="Enter todo title..."
                    value={newTodoTitle}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    onChange={(e) => setNewTodoDescription(e.target.value)}
                    placeholder="Enter description..."
                    rows={3}
                    value={newTodoDescription}
                  />
                </div>
                <Button
                  disabled={isLoading || !newTodoTitle.trim()}
                  onClick={handleCreateTodo}
                >
                  {isLoading ? 'Creating...' : 'Create Todo'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Todos List Card */}
          <Card>
            <CardHeader>
              <CardTitle>Todos ({todos.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todos.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">
                    No todos yet. Create one to get started!
                  </p>
                ) : (
                  todos.map((todo) => (
                    <Card key={todo.id}>
                      <CardContent className="flex items-start gap-4 pt-6">
                        <input
                          checked={todo.completed}
                          className="mt-1 h-5 w-5 cursor-pointer rounded"
                          onChange={() =>
                            handleToggleTodo(todo.id, todo.completed)
                          }
                          type="checkbox"
                        />
                        <div className="flex-1">
                          <h3
                            className={`font-medium text-lg ${
                              todo.completed
                                ? 'text-muted-foreground line-through'
                                : ''
                            }`}
                          >
                            {todo.title}
                          </h3>
                          {todo.description && (
                            <p
                              className={`mt-1 text-sm ${
                                todo.completed
                                  ? 'text-muted-foreground line-through'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {todo.description}
                            </p>
                          )}
                          <p className="mt-2 text-muted-foreground text-xs">
                            Created: {new Date(todo.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          onClick={() => handleDeleteTodo(todo.id)}
                          size="sm"
                          variant="destructive"
                        >
                          Delete
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Tech Stack</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  );
}

