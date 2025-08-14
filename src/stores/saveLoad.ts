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
import { useStoreMagic } from 'stores/magic';
import Decimal from 'break_eternity.js';

const STORAGE_KEY = 'save';
const SECRET = 'incremental';

function decryptOrPassThrough(input: string, secret: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(input, secret);
    const out = bytes.toString(CryptoJS.enc.Utf8);
    return out || input;
  } catch {
    return input;
  }
}

function parseJsonSafe(str: string): unknown {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

function readVersion(section: unknown): string | number | undefined {
  if (section && typeof section === 'object') {
    const v = (section as Record<string, unknown>).version;
    if (typeof v === 'string' || typeof v === 'number') return v;
  }
  return undefined;
}

function isDecimalLike(v: unknown): v is Decimal {
  if (!v || typeof v !== 'object') return false;
  const obj = v as Record<string, unknown>;
  return (
    typeof (v as { toString?: unknown }).toString === 'function' &&
    'mantissa' in obj &&
    'exponent' in obj &&
    'sign' in obj
  );
}

const jsonReplacer = (_key: string, value: unknown): unknown => {
  if (value instanceof Decimal) return value.toString();
  if (isDecimalLike(value)) return value.toString();
  return value;
};

function hasLegacyDecimal(x: unknown): x is { __decimal__: string } {
  return (
    !!x &&
    typeof x === 'object' &&
    '__decimal__' in (x as Record<string, unknown>) &&
    typeof (x as Record<string, unknown>)['__decimal__'] === 'string'
  );
}

function normalizeLegacyDecimals(x: unknown): unknown {
  if (hasLegacyDecimal(x)) return (x as { __decimal__: string }).__decimal__;
  if (Array.isArray(x)) return x.map((it) => normalizeLegacyDecimals(it));
  if (x && typeof x === 'object') {
    const src = x as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(src)) out[k] = normalizeLegacyDecimals(src[k]);
    return out;
  }
  return x;
}

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
        const plainState = JSON.stringify(saveData, jsonReplacer);
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
      if (typeof encrypted !== 'string' || encrypted.length === 0) {
        storeData.version = storeGame.version;
        return;
      }

      const decrypted = decryptOrPassThrough(encrypted, SECRET);
      const parsed = parseJsonSafe(decrypted);
      if (!parsed || typeof parsed !== 'object') {
        storeData.version = storeGame.version;
        return;
      }

      const needLegacyNormalize = decrypted.includes('"__decimal__"');
      const loaded = (needLegacyNormalize ? normalizeLegacyDecimals(parsed) : parsed) as Record<
        string,
        unknown
      >;
      const sameVersion = readVersion(loaded['data']) === storeGame.version;

      const loaders: Array<readonly [key: string, fn: (v: unknown) => void]> = [
        ['data', (v) => (storeData.load as (x: unknown) => void)(v)],
        ['research', (v) => (storeResearch.load as (x: unknown) => void)(v)],
        ['prestige', (v) => (storePrestige.load as (x: unknown) => void)(v)],
        ['shop', (v) => (storeShop.load as (x: unknown) => void)(v)],
        ['automatic', (v) => (storeAutomatic.load as (x: unknown) => void)(v)],
        ['magic', (v) => (storeMagic.load as (x: unknown) => void)(v)],
        ['achievement', (v) => (storeAchievement.load as (x: unknown) => void)(v)],
        ['stats', (v) => (storeStats.load as (x: unknown) => void)(v)],
        ['setting', (v) => (storeSetting.load as (x: unknown) => void)(v)],
      ];

      loaders.forEach(([key, fn]) => {
        const section = loaded[key];
        if (section != null) fn(section);
      });

      if (!sameVersion) {
        storeData.version = storeGame.version;
        console.log('load game (partial/migrated)');
      } else {
        console.log('load game');
      }
    },
    clearSave() {
      LocalStorage.remove(STORAGE_KEY);
    },
    exportSave(): string {
      const encrypted = LocalStorage.getItem(STORAGE_KEY);
      return typeof encrypted === 'string' ? encrypted : '';
    },
    importSave(payload: string) {
      if (typeof payload !== 'string' || payload.length === 0) return;
      LocalStorage.setItem(STORAGE_KEY, payload);
      this.loadGame();
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreSaveLoad, import.meta.hot));
}
