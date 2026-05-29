import { TodoApiItem, TodoItem } from '../core/types.js';

export type TodosResponse = {
  items: TodoApiItem[];
  total: number;
  page: number;
  limit: number;
};

export type TodoCreateInput = {
  title: string;
  description?: string;
};

export type TodoUpdateInput = Partial<TodoCreateInput> & {
  completed?: boolean;
};

const API_BASE = '/todos';

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function mapTodo(item: TodoApiItem): TodoItem {
  return {
    id: item.id,
    text: item.title,
    done: item.completed
  };
}

function mapTodos(items: TodoApiItem[]): TodoItem[] {
  return items.map(mapTodo);
}

export async function fetchTodos(): Promise<TodoItem[]> {
  const response = await fetch(API_BASE);
  const data = await readJson<TodosResponse>(response);
  return mapTodos(data.items);
}

export async function createTodo(input: TodoCreateInput): Promise<TodoItem> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });

  return mapTodo(await readJson<TodoApiItem>(response));
}

export async function updateTodo(id: string, input: TodoUpdateInput): Promise<TodoItem> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });

  return mapTodo(await readJson<TodoApiItem>(response));
}

export async function deleteTodo(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }
}
