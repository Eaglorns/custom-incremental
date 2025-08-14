<template>
  <div class="magic-rune">
    <div class="runes-grid">
      <div
        v-for="rune in runesWithMeta"
        :key="rune.id"
        class="rune-slot"
        :class="{
          selected: storeMagic.selectedRune?.id === rune.id,
          'yellow-rune': rune.level.equals(0) && !storeMagic.canCraftRuneById(rune.id),
          'yellow-solid': rune.level.gt(0) && !storeMagic.canCraftRuneById(rune.id),
          'green-rune': storeMagic.canCraftRuneById(rune.id),
          crafting: craftingRuneId === rune.id,
        }"
        @click="storeMagic.selectRune(rune)"
        @pointerdown="onPointerDown(rune, $event)"
        @pointerup="onPointerUp($event)"
        @pointercancel="onPointerCancel($event)"
        @pointerleave="onPointerLeave($event)"
        @contextmenu.prevent
      >
        <div class="rune-icon">
          <i :class="iconStyle + rune.meta.icon" :style="{ color: rune.meta.color }"></i>
        </div>
        <div v-if="rune.level.gt(0)" class="rune-level">{{ rune.level }}</div>
        <div v-if="storeMagic.canCraftRuneById(rune.id)" class="craft-indicator">
          <i class="fas fa-hammer"></i>
        </div>
        <div class="rune-name">{{ rune.meta.name }}</div>

        <div
          v-if="craftingRuneId === rune.id"
          class="craft-progress-bar"
          :ref="(el) => setProgressRef(rune.id, el)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onUnmounted, watchEffect, type ComponentPublicInstance } from 'vue';
import { useTimeoutFn, useEventListener } from '@vueuse/core';
import { useMotion } from '@vueuse/motion';
import { useStoreMagic } from 'src/stores/magic';
import { RUNE_META } from 'src/constants/magicMeta';
import { useStoreSetting } from 'src/stores/setting';
import type { Rune } from 'src/stores/magic';

const storeMagic = useStoreMagic();
const storeSetting = useStoreSetting();

const craftDuration = 500;
const craftingRuneId = ref<string | null>(null);
const isMouseDown = ref(false);
const currentCraftingRuneId = ref<string | null>(null);
const isCompleting = ref(false);
const activePointerId = ref<number | null>(null);
let stopCompleteTimer: (() => void) | null = null;

type MotionCtrl = { stop?: () => void; apply?: (variant: string) => Promise<void[]> };
const progressMotionMap = new Map<string, MotionCtrl>();

function setProgressRef(id: string, el: Element | ComponentPublicInstance | null) {
  if (!el) {
    progressMotionMap.delete(id);
    return;
  }
  const htmlEl: HTMLElement = (el as ComponentPublicInstance)?.$el
    ? ((el as ComponentPublicInstance).$el as HTMLElement)
    : (el as HTMLElement);
  const motion = useMotion(htmlEl, {
    initial: { width: '0%' },
    variants: {
      crafting: {
        width: '100%',
        transition: { duration: craftDuration / 1000, easing: 'linear' },
      },
      reset: { width: '0%' },
    },
  });
  progressMotionMap.set(id, motion as unknown as MotionCtrl);
}

const iconStyle = computed(() => storeSetting.iconStyle);

const runesWithMeta = computed(() =>
  storeMagic.runes.map((rune) => {
    const meta = RUNE_META.find((m) => m.id === rune.id);
    return {
      ...rune,
      meta: meta || {
        name: 'Неизвестная руна',
        icon: 'fas fa-question',
        color: '#666',
        description: '',
      },
    };
  }),
);

async function startCrafting(rune: Rune) {
  if (!storeMagic.canCraftRuneById(rune.id)) return;
  storeMagic.selectRune(rune);
  isMouseDown.value = true;
  currentCraftingRuneId.value = rune.id;
  if (craftingRuneId.value === rune.id) return;
  await startCraftingCycle(rune);
}

async function onPointerDown(rune: Rune, e: PointerEvent) {
  const el = e.currentTarget as Element | null;
  try {
    el?.setPointerCapture?.(e.pointerId);
  } catch {
    /* ignore */
  }
  activePointerId.value = e.pointerId;
  await startCrafting(rune);
}

async function endPointerInteraction(e: PointerEvent) {
  if (activePointerId.value !== e.pointerId) return;
  const el = e.currentTarget as Element | null;
  try {
    el?.releasePointerCapture?.(e.pointerId);
  } catch {
    /* ignore */
  }
  activePointerId.value = null;
  await stopCrafting();
}

const onPointerUp = endPointerInteraction;
const onPointerCancel = endPointerInteraction;

async function onPointerLeave(e: PointerEvent) {
  const el = e.currentTarget as Element | null;
  const hasCapture = !!el?.hasPointerCapture && el.hasPointerCapture(e.pointerId);
  if (activePointerId.value === e.pointerId && !hasCapture) {
    activePointerId.value = null;
    await stopCrafting();
  }
}

async function startCraftingCycle(rune: Rune) {
  if (!storeMagic.canCraftRuneById(rune.id)) {
    await stopCrafting();
    return;
  }
  if (isCompleting.value) return;
  if (!isMouseDown.value || currentCraftingRuneId.value !== rune.id) return;

  craftingRuneId.value = rune.id;
  isCompleting.value = false;

  const motion = progressMotionMap.get(rune.id);
  motion?.stop?.();
  if (motion?.apply) {
    await motion.apply('reset').catch(() => undefined);
    await motion.apply('crafting').catch(() => undefined);
  }

  if (stopCompleteTimer) {
    stopCompleteTimer();
    stopCompleteTimer = null;
  }
  const { start, stop } = useTimeoutFn(() => {
    if (
      isMouseDown.value &&
      currentCraftingRuneId.value === rune.id &&
      storeMagic.canCraftRuneById(rune.id) &&
      !isCompleting.value
    ) {
      isCompleting.value = true;
      completeCrafting().catch(() => undefined);
    } else {
      stopCrafting().catch(() => undefined);
    }
  }, craftDuration);
  stopCompleteTimer = stop;
  start();
}

async function stopCrafting() {
  isMouseDown.value = false;
  currentCraftingRuneId.value = null;
  isCompleting.value = false;
  if (stopCompleteTimer) {
    stopCompleteTimer();
    stopCompleteTimer = null;
  }
  const id = craftingRuneId.value;
  craftingRuneId.value = null;
  if (id) {
    const motion = progressMotionMap.get(id);
    motion?.stop?.();
    if (motion?.apply) {
      await motion.apply('reset').catch(() => undefined);
    }
  } else {
    progressMotionMap.forEach((motion) => {
      motion.stop?.();
      if (motion?.apply) motion.apply('reset').catch(() => undefined);
    });
  }
}

async function completeCrafting() {
  if (!isCompleting.value) return;

  if (craftingRuneId.value && storeMagic.canCraftRuneById(craftingRuneId.value)) {
    storeMagic.craftRune();
    storeSetting.playSound('MagicOnRuneCraft', 20);
  }

  const wasMouseDown = isMouseDown.value;
  const runeBeingCraftedId = currentCraftingRuneId.value;

  if (stopCompleteTimer) {
    stopCompleteTimer();
    stopCompleteTimer = null;
  }

  const id = craftingRuneId.value;
  craftingRuneId.value = null;
  isCompleting.value = false;
  if (id) {
    const motion = progressMotionMap.get(id);
    motion?.stop?.();
    if (motion?.apply) {
      await motion.apply('reset').catch(() => undefined);
    }
  }

  if (wasMouseDown && runeBeingCraftedId) {
    scheduleNextCycle(runeBeingCraftedId);
  }
}

function scheduleNextCycle(runeId: string) {
  const { start, stop } = useTimeoutFn(() => {
    if (
      isMouseDown.value &&
      currentCraftingRuneId.value === runeId &&
      storeMagic.canCraftRuneById(runeId) &&
      !isCompleting.value
    ) {
      const nextRune = storeMagic.runes.find((r) => r.id === runeId);
      if (nextRune) startCraftingCycle(nextRune).catch(() => undefined);
    }
    stop();
  }, 150);
  start();
}

watchEffect(() => {
  const id = currentCraftingRuneId.value;
  if (!id) return;
  if (!isMouseDown.value) return;
  if (craftingRuneId.value !== id) return;
  if (!storeMagic.canCraftRuneById(id)) {
    stopCrafting().catch(() => undefined);
  }
});

onUnmounted(() => {
  stopCrafting().catch(() => undefined);
});

// Global fallbacks in case pointer capture is lost or element is unmounted mid-press
useEventListener(
  window,
  'pointerup',
  () => {
    if (activePointerId.value !== null) {
      activePointerId.value = null;
      stopCrafting().catch(() => undefined);
    }
  },
  { passive: true },
);

useEventListener(
  window,
  'pointercancel',
  () => {
    if (activePointerId.value !== null) {
      activePointerId.value = null;
      stopCrafting().catch(() => undefined);
    }
  },
  { passive: true },
);

useEventListener(document, 'visibilitychange', () => {
  if (document.hidden) {
    activePointerId.value = null;
    stopCrafting().catch(() => undefined);
  }
});
</script>

<style scoped lang="scss">
.magic-rune {
  margin-bottom: 15px;
}

.runes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 12px;
}

.rune-slot {
  position: relative;
  background: linear-gradient(145deg, #f8f9fa, #e9ecef);
  border: 2px solid #dee2e6;
  border-radius: 10px;
  padding: 8px 6px;
  text-align: center;
  cursor: pointer;
  min-height: 115px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  touch-action: none;

  &.selected {
    border-color: #007bff;
    border-width: 3px;
    background: linear-gradient(145deg, #e7f1ff, #cfe2ff);
    box-shadow:
      0 0 20px rgba(0, 123, 255, 0.6),
      inset 0 0 10px rgba(0, 123, 255, 0.2);
    transform: translateY(-2px);

    .rune-icon {
      color: #007bff !important;
      filter: drop-shadow(0 2px 4px rgba(0, 123, 255, 0.3));
    }
  }

  &.yellow-rune {
    opacity: 0.8;
    border-style: dashed;
    border-width: 2px;
    border-color: #f39c12;
    background: linear-gradient(145deg, #ffeaa7, #fdcb6e);
    box-shadow: 0 4px 8px rgba(243, 156, 18, 0.3);

    .rune-icon {
      filter: drop-shadow(0 2px 4px rgba(243, 156, 18, 0.3));
    }

    &.selected {
      opacity: 1;
      border-style: solid;
      border-color: #007bff;
      border-width: 3px;
      background: linear-gradient(145deg, #e7f1ff, #cfe2ff);
      box-shadow:
        0 0 20px rgba(0, 123, 255, 0.6),
        inset 0 0 10px rgba(0, 123, 255, 0.2);
      transform: translateY(-2px);

      .rune-icon {
        color: #007bff !important;
        filter: drop-shadow(0 2px 4px rgba(0, 123, 255, 0.3));
      }
    }
  }

  &.yellow-solid {
    opacity: 1;
    border-style: solid;
    border-width: 2px;
    border-color: #f39c12;
    background: linear-gradient(145deg, #ffeaa7, #fdcb6e);
    box-shadow: 0 4px 8px rgba(243, 156, 18, 0.3);

    .rune-icon {
      filter: drop-shadow(0 2px 4px rgba(243, 156, 18, 0.3));
    }

    &.selected {
      border-color: #007bff;
      border-width: 3px;
      background: linear-gradient(145deg, #e7f1ff, #cfe2ff);
      box-shadow:
        0 0 20px rgba(0, 123, 255, 0.6),
        inset 0 0 10px rgba(0, 123, 255, 0.2);
      transform: translateY(-2px);

      .rune-icon {
        color: #007bff !important;
        filter: drop-shadow(0 2px 4px rgba(0, 123, 255, 0.3));
      }
    }
  }

  &.green-rune {
    opacity: 1;
    background: linear-gradient(145deg, #d4e6d4, #c3d9c3);
    border-color: #1e7e34;
    border-style: solid;
    border-width: 2px;
    box-shadow: 0 4px 8px rgba(30, 126, 52, 0.4);
    cursor: grab;

    .rune-icon {
      filter: drop-shadow(0 2px 4px rgba(30, 126, 52, 0.4));
    }

    &:active {
      cursor: grabbing;
    }

    &.selected {
      border-color: #007bff;
      border-width: 3px;
      background: linear-gradient(145deg, #e7f1ff, #cfe2ff);
      box-shadow:
        0 0 20px rgba(0, 123, 255, 0.6),
        inset 0 0 10px rgba(0, 123, 255, 0.2);

      .rune-icon {
        color: #007bff !important;
        filter: drop-shadow(0 2px 4px rgba(0, 123, 255, 0.3));
      }
    }
  }

  &.crafting {
    border-color: #1e7e34;
    border-width: 3px;
    background: linear-gradient(145deg, #d4e6d4, #d1ecf1);
    box-shadow:
      0 0 15px rgba(30, 126, 52, 0.8),
      inset 0 0 10px rgba(30, 126, 52, 0.3);
    transform: scale(1.02);

    .rune-icon {
      filter: drop-shadow(0 2px 6px rgba(30, 126, 52, 0.5));
      animation: craft-glow 1s ease-in-out infinite alternate;
    }
  }
}

@keyframes craft-glow {
  from {
    filter: drop-shadow(0 2px 6px rgba(30, 126, 52, 0.5));
  }
  to {
    filter: drop-shadow(0 2px 8px rgba(30, 126, 52, 0.9));
  }
}

.craft-progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background: linear-gradient(90deg, #1e7e34, #17a2b8);
  border-radius: 0 0 8px 8px;
  transition: width 0.1s ease-out;
  box-shadow: 0 0 8px rgba(30, 126, 52, 0.7);
  z-index: 10;
}

.rune-icon {
  font-size: 3.8rem;
  margin-bottom: 4px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.rune-level {
  position: absolute;
  top: 6px;
  right: 6px;
  background: linear-gradient(145deg, #007bff, #0056b3);
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
}

.craft-indicator {
  position: absolute;
  top: 6px;
  left: 6px;
  background: linear-gradient(145deg, #1e7e34, #155a24);
  color: white;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  animation: craft-pulse 2s infinite;

  i {
    filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.5));
  }
}

@keyframes craft-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.rune-name {
  font-size: 0.95rem;
  font-weight: bold;
  color: #495057;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.5);
  line-height: 1.1;
}

@media (max-width: 768px) {
  .runes-grid {
    grid-template-columns: repeat(auto-fill, minmax(105px, 1fr));
    gap: 10px;
  }

  .rune-slot {
    padding: 6px 4px;
    min-height: 100px;
  }

  .rune-icon {
    font-size: 3rem;
    margin-bottom: 3px;
  }

  .rune-level {
    width: 22px;
    height: 22px;
    font-size: 0.7rem;
    top: 5px;
    right: 5px;
  }

  .craft-indicator {
    width: 20px;
    height: 20px;
    font-size: 0.6rem;
    top: 5px;
    left: 5px;
  }

  .rune-name {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .runes-grid {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 6px;
  }

  .rune-slot {
    padding: 4px 3px;
    min-height: 72px;
  }

  .rune-icon {
    font-size: 2rem;
  }

  .rune-level {
    width: 20px;
    height: 20px;
    font-size: 0.65rem;
  }

  .craft-indicator {
    width: 18px;
    height: 18px;
    font-size: 0.55rem;
  }

  .rune-name {
    font-size: 0.65rem;
  }
}

@media (max-width: 400px) {
  .runes-grid {
    grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
    gap: 6px;
  }
  .rune-slot {
    min-height: 68px;
  }
  .rune-icon {
    font-size: 1.85rem;
  }
  .rune-level {
    width: 18px;
    height: 18px;
    font-size: 0.6rem;
  }
  .craft-indicator {
    width: 16px;
    height: 16px;
    font-size: 0.5rem;
  }
}
</style>
