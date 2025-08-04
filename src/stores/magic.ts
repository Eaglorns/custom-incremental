import { defineStore, acceptHMRUpdate } from 'pinia';
import { ESSENCE_META, RUNE_META, type RuneRequirementMeta } from '../constants/magicMeta';

export interface Essence {
  id: string;
  amount: number;
}

export interface Rune {
  id: string;
  level: number;
}

export const useStoreMagic = defineStore('storeMagic', {
  state: () => ({
    // Эссенции - только количество, остальное в мета
    essences: ESSENCE_META.map((meta) => ({
      id: meta.id,
      amount: Math.floor(Math.random() * 50) + 10, // Случайное начальное количество
    })) as Essence[],

    // Руны - только уровень, остальное в мета
    runes: RUNE_META.map((meta) => ({
      id: meta.id,
      level: 0,
    })) as Rune[],

    // Выбранная руна
    selectedRune: null as Rune | null,
  }),

  getters: {},

  actions: {
    getEssenceById(id: string) {
      return this.essences.find((essence) => essence.id === id);
    },

    getEssenceMeta(id: string) {
      return ESSENCE_META.find((meta) => meta.id === id);
    },

    getRequiredEssence(essenceId: string) {
      if (!this.selectedRune) return 0;
      const runeMeta = RUNE_META.find((meta) => meta.id === this.selectedRune!.id);
      if (!runeMeta) return 0;
      const requirement = runeMeta.requirements.find((req) => req.essenceId === essenceId);
      return requirement ? this.getRequiredAmount(requirement) : 0;
    },

    getRuneMeta(id: string) {
      return RUNE_META.find((meta) => meta.id === id);
    },

    selectRune(rune: Rune) {
      // Всегда получаем актуальную руну из массива
      const currentRune = this.runes.find((r) => r.id === rune.id);
      this.selectedRune = currentRune || rune;
    },

    getRequiredAmount(requirement: RuneRequirementMeta) {
      if (!this.selectedRune) return 0;
      return Math.floor(
        requirement.baseAmount * Math.pow(requirement.multiplier, this.selectedRune.level),
      );
    },

    canAffordRequirement(requirement: RuneRequirementMeta) {
      const essence = this.getEssenceById(requirement.essenceId);
      if (!essence) return false;
      return essence.amount >= this.getRequiredAmount(requirement);
    },

    canCraftRune() {
      if (!this.selectedRune) return false;
      const runeMeta = this.getRuneMeta(this.selectedRune.id);
      if (!runeMeta) return false;
      return runeMeta.requirements.every((requirement) => this.canAffordRequirement(requirement));
    },

    craftRune() {
      if (!this.selectedRune || !this.canCraftRune()) return;
      const runeMeta = this.getRuneMeta(this.selectedRune.id);
      if (!runeMeta) return;

      // Тратим эссенции
      runeMeta.requirements.forEach((requirement) => {
        const essence = this.getEssenceById(requirement.essenceId);
        if (essence) {
          essence.amount -= this.getRequiredAmount(requirement);
        }
      });

      // Находим руну в массиве и повышаем её уровень
      const runeInArray = this.runes.find((r) => r.id === this.selectedRune!.id);
      if (runeInArray) {
        runeInArray.level++;
        // Обновляем выбранную руну ссылкой на актуальную руну из массива
        this.selectedRune = runeInArray;
      }
    },

    addEssence(essenceId: string, amount: number) {
      const essence = this.getEssenceById(essenceId);
      if (essence) {
        essence.amount += amount;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreMagic, import.meta.hot));
}
