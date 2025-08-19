import { defineStore, acceptHMRUpdate } from 'pinia';
import Decimal from 'break_eternity.js';
import { useStoreData } from 'stores/data';
import { useStoreShop } from 'stores/shop';
import { useStorePrestige } from 'stores/prestige';
import { useStoreResearch } from 'stores/research';

const ZERO = new Decimal(0);

type AchievementKey =
  | 'epicNumberValue'
  | 'shopCpuValue'
  | 'shopHddValue'
  | 'shopRamValue'
  | 'shopWorkerValue'
  | 'prestigePoints'
  | 'researchPoints'
  | 'shopPoints';

const DIVIDERS: Record<AchievementKey, Decimal> = {
  epicNumberValue: new Decimal(10),
  shopCpuValue: new Decimal(10),
  shopHddValue: new Decimal(6),
  shopRamValue: new Decimal(3),
  shopWorkerValue: new Decimal(2),
  prestigePoints: new Decimal(1.5),
  researchPoints: new Decimal(1.3),
  shopPoints: new Decimal(5),
} as const;

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
        if (current.lt(divider)) return ZERO;
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
    updateLevel(key: AchievementKey, current: Decimal, divider: Decimal) {
      const level = this.getLevel(current, divider);
      if (level.gt(this.list[key])) this.list[key] = level;
    },

    processUpdate() {
      const storeData = useStoreData();
      const storeShop = useStoreShop();
      const storePrestige = useStorePrestige();
      const storeResearch = useStoreResearch();

      this.updateLevel('epicNumberValue', storeData.epicNumber, DIVIDERS.epicNumberValue);

      this.updateLevel('shopCpuValue', storeShop.list.cpu.value, DIVIDERS.shopCpuValue);
      this.updateLevel('shopHddValue', storeShop.list.hdd.value, DIVIDERS.shopHddValue);
      this.updateLevel('shopRamValue', storeShop.list.ram.value, DIVIDERS.shopRamValue);
      this.updateLevel('shopWorkerValue', storeShop.list.worker.value, DIVIDERS.shopWorkerValue);

      this.updateLevel('prestigePoints', storePrestige.points, DIVIDERS.prestigePoints);
      this.updateLevel('researchPoints', storeResearch.points, DIVIDERS.researchPoints);
      this.updateLevel('shopPoints', storeShop.points, DIVIDERS.shopPoints);
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
      this.list.epicNumberValue = new Decimal(loaded?.epicNumberValue ?? '0');
      this.list.shopCpuValue = new Decimal(loaded?.shopCpuValue ?? '0');
      this.list.shopHddValue = new Decimal(loaded?.shopHddValue ?? '0');
      this.list.shopRamValue = new Decimal(loaded?.shopRamValue ?? '0');
      this.list.shopWorkerValue = new Decimal(loaded?.shopWorkerValue ?? '0');
      this.list.prestigePoints = new Decimal(loaded?.prestigePoints ?? '0');
      this.list.researchPoints = new Decimal(loaded?.researchPoints ?? '0');
      this.list.shopPoints = new Decimal(loaded?.shopPoints ?? '0');
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreAchievement, import.meta.hot));
}
