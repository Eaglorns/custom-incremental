<template>
  <q-page class="q-pa-md bg-dark text-white">
    <q-card flat bordered class="bg-grey-10 text-white stat-card">
      <q-card-section>
        <div v-for="stat in statsView" :key="stat.label" class="stat-row">
          <template v-if="stat.kind === 'multi'">
            <div class="stat-label">{{ stat.label }}</div>
            <div class="row items-center">
              <q-input
                v-for="(item, idx) in stat.items"
                :label="item.label"
                :key="stat.label + idx"
                :model-value="item.value"
                readonly
                dense
                filled
                color="primary"
                class="bg-grey-9 text-accent stat-input"
                :style="'width:' + item.width + ';'"
              />
            </div>
          </template>
          <q-input
            v-else
            :label="stat.label"
            :model-value="stat.value"
            readonly
            dense
            filled
            color="primary"
            class="bg-grey-9 text-accent stat-input"
            :style="'width:' + stat.width + ';'"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStoreData } from 'stores/data';
import { useStoreResearch } from 'stores/research';
import { useStoreStats } from 'stores/stats';
import Decimal from 'break_eternity.js';

const storeData = useStoreData();
const storeResearch = useStoreResearch();
const storeStats = useStoreStats();

const formatNumber = storeData.formatNumber;
const formatTime = storeData.formatTime;

const statsView = computed(() => {
  const maxShopWidths = ['100px', '100px', '100px', '100px'];
  const multWidths = ['100px', '100px'];
  return [
    {
      label: 'Проведено времени в игре',
      value: formatTime(new Decimal(storeStats.gameTime)),
      width: '200px',
      kind: 'single' as const,
    },
    {
      label: 'Максимальное ЧИСЛО',
      value: formatNumber(storeStats.maxEpicNumber),
      width: '200px',
      kind: 'single' as const,
    },
    {
      label: 'Максимальные монеты',
      value: formatNumber(storeStats.maxShopPoints),
      width: '275px',
      kind: 'single' as const,
    },
    {
      label: 'Максимальные очки престижа',
      value: formatNumber(storeStats.maxPrestigePoints),
      width: '275px',
      kind: 'single' as const,
    },
    {
      label: 'Максимальные очки исследований',
      value: formatNumber(storeStats.maxResearchPoints),
      width: '275px',
      kind: 'single' as const,
    },
    {
      label: 'Максимальное значения магазина',
      items: [
        { label: 'CPU', value: formatNumber(storeStats.maxShopBuy.cpu), width: maxShopWidths[0] },
        { label: 'HDD', value: formatNumber(storeStats.maxShopBuy.hdd), width: maxShopWidths[1] },
        { label: 'RAM', value: formatNumber(storeStats.maxShopBuy.ram), width: maxShopWidths[2] },
        {
          label: 'Работники',
          value: formatNumber(storeStats.maxShopBuy.worker),
          width: maxShopWidths[3],
        },
      ],
      kind: 'multi' as const,
    },
    {
      label: 'Множитель прироста числа',
      items: [
        {
          label: 'Значение',
          value: formatNumber(storeData.multiplierEpicNumber),
          width: multWidths[0],
        },
        {
          label: 'Результат',
          value: formatNumber(storeData.getMultiplierEpicNumber),
          width: multWidths[1],
        },
      ],
      kind: 'multi' as const,
    },
    {
      label: 'Множитель ускорения исследований',
      items: [
        { label: 'Значение', value: formatNumber(storeResearch.speed), width: multWidths[0] },
        {
          label: 'Результат',
          value: formatNumber(storeResearch.getResearchSpeed),
          width: multWidths[1],
        },
      ],
      kind: 'multi' as const,
    },
  ];
});
</script>

<style lang="scss" scoped>
.stat-card {
  max-width: 480px;
  margin: 0 auto;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
.stat-row {
  margin-bottom: 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
}
.stat-label {
  color: #7be0b7;
  font-weight: 600;
  font-size: 1.04em;
  margin-bottom: 2px;
}
.stat-input :deep(.q-field__label) {
  color: #92e6b5 !important;
  font-weight: bold !important;
  font-size: 1.01em;
}
.stat-input {
  margin-right: 8px;
  margin-bottom: 2px;
}
@media (max-width: 600px) {
  .stat-card {
    max-width: 100%;
    border-radius: 7px;
    padding: 0;
  }
  .stat-row {
    margin-bottom: 7px;
    padding-bottom: 3px;
  }
  .stat-label {
    font-size: 0.98em;
  }
  .stat-input {
    margin-right: 4px;
    font-size: 0.97em;
  }
}
</style>
