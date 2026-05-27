import { TodoRepository } from './todoRepository';
import { Todo, CreateTodoDTO, UpdateTodoDTO } from '../models/todo';

import { randomUUID } from 'crypto';

export class InMemoryTodoRepository implements TodoRepository {
  private store = new Map<string, Todo>();

  private clone(todo: Todo): Todo {
    return {
      ...todo,
      createdAt: new Date(todo.createdAt),
      updatedAt: new Date(todo.updatedAt),
      dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
      tags: todo.tags ? [...todo.tags] : undefined
    };
  }

  async create(data: CreateTodoDTO): Promise<Todo> {
    const id = randomUUID();

    const now = new Date();

    const todo: Todo = {
      id,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      priority: data.priority,
      tags: data.tags ? [...data.tags] : undefined,
      completed: false,
      createdAt: now,
      updatedAt: now
    };

    this.store.set(id, todo);
    return this.clone(todo);
  }

  async findAll(): Promise<Todo[]> {
    return Array.from(this.store.values()).map(t => this.clone(t));
  }

  async findById(id: string): Promise<Todo | null> {
    const t = this.store.get(id);
    return t ? this.clone(t) : null;
  }

  async findByTag(tag: string): Promise<Todo[]> {
    return Array.from(this.store.values())
      .filter(todo => todo.tags?.includes(tag))
      .map(t => this.clone(t));
  }

  async update(id: string, data: UpdateTodoDTO): Promise<Todo | null> {
    const outdated = this.store.get(id);

    if (!outdated) return null;

    const mergedTags = data.tags ? [...data.tags] : outdated.tags ? [...outdated.tags] : undefined;
    const mergedDueDate = data.dueDate ? new Date(data.dueDate) : outdated.dueDate ? new Date(outdated.dueDate) : undefined;

    const updated: Todo = {
      ...outdated,
      ...data,
      tags: mergedTags,
      dueDate: mergedDueDate,
      updatedAt: new Date()
    };

    this.store.set(id, updated);
    return this.clone(updated);
  }

  async delete(id: string): Promise<boolean> {
    return this.store.delete(id);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }

  async count(): Promise<number> {
    return this.store.size;
  }
}
