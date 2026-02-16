<template>
  <div class="magic-craft text-xs sm:text-sm">
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
        :disable="!canCraftSelected"
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

const canCraftSelected = computed(() => {
  const id = storeMagic.selectedRune?.id;
  return id ? storeMagic.canCraftRuneById(id) : false;
});
</script>

<style scoped lang="scss">
.magic-craft {
  background: linear-gradient(145deg, rgba(52, 58, 64, 0.98), rgba(33, 37, 41, 0.95));
  border: 2px solid #495057;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.no-selection {
  text-align: center;
  padding: 30px 20px;
  color: #adb5bd;
  background: #2c2c2c;
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
  margin-bottom: 16px;
  padding: 12px;
  background: linear-gradient(135deg, rgba(0, 123, 255, 0.15), rgba(0, 123, 255, 0.08));
  border-radius: 12px;
  border: 1px solid rgba(0, 123, 255, 0.3);
  gap: 12px;
}

.selected-rune-details {
  flex: 1;
  min-width: 0;
}

.rune-title {
  font-weight: 700;
  font-size: 1.2rem;
  color: #f8f9fa;
  margin-bottom: 4px;
}

.rune-level-text {
  font-size: 0.9rem;
  color: #4dabf7;
  margin-bottom: 6px;
  font-weight: 600;
}

.rune-description {
  font-size: 0.85rem;
  color: #adb5bd;
  line-height: 1.4;
}

.selected-rune-icon {
  font-size: 2.2rem;
  flex-shrink: 0;
  opacity: 0.8;
}

.requirements-section {
  margin-top: 20px;
}

.requirements-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: #ced4da;
  margin-bottom: 12px;
  text-align: left;
  border-bottom: 2px solid #495057;
  padding-bottom: 6px;
}

.requirements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
}

.requirement-item {
  background: rgba(73, 80, 87, 0.4);
  border: 1px solid #6c757d;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
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
  font-size: 1.3rem;
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
  padding: 14px 20px;
  font-size: 1.05rem;
  font-weight: 600;
  border-radius: 8px;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;

  &:not(:disabled) {
    background: linear-gradient(135deg, #1e7ed6, #1864ab);
    box-shadow: 0 4px 12px rgba(30, 126, 214, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    background: #343a40;
    color: #adb5bd;
    cursor: not-allowed;
  }

  .fas {
    margin-right: 8px;
  }
}

@media (max-width: 768px) {
  .magic-craft {
    padding: 12px;
    margin: 0 8px;
  }

  .selected-rune-info {
    flex-direction: column;
    text-align: center;
    gap: 6px;
    padding: 10px;
    margin-bottom: 12px;
  }

  .selected-rune-icon {
    font-size: 1.6rem;
    order: -1;
  }

  .rune-title {
    font-size: 0.95rem;
    margin-bottom: 3px;
  }

  .rune-level-text {
    font-size: 0.8rem;
    margin-bottom: 4px;
  }

  .rune-description {
    font-size: 0.7rem;
  }

  .requirements-section {
    margin-top: 16px;
  }

  .requirements-title {
    font-size: 0.95rem;
    margin-bottom: 8px;
    padding-bottom: 4px;
  }

  .requirements-grid {
    grid-template-columns: 1fr;
    gap: 6px;
    margin-bottom: 14px;
  }

  .requirement-item {
    padding: 8px;
    gap: 8px;
  }

  .requirement-icon {
    font-size: 1.1rem;
  }

  .requirement-amount {
    font-size: 0.8rem;
    margin-bottom: 2px;
  }

  .requirement-name {
    font-size: 0.7rem;
  }

  .craft-button {
    padding: 10px 14px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .magic-craft {
    padding: 10px;
    margin: 0 6px;
  }

  .no-selection {
    padding: 16px 10px;
  }

  .no-selection-icon {
    font-size: 1.8rem;
    margin-bottom: 10px;
  }

  .no-selection-text {
    font-size: 0.9rem;
  }

  .selected-rune-info {
    padding: 8px;
    gap: 4px;
    margin-bottom: 10px;
  }

  .selected-rune-icon {
    font-size: 1.3rem;
  }

  .rune-title {
    font-size: 0.9rem;
    margin-bottom: 2px;
  }

  .rune-level-text {
    font-size: 0.7rem;
    margin-bottom: 3px;
  }

  .rune-description {
    font-size: 0.65rem;
  }

  .requirements-section {
    margin-top: 12px;
  }

  .requirements-title {
    font-size: 0.85rem;
    margin-bottom: 6px;
    padding-bottom: 3px;
  }

  .requirements-grid {
    gap: 4px;
    margin-bottom: 10px;
  }

  .requirement-item {
    padding: 6px;
    gap: 6px;
  }

  .requirement-icon {
    font-size: 0.95rem;
  }

  .requirement-amount {
    font-size: 0.7rem;
    margin-bottom: 1px;
  }

  .requirement-name {
    font-size: 0.65rem;
  }

  .craft-button {
    padding: 8px 12px;
    font-size: 0.8rem;
  }

  .craft-button .fas {
    margin-right: 4px;
  }
}
</style>
