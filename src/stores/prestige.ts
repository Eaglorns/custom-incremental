import Decimal from 'break_eternity.js';
import { defineStore, acceptHMRUpdate } from 'pinia';
import { useStoreData } from 'stores/data';
import { useStoreShop } from 'stores/shop';
import { useStoreResearch } from 'stores/research';

export const useStorePrestige = defineStore('storePrestige', {
  state: () => ({
    points: new Decimal(0),
    upgrades: {
      prestigeBonus: {
        cost: new Decimal(5),
        level: new Decimal(0),
        costGrowth: new Decimal(1.2),
        maxLevel: -1,
      },
      prestigeSoftening: {
        cost: new Decimal(5),
        level: new Decimal(0),
        costGrowth: new Decimal(1.05),
        maxLevel: -1,
      },
      autoShopCPU: {
        cost: new Decimal(1),
        level: new Decimal(0),
        costGrowth: new Decimal(3),
        maxLevel: -1,
      },
      autoShopHard: {
        cost: new Decimal(5),
        level: new Decimal(0),
        costGrowth: new Decimal(2),
        maxLevel: -1,
      },
      autoShopRAM: {
        cost: new Decimal(20),
        level: new Decimal(0),
        costGrowth: new Decimal(1.5),
        maxLevel: -1,
      },
    },
  }),
  getters: {
    prestigeGain: (): Decimal => {
      const storeData = useStoreData();
      if (storeData.epicNumber.lte(0)) return new Decimal(0);
      return storeData.epicNumber.mul(0.00001).log10();
    },

    prestigeCan: (): boolean => {
      const storePrestige = useStorePrestige();
      return storePrestige.prestigeGain.gte(1);
    },

    save(state) {
      return {
        points: state.points,
      };
    },
  },
  actions: {
    onPrestige() {
      const storeData = useStoreData();
      const storePrestige = useStorePrestige();
      const storeShop = useStoreShop();
      const storeResearch = useStoreResearch();
      storePrestige.points = storePrestige.points.add(storePrestige.prestigeGain);
      storeData.epicNumber = new Decimal(1);
      storeResearch.points = new Decimal(0);
      storeData.multiplierEpicNumber = new Decimal(0);
      storeShop.list.cpu.value = new Decimal(1);
      storeShop.list.cpu.multiply = new Decimal(1);
      storeShop.list.hdd.value = new Decimal(1);
      storeShop.list.hdd.multiply = new Decimal(1);
      storeShop.list.ram.value = new Decimal(1);
      storeShop.list.ram.multiply = new Decimal(1);
      storeShop.points = new Decimal(0);
    },

    load(loaded: { points: string }) {
      this.points = new Decimal(loaded.points);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStorePrestige, import.meta.hot));
}
