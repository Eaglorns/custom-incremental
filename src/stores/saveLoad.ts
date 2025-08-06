import { defineStore, acceptHMRUpdate } from 'pinia';
import CryptoJS from 'crypto-js';
import { LocalStorage } from 'quasar';
import { useStoreGame } from 'stores/game';
import { useStoreData } from 'stores/data';
import { useStoreResearch } from 'stores/research';
import { useStorePrestige } from 'stores/prestige';
import { useStoreShop } from 'stores/shop';
import { useStoreAutomatic } from 'stores/automatic';
import { useStoreAchievement } from 'stores/achievement';
import { useStoreStats } from 'stores/stats';
import { useStoreSetting } from 'stores/setting';
import Decimal from 'break_eternity.js';
import { useStoreMagic } from 'stores/magic';

const STORAGE_KEY = 'save';
const SECRET = 'incremental';

export const useStoreSaveLoad = defineStore('storeSaveLoad', {
  state: () => ({
    timerSave: 15000,
  }),
  getters: {},
  actions: {
    saveGame() {
      const storeData = useStoreData();
      const storeResearch = useStoreResearch();
      const storePrestige = useStorePrestige();
      const storeShop = useStoreShop();
      const storeAutomatic = useStoreAutomatic();
      const storeAchievement = useStoreAchievement();
      const storeStats = useStoreStats();
      const storeSetting = useStoreSetting();
      const storeMagic = useStoreMagic();
      try {
        const saveData = {
          data: storeData.save,
          research: storeResearch.save,
          prestige: storePrestige.save,
          shop: storeShop.save,
          automatic: storeAutomatic.save,
          magic: storeMagic.save,
          achievement: storeAchievement.save,
          stats: storeStats.save,
          setting: storeSetting.save,
        };
        const replacer = (key: string, value: unknown) => {
          if (value instanceof Decimal) return { __decimal__: value.toString() };
          return value;
        };
        const plainState = JSON.stringify(saveData, replacer);
        const encrypted = CryptoJS.AES.encrypt(plainState, SECRET).toString();
        LocalStorage.setItem(STORAGE_KEY, encrypted);
        console.log('save game');
      } catch (e) {
        console.error('Error save game:', e);
      }
    },
    loadGame() {
      const storeData = useStoreData();
      const storeGame = useStoreGame();
      const storeResearch = useStoreResearch();
      const storePrestige = useStorePrestige();
      const storeShop = useStoreShop();
      const storeAutomatic = useStoreAutomatic();
      const storeAchievement = useStoreAchievement();
      const storeStats = useStoreStats();
      const storeSetting = useStoreSetting();
      const storeMagic = useStoreMagic();
      const encrypted = LocalStorage.getItem(STORAGE_KEY);
      if (typeof encrypted !== 'string') {
        storeData.version = storeGame.version;
        return;
      }
      try {
        const bytes = CryptoJS.AES.decrypt(encrypted, SECRET);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        const loaded = JSON.parse(decrypted);
        if (loaded.data.version == storeGame.version) {
          storeData.load(loaded.data);
          storeResearch.load(loaded.research);
          storePrestige.load(loaded.prestige);
          storeShop.load(loaded.shop);
          storeAutomatic.load(loaded.automatic);
          storeMagic.load(loaded.magic);
          storeAchievement.load(loaded.achievement);
          storeStats.load(loaded.stats);
          storeSetting.load(loaded.setting);
          console.log('load game');
        } else {
          storeData.version = storeGame.version;
        }
      } catch (e) {
        console.error('Error load game:', e);
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreSaveLoad, import.meta.hot));
}
