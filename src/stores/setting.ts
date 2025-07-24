import { defineStore, acceptHMRUpdate } from 'pinia';
import { Howl } from 'src/boot/hovler';

export const useStoreSetting = defineStore('storeSetting', {
  state: () => ({
    audio: {
      enabled: true,
      volume: 0.5,
    },
  }),
  getters: {
    save(state) {
      return {
        audio: {
          enabled: state.audio.enabled,
          volume: state.audio.volume,
        },
      };
    },
  },
  actions: {
    playSound(name: string, divider: number = 1) {
      if (this.audio.enabled)
        new Howl({ src: [`sounds/${name}.mp3`], volume: this.audio.volume / divider }).play();
    },

    load(loaded: { audio: { enabled: boolean; volume: number } }) {
      this.audio.enabled = loaded.audio.enabled;
      this.audio.volume = loaded.audio.volume;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreSetting, import.meta.hot));
}
