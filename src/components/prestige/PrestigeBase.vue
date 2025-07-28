<template>
  <div class="prestige-card-modern flex flex-center column items-center q-pa-xl">
    <div class="prestige-header-modern flex items-center q-mb-lg">
      <q-icon
        name="fa-duotone fa-arrow-up-right-dots"
        color="primary"
        size="36px"
        class="prestige-icon-modern q-mr-md"
      />
      <span class="prestige-main-value-modern">{{ formatNumber(prestige) }}</span>
    </div>
    <div class="prestige-progress-modern q-mb-xl">
      <div class="prestige-progress-bar-bg">
        <div
          class="prestige-progress-bar-fill"
          :class="{ 'prestige-progress-bar-can': canPrestige }"
          :style="{ width: progress.toNumber() * 100 + '%' }"
        />
      </div>
      <div class="prestige-progress-info flex items-center justify-between">
        <q-icon
          name="fa-duotone fa-arrow-rotate-right"
          color="secondary"
          size="22px"
          class="prestige-progress-icon-modern q-mr-xs"
        />
        <span class="prestige-possible-modern">+{{ formatNumber(prestigeGain) }}</span>
      </div>
    </div>
    <q-btn
      color="primary"
      size="md"
      icon="fa-duotone fa-arrow-rotate-right"
      label="Получить"
      unelevated
      :disabled="!canPrestige"
      @click="onPrestige"
      :class="{ 'prestige-btn-glow-modern': canPrestige }"
      class="prestige-btn-modern"
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
// --- Новый современный стиль ---
.prestige-card-modern
  min-height: 240px
  max-width: 270px
  margin: 0 auto
  border-radius: 22px
  background: linear-gradient(135deg, #20222e 80%, #2c2d4a 100%)
  box-shadow: 0 8px 32px 0 #23243a66, 0 2px 12px 0 #6bbf6b22
  color: #f8fafc
  position: relative
  transition: box-shadow 0.3s, background 0.3s

.prestige-header-modern
  letter-spacing: 0.3px
  text-shadow: 0 2px 8px #23243a, 0 0 2px #6bbf6b22
  display: flex
  align-items: center
  justify-content: center

.prestige-icon-modern
  filter: drop-shadow(0 0 6px #6bbf6b88)

.prestige-main-value-modern
  font-size: 1.7rem
  font-weight: 700
  color: #f8fafc
  letter-spacing: 0.7px
  line-height: 1.1
  text-shadow: 0 2px 8px #23243a, 0 0 2px #23243a22
  background: rgba(255,255,255,0.08)
  border-radius: 10px
  padding: 4px 16px

.prestige-progress-modern
  width: 100%
  max-width: 200px
  margin: 0 auto
  display: flex
  flex-direction: column
  gap: 6px

.prestige-progress-bar-bg
  width: 100%
  height: 18px
  background: rgba(35,36,58,0.96)
  border-radius: 12px
  box-shadow: 0 2px 8px #23243a44, 0 0 2px #6bbf6b22
  position: relative
  overflow: hidden

.prestige-progress-bar-fill
  position: absolute
  left: 0
  top: 0
  height: 100%
  background: linear-gradient(90deg, #6bbf6b 0%, #b2ffb2 100%)
  opacity: 0.22
  border-radius: 12px
  z-index: 1
  transition: width 0.4s
.prestige-progress-bar-can
  box-shadow: 0 0 8px 2px #6bbf6b44

.prestige-progress-info
  width: 100%
  display: flex
  align-items: center
  justify-content: space-between
  margin-top: 2px

.prestige-progress-icon-modern
  z-index: 2

.prestige-possible-modern
  color: #6bbf6b
  text-shadow: 0 2px 8px #23243a, 0 0 2px #23243a22
  font-size: 1.13rem
  font-weight: 600
  z-index: 2
  background: rgba(255,255,255,0.07)
  border-radius: 7px
  padding: 3px 10px

.prestige-btn-modern
  margin-top: 8px
  width: 100%
  max-width: 180px

.prestige-btn-glow-modern
  box-shadow: 0 0 12px 3px #6bbf6b44
  transition: box-shadow 0.2s, transform 0.2s
  transform: scale(1.05)
</style>
