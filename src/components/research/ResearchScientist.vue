<template>
  <div class="row q-gutter-md">
    <q-card
      v-for="sv in scientistsView"
      :key="sv.id"
      class="q-pa-md flex column items-center bg-blue-grey-9 text-white justify-between"
      style="width: 230px; height: 220px"
      flat
      bordered
    >
      <div class="scientist-header-row">
        <div class="scientist-header-left">
          <i :class="iconStyle + 'fa-brain'" color="blue-4" size="18px" class="q-mr-xs" />
          <span class="text-bold scientist-intellect-value">{{ sv.intellectStr }}</span>
        </div>
        <div class="scientist-header-right">
          <span class="text-bold scientist-efficiency-value">{{ sv.efficiencyStr }}</span>
          <i :class="iconStyle + 'fa-bolt'" color="teal-5" size="18px" class="q-ml-xs" />
        </div>
      </div>
      <div class="scientist-avatar-row">
        <q-avatar size="56px" color="blue-grey-7">
          <i :class="iconStyle + 'fa-user-astronaut'" size="40px" color="white" />
        </q-avatar>
      </div>
      <div class="scientist-level-row">
        <i :class="iconStyle + 'fa-medal'" color="blue-grey-3" size="22px" class="q-mr-xs" />
        <span class="scientist-level-value scientist-level-gold">{{ sv.levelStr }}</span>
      </div>
      <q-linear-progress :value="sv.progress" color="primary" class="q-mb-xs" style="height: 8px" />
      <div class="scientist-exp-row">
        <i :class="iconStyle + 'fa-circle-dot'" color="deep-orange-4" size="18px" class="q-mr-xs" />
        <span class="scientist-exp-value scientist-exp-orange">{{ sv.expStr }}</span>
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
      <q-avatar size="56px" class="q-mb-sm scientist-hire-avatar" color="blue-grey-7">
        <i :class="iconStyle + 'fa-user-plus'" size="40px" color="white" />
      </q-avatar>
      <div style="flex: 1 1 auto"></div>
      <div class="text-subtitle2 text-center q-mb-xs scientist-hire-cost-row">
        <i :class="iconStyle + 'fa-gauge-high'" color="amber-6" size="18px" />
        <span>{{ formatNumber(hireCost) }}</span>
      </div>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Decimal from 'break_eternity.js';
import { v7 as uuidv7 } from 'uuid';
import { useStoreData } from 'stores/data';
import { useStoreResearch } from 'stores/research';
import { useStoreSetting } from 'stores/setting';

const storeData = useStoreData();
const storeResearch = useStoreResearch();
const storeSetting = useStoreSetting();

const iconStyle = computed(() => {
  return storeSetting.iconStyle;
});

const formatNumber = storeData.formatNumber;

const expToLevel = (...args: Parameters<typeof storeResearch.expToLevel>) =>
  storeResearch.expToLevel(...args);

const base = new Decimal(1000);
const baseSoftCap = new Decimal(2);

const hireCost = computed(() => {
  const n = storeResearch.scientists.length;
  if (n === 0) return base;
  const dynamicSoftCap = baseSoftCap.mul(new Decimal(1.2).pow(Math.floor(n / 3)));
  return base.mul(dynamicSoftCap.pow(n * n * n));
});

const scientistsView = computed(() => {
  return storeResearch.scientists.map((s) => {
    const expNeeded = expToLevel(s.level);
    const progress = expNeeded.gt(0) ? s.exp.div(expNeeded).toNumber() : 0;
    return {
      id: s.id,
      intellectStr: formatNumber(s.intellect),
      efficiencyStr: formatNumber(s.efficiency),
      levelStr: formatNumber(s.level),
      expStr: formatNumber(s.exp),
      progress,
    };
  });
});

function hireScientist() {
  const epicNumber = storeData.epicNumber;
  const cost = hireCost.value;
  if (epicNumber.gte(cost)) {
    storeData.epicNumber = epicNumber.minus(cost);
    const id = uuidv7();
    storeResearch.scientists.push({
      id,
      level: new Decimal(1),
      exp: new Decimal(0),
      intellect: new Decimal(0),
      efficiency: new Decimal(0),
    });
  }
}
</script>
<style lang="scss" scoped>
.scientist-header-row {
  position: relative;
  width: 100%;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.scientist-header-left {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-75%);
  display: flex;
  align-items: center;
}

.scientist-header-right {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-75%);
  display: flex;
  align-items: center;
}

.scientist-avatar-row {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
}

.scientist-level-row {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 4px;
}

.scientist-level-value {
  font-size: 22px;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 2px 14px;
  letter-spacing: 0.5px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.08);
}
.scientist-level-gold {
  color: #ffd700;
  text-shadow:
    0 0 1.5px #fffbe6,
    0 0 0.5px #ffd700;
}
.scientist-intellect-value {
  color: #42a5f5;
  font-size: 11px;
  text-shadow: 0 0 2px #42a5f5cc;
}
.scientist-efficiency-value {
  color: #26c6da;
  font-size: 11px;
  text-shadow: 0 0 2px #26c6dacc;
}
.scientist-exp-orange {
  color: #ff9800;
  text-shadow: 0 0 2px #ff9800cc;
}

.scientist-exp-row {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2px;
}

.scientist-exp-value {
  font-size: 12px;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 6px;
  padding: 2px 8px;
  letter-spacing: 0.5px;
}

.scientist-hire-avatar {
  margin-top: 24px;
  margin-bottom: 8px;
  display: flex;
  align-self: center;
}

.scientist-hire-cost-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 12px;
  margin-top: auto;
}

@media (max-width: 700px) {
  .row.q-gutter-md {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 4px !important;
  }
  .row.q-gutter-md .q-card {
    min-width: 0 !important;
    max-width: 100% !important;
    width: 95% !important;
    min-height: 120px !important;
    height: 140px !important;
    padding: 2px !important;
    font-size: 11px !important;
  }
  .row.q-gutter-md .q-card .q-avatar {
    width: 28px !important;
    height: 28px !important;
  }
  .row.q-gutter-md .q-card .text-bold,
  .row.q-gutter-md .q-card .text-subtitle2,
  .row.q-gutter-md .q-card span {
    font-size: 10px !important;
  }
  .row.q-gutter-md .q-card i {
    font-size: 10px !important;
  }
  .row.q-gutter-md .q-card .q-linear-progress {
    height: 4px !important;
  }
  .row.q-gutter-md .text-center {
    font-size: 10px !important;
  }
  .row.q-gutter-md .text-subtitle2 {
    gap: 2px !important;
  }
  .row.q-gutter-md .q-mb-xs,
  .row.q-gutter-md .q-mb-sm {
    margin-bottom: 2px !important;
  }
  .row.q-gutter-md .q-mb-md {
    margin-bottom: 3px !important;
  }
}
</style>
