import { TodoItem } from '../core/types.js';
import { loadLuscoState } from './storage.js';
import { renderScene } from './scene.js';
import { addTodoFromInput, deleteTodoItem, renderTodos, toggleTodoItem } from './todos.js';
import { fetchTodos } from './api.js';
import { initMusic } from './music.js';
import { initTimer } from './timer.js';

const state = loadLuscoState();

let todos: TodoItem[] = [];

const stars = document.getElementById('stars');
const buildings = document.getElementById('buildings');
const trees = document.getElementById('trees');
const timerDisplay = document.getElementById('timer-display') as HTMLDivElement | null;
const progressFill = document.getElementById('progress-fill') as HTMLDivElement | null;
const sessionLabel = document.getElementById('session-label') as HTMLDivElement | null;
const statusDots = document.getElementById('status-dots') as HTMLDivElement | null;
const todoList = document.getElementById('todo-list') as HTMLDivElement | null;
const todoInput = document.getElementById('todo-input') as HTMLInputElement | null;
const addBtn = document.getElementById('add-btn') as HTMLButtonElement | null;
const startBtn = document.getElementById('start-btn') as HTMLButtonElement | null;
const resetBtn = document.getElementById('reset-btn') as HTMLButtonElement | null;
const skipBtn = document.getElementById('skip-btn') as HTMLButtonElement | null;
const fullscreenBtn = document.getElementById('fullscreen-btn') as HTMLButtonElement | null;
const muteBtn = document.getElementById('mute-btn') as HTMLButtonElement | null;
const musicLabel = document.getElementById('music-label') as HTMLSpanElement | null;
const volumeSlider = document.getElementById('vol') as HTMLInputElement | null;
const audio = document.getElementById('lofi-audio') as HTMLAudioElement | null;

function setTodos(nextTodos: TodoItem[]): void {
  todos = nextTodos;
  renderTodos(todos, todoList);
}

function addTodo(): void {
  void addTodoFromInput(todoInput, setTodos, todos);
}

function toggleTodo(id: string): void {
  void toggleTodoItem(id, todos, setTodos);
}

function deleteTodo(id: string): void {
  void deleteTodoItem(id, todos, setTodos);
}

function updateFullscreenButton(): void {
  if (!fullscreenBtn) return;
  fullscreenBtn.textContent = document.fullscreenElement ? '⤢' : '⛶';
  fullscreenBtn.title = document.fullscreenElement ? 'exit fullscreen' : 'fullscreen';
}

async function toggleFullscreen(): Promise<void> {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen();
  } else {
    await document.exitFullscreen();
  }

  updateFullscreenButton();
}

function wireEvents(): void {
  addBtn?.addEventListener('click', addTodo);
  fullscreenBtn?.addEventListener('click', () => {
    void toggleFullscreen().catch(() => undefined);
  });
  todoInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') addTodo();
  });

  todoList?.addEventListener('click', (event) => {
    const target = (event.target as HTMLElement | null)?.closest('[data-action]') as HTMLElement | null;
    if (!target) return;

    const id = target.dataset.id;
    if (!id) return;
    if (target.dataset.action === 'toggle') toggleTodo(id);
    if (target.dataset.action === 'delete') deleteTodo(id);
  });

  document.addEventListener('fullscreenchange', updateFullscreenButton);
}

async function bootstrap(): Promise<void> {
  renderScene(stars, buildings, trees);
  setTodos(await fetchTodos());
  wireEvents();
  updateFullscreenButton();

  initTimer(state.timer, {
    timerDisplay,
    progressFill,
    sessionLabel,
    statusDots,
    startBtn,
    resetBtn,
    skipBtn,
    modeButtons: document.querySelectorAll<HTMLButtonElement>('.mode-tab')
  });

  initMusic(state.music, {
    audio,
    volumeSlider,
    muteBtn,
    musicLabel
  });
}

void bootstrap();
