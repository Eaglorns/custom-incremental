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
          crafting: craftingRune?.id === rune.id,
        }"
        @click="storeMagic.selectRune(rune)"
        @mousedown="startCrafting(rune)"
        @mouseup="stopCrafting"
        @mouseleave="stopCrafting"
        @touchstart.prevent="startCrafting(rune)"
        @touchend="stopCrafting"
        @touchcancel="stopCrafting"
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
          v-if="craftingRune?.id === rune.id"
          class="craft-progress-bar"
          :style="{ width: craftProgress + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onUnmounted } from 'vue';
import { useStoreMagic } from 'src/stores/magic';
import { RUNE_META } from 'src/constants/magicMeta';
import { useStoreSetting } from 'src/stores/setting';
import type { Rune } from 'src/stores/magic';

const storeMagic = useStoreMagic();
const storeSetting = useStoreSetting();

const craftingRune = ref<Rune | null>(null);
const craftProgress = ref(0);
const craftTimer = ref<number | null>(null);
const craftDuration = 500;
const holdDelay = 100;
const holdTimeout = ref<number | null>(null);
const isMouseDown = ref(false);
const currentCraftingRune = ref<Rune | null>(null);
const isCompleting = ref(false);

const iconStyle = computed(() => {
  return storeSetting.iconStyle;
});

const runesWithMeta = computed(() => {
  return storeMagic.runes.map((rune) => {
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
  });
});

const startCrafting = (rune: Rune) => {
  storeMagic.selectRune(rune);

  if (!storeMagic.canCraftRuneById(rune.id)) {
    return;
  }

  isMouseDown.value = true;
  currentCraftingRune.value = rune;

  if (craftingRune.value?.id === rune.id) {
    return;
  }

  if (holdTimeout.value) {
    clearTimeout(holdTimeout.value);
  }
  holdTimeout.value = window.setTimeout(() => {
    if (!isMouseDown.value || currentCraftingRune.value?.id !== rune.id) return;
    startCraftingCycle(rune);
  }, holdDelay);
};

const startCraftingCycle = (rune: Rune) => {
  if (!storeMagic.canCraftRuneById(rune.id)) {
    stopCrafting();
    return;
  }

  if (isCompleting.value) {
    return;
  }

  if (!isMouseDown.value || currentCraftingRune.value?.id !== rune.id) {
    return;
  }

  storeMagic.selectRune(rune);
  craftingRune.value = rune;
  craftProgress.value = 0;
  isCompleting.value = false;

  const startTime = Date.now();

  const updateProgress = () => {
    if (
      isCompleting.value ||
      !isMouseDown.value ||
      currentCraftingRune.value?.id !== rune.id ||
      !storeMagic.canCraftRuneById(rune.id)
    ) {
      if (!isCompleting.value) {
        stopCrafting();
      }
      return;
    }

    const elapsed = Date.now() - startTime;
    const progress = Math.min((elapsed / craftDuration) * 100, 100);
    craftProgress.value = progress;

    if (progress >= 100) {
      if (storeMagic.canCraftRuneById(rune.id) && !isCompleting.value) {
        isCompleting.value = true;
        completeCrafting();
      } else {
        stopCrafting();
      }
    } else {
      craftTimer.value = requestAnimationFrame(updateProgress);
    }
  };

  craftTimer.value = requestAnimationFrame(updateProgress);
};

const stopCrafting = () => {
  isMouseDown.value = false;
  currentCraftingRune.value = null;
  isCompleting.value = false;

  if (holdTimeout.value) {
    clearTimeout(holdTimeout.value);
    holdTimeout.value = null;
  }

  if (craftTimer.value) {
    cancelAnimationFrame(craftTimer.value);
    craftTimer.value = null;
  }
  craftingRune.value = null;
  craftProgress.value = 0;
};

const completeCrafting = () => {
  if (!isCompleting.value) {
    return;
  }

  if (craftingRune.value && storeMagic.canCraftRuneById(craftingRune.value.id)) {
    storeMagic.selectRune(craftingRune.value);
    storeMagic.craftRune();
    storeSetting.playSound('MagicOnRuneCraft', 20);
  }

  const wasMouseDown = isMouseDown.value;
  const runeBeingCrafted = currentCraftingRune.value;

  if (craftTimer.value) {
    cancelAnimationFrame(craftTimer.value);
    craftTimer.value = null;
  }
  craftingRune.value = null;
  craftProgress.value = 0;
  isCompleting.value = false;

  if (wasMouseDown && runeBeingCrafted) {
    setTimeout(() => {
      if (
        isMouseDown.value &&
        currentCraftingRune.value?.id === runeBeingCrafted.id &&
        storeMagic.canCraftRuneById(runeBeingCrafted.id) &&
        !isCompleting.value
      ) {
        startCraftingCycle(runeBeingCrafted);
      }
    }, 150);
  }
};

onUnmounted(() => {
  stopCrafting();
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
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  top: 6px;
  right: 6px;
  background: linear-gradient(145deg, #007bff, #0056b3);
  color: #000000;
  border-radius: 50%;
  width: 24px;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.4);
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
