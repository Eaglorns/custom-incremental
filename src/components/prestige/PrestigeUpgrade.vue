<template>
  <q-card flat class="prestige-upgrades">
    <div class="prestige-upgrades__title">Улучшения престижа</div>
    <div class="prestige-upgrades__grid">
      <div
        v-for="upgrade in prestigeUpgrades"
        :key="upgrade.key"
        class="prestige-upgrades__wrapper"
      >
        <q-card
          flat
          bordered
          class="prestige-upgrade-card"
          :class="{
            'prestige-upgrade-card--maxed':
              upgrade.maxLevel !== -1 && upgrade.level.gte(upgrade.maxLevel),
          }"
        >
          <div class="prestige-upgrade-card__header">
            <q-icon :name="upgrade.icon" size="28px" class="prestige-upgrade-card__icon" />
            <div class="prestige-upgrade-card__title-wrapper">
              <span class="prestige-upgrade-card__title" :title="upgrade.title">
                {{ upgrade.title }}
                <q-tooltip class="prestige-tooltip">{{ upgrade.title }}</q-tooltip>
              </span>
            </div>
            <q-badge class="prestige-upgrade-card__badge" v-if="upgrade.level !== undefined">
              Ур. {{ upgrade.level
              }}<template v-if="upgrade.maxLevel !== -1"> / {{ upgrade.maxLevel }}</template>
            </q-badge>
          </div>
          <div class="prestige-upgrade-card__description">{{ upgrade.description }}</div>
          <div class="prestige-upgrade-card__cost">
            <q-icon
              name="fa-duotone fa-coins"
              size="18px"
              class="prestige-upgrade-card__cost-icon"
            />
            <span class="prestige-upgrade-card__cost-value">{{ formatNumber(upgrade.cost) }}</span>
          </div>
          <q-btn
            color="dark"
            :label="
              upgrade.maxLevel !== -1 && upgrade.level.gte(upgrade.maxLevel)
                ? 'МАКС. УР.'
                : 'Купить'
            "
            @click="buyUpgrade(upgrade)"
            class="prestige-upgrade-card__button"
            :class="{
              'prestige-upgrade-card__button--maxed':
                upgrade.maxLevel !== -1 && upgrade.level.gte(upgrade.maxLevel),
            }"
            :disable="
              upgrade.maxLevel !== undefined &&
              upgrade.maxLevel !== -1 &&
              upgrade.level.gte(upgrade.maxLevel)
            "
          />
        </q-card>
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useStoreData } from 'stores/data';
import Decimal from 'break_eternity.js';

const storeData = useStoreData();

const formatNumber = storeData.formatNumber;

const prestigeUpgrades = ref<PrestigeUpgrade[]>([
  {
    key: 'prestigeBonus',
    icon: 'fa-duotone fa-arrow-up-right-dots',
    title: 'Усиление бонуса престижа',
    description: 'Увеличивает множитель бонуса от престижа на 1% за уровень.',
    cost: new Decimal(1e6),
    level: new Decimal(0),
    costGrowth: new Decimal(2.5),
    maxLevel: -1,
  },
  {
    key: 'prestigeSoftening',
    icon: 'fa-duotone fa-wave-sine',
    title: 'Ослабление функции престижа',
    description: 'Смягчает формулу престижа, делая прирост более плавным.',
    cost: new Decimal(2e7),
    level: new Decimal(0),
    costGrowth: new Decimal(3),
    maxLevel: 10,
  },
  {
    key: 'autoShopCPU',
    icon: 'fa-duotone fa-microchip',
    title: 'Прирост CPU',
    description: 'Автоматически повышает уровень CPU в магазине каждую минуту.',
    cost: new Decimal(5e7),
    level: new Decimal(0),
    costGrowth: new Decimal(4),
    maxLevel: -1,
  },
  {
    key: 'autoShopHard',
    icon: 'fa-duotone fa-hard-drive',
    title: 'Прирост HDD',
    description: 'Автоматически повышает уровень HDD в магазине каждую минуту.',
    cost: new Decimal(5e7),
    level: new Decimal(0),
    costGrowth: new Decimal(4),
    maxLevel: -1,
  },
  {
    key: 'autoShopRAM',
    icon: 'fa-duotone fa-memory',
    title: 'Прирост RAM',
    description: 'Автоматически повышает уровень RAM в магазине каждую минуту.',
    cost: new Decimal(5e7),
    level: new Decimal(0),
    costGrowth: new Decimal(4),
    maxLevel: -1,
  },
]);

interface PrestigeUpgrade {
  key: string;
  icon: string;
  title: string;
  description: string;
  cost: Decimal;
  level: Decimal;
  costGrowth: Decimal;
  maxLevel: number; // -1 = бесконечно
}

function buyUpgrade(upgrade: PrestigeUpgrade) {
  if (
    upgrade.maxLevel !== undefined &&
    upgrade.maxLevel !== -1 &&
    upgrade.level.gte(upgrade.maxLevel)
  )
    return;
  upgrade.level = upgrade.level.add(1);
  upgrade.cost = upgrade.cost.mul(upgrade.costGrowth);
}
</script>

<style scoped lang="scss">
$mobile-breakpoint: 700px;
$tablet-breakpoint: 1024px;

:root {
  --prestige-primary: #9f7aff;
  --prestige-secondary: #b794ff;
  --prestige-dark: #7c3aed;
  --prestige-accent: #22c55e;
  --prestige-success: #4caf50;
  --prestige-success-light: #81c784;
  --prestige-success-dark: #2e7d32;
  --prestige-warning: #ffc107;
  --prestige-text-primary: #e8eaf0;
  --prestige-text-secondary: #b0b3c0;
  --prestige-card-bg: #2a2d3f;
  --prestige-card-bg-secondary: #2d323b;
  --prestige-card-border: #5a5f70;
  --prestige-card-border-hover: #7c82a0;
  --prestige-shadow: rgba(159, 122, 255, 0.15);
  --prestige-shadow-success: rgba(76, 175, 80, 0.3);
  --prestige-card-shadow: rgba(0, 0, 0, 0.25);
}

.prestige-upgrades {
  padding: clamp(16px, 4vw, 32px);
  background: linear-gradient(145deg, var(--prestige-card-bg), #23272e);
  border-radius: 20px;
  backdrop-filter: blur(10px);

  &__title {
    font-size: clamp(18px, 4vw, 24px);
    font-weight: 800;
    color: var(--prestige-warning);
    margin-bottom: clamp(16px, 3vw, 24px);
    text-align: center;
    letter-spacing: 0.5px;
    text-shadow: 0 2px 8px rgba(255, 179, 0, 0.3);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: clamp(16px, 3vw, 24px);
    align-items: stretch;

    @media (max-width: $tablet-breakpoint) {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    }

    @media (max-width: $mobile-breakpoint) {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }

  &__wrapper {
    display: flex;
    justify-content: center;
  }
}

.prestige-upgrade-card {
  background: linear-gradient(145deg, var(--prestige-card-bg-secondary), #1e2329);
  border: 2px solid var(--prestige-card-border);
  border-radius: 16px;
  padding: clamp(12px, 3vw, 20px);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(8px);
  box-shadow:
    0 4px 16px var(--prestige-card-shadow),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent, rgba(159, 122, 255, 0.03));
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover:not(&--maxed) {
    transform: translateY(-4px);
    box-shadow:
      0 12px 32px var(--prestige-shadow),
      0 4px 16px var(--prestige-card-shadow),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    border-color: var(--prestige-card-border-hover);

    &::before {
      opacity: 1;
    }

    .prestige-upgrade-card__icon {
      transform: scale(1.1);
      filter: drop-shadow(0 0 8px var(--prestige-primary));
    }
  }

  &--maxed {
    background: linear-gradient(145deg, #1b3d1f, #0d2818);
    border: 2px solid var(--prestige-success);
    box-shadow:
      0 0 20px var(--prestige-shadow-success),
      0 4px 16px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(76, 175, 80, 0.2);

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--prestige-success), var(--prestige-success-light));
    }

    .prestige-upgrade-card__title {
      color: var(--prestige-success-light);
    }

    .prestige-upgrade-card__badge {
      background: var(--prestige-success-dark);
      color: #fff;
      border-color: var(--prestige-success);
    }

    .prestige-upgrade-card__cost-value {
      color: var(--prestige-success-light);
    }

    .prestige-upgrade-card__icon {
      color: var(--prestige-success-light);
    }

    .prestige-upgrade-card__cost-icon {
      color: var(--prestige-success-light);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover {
      transform: none;
    }

    .prestige-upgrade-card__icon {
      transition: none;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    gap: 12px;
  }

  &__icon {
    color: var(--prestige-primary);
    flex-shrink: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    filter: drop-shadow(0 0 4px rgba(159, 122, 255, 0.3));
  }

  &__title-wrapper {
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-size: clamp(14px, 3vw, 18px);
    font-weight: 700;
    color: var(--prestige-text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    letter-spacing: 0.3px;
    line-height: 1.3;
  }

  &__badge {
    background: rgba(159, 122, 255, 0.15);
    color: var(--prestige-primary);
    border: 1px solid rgba(159, 122, 255, 0.3);
    border-radius: 12px;
    padding: 4px 12px;
    font-size: clamp(10px, 2vw, 12px);
    font-weight: 700;
    flex-shrink: 0;
    letter-spacing: 0.5px;
  }

  &__description {
    font-size: clamp(12px, 2.5vw, 14px);
    color: var(--prestige-text-secondary);
    margin-bottom: 16px;
    flex: 1;
    min-height: 50px;
    line-height: 1.5;
  }

  &__cost {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    backdrop-filter: blur(4px);

    &-icon {
      color: var(--prestige-warning);
      flex-shrink: 0;
    }

    &-value {
      font-weight: 700;
      color: var(--prestige-text-primary);
      font-size: clamp(12px, 2.5vw, 14px);
      letter-spacing: 0.3px;
    }
  }

  &__button {
    width: 100%;
    background: linear-gradient(135deg, var(--prestige-dark), var(--prestige-primary));
    color: white;
    border: 1px solid var(--prestige-primary);
    border-radius: 12px;
    padding: clamp(10px, 2.5vw, 14px) clamp(16px, 4vw, 24px);
    margin-top: auto;
    font-weight: 700;
    font-size: clamp(12px, 2.5vw, 14px);
    letter-spacing: 0.5px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      transform: translateX(-100%);
      transition: transform 0.6s ease;
    }

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(159, 122, 255, 0.4);

      &::before {
        transform: translateX(100%);
      }
    }

    &:focus-visible {
      outline: 2px solid var(--prestige-primary);
      outline-offset: 2px;
    }

    &:disabled {
      background: linear-gradient(135deg, #4b5563, #6b7280);
      color: #9ca3af;
      border-color: #6b7280;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    &--maxed {
      background: linear-gradient(
        135deg,
        var(--prestige-success-dark),
        var(--prestige-success)
      ) !important;
      color: #fff !important;
      border-color: var(--prestige-success) !important;
      cursor: default;

      &:hover,
      &:focus {
        background: linear-gradient(
          135deg,
          var(--prestige-success-dark),
          var(--prestige-success)
        ) !important;
        transform: none;
        box-shadow: 0 0 16px var(--prestige-shadow-success);
      }
    }
  }

  @media (max-width: $mobile-breakpoint) {
    padding: 16px;

    &__title {
      font-size: 14px;
    }

    &__description {
      font-size: 12px;
      min-height: 40px;
    }

    &__badge {
      padding: 3px 8px;
      font-size: 10px;
    }

    &__button {
      padding: 12px 16px;
      font-size: 12px;
    }
  }
}

.prestige-tooltip {
  background: rgba(42, 45, 63, 0.95);
  backdrop-filter: blur(12px);
  color: var(--prestige-text-primary);
  border: 1px solid rgba(159, 122, 255, 0.3);
  border-radius: 12px;
  padding: clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  font-size: clamp(12px, 3vw, 16px);
  font-weight: 600;
  letter-spacing: 0.3px;
  max-width: 280px;

  @media (max-width: $mobile-breakpoint) {
    max-width: 200px;
    font-size: 12px;
    padding: 8px 12px;
  }
}
</style>
