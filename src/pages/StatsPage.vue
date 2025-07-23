<template>
  <q-page class="q-pa-lg bg-dark text-white">
    <q-card flat bordered class="bg-grey-10 text-white">
      <q-card-section>
        <q-separator style="margin-top: 5px; margin-bottom: 5px" />
        <template v-for="stat in stats" :key="stat.label">
          <div v-if="Array.isArray(stat.value)">
            <div class="q-mb-xs text-primary text-weight-bold" style="font-size: 1.08em">
              {{ stat.label }}
            </div>
            <div class="row items-center">
              <q-input
                v-for="(item, idx) in stat.value"
                :label="item.label"
                :key="stat.label + idx"
                :model-value="item.value"
                readonly
                dense
                filled
                color="primary"
                class="bg-grey-9 text-accent text-weight-bold"
                :style="
                  'width: ' + (stat.widths ? stat.widths[idx] : stat.width) + '; margin-right: 5px;'
                "
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
            class="bg-grey-9 text-accent text-weight-bold"
            :style="'width: ' + stat.width + ';'"
          />
          <q-separator style="margin-top: 5px; margin-bottom: 5px" />
        </template>
      </q-card-section>
    </q-card>
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
    width: '200px',
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
    width: '280px',
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
    width: '250px',
  },
]);
</script>

<style scoped>
.bg-grey-9 :deep(.q-field__label) {
  color: #92e6b5 !important;
  font-weight: bold !important;
  font-size: 1.01em;
}
</style>
