<template>
  <q-page class="main-layout">
    <q-banner class="main-banner">
      <div class="banner-row">
        <div class="banner-empty"></div>
        <div class="banner-main">
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
        <div class="banner-research-status">
          <div v-if="currentResearch" class="row items-center">
            <span class="banner-research-title">
              {{ currentResearchTime }} сек.
              <q-icon name="fa-duotone fa-flask" color="secondary" size="20px" class="q-ml-xs" />
              {{ currentResearch.title }}
            </span>
          </div>
        </div>
      </div>
    </q-banner>
    <q-card class="main-card">
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
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="shop" class="panel-flex">
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
                <q-tab-panel name="innerShopCPU"><ShopCPU /></q-tab-panel>
                <q-tab-panel name="innerShopHard"><ShopHard /></q-tab-panel>
                <q-tab-panel name="innerShopRAM"><ShopRAM /></q-tab-panel>
              </q-tab-panels>
            </template>
          </q-splitter>
        </q-tab-panel>
        <q-tab-panel name="research" class="panel-flex">
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
                <q-tab-panel name="innerResearchBase"><ResearchBase /></q-tab-panel>
              </q-tab-panels>
            </template>
          </q-splitter>
        </q-tab-panel>
        <q-tab-panel name="automatic" class="panel-flex">
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
                <q-tab-panel name="innerAutomaticBuyer"><AutomaticBuyer /></q-tab-panel>
              </q-tab-panels>
            </template>
          </q-splitter>
        </q-tab-panel>
        <q-tab-panel name="eternity" class="panel-flex"></q-tab-panel>
        <q-tab-panel name="infinity" class="panel-flex"></q-tab-panel>
        <q-tab-panel name="achievement" class="panel-flex">
          <Achievement />
        </q-tab-panel>
        <q-tab-panel name="help" class="panel-flex">
          <Help />
        </q-tab-panel>
        <q-tab-panel name="setting" class="panel-flex"></q-tab-panel>
      </q-tab-panels>
    </q-card>
    <q-footer class="main-footer">
      <div class="footer-row">
        <q-icon
          name="fa-duotone fa-hourglass-end"
          color="deep-purple-3"
          size="20px"
          class="q-mr-xs"
        />
        <span class="q-mr-md footer-label">До вечности:</span>
        <q-linear-progress
          :value="infinityProgress"
          color="deep-purple-5"
          track-color="grey-7"
          style="width: 300px; height: 22px"
          rounded
          class="q-mr-md"
        >
          <div class="absolute-full flex flex-center">
            <span class="footer-progress">{{ (infinityProgress * 100).toFixed(2) }}%</span>
          </div>
        </q-linear-progress>
      </div>
    </q-footer>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStoreGame } from 'src/stores/game';
import ShopCPU from 'src/components/shop/ShopCPU.vue';
import ShopHard from 'src/components/shop/ShopHard.vue';
import ShopRAM from 'src/components/shop/ShopRAM.vue';
import ResearchBase from 'src/components/research/ResearchBase.vue';
import AutomaticBuyer from 'src/components/automatic/AutomaticBuyer.vue';
import Help from 'src/pages/HelpPage.vue';
import Achievement from 'src/pages/AchievementPage.vue';
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
.main-layout
  min-height: 100vh
  min-width: 100vw
  display: flex
  flex-direction: column

.main-banner
  flex: 0 0 8vh
  min-height: 8vh
  max-height: 12vh
  width: 100vw
  background: transparent
  padding: 0
  margin-top: 8px

.banner-row
  display: flex
  flex-direction: row
  align-items: center
  width: 100%
  height: 100%

.banner-empty
  flex: 1 1 0

.banner-main
  flex: 2 2 0
  min-width: 0
  display: flex
  align-items: center
  justify-content: center

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

.main-card
  flex: 1 1 auto
  min-height: 0
  min-width: 0
  width: 100vw
  display: flex
  flex-direction: column
  background: transparent
  box-shadow: none
  padding: 0

.panel-flex
  flex: 1 1 auto
  min-height: 0
  min-width: 0
  display: flex
  flex-direction: column

.main-footer
  flex: 0 0 4vh
  min-height: 4vh
  max-height: 4vh
  width: 100vw
  padding: 0
  background: #23243a
  display: flex
  align-items: center
  justify-content: center

.footer-row
  display: flex
  align-items: center
  justify-content: center
  width: 100%
  height: 100%

.footer-label
  color: #fff
  font-weight: 500
  font-size: 16px

.footer-progress
  color: #fff
  font-weight: bold
  font-size: 15px

.q-tab-panels
  flex: 1 1 auto
  min-height: 0
  display: flex
  flex-direction: column

.q-panel-parent
  flex: 1 1 auto
  min-height: 0
  display: flex
  flex-direction: column
</style>
