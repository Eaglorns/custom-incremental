<template>
  <router-view />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useStoreGame } from 'src/stores/game';
import { useStoreSaveLoad } from 'src/stores/saveLoad';

const storeGame = useStoreGame();
const storeSaveLoad = useStoreSaveLoad();

const gameTick = () => {
  storeGame.gameTick();
};

let timerId: ReturnType<typeof setInterval> | null = null;
const autoSaveId = ref<ReturnType<typeof setInterval> | null>(null);

const startTimer = () => {
  if (timerId) clearInterval(timerId);
  storeGame.lastTick = Date.now();
  timerId = setInterval(() => gameTick(), storeGame.timerTick);
};

onMounted(() => {
  storeSaveLoad.loadGame();
  startTimer();
  autoSaveId.value = setInterval(() => {
    storeSaveLoad.saveGame();
  }, storeSaveLoad.timerSave);
});

onBeforeUnmount(() => {
  if (timerId) clearInterval(timerId);
  if (autoSaveId.value) clearInterval(autoSaveId.value);
});
</script>
