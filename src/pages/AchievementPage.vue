<template>
  <q-page class="achievement-page">
    <div class="achievement-container">
      <div class="achievement-header">
        <q-icon name="fa-duotone fa-sparkles" color="amber" size="28px" class="q-mr-sm" />
        Выполнено: {{ formatNumber(totalAchievements) }}
        <q-chip color="primary" text-color="white" class="achievement-header__chip">
          <q-icon name="fa-duotone fa-arrow-trend-up" left size="18px" />
          Бонус: x{{ achievementBonus.toFixed(2) }}
        </q-chip>
      </div>
      <div class="achievement-grid">
        <q-card
          v-for="ach in achievements"
          :key="ach.id"
          class="achievement-card"
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
          >
            <div class="text-subtitle2 text-bold q-mb-xs">{{ ach.title }}</div>
            <div class="text-caption q-mb-xs">{{ ach.hint }}</div>
          </q-tooltip>
          <div class="achievement-card__icon">
            <q-icon :name="ach.icon" :color="iconColor(ach)" size="32px" />
          </div>
          <div class="achievement-card__title" :class="textColor(ach)">
            {{ ach.title }}
          </div>
          <div class="achievement-card__description" :class="textColor(ach, true)">
            {{ ach.description }}
          </div>
          <div v-if="ach.level !== undefined" class="achievement-card__badge">
            <q-badge :color="badgeColor(ach)" :text-color="badgeTextColor(ach)">
              Уровень: {{ formatNumber(ach.level) }}
            </q-badge>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useStoreData } from 'stores/data';
import { useStoreShop } from 'stores/shop';
import { useStoreAchievement } from 'stores/achievement';
import Decimal from 'break_eternity.js';
import { achievements } from 'src/constants/achievementMeta';

const storeData = useStoreData();
const storeShop = useStoreShop();
const storeAchievement = useStoreAchievement();

const formatNumber = storeData.formatNumber;

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
  const cpu = getLevel(storeShop.list.cpu.value);
  if (cpu.gt(storeAchievement.list.cpuLevel)) {
    storeAchievement.list.cpuLevel = cpu;
  }
}
function updateMaxHddLevel() {
  const hdd = getLevel(storeShop.list.hdd.value);
  if (hdd.gt(storeAchievement.list.hddLevel)) {
    storeAchievement.list.hddLevel = hdd;
  }
}
function updateMaxRamLevel() {
  const ram = getLevel(storeShop.list.ram.value);
  if (ram.gt(storeAchievement.list.ramLevel)) {
    storeAchievement.list.ramLevel = ram;
  }
}
function updateMaxEpicLevel() {
  const epic = getEpicLevel(storeData.epicNumber);
  if (epic.gt(storeAchievement.list.epicLevel)) {
    storeAchievement.list.epicLevel = epic;
  }
}

watch(() => storeShop.list.cpu.value, updateMaxCpuLevel, { immediate: true });
watch(() => storeShop.list.hdd.value, updateMaxHddLevel, { immediate: true });
watch(() => storeShop.list.ram.value, updateMaxRamLevel, { immediate: true });
watch(() => storeData.epicNumber, updateMaxEpicLevel, { immediate: true });

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

<style scoped lang="scss">
$mobile-breakpoint: 700px;

.achievement-page {
  padding: 24px;

  @media (max-width: $mobile-breakpoint) {
    padding: 16px;
  }
}

.achievement-container {
  max-width: 1200px;
  margin: 0 auto;
}

.achievement-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  font-size: 1.25rem;
  font-weight: bold;

  &__chip {
    margin-left: 16px;

    @media (max-width: $mobile-breakpoint) {
      margin-left: 0;
      margin-top: 12px;
    }
  }

  @media (max-width: $mobile-breakpoint) {
    flex-direction: column;
    align-items: flex-start;
    font-size: 1rem;
    margin-bottom: 16px;
  }
}

.achievement-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;

  @media (max-width: $mobile-breakpoint) {
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 12px;
  }
}

.achievement-card {
  padding: 12px;
  text-align: center;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &__icon {
    display: flex;
    justify-content: center;
    margin-bottom: 8px;
  }

  &__title {
    font-size: 0.875rem;
    font-weight: bold;
    margin-bottom: 6px;
    line-height: 1.2;
  }

  &__description {
    font-size: 0.75rem;
    margin-bottom: 8px;
    line-height: 1.3;
  }

  &__badge {
    margin-top: 8px;
  }

  @media (max-width: $mobile-breakpoint) {
    padding: 8px;

    &__icon {
      margin-bottom: 6px;

      .q-icon {
        font-size: 24px !important;
      }
    }

    &__title {
      font-size: 0.75rem;
      margin-bottom: 4px;
    }

    &__description {
      font-size: 0.7rem;
      margin-bottom: 6px;
    }

    &__badge {
      margin-top: 6px;

      .q-badge {
        font-size: 0.65rem;
      }
    }
  }
}

.tooltip-bordered {
  border: 2px solid var(--q-primary);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.18);
  padding: 10px;
  max-width: 220px;
  min-width: 160px;
  text-align: left;

  @media (max-width: $mobile-breakpoint) {
    max-width: 180px;
    min-width: 100px;
    padding: 6px;
  }
}
</style>
