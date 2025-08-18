<template>
  <q-page class="q-pa-md eternity-overview-page">
    <q-card class="q-pa-lg q-mx-auto overview-card game-card">
      <div class="overview-body q-mt-md">
        <div class="stat big stat-rune">
          <div class="label">Значение вечности</div>
          <div class="value text-h3 shimmer">{{ formatNumber(storeEternity.points) }}</div>
        </div>

        <div class="stat big stat-rune">
          <div class="label">Количество сбросов</div>
          <div class="value text-h6">{{ formatNumber(storeEternity.countReset) }}</div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useStoreEternity } from 'stores/eternity';
import { useStoreData } from 'stores/data';

const storeEternity = useStoreEternity();
const storeData = useStoreData();

const formatNumber = storeData.formatNumber;
</script>

<style scoped lang="scss">
.eternity-overview-page {
  display: flex;
  justify-content: center;
  padding-top: 20px;
}
.overview-card {
  width: 720px;
  max-width: 100%;
  position: relative;
  overflow: visible;
}

.game-card {
  background: linear-gradient(180deg, #0f1724 0%, #122033 70%);
  border: 2px solid rgba(255, 215, 160, 0.06);
  box-shadow:
    0 8px 30px rgba(2, 6, 23, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  color: #f8f6f2;
}

.overview-body {
  display: flex;
  gap: 24px;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 18px;
}
.stat {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01));
  padding: 16px;
  border-radius: 10px;
  flex: 1 1 260px;
  border: 1px solid rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(2px);
  position: relative;
}
.stat-rune::after {
  content: '⟐';
  position: absolute;
  right: 10px;
  top: 8px;
  font-size: 20px;
  color: rgba(255, 235, 160, 0.08);
}
.stat.big .value {
  font-weight: 900;
}

.label {
  color: #cbd5e1;
  font-size: 13px;
  margin-bottom: 8px;
}
.value {
  color: #fffaf0;
  font-size: 28px;
  line-height: 1.1;
}

.shimmer {
  text-shadow: 0 0 6px rgba(255, 235, 160, 0.22);
}

@media (max-width: 600px) {
  .overview-body {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
