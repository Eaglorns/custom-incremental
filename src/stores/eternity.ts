import { defineStore, acceptHMRUpdate } from 'pinia';
import Decimal from 'break_eternity.js';
import { useStoreData } from 'stores/data';
import { useStoreShop } from 'stores/shop';
import { useStorePrestige } from 'stores/prestige';
import { useStoreResearch } from 'stores/research';
import { useStoreAutomatic } from 'stores/automatic';

type TechTreeItem = {
  id: string;
  description: string;
  cost: Decimal;
  baseCost: Decimal;
  costMultiplier: Decimal;
  level: Decimal;
  maxLevel: Decimal;
};

export const useStoreEternity = defineStore('storeEternity', {
  state: () => ({
    points: new Decimal(0),
    countReset: new Decimal(0),
    techTree: {
      shop: [
        {
          id: 'shop_1',
          description: 'При сбросе сохраняется часть процессоров.',
          cost: new Decimal(10),
          baseCost: new Decimal(10),
          costMultiplier: new Decimal(2),
          level: new Decimal(0),
          maxLevel: new Decimal(99),
        },
        {
          id: 'shop_2',
          description: 'При сбросе сохраняется часть жёстких дисков.',
          cost: new Decimal(100),
          baseCost: new Decimal(100),
          costMultiplier: new Decimal(2.2),
          level: new Decimal(0),
          maxLevel: new Decimal(99),
        },
        {
          id: 'shop_3',
          description: 'При сбросе сохраняется часть оперативной памяти.',
          cost: new Decimal(500),
          baseCost: new Decimal(500),
          costMultiplier: new Decimal(2.5),
          level: new Decimal(0),
          maxLevel: new Decimal(99),
        },
        {
          id: 'shop_4',
          description: 'При сбросе сохраняется часть работников.',
          cost: new Decimal(1200),
          baseCost: new Decimal(1200),
          costMultiplier: new Decimal(3),
          level: new Decimal(0),
          maxLevel: new Decimal(99),
        },
      ] as TechTreeItem[],
      prestige: [
        {
          id: 'prestige_1',
          description: 'Увеличивает награду за престиж',
          cost: new Decimal(50),
          baseCost: new Decimal(50),
          costMultiplier: new Decimal(2.5),
          level: new Decimal(0),
          maxLevel: new Decimal(1000),
        },
        {
          id: 'prestige_2',
          description: 'Увеличивает базовую награду за каждый престижный сброс',
          cost: new Decimal(150),
          baseCost: new Decimal(150),
          costMultiplier: new Decimal(2),
          level: new Decimal(0),
          maxLevel: new Decimal(500),
        },
        {
          id: 'prestige_3',
          description: 'Снижает требования к наградам для следующего престижа',
          cost: new Decimal(400),
          baseCost: new Decimal(400),
          costMultiplier: new Decimal(2.6),
          level: new Decimal(0),
          maxLevel: new Decimal(300),
        },
        {
          id: 'prestige_4',
          description: 'Улучшает автопокупки и сохранённые бонусы после престижа',
          cost: new Decimal(800),
          baseCost: new Decimal(800),
          costMultiplier: new Decimal(3),
          level: new Decimal(0),
          maxLevel: new Decimal(150),
        },
      ] as TechTreeItem[],
      research: [
        {
          id: 'research_1',
          description: 'Повышает скорость исследований',
          cost: new Decimal(200),
          baseCost: new Decimal(200),
          costMultiplier: new Decimal(3),
          level: new Decimal(0),
          maxLevel: new Decimal(1000),
        },
        {
          id: 'research_2',
          description: 'Уменьшает время одиночного исследования',
          cost: new Decimal(300),
          baseCost: new Decimal(300),
          costMultiplier: new Decimal(2.5),
          level: new Decimal(0),
          maxLevel: new Decimal(400),
        },
        {
          id: 'research_3',
          description: 'Повышает шанс появления новых учёных и их эффективность',
          cost: new Decimal(750),
          baseCost: new Decimal(750),
          costMultiplier: new Decimal(3.2),
          level: new Decimal(0),
          maxLevel: new Decimal(200),
        },
      ] as TechTreeItem[],
      automatic: [
        {
          id: 'automatic_1',
          description: 'Увеличивает работу автоматических помощников',
          cost: new Decimal(500),
          baseCost: new Decimal(500),
          costMultiplier: new Decimal(3.5),
          level: new Decimal(0),
          maxLevel: new Decimal(1000),
        },
        {
          id: 'automatic_2',
          description: 'Увеличивает скорость действий помощников (частота срабатывания)',
          cost: new Decimal(700),
          baseCost: new Decimal(700),
          costMultiplier: new Decimal(2.8),
          level: new Decimal(0),
          maxLevel: new Decimal(300),
        },
        {
          id: 'automatic_3',
          description: 'Снижает потребление ресурсов автоматическими помощниками',
          cost: new Decimal(1200),
          baseCost: new Decimal(1200),
          costMultiplier: new Decimal(3.5),
          level: new Decimal(0),
          maxLevel: new Decimal(150),
        },
      ] as TechTreeItem[],
      magic: [
        {
          id: 'magic_1',
          description: 'Увеличивает эффективность магических заклинаний',
          cost: new Decimal(500),
          baseCost: new Decimal(500),
          costMultiplier: new Decimal(3.5),
          level: new Decimal(0),
          maxLevel: new Decimal(1000),
        },
        {
          id: 'magic_2',
          description: 'Увеличивает максимальную ману и её восстановление',
          cost: new Decimal(900),
          baseCost: new Decimal(900),
          costMultiplier: new Decimal(2.8),
          level: new Decimal(0),
          maxLevel: new Decimal(300),
        },
        {
          id: 'magic_3',
          description: 'Усиление рун — повышает силу эффектов рун и длительность',
          cost: new Decimal(1600),
          baseCost: new Decimal(1600),
          costMultiplier: new Decimal(3.6),
          level: new Decimal(0),
          maxLevel: new Decimal(120),
        },
      ] as TechTreeItem[],
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
