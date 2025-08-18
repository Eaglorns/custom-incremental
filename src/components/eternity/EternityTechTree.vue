<template>
  <div class="eternity-column">
    <div class="grid" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)` }">
      <div v-for="item in items" :key="item.id" class="cell">
        <div class="cell-title">{{ item.title }}</div>
        <div class="cell-cost">Цена: {{ item.cost }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import Decimal from 'break_eternity.js';

type Item = {
  id: string;
  title: string;
  description: string;
  cost: Decimal;
  costMultiplier: Decimal;
  level: Decimal;
};

const props = defineProps<{
  items: Item[];
  cols?: number;
}>();

const cols = props.cols ?? 2;
</script>

<style scoped lang="scss">
.eternity-column {
  width: 100%;
}
.grid {
  display: grid;
  gap: 10px;
}
.cell {
  background: linear-gradient(180deg, #0e2230, #08121a);
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.03);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.cell-title {
  font-weight: 700;
}
.cell-cost {
  color: #bfcbd9;
  font-size: 0.95rem;
}
.cell-btn {
  margin-top: auto;
  background: linear-gradient(90deg, #ffb86b, #ff6bcb);
  border: none;
  padding: 6px 8px;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
}

@media (max-width: 1100px) {
  .grid {
    grid-template-columns: 1fr !important;
  }
}
</style>
