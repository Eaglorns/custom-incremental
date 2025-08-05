<template>
  <div class="battle-panel">
    <div class="battle-area">
      <div class="battle-grid">
        <div class="monster-card">
          <div class="monster-header">
            <div class="monster-avatar">
              <i :class="monsterIcon" :style="{ color: monsterIconColor }"></i>
            </div>
            <div class="monster-info">
              <h6 class="monster-name">{{ monsterName }}</h6>
              <div class="monster-level">Уровень {{ monsterLevel }}</div>
              <div class="monster-stats">
                <span class="stat-armor">
                  <i class="fas fa-shield" style="color: #94a3b8"></i>
                  {{ formatNumber(effectiveArmor) }}
                </span>
                <span class="stat-regen">
                  <i class="fas fa-heart" style="color: #22c55e"></i>
                  {{ formatNumber(effectiveRegeneration) }}
                </span>
              </div>
            </div>
          </div>

          <div class="monster-health">
            <div class="health-label">Здоровье</div>
            <div class="health-bar">
              <div class="health-fill" :style="{ width: healthPercentage + '%' }"></div>
              <div class="health-text">
                {{ formatNumber(monsterCurrentHealth) }} -> {{ formatNumber(monsterMaxHealth) }}
              </div>
            </div>
          </div>

          <div class="damage-effects" v-if="damageEffects.length > 0">
            <div class="effects-label">Активные эффекты:</div>
            <div class="effects-list">
              <div
                v-for="(effect, index) in damageEffects"
                :key="`${monsterId}-effect-${index}`"
                class="effect-item"
                :title="`${damageTypes.find((dt) => dt.type === effect.type)?.name} (${effect.stacks} стаков)`"
              >
                <i
                  :class="damageTypes.find((dt) => dt.type === effect.type)?.icon"
                  :style="{ color: damageTypes.find((dt) => dt.type === effect.type)?.color }"
                ></i>
                <span class="effect-stacks" v-if="effect.stacks.gt(1)">{{ effect.stacks }}</span>
              </div>
            </div>
          </div>

          <div class="essence-rewards">
            <div class="rewards-label">Награды (Руны):</div>
            <div class="rewards-list">
              <div
                v-for="(reward, index) in rewards"
                :key="`${monsterId}-${index}`"
                class="reward-item"
                :title="reward.name"
              >
                <i :class="reward.icon" :style="{ color: reward.color }"></i>
                <span>{{ reward.amount }}</span>
              </div>
            </div>
          </div>

          <div class="monster-actions">
            <q-btn
              color="negative"
              label="Сменить цель"
              icon="fas fa-refresh"
              size="sm"
              class="action-btn"
              unelevated
              @click="changeTarget"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { RUNE_META } from 'src/constants/magicMeta';
import Decimal from 'break_eternity.js';
import { useStoreData } from 'stores/data';

const storeData = useStoreData();
const formatNumber = storeData.formatNumber;

const monsterName = ref('');
const monsterLevel = ref(new Decimal(1));
const monsterIcon = ref('');
const monsterIconColor = ref('');
const monsterCurrentHealth = ref(new Decimal(0));
const monsterMaxHealth = ref(new Decimal(0));
const monsterArmor = ref(new Decimal(0));
const monsterRegeneration = ref(new Decimal(0));
const monsterId = ref(0);

const rewards = ref<
  Array<{ id: string; name: string; icon: string; color: string; amount: number }>
>([]);

interface DamageEffect {
  type: 'poison' | 'bleeding' | 'curse' | 'burn' | 'weakness' | 'corrosion';
  stacks: Decimal;
}

const damageEffects = ref<DamageEffect[]>([]);
const damageTypes = [
  {
    type: 'poison' as const,
    name: 'Яд',
    icon: 'fas fa-biohazard',
    color: '#8fbc8f',
  },
  {
    type: 'bleeding' as const,
    name: 'Кровотечение',
    icon: 'fas fa-heart-crack',
    color: '#8b0000',
  },
  {
    type: 'curse' as const,
    name: 'Проклятие',
    icon: 'fas fa-skull-crossbones',
    color: '#9333ea',
  },
  {
    type: 'burn' as const,
    name: 'Горение',
    icon: 'fas fa-fire-flame-curved',
    color: '#ff6600',
  },
  {
    type: 'weakness' as const,
    name: 'Слабость',
    icon: 'fas fa-heart-broken',
    color: '#6b7280',
  },
  {
    type: 'corrosion' as const,
    name: 'Коррозия',
    icon: 'fas fa-shield-virus',
    color: '#84cc16',
  },
];

const generateRandomMonster = () => {
  const prefix = monsterPrefixes[Math.floor(Math.random() * monsterPrefixes.length)];
  const base = monsterBases[Math.floor(Math.random() * monsterBases.length)];
  const suffix =
    Math.random() * 100 > 95
      ? monsterSuffixes[Math.floor(Math.random() * monsterSuffixes.length)]
      : null;
  const icon = monsterIcons[Math.floor(Math.random() * monsterIcons.length)];
  const color = monsterColors[Math.floor(Math.random() * monsterColors.length)];

  let name = `${prefix} ${base}`;
  if (suffix) {
    name += ` ${suffix.name}`;
  }

  return {
    name,
    icon,
    color,
    suffix: suffix || null,
  };
};

let battleInterval: NodeJS.Timeout | null = null;

const healthPercentage = computed(() =>
  monsterMaxHealth.value.gt(0)
    ? monsterCurrentHealth.value.div(monsterMaxHealth.value).mul(100)
    : new Decimal(0),
);

const effectiveArmor = computed(() => {
  const corrosionEffect = damageEffects.value.find((effect) => effect.type === 'corrosion');
  if (corrosionEffect && corrosionEffect.stacks.gt(0)) {
    return monsterArmor.value.div(corrosionEffect.stacks.sqrt());
  }
  return monsterArmor.value;
});

const effectiveRegeneration = computed(() => {
  const weaknessEffect = damageEffects.value.find((effect) => effect.type === 'weakness');
  if (weaknessEffect && weaknessEffect.stacks.gt(0)) {
    return Decimal.max(0, monsterRegeneration.value.div(weaknessEffect.stacks.sqrt()));
  }
  return monsterRegeneration.value;
});

const generateMonster = () => {
  const monster = generateRandomMonster();
  monsterName.value = monster.name;
  monsterIcon.value = monster.icon || 'fas fa-question';
  monsterIconColor.value = monster.color || '#ffffff';
  monsterLevel.value = new Decimal(Math.floor(Math.random() * 10) + 1);

  // Базовые характеристики
  let baseHealth = new Decimal(monsterLevel.value.mul(50).mul(15).plus(100));
  let baseArmor = new Decimal(monsterLevel.value.mul(2)).plus(Math.random() * 10);
  let baseRegen = new Decimal(monsterLevel.value.mul(1.5)).plus(Math.random() * 15);

  // Применяем бонусы от суффикса
  if (monster.suffix) {
    baseHealth = baseHealth.mul(monster.suffix.healthMult);
    baseArmor = baseArmor.mul(monster.suffix.armorMult);
    baseRegen = baseRegen.mul(monster.suffix.regenMult);
  }

  monsterMaxHealth.value = baseHealth;
  monsterCurrentHealth.value = baseHealth;
  monsterArmor.value = baseArmor;
  monsterRegeneration.value = baseRegen;

  monsterId.value++;
  damageEffects.value = [];
  generateRewards();
};

const generateRewards = () => {
  const rewardCount = 1;
  const availableRunes = [...RUNE_META];
  rewards.value = [];

  for (let i = 0; i < rewardCount && availableRunes.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availableRunes.length);
    const rune = availableRunes.splice(randomIndex, 1)[0];

    rewards.value.push({
      id: rune?.id || `rune-${Math.random() * 1000}`,
      name: rune?.name || 'Неизвестная руна',
      icon: rune?.icon || 'fas fa-question',
      color: rune?.color || '#ffffff',
      amount: 1,
    });
  }
};

const applyDamageEffect = (type: DamageEffect['type']) => {
  const damageType = damageTypes.find((dt) => dt.type === type);
  if (!damageType) return;

  const existingEffect = damageEffects.value.find((effect) => effect.type === type);
  if (existingEffect) {
    existingEffect.stacks = existingEffect.stacks.plus(15);
  } else {
    damageEffects.value.push({
      type,
      stacks: new Decimal(15),
    });
  }
};

const processDamageEffects = () => {
  damageEffects.value.forEach((effect) => {
    if (monsterCurrentHealth.value.lte(0)) return;

    if (effect.type === 'weakness' || effect.type === 'corrosion') {
      return;
    }

    const armorReducedDamage = effect.stacks.minus(effectiveArmor.value);

    let bonusDamage = new Decimal(0);
    if (effectiveArmor.value.lt(0)) {
      bonusDamage = effectiveArmor.value.abs().sqrt();
    }

    const finalDamage = armorReducedDamage.plus(bonusDamage);

    if (effect.type === 'curse') {
      if (monsterCurrentHealth.value.lte(finalDamage)) {
        monsterCurrentHealth.value = new Decimal(0);
        onMonsterDefeated();
        return;
      }
    }

    if (finalDamage.gt(0)) {
      monsterCurrentHealth.value = Decimal.max(0, monsterCurrentHealth.value.minus(finalDamage));
    }
  });

  if (monsterCurrentHealth.value.lte(0)) {
    onMonsterDefeated();
  }
};

const dealDamage = () => {
  if (monsterCurrentHealth.value.lte(0)) return;
  damageTypes.forEach((damageType) => {
    const stacksToAdd = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < stacksToAdd; i++) {
      applyDamageEffect(damageType.type);
    }
  });
  processDamageEffects();

  if (monsterCurrentHealth.value.gt(0) && monsterCurrentHealth.value.lt(monsterMaxHealth.value)) {
    const regenAmount = effectiveRegeneration.value;
    monsterCurrentHealth.value = Decimal.min(
      monsterMaxHealth.value,
      monsterCurrentHealth.value.plus(regenAmount),
    );
  }

  if (monsterCurrentHealth.value.lte(0)) {
    onMonsterDefeated();
  }
};

const onMonsterDefeated = () => {
  rewards.value.forEach((reward) => {
    console.log(`Получена награда: ${reward.name} x${reward.amount}`);
  });

  setTimeout(() => {
    generateMonster();
  }, 500);
};

const changeTarget = () => {
  generateMonster();
};

onMounted(() => {
  generateMonster();

  battleInterval = setInterval(() => {
    dealDamage();
  }, 1000);
});

onUnmounted(() => {
  if (battleInterval) {
    clearInterval(battleInterval);
  }
});
</script>

<style scoped lang="scss">
.battle-panel {
  background: linear-gradient(145deg, #2a2d47, #1e2139);
  border: 1px solid #3a4763;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;

  .battle-info {
    margin-bottom: 16px;

    .battle-stats {
      display: flex;
      gap: 16px;
      justify-content: center;

      .stat-item {
        display: flex;
        align-items: center;
        gap: 6px;
        background: linear-gradient(145deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1));
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 8px 12px;
        border-radius: 8px;
        color: #e5e7eb;
        font-size: 13px;
        font-weight: 500;
      }
    }
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .battle-area {
    flex: 1;
    margin-bottom: 12px;

    .battle-grid {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }

    .monster-card {
      background: linear-gradient(145deg, #4a2c5a, #3a1f47);
      border: 2px solid #6b4678;
      border-radius: 16px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 450px;
      width: 100%;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      transition: all 0.3s ease;
      position: relative;

      &.damage-flash {
        animation: damageFlash 0.5s ease;
      }

      .damage-indicator {
        position: absolute;
        top: -10px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-weight: bold;
        font-size: 14px;
        animation: damageFloat 0.5s ease-out;
        z-index: 10;
      }

      .monster-header {
        display: flex;
        align-items: center;
        gap: 16px;

        .monster-avatar {
          font-size: 36px;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(145deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2));
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .monster-info {
          flex: 1;

          .monster-name {
            color: #e5e7eb;
            margin: 0;
            font-size: 18px;
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
          }

          .monster-level {
            color: #a1a1aa;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 4px;
          }

          .monster-stats {
            display: flex;
            gap: 12px;
            font-size: 12px;

            .stat-armor,
            .stat-regen {
              display: flex;
              align-items: center;
              gap: 4px;
              color: #e5e7eb;
              background: linear-gradient(145deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1));
              border: 1px solid rgba(255, 255, 255, 0.1);
              padding: 2px 6px;
              border-radius: 8px;
              font-weight: 500;
            }
          }
        }
      }

      .monster-health {
        .health-label {
          color: #a1a1aa;
          font-size: 13px;
          margin-bottom: 6px;
          font-weight: 500;
        }

        .health-bar {
          position: relative;
          height: 24px;
          background: linear-gradient(145deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4));
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);

          .health-fill {
            height: 100%;
            background: linear-gradient(90deg, #ef4444, #dc2626, #b91c1c);
            transition: width 0.5s ease;
            box-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
          }

          .health-text {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 13px;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
          }
        }
      }

      .damage-effects {
        .effects-label {
          color: #a1a1aa;
          font-size: 13px;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .effects-list {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;

          .effect-item {
            display: flex;
            align-items: center;
            gap: 4px;
            background: linear-gradient(145deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3));
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 11px;
            color: #e5e7eb;
            font-weight: 500;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            animation: effectPulse 2s infinite;
            position: relative;

            .effect-stacks {
              background: rgba(255, 255, 255, 0.2);
              border-radius: 50%;
              width: 16px;
              height: 16px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              font-weight: bold;
            }
          }
        }
      }

      .essence-rewards {
        .rewards-label {
          color: #a1a1aa;
          font-size: 13px;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .rewards-list {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;

          .reward-item {
            display: flex;
            align-items: center;
            gap: 6px;
            background: linear-gradient(145deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2));
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 6px 10px;
            border-radius: 16px;
            font-size: 12px;
            color: #e5e7eb;
            font-weight: 500;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            transition: all 0.2s ease;

            &:hover {
              transform: translateY(-1px);
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            }
          }
        }
      }

      .monster-actions {
        display: flex;
        justify-content: center;

        .action-btn {
          border-radius: 10px;
          font-weight: 600;
          transition: all 0.2s ease;

          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
          }
        }
      }
    }
  }
}

// Адаптивность
@media (max-width: 768px) {
  .battle-panel {
    .battle-area {
      height: 400px;

      .monster-card {
        .monster-header .monster-avatar {
          font-size: 24px;
          width: 40px;
          height: 40px;
        }
      }
    }
  }
}

// Анимации
@keyframes damageFlash {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.02);
    border-color: #ef4444;
  }
  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(1.02);
    border-color: #ef4444;
  }
  100% {
    transform: scale(1);
  }
}

@keyframes damageFloat {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-30px);
  }
}

@keyframes effectPulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}
</style>
