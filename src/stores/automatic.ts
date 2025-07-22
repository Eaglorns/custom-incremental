import Decimal from 'break_eternity.js';
import { defineStore, acceptHMRUpdate } from 'pinia';
import { useStoreShop } from 'stores/shop';

interface Helper {
  count: string;
  percent: string;
}

export const useStoreAutomatic = defineStore('storeAutomatic', {
  state: () => ({
    helpers: {
      cpu: {
        count: new Decimal(0),
        percent: new Decimal(0),
        cost: {
          count: new Decimal(1000),
          countMultiply: new Decimal(5),
          percent: new Decimal(2500),
          percentMultiply: new Decimal(150),
        },
      },
      hdd: {
        count: new Decimal(0),
        percent: new Decimal(0),
        cost: {
          count: new Decimal(27000),
          countMultiply: new Decimal(12),
          percent: new Decimal(106000),
          percentMultiply: new Decimal(230),
        },
      },
      ram: {
        count: new Decimal(0),
        percent: new Decimal(0),
        cost: {
          count: new Decimal(1200000),
          countMultiply: new Decimal(9),
          percent: new Decimal(2500000),
          percentMultiply: new Decimal(340),
        },
      },
      cpuMultiplier: {
        count: new Decimal(0),
        percent: new Decimal(0),
        cost: {
          count: new Decimal(10000),
          countMultiply: new Decimal(50),
          percent: new Decimal(25000),
          percentMultiply: new Decimal(1500),
        },
      },
      hddMultiplier: {
        count: new Decimal(0),
        percent: new Decimal(0),
        cost: {
          count: new Decimal(270000),
          countMultiply: new Decimal(120),
          percent: new Decimal(1060000),
          percentMultiply: new Decimal(2300),
        },
      },
      ramMultiplier: {
        count: new Decimal(0),
        percent: new Decimal(0),
        cost: {
          count: new Decimal(12000000),
          countMultiply: new Decimal(90),
          percent: new Decimal(25000000),
          percentMultiply: new Decimal(3400),
        },
      },
    },
  }),
  getters: {
    getHelperChance:
      () =>
      (percent: Decimal): Decimal => {
        if (!percent || percent.lte(0)) return new Decimal(1);
        const chance = new Decimal(1).add(
          new Decimal(99).mul(new Decimal(1).minus(Decimal.exp(new Decimal(-0.006).mul(percent)))),
        );
        return chance.gte(100) ? new Decimal(100) : chance;
      },

    save(state) {
      return {
        helpers: {
          cpu: {
            count: state.helpers.cpu.count,
            percent: state.helpers.cpu.percent,
          },
          hdd: {
            count: state.helpers.hdd.count,
            percent: state.helpers.hdd.percent,
          },
          ram: {
            count: state.helpers.ram.count,
            percent: state.helpers.ram.percent,
          },
          cpuMultiplier: {
            count: state.helpers.cpuMultiplier.count,
            percent: state.helpers.cpuMultiplier.percent,
          },
          hddMultiplier: {
            count: state.helpers.hddMultiplier.count,
            percent: state.helpers.hddMultiplier.percent,
          },
          ramMultiplier: {
            count: state.helpers.ramMultiplier.count,
            percent: state.helpers.ramMultiplier.percent,
          },
        },
      };
    },
  },
  actions: {
    processHelpers() {
      const storeShop = useStoreShop();
      const rand = Math.random() * 100;
      const valueKeys = ['cpu', 'hdd', 'ram'] as const;
      const multiplierKeys = ['cpuMultiplier', 'hddMultiplier', 'ramMultiplier'] as const;

      valueKeys.forEach((key) => {
        const helper = this.helpers[key];
        if (helper.count.gt(0) && this.getHelperChance(helper.percent).gte(rand)) {
          storeShop.list[key].value = storeShop.list[key].value.plus(
            helper.count.mul(storeShop.list[key].multiply),
          );
        }
      });

      multiplierKeys.forEach((key) => {
        const baseKey = key.replace('Multiplier', '') as keyof typeof storeShop.list;
        const helper = this.helpers[key];
        if (helper.count.gt(0) && this.getHelperChance(helper.percent).gte(rand)) {
          storeShop.list[baseKey].multiply = storeShop.list[baseKey].multiply.plus(helper.count);
        }
      });
    },

    load(loaded: {
      cpu: Helper;
      hdd: Helper;
      ram: Helper;
      cpuMultiplier: Helper;
      hddMultiplier: Helper;
      ramMultiplier: Helper;
    }) {
      this.helpers.cpu.count = new Decimal(loaded.cpu.count);
      this.helpers.cpu.percent = new Decimal(loaded.cpu.percent);
      this.helpers.hdd.count = new Decimal(loaded.hdd.count);
      this.helpers.hdd.percent = new Decimal(loaded.hdd.percent);
      this.helpers.ram.count = new Decimal(loaded.ram.count);
      this.helpers.ram.percent = new Decimal(loaded.ram.percent);
      this.helpers.cpuMultiplier.count = new Decimal(loaded.cpuMultiplier.count);
      this.helpers.cpuMultiplier.percent = new Decimal(loaded.cpuMultiplier.percent);
      this.helpers.hddMultiplier.count = new Decimal(loaded.hddMultiplier.count);
      this.helpers.hddMultiplier.percent = new Decimal(loaded.hddMultiplier.percent);
      this.helpers.ramMultiplier.count = new Decimal(loaded.ramMultiplier.count);
      this.helpers.ramMultiplier.percent = new Decimal(loaded.ramMultiplier.percent);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreAutomatic, import.meta.hot));
}
