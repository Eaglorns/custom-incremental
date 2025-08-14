import Decimal from 'break_eternity.js';
import { defineStore, acceptHMRUpdate } from 'pinia';
import { useStoreResearch } from 'stores/research';
import { useStoreData } from 'stores/data';
import { useStorePrestige } from 'stores/prestige';

interface ShopItem {
  value: string;
  multiply: string;
  buyModeValue: number;
  buyModeMultiply: number;
  cost: {
    value: string;
    multiply: string;
  };
}

type ShopKey = 'cpu' | 'hdd' | 'ram' | 'worker';

const D0 = new Decimal(0);
const D1 = new Decimal(1);
const D100 = new Decimal(100);

export const useStoreShop = defineStore('storeShop', {
  state: () => ({
    points: new Decimal(0),
    list: {
      cpu: {
        value: new Decimal(1),
        multiply: new Decimal(1),
        buyModeValue: 1,
        buyModeMultiply: 1,
        cost: {
          value: new Decimal(1),
          multiply: new Decimal(10000),
        },
      },
      hdd: {
        value: new Decimal(0),
        multiply: new Decimal(1),
        buyModeValue: 1,
        buyModeMultiply: 1,
        cost: {
          value: new Decimal(15),
          multiply: new Decimal(50000),
        },
      },
      ram: {
        value: new Decimal(0),
        multiply: new Decimal(1),
        buyModeValue: 1,
        buyModeMultiply: 1,
        cost: {
          value: new Decimal(50),
          multiply: new Decimal(170000),
        },
      },
      worker: {
        value: new Decimal(1),
        multiply: new Decimal(1),
        buyModeValue: 1,
        buyModeMultiply: 1,
        cost: {
          value: new Decimal(1000),
          multiply: new Decimal('1e15'),
        },
      },
    },
  }),
  getters: {
    getBuyAmount: (store) => (name: ShopKey, type: 'value' | 'multiply') => {
      const buyMode =
        type === 'value' ? store.list[name].buyModeValue : store.list[name].buyModeMultiply;
      const storePrestige = useStorePrestige();
      const level =
        type === 'value'
          ? storePrestige.upgrades.prestigeBuyValueCount.level
          : storePrestige.upgrades.prestigeBuyValueMultiply.level;
      const max = level.plus(1).floor().max(1);
      switch (buyMode) {
        case 1:
          return D1;
        case 100:
          return max;
        default: {
          const portion = new Decimal(buyMode).div(D100);
          return max.mul(portion).floor().max(1);
        }
      }
    },

    buyMax: () => (points: Decimal, price: Decimal, count: Decimal) => {
      if (!price || price.lte(0) || !points || points.lte(0) || !count || count.lte(0)) {
        return { bought: D0, rest: D0 };
      }
      const maxCanBuy = points.div(price).floor();
      const bought = Decimal.min(count, maxCanBuy);
      const rest = bought.mul(price);
      return { bought, rest };
    },

    costMultiplierDecrease() {
      const cmd = useStoreResearch().base.shopCostMultiplierDecrease;
      const res = cmd.level.gt(0) ? cmd.bonus.mul(cmd.level) : D1;
      return res.gt(0) ? res : D1;
    },

    costMultiply() {
      return (key: ShopKey) => {
        return this.list[key].cost.multiply
          .mul(this.list[key].multiply)
          .div(this.costMultiplierDecrease);
      };
    },

    save(state) {
      return {
        points: state.points,
        list: {
          cpu: {
            value: state.list.cpu.value,
            multiply: state.list.cpu.multiply,
            buyModeValue: state.list.cpu.buyModeValue,
            buyModeMultiply: state.list.cpu.buyModeMultiply,
          },
          hdd: {
            value: state.list.hdd.value,
            multiply: state.list.hdd.multiply,
            buyModeValue: state.list.hdd.buyModeValue,
            buyModeMultiply: state.list.hdd.buyModeMultiply,
          },
          ram: {
            value: state.list.ram.value,
            multiply: state.list.ram.multiply,
            buyModeValue: state.list.ram.buyModeValue,
            buyModeMultiply: state.list.ram.buyModeMultiply,
          },
          worker: {
            value: state.list.worker.value,
            multiply: state.list.worker.multiply,
            buyModeValue: state.list.worker.buyModeValue,
            buyModeMultiply: state.list.worker.buyModeMultiply,
          },
        },
      };
    },
  },
  actions: {
    processGivePoints() {
      const storeResearch = useStoreResearch();
      const parResearchWorker = storeResearch.base.workerPow;
      const exp = parResearchWorker.bonus.mul(parResearchWorker.level).plus(1);
      const give = this.list.worker.value.pow(exp);
      this.points = this.points.add(give);
    },

    onBuyValue(key: ShopKey, amount: Decimal) {
      const buyResult = this.buyMax(this.points, this.list[key].cost.value, amount);
      if (buyResult.bought.gt(0)) {
        this.list[key].value = this.list[key].value.plus(
          buyResult.bought.mul(this.list[key].multiply),
        );
        this.points = this.points.minus(buyResult.rest);
      }
    },

    onBuyMultiply(key: ShopKey, amount: Decimal) {
      const storeData = useStoreData();
      const storeResearch = useStoreResearch();
      const researchMultiplierChance = storeResearch.base.shopMultiplierChanceReturn;
      const buyResult = this.buyMax(storeData.epicNumber, this.costMultiply(key), amount);
      if (buyResult.bought.gt(0)) {
        this.list[key].multiply = this.list[key].multiply.plus(buyResult.bought);
        const chance = Decimal.max(
          0,
          Decimal.min(1, researchMultiplierChance.level.mul(researchMultiplierChance.bonus)),
        );
        if (chance.lt(Math.random())) {
          storeData.epicNumber = storeData.epicNumber.minus(buyResult.rest);
        }
      }
    },

    load(loaded: {
      points?: string | number;
      list: {
        cpu: ShopItem;
        hdd: ShopItem;
        ram: ShopItem;
        worker: ShopItem;
      };
    }) {
      const toDec = (v?: string | number | Decimal, def = '0') => new Decimal(v ?? def);

      this.points = toDec(loaded?.points);
      this.list.cpu.value = toDec(loaded.list.cpu.value);
      this.list.cpu.multiply = toDec(loaded.list.cpu.multiply);
      this.list.cpu.buyModeValue = loaded.list.cpu.buyModeValue ?? this.list.cpu.buyModeValue;
      this.list.cpu.buyModeMultiply =
        loaded.list.cpu.buyModeMultiply ?? this.list.cpu.buyModeMultiply;

      this.list.hdd.value = toDec(loaded.list.hdd.value);
      this.list.hdd.multiply = toDec(loaded.list.hdd.multiply);
      this.list.hdd.buyModeValue = loaded.list.hdd.buyModeValue ?? this.list.hdd.buyModeValue;
      this.list.hdd.buyModeMultiply =
        loaded.list.hdd.buyModeMultiply ?? this.list.hdd.buyModeMultiply;

      this.list.ram.value = toDec(loaded.list.ram.value);
      this.list.ram.multiply = toDec(loaded.list.ram.multiply);
      this.list.ram.buyModeValue = loaded.list.ram.buyModeValue ?? this.list.ram.buyModeValue;
      this.list.ram.buyModeMultiply =
        loaded.list.ram.buyModeMultiply ?? this.list.ram.buyModeMultiply;

      this.list.worker.value = toDec(loaded.list.worker.value);
      this.list.worker.multiply = toDec(loaded.list.worker.multiply);
      this.list.worker.buyModeValue =
        loaded.list.worker.buyModeValue ?? this.list.worker.buyModeValue;
      this.list.worker.buyModeMultiply =
        loaded.list.worker.buyModeMultiply ?? this.list.worker.buyModeMultiply;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreShop, import.meta.hot));
}
