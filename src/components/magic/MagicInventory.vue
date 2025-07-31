<template>
  <div class="magic-inventory">
    <!-- Эссенции -->
    <div class="essences-section">
      <h3 class="section-title">Эссенции</h3>
      <div class="essences-grid">
        <div
          v-for="essence in essences"
          :key="essence.id"
          class="essence-item"
          :class="{ insufficient: essence.amount < getRequiredEssence(essence.id) }"
        >
          <div class="essence-icon">
            <i :class="essence.icon" :style="{ color: essence.color }"></i>
          </div>
          <div class="essence-amount">{{ essence.amount }}</div>
          <div class="essence-name">{{ essence.name }}</div>
        </div>
      </div>
    </div>

    <!-- Инвентарь рун -->
    <div class="runes-section">
      <h3 class="section-title">Руны</h3>
      <div class="runes-grid">
        <div
          v-for="rune in runes"
          :key="rune.id"
          class="rune-slot"
          :class="{
            selected: selectedRune?.id === rune.id,
            owned: rune.level > 0,
            empty: rune.level === 0,
          }"
          @click="selectRune(rune)"
        >
          <div class="rune-icon">
            <i :class="rune.icon" :style="{ color: rune.color }"></i>
          </div>
          <div v-if="rune.level > 0" class="rune-level">{{ rune.level }}</div>
          <div class="rune-name">{{ rune.name }}</div>
        </div>
      </div>
    </div>

    <!-- Создание рун -->
    <div v-if="selectedRune" class="crafting-section">
      <div class="selected-rune-info">
        <div class="selected-rune-icon">
          <i :class="selectedRune.icon" :style="{ color: selectedRune.color }"></i>
        </div>
        <div class="selected-rune-details">
          <div class="rune-title">{{ selectedRune.name }}</div>
          <div class="rune-level-text">
            {{ selectedRune.level > 0 ? `Ур. ${selectedRune.level}` : 'Не создана' }}
          </div>
        </div>
        <q-btn
          :disable="!canCraftRune()"
          color="primary"
          @click="craftRune()"
          class="craft-button"
          size="sm"
        >
          {{ selectedRune.level > 0 ? 'Улучшить' : 'Создать' }}
        </q-btn>
      </div>

      <div class="requirements-grid">
        <div
          v-for="requirement in selectedRune.requirements"
          :key="requirement.essenceId"
          class="requirement-item"
          :class="{ insufficient: !canAffordRequirement(requirement) }"
        >
          <div class="requirement-icon">
            <i
              :class="getEssenceById(requirement.essenceId)?.icon"
              :style="{ color: getEssenceById(requirement.essenceId)?.color }"
            ></i>
          </div>
          <div class="requirement-amount">
            {{ getRequiredAmount(requirement) }}/{{
              getEssenceById(requirement.essenceId)?.amount || 0
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Essence {
  id: string;
  name: string;
  amount: number;
  icon: string;
  color: string;
}

interface RuneRequirement {
  essenceId: string;
  baseAmount: number;
  multiplier: number;
}

interface Rune {
  id: string;
  name: string;
  description: string;
  level: number;
  icon: string;
  color: string;
  requirements: RuneRequirement[];
}

const selectedRune = ref<Rune | null>(null);

// Эссенции
const essences = ref<Essence[]>([
  { id: 'fire', name: 'Огненная', amount: 50, icon: 'fas fa-fire', color: '#ff4444' },
  { id: 'water', name: 'Водная', amount: 30, icon: 'fas fa-droplet', color: '#4444ff' },
  { id: 'earth', name: 'Земляная', amount: 25, icon: 'fas fa-mountain', color: '#8b4513' },
  { id: 'air', name: 'Воздушная', amount: 40, icon: 'fas fa-wind', color: '#87ceeb' },
  { id: 'light', name: 'Световая', amount: 15, icon: 'fas fa-sun', color: '#ffff00' },
  { id: 'dark', name: 'Тёмная', amount: 20, icon: 'fas fa-moon', color: '#4b0082' },
  { id: 'arcane', name: 'Мистическая', amount: 10, icon: 'fas fa-star', color: '#9932cc' },
  { id: 'nature', name: 'Природная', amount: 35, icon: 'fas fa-leaf', color: '#228b22' },
  { id: 'ice', name: 'Ледяная', amount: 12, icon: 'fas fa-snowflake', color: '#00ffff' },
  { id: 'lightning', name: 'Молниевая', amount: 18, icon: 'fas fa-bolt', color: '#ffd700' },
  { id: 'blood', name: 'Кровавая', amount: 8, icon: 'fas fa-heart', color: '#dc143c' },
  { id: 'spirit', name: 'Духовная', amount: 6, icon: 'fas fa-ghost', color: '#dda0dd' },
  { id: 'chaos', name: 'Хаоса', amount: 4, icon: 'fas fa-explosion', color: '#8b0000' },
  { id: 'order', name: 'Порядка', amount: 5, icon: 'fas fa-balance-scale', color: '#000080' },
  { id: 'time', name: 'Времени', amount: 3, icon: 'fas fa-clock', color: '#ff8c00' },
  { id: 'space', name: 'Пространства', amount: 4, icon: 'fas fa-expand', color: '#663399' },
  { id: 'life', name: 'Жизни', amount: 15, icon: 'fas fa-seedling', color: '#32cd32' },
  { id: 'death', name: 'Смерти', amount: 7, icon: 'fas fa-skull-crossbones', color: '#2f4f4f' },
  { id: 'crystal', name: 'Кристальная', amount: 8, icon: 'fas fa-gem', color: '#48d1cc' },
  { id: 'metal', name: 'Металлическая', amount: 12, icon: 'fas fa-hammer', color: '#696969' },
  { id: 'poison', name: 'Ядовитая', amount: 9, icon: 'fas fa-flask-poison', color: '#adff2f' },
  { id: 'shadow', name: 'Теневая', amount: 11, icon: 'fas fa-mask', color: '#36454f' },
]);

// Руны
const runes = ref<Rune[]>([
  // Базовые руны (1-2 эссенции)
  {
    id: 'strength',
    name: 'Руна Силы',
    description: 'Увеличивает физическую мощь',
    level: 0,
    icon: 'fas fa-fist-raised',
    color: '#ff6b35',
    requirements: [
      { essenceId: 'fire', baseAmount: 10, multiplier: 1.5 },
      { essenceId: 'earth', baseAmount: 5, multiplier: 1.3 },
    ],
  },
  {
    id: 'wisdom',
    name: 'Руна Мудрости',
    description: 'Увеличивает магическую силу',
    level: 0,
    icon: 'fas fa-brain',
    color: '#4ecdc4',
    requirements: [
      { essenceId: 'arcane', baseAmount: 8, multiplier: 1.4 },
      { essenceId: 'light', baseAmount: 6, multiplier: 1.2 },
    ],
  },
  {
    id: 'speed',
    name: 'Руна Скорости',
    description: 'Увеличивает скорость действий',
    level: 0,
    icon: 'fas fa-running',
    color: '#45b7d1',
    requirements: [
      { essenceId: 'air', baseAmount: 12, multiplier: 1.6 },
      { essenceId: 'lightning', baseAmount: 4, multiplier: 1.8 },
    ],
  },
  {
    id: 'vitality',
    name: 'Руна Жизни',
    description: 'Увеличивает здоровье',
    level: 0,
    icon: 'fas fa-heart-pulse',
    color: '#27ae60',
    requirements: [{ essenceId: 'life', baseAmount: 8, multiplier: 1.4 }],
  },
  {
    id: 'protection',
    name: 'Руна Защиты',
    description: 'Увеличивает сопротивление',
    level: 0,
    icon: 'fas fa-shield-alt',
    color: '#8e44ad',
    requirements: [
      { essenceId: 'earth', baseAmount: 15, multiplier: 1.2 },
      { essenceId: 'metal', baseAmount: 8, multiplier: 1.3 },
    ],
  },
  {
    id: 'frost',
    name: 'Руна Мороза',
    description: 'Замедляет врагов',
    level: 0,
    icon: 'fas fa-icicles',
    color: '#3498db',
    requirements: [
      { essenceId: 'ice', baseAmount: 10, multiplier: 1.6 },
      { essenceId: 'water', baseAmount: 6, multiplier: 1.3 },
    ],
  },
  {
    id: 'poison',
    name: 'Руна Яда',
    description: 'Отравляет врагов',
    level: 0,
    icon: 'fas fa-biohazard',
    color: '#8fbc8f',
    requirements: [
      { essenceId: 'poison', baseAmount: 7, multiplier: 1.5 },
      { essenceId: 'nature', baseAmount: 5, multiplier: 1.2 },
    ],
  },
  {
    id: 'crystal',
    name: 'Руна Кристалла',
    description: 'Увеличивает точность',
    level: 0,
    icon: 'fas fa-gem',
    color: '#48d1cc',
    requirements: [{ essenceId: 'crystal', baseAmount: 6, multiplier: 1.4 }],
  },

  // Продвинутые руны (3 эссенции)
  {
    id: 'vampire',
    name: 'Руна Вампиризма',
    description: 'Восстанавливает здоровье от урона',
    level: 0,
    icon: 'fas fa-vampire-bite',
    color: '#722f37',
    requirements: [
      { essenceId: 'blood', baseAmount: 6, multiplier: 2.0 },
      { essenceId: 'dark', baseAmount: 8, multiplier: 1.5 },
      { essenceId: 'life', baseAmount: 4, multiplier: 1.3 },
    ],
  },
  {
    id: 'storm',
    name: 'Руна Бури',
    description: 'Призывает молнии и ветер',
    level: 0,
    icon: 'fas fa-cloud-bolt',
    color: '#1e90ff',
    requirements: [
      { essenceId: 'lightning', baseAmount: 8, multiplier: 1.6 },
      { essenceId: 'air', baseAmount: 10, multiplier: 1.4 },
      { essenceId: 'water', baseAmount: 6, multiplier: 1.2 },
    ],
  },
  {
    id: 'necromancy',
    name: 'Руна Некромантии',
    description: 'Воскрешает мертвых',
    level: 0,
    icon: 'fas fa-skull',
    color: '#2f4f4f',
    requirements: [
      { essenceId: 'death', baseAmount: 5, multiplier: 1.8 },
      { essenceId: 'dark', baseAmount: 7, multiplier: 1.5 },
      { essenceId: 'spirit', baseAmount: 4, multiplier: 1.6 },
    ],
  },
  {
    id: 'forge',
    name: 'Руна Кузнеца',
    description: 'Улучшает оружие и броню',
    level: 0,
    icon: 'fas fa-hammer',
    color: '#ff4500',
    requirements: [
      { essenceId: 'fire', baseAmount: 12, multiplier: 1.4 },
      { essenceId: 'metal', baseAmount: 10, multiplier: 1.3 },
      { essenceId: 'earth', baseAmount: 8, multiplier: 1.2 },
    ],
  },
  {
    id: 'healing',
    name: 'Руна Исцеления',
    description: 'Мощное восстановление здоровья',
    level: 0,
    icon: 'fas fa-heart-circle-plus',
    color: '#ff69b4',
    requirements: [
      { essenceId: 'life', baseAmount: 10, multiplier: 1.5 },
      { essenceId: 'light', baseAmount: 8, multiplier: 1.4 },
      { essenceId: 'nature', baseAmount: 12, multiplier: 1.3 },
    ],
  },

  // Эпические руны (4-5 эссенций)
  {
    id: 'elemental',
    name: 'Руна Стихий',
    description: 'Контролирует все элементы',
    level: 0,
    icon: 'fas fa-magic',
    color: '#ff6347',
    requirements: [
      { essenceId: 'fire', baseAmount: 8, multiplier: 1.3 },
      { essenceId: 'water', baseAmount: 8, multiplier: 1.3 },
      { essenceId: 'earth', baseAmount: 8, multiplier: 1.3 },
      { essenceId: 'air', baseAmount: 8, multiplier: 1.3 },
    ],
  },
  {
    id: 'chaos_order',
    name: 'Руна Равновесия',
    description: 'Баланс между хаосом и порядком',
    level: 0,
    icon: 'fas fa-yin-yang',
    color: '#800080',
    requirements: [
      { essenceId: 'chaos', baseAmount: 3, multiplier: 2.0 },
      { essenceId: 'order', baseAmount: 3, multiplier: 2.0 },
      { essenceId: 'light', baseAmount: 5, multiplier: 1.4 },
      { essenceId: 'dark', baseAmount: 5, multiplier: 1.4 },
    ],
  },
  {
    id: 'spacetime',
    name: 'Руна Пространства-Времени',
    description: 'Искажает реальность',
    level: 0,
    icon: 'fas fa-infinity',
    color: '#4b0082',
    requirements: [
      { essenceId: 'time', baseAmount: 2, multiplier: 2.5 },
      { essenceId: 'space', baseAmount: 3, multiplier: 2.0 },
      { essenceId: 'arcane', baseAmount: 6, multiplier: 1.5 },
      { essenceId: 'crystal', baseAmount: 4, multiplier: 1.6 },
    ],
  },
  {
    id: 'ultimate',
    name: 'Руна Превосходства',
    description: 'Высшая магическая сила',
    level: 0,
    icon: 'fas fa-crown',
    color: '#ffd700',
    requirements: [
      { essenceId: 'arcane', baseAmount: 10, multiplier: 1.8 },
      { essenceId: 'spirit', baseAmount: 5, multiplier: 2.0 },
      { essenceId: 'crystal', baseAmount: 6, multiplier: 1.7 },
      { essenceId: 'light', baseAmount: 8, multiplier: 1.5 },
      { essenceId: 'order', baseAmount: 3, multiplier: 2.2 },
    ],
  },
  {
    id: 'shadow_master',
    name: 'Руна Владыки Теней',
    description: 'Контроль над тьмой и тенями',
    level: 0,
    icon: 'fas fa-eye-evil',
    color: '#191970',
    requirements: [
      { essenceId: 'shadow', baseAmount: 8, multiplier: 1.6 },
      { essenceId: 'dark', baseAmount: 10, multiplier: 1.5 },
      { essenceId: 'death', baseAmount: 4, multiplier: 1.8 },
      { essenceId: 'chaos', baseAmount: 3, multiplier: 2.0 },
    ],
  },
]);

// Методы
const selectRune = (rune: Rune) => {
  selectedRune.value = rune;
};

const getEssenceById = (id: string) => {
  return essences.value.find((essence) => essence.id === id);
};

const getRequiredAmount = (requirement: RuneRequirement) => {
  if (!selectedRune.value) return 0;
  return Math.floor(
    requirement.baseAmount * Math.pow(requirement.multiplier, selectedRune.value.level),
  );
};

const getRequiredEssence = (essenceId: string) => {
  if (!selectedRune.value) return 0;
  const requirement = selectedRune.value.requirements.find((req) => req.essenceId === essenceId);
  return requirement ? getRequiredAmount(requirement) : 0;
};

const canAffordRequirement = (requirement: RuneRequirement) => {
  const essence = getEssenceById(requirement.essenceId);
  if (!essence) return false;
  return essence.amount >= getRequiredAmount(requirement);
};

const canCraftRune = () => {
  if (!selectedRune.value) return false;
  return selectedRune.value.requirements.every((requirement) => canAffordRequirement(requirement));
};

const craftRune = () => {
  if (!selectedRune.value || !canCraftRune()) return;

  // Тратим эссенции
  selectedRune.value.requirements.forEach((requirement) => {
    const essence = getEssenceById(requirement.essenceId);
    if (essence) {
      essence.amount -= getRequiredAmount(requirement);
    }
  });

  // Повышаем уровень руны
  selectedRune.value.level++;
};
</script>

<style scoped lang="scss">
.magic-inventory {
  padding: 10px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
  text-align: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
}

// Эссенции
.essences-section {
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

// Руны
.runes-section {
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
  transition: all 0.3s ease;
  min-height: 85px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      transparent 30%,
      rgba(255, 255, 255, 0.1) 50%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);

    &::before {
      opacity: 1;
    }
  }

  &.selected {
    border-color: #007bff;
    background: linear-gradient(145deg, #cfe2ff, #b6d4fe);
    box-shadow: 0 0 12px rgba(0, 123, 255, 0.4);

    &::before {
      background: linear-gradient(
        45deg,
        transparent 30%,
        rgba(0, 123, 255, 0.2) 50%,
        transparent 70%
      );
    }
  }

  &.owned {
    border-color: #28a745;
    background: linear-gradient(145deg, #d4edda, #c3e6cb);

    &::before {
      background: linear-gradient(
        45deg,
        transparent 30%,
        rgba(40, 167, 69, 0.1) 50%,
        transparent 70%
      );
    }
  }

  &.empty {
    opacity: 0.7;
    border-style: dashed;
    border-width: 1px;

    &:hover {
      opacity: 0.9;
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

// Создание рун
.crafting-section {
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  width: fit-content;
  min-width: 280px;
  max-width: 100%;
  margin: 0 auto;
}

.selected-rune-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 8px 10px;
  background: linear-gradient(145deg, #f1f3f4, #e8eaed);
  border-radius: 6px;
  gap: 10px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.selected-rune-icon {
  font-size: 1.6rem;
  flex-shrink: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.selected-rune-details {
  flex: 1;
  min-width: 0;
}

.rune-title {
  font-weight: bold;
  font-size: 0.9rem;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.5);
}

.rune-level-text {
  font-size: 0.75rem;
  color: #666;
  margin-top: 2px;
  font-style: italic;
}

.requirements-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
  margin-bottom: 8px;
}

.requirement-item {
  background: linear-gradient(145deg, #f8f9fa, #e9ecef);
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 6px 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  flex: 0 0 auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  }

  &.insufficient {
    border-color: #dc3545;
    background: linear-gradient(145deg, #f8d7da, #f1aeb5);
    box-shadow: 0 1px 3px rgba(220, 53, 69, 0.2);
  }
}

.requirement-icon {
  font-size: 1.1rem;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

.requirement-amount {
  font-weight: bold;
  color: #495057;
  font-size: 0.8rem;
  white-space: nowrap;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.5);
}

.craft-button {
  flex-shrink: 0;
  padding: 6px 16px;
  font-size: 0.85rem;
  font-weight: bold;
  border-radius: 16px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.6;
  }
}
</style>
