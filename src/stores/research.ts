import { defineStore, acceptHMRUpdate } from 'pinia';
import Decimal from 'break_eternity.js';
import { toDec } from 'src/utils/storeUtils';
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
          level: s.level.toString(),
          exp: s.exp.toString(),
          intellect: s.intellect.toString(),
          efficiency: s.efficiency.toString(),
        })),
        base: {
          cpuPow: {
            isActive: store.base.cpuPow.isActive,
            currentTime: store.base.cpuPow.currentTime.toString(),
            level: store.base.cpuPow.level.toString(),
          },
          hddPow: {
            isActive: store.base.hddPow.isActive,
            currentTime: store.base.hddPow.currentTime.toString(),
            level: store.base.hddPow.level.toString(),
          },
          ramPow: {
            isActive: store.base.ramPow.isActive,
            currentTime: store.base.ramPow.currentTime.toString(),
            level: store.base.ramPow.level.toString(),
          },
          workerPow: {
            isActive: store.base.workerPow.isActive,
            currentTime: store.base.workerPow.currentTime.toString(),
            level: store.base.workerPow.level.toString(),
          },
          shopCostMultiplierDecrease: {
            isActive: store.base.shopCostMultiplierDecrease.isActive,
            currentTime: store.base.shopCostMultiplierDecrease.currentTime.toString(),
            level: store.base.shopCostMultiplierDecrease.level.toString(),
          },
          epicNumberMultiplierDecrease: {
            isActive: store.base.epicNumberMultiplierDecrease.isActive,
            currentTime: store.base.epicNumberMultiplierDecrease.currentTime.toString(),
            level: store.base.epicNumberMultiplierDecrease.level.toString(),
          },
          researchTimeMultiplierDecrease: {
            isActive: store.base.researchTimeMultiplierDecrease.isActive,
            currentTime: store.base.researchTimeMultiplierDecrease.currentTime.toString(),
            level: store.base.researchTimeMultiplierDecrease.level.toString(),
          },
          researchScientistsChance: {
            isActive: store.base.researchScientistsChance.isActive,
            currentTime: store.base.researchScientistsChance.currentTime.toString(),
            level: store.base.researchScientistsChance.level.toString(),
          },
          researchScientistsMultiplierStats: {
            isActive: store.base.researchScientistsMultiplierStats.isActive,
            currentTime: store.base.researchScientistsMultiplierStats.currentTime.toString(),
            level: store.base.researchScientistsMultiplierStats.level.toString(),
          },
          researchScientistsMultiplierExperience: {
            isActive: store.base.researchScientistsMultiplierExperience.isActive,
            currentTime: store.base.researchScientistsMultiplierExperience.currentTime.toString(),
            level: store.base.researchScientistsMultiplierExperience.level.toString(),
          },
          shopMultiplierChanceReturn: {
            isActive: store.base.shopMultiplierChanceReturn.isActive,
            currentTime: store.base.shopMultiplierChanceReturn.currentTime.toString(),
            level: store.base.shopMultiplierChanceReturn.level.toString(),
          },
        },
      };
    },
  },
  actions: {
    processResearch() {
      for (const research of Object.values(this.base)) {
        if (research.isActive && research.currentTime.gt(0)) {
          research.currentTime = research.currentTime.minus(1);
          if (research.currentTime.lte(0)) {
            research.level = research.level.plus(1);
            research.isActive = false;
          }
        }
      }
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
      for (const scientist of this.scientists) {
        if (Math.random() < 0.01) this.randomUpgrade(scientist);
      }

      const { level, bonus } = this.base.researchScientistsMultiplierExperience;
      const expMultiplier = level.gte(1) ? level.mul(bonus).plus(1) : D1;

      let totalResearch = D0;
      for (const scientist of this.scientists) {
        scientist.exp = scientist.exp.add(scientist.intellect.mul(expMultiplier));
        const need = this.expToLevel(scientist.level);
        if (scientist.exp.gte(need)) {
          scientist.exp = scientist.exp.sub(need);
          scientist.level = scientist.level.add(1);
        }
        totalResearch = totalResearch.add(
          scientist.level.mul(scientist.efficiency.div(100).add(1)),
        );
      }

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
