<template>
  <q-page class="q-pa-lg">
    <div class="q-mb-md text-h6 text-bold">Выполнено достижений: {{ totalAchievements }}</div>
    <div class="q-gutter-md" style="display: flex; flex-wrap: wrap; align-items: flex-start">
      <q-card
        v-for="ach in achievements"
        :key="ach.id"
        class="q-pa-sm q-mb-xs"
        :class="achievementCardClass(ach)"
        style="
          width: 140px;
          margin-right: 16px;
          margin-bottom: 16px;
          display: inline-block;
          vertical-align: top;
        "
        flat
        bordered
      >
        <div class="flex flex-center q-mb-xs">
          <q-icon :name="ach.icon" :color="iconColor(ach)" size="32px" />
        </div>
        <div class="text-subtitle2 text-center text-bold" :class="textColor(ach)">
          {{ ach.title }}
        </div>
        <div class="text-caption text-center" :class="textColor(ach, true)">
          {{ ach.description }}
        </div>
        <div v-if="ach.level !== undefined" class="text-center q-mt-xs">
          <q-badge :color="badgeColor(ach)" :text-color="badgeTextColor(ach)">
            Уровень: {{ ach.level }}
          </q-badge>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useStoreGame } from 'src/stores/game';

const storeGame = useStoreGame();

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  level?: number | undefined;
}

const maxLevels = ref<{ [key: string]: number }>({
  cpuLevel: 0,
  hardLevel: 0,
  ramLevel: 0,
});

function getLevel(current: number): number {
  if (current < 1) return 0;
  return Math.floor(Math.log10(current) / 2) + 1;
}

function updateMaxLevels() {
  const cpu = getLevel(storeGame.shop.cpu.value.toNumber());
  const hard = getLevel(storeGame.shop.hard.value.toNumber());
  const ram = getLevel(storeGame.shop.ram.value.toNumber());
  if (cpu > (maxLevels.value.cpuLevel ?? 0)) maxLevels.value.cpuLevel = cpu;
  if (hard > (maxLevels.value.hardLevel ?? 0)) maxLevels.value.hardLevel = hard;
  if (ram > (maxLevels.value.ramLevel ?? 0)) maxLevels.value.ramLevel = ram;
}

watch(
  () => [
    storeGame.shop.cpu.value.toNumber(),
    storeGame.shop.hard.value.toNumber(),
    storeGame.shop.ram.value.toNumber(),
  ],
  updateMaxLevels,
  { immediate: true },
);

const achievements = computed(() => [
  {
    id: 'firstEpic',
    title: 'Первое число',
    description: 'Получите тысячу единиц основной валюты',
    icon: 'fa-solid fa-1',
    color: 'primary',
    unlocked: storeGame.epicNumber.gte(1000),
    level: undefined,
  },
  {
    id: 'cpuLevel',
    title: 'Коллекционер CPU',
    description: 'Получайте новые уровни за всё большее количество CPU',
    icon: 'fa-duotone fa-microchip',
    color: 'teal',
    level: maxLevels.value.cpuLevel ?? 0,
    unlocked: (maxLevels.value.cpuLevel ?? 0) > 0,
  },
  {
    id: 'hardLevel',
    title: 'Коллекционер HDD',
    description: 'Получайте новые уровни за всё большее количество HDD',
    icon: 'fa-duotone fa-hard-drive',
    color: 'blue-grey',
    level: maxLevels.value.hardLevel ?? 0,
    unlocked: (maxLevels.value.hardLevel ?? 0) > 0,
  },
  {
    id: 'ramLevel',
    title: 'Коллекционер RAM',
    description: 'Получайте новые уровни за всё большее количество RAM',
    icon: 'fa-duotone fa-memory',
    color: 'deep-orange',
    level: maxLevels.value.ramLevel ?? 0,
    unlocked: (maxLevels.value.ramLevel ?? 0) > 0,
  },
  {
    id: 'helper1',
    title: 'Первый помощник',
    description: 'Нанять первого помощника любого типа',
    icon: 'fa-duotone fa-user-robot',
    color: 'amber',
    unlocked:
      storeGame.helpers.cpu.count.gte(1) ||
      storeGame.helpers.hard.count.gte(1) ||
      storeGame.helpers.ram.count.gte(1),
    level: undefined,
  },
  {
    id: 'research1',
    title: 'Учёный',
    description: 'Проведите первое исследование',
    icon: 'fa-duotone fa-flask',
    color: 'secondary',
    unlocked: Object.values(storeGame.research.list).some((r) => r.level.gte(1)),
    level: undefined,
  },
]);

function achievementCardClass(ach: Achievement) {
  if (ach.level !== undefined && ach.level > 0) return 'bg-primary';
  if (ach.unlocked) return 'bg-positive';
  return 'bg-grey-3';
}
function iconColor(ach: Achievement) {
  if (ach.level !== undefined && ach.level > 0) return 'white';
  if (ach.unlocked) return 'white';
  return 'grey-5';
}
function textColor(ach: Achievement, isDesc = false) {
  if (ach.level !== undefined && ach.level > 0) return 'text-white';
  if (ach.unlocked) return isDesc ? 'text-grey-4' : 'text-white';
  return isDesc ? 'text-grey-6' : 'text-grey-7';
}
function badgeColor(ach: Achievement) {
  if (ach.level !== undefined && ach.level > 0) return 'white';
  if (ach.unlocked) return ach.color || 'white';
  return 'grey-5';
}
function badgeTextColor(ach: Achievement) {
  if (ach.level !== undefined && ach.level > 0) return 'primary';
  if (ach.unlocked) return 'positive';
  return 'grey-7';
}

const totalAchievements = computed(() => {
  return achievements.value.reduce((sum, ach) => {
    if (ach.level !== undefined) {
      return sum + ach.level;
    }
    return sum + (ach.unlocked ? 1 : 0);
  }, 0);
});
</script>
