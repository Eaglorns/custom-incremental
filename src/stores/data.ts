import { defineStore, acceptHMRUpdate } from 'pinia';
import Decimal from 'break_eternity.js';
import { useStoreResearch } from 'stores/research';

export const useStoreData = defineStore('storeData', {
  state: () => ({
    version: '0.0.0',
    epicNumber: new Decimal('1e2500'),
    multiplierEpicNumber: new Decimal(1),
  }),

  getters: {
    formatNumber: () => (num: Decimal, fixed?: boolean) => {
      if (num.lt(1e6)) return fixed ? num.toFixed(3) : num.toFixed(0);
      let value = num;
      let tetration = 0;
      while (value.gte(1e6)) {
        value = value.log10();
        tetration++;
      }
      if (tetration === 0) {
        const exp = num.log10().floor();
        return `${num.div(Decimal.pow(10, exp)).toFixed(3)}e${exp.toFixed(0)}`;
      }
      if (tetration === 1) {
        const exp = value.floor();
        const mantissa10 = Math.pow(10, num.log10().minus(exp).toNumber());
        return Math.abs(mantissa10 - 1) < 1e-6
          ? `e${exp.toFixed(0)}`
          : `${mantissa10.toFixed(3)}e${exp.toFixed(0)}`;
      }
      if (tetration < 10) return `${value.toFixed(4)}[↑↑${tetration + 1}]`;
      let superTetration = 0;
      let t = tetration;
      while (t >= 6) {
        t = Math.log10(t);
        superTetration++;
      }
      return `${t.toFixed(4)}[↑↑↑${superTetration + 1}]`;
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
