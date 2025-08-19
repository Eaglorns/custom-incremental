<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch } from 'vue';
import { useStoreGame } from 'stores/game';
import { useStoreSaveLoad } from 'stores/saveLoad';
import { useStoreData } from 'stores/data';
import { useStoreEternity } from 'stores/eternity';
import { useStorePrestige } from 'stores/prestige';
import { useStoreResearch } from './stores/research';

const storeGame = useStoreGame();
const storeSaveLoad = useStoreSaveLoad();
const storeData = useStoreData();
const storeEternity = useStoreEternity();
const storePrestige = useStorePrestige();
const storeResearch = useStoreResearch();

let timerIdGameTick: ReturnType<typeof setInterval> | null = null;
let timerIdGameSave: ReturnType<typeof setInterval> | null = null;

const clearGameTickTimer = () => {
  if (timerIdGameTick) {
    clearInterval(timerIdGameTick);
    timerIdGameTick = null;
  }
};

const clearGameSaveTimer = () => {
  if (timerIdGameSave) {
    clearInterval(timerIdGameSave);
    timerIdGameSave = null;
  }
};

const startGameTickTimer = (resetLastTick = true) => {
  clearGameTickTimer();
  if (resetLastTick) storeGame.lastTick = Date.now();
  timerIdGameTick = setInterval(() => storeGame.gameTick(), storeGame.timerTick);
};

const startGameSaveTimer = () => {
  clearGameSaveTimer();
  timerIdGameSave = setInterval(() => storeSaveLoad.saveGame(), storeSaveLoad.timerSave);
};

const handleVisibilityChange = () => {
  if (document.hidden) {
    clearGameTickTimer();
    clearGameSaveTimer();
  } else {
    startGameTickTimer(false);
    startGameSaveTimer();
  }
};

const handleBeforeUnload = () => {
  try {
    //storeSaveLoad.saveGame();
  } catch (e) {
    console.debug('saveGame beforeunload error:', e);
  }
};

onMounted(() => {
  storeSaveLoad.loadGame();
  startGameTickTimer(true);
  startGameSaveTimer();

  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('beforeunload', handleBeforeUnload);
});

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  window.removeEventListener('beforeunload', handleBeforeUnload);
  clearGameTickTimer();
  clearGameSaveTimer();
});

watch(
  () => storeGame.timerTick,
  () => {
    if (!document.hidden) startGameTickTimer(false);
  },
);

watch(
  () => storeSaveLoad.timerSave,
  () => {
    if (!document.hidden) startGameSaveTimer();
  },
);

watch(
  () => storeData.epicNumber,
  () => {
    if (storeData.epicNumber.gte('1.8e308')) {
      storeEternity.reset();
      if (storeData.stage === storeData.stagePrestige) {
        storeData.stage = storeData.stageEternity;
      }
    }
    if (storeData.stage === storeData.stageZero) {
      if (storeData.epicNumber.gte(1000)) {
        storeData.stage = storeData.stageScientist;
      }
    }

    if (storeData.stage === storeData.stageResearch) {
      if (storeData.epicNumber.gte(5000)) {
        storeData.stage = storeData.stageAutomatic;
      }
    }
  },
);

watch(
  () => storeResearch.points,
  () => {
    if (storeData.stage === storeData.stageScientist) {
      if (storeResearch.points.gte(1000)) {
        storeData.stage = storeData.stageResearch;
      }
    }
  },
);

watch(
  () => storePrestige.points,
  () => {
    if (storeData.stage === storeData.stageAutomatic) {
      if (storePrestige.prestigeCan) {
        storeData.stage = storeData.stagePrestige;
      }
    }
  },
);
</script>
