import { CreateTodoDTO, Priority, Todo, UpdateTodoDTO } from '../models/todo';
import { TodoRepository } from '../repositories/todoRepository';

export type ListOptions = {
  tag?: string;
  completed?: boolean;
  page?: number;
  limit?: number;
};

export type PagedResult<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

export class TodoValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TodoValidationError';
  }
}

export class TodoNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TodoNotFoundError';
  }
}

export class TodoService {
  constructor(private readonly repository: TodoRepository) {}

  async createTodo(data: CreateTodoDTO): Promise<Todo> {
    this.assertValidTitle(data.title);
    this.assertValidPriority(data.priority);
    this.assertValidTags(data.tags);
    this.assertValidDueDate(data.dueDate);

    return this.repository.create({
      ...data,
      title: data.title.trim(),
      tags: data.tags ? this.normalizeTags(data.tags) : undefined
    });
  }

  async listTodos(options?: ListOptions): Promise<PagedResult<Todo>> {
    const page = Math.max(1, options?.page ?? 1);
    const limit = Math.max(1, options?.limit ?? 10);

    const all = await this.repository.findAll();

    if (page <= 0 || limit <= 0) {
      throw new TodoValidationError('Page and limit must be positive integers');
    }

    function matchesFilters(todo: Todo): boolean {
      if (options?.tag && !todo.tags?.includes(options.tag)) {
        return false;
      }

      if (options?.completed !== undefined && todo.completed !== options.completed) {
        return false;
      }

      return true;
    }

    const total = all.filter(matchesFilters).length;
    const start = (page - 1) * limit;
    const items = all.filter(matchesFilters).slice(start, start + limit);

    return {
      items,
      total,
      page,
      limit
    };
  }

  async getTodoById(id: string): Promise<Todo> {
    this.assertValidId(id);

    const todo = await this.repository.findById(id);

    if (!todo) {
      throw new TodoNotFoundError(`Todo not found: ${id}`);
    }

    return todo;
  }

  async listTodosByTag(tag: string): Promise<Todo[]> {
    this.assertValidTagValue(tag);
    return this.repository.findByTag(tag.trim());
  }

  async updateTodo(id: string, data: UpdateTodoDTO): Promise<Todo> {
    this.assertValidId(id);

    if (data.title !== undefined) {
      this.assertValidTitle(data.title);
    }

    this.assertValidPriority(data.priority);
    this.assertValidTags(data.tags);
    this.assertValidDueDate(data.dueDate);

    const updated = await this.repository.update(id, {
      ...data,
      title: data.title?.trim(),
      tags: data.tags ? this.normalizeTags(data.tags) : data.tags
    });

    if (!updated) {
      throw new TodoNotFoundError(`Todo not found: ${id}`);
    }

    return updated;
  }

  async deleteTodo(id: string): Promise<void> {
    this.assertValidId(id);

    const deleted = await this.repository.delete(id);

    if (!deleted) {
      throw new TodoNotFoundError(`Todo not found: ${id}`);
    }
  }

  private assertValidId(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new TodoValidationError('Todo id is required');
    }
  }

  private assertValidTitle(title: string | undefined): void {
    if (typeof title !== 'string' || title.trim().length === 0) {
      throw new TodoValidationError('Todo title is required');
    }
  }

  private assertValidTagValue(tag: string): void {
    if (typeof tag !== 'string' || tag.trim().length === 0) {
      throw new TodoValidationError('Tag is required');
    }
  }

  private assertValidTags(tags: string[] | undefined): void {
    if (!tags) {
      return;
    }

    const normalized = this.normalizeTags(tags);

    if (normalized.length === 0) {
      throw new TodoValidationError('Tags cannot be empty');
    }
  }

  private assertValidPriority(priority: Priority | undefined): void {
    if (priority === undefined) {
      return;
    }

    const validPriorities: Priority[] = ['low', 'medium', 'high'];

    if (!validPriorities.includes(priority)) {
      throw new TodoValidationError('Invalid todo priority');
    }
  }

  private assertValidDueDate(dueDate: Date | undefined): void {
    if (!dueDate) {
      return;
    }

    if (Number.isNaN(dueDate.getTime())) {
      throw new TodoValidationError('Due date is invalid');
    }
  }

  private normalizeTags(tags: string[]): string[] {
    return Array.from(new Set(tags.map(tag => tag.trim()).filter(tag => tag.length > 0)));
  }
}
