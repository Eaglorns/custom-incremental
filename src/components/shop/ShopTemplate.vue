<template>
  <q-card
    flat
    bordered
    class="q-pa-lg"
    :style="{ background: 'var(--color-card-bg)', borderColor: 'var(--color-card-border)' }"
  >
    <div class="row items-center q-mb-lg">
      <q-icon :name="props.icon" class="text-primary q-mr-md" size="32px" />
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
              <q-icon name="fa-duotone fa-gauge" class="text-primary" />
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
              <q-icon name="fa-duotone fa-xmark" class="text-primary" />
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
              <q-icon name="fa-duotone fa-coins" class="text-primary" />
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
              <q-icon name="fa-duotone fa-gauge-high" class="text-primary" />
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
            @click="storeShop.onBuyValue(props.name)"
            size="lg"
            :disable="!storeShop.canBuyValue(props.name)"
          />
        </div>
        <div class="col-6">
          <q-btn
            color="primary"
            outline
            label="Умножить"
            class="full-width"
            @click="storeShop.onBuyMultiply(props.name)"
            size="lg"
            :disable="!storeShop.canBuyMultiply(props.name)"
          />
        </div>
      </div>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { useStoreData } from 'stores/data';
import { useStoreShop } from 'stores/shop';

type ShopItemName = keyof typeof storeShop.list;

const props = defineProps<{ name: ShopItemName; label: string; icon: string }>();

const storeData = useStoreData();
const storeShop = useStoreShop();

const formatNumber = storeData.formatNumber;
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
