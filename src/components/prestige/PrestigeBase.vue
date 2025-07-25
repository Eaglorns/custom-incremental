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
    >
      <div
        class="prestige-progress-fill"
        :class="{ 'prestige-progress-can': canPrestige }"
        :style="{ width: progress.toNumber() * 100 + '%' }"
        v-if="!canPrestige"
      />
      <q-icon
        name="fa-duotone fa-arrow-rotate-right"
        color="secondary"
        size="24px"
        class="q-mr-sm prestige-progress-icon"
      />
      <span class="prestige-possible">+{{ formatNumber(prestigeGain) }}</span>
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
  min-height: 220px
  max-width: 240px
  margin: 0 auto
  border-radius: 18px
  background: linear-gradient(135deg, #181a24 80%, #23243a 100%)
  box-shadow: 0 6px 24px 0 #23243a66, 0 1px 8px 0 #6bbf6b22
  color: #f8fafc
  position: relative
  transition: box-shadow 0.3s, background 0.3s

.prestige-header
  letter-spacing: 0.2px
  text-shadow: 0 1px 4px #23243a, 0 0 2px #6bbf6b22
  display: flex
  align-items: center
  justify-content: center

.prestige-icon
  filter: drop-shadow(0 0 4px #6bbf6b88)


.prestige-values
  border-radius: 12px
  padding: 10px 14px
  box-shadow: 0 2px 8px #23243a44, 0 0 2px #6bbf6b22
  position: relative
  min-width: 120px
  max-width: 180px
  width: 100%
  background: rgba(35,36,58,0.96)
  display: flex
  align-items: center
  justify-content: center
  overflow: hidden

.prestige-progress-fill
  pointer-events: none
  position: absolute
  left: 0
  top: 0
  bottom: 0
  height: 100%
  background: linear-gradient(90deg, #6bbf6b 0%, #b2ffb2 100%)
  opacity: 0.16
  border-radius: 12px
  z-index: 1
  transition: width 0.4s
.prestige-progress-can
  box-shadow: none

.prestige-progress-full
  box-shadow: 0 0 8px 2px #23243a44
.prestige-progress-icon
  z-index: 2

.prestige-main-value
  font-size: 1.5rem
  font-weight: 700
  color: #f8fafc
  letter-spacing: 0.5px
  line-height: 1.1
  text-shadow: 0 1px 6px #23243a, 0 0 2px #23243a22
  background: rgba(255,255,255,0.06)
  border-radius: 8px
  padding: 2px 12px

.prestige-possible
  color: #6bbf6b
  text-shadow: 0 1px 4px #23243a, 0 0 2px #23243a22
  font-size: 1.1rem
  font-weight: 600
  z-index: 2
  background: rgba(255,255,255,0.04)
  border-radius: 6px
  padding: 2px 8px

.prestige-btn-glow
  box-shadow: 0 0 8px 2px #23243a44
  transition: box-shadow 0.2s, transform 0.2s
  transform: scale(1.04)

.prestige-progress
  box-shadow: 0 0 4px 1px #23243a44
  background: #23243a
  border-radius: 12px
</style>
