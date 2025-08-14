import { defineStore, acceptHMRUpdate } from 'pinia';
import { computed } from 'vue';
import { useSound } from '@vueuse/sound';
import type { Howl } from 'howler';

export const useStoreSetting = defineStore('storeSetting', {
  state: () => ({
    audio: {
      enabled: true,
      volume: 0.5,
      initialized: false,
    },
    iconStyle: 'fa-duotone ',
    preloadedSounds: {} as Record<
      string,
      {
        play: (opts?: unknown) => void;
        stop: (id?: string) => void;
        pause: (id?: string) => void;
        isPlaying: boolean;
        sound: Howl | null;
      }
    >,
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
    initializeAudio() {
      if (this.audio.initialized) return;
      const sounds = ['ShopOnBuyValue', 'ShopOnBuyMultiplier', 'MagicOnRuneCraft'];
      sounds.forEach((file) => {
        const url = `sounds/${file}.mp3`;
        const instance = useSound(url, {
          volume: computed(() => this.audio.volume).value,
          soundEnabled: computed(() => this.audio.enabled).value,
          preload: true,
        });
        this.preloadedSounds[file] = instance as unknown as (typeof this.preloadedSounds)[string];
      });
      this.audio.initialized = true;
    },

    playSound(name: string, divider: number = 1) {
      if (!this.audio.enabled) return;
      if (!this.audio.initialized) {
        this.initializeAudio();
      }
      try {
        if (!this.preloadedSounds[name]) {
          const url = `sounds/${name}.mp3`;
          this.preloadedSounds[name] = useSound(url, {
            volume: computed(() => this.audio.volume).value,
            soundEnabled: computed(() => this.audio.enabled).value,
            preload: true,
          }) as unknown as (typeof this.preloadedSounds)[string];
        }

        const entry = this.preloadedSounds[name];
        const effectiveVolume = this.audio.volume / Math.max(1, divider);

        if (entry?.sound) {
          const id = entry.sound.play();
          if (id != null) entry.sound.volume(effectiveVolume, id);
        } else {
          entry?.play();
        }
      } catch (error) {
        console.warn(`Не удалось воспроизвести звук ${name}:`, error);
      }
    },

    load(loaded: { audio: { enabled: boolean; volume: number }; iconStyle: string }) {
      this.audio.enabled = loaded.audio.enabled;
      this.audio.volume = loaded.audio.volume;
      this.iconStyle = loaded.iconStyle;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreSetting, import.meta.hot));
}
