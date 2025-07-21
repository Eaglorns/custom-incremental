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
    <div class="prestige-values q-mb-xl flex items-center justify-center">
      <q-icon
        name="fa-duotone fa-arrow-rotate-right"
        color="secondary"
        size="24px"
        class="q-mr-sm"
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
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStoreGame } from 'src/stores/game';

const storeGame = useStoreGame();

const formatNumber = storeGame.formatNumber;

const prestige = computed(() => storeGame.prestige);
const prestigeGain = computed(() => storeGame.prestigeGain);
const canPrestige = computed(() => prestigeGain.value.gte(1));

const onPrestige = () => {
  if (canPrestige.value) {
    storeGame.onPrestige();
  }
};
</script>

<style lang="sass">
.prestige-card
  min-height: 320px
  max-width: 420px
  margin: 0 auto
  border-radius: 16px
  background: linear-gradient(135deg, #181a24 70%, #23243a 100%)
  box-shadow: 0 2px 16px 0 rgba(30, 35, 50, 0.18), 0 1px 4px 0 rgba(30, 35, 50, 0.10)
  color: #e0e3ea
  transition: box-shadow 0.2s
  position: relative

.prestige-header
  letter-spacing: 0.2px
  text-shadow: none

.prestige-icon
  filter: none

.prestige-values
  background: rgba(30,35,50,0.18)
  border-radius: 8px
  padding: 12px 24px 12px 24px
  box-shadow: none

.prestige-main-value
  font-size: 2.6rem
  font-weight: 700
  color: #fff
  letter-spacing: 0.5px
  line-height: 1.1

.prestige-possible
  color: #6bbf6b
  text-shadow: none
  font-size: 1.35rem
  font-weight: 600
</style>
