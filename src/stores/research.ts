import { defineStore, acceptHMRUpdate } from 'pinia';
import Decimal from 'break_eternity.js';
import type { Scientist } from 'src/constants/models';
import { useStoreShop } from 'stores/shop';
import { useStoreStats } from 'stores/stats';

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
  list: {
    cpuPow: ResearchList;
    hddPow: ResearchList;
    ramPow: ResearchList;
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
    speed: new Decimal(1),
    scientists: [] as Scientist[],
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
      hddPow: {
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
  }),
  getters: {
    getResearchSpeed: (store): Decimal => {
      const base = store.speed;
      if (base.lt(1)) return new Decimal(1);
      const research = store.list.researchTimeMultiplierDecrease;
      const bonus = research.level.gt(0) ? research.bonus.pow(research.level) : new Decimal(1);
      const reduced = base.div(new Decimal(100).div(bonus)).log(3);
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
        list: {
          cpuPow: {
            isActive: store.list.cpuPow.isActive,
            currentTime: store.list.cpuPow.currentTime,
            level: store.list.cpuPow.level,
          },
          hddPow: {
            isActive: store.list.hddPow.isActive,
            currentTime: store.list.hddPow.currentTime,
            level: store.list.hddPow.level,
          },
          ramPow: {
            isActive: store.list.ramPow.isActive,
            currentTime: store.list.ramPow.currentTime,
            level: store.list.ramPow.level,
          },
          shopCostMultiplierDecrease: {
            isActive: store.list.shopCostMultiplierDecrease.isActive,
            currentTime: store.list.shopCostMultiplierDecrease.currentTime,
            level: store.list.shopCostMultiplierDecrease.level,
          },
          epicNumberMultiplierDecrease: {
            isActive: store.list.epicNumberMultiplierDecrease.isActive,
            currentTime: store.list.epicNumberMultiplierDecrease.currentTime,
            level: store.list.epicNumberMultiplierDecrease.level,
          },
          researchTimeMultiplierDecrease: {
            isActive: store.list.researchTimeMultiplierDecrease.isActive,
            currentTime: store.list.researchTimeMultiplierDecrease.currentTime,
            level: store.list.researchTimeMultiplierDecrease.level,
          },
          researchScientistsChance: {
            isActive: store.list.researchScientistsChance.isActive,
            currentTime: store.list.researchScientistsChance.currentTime,
            level: store.list.researchScientistsChance.level,
          },
          researchScientistsMultiplierStats: {
            isActive: store.list.researchScientistsMultiplierStats.isActive,
            currentTime: store.list.researchScientistsMultiplierStats.currentTime,
            level: store.list.researchScientistsMultiplierStats.level,
          },
          researchScientistsMultiplierExperience: {
            isActive: store.list.researchScientistsMultiplierExperience.isActive,
            currentTime: store.list.researchScientistsMultiplierExperience.currentTime,
            level: store.list.researchScientistsMultiplierExperience.level,
          },
          shopMultiplierChanceReturn: {
            isActive: store.list.shopMultiplierChanceReturn.isActive,
            currentTime: store.list.shopMultiplierChanceReturn.currentTime,
            level: store.list.shopMultiplierChanceReturn.level,
          },
        },
      };
    },
  },
  actions: {
    processResearch() {
      Object.values(this.list).forEach((research) => {
        if (research.isActive && research.currentTime.gt(0)) {
          research.currentTime = research.currentTime.minus(1);
          if (research.currentTime.lte(0)) {
            research.level = research.level.plus(1);
            research.isActive = false;
          }
        }
      });
    },
    randomUpgrade(scientist: Scientist) {
      const statsResearch = this.list.researchScientistsMultiplierStats;
      const chanceResearch = this.list.researchScientistsChance;

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
      const storeStats = useStoreStats();
      this.scientists.forEach((s) => {
        if (Math.random() < 0.01) this.randomUpgrade(s);
      });

      const { level, bonus } = this.list.researchScientistsMultiplierExperience;
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

      if (this.points.gte(storeStats.maxResearchPoints)) storeStats.maxResearchPoints = this.points;
    },
    processGiveResearchSpeed() {
      const storeShop = useStoreShop();
      const parRAM = storeShop.list.ram.value;
      const parResearchRam = this.list.ramPow;
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
      this.list.cpuPow.isActive = loaded.list.cpuPow.isActive;
      this.list.cpuPow.currentTime = new Decimal(loaded.list.cpuPow.currentTime);
      this.list.cpuPow.level = new Decimal(loaded.list.cpuPow.level);
      this.list.hddPow.isActive = loaded.list.hddPow.isActive;
      this.list.hddPow.currentTime = new Decimal(loaded.list.hddPow.currentTime);
      this.list.hddPow.level = new Decimal(loaded.list.hddPow.level);
      this.list.ramPow.isActive = loaded.list.ramPow.isActive;
      this.list.ramPow.currentTime = new Decimal(loaded.list.ramPow.currentTime);
      this.list.ramPow.level = new Decimal(loaded.list.ramPow.level);
      this.list.shopCostMultiplierDecrease.isActive =
        loaded.list.shopCostMultiplierDecrease.isActive;
      this.list.shopCostMultiplierDecrease.currentTime = new Decimal(
        loaded.list.shopCostMultiplierDecrease.currentTime,
      );
      this.list.shopCostMultiplierDecrease.level = new Decimal(
        loaded.list.shopCostMultiplierDecrease.level,
      );
      this.list.epicNumberMultiplierDecrease.currentTime = new Decimal(
        loaded.list.epicNumberMultiplierDecrease.currentTime,
      );
      this.list.epicNumberMultiplierDecrease.isActive =
        loaded.list.epicNumberMultiplierDecrease.isActive;
      this.list.epicNumberMultiplierDecrease.level = new Decimal(
        loaded.list.epicNumberMultiplierDecrease.level,
      );
      this.list.researchTimeMultiplierDecrease.isActive =
        loaded.list.researchTimeMultiplierDecrease.isActive;
      this.list.researchTimeMultiplierDecrease.currentTime = new Decimal(
        loaded.list.researchTimeMultiplierDecrease.currentTime,
      );
      this.list.researchTimeMultiplierDecrease.level = new Decimal(
        loaded.list.researchTimeMultiplierDecrease.level,
      );
      this.list.researchScientistsChance.isActive = loaded.list.researchScientistsChance.isActive;
      this.list.researchScientistsChance.currentTime = new Decimal(
        loaded.list.researchScientistsChance.currentTime,
      );
      this.list.researchScientistsChance.level = new Decimal(
        loaded.list.researchScientistsChance.level,
      );
      this.list.researchScientistsMultiplierStats.isActive =
        loaded.list.researchScientistsMultiplierStats.isActive;
      this.list.researchScientistsMultiplierStats.currentTime = new Decimal(
        loaded.list.researchScientistsMultiplierStats.currentTime,
      );
      this.list.researchScientistsMultiplierStats.level = new Decimal(
        loaded.list.researchScientistsMultiplierStats.level,
      );
      this.list.researchScientistsMultiplierExperience.isActive =
        loaded.list.researchScientistsMultiplierExperience.isActive;
      this.list.researchScientistsMultiplierExperience.currentTime = new Decimal(
        loaded.list.researchScientistsMultiplierExperience.currentTime,
      );
      this.list.researchScientistsMultiplierExperience.level = new Decimal(
        loaded.list.researchScientistsMultiplierExperience.level,
      );
      this.list.shopMultiplierChanceReturn.isActive =
        loaded.list.shopMultiplierChanceReturn.isActive;
      this.list.shopMultiplierChanceReturn.currentTime = new Decimal(
        loaded.list.shopMultiplierChanceReturn.currentTime,
      );
      this.list.shopMultiplierChanceReturn.level = new Decimal(
        loaded.list.shopMultiplierChanceReturn.level,
      );
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreResearch, import.meta.hot));
}
