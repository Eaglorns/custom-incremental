import { defineStore, acceptHMRUpdate } from 'pinia';

export const useStoreSetting = defineStore('storeSetting', {
  state: () => ({}),
  getters: {},
  actions: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreSetting, import.meta.hot));
}
