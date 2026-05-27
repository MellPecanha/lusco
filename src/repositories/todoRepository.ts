import { CreateTodoDTO, Todo, UpdateTodoDTO } from '../models/todo';

export interface TodoRepository {
  create(data: CreateTodoDTO): Promise<Todo>;
  findById(id: string): Promise<Todo | null>;
  findAll(): Promise<Todo[]>;
  findByTag(tag: string): Promise<Todo[]>;
  update(id: string, data: UpdateTodoDTO): Promise<Todo | null>;
  delete(id: string): Promise<boolean>;
}
