import { defineStore, acceptHMRUpdate } from 'pinia';
import { Howl } from 'src/boot/hovler';

export const useStoreSetting = defineStore('storeSetting', {
  state: () => ({
    audio: {
      enabled: true,
      volume: 0.5,
      initialized: false,
    },
    iconStyle: 'fa-duotone ',
    preloadedSounds: {} as Record<string, Howl>,
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
        this.preloadedSounds[file] = new Howl({
          src: [`sounds/${file}.mp3`],
          preload: true,
        });
      });
      this.audio.initialized = true;
    },

    playSound(name: string, divider: number = 1) {
      if (!this.audio.enabled) return;
      if (!this.audio.initialized) {
        this.initializeAudio();
      }
      try {
        const sound =
          this.preloadedSounds[name] ||
          new Howl({
            src: [`sounds/${name}.mp3`],
            volume: this.audio.volume / divider,
          });
        if (this.preloadedSounds[name]) {
          sound.volume(this.audio.volume / divider);
        }
        sound.play();
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
