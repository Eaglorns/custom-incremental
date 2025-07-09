<template>
  <div class="row q-gutter-md">
    <q-card
      v-for="scientist in storeGame.scientists"
      :key="scientist.id"
      class="q-pa-md flex column items-center bg-blue-grey-9 text-white justify-between"
      style="
        width: 200px;
        min-height: 200px;
        height: 220px;
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
          height: 20px;
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
      <div
        style="
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 4px;
        "
      >
        <q-icon name="fa-solid fa-medal" color="blue-grey-3" size="22px" class="q-mr-xs" />
        <span
          style="
            font-size: 22px;
            font-weight: bold;
            color: #fff;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            padding: 2px 14px;
            letter-spacing: 0.5px;
            box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.08);
          "
        >
          {{ formatNumber(scientist.level) }}
        </span>
      </div>
      <q-linear-progress
        :value="scientist.exp.div(expToLevel(scientist.level)).toNumber()"
        color="primary"
        class="q-mb-xs"
        style="height: 8px"
      />
      <div
        style="
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 2px;
        "
      >
        <q-icon name="fa-solid fa-circle-dot" color="deep-orange-4" size="15px" class="q-mr-xs" />
        <span
          style="
            font-size: 12px;
            background: rgba(255, 255, 255, 0.07);
            border-radius: 6px;
            padding: 2px 8px;
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
        min-height: 200px;
        height: 220px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        border: 2px dashed var(--q-primary);
        cursor: pointer;
        align-items: center;
        justify-content: flex-start;
      "
      flat
      bordered
      @click="hireScientist"
    >
      <q-avatar
        size="56px"
        class="q-mb-sm"
        color="blue-grey-7"
        style="margin-top: 24px; margin-bottom: 8px; display: flex; align-self: center"
      >
        <q-icon name="fa-duotone fa-user-plus" size="40px" color="white" />
      </q-avatar>
      <div style="flex: 1 1 auto"></div>
      <div
        class="text-subtitle2 text-center q-mb-xs"
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-bottom: 12px;
          margin-top: auto;
        "
      >
        <q-icon name="fa-solid fa-coins" color="amber-6" size="18px" />
        <span>{{ formatNumber(hireCost) }}</span>
      </div>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Decimal from 'break_eternity.js';
import { uuidv7 } from 'src/boot/uuid';
import { useStoreGame } from 'src/stores/game';

const storeGame = useStoreGame();
const formatNumber = storeGame.formatNumber;
const expToLevel = (...args: Parameters<typeof storeGame.expToLevel>) =>
  storeGame.expToLevel(...args);

const base = new Decimal(1000);
const baseSoftCap = new Decimal(2);

const hireCost = computed(() => {
  const n = storeGame.scientists.length;
  if (n === 0) return base;
  const dynamicSoftCap = baseSoftCap.mul(new Decimal(1.2).pow(Math.floor(n / 3)));
  return base.mul(dynamicSoftCap.pow(n * n * n));
});

function hireScientist() {
  const id = uuidv7();
  storeGame.scientists.push({
    id,
    level: new Decimal(1),
    exp: new Decimal(0),
    intellect: new Decimal(1),
    efficiency: new Decimal(1),
  });
}
</script>
