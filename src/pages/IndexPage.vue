<template>
  <q-page class="column items-stretch full-width full-height">
    <q-banner style="background: transparent; min-height: 0; padding: 0; margin-top: 8px">
      <div class="row items-center full-width" style="width: 100%">
        <div style="flex: 1 1 0"></div>
        <div class="row items-center justify-center" style="flex: 2 2 0; min-width: 0">
          <q-icon name="fa-duotone fa-gauge-high" size="24px" color="primary" />
          <span class="text-weight-bold text-h5 q-mx-xs">{{
            formatNumber(storeGame.epicNumber)
          }}</span>
          <q-icon name="fa-solid fa-arrow-right" size="18px" color="grey-5" />
          <q-icon name="fa-duotone fa-database" size="24px" color="secondary" class="q-ml-xs" />
          <span class="text-weight-bold text-h5 q-ml-xs">{{
            formatNumber(storeGame.capacity)
          }}</span>
        </div>
        <div class="banner-research-status" style="font-size: 1rem; white-space: nowrap">
          <div v-if="currentResearch" class="row items-center">
            <span class="banner-research-title" style="font-size: 1rem; white-space: nowrap">
              {{ currentResearchTime }} сек.
              <q-icon name="fa-duotone fa-flask" color="secondary" size="20px" class="q-ml-xs" />
              {{ currentResearch.title }}
            </span>
          </div>
          <div v-else></div>
        </div>
      </div>
    </q-banner>
    <q-card
      class="full-width full-height q-pa-none"
      style="
        flex: 1 1 0;
        align-self: stretch;
        padding: 8px 0 8px 0;
        margin-bottom: 8px;
        margin-top: 8px;
      "
    >
      <q-tabs
        v-model="tab"
        dense
        active-color="primary"
        indicator-color="primary"
        align="justify"
        class="text-grey"
      >
        <q-tab name="shop" icon="fa-duotone fa-store" label="Магазин" />
        <q-tab name="research" icon="fa-duotone fa-flask-vial" label="Исследования" />
        <q-tab name="automatic" icon="fa-duotone fa-microchip-ai" label="Автоматизация" />
        <q-tab name="eternity" icon="fa-duotone fa-hourglass-end" label="Вечность" />
        <q-tab name="infinity" icon="fa-duotone fa-infinity" label="Бесконечность" />
        <q-tab name="achievement" icon="fa-duotone fa-trophy-star" label="Достижения" />
        <q-tab name="help" icon="fa-duotone fa-circle-question" label="Помощь" />
        <q-tab name="setting" icon="fa-duotone fa-gear-complex" label="Настройки" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab">
        <q-tab-panel name="shop" class="q-pa-none">
          <q-splitter v-model="splitterModel">
            <template v-slot:before>
              <q-tabs v-model="innerShop" vertical class="text-teal">
                <q-tab name="innerShopCPU" icon="fa-duotone fa-microchip" label="Процессор" />
                <q-tab name="innerShopHard" icon="fa-duotone fa-hard-drive" label="Жёсткий диск" />
                <q-tab name="innerShopRAM" icon="fa-duotone fa-memory" label="Оперативная память" />
              </q-tabs>
            </template>

            <template v-slot:after>
              <q-tab-panels
                v-model="innerShop"
                transition-prev="slide-down"
                transition-next="slide-up"
              >
                <q-tab-panel name="innerShopCPU">
                  <ShopCPU />
                </q-tab-panel>
                <q-tab-panel name="innerShopHard">
                  <ShopHard />
                </q-tab-panel>
                <q-tab-panel name="innerShopRAM">
                  <ShopRAM />
                </q-tab-panel>
              </q-tab-panels>
            </template>
          </q-splitter>
        </q-tab-panel>

        <q-tab-panel name="research" class="q-pa-none">
          <q-splitter v-model="splitterModel">
            <template v-slot:before>
              <q-tabs v-model="innerResearch" vertical class="text-teal">
                <q-tab
                  name="innerResearchBase"
                  icon="fa-duotone fa-flask"
                  label="Базовые исследования"
                />
              </q-tabs>
            </template>

            <template v-slot:after>
              <q-tab-panels
                v-model="innerResearch"
                transition-prev="slide-down"
                transition-next="slide-up"
              >
                <q-tab-panel name="innerResearchBase">
                  <ResearchBase />
                </q-tab-panel>
              </q-tab-panels>
            </template>
          </q-splitter>
        </q-tab-panel>
        <q-tab-panel name="automatic">
          <q-splitter v-model="splitterModel">
            <template v-slot:before>
              <q-tabs v-model="innerAutomatic" vertical class="text-teal">
                <q-tab
                  name="innerAutomaticBuyer"
                  icon="fa-duotone fa-cart-shopping"
                  label="Скупщики"
                />
              </q-tabs>
            </template>

            <template v-slot:after>
              <q-tab-panels
                v-model="innerAutomatic"
                transition-prev="slide-down"
                transition-next="slide-up"
              >
                <q-tab-panel name="innerAutomaticBuyer">
                  <AutomaticBuyer />
                </q-tab-panel>
              </q-tab-panels>
            </template>
          </q-splitter>
        </q-tab-panel>
        <q-tab-panel name="eternity"></q-tab-panel>
        <q-tab-panel name="infinity"></q-tab-panel>
        <q-tab-panel name="achievement"></q-tab-panel>
        <q-tab-panel name="help"></q-tab-panel>
        <q-tab-panel name="setting"></q-tab-panel>
      </q-tab-panels>
    </q-card>
    <q-footer class="q-pa-sm bg-grey-10">
      <div class="row items-center" style="width: 100%; justify-content: center">
        <q-icon
          name="fa-duotone fa-hourglass-end"
          color="deep-purple-3"
          size="20px"
          class="q-mr-xs"
        />
        <span class="q-mr-md" style="color: #fff; font-weight: 500; font-size: 16px">
          До вечности:
        </span>
        <q-linear-progress
          :value="infinityProgress"
          color="deep-purple-5"
          track-color="grey-7"
          style="width: 300px; height: 22px"
          rounded
          class="q-mr-md"
        >
          <div class="absolute-full flex flex-center">
            <span style="color: #fff; font-weight: bold; font-size: 15px">
              {{ (infinityProgress * 100).toFixed(2) }}%
            </span>
          </div>
        </q-linear-progress>
      </div>
    </q-footer>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStoreGame } from 'src/stores/game';
import ShopCPU from 'src/components/ShopCPU.vue';
import ShopHard from 'src/components/ShopHard.vue';
import ShopRAM from 'src/components/ShopRAM.vue';
import ResearchBase from 'src/components/ResearchBase.vue';
import AutomaticBuyer from 'src/components/AutomaticBuyer.vue';
import { researchMeta } from 'src/constants/researchMeta';
import Decimal from 'break_eternity.js';

const storeGame = useStoreGame();
const formatNumber = storeGame.formatNumber;

const tab = ref('shop');
const innerShop = ref('innerShopCPU');
const innerResearch = ref('innerResearchBase');
const innerAutomatic = ref('innerAutomaticBuyer');
const splitterModel = ref(20);

const researchingKey = computed(() => storeGame.research.researchingKey);
const researchList = computed(() => storeGame.research.list);

type ResearchKey = keyof typeof storeGame.research.list;

const currentResearch = computed(() => {
  if (!researchingKey.value) return null;
  const meta = researchMeta.find((m) => m.key === researchingKey.value);
  return meta || null;
});

const currentResearchTime = computed(() => {
  if (!researchingKey.value) return '';
  const research = researchList.value[researchingKey.value as ResearchKey];
  return research?.currentTime?.toFixed?.(0) ?? '';
});

const infinityProgress = computed(() => {
  const value = storeGame.epicNumber;
  if (value.lte(0)) return 0;
  const percent = value.log10().divide(new Decimal('1.8e308').log10());
  return Math.min(Math.max(percent.toNumber(), 0), 1);
});
</script>

<style lang="sass">
.my-ipnut-full
  min-width: 150px
  margin-bottom: 8px
  .q-field__native, .q-field__input
    text-align: center

.my-number
  font-size: 20px;
  color: red

.my-ipnut
  min-width: 100px;

.full-width
  width: 100% !important

.full-height
  height: 100% !important

.q-tabs .q-tab:not(.q-tab--active)
  color: #607d8b !important

.banner-research-status
  flex: 1 1 0
  display: flex
  align-items: center
  justify-content: flex-end
  min-width: 220px
  max-width: 400px
  height: 36px
  min-height: 36px
  padding-right: 24px

.banner-research-title
  max-width: 300px
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap
  display: inline-block
  vertical-align: middle
</style>
