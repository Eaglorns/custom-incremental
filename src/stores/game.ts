import { defineStore, acceptHMRUpdate } from 'pinia';
import Decimal from 'break_eternity.js';
import CryptoJS from 'crypto-js';
import { LocalStorage } from 'quasar';
import type { Scientist } from 'src/constants/models';

const STORAGE_KEY = 'save';
const SECRET = 'incremental';

export const useStoreGame = defineStore('storeGame', {
  state: () => ({
    lastTick: Date.now(),
    epicNumber: new Decimal(0),
    multiplierEpicNumber: new Decimal(0),
    researchSpeed: new Decimal(0),
    timer: 1000,
    achievementBonus: new Decimal(1),
    researchPoints: new Decimal(0),
    shop: {
      cpu: {
        value: new Decimal(1),
        multiply: new Decimal(1),
        cost: {
          value: new Decimal(50),
          multiply: new Decimal(5),
        },
      },
      hard: {
        value: new Decimal(1),
        multiply: new Decimal(1),
        cost: {
          value: new Decimal(50),
          multiply: new Decimal(5),
        },
      },
      ram: {
        value: new Decimal(1),
        multiply: new Decimal(1),
        cost: {
          value: new Decimal(1000000),
          multiply: new Decimal(30),
        },
      },
    },
    research: {
      list: {
        cpuPow: {
          isActive: false,
          cost: new Decimal(1000),
          currentTime: new Decimal(0),
          time: new Decimal(2),
          bonus: new Decimal(0.001),
          level: new Decimal(0),
          costMultiply: new Decimal(1.5),
          timeMultiply: new Decimal(1.3),
          maxLevel: new Decimal(1000),
        },
        hardPow: {
          isActive: false,
          cost: new Decimal(1000),
          currentTime: new Decimal(0),
          time: new Decimal(2),
          bonus: new Decimal(0.001),
          level: new Decimal(0),
          costMultiply: new Decimal(1.4),
          timeMultiply: new Decimal(1.3),
          maxLevel: new Decimal(1000),
        },
        ramPow: {
          isActive: false,
          cost: new Decimal(1000000),
          currentTime: new Decimal(0),
          time: new Decimal(4),
          bonus: new Decimal(0.001),
          level: new Decimal(0),
          costMultiply: new Decimal(1.6),
          timeMultiply: new Decimal(1.3),
          maxLevel: new Decimal(1000),
        },
        costDecrease: {
          isActive: false,
          cost: new Decimal(1000),
          currentTime: new Decimal(0),
          time: new Decimal(6),
          bonus: new Decimal(1.05),
          level: new Decimal(0),
          costMultiply: new Decimal(100),
          timeMultiply: new Decimal(2),
          maxLevel: new Decimal(100),
        },
      },
    },
    helpers: {
      cpu: {
        count: new Decimal(0),
        percent: new Decimal(0),
        cost: {
          count: new Decimal(1000),
          countMultiply: new Decimal(10),
          percent: new Decimal(2500),
          percentMultiply: new Decimal(1000),
        },
      },
      hard: {
        count: new Decimal(0),
        percent: new Decimal(0),
        cost: {
          count: new Decimal(1000),
          countMultiply: new Decimal(10),
          percent: new Decimal(2500),
          percentMultiply: new Decimal(1000),
        },
      },
      ram: {
        count: new Decimal(0),
        percent: new Decimal(0),
        cost: {
          count: new Decimal(1000),
          countMultiply: new Decimal(10),
          percent: new Decimal(2500),
          percentMultiply: new Decimal(1000),
        },
      },
    },
    achievements: {
      epicLevel: new Decimal(0),
      cpuLevel: new Decimal(0),
      hardLevel: new Decimal(0),
      ramLevel: new Decimal(0),
    },
    scientists: [] as Scientist[],
  }),
  getters: {
    formatNumber: () => (num: Decimal) => {
      if (num.lt(1e6)) {
        if (num.gte(1e9)) return num.div(1e9).toFixed(2) + 'B';
        if (num.gte(1e6)) return num.div(1e6).toFixed(2) + 'M';
        if (num.gte(1e3)) return num.div(1e3).toFixed(2) + 'K';
        return num.toFixed(0);
      }
      let value = num,
        tetration = 0;
      while (value.gte(1e6)) {
        value = value.log10();
        tetration++;
      }
      if (tetration === 0) {
        const exp = num.log10().floor();
        return `${num.div(Decimal.pow(10, exp)).toFixed(3)}e${exp.toFixed(0)}`;
      }
      if (tetration === 1) {
        const exp = value.floor();
        const mantissa10 = Math.pow(10, num.log10().minus(exp).toNumber());
        if (Math.abs(mantissa10 - 1) < 1e-6) return `e${exp.toFixed(0)}`;
        return `${mantissa10.toFixed(3)}e${exp.toFixed(0)}`;
      }
      if (tetration < 10) return `${value.toFixed(4)}[↑↑${tetration + 1}]`;
      let superTetration = 0,
        t = tetration;
      while (t >= 6) {
        t = Math.log10(t);
        superTetration++;
      }
      return `${t.toFixed(4)}[↑↑↑${superTetration + 1}]`;
    },
    getHelperChance:
      () =>
      (percent: Decimal): Decimal => {
        const k = 0.006;
        const one = new Decimal(1);
        const ninetyNine = new Decimal(99);
        if (!percent || percent.lte(0)) return one;
        const expPart = Decimal.exp(new Decimal(-k).mul(percent));
        const chance = one.add(ninetyNine.mul(one.minus(expPart)));
        return chance.gte(100) ? new Decimal(100) : chance;
      },
    giveEpicNumber: (state): Decimal => {
      const parShopCPU = state.shop.cpu.value;
      const parResearchCPU = state.research.list.cpuPow;
      return parShopCPU.pow(parResearchCPU.bonus.mul(parResearchCPU.level).plus(1));
    },
    giveMultiplierEpicNumber: (state): Decimal => {
      const parHard = state.shop.ram.value;
      const parResearchHard = state.research.list.hardPow;
      return parHard.pow(parResearchHard.bonus.mul(parResearchHard.level).plus(1));
    },
    giveResearchSpeed: (state): Decimal => {
      const parRAM = state.shop.ram.value;
      const parResearchRam = state.research.list.ramPow;
      return parRAM.pow(parResearchRam.bonus.mul(parResearchRam.level).plus(1));
    },
  },
  actions: {
    gameTick() {
      console.time('gameTick');
      const now = Date.now();
      const delta = now - this.lastTick;
      this.lastTick = now;

      const steps = Math.floor(delta / this.timer) || 1;
      for (let i = 0; i < steps; i++) {
        this.processResearch();
        this.processHelpers();
        this.processScientists();
        this.epicNumber = this.epicNumber.plus(this.giveEpicNumber);
        this.multiplierEpicNumber = this.multiplierEpicNumber.plus(this.giveMultiplierEpicNumber);
        this.researchSpeed = this.researchSpeed.plus(this.giveResearchSpeed);
      }
      console.timeEnd('gameTick');
    },

    processResearch() {
      const researchList = this.research.list;
      Object.values(researchList).forEach((research) => {
        if (research.isActive && research.currentTime.gt(0)) {
          research.currentTime = research.currentTime.minus(1);
          if (research.currentTime.lte(0)) {
            research.level = research.level.plus(1);
            research.isActive = false;
          }
        }
      });
    },

    processHelperType(count: Decimal, cost: Decimal, key: keyof typeof this.shop) {
      if (count.lte(0)) return;
      const maxBuy = Decimal.min(count, this.epicNumber.div(cost).floor());
      if (maxBuy.lte(0)) return;
      this.shop[key].value = this.shop[key].value.plus(maxBuy);
      this.epicNumber = this.epicNumber.minus(maxBuy.mul(cost));
    },

    processHelpers() {
      const helpers = this.helpers;
      const rand = Math.random() * 100;
      if (helpers.cpu.count.gt(0) && this.getHelperChance(helpers.cpu.percent).gte(rand)) {
        this.processHelperType(
          helpers.cpu.count.mul(this.shop.cpu.multiply),
          this.shop.cpu.cost.value,
          'cpu',
        );
      }
      if (helpers.hard.count.gt(0) && this.getHelperChance(helpers.hard.percent).gte(rand)) {
        this.processHelperType(
          helpers.hard.count.mul(this.shop.hard.multiply),
          this.shop.hard.cost.value,
          'hard',
        );
      }
      if (helpers.ram.count.gt(0) && this.getHelperChance(helpers.ram.percent).gte(rand)) {
        this.processHelperType(
          helpers.ram.count.mul(this.shop.ram.multiply),
          this.shop.ram.cost.value,
          'ram',
        );
      }
    },
    processScientists() {
      this.scientists.forEach((s) => {
        if (Math.random() < 0.01) {
          this.randomUpgrade(s);
        }
      });
      let totalResearch = new Decimal(0);
      this.scientists.forEach((s) => {
        s.exp = s.exp.add(s.intellect);
        if (s.exp.gte(this.expToLevel(s.level))) {
          s.exp = s.exp.sub(this.expToLevel(s.level));
          s.level = s.level.add(1);
        }
        totalResearch = totalResearch.add(s.level.mul(s.efficiency.div(100).add(1)));
      });
      this.researchPoints = this.researchPoints.add(totalResearch);
    },
    expToLevel(level: Decimal) {
      return level.pow(2).mul(100).plus(50);
    },
    randomUpgrade(scientist: Scientist) {
      const roll = Math.random();
      if (roll < 0.1) {
        if (Math.random() < 0.5) {
          scientist.intellect = scientist.intellect.add(Math.floor(2 + Math.random() * 9));
        } else {
          scientist.efficiency = scientist.efficiency.add(Math.floor(2 + Math.random() * 9));
        }
      } else if (roll < 0.2) {
        scientist.intellect = scientist.intellect.add(1);
        scientist.efficiency = scientist.efficiency.add(1);
      } else if (Math.random() < 0.5) {
        scientist.intellect = scientist.intellect.add(1);
      } else {
        scientist.efficiency = scientist.efficiency.add(1);
      }
    },
    saveGame() {
      const saveData = {
        epicNumber: this.epicNumber,
        multiplierEpicNumber: this.multiplierEpicNumber,
        researchSpeed: this.researchSpeed,
        timer: this.timer,
        achievementProductionBonus: this.achievementBonus,
        researchPoints: this.researchPoints,
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
          list: {
            cpuPow: {
              isActive: this.research.list.cpuPow.isActive,
              currentTime: this.research.list.cpuPow.currentTime,
              level: this.research.list.cpuPow.level,
            },
            hardPow: {
              isActive: this.research.list.hardPow.isActive,
              currentTime: this.research.list.hardPow.currentTime,
              level: this.research.list.hardPow.level,
            },
            ramPow: {
              isActive: this.research.list.ramPow.isActive,
              currentTime: this.research.list.ramPow.currentTime,
              level: this.research.list.ramPow.level,
            },
            costDecrease: {
              isActive: this.research.list.costDecrease.isActive,
              currentTime: this.research.list.costDecrease.currentTime,
              level: this.research.list.costDecrease.level,
            },
          },
        },
        helpers: {
          cpu: {
            count: this.helpers.cpu.count,
            percent: this.helpers.cpu.percent,
          },
          hard: {
            count: this.helpers.hard.count,
            percent: this.helpers.hard.percent,
          },
          ram: {
            count: this.helpers.ram.count,
            percent: this.helpers.ram.percent,
          },
        },
        achievements: {
          epicLevel: this.achievements.epicLevel,
          cpuLevel: this.achievements.cpuLevel,
          hardLevel: this.achievements.hardLevel,
          ramLevel: this.achievements.ramLevel,
        },
        scientists: this.scientists.map((s) => ({
          id: s.id,
          level: s.level,
          exp: s.exp,
          intellect: s.intellect,
          efficiency: s.efficiency,
        })),
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
        this.multiplierEpicNumber = new Decimal(loaded.multiplierEpicNumber);
        this.researchSpeed = new Decimal(loaded.researchSpeed);
        this.timer = loaded.timer;
        this.achievementBonus = new Decimal(loaded.achievementBonus);
        this.researchPoints = new Decimal(loaded.researchPoints);
        this.shop.cpu.value = new Decimal(loaded.shop.cpu.value);
        this.shop.cpu.multiply = new Decimal(loaded.shop.cpu.multiply);
        this.shop.hard.value = new Decimal(loaded.shop.hard.value);
        this.shop.hard.multiply = new Decimal(loaded.shop.hard.multiply);
        this.shop.ram.value = new Decimal(loaded.shop.ram.value);
        this.shop.ram.multiply = new Decimal(loaded.shop.ram.multiply);
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
        this.helpers.cpu.count = new Decimal(loaded.helpers.cpu.count);
        this.helpers.cpu.percent = new Decimal(loaded.helpers.cpu.percent);
        this.helpers.hard.count = new Decimal(loaded.helpers.hard.count);
        this.helpers.hard.percent = new Decimal(loaded.helpers.hard.percent);
        this.helpers.ram.count = new Decimal(loaded.helpers.ram.count);
        this.helpers.ram.percent = new Decimal(loaded.helpers.ram.percent);
        this.achievements.epicLevel = new Decimal(loaded.achievements.epicLevel);
        this.achievements.cpuLevel = new Decimal(loaded.achievements.cpuLevel);
        this.achievements.hardLevel = new Decimal(loaded.achievements.hardLevel);
        this.achievements.ramLevel = new Decimal(loaded.achievements.ramLevel);
        this.research.list.cpuPow.isActive = loaded.research.list.cpuPow.isActive;
        this.research.list.hardPow.isActive = loaded.research.list.hardPow.isActive;
        this.research.list.ramPow.isActive = loaded.research.list.ramPow.isActive;
        this.research.list.costDecrease.isActive = loaded.research.list.costDecrease.isActive;
        this.scientists = loaded.scientists.map((s: Scientist) => ({
          id: s.id,
          level: new Decimal(s.level),
          exp: new Decimal(s.exp),
          intellect: new Decimal(s.intellect),
          efficiency: new Decimal(s.efficiency),
        }));
      } catch (e) {
        console.error('Ошибка загрузки сохранения:', e);
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreGame, import.meta.hot));
}
