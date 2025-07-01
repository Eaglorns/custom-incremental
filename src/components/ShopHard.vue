<template>
  <q-card flat bordered class="card-main-custom q-pa-lg">
    <div class="card-header-custom flex items-center q-mb-lg">
      <q-icon name="fa-duotone fa-hard-drive" class="icon-hard-custom q-mr-md" size="32px" />
      <span class="text-main-custom text-h5 text-weight-bold">Жёсткий диск</span>
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
            :model-value="formatNumber(gainPerBuy)"
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

const hard = storeGame.shop.hard;
const costDecrease = storeGame.research.list.costDecrease;

const value = computed(() => hard.value);
const multiply = computed(() => hard.multiply);
const costMain = computed(() => hard.cost.main);
const decrease = computed(() =>
  costDecrease.level.gt(0) ? costDecrease.bonus.pow(costDecrease.level) : new Decimal(1),
);
const costMultiply = computed(() => hard.cost.multiply.mul(hard.multiply).div(decrease.value));

const canBuyMain = computed(() => storeGame.epicNumber.gte(costMain.value));
const canBuyMultiply = computed(() => value.value.gte(costMultiply.value));

const gainPerBuy = computed(() => {
  const parResearchHard = storeGame.research.list.hardPow;
  return multiply.value.pow(parResearchHard.bonus.mul(parResearchHard.level).plus(1));
});

const onBuyMain = () => {
  if (!canBuyMain.value) return;
  storeGame.epicNumber = storeGame.epicNumber.minus(costMain.value);
  hard.value = hard.value.plus(hard.multiply);
  storeGame.capacity = storeGame.capacity.plus(hard.multiply);
};

const onBuyMultiply = () => {
  if (!canBuyMultiply.value) return;
  hard.value = hard.value.minus(costMultiply.value);
  hard.multiply = hard.multiply.plus(1);
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

.icon-hard-custom {
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
