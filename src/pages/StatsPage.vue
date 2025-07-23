<template>
  <q-page class="stats-page">
    <div class="stats-container">
      <q-card flat bordered class="stats-card">
        <q-card-section>
          <q-separator class="stats-separator" />
          <template v-for="stat in stats" :key="stat.label">
            <div v-if="Array.isArray(stat.value)" class="stats-group">
              <div class="stats-group__label">
                {{ stat.label }}
              </div>
              <div class="stats-group__row">
                <q-input
                  v-for="(item, idx) in stat.value"
                  :label="item.label"
                  :key="stat.label + idx"
                  :model-value="item.value"
                  readonly
                  dense
                  filled
                  color="primary"
                  class="stats-input stats-input--group"
                  :style="{ width: stat.widths ? stat.widths[idx] : stat.width }"
                />
              </div>
            </div>
            <q-input
              v-else
              :label="stat.label"
              :model-value="stat.value"
              readonly
              dense
              filled
              color="primary"
              class="stats-input"
              :style="{ width: stat.width }"
            />
            <q-separator class="stats-separator" />
          </template>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStoreData } from 'stores/data';
import { useStoreGame } from 'stores/game';
import { useStoreResearch } from 'stores/research';
import { useStoreStats } from 'stores/stats';

const storeData = useStoreData();
const storeGame = useStoreGame();
const storeResearch = useStoreResearch();
const storeStats = useStoreStats();

const formatNumber = storeData.formatNumber;

const stats = computed(() => [
  {
    label: 'Максимально набранное число',
    value: formatNumber(storeStats.maxEpicNumber),
    width: '220px',
  },
  {
    label: 'Генерация числа тик',
    value: formatNumber(storeGame.generateEpicNumber),
    width: '160px',
  },
  {
    label: 'Множитель прироста числа',
    value: [
      { label: 'Значение', value: formatNumber(storeData.multiplierEpicNumber) },
      { label: 'Результат', value: formatNumber(storeData.getMultiplierEpicNumber) },
    ],
    widths: ['115px', '115px'],
  },
  {
    label: 'Максимально набранные очки исследований',
    value: formatNumber(storeStats.maxResearchPoints),
    width: '310px',
  },
  {
    label: 'Множитель ускорения исследований',
    value: [
      { label: 'Значение', value: formatNumber(storeResearch.speed) },
      { label: 'Результат', value: formatNumber(storeResearch.getResearchSpeed) },
    ],
    widths: ['115px', '115px'],
  },
  {
    label: 'Максимально набранные очки престижа',
    value: formatNumber(storeStats.maxPrestigePoints),
    width: '280px',
  },
]);
</script>

<style scoped lang="scss">
$mobile-breakpoint: 700px;

.stats-page {
  padding: 24px;
  color: #e8eaf0;
  min-height: 100vh;

  @media (max-width: $mobile-breakpoint) {
    padding: 16px;
  }
}

.stats-container {
  max-width: 800px;
  margin: 0 auto;
}

.stats-card {
  border: 2px solid #4a5568;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  color: #e8eaf0;
}

.stats-separator {
  margin: 8px 0;
  background: rgba(66, 165, 245, 0.2);
  height: 1px;
}

.stats-group {
  margin-bottom: 12px;

  &__label {
    color: #64b5f6;
    font-weight: 700;
    font-size: 1.12em;
    margin-bottom: 8px;
    letter-spacing: 0.3px;
  }

  &__row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;

    @media (max-width: $mobile-breakpoint) {
      flex-direction: column;
      align-items: stretch;
      gap: 8px;
    }
  }
}

.stats-input {
  background: #363b48;
  color: #e8eaf0;
  font-weight: 600;
  border-radius: 8px;

  &--group {
    margin-right: 8px;

    @media (max-width: $mobile-breakpoint) {
      margin-right: 0;
      width: 100% !important;
    }
  }

  @media (max-width: $mobile-breakpoint) {
    width: 100% !important;
  }

  :deep(.q-field__label) {
    color: #90caf9 !important;
    font-weight: 600 !important;
    font-size: 1.05em !important;
  }

  :deep(.q-field__control) {
    background: #363b48 !important;
    border: 1px solid #4a5568 !important;
    border-radius: 8px !important;
  }

  :deep(.q-field__native) {
    color: #e8eaf0 !important;
    font-weight: 700 !important;
    font-size: 1.08em !important;
    letter-spacing: 0.3px;
  }

  &:nth-child(1) {
    :deep(.q-field__native) {
      color: #81c784 !important;
    }
    :deep(.q-field__label) {
      color: #a5d6a7 !important;
    }
  }

  &:nth-child(2) {
    :deep(.q-field__native) {
      color: #64b5f6 !important;
    }
    :deep(.q-field__label) {
      color: #90caf9 !important;
    }
  }

  &:nth-child(4) {
    :deep(.q-field__native) {
      color: #81c784 !important;
    }
    :deep(.q-field__label) {
      color: #a5d6a7 !important;
    }
  }

  &:nth-child(6) {
    :deep(.q-field__native) {
      color: #81c784 !important;
    }
    :deep(.q-field__label) {
      color: #a5d6a7 !important;
    }
  }
}

.stats-group .stats-input {
  :deep(.q-field__native) {
    color: #ffb74d !important;
  }
  :deep(.q-field__label) {
    color: #ffcc80 !important;
  }
}
</style>
