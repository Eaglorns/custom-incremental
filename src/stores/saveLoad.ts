import { defineStore, acceptHMRUpdate } from 'pinia';
import CryptoJS from 'crypto-js';
import { LocalStorage } from 'quasar';
import { useStoreGame } from 'stores/game';
import Decimal from 'break_eternity.js';
import type { Scientist } from 'src/constants/models';

const STORAGE_KEY = 'save';
const SECRET = 'incremental';

export const useStoreSaveLoad = defineStore('saveLoadGlobal', {
  state: () => ({}),
  getters: {},
  actions: {
    saveGame() {
      const storeGame = useStoreGame();
      const saveData = {
        epicNumber: storeGame.epicNumber,
        multiplierEpicNumber: storeGame.multiplierEpicNumber,
        researchSpeed: storeGame.researchSpeed,
        timer: storeGame.timer,
        researchPoint: storeGame.researchPoint,
        prestige: storeGame.prestige,
        shop: {
          cpu: {
            value: storeGame.shop.cpu.value,
            multiply: storeGame.shop.cpu.multiply,
          },
          hard: {
            value: storeGame.shop.hard.value,
            multiply: storeGame.shop.hard.multiply,
          },
          ram: {
            value: storeGame.shop.ram.value,
            multiply: storeGame.shop.ram.multiply,
          },
        },
        scientists: storeGame.scientists.map((s) => ({
          id: s.id,
          level: s.level,
          exp: s.exp,
          intellect: s.intellect,
          efficiency: s.efficiency,
        })),
        helpers: {
          cpu: {
            count: storeGame.helpers.cpu.count,
            percent: storeGame.helpers.cpu.percent,
          },
          hard: {
            count: storeGame.helpers.hard.count,
            percent: storeGame.helpers.hard.percent,
          },
          ram: {
            count: storeGame.helpers.ram.count,
            percent: storeGame.helpers.ram.percent,
          },
          cpuMultiplier: {
            count: storeGame.helpers.cpuMultiplier.count,
            percent: storeGame.helpers.cpuMultiplier.percent,
          },
          hardMultiplier: {
            count: storeGame.helpers.hardMultiplier.count,
            percent: storeGame.helpers.hardMultiplier.percent,
          },
          ramMultiplier: {
            count: storeGame.helpers.ramMultiplier.count,
            percent: storeGame.helpers.ramMultiplier.percent,
          },
        },
        achievements: {
          epicLevel: storeGame.achievements.epicLevel,
          cpuLevel: storeGame.achievements.cpuLevel,
          hardLevel: storeGame.achievements.hardLevel,
          ramLevel: storeGame.achievements.ramLevel,
        },
        research: {
          list: {
            cpuPow: {
              isActive: storeGame.research.list.cpuPow.isActive,
              currentTime: storeGame.research.list.cpuPow.currentTime,
              level: storeGame.research.list.cpuPow.level,
            },
            hardPow: {
              isActive: storeGame.research.list.hardPow.isActive,
              currentTime: storeGame.research.list.hardPow.currentTime,
              level: storeGame.research.list.hardPow.level,
            },
            ramPow: {
              isActive: storeGame.research.list.ramPow.isActive,
              currentTime: storeGame.research.list.ramPow.currentTime,
              level: storeGame.research.list.ramPow.level,
            },
            shopCostMultiplierDecrease: {
              isActive: storeGame.research.list.shopCostMultiplierDecrease.isActive,
              currentTime: storeGame.research.list.shopCostMultiplierDecrease.currentTime,
              level: storeGame.research.list.shopCostMultiplierDecrease.level,
            },
            epicNumberMultiplierDecrease: {
              isActive: storeGame.research.list.epicNumberMultiplierDecrease.isActive,
              currentTime: storeGame.research.list.epicNumberMultiplierDecrease.currentTime,
              level: storeGame.research.list.epicNumberMultiplierDecrease.level,
            },
            researchTimeMultiplierDecrease: {
              isActive: storeGame.research.list.researchTimeMultiplierDecrease.isActive,
              currentTime: storeGame.research.list.researchTimeMultiplierDecrease.currentTime,
              level: storeGame.research.list.researchTimeMultiplierDecrease.level,
            },
            researchScientistsChance: {
              isActive: storeGame.research.list.researchScientistsChance.isActive,
              currentTime: storeGame.research.list.researchScientistsChance.currentTime,
              level: storeGame.research.list.researchScientistsChance.level,
            },
            researchScientistsMultiplierStats: {
              isActive: storeGame.research.list.researchScientistsMultiplierStats.isActive,
              currentTime: storeGame.research.list.researchScientistsMultiplierStats.currentTime,
              level: storeGame.research.list.researchScientistsMultiplierStats.level,
            },
            researchScientistsMultiplierExperience: {
              isActive: storeGame.research.list.researchScientistsMultiplierExperience.isActive,
              currentTime:
                storeGame.research.list.researchScientistsMultiplierExperience.currentTime,
              level: storeGame.research.list.researchScientistsMultiplierExperience.level,
            },
            shopMultiplierChanceReturn: {
              isActive: storeGame.research.list.shopMultiplierChanceReturn.isActive,
              currentTime: storeGame.research.list.shopMultiplierChanceReturn.currentTime,
              level: storeGame.research.list.shopMultiplierChanceReturn.level,
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
      const storeGame = useStoreGame();
      const encrypted = LocalStorage.getItem(STORAGE_KEY);
      if (typeof encrypted !== 'string') return;
      try {
        const bytes = CryptoJS.AES.decrypt(encrypted, SECRET);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        const loaded = JSON.parse(decrypted);
        storeGame.epicNumber = new Decimal(loaded.epicNumber);
        storeGame.multiplierEpicNumber = new Decimal(loaded.multiplierEpicNumber);
        storeGame.researchSpeed = new Decimal(loaded.researchSpeed);
        storeGame.timer = loaded.timer;
        storeGame.researchPoint = new Decimal(loaded.researchPoint);
        storeGame.prestige = new Decimal(loaded.prestige);
        storeGame.shop.cpu.value = new Decimal(loaded.shop.cpu.value);
        storeGame.shop.cpu.multiply = new Decimal(loaded.shop.cpu.multiply);
        storeGame.shop.hard.value = new Decimal(loaded.shop.hard.value);
        storeGame.shop.hard.multiply = new Decimal(loaded.shop.hard.multiply);
        storeGame.shop.ram.value = new Decimal(loaded.shop.ram.value);
        storeGame.shop.ram.multiply = new Decimal(loaded.shop.ram.multiply);
        storeGame.scientists = loaded.scientists.map((s: Scientist) => ({
          id: s.id,
          level: new Decimal(s.level),
          exp: new Decimal(s.exp),
          intellect: new Decimal(s.intellect),
          efficiency: new Decimal(s.efficiency),
        }));
        storeGame.helpers.cpu.count = new Decimal(loaded.helpers.cpu.count);
        storeGame.helpers.cpu.percent = new Decimal(loaded.helpers.cpu.percent);
        storeGame.helpers.hard.count = new Decimal(loaded.helpers.hard.count);
        storeGame.helpers.hard.percent = new Decimal(loaded.helpers.hard.percent);
        storeGame.helpers.ram.count = new Decimal(loaded.helpers.ram.count);
        storeGame.helpers.ram.percent = new Decimal(loaded.helpers.ram.percent);
        storeGame.helpers.cpuMultiplier.count = new Decimal(loaded.helpers.cpuMultiplier.count);
        storeGame.helpers.cpuMultiplier.percent = new Decimal(loaded.helpers.cpuMultiplier.percent);
        storeGame.helpers.hardMultiplier.count = new Decimal(loaded.helpers.hardMultiplier.count);
        storeGame.helpers.hardMultiplier.percent = new Decimal(
          loaded.helpers.hardMultiplier.percent,
        );
        storeGame.helpers.ramMultiplier.count = new Decimal(loaded.helpers.ramMultiplier.count);
        storeGame.helpers.ramMultiplier.percent = new Decimal(loaded.helpers.ramMultiplier.percent);
        storeGame.achievements.epicLevel = new Decimal(loaded.achievements.epicLevel);
        storeGame.achievements.cpuLevel = new Decimal(loaded.achievements.cpuLevel);
        storeGame.achievements.hardLevel = new Decimal(loaded.achievements.hardLevel);
        storeGame.achievements.ramLevel = new Decimal(loaded.achievements.ramLevel);
        storeGame.research.list.cpuPow.isActive = loaded.research.list.cpuPow.isActive;
        storeGame.research.list.cpuPow.currentTime = new Decimal(
          loaded.research.list.cpuPow.currentTime,
        );
        storeGame.research.list.cpuPow.level = new Decimal(loaded.research.list.cpuPow.level);
        storeGame.research.list.hardPow.isActive = loaded.research.list.hardPow.isActive;
        storeGame.research.list.hardPow.currentTime = new Decimal(
          loaded.research.list.hardPow.currentTime,
        );
        storeGame.research.list.hardPow.level = new Decimal(loaded.research.list.hardPow.level);
        storeGame.research.list.ramPow.isActive = loaded.research.list.ramPow.isActive;
        storeGame.research.list.ramPow.currentTime = new Decimal(
          loaded.research.list.ramPow.currentTime,
        );
        storeGame.research.list.ramPow.level = new Decimal(loaded.research.list.ramPow.level);
        storeGame.research.list.shopCostMultiplierDecrease.isActive =
          loaded.research.list.shopCostMultiplierDecrease.isActive;
        storeGame.research.list.shopCostMultiplierDecrease.currentTime = new Decimal(
          loaded.research.list.shopCostMultiplierDecrease.currentTime,
        );
        storeGame.research.list.shopCostMultiplierDecrease.level = new Decimal(
          loaded.research.list.shopCostMultiplierDecrease.level,
        );
        storeGame.research.list.epicNumberMultiplierDecrease.currentTime = new Decimal(
          loaded.research.list.epicNumberMultiplierDecrease.currentTime,
        );
        storeGame.research.list.epicNumberMultiplierDecrease.isActive =
          loaded.research.list.epicNumberMultiplierDecrease.isActive;
        storeGame.research.list.epicNumberMultiplierDecrease.level = new Decimal(
          loaded.research.list.epicNumberMultiplierDecrease.level,
        );
        storeGame.research.list.researchTimeMultiplierDecrease.isActive =
          loaded.research.list.researchTimeMultiplierDecrease.isActive;
        storeGame.research.list.researchTimeMultiplierDecrease.currentTime = new Decimal(
          loaded.research.list.researchTimeMultiplierDecrease.currentTime,
        );
        storeGame.research.list.researchTimeMultiplierDecrease.level = new Decimal(
          loaded.research.list.researchTimeMultiplierDecrease.level,
        );
        storeGame.research.list.researchScientistsChance.isActive =
          loaded.research.list.researchScientistsChance.isActive;
        storeGame.research.list.researchScientistsChance.currentTime = new Decimal(
          loaded.research.list.researchScientistsChance.currentTime,
        );
        storeGame.research.list.researchScientistsChance.level = new Decimal(
          loaded.research.list.researchScientistsChance.level,
        );
        storeGame.research.list.researchScientistsMultiplierStats.isActive =
          loaded.research.list.researchScientistsMultiplierStats.isActive;
        storeGame.research.list.researchScientistsMultiplierStats.currentTime = new Decimal(
          loaded.research.list.researchScientistsMultiplierStats.currentTime,
        );
        storeGame.research.list.researchScientistsMultiplierStats.level = new Decimal(
          loaded.research.list.researchScientistsMultiplierStats.level,
        );
        storeGame.research.list.researchScientistsMultiplierExperience.isActive =
          loaded.research.list.researchScientistsMultiplierExperience.isActive;
        storeGame.research.list.researchScientistsMultiplierExperience.currentTime = new Decimal(
          loaded.research.list.researchScientistsMultiplierExperience.currentTime,
        );
        storeGame.research.list.researchScientistsMultiplierExperience.level = new Decimal(
          loaded.research.list.researchScientistsMultiplierExperience.level,
        );
        storeGame.research.list.shopMultiplierChanceReturn.isActive =
          loaded.research.list.shopMultiplierChanceReturn.isActive;
        storeGame.research.list.shopMultiplierChanceReturn.currentTime = new Decimal(
          loaded.research.list.shopMultiplierChanceReturn.currentTime,
        );
        storeGame.research.list.shopMultiplierChanceReturn.level = new Decimal(
          loaded.research.list.shopMultiplierChanceReturn.level,
        );
      } catch (e) {
        console.error('Ошибка загрузки сохранения:', e);
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreSaveLoad, import.meta.hot));
}
