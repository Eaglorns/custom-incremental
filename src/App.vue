<template>
  <router-view />
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue';
import { useStoreGame } from 'src/stores/game';
import type { Research } from 'src/constants/models';
import type Decimal from 'break_eternity.js';

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

function processHelperType(count: Decimal, cost: Decimal, value: Decimal) {
  if (count.gt(0)) {
    const countValue = count.toNumber();
    for (let i = 0; i < countValue; i++) {
      value = value.plus(1);
      storeGame.epicNumber = storeGame.epicNumber.minus(cost);
    }
  }
}

function processHelpers() {
  const helpers = storeGame.helpers;
  if (helpers.cpu.chance.gte(Math.random() * 100)) {
    processHelperType(helpers.cpu.count, storeGame.shop.cpu.cost.main, storeGame.shop.cpu.value);
  }
  if (helpers.hdd.chance.gte(Math.random() * 100)) {
    processHelperType(helpers.hdd.count, storeGame.shop.hard.cost.main, storeGame.shop.hard.value);
  }
  if (helpers.ram.chance.gte(Math.random() * 100)) {
    processHelperType(helpers.ram.count, storeGame.shop.ram.cost.main, storeGame.shop.ram.value);
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
