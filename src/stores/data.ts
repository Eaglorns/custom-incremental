import { defineStore, acceptHMRUpdate } from 'pinia';
import Decimal from 'break_eternity.js';
import { useStoreResearch } from 'stores/research';
import { useStoreShop } from 'stores/shop';
import { useStoreAchievement } from 'stores/achievement';
import { useStorePrestige } from 'stores/prestige';
import { useStoreEternity } from './eternity';

const SECS_IN_MIN = 60;
const SECS_IN_HOUR = 60 * SECS_IN_MIN;
const SECS_IN_DAY = 24 * SECS_IN_HOUR;
const SECS_IN_YEAR = 365 * SECS_IN_DAY;
const INFINITY_THRESHOLD_SECONDS = new Decimal(SECS_IN_YEAR).mul(100);

const D1 = new Decimal(1);
const D1_015 = new Decimal(1.015);

function fmtYears(y: number, d: number): string {
  if (y > 10) return `${y} г`;
  if (d) return `${y} г ${d} д`;
  return `${y} г`;
}

function fmtDays(d: number, h: number): string {
  if (d > 10) return `${d} д`;
  if (h) return `${d} д ${h} ч`;
  return `${d} д`;
}

function fmtHours(h: number, m: number): string {
  if (m) return `${h} ч ${m} м`;
  return `${h} ч`;
}

function fmtMinutes(m: number, s: number): string {
  if (s) return `${m} м ${s} с`;
  return `${m} м`;
}

export const useStoreData = defineStore('storeData', {
  state: () => ({
    version: '0.0.0',
    epicNumber: new Decimal(0),
    stage: 0,
    stageZero: 0,
    stageAchievement: 1,
    stageScientist: 2,
    stageResearch: 3,
    stageAutomatic: 4,
    stagePrestige: 5,
    stageEternity: 6,
    stageMagic: 7,
    stageInfinity: 8,
    multiplierEpicNumber: new Decimal(0),
    currentTab: 'shop',
  }),

  getters: {
    formatNumber: () => {
      function cleanExp(str: string) {
        str = str.replace(/\.0+([e[])/, '$1').replace(/(\.\d*[1-9])0+([e[])/, '$1$2');
        return str.replace(/e(-?\d{4,})/g, (_m, p1: string) => {
          const sign = p1.startsWith('-') ? '-' : '';
          const digits = sign ? p1.slice(1) : p1;
          const len = digits.length;
          const lead = digits.slice(0, 3);
          const mantissa = lead.length > 1 ? `${lead[0]}.${lead.slice(1)}` : lead[0];
          const expPart = len - 1;
          return `e${sign}${mantissa}e+${expPart}`;
        });
      }

      function formatSmall(num: Decimal, fixed?: boolean) {
        if (fixed) return num.toFixed(3);
        if (num.eq(num.floor())) return num.toFixed(0);
        return num.toFixed(2);
      }

      function formatScientific(num: Decimal) {
        const exp = num.log10().floor();
        const mantissa = num.div(Decimal.pow(10, exp));
        let expStr: string;
        if (exp.abs().gte(1000)) {
          const k = exp.log10().floor();
          const m = exp.div(Decimal.pow(10, k.toNumber()));
          expStr = `${m.toNumber().toFixed(2)}e${k.toFixed(0)}`;
        } else {
          expStr = exp.toFixed(0);
        }
        const str = mantissa.eq(mantissa.floor())
          ? `${mantissa.toFixed(0)}e${expStr}`
          : `${mantissa.toFixed(2)}e${expStr}`;
        return cleanExp(str);
      }

      function formatE(num: Decimal, value: Decimal) {
        const exp = value.floor();
        const frac = num.log10().minus(exp);
        const mantissa10 = Math.pow(10, frac.toNumber());
        if (Math.abs(mantissa10 - 1) < 1e-6) {
          return `e${exp.toFixed(0)}`;
        }
        let expStr: string;
        if (exp.abs().gte(1000)) {
          const k = exp.log10().floor();
          const m = exp.div(Decimal.pow(10, k.toNumber()));
          expStr = `${m.toNumber().toFixed(2)}e${k.toFixed(0)}`;
        } else {
          expStr = exp.toFixed(0);
        }
        const str = Number.isInteger(mantissa10)
          ? `${mantissa10.toFixed(0)}e${expStr}`
          : `${mantissa10.toFixed(2)}e${expStr}`;
        return cleanExp(str);
      }

      function formatTetration(value: Decimal, tetration: number) {
        const str = value.eq(value.floor())
          ? `${value.toFixed(0)}[↑↑${tetration + 1}]`
          : `${value.toFixed(2)}[↑↑${tetration + 1}]`;
        return cleanExp(str);
      }

      function formatSuperTetration(tetration: number) {
        let superTetration = 0;
        let t = tetration;
        while (t >= 6) {
          t = Math.log10(t);
          superTetration++;
        }
        const str = Number.isInteger(t)
          ? `${t.toFixed(0)}[↑↑↑${superTetration + 1}]`
          : `${t.toFixed(2)}[↑↑↑${superTetration + 1}]`;
        return cleanExp(str);
      }

      function computeTetrationState(n: Decimal): { t: number; value: Decimal } {
        let t = 0;
        let v = n;
        while (v.gte(1e6)) {
          v = v.log10();
          t++;
        }
        return { t, value: v };
      }

      function formatNumberCore(n: Decimal, fixed?: boolean): string {
        if (n.lt(1e6)) return formatSmall(n, fixed);
        const { t, value } = computeTetrationState(n);
        if (t === 0) return formatScientific(n);
        if (t === 1) return formatE(n, value);
        if (t < 10) return formatTetration(value, t);
        return formatSuperTetration(t);
      }

      return (num: Decimal, fixed?: boolean) => formatNumberCore(num, fixed);
    },

    formatTime: () => {
      function formatTimeCore(seconds: Decimal): string {
        if (seconds.lte(0)) return '0 с';

        const total = seconds.round();
        if (total.gte(INFINITY_THRESHOLD_SECONDS)) return '∞';

        const years = total.div(SECS_IN_YEAR).floor();
        let remainder = total.mod(SECS_IN_YEAR);
        const days = remainder.div(SECS_IN_DAY).floor();
        remainder = remainder.mod(SECS_IN_DAY);
        const hours = remainder.div(SECS_IN_HOUR).floor();
        remainder = remainder.mod(SECS_IN_HOUR);
        const minutes = remainder.div(SECS_IN_MIN).floor();
        const secs = remainder.mod(SECS_IN_MIN).floor();

        const y = years.toNumber();
        const d = days.toNumber();
        const h = hours.toNumber();
        const m = minutes.toNumber();
        const s = secs.toNumber();

        const yOut = fmtYears(y, d);
        const dOut = fmtDays(d, h);
        const hOut = fmtHours(h, m);
        const mOut = fmtMinutes(m, s);

        const pairs: Array<[number, string]> = [
          [y, yOut],
          [d, dOut],
          [h, hOut],
          [m, mOut],
        ];

        for (const [val, out] of pairs) {
          if (val >= 1) return out;
        }

        return `${s} с`;
      }

      return (seconds: Decimal): string => formatTimeCore(seconds);
    },

    getMultiplierEpicNumber: (state): Decimal => {
      const storeResearch = useStoreResearch();
      const base = state.multiplierEpicNumber;
      if (base.lt(1)) return D1;
      const research = storeResearch.base.epicNumberMultiplierDecrease;
      const bonus = research.level.gt(0) ? research.bonus.pow(research.level) : D1;
      const reduced = base.log(D1_015).div(new Decimal(250).div(bonus));
      return Decimal.max(D1, D1.add(reduced));
    },

    epicNumberGain: (): Decimal => {
      const storeShop = useStoreShop();
      const storeResearch = useStoreResearch();
      const storeAchievement = useStoreAchievement();
      const storePrestige = useStorePrestige();
      const storeEternity = useStoreEternity();
      const parShopCPU = storeShop.list.cpu.value;
      const parResearchCPU = storeResearch.base.cpuPow;
      const prestigeMul = storePrestige.points.mul(0.01).add(1);
      const prestigeUpgradeBonus = storePrestige.upgrades.prestigeBonus.level.mul(0.01).add(1);
      const cpuPowExp = parResearchCPU.bonus.mul(parResearchCPU.level).plus(1);
      const eternityBonus = storeEternity.points.plus(1);
      const result = parShopCPU
        .pow(cpuPowExp)
        .mul(prestigeMul)
        .mul(prestigeUpgradeBonus)
        .mul(storeAchievement.achievementBonus)
        .mul(eternityBonus);
      return result;
    },

    save(state) {
      return {
        version: state.version,
        epicNumber: state.epicNumber,
        multiplierEpicNumber: state.multiplierEpicNumber,
        stage: state.stage,
      };
    },
  },

  actions: {
    processGiveEpicNumber() {
      this.epicNumber = this.epicNumber.plus(this.epicNumberGain);
    },

    load(loaded: {
      version?: string;
      epicNumber?: string;
      multiplierEpicNumber?: string;
      stage?: number;
    }) {
      this.version = loaded?.version ?? this.version;
      this.epicNumber = new Decimal(loaded?.epicNumber ?? '0');
      this.multiplierEpicNumber = new Decimal(loaded?.multiplierEpicNumber ?? '0');
      this.stage = loaded?.stage ?? 0;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreData, import.meta.hot));
}
