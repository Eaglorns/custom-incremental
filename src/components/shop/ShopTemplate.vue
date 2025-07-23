<template>
  <q-card flat bordered class="shop-card">
    <div class="shop-card__header">
      <q-icon :name="props.icon" class="text-primary q-mr-md" size="32px" />
      <span class="shop-card__title">{{ props.label }}</span>
    </div>
    <q-form>
      <div class="shop-card__content">
        <div class="shop-card__input-group">
          <q-input
            :model-value="formatNumber(storeShop.list[props.name].value)"
            label="Значение"
            class="shop-input"
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
        <div class="shop-card__input-group">
          <q-input
            :model-value="formatNumber(storeShop.list[props.name].cost.value)"
            label="Основная стоимость"
            class="shop-input"
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
        <div class="shop-card__input-group">
          <q-input
            :model-value="formatNumber(storeShop.list[props.name].multiply)"
            label="Множитель"
            class="shop-input"
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
        <div class="shop-card__input-group">
          <q-input
            :model-value="formatNumber(storeShop.costMultiply(props.name))"
            label="Стоимость множителя"
            class="shop-input"
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
      <div class="shop-card__actions">
        <q-btn
          color="primary"
          outline
          label="Купить"
          class="shop-card__button"
          @click="
            storeShop.onBuyValue(props.name);
            onBuySound();
          "
          size="lg"
          :disable="!storeShop.canBuyValue(props.name)"
        />
        <q-btn
          color="primary"
          outline
          label="Умножить"
          class="shop-card__button"
          @click="storeShop.onBuyMultiply(props.name)"
          size="lg"
          :disable="!storeShop.canBuyMultiply(props.name)"
        />
      </div>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { useStoreData } from 'stores/data';
import { useStoreShop } from 'stores/shop';
import { Howl } from 'src/boot/hovler';

type ShopItemName = keyof typeof storeShop.list;

const props = defineProps<{ name: ShopItemName; label: string; icon: string }>();

const storeData = useStoreData();
const storeShop = useStoreShop();

const formatNumber = storeData.formatNumber;

const onBuySound = () => {
  new Howl({ src: ['sounds/buy.mp3'] }).play();
};
</script>

<style scoped lang="scss">
$mobile-breakpoint: 700px;

.shop-card {
  padding: 24px;
  background: var(--color-card-bg);
  border-color: var(--color-card-border);

  &__header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: bold;
    color: var(--q-primary);
  }

  &__content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    margin-bottom: 24px;

    @media (max-width: $mobile-breakpoint) {
      grid-template-columns: 1fr;
      gap: 8px;
      margin-bottom: 16px;
    }
  }

  &__input-group {
    display: flex;
    flex-direction: column;
  }

  &__actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;

    @media (max-width: $mobile-breakpoint) {
      gap: 8px;
    }
  }

  &__button {
    width: 100%;
  }

  @media (max-width: $mobile-breakpoint) {
    padding: 12px;
    font-size: 13px;

    &__header {
      margin-bottom: 12px;
    }

    &__title {
      font-size: 1.1rem;
    }
  }
}

.shop-input {
  margin-bottom: 16px;

  @media (max-width: $mobile-breakpoint) {
    margin-bottom: 4px;
  }
}
</style>
