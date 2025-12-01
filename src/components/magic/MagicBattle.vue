<template>
  <div class="battle-panel">
    <div class="battle-area">
      <div class="battle-grid">
        <div class="monster-card">
          <div class="monster-header">
            <div class="monster-avatar">
              <i
                :class="iconStyle + storeMagic.monster.icon"
                :style="{ color: storeMagic.monster.iconColor }"
              ></i>
            </div>
            <div class="monster-info">
              <h6 class="monster-name">{{ storeMagic.monster.name }}</h6>
              <div class="monster-level">Уровень {{ storeMagic.monster.level }}</div>
              <div class="monster-kill-counter">
                <i :class="iconStyle + 'fa-skull'" style="color: #fbbf24"></i>
                До повышения уровня: {{ storeMagic.monsterKillCount }}
              </div>
              <div class="monster-stats">
                <span class="stat-armor">
                  <i :class="iconStyle + 'fa-shield'" style="color: #94a3b8"></i>
                  {{ formatNumber(storeMagic.monsterEffectiveArmor) }}
                </span>
                <span class="stat-regen">
                  <i :class="iconStyle + 'fa-heart'" style="color: #22c55e"></i>
                  {{ formatNumber(storeMagic.monsterEffectiveRegeneration) }}
                </span>
              </div>
            </div>
          </div>

          <div class="monster-health">
            <div class="health-label">Здоровье</div>
            <div class="health-bar">
              <div class="health-fill" :style="{ width: healthPercent + '%' }"></div>
              <div class="health-text">
                {{ formatNumber(storeMagic.monster.currentHealth) }}
              </div>
            </div>
          </div>

          <div class="damage-effects" v-if="hasEffects">
            <div class="effects-label">Активные эффекты:</div>
            <div class="effects-list">
              <div
                v-for="effect in effectsForView"
                :key="`${storeMagic.monster.id}-${effect.type}`"
                class="effect-item"
                :title="effect.meta?.name || effect.type"
              >
                <i
                  :class="iconStyle + (effect.meta?.icon || 'fa-question')"
                  :style="{ color: effect.meta?.color || '#fff' }"
                ></i>
                <span class="effect-stacks" v-if="effect.stacks.gt(1)">{{
                  formatNumber(effect.stacks)
                }}</span>
              </div>
            </div>
          </div>

          <div class="essence-rewards">
            <div class="rewards-label">Награды (Эссенции):</div>
            <div class="rewards-list">
              <div
                v-for="(reward, index) in displayedRewards"
                :key="`${storeMagic.monster.id}-${index}`"
                class="reward-item"
                :title="reward.name"
              >
                <i :class="iconStyle + reward.icon" :style="{ color: reward.color }"></i>
                <span>{{ formatNumber(reward.amount) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Decimal from 'break_eternity.js';
import { useStoreData } from 'stores/data';
import { useStoreMagic } from 'stores/magic';
import { useStoreSetting } from 'stores/setting';
import { damageTypes } from 'src/constants/magicMeta';

const storeSetting = useStoreSetting();

const iconStyle = computed(() => {
  return storeSetting.iconStyle;
});

const storeData = useStoreData();
const storeMagic = useStoreMagic();
const formatNumber = storeData.formatNumber;

const damageTypeMap = computed(() => {
  const map = new Map<string, (typeof damageTypes)[number]>();
  for (const dt of damageTypes) map.set(dt.type, dt);
  return map;
});

const healthPercent = computed(() => {
  if (storeMagic.monster.maxHealth.lte(0)) return 0;
  const num = storeMagic.monster.currentHealth
    .div(storeMagic.monster.maxHealth)
    .mul(100)
    .toNumber();
  return Math.max(0, Math.min(100, num));
});

const effectsForView = computed(() =>
  storeMagic.monster.damageEffects.map((e) => ({
    type: e.type,
    stacks: e.stacks,
    meta: damageTypeMap.value.get(e.type),
  })),
);

const hasEffects = computed(() => effectsForView.value.length > 0);

const saturationBonus = computed(() => {
  const saturationEffect = storeMagic.monster.damageEffects.find(
    (effect) => effect.type === 'saturation',
  );
  return saturationEffect ? saturationEffect.stacks : new Decimal(0);
});

const displayedRewards = computed(() => {
  const multiplier = saturationBonus.value.mul(0.01).plus(1);
  return storeMagic.monster.rewards.map((reward) => ({
    ...reward,
    baseAmount: reward.amount,
    amount: reward.amount.mul(multiplier),
  }));
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

          .monster-rewards {
            color: #f59e0b;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 4px;
            padding: 2px 6px;
            background: linear-gradient(145deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.05));
            border: 1px solid rgba(245, 158, 11, 0.3);
            border-radius: 6px;
            display: inline-flex;
            align-items: center;
            gap: 4px;
          }

          .monster-kill-counter {
            font-weight: 500;
            margin-bottom: 4px;
            padding: 3px 8px;
            background: rgba(31, 41, 55, 0.9);
            border: 1px solid rgba(251, 191, 36, 0.4);
            border-radius: 6px;
            color: #ffffff;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
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
              border-radius: 12px;
              min-width: 24px;
              height: 18px;
              padding: 0 6px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              font-weight: bold;
              white-space: nowrap;
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

            .saturation-bonus {
              color: #32cd32;
              font-size: 10px;
              font-weight: 600;
            }
          }
        }

        .saturation-info {
          margin-top: 8px;
          padding: 4px 8px;
          align-items: center;
          gap: 4px;
          border: 1px solid rgba(50, 205, 50, 0.3);
          border-radius: 8px;
          font-size: 11px;
          color: #ffffff;
          font-weight: 500;
          display: flex;
          background: rgba(0, 0, 0, 0.8);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .battle-panel {
    .battle-area {
      height: 360px;

      .monster-card {
        padding: 14px;
        .monster-header .monster-avatar {
          font-size: 22px;
          width: 36px;
          height: 36px;
        }
        .monster-info {
          .monster-name {
            font-size: 16px;
          }
          .monster-level {
            font-size: 12px;
          }
        }
        .monster-stats {
          gap: 8px;
          font-size: 11px;
        }
        .monster-kill-counter {
          font-size: 11px;
          padding: 2px 6px;
        }
        .monster-rewards {
          font-size: 12px;
        }
        .monster-health {
          .health-bar {
            height: 20px;
          }
          .health-text {
            font-size: 12px;
          }
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .battle-panel {
    padding: 12px;
    .battle-area {
      height: 320px;
      .monster-card {
        padding: 12px;
        gap: 10px;
        .monster-header {
          gap: 10px;
        }
        .monster-info {
          .monster-name {
            font-size: 14px;
          }
          .monster-level {
            font-size: 11px;
          }
        }
        .monster-stats {
          gap: 6px;
          font-size: 10px;
        }
        .monster-kill-counter {
          font-size: 10px;
          padding: 2px 5px;
        }
        .monster-health {
          .health-label {
            font-size: 12px;
          }
          .health-bar {
            height: 18px;
          }
          .health-text {
            font-size: 11px;
          }
        }
        .effects-list {
          gap: 6px;
        }
        .effect-item {
          padding: 3px 6px;
          font-size: 10px;
        }
        .rewards-list {
          gap: 8px;
        }
        .reward-item {
          padding: 5px 8px;
          font-size: 11px;
        }
      }
    }
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
