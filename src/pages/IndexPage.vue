<template>
  <q-page class="main-layout">
    <div class="banner-row">
      <div
        class="flex items-center"
        style="background: rgba(255, 255, 255, 0.04); border-radius: 10px"
      >
        <i :class="iconStyle + 'fa-gauge-high'" size="24px" color="primary" />
        <span ref="epicRef" class="text-weight-bold text-h5">
          {{ formatNumber(storeData.epicNumber) }}
        </span>
      </div>
      <div
        v-if="storeData.currentTab === 'shop'"
        class="flex items-center"
        style="background: rgba(255, 255, 255, 0.04); border-radius: 10px"
      >
        <i :class="iconStyle + 'fa-coins'" size="22px" color="secondary" />
        <span ref="shopRef" class="text-weight-bold text-h5">
          {{ formatNumber(storeShop.points) }}
        </span>
      </div>
      <div
        v-if="storeData.currentTab === 'prestige'"
        class="flex items-center"
        style="background: rgba(255, 255, 255, 0.04); border-radius: 10px"
      >
        <i :class="iconStyle + 'fa-arrow-up-right-dots'" size="22px" color="secondary" />
        <span ref="prestigeRef" class="text-weight-bold text-h5">
          {{ formatNumber(storePrestige.points) }}
        </span>
      </div>
      <div
        v-if="storeData.currentTab === 'research'"
        class="flex items-center"
        style="background: rgba(255, 255, 255, 0.04); border-radius: 10px"
      >
        <i :class="iconStyle + 'fa-swords'" size="22px" color="secondary" />
        <span ref="researchRef" class="text-weight-bold text-h5">
          {{ formatNumber(storeResearch.points) }}
        </span>
      </div>
    </div>
    <q-card class="main-card">
      <q-tabs
        v-model="tab"
        dense
        active-color="primary"
        indicator-color="primary"
        align="justify"
        class="text-grey"
      >
        <q-tab name="shop" :label="tabLabels.shop">
          <i :class="iconStyle + 'fa-store'" />
        </q-tab>
        <q-tab name="prestige" :label="tabLabels.prestige">
          <i :class="iconStyle + 'fa-arrow-up-right-dots'" />
        </q-tab>
        <q-tab name="research" :label="tabLabels.research">
          <i :class="iconStyle + 'fa-flask-vial'" />
        </q-tab>
        <q-tab name="automatic" :label="tabLabels.automatic">
          <i :class="iconStyle + 'fa-microchip-ai'" />
        </q-tab>
        <q-tab name="eternity" :label="tabLabels.eternity">
          <i :class="iconStyle + 'fa-hourglass-end'" />
        </q-tab>
        <q-tab name="magic" :label="tabLabels.magic">
          <i :class="iconStyle + 'fa-hat-wizard'" />
        </q-tab>
        <q-tab name="infinity" :label="tabLabels.infinity">
          <i :class="iconStyle + 'fa-infinity'" />
        </q-tab>
        <q-tab name="achievement" :label="tabLabels.achievement">
          <i :class="iconStyle + 'fa-trophy-star'" />
        </q-tab>
        <q-tab name="stats" :label="tabLabels.stats">
          <i :class="iconStyle + 'fa-chart-line'" />
        </q-tab>
        <q-tab name="help" :label="tabLabels.help">
          <i :class="iconStyle + 'fa-circle-question'" />
        </q-tab>
        <q-tab name="setting" :label="tabLabels.setting">
          <i :class="iconStyle + 'fa-gear-complex'" />
        </q-tab>
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab">
        <q-tab-panel name="shop" class="panel-flex">
          <TabLayout
            :tabs="shopTabs"
            v-model:active-tab="innerShop"
            v-model:splitter-model="splitterModel"
            :is-mobile="isMobile"
          >
            <template #innerShopCPU>
              <ShopTemplate name="cpu" label="CPU" :icon="iconStyle + 'fa-microchip'" />
            </template>
            <template #innerShopHDD>
              <ShopTemplate name="hdd" label="HDD" :icon="iconStyle + 'fa-hard-drive'" />
            </template>
            <template #innerShopRAM>
              <ShopTemplate name="ram" label="RAM" :icon="iconStyle + 'fa-memory'" />
            </template>
            <template #innerShopWorker>
              <ShopTemplate name="worker" label="Работники" :icon="iconStyle + 'fa-users'" />
            </template>
          </TabLayout>
        </q-tab-panel>
        <q-tab-panel name="prestige" class="panel-flex">
          <TabLayout
            :tabs="prestigeTabs"
            v-model:active-tab="innerPrestige"
            v-model:splitter-model="splitterModel"
            :is-mobile="isMobile"
          >
            <template #innerPrestigeBase>
              <PrestigeBase />
            </template>
            <template #innerPrestigeUpgrade>
              <PrestigeUpgrade />
            </template>
          </TabLayout>
        </q-tab-panel>
        <q-tab-panel name="research" class="panel-flex">
          <TabLayout
            :tabs="researchTabs"
            v-model:active-tab="innerResearch"
            v-model:splitter-model="splitterModel"
            :is-mobile="isMobile"
          >
            <template #innerResearchScientist>
              <ResearchScientist />
            </template>
            <template #innerResearchBase>
              <ResearchBase />
            </template>
          </TabLayout>
        </q-tab-panel>
        <q-tab-panel name="automatic" class="panel-flex">
          <TabLayout
            :tabs="automaticTabs"
            v-model:active-tab="innerAutomatic"
            v-model:splitter-model="splitterModel"
            :is-mobile="isMobile"
          >
            <template #innerAutomaticHelpersShop>
              <AutomaticHelpersShop />
            </template>
          </TabLayout>
        </q-tab-panel>
        <q-tab-panel name="eternity" class="panel-flex"></q-tab-panel>
        <q-tab-panel name="magic" class="panel-flex">
          <TabLayout
            :tabs="magicTabs"
            v-model:active-tab="innerMagic"
            v-model:splitter-model="splitterModel"
            :is-mobile="isMobile"
          >
            <template #innerMagicBattle>
              <MagicBattle />
            </template>
            <template #innerMagicMage>
              <MagicMage />
            </template>
            <template #innerMagicEssence>
              <MagicEssence />
            </template>
            <template #innerMagicRune>
              <MagicRune />
            </template>
            <template #innerMagicCraft>
              <MagicCraft />
            </template>
          </TabLayout>
        </q-tab-panel>
        <q-tab-panel name="infinity" class="panel-flex"></q-tab-panel>
        <q-tab-panel name="achievement" class="panel-flex">
          <Achievement />
        </q-tab-panel>
        <q-tab-panel name="stats" class="panel-flex">
          <StatsPage />
        </q-tab-panel>
        <q-tab-panel name="help" class="panel-flex">
          <Help />
        </q-tab-panel>
        <q-tab-panel name="setting" class="panel-flex"> <SettingPage /></q-tab-panel>
      </q-tab-panels>
    </q-card>
    <q-footer class="footer">
      <i :class="iconStyle + 'fa-hourglass-end'" color="deep-purple-3" size="20px" />
      <span class="q-mr-md footer-label">До вечности:</span>
      <q-linear-progress
        :value="infinityProgress"
        color="deep-purple-5"
        track-color="grey-7"
        class="progress-bar"
        rounded
      >
        <div class="absolute-full flex flex-center">
          <span class="footer-progress">{{ (infinityProgress * 100).toFixed(2) }}%</span>
        </div>
      </q-linear-progress>
    </q-footer>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useStoreData } from 'stores/data';
import ShopTemplate from 'src/components/shop/ShopTemplate.vue';
import ResearchBase from 'src/components/research/ResearchBase.vue';
import ResearchScientist from 'src/components/research/ResearchScientist.vue';
import AutomaticHelpersShop from 'src/components/automatic/AutomaticHelpersShop.vue';
import PrestigeBase from 'src/components/prestige/PrestigeBase.vue';
import PrestigeUpgrade from 'src/components/prestige/PrestigeUpgrade.vue';
import MagicEssence from 'src/components/magic/MagicEssence.vue';
import MagicRune from 'src/components/magic/MagicRune.vue';
import MagicCraft from 'src/components/magic/MagicCraft.vue';
import MagicMage from 'src/components/magic/MagicMage.vue';
import MagicBattle from 'src/components/magic/MagicBattle.vue';
import Help from 'src/pages/HelpPage.vue';
import Achievement from 'src/pages/AchievementPage.vue';
import StatsPage from 'src/pages/StatsPage.vue';
import SettingPage from 'src/pages/SettingPage.vue';
import TabLayout from 'src/components/TabLayout.vue';
import Decimal from 'break_eternity.js';
import { animate } from 'animejs';
import { useStoreResearch } from 'stores/research';
import { useStoreShop } from 'stores/shop';
import { useStorePrestige } from 'stores/prestige';
import { useStoreSetting } from 'stores/setting';

const storeData = useStoreData();
const storeResearch = useStoreResearch();
const storeShop = useStoreShop();
const storePrestige = useStorePrestige();
const storeSetting = useStoreSetting();

const iconStyle = computed(() => {
  return storeSetting.iconStyle;
});

const formatNumber = storeData.formatNumber;

const tab = computed({
  get: () => storeData.currentTab,
  set: (val: string) => {
    storeData.currentTab = val;
  },
});
const innerShop = ref('innerShopCPU');
const innerResearch = ref('innerResearchScientist');
const innerAutomatic = ref('innerAutomaticHelpersShop');
const innerPrestige = ref('innerPrestigeBase');
const innerMagic = ref('innerMagicBattle');
const splitterModel = ref(20);

const isMobile = computed(() => window.innerWidth < 700);

watch(isMobile, (val) => {
  splitterModel.value = val ? 0 : 20;
});

const epicRef = ref<HTMLElement | null>(null);
const shopRef = ref<HTMLElement | null>(null);
const prestigeRef = ref<HTMLElement | null>(null);
const researchRef = ref<HTMLElement | null>(null);

const tabLabels = computed(() => ({
  shop: isMobile.value ? 'Ма' : 'Магазин',
  prestige: isMobile.value ? 'Пр' : 'Престиж',
  research: isMobile.value ? 'Ис' : 'Исследования',
  automatic: isMobile.value ? 'Ав' : 'Автоматизация',
  eternity: isMobile.value ? 'Ве' : 'Вечность',
  magic: isMobile.value ? 'Ма' : 'Магия',
  infinity: isMobile.value ? 'Бе' : 'Бесконечность',
  achievement: isMobile.value ? 'До' : 'Достижения',
  stats: isMobile.value ? 'Ст' : 'Статистика',
  help: isMobile.value ? 'По' : 'Помощь',
  setting: isMobile.value ? 'На' : 'Настройки',
}));

const innerShopLabels = computed(() => ({
  innerShopWorker: isMobile.value ? 'Работ' : 'Работники',
}));

const innerPrestigeLabels = computed(() => ({
  innerPrestigeBase: isMobile.value ? 'Основ' : 'Основа',
  innerPrestigeUpgrade: isMobile.value ? 'Улучш' : 'Улучшения',
}));

const innerResearchLabels = computed(() => ({
  innerResearchScientist: isMobile.value ? 'Учёны' : 'Учён.',
  innerResearchBase: isMobile.value ? 'Базов' : 'Базовые',
}));

const innerAutomaticLabels = computed(() => ({
  innerAutomaticHelpersShop: isMobile.value ? 'Скупщ' : 'Скупщики комплектующих',
}));

const innerMagicLabels = computed(() => ({
  innerMagicBattle: isMobile.value ? 'Битв' : 'Битва',
  innerMagicEssence: isMobile.value ? 'Эссе' : 'Эссенции',
  innerMagicCraft: isMobile.value ? 'Созд' : 'Создание',
}));

const shopTabs = computed(() => [
  { name: 'innerShopCPU', icon: iconStyle.value + 'fa-microchip', label: 'CPU' },
  { name: 'innerShopHDD', icon: iconStyle.value + 'fa-hard-drive', label: 'HDD' },
  { name: 'innerShopRAM', icon: iconStyle.value + 'fa-memory', label: 'RAM' },
  {
    name: 'innerShopWorker',
    icon: iconStyle.value + 'fa-users',
    label: innerShopLabels.value.innerShopWorker,
  },
]);

const prestigeTabs = computed(() => [
  {
    name: 'innerPrestigeBase',
    icon: iconStyle.value + 'fa-arrow-up-from-dotted-line',
    label: innerPrestigeLabels.value.innerPrestigeBase,
  },
  {
    name: 'innerPrestigeUpgrade',
    icon: iconStyle.value + 'fa-sparkles',
    label: innerPrestigeLabels.value.innerPrestigeUpgrade,
  },
]);

const researchTabs = computed(() => [
  {
    name: 'innerResearchScientist',
    icon: iconStyle.value + 'fa-user-astronaut',
    label: innerResearchLabels.value.innerResearchScientist,
  },
  {
    name: 'innerResearchBase',
    icon: iconStyle.value + 'fa-flask',
    label: innerResearchLabels.value.innerResearchBase,
  },
]);

const automaticTabs = computed(() => [
  {
    name: 'innerAutomaticHelpersShop',
    icon: iconStyle.value + 'fa-cart-shopping',
    label: innerAutomaticLabels.value.innerAutomaticHelpersShop,
  },
]);

const magicTabs = computed(() => [
  {
    name: 'innerMagicBattle',
    icon: iconStyle.value + 'fa-swords',
    label: innerMagicLabels.value.innerMagicBattle,
  },
  { name: 'innerMagicMage', icon: iconStyle.value + 'fa-hat-wizard', label: 'Маги' },
  {
    name: 'innerMagicEssence',
    icon: iconStyle.value + 'fa-flask-vial',
    label: innerMagicLabels.value.innerMagicEssence,
  },
  { name: 'innerMagicRune', icon: iconStyle.value + 'fa-scroll-old', label: 'Руны' },
  {
    name: 'innerMagicCraft',
    icon: iconStyle.value + 'fa-hammer-war',
    label: innerMagicLabels.value.innerMagicCraft,
  },
]);

function animateColorEl(el: HTMLElement | null, fast: boolean = false) {
  if (!el) return;
  const base = 100,
    spread = 50;
  const r = Math.round(Math.random() * spread) + base;
  const g = Math.round(Math.random() * spread) + base;
  const b = Math.round(Math.random() * spread) + base;
  const color = `rgb(${r},${g},${b})`;
  animate(el, { color, duration: fast ? 0 : 1000 });
}

watch(
  () => formatNumber(storeData.epicNumber),
  () => animateColorEl(epicRef.value),
);
watch(
  () => formatNumber(storeShop.points),
  () => animateColorEl(shopRef.value),
);
watch(
  () => formatNumber(storePrestige.points),
  () => animateColorEl(prestigeRef.value),
);
watch(
  () => formatNumber(storeResearch.points),
  () => animateColorEl(researchRef.value),
);

onMounted(() => {
  animateColorEl(epicRef.value);
  animateColorEl(shopRef.value);
  animateColorEl(prestigeRef.value);
  animateColorEl(researchRef.value);
});

watch(
  () => storeData.currentTab,
  (tab) => {
    nextTick(() => {
      if (tab === 'shop') animateColorEl(shopRef.value, true);
      else if (tab === 'prestige') animateColorEl(prestigeRef.value, true);
      else if (tab === 'research') animateColorEl(researchRef.value, true);
      else animateColorEl(epicRef.value);
    }).catch((error) => {
      console.error('Error animating color:', error);
    });
  },
);

const log10Denom = new Decimal('1.8e308').log10();
const clamp = (v: number, min = 0, max = 1) => {
  if (v < min) return min;
  if (v > max) return max;
  return v;
};
const infinityProgress = computed(() => {
  const value = storeData.epicNumber;
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

.banner-row
  display: flex
  flex-direction: row
  flex-wrap: nowrap
  align-items: center
  justify-content: center
  margin-top: 15px
  margin-bottom: 5px

.banner-row > div
  margin: 3px
  max-height: 30px
  min-width: 100px
  max-width: 200px
  display: flex
  align-items: center
  justify-content: center

.banner-row > div
  margin-left: 7px !important
  margin-right: 7px !important

.banner-row > div > i, span
  margin-left: 4px !important
  margin-right: 4px !important

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

.footer
  flex: 0 0 48px
  min-height: 48px
  max-height: 56px
  width: 100vw
  padding: 0
  background: #23243a
  display: flex
  align-items: center
  justify-content: center
  font-size: 16px

.progress-bar
  width: 300px
  min-height: 18px
  display: flex
  align-items: center
  position: relative

.footer-progress
  color: #fff
  font-weight: bold
  font-size: 18px
  line-height: 1.2
  white-space: nowrap
  text-shadow: 0 1px 4px #23243a, 0 0 2px #23243a

.q-tab i
  font-size: 20px !important

@media (max-width: 700px)
  .main-layout
    min-width: 100vw
  .main-card
    width: 100vw
    padding: 4px
    box-shadow: none
  .panel-flex
    padding: 4px
  .footer
    min-height: 24px
    max-height: 40px
    padding: 4px
    font-size: 12px !important
  .progress-bar
    width: 170px
    height: 30px
    display: flex
    align-items: center
    position: relative
  .footer-label, .footer-progress
    font-size: 16px
    line-height: 1.2
  .q-tabs.vertical .q-tab__content,
  .q-tabs.vertical .q-tab__icon,
  .q-tabs.vertical .q-tab__label
    flex-direction: column
    align-items: center
    justify-content: center
    gap: 2px
    display: block
    text-align: center
    padding: 0
    flex-shrink: 1
    margin-bottom: 4px
  .q-tabs.vertical .q-tab__label
    font-size: 12px !important
    white-space: normal !important
    word-break: break-word !important
    max-width: none !important
    text-align: center
    padding: 0 2px
    writing-mode: vertical-rl
    text-orientation: mixed
  .q-tab__label, .q-tab-panel .q-tab__label
    font-size: 12px !important
    white-space: normal !important
    word-break: break-word !important
    max-width: none !important
    text-align: center
    padding: 0 2px
  .q-tab, .q-tab__content
    align-items: center
    justify-content: center
    gap: 2px
  .q-tab__icon, .q-tab-panel .q-tab__icon
    font-size: 18px !important
    min-width: 0
    padding: 0 2px
  .q-tab i
    font-size: 18px !important
    min-width: 0
    padding: 0 2px
  .on-color-epic-number,
  .on-color-shop-points,
  .on-color-research-points
    font-size: 15px !important
  i
    font-size: 14px !important
    min-width: 0
    padding: 0 2px
    flex-direction: column
    align-items: stretch
</style>
