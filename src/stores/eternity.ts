import { defineStore, acceptHMRUpdate } from 'pinia';
import Decimal from 'break_eternity.js';
import { useStoreData } from 'stores/data';
import { useStoreShop } from 'stores/shop';
import { useStorePrestige } from 'stores/prestige';
import { useStoreResearch } from 'stores/research';
import { useStoreAutomatic } from 'stores/automatic';

export const useStoreEternity = defineStore('storeEternity', {
  state: () => ({
    points: new Decimal(0),
    countReset: new Decimal(0),
    techTree: {
      shop: {
        resetCPUValue: {
          description: 'Значение процессоров при сбросе',
          cost: new Decimal(10),
          baseCost: new Decimal(10),
          costMultiplier: new Decimal(2),
          level: new Decimal(0),
          maxLevel: new Decimal(-1),
        },
        resetHDDValue: {
          description: 'Значение жестких дисков при сбросе',
          cost: new Decimal(100),
          baseCost: new Decimal(100),
          costMultiplier: new Decimal(2.2),
          level: new Decimal(0),
          maxLevel: new Decimal(-1),
        },
        resetRAMValue: {
          description: 'Значение оперативной памяти при сбросе',
          cost: new Decimal(500),
          baseCost: new Decimal(500),
          costMultiplier: new Decimal(2.5),
          level: new Decimal(0),
          maxLevel: new Decimal(-1),
        },
        resetWorkerValue: {
          description: 'Значение рабочих при сбросе',
          cost: new Decimal(1200),
          baseCost: new Decimal(1200),
          costMultiplier: new Decimal(3),
          level: new Decimal(0),
          maxLevel: new Decimal(-1),
        },
        resetCPUMultiplier: {
          description: 'Множитель процессоров при сбросе',
          cost: new Decimal(10),
          baseCost: new Decimal(10),
          costMultiplier: new Decimal(2),
          level: new Decimal(0),
          maxLevel: new Decimal(-1),
        },
        resetHDDMultiplier: {
          description: 'Множитель жестких дисков при сбросе',
          cost: new Decimal(100),
          baseCost: new Decimal(100),
          costMultiplier: new Decimal(2.2),
          level: new Decimal(0),
          maxLevel: new Decimal(-1),
        },
        resetRAMMultiplier: {
          description: 'Множитель оперативной памяти при сбросе',
          cost: new Decimal(500),
          baseCost: new Decimal(500),
          costMultiplier: new Decimal(2.5),
          level: new Decimal(0),
          maxLevel: new Decimal(-1),
        },
        resetWorkerMultiplier: {
          description: 'Множитель рабочих при сбросе',
          cost: new Decimal(1200),
          baseCost: new Decimal(1200),
          costMultiplier: new Decimal(3),
          level: new Decimal(0),
          maxLevel: new Decimal(-1),
        },
      },
      prestige: {
        resetPrestigePoints: {
          description: 'Очки престижа при сбросе',
          cost: new Decimal(50),
          baseCost: new Decimal(50),
          costMultiplier: new Decimal(2.5),
          level: new Decimal(0),
          maxLevel: new Decimal(-1),
        },
      },
      research: {
        resetResearchPoints: {
          description: 'Очки исследований при сбросе',
          cost: new Decimal(200),
          baseCost: new Decimal(200),
          costMultiplier: new Decimal(3),
          level: new Decimal(0),
          maxLevel: new Decimal(99),
        },
      },
      automatic: {
        resetAtomaticValue: {
          description: 'Количество помощников при сбросе',
          cost: new Decimal(500),
          baseCost: new Decimal(500),
          costMultiplier: new Decimal(3.5),
          level: new Decimal(0),
          maxLevel: new Decimal(-1),
        },
      },
      magic: {
        resetMagicMageLevel: {
          description: 'Уровень магов при сбросе',
          cost: new Decimal(500),
          baseCost: new Decimal(500),
          costMultiplier: new Decimal(3.5),
          level: new Decimal(0),
          maxLevel: new Decimal(-1),
        },
        resetMagicRuneValue: {
          description: 'Уровень рун при сбросе',
          cost: new Decimal(500),
          baseCost: new Decimal(500),
          costMultiplier: new Decimal(3.5),
          level: new Decimal(0),
          maxLevel: new Decimal(-1),
        },
        resetMagicMonsterLevel: {
          description: 'Уровень монстра при сбросе',
          cost: new Decimal(500),
          baseCost: new Decimal(500),
          costMultiplier: new Decimal(3.5),
          level: new Decimal(0),
          maxLevel: new Decimal(-1),
        },
      },
    },
  }),
  actions: {
    reset() {
      this.points = this.points.plus(1);
      this.countReset = this.points.plus(1);

      const D0 = new Decimal(0);
      const D1 = new Decimal(1);

      const storeData = useStoreData();
      const storeShop = useStoreShop();
      const storePrestige = useStorePrestige();
      const storeResearch = useStoreResearch();
      const storeAutomatic = useStoreAutomatic();

      storeData.epicNumber = D0;
      storeData.multiplierEpicNumber = D0;

      storeShop.points = D0;
      storeShop.list.cpu.value = D1;
      storeShop.list.cpu.multiply = D1;
      storeShop.list.hdd.value = D0;
      storeShop.list.hdd.multiply = D1;
      storeShop.list.ram.value = D0;
      storeShop.list.ram.multiply = D1;
      storeShop.list.worker.value = D1;
      storeShop.list.worker.multiply = D1;

      storePrestige.points = D0;
      storePrestige.upgrades.prestigeBonus.level = D0;
      storePrestige.upgrades.prestigeSoftening.level = D0;
      storePrestige.upgrades.prestigeBuyValueCount.level = D0;
      storePrestige.upgrades.prestigeBuyValueMultiply.level = D0;
      storePrestige.upgrades.autoShopCPUValue.level = D0;
      storePrestige.upgrades.autoShopHDDValue.level = D0;
      storePrestige.upgrades.autoShopRAMValue.level = D0;
      storePrestige.upgrades.autoShopWorkerValue.level = D0;
      storePrestige.upgrades.autoShopCPUMultiply.level = D0;
      storePrestige.upgrades.autoShopHDDMultiply.level = D0;
      storePrestige.upgrades.autoShopRAMMultiply.level = D0;
      storePrestige.upgrades.autoShopWorkerMultiply.level = D0;

      storeResearch.points = D0;
      storeResearch.speed = D0;
      storeResearch.scientists = [];
      storeResearch.base.cpuPow.isActive = false;
      storeResearch.base.cpuPow.currentTime = D0;
      storeResearch.base.cpuPow.level = D0;
      storeResearch.base.hddPow.isActive = false;
      storeResearch.base.hddPow.currentTime = D0;
      storeResearch.base.hddPow.level = D0;
      storeResearch.base.ramPow.isActive = false;
      storeResearch.base.ramPow.currentTime = D0;
      storeResearch.base.ramPow.level = D0;
      storeResearch.base.workerPow.isActive = false;
      storeResearch.base.workerPow.currentTime = D0;
      storeResearch.base.workerPow.level = D0;
      storeResearch.base.shopCostMultiplierDecrease.isActive = false;
      storeResearch.base.shopCostMultiplierDecrease.currentTime = D0;
      storeResearch.base.shopCostMultiplierDecrease.level = D0;
      storeResearch.base.epicNumberMultiplierDecrease.isActive = false;
      storeResearch.base.epicNumberMultiplierDecrease.currentTime = D0;
      storeResearch.base.epicNumberMultiplierDecrease.level = D0;
      storeResearch.base.researchTimeMultiplierDecrease.isActive = false;
      storeResearch.base.researchTimeMultiplierDecrease.currentTime = D0;
      storeResearch.base.researchTimeMultiplierDecrease.level = D0;
      storeResearch.base.researchScientistsChance.isActive = false;
      storeResearch.base.researchScientistsChance.currentTime = D0;
      storeResearch.base.researchScientistsChance.level = D0;
      storeResearch.base.researchScientistsMultiplierStats.isActive = false;
      storeResearch.base.researchScientistsMultiplierStats.currentTime = D0;
      storeResearch.base.researchScientistsMultiplierStats.level = D0;
      storeResearch.base.researchScientistsMultiplierExperience.isActive = false;
      storeResearch.base.researchScientistsMultiplierExperience.currentTime = D0;
      storeResearch.base.researchScientistsMultiplierExperience.level = D0;
      storeResearch.base.shopMultiplierChanceReturn.isActive = false;
      storeResearch.base.shopMultiplierChanceReturn.currentTime = D0;
      storeResearch.base.shopMultiplierChanceReturn.level = D0;

      storeAutomatic.helpersShop.cpu.count = D0;
      storeAutomatic.helpersShop.cpu.percent = D0;
      storeAutomatic.helpersShop.cpu.enabled = true;
      storeAutomatic.helpersShop.hdd.count = D0;
      storeAutomatic.helpersShop.hdd.percent = D0;
      storeAutomatic.helpersShop.hdd.enabled = true;
      storeAutomatic.helpersShop.ram.count = D0;
      storeAutomatic.helpersShop.ram.percent = D0;
      storeAutomatic.helpersShop.ram.enabled = true;
      storeAutomatic.helpersShop.worker.count = D0;
      storeAutomatic.helpersShop.worker.percent = D0;
      storeAutomatic.helpersShop.worker.enabled = true;
      storeAutomatic.helpersShop.cpuMultiplier.count = D0;
      storeAutomatic.helpersShop.cpuMultiplier.percent = D0;
      storeAutomatic.helpersShop.cpuMultiplier.enabled = true;
      storeAutomatic.helpersShop.hddMultiplier.count = D0;
      storeAutomatic.helpersShop.hddMultiplier.percent = D0;
      storeAutomatic.helpersShop.hddMultiplier.enabled = true;
      storeAutomatic.helpersShop.ramMultiplier.count = D0;
      storeAutomatic.helpersShop.ramMultiplier.percent = D0;
      storeAutomatic.helpersShop.ramMultiplier.enabled = true;
      storeAutomatic.helpersShop.workerMultiplier.count = D0;
      storeAutomatic.helpersShop.workerMultiplier.percent = D0;
      storeAutomatic.helpersShop.workerMultiplier.enabled = true;
    },

    load(loaded: { points: string; countReset: string }) {
      this.points = new Decimal(loaded.points || 0);
      this.countReset = new Decimal(loaded.countReset || 0);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreEternity, import.meta.hot));
}
