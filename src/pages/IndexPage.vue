<template>
  <q-page class="main-layout">
    <q-banner class="main-banner">
      <div class="banner-row">
        <div class="banner-main">
          <div
            class="flex items-center q-pa-sm q-mr-xl"
            style="background: rgba(255, 255, 255, 0.04); border-radius: 10px"
          >
            <q-icon name="fa-duotone fa-gauge-high" size="24px" color="primary" />
            <span class="text-weight-bold text-h5 q-mx-xs on-color-epic-number">
              {{ formatNumber(storeGame.epicNumber) }}
            </span>
            <q-separator vertical class="q-mx-md" style="height: 32px" />
            <q-icon name="fa-solid fa-arrow-trend-up" size="22px" color="secondary" />
            <span class="text-weight-bold text-h5 q-ml-xs on-color-multiplier-epic-number">
              {{ formatNumber(multiplierEpicNumber, true) }}
            </span>
          </div>
          <div
            class="flex items-center q-pa-sm q-mr-xl"
            style="background: rgba(255, 255, 255, 0.04); border-radius: 10px"
          >
            <q-icon name="fa-duotone fa-flask-vial" size="22px" color="secondary" />
            <span class="text-weight-bold text-h5 q-ml-xs on-color-research-point">
              {{ formatNumber(researchPoints) }}
            </span>
            <q-separator vertical class="q-mx-md" style="height: 32px" />
            <q-icon name="fa-duotone fa-hourglass-end" size="22px" color="secondary" />
            <span class="text-weight-bold text-h5 q-ml-xs on-color-research-speed">
              {{ formatNumber(researchSpeed, true) }}
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
        <q-tab name="prestige" icon="fa-duotone fa-arrow-up-right-dots" label="Престиж" />
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
              <q-tabs v-model="innerShop" vertical class="text-teal" align="left">
                <q-tab name="innerShopCPU" icon="fa-duotone fa-microchip" label="CPU" />
                <q-tab name="innerShopHard" icon="fa-duotone fa-hard-drive" label="RAM" />
                <q-tab name="innerShopRAM" icon="fa-duotone fa-memory" label="HDD" />
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
                <q-tab name="innerScientist" icon="fa-duotone fa-user-astronaut" label="Учёные" />
                <q-tab name="innerResearchBase" icon="fa-duotone fa-flask" label="Базовые" />
              </q-tabs>
            </template>
            <template v-slot:after>
              <q-tab-panels
                v-model="innerResearch"
                transition-prev="slide-down"
                transition-next="slide-up"
              >
                <q-tab-panel name="innerScientist"><ResearchScientist /></q-tab-panel>
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
        <q-tab-panel name="prestige" class="panel-flex">
          <q-splitter v-model="splitterModel">
            <template v-slot:before>
              <q-tabs v-model="innerPrestige" vertical class="text-teal">
                <q-tab
                  name="innerPrestigeBase"
                  icon="fa-duotone fa-arrow-up-from-dotted-line"
                  label="Основа"
                />
                <q-tab
                  name="innerPrestigeUpgrade"
                  icon="fa-duotone fa-sparkles"
                  label="Улучшения"
                />
              </q-tabs>
            </template>
            <template v-slot:after>
              <q-tab-panels
                v-model="innerPrestige"
                transition-prev="slide-down"
                transition-next="slide-up"
              >
                <q-tab-panel name="innerPrestigeBase"><PrestigeBase /></q-tab-panel>
                <q-tab-panel name="innerPrestigeUpgrade"><PrestigeUpgrade /></q-tab-panel>
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
import ResearchScientist from 'src/components/research/ResearchScientist.vue';
import AutomaticBuyer from 'src/components/automatic/AutomaticBuyer.vue';
import PrestigeBase from 'src/components/prestige/PrestigeBase.vue';
import PrestigeUpgrade from 'src/components/prestige/PrestigeUpgrade.vue';
import Help from 'src/pages/HelpPage.vue';
import Achievement from 'src/pages/AchievementPage.vue';
import Decimal from 'break_eternity.js';
import { animate } from 'animejs';

const storeGame = useStoreGame();
const formatNumber = storeGame.formatNumber;

const tab = ref('shop');
const innerShop = ref('innerShopCPU');
const innerResearch = ref('innerScientist');
const innerAutomatic = ref('innerAutomaticBuyer');
const innerPrestige = ref('innerPrestigeBase');
const splitterModel = ref(20);

const multiplierEpicNumber = computed(() => {
  return storeGame.getMultiplierEpicNumber;
});

const researchSpeed = computed(() => {
  return storeGame.getResearchSpeed;
});

const researchPoints = computed(() => {
  return storeGame.researchPoint;
});

function animateColor(selector: string) {
  const base = 100,
    spread = 50;
  const r = Math.round(Math.random() * spread) + base;
  const g = Math.round(Math.random() * spread) + base;
  const b = Math.round(Math.random() * spread) + base;
  const color = `rgb(${r},${g},${b})`;
  animate(selector, { color });
}

const colorSelectors = [
  '.on-color-epic-number',
  '.on-color-multiplier-epic-number',
  '.on-color-research-point',
  '.on-color-research-speed',
];

setInterval(() => {
  colorSelectors.forEach((selector) => animateColor(selector));
}, 1000);

const log10Denom = new Decimal('1.8e308').log10();
const clamp = (v: number, min = 0, max = 1) => {
  if (v < min) return min;
  if (v > max) return max;
  return v;
};
const infinityProgress = computed(() => {
  const value = storeGame.epicNumber;
  if (value.lte(0)) return 0;
  const percent = value.log10().div(log10Denom).toNumber();
  return clamp(percent);
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

.banner-main
  flex: 2 2 0
  min-width: 0
  display: flex
  align-items: center
  justify-content: center

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

  .q-tabs.vertical
    .q-tab__label
      font-size: 11px !important
      max-width: 80px
    .q-tab__icon
      font-size: 16px !important
  .q-tab__label, .q-tab-panel .q-tab__label
    font-size: 11px !important
  .q-tab__icon, .q-tab-panel .q-tab__icon
    font-size: 16px !important
  .q-tabs.vertical
    .q-tab__label
      font-size: 13px !important
      max-width: 100px
    .q-tab__icon
      font-size: 18px !important
  .q-tab__label, .q-tab-panel .q-tab__label
    font-size: 13px !important
  .q-tab__icon, .q-tab-panel .q-tab__icon
    font-size: 18px !important
  .q-tabs.vertical
    .q-tab__label
      font-size: 15px !important
      max-width: 120px
    .q-tab__icon
      font-size: 20px !important
  .q-tab__label, .q-tab-panel .q-tab__label
    font-size: 15px !important
  .q-tab__icon, .q-tab-panel .q-tab__icon
    font-size: 20px !important
  .q-tabs.vertical
    .q-tab__label
      font-size: 17px !important
      max-width: 160px
    .q-tab__icon
      font-size: 22px !important
  .q-tab__label, .q-tab-panel .q-tab__label
    font-size: 17px !important
  .q-tab__icon, .q-tab-panel .q-tab__icon
    font-size: 22px !important
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

@media (max-width: 600px)
  .q-tabs.vertical .q-tab__content
    flex-direction: column
    align-items: center
    justify-content: center
    gap: 2px
  .q-tabs.vertical .q-tab__icon
    margin-bottom: 4px
    display: block
    align-self: center
  .q-tabs.vertical .q-tab__label
    display: block
    text-align: center
    white-space: normal
    word-break: break-word
    max-width: 120px
    padding: 0
    flex-shrink: 1
  .q-tabs.vertical .q-tab__content
    flex-direction: column
    align-items: center
    justify-content: flex-start
    gap: 2px
  .q-tabs.vertical .q-tab__icon
    margin-right: 0
    margin-bottom: 4px
    display: block
    align-self: center
  .q-tabs.vertical .q-tab__label
    display: block
    text-align: center
    white-space: normal
    word-break: break-word
    max-width: 120px
    padding: 0
    flex-shrink: 1
  .q-tab, .q-tab__content
    align-items: center
    justify-content: center
    gap: 2px
  .q-tab__icon, .q-tab-panel .q-tab__icon
    padding: 0
    flex-shrink: 0
    margin-right: 2px
    .q-tabs:not(.vertical) .q-tab__label, .q-tab-panel .q-tab__label
      padding: 0
      flex-shrink: 1
      max-width: 120px
      overflow: visible
      text-overflow: unset
      white-space: normal
    .q-tabs.vertical .q-tab__label
      display: block
      padding: 0
      flex-shrink: 1
    max-width: 120px
      white-space: normal
      word-break: break-word
  .q-tab__label, .q-tab-panel .q-tab__label
    font-size: 12px !important
    padding: 0 2px
  .q-tab__icon, .q-tab-panel .q-tab__icon
    font-size: 18px !important
    min-width: 0
    padding: 0 2px
  .main-banner
    flex-direction: row
    min-height: 6vh
    max-height: 10vh
    margin-top: 2px
    padding: 2px
  .banner-row
    flex-direction: row
    align-items: center
    height: auto
  .banner-main
    flex-direction: row
    align-items: center
    padding: 0
    flex-wrap: wrap
    div
      padding: 2px 6px
      display: flex
      align-items: center
      justify-content: center
      width: auto
      box-sizing: border-box
      .q-separator
        align-self: stretch
        height: auto !important
        min-height: 0 !important
        max-height: none !important
  .on-color-epic-number,
  .on-color-multiplier-epic-number,
  .on-color-research-point,
  .on-color-research-speed
    font-size: 15px !important
    min-width: 0
    padding: 0 2px
  .q-icon
    font-size: 14px !important
    min-width: 0
    padding: 0 2px
    flex-direction: column
    align-items: stretch
    padding: 0
  .main-card
    width: 100vw
    padding: 2px
    box-shadow: none
  .panel-flex
    padding: 2px
  .main-footer
    min-height: 6vh
    max-height: 8vh
    padding: 2px
    font-size: 15px
  .footer-label, .footer-progress
    font-size: 17px

@media (max-width: 900px) and (min-width: 601px)
  .main-layout
    min-width: 100vw
    padding: 0 8px
  .main-banner
    min-height: 10vh
    max-height: 16vh
    margin-top: 4px
    padding: 4px
  .main-card
    width: 100vw
    padding: 4px
  .panel-flex
    padding: 4px
  .main-footer
    min-height: 6vh
    max-height: 8vh
    padding: 4px
    font-size: 16px
  .footer-label, .footer-progress
    font-size: 18px

@media (orientation: landscape) and (max-width: 900px)
  .main-banner
    min-height: 7vh
    max-height: 10vh
    margin-top: 0
    padding: 2px

  .main-footer
    min-height: 4vh
    max-height: 5vh
    padding: 2px
    font-size: 15px

@media (max-width: 400px)
  .main-banner, .main-card, .panel-flex, .main-footer, .footer-label, .footer-progress
    font-size: 13px

@media (max-width: 600px) and (min-width: 401px)
  .main-banner, .main-card, .panel-flex, .main-footer, .footer-label, .footer-progress
    font-size: 15px

@media (max-width: 900px) and (min-width: 601px)
  .main-banner, .main-card, .panel-flex, .main-footer, .footer-label, .footer-progress
    font-size: 18px
</style>
