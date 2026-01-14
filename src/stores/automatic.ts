import Decimal from 'break_eternity.js';
import { defineStore, acceptHMRUpdate } from 'pinia';
import { useStoreShop } from 'stores/shop';
import { useStoreData } from 'stores/data';
import { useStorePrestige } from 'stores/prestige';
import { buyMax, toDec } from 'src/utils/storeUtils';

type ShopKey = 'cpu' | 'hdd' | 'ram' | 'worker';

interface ShopItem {
  value: Decimal;
  multiply: Decimal;
  buyModeValue: number;
  buyModeMultiply: number;
  cost: {
    value: Decimal;
    multiply: Decimal;
  };
}

type ShopStore = {
  points: Decimal;
  list: Record<ShopKey, ShopItem>;
  costMultiply: (key: ShopKey) => Decimal;
};

type DataStore = {
  epicNumber: Decimal;
};

interface Helper {
  count: string;
  percent: string;
  enabled: boolean;
}

const ONE = new Decimal(1);
const NINETY_NINE = new Decimal(99);
const HUNDRED = new Decimal(100);
const NEG_RATE = new Decimal(-0.006);

const VALUE_KEYS = ['cpu', 'hdd', 'ram', 'worker'] as const;
const MULTIPLIER_KEYS = [
  'cpuMultiplier',
  'hddMultiplier',
  'ramMultiplier',
  'workerMultiplier',
] as const;

type HelperState = { count: Decimal; percent: Decimal; enabled: boolean };

export const useStoreAutomatic = defineStore('storeAutomatic', {
  state: () => ({
    helpersShop: {
      cpu: {
        count: new Decimal(0),
        percent: new Decimal(0),
        enabled: true,
        cost: {
          count: new Decimal(5000),
          countMultiply: new Decimal(5),
          percent: new Decimal(2500),
          percentMultiply: new Decimal(150),
        },
      },
      hdd: {
        count: new Decimal(0),
        percent: new Decimal(0),
        enabled: true,
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
        enabled: true,
        cost: {
          count: new Decimal(1200000),
          countMultiply: new Decimal(9),
          percent: new Decimal(2500000),
          percentMultiply: new Decimal(340),
        },
      },
      worker: {
        count: new Decimal(0),
        percent: new Decimal(0),
        enabled: true,
        cost: {
          count: new Decimal('1e10'),
          countMultiply: new Decimal(150),
          percent: new Decimal('1e15'),
          percentMultiply: new Decimal(1250),
        },
      },
      cpuMultiplier: {
        count: new Decimal(0),
        percent: new Decimal(0),
        enabled: true,
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
        enabled: true,
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
        enabled: true,
        cost: {
          count: new Decimal(12000000),
          countMultiply: new Decimal(90),
          percent: new Decimal(25000000),
          percentMultiply: new Decimal(3400),
        },
      },
      workerMultiplier: {
        count: new Decimal(0),
        percent: new Decimal(0),
        enabled: true,
        cost: {
          count: new Decimal('1e12'),
          countMultiply: new Decimal(1650),
          percent: new Decimal('1e17'),
          percentMultiply: new Decimal(13500),
        },
      },
    },
  }),
  getters: {
    getHelperChance:
      () =>
      (percent: Decimal): Decimal => {
        if (!percent || percent.lte(0)) return ONE;
        const chance = ONE.add(NINETY_NINE.mul(ONE.minus(Decimal.exp(NEG_RATE.mul(percent)))));
        return Decimal.min(HUNDRED, chance);
      },

    save(state) {
      const serialize = (h: HelperState) => ({
        count: h.count.toString(),
        percent: h.percent.toString(),
        enabled: h.enabled,
      });
      return {
        helpersShop: {
          cpu: serialize(state.helpersShop.cpu),
          hdd: serialize(state.helpersShop.hdd),
          ram: serialize(state.helpersShop.ram),
          worker: serialize(state.helpersShop.worker),
          cpuMultiplier: serialize(state.helpersShop.cpuMultiplier),
          hddMultiplier: serialize(state.helpersShop.hddMultiplier),
          ramMultiplier: serialize(state.helpersShop.ramMultiplier),
          workerMultiplier: serialize(state.helpersShop.workerMultiplier),
        },
      };
    },
  },
  actions: {
    processHelpersShop() {
      const storeShop = useStoreShop();
      const storeData = useStoreData();
      const storePrestige = useStorePrestige();

      const rand = new Decimal(Math.random() * 100);
      const buyCountMult = storePrestige.upgrades.prestigeBuyValueCount.level.gt(0)
        ? storePrestige.upgrades.prestigeBuyValueCount.level
        : ONE;
      const buyMultiplyMult = storePrestige.upgrades.prestigeBuyValueMultiply.level.gt(0)
        ? storePrestige.upgrades.prestigeBuyValueMultiply.level
        : ONE;

      this.processValueHelpers(storeShop, rand, buyCountMult);
      this.processMultiplierHelpers(storeShop, storeData, rand, buyMultiplyMult);
    },

    processValueHelpers(storeShop: ShopStore, rand: Decimal, buyCountMult: Decimal) {
      for (const key of VALUE_KEYS) {
        const helper = this.helpersShop[key];
        if (!this.isHelperActive(helper)) continue;

        if (this.getHelperChance(helper.percent).gte(rand)) {
          this.buyValueItem(storeShop, key, helper, buyCountMult);
        }
      }
    },

    processMultiplierHelpers(
      storeShop: ShopStore,
      storeData: DataStore,
      rand: Decimal,
      buyMultiplyMult: Decimal,
    ) {
      for (const key of MULTIPLIER_KEYS) {
        const helper = this.helpersShop[key];
        if (!this.isHelperActive(helper)) continue;

        if (this.getHelperChance(helper.percent).gte(rand)) {
          this.buyMultiplierItem(storeShop, storeData, key, helper, buyMultiplyMult);
        }
      }
    },

    isHelperActive(helper: HelperState): boolean {
      return helper.enabled && helper.count.gt(0);
    },

    buyValueItem(storeShop: ShopStore, key: string, helper: HelperState, buyCountMult: Decimal) {
      const buyResult = buyMax(
        storeShop.points,
        storeShop.list[key as ShopKey].cost.value,
        helper.count.mul(buyCountMult),
      );

      if (buyResult.bought.gt(0)) {
        storeShop.list[key as ShopKey].value = storeShop.list[key as ShopKey].value.plus(
          buyResult.bought.mul(storeShop.list[key as ShopKey].multiply),
        );
        storeShop.points = storeShop.points.minus(buyResult.rest);
      }
    },

    buyMultiplierItem(
      storeShop: ShopStore,
      storeData: DataStore,
      key: string,
      helper: HelperState,
      buyMultiplyMult: Decimal,
    ) {
      const baseKey = key.replace('Multiplier', '') as ShopKey;
      const buyResult = buyMax(
        storeData.epicNumber,
        storeShop.costMultiply(baseKey),
        helper.count.mul(buyMultiplyMult),
      );

      if (buyResult.bought.gt(0)) {
        storeShop.list[baseKey].multiply = storeShop.list[baseKey].multiply.plus(buyResult.bought);
        storeData.epicNumber = storeData.epicNumber.minus(buyResult.rest);
      }
    },

    load(loaded: {
      helpersShop: {
        cpu: Helper;
        hdd: Helper;
        ram: Helper;
        worker: Helper;
        cpuMultiplier: Helper;
        hddMultiplier: Helper;
        ramMultiplier: Helper;
        workerMultiplier: Helper;
      };
    }) {
      const assign = (dst: HelperState, src?: Helper) => {
        dst.count = toDec(src?.count, '0');
        dst.percent = toDec(src?.percent, '0');
        dst.enabled = !!src?.enabled;
      };

      assign(this.helpersShop.cpu, loaded.helpersShop?.cpu);
      assign(this.helpersShop.hdd, loaded.helpersShop?.hdd);
      assign(this.helpersShop.ram, loaded.helpersShop?.ram);
      assign(this.helpersShop.worker, loaded.helpersShop?.worker);
      assign(this.helpersShop.cpuMultiplier, loaded.helpersShop?.cpuMultiplier);
      assign(this.helpersShop.hddMultiplier, loaded.helpersShop?.hddMultiplier);
      assign(this.helpersShop.ramMultiplier, loaded.helpersShop?.ramMultiplier);
      assign(this.helpersShop.workerMultiplier, loaded.helpersShop?.workerMultiplier);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreAutomatic, import.meta.hot));
}
