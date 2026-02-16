<template>
  <q-page class="main-layout text-xs sm:text-sm">
    <div class="banner-row">
      <div
        class="flex items-center"
        style="background: rgba(255, 255, 255, 0.04); border-radius: 10px"
      >
        <i :class="iconStyle + 'fa-gauge-high'" size="24px" color="primary" />
        <span ref="epicRef" class="text-weight-bold text-base sm:text-h5">
          {{ formatNumber(storeData.epicNumber) }}
        </span>
      </div>
      <div
        v-if="storeData.currentTab === 'shop'"
        class="flex items-center"
        style="background: rgba(255, 255, 255, 0.04); border-radius: 10px"
      >
        <i :class="iconStyle + 'fa-coins'" size="22px" color="secondary" />
        <span ref="shopRef" class="text-weight-bold text-base sm:text-h5">
          {{ formatNumber(storeShop.points) }}
        </span>
      </div>
      <div
        v-if="storeData.currentTab === 'prestige'"
        class="flex items-center"
        style="background: rgba(255, 255, 255, 0.04); border-radius: 10px"
      >
        <i :class="iconStyle + 'fa-arrow-up-right-dots'" size="22px" color="secondary" />
        <span ref="prestigeRef" class="text-weight-bold text-base sm:text-h5">
          {{ formatNumber(storePrestige.points) }}
        </span>
      </div>
      <div
        v-if="storeData.currentTab === 'research'"
        class="flex items-center"
        style="background: rgba(255, 255, 255, 0.04); border-radius: 10px"
      >
        <i :class="iconStyle + 'fa-flask'" size="22px" color="secondary" />
        <span ref="researchRef" class="text-weight-bold text-base sm:text-h5">
          {{ formatNumber(storeResearch.points) }}
        </span>
      </div>
      <div
        v-if="storeData.currentTab === 'magic'"
        class="flex items-center"
        style="background: rgba(255, 255, 255, 0.04); border-radius: 10px"
      >
        <i :class="iconStyle + 'fa-droplet'" size="22px" color="secondary" />
        <span ref="magicRef" class="text-weight-bold text-base sm:text-h5">
          {{ formatNumber(storeMagic.points) }}
        </span>
      </div>
      <div
        v-if="storeData.currentTab === 'eternity'"
        class="flex items-center"
        style="background: rgba(255, 255, 255, 0.04); border-radius: 10px"
      >
        <i :class="iconStyle + 'fa-hourglass-end'" size="22px" color="secondary" />
        <span ref="eternityRef" class="text-weight-bold text-base sm:text-h5">
          {{ formatNumber(storeEternity.points) }}
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
        mobile-arrows
        shrink
      >
        <q-tab name="shop" :label="tabLabels.shop">
          <i :class="iconStyle + 'fa-store'" />
        </q-tab>
        <q-tab
          :class="{ 'cursor-not-allowed': stage < storeData.stageScientist }"
          name="research"
          :label="tabLabels.research"
        >
          <i
            :class="
              stage < storeData.stageScientist
                ? iconStyle + 'fa-circle-question'
                : iconStyle + 'fa-flask-vial'
            "
          />
        </q-tab>
        <q-tab
          :class="{ 'cursor-not-allowed': stage < storeData.stageAutomatic }"
          name="automatic"
          :label="tabLabels.automatic"
        >
          <i
            :class="
              stage < storeData.stageAutomatic
                ? iconStyle + 'fa-circle-question'
                : iconStyle + 'fa-microchip-ai'
            "
          />
        </q-tab>
        <q-tab
          :class="{ 'cursor-not-allowed': stage < storeData.stagePrestige }"
          name="prestige"
          :label="tabLabels.prestige"
        >
          <i
            :class="
              stage < storeData.stagePrestige
                ? iconStyle + 'fa-circle-question'
                : iconStyle + 'fa-arrow-up-right-dots'
            "
          />
        </q-tab>
        <q-tab
          :class="{ 'cursor-not-allowed': stage < storeData.stageEternity }"
          name="eternity"
          :label="tabLabels.eternity"
        >
          <i
            :class="
              stage < storeData.stageEternity
                ? iconStyle + 'fa-circle-question'
                : iconStyle + 'fa-hourglass-end'
            "
          />
        </q-tab>
        <q-tab
          :class="{ 'cursor-not-allowed': stage < storeData.stageEternity }"
          name="magic"
          :label="tabLabels.magic"
        >
          <i
            :class="
              stage < storeData.stageEternity
                ? iconStyle + 'fa-circle-question'
                : iconStyle + 'fa-hat-wizard'
            "
          />
        </q-tab>
        <q-tab
          :class="{ 'cursor-not-allowed': stage < storeData.stageInfinity }"
          name="infinity"
          :label="tabLabels.infinity"
        >
          <i
            :class="
              stage < storeData.stageInfinity
                ? iconStyle + 'fa-circle-question'
                : iconStyle + 'fa-infinity'
            "
          />
        </q-tab>
        <q-tab
          :class="{ 'cursor-not-allowed': stage < storeData.stageAchievement }"
          name="achievement"
          :label="tabLabels.achievement"
        >
          <i
            :class="
              stage < storeData.stageAchievement
                ? iconStyle + 'fa-circle-question'
                : iconStyle + 'fa-trophy-star'
            "
          />
        </q-tab>
        <q-tab name="lore" :label="tabLabels.lore">
          <i :class="iconStyle + 'fa-book-open'" />
        </q-tab>
        <q-tab name="cheat" :label="tabLabels.cheat">
          <i :class="iconStyle + 'fa-bug'" />
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
        <q-tab-panel name="eternity" class="panel-flex">
          <TabLayout
            :tabs="eternityTabs"
            v-model:active-tab="innerEternity"
            v-model:splitter-model="splitterModel"
            :is-mobile="isMobile"
          >
            <template #innerEternityOverview>
              <EternityOverview />
            </template>
            <template #innerEternityTechTreeShop>
              <EternityTechTree
                :items="
                  Object.entries(storeEternity.techTree.shop).map(([id, item]) => ({ ...item, id }))
                "
              />
            </template>
            <template #innerEternityTechTreePrestige>
              <EternityTechTree
                :items="
                  Object.entries(storeEternity.techTree.prestige).map(([id, item]) => ({
                    ...item,
                    id,
                  }))
                "
              />
            </template>
            <template #innerEternityTechTreeResearch>
              <EternityTechTree
                :items="
                  Object.entries(storeEternity.techTree.research).map(([id, item]) => ({
                    ...item,
                    id,
                  }))
                "
              />
            </template>
            <template #innerEternityTechTreeAutomatic>
              <EternityTechTree
                :items="
                  Object.entries(storeEternity.techTree.automatic).map(([id, item]) => ({
                    ...item,
                    id,
                  }))
                "
              />
            </template>
            <template #innerEternityTechTreeMagic>
              <EternityTechTree
                :items="
                  Object.entries(storeEternity.techTree.magic).map(([id, item]) => ({
                    ...item,
                    id,
                  }))
                "
              />
            </template>
          </TabLayout>
        </q-tab-panel>
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
            <template #innerMagicMana>
              <MagicMana />
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
        <q-tab-panel name="lore" class="panel-flex">
          <LorePage />
        </q-tab-panel>
        <q-tab-panel name="cheat" class="panel-flex">
          <CheatPage />
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
import { ref, computed, watch, onMounted, nextTick, onBeforeUnmount } from 'vue';
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
import MagicMana from 'src/components/magic/MagicMana.vue';
import Help from 'src/pages/HelpPage.vue';
import Achievement from 'src/pages/AchievementPage.vue';
import StatsPage from 'src/pages/StatsPage.vue';
import SettingPage from 'src/pages/SettingPage.vue';
import TabLayout from 'src/components/TabLayout.vue';
import EternityOverview from 'src/components/eternity/EternityOverview.vue';
import EternityTechTree from 'src/components/eternity/EternityTechTree.vue';
import CheatPage from 'src/pages/CheatPage.vue';
import LorePage from 'src/pages/LorePage.vue';
import Decimal from 'break_eternity.js';
import { animate } from 'animejs';
import { useStoreResearch } from 'stores/research';
import { useStoreShop } from 'stores/shop';
import { useStorePrestige } from 'stores/prestige';
import { useStoreSetting } from 'stores/setting';
import { useStoreMagic } from 'stores/magic';
import { useStoreEternity } from 'stores/eternity';

const storeData = useStoreData();
const storeResearch = useStoreResearch();
const storeShop = useStoreShop();
const storePrestige = useStorePrestige();
const storeSetting = useStoreSetting();
const storeMagic = useStoreMagic();
const storeEternity = useStoreEternity();

const iconStyle = computed(() => {
  return storeSetting.iconStyle;
});

const formatNumber = storeData.formatNumber;

const stage = computed(() => storeData.stage);

const tab = computed({
  get: () => storeData.currentTab,
  set: (val: string) => {
    if (stage.value < storeData.stageAchievement && val === 'achievement') {
      return;
    }
    if (stage.value < storeData.stageScientist && val === 'research') {
      return;
    }
    if (stage.value < storeData.stageAutomatic && val === 'automatic') {
      return;
    }
    if (stage.value < storeData.stagePrestige && val === 'prestige') {
      return;
    }
    if (stage.value < storeData.stageEternity && (val === 'eternity' || val === 'magic')) {
      return;
    }
    if (stage.value < storeData.stageInfinity && val === 'infinity') {
      return;
    }
    storeData.currentTab = val;
  },
});
const innerShop = ref('innerShopCPU');
const innerResearch = ref('innerResearchScientist');
const innerAutomatic = ref('innerAutomaticHelpersShop');
const innerPrestige = ref('innerPrestigeBase');
const innerMagic = ref('innerMagicBattle');
const innerEternity = ref('innerEternityOverview');
const splitterModel = ref(20);

const windowWidth = ref(window.innerWidth);
const onResize = () => {
  windowWidth.value = window.innerWidth;
};

const isMobile = computed(() => windowWidth.value < 700);

watch(isMobile, (val) => {
  splitterModel.value = val ? 0 : 20;
});

const epicRef = ref<HTMLElement | null>(null);
const shopRef = ref<HTMLElement | null>(null);
const prestigeRef = ref<HTMLElement | null>(null);
const researchRef = ref<HTMLElement | null>(null);
const magicRef = ref<HTMLElement | null>(null);

const eternityLabel = computed(() => {
  if (stage.value < storeData.stageEternity) {
    return isMobile.value ? '?' : '???';
  } else {
    return isMobile.value ? 'Ве' : 'Вечность';
  }
});

const researchLabel = computed(() => {
  if (stage.value < storeData.stageScientist) {
    return isMobile.value ? '?' : '???';
  } else {
    return isMobile.value ? 'Ис' : 'Исследования';
  }
});
const magicLabel = computed(() => {
  if (stage.value < storeData.stageEternity) {
    return isMobile.value ? '?' : '???';
  } else {
    return isMobile.value ? 'Ма' : 'Магия';
  }
});

const infinityLabel = computed(() => {
  if (stage.value < storeData.stageInfinity) {
    return isMobile.value ? '?' : '???';
  } else {
    return isMobile.value ? 'Бе' : 'Бесконечность';
  }
});

const automaticLabel = computed(() => {
  if (stage.value < storeData.stageAutomatic) {
    return isMobile.value ? '?' : '???';
  } else {
    return isMobile.value ? 'Ав' : 'Автоматизация';
  }
});

const prestigeLabel = computed(() => {
  if (stage.value < storeData.stagePrestige) {
    return isMobile.value ? '?' : '???';
  } else {
    return isMobile.value ? 'Пр' : 'Престиж';
  }
});
const achievementLabel = computed(() => {
  if (stage.value < storeData.stageAchievement) {
    return isMobile.value ? '?' : '???';
  } else {
    return isMobile.value ? 'До' : 'Достижения';
  }
});

const tabLabels = computed(() => ({
  shop: isMobile.value ? 'Ма' : 'Магазин',
  prestige: prestigeLabel.value,
  research: researchLabel.value,
  automatic: automaticLabel.value,
  eternity: eternityLabel.value,
  magic: magicLabel.value,
  infinity: infinityLabel.value,
  achievement: achievementLabel.value,
  lore: isMobile.value ? 'Сю' : 'Сюжет',
  cheat: isMobile.value ? 'Чи' : 'Читы',
  stats: isMobile.value ? 'Ст' : 'Статистика',
  help: isMobile.value ? 'По' : 'Помощь',
  setting: isMobile.value ? 'На' : 'Настройки',
}));

const innerShopLabels = computed(() => ({
  innerShopWorker: isMobile.value ? 'Рабо' : 'Работники',
}));

const innerPrestigeLabels = computed(() => ({
  innerPrestigeBase: isMobile.value ? 'Осно' : 'Основа',
  innerPrestigeUpgrade: isMobile.value ? 'Улуч' : 'Улучшения',
}));

const innerResearchBaseLabel = () => {
  if (stage.value < storeData.stageResearch) {
    return isMobile.value ? '?' : '???';
  } else {
    return isMobile.value ? 'Базо' : 'Базовые';
  }
};

const innerResearchLabels = computed(() => ({
  innerResearchScientist: isMobile.value ? 'Учён' : 'Учён.',
  innerResearchBase: innerResearchBaseLabel(),
}));

const innerAutomaticLabels = computed(() => ({
  innerAutomaticHelpersShop: isMobile.value ? 'Скуп' : 'Скупщики комплектующих',
}));

const innerMagicLabels = computed(() => ({
  innerMagicBattle: isMobile.value ? 'Битв' : 'Битва',
  innerMagicEssence: isMobile.value ? 'Эссе' : 'Эссенции',
  innerMagicCraft: isMobile.value ? 'Созд' : 'Создание',
}));

const innerEternityLabels = computed(() => ({
  innerEternityOverview: isMobile.value ? 'Обзо' : 'Обзор',
  innerEternityTechTreeShop: isMobile.value ? 'Мага' : 'Познание Магазина',
  innerEternityTechTreePrestige: isMobile.value ? 'Прес' : 'Познание Престижа',
  innerEternityTechTreeResearch: isMobile.value ? 'Исс' : 'Познание Исследований',
  innerEternityTechTreeAutomatic: isMobile.value ? 'Авто' : 'Познание Автоматизации',
  innerEternityTechTreeMagic: isMobile.value ? 'Маги' : 'Познание Магии',
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
    disabledIcon: iconStyle.value + 'fa-circle-question',
    label: innerResearchLabels.value.innerResearchBase,
    disabled: stage.value < storeData.stageResearch,
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
    name: 'innerMagicMana',
    icon: iconStyle.value + 'fa-droplet',
    label: 'Мана',
  },
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

const eternityTabs = computed(() => [
  {
    name: 'innerEternityOverview',
    icon: iconStyle.value + 'fa-eye',
    label: innerEternityLabels.value.innerEternityOverview,
  },
  {
    name: 'innerEternityTechTreeShop',
    icon: iconStyle.value + 'fa-store',
    label: innerEternityLabels.value.innerEternityTechTreeShop,
  },
  {
    name: 'innerEternityTechTreePrestige',
    icon: iconStyle.value + 'fa-arrow-up-from-dotted-line',
    label: innerEternityLabels.value.innerEternityTechTreePrestige,
  },
  {
    name: 'innerEternityTechTreeResearch',
    icon: iconStyle.value + 'fa-flask',
    label: innerEternityLabels.value.innerEternityTechTreeResearch,
  },
  {
    name: 'innerEternityTechTreeAutomatic',
    icon: iconStyle.value + 'fa-cart-shopping',
    label: innerEternityLabels.value.innerEternityTechTreeAutomatic,
  },
  {
    name: 'innerEternityTechTreeMagic',
    icon: iconStyle.value + 'fa-hat-wizard',
    label: innerEternityLabels.value.innerEternityTechTreeMagic,
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
watch(
  () => formatNumber(storeMagic.points),
  () => animateColorEl(magicRef.value),
);

onMounted(() => {
  window.addEventListener('resize', onResize);
  animateColorEl(epicRef.value);
  animateColorEl(shopRef.value);
  animateColorEl(prestigeRef.value);
  animateColorEl(researchRef.value);
  animateColorEl(magicRef.value);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
});

watch(
  () => storeData.currentTab,
  (tab) => {
    nextTick(() => {
      if (tab === 'shop') animateColorEl(shopRef.value, true);
      else if (tab === 'prestige') animateColorEl(prestigeRef.value, true);
      else if (tab === 'research') animateColorEl(researchRef.value, true);
      else if (tab === 'magic') animateColorEl(magicRef.value, true);
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

<style lang="scss">
.main-layout {
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  flex-direction: column;
}

.banner-row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
  margin-bottom: 5px;
}

.banner-row > div {
  margin: 3px;
  max-height: 30px;
  min-width: 100px;
  max-width: 200px;
  margin-left: 7px !important;
  margin-right: 7px !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-row > div > i,
span {
  margin-left: 4px !important;
  margin-right: 4px !important;
}

.main-card {
  flex: 1 1 auto;
  min-height: 0;
  min-width: 0;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background: transparent;
  box-shadow: none;
  padding: 0;
}

.panel-flex {
  flex: 1 1 auto;
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.footer {
  flex: 0 0 48px;
  min-height: 48px;
  max-height: 56px;
  width: 100vw;
  padding: 0;
  background: #23243a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.progress-bar {
  width: 300px;
  min-height: 18px;
  display: flex;
  align-items: center;
  position: relative;
}

.footer-progress {
  color: #fff;
  font-weight: bold;
  font-size: 18px;
  line-height: 1.2;
  white-space: nowrap;
  text-shadow:
    0 1px 4px #23243a,
    0 0 2px #23243a;
}

.q-tab i {
  font-size: 20px !important;
}

@media (max-width: 700px) {
  .banner-row {
    flex-wrap: wrap;
  }
  .banner-row > div {
    min-width: 80px;
    max-width: calc(50vw - 16px);
  }
  .main-layout {
    min-width: 100vw;
  }
  .main-card {
    width: 100vw;
    padding: 4px;
    box-shadow: none;
  }
  .panel-flex {
    padding: 4px;
  }
  .footer {
    min-height: 24px;
    max-height: 40px;
    padding: 4px;
    font-size: 12px !important;
  }
  .progress-bar {
    width: 170px;
    height: 30px;
    display: flex;
    align-items: center;
    position: relative;
  }
  .footer-label,
  .footer-progress {
    font-size: 16px;
    line-height: 1.2;
  }
  .q-tab__label,
  .q-tab-panel .q-tab__label {
    font-size: 12px !important;
    white-space: normal !important;
    word-break: break-word !important;
    max-width: none !important;
    text-align: center;
    padding: 0 2px;
  }
  .q-tab,
  .q-tab__content {
    align-items: center;
    justify-content: center;
    gap: 2px;
  }
  .q-tab__icon,
  .q-tab-panel .q-tab__icon {
    font-size: 18px !important;
    min-width: 0;
    padding: 0 2px;
  }
  .q-tab i {
    font-size: 18px !important;
    min-width: 0;
    padding: 0 2px;
  }
  .on-color-epic-number,
  .on-color-shop-points,
  .on-color-research-points {
    font-size: 15px !important;
  }
  i {
    font-size: 14px !important;
    min-width: 0;
    padding: 0 2px;
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
