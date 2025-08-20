<template>
  <div class="q-pa-md">
    <section v-for="item in targets" :key="item.key" class="cheat-section cheat-card q-mb-md">
      <div class="q-gutter-y-sm">
        <div class="row items-center cheat-header">
          <div class="col-12">{{ item.label }}</div>
        </div>
        <div class="row items-center q-gutter-sm cheat-actions">
          <div class="col-12 col-md-auto input-col">
            <q-input dense v-model="item.input" type="text" class="full-input" />
          </div>
          <div class="col-12 col-md-auto row items-stretch q-gutter-sm action-buttons">
            <q-btn
              dense
              class="col-12 col-sm-auto"
              color="positive"
              label="Добавить"
              @click="onAdd(item)"
            />
            <q-btn
              dense
              class="col-12 col-sm-auto"
              color="primary"
              label="Умножить"
              @click="onMul(item)"
            />
            <q-btn
              dense
              class="col-12 col-sm-auto"
              color="negative"
              label="Вычесть"
              @click="onSub(item)"
            />
            <q-btn
              dense
              class="col-12 col-sm-auto"
              color="secondary"
              label="Разделить"
              @click="onDiv(item)"
            />
            <q-btn
              dense
              class="col-12 col-sm-auto"
              color="warning"
              label="Возвести в степень"
              @click="onPow(item)"
            />
          </div>
          <div class="col-12 col-md-auto current-value q-gutter-xs">
            <div class="current-label">Текущее:</div>
            <div class="current-number">{{ formatNumber(item.get()) }}</div>
          </div>
        </div>
      </div>
    </section>

    <div class="row q-mt-lg justify-center">
      <div class="col-auto">
        <q-btn
          color="negative"
          class="reset-btn"
          label="Сбросить всё (только визуально)"
          @click="resetInputs"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Decimal from 'break_eternity.js';
import { useStoreData } from 'stores/data';
import { useStoreShop } from 'stores/shop';
import { useStoreResearch } from 'stores/research';
import { useStorePrestige } from 'stores/prestige';
import { useStoreEternity } from 'stores/eternity';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const storeData = useStoreData();
const storeShop = useStoreShop();
const storeResearch = useStoreResearch();
const storePrestige = useStorePrestige();
const storeEternity = useStoreEternity();

const formatNumber = storeData.formatNumber;

type Target = {
  key: string;
  label: string;
  input: string;
  get: () => Decimal;
  set: (v: Decimal) => void;
};

const targets = ref<Target[]>([
  {
    key: 'epicNumber',
    label: 'Число',
    input: '1',
    get: () => storeData.epicNumber,
    set: (v: Decimal) => (storeData.epicNumber = v),
  },
  {
    key: 'shopPoints',
    label: 'Монеты',
    input: '1',
    get: () => storeShop.points,
    set: (v: Decimal) => (storeShop.points = v),
  },
  {
    key: 'researchPoints',
    label: 'Очки исследований',
    input: '1',
    get: () => storeResearch.points,
    set: (v: Decimal) => (storeResearch.points = v),
  },
  {
    key: 'prestigePoints',
    label: 'Очки престижа',
    input: '1',
    get: () => storePrestige.points,
    set: (v: Decimal) => (storePrestige.points = v),
  },
  {
    key: 'eternityPoints',
    label: 'Очки вечности',
    input: '1',
    get: () => storeEternity.points,
    set: (v: Decimal) => (storeEternity.points = v),
  },
]);

function parseInput(raw: string): Decimal {
  try {
    return new Decimal(raw?.toString() || 1);
  } catch {
    return new Decimal(0);
  }
}

function onAdd(item: Target) {
  const val = parseInput(item.input);
  item.set(item.get().plus(val));
  $q.notify({ type: 'positive', message: `${item.label} +${val.toString()}` });
}

function onMul(item: Target) {
  const val = parseInput(item.input);
  item.set(item.get().mul(val));
  $q.notify({ type: 'info', message: `${item.label} * ${val.toString()}` });
}

function onPow(item: Target) {
  const val = parseInput(item.input);
  try {
    item.set(item.get().pow(val));
    $q.notify({ type: 'warning', message: `${item.label} ^ ${val.toString()}` });
  } catch {
    $q.notify({ type: 'negative', message: 'Операция степени не удалась' });
  }
}

function onSub(item: Target) {
  const val = parseInput(item.input);
  item.set(item.get().minus ? item.get().minus(val) : item.get().sub(val));
  $q.notify({ type: 'negative', message: `${item.label} - ${val.toString()}` });
}

function onDiv(item: Target) {
  const val = parseInput(item.input);
  try {
    let result;
    if (item.get().div) {
      result = item.get().div(val);
    } else if (item.get().dividedBy) {
      result = item.get().dividedBy(val);
    } else {
      result = item.get().div(val);
    }
    item.set(result);
    $q.notify({ type: 'info', message: `${item.label} / ${val.toString()}` });
  } catch {
    $q.notify({ type: 'negative', message: 'Операция деления не удалась' });
  }
}

function resetInputs() {
  targets.value.forEach((t) => (t.input = '1'));
  $q.notify({ type: 'info', message: 'Входные значения сброшены' });
}
</script>

<style scoped>
.cheat-section {
  padding: 6px;
  border-radius: 8px;
}

.cheat-card {
  background: #0b1220;
  color: #e6eef8;
  box-shadow: 0 10px 30px rgba(2, 6, 23, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.03);
  padding: 12px;
  transition:
    transform 120ms ease,
    box-shadow 120ms ease;
  max-width: 920px;
  margin-left: auto;
  margin-right: auto;
}

.cheat-actions .action-buttons {
  gap: 6px;
}

.cheat-actions .q-input {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.input-col {
  max-width: 240px;
  box-sizing: border-box;
}
.full-input :deep(.q-field__control) {
  width: 100%;
  padding: 4px 8px;
  font-size: 13px;
  min-height: 30px;
  box-sizing: border-box;
}

.current-value {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-left: 8px;
  min-width: 84px;
}
.current-label {
  font-size: 10px;
  color: rgba(230, 238, 248, 0.75);
}
.current-number {
  font-weight: 600;
  color: #ffffff;
  font-size: 13px;
}

.full-input :deep(input),
.full-input :deep(.q-field__native) {
  color: #ffffff !important;
}

@media (min-width: 600px) {
  .cheat-actions .q-input {
    max-width: 240px;
  }
}

@media (min-width: 1024px) {
  .cheat-actions .q-input {
    max-width: 280px;
  }
}

@media (max-width: 599px) {
  .cheat-section {
    padding: 8px;
  }

  .action-buttons .q-btn {
    padding-top: 4px;
    padding-bottom: 4px;
    font-size: 12px;
    line-height: 1;
  }
}

.cheat-header {
  align-items: center;
  margin-bottom: 4px;
  gap: 6px;
}

.cheat-header > .col-12 {
  text-align: center;
  font-weight: 600;
  color: #ffffff;
}

.reset-btn {
  padding-left: 12px;
  padding-right: 12px;
  min-width: 140px;
}
@media (min-width: 600px) {
  .cheat-header > .col-md-8 {
    flex: 0 0 66.666667%;
    max-width: 66.666667%;
  }
  .cheat-header > .col-md-4 {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
    text-align: right;
  }
}

.cheat-card :deep(.q-btn) {
  filter: brightness(0.78) saturate(0.85);
  transition:
    filter 120ms ease,
    box-shadow 120ms ease;
  height: 30px;
  min-width: 56px;
  padding: 0 8px;
  font-size: 13px;
}
.cheat-card :deep(.q-btn:hover) {
  filter: brightness(0.95) saturate(1);
}
.reset-btn :deep(.q-btn) {
  filter: brightness(0.85) saturate(0.85);
}
</style>
