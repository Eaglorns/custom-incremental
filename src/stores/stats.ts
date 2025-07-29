import { defineStore, acceptHMRUpdate } from 'pinia';
import Decimal from 'break_eternity.js';
import { useStoreData } from 'stores/data';
import { useStoreResearch } from 'stores/research';
import { useStorePrestige } from 'stores/prestige';
import { useStoreShop } from 'stores/shop';

export const useStoreStats = defineStore('storeStats', {
  state: () => ({
    gameTime: 0,
    maxEpicNumber: new Decimal(0),
    maxShopPoints: new Decimal(0),
    maxPrestigePoints: new Decimal(0),
    maxResearchPoints: new Decimal(0),
  }),
  getters: {
    save(state) {
      return {
        gameTime: state.gameTime,
        maxEpicNumber: state.maxEpicNumber,
        maxShopPoints: state.maxShopPoints,
        maxPrestigePoints: state.maxPrestigePoints,
        maxResearchPoints: state.maxResearchPoints,
      };
    },
  },
  actions: {
    processUpdate() {
      const storeData = useStoreData();
      const storeResearch = useStoreResearch();
      const storePrestige = useStorePrestige();
      const storeShop = useStoreShop();
      this.maxEpicNumber = Decimal.max(this.maxEpicNumber, storeData.epicNumber);
      this.maxShopPoints = Decimal.max(this.maxShopPoints, storeShop.points);
      this.maxResearchPoints = Decimal.max(this.maxResearchPoints, storeResearch.points);
      this.maxPrestigePoints = Decimal.max(this.maxPrestigePoints, storePrestige.points);
    },

    load(loaded: {
      gameTime: number;
      maxEpicNumber: string;
      maxShopPoints: string;
      maxResearchPoints: string;
      maxPrestigePoints: string;
    }) {
      this.gameTime = loaded.gameTime;
      this.maxEpicNumber = new Decimal(loaded.maxEpicNumber);
      this.maxShopPoints = new Decimal(loaded.maxShopPoints);
      this.maxPrestigePoints = new Decimal(loaded.maxPrestigePoints);
      this.maxResearchPoints = new Decimal(loaded.maxResearchPoints);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreStats, import.meta.hot));
}
