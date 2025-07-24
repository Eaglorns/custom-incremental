import Decimal from 'break_eternity.js';
import { defineStore, acceptHMRUpdate } from 'pinia';
import { useStoreData } from 'stores/data';
import { useStoreShop } from 'stores/shop';

export const useStorePrestige = defineStore('storePrestige', {
  state: () => ({
    points: new Decimal(0),
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
      storePrestige.points = storePrestige.points.add(storePrestige.prestigeGain);
      storeData.epicNumber = new Decimal(1);
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
