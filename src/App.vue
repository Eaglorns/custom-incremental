<template>
  <router-view />
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue';
import { useStoreGame } from 'src/stores/game';
import type { Research } from 'src/constants/models';
import Decimal from 'break_eternity.js';

const storeGame = useStoreGame();

const researchingKey = computed(() => storeGame.research.researchingKey);
const researchList = storeGame.research.list as Record<string, Research>;

const processResearch = () => {
  const key = researchingKey;
  if (key.value != '') {
    const research = researchList[key.value];
    if (research) {
      if (research.currentTime.gt(0)) {
        research.currentTime = research.currentTime.minus(1);
      }
      if (research.currentTime.lte(0)) {
        research.level = research.level.plus(1);
        storeGame.research.researchingKey = '';
      }
    }
  }
};

function processHelperType(count: Decimal, cost: Decimal, key: keyof typeof storeGame.shop) {
  if (count.lte(0)) return;
  const maxBuy = Decimal.min(count, storeGame.epicNumber.div(cost).floor());
  if (maxBuy.lte(0)) return;
  storeGame.shop[key].value = storeGame.shop[key].value.plus(maxBuy);
  storeGame.epicNumber = storeGame.epicNumber.minus(maxBuy.mul(cost));
}

function processHelpers() {
  const helpers = storeGame.helpers;
  const rand = Math.random() * 100;
  if (helpers.cpu.count.gt(0))
    if (storeGame.getHelperChance(helpers.cpu.percent).gte(rand)) {
      processHelperType(
        helpers.cpu.count.mul(storeGame.shop.cpu.multiply),
        storeGame.shop.cpu.cost.main,
        'cpu',
      );
    }
  if (helpers.hard.count.gt(0))
    if (storeGame.getHelperChance(helpers.hard.percent).gte(rand)) {
      processHelperType(
        helpers.hard.count.mul(storeGame.shop.hard.multiply),
        storeGame.shop.hard.cost.main,
        'hard',
      );
      storeGame.capacity = storeGame.capacity.plus(storeGame.shop.hard.multiply);
    }
  if (helpers.ram.count.gt(0))
    if (helpers.ram.count.gt(0))
      if (storeGame.getHelperChance(helpers.ram.percent).gte(rand)) {
        processHelperType(
          helpers.ram.count.mul(storeGame.shop.ram.multiply),
          storeGame.shop.ram.cost.main,
          'ram',
        );
      }
}

const giveEpicNumber = computed(() => {
  const parShopCPU = storeGame.shop.cpu.value;
  const parResearchCPU = storeGame.research.list.cpuPow;
  return parShopCPU.pow(parResearchCPU.bonus.mul(parResearchCPU.level).plus(1));
});

const giveCapacity = computed(() => {
  const parRAM = storeGame.shop.ram.value;
  const parResearchRam = storeGame.research.list.ramPow;
  return parRAM.pow(parResearchRam.bonus.mul(parResearchRam.level).plus(1));
});

const gameTick = () => {
  const now = Date.now();
  const delta = now - storeGame.lastTick;
  storeGame.lastTick = now;

  const steps = Math.floor(delta / storeGame.timer) || 1;
  for (let i = 0; i < steps; i++) {
    processResearch();
    processHelpers();
    storeGame.epicNumber = storeGame.epicNumber.plus(giveEpicNumber.value);
    storeGame.capacity = storeGame.capacity.plus(giveCapacity.value);

    if (storeGame.epicNumber.gt(storeGame.capacity)) {
      storeGame.epicNumber = storeGame.capacity;
    }
  }
};

let timerId: ReturnType<typeof setInterval> | null = null;
const autoSaveId = ref<ReturnType<typeof setInterval> | null>(null);

const startTimer = () => {
  if (timerId) clearInterval(timerId);
  storeGame.lastTick = Date.now();
  timerId = setInterval(() => gameTick(), storeGame.timer);
};

onMounted(() => {
  storeGame.loadGame();
  startTimer();
  autoSaveId.value = setInterval(() => {
    storeGame.saveGame();
  }, 1000);
});

watch(
  () => storeGame.timer,
  () => {
    startTimer();
  },
);

onBeforeUnmount(() => {
  if (timerId) clearInterval(timerId);
  if (autoSaveId.value) clearInterval(autoSaveId.value);
});
</script>
