import Decimal from 'break_eternity.js';
import { defineStore, acceptHMRUpdate } from 'pinia';
import { useStoreData } from 'stores/data';
import { useStoreShop } from 'stores/shop';
import { useStoreResearch } from 'stores/research';

export const useStorePrestige = defineStore('storePrestige', {
  state: () => ({
    points: new Decimal(1000),
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
    },
  }),
  getters: {
    prestigeGain: (): Decimal => {
      const storeData = useStoreData();
      const storePrestige = useStorePrestige();
      if (storeData.epicNumber.lte(0)) return new Decimal(0);
      const prestigeUpgradeSoftening = storePrestige.upgrades.prestigeSoftening.level.gt(0)
        ? storePrestige.upgrades.prestigeSoftening.level
        : new Decimal(1);
      return storeData.epicNumber.mul(0.00001).mul(prestigeUpgradeSoftening).log10();
    },

    prestigeCan: (): boolean => {
      const storePrestige = useStorePrestige();
      return storePrestige.prestigeGain.gte(1);
    },

    save(state) {
      return {
        points: state.points,
        upgrades: {
          prestigeBonus: { level: state.upgrades.prestigeBonus.level },
          prestigeSoftening: { level: state.upgrades.prestigeSoftening.level },
          autoShopCPUValue: { level: state.upgrades.autoShopCPUValue.level },
          autoShopHDDValue: { level: state.upgrades.autoShopHDDValue.level },
          autoShopRAMValue: { level: state.upgrades.autoShopRAMValue.level },
          autoShopCPUMultiply: { level: state.upgrades.autoShopCPUMultiply.level },
          autoShopHDDMultiply: { level: state.upgrades.autoShopHDDMultiply.level },
          autoShopRAMMultiply: { level: state.upgrades.autoShopRAMMultiply.level },
        },
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

    processUpgradeAddShop() {
      const storePrestige = useStorePrestige();
      const storeShop = useStoreShop();
      const upgradesValue = [
        { key: 'autoShopCPUValue', shopKey: 'cpu' },
        { key: 'autoShopHDDValue', shopKey: 'hdd' },
        { key: 'autoShopRAMValue', shopKey: 'ram' },
      ];
      upgradesValue.forEach(({ key, shopKey }) => {
        const level = storePrestige.upgrades[key as keyof typeof storePrestige.upgrades].level;
        if (level.gt(0)) {
          storeShop.list[shopKey as keyof typeof storeShop.list].value =
            storeShop.list[shopKey as keyof typeof storeShop.list].value.add(level);
        }
      });
      const upgradesMultiply = [
        { key: 'autoShopCPUMultiply', shopKey: 'cpu' },
        { key: 'autoShopHDDMultiply', shopKey: 'hdd' },
        { key: 'autoShopRAMMultiply', shopKey: 'ram' },
      ];
      upgradesMultiply.forEach(({ key, shopKey }) => {
        const level = storePrestige.upgrades[key as keyof typeof storePrestige.upgrades].level;
        if (level.gt(0)) {
          storeShop.list[shopKey as keyof typeof storeShop.list].multiply =
            storeShop.list[shopKey as keyof typeof storeShop.list].multiply.add(level);
        }
      });
    },

    load(loaded: {
      points: string;
      upgrades: {
        prestigeBonus: { level: string };
        prestigeSoftening: { level: string };
        autoShopCPUValue: { level: string };
        autoShopHDDValue: { level: string };
        autoShopRAMValue: { level: string };
        autoShopCPUMultiply: { level: string };
        autoShopHDDMultiply: { level: string };
        autoShopRAMMultiply: { level: string };
      };
    }) {
      this.points = new Decimal(loaded.points);
      this.upgrades.prestigeBonus.level = new Decimal(loaded.upgrades.prestigeBonus.level);
      this.upgrades.prestigeSoftening.level = new Decimal(loaded.upgrades.prestigeSoftening.level);
      this.upgrades.autoShopCPUValue.level = new Decimal(loaded.upgrades.autoShopCPUValue.level);
      this.upgrades.autoShopHDDValue.level = new Decimal(loaded.upgrades.autoShopHDDValue.level);
      this.upgrades.autoShopRAMValue.level = new Decimal(loaded.upgrades.autoShopRAMValue.level);
      this.upgrades.autoShopCPUMultiply.level = new Decimal(
        loaded.upgrades.autoShopCPUMultiply.level,
      );
      this.upgrades.autoShopHDDMultiply.level = new Decimal(
        loaded.upgrades.autoShopHDDMultiply.level,
      );
      this.upgrades.autoShopRAMMultiply.level = new Decimal(
        loaded.upgrades.autoShopRAMMultiply.level,
      );
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStorePrestige, import.meta.hot));
}
