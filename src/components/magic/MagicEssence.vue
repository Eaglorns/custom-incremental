<template>
  <div class="magic-essence">
    <div class="essences-grid">
      <div
        v-for="essence in essencesWithMeta"
        :key="essence.id"
        class="essence-item"
        :class="{ insufficient: essence.amount < getRequiredEssence(essence.id) }"
      >
        <div class="essence-icon">
          <i :class="essence.meta.icon" :style="{ color: essence.meta.color }"></i>
        </div>
        <div class="essence-amount">{{ essence.amount }}</div>
        <div class="essence-name">{{ essence.meta.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStoreMagic } from 'src/stores/magic';
import { ESSENCE_META } from 'src/constants/magicMeta';

const storeMagic = useStoreMagic();

const essencesWithMeta = computed(() => {
  return storeMagic.essences.map((essence) => {
    const meta = ESSENCE_META.find((m) => m.id === essence.id);
    return {
      ...essence,
      meta: meta || { name: 'Неизвестно', icon: 'fas fa-question', color: '#666' },
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
  grid-template-columns: repeat(auto-fill, minmax(75px, 1fr));
  gap: 6px;
  margin-bottom: 10px;
}

.essence-item {
  background: linear-gradient(145deg, #f8f9fa, #e9ecef);
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 8px 4px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);

    &::before {
      opacity: 1;
    }
  }

  &.insufficient {
    border-color: #dc3545;
    background: linear-gradient(145deg, #f8d7da, #f1aeb5);
    box-shadow: 0 2px 4px rgba(220, 53, 69, 0.2);

    &::before {
      background: linear-gradient(90deg, transparent, rgba(220, 53, 69, 0.6), transparent);
    }
  }
}

.essence-icon {
  font-size: 1.5rem;
  margin-bottom: 4px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
}

.essence-amount {
  font-weight: bold;
  font-size: 0.9rem;
  color: #495057;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.5);
}

.essence-name {
  font-size: 0.7rem;
  color: #6c757d;
  margin-top: 2px;
  font-weight: 500;
}

// Мобильная адаптация
@media (max-width: 768px) {
  .essences-grid {
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    gap: 4px;
  }

  .essence-item {
    padding: 6px 3px;
  }

  .essence-icon {
    font-size: 1.2rem;
    margin-bottom: 2px;
  }

  .essence-amount {
    font-size: 0.8rem;
  }

  .essence-name {
    font-size: 0.6rem;
  }
}

@media (max-width: 480px) {
  .essences-grid {
    grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
    gap: 3px;
  }

  .essence-icon {
    font-size: 1rem;
  }

  .essence-amount {
    font-size: 0.7rem;
  }

  .essence-name {
    font-size: 0.55rem;
  }
}
</style>
