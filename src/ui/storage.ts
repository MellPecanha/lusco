import { DEFAULT_MUSIC_STATE, DEFAULT_TIMER_STATE, MusicState, STORAGE_KEYS, TimerState } from '../core/types.js';

export type LuscoState = {
  timer: TimerState;
  music: MusicState;
};

export function loadLuscoState(): LuscoState {
  try {
    const savedTimer = JSON.parse(localStorage.getItem(STORAGE_KEYS.timer) || 'null') as Partial<TimerState> | null;
    const timer: TimerState = {
      mode: savedTimer?.mode || DEFAULT_TIMER_STATE.mode,
      timeLeft: Number.isFinite(savedTimer?.timeLeft) ? Number(savedTimer?.timeLeft) : DEFAULT_TIMER_STATE.timeLeft,
      session: Number.isFinite(savedTimer?.session) ? Number(savedTimer?.session) : DEFAULT_TIMER_STATE.session
    };

    const savedMusic = JSON.parse(localStorage.getItem(STORAGE_KEYS.music) || 'null') as Partial<MusicState> | null;
    const music: MusicState = {
      muted: Boolean(savedMusic?.muted),
      volume: Number.isFinite(savedMusic?.volume) ? Number(savedMusic?.volume) : DEFAULT_MUSIC_STATE.volume
    };

    return { timer, music };
  } catch {
    return {
      timer: { ...DEFAULT_TIMER_STATE },
      music: { ...DEFAULT_MUSIC_STATE }
    };
  }
}

export function saveTimer(timer: TimerState): void {
  localStorage.setItem(STORAGE_KEYS.timer, JSON.stringify(timer));
}

export function saveMusic(music: MusicState): void {
  localStorage.setItem(STORAGE_KEYS.music, JSON.stringify(music));
}
