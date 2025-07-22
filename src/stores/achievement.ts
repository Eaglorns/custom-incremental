import { defineStore, acceptHMRUpdate } from 'pinia';
import Decimal from 'break_eternity.js';

export const useStoreAchievement = defineStore('storeAchievement', {
  state: () => ({
    list: {
      epicLevel: new Decimal(0),
      cpuLevel: new Decimal(0),
      hddLevel: new Decimal(0),
      ramLevel: new Decimal(0),
    },
  }),
  getters: {
    achievementBonus: (state): Decimal => {
      const { epicLevel, cpuLevel, hddLevel, ramLevel } = state.list;
      return epicLevel.plus(cpuLevel).plus(hddLevel).plus(ramLevel).mul(0.01).plus(1);
    },

    save(state) {
      return {
        epicLevel: state.list.epicLevel,
        cpuLevel: state.list.cpuLevel,
        hddLevel: state.list.hddLevel,
        ramLevel: state.list.ramLevel,
      };
    },
  },
  actions: {
    load(loaded: { epicLevel: string; cpuLevel: string; hddLevel: string; ramLevel: string }) {
      this.list.epicLevel = new Decimal(loaded.epicLevel);
      this.list.cpuLevel = new Decimal(loaded.cpuLevel);
      this.list.hddLevel = new Decimal(loaded.hddLevel);
      this.list.ramLevel = new Decimal(loaded.ramLevel);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreAchievement, import.meta.hot));
}
