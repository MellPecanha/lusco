import { TodoItem } from '../core/types.js';
import { createTodo, deleteTodo, updateTodo } from './api.js';

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderTodos(todos: TodoItem[], container: HTMLElement | null): void {
  if (!container) return;

  if (!todos.length) {
    container.innerHTML = '<div class="empty-state">nenhuma tarefa ainda</div>';
    return;
  }

  container.innerHTML = todos.map((todo) => `
    <div class="todo-item">
      <button class="todo-check${todo.done ? ' done' : ''}" type="button" data-action="toggle" data-id="${todo.id}" aria-label="marcar tarefa"></button>
      <span class="todo-text${todo.done ? ' done' : ''}">${escapeHtml(todo.text)}</span>
      <button class="todo-del" type="button" data-action="delete" data-id="${todo.id}" aria-label="remover tarefa">×</button>
    </div>
  `).join('');
}

export async function addTodoFromInput(input: HTMLInputElement | null, onChange: (todos: TodoItem[]) => void, currentTodos: TodoItem[]): Promise<void> {
  if (!input) return;

  const text = input.value.trim();
  if (!text) return;

  const created = await createTodo({ title: text });
  const nextTodos = [...currentTodos, created];

  input.value = '';
  onChange(nextTodos);
}

export async function toggleTodoItem(id: string, currentTodos: TodoItem[], onChange: (todos: TodoItem[]) => void): Promise<void> {
  const item = currentTodos.find((todo) => todo.id === id);
  if (!item) return;

  const updated = await updateTodo(id, { completed: !item.done });
  const nextTodos = currentTodos.map((todo) => (todo.id === id ? updated : todo));
  onChange(nextTodos);
}

export async function deleteTodoItem(id: string, currentTodos: TodoItem[], onChange: (todos: TodoItem[]) => void): Promise<void> {
  await deleteTodo(id);
  onChange(currentTodos.filter((todo) => todo.id !== id));
}
