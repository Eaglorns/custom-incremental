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
        maxLevel: new Decimal(-1),
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
        maxLevel: new Decimal(-1),
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
      if (base.lt(1)) return new Decimal(1);
      const research = store.base.researchTimeMultiplierDecrease;
      const bonus = research.level.gt(0) ? research.bonus.pow(research.level) : new Decimal(1);
      const reduced = base.log(1.1).div(new Decimal(350).div(bonus));
      return Decimal.max(new Decimal(1), new Decimal(1).add(reduced));
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
      return level.pow(2).mul(100).plus(50);
    },
    processScientists() {
      this.scientists.forEach((s) => {
        if (Math.random() < 0.01) this.randomUpgrade(s);
      });

      const { level, bonus } = this.base.researchScientistsMultiplierExperience;
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

      this.points = this.points.add(totalResearch);
    },
    processGiveResearchSpeed() {
      const storeShop = useStoreShop();
      const parRAM = storeShop.list.ram.value;
      const parResearchRam = this.base.ramPow;
      const result = parRAM.pow(parResearchRam.bonus.mul(parResearchRam.level).plus(1));
      this.speed = this.speed.plus(result);
    },
    load(loaded: ResearchLoadData) {
      this.points = new Decimal(loaded.points);
      this.speed = new Decimal(loaded.speed);
      this.scientists = loaded.scientists.map((s) => ({
        id: s.id,
        level: new Decimal(s.level),
        exp: new Decimal(s.exp),
        intellect: new Decimal(s.intellect),
        efficiency: new Decimal(s.efficiency),
      }));
      this.base.cpuPow.isActive = loaded.base.cpuPow.isActive;
      this.base.cpuPow.currentTime = new Decimal(loaded.base.cpuPow.currentTime);
      this.base.cpuPow.level = new Decimal(loaded.base.cpuPow.level);
      this.base.hddPow.isActive = loaded.base.hddPow.isActive;
      this.base.hddPow.currentTime = new Decimal(loaded.base.hddPow.currentTime);
      this.base.hddPow.level = new Decimal(loaded.base.hddPow.level);
      this.base.ramPow.isActive = loaded.base.ramPow.isActive;
      this.base.ramPow.currentTime = new Decimal(loaded.base.ramPow.currentTime);
      this.base.ramPow.level = new Decimal(loaded.base.ramPow.level);
      this.base.workerPow.isActive = loaded.base.workerPow.isActive;
      this.base.workerPow.currentTime = new Decimal(loaded.base.workerPow.currentTime);
      this.base.workerPow.level = new Decimal(loaded.base.workerPow.level);
      this.base.shopCostMultiplierDecrease.isActive =
        loaded.base.shopCostMultiplierDecrease.isActive;
      this.base.shopCostMultiplierDecrease.currentTime = new Decimal(
        loaded.base.shopCostMultiplierDecrease.currentTime,
      );
      this.base.shopCostMultiplierDecrease.level = new Decimal(
        loaded.base.shopCostMultiplierDecrease.level,
      );
      this.base.epicNumberMultiplierDecrease.currentTime = new Decimal(
        loaded.base.epicNumberMultiplierDecrease.currentTime,
      );
      this.base.epicNumberMultiplierDecrease.isActive =
        loaded.base.epicNumberMultiplierDecrease.isActive;
      this.base.epicNumberMultiplierDecrease.level = new Decimal(
        loaded.base.epicNumberMultiplierDecrease.level,
      );
      this.base.researchTimeMultiplierDecrease.isActive =
        loaded.base.researchTimeMultiplierDecrease.isActive;
      this.base.researchTimeMultiplierDecrease.currentTime = new Decimal(
        loaded.base.researchTimeMultiplierDecrease.currentTime,
      );
      this.base.researchTimeMultiplierDecrease.level = new Decimal(
        loaded.base.researchTimeMultiplierDecrease.level,
      );
      this.base.researchScientistsChance.isActive = loaded.base.researchScientistsChance.isActive;
      this.base.researchScientistsChance.currentTime = new Decimal(
        loaded.base.researchScientistsChance.currentTime,
      );
      this.base.researchScientistsChance.level = new Decimal(
        loaded.base.researchScientistsChance.level,
      );
      this.base.researchScientistsMultiplierStats.isActive =
        loaded.base.researchScientistsMultiplierStats.isActive;
      this.base.researchScientistsMultiplierStats.currentTime = new Decimal(
        loaded.base.researchScientistsMultiplierStats.currentTime,
      );
      this.base.researchScientistsMultiplierStats.level = new Decimal(
        loaded.base.researchScientistsMultiplierStats.level,
      );
      this.base.researchScientistsMultiplierExperience.isActive =
        loaded.base.researchScientistsMultiplierExperience.isActive;
      this.base.researchScientistsMultiplierExperience.currentTime = new Decimal(
        loaded.base.researchScientistsMultiplierExperience.currentTime,
      );
      this.base.researchScientistsMultiplierExperience.level = new Decimal(
        loaded.base.researchScientistsMultiplierExperience.level,
      );
      this.base.shopMultiplierChanceReturn.isActive =
        loaded.base.shopMultiplierChanceReturn.isActive;
      this.base.shopMultiplierChanceReturn.currentTime = new Decimal(
        loaded.base.shopMultiplierChanceReturn.currentTime,
      );
      this.base.shopMultiplierChanceReturn.level = new Decimal(
        loaded.base.shopMultiplierChanceReturn.level,
      );
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreResearch, import.meta.hot));
}
