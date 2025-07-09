<template>
  <div class="row q-gutter-md">
    <q-card
      v-for="scientist in scientists"
      :key="scientist.id"
      class="q-pa-md flex column items-center bg-blue-grey-9 text-white justify-between"
      style="
        width: 200px;
        min-height: 240px;
        height: 260px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      "
      flat
      bordered
    >
      <div
        style="
          position: relative;
          width: 100%;
          height: 32px;
          display: flex;
          justify-content: center;
          align-items: center;
        "
      >
        <div
          style="
            position: absolute;
            left: -10px;
            top: 50%;
            transform: translateY(-75%);
            display: flex;
            align-items: center;
          "
        >
          <q-icon name="fa-solid fa-brain" color="blue-4" size="14px" class="q-mr-xs" />
          <span class="text-bold" style="font-size: 11px">{{
            formatNumber(scientist.intellect)
          }}</span>
        </div>
        <div
          style="
            position: absolute;
            right: -10px;
            top: 50%;
            transform: translateY(-75%);
            display: flex;
            align-items: center;
          "
        >
          <span class="text-bold" style="font-size: 11px">{{
            formatNumber(scientist.efficiency)
          }}</span>
          <q-icon name="fa-solid fa-bolt" color="teal-5" size="14px" class="q-ml-xs" />
        </div>
      </div>
      <div
        style="
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 8px;
        "
      >
        <q-avatar size="56px" color="blue-grey-7">
          <q-icon name="fa-duotone fa-user-astronaut" size="40px" color="white" />
        </q-avatar>
      </div>
      <div class="text-h6 text-bold text-center q-mb-xs">
        {{ scientist.name }}
      </div>
      <div class="text-subtitle2 text-center q-mb-xs">
        Уровень: {{ formatNumber(scientist.level) }}
      </div>
      <q-linear-progress
        :value="scientist.exp.div(expToLevel(scientist.level)).toNumber()"
        color="primary"
        class="q-mb-xs"
        style="height: 8px"
      />
      <div style="width: 100%; display: flex; justify-content: center">
        <span
          style="
            font-size: 12px;
            background: rgba(255, 255, 255, 0.07);
            border-radius: 6px;
            padding: 2px 8px;
            margin-top: 2px;
            letter-spacing: 0.5px;
          "
        >
          {{ formatNumber(scientist.exp) }} / {{ formatNumber(expToLevel(scientist.level)) }}
        </span>
      </div>
    </q-card>
    <q-card
      class="q-pa-md flex column items-center bg-blue-grey-9 text-white justify-between q-hoverable"
      style="
        width: 200px;
        min-height: 240px;
        height: 260px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        border: 2px dashed var(--q-primary);
        cursor: pointer;
      "
      flat
      bordered
      @click="hireScientist"
    >
      <q-avatar size="56px" class="q-mb-sm" color="blue-grey-7">
        <q-icon name="fa-duotone fa-user-plus" size="40px" color="white" />
      </q-avatar>
      <div class="text-h6 text-bold text-center q-mb-xs">Нанять</div>
      <div class="text-subtitle2 text-center q-mb-xs">
        Стоимость: {{ formatNumber(hireCost) }} EP
      </div>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Decimal from 'break_eternity.js';
import { useStoreGame } from 'src/stores/game';

const storeGame = useStoreGame();
const formatNumber = storeGame.formatNumber;

interface Scientist {
  id: number;
  name: string;
  level: Decimal;
  exp: Decimal;
  intellect: Decimal;
  efficiency: Decimal;
}

const scientists = ref<Scientist[]>([]);

const base = new Decimal(1000);
const baseSoftCap = new Decimal(2);

const hireCost = computed(() => {
  const n = scientists.value.length;
  if (n === 0) return base;
  const dynamicSoftCap = baseSoftCap.mul(new Decimal(1.2).pow(Math.floor(n / 3)));
  return base.mul(dynamicSoftCap.pow(n * n * n));
});

function expToLevel(level: Decimal) {
  return level.pow(2).mul(100).plus(50);
}

function getScientistName(): string {
  return `Учёный #${scientists.value.length + 1}`;
}

function hireScientist() {
  const id = Date.now();
  scientists.value.push({
    id,
    name: getScientistName(),
    level: new Decimal(1),
    exp: new Decimal(0),
    intellect: new Decimal(1),
    efficiency: new Decimal(1),
  });
}

function randomUpgrade(scientist: Scientist) {
  const roll = Math.random();
  if (roll < 0.1) {
    if (Math.random() < 0.5) {
      scientist.intellect = scientist.intellect.add(Math.floor(2 + Math.random() * 9));
    } else {
      scientist.efficiency = scientist.efficiency.add(Math.floor(2 + Math.random() * 9));
    }
  } else if (roll < 0.2) {
    scientist.intellect = scientist.intellect.add(1);
    scientist.efficiency = scientist.efficiency.add(1);
  } else if (Math.random() < 0.5) {
    scientist.intellect = scientist.intellect.add(1);
  } else {
    scientist.efficiency = scientist.efficiency.add(1);
  }
}

let interval: number | undefined;
let researchInterval: number | undefined;
onMounted(() => {
  interval = window.setInterval(() => {
    scientists.value.forEach((s) => {
      if (Math.random() < 0.01) {
        randomUpgrade(s);
      }
    });
  }, 1);

  researchInterval = window.setInterval(() => {
    let totalResearch = new Decimal(0);
    scientists.value.forEach((s) => {
      s.exp = s.exp.add(s.intellect);
      if (s.exp.gte(expToLevel(s.level))) {
        s.exp = s.exp.sub(expToLevel(s.level));
        s.level = s.level.add(1);
      }
      totalResearch = totalResearch.add(s.level.add(1).mul(s.efficiency.div(100)));
    });
    storeGame.researchPoints = storeGame.researchPoints.add(totalResearch);
  }, 1000);
});
onUnmounted(() => {
  if (interval) clearInterval(interval);
  if (researchInterval) clearInterval(researchInterval);
});
</script>
