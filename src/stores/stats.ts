import { defineStore, acceptHMRUpdate } from 'pinia';
import Decimal from 'break_eternity.js';

export const useStoreStats = defineStore('storeStats', {
  state: () => ({
    maxEpicNumber: new Decimal(0),
    maxResearchPoints: new Decimal(0),
    maxPrestigePoints: new Decimal(0),
  }),
  getters: {
    save(state) {
      return {
        maxEpicNumber: state.maxEpicNumber,
        maxResearchPoints: state.maxResearchPoints,
        maxPrestigePoints: state.maxPrestigePoints,
      };
    },
  },
  actions: {
    load(loaded: { maxEpicNumber: string; maxResearchPoints: string; maxPrestigePoints: string }) {
      this.maxEpicNumber = new Decimal(loaded.maxEpicNumber);
      this.maxResearchPoints = new Decimal(loaded.maxResearchPoints);
      this.maxPrestigePoints = new Decimal(loaded.maxPrestigePoints);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreStats, import.meta.hot));
}
