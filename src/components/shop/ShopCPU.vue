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
import { useStoreGame } from 'src/stores/game';
import Decimal from 'break_eternity.js';

const storeGame = useStoreGame();
const formatNumber = storeGame.formatNumber;

const cpu = storeGame.shop.cpu;
const costMultiplierDecrease = storeGame.research.list.shopCostMultiplierDecrease;

const value = computed(() => cpu.value);
const multiply = computed(() => cpu.multiply);
const costValue = computed(() => cpu.cost.value);
const decrease = computed(() =>
  costMultiplierDecrease.level.gt(0)
    ? costMultiplierDecrease.bonus.mul(costMultiplierDecrease.level)
    : new Decimal(1),
);
const costMultiply = computed(() => cpu.cost.multiply.mul(cpu.multiply).div(decrease.value));

const canBuyValue = computed(() => storeGame.epicNumber.gte(costValue.value));
const canBuyMultiply = computed(() => value.value.gte(costMultiply.value));

const gainPerTick = computed(() => {
  const parResearchCPU = storeGame.research.list.cpuPow;
  return value.value.pow(parResearchCPU.bonus.mul(parResearchCPU.level).plus(1));
});

const onBuyValue = () => {
  if (!canBuyValue.value) return;
  storeGame.epicNumber = storeGame.epicNumber.minus(costValue.value);
  cpu.value = cpu.value.plus(cpu.multiply);
};

const onBuyMultiply = () => {
  if (!canBuyMultiply.value) return;
  const researchMultiplierChance = storeGame.research.list.shopMultiplierChanceReturn;
  if (researchMultiplierChance.level.mul(researchMultiplierChance.bonus).lt(Math.random()))
    cpu.value = cpu.value.minus(costMultiply.value);
  cpu.multiply = cpu.multiply.plus(1);
};
</script>
