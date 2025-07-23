import { defineStore, acceptHMRUpdate } from 'pinia';
import Decimal from 'break_eternity.js';
import { useStoreData } from 'stores/data';
import { useStoreResearch } from 'stores/research';
import { useStorePrestige } from 'stores/prestige';

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
    processUpdate() {
      const storeData = useStoreData();
      const storeResearch = useStoreResearch();
      const storePrestige = useStorePrestige();
      this.maxEpicNumber = Decimal.max(this.maxEpicNumber, storeData.epicNumber);
      this.maxResearchPoints = Decimal.max(this.maxResearchPoints, storeResearch.points);
      this.maxPrestigePoints = Decimal.max(this.maxPrestigePoints, storePrestige.points);
    },

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
