<template>
  <div class="magic-essence">
    <div class="essences-grid">
      <div
        v-for="essence in essencesWithMeta"
        :key="essence.id"
        class="essence-item"
        :class="{ insufficient: essence.amount.lt(getRequiredEssence(essence.id)) }"
      >
        <div class="essence-icon">
          <i :class="iconStyle + essence.meta.icon" :style="{ color: essence.meta.color }"></i>
        </div>
        <div class="essence-amount">{{ formatNumber(essence.amount) }}</div>
        <div class="essence-name">{{ essence.meta.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStoreMagic } from 'stores/magic';
import { ESSENCE_META } from 'src/constants/magicMeta';
import { useStoreData } from 'stores/data';
import { useStoreSetting } from 'src/stores/setting';

const storeMagic = useStoreMagic();
const storeData = useStoreData();
const storeSetting = useStoreSetting();

const iconStyle = computed(() => {
  return storeSetting.iconStyle;
});

const formatNumber = storeData.formatNumber;

const essencesWithMeta = computed(() => {
  return storeMagic.essences.map((essence) => {
    const meta = ESSENCE_META.find((m) => m.id === essence.id);
    return {
      ...essence,
      meta: meta || { name: 'Неизвестно', icon: 'fa-question', color: '#666' },
    };
  });
});

const getRequiredEssence = (essenceId: string) => {
  return storeMagic.getRequiredEssence(essenceId);
};
</script>

<style scoped lang="scss">
.magic-essence {
  margin-bottom: 15px;
}

.essences-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
  margin-bottom: 15px;
}

.essence-item {
  background: linear-gradient(145deg, #a8afb6, #e6e6e6);
  border: 1px solid #dee2e6;
  border-radius: 10px;
  padding: 6px 4px;
  text-align: center;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  &.insufficient {
    border-color: #dc3545;
    background: linear-gradient(145deg, #f8d7da, #f1aeb5);
    box-shadow: 0 3px 6px rgba(220, 53, 69, 0.25);
  }
}

.essence-icon {
  font-size: 3rem;
  margin-bottom: 2px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.15));
}

.essence-amount {
  font-weight: bold;
  font-size: 1.2rem;
  color: #495057;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.5);
  margin-bottom: 2px;
}

.essence-name {
  font-size: 0.9rem;
  color: #6c757d;
  margin-top: 0px;
  font-weight: 600;
}

// Мобильная адаптация
@media (max-width: 768px) {
  .essences-grid {
    grid-template-columns: repeat(auto-fill, minmax(85px, 1fr));
    gap: 8px;
  }

  .essence-item {
    padding: 4px 3px;
    min-height: 85px;
  }

  .essence-icon {
    font-size: 2.4rem;
    margin-bottom: 1px;
  }

  .essence-amount {
    font-size: 1.05rem;
  }

  .essence-name {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .essences-grid {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 6px;
  }

  .essence-item {
    min-height: 75px;
  }

  .essence-icon {
    font-size: 2rem;
  }

  .essence-amount {
    font-size: 0.95rem;
  }

  .essence-name {
    font-size: 0.75rem;
  }
}
</style>
