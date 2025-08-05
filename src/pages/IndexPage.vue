<template>
  <q-page class="main-layout">
    <div class="banner-row">
      <div
        class="flex items-center"
        style="background: rgba(255, 255, 255, 0.04); border-radius: 10px"
      >
        <q-icon name="fa-duotone fa-gauge-high" size="24px" color="primary" />
        <span ref="epicRef" class="text-weight-bold text-h5">
          {{ formatNumber(storeData.epicNumber) }}
        </span>
      </div>
      <div
        v-if="storeData.currentTab === 'shop'"
        class="flex items-center"
        style="background: rgba(255, 255, 255, 0.04); border-radius: 10px"
      >
        <q-icon name="fa-duotone fa-coins" size="22px" color="secondary" />
        <span ref="shopRef" class="text-weight-bold text-h5">
          {{ formatNumber(storeShop.points) }}
        </span>
      </div>
      <div
        v-if="storeData.currentTab === 'prestige'"
        class="flex items-center"
        style="background: rgba(255, 255, 255, 0.04); border-radius: 10px"
      >
        <q-icon name="fa-duotone fa-arrow-up-right-dots" size="22px" color="secondary" />
        <span ref="prestigeRef" class="text-weight-bold text-h5">
          {{ formatNumber(storePrestige.points) }}
        </span>
      </div>
      <div
        v-if="storeData.currentTab === 'research'"
        class="flex items-center"
        style="background: rgba(255, 255, 255, 0.04); border-radius: 10px"
      >
        <q-icon name="fa-duotone fa-swords" size="22px" color="secondary" />
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
        <q-tab name="shop" icon="fa-duotone fa-store" :label="tabLabels.shop" />
        <q-tab
          name="prestige"
          icon="fa-duotone fa-arrow-up-right-dots"
          :label="tabLabels.prestige"
        />
        <q-tab name="research" icon="fa-duotone fa-flask-vial" :label="tabLabels.research" />
        <q-tab name="automatic" icon="fa-duotone fa-microchip-ai" :label="tabLabels.automatic" />
        <q-tab name="eternity" icon="fa-duotone fa-hourglass-end" :label="tabLabels.eternity" />
        <q-tab name="magic" icon="fa-duotone fa-hat-wizard" :label="tabLabels.magic" />
        <q-tab name="infinity" icon="fa-duotone fa-infinity" :label="tabLabels.infinity" />
        <q-tab name="achievement" icon="fa-duotone fa-trophy-star" :label="tabLabels.achievement" />
        <q-tab name="stats" icon="fa-duotone fa-chart-line" :label="tabLabels.stats" />
        <q-tab name="help" icon="fa-duotone fa-circle-question" :label="tabLabels.help" />
        <q-tab name="setting" icon="fa-duotone fa-gear-complex" :label="tabLabels.setting" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab">
        <q-tab-panel name="shop" class="panel-flex">
          <template v-if="isMobile">
            <q-tabs v-model="innerShop" align="justify" class="text-teal">
              <q-tab name="innerShopCPU" icon="fa-duotone fa-microchip" label="CPU" />
              <q-tab name="innerShopHDD" icon="fa-duotone fa-hard-drive" label="HDD" />
              <q-tab name="innerShopRAM" icon="fa-duotone fa-memory" label="RAM" />
              <q-tab
                name="innerShopWorker"
                icon="fa-duotone fa-users"
                :label="innerShopLabels.innerShopWorker"
              />
            </q-tabs>
            <q-tab-panels
              v-model="innerShop"
              transition-prev="slide-down"
              transition-next="slide-up"
            >
              <q-tab-panel name="innerShopCPU"
                ><ShopTemplate name="cpu" label="CPU" icon="fa-duotone fa-microchip"
              /></q-tab-panel>
              <q-tab-panel name="innerShopHDD"
                ><ShopTemplate name="hdd" label="HDD" icon="fa-duotone fa-hard-drive"
              /></q-tab-panel>
              <q-tab-panel name="innerShopRAM"
                ><ShopTemplate name="ram" label="RAM" icon="fa-duotone fa-memory"
              /></q-tab-panel>
              <q-tab-panel name="innerShopWorker"
                ><ShopTemplate name="worker" label="Работники" icon="fa-duotone fa-users"
              /></q-tab-panel>
            </q-tab-panels>
          </template>
          <template v-else>
            <q-splitter v-model="splitterModel">
              <template v-slot:before>
                <q-tabs v-model="innerShop" vertical align="left" class="text-teal">
                  <q-tab name="innerShopCPU" icon="fa-duotone fa-microchip" label="CPU" />
                  <q-tab name="innerShopHDD" icon="fa-duotone fa-hard-drive" label="HDD" />
                  <q-tab name="innerShopRAM" icon="fa-duotone fa-memory" label="RAM" />
                  <q-tab
                    name="innerShopWorker"
                    icon="fa-duotone fa-users"
                    :label="innerShopLabels.innerShopWorker"
                  />
                </q-tabs>
              </template>
              <template v-slot:after>
                <q-tab-panels
                  v-model="innerShop"
                  transition-prev="slide-down"
                  transition-next="slide-up"
                >
                  <q-tab-panel name="innerShopCPU"
                    ><ShopTemplate name="cpu" label="CPU" icon="fa-duotone fa-microchip"
                  /></q-tab-panel>
                  <q-tab-panel name="innerShopHDD"
                    ><ShopTemplate name="hdd" label="HDD" icon="fa-duotone fa-hard-drive"
                  /></q-tab-panel>
                  <q-tab-panel name="innerShopRAM"
                    ><ShopTemplate name="ram" label="RAM" icon="fa-duotone fa-memory"
                  /></q-tab-panel>
                  <q-tab-panel name="innerShopWorker"
                    ><ShopTemplate name="worker" label="Работники" icon="fa-duotone fa-users"
                  /></q-tab-panel>
                </q-tab-panels>
              </template>
            </q-splitter>
          </template>
        </q-tab-panel>
        <q-tab-panel name="prestige" class="panel-flex">
          <template v-if="isMobile">
            <q-tabs v-model="innerPrestige" align="justify" class="text-teal">
              <q-tab
                name="innerPrestigeBase"
                icon="fa-duotone fa-arrow-up-from-dotted-line"
                :label="innerPrestigeLabels.innerPrestigeBase"
              />
              <q-tab
                name="innerPrestigeUpgrade"
                icon="fa-duotone fa-sparkles"
                :label="innerPrestigeLabels.innerPrestigeUpgrade"
              />
            </q-tabs>
            <q-tab-panels
              v-model="innerPrestige"
              transition-prev="slide-down"
              transition-next="slide-up"
            >
              <q-tab-panel name="innerPrestigeBase"><PrestigeBase /></q-tab-panel>
              <q-tab-panel name="innerPrestigeUpgrade"><PrestigeUpgrade /></q-tab-panel>
            </q-tab-panels>
          </template>
          <template v-else>
            <q-splitter v-model="splitterModel">
              <template v-slot:before>
                <q-tabs v-model="innerPrestige" vertical class="text-teal">
                  <q-tab
                    name="innerPrestigeBase"
                    icon="fa-duotone fa-arrow-up-from-dotted-line"
                    :label="innerPrestigeLabels.innerPrestigeBase"
                  />
                  <q-tab
                    name="innerPrestigeUpgrade"
                    icon="fa-duotone fa-sparkles"
                    :label="innerPrestigeLabels.innerPrestigeUpgrade"
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
          </template>
        </q-tab-panel>
        <q-tab-panel name="research" class="panel-flex">
          <template v-if="isMobile">
            <q-tabs v-model="innerResearch" align="justify" class="text-teal">
              <q-tab
                name="innerResearchScientist"
                icon="fa-duotone fa-user-astronaut"
                :label="innerResearchLabels.innerResearchScientist"
              />
              <q-tab
                name="innerResearchBase"
                icon="fa-duotone fa-flask"
                :label="innerResearchLabels.innerResearchBase"
              />
            </q-tabs>
            <q-tab-panels
              v-model="innerResearch"
              transition-prev="slide-down"
              transition-next="slide-up"
            >
              <q-tab-panel name="innerResearchScientist"><ResearchScientist /></q-tab-panel>
              <q-tab-panel name="innerResearchBase"><ResearchBase /></q-tab-panel>
            </q-tab-panels>
          </template>
          <template v-else>
            <q-splitter v-model="splitterModel">
              <template v-slot:before>
                <q-tabs v-model="innerResearch" vertical class="text-teal">
                  <q-tab
                    name="innerResearchScientist"
                    icon="fa-duotone fa-user-astronaut"
                    :label="innerResearchLabels.innerResearchScientist"
                  />
                  <q-tab
                    name="innerResearchBase"
                    icon="fa-duotone fa-flask"
                    :label="innerResearchLabels.innerResearchBase"
                  />
                </q-tabs>
              </template>
              <template v-slot:after>
                <q-tab-panels
                  v-model="innerResearch"
                  transition-prev="slide-down"
                  transition-next="slide-up"
                >
                  <q-tab-panel name="innerResearchScientist"><ResearchScientist /></q-tab-panel>
                  <q-tab-panel name="innerResearchBase"><ResearchBase /></q-tab-panel>
                </q-tab-panels>
              </template>
            </q-splitter>
          </template>
        </q-tab-panel>
        <q-tab-panel name="automatic" class="panel-flex">
          <template v-if="isMobile">
            <q-tabs v-model="innerAutomatic" align="justify" class="text-teal">
              <q-tab
                name="innerAutomaticHelpersShop"
                icon="fa-duotone fa-cart-shopping"
                :label="innerAutomaticLabels.innerAutomaticHelpersShop"
              />
            </q-tabs>
            <q-tab-panels
              v-model="innerAutomatic"
              transition-prev="slide-down"
              transition-next="slide-up"
            >
              <q-tab-panel name="innerAutomaticHelpersShop"><AutomaticHelpersShop /></q-tab-panel>
            </q-tab-panels>
          </template>
          <template v-else>
            <q-splitter v-model="splitterModel">
              <template v-slot:before>
                <q-tabs v-model="innerAutomatic" vertical class="text-teal">
                  <q-tab
                    name="innerAutomaticHelpersShop"
                    icon="fa-duotone fa-cart-shopping"
                    :label="innerAutomaticLabels.innerAutomaticHelpersShop"
                  />
                </q-tabs>
              </template>
              <template v-slot:after>
                <q-tab-panels
                  v-model="innerAutomatic"
                  transition-prev="slide-down"
                  transition-next="slide-up"
                >
                  <q-tab-panel name="innerAutomaticHelpersShop"
                    ><AutomaticHelpersShop
                  /></q-tab-panel>
                </q-tab-panels>
              </template>
            </q-splitter>
          </template>
        </q-tab-panel>
        <q-tab-panel name="eternity" class="panel-flex"></q-tab-panel>
        <q-tab-panel name="magic" class="panel-flex">
          <template v-if="isMobile">
            <q-tabs v-model="innerMagic" align="justify" class="text-teal">
              <q-tab
                name="innerMagicBattle"
                icon="fa-duotone fa-swords"
                :label="innerMagicLabels.innerMagicBattle"
              />
              <q-tab name="innerMagicMage" icon="fa-duotone fa-hat-wizard" label="Маги" />
              <q-tab
                name="innerMagicEssence"
                icon="fa-duotone fa-flask-vial"
                :label="innerMagicLabels.innerMagicEssence"
              />
              <q-tab name="innerMagicRune" icon="fa-duotone fa-scroll-old" label="Руны" />
              <q-tab
                name="innerMagicCraft"
                icon="fa-duotone fa-hammer-war"
                :label="innerMagicLabels.innerMagicCraft"
              />
            </q-tabs>
            <q-tab-panels
              v-model="innerMagic"
              transition-prev="slide-down"
              transition-next="slide-up"
            >
              <q-tab-panel name="innerMagicBattle"><MagicBattle /></q-tab-panel>
              <q-tab-panel name="innerMagicMage"><MagicMage /></q-tab-panel>
              <q-tab-panel name="innerMagicEssence"><MagicEssence /></q-tab-panel>
              <q-tab-panel name="innerMagicRune"><MagicRune /></q-tab-panel>
              <q-tab-panel name="innerMagicCraft"><MagicCraft /></q-tab-panel>
            </q-tab-panels>
          </template>
          <template v-else>
            <q-splitter v-model="splitterModel">
              <template v-slot:before>
                <q-tabs v-model="innerMagic" vertical class="text-teal">
                  <q-tab
                    name="innerMagicBattle"
                    icon="fa-duotone fa-swords"
                    :label="innerMagicLabels.innerMagicBattle"
                  />
                  <q-tab name="innerMagicMage" icon="fa-duotone fa-hat-wizard" label="Маги" />
                  <q-tab
                    name="innerMagicEssence"
                    icon="fa-duotone fa-flask-vial"
                    :label="innerMagicLabels.innerMagicEssence"
                  />
                  <q-tab name="innerMagicRune" icon="fa-duotone fa-scroll-old" label="Руны" />
                  <q-tab
                    name="innerMagicCraft"
                    icon="fa-duotone fa-hammer-war"
                    :label="innerMagicLabels.innerMagicCraft"
                  />
                </q-tabs>
              </template>
              <template v-slot:after>
                <q-tab-panels
                  v-model="innerMagic"
                  transition-prev="slide-down"
                  transition-next="slide-up"
                >
                  <q-tab-panel name="innerMagicBattle"><MagicBattle /></q-tab-panel>
                  <q-tab-panel name="innerMagicMage"><MagicMage /></q-tab-panel>

                  <q-tab-panel name="innerMagicEssence"><MagicEssence /></q-tab-panel>
                  <q-tab-panel name="innerMagicRune"><MagicRune /></q-tab-panel>
                  <q-tab-panel name="innerMagicCraft"><MagicCraft /></q-tab-panel>
                </q-tab-panels>
              </template>
            </q-splitter>
          </template>
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
      <q-icon name="fa-duotone fa-hourglass-end" color="deep-purple-3" size="20px" />
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
import Decimal from 'break_eternity.js';
import { animate } from 'animejs';
import { useStoreResearch } from 'stores/research';
import { useStoreShop } from 'stores/shop';
import { useStorePrestige } from 'stores/prestige';

const storeData = useStoreData();
const storeResearch = useStoreResearch();
const storeShop = useStoreShop();
const storePrestige = useStorePrestige();

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

.banner-row > div > q-icon, span
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
  .on-color-epic-number,
  .on-color-shop-points,
  .on-color-research-points
    font-size: 15px !important
  .q-icon
    font-size: 14px !important
    min-width: 0
    padding: 0 2px
    flex-direction: column
    align-items: stretch
</style>
