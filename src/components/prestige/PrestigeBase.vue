<template>
  <div class="prestige-card-modern flex flex-center column items-center q-pa-xl">
    <div class="prestige-header-modern flex items-center q-mb-lg">
      <i
        :class="iconStyle + 'fa-arrow-up-right-dots'"
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
          :style="{ width: progressPercent + '%' }"
        />
      </div>
      <div class="prestige-progress-info flex items-center justify-between row">
        <div v-if="prestigeTimeLeft" class="prestige-time-left">~{{ prestigeTimeLeft }}</div>
        <span class="prestige-possible-modern">+{{ formatNumber(prestigeGain) }}</span>
      </div>
    </div>
    <q-btn
      color="brown-5"
      size="md"
      icon="fa-duotone fa-arrow-rotate-right"
      label="Получить"
      unelevated
      rounded
      :disabled="!canPrestige"
      @click="onPrestige"
      class="prestige-btn-modern"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStorePrestige } from 'stores/prestige';
import { useStoreData } from 'stores/data';
import Decimal from 'break_eternity.js';
import { useStoreSetting } from 'stores/setting';

const D0 = new Decimal(0);
const D1 = new Decimal(1);

const storePrestige = useStorePrestige();
const storeData = useStoreData();
const storeSetting = useStoreSetting();

const iconStyle = computed(() => {
  return storeSetting.iconStyle;
});

const formatNumber = storeData.formatNumber;

const prestige = computed(() => storePrestige.points);
const prestigeGain = computed(() => Decimal.max(storePrestige.prestigeGain, D0));
const canPrestige = computed(() => storePrestige.prestigeCan);
const progress = computed(() => Decimal.min(prestigeGain.value, D1));
const progressPercent = computed(() => progress.value.toNumber() * 100);

const prestigeTimeLeft = computed(() => {
  const epic = storeData.epicNumber;
  const gain = storeData.epicNumberGain;
  if (canPrestige.value || epic.lte(0) || gain.lte(0)) return null;

  const toTarget = Decimal.max(storePrestige.getEpicNumberToPrestige.minus(epic), D0);
  const seconds = toTarget.div(gain);

  if (seconds.lt(1)) return null;
  return storeData.formatTime(seconds);
});

const onPrestige = () => {
  if (canPrestige.value) {
    storePrestige.onPrestige();
  }
};
</script>

<style lang="scss" scoped>
.prestige-card-modern {
  min-height: 240px;
  max-width: 270px;
  margin: 0 auto;
  border-radius: 22px;
  background: linear-gradient(135deg, #20222e 80%, #2c2d4a 100%);
  color: #f8fafc;
  position: relative;
  transition: background 0.3s;
}

.prestige-header-modern {
  letter-spacing: 0.3px;
  text-shadow:
    0 2px 8px #23243a,
    0 0 2px #6bbf6b22;
  display: flex;
  align-items: center;
  justify-content: center;
}

.prestige-main-value-modern {
  font-size: 1.7rem;
  font-weight: 700;
  letter-spacing: 0.7px;
  line-height: 1.1;
  text-shadow:
    0 2px 8px #23243a,
    0 0 2px #23243a22;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  padding: 4px 16px;
  color: #ffffff;
}

.prestige-progress-modern {
  width: 100%;
  max-width: 200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.prestige-progress-bar-bg {
  width: 100%;
  height: 18px;
  background: rgba(35, 36, 58, 0.96);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.prestige-progress-bar-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, #6bbf6b 0%, #b2ffb2 100%);
  opacity: 0.22;
  border-radius: 12px;
  z-index: 1;
  transition: width 0.4s;
}

.prestige-progress-info {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
}

.prestige-time-left {
  color: #b2ffb2;
  font-size: 0.98em;
  font-weight: 500;
  opacity: 0.85;
  margin-left: 2px;
}

.prestige-progress-icon-modern {
  z-index: 2;
}

.prestige-possible-modern {
  font-size: 1.13rem;
  font-weight: 600;
  z-index: 2;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 7px;
  padding: 3px 10px;
  color: #ffffff;
}

.prestige-btn-modern {
  margin-top: 8px;
  width: 100%;
  max-width: 180px;
}
</style>
