import { InMemoryTodoRepository } from '../repositories/inMemoryTodoRepository';

const repo = new InMemoryTodoRepository();

async function run() {
  const t1 = await repo.create({
    title: 'Test ToDo',
    description: 'This is a test to-do item',
    dueDate: new Date('2024-12-31'),
    priority: 'high',
    tags: ['test', 'todo']
  });
  console.log('Created ToDo 1:', t1);

  const t2 = await repo.create({
    title: 'Another ToDo',
    description: 'This is another test to-do item',
    dueDate: new Date('2024-11-30'),
    priority: 'medium',
    tags: ['test']
  });
  console.log('Created ToDo 2:', t2);

  const all = await repo.findAll();
  console.log('All ToDos:', all);

  const byTag = await repo.findByTag('test');
  console.log('ToDos with tag "test":', byTag);

  const found = await repo.findById(t1.id);
  console.log('Found by id:', found);

  const updated = await repo.update(t1.id, { completed: true });
  console.log('Updated:', updated);

  const deleted = await repo.delete(t2.id);
  console.log('Deleted second todo:', deleted);

  console.log('Count after operations:', await repo.count());

  await repo.clear();
  console.log('Repository cleared');

  console.log('Count after clear:', await repo.count());
}

run().catch(console.error);
