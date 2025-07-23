<template>
  <div class="research-container">
    <q-card
      v-for="meta in researchMeta"
      :key="meta.key"
      flat
      bordered
      class="research-card"
      :class="{
        'research-card--inactive': isMaxLevel(meta.key).value,
        'research-card--active': getResearch(meta.key).currentTime.gt(0),
      }"
    >
      <div v-if="isMaxLevel(meta.key).value" class="research-card__banner">
        <span class="research-card__banner-text">Завершено</span>
      </div>
      <q-tooltip
        anchor="top middle"
        self="bottom middle"
        :offset="[0, 10]"
        class="research-tooltip"
      >
        <div class="research-tooltip__title">{{ meta.title }}</div>
        <div class="research-tooltip__description">{{ meta.description }}</div>
      </q-tooltip>
      <q-card-section class="research-card__header">
        <div class="research-card__title">
          <q-icon :name="meta.icon" size="18px" class="research-card__icon" />
          <span class="research-card__title-text">{{ meta.title }}</span>
        </div>
      </q-card-section>
      <div class="research-card__content">
        <div class="research-card__level">
          <q-icon name="fa-duotone fa-signal-bars" class="research-card__level-icon" />
          Уровень: {{ getResearch(meta.key).level }} / {{ getResearch(meta.key).maxLevel }}
        </div>
        <div class="research-card__stats">
          <div class="research-card__stat">
            <q-icon name="fa-duotone fa-coins" size="15px" class="research-card__stat-icon" />
            <q-badge class="research-card__stat-badge">{{
              formatNumber(getResearchCost(meta.key).value)
            }}</q-badge>
          </div>
          <div class="research-card__stat">
            <q-icon name="fa-duotone fa-clock" size="15px" class="research-card__stat-icon" />
            <q-badge class="research-card__stat-badge"
              >{{ formatNumber(getResearchTime(meta.key).value) }} сек</q-badge
            >
          </div>
        </div>
        <div class="research-card__progress">
          <q-linear-progress
            v-if="getResearch(meta.key).maxLevel.gt(1)"
            :value="getResearch(meta.key).level.div(getResearch(meta.key).maxLevel).toNumber()"
            color="primary"
            size="8px"
            rounded
            class="research-card__progress-bar"
          />
          <q-badge
            v-else
            :color="getResearch(meta.key).level ? 'primary' : 'grey'"
            class="research-card__status-badge"
            >{{ getResearch(meta.key).level ? 'Изучено' : 'Не изучено' }}</q-badge
          >
        </div>
      </div>
      <q-separator spaced class="research-card__separator" />
      <q-card-actions align="right" class="research-card__actions">
        <q-btn
          :disable="
            isMaxLevel(meta.key).value ||
            (!storeResearch.points.gte(getResearchCost(meta.key).value) &&
              !getResearch(meta.key).currentTime.gt(0)) ||
            (getResearchTime(meta.key).value.gt(1000) && !getResearch(meta.key).currentTime.gt(0))
          "
          size="sm"
          dense
          :label="
            getResearch(meta.key).currentTime.gt(0)
              ? `Отменить (${formatNumber(getResearch(meta.key).currentTime)} сек.)`
              : 'Улучшить'
          "
          @click="startResearch(meta.key, false)"
          class="research-card__button"
          :color="
            isMaxLevel(meta.key).value
              ? 'grey-8'
              : getResearch(meta.key).currentTime.gt(0)
                ? 'negative'
                : 'primary'
          "
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useStoreData } from 'stores/data';
import Decimal from 'break_eternity.js';
import type { Research } from 'src/constants/models';
import { researchMeta } from 'src/constants/researchMeta';
import { useStoreResearch } from 'stores/research';

const storeData = useStoreData();
const storeResearch = useStoreResearch();

const formatNumber = storeData.formatNumber;

const researchList = storeResearch.list as Record<string, Research>;

function getResearch(key: string) {
  if (!researchList[key])
    return {
      cost: new Decimal(0),
      currentTime: new Decimal(0),
      time: new Decimal(0),
      bonus: new Decimal(0),
      level: new Decimal(0),
      costMultiply: new Decimal(1),
      timeMultiply: new Decimal(1),
      maxLevel: new Decimal(1),
    };
  return researchList[key];
}

function isMaxLevel(metaKey: string) {
  return computed(() => {
    const research = getResearch(metaKey);
    return research.level.gte(research.maxLevel);
  });
}

function getResearchCost(key: string) {
  const research = researchList[key];
  if (!research) return computed(() => new Decimal(0));
  return computed(() =>
    research.level.eq(0)
      ? research.cost
      : research.cost.mul(research.costMultiply.pow(research.level)),
  );
}

function getResearchTime(key: string) {
  const research = researchList[key];
  if (!research) return computed(() => new Decimal(0));
  return computed(() => {
    const divTime = storeResearch.speed;
    return research.level.eq(0)
      ? research.time.div(divTime)
      : research.time.mul(research.timeMultiply.pow(research.level)).div(divTime);
  });
}

function startResearch(key: string, isLoad: boolean) {
  const research = researchList[key];
  if (!research) return;

  if (!isLoad && research.currentTime.gt(0)) {
    cancelResearch(key);
    return;
  }

  if (!isLoad) {
    if (isMaxLevel(key).value) return;
    if (research.currentTime.gt(0)) return;
  }

  const cost = getResearchCost(key).value;
  const time = getResearchTime(key).value;

  if (!isLoad) {
    if (!storeResearch.points.gte(cost)) return;
    storeResearch.points = storeResearch.points.minus(cost);
    research.currentTime = time;
    research.isActive = true;
  }
}

function cancelResearch(key: string) {
  const research = researchList[key];
  if (!research) return;
  storeResearch.points = storeResearch.points.plus(getResearchCost(key).value);
  research.currentTime = new Decimal(0);
}

onMounted(() => {
  Object.entries(researchList).forEach(([key, research]) => {
    if (research.currentTime && research.currentTime.gt(0)) {
      startResearch(key, true);
    }
  });
});
</script>

<style scoped lang="scss">
$mobile-breakpoint: 700px;
$tablet-breakpoint: 1024px;

:root {
  --research-card-bg: #181a1b;
  --research-card-border: #444;
  --research-text-primary: #fff;
  --research-text-secondary: #b0bec5;
  --research-accent: #2196f3;
  --research-success: #4caf50;
  --research-shadow: rgba(33, 150, 243, 0.15);
  --research-button-bg: #2a2d3a;
  --research-button-bg-hover: #363b4a;
  --research-button-text: #b0bec5;
  --research-button-primary: #1565c0;
  --research-button-negative: #d32f2f;
}

.research-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: clamp(8px, 2vw, 16px);
  padding: clamp(8px, 2vw, 16px);
  align-items: stretch;

  @media (max-width: $tablet-breakpoint) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  @media (max-width: $mobile-breakpoint) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}

.research-card {
  background: var(--research-card-bg);
  border-color: var(--research-card-border);
  padding: 16px;
  position: relative;
  display: flex;
  flex-direction: column;
  color: var(--research-text-primary);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  overflow: hidden;

  &:hover:not(&--inactive) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px var(--research-shadow);
    border-color: var(--research-accent);
  }

  &--active {
    border-color: var(--research-accent);
    box-shadow: 0 0 16px var(--research-shadow);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--research-accent), var(--research-success));
      animation: pulse 2s ease-in-out infinite;
    }
  }

  &--inactive {
    opacity: 0.6;
    filter: grayscale(0.7);
    pointer-events: none;
  }

  &__banner {
    background: linear-gradient(135deg, var(--research-success), #66bb6a);
    color: white;
    font-size: clamp(16px, 4vw, 20px);
    font-weight: 900;
    letter-spacing: 1px;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 90%;
    transform: translate(-50%, -50%);
    text-align: center;
    border-radius: 8px;
    padding: 12px;
    z-index: 2;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(4px);

    &-text {
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }
  }

  &__header {
    padding: 0 0 12px;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;

    &-text {
      font-size: clamp(14px, 2.5vw, 16px);
      font-weight: 600;
      line-height: 1.3;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
    }
  }

  &__icon {
    color: var(--research-accent);
    flex-shrink: 0;
  }

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__level {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--research-text-secondary);
    font-size: clamp(11px, 2vw, 13px);
    font-weight: 600;

    &-icon {
      color: var(--research-accent);
    }
  }

  &__stats {
    display: flex;
    justify-content: space-between;
    gap: 8px;
  }

  &__stat {
    display: flex;
    align-items: center;
    gap: 4px;
    flex: 1;

    &-icon {
      color: var(--research-text-secondary);
      transition: color 0.2s ease;
    }

    &-badge {
      padding: 4px 8px;
      font-weight: 600;
      background: rgba(33, 150, 243, 0.1);
      color: var(--research-accent);
      border: 1px solid rgba(33, 150, 243, 0.3);
      font-size: clamp(9px, 1.5vw, 11px);
      border-radius: 6px;
      flex: 1;
      text-align: center;
    }
  }

  &__progress {
    &-bar {
      background: rgba(33, 150, 243, 0.1);

      .q-linear-progress__track {
        background: linear-gradient(90deg, var(--research-accent), var(--research-success));
      }
    }
  }

  &__status-badge {
    font-size: clamp(9px, 1.5vw, 11px);
    padding: 6px 12px;
    border-radius: 6px;
  }

  &__separator {
    margin: 8px 0;
    opacity: 0.3;
  }

  &__actions {
    padding: 0;
    margin-top: auto;
  }

  &__button {
    width: 100%;
    font-size: clamp(11px, 2vw, 13px);
    font-weight: 600;
    border-radius: 8px;
    padding: 8px 16px;
    transition: all 0.2s ease;
    background: var(--research-button-bg);
    color: var(--research-button-text);
    border: 1px solid rgba(255, 255, 255, 0.1);

    &.q-btn--standard {
      background: var(--research-button-bg);
      color: var(--research-button-text);

      &:hover:not(:disabled) {
        background: var(--research-button-bg-hover);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        border-color: rgba(255, 255, 255, 0.2);
      }
    }

    &.q-btn--flat,
    &.q-btn--outline,
    &.q-btn--unelevated {
      background: var(--research-button-bg) !important;
      color: var(--research-button-text) !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;

      &:hover:not(:disabled) {
        background: var(--research-button-bg-hover) !important;
        color: #fff !important;
        border-color: rgba(255, 255, 255, 0.2) !important;
      }
    }

    &[class*='bg-primary'],
    &.text-primary {
      background: linear-gradient(135deg, #263238, #37474f) !important;
      color: #b0bec5 !important;
      border-color: #455a64 !important;

      &:hover:not(:disabled) {
        background: linear-gradient(135deg, #37474f, #455a64) !important;
        color: #cfd8dc !important;
        box-shadow: 0 4px 12px rgba(69, 90, 100, 0.2) !important;
      }
    }

    &[class*='bg-negative'],
    &.text-negative {
      background: linear-gradient(135deg, #3e2723, #5d4037) !important;
      color: #bcaaa4 !important;
      border-color: #6d4c41 !important;

      &:hover:not(:disabled) {
        background: linear-gradient(135deg, #5d4037, #6d4c41) !important;
        color: #d7ccc8 !important;
        box-shadow: 0 4px 12px rgba(109, 76, 65, 0.2) !important;
      }
    }

    &[class*='bg-grey'],
    &.text-grey {
      background: #2e2e2e !important;
      color: #757575 !important;
      border-color: #424242 !important;
    }

    &:disabled {
      background: #2e2e2e !important;
      color: #616161 !important;
      border-color: #424242 !important;
      opacity: 0.7 !important;
    }

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
  }

  @media (max-width: $mobile-breakpoint) {
    padding: 12px;

    &__banner {
      font-size: 14px;
      padding: 8px;
    }
  }
}

.research-tooltip {
  background: rgba(66, 66, 66, 0.95);
  backdrop-filter: blur(8px);
  color: white;
  max-width: 280px;
  font-size: clamp(11px, 2vw, 13px);
  line-height: 1.5;
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);

  &__title {
    font-size: clamp(13px, 2.5vw, 15px);
    margin-bottom: 8px;
    font-weight: 700;
    color: var(--research-accent);
  }

  &__description {
    color: #e0e0e0;
    line-height: 1.4;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
</style>
