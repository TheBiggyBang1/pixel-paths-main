type AudioMap = Record<string, HTMLAudioElement>;

class AudioManager {
  private audios: AudioMap = {};
  private currentBgm: HTMLAudioElement | null = null;

  load(name: string, url: string, options?: { loop?: boolean; volume?: number }) {
    try {
      const a = new Audio(url);
      a.preload = 'auto';
      a.loop = !!options?.loop;
      a.volume = options?.volume ?? 1;
      this.audios[name] = a;
    } catch (e) {
      // silent fail; file may be missing in dev
      // console.warn(`Audio load failed for ${name}:`, e);
    }
  }

  playBgm(name: string, opts?: { fadeMs?: number; volume?: number }) {
    const next = this.audios[name];
    if (!next) return;

    // fade out current
    if (this.currentBgm && this.currentBgm !== next) {
      this.fadeOut(this.currentBgm, opts?.fadeMs ?? 300);
    }

    next.loop = true;
    next.volume = opts?.volume ?? 0.8;
    // support starting muted for autoplay policies
    if (opts && (opts as any).muted) {
      next.muted = true;
    }
    next.currentTime = 0;
    next.play().catch(() => {});
    this.currentBgm = next;
  }

  stopBgm(fadeMs = 300) {
    if (this.currentBgm) {
      this.fadeOut(this.currentBgm, fadeMs);
      this.currentBgm = null;
    }
  }

  playSfx(name: string) {
    const src = this.audios[name];
    if (!src) return;
    // clone node for overlapping SFX
    const clone = src.cloneNode(true) as HTMLAudioElement;
    clone.loop = false;
    clone.volume = src.volume ?? 1;
    clone.play().catch(() => {});
  }

  private fadeOut(audio: HTMLAudioElement, ms = 300) {
    const step = 50;
    const steps = Math.max(1, Math.floor(ms / step));
    const volStep = (audio.volume || 1) / steps;
    let i = 0;
    const iv = setInterval(() => {
      i += 1;
      audio.volume = Math.max(0, (audio.volume || 0) - volStep);
      if (i >= steps) {
        clearInterval(iv);
        audio.pause();
        audio.currentTime = 0;
      }
    }, step);
  }

  fadeInCurrentBgm(ms = 500, target = 0.8) {
    const audio = this.currentBgm;
    if (!audio) return;
    const step = 50;
    const steps = Math.max(1, Math.floor(ms / step));
    const startVol = audio.volume ?? 0;
    const volStep = (target - startVol) / steps;
    let i = 0;
    // ensure audio is playing
    // unmute first to allow audible fade-in
    audio.muted = false;
    audio.play().catch(() => {});
    const iv = setInterval(() => {
      i += 1;
      audio.volume = Math.min(target, (audio.volume || 0) + volStep);
      if (i >= steps) {
        clearInterval(iv);
        audio.volume = target;
      }
    }, step);
  }
}

export const audioManager = new AudioManager();

// Helpful default loader: expects files under `/sounds/` in the `public` folder
export interface PreloadOptions {
  intro?: string;
  school?: string;
  evil?: string;
  good?: string;
  typing?: string;
  transition?: string;
}

export const preloadDefaultSounds = (opts?: PreloadOptions) => {
  // try provided URLs first, then fall back to public/sounds/ locations
  audioManager.load('intro', opts?.intro ?? '/sounds/intro.mp3', { loop: true, volume: 0.85 });
  audioManager.load('school', opts?.school ?? '/sounds/school.mp3', { loop: true, volume: 0.7 });
  audioManager.load('evil', opts?.evil ?? '/sounds/evil.mp3', { loop: true, volume: 0.8 });
  audioManager.load('good', opts?.good ?? '/sounds/good.wav', { loop: true, volume: 0.8 });
  audioManager.load('typing', opts?.typing ?? '/sounds/typing.wav', { loop: false, volume: 0.6 });
  audioManager.load('transition', opts?.transition ?? '/sounds/transition.wav', { loop: false, volume: 0.8 });
};
