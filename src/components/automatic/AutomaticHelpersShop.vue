<template>
  <q-card flat class="q-pa-lg">
    <div class="row q-col-gutter-lg q-gutter-y-md">
      <div
        v-for="key in helperKeys"
        :key="key"
        class="col-12 col-sm-6 col-md-4 flex flex-center helper-wrapper"
      >
        <q-card flat bordered class="q-pa-sm helper-card-custom flex column helper-card">
          <div
            class="helper-header"
            :class="!getHelper(key).value.enabled ? 'helper-card--disabled' : ''"
          >
            <div class="row items-center q-mb-sm helper-title-row">
              <i
                :name="iconStyle + getHelper(key).value.icon"
                size="24px"
                class="q-mr-sm helper-icon icon-default-custom"
              />
              <span class="text-body1 text-weight-bold helper-title text-blue-4">
                {{ getHelper(key).value.title }}
              </span>
              <q-toggle
                v-model="getHelper(key).value.enabled"
                color="primary"
                size="sm"
                class="q-ml-md"
                :label="getHelper(key).value.enabled ? 'Вкл.' : 'Выкл.'"
                @update:model-value="(val: any) => setHelperEnabled(key, val)"
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
                    <span class="text-body2 text-weight-bold text-blue-4">{{
                      getHelper(key).value.count
                    }}</span>
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
                      {{ formatNumber(costCount(getHelper(key).value).value) }}
                    </q-chip>
                    <q-btn
                      label="Нанять"
                      size="sm"
                      dense
                      unelevated
                      class="upgrade-btn-narrow upgrade-btn-custom btn-equal-width"
                      style="min-width: 90px"
                      @click="hireHelper(getHelper(key).value)"
                      :disable="!canHireHelper(getHelper(key).value).value"
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
                    <span class="text-body2 text-weight-bold text-blue-4"
                      >{{
                        getHelperChanceWithCount(
                          getHelper(key).value.percent,
                          getHelper(key).value.count,
                        ).toFixed(1)
                      }}%</span
                    >
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
                      {{ formatNumber(costPercent(getHelper(key).value).value) }}
                    </q-chip>
                    <q-btn
                      label="Улучшить"
                      size="sm"
                      dense
                      unelevated
                      class="upgrade-btn-narrow upgrade-btn-custom btn-equal-width"
                      style="min-width: 90px"
                      @click="upgradeHelperChance(getHelper(key).value)"
                      :disable="!canUpgradeHelperChance(getHelper(key).value).value"
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
import type { AutomaticShopHelpers } from 'src/constants/models';
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

const helperKeys = computed(() => Object.keys(storeAutomatic.helpersShop));

const getHelper = (key: string) =>
  computed(() => {
    const meta = automaticShopHelpersMeta.find((m) => m.key === key)!;
    const state = storeAutomatic.helpersShop[key as keyof typeof storeAutomatic.helpersShop];
    return {
      ...meta,
      ...state,
    };
  });

function setHelperEnabled(key: string, val: boolean) {
  const helper = storeAutomatic.helpersShop[key as keyof typeof storeAutomatic.helpersShop];
  helper.enabled = val;
}

const costCount = (helper: AutomaticShopHelpers) => {
  return computed(() => {
    return helper.cost.count.mul(helper.cost.countMultiply.pow(helper.count));
  });
};

const costPercent = (helper: AutomaticShopHelpers) => {
  return computed(() => {
    return helper.cost.percent.mul(helper.cost.percentMultiply.pow(helper.percent));
  });
};

const canHireHelper = (helper: AutomaticShopHelpers) => {
  return computed(() => storeData.epicNumber.gte(costCount(helper).value));
};

const canUpgradeHelperChance = (helper: AutomaticShopHelpers) => {
  return computed(() => helper.count.gt(0) && storeData.epicNumber.gte(costPercent(helper).value));
};

function hireHelper(helper: AutomaticShopHelpers) {
  const cost = costCount(helper).value;
  if (storeData.epicNumber.gte(cost)) {
    storeData.epicNumber = storeData.epicNumber.minus(cost);
    const key = helper.key as keyof typeof storeAutomatic.helpersShop;
    storeAutomatic.helpersShop[key].count = storeAutomatic.helpersShop[key].count.add(1);
  }
}

function upgradeHelperChance(helper: AutomaticShopHelpers) {
  const cost = costPercent(helper).value;
  if (storeData.epicNumber.gte(cost)) {
    storeData.epicNumber = storeData.epicNumber.minus(cost);
    const key = helper.key as keyof typeof storeAutomatic.helpersShop;
    storeAutomatic.helpersShop[key].percent = storeAutomatic.helpersShop[key].percent.add(1);
  }
}

function getHelperChanceWithCount(percent: Decimal, count: Decimal): Decimal {
  if (!count || count.lte(0)) return new Decimal(0);
  return storeAutomatic.getHelperChance(percent);
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
  color: #2563eb !important;
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
</style>
