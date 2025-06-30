<template>
  <q-card flat bordered class="q-pa-lg">
    <div class="text-h5 text-weight-bold q-mb-lg text-primary flex items-center">
      <q-icon name="fa-duotone fa-microchip" class="q-mr-md" size="32px" />
      Процессор
    </div>
    <q-form>
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-6">
          <q-input
            :model-value="formatNumber(value)"
            label="Значение"
            class="my-ipnut q-mb-md"
            :disable="true"
            dense
            :label-class="'text-weight-bold text-body1'"
            :input-class="'text-h6 text-primary'"
            color="primary"
            outlined
          >
            <template v-slot:prepend>
              <q-icon name="fa-duotone fa-gauge" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-6">
          <q-input
            :model-value="formatNumber(multiply)"
            label="Множитель"
            class="my-ipnut q-mb-md"
            :disable="true"
            dense
            :label-class="'text-weight-bold text-body1'"
            :input-class="'text-h6 text-primary'"
            color="primary"
            outlined
          >
            <template v-slot:prepend>
              <q-icon name="fa-duotone fa-xmark" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-6">
          <q-input
            :model-value="formatNumber(costMain)"
            label="Основная стоимость"
            class="my-ipnut q-mb-md"
            :disable="true"
            dense
            :label-class="'text-weight-bold text-body1'"
            :input-class="'text-h6 text-primary'"
            color="primary"
            outlined
          >
            <template v-slot:prepend>
              <q-icon name="fa-duotone fa-coins" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-6">
          <q-input
            :model-value="formatNumber(costMultiply)"
            label="Стоимость множителя"
            class="my-ipnut q-mb-md"
            :disable="true"
            dense
            :label-class="'text-weight-bold text-body1'"
            :input-class="'text-h6 text-primary'"
            color="primary"
            outlined
          >
            <template v-slot:prepend>
              <q-icon name="fa-duotone fa-arrow-up-right-dots" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-6">
          <q-input
            :model-value="formatNumber(gainPerTick)"
            label="Прирост числа за тик"
            class="my-ipnut q-mb-md"
            :disable="true"
            dense
            :label-class="'text-weight-bold text-body1'"
            :input-class="'text-h6 text-primary'"
            color="primary"
            outlined
          >
            <template v-slot:prepend>
              <q-icon name="fa-duotone fa-arrow-trend-up" />
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
            @click="onBuyMain"
            size="lg"
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
const costDecrease = storeGame.research.list.costDecrease;

const value = computed(() => cpu.value);
const multiply = computed(() => cpu.multiply);
const costMain = computed(() => cpu.cost.main);
const decrease = computed(() =>
  costDecrease.level.gt(0) ? costDecrease.bonus.pow(costDecrease.level) : new Decimal(1),
);
const costMultiply = computed(() => cpu.cost.multiply.mul(cpu.multiply).div(decrease.value));

const canBuyMain = computed(() => storeGame.epicNumber.gte(costMain.value));
const canBuyMultiply = computed(() => value.value.gte(costMultiply.value));

const gainPerTick = computed(() => {
  const parResearchCPU = storeGame.research.list.cpuPow;
  return value.value.pow(parResearchCPU.bonus.mul(parResearchCPU.level).plus(1));
});

const onBuyMain = () => {
  if (!canBuyMain.value) return;
  storeGame.epicNumber = storeGame.epicNumber.minus(costMain.value);
  cpu.value = cpu.value.plus(cpu.multiply);
};

const onBuyMultiply = () => {
  if (!canBuyMultiply.value) return;
  cpu.value = cpu.value.minus(costMultiply.value);
  cpu.multiply = cpu.multiply.plus(1);
};
</script>
