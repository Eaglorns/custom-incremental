import { defineStore, acceptHMRUpdate } from 'pinia';
import { useStoreData } from 'stores/data';
import { useStoreResearch } from 'stores/research';
import { useStoreAutomatic } from 'stores/automatic';
import { useStoreShop } from 'stores/shop';
import { useStoreAchievement } from 'stores/achievement';
import { useStoreStats } from 'stores/stats';
import { useStorePrestige } from 'stores/prestige';

export const useStoreGame = defineStore('storeGame', {
  state: () => ({
    name: 'cIncremental',
    version: '0.0.9',
    timerTick: 1000,
    lastTick: Date.now(),
  }),
  getters: {
    generateEpicNumber() {
      const storeShop = useStoreShop();
      const storeResearch = useStoreResearch();
      const storeAchievement = useStoreAchievement();
      const parShopCPU = storeShop.list.cpu.value;
      const parResearchCPU = storeResearch.base.cpuPow;
      const result = parShopCPU
        .pow(parResearchCPU.bonus.mul(parResearchCPU.level).plus(1))
        .mul(storeAchievement.achievementBonus);
      return result;
    },
  },
  actions: {
    gameTick() {
      console.time('gameTick');
      const storeResearch = useStoreResearch();
      const storeAutomatic = useStoreAutomatic();
      const storeShop = useStoreShop();
      const storeStats = useStoreStats();
      const storeData = useStoreData();
      const storeAchievement = useStoreAchievement();
      const storePrestige = useStorePrestige();
      const now = Date.now();
      const delta = now - this.lastTick;
      this.lastTick = now;

      const steps = Math.floor(delta / this.timerTick) || 1;
      for (let i = 0; i < steps; i++) {
        this.processGiveMultiplierEpicNumber();
        storeShop.processGivePoints();
        storeResearch.processGiveResearchSpeed();
        storeResearch.processResearch();
        storeAutomatic.processHelpersShop();
        storeResearch.processScientists();
        storePrestige.processUpgradeAddShop();
        storeData.processGiveEpicNumber();
        storeAchievement.processUpdate();
        storeStats.processUpdate();
      }
      console.timeEnd('gameTick');
    },

    processGiveMultiplierEpicNumber() {
      const storeData = useStoreData();
      storeData.multiplierEpicNumber = storeData.multiplierEpicNumber.plus(this.generateEpicNumber);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreGame, import.meta.hot));
}
