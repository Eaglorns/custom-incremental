import { defineStore, acceptHMRUpdate } from 'pinia';
import Decimal from 'break_eternity.js';
import CryptoJS from 'crypto-js';
import { LocalStorage } from 'quasar';

const STORAGE_KEY = 'save';
const SECRET = 'incremental';

export const useStoreGame = defineStore('storeGame', {
  state: () => ({
    lastTick: Date.now(),
    epicNumber: new Decimal('1e20'),
    capacity: new Decimal('1e1000'),
    timer: 1000,
    shop: {
      cpu: {
        value: new Decimal(1),
        multiply: new Decimal(1),
        cost: {
          main: new Decimal(50),
          multiply: new Decimal(5),
        },
      },
      hard: {
        value: new Decimal(1),
        multiply: new Decimal(1),
        cost: {
          main: new Decimal(150),
          multiply: new Decimal(12),
        },
      },
      ram: {
        value: new Decimal(1),
        multiply: new Decimal(1),
        cost: {
          main: new Decimal('1e7'),
          multiply: new Decimal(80),
        },
      },
    },
    research: {
      researchingKey: '',
      list: {
        cpuPow: {
          cost: new Decimal(500),
          currentTime: new Decimal(0),
          time: new Decimal(2),
          bonus: new Decimal(0.01),
          level: new Decimal(0),
          costMultiply: new Decimal(5),
          timeMultiply: new Decimal(1.4),
          maxLevel: new Decimal(100),
        },
        hardPow: {
          cost: new Decimal(5000),
          currentTime: new Decimal(0),
          time: new Decimal(2),
          bonus: new Decimal(0.01),
          level: new Decimal(0),
          costMultiply: new Decimal(5),
          timeMultiply: new Decimal(1.4),
          maxLevel: new Decimal(100),
        },
        ramPow: {
          cost: new Decimal('1e6'),
          currentTime: new Decimal(0),
          time: new Decimal(10),
          bonus: new Decimal(0.01),
          level: new Decimal(0),
          costMultiply: new Decimal(10),
          timeMultiply: new Decimal(1.4),
          maxLevel: new Decimal(100),
        },
        costDecrease: {
          cost: new Decimal(1000),
          currentTime: new Decimal(0),
          time: new Decimal(6),
          bonus: new Decimal(2),
          level: new Decimal(0),
          costMultiply: new Decimal(15),
          timeMultiply: new Decimal(2),
          maxLevel: new Decimal(100),
        },
      },
    },
  }),
  getters: {
    formatNumber: () => (num: Decimal) => {
      const n = num.toNumber();
      if (n < 1e6) return num.toFixed(0);
      if (n < 1e9) return num.toExponential(2);
      return num.toExponential(3);
    },
  },
  actions: {
    saveGame() {
      const saveData = {
        epicNumber: this.epicNumber,
        capacity: this.capacity,
        timer: this.timer,
        shop: {
          cpu: {
            value: this.shop.cpu.value,
            multiply: this.shop.cpu.multiply,
          },
          hard: {
            value: this.shop.hard.value,
            multiply: this.shop.hard.multiply,
          },
          ram: {
            value: this.shop.ram.value,
            multiply: this.shop.ram.multiply,
          },
        },
        research: {
          researchingKey: this.research.researchingKey,
          list: {
            cpuPow: {
              currentTime: this.research.list.cpuPow.currentTime,
              level: this.research.list.cpuPow.level,
            },
            hardPow: {
              currentTime: this.research.list.hardPow.currentTime,
              level: this.research.list.hardPow.level,
            },
            ramPow: {
              currentTime: this.research.list.ramPow.currentTime,
              level: this.research.list.ramPow.level,
            },
            costDecrease: {
              currentTime: this.research.list.costDecrease.currentTime,
              level: this.research.list.costDecrease.level,
            },
          },
        },
      };

      const replacer = (key: string, value: unknown) => {
        if (value instanceof Decimal) return { __decimal__: value.toString() };
        return value;
      };
      const plainState = JSON.stringify(saveData, replacer);
      const encrypted = CryptoJS.AES.encrypt(plainState, SECRET).toString();
      LocalStorage.setItem(STORAGE_KEY, encrypted);
    },
    loadGame() {
      const encrypted = LocalStorage.getItem(STORAGE_KEY);
      if (typeof encrypted !== 'string') return;
      try {
        const bytes = CryptoJS.AES.decrypt(encrypted, SECRET);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        const loaded = JSON.parse(decrypted);
        this.epicNumber = new Decimal(loaded.epicNumber);
        this.capacity = new Decimal(loaded.capacity);
        this.timer = loaded.timer;
        this.shop.cpu.value = new Decimal(loaded.shop.cpu.value);
        this.shop.cpu.multiply = new Decimal(loaded.shop.cpu.multiply);
        this.shop.hard.value = new Decimal(loaded.shop.hard.value);
        this.shop.hard.multiply = new Decimal(loaded.shop.hard.multiply);
        this.shop.ram.value = new Decimal(loaded.shop.ram.value);
        this.shop.ram.multiply = new Decimal(loaded.shop.ram.multiply);
        this.research.researchingKey = loaded.research.researchingKey;
        this.research.list.cpuPow.currentTime = new Decimal(
          loaded.research.list.cpuPow.currentTime,
        );
        this.research.list.cpuPow.level = new Decimal(loaded.research.list.cpuPow.level);
        this.research.list.hardPow.currentTime = new Decimal(
          loaded.research.list.hardPow.currentTime,
        );
        this.research.list.hardPow.level = new Decimal(loaded.research.list.hardPow.level);
        this.research.list.ramPow.currentTime = new Decimal(
          loaded.research.list.ramPow.currentTime,
        );
        this.research.list.ramPow.level = new Decimal(loaded.research.list.ramPow.level);
        this.research.list.costDecrease.currentTime = new Decimal(
          loaded.research.list.costDecrease.currentTime,
        );
        this.research.list.costDecrease.level = new Decimal(
          loaded.research.list.costDecrease.level,
        );
      } catch (e) {
        console.error('Ошибка загрузки сохранения:', e);
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreGame, import.meta.hot));
}
