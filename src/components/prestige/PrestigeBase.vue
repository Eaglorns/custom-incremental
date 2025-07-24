<template>
  <div class="prestige-card q-pa-xl flex flex-center column items-center">
    <div class="prestige-header flex items-center q-mb-lg">
      <q-icon
        name="fa-duotone fa-arrow-up-right-dots"
        color="primary"
        size="32px"
        class="q-mr-md prestige-icon"
      />
      <span class="prestige-main-value">{{ formatNumber(prestige) }}</span>
    </div>
    <div
      class="prestige-values q-mb-xl flex items-center justify-center"
      :class="{ 'prestige-progress-full': canPrestige }"
      :style="{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '320px',
        minWidth: '220px',
        background: 'rgba(30,35,50,0.22)',
      }"
    >
      <div
        class="prestige-progress-fill"
        :style="{
          width: progress.toNumber() * 100 + '%',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, #6bbf6b 0%, #3a7c3a 100%)',
          opacity: 0.18,
          borderRadius: '8px',
          zIndex: 1,
          transition: 'width 0.4s',
          boxShadow: canPrestige ? '0 0 16px 4px #6bbf6b99' : 'none',
        }"
        v-if="!canPrestige"
      />
      <q-icon
        name="fa-duotone fa-arrow-rotate-right"
        color="secondary"
        size="24px"
        class="q-mr-sm"
        style="z-index: 2"
      />
      <span class="prestige-possible" style="z-index: 2">+{{ formatNumber(prestigeGain) }}</span>
    </div>
    <q-btn
      color="primary"
      size="md"
      icon="fa-duotone fa-arrow-rotate-right"
      label="Получить"
      unelevated
      :disabled="!canPrestige"
      @click="onPrestige"
      :class="{ 'prestige-btn-glow': canPrestige }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStorePrestige } from 'stores/prestige';
import { useStoreData } from 'stores/data';
import Decimal from 'break_eternity.js';

const storePrestige = useStorePrestige();
const storeData = useStoreData();

const formatNumber = storeData.formatNumber;

const prestige = computed(() => storePrestige.points);
const prestigeGain = computed(() => {
  if (storePrestige.prestigeGain.lt(0)) return new Decimal(0);
  return storePrestige.prestigeGain;
});
const target = computed(() => new Decimal(1));
const canPrestige = computed(() => storePrestige.prestigeCan);
const progress = computed(() => Decimal.min(prestigeGain.value.div(target.value), 1));

const onPrestige = () => {
  if (canPrestige.value) {
    storePrestige.onPrestige();
  }
};
</script>

<style lang="sass" scoped>
.prestige-card
  min-height: 320px
  max-width: 420px
  margin: 0 auto
  border-radius: 18px
  background: linear-gradient(135deg, #13141b 70%, #23243a 100%)
  box-shadow: 0 4px 24px 0 rgba(20, 22, 30, 0.32), 0 1px 8px 0 rgba(30, 35, 50, 0.18)
  color: #e0e3ea
  position: relative

.prestige-header
  letter-spacing: 0.2px
  text-shadow: 0 0 8px #1a1c28

.prestige-icon
  filter: drop-shadow(0 0 6px #2e3a5c)


.prestige-values
  border-radius: 8px
  padding: 12px 24px
  box-shadow: 0 0 8px #1a1c28
  position: relative
  min-width: 220px
  max-width: 320px
  width: 100%
  background: rgba(30,35,50,0.22)

.prestige-progress-fill
  pointer-events: none

.prestige-progress-full
  box-shadow: 0 0 16px 4px #6bbf6b99, 0 0 4px 1px #fff2

.prestige-main-value
  font-size: 2.6rem
  font-weight: 700
  color: #fff
  letter-spacing: 0.5px
  line-height: 1.1
  text-shadow: 0 0 10px #2e3a5c

.prestige-possible
  color: #6bbf6b
  text-shadow: 0 0 6px #2e3a5c
  font-size: 1.35rem
  font-weight: 600

.prestige-btn-glow
  box-shadow: 0 0 16px 2px #6bbf6b, 0 0 4px 1px #fff
  transition: box-shadow 0.2s

.prestige-progress
  box-shadow: 0 0 12px 2px #ffe08255
  background: #181a24
  border-radius: 8px
</style>
