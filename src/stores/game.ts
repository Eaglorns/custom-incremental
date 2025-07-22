import { defineStore, acceptHMRUpdate } from 'pinia';
import Decimal from 'break_eternity.js';
import type { Scientist } from 'src/constants/models';

export const useStoreGame = defineStore('storeGame', {
  state: () => ({
    version: '0.0.0',
    lastTick: Date.now(),
    epicNumber: new Decimal('2500'),
    multiplierEpicNumber: new Decimal(0),
    researchSpeed: new Decimal(0),
    timer: 1000,
    researchPoint: new Decimal(0),
    prestige: new Decimal(0),
    shop: {
      cpu: {
        value: new Decimal(20),
        multiply: new Decimal(1),
        cost: {
          value: new Decimal(100),
          multiply: new Decimal(5),
        },
      },
      hard: {
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
          cost: new Decimal(5000),
          currentTime: new Decimal(0),
          time: new Decimal(3),
          bonus: new Decimal(0.001),
          level: new Decimal(0),
          costMultiply: new Decimal(1.7),
          timeMultiply: new Decimal(1.6),
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
        shopCostMultiplierDecrease: {
          isActive: false,
          cost: new Decimal(1000),
          currentTime: new Decimal(0),
          time: new Decimal(6),
          bonus: new Decimal(1.05),
          level: new Decimal(0),
          costMultiply: new Decimal(3),
          timeMultiply: new Decimal(2),
          maxLevel: new Decimal(100),
        },
        epicNumberMultiplierDecrease: {
          isActive: false,
          cost: new Decimal(20000),
          currentTime: new Decimal(0),
          time: new Decimal(25),
          bonus: new Decimal(1.1),
          level: new Decimal(0),
          costMultiply: new Decimal(5),
          timeMultiply: new Decimal(3),
          maxLevel: new Decimal(1000),
        },
        researchTimeMultiplierDecrease: {
          isActive: false,
          cost: new Decimal(15000),
          currentTime: new Decimal(0),
          time: new Decimal(15),
          bonus: new Decimal(1.1),
          level: new Decimal(0),
          costMultiply: new Decimal(4),
          timeMultiply: new Decimal(2.4),
          maxLevel: new Decimal(1000),
        },
        researchScientistsChance: {
          isActive: false,
          cost: new Decimal(5000),
          currentTime: new Decimal(0),
          time: new Decimal(8),
          bonus: new Decimal(1),
          level: new Decimal(0),
          costMultiply: new Decimal(2),
          timeMultiply: new Decimal(1.6),
          maxLevel: new Decimal(99),
        },
        researchScientistsMultiplierStats: {
          isActive: false,
          cost: new Decimal(2000),
          currentTime: new Decimal(0),
          time: new Decimal(8),
          bonus: new Decimal(0.1),
          level: new Decimal(0),
          costMultiply: new Decimal(1.4),
          timeMultiply: new Decimal(1.6),
          maxLevel: new Decimal(1000),
        },
        researchScientistsMultiplierExperience: {
          isActive: false,
          cost: new Decimal(2000),
          currentTime: new Decimal(0),
          time: new Decimal(8),
          bonus: new Decimal(0.1),
          level: new Decimal(0),
          costMultiply: new Decimal(1.4),
          timeMultiply: new Decimal(1.6),
          maxLevel: new Decimal(1000),
        },
        shopMultiplierChanceReturn: {
          isActive: false,
          cost: new Decimal(500),
          currentTime: new Decimal(0),
          time: new Decimal(8),
          bonus: new Decimal(0.01),
          level: new Decimal(0),
          costMultiply: new Decimal(3.5),
          timeMultiply: new Decimal(4.0),
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
          countMultiply: new Decimal(5),
          percent: new Decimal(2500),
          percentMultiply: new Decimal(150),
        },
      },
      hard: {
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
      hardMultiplier: {
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
    achievements: {
      epicLevel: new Decimal(0),
      cpuLevel: new Decimal(0),
      hardLevel: new Decimal(0),
      ramLevel: new Decimal(0),
    },
    scientists: [] as Scientist[],
  }),
  getters: {
    formatNumber: () => (num: Decimal, fixed?: boolean) => {
      if (num.lt(1e6)) return fixed ? num.toFixed(3) : num.toFixed(0);

      let value = num;
      let tetration = 0;
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
        return Math.abs(mantissa10 - 1) < 1e-6
          ? `e${exp.toFixed(0)}`
          : `${mantissa10.toFixed(3)}e${exp.toFixed(0)}`;
      }
      if (tetration < 10) return `${value.toFixed(4)}[↑↑${tetration + 1}]`;

      let superTetration = 0;
      let t = tetration;
      while (t >= 6) {
        t = Math.log10(t);
        superTetration++;
      }
      return `${t.toFixed(4)}[↑↑↑${superTetration + 1}]`;
    },

    getHelperChance:
      () =>
      (percent: Decimal): Decimal => {
        if (!percent || percent.lte(0)) return new Decimal(1);
        const chance = new Decimal(1).add(
          new Decimal(99).mul(new Decimal(1).minus(Decimal.exp(new Decimal(-0.006).mul(percent)))),
        );
        return chance.gte(100) ? new Decimal(100) : chance;
      },

    getMultiplierEpicNumber: (state): Decimal => {
      const base = state.multiplierEpicNumber;
      if (base.lt(1)) return new Decimal(1);
      const research = state.research.list.epicNumberMultiplierDecrease;
      const bonus = research.level.gt(0) ? research.bonus.pow(research.level) : new Decimal(1);
      const reduced = base.div(new Decimal(100).div(bonus)).log(3);
      return Decimal.max(new Decimal(1), new Decimal(1).add(reduced));
    },

    getResearchSpeed: (state): Decimal => {
      const base = state.researchSpeed;
      if (base.lt(1)) return new Decimal(1);
      const research = state.research.list.researchTimeMultiplierDecrease;
      const bonus = research.level.gt(0) ? research.bonus.pow(research.level) : new Decimal(1);
      const reduced = base.div(new Decimal(100).div(bonus)).log(3);
      return Decimal.max(new Decimal(1), new Decimal(1).add(reduced));
    },

    achievementBonus: (state): Decimal => {
      const { epicLevel, cpuLevel, hardLevel, ramLevel } = state.achievements;
      return epicLevel.plus(cpuLevel).plus(hardLevel).plus(ramLevel).mul(0.01).plus(1);
    },

    prestigeGain: (state): Decimal => {
      if (!state.epicNumber || state.epicNumber.lte(0)) return new Decimal(0);
      return state.epicNumber.log10();
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
        this.processGiveMultiplierEpicNumber();
        this.processGiveResearchSpeed();
        this.processResearch();
        this.processHelpers();
        this.processScientists();
        this.processGiveEpicNumber();
      }
      console.timeEnd('gameTick');
    },

    processResearch() {
      Object.values(this.research.list).forEach((research) => {
        if (research.isActive && research.currentTime.gt(0)) {
          research.currentTime = research.currentTime.minus(1);
          if (research.currentTime.lte(0)) {
            research.level = research.level.plus(1);
            research.isActive = false;
          }
        }
      });
    },

    processHelpers() {
      const rand = Math.random() * 100;
      const valueKeys = ['cpu', 'hard', 'ram'] as const;
      const multiplierKeys = ['cpuMultiplier', 'hardMultiplier', 'ramMultiplier'] as const;

      valueKeys.forEach((key) => {
        const helper = this.helpers[key];
        if (helper.count.gt(0) && this.getHelperChance(helper.percent).gte(rand)) {
          this.shop[key].value = this.shop[key].value.plus(
            helper.count.mul(this.shop[key].multiply),
          );
        }
      });

      multiplierKeys.forEach((key) => {
        const baseKey = key.replace('Multiplier', '') as keyof typeof this.shop;
        const helper = this.helpers[key];
        if (helper.count.gt(0) && this.getHelperChance(helper.percent).gte(rand)) {
          this.shop[baseKey].multiply = this.shop[baseKey].multiply.plus(helper.count);
        }
      });
    },

    processScientists() {
      this.scientists.forEach((s) => {
        if (Math.random() < 0.01) this.randomUpgrade(s);
      });

      const { level, bonus } = this.research.list.researchScientistsMultiplierExperience;
      const expMultiplier = level.gte(1) ? level.mul(bonus).plus(1) : new Decimal(1);

      let totalResearch = new Decimal(0);
      this.scientists.forEach((s) => {
        s.exp = s.exp.add(s.intellect.mul(expMultiplier));
        while (s.exp.gte(this.expToLevel(s.level))) {
          s.exp = s.exp.sub(this.expToLevel(s.level));
          s.level = s.level.add(1);
        }
        totalResearch = totalResearch.add(s.level.mul(s.efficiency.div(100).add(1)));
      });

      this.researchPoint = this.researchPoint.add(totalResearch);
    },

    processGiveEpicNumber() {
      const parShopCPU = this.shop.cpu.value;
      const parResearchCPU = this.research.list.cpuPow;
      const result = parShopCPU
        .pow(parResearchCPU.bonus.mul(parResearchCPU.level).plus(1))
        .mul(this.achievementBonus);
      this.epicNumber = this.epicNumber.plus(result);
    },

    processGiveMultiplierEpicNumber() {
      const parHard = this.shop.hard.value;
      const parResearchHard = this.research.list.hardPow;
      const result = parHard.pow(parResearchHard.bonus.mul(parResearchHard.level).plus(1));
      this.multiplierEpicNumber = this.multiplierEpicNumber.plus(result);
    },

    processGiveResearchSpeed() {
      const parRAM = this.shop.ram.value;
      const parResearchRam = this.research.list.ramPow;
      const result = parRAM.pow(parResearchRam.bonus.mul(parResearchRam.level).plus(1));
      this.researchSpeed = this.researchSpeed.plus(result);
    },

    expToLevel(level: Decimal) {
      return level.pow(2).mul(100).plus(50);
    },

    randomUpgrade(scientist: Scientist) {
      const statsResearch = this.research.list.researchScientistsMultiplierStats;
      const chanceResearch = this.research.list.researchScientistsChance;

      const addNew = statsResearch.level.mul(statsResearch.bonus).plus(1);
      const chance = chanceResearch.level.plus(1).mul(0.01);

      if (chance.gt(Math.random())) {
        const addMax = addNew.mul(2).plus(Math.random() * 9);
        if (Math.random() < 0.5) {
          scientist.intellect = scientist.intellect.add(addMax);
        } else {
          scientist.efficiency = scientist.efficiency.add(addMax);
        }
        return;
      }

      if (Math.random() < 0.2) {
        scientist.intellect = scientist.intellect.add(addNew);
        scientist.efficiency = scientist.efficiency.add(addNew);
      } else if (Math.random() < 0.5) {
        scientist.intellect = scientist.intellect.add(addNew);
      } else {
        scientist.efficiency = scientist.efficiency.add(addNew);
      }
    },

    onPrestige() {
      this.prestige = this.prestige.add(this.prestigeGain);
      this.epicNumber = new Decimal(1);
      this.shop.cpu.value = new Decimal(1);
      this.shop.cpu.multiply = new Decimal(1);
      this.shop.hard.value = new Decimal(1);
      this.shop.hard.multiply = new Decimal(1);
      this.shop.ram.value = new Decimal(1);
      this.shop.ram.multiply = new Decimal(1);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreGame, import.meta.hot));
}
