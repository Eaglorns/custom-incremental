<template>
  <q-card
    flat
    bordered
    class="p-2 sm:p-6 text-xs sm:text-sm"
    :style="{ background: 'var(--color-card-bg)', borderColor: 'var(--color-card-border)' }"
  >
    <div class="row items-center mb-2 sm:mb-6">
      <i :class="iconStyle + props.icon" class="text-primary q-mr-md" size="32px" />
      <span class="text-lg sm:text-h5 text-weight-bold text-primary">{{ props.label }}</span>
    </div>
    <q-form>
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-6">
          <q-input
            :model-value="formatNumber(storeShop.list[props.name].value)"
            label="Значение"
            class="q-mb-md"
            :disable="true"
            dense
            label-class="text-weight-bold text-body1 text-primary"
            input-class="text-base sm:text-h6 text-blue-4"
            color="primary"
            outlined
          >
            <template v-slot:prepend>
              <i :class="iconStyle + 'fa-gauge'" class="text-primary" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-6">
          <q-input
            :model-value="formatNumber(storeShop.list[props.name].multiply)"
            label="Множитель"
            class="q-mb-md"
            :disable="true"
            dense
            label-class="text-weight-bold text-body1 text-primary"
            input-class="text-base sm:text-h6 text-blue-4"
            color="primary"
            outlined
          >
            <template v-slot:prepend>
              <i :class="iconStyle + 'fa-xmark'" class="text-primary" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-6">
          <q-input
            :model-value="formatNumber(storeShop.list[props.name].cost.value)"
            label="Основная стоимость"
            class="q-mb-md"
            :disable="true"
            dense
            label-class="text-weight-bold text-body1 text-primary"
            input-class="text-base sm:text-h6 text-blue-4"
            color="primary"
            outlined
          >
            <template v-slot:prepend>
              <i :class="iconStyle + 'fa-coins'" class="text-primary" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-6">
          <q-input
            :model-value="formatNumber(storeShop.costMultiply(props.name))"
            label="Стоимость множителя"
            class="q-mb-md"
            :disable="true"
            dense
            label-class="text-weight-bold text-body1 text-primary"
            input-class="text-base sm:text-h6 text-blue-4"
            color="primary"
            outlined
          >
            <template v-slot:prepend>
              <i :class="iconStyle + 'fa-gauge-high'" class="text-primary" />
            </template>
          </q-input>
        </div>
      </div>
      <div class="shop-group">
        <div class="col-12">
          <q-slider
            v-model="buyModeValue"
            :min="1"
            :max="100"
            :step="10"
            markers
            snap
            color="primary"
            label
            :label-value="formatNumber(amountValue)"
            label-always
          />
        </div>
        <div class="col-12">
          <q-btn
            color="primary"
            outline
            :label="labelBuyValue"
            class="full-width text-xs sm:text-sm"
            @click="onBuyValueCustom(props.name)"
            size="lg"
            :disable="!canBuyValue"
          />
        </div>
      </div>
      <div class="shop-group">
        <div class="col-12">
          <q-slider
            v-model="buyModeMultiply"
            :min="1"
            :max="100"
            :step="10"
            markers
            snap
            color="primary"
            label
            :label-value="formatNumber(amountMultiply)"
            label-always
          />
        </div>
        <div class="col-12">
          <q-btn
            color="primary"
            outline
            :label="labelBuyMultiply"
            class="full-width text-xs sm:text-sm"
            @click="onBuyMultiplyCustom(props.name)"
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
import { useStoreSetting } from 'stores/setting';

type ShopItemName = keyof typeof storeShop.list;

const props = defineProps<{ name: ShopItemName; label: string; icon: string }>();

const storeData = useStoreData();
const storeShop = useStoreShop();
const storeSetting = useStoreSetting();

const iconStyle = computed(() => {
  return storeSetting.iconStyle;
});

const formatNumber = storeData.formatNumber;

const currentItem = computed(() => storeShop.list[props.name]);
const costValue = computed(() => currentItem.value.cost.value);
const costMultiply = computed(() => storeShop.costMultiply(props.name));

const buyModeValue = computed({
  get: () => currentItem.value.buyModeValue,
  set: (val: number) => (currentItem.value.buyModeValue = val),
});
const buyModeMultiply = computed({
  get: () => currentItem.value.buyModeMultiply,
  set: (val: number) => (currentItem.value.buyModeMultiply = val),
});

const amountValue = computed(() => storeShop.getBuyAmount(props.name, 'value'));
const amountMultiply = computed(() => storeShop.getBuyAmount(props.name, 'multiply'));

const resultValue = computed(() =>
  storeShop.buyMax(storeShop.points, costValue.value, amountValue.value),
);
const resultMultiply = computed(() =>
  storeShop.buyMax(storeData.epicNumber, costMultiply.value, amountMultiply.value),
);

const canBuyValue = computed(() => resultValue.value.bought.gt(0));
const canBuyMultiply = computed(() => resultMultiply.value.bought.gt(0));

const labelBuyValue = computed(() => `Купить ${formatNumber(resultValue.value.bought)}`);
const labelBuyMultiply = computed(() => `Умножить ${formatNumber(resultMultiply.value.bought)}`);

function onBuyValueCustom(name: ShopItemName) {
  const amount = storeShop.getBuyAmount(name, 'value');
  if (amount.gt(0)) {
    storeShop.onBuyValue(name, amount);
    storeSetting.playSound('ShopOnBuyValue', 35);
  }
}

function onBuyMultiplyCustom(name: ShopItemName) {
  const amount = storeShop.getBuyAmount(name, 'multiply');
  if (amount.gt(0)) {
    storeShop.onBuyMultiply(name, amount);
    storeSetting.playSound('ShopOnBuyMultiplier', 120);
  }
}
</script>

<style lang="scss" scoped>
.q-slider {
  margin-top: 35px !important;
  padding-left: 15px !important;
  padding-right: 15px !important;
}

@media (max-width: 700px) {
  .row.q-col-gutter-lg > .col-12 {
    margin-bottom: 1px !important;
    margin-top: 0 !important;
    padding-bottom: 0 !important;
    padding-top: 0 !important;
  }
  .q-input.q-mb-md {
    margin-bottom: 2px !important;
    margin-top: 0 !important;
  }
  .q-card {
    font-size: 12px !important;
    padding: 6px !important;
  }
  .row,
  .q-mb-lg,
  .q-mb-md,
  .q-col-gutter-lg {
    margin-bottom: 4px !important;
    margin-top: 0 !important;
    gap: 4px !important;
  }
  .row.q-mt-md {
    flex-wrap: nowrap !important;
    gap: 8px !important;
  }
  .row.q-mt-md .col-6 {
    flex: 1 1 48%;
    max-width: 48%;
    min-width: 0;
    padding: 0 !important;
  }
  .text-h5.text-weight-bold.text-primary {
    font-size: 17px !important;
  }
}
</style>
