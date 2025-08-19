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
import { useStoreResearch } from 'stores/research';
import { showLoreDialog } from 'src/utils/showLoreDialog';
import { lore } from 'src/constants/loreMeta';
import { useStoreAchievement } from 'stores/achievement';

const storeGame = useStoreGame();
const storeSaveLoad = useStoreSaveLoad();
const storeData = useStoreData();
const storeEternity = useStoreEternity();
const storePrestige = useStorePrestige();
const storeResearch = useStoreResearch();
const storeAchievement = useStoreAchievement();

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

onMounted(() => {
  storeSaveLoad.loadGame();
  startGameTickTimer(true);
  startGameSaveTimer();

  document.addEventListener('visibilitychange', handleVisibilityChange);
});

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange);
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

function handleStageZero() {
  if (storeData.epicNumber.lte(1) && storeData.stage === storeData.stageZero) {
    showLoreDialog(lore.stageZero);
  }
  if (storeData.stage === storeData.stageZero && storeAchievement.achievementBonus.gte(1.04)) {
    showLoreDialog(lore.stageAchievement);
    storeData.stage = storeData.stageAchievement;
  }
}

function handleStageAchievement() {
  if (storeData.stage === storeData.stageAchievement && storeData.epicNumber.gte(1000)) {
    showLoreDialog(lore.stageScientist);
    storeData.stage = storeData.stageScientist;
  }
}

function handleStageResearch() {
  if (storeData.stage === storeData.stageResearch && storeData.epicNumber.gte(5000)) {
    showLoreDialog(lore.stageAutomatic);
    storeData.stage = storeData.stageAutomatic;
  }
}

function handleStageAutomatic() {
  if (storeData.stage === storeData.stageAutomatic && storePrestige.prestigeCan) {
    showLoreDialog(lore.stagePrestige);
    storeData.stage = storeData.stagePrestige;
  }
}

function handleEternity() {
  if (storeData.epicNumber.gte('1.8e308')) {
    storeEternity.reset();
    if (storeData.stage === storeData.stagePrestige) {
      storeData.stage = storeData.stageEternity;
      showLoreDialog(lore.stageEternity);
    }
  }
}

watch(
  () => storeData.epicNumber,
  () => {
    handleStageZero();
    handleEternity();
    handleStageAchievement();
    handleStageResearch();
    handleStageAutomatic();
  },
);

watch(
  () => storeResearch.points,
  () => {
    if (storeData.stage === storeData.stageScientist) {
      if (storeResearch.points.gte(1000)) {
        showLoreDialog(lore.stageResearch);
        storeData.stage = storeData.stageResearch;
      }
    }
  },
);
</script>
