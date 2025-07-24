<template>
  <q-card flat class="q-pa-lg">
    <div class="text-h5 text-accent q-mb-md">Улучшения престижа</div>
    <div class="row q-col-gutter-lg q-gutter-y-md">
      <div
        v-for="upgrade in prestigeUpgrades"
        :key="upgrade.key"
        class="col-12 col-sm-6 col-md-4 flex flex-center"
      >
        <q-card
          flat
          bordered
          class="q-pa-md q-mb-md prestige-card-dark"
          style="min-width: 220px; max-width: 320px"
        >
          <div class="row items-center q-mb-sm no-wrap">
            <q-icon :name="upgrade.icon" size="28px" color="accent" class="q-mr-sm" />
            <div class="text-h6 text-bold text-white ellipsis" style="max-width: 200px">
              <span :title="upgrade.title">
                {{ upgrade.title }}
                <q-tooltip class="prestige-tooltip-large">{{ upgrade.title }}</q-tooltip>
              </span>
            </div>
            <q-badge class="q-ml-sm prestige-badge-dark" v-if="upgrade.level !== undefined">
              Ур. {{ upgrade.level
              }}<template v-if="upgrade.maxLevel !== -1"> / {{ upgrade.maxLevel }}</template>
            </q-badge>
          </div>
          <div class="text-body2 text-grey-3 q-mb-sm">{{ upgrade.description }}</div>
          <div class="row items-center q-mb-sm">
            <q-icon name="fa-duotone fa-coins" size="18px" color="yellow-4" class="q-mr-xs" />
            <span class="text-weight-bold text-white">{{ formatNumber(upgrade.cost) }}</span>
          </div>
          <q-btn
            color="dark"
            label="Купить"
            @click="buyUpgrade(upgrade)"
            class="full-width prestige-btn-dark"
            :disable="
              upgrade.maxLevel !== undefined &&
              upgrade.maxLevel !== -1 &&
              upgrade.level.gte(upgrade.maxLevel)
            "
          />
        </q-card>
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useStoreData } from 'stores/data';
import Decimal from 'break_eternity.js';

const storeData = useStoreData();

const formatNumber = storeData.formatNumber;

const prestigeUpgrades = ref<PrestigeUpgrade[]>([
  {
    key: 'prestigeBonus',
    icon: 'fa-duotone fa-arrow-up-right-dots',
    title: 'Усиление бонуса престижа',
    description: 'Увеличивает множитель бонуса от престижа на 1% за уровень.',
    cost: new Decimal(5),
    level: new Decimal(0),
    costGrowth: new Decimal(1.2),
    maxLevel: -1,
  },
  {
    key: 'prestigeSoftening',
    icon: 'fa-duotone fa-wave-sine',
    title: 'Ослабление функции престижа',
    description: 'Смягчает формулу престижа, делая прирост более плавным.',
    cost: new Decimal(5),
    level: new Decimal(0),
    costGrowth: new Decimal(1.05),
    maxLevel: -1,
  },
  {
    key: 'autoShopCPU',
    icon: 'fa-duotone fa-microchip',
    title: 'Прирост CPU',
    description: 'Автоматически повышает значение CPU в магазине каждый тик.',
    cost: new Decimal(1),
    level: new Decimal(0),
    costGrowth: new Decimal(3),
    maxLevel: -1,
  },
  {
    key: 'autoShopHard',
    icon: 'fa-duotone fa-hard-drive',
    title: 'Прирост HDD',
    description: 'Автоматически повышает значение HDD в магазине каждый тик.',
    cost: new Decimal(5),
    level: new Decimal(0),
    costGrowth: new Decimal(2),
    maxLevel: -1,
  },
  {
    key: 'autoShopRAM',
    icon: 'fa-duotone fa-memory',
    title: 'Прирост RAM',
    description: 'Автоматически повышает значение RAM в магазине каждый тик.',
    cost: new Decimal(20),
    level: new Decimal(0),
    costGrowth: new Decimal(1.5),
    maxLevel: -1,
  },
]);

interface PrestigeUpgrade {
  key: string;
  icon: string;
  title: string;
  description: string;
  cost: Decimal;
  level: Decimal;
  costGrowth: Decimal;
  maxLevel: number; // -1 = бесконечно
}

function buyUpgrade(upgrade: PrestigeUpgrade) {
  if (
    upgrade.maxLevel !== undefined &&
    upgrade.maxLevel !== -1 &&
    upgrade.level.gte(upgrade.maxLevel)
  )
    return;
  upgrade.level = upgrade.level.add(1);
  upgrade.cost = upgrade.cost.mul(upgrade.costGrowth);
}
</script>

<style lang="sass">
.prestige-tooltip-large
  font-size: 1.25rem
  font-weight: 600
  color: #fff !important
  background: #23272e !important
  border-radius: 8px
  padding: 8px 16px
  box-shadow: 0 2px 8px #0008

.prestige-badge-dark
  background: #23272e !important
  color: #e0e0e0 !important
  border: 1px solid #444 !important

.prestige-btn-dark
  background: #23272e !important
  color: #e0e0e0 !important
  border: 1px solid #444 !important
  &:hover, &:focus
    background: #1a1d22 !important
    color: #fff !important

.prestige-card-dark
  background: #2d323b !important
  border: 1px solid black !important

.text-accent
  color: #ffb300 !important

.q-card .text-white
  color: #fff !important

.q-card .text-grey-3
  color: #e0e0e0 !important

.q-card .text-grey-8
  color: #b0b0b0 !important
</style>
