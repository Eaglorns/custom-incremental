import { defineStore, acceptHMRUpdate } from 'pinia';
import {
  ESSENCE_META,
  RUNE_META,
  type RuneRequirementMeta,
  RANKS,
  MAGE_SYLLABLES,
  MAGE_ICONS,
  MAGE_RANK_STYLE,
} from '../constants/magicMeta';
import Decimal from 'break_eternity.js';

export interface MageRank {
  id: number;
  name: string;
  class: string;
  minLevel: Decimal;
  color: string;
}

export interface Mage {
  id: number;
  name: string;
  level: Decimal;
  currentExp: Decimal;
  maxExp: Decimal;
  icon: string;
  iconColor: string;
  runeIds: string[];
  runeQuantities: Record<string, Decimal>;
  rank: MageRank;
}

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
    mages: [] as Mage[],
    selectedMage: null as Mage | null,
    maxMages: 24,
    essences: ESSENCE_META.map((meta) => ({
      id: meta.id,
      amount: Math.floor(Math.random() * 50) + 10,
    })) as Essence[],
    runes: RUNE_META.map((meta) => ({
      id: meta.id,
      level: 0,
    })) as Rune[],
    selectedRune: null as Rune | null,
  }),

  getters: {
    getMageById: (state) => (id: number) => {
      return state.mages.find((mage) => mage.id === id);
    },
    getMageRank: () => (level: Decimal) => {
      for (let i = RANKS.length - 1; i >= 0; i--) {
        const rank = RANKS[i];
        if (rank && level.gte(rank.minLevel)) {
          return rank;
        }
      }
      return RANKS[0]!;
    },
    getExperienceProgress: () => (mage: Mage) => {
      if (mage.maxExp.lte(0)) {
        return {
          current: mage.currentExp,
          max: new Decimal(1),
          percentage: 0,
        };
      }

      return {
        current: mage.currentExp,
        max: mage.maxExp,
        percentage: mage.currentExp.div(mage.maxExp).mul(100).round().toNumber(),
      };
    },
    getRequiredExperience: () => (level: Decimal) => {
      return level.pow(1.5).mul(100);
    },
    getRankStyles: () => (rankClass: string) => {
      return MAGE_RANK_STYLE[rankClass as keyof typeof MAGE_RANK_STYLE] || MAGE_RANK_STYLE.novice;
    },
  },

  actions: {
    hireMage() {
      const generateUniqueName = (): string => {
        let attempts = 0;
        const maxAttempts = 100;
        const syllables = MAGE_SYLLABLES.split(' ');
        while (attempts < maxAttempts) {
          const syllable1 = syllables[Math.floor(Math.random() * syllables.length)]!;
          const syllable2 = syllables[Math.floor(Math.random() * syllables.length)]!;
          const generatedName =
            (syllable1 + syllable2).charAt(0).toUpperCase() + (syllable1 + syllable2).slice(1);
          if (!this.mages.some((mage) => mage.name === generatedName)) {
            return generatedName;
          }
          attempts++;
        }
        return `Маг${this.mages.length + 1}`;
      };

      const newName = generateUniqueName();
      const randomIcon = MAGE_ICONS[Math.floor(Math.random() * MAGE_ICONS.length)]!;

      const newMage: Mage = {
        id: Date.now(),
        name: newName,
        level: new Decimal(1),
        currentExp: new Decimal(0),
        maxExp: this.getRequiredExperience(new Decimal(2)).minus(
          this.getRequiredExperience(new Decimal(1)),
        ),
        icon: randomIcon.icon,
        iconColor: randomIcon.color,
        runeIds: [],
        runeQuantities: {},
        rank: RANKS[0]!,
      };

      this.mages.push(newMage);
      this.selectedMage ??= newMage;
    },

    updateMageRank(mage: Mage) {
      mage.rank = this.getMageRank(mage.level);
    },

    selectMage(mage: Mage) {
      this.selectedMage = mage;
    },

    addExperience(mage: Mage, amount: Decimal) {
      mage.currentExp = mage.currentExp.plus(amount);
      let totalExpForCurrentLevel = mage.currentExp;
      let currentLevel = mage.level;

      if (totalExpForCurrentLevel.gte(mage.maxExp)) {
        totalExpForCurrentLevel = totalExpForCurrentLevel.minus(mage.maxExp);
        currentLevel = currentLevel.plus(1);

        const currentLevelExp = this.getRequiredExperience(currentLevel);
        const nextLevelExp = this.getRequiredExperience(currentLevel.plus(1));
        mage.maxExp = nextLevelExp.minus(currentLevelExp);
      }
      mage.level = currentLevel;
      mage.currentExp = totalExpForCurrentLevel;
      this.updateMageRank(mage);
    },

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

      runeMeta.requirements.forEach((requirement) => {
        const essence = this.getEssenceById(requirement.essenceId);
        if (essence) {
          essence.amount -= this.getRequiredAmount(requirement);
        }
      });

      const runeInArray = this.runes.find((r) => r.id === this.selectedRune!.id);
      if (runeInArray) {
        runeInArray.level++;
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
