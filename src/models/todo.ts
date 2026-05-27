export type Priority = 'low' | 'medium' | 'high';

export type Todo = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  priority?: Priority;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type CreateTodoDTO = {
  title: string;
  description?: string;
  dueDate?: Date;
  priority?: Priority;
  tags?: string[];
}

export type UpdateTodoDTO = Partial<CreateTodoDTO> & {
  completed?: boolean;
}
