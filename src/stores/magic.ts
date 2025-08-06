import { defineStore, acceptHMRUpdate } from 'pinia';
import {
  ESSENCE_META,
  RUNE_META,
  type RuneRequirementMeta,
  RANKS,
  MAGE_SYLLABLES,
  MAGE_ICONS,
  MAGE_RANK_STYLE,
  monsterPrefixes,
  monsterSuffixes,
  monsterBases,
  monsterColors,
  monsterIcons,
  damageTypes,
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
  amount: Decimal;
}

export interface Rune {
  id: string;
  level: number;
}

interface DamageEffect {
  type:
    | 'poison'
    | 'bleeding'
    | 'death_curse'
    | 'ignite'
    | 'frost'
    | 'storm'
    | 'ultimate'
    | 'saturation';
  stacks: Decimal;
}

export interface Monster {
  id: number;
  name: string;
  level: Decimal;
  icon: string;
  iconColor: string;
  currentHealth: Decimal;
  maxHealth: Decimal;
  armor: Decimal;
  regeneration: Decimal;
  damageEffects: DamageEffect[];
  rewards: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
    amount: Decimal;
  }>;
}

export const useStoreMagic = defineStore('storeMagic', {
  state: () => ({
    mages: [] as Mage[],
    selectedMage: null as Mage | null,
    essences: ESSENCE_META.map((meta) => ({
      id: meta.id,
      amount: new Decimal(0),
    })) as Essence[],
    runes: RUNE_META.map((meta) => ({
      id: meta.id,
      level: 0,
    })) as Rune[],
    selectedRune: null as Rune | null,
    monsterKillCount: 11,
    monsterGeneratedLevel: 1,
    monster: {
      id: -1,
      name: '',
      level: new Decimal(1),
      icon: '',
      iconColor: '',
      currentHealth: new Decimal(1),
      maxHealth: new Decimal(1),
      armor: new Decimal(0),
      regeneration: new Decimal(0),
      damageEffects: [] as DamageEffect[],
      rewards: [] as Array<{
        id: string;
        name: string;
        icon: string;
        color: string;
        amount: Decimal;
      }>,
    } as Monster,
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
    getMageExperienceProgress: () => (mage: Mage) => {
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
    getMageRequiredExperience: () => (level: Decimal) => {
      return level.pow(1.5).mul(100);
    },
    getMageRankStyles: () => (rankClass: string) => {
      return MAGE_RANK_STYLE[rankClass as keyof typeof MAGE_RANK_STYLE] || MAGE_RANK_STYLE.novice;
    },
    monsterEffectiveArmor(state) {
      const stormEffect = state.monster.damageEffects.find((effect) => effect.type === 'storm');
      if (stormEffect?.stacks.gt(0)) {
        return state.monster.armor.div(stormEffect.stacks.pow(1 / 10));
      }
      return state.monster.armor;
    },

    monsterEffectiveRegeneration(state) {
      const frostEffect = state.monster.damageEffects.find((effect) => effect.type === 'frost');
      if (frostEffect?.stacks.gt(0)) {
        return Decimal.max(0, state.monster.regeneration.div(frostEffect.stacks.pow(1 / 10)));
      }
      return state.monster.regeneration;
    },
    save(state) {
      return {
        mages: state.mages,
        essences: state.essences,
        runes: state.runes,
        monsterKillCount: state.monsterKillCount,
        monsterGeneratedLevel: state.monsterGeneratedLevel,
        monster: state.monster,
      };
    },
  },

  actions: {
    processMage() {
      const getRandomRune = () => {
        const rand = Math.floor(Math.random() * RUNE_META.length);
        return RUNE_META[rand];
      };

      const calculateEffectAmount = (mage: Mage, runeId: string, runeLevel: number) => {
        let effectAmount = new Decimal(Math.max(1, runeLevel));
        if (mage.runeIds.includes(runeId) && mage.runeQuantities[runeId]) {
          const runeQuantity = mage.runeQuantities[runeId]?.toNumber() ?? 0;
          const bonus = effectAmount.mul(runeQuantity).div(100);
          effectAmount = effectAmount.plus(bonus);
        }
        return effectAmount;
      };

      const maybeAddRuneQuantity = (mage: Mage, runeId: string) => {
        if (Math.random() > 0.01) return;
        if (mage.runeIds.includes(runeId)) {
          if (mage.runeQuantities[runeId]) {
            mage.runeQuantities[runeId] = mage.runeQuantities[runeId].plus(1);
          } else {
            mage.runeQuantities[runeId] = new Decimal(1);
          }
        } else {
          mage.runeIds.push(runeId);
          mage.runeQuantities[runeId] = new Decimal(1);
        }
      };

      this.mages.forEach((mage) => {
        const randomRune = getRandomRune();
        if (!randomRune) return;
        const runeId = randomRune.id;
        if (!damageTypes.some((dt) => dt.type === runeId)) return;

        const runeState = this.runes.find((r) => r.id === runeId);
        const runeLevel = runeState ? runeState.level : 0;
        const effectAmount = calculateEffectAmount(mage, runeId, runeLevel);

        this.applyDamageEffect(runeId as DamageEffect['type'], effectAmount);
        maybeAddRuneQuantity(mage, runeId);
      });
    },
    processEffects() {
      this.monster.damageEffects.forEach((effect) => {
        if (this.monster.currentHealth.lte(0)) return;

        if (effect.type === 'death_curse') {
          if (this.monster.currentHealth.lte(effect.stacks)) {
            this.monster.currentHealth = new Decimal(0);
            this.onMonsterDefeated();
            return;
          }
        }

        let effectStack = new Decimal(0);

        if (effect.type === 'poison') effectStack = effect.stacks;
        if (effect.type === 'ignite') {
          effectStack = effect.stacks.div(10);
          effect.stacks = effect.stacks.mul(1.001);
        }
        if (effect.type === 'bleeding') {
          effectStack = effect.stacks.div(2);
          effect.stacks = effect.stacks.div(1.01);
        }
        this.monsterDealDamage(effectStack);
      });
    },
    monsterDealDamage(amount: Decimal) {
      const effectiveArmor = this.monsterEffectiveArmor;
      const armorReducedDamage = amount.minus(effectiveArmor);
      let bonusDamage = new Decimal(0);
      if (effectiveArmor.lt(0)) {
        bonusDamage = effectiveArmor.abs().sqrt();
      }
      const finalDamage = armorReducedDamage.plus(bonusDamage);
      if (finalDamage.gt(0)) {
        this.monster.currentHealth = Decimal.max(0, this.monster.currentHealth.minus(finalDamage));
      }
      if (this.monster.currentHealth.lte(0)) {
        this.onMonsterDefeated();
      }
    },
    onMonsterDefeated() {
      const saturationEffect = this.monster.damageEffects.find(
        (effect) => effect.type === 'saturation',
      );
      const saturationBonus = saturationEffect ? saturationEffect.stacks : new Decimal(0);
      const essenceMultiplier = new Decimal(saturationBonus).mul(0.01).plus(1);
      this.monster.rewards.forEach((reward) => {
        if (reward.id) {
          const finalAmount = reward.amount.mul(essenceMultiplier);
          this.addEssence(reward.id, finalAmount);
        }
      });
      const ultimateEffect = this.monster.damageEffects.find(
        (effect) => effect.type === 'ultimate',
      );
      const ultimateBonus = ultimateEffect ? ultimateEffect.stacks.toNumber() : 0;
      const expMultiplier = 1 + ultimateBonus * 0.01;
      const baseExp = this.monster.level;
      const finalExp = baseExp.mul(expMultiplier);
      this.mages.forEach((mage) => {
        this.addMageExperience(mage, finalExp.div(Math.random() * 9 + 1));
      });
      this.monsterKillCount--;
      if (this.monsterKillCount <= 0) {
        this.monsterGeneratedLevel++;
        this.monsterKillCount = 10;
      }

      this.generateMonster();
    },
    applyDamageEffect(type: DamageEffect['type'], amount: Decimal) {
      const damageType = damageTypes.find((dt) => dt.type === type);
      if (!damageType) return;

      const existingEffect = this.monster.damageEffects.find((effect) => effect.type === type);
      if (existingEffect) {
        existingEffect.stacks = existingEffect.stacks.plus(amount);
      } else {
        this.monster.damageEffects.push({
          type,
          stacks: new Decimal(amount),
        });
      }
      if (type === 'poison') {
        this.monsterDealDamage(existingEffect?.stacks || new Decimal(0));
      } else if (type === 'ignite') {
        this.monsterDealDamage(existingEffect?.stacks.div(2) || new Decimal(0));
      } else if (type === 'bleeding') {
        this.monsterDealDamage(existingEffect?.stacks.div(10) || new Decimal(0));
      }
    },
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
        maxExp: this.getMageRequiredExperience(new Decimal(2)).minus(
          this.getMageRequiredExperience(new Decimal(1)),
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

    addMageExperience(mage: Mage, amount: Decimal) {
      mage.currentExp = mage.currentExp.plus(amount);
      let totalExpForCurrentLevel = mage.currentExp;
      let currentLevel = mage.level;

      if (totalExpForCurrentLevel.gte(mage.maxExp)) {
        totalExpForCurrentLevel = totalExpForCurrentLevel.minus(mage.maxExp);
        currentLevel = currentLevel.plus(1);

        const currentLevelExp = this.getMageRequiredExperience(currentLevel);
        const nextLevelExp = this.getMageRequiredExperience(currentLevel.plus(1));
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
      return requirement ? this.getRequiredEssenceAmount(requirement) : 0;
    },

    getRuneMeta(id: string) {
      return RUNE_META.find((meta) => meta.id === id);
    },

    selectRune(rune: Rune) {
      const currentRune = this.runes.find((r) => r.id === rune.id);
      this.selectedRune = currentRune || rune;
    },

    getRequiredEssenceAmount(requirement: RuneRequirementMeta) {
      if (!this.selectedRune) return 0;
      return Math.floor(
        requirement.baseAmount * Math.pow(requirement.multiplier, this.selectedRune.level),
      );
    },

    canAffordEssenceRequirement(requirement: RuneRequirementMeta) {
      const essence = this.getEssenceById(requirement.essenceId);
      if (!essence) return false;
      return essence.amount.gte(this.getRequiredEssenceAmount(requirement));
    },

    canCraftRune() {
      if (!this.selectedRune) return false;
      const runeMeta = this.getRuneMeta(this.selectedRune.id);
      if (!runeMeta) return false;
      return runeMeta.requirements.every((requirement) =>
        this.canAffordEssenceRequirement(requirement),
      );
    },

    craftRune() {
      if (!this.selectedRune || !this.canCraftRune()) return;
      const runeMeta = this.getRuneMeta(this.selectedRune.id);
      if (!runeMeta) return;

      runeMeta.requirements.forEach((requirement) => {
        const essence = this.getEssenceById(requirement.essenceId);
        if (essence) {
          essence.amount = essence.amount.minus(this.getRequiredEssenceAmount(requirement));
        }
      });

      const runeInArray = this.runes.find((r) => r.id === this.selectedRune!.id);
      if (runeInArray) {
        runeInArray.level++;
        this.selectedRune = runeInArray;
      }
    },

    addEssence(essenceId: string, amount: Decimal) {
      const essence = this.getEssenceById(essenceId);
      if (essence) {
        essence.amount = essence.amount.plus(amount);
      }
    },

    selectWeightedSuffix() {
      if (Math.random() > 0.2) {
        return null;
      }
      const totalWeight = monsterSuffixes.reduce((sum, suffix) => sum + suffix.weight, 0);
      let random = Math.random() * totalWeight;
      for (const suffix of monsterSuffixes) {
        random -= suffix.weight;
        if (random <= 0) {
          return suffix;
        }
      }
      return monsterSuffixes[monsterSuffixes.length - 1];
    },

    generateRandomMonsterName() {
      const prefix = monsterPrefixes[Math.floor(Math.random() * monsterPrefixes.length)];
      const base = monsterBases[Math.floor(Math.random() * monsterBases.length)];
      const suffix = this.selectWeightedSuffix();
      const icon = monsterIcons[Math.floor(Math.random() * monsterIcons.length)];
      const color = monsterColors[Math.floor(Math.random() * monsterColors.length)];

      let name = `${prefix} ${base}`;
      if (suffix) {
        name += ` ${suffix.name}`;
      }

      return {
        name,
        icon,
        color,
        suffix: suffix || null,
      };
    },
    generateMonster() {
      const monster = this.generateRandomMonsterName();
      this.monster.name = monster.name;
      this.monster.icon = monster.icon || 'fas fa-question';
      this.monster.iconColor = monster.color || '#ffffff';
      this.monster.level = new Decimal(this.monsterGeneratedLevel);

      let baseHealth = new Decimal(this.monster.level.mul(50).plus(100));
      let baseArmor = new Decimal(this.monster.level.mul(2)).plus(Math.random() * 10);
      let baseRegen = new Decimal(this.monster.level.mul(7.5)).plus(Math.random() * 15);

      const rewardCount = monster.suffix?.rewardCount || 1;

      if (monster.suffix) {
        baseHealth = baseHealth.mul(monster.suffix.healthMult);
        baseArmor = baseArmor.mul(monster.suffix.armorMult);
        baseRegen = baseRegen.mul(monster.suffix.regenMult);
      }

      this.monster.maxHealth = baseHealth;
      this.monster.currentHealth = baseHealth;
      this.monster.armor = baseArmor;
      this.monster.regeneration = baseRegen;

      this.monster.id++;
      this.monster.damageEffects = [];
      this.generateRewards(rewardCount);
    },
    generateRewards(rewardCount: number = 1) {
      const availableEssences = [...ESSENCE_META];
      this.monster.rewards = [];

      for (let i = 0; i < rewardCount && availableEssences.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * availableEssences.length);
        const essence = availableEssences.splice(randomIndex, 1)[0];

        this.monster.rewards.push({
          id: essence?.id || `essence`,
          name: essence?.name || 'Неизвестная эссенция',
          icon: essence?.icon || 'fas fa-question',
          color: essence?.color || '#ffffff',
          amount: this.monster.level.mul(Math.random() + 1),
        });
      }
    },
    load(saveData?: {
      mages?: Mage[];
      essences?: Essence[];
      runes?: Rune[];
      monsterKillCount?: number;
      monsterGeneratedLevel?: number;
      monster?: Monster;
    }) {
      if (saveData) {
        this.mages = saveData.mages || [];
        this.essences = saveData.essences || this.essences;
        this.runes = saveData.runes || this.runes;
        this.monsterKillCount = saveData.monsterKillCount ?? 10;
        this.monsterGeneratedLevel = saveData.monsterGeneratedLevel ?? 1;
        if (saveData.monster) {
          this.monster = saveData.monster;
        }
      }
      if (this.monster.name === '') {
        this.generateMonster();
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStoreMagic, import.meta.hot));
}
