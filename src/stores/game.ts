import { defineStore, acceptHMRUpdate } from 'pinia';
import { useStoreData } from 'stores/data';
import { useStoreResearch } from 'stores/research';
import { useStoreAutomatic } from 'stores/automatic';
import { useStoreShop } from 'stores/shop';
import { useStoreAchievement } from 'stores/achievement';
import { useStoreStats } from 'stores/stats';
import { useStorePrestige } from 'stores/prestige';
import { useStoreMagic } from 'stores/magic';

export const useStoreGame = defineStore('storeGame', {
  state: () => ({
    name: 'cIncremental',
    version: '0.1.5.1',
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
      const storeMagic = useStoreMagic();
      const now = Date.now();
      const delta = now - this.lastTick;
      this.lastTick = now;

      let steps = Math.floor(delta / this.timerTick) || 1;
      if (steps > 1000) steps = 1000;
      for (let i = 0; i < steps; i++) {
        storeStats.gameTime++;
        this.processGiveMultiplierEpicNumber();
        storeShop.processGivePoints();
        storeResearch.processGiveResearchSpeed();
        storeResearch.processResearch();
        storeAutomatic.processHelpersShop();
        storeResearch.processScientists();
        storePrestige.processUpgradeAddShop();
        storeMagic.processMage();
        storeMagic.processEffects();
        storeData.processGiveEpicNumber();
        storeAchievement.processUpdate();
        storeStats.processUpdate();
      }
      console.timeEnd('gameTick');
    },

    processGiveMultiplierEpicNumber() {
      const storeShop = useStoreShop();
      const storeResearch = useStoreResearch();
      const parShopHDD = storeShop.list.hdd.value;
      const parResearchHDD = storeResearch.base.hddPow;
      const storeData = useStoreData();
      const result = parShopHDD.pow(parResearchHDD.bonus.mul(parResearchHDD.level).plus(1));
      storeData.multiplierEpicNumber = storeData.multiplierEpicNumber.plus(result);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreGame, import.meta.hot));
}
