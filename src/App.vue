<template>
  <router-view />
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { useStoreGame } from 'src/stores/game';

const storeGame = useStoreGame();

const gameTick = () => {
  storeGame.gameTick();
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
  }, 60000);
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
