<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { useStoreGame } from 'stores/game';
import { useStoreSaveLoad } from 'stores/saveLoad';
import { useStoreSetting } from 'src/stores/setting';

const storeGame = useStoreGame();
const storeSaveLoad = useStoreSaveLoad();
const storeSetting = useStoreSetting();

let timerIdGameTick: ReturnType<typeof setInterval> | null = null;
let timerIdGameSave: ReturnType<typeof setInterval> | null = null;

const startGameTickTimer = () => {
  if (timerIdGameTick) clearInterval(timerIdGameTick);
  storeGame.lastTick = Date.now();
  timerIdGameTick = setInterval(() => storeGame.gameTick(), storeGame.timerTick);
};

const startGameSaveTimer = () => {
  if (timerIdGameSave) clearInterval(timerIdGameSave);
  timerIdGameSave = setInterval(() => storeSaveLoad.saveGame(), storeSaveLoad.timerSave);
};

storeSetting.preload();

onMounted(() => {
  storeSaveLoad.loadGame();
  startGameTickTimer();
  startGameSaveTimer();
});

onBeforeUnmount(() => {
  if (timerIdGameTick) clearInterval(timerIdGameTick);
  if (timerIdGameSave) clearInterval(timerIdGameSave);
});
</script>
