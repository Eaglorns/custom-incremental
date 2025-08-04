<template>
  <div class="magic-craft">
    <div v-if="!storeMagic.selectedRune" class="no-selection">
      <div class="no-selection-icon">
        <i class="fas fa-hand-pointer"></i>
      </div>
      <div class="no-selection-text">Выберите руну для создания</div>
    </div>

    <div v-if="storeMagic.selectedRune" class="selected-rune-info">
      <div class="selected-rune-details">
        <div class="rune-title">{{ selectedRuneWithMeta?.meta.name }}</div>
        <div class="rune-level-text">Уровень: {{ storeMagic.selectedRune.level }}</div>
        <div class="rune-description">{{ selectedRuneWithMeta?.meta.description }}</div>
      </div>
      <div class="selected-rune-icon">
        <i
          :class="selectedRuneWithMeta?.meta.icon"
          :style="{ color: selectedRuneWithMeta?.meta.color }"
        ></i>
      </div>
    </div>

    <div v-if="storeMagic.selectedRune" class="requirements-section">
      <div class="requirements-title">Требуется эссенций:</div>
      <div class="requirements-grid">
        <div
          v-for="requirement in selectedRuneWithMeta?.meta.requirements"
          :key="requirement.essenceId"
          class="requirement-item"
          :class="{
            insufficient: !storeMagic.canAffordRequirement(requirement),
          }"
        >
          <div class="requirement-icon">
            <i
              :class="getEssenceMetaById(requirement.essenceId)?.icon"
              :style="{ color: getEssenceMetaById(requirement.essenceId)?.color }"
            ></i>
          </div>
          <div class="requirement-amount">
            {{ storeMagic.getEssenceById(requirement.essenceId)?.amount || 0 }} /
            {{ storeMagic.getRequiredAmount(requirement) }}
          </div>
          <div class="requirement-name">
            {{ getEssenceMetaById(requirement.essenceId)?.name }}
          </div>
        </div>
      </div>

      <q-btn
        class="craft-button"
        color="primary"
        :disable="!storeMagic.canCraftRune()"
        @click="storeMagic.craftRune()"
      >
        <i class="fas fa-hammer mr-2"></i>
        Создать
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStoreMagic } from 'src/stores/magic';
import { RUNE_META, ESSENCE_META } from 'src/constants/magicMeta';

const storeMagic = useStoreMagic();

const selectedRuneWithMeta = computed(() => {
  if (!storeMagic.selectedRune) return null;
  const meta = RUNE_META.find((m) => m.id === storeMagic.selectedRune!.id);
  const currentRune = storeMagic.runes.find((r) => r.id === storeMagic.selectedRune!.id);
  return {
    ...(currentRune || storeMagic.selectedRune),
    meta: meta || {
      name: 'Неизвестная руна',
      icon: 'fas fa-question',
      color: '#666',
      description: '',
      requirements: [],
    },
  };
});

const getEssenceMetaById = (id: string) => {
  return ESSENCE_META.find((meta) => meta.id === id);
};
</script>

<style scoped lang="scss">
.magic-craft {
  background: linear-gradient(145deg, rgba(30, 30, 50, 0.95), rgba(50, 30, 80, 0.95));
  border: 2px solid transparent;
  background-clip: padding-box;
  border-radius: 16px;
  padding: 20px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  width: fit-content;
  min-width: 320px;
  max-width: 100%;
  margin: 0 auto;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    background: linear-gradient(45deg, #4ecdc4, #45b7d1);
    border-radius: 17px;
    z-index: -1;
    opacity: 0.6;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.02) 0%, transparent 70%);
    pointer-events: none;
  }
}

.no-selection {
  text-align: center;
  padding: 30px 20px;
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.no-selection-icon {
  font-size: 3rem;
  margin-bottom: 15px;
  opacity: 0.5;
  background: linear-gradient(45deg, #4ecdc4, #45b7d1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.no-selection-text {
  font-size: 1rem;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.selected-rune-info {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 15px 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: 12px;
  gap: 15px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 4px 16px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.15);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
    animation: shimmer 4s ease-in-out infinite;
  }
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.selected-rune-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
  text-shadow:
    0 0 4px currentColor,
    0 2px 4px rgba(0, 0, 0, 0.5);
  margin-top: 2px;
  filter: drop-shadow(0 0 3px currentColor);
}

.selected-rune-details {
  flex: 1;
  min-width: 0;
}

.rune-title {
  font-weight: bold;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.95);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow:
    0 2px 4px rgba(0, 0, 0, 0.5),
    0 0 8px rgba(255, 255, 255, 0.3);
  background: linear-gradient(45deg, #ffd700, #ff6b6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.rune-level-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 5px;
  font-style: italic;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  font-weight: 500;
}

.rune-description {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 8px;
  line-height: 1.4;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.requirements-section {
  margin-top: 15px;
}

.requirements-title {
  font-size: 1rem;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 15px;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  background: linear-gradient(45deg, #4ecdc4, #45b7d1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.requirements-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}

.requirement-item {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);

  &.insufficient {
    border-color: #ff6b6b;
    background: linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(255, 107, 107, 0.05));
    box-shadow:
      0 4px 16px rgba(255, 107, 107, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
}

.requirement-icon {
  font-size: 1.4rem;
  text-shadow:
    0 0 3px currentColor,
    0 2px 4px rgba(0, 0, 0, 0.5);
  filter: drop-shadow(0 0 2px currentColor);
}

.requirement-amount {
  font-weight: bold;
  color: rgba(255, 255, 255, 0.95);
  font-size: 0.9rem;
  white-space: nowrap;
  text-shadow:
    0 1px 2px rgba(0, 0, 0, 0.7),
    0 0 4px rgba(255, 255, 255, 0.3);
  background: linear-gradient(45deg, #ffd700, #ff8c00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.requirement-name {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  white-space: nowrap;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  font-weight: 500;
}

.craft-button {
  flex-shrink: 0;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: linear-gradient(135deg, #4ecdc4, #45b7d1);
  border: 2px solid transparent;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  box-shadow:
    0 6px 20px rgba(76, 205, 196, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);

  &:disabled {
    opacity: 0.5;
    background: linear-gradient(135deg, #6c757d, #5a6268);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    cursor: not-allowed;
  }

  .fas {
    margin-right: 8px;
    filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.3));
  }
}

// Мобильная адаптация
@media (max-width: 768px) {
  .magic-craft {
    padding: 15px;
    min-width: 280px;
  }

  .selected-rune-info {
    padding: 12px 15px;
  }

  .selected-rune-icon {
    font-size: 2rem;
  }

  .rune-title {
    font-size: 1rem;
  }

  .rune-level-text {
    font-size: 0.8rem;
  }

  .rune-description {
    font-size: 0.75rem;
  }

  .craft-button {
    font-size: 0.9rem;
    padding: 10px 20px;
  }

  .requirement-item {
    padding: 8px 10px;
  }

  .requirement-icon {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .magic-craft {
    padding: 12px;
    min-width: 250px;
  }

  .selected-rune-info {
    padding: 10px 12px;
  }

  .selected-rune-icon {
    font-size: 1.8rem;
  }

  .rune-title {
    font-size: 0.9rem;
  }

  .rune-level-text {
    font-size: 0.75rem;
  }

  .rune-description {
    font-size: 0.7rem;
  }

  .craft-button {
    font-size: 0.85rem;
    padding: 10px 18px;
  }

  .requirement-item {
    min-width: 60px;
    padding: 6px 8px;
  }

  .requirement-icon {
    font-size: 1rem;
  }

  .requirement-amount {
    font-size: 0.75rem;
  }

  .requirement-name {
    font-size: 0.65rem;
  }
}
</style>
