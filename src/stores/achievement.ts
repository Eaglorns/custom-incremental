import { defineStore, acceptHMRUpdate } from 'pinia';
import Decimal from 'break_eternity.js';
import { useStoreData } from 'stores/data';
import { useStoreShop } from 'stores/shop';
import { useStorePrestige } from 'stores/prestige';
import { useStoreResearch } from 'stores/research';

export const useStoreAchievement = defineStore('storeAchievement', {
  state: () => ({
    list: {
      epicNumberValue: new Decimal(0),
      shopCpuValue: new Decimal(0),
      shopHddValue: new Decimal(0),
      shopRamValue: new Decimal(0),
      shopWorkerValue: new Decimal(0),
      prestigePoints: new Decimal(0),
      researchPoints: new Decimal(0),
      shopPoints: new Decimal(0),
    },
  }),
  getters: {
    getLevel:
      () =>
      (current: Decimal, divider: Decimal): Decimal => {
        if (current.lt(divider)) return new Decimal(0);
        return current.log(divider).floor();
      },

    achievementBonus: (state): Decimal => {
      const sum = Object.values(state.list).reduce((acc, val) => acc.plus(val), new Decimal(0));
      return sum.mul(0.01).plus(1);
    },

    save(state) {
      return {
        epicNumberValue: state.list.epicNumberValue,
        shopCpuValue: state.list.shopCpuValue,
        shopHddValue: state.list.shopHddValue,
        shopRamValue: state.list.shopRamValue,
        shopWorkerValue: state.list.shopWorkerValue,
        prestigePoints: state.list.prestigePoints,
        researchPoints: state.list.researchPoints,
        shopPoints: state.list.shopPoints,
      };
    },
  },
  actions: {
    processUpdate() {
      const storeData = useStoreData();
      const storeShop = useStoreShop();
      const storePrestige = useStorePrestige();
      const storeResearch = useStoreResearch();

      const epicNumberLevel = this.getLevel(storeData.epicNumber, new Decimal(100));
      if (epicNumberLevel.gt(this.list.epicNumberValue))
        this.list.epicNumberValue = epicNumberLevel;

      const cpuLevel = this.getLevel(storeShop.list.cpu.value, new Decimal(10));
      if (cpuLevel.gt(this.list.shopCpuValue)) this.list.shopCpuValue = cpuLevel;

      const hddLevel = this.getLevel(storeShop.list.hdd.value, new Decimal(10));
      if (hddLevel.gt(this.list.shopHddValue)) this.list.shopHddValue = hddLevel;

      const ramLevel = this.getLevel(storeShop.list.ram.value, new Decimal(10));
      if (ramLevel.gt(this.list.shopRamValue)) this.list.shopRamValue = ramLevel;

      const workerLevel = this.getLevel(storeShop.list.worker.value, new Decimal(5));
      if (workerLevel.gt(this.list.shopWorkerValue)) this.list.shopWorkerValue = workerLevel;

      const prestigePointsLevel = this.getLevel(storePrestige.points, new Decimal(3));
      if (prestigePointsLevel.gt(this.list.prestigePoints))
        this.list.prestigePoints = prestigePointsLevel;

      const researchPointsLevel = this.getLevel(storeResearch.points, new Decimal(5));
      if (researchPointsLevel.gt(this.list.researchPoints))
        this.list.researchPoints = researchPointsLevel;

      const shopPointsLevel = this.getLevel(storeShop.points, new Decimal(2));
      if (shopPointsLevel.gt(this.list.shopPoints)) this.list.shopPoints = shopPointsLevel;
    },

    load(loaded: {
      epicNumberValue: string;
      shopCpuValue: string;
      shopHddValue: string;
      shopRamValue: string;
      shopWorkerValue: string;
      prestigePoints: string;
      researchPoints: string;
      shopPoints: string;
    }) {
      this.list.epicNumberValue = new Decimal(loaded.epicNumberValue);
      this.list.shopCpuValue = new Decimal(loaded.shopCpuValue);
      this.list.shopHddValue = new Decimal(loaded.shopHddValue);
      this.list.shopRamValue = new Decimal(loaded.shopRamValue);
      this.list.shopWorkerValue = new Decimal(loaded.shopWorkerValue);
      this.list.prestigePoints = new Decimal(loaded.prestigePoints);
      this.list.researchPoints = new Decimal(loaded.researchPoints);
      this.list.shopPoints = new Decimal(loaded.shopPoints);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreAchievement, import.meta.hot));
}
