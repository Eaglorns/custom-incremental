<template>
  <q-page class="q-pa-lg flex flex-center">
    <div class="lore-container">
      <div v-for="(key, i) in STAGE_KEYS" :key="key" class="q-mb-md">
        <div v-if="storeData.stage >= i">
          <q-card class="lore-card q-pa-sm">
            <q-card-section>
              <div class="text-h6">{{ (lore as any)[key]?.title || key }}</div>
              <div class="q-mt-sm">{{ (lore as any)[key]?.text || 'Нет описания.' }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useStoreData } from 'stores/data';
import { lore } from 'src/constants/loreMeta';

const storeData = useStoreData();

const STAGE_KEYS = [
  'stageZero',
  'stageAchievement',
  'stageScientist',
  'stageResearch',
  'stageAutomatic',
  'stagePrestige',
  'stageEternity',
  'stageMagic',
  'stageInfinity',
];
</script>

<style scoped>
.lore-container {
  max-width: 920px;
  margin: 0 auto;
  width: 100%;
}
.lore-card {
  padding: 8px;
}
.q-expansion-item__container {
  background: transparent;
}
.q-expansion-item__content {
  background: rgba(255, 255, 255, 0.03);
}
.q-expansion-item__wrap {
  border-radius: 8px;
}
</style>
