import { defineStore, acceptHMRUpdate } from 'pinia';
import { Howl } from 'howler';

const SOUND_NAMES = ['MagicOnRuneCraft', 'ShopOnBuyMultiplier', 'ShopOnBuyValue'] as const;
const SOUND_COOLDOWN_MS = 75; // защита от «дребезга» при быстрых кликах
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export const useStoreSetting = defineStore('storeSetting', {
  state: () => ({
    audio: {
      enabled: true,
      volume: 0.5,
      initialized: false,
    },
    iconStyle: 'fa-duotone ',
    preloadedSounds: {} as Record<string, Howl>,
    lastPlayAt: {} as Record<string, number>,
  }),
  getters: {
    save(state) {
      return {
        audio: {
          enabled: state.audio.enabled,
          volume: state.audio.volume,
        },
        iconStyle: state.iconStyle,
      };
    },
  },
  actions: {
    initAudio() {
      if (this.audio.initialized) return;
      this.preloadAll();
      this.audio.initialized = true;
    },

    preload(name: string) {
      if (this.preloadedSounds[name]) return this.preloadedSounds[name];
      const sound = new Howl({
        src: [`sounds/${name}.mp3`],
        volume: clamp(this.audio.volume, 0, 1),
      });
      this.preloadedSounds[name] = sound;
      return sound;
    },

    preloadAll() {
      SOUND_NAMES.forEach((n) => this.preload(n));
    },

    canPlay(name: string) {
      const now = Date.now();
      const last = this.lastPlayAt[name] ?? 0;
      if (now - last < SOUND_COOLDOWN_MS) return false;
      this.lastPlayAt[name] = now;
      return true;
    },

    playSound(name: string, divider: number = 1) {
      if (!this.audio.enabled) return;
      this.initAudio();
      if (!this.canPlay(name)) return;

      const safeDivider = divider > 0 ? divider : 1;
      const volume = clamp(this.audio.volume / safeDivider, 0, 1);

      const sound = this.preloadedSounds[name] ?? this.preload(name);
      try {
        const current = sound.volume();
        if (Math.abs(current - volume) > 0.01) sound.volume(volume);
      } catch {
        sound.volume(volume);
      }

      sound.play();
    },

    stopAll() {
      Object.values(this.preloadedSounds).forEach((s) => s.stop());
    },

    toggleAudio(enabled?: boolean) {
      const next = enabled ?? !this.audio.enabled;
      this.audio.enabled = next;
      if (!next) this.stopAll();
    },

    setVolume(volume: number) {
      this.audio.volume = clamp(volume, 0, 1);
      const base = this.audio.volume;
      Object.values(this.preloadedSounds).forEach((s) => s.volume(base));
    },

    setIconStyle(style: string) {
      this.iconStyle = style;
    },

    load(loaded?: { audio?: { enabled?: boolean; volume?: number }; iconStyle?: string }) {
      if (!loaded) return;
      const en = loaded.audio?.enabled;
      const vol = loaded.audio?.volume;
      if (typeof en === 'boolean') this.audio.enabled = en;
      if (typeof vol === 'number' && Number.isFinite(vol)) this.audio.volume = clamp(vol, 0, 1);
      if (typeof loaded.iconStyle === 'string') this.iconStyle = loaded.iconStyle;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreSetting, import.meta.hot));
}
