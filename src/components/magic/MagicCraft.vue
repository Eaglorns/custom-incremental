<template>
  <div class="magic-craft">
    <div v-if="!storeMagic.selectedRune" class="no-selection">
      <div class="no-selection-icon">
        <i :class="iconStyle + 'fa-hand-pointer'"></i>
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
          :class="iconStyle + selectedRuneWithMeta?.meta.icon"
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
            insufficient: !storeMagic.canAffordEssenceRequirement(requirement),
          }"
        >
          <div class="requirement-icon">
            <i
              :class="iconStyle + getEssenceMetaById(requirement.essenceId)?.icon"
              :style="{ color: getEssenceMetaById(requirement.essenceId)?.color }"
            ></i>
          </div>
          <div class="requirement-content">
            <div class="requirement-amount">
              {{
                formatNumber(
                  storeMagic.getEssenceById(requirement.essenceId)?.amount || new Decimal(0),
                )
              }}
              /
              {{ formatNumber(storeMagic.getRequiredEssenceAmount(requirement)) }}
            </div>
            <div class="requirement-name">
              {{ getEssenceMetaById(requirement.essenceId)?.name }}
            </div>
          </div>
        </div>
      </div>

      <q-btn
        class="craft-button"
        color="primary"
        :disable="!storeMagic.canCraftRune()"
        @click="
          storeMagic.craftRune();
          storeSetting.playSound('MagicOnRuneCraft', 14);
        "
      >
        <i :class="iconStyle + 'fa-hammer mr-2'"></i>
        Создать
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStoreMagic } from 'stores/magic';
import { useStoreData } from 'stores/data';
import { RUNE_META, ESSENCE_META } from 'src/constants/magicMeta';
import Decimal from 'break_eternity.js';
import { useStoreSetting } from 'src/stores/setting';

const storeSetting = useStoreSetting();

const iconStyle = computed(() => {
  return storeSetting.iconStyle;
});

const storeMagic = useStoreMagic();
const storeData = useStoreData();

const formatNumber = storeData.formatNumber;

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
  background: linear-gradient(145deg, rgba(52, 58, 64, 0.98), rgba(33, 37, 41, 0.95));
  border: 2px solid #495057;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.no-selection {
  text-align: center;
  padding: 40px 20px;
  color: #adb5bd;
  background: rgba(73, 80, 87, 0.3);
  border-radius: 12px;
  border: 1px dashed #6c757d;
}

.no-selection-icon {
  font-size: 3rem;
  margin-bottom: 16px;
  color: #6c757d;
}

.no-selection-text {
  font-size: 1.1rem;
  font-weight: 500;
  color: #ced4da;
}

.selected-rune-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(0, 123, 255, 0.15), rgba(0, 123, 255, 0.08));
  border-radius: 12px;
  border: 1px solid rgba(0, 123, 255, 0.3);
  gap: 20px;
}

.selected-rune-details {
  flex: 1;
  min-width: 0;
}

.rune-title {
  font-weight: 700;
  font-size: 1.4rem;
  color: #f8f9fa;
  margin-bottom: 8px;
}

.rune-level-text {
  font-size: 1rem;
  color: #4dabf7;
  margin-bottom: 12px;
  font-weight: 600;
}

.rune-description {
  font-size: 0.9rem;
  color: #adb5bd;
  line-height: 1.5;
}

.selected-rune-icon {
  font-size: 3rem;
  flex-shrink: 0;
  opacity: 0.8;
}

.requirements-section {
  margin-top: 24px;
}

.requirements-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #ced4da;
  margin-bottom: 16px;
  text-align: left;
  border-bottom: 2px solid #495057;
  padding-bottom: 8px;
}

.requirements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.requirement-item {
  background: rgba(73, 80, 87, 0.4);
  border: 1px solid #6c757d;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #4dabf7;
    box-shadow: 0 2px 8px rgba(77, 171, 247, 0.25);
  }

  &.insufficient {
    border-color: #fd7e14;
    background: rgba(253, 126, 20, 0.1);
  }
}

.requirement-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.requirement-content {
  flex: 1;
  min-width: 0;
}

.requirement-amount {
  font-weight: 600;
  color: #f8f9fa;
  font-size: 0.95rem;
  margin-bottom: 4px;
}

.requirement-name {
  font-size: 0.85rem;
  color: #adb5bd;
  font-weight: 500;
}

.craft-button {
  width: 100%;
  padding: 16px 24px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 8px;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;

  &:not(:disabled) {
    background: linear-gradient(135deg, #4dabf7, #339af0);
    color: white;
    box-shadow: 0 4px 12px rgba(77, 171, 247, 0.4);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(77, 171, 247, 0.5);
    }
  }

  &:disabled {
    opacity: 0.6;
    background: #495057;
    color: #adb5bd;
    cursor: not-allowed;
  }

  .fas {
    margin-right: 8px;
  }
}

// Мобильная адаптация
@media (max-width: 768px) {
  .magic-craft {
    padding: 20px;
    margin: 0 16px;
  }

  .selected-rune-info {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .selected-rune-icon {
    font-size: 2.5rem;
    order: -1;
  }

  .rune-title {
    font-size: 1.2rem;
  }

  .requirements-grid {
    grid-template-columns: 1fr;
  }

  .requirement-item {
    padding: 12px;
  }

  .craft-button {
    padding: 14px 20px;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .magic-craft {
    padding: 16px;
    margin: 0 8px;
  }

  .no-selection {
    padding: 30px 16px;
  }

  .no-selection-icon {
    font-size: 2.5rem;
  }

  .selected-rune-info {
    padding: 16px;
  }

  .selected-rune-icon {
    font-size: 2rem;
  }

  .rune-title {
    font-size: 1.1rem;
  }

  .rune-level-text {
    font-size: 0.9rem;
  }

  .rune-description {
    font-size: 0.8rem;
  }

  .requirement-item {
    padding: 10px;
  }

  .requirement-icon {
    font-size: 1.3rem;
  }

  .requirement-amount {
    font-size: 0.85rem;
  }

  .requirement-name {
    font-size: 0.75rem;
  }

  .craft-button {
    padding: 12px 18px;
    font-size: 0.95rem;
  }
}
</style>
