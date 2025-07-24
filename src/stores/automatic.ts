import Decimal from 'break_eternity.js';
import { defineStore, acceptHMRUpdate } from 'pinia';
import { useStoreShop } from 'stores/shop';
import { useStoreData } from 'stores/data';

interface Helper {
  count: string;
  percent: string;
}

const buyMax = (points: Decimal, price: Decimal, count: Decimal) => {
  const maxCanBuy = points.div(price).floor();
  const bought = Decimal.min(count, maxCanBuy);
  const rest = bought.mul(price);
  return { bought, rest };
};

export const useStoreAutomatic = defineStore('storeAutomatic', {
  state: () => ({
    helpersShop: {
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
        helpersShop: {
          cpu: {
            count: state.helpersShop.cpu.count,
            percent: state.helpersShop.cpu.percent,
          },
          hdd: {
            count: state.helpersShop.hdd.count,
            percent: state.helpersShop.hdd.percent,
          },
          ram: {
            count: state.helpersShop.ram.count,
            percent: state.helpersShop.ram.percent,
          },
          cpuMultiplier: {
            count: state.helpersShop.cpuMultiplier.count,
            percent: state.helpersShop.cpuMultiplier.percent,
          },
          hddMultiplier: {
            count: state.helpersShop.hddMultiplier.count,
            percent: state.helpersShop.hddMultiplier.percent,
          },
          ramMultiplier: {
            count: state.helpersShop.ramMultiplier.count,
            percent: state.helpersShop.ramMultiplier.percent,
          },
        },
      };
    },
  },
  actions: {
    processHelpersShop() {
      const storeShop = useStoreShop();
      const storeData = useStoreData();
      const rand = Math.random() * 100;
      const valueKeys = ['cpu', 'hdd', 'ram'] as const;
      const multiplierKeys = ['cpuMultiplier', 'hddMultiplier', 'ramMultiplier'] as const;

      valueKeys.forEach((key) => {
        const helper = this.helpersShop[key];
        if (helper.count.gt(0) && this.getHelperChance(helper.percent).gte(rand)) {
          const buyResult = buyMax(storeShop.points, storeShop.list[key].cost.value, helper.count);
          if (buyResult.bought.gt(0)) {
            storeShop.list[key].value = storeShop.list[key].value.plus(
              buyResult.bought.mul(storeShop.list[key].multiply),
            );
            storeShop.points = storeShop.points.minus(buyResult.rest);
          }
        }
      });

      multiplierKeys.forEach((key) => {
        const baseKey = key.replace('Multiplier', '') as keyof typeof storeShop.list;
        const helper = this.helpersShop[key];
        if (helper.count.gt(0) && this.getHelperChance(helper.percent).gte(rand)) {
          const buyResult = buyMax(
            storeData.epicNumber,
            storeShop.costMultiply(baseKey),
            helper.count,
          );
          if (buyResult.bought.gt(0)) {
            storeShop.list[baseKey].multiply = storeShop.list[baseKey].multiply.plus(
              buyResult.bought,
            );
            storeData.epicNumber = storeData.epicNumber.minus(buyResult.rest);
          }
        }
      });
    },

    load(loaded: {
      helpersShop: {
        cpu: Helper;
        hdd: Helper;
        ram: Helper;
        cpuMultiplier: Helper;
        hddMultiplier: Helper;
        ramMultiplier: Helper;
      };
    }) {
      this.helpersShop.cpu.count = new Decimal(loaded.helpersShop.cpu.count);
      this.helpersShop.cpu.percent = new Decimal(loaded.helpersShop.cpu.percent);
      this.helpersShop.hdd.count = new Decimal(loaded.helpersShop.hdd.count);
      this.helpersShop.hdd.percent = new Decimal(loaded.helpersShop.hdd.percent);
      this.helpersShop.ram.count = new Decimal(loaded.helpersShop.ram.count);
      this.helpersShop.ram.percent = new Decimal(loaded.helpersShop.ram.percent);
      this.helpersShop.cpuMultiplier.count = new Decimal(loaded.helpersShop.cpuMultiplier.count);
      this.helpersShop.cpuMultiplier.percent = new Decimal(
        loaded.helpersShop.cpuMultiplier.percent,
      );
      this.helpersShop.hddMultiplier.count = new Decimal(loaded.helpersShop.hddMultiplier.count);
      this.helpersShop.hddMultiplier.percent = new Decimal(
        loaded.helpersShop.hddMultiplier.percent,
      );
      this.helpersShop.ramMultiplier.count = new Decimal(loaded.helpersShop.ramMultiplier.count);
      this.helpersShop.ramMultiplier.percent = new Decimal(
        loaded.helpersShop.ramMultiplier.percent,
      );
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreAutomatic, import.meta.hot));
}
