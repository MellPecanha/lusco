import { Request, Response } from 'express';
import { CreateTodoDTO } from '../models/todo';
import { TodoNotFoundError, TodoService, TodoValidationError } from '../services/todoService';

type CreateTodoBody = {
  title?: unknown;
  description?: unknown;
  dueDate?: unknown;
  priority?: unknown;
  tags?: unknown;
};

export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  createTodo = async (req: Request, res: Response): Promise<void> => {
    try {
      const body = req.body as CreateTodoBody;

      const dueDate = typeof body.dueDate === 'string' && body.dueDate.trim().length > 0
        ? new Date(body.dueDate)
        : undefined;

      const createTodoDto: CreateTodoDTO = {
        title: typeof body.title === 'string' ? body.title : '',
        description: typeof body.description === 'string' ? body.description : undefined,
        dueDate,
        priority: this.isPriority(body.priority) ? body.priority : undefined,
        tags: Array.isArray(body.tags) && body.tags.every(tag => typeof tag === 'string')
          ? body.tags
          : undefined
      };

      const createdTodo = await this.todoService.createTodo(createTodoDto);

      res.status(201).json(createdTodo);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  getTodos = async (req: Request, res: Response): Promise<void> => {
    try {
      const rawTag = req.query.tag;
      const tag = Array.isArray(rawTag) ? rawTag[0] : (typeof rawTag === 'string' && rawTag.trim().length > 0 ? rawTag.trim() : undefined);

      const rawCompleted = req.query.completed;
      let completed: boolean | undefined;
      if (rawCompleted !== undefined) {
        const v = Array.isArray(rawCompleted) ? rawCompleted[0] : String(rawCompleted);
        if (v === 'true' || v === '1') completed = true;
        else if (v === 'false' || v === '0') completed = false;
        else {
          res.status(400).json({ message: 'Invalid completed query value' });
          return;
        }
      }

      const rawPage = req.query.page;
      const rawLimit = req.query.limit;

      const pageNum = rawPage !== undefined ? Number(Array.isArray(rawPage) ? rawPage[0] : rawPage) : 1;
      const limitNum = rawLimit !== undefined ? Number(Array.isArray(rawLimit) ? rawLimit[0] : rawLimit) : 10;

      if (Number.isNaN(pageNum) || Number.isNaN(limitNum)) {
        res.status(400).json({ message: 'Invalid page or limit' });
        return;
      }

      const page = Math.max(1, Math.floor(pageNum));
      const limit = Math.min(100, Math.max(1, Math.floor(limitNum)));

      const result = await this.todoService.listTodos({ tag: tag as string | undefined, completed, page, limit });
      res.json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  getTodoById = async (req: Request, res: Response): Promise<void> => {
    try {
      const rawId = req.params.id;
      const id = Array.isArray(rawId) ? rawId[0] : rawId;
      const todo = await this.todoService.getTodoById(id);
      res.json(todo);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  getTodosByTag = async (req: Request, res: Response): Promise<void> => {
    try {
      const rawTag = req.params.tag;
      const tag = Array.isArray(rawTag) ? rawTag[0] : rawTag;
      const todos = await this.todoService.listTodosByTag(tag);
      res.json(todos);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  updateTodo = async (req: Request, res: Response): Promise<void> => {
    try {
      const rawId = req.params.id;
      const id = Array.isArray(rawId) ? rawId[0] : rawId;

      const body = req.body as Partial<CreateTodoBody> & { completed?: unknown };

      const dueDate = typeof body.dueDate === 'string' && body.dueDate.trim().length > 0
        ? new Date(body.dueDate)
        : undefined;

      const completed = typeof body.completed === 'boolean'
        ? body.completed
        : (typeof body.completed === 'string' ? body.completed === 'true' : undefined);

      const updateData = {
        title: typeof body.title === 'string' ? body.title : undefined,
        description: typeof body.description === 'string' ? body.description : undefined,
        dueDate,
        priority: this.isPriority(body.priority) ? body.priority : undefined,
        tags: Array.isArray(body.tags) && body.tags.every(tag => typeof tag === 'string')
          ? body.tags
          : undefined,
        completed
      };

      const updatedTodo = await this.todoService.updateTodo(id, updateData);
      res.json(updatedTodo);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  deleteTodo = async (req: Request, res: Response): Promise<void> => {
    try {
      const rawId = req.params.id;
      const id = Array.isArray(rawId) ? rawId[0] : rawId;
      await this.todoService.deleteTodo(id);
      res.status(204).send();
    } catch (error) {
      this.handleError(error, res);
    }
  };

  private handleError(error: unknown, res: Response): void {
    if (error instanceof TodoValidationError) {
      res.status(400).json({ message: error.message });
      return;
    }

    if (error instanceof TodoNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  };

  private isPriority(value: unknown): value is CreateTodoDTO['priority'] {
    return value === 'low' || value === 'medium' || value === 'high';
  };
}
