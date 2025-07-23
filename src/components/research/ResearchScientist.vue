<template>
  <div class="scientists-grid">
    <q-card
      v-for="scientist in storeResearch.scientists"
      :key="scientist.id"
      class="scientist-card"
      flat
      bordered
    >
      <div class="scientist-card__stats">
        <div class="scientist-card__stat scientist-card__stat--left">
          <q-icon name="fa-solid fa-brain" color="blue-4" size="14px" />
          <span class="scientist-card__stat-value">{{ formatNumber(scientist.intellect) }}</span>
        </div>
        <div class="scientist-card__stat scientist-card__stat--right">
          <span class="scientist-card__stat-value">{{ formatNumber(scientist.efficiency) }}</span>
          <q-icon name="fa-solid fa-bolt" color="teal-5" size="14px" />
        </div>
      </div>

      <div class="scientist-card__avatar">
        <q-avatar size="56px" color="blue-grey-7">
          <q-icon name="fa-duotone fa-user-astronaut" size="40px" color="white" />
        </q-avatar>
      </div>

      <div class="scientist-card__level">
        <q-icon name="fa-solid fa-medal" color="blue-grey-3" size="22px" />
        <span class="scientist-card__level-badge">{{ formatNumber(scientist.level) }}</span>
      </div>

      <q-linear-progress
        :value="scientist.exp.div(expToLevel(scientist.level)).toNumber()"
        color="primary"
        class="scientist-card__progress"
      />

      <div class="scientist-card__experience">
        <q-icon name="fa-solid fa-circle-dot" color="deep-orange-4" size="15px" />
        <span class="scientist-card__exp-badge">
          {{ formatNumber(scientist.exp) }} / {{ formatNumber(expToLevel(scientist.level)) }}
        </span>
      </div>
    </q-card>

    <q-card
      class="hire-card"
      flat
      bordered
      @click="hireScientist"
      :class="{ 'hire-card--disabled': !storeData.epicNumber.gte(hireCost) }"
    >
      <q-avatar size="56px" color="blue-grey-7" class="hire-card__avatar">
        <q-icon name="fa-duotone fa-user-plus" size="40px" color="white" />
      </q-avatar>

      <div class="hire-card__spacer"></div>

      <div class="hire-card__cost">
        <q-icon name="fa-solid fa-coins" color="amber-6" size="18px" />
        <span>{{ formatNumber(hireCost) }}</span>
      </div>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Decimal from 'break_eternity.js';
import { uuidv7 } from 'src/boot/uuid';
import { useStoreData } from 'stores/data';
import { useStoreResearch } from 'stores/research';

const storeData = useStoreData();
const storeResearch = useStoreResearch();

const formatNumber = storeData.formatNumber;

const expToLevel = (...args: Parameters<typeof storeResearch.expToLevel>) =>
  storeResearch.expToLevel(...args);

const base = new Decimal(1000);
const baseSoftCap = new Decimal(2);

const hireCost = computed(() => {
  const n = storeResearch.scientists.length;
  if (n === 0) return base;
  const dynamicSoftCap = baseSoftCap.mul(new Decimal(1.2).pow(Math.floor(n / 3)));
  return base.mul(dynamicSoftCap.pow(n * n * n));
});

function hireScientist() {
  const epicNumber = storeData.epicNumber;
  const cost = hireCost.value;
  if (epicNumber.gte(cost)) {
    storeData.epicNumber = epicNumber.minus(cost);
    const id = uuidv7();
    storeResearch.scientists.push({
      id,
      level: new Decimal(1),
      exp: new Decimal(0),
      intellect: new Decimal(1),
      efficiency: new Decimal(1),
    });
  }
}
</script>
<style scoped lang="scss">
$mobile-breakpoint: 700px;
$tablet-breakpoint: 1024px;

:root {
  --scientist-card-bg: linear-gradient(145deg, #37474f, #455a64);
  --scientist-card-border: #546e7a;
  --scientist-intellect: #42a5f5;
  --scientist-efficiency: #26a69a;
  --scientist-exp: #ff7043;
  --scientist-level: #ffc107;
  --hire-accent: #2196f3;
}

.scientists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: clamp(8px, 2vw, 16px);
  padding: clamp(8px, 2vw, 16px);

  @media (max-width: $tablet-breakpoint) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }

  @media (max-width: $mobile-breakpoint) {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
}

.scientist-card {
  aspect-ratio: 0.9;
  padding: clamp(8px, 3vw, 16px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background: var(--scientist-card-bg);
  border: 1px solid var(--scientist-card-border);
  border-radius: 16px;
  color: white;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
    border-color: var(--hire-accent);
  }

  &__stats {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  &__stat {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    backdrop-filter: blur(4px);

    &--left {
      color: var(--scientist-intellect);
    }

    &--right {
      color: var(--scientist-efficiency);
    }

    &-value {
      font-weight: 700;
      font-size: clamp(9px, 2vw, 11px);
      letter-spacing: 0.5px;
    }
  }

  &__avatar {
    margin: clamp(4px, 2vw, 8px) 0;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      inset: -4px;
      background: linear-gradient(45deg, var(--scientist-intellect), var(--scientist-efficiency));
      border-radius: 50%;
      z-index: -1;
      opacity: 0.3;
    }
  }

  &__level {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;

    &-badge {
      font-size: clamp(16px, 4vw, 20px);
      font-weight: 900;
      color: var(--scientist-level);
      background: rgba(255, 193, 7, 0.15);
      border: 1px solid rgba(255, 193, 7, 0.3);
      border-radius: 12px;
      padding: 4px 12px;
      letter-spacing: 1px;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
  }

  &__progress {
    width: 100%;
    height: clamp(4px, 1vw, 8px);
    margin-bottom: 8px;
    border-radius: 4px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.1);

    .q-linear-progress__track {
      background: linear-gradient(90deg, var(--hire-accent), var(--scientist-efficiency));
    }
  }

  &__experience {
    display: flex;
    align-items: center;
    gap: 6px;

    &-badge {
      font-size: clamp(9px, 2vw, 12px);
      font-weight: 600;
      background: rgba(255, 112, 67, 0.15);
      color: var(--scientist-exp);
      border: 1px solid rgba(255, 112, 67, 0.3);
      border-radius: 8px;
      padding: 4px 8px;
      letter-spacing: 0.3px;
    }
  }

  @media (max-width: $mobile-breakpoint) {
    padding: 8px;

    &__stat {
      padding: 2px 6px;
      gap: 2px;

      &-value {
        font-size: 9px;
      }
    }

    &__level-badge {
      font-size: 14px;
      padding: 2px 8px;
    }

    &__experience-badge {
      font-size: 8px;
      padding: 2px 4px;
    }
  }
}

.hire-card {
  aspect-ratio: 0.9;
  padding: clamp(8px, 3vw, 16px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #37474f, #455a64);
  border: 2px dashed var(--hire-accent);
  border-radius: 16px;
  color: white;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &:hover:not(&--disabled) {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 12px 32px rgba(33, 150, 243, 0.4);
    background: linear-gradient(145deg, #3d5afe, #2196f3);
    border-style: solid;
  }

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    filter: grayscale(0.7);

    &:hover {
      transform: none;
      box-shadow: none;
    }
  }

  &__avatar {
    margin-bottom: 16px;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      inset: -8px;
      background: conic-gradient(from 0deg, var(--hire-accent), transparent, var(--hire-accent));
      border-radius: 50%;
      z-index: -1;
      opacity: 0.6;
      animation: rotate 3s linear infinite;
    }
  }

  &__spacer {
    flex: 1;
  }

  &__cost {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: clamp(12px, 3vw, 16px);
    font-weight: 700;
    background: rgba(255, 193, 7, 0.15);
    color: #ffc107;
    border: 1px solid rgba(255, 193, 7, 0.3);
    border-radius: 12px;
    padding: 8px 16px;
    letter-spacing: 0.5px;
  }

  @media (max-width: $mobile-breakpoint) {
    padding: 8px;

    &__avatar {
      margin-bottom: 8px;
    }

    &__cost {
      font-size: 10px;
      padding: 4px 8px;
      gap: 4px;
    }
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
