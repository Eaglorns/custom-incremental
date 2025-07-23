<template>
  <div class="prestige-card">
    <div class="prestige-card__background-glow"></div>
    <div class="prestige-card__header">
      <div class="prestige-card__icon-container">
        <q-icon name="fa-duotone fa-arrow-up-right-dots" size="36px" class="prestige-card__icon" />
        <div class="prestige-card__icon-glow"></div>
      </div>
      <div class="prestige-card__value-container">
        <div class="prestige-card__label">Престиж</div>
        <span class="prestige-card__main-value">{{ formatNumber(prestige) }}</span>
      </div>
    </div>
    <div v-if="!canPrestige" class="prestige-card__progress-container">
      <div class="prestige-card__progress-bar">
        <div
          class="prestige-card__progress-fill"
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
    </div>
    <div class="prestige-card__gain-section">
      <div class="prestige-card__gain-container">
        <q-icon name="fa-duotone fa-sparkles" size="20px" class="prestige-card__gain-icon" />
        <span class="prestige-card__gain-value">+{{ formatNumber(prestigeGain) }}</span>
      </div>
    </div>
    <div class="prestige-card__button-container">
      <q-btn
        :class="['prestige-card__button', { 'prestige-card__button--ready': canPrestige }]"
        size="lg"
        icon="fa-duotone fa-arrow-rotate-right"
        label="Переродиться"
        unelevated
        :disabled="!canPrestige"
        @click="onPrestige"
      >
        <div v-if="canPrestige" class="prestige-card__button-shine"></div>
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStorePrestige } from 'stores/prestige';
import { useStoreData } from 'stores/data';

const storePrestige = useStorePrestige();
const storeData = useStoreData();

const formatNumber = storeData.formatNumber;

const prestige = computed(() => storePrestige.points);
const prestigeGain = computed(() => storePrestige.prestigeGain);
const canPrestige = computed(() => prestigeGain.value.gte(1));

const progressPercentage = computed(() => {
  const gain = prestigeGain.value;
  if (gain.gte(1)) {
    return 100;
  }
  return Math.min(gain.mul(100).toNumber(), 100);
});

const onPrestige = () => {
  if (canPrestige.value) {
    storePrestige.onPrestige();
  }
};
</script>

<style scoped lang="scss">
$mobile-breakpoint: 700px;

:root {
  --prestige-primary: #9f7aff;
  --prestige-secondary: #b794ff;
  --prestige-dark: #7c3aed;
  --prestige-glow: rgba(159, 122, 255, 0.08);
  --prestige-accent: #22c55e;
  --prestige-text-primary: #e8eaf0;
  --prestige-text-secondary: #b0b3c0;
  --prestige-text-muted: #a0a3b0;
  --prestige-shadow-light: rgba(0, 0, 0, 0.15);
  --prestige-shadow-medium: rgba(0, 0, 0, 0.25);
}

@mixin card-shadow($elevated: false) {
  @if $elevated {
    box-shadow:
      0 8px 32px var(--prestige-shadow-medium),
      0 4px 16px var(--prestige-shadow-light);
  } @else {
    box-shadow:
      0 4px 16px var(--prestige-shadow-light),
      0 2px 6px var(--prestige-shadow-light);
  }
}

.prestige-card {
  min-height: clamp(300px, 50vh, 400px);
  max-width: clamp(320px, 90vw, 420px);
  width: 100%;
  margin: 0 auto;
  padding: clamp(16px, 4vw, 24px);
  border-radius: 20px;
  background: linear-gradient(145deg, #2a2d3f 0%, #2e3145 100%);
  @include card-shadow();
  color: var(--prestige-text-primary);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(16px, 3vw, 24px);
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-2px);
    @include card-shadow(true);
    border-color: var(--prestige-primary);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    * {
      animation: none !important;
    }
  }

  &__background-glow {
    position: absolute;
    inset: -20%;
    background: radial-gradient(circle, var(--prestige-glow) 0%, transparent 60%);
    animation: prestige-pulse 6s ease-in-out infinite alternate;
    pointer-events: none;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: clamp(12px, 3vw, 20px);
    position: relative;
    z-index: 2;
  }

  &__icon-container {
    position: relative;
  }

  &__icon {
    color: var(--prestige-primary);
    filter: drop-shadow(0 0 8px rgba(159, 122, 255, 0.4));
    animation: prestige-icon-float 4s ease-in-out infinite alternate;
    will-change: transform;
  }

  &__icon-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50px;
    height: 50px;
    background: radial-gradient(circle, rgba(159, 122, 255, 0.2) 0%, transparent 70%);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: prestige-glow-pulse 4s ease-in-out infinite alternate;
  }

  &__value-container {
    text-align: left;
  }

  &__label {
    font-size: clamp(12px, 2.5vw, 14px);
    color: var(--prestige-text-secondary);
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  &__main-value {
    font-size: clamp(24px, 6vw, 32px);
    font-weight: 900;
    background: linear-gradient(135deg, #fff 0%, #f0f2f8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 1px;
    line-height: 1.1;
  }

  &__progress-container {
    width: 100%;
    position: relative;
  }

  &__progress-bar {
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    overflow: hidden;
  }

  &__progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--prestige-primary), var(--prestige-secondary));
    border-radius: 3px;
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.3) 50%,
        transparent 100%
      );
      animation: prestige-progress-shimmer 3s ease-in-out infinite;
    }
  }

  &__gain-section {
    background: linear-gradient(135deg, rgba(159, 122, 255, 0.1), rgba(183, 148, 255, 0.1));
    border-radius: 16px;
    padding: clamp(12px, 3vw, 20px) clamp(16px, 4vw, 28px);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(159, 122, 255, 0.3);
    position: relative;
    z-index: 2;
  }

  &__gain-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  &__gain-icon {
    color: var(--prestige-secondary);
    animation: prestige-sparkle 3s ease-in-out infinite;
  }

  &__gain-value {
    color: var(--prestige-accent);
    font-size: clamp(18px, 4vw, 24px);
    font-weight: 800;
    text-shadow: 0 0 8px rgba(34, 197, 94, 0.3);
    letter-spacing: 0.5px;
  }

  &__button-container {
    position: relative;
    z-index: 2;
  }

  &__button {
    background: linear-gradient(135deg, var(--prestige-dark), var(--prestige-primary));
    color: white;
    border-radius: 16px;
    padding: clamp(12px, 3vw, 16px) clamp(20px, 5vw, 32px);
    font-weight: 700;
    font-size: clamp(14px, 3vw, 16px);
    letter-spacing: 0.5px;
    border: none;
    box-shadow: 0 4px 16px rgba(159, 122, 255, 0.3);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    min-width: clamp(140px, 30vw, 180px);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(159, 122, 255, 0.4);
    }

    &:focus-visible {
      outline: 2px solid var(--prestige-primary);
      outline-offset: 2px;
    }

    &:disabled {
      background: linear-gradient(135deg, #4b5563, #6b7280);
      color: #d1d5db;
      box-shadow: none;
      cursor: not-allowed;
    }

    &--ready {
      animation: prestige-btn-pulse 4s ease-in-out infinite;
    }
  }

  &__button-shine {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.2) 50%,
      transparent 100%
    );
    animation: prestige-shine 5s ease-in-out infinite;
  }

  @media (max-width: $mobile-breakpoint) {
    min-height: 280px;
    padding: 16px;
    gap: 16px;

    &__header {
      gap: 12px;
    }

    &__gain-section {
      padding: 12px 16px;
    }

    &__button {
      padding: 12px 24px;
      min-width: 140px;
    }
  }
}

@keyframes prestige-pulse {
  0% {
    opacity: 0.3;
    transform: scale(0.95);
  }
  100% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

@keyframes prestige-icon-float {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-3px);
  }
}

@keyframes prestige-glow-pulse {
  0% {
    opacity: 0.2;
    transform: translate(-50%, -50%) scale(0.9);
  }
  100% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@keyframes prestige-progress-shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes prestige-sparkle {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.1) rotate(180deg);
    opacity: 1;
  }
}

@keyframes prestige-btn-pulse {
  0%,
  100% {
    box-shadow: 0 4px 16px rgba(159, 122, 255, 0.3);
  }
  50% {
    box-shadow:
      0 6px 24px rgba(159, 122, 255, 0.5),
      0 0 16px rgba(159, 122, 255, 0.2);
  }
}

@keyframes prestige-shine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
