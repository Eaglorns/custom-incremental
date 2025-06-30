<template>
  <q-card flat bordered class="q-pa-md bg-grey-9">
    <div class="text-h5 text-weight-bold q-mb-lg flex items-center text-primary">
      <q-icon name="fa-duotone fa-cart-shopping" class="q-mr-md" size="28px" />
      Скупщики комплектующих
    </div>
    <div class="row q-col-gutter-lg q-gutter-y-md justify-center">
      <div
        v-for="helper in helpers"
        :key="helper.key"
        class="col-12 col-sm-6 col-md-4 flex flex-center"
        style="max-width: 270px; min-width: 220px; flex: 0 0 250px"
      >
        <q-card
          flat
          bordered
          class="q-pa-sm bg-grey-10 flex column"
          style="height: 340px; min-height: 340px; display: flex; flex-direction: column"
        >
          <!-- Верх: заголовок и описание -->
          <div>
            <div class="row items-center q-mb-sm" style="min-height: 32px; flex-wrap: nowrap">
              <q-icon
                :name="helper.icon"
                size="24px"
                :color="helper.color"
                class="q-mr-sm"
                style="flex: 0 0 24px"
              />
              <span
                class="text-subtitle1 text-weight-bold"
                :class="`text-${helper.color}`"
                style="
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  flex: 1 1 0;
                  min-width: 0;
                "
              >
                {{ helper.title }}
              </span>
            </div>
            <div class="q-mb-sm" style="min-height: 38px">
              <span class="text-body2 text-grey-4">{{ helper.description }}</span>
            </div>
          </div>
          <!-- Характеристики -->
          <div class="column justify-end" style="flex: 1 1 auto">
            <div class="q-mb-sm">
              <q-separator color="grey-8" class="q-my-xs" />
              <div class="column q-gutter-xs">
                <div class="row items-center">
                  <q-icon name="fa-duotone fa-users" size="16px" color="grey-4" class="q-mr-xs" />
                  <span class="text-caption text-grey-4 q-mr-xs">Количество:</span>
                  <span class="text-body2 text-white text-weight-bold">{{ helper.count }}</span>
                  <q-btn
                    dense
                    flat
                    round
                    color="primary"
                    icon="fa-duotone fa-plus"
                    @click="hireHelper(helper)"
                    size="xs"
                    class="q-ml-xs"
                    style="border: 1px solid #1976d2"
                    :title="'Нанять ещё одного скупщика'"
                  />
                </div>
                <div class="row items-center">
                  <q-icon
                    name="fa-duotone fa-boxes-stacked"
                    size="16px"
                    color="orange"
                    class="q-mr-xs"
                  />
                  <span class="text-caption text-grey-4 q-mr-xs">За раз:</span>
                  <span class="text-body2 text-white text-weight-bold">{{ helper.batch }}</span>
                  <q-btn
                    dense
                    flat
                    round
                    color="orange"
                    icon="fa-duotone fa-plus"
                    @click="increaseBatch(helper)"
                    :disable="!helper.canUpgrade"
                    size="xs"
                    class="q-ml-xs"
                    style="border: 1px solid #ffa726"
                    :title="'Увеличить количество за раз'"
                  />
                </div>
                <div class="row items-center">
                  <q-icon name="fa-duotone fa-percent" size="16px" color="cyan" class="q-mr-xs" />
                  <span class="text-caption text-grey-4 q-mr-xs">Шанс покупки:</span>
                  <span class="text-body2 text-white text-weight-bold"
                    >{{ calcChance(helper.count) }}%</span
                  >
                  <q-btn
                    dense
                    flat
                    round
                    color="cyan"
                    icon="fa-duotone fa-dice"
                    @click="increaseChance(helper)"
                    :disable="!helper.canUpgrade"
                    size="xs"
                    class="q-ml-xs"
                    style="border: 1px solid #26c6da"
                    :title="'Увеличить шанс покупки'"
                  />
                  <span class="text-caption text-grey-4 q-ml-xs">
                    <q-icon name="fa-duotone fa-coins" size="12px" color="amber" />
                    {{ formatNumber(helper.upgradeCost) }}
                  </span>
                </div>
              </div>
              <q-separator color="grey-8" class="q-my-xs" />
            </div>
            <!-- Цена и кнопка "Нанять" -->
            <div class="row items-center q-gutter-xs q-mt-xs">
              <q-chip
                color="amber-7"
                text-color="black"
                dense
                square
                class="q-pa-xs"
                style="font-size: 13px; font-weight: 500"
              >
                <q-icon name="fa-duotone fa-coins" size="14px" color="amber" class="q-mr-xs" />
                {{ formatNumber(helper.cost) }}
              </q-chip>
              <q-btn
                color="primary"
                label="Нанять"
                class="q-ml-xs"
                :disable="!helper.canHire"
                @click="hireHelper(helper)"
                size="sm"
                style="min-width: 0; flex: 1 1 0; font-weight: 500"
                unelevated
              />
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

function formatNumber(val: number) {
  return val.toLocaleString();
}

// Формула роста шанса (пример: логарифмическая, плавно к 100%)
function calcChance(count: number) {
  if (count <= 0) return 1;
  // 1% на старте, 6% на 10, 8% на 20, к 1e1000 — 100%
  // Можно скорректировать формулу под баланс
  const max = 100;
  const base = 1;
  const slow = 0.18; // чем меньше, тем медленнее рост
  let chance = base + Math.log10(count + 1) / slow;
  if (chance > max) chance = max;
  return chance.toFixed(1).replace('.0', '');
}

interface Helper {
  key: string;
  icon: string;
  color: string;
  title: string;
  description: string;
  cost: number;
  upgradeCost: number;
  batch: number;
  count: number;
  canHire: boolean;
  canUpgrade: boolean;
}

const helpers = reactive<Helper[]>([
  {
    key: 'cpu',
    icon: 'fa-duotone fa-microchip',
    color: 'primary',
    title: 'Скупщик процессоров',
    description: 'Находит выгодные предложения и автоматически закупает процессоры.',
    cost: 1000,
    upgradeCost: 5000,
    batch: 1,
    count: 0,
    canHire: true,
    canUpgrade: true,
  },
  {
    key: 'hdd',
    icon: 'fa-duotone fa-hard-drive',
    color: 'deep-orange',
    title: 'Скупщик жёстких дисков',
    description: 'Знает все тайные склады и всегда находит лучшие жёсткие диски для вашей системы.',
    cost: 2000,
    upgradeCost: 9000,
    batch: 1,
    count: 0,
    canHire: true,
    canUpgrade: true,
  },
  {
    key: 'ram',
    icon: 'fa-duotone fa-memory',
    color: 'secondary',
    title: 'Скупщик памяти',
    description: 'Постоянно мониторит рынок и пополняет запасы оперативной памяти.',
    cost: 1500,
    upgradeCost: 7000,
    batch: 1,
    count: 0,
    canHire: true,
    canUpgrade: true,
  },
]);

function hireHelper(helper: Helper) {
  helper.count++;
}

function increaseChance(helper: Helper) {
  helper.count++;
}

function increaseBatch(helper: Helper) {
  helper.batch++;
}
</script>
