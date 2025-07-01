<template>
  <q-card flat bordered class="card-main-custom q-pa-lg">
    <div class="card-header-custom flex items-center q-mb-lg">
      <q-icon name="fa-duotone fa-memory" class="icon-ram-custom q-mr-md" size="32px" />
      <span class="text-main-custom text-h5 text-weight-bold">Оперативная память</span>
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
            :label-class="'text-label-custom text-weight-bold text-body1'"
            :input-class="'text-value-custom text-h6 text-main-custom'"
            color="primary"
            outlined
          >
            <template v-slot:prepend>
              <q-icon name="fa-duotone fa-gauge" class="icon-input-custom" />
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
            :label-class="'text-label-custom text-weight-bold text-body1'"
            :input-class="'text-value-custom text-h6 text-main-custom'"
            color="primary"
            outlined
          >
            <template v-slot:prepend>
              <q-icon name="fa-duotone fa-xmark" class="icon-input-custom" />
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
            :label-class="'text-label-custom text-weight-bold text-body1'"
            :input-class="'text-value-custom text-h6 text-main-custom'"
            color="primary"
            outlined
          >
            <template v-slot:prepend>
              <q-icon name="fa-duotone fa-coins" class="icon-input-custom" />
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
            :label-class="'text-label-custom text-weight-bold text-body1'"
            :input-class="'text-value-custom text-h6 text-main-custom'"
            color="primary"
            outlined
          >
            <template v-slot:prepend>
              <q-icon name="fa-duotone fa-arrow-up-right-dots" class="icon-input-custom" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-6">
          <q-input
            :model-value="formatNumber(gainPerTick)"
            label="Прирост хранилища за тик"
            class="my-ipnut q-mb-md"
            :disable="true"
            dense
            :label-class="'text-label-custom text-weight-bold text-body1'"
            :input-class="'text-value-custom text-h6 text-main-custom'"
            color="primary"
            outlined
          >
            <template v-slot:prepend>
              <q-icon name="fa-duotone fa-arrow-trend-up" class="icon-input-custom" />
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
            class="full-width btn-main-custom"
            @click="onBuyMain"
            size="lg"
            :disable="!canBuyMain"
          />
        </div>
        <div class="col-6">
          <q-btn
            color="primary"
            outline
            label="Умножить"
            class="full-width btn-main-custom"
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
const costDecrease = storeGame.research.list.costDecrease;

const value = computed(() => ram.value);
const multiply = computed(() => ram.multiply);
const costMain = computed(() => ram.cost.main);
const decrease = computed(() =>
  costDecrease.level.gt(0) ? costDecrease.bonus.pow(costDecrease.level) : new Decimal(1),
);
const costMultiply = computed(() => ram.cost.multiply.mul(ram.multiply).div(decrease.value));

const canBuyMain = computed(() => storeGame.epicNumber.gte(costMain.value));
const canBuyMultiply = computed(() => value.value.gte(costMultiply.value));

const gainPerTick = computed(() => {
  const parResearchRAM = storeGame.research.list.ramPow;
  return value.value.pow(parResearchRAM.bonus.mul(parResearchRAM.level).plus(1));
});

const onBuyMain = () => {
  if (!canBuyMain.value) return;
  storeGame.epicNumber = storeGame.epicNumber.minus(costMain.value);
  ram.value = ram.value.plus(ram.multiply);
  storeGame.capacity = storeGame.capacity.plus(ram.value);
};

const onBuyMultiply = () => {
  if (!canBuyMultiply.value) return;
  ram.value = ram.value.minus(costMultiply.value);
  ram.multiply = ram.multiply.plus(1);
};
</script>

<style scoped>
.card-main-custom {
  background-color: var(--q-color-white);
  border: 1px solid var(--q-color-primary);
  border-radius: 8px;
}

.card-header-custom {
  display: flex;
  align-items: center;
}

.icon-ram-custom {
  color: var(--q-color-primary);
}

.text-main-custom {
  color: var(--q-color-primary);
}

.text-label-custom {
  color: var(--q-color-primary);
}

.text-value-custom {
  color: var(--q-color-primary);
}

.btn-main-custom {
  background-color: var(--q-color-primary);
  color: var(--q-color-white);
  border-radius: 4px;
}

.btn-main-custom:hover {
  background-color: var(--q-color-primary-darker);
}
</style>
