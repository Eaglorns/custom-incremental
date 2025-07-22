import Decimal from 'break_eternity.js';
import { defineStore, acceptHMRUpdate } from 'pinia';

interface ShopItem {
  value: string;
  multiply: string;
  cost: {
    value: string;
    multiply: string;
  };
}

export const useStoreShop = defineStore('storeShop', {
  state: () => ({
    list: {
      cpu: {
        value: new Decimal(20),
        multiply: new Decimal(1),
        cost: {
          value: new Decimal(100),
          multiply: new Decimal(5),
        },
      },
      hdd: {
        value: new Decimal(0),
        multiply: new Decimal(1),
        cost: {
          value: new Decimal(3000),
          multiply: new Decimal(5),
        },
      },
      ram: {
        value: new Decimal(0),
        multiply: new Decimal(1),
        cost: {
          value: new Decimal(1000000),
          multiply: new Decimal(30),
        },
      },
    },
  }),
  getters: {
    save(state) {
      return {
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
    load(loaded: {
      list: {
        cpu: ShopItem;
        hdd: ShopItem;
        ram: ShopItem;
      };
    }) {
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
