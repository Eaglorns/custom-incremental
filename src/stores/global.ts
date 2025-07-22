import { defineStore, acceptHMRUpdate } from 'pinia';

export const useStoreGlobal = defineStore('storeGlobal', {
  state: () => ({
    app: {
      name: 'Custom Incremental',
      version: '0.0.4',
    },
  }),
  getters: {},
  actions: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreGlobal, import.meta.hot));
}
