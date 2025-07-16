<template>
  <q-card
    flat
    bordered
    class="q-pa-lg"
    :style="{ background: 'var(--color-card-bg)', borderColor: 'var(--color-card-border)' }"
  >
    <div class="row items-center q-mb-lg">
      <q-icon name="fa-duotone fa-memory" class="text-primary q-mr-md" size="32px" />
      <span class="text-h5 text-weight-bold text-primary">Оперативная память</span>
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
            label="Прирост ускорения исследований за тик"
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

const ram = storeGame.shop.ram;
const costMultiplierDecrease = storeGame.research.list.shopCostMultiplierDecrease;

const value = computed(() => ram.value);
const multiply = computed(() => ram.multiply);
const costValue = computed(() => ram.cost.value);
const decrease = computed(() =>
  costMultiplierDecrease.level.gt(0)
    ? costMultiplierDecrease.bonus.mul(costMultiplierDecrease.level)
    : new Decimal(1),
);
const costMultiply = computed(() => ram.cost.multiply.mul(ram.multiply).div(decrease.value));

const canBuyValue = computed(() => storeGame.epicNumber.gte(costValue.value));
const canBuyMultiply = computed(() => value.value.gte(costMultiply.value));

const gainPerTick = computed(() => {
  const parResearchRAM = storeGame.research.list.ramPow;
  return value.value.pow(parResearchRAM.bonus.mul(parResearchRAM.level).plus(1));
});

const onBuyValue = () => {
  if (!canBuyValue.value) return;
  storeGame.epicNumber = storeGame.epicNumber.minus(costValue.value);
  ram.value = ram.value.plus(ram.multiply);
};

const onBuyMultiply = () => {
  if (!canBuyMultiply.value) return;
  const researchMultiplierChance = storeGame.research.list.shopMultiplierChanceReturn;
  if (researchMultiplierChance.level.mul(researchMultiplierChance.bonus).lt(Math.random()))
    ram.value = ram.value.minus(costMultiply.value);
  ram.multiply = ram.multiply.plus(1);
};
</script>
