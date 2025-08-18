<template>
  <div class="eternity-column">
    <div class="grid">
      <button
        v-for="item in props.items"
        :key="item.id"
        class="cell"
        :class="{ clickable: canBuy(item) }"
        @click="buy(item)"
        :disabled="!canBuy(item)"
        @keydown.enter.prevent="buy(item)"
        @keydown.space.prevent="buy(item)"
        type="button"
      >
        <div class="cell-desc">{{ item.description }}</div>

        <div class="row small">
          <div class="cell-cost">
            <i class="fa-solid fa-hourglass-end" /> <span>{{ formatNumber(item.cost) }}</span>
          </div>
          <div class="cell-level">
            <i class="fa-solid fa-arrow-up-right-dots" />
            <strong>{{ formatNumber(item.level) }}</strong>
            <span v-if="item.maxLevel">/ {{ formatNumber(item.maxLevel) }}</span>
          </div>
        </div>

        <div class="cell-progress">
          <div class="bar" :style="{ width: progressWidth(item) }"></div>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type Decimal from 'break_eternity.js';
import { useStoreEternity } from 'stores/eternity';
import { useStoreData } from 'stores/data';

type Item = {
  id: string;
  description: string;
  cost: Decimal;
  baseCost?: Decimal;
  costMultiplier: Decimal;
  level: Decimal;
  maxLevel?: Decimal;
};

const props = defineProps<{
  items: Item[];
}>();

const storeEternity = useStoreEternity();
const storeData = useStoreData();

const formatNumber = storeData.formatNumber;

function hasEnough(item: Item) {
  return storeEternity.points.gte(item.cost);
}

function canBuy(item: Item) {
  if (isMaxed(item)) return false;
  return hasEnough(item);
}

function isMaxed(item: Item) {
  return item.maxLevel !== undefined && item.level.gte(item.maxLevel);
}

function buy(item: Item) {
  if (!canBuy(item)) return;
  storeEternity.points = storeEternity.points.minus(item.cost);
  item.level = item.level.plus(1);
  item.cost = item.cost.times(item.costMultiplier);
}

function progressWidth(item: Item) {
  if (!item.maxLevel || item.maxLevel.lte(0)) return '0%';
  const ratio = item.level.div(item.maxLevel).toNumber();
  const pct = Math.max(0, Math.min(1, ratio)) * 100;
  return pct + '%';
}
</script>

<style scoped lang="scss">
.eternity-column {
  width: 100%;
}
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  width: 100%;
}

@media (min-width: 700px) {
  .grid {
    grid-template-columns: repeat(auto-fit, 220px);
    gap: 12px;
    justify-content: center;
  }
}
.cell.clickable {
  cursor: pointer;
}
.cell.clickable:hover {
  background: rgba(255, 255, 255, 0.01);
}
.cell-desc {
  color: #cbd5e1;
  font-size: 0.78rem;
  line-height: 1.2;
  max-height: none;
  overflow: visible;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
}
.cell-level {
  color: #fff;
  font-size: 0.85rem;
  display: flex;
  gap: 6px;
  align-items: center;
}
.cell-progress {
  background: rgba(255, 255, 255, 0.03);
  height: 6px;
  border-radius: 6px;
  margin-top: 6px;
  overflow: hidden;
}
.cell-progress .bar {
  height: 100%;
  background: linear-gradient(90deg, #ffb86b, #ff6bcb);
  transition: width 240ms ease;
}
.cell {
  background: transparent;
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  align-self: stretch;
}

@media (min-width: 700px) {
  .cell {
    width: 220px;
  }
}
.cell-action-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.04);
  padding: 4px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.cell-action-btn[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.cell-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
}
.row.small {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
  font-size: 0.8rem;
  color: #cbd5e1;
}
.info-icon {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.95rem;
}
.cell-btn i {
  font-size: 14px;
}

.cell-action-btn i {
  font-size: 14px;
}

@media (max-width: 1100px) {
  .grid {
    column-gap: 8px;
  }
  .cell-desc {
    display: block;
  }
  .cell {
    padding: 8px 6px;
  }
  .cell-title {
    font-size: 0.98rem;
  }
}

@media (max-width: 480px) {
  .grid {
    gap: 6px;
  }
  .cell {
    padding: 6px;
  }
  .cell-title {
    font-size: 0.95rem;
  }
  .cell-cost,
  .cell-level {
    font-size: 0.78rem;
  }
  .cell-action-btn {
    padding: 3px;
  }
}
</style>
