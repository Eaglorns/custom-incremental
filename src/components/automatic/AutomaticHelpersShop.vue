<template>
  <q-card flat class="p-2 sm:p-6 text-xs sm:text-sm">
    <div class="row q-col-gutter-lg q-gutter-y-md">
      <div
        v-for="uv in helpersView"
        :key="uv.key"
        class="col-12 col-sm-6 col-md-4 flex flex-center helper-wrapper"
      >
        <q-card flat bordered class="q-pa-sm helper-card-custom flex column helper-card">
          <div class="helper-header" :class="!uv.enabled ? 'helper-card--disabled' : ''">
            <div class="row items-center q-mb-sm helper-title-row">
              <i
                :class="iconStyle + uv.icon"
                size="24px"
                class="q-mr-sm helper-icon icon-default-custom"
              />
              <span class="text-body1 text-weight-bold helper-title text-blue-4">
                {{ uv.title }}
              </span>
              <q-toggle
                :model-value="uv.enabled"
                color="primary"
                size="sm"
                class="q-ml-md"
                :label="uv.enabled ? 'Вкл.' : 'Выкл.'"
                @update:model-value="(val: boolean) => setHelperEnabled(uv.key, val)"
              />
            </div>
          </div>
          <div class="column justify-end helper-content">
            <div class="q-mb-sm">
              <q-separator class="q-my-xs separator-custom" />
              <div class="column q-gutter-xs">
                <div class="column q-gutter-xs">
                  <div class="row items-center">
                    <i
                      :class="iconStyle + 'fa-users'"
                      size="18px"
                      class="q-mr-xs icon-default-custom"
                    />
                    <span class="text-caption q-mr-xs text-secondary-custom"
                      >{{ $t('components.automatic.automaticBuyers.quantity') }}:</span
                    >
                    <span class="text-body2 text-weight-bold text-blue-4">{{ uv.count }}</span>
                  </div>
                  <div class="row items-center q-gutter-xs">
                    <q-chip
                      dense
                      class="q-pa-xs upgrade-cost-chip-wide upgrade-chip-custom"
                      style="min-width: 90px"
                    >
                      <i
                        :class="iconStyle + 'fa-gauge-high'"
                        size="16px"
                        class="q-mr-xs icon-accent-custom"
                      />
                      {{ formatNumber(uv.costCount) }}
                    </q-chip>
                    <q-btn
                      label="Нанять"
                      size="sm"
                      dense
                      unelevated
                      class="upgrade-btn-narrow upgrade-btn-custom btn-equal-width"
                      style="min-width: 90px"
                      @click="hireHelper(uv.key)"
                      :disable="!uv.canHire"
                    />
                  </div>
                </div>
                <q-separator class="q-my-xs separator-custom" />
                <q-separator class="q-my-xs separator-custom" />
                <div class="column q-gutter-xs">
                  <div class="row items-center">
                    <i
                      :class="iconStyle + 'fa-percent'"
                      size="18px"
                      class="q-mr-xs icon-default-custom"
                    />
                    <span class="text-caption q-mr-xs text-secondary-custom">Шанс покупки:</span>
                    <span class="text-body2 text-weight-bold text-blue-4">{{ uv.chanceStr }}%</span>
                  </div>
                  <div class="row items-center q-gutter-xs">
                    <q-chip
                      dense
                      class="q-pa-xs upgrade-cost-chip-wide upgrade-chip-custom"
                      style="min-width: 90px"
                    >
                      <i
                        :class="iconStyle + 'fa-gauge-high'"
                        size="16px"
                        class="q-mr-xs icon-accent-custom"
                      />
                      {{ formatNumber(uv.costPercent) }}
                    </q-chip>
                    <q-btn
                      label="Улучшить"
                      size="sm"
                      dense
                      unelevated
                      class="upgrade-btn-narrow upgrade-btn-custom btn-equal-width"
                      style="min-width: 90px"
                      @click="upgradeHelperChance(uv.key)"
                      :disable="!uv.canUpgrade"
                    />
                  </div>
                </div>
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
import { automaticShopHelpersMeta } from 'src/constants/automaticShopHelpersMeta';
import { useStoreData } from 'stores/data';
import Decimal from 'break_eternity.js';
import { useStoreAutomatic } from 'stores/automatic';
import { useStoreSetting } from 'stores/setting';

const storeData = useStoreData();
const storeAutomatic = useStoreAutomatic();
const storeSetting = useStoreSetting();

const iconStyle = computed(() => {
  return storeSetting.iconStyle;
});

const formatNumber = storeData.formatNumber;

const helpersView = computed(() => {
  return Object.keys(storeAutomatic.helpersShop).map((key) => {
    const meta = automaticShopHelpersMeta.find((m) => m.key === key)!;
    const s = storeAutomatic.helpersShop[key as keyof typeof storeAutomatic.helpersShop];
    const costCount = s.cost.count.mul(s.cost.countMultiply.pow(s.count));
    const costPercent = s.cost.percent.mul(s.cost.percentMultiply.pow(s.percent));
    const canHire = storeData.epicNumber.gte(costCount);
    const canUpgrade = s.count.gt(0) && storeData.epicNumber.gte(costPercent);
    const chance = s.count.lte(0) ? new Decimal(0) : storeAutomatic.getHelperChance(s.percent);
    return {
      key,
      title: meta.title,
      icon: meta.icon,
      enabled: s.enabled,
      count: s.count,
      percent: s.percent,
      costCount,
      costPercent,
      canHire,
      canUpgrade,
      chanceStr: chance.toFixed(1),
    };
  });
});

function setHelperEnabled(key: string, val: boolean) {
  const helper = storeAutomatic.helpersShop[key as keyof typeof storeAutomatic.helpersShop];
  helper.enabled = val;
}

function hireHelper(key: string) {
  const s = storeAutomatic.helpersShop[key as keyof typeof storeAutomatic.helpersShop];
  const cost = s.cost.count.mul(s.cost.countMultiply.pow(s.count));
  if (storeData.epicNumber.gte(cost)) {
    storeData.epicNumber = storeData.epicNumber.minus(cost);
    s.count = s.count.add(1);
  }
}

function upgradeHelperChance(key: string) {
  const s = storeAutomatic.helpersShop[key as keyof typeof storeAutomatic.helpersShop];
  const cost = s.cost.percent.mul(s.cost.percentMultiply.pow(s.percent));
  if (storeData.epicNumber.gte(cost)) {
    storeData.epicNumber = storeData.epicNumber.minus(cost);
    s.percent = s.percent.add(1);
  }
}
</script>

<style lang="scss">
.helper-wrapper {
  max-width: 280px;
  min-width: 240px;
  flex: 0 0 260px;
}

.helper-card--disabled {
  opacity: 0.3;
  .upgrade-btn-custom,
  .q-btn,
  .btn-equal-width {
    opacity: 1 !important;
    filter: none !important;
  }
}

.helper-card {
  min-height: 250px;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  max-width: 100%;
  height: auto;
}

.helper-header {
  flex: 0 0 auto;
}

.helper-title-row {
  min-height: 24px;
  flex-wrap: nowrap;
}

.helper-icon {
  flex: 0 0 20px;
}

.helper-title {
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  white-space: normal;
  flex: 1 1 0;
  min-width: 0;
  font-size: 14px;
  line-height: 1.2;
  max-height: 2.4em;
}

.helper-description {
  min-height: 42px;
  font-size: 11px;
  line-height: 1.3;
}

.helper-content {
  flex: 1 1 auto;
}

.upgrade-cost-chip-wide {
  flex: 1 1 auto;
  font-size: 14px;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
}

.upgrade-btn-narrow {
  flex: 0 0 auto;
  min-width: 90px;
  max-width: 100%;
  width: 90px;
  justify-content: center;
}

.upgrade-btn-custom {
  background: #d3d6de !important;
  color: #595959 !important;
  border: 2px solid #c2cbe0;
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 rgba(80, 100, 200, 0.1);
  font-weight: 700;
  letter-spacing: 0.02em;
  transition:
    background 0.2s,
    color 0.2s,
    border 0.2s;
  &:hover:not(:disabled) {
    background: #bfc3ce !important;
    color: #1e40af !important;
    border-color: #aab3c8;
  }
}

.btn-equal-width {
  min-width: 90px;
  max-width: 100%;
  width: 90px;
  justify-content: center;
  box-sizing: border-box;
}

@media (max-width: 700px) {
  .helper-wrapper {
    max-width: 100% !important;
    min-width: 0 !important;
    flex: 1 1 100% !important;
    padding: 2px !important;
  }
  .helper-card {
    min-height: 120px !important;
    max-width: 100% !important;
    width: 100% !important;
    padding: 4px !important;
    font-size: 12px !important;
  }
  .helper-title {
    font-size: 12px !important;
    max-height: none !important;
  }
  .upgrade-cost-chip-wide {
    font-size: 11px !important;
    min-width: 0 !important;
    padding: 1px 4px !important;
  }
  .btn-equal-width {
    font-size: 11px !important;
    min-width: 0 !important;
    width: 100px !important;
    padding: 2px 4px !important;
  }
}

@media (max-width: 600px) {
  .helper-title-row {
    flex-wrap: wrap;
    gap: 4px;
  }
  .helper-icon {
    font-size: 16px;
  }
  .helper-card {
    padding: 6px !important;
  }
  .helper-description {
    font-size: 10px;
  }
  .helper-card .row.items-center {
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .helper-card .q-toggle .q-toggle__label {
    display: none;
  }
  .upgrade-cost-chip-wide {
    min-width: 0 !important;
    width: 100% !important;
  }
  .btn-equal-width,
  .upgrade-btn-narrow {
    width: 100% !important;
    min-width: 0 !important;
  }
  .helper-card .row.items-center.q-gutter-xs {
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
  }
}
</style>
