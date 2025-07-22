<template>
  <q-card
    flat
    bordered
    class="q-pa-lg"
    :style="{ background: 'var(--color-card-bg)', borderColor: 'var(--color-card-border)' }"
  >
    <div class="row items-center q-mb-lg">
      <q-icon name="fa-duotone fa-microchip" class="text-primary q-mr-md" size="32px" />
      <span class="text-h5 text-weight-bold text-primary">Процессор</span>
    </div>
    <q-form>
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-6">
          <q-input
            :model-value="formatNumber(value)"
            label="Значение"
            class="q-mb-md"
            :disable="true"
            dense
            label-class="text-weight-bold text-body1 text-primary"
            input-class="text-h6 text-blue-4"
            color="primary"
            outlined
          >
            <template v-slot:prepend>
              <q-icon name="fa-duotone fa-gauge" class="text-primary" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-6">
          <q-input
            :model-value="formatNumber(multiply)"
            label="Множитель"
            class="q-mb-md"
            :disable="true"
            dense
            label-class="text-weight-bold text-body1 text-primary"
            input-class="text-h6 text-blue-4"
            color="primary"
            outlined
          >
            <template v-slot:prepend>
              <q-icon name="fa-duotone fa-xmark" class="text-primary" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-6">
          <q-input
            :model-value="formatNumber(costValue)"
            label="Основная стоимость"
            class="q-mb-md"
            :disable="true"
            dense
            label-class="text-weight-bold text-body1 text-primary"
            input-class="text-h6 text-blue-4"
            color="primary"
            outlined
          >
            <template v-slot:prepend>
              <q-icon name="fa-duotone fa-coins" class="text-primary" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-6">
          <q-input
            :model-value="formatNumber(costMultiply)"
            label="Стоимость множителя"
            class="q-mb-md"
            :disable="true"
            dense
            label-class="text-weight-bold text-body1 text-primary"
            input-class="text-h6 text-blue-4"
            color="primary"
            outlined
          >
            <template v-slot:prepend>
              <q-icon name="fa-duotone fa-arrow-up-right-dots" class="text-primary" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-6">
          <q-input
            :model-value="formatNumber(gainPerTick)"
            label="Прирост числа за тик"
            class="q-mb-md"
            :disable="true"
            dense
            label-class="text-weight-bold text-body1 text-primary"
            input-class="text-h6 text-blue-4"
            color="primary"
            outlined
          >
            <template v-slot:prepend>
              <q-icon name="fa-duotone fa-arrow-trend-up" class="text-primary" />
            </template>
          </q-input>
        </div>
      </div>
      <div class="row q-mt-md">
        <div class="col-6">
          <q-btn
            color="primary"
            outline
            label="Купить"
            class="full-width"
            @click="onBuyValue"
            size="lg"
            :disable="!canBuyValue"
          />
        </div>
        <div class="col-6">
          <q-btn
            color="primary"
            outline
            label="Умножить"
            class="full-width"
            @click="onBuyMultiply"
            size="lg"
            :disable="!canBuyMultiply"
          />
        </div>
      </div>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStoreData } from 'stores/data';
import { useStoreShop } from 'stores/shop';
import { useStoreResearch } from 'stores/research';
import Decimal from 'break_eternity.js';

const storeData = useStoreData();
const storeShop = useStoreShop();
const storeResearch = useStoreResearch();

const formatNumber = storeData.formatNumber;

const cpu = storeShop.list.cpu;
const costMultiplierDecrease = storeResearch.list.shopCostMultiplierDecrease;

const value = computed(() => cpu.value);
const multiply = computed(() => cpu.multiply);
const costValue = computed(() => cpu.cost.value);
const decrease = computed(() =>
  costMultiplierDecrease.level.gt(0)
    ? costMultiplierDecrease.bonus.mul(costMultiplierDecrease.level)
    : new Decimal(1),
);
const costMultiply = computed(() => cpu.cost.multiply.mul(cpu.multiply).div(decrease.value));

const canBuyValue = computed(() => storeData.epicNumber.gte(costValue.value));
const canBuyMultiply = computed(() => value.value.gte(costMultiply.value));

const gainPerTick = computed(() => {
  const parResearchCPU = storeResearch.list.cpuPow;
  return value.value.pow(parResearchCPU.bonus.mul(parResearchCPU.level).plus(1));
});

const onBuyValue = () => {
  if (!canBuyValue.value) return;
  storeData.epicNumber = storeData.epicNumber.minus(costValue.value);
  cpu.value = cpu.value.plus(cpu.multiply);
};

const onBuyMultiply = () => {
  if (!canBuyMultiply.value) return;
  const researchMultiplierChance = storeResearch.list.shopMultiplierChanceReturn;
  if (researchMultiplierChance.level.mul(researchMultiplierChance.bonus).lt(Math.random()))
    cpu.value = cpu.value.minus(costMultiply.value);
  cpu.multiply = cpu.multiply.plus(1);
};
</script>

<style lang="sass" scoped>
@media (max-width: 700px)
  .row.q-col-gutter-lg > .col-12
    margin-bottom: 1px !important
    margin-top: 0 !important
    padding-bottom: 0 !important
    padding-top: 0 !important
  .q-input.q-mb-md
    margin-bottom: 0 !important
    margin-top: 0 !important
  .q-card
    font-size: 13px !important
    padding: 8px !important
  .row, .q-mb-lg, .q-mb-md, .q-col-gutter-lg
    margin-bottom: 4px !important
    margin-top: 0 !important
    gap: 4px !important
  .q-input.q-mb-md
    margin-bottom: 2px !important
  .row.q-mt-md
    flex-wrap: nowrap !important
    gap: 8px !important
    .col-6
      flex: 1 1 0
      max-width: 50%
      min-width: 0
      padding: 0 !important
  .text-h5.text-weight-bold.text-primary
    font-size: 17px !important
</style>
