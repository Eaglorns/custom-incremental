import Decimal from 'break_eternity.js';
import { defineStore, acceptHMRUpdate } from 'pinia';
import { useStoreResearch } from 'stores/research';
import { useStoreData } from 'stores/data';

interface ShopItem {
  value: string;
  multiply: string;
  cost: {
    value: string;
    multiply: string;
  };
}

type ShopKey = 'cpu' | 'hdd' | 'ram';

export const useStoreShop = defineStore('storeShop', {
  state: () => ({
    points: new Decimal(0),
    list: {
      cpu: {
        value: new Decimal(1),
        multiply: new Decimal(1),
        cost: {
          value: new Decimal(1),
          multiply: new Decimal(10000),
        },
      },
      hdd: {
        value: new Decimal(0),
        multiply: new Decimal(1),
        cost: {
          value: new Decimal(15),
          multiply: new Decimal(50000),
        },
      },
      ram: {
        value: new Decimal(0),
        multiply: new Decimal(1),
        cost: {
          value: new Decimal(250),
          multiply: new Decimal(1000000),
        },
      },
    },
  }),
  getters: {
    costMultiplierDecrease() {
      const costMultiplierDecrease = useStoreResearch().list.shopCostMultiplierDecrease;
      return costMultiplierDecrease.level.gt(0)
        ? costMultiplierDecrease.bonus.mul(costMultiplierDecrease.level)
        : new Decimal(1);
    },

    costMultiply() {
      return (key: ShopKey) => {
        return this.list[key].cost.multiply
          .mul(this.list[key].multiply)
          .div(this.costMultiplierDecrease);
      };
    },

    canBuyValue: (state) => (key: ShopKey) => {
      return state.points.gte(state.list[key].cost.value);
    },

    canBuyMultiply() {
      return (key: ShopKey) => {
        const storeData = useStoreData();
        return storeData.epicNumber.gte(this.costMultiply(key));
      };
    },

    save(state) {
      return {
        points: state.points,
        list: {
          cpu: {
            value: state.list.cpu.value,
            multiply: state.list.cpu.multiply,
            cost: {
              value: state.list.cpu.cost.value,
              multiply: state.list.cpu.cost.multiply,
            },
          },
          hdd: {
            value: state.list.hdd.value,
            multiply: state.list.hdd.multiply,
            cost: {
              value: state.list.hdd.cost.value,
              multiply: state.list.hdd.cost.multiply,
            },
          },
          ram: {
            value: state.list.ram.value,
            multiply: state.list.ram.multiply,
            cost: {
              value: state.list.ram.cost.value,
              multiply: state.list.ram.cost.multiply,
            },
          },
        },
      };
    },
  },
  actions: {
    processGivePoints() {
      this.points = this.points.add(1);
    },

    onBuyValue(key: ShopKey) {
      const canBuyValue = this.points.gte(this.list[key].cost.value);
      if (!canBuyValue) return;
      this.points = this.points.minus(this.list[key].cost.value);
      this.list[key].value = this.list[key].value.plus(this.list[key].multiply);
    },

    onBuyMultiply(key: ShopKey) {
      const storeData = useStoreData();
      const storeResearch = useStoreResearch();
      const canBuyMultiply = storeData.epicNumber.gte(this.list[key].cost.multiply);
      if (!canBuyMultiply) return;
      const researchMultiplierChance = storeResearch.list.shopMultiplierChanceReturn;
      if (researchMultiplierChance.level.mul(researchMultiplierChance.bonus).lt(Math.random()))
        storeData.epicNumber = storeData.epicNumber.minus(this.costMultiply(key));
      this.list[key].multiply = this.list[key].multiply.plus(1);
    },

    load(loaded: {
      points: string;
      list: {
        cpu: ShopItem;
        hdd: ShopItem;
        ram: ShopItem;
      };
    }) {
      this.points = new Decimal(loaded.points);
      this.list.cpu.value = new Decimal(loaded.list.cpu.value);
      this.list.cpu.multiply = new Decimal(loaded.list.cpu.multiply);
      this.list.hdd.value = new Decimal(loaded.list.hdd.value);
      this.list.hdd.multiply = new Decimal(loaded.list.hdd.multiply);
      this.list.ram.value = new Decimal(loaded.list.ram.value);
      this.list.ram.multiply = new Decimal(loaded.list.ram.multiply);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreShop, import.meta.hot));
}
