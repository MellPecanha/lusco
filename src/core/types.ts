export type Mode = 'focus' | 'short' | 'long';

export type TodoItem = {
  id: string;
  text: string;
  done: boolean;
};

export type TodoApiItem = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TimerState = {
  mode: Mode;
  timeLeft: number;
  session: number;
};

export type MusicState = {
  muted: boolean;
  volume: number;
};

export const MODES: Record<Mode, number> = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60
};

export const STORAGE_KEYS = {
  todos: 'lusco.todos',
  timer: 'lusco.timer',
  music: 'lusco.music'
} as const;

export const DEFAULT_TIMER_STATE: TimerState = {
  mode: 'focus',
  timeLeft: MODES.focus,
  session: 1
};

export const DEFAULT_MUSIC_STATE: MusicState = {
  muted: false,
  volume: 70
};
