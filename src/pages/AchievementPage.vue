<template>
  <q-page class="q-pa-lg">
    <div class="q-mb-md text-h6 text-bold row items-center">
      <q-icon :name="iconStyle + 'fa-sparkles'" color="amber" size="28px" class="q-mr-sm" />
      Выполнено: {{ formatNumber(totalAchievements) }}
      <q-chip color="primary" text-color="white" class="q-ml-md">
        <q-icon :name="iconStyle + 'fa-arrow-trend-up'" left size="18px" />
        Бонус: x{{ achievementBonus.toFixed(2) }}
      </q-chip>
    </div>
    <div
      class="q-gutter-md"
      style="min-width: 100%; display: flex; flex-wrap: wrap; align-items: center"
    >
      <q-card
        v-for="ach in achievements"
        :key="ach.key"
        class="q-pa-sm q-mb-xs achievement-card-fixed"
        :class="achievementCardClass(ach)"
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
        <div v-if="ach.level !== undefined" class="achievement-badge-bottom text-center q-mt-xs">
          <q-badge :color="badgeColor(ach)" :text-color="badgeTextColor(ach)">
            Уровень: {{ formatNumber(ach.level) }}
          </q-badge>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStoreData } from 'stores/data';
import { useStoreAchievement } from 'stores/achievement';
import Decimal from 'break_eternity.js';
import { achievements } from 'src/constants/achievementMeta';
import { useStoreSetting } from 'stores/setting';

const storeData = useStoreData();
const storeAchievement = useStoreAchievement();
const storeSetting = useStoreSetting();

const iconStyle = computed(() => {
  return storeSetting.iconStyle;
});

const formatNumber = storeData.formatNumber;

interface Achievement {
  key: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  level?: Decimal | undefined;
  hint?: string;
  levelHint?: string;
}

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

const achievementBonus = computed(() => {
  return storeAchievement.achievementBonus;
});
</script>

<style lang="sass" scoped>
.achievement-card-fixed
  width: 140px
  min-height: 220px
  max-height: 220px
  display: flex
  flex-direction: column
  justify-content: flex-start
  align-items: stretch
  margin: 5px
  box-sizing: border-box

.achievement-card-fixed > .flex,
.achievement-card-fixed > .text-subtitle2,
.achievement-card-fixed > .text-caption
  flex-shrink: 0

.achievement-badge-bottom
  margin-top: auto

.tooltip-bordered
  border: 2px solid $primary
  border-radius: 8px
  box-shadow: 0 2px 12px rgba(0,0,0,0.18)
  padding: 10px
  max-width: 220px
  min-width: 160px
  text-align: left

  @media (max-width: 700px)
    .q-page.q-pa-lg
      padding: 8px !important
    .q-mb-md.text-h6.text-bold.row.items-center
      flex-direction: column !important
      align-items: flex-start !important
      font-size: 16px !important
      .q-chip
        margin-left: 0 !important
        margin-top: 8px !important
    .q-gutter-md
      flex-wrap: wrap
      gap: 8px !important
      margin-left: 0 !important
      margin-right: 0 !important
    .q-card
      width: 110px !important
      min-width: 90px !important
      margin-right: 8px !important
      margin-bottom: 8px !important
      padding: 4px !important
      font-size: 13px !important
    .q-tooltip.tooltip-bordered
      max-width: 180px !important
      min-width: 100px !important
      padding: 6px !important
</style>
