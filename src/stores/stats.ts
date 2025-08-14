import { defineStore, acceptHMRUpdate } from 'pinia';
import Decimal from 'break_eternity.js';
import { useStoreData } from 'stores/data';
import { useStoreResearch } from 'stores/research';
import { useStorePrestige } from 'stores/prestige';
import { useStoreShop } from 'stores/shop';

const SHOP_KEYS = ['cpu', 'hdd', 'ram', 'worker'] as const;

type ShopKey = (typeof SHOP_KEYS)[number];

export const useStoreStats = defineStore('storeStats', {
  state: () => ({
    gameTime: 0,
    maxShopBuy: {
      cpu: new Decimal(0),
      hdd: new Decimal(0),
      ram: new Decimal(0),
      worker: new Decimal(0),
    },
    maxEpicNumber: new Decimal(0),
    maxShopPoints: new Decimal(0),
    maxPrestigePoints: new Decimal(0),
    maxResearchPoints: new Decimal(0),
  }),
  getters: {
    save(state) {
      return {
        gameTime: state.gameTime,
        maxShopBuy: {
          cpu: state.maxShopBuy.cpu,
          hdd: state.maxShopBuy.hdd,
          ram: state.maxShopBuy.ram,
          worker: state.maxShopBuy.worker,
        },
        maxEpicNumber: state.maxEpicNumber,
        maxShopPoints: state.maxShopPoints,
        maxPrestigePoints: state.maxPrestigePoints,
        maxResearchPoints: state.maxResearchPoints,
      };
    },
  },
  actions: {
    processUpdate() {
      const storeData = useStoreData();
      const storeResearch = useStoreResearch();
      const storePrestige = useStorePrestige();
      const storeShop = useStoreShop();

      SHOP_KEYS.forEach((k: ShopKey) => {
        this.maxShopBuy[k] = Decimal.max(this.maxShopBuy[k], storeShop.list[k].value);
      });

      this.maxEpicNumber = Decimal.max(this.maxEpicNumber, storeData.epicNumber);
      this.maxShopPoints = Decimal.max(this.maxShopPoints, storeShop.points);
      this.maxResearchPoints = Decimal.max(this.maxResearchPoints, storeResearch.points);
      this.maxPrestigePoints = Decimal.max(this.maxPrestigePoints, storePrestige.points);
    },

    load(loaded: {
      gameTime?: number;
      maxShopBuy?: {
        cpu?: string;
        hdd?: string;
        ram?: string;
        worker?: string;
      };
      maxEpicNumber?: string;
      maxShopPoints?: string;
      maxResearchPoints?: string;
      maxPrestigePoints?: string;
    }) {
      this.gameTime = loaded?.gameTime ?? this.gameTime;

      const msb = loaded?.maxShopBuy ?? {};
      this.maxShopBuy.cpu = new Decimal(msb.cpu || this.maxShopBuy.cpu);
      this.maxShopBuy.hdd = new Decimal(msb.hdd || this.maxShopBuy.hdd);
      this.maxShopBuy.ram = new Decimal(msb.ram || this.maxShopBuy.ram);
      this.maxShopBuy.worker = new Decimal(msb.worker || this.maxShopBuy.worker);

      this.maxEpicNumber = new Decimal(loaded?.maxEpicNumber || this.maxEpicNumber);
      this.maxShopPoints = new Decimal(loaded?.maxShopPoints || this.maxShopPoints);
      this.maxPrestigePoints = new Decimal(loaded?.maxPrestigePoints || this.maxPrestigePoints);
      this.maxResearchPoints = new Decimal(loaded?.maxResearchPoints || this.maxResearchPoints);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreStats, import.meta.hot));
}
