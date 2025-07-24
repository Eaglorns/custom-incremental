import { defineStore, acceptHMRUpdate } from 'pinia';
import Decimal from 'break_eternity.js';
import { useStoreResearch } from 'stores/research';
import { useStoreShop } from 'stores/shop';
import { useStoreAchievement } from 'stores/achievement';
import { useStorePrestige } from 'stores/prestige';

export const useStoreData = defineStore('storeData', {
  state: () => ({
    version: '0.0.0',
    epicNumber: new Decimal('0'),
    multiplierEpicNumber: new Decimal(1),
  }),

  getters: {
    formatNumber: () => {
      function formatSmall(num: Decimal, fixed?: boolean) {
        if (fixed) return num.toFixed(3);
        if (num.eq(num.floor())) return num.toFixed(0);
        return num.toFixed(2);
      }

      function formatScientific(num: Decimal) {
        const exp = num.log10().floor();
        const mantissa = num.div(Decimal.pow(10, exp));
        return mantissa.eq(mantissa.floor())
          ? `${mantissa.toFixed(0)}e${exp.toFixed(0)}`
          : `${mantissa.toFixed(3)}e${exp.toFixed(0)}`;
      }

      function formatE(num: Decimal, value: Decimal) {
        const exp = value.floor();
        const mantissa10 = Math.pow(10, num.log10().minus(exp).toNumber());
        if (Math.abs(mantissa10 - 1) < 1e-6) {
          return `e${exp.toFixed(0)}`;
        }
        return Number.isInteger(mantissa10)
          ? `${mantissa10.toFixed(0)}e${exp.toFixed(0)}`
          : `${mantissa10.toFixed(3)}e${exp.toFixed(0)}`;
      }

      function formatTetration(value: Decimal, tetration: number) {
        return value.eq(value.floor())
          ? `${value.toFixed(0)}[↑↑${tetration + 1}]`
          : `${value.toFixed(4)}[↑↑${tetration + 1}]`;
      }

      function formatSuperTetration(tetration: number) {
        let superTetration = 0;
        let t = tetration;
        while (t >= 6) {
          t = Math.log10(t);
          superTetration++;
        }
        return Number.isInteger(t)
          ? `${t.toFixed(0)}[↑↑↑${superTetration + 1}]`
          : `${t.toFixed(4)}[↑↑↑${superTetration + 1}]`;
      }

      return (num: Decimal, fixed?: boolean) => {
        if (num.lt(1e6)) {
          return formatSmall(num, fixed);
        }
        let value = num;
        let tetration = 0;
        while (value.gte(1e6)) {
          value = value.log10();
          tetration++;
        }
        if (tetration === 0) {
          return formatScientific(num);
        }
        if (tetration === 1) {
          return formatE(num, value);
        }
        if (tetration < 10) {
          return formatTetration(value, tetration);
        }
        return formatSuperTetration(tetration);
      };
    },

    getMultiplierEpicNumber: (state): Decimal => {
      const storeResearch = useStoreResearch();
      const base = state.multiplierEpicNumber;
      if (base.lt(1)) return new Decimal(1);
      const research = storeResearch.list.epicNumberMultiplierDecrease;
      const bonus = research.level.gt(0) ? research.bonus.pow(research.level) : new Decimal(1);
      const reduced = base.div(new Decimal(100).div(bonus)).log(3);
      return Decimal.max(new Decimal(1), new Decimal(1).add(reduced));
    },

    save(state) {
      return {
        version: state.version,
        epicNumber: state.epicNumber,
        multiplierEpicNumber: state.multiplierEpicNumber,
      };
    },
  },

  actions: {
    processGiveEpicNumber() {
      const storeData = useStoreData();
      const storeShop = useStoreShop();
      const storeResearch = useStoreResearch();
      const storeAchievement = useStoreAchievement();
      const storePrestige = useStorePrestige();
      const parShopCPU = storeShop.list.cpu.value;
      const parResearchCPU = storeResearch.list.cpuPow;
      const prestigeMul = storePrestige.points.mul(0.01).add(1);
      const result = parShopCPU
        .pow(parResearchCPU.bonus.mul(parResearchCPU.level).plus(1))
        .mul(prestigeMul)
        .mul(storeAchievement.achievementBonus);
      storeData.epicNumber = storeData.epicNumber.plus(result);
    },

    load(loaded: { version: string; epicNumber: string; multiplierEpicNumber: string }) {
      this.version = loaded.version;
      this.epicNumber = new Decimal(loaded.epicNumber);
      this.multiplierEpicNumber = new Decimal(loaded.multiplierEpicNumber);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreData, import.meta.hot));
}
