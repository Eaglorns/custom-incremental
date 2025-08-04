<template>
  <div class="magic-rune">
    <div class="runes-grid">
      <div
        v-for="rune in runesWithMeta"
        :key="rune.id"
        class="rune-slot"
        :class="{
          selected: storeMagic.selectedRune?.id === rune.id,
          owned: rune.level > 0,
          empty: rune.level === 0,
        }"
        @click="storeMagic.selectRune(rune)"
      >
        <div class="rune-icon">
          <i :class="rune.meta.icon" :style="{ color: rune.meta.color }"></i>
        </div>
        <div v-if="rune.level > 0" class="rune-level">{{ rune.level }}</div>
        <div class="rune-name">{{ rune.meta.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStoreMagic } from 'src/stores/magic';
import { RUNE_META } from 'src/constants/magicMeta';

const storeMagic = useStoreMagic();

const runesWithMeta = computed(() => {
  return storeMagic.runes.map((rune) => {
    const meta = RUNE_META.find((m) => m.id === rune.id);
    return {
      ...rune,
      meta: meta || {
        name: 'Неизвестная руна',
        icon: 'fas fa-question',
        color: '#666',
        description: '',
      },
    };
  });
});
</script>

<style scoped lang="scss">
.magic-rune {
  margin-bottom: 15px;
}

.runes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 8px;
}

.rune-slot {
  position: relative;
  background: linear-gradient(145deg, #f8f9fa, #e9ecef);
  border: 2px solid #dee2e6;
  border-radius: 10px;
  padding: 10px 6px;
  text-align: center;
  cursor: pointer;
  min-height: 85px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &.selected {
    border-color: #007bff;
    border-width: 3px;
    background: linear-gradient(145deg, #e7f1ff, #cfe2ff);
    box-shadow:
      0 0 20px rgba(0, 123, 255, 0.6),
      inset 0 0 10px rgba(0, 123, 255, 0.2);
    transform: translateY(-2px);

    .rune-icon {
      color: #007bff !important;
      filter: drop-shadow(0 2px 4px rgba(0, 123, 255, 0.3));
    }
  }

  &.owned {
    border-color: #28a745;
    border-width: 2px;
    background: linear-gradient(145deg, #e8f5e8, #d4edda);
    box-shadow: 0 4px 8px rgba(40, 167, 69, 0.2);

    .rune-icon {
      filter: drop-shadow(0 2px 4px rgba(40, 167, 69, 0.2));
    }

    &.selected {
      border-color: #007bff;
      border-width: 3px;
      background: linear-gradient(145deg, #e7f1ff, #cfe2ff);
      box-shadow:
        0 0 20px rgba(0, 123, 255, 0.6),
        inset 0 0 10px rgba(0, 123, 255, 0.2);

      .rune-icon {
        color: #007bff !important;
        filter: drop-shadow(0 2px 4px rgba(0, 123, 255, 0.3));
      }
    }
  }

  &.empty {
    opacity: 0.6;
    border-style: dashed;
    border-width: 2px;
    border-color: #adb5bd;
    background: linear-gradient(145deg, #f8f9fa, #e9ecef);

    &.selected {
      opacity: 1;
      border-style: solid;
      border-color: #007bff;
      border-width: 3px;
      background: linear-gradient(145deg, #e7f1ff, #cfe2ff);
      box-shadow:
        0 0 20px rgba(0, 123, 255, 0.6),
        inset 0 0 10px rgba(0, 123, 255, 0.2);
      transform: translateY(-2px);
    }
  }
}

.rune-icon {
  font-size: 1.9rem;
  margin-bottom: 4px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.rune-level {
  position: absolute;
  top: 4px;
  right: 4px;
  background: linear-gradient(145deg, #007bff, #0056b3);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
}

.rune-name {
  font-size: 0.7rem;
  font-weight: bold;
  color: #495057;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.5);
  line-height: 1.1;
}

// Мобильная адаптация
@media (max-width: 768px) {
  .runes-grid {
    grid-template-columns: repeat(auto-fill, minmax(75px, 1fr));
    gap: 6px;
  }

  .rune-slot {
    padding: 8px 4px;
    min-height: 70px;
  }

  .rune-icon {
    font-size: 1.5rem;
    margin-bottom: 3px;
  }

  .rune-level {
    width: 16px;
    height: 16px;
    font-size: 0.6rem;
    top: 3px;
    right: 3px;
  }

  .rune-name {
    font-size: 0.6rem;
  }
}

@media (max-width: 480px) {
  .runes-grid {
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    gap: 4px;
  }

  .rune-slot {
    padding: 6px 3px;
    min-height: 60px;
  }

  .rune-icon {
    font-size: 1.3rem;
  }

  .rune-level {
    width: 14px;
    height: 14px;
    font-size: 0.55rem;
  }

  .rune-name {
    font-size: 0.55rem;
  }
}
</style>
