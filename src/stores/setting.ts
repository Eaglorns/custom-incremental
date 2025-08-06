import { defineStore, acceptHMRUpdate } from 'pinia';
import { Howl } from 'src/boot/hovler';

export const useStoreSetting = defineStore('storeSetting', {
  state: () => ({
    audio: {
      enabled: true,
      volume: 0.5,
    },
    iconStyle: 'fa-duotone ',
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
    preload() {
      const sounds = ['ShopOnBuyValue', 'ShopOnBuyMultiplier'];
      sounds.forEach((file) => {
        new Howl({
          src: [`sounds/${file}.mp3`],
        }).load();
      });
    },

    playSound(name: string, divider: number = 1) {
      if (this.audio.enabled)
        new Howl({
          src: [`sounds/${name}.mp3`],
          volume: this.audio.volume / divider,
        }).play();
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
