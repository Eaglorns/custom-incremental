import Decimal from 'break_eternity.js';
import { defineStore, acceptHMRUpdate } from 'pinia';
import { useStoreData } from 'stores/data';
import { useStoreShop } from 'stores/shop';
import { useStoreResearch } from 'stores/research';

const D0 = new Decimal(0);
const D1 = new Decimal(1);
const BASE = new Decimal(1.3);
const FACTOR = new Decimal(0.00001);

const VALUE_UPGRADES = [
  ['autoShopCPUValue', 'cpu'],
  ['autoShopHDDValue', 'hdd'],
  ['autoShopRAMValue', 'ram'],
  ['autoShopWorkerValue', 'worker'],
] as const;

const MULTIPLIER_UPGRADES = [
  ['autoShopCPUMultiply', 'cpu'],
  ['autoShopHDDMultiply', 'hdd'],
  ['autoShopRAMMultiply', 'ram'],
  ['autoShopWorkerMultiply', 'worker'],
] as const;

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
      prestigeBuyValueCount: {
        cost: new Decimal(0.1),
        level: new Decimal(0),
        costGrowth: new Decimal(1.15),
        maxLevel: -1,
      },
      prestigeBuyValueMultiply: {
        cost: new Decimal(0.5),
        level: new Decimal(0),
        costGrowth: new Decimal(1.3),
        maxLevel: -1,
      },
      autoShopCPUValue: {
        cost: new Decimal(0.05),
        level: new Decimal(0),
        costGrowth: new Decimal(1.1),
        maxLevel: -1,
      },
      autoShopHDDValue: {
        cost: new Decimal(0.12),
        level: new Decimal(0),
        costGrowth: new Decimal(1.1),
        maxLevel: -1,
      },
      autoShopRAMValue: {
        cost: new Decimal(0.2),
        level: new Decimal(0),
        costGrowth: new Decimal(1.1),
        maxLevel: -1,
      },
      autoShopWorkerValue: {
        cost: new Decimal(5),
        level: new Decimal(0),
        costGrowth: new Decimal(1.3),
        maxLevel: -1,
      },
      autoShopCPUMultiply: {
        cost: new Decimal(2),
        level: new Decimal(0),
        costGrowth: new Decimal(1.5),
        maxLevel: -1,
      },
      autoShopHDDMultiply: {
        cost: new Decimal(3.5),
        level: new Decimal(0),
        costGrowth: new Decimal(2.0),
        maxLevel: -1,
      },
      autoShopRAMMultiply: {
        cost: new Decimal(5),
        level: new Decimal(0),
        costGrowth: new Decimal(2.5),
        maxLevel: -1,
      },
      autoShopWorkerMultiply: {
        cost: new Decimal(20),
        level: new Decimal(0),
        costGrowth: new Decimal(4.0),
        maxLevel: -1,
      },
    },
  }),
  getters: {
    getEpicNumberToPrestige: (state): Decimal => {
      const soft = state.upgrades.prestigeSoftening.level.gt(0)
        ? state.upgrades.prestigeSoftening.level
        : D1;
      return BASE.div(FACTOR.mul(soft));
    },

    prestigeGain: (state): Decimal => {
      const storeData = useStoreData();
      const n = storeData.epicNumber;
      if (n.lte(0)) return D0;
      const soft = state.upgrades.prestigeSoftening.level.gt(0)
        ? state.upgrades.prestigeSoftening.level
        : D1;
      const scaled = n.mul(FACTOR).mul(soft);
      return scaled.log(BASE);
    },

    prestigeCan(): boolean {
      return this.prestigeGain.gte(1);
    },

    save(state) {
      return {
        points: state.points,
        upgrades: {
          prestigeBonus: { level: state.upgrades.prestigeBonus.level },
          prestigeSoftening: { level: state.upgrades.prestigeSoftening.level },
          prestigeBuyValueCount: { level: state.upgrades.prestigeBuyValueCount.level },
          prestigeBuyValueMultiply: {
            level: state.upgrades.prestigeBuyValueMultiply.level,
          },
          autoShopCPUValue: { level: state.upgrades.autoShopCPUValue.level },
          autoShopHDDValue: { level: state.upgrades.autoShopHDDValue.level },
          autoShopRAMValue: { level: state.upgrades.autoShopRAMValue.level },
          autoShopWorkerValue: { level: state.upgrades.autoShopWorkerValue.level },
          autoShopCPUMultiply: { level: state.upgrades.autoShopCPUMultiply.level },
          autoShopHDDMultiply: { level: state.upgrades.autoShopHDDMultiply.level },
          autoShopRAMMultiply: { level: state.upgrades.autoShopRAMMultiply.level },
          autoShopWorkerMultiply: { level: state.upgrades.autoShopWorkerMultiply.level },
        },
      };
    },
  },
  actions: {
    onPrestige() {
      const storeData = useStoreData();
      const storeShop = useStoreShop();
      const storeResearch = useStoreResearch();

      this.points = this.points.add(this.prestigeGain as unknown as Decimal);
      storeData.epicNumber = D1;
      storeResearch.points = D0;
      storeShop.list.cpu.value = D1;
      storeShop.list.cpu.multiply = D1;
      storeShop.list.hdd.value = D1;
      storeShop.list.hdd.multiply = D1;
      storeShop.list.ram.value = D1;
      storeShop.list.ram.multiply = D1;
      storeShop.list.worker.value = D1;
      storeShop.list.worker.multiply = D1;
      storeShop.points = D0;
    },

    processUpgradeAddShop() {
      const storeShop = useStoreShop();

      for (const [uKey, sKey] of VALUE_UPGRADES) {
        const level = this.upgrades[uKey].level;
        if (level.gt(0)) {
          const shop = storeShop.list[sKey];
          shop.value = shop.value.add(level);
        }
      }

      for (const [uKey, sKey] of MULTIPLIER_UPGRADES) {
        const level = this.upgrades[uKey].level;
        if (level.gt(0)) {
          const shop = storeShop.list[sKey];
          shop.multiply = shop.multiply.add(level);
        }
      }
    },

    load(loaded: {
      points?: string | number;
      upgrades?: {
        prestigeBonus?: { level?: string | number };
        prestigeSoftening?: { level?: string | number };
        prestigeBuyValueCount?: { level?: string | number };
        prestigeBuyValueMultiply?: { level?: string | number };
        autoShopCPUValue?: { level?: string | number };
        autoShopHDDValue?: { level?: string | number };
        autoShopRAMValue?: { level?: string | number };
        autoShopWorkerValue?: { level?: string | number };
        autoShopCPUMultiply?: { level?: string | number };
        autoShopHDDMultiply?: { level?: string | number };
        autoShopRAMMultiply?: { level?: string | number };
        autoShopWorkerMultiply?: { level?: string | number };
      };
    }) {
      const toDec = (v?: string | number, def = '0') => new Decimal(v ?? def);

      this.points = toDec(loaded?.points, '0');
      const u = loaded?.upgrades ?? {};

      this.upgrades.prestigeBonus.level = toDec(u.prestigeBonus?.level);
      this.upgrades.prestigeSoftening.level = toDec(u.prestigeSoftening?.level);
      this.upgrades.prestigeBuyValueCount.level = toDec(u.prestigeBuyValueCount?.level);
      this.upgrades.prestigeBuyValueMultiply.level = toDec(u.prestigeBuyValueMultiply?.level);
      this.upgrades.autoShopCPUValue.level = toDec(u.autoShopCPUValue?.level);
      this.upgrades.autoShopHDDValue.level = toDec(u.autoShopHDDValue?.level);
      this.upgrades.autoShopRAMValue.level = toDec(u.autoShopRAMValue?.level);
      this.upgrades.autoShopWorkerValue.level = toDec(u.autoShopWorkerValue?.level);
      this.upgrades.autoShopCPUMultiply.level = toDec(u.autoShopCPUMultiply?.level);
      this.upgrades.autoShopHDDMultiply.level = toDec(u.autoShopHDDMultiply?.level);
      this.upgrades.autoShopRAMMultiply.level = toDec(u.autoShopRAMMultiply?.level);
      this.upgrades.autoShopWorkerMultiply.level = toDec(u.autoShopWorkerMultiply?.level);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStorePrestige, import.meta.hot));
}
