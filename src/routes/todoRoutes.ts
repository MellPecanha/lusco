import { Router } from 'express';
import { InMemoryTodoRepository } from '../repositories/inMemoryTodoRepository';
import { TodoController } from '../controllers/todoController';
import { TodoService } from '../services/todoService';

const router = Router();

const todoRepository = new InMemoryTodoRepository();
const todoService = new TodoService(todoRepository);
const todoController = new TodoController(todoService);

router.post('/todos', todoController.createTodo);

router.get('/todos', todoController.getTodos);
router.get('/todos/:id', todoController.getTodoById);
router.get('/todos/tag/:tag', todoController.getTodosByTag);

router.put('/todos/:id', todoController.updateTodo);
router.delete('/todos/:id', todoController.deleteTodo);

export default router;
