<template>
  <q-card flat class="q-pa-lg">
    <div class="row q-col-gutter-lg q-gutter-y-md">
      <div
        v-for="helper in helpers"
        :key="helper.key"
        class="col-12 col-sm-6 col-md-4 flex flex-center helper-wrapper"
      >
        <q-card flat bordered class="q-pa-sm helper-card-custom flex column helper-card">
          <div class="helper-header">
            <div class="row items-center q-mb-sm helper-title-row">
              <q-icon
                :name="helper.icon"
                size="20px"
                class="q-mr-sm helper-icon icon-default-custom"
              />
              <span class="text-body1 text-weight-bold helper-title text-blue-4">
                {{ helper.title }}
              </span>
            </div>
            <div class="q-mb-sm helper-description">
              <span class="text-caption text-secondary-custom">{{ helper.description }}</span>
            </div>
          </div>
          <div class="column justify-end helper-content">
            <div class="q-mb-sm">
              <q-separator class="q-my-xs separator-custom" />
              <div class="column q-gutter-xs">
                <div class="column q-gutter-xs">
                  <div class="row items-center">
                    <q-icon
                      name="fa-duotone fa-users"
                      size="16px"
                      class="q-mr-xs icon-default-custom"
                    />
                    <span class="text-caption q-mr-xs text-secondary-custom">Количество:</span>
                    <span class="text-body2 text-weight-bold text-blue-4">{{ helper.count }}</span>
                  </div>
                  <div class="row items-center q-gutter-xs">
                    <q-chip
                      dense
                      class="q-pa-xs upgrade-cost-chip-wide upgrade-chip-custom"
                      style="min-width: 90px"
                    >
                      <q-icon
                        name="fa-duotone fa-coins"
                        size="12px"
                        class="q-mr-xs icon-accent-custom"
                      />
                      {{ formatNumber(helper.cost) }}
                    </q-chip>
                    <q-btn
                      label="Нанять"
                      :disable="!helper.canHire"
                      size="sm"
                      dense
                      unelevated
                      class="upgrade-btn-narrow upgrade-btn-custom btn-equal-width"
                      style="min-width: 90px"
                    />
                  </div>
                </div>

                <q-separator class="q-my-xs separator-custom" />

                <q-separator class="q-my-xs separator-custom" />

                <div class="column q-gutter-xs">
                  <div class="row items-center">
                    <q-icon
                      name="fa-duotone fa-percent"
                      size="16px"
                      class="q-mr-xs icon-default-custom"
                    />
                    <span class="text-caption q-mr-xs text-secondary-custom">Шанс покупки:</span>
                    <span class="text-body2 text-weight-bold text-blue-4"
                      >{{ calcChance(helper.count) }}%</span
                    >
                  </div>
                  <div class="row items-center q-gutter-xs">
                    <q-chip
                      dense
                      class="q-pa-xs upgrade-cost-chip-wide upgrade-chip-custom"
                      style="min-width: 90px"
                    >
                      <q-icon
                        name="fa-duotone fa-coins"
                        size="12px"
                        class="q-mr-xs icon-accent-custom"
                      />
                      {{ formatNumber(helper.upgradeCost) }}
                    </q-chip>
                    <q-btn
                      label="Улучшить"
                      :disable="!helper.canUpgrade"
                      size="sm"
                      dense
                      unelevated
                      class="upgrade-btn-narrow upgrade-btn-custom btn-equal-width"
                      style="min-width: 90px"
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
import { helpersMeta } from 'src/constants/helpersMeta';
import type { HelperState } from 'src/constants/models';
import { useStoreGame } from 'src/stores/game';

const storeGame = useStoreGame();

// Собираем массив карточек для cpu, hdd, ram
const helpers = computed(() => {
  return helpersMeta.map((meta) => {
    // Данные из storeGame.helpers (cpu, hdd, ram)
    const state = storeGame.helpers[meta.key as keyof typeof storeGame.helpers];
    return {
      ...meta,
      ...state,
    };
  });
});
function formatNumber(val: number) {
  return val.toLocaleString();
}

function calcChance(count: number) {
  if (count <= 0) return 1;
  const max = 100;
  const base = 1;
  const slow = 0.18;
  let chance = base + Math.log10(count + 1) / slow;
  if (chance > max) chance = max;
  return chance.toFixed(1).replace('.0', '');
}
</script>

<style lang="sass">
.helper-wrapper
  max-width: 280px
  min-width: 240px
  flex: 0 0 260px

.helper-card
  min-height: 342px
  display: flex
  flex-direction: column
  width: 100%
  box-sizing: border-box
  max-width: 100%
  height: auto

.helper-header
  flex: 0 0 auto

.helper-title-row
  min-height: 24px
  flex-wrap: nowrap

.helper-icon
  flex: 0 0 20px

.helper-title
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap
  flex: 1 1 0
  min-width: 0
  font-size: 14px
  line-height: 1.2

.helper-description
  min-height: 42px
  font-size: 11px
  line-height: 1.3

.helper-content
  flex: 1 1 auto

.upgrade-cost-chip-wide
  flex: 1 1 auto
  font-size: 14px
  min-width: 0
  max-width: 100%
  box-sizing: border-box

.upgrade-btn-narrow
  flex: 0 0 auto

.upgrade-btn-custom
  background: #d3d6de !important
  color: #2563eb !important
  border: 2px solid #c2cbe0
  border-radius: 8px
  box-shadow: 0 2px 8px 0 rgba(80,100,200,0.10)
  font-weight: 700
  letter-spacing: 0.02em
  transition: background 0.2s, color 0.2s, border 0.2s
  &:hover:not(:disabled)
    background: #bfc3ce !important
    color: #1e40af !important
    border-color: #aab3c8

.btn-equal-width
  min-width: 90px
  max-width: 100%
  width: 90px
  justify-content: center
  box-sizing: border-box
</style>
