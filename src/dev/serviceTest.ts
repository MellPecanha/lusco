import { InMemoryTodoRepository } from '../repositories/inMemoryTodoRepository';
import { TodoService, TodoValidationError, TodoNotFoundError } from '../services/todoService';

const repository = new InMemoryTodoRepository();
const service = new TodoService(repository);

async function run() {
  const created = await service.createTodo({
    title: '  Learn service layer  ',
    description: 'Practice business logic and validation',
    priority: 'high',
    tags: ['study', ' study ', 'ts']
  });

  console.log('Created todo:', created);

  const allTodos = await service.listTodos();
  console.log('All todos:', allTodos);

  const byTag = await service.listTodosByTag('study');
  console.log('Todos by tag:', byTag);

  const updated = await service.updateTodo(created.id, {
    completed: true,
    title: 'Learn service layer well'
  });

  console.log('Updated todo:', updated);

  await service.deleteTodo(created.id);
  console.log('Deleted todo:', created.id);

  try {
    await service.createTodo({ title: '   ' });
  } catch (error) {
    if (error instanceof TodoValidationError) {
      console.log('Validation error caught:', error.message);
    }
  }

  try {
    await service.getTodoById('missing-id');
  } catch (error) {
    if (error instanceof TodoNotFoundError) {
      console.log('Not found error caught:', error.message);
    }
  }

  console.log('Remaining count:', await repository.count());
}

run().catch(error => {
  console.error('Service test failed:', error);
});
