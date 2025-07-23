import { defineStore, acceptHMRUpdate } from 'pinia';

export const useStoreStats = defineStore('storeStats', {
  state: () => ({}),
  getters: {},
  actions: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreStats, import.meta.hot));
}
