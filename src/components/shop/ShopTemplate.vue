<template>
  <q-card
    flat
    bordered
    class="q-pa-lg"
    :style="{ background: 'var(--color-card-bg)', borderColor: 'var(--color-card-border)' }"
  >
    <div class="row items-center q-mb-lg">
      <i :class="iconStyle + props.icon" class="text-primary q-mr-md" size="32px" />
      <span class="text-h5 text-weight-bold text-primary">{{ props.label }}</span>
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
            input-class="text-h6 text-blue-4"
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
            input-class="text-h6 text-blue-4"
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
            input-class="text-h6 text-blue-4"
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
            input-class="text-h6 text-blue-4"
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
            :label-value="formatNumber(storeShop.getBuyAmount(props.name, 'value'))"
            label-always
          />
        </div>
        <div class="col-12">
          <q-btn
            color="primary"
            outline
            :label="buyLabel('Купить', props.name, 'value')"
            class="full-width"
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
            :label-value="formatNumber(storeShop.getBuyAmount(props.name, 'multiply'))"
            label-always
          />
        </div>
        <div class="col-12">
          <q-btn
            color="primary"
            outline
            :label="buyLabel('Умножить', props.name, 'multiply')"
            class="full-width"
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

const buyModeValue = computed({
  get: () => storeShop.list[props.name].buyModeValue,
  set: (val) => (storeShop.list[props.name].buyModeValue = val),
});

const buyModeMultiply = computed({
  get: () => storeShop.list[props.name].buyModeMultiply,
  set: (val) => (storeShop.list[props.name].buyModeMultiply = val),
});

function buyLabel(base: string, name: ShopItemName, type: 'value' | 'multiply') {
  const points = type === 'value' ? storeShop.points : storeData.epicNumber;
  const amount = storeShop.getBuyAmount(name, type);
  const result = storeShop.buyMax(
    points,
    type === 'multiply'
      ? storeShop.costMultiply(props.name)
      : storeShop.list[props.name].cost.value,
    amount,
  );
  return `${base} ${formatNumber(result.bought)}`;
}

function onBuyValueCustom(name: ShopItemName) {
  const amount = storeShop.getBuyAmount(name, 'value');
  if (amount.gt(0)) {
    storeShop.onBuyValue(name, amount);
    storeSetting.playSound('ShopOnBuyValue', 2);
  }
}

function onBuyMultiplyCustom(name: ShopItemName) {
  const amount = storeShop.getBuyAmount(name, 'multiply');
  if (amount.gt(0)) {
    storeShop.onBuyMultiply(name, amount);
    storeSetting.playSound('ShopOnBuyMultiplier', 10);
  }
}

const canBuyValue = computed(() => {
  const result = storeShop.buyMax(
    storeShop.points,
    storeShop.list[props.name].cost.value,
    storeShop.getBuyAmount(props.name, 'value'),
  );
  if (result.bought.gt(0)) {
    return true;
  }
  return false;
});

const canBuyMultiply = computed(() => {
  const points = storeData.epicNumber;
  const amount = storeShop.getBuyAmount(props.name, 'multiply');
  const result = storeShop.buyMax(points, storeShop.costMultiply(props.name), amount);
  if (result.bought.gt(0)) {
    return true;
  }
  return false;
});
</script>

<style lang="sass" scoped>
.q-slider
  margin-top: 35px !important
  padding-left: 15px !important
  padding-right: 15px !important
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
