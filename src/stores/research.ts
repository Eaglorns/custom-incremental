import { defineStore, acceptHMRUpdate } from 'pinia';
import Decimal from 'break_eternity.js';
import type { ResearchScientist } from 'src/constants/models';
import { useStoreShop } from 'stores/shop';

interface ResearchList {
  isActive: boolean;
  currentTime: string;
  level: string;
}

interface ResearchLoadData {
  points: string;
  speed: string;
  scientists: {
    id: string;
    level: string;
    exp: string;
    intellect: string;
    efficiency: string;
  }[];
  base: {
    cpuPow: ResearchList;
    hddPow: ResearchList;
    ramPow: ResearchList;
    workerPow: ResearchList;
    shopCostMultiplierDecrease: ResearchList;
    epicNumberMultiplierDecrease: ResearchList;
    researchTimeMultiplierDecrease: ResearchList;
    researchScientistsChance: ResearchList;
    researchScientistsMultiplierStats: ResearchList;
    researchScientistsMultiplierExperience: ResearchList;
    shopMultiplierChanceReturn: ResearchList;
  };
}

const D0 = new Decimal(0);
const D1 = new Decimal(1);
const D1_1 = new Decimal(1.1);
const D350 = new Decimal(350);
const D100 = new Decimal(100);
const D50 = new Decimal(50);

export const useStoreResearch = defineStore('storeResearch', {
  state: () => ({
    points: new Decimal(0),
    speed: new Decimal(0),
    scientists: [] as ResearchScientist[],
    base: {
      cpuPow: {
        isActive: false,
        cost: new Decimal(1000),
        currentTime: new Decimal(0),
        time: new Decimal(5),
        bonus: new Decimal(0.001),
        level: new Decimal(0),
        costMultiply: new Decimal(1.5),
        timeMultiply: new Decimal(1.2),
        maxLevel: new Decimal(1000),
      },
      hddPow: {
        isActive: false,
        cost: new Decimal(5000),
        currentTime: new Decimal(0),
        time: new Decimal(6),
        bonus: new Decimal(0.001),
        level: new Decimal(0),
        costMultiply: new Decimal(1.7),
        timeMultiply: new Decimal(1.21),
        maxLevel: new Decimal(1000),
      },
      ramPow: {
        isActive: false,
        cost: new Decimal(1000000),
        currentTime: new Decimal(0),
        time: new Decimal(8),
        bonus: new Decimal(0.001),
        level: new Decimal(0),
        costMultiply: new Decimal(1.6),
        timeMultiply: new Decimal(1.23),
        maxLevel: new Decimal(1000),
      },
      workerPow: {
        isActive: false,
        cost: new Decimal('1e10'),
        currentTime: new Decimal(0),
        time: new Decimal(15),
        bonus: new Decimal(0.001),
        level: new Decimal(0),
        costMultiply: new Decimal(1.8),
        timeMultiply: new Decimal(1.3),
        maxLevel: new Decimal(10000),
      },
      shopCostMultiplierDecrease: {
        isActive: false,
        cost: new Decimal(1000),
        currentTime: new Decimal(0),
        time: new Decimal(6),
        bonus: new Decimal(1.05),
        level: new Decimal(0),
        costMultiply: new Decimal(1.7),
        timeMultiply: new Decimal(1.2),
        maxLevel: new Decimal(100),
      },
      epicNumberMultiplierDecrease: {
        isActive: false,
        cost: new Decimal(20000),
        currentTime: new Decimal(0),
        time: new Decimal(15),
        bonus: new Decimal(1.1),
        level: new Decimal(0),
        costMultiply: new Decimal(2),
        timeMultiply: new Decimal(1.3),
        maxLevel: new Decimal(1000),
      },
      researchTimeMultiplierDecrease: {
        isActive: false,
        cost: new Decimal(15000),
        currentTime: new Decimal(0),
        time: new Decimal(15),
        bonus: new Decimal(1.1),
        level: new Decimal(0),
        costMultiply: new Decimal(1.8),
        timeMultiply: new Decimal(1.3),
        maxLevel: new Decimal(1000),
      },
      researchScientistsChance: {
        isActive: false,
        cost: new Decimal(5000),
        currentTime: new Decimal(0),
        time: new Decimal(8),
        bonus: new Decimal(1),
        level: new Decimal(0),
        costMultiply: new Decimal(5),
        timeMultiply: new Decimal(1.25),
        maxLevel: new Decimal(99),
      },
      researchScientistsMultiplierStats: {
        isActive: false,
        cost: new Decimal(2000),
        currentTime: new Decimal(0),
        time: new Decimal(8),
        bonus: new Decimal(0.1),
        level: new Decimal(0),
        costMultiply: new Decimal(1.2),
        timeMultiply: new Decimal(1.15),
        maxLevel: new Decimal(1e50),
      },
      researchScientistsMultiplierExperience: {
        isActive: false,
        cost: new Decimal(2000),
        currentTime: new Decimal(0),
        time: new Decimal(8),
        bonus: new Decimal(0.1),
        level: new Decimal(0),
        costMultiply: new Decimal(1.2),
        timeMultiply: new Decimal(1.15),
        maxLevel: new Decimal(1e50),
      },
      shopMultiplierChanceReturn: {
        isActive: false,
        cost: new Decimal(500),
        currentTime: new Decimal(0),
        time: new Decimal(10),
        bonus: new Decimal(0.01),
        level: new Decimal(0),
        costMultiply: new Decimal(3.5),
        timeMultiply: new Decimal(1.2),
        maxLevel: new Decimal(100),
      },
    },
  }),
  getters: {
    getResearchSpeed: (store): Decimal => {
      const base = store.speed;
      if (base.lt(1)) return D1;
      const research = store.base.researchTimeMultiplierDecrease;
      const bonus = research.level.gt(0) ? research.bonus.pow(research.level) : D1;
      const reduced = base.log(D1_1).div(D350.div(bonus));
      return Decimal.max(D1, D1.add(reduced));
    },

    save: (store) => {
      return {
        points: store.points,
        speed: store.speed,
        scientists: store.scientists.map((s) => ({
          id: s.id,
          level: s.level,
          exp: s.exp,
          intellect: s.intellect,
          efficiency: s.efficiency,
        })),
        base: {
          cpuPow: {
            isActive: store.base.cpuPow.isActive,
            currentTime: store.base.cpuPow.currentTime,
            level: store.base.cpuPow.level,
          },
          hddPow: {
            isActive: store.base.hddPow.isActive,
            currentTime: store.base.hddPow.currentTime,
            level: store.base.hddPow.level,
          },
          ramPow: {
            isActive: store.base.ramPow.isActive,
            currentTime: store.base.ramPow.currentTime,
            level: store.base.ramPow.level,
          },
          workerPow: {
            isActive: store.base.workerPow.isActive,
            currentTime: store.base.workerPow.currentTime,
            level: store.base.workerPow.level,
          },
          shopCostMultiplierDecrease: {
            isActive: store.base.shopCostMultiplierDecrease.isActive,
            currentTime: store.base.shopCostMultiplierDecrease.currentTime,
            level: store.base.shopCostMultiplierDecrease.level,
          },
          epicNumberMultiplierDecrease: {
            isActive: store.base.epicNumberMultiplierDecrease.isActive,
            currentTime: store.base.epicNumberMultiplierDecrease.currentTime,
            level: store.base.epicNumberMultiplierDecrease.level,
          },
          researchTimeMultiplierDecrease: {
            isActive: store.base.researchTimeMultiplierDecrease.isActive,
            currentTime: store.base.researchTimeMultiplierDecrease.currentTime,
            level: store.base.researchTimeMultiplierDecrease.level,
          },
          researchScientistsChance: {
            isActive: store.base.researchScientistsChance.isActive,
            currentTime: store.base.researchScientistsChance.currentTime,
            level: store.base.researchScientistsChance.level,
          },
          researchScientistsMultiplierStats: {
            isActive: store.base.researchScientistsMultiplierStats.isActive,
            currentTime: store.base.researchScientistsMultiplierStats.currentTime,
            level: store.base.researchScientistsMultiplierStats.level,
          },
          researchScientistsMultiplierExperience: {
            isActive: store.base.researchScientistsMultiplierExperience.isActive,
            currentTime: store.base.researchScientistsMultiplierExperience.currentTime,
            level: store.base.researchScientistsMultiplierExperience.level,
          },
          shopMultiplierChanceReturn: {
            isActive: store.base.shopMultiplierChanceReturn.isActive,
            currentTime: store.base.shopMultiplierChanceReturn.currentTime,
            level: store.base.shopMultiplierChanceReturn.level,
          },
        },
      };
    },
  },
  actions: {
    processResearch() {
      Object.values(this.base).forEach((research) => {
        if (research.isActive && research.currentTime.gt(0)) {
          research.currentTime = research.currentTime.minus(1);
          if (research.currentTime.lte(0)) {
            research.level = research.level.plus(1);
            research.isActive = false;
          }
        }
      });
    },
    randomUpgrade(scientist: ResearchScientist) {
      const statsResearch = this.base.researchScientistsMultiplierStats;
      const chanceResearch = this.base.researchScientistsChance;

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
    expToLevel(level: Decimal) {
      return level.pow(2).mul(D100).plus(D50);
    },
    processScientists() {
      this.scientists.forEach((s) => {
        if (Math.random() < 0.01) this.randomUpgrade(s);
      });

      const { level, bonus } = this.base.researchScientistsMultiplierExperience;
      const expMultiplier = level.gte(1) ? level.mul(bonus).plus(1) : D1;

      let totalResearch = D0;
      this.scientists.forEach((s) => {
        s.exp = s.exp.add(s.intellect.mul(expMultiplier));
        const need = this.expToLevel(s.level);
        if (s.exp.gte(need)) {
          s.exp = s.exp.sub(need);
          s.level = s.level.add(1);
        }
        totalResearch = totalResearch.add(s.level.mul(s.efficiency.div(100).add(1)));
      });

      this.points = this.points.add(totalResearch);
    },
    processGiveResearchSpeed() {
      const storeShop = useStoreShop();
      const parRAM = storeShop.list.ram.value;
      const parResearchRam = this.base.ramPow;
      const exp = parResearchRam.bonus.mul(parResearchRam.level).plus(1);
      const result = parRAM.pow(exp);
      this.speed = this.speed.plus(result);
    },
    load(loaded: Partial<ResearchLoadData>) {
      const toDec = (v?: string | number | Decimal, def = '0') => new Decimal(v ?? def);

      this.points = toDec(loaded?.points);
      this.speed = toDec(loaded?.speed);

      this.scientists = (loaded?.scientists || []).map((s) => ({
        id: s.id,
        level: toDec(s.level),
        exp: toDec(s.exp),
        intellect: toDec(s.intellect),
        efficiency: toDec(s.efficiency),
      }));

      const lb = loaded?.base;
      const assign = (
        dst: { isActive: boolean; currentTime: Decimal; level: Decimal },
        src?: ResearchList,
      ) => {
        if (!src) return;
        dst.isActive = !!src.isActive;
        dst.currentTime = toDec(src.currentTime);
        dst.level = toDec(src.level);
      };

      if (lb) {
        assign(this.base.cpuPow, lb.cpuPow);
        assign(this.base.hddPow, lb.hddPow);
        assign(this.base.ramPow, lb.ramPow);
        assign(this.base.workerPow, lb.workerPow);
        assign(this.base.shopCostMultiplierDecrease, lb.shopCostMultiplierDecrease);
        assign(this.base.epicNumberMultiplierDecrease, lb.epicNumberMultiplierDecrease);
        assign(this.base.researchTimeMultiplierDecrease, lb.researchTimeMultiplierDecrease);
        assign(this.base.researchScientistsChance, lb.researchScientistsChance);
        assign(this.base.researchScientistsMultiplierStats, lb.researchScientistsMultiplierStats);
        assign(
          this.base.researchScientistsMultiplierExperience,
          lb.researchScientistsMultiplierExperience,
        );
        assign(this.base.shopMultiplierChanceReturn, lb.shopMultiplierChanceReturn);
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreResearch, import.meta.hot));
}
