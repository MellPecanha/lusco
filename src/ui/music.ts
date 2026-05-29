import { MusicState } from '../core/types.js';
import { saveMusic } from './storage.js';

type MusicElements = {
  audio: HTMLAudioElement | null;
  volumeSlider: HTMLInputElement | null;
  muteBtn: HTMLButtonElement | null;
  musicLabel: HTMLSpanElement | null;
};

export function initMusic(initialState: MusicState, elements: MusicElements): void {
  let state: MusicState = { ...initialState };

  function applyMusicState(): void {
    if (!elements.audio || !elements.volumeSlider || !elements.musicLabel || !elements.muteBtn) return;

    elements.audio.volume = state.muted ? 0 : state.volume / 100;
    elements.volumeSlider.value = String(state.volume);
    elements.musicLabel.style.opacity = state.muted ? '0.3' : '1';
    elements.muteBtn.style.opacity = state.muted ? '0.3' : '1';
  }

  async function startMusic(): Promise<void> {
    try {
      if (elements.audio && elements.audio.src.includes('assets/lofi.mp3')) {
        await elements.audio.play();
      }
    } catch {
      // If autoplay is blocked, keep the controls ready without failing the app.
    }
  }

  elements.volumeSlider?.addEventListener('input', (event) => {
    const input = event.currentTarget as HTMLInputElement;
    state = {
      ...state,
      volume: Number(input.value),
      muted: Number(input.value) === 0 ? true : state.muted
    };
    applyMusicState();
    saveMusic(state);
  });

  elements.muteBtn?.addEventListener('click', () => {
    state = { ...state, muted: !state.muted };
    applyMusicState();
    saveMusic(state);
  });

  applyMusicState();
  void startMusic();
}
