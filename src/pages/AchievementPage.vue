<template>
  <q-page class="q-pa-lg">
    <div class="q-mb-md text-h6 text-bold row items-center">
      <i :class="iconStyle + 'fa-sparkles'" color="amber" size="28px" class="q-mr-sm" />
      Выполнено: {{ formatNumber(totalAchievements) }}
      <q-chip color="primary" text-color="white" class="q-ml-md">
        <i :class="iconStyle + 'fa-arrow-trend-up'" left size="18px" />
        Бонус: x{{ achievementBonus.toFixed(2) }}
      </q-chip>
    </div>
    <div
      class="q-gutter-md"
      style="min-width: 100%; display: flex; flex-wrap: wrap; align-items: center"
    >
      <q-card
        v-for="av in achievementViews"
        :key="av.key"
        class="q-pa-sm q-mb-xs achievement-card-fixed"
        :class="av.cardClass"
        flat
        bordered
        v-ripple
      >
        <q-tooltip
          v-if="av.hasLevel && av.hint"
          class="bg-dark text-white tooltip-bordered"
          anchor="center middle"
          self="center middle"
          :offset="[0, 12]"
          style="max-width: 220px; min-width: 160px; padding: 10px; text-align: left"
        >
          <div class="text-subtitle2 text-bold q-mb-xs">{{ av.title }}</div>
          <div class="text-caption q-mb-xs">{{ av.hint }}</div>
        </q-tooltip>
        <div class="flex flex-center q-mb-xs">
          <i :class="iconStyle + av.icon" :color="av.iconColor" size="32px" />
        </div>
        <div class="text-subtitle2 text-center text-bold" :class="av.titleClass">
          {{ av.title }}
        </div>
        <div class="text-caption text-center" :class="av.descClass">
          {{ av.description }}
        </div>
        <div v-if="av.hasLevel" class="achievement-badge-bottom text-center q-mt-xs">
          <q-badge :color="av.badgeColor" :text-color="av.badgeTextColor">
            Уровень: {{ av.levelStr }}
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

const achievementViews = computed(() => {
  return achievements.value.map((a) => {
    const hasLevel = a.level !== undefined;
    const levelGt0 = hasLevel && a.level.gt(0);
    const unlocked = a.unlocked;

    let cardClass = 'achievement-card-dark-default';
    if (levelGt0) {
      cardClass = 'achievement-card-dark-level';
    } else if (unlocked) {
      cardClass = 'achievement-card-dark-unlocked';
    }

    const iconColor = levelGt0 || unlocked ? 'white' : 'grey-5';

    const titleClass = levelGt0 || unlocked ? 'text-white' : 'text-grey-7';

    let descClass = 'text-grey-6';
    if (levelGt0) {
      descClass = 'text-white';
    } else if (unlocked) {
      descClass = 'text-grey-4';
    }

    let badgeColor = 'grey-5';
    if (levelGt0) {
      badgeColor = 'white';
    } else if (unlocked) {
      badgeColor = a.color || 'white';
    }

    let badgeTextColor = 'grey-7';
    if (levelGt0) {
      badgeTextColor = 'primary';
    } else if (unlocked) {
      badgeTextColor = 'positive';
    }

    const levelStr = hasLevel ? formatNumber(a.level) : '';

    return {
      key: a.key,
      title: a.title,
      description: a.description,
      icon: a.icon,
      hint: a.hint,
      hasLevel,
      cardClass,
      iconColor,
      titleClass,
      descClass,
      badgeColor,
      badgeTextColor,
      levelStr,
    };
  });
});

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

<style lang="scss" scoped>
.achievement-card-fixed {
  width: 140px;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  margin: 5px;
  box-sizing: border-box;
}

.achievement-card-fixed > .flex,
.achievement-card-fixed > .text-subtitle2,
.achievement-card-fixed > .text-caption {
  flex-shrink: 0;
}

.achievement-badge-bottom {
  margin-top: auto;
}

.tooltip-bordered {
  border: 2px solid $primary;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.18);
  padding: 10px;
  max-width: 220px;
  min-width: 160px;
  text-align: left;
}

.achievement-card-fixed .text-subtitle2 {
  font-size: 14px;
  line-height: 1.2;
  max-height: calc(1.2em * 2);
  overflow: hidden;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: normal;
  overflow-wrap: normal;
  hyphens: none;
}

.achievement-card-fixed .text-caption {
  font-size: 12px;
  line-height: 1.2;
  max-height: none;
  overflow: visible;
  display: block;
  white-space: normal;
  word-break: break-word;
}

@media (max-width: 700px) {
  .q-page.q-pa-lg {
    padding: 8px !important;
  }
  .q-mb-md.text-h6.text-bold.row.items-center {
    flex-direction: column !important;
    align-items: flex-start !important;
    font-size: 16px !important;
  }
  .q-mb-md.text-h6.text-bold.row.items-center .q-chip {
    margin-left: 0 !important;
    margin-top: 8px !important;
  }
  .q-gutter-md {
    flex-wrap: wrap;
    gap: 8px !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  .q-card {
    width: 100px !important;
    min-width: 82px !important;
    margin-right: 6px !important;
    margin-bottom: 6px !important;
    padding: 3px !important;
    font-size: 12px !important;
  }
  .achievement-card-fixed .text-subtitle2 {
    font-size: 13px;
    line-clamp: 2;
    -webkit-line-clamp: 2;
  }
  .achievement-card-fixed .text-caption {
    font-size: 11px;
    line-clamp: unset;
    -webkit-line-clamp: unset;
  }
  .q-tooltip.tooltip-bordered {
    max-width: 180px !important;
    min-width: 100px !important;
    padding: 6px !important;
  }
}

.achievement-card-dark-default {
  background: #2b2f31 !important;
  color: #dfeaf3 !important;
  border: 1px solid rgba(255, 255, 255, 0.04) !important;
  box-shadow: 0 6px 14px rgba(10, 12, 14, 0.5);
}
.achievement-card-dark-unlocked {
  background: #3a3e41 !important;
  color: #eef3f8 !important;
  border: 1px solid rgba(255, 255, 255, 0.03) !important;
}
.achievement-card-dark-level {
  background: #34383b !important;
  color: #f8fbfe !important;
  border: 1px solid rgba(255, 255, 255, 0.03) !important;
}

.achievement-card-fixed .text-subtitle2.text-white,
.achievement-card-fixed .text-caption.text-white {
  color: #eaf1f8 !important;
}
</style>
