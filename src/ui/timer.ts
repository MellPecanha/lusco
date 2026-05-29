import { MODES, Mode, TimerState } from '../core/types.js';
import { saveTimer } from './storage.js';

type TimerElements = {
  timerDisplay: HTMLDivElement | null;
  progressFill: HTMLDivElement | null;
  sessionLabel: HTMLDivElement | null;
  statusDots: HTMLDivElement | null;
  startBtn: HTMLButtonElement | null;
  resetBtn: HTMLButtonElement | null;
  skipBtn: HTMLButtonElement | null;
  modeButtons: NodeListOf<HTMLButtonElement>;
};

export function initTimer(initialState: TimerState, elements: TimerElements): void {
  const startBtn = elements.startBtn;
  let mode: Mode = initialState.mode;
  let timeLeft = initialState.timeLeft;
  let running = false;
  let intervalId: number | undefined;
  let session = initialState.session;

  function fmt(seconds: number): string {
    return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  }

  function updateModeTabs(): void {
    elements.modeButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.mode === mode);
    });
  }

  function updateDots(): void {
    if (!elements.statusDots) return;
    const dots = elements.statusDots.children;

    for (let i = 0; i < dots.length; i += 1) {
      const dot = dots[i] as HTMLDivElement;
      dot.className = 'dot';
      if (i < session - 1) dot.classList.add('done');
      if (i === session - 1) dot.classList.add('active');
    }
  }

  function updateDisplay(): void {
    if (!elements.timerDisplay || !elements.progressFill || !elements.sessionLabel) return;

    elements.timerDisplay.textContent = fmt(timeLeft);
    const total = MODES[mode];
    elements.progressFill.style.width = `${(timeLeft / total) * 100}%`;
    const labels: Record<Mode, string> = { focus: 'foco', short: 'pausa curta', long: 'pausa longa' };
    elements.sessionLabel.textContent = `${labels[mode]} · sessão ${session} de 4`;
    updateModeTabs();
    updateDots();
    saveTimer({ mode, timeLeft, session });
  }

  function setMode(nextMode: Mode): void {
    if (running) toggleTimer();
    mode = nextMode;
    timeLeft = MODES[mode];
    updateDisplay();
  }

  function toggleTimer(): void {
    if (!startBtn) return;

    running = !running;
    startBtn.textContent = running ? 'PAUSAR' : 'INICIAR';
    startBtn.classList.toggle('running', running);

    if (running) {
      intervalId = window.setInterval(() => {
        timeLeft -= 1;
        if (timeLeft <= 0) {
          if (intervalId !== undefined) {
            clearInterval(intervalId);
          }
          running = false;
          startBtn.textContent = 'INICIAR';
          startBtn.classList.remove('running');

          if (mode === 'focus') {
            session = session < 4 ? session + 1 : 1;
            setMode(session === 1 ? 'long' : 'short');
          } else {
            setMode('focus');
          }
        }
        updateDisplay();
      }, 1000);
    } else if (intervalId !== undefined) {
      clearInterval(intervalId);
    }
  }

  function resetTimer(): void {
    if (running) toggleTimer();
    timeLeft = MODES[mode];
    updateDisplay();
  }

  function skipSession(): void {
    if (running) toggleTimer();
    if (mode === 'focus') {
      session = session < 4 ? session + 1 : 1;
      setMode('short');
    } else {
      setMode('focus');
    }
  }

  elements.startBtn?.addEventListener('click', toggleTimer);
  elements.resetBtn?.addEventListener('click', resetTimer);
  elements.skipBtn?.addEventListener('click', skipSession);

  elements.modeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const nextMode = button.dataset.mode as Mode | undefined;
      if (nextMode) setMode(nextMode);
    });
  });

  updateDisplay();
}
