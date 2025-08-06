<template>
  <q-card flat class="q-pa-md">
    <div class="text-h5 text-accent q-mb-sm">Улучшения престижа</div>
    <div class="row q-col-gutter-sm q-gutter-y-sm">
      <div v-for="key in upgradesKeys" :key="key" class="col-12 col-sm-6 col-md-4 flex flex-center">
        <q-card
          flat
          bordered
          class="q-pa-sm q-mb-sm prestige-card-dark"
          style="min-width: 220px; max-width: 320px"
        >
          <div class="row items-center q-mb-sm no-wrap">
            <q-icon
              :name="iconStyle + getUpgrade(key).value.icon"
              size="28px"
              color="accent"
              class="q-mr-sm"
            />
            <div class="text-h6 text-bold text-white ellipsis" style="max-width: 200px">
              <span :title="getUpgrade(key).value.title">
                {{ getUpgrade(key).value.title }}
                <q-tooltip class="prestige-tooltip-large">{{
                  getUpgrade(key).value.title
                }}</q-tooltip>
              </span>
            </div>
            <q-badge
              class="q-ml-sm prestige-badge-dark"
              v-if="getUpgrade(key).value.level !== undefined"
            >
              Ур. {{ getUpgrade(key).value.level
              }}<template v-if="getUpgrade(key).value.maxLevel !== -1">
                / {{ getUpgrade(key).value.maxLevel }}</template
              >
            </q-badge>
          </div>
          <div class="text-body2 text-grey-3 q-mb-sm">{{ getUpgrade(key).value.description }}</div>
          <div class="row items-center q-mb-sm">
            <q-icon
              :name="iconStyle + 'fa-arrow-up-right-dots'"
              size="18px"
              color="yellow-4"
              class="q-mr-xs"
            />
            <span class="text-weight-bold text-white">{{ formatNumber(getCost(key)) }}</span>
          </div>
          <q-btn
            color="dark"
            label="Купить"
            @click="buyUpgrade(key)"
            class="full-width prestige-btn-dark"
            :disable="
              getUpgrade(key).value.maxLevel !== undefined &&
              getUpgrade(key).value.maxLevel !== -1 &&
              getUpgrade(key).value.level.gte(getUpgrade(key).value.maxLevel)
            "
          />
        </q-card>
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStoreData } from 'stores/data';
import { useStorePrestige } from 'stores/prestige';
import { prestigeUpgradeMeta } from 'src/constants/prestigeUpgradeMeta';
import { useStoreSetting } from 'stores/setting';

const storeData = useStoreData();
const storePrestige = useStorePrestige();
const storeSetting = useStoreSetting();

const iconStyle = computed(() => {
  return storeSetting.iconStyle;
});

const formatNumber = storeData.formatNumber;

const upgradesKeys = computed(() => Object.keys(storePrestige.upgrades));

const getUpgrade = (key: string) =>
  computed(() => {
    const meta = prestigeUpgradeMeta.find((m) => m.key === key)!;
    const state = storePrestige.upgrades[key as keyof typeof storePrestige.upgrades] || {};
    return {
      ...meta,
      ...state,
    };
  });

const getCost = (key: string) => {
  const upgrade = storePrestige.upgrades[key as keyof typeof storePrestige.upgrades];
  if (upgrade.level.lt(1)) return upgrade.cost;
  return upgrade.costGrowth.pow(upgrade.level).mul(upgrade.cost);
};

const buyUpgrade = (key: string) => {
  const upgrade = storePrestige.upgrades[key as keyof typeof storePrestige.upgrades];
  if (upgrade.maxLevel !== -1 && upgrade.level.gte(upgrade.maxLevel)) return;
  const cost = getCost(key);
  if (storePrestige.points.gte(cost)) {
    storePrestige.points = storePrestige.points.minus(cost);
    upgrade.level = upgrade.level.add(1);
  }
};
</script>

<style lang="sass" scoped>
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
