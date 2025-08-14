import { defineStore, acceptHMRUpdate } from 'pinia';
import { Howl } from 'howler';

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
    initAudio() {
      if (this.audio.initialized) return;
      this.audio.initialized = true;
    },
    playSound(name: string, divider: number = 1) {
      if (!this.audio.enabled) return;
      this.initAudio();

      const volume = Math.max(0, Math.min(1, this.audio.volume / divider));
      let sound = this.preloadedSounds[name];

      if (!sound) {
        sound = new Howl({
          src: [`sounds/${name}.mp3`],
          volume,
        });
        this.preloadedSounds[name] = sound;
      } else {
        sound.volume(volume);
      }

      sound.play();
    },

    setVolume(volume: number) {
      this.audio.volume = Math.max(0, Math.min(1, volume));
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
