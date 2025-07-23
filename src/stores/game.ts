import { defineStore, acceptHMRUpdate } from 'pinia';
import { useStoreData } from 'stores/data';
import { useStoreResearch } from 'stores/research';
import { useStoreAutomatic } from 'stores/automatic';
import { useStoreShop } from 'stores/shop';
import { useStoreAchievement } from 'stores/achievement';

export const useStoreGame = defineStore('storeGame', {
  state: () => ({
    name: 'Custom Incremental',
    version: '0.0.5',
    timerTick: 1000,
    lastTick: Date.now(),
  }),
  getters: {},
  actions: {
    gameTick() {
      console.time('gameTick');
      const storeResearch = useStoreResearch();
      const storeAutomatic = useStoreAutomatic();
      const storeShop = useStoreShop();
      const now = Date.now();
      const delta = now - this.lastTick;
      this.lastTick = now;

      const steps = Math.floor(delta / this.timerTick) || 1;
      for (let i = 0; i < steps; i++) {
        this.processGiveMultiplierEpicNumber();
        storeShop.processGivePoints();
        storeResearch.processGiveResearchSpeed();
        storeResearch.processResearch();
        storeAutomatic.processHelpers();
        storeResearch.processScientists();
        this.processGiveEpicNumber();
      }
      console.timeEnd('gameTick');
    },

    processGiveEpicNumber() {
      const storeData = useStoreData();
      const storeShop = useStoreShop();
      const storeResearch = useStoreResearch();
      const storeAchievement = useStoreAchievement();
      const parShopCPU = storeShop.list.cpu.value;
      const parResearchCPU = storeResearch.list.cpuPow;
      const result = parShopCPU
        .pow(parResearchCPU.bonus.mul(parResearchCPU.level).plus(1))
        .mul(storeAchievement.achievementBonus);
      storeData.epicNumber = storeData.epicNumber.plus(result);
    },

    processGiveMultiplierEpicNumber() {
      const storeData = useStoreData();
      const storeShop = useStoreShop();
      const storeResearch = useStoreResearch();
      const parHDD = storeShop.list.hdd.value;
      const parResearchHDD = storeResearch.list.hddPow;
      const result = parHDD.pow(parResearchHDD.bonus.mul(parResearchHDD.level).plus(1));
      storeData.multiplierEpicNumber = storeData.multiplierEpicNumber.plus(result);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreGame, import.meta.hot));
}
