<template>
  <q-card flat class="q-pa-lg">
    <div class="row q-col-gutter-lg q-gutter-y-md">
      <div
        v-for="key in helperKeys"
        :key="key"
        class="col-12 col-sm-6 col-md-4 flex flex-center helper-wrapper"
      >
        <q-card flat bordered class="helper-card helper-card-animation">
          <div class="helper-header">
            <div class="helper-title-row">
              <q-icon
                :name="getHelper(key).value.icon"
                size="20px"
                class="helper-icon icon-default-custom"
              />
              <span class="helper-title">
                {{ getHelper(key).value.title }}
                <q-tooltip
                  anchor="top middle"
                  self="bottom middle"
                  :offset="[0, 10]"
                  class="helper-tooltip"
                >
                  {{ getHelper(key).value.title }}
                </q-tooltip>
              </span>
            </div>
          </div>

          <div>
            <div class="helper-stat-group">
              <div class="helper-stat-row">
                <q-icon
                  name="fa-duotone fa-users"
                  size="16px"
                  class="helper-stat-icon icon-default-custom"
                />
                <span class="helper-stat-label text-secondary-custom"
                  >{{ $t('components.automatic.automaticBuyers.quantity') }}:</span
                >
                <span class="helper-stat-value">{{ getHelper(key).value.count }}</span>
              </div>
              <div class="helper-action-row">
                <q-chip dense class="upgrade-cost-chip-wide upgrade-chip-custom">
                  <q-icon name="fa-duotone fa-coins" size="12px" class="icon-accent-custom" />
                  {{ formatNumber(costCount(getHelper(key).value).value) }}
                </q-chip>
                <q-btn
                  label="Нанять"
                  size="sm"
                  dense
                  unelevated
                  class="btn-equal-width"
                  @click="hireHelper(getHelper(key).value)"
                  :disable="!canHireHelper(getHelper(key).value).value"
                />
              </div>
            </div>

            <div class="helper-stat-group">
              <div class="helper-stat-row">
                <q-icon
                  name="fa-duotone fa-percent"
                  size="16px"
                  class="helper-stat-icon icon-default-custom"
                />
                <span class="helper-stat-label text-secondary-custom">Шанс покупки:</span>
                <span class="helper-stat-value"
                  >{{
                    getHelperChanceWithCount(
                      getHelper(key).value.percent,
                      getHelper(key).value.count,
                    ).toFixed(1)
                  }}%</span
                >
              </div>
              <div class="helper-action-row">
                <q-chip dense class="upgrade-cost-chip-wide upgrade-chip-custom">
                  <q-icon name="fa-duotone fa-coins" size="12px" class="icon-accent-custom" />
                  {{ formatNumber(costPercent(getHelper(key).value).value) }}
                </q-chip>
                <q-btn
                  label="Улучшить"
                  size="sm"
                  dense
                  unelevated
                  class="btn-equal-width"
                  @click="upgradeHelperChance(getHelper(key).value)"
                  :disable="!canUpgradeHelperChance(getHelper(key).value).value"
                />
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { helpersMeta } from 'src/constants/helpersMeta';
import type { HelperState } from 'src/constants/models';
import { useStoreData } from 'stores/data';
import Decimal from 'break_eternity.js';
import { useStoreAutomatic } from 'stores/automatic';

const storeData = useStoreData();
const storeAutomatic = useStoreAutomatic();

const formatNumber = storeData.formatNumber;

const helperKeys = computed(() => Object.keys(storeAutomatic.helpers));

const getHelper = (key: string) =>
  computed(() => {
    const meta = helpersMeta.find((m) => m.key === key)!;
    const state = storeAutomatic.helpers[key as keyof typeof storeAutomatic.helpers];
    return {
      ...meta,
      ...state,
    };
  });

const costCount = (helper: HelperState) => {
  return computed(() => {
    return helper.cost.count.mul(helper.cost.countMultiply.pow(helper.count));
  });
};

const costPercent = (helper: HelperState) => {
  return computed(() => {
    return helper.cost.percent.mul(helper.cost.percentMultiply.pow(helper.percent));
  });
};

const canHireHelper = (helper: HelperState) => {
  return computed(() => storeData.epicNumber.gte(costCount(helper).value));
};

const canUpgradeHelperChance = (helper: HelperState) => {
  return computed(() => helper.count.gt(0) && storeData.epicNumber.gte(costPercent(helper).value));
};

function hireHelper(helper: HelperState) {
  const cost = costCount(helper).value;
  if (storeData.epicNumber.gte(cost)) {
    storeData.epicNumber = storeData.epicNumber.minus(cost);
    const key = helper.key as keyof typeof storeAutomatic.helpers;
    storeAutomatic.helpers[key].count = storeAutomatic.helpers[key].count.add(1);
  }
}

function upgradeHelperChance(helper: HelperState) {
  const cost = costPercent(helper).value;
  if (storeData.epicNumber.gte(cost)) {
    storeData.epicNumber = storeData.epicNumber.minus(cost);
    const key = helper.key as keyof typeof storeAutomatic.helpers;
    storeAutomatic.helpers[key].percent = storeAutomatic.helpers[key].percent.add(1);
  }
}

function getHelperChanceWithCount(percent: Decimal, count: Decimal): Decimal {
  if (!count || count.lte(0)) return new Decimal(0);
  return storeAutomatic.getHelperChance(percent);
}
</script>

<style scoped lang="scss">
$mobile-breakpoint: 700px;
$tablet-breakpoint: 1024px;

$helper-primary: #42a5f5;
$helper-secondary: #2196f3;
$helper-accent: #1976d2;
$helper-warning: #ffc107;
$helper-success: #4caf50;
$helper-text-primary: #e8eaf0;
$helper-text-secondary: #b0b3c0;
$helper-text-muted: #9e9e9e;
$helper-card-bg: #2a2d3f;
$helper-card-bg-secondary: #2d323b;
$helper-card-border: #4a5568;
$helper-shadow: rgba(66, 165, 245, 0.15);

.helper-wrapper {
  max-width: 280px;
  min-width: 240px;
  flex: 0 0 260px;
  height: auto;
}

.helper-card {
  min-height: 280px;
  max-height: none;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  background: linear-gradient(145deg, $helper-card-bg-secondary, #1e2329) !important;
  border: 2px solid $helper-card-border !important;
  border-radius: 16px !important;
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.3),
    0 2px 8px rgba(66, 165, 245, 0.1) !important;
  backdrop-filter: blur(8px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  padding: 16px !important;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent, rgba(66, 165, 245, 0.03));
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0 12px 32px $helper-shadow,
      0 4px 16px rgba(0, 0, 0, 0.4),
      0 0 0 1px $helper-primary !important;
    border-color: $helper-primary !important;

    &::before {
      opacity: 1;
    }

    .helper-icon {
      transform: scale(1.1);
      filter: drop-shadow(0 0 8px $helper-primary);
    }
  }
}

.helper-header {
  flex: 0 0 auto;
  height: auto;
  padding: 8px 0;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.helper-title-row {
  min-height: 36px;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  background: rgba(66, 165, 245, 0.05);
  border-radius: 8px;
  padding: 6px 8px;
  border: 1px solid rgba(66, 165, 245, 0.1);
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.helper-icon {
  flex: 0 0 20px;
  width: 20px;
  height: 20px;
  color: $helper-primary;
  filter: drop-shadow(0 0 4px rgba(66, 165, 245, 0.3));
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.helper-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  font-size: 14px !important;
  line-height: 1.2;
  color: $helper-text-primary !important;
  font-weight: 700 !important;
  letter-spacing: 0.3px;
  margin-left: 8px;
}

.helper-stat-group {
  min-height: 80px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(66, 165, 245, 0.1);
  border-radius: 8px;
  margin-bottom: 8px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.helper-stat-row {
  min-height: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.helper-stat-icon {
  flex: 0 0 16px;
  width: 16px;
  height: 16px;
}

.helper-stat-label {
  font-size: 12px;
  color: $helper-text-secondary;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}

.helper-stat-value {
  font-weight: 800;
  color: $helper-primary;
  font-size: 12px;
  white-space: nowrap;
  flex: 0 0 auto;
}

.helper-action-row {
  min-height: 36px;
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.upgrade-cost-chip-wide {
  flex: 1;
  min-width: 0;
  max-width: calc(100% - 96px);
  height: 32px;
  background: rgba(66, 165, 245, 0.12) !important;
  color: $helper-primary !important;
  border: 1px solid rgba(66, 165, 245, 0.3) !important;
  border-radius: 8px !important;
  backdrop-filter: blur(4px);
  font-weight: 600 !important;
  font-size: 11px !important;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
}

.btn-equal-width {
  flex: 0 0 auto;
  width: 84px;
  height: 32px;
  min-width: 84px !important;
  max-width: 84px !important;
  background: linear-gradient(135deg, $helper-secondary, $helper-accent) !important;
  color: white !important;
  border: 1px solid $helper-secondary !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.2) !important;
  font-weight: 700 !important;
  font-size: 10px !important;
  letter-spacing: 0.3px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  padding: 0 !important;
  justify-content: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  box-sizing: border-box;

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
    box-shadow: 0 8px 24px rgba(33, 150, 243, 0.4) !important;

    &::before {
      transform: translateX(100%);
    }
  }

  &:disabled {
    background: linear-gradient(135deg, #4b5563, #6b7280) !important;
    color: #9ca3af !important;
    border-color: #6b7280 !important;
    cursor: not-allowed;
    transform: none;
    box-shadow: none !important;

    &::before {
      display: none;
    }
  }
}

.icon-default-custom {
  color: $helper-primary !important;
  filter: drop-shadow(0 0 2px rgba(66, 165, 245, 0.3));
}

.icon-accent-custom {
  color: $helper-warning !important;
  filter: drop-shadow(0 0 2px rgba(255, 193, 7, 0.3));
}

.text-secondary-custom {
  color: $helper-text-secondary !important;
  font-weight: 600 !important;
}

.upgrade-chip-custom {
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 2px 8px rgba(66, 165, 245, 0.2);
  }
}

.helper-card-animation {
  animation: cardAppear 0.5s ease-out;
}

.helper-tooltip {
  background: rgba(42, 45, 63, 0.95) !important;
  backdrop-filter: blur(12px);
  color: $helper-text-primary !important;
  border: 1px solid rgba(66, 165, 245, 0.3) !important;
  border-radius: 12px !important;
  padding: clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
  font-size: clamp(12px, 3vw, 16px) !important;
  font-weight: 600 !important;
  letter-spacing: 0.3px;
  max-width: 280px !important;
  white-space: normal !important;
  word-wrap: break-word !important;
  text-align: center;

  @media (max-width: $mobile-breakpoint) {
    max-width: 200px !important;
    font-size: 12px !important;
    padding: 8px 12px !important;
  }
}

@keyframes cardAppear {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: $mobile-breakpoint) {
  .helper-wrapper {
    max-width: 100% !important;
    min-width: 0 !important;
    flex: 1 1 100% !important;
    padding: 4px !important;
  }

  .helper-card {
    min-height: 220px !important;
    padding: 12px !important;
  }

  .helper-header {
    margin-bottom: 8px !important;
  }

  .helper-title-row {
    min-height: 32px !important;
    padding: 6px 8px !important;
  }

  .helper-title {
    font-size: 13px !important;
  }

  .helper-stat-group {
    min-height: 70px !important;
    padding: 10px !important;
    margin-bottom: 10px !important;
  }

  .helper-stat-row {
    min-height: 20px !important;
  }

  .helper-action-row {
    min-height: 32px !important;
  }

  .upgrade-cost-chip-wide {
    font-size: 11px !important;
    height: 28px !important;
    padding: 0 8px !important;
  }

  .btn-equal-width {
    font-size: 10px !important;
    width: 80px !important;
    min-width: 80px !important;
    max-width: 80px !important;
    height: 28px !important;
  }
}
</style>
