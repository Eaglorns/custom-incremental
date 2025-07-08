<template>
  <q-page class="q-pa-lg">
    <div class="q-mb-md text-h6 text-bold row items-center">
      <q-icon name="fa-duotone fa-sparkles" color="amber" size="28px" class="q-mr-sm" />
      Выполнено достижений: {{ formatNumber(totalAchievements) }}
      <q-chip color="primary" text-color="white" class="q-ml-md">
        <q-icon name="fa-duotone fa-arrow-trend-up" left size="18px" />
        Бонус к производству: x{{ achievementBonus.toFixed(2) }}
      </q-chip>
    </div>
    <div class="q-gutter-md" style="display: flex; flex-wrap: wrap; align-items: flex-start">
      <q-card
        v-for="ach in achievements"
        :key="ach.id"
        class="q-pa-sm q-mb-xs"
        :class="achievementCardClass(ach)"
        style="
          width: 140px;
          margin-right: 16px;
          margin-bottom: 16px;
          display: inline-block;
          vertical-align: top;
        "
        flat
        bordered
        v-ripple
      >
        <q-tooltip
          v-if="ach.level !== undefined && ach.hint"
          class="bg-dark text-white tooltip-bordered"
          anchor="center middle"
          self="center middle"
          :offset="[0, 12]"
          style="max-width: 220px; min-width: 160px; padding: 10px; text-align: left"
        >
          <div class="text-subtitle2 text-bold q-mb-xs">{{ ach.title }}</div>
          <div class="text-caption q-mb-xs">{{ ach.hint }}</div>
        </q-tooltip>
        <div class="flex flex-center q-mb-xs">
          <q-icon :name="ach.icon" :color="iconColor(ach)" size="32px" />
        </div>
        <div class="text-subtitle2 text-center text-bold" :class="textColor(ach)">
          {{ ach.title }}
        </div>
        <div class="text-caption text-center" :class="textColor(ach, true)">
          {{ ach.description }}
        </div>
        <div v-if="ach.level !== undefined" class="text-center q-mt-xs">
          <q-badge :color="badgeColor(ach)" :text-color="badgeTextColor(ach)">
            Уровень: {{ formatNumber(ach.level) }}
          </q-badge>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useStoreGame } from 'src/stores/game';
import Decimal from 'break_eternity.js';
import { achievements } from 'src/constants/achievementMeta';

const storeGame = useStoreGame();
const formatNumber = storeGame.formatNumber;

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  level?: Decimal | undefined;
  hint?: string;
  levelHint?: string;
}

function getLevel(current: Decimal): Decimal {
  if (current.lt(100)) return new Decimal(0);
  return current.log10().div(2).floor();
}

function getEpicLevel(current: Decimal): Decimal {
  if (current.lt(1000000000)) return new Decimal(0);
  return current.div(1000).log10().div(9).floor();
}

function updateMaxCpuLevel() {
  const cpu = getLevel(storeGame.shop.cpu.value);
  if (cpu.gt(storeGame.achievements.cpuLevel)) {
    storeGame.achievements.cpuLevel = cpu;
  }
}
function updateMaxHardLevel() {
  const hard = getLevel(storeGame.shop.hard.value);
  if (hard.gt(storeGame.achievements.hardLevel)) {
    storeGame.achievements.hardLevel = hard;
  }
}
function updateMaxRamLevel() {
  const ram = getLevel(storeGame.shop.ram.value);
  if (ram.gt(storeGame.achievements.ramLevel)) {
    storeGame.achievements.ramLevel = ram;
  }
}
function updateMaxEpicLevel() {
  const epic = getEpicLevel(storeGame.epicNumber);
  if (epic.gt(storeGame.achievements.epicLevel)) {
    storeGame.achievements.epicLevel = epic;
  }
}

watch(() => storeGame.shop.cpu.value, updateMaxCpuLevel, { immediate: true });
watch(() => storeGame.shop.hard.value, updateMaxHardLevel, { immediate: true });
watch(() => storeGame.shop.ram.value, updateMaxRamLevel, { immediate: true });
watch(() => storeGame.epicNumber, updateMaxEpicLevel, { immediate: true });

function achievementCardClass(ach: Achievement) {
  if (ach.level !== undefined && ach.level.gt(0)) return 'bg-primary';
  if (ach.unlocked) return 'bg-positive';
  return 'bg-grey-3';
}
function iconColor(ach: Achievement) {
  if (ach.level !== undefined && ach.level.gt(0)) return 'white';
  if (ach.unlocked) return 'white';
  return 'grey-5';
}
function textColor(ach: Achievement, isDesc = false) {
  if (ach.level !== undefined && ach.level.gt(0)) return 'text-white';
  if (ach.unlocked) return isDesc ? 'text-grey-4' : 'text-white';
  return isDesc ? 'text-grey-6' : 'text-grey-7';
}
function badgeColor(ach: Achievement) {
  if (ach.level !== undefined && ach.level.gt(0)) return 'white';
  if (ach.unlocked) return ach.color || 'white';
  return 'grey-5';
}
function badgeTextColor(ach: Achievement) {
  if (ach.level !== undefined && ach.level.gt(0)) return 'primary';
  if (ach.unlocked) return 'positive';
  return 'grey-7';
}

const totalAchievements = computed(() => {
  return achievements.value.reduce((sum, ach) => {
    if (ach.level !== undefined) {
      return sum.plus(ach.level);
    }
    return sum.plus(ach.unlocked ? 1 : 0);
  }, new Decimal(0));
});

function recalcAchievementBonus() {
  const sum = storeGame.achievements.epicLevel
    .plus(storeGame.achievements.cpuLevel)
    .plus(storeGame.achievements.hardLevel)
    .plus(storeGame.achievements.ramLevel);
  storeGame.achievementBonus = sum.mul(0.01).plus(1);
}

watch(
  () => [
    storeGame.achievements.epicLevel.toString(),
    storeGame.achievements.cpuLevel.toString(),
    storeGame.achievements.hardLevel.toString(),
    storeGame.achievements.ramLevel.toString(),
  ],
  recalcAchievementBonus,
  { immediate: true },
);

const achievementBonus = computed(() => storeGame.achievementBonus);
</script>

<style lang="sass">
.tooltip-bordered
  border: 2px solid $primary
  border-radius: 8px
  box-shadow: 0 2px 12px rgba(0,0,0,0.18)
  padding: 10px
  max-width: 220px
  min-width: 160px
  text-align: left
</style>
