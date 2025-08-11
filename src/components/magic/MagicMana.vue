<template>
  <div class="magic-mana">
    <q-card flat bordered class="mana-card">
      <div class="points-display q-pa-lg">
        <div class="points-value">
          <i :class="iconStyle + 'fa-droplet'" class="points-icon" />
          <span class="value-number">{{ formatNumber(storeMagic.points) }}</span>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStoreMagic } from 'stores/magic';
import { useStoreSetting } from 'stores/setting';
import { useStoreData } from 'stores/data';

const storeMagic = useStoreMagic();
const storeSetting = useStoreSetting();
const storeData = useStoreData();

const iconStyle = computed(() => storeSetting.iconStyle);
const formatNumber = storeData.formatNumber;
</script>

<style lang="scss" scoped>
.mana-card {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  background:
    radial-gradient(
      120% 100% at 20% 0%,
      rgba(64, 156, 255, 0.18) 0%,
      rgba(13, 16, 43, 0.16) 45%,
      rgba(13, 16, 43, 0) 100%
    ),
    linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(100, 181, 246, 0.3);
  box-shadow:
    0 0 24px rgba(33, 150, 243, 0.18),
    inset 0 0 12px rgba(100, 181, 246, 0.08);
}

.mana-card::before {
  content: '';
  position: absolute;
  inset: -40%;
  background:
    radial-gradient(40% 40% at 20% 20%, rgba(100, 181, 246, 0.35), transparent 60%),
    radial-gradient(35% 35% at 80% 30%, rgba(128, 216, 255, 0.25), transparent 60%);
  filter: blur(40px);
  opacity: 0.4;
  pointer-events: none;
}

.mana-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    110deg,
    rgba(102, 178, 255, 0) 15%,
    rgba(102, 178, 255, 0.08) 35%,
    rgba(168, 240, 255, 0.15) 50%,
    rgba(102, 178, 255, 0.08) 65%,
    rgba(102, 178, 255, 0) 85%
  );
  background-size: 200% 100%;
  background-position: -100% 0;
  opacity: 0.6;
  pointer-events: none;
}

.points-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.points-value {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  font-size: 34px;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: 0.2px;
  background: linear-gradient(90deg, #e6f3ff 0%, #9cd1ff 35%, #66b2ff 70%, #a8f0ff 100%);
  background-size: 100% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 3px 14px rgba(100, 181, 246, 0.35);
}

.points-icon {
  color: #80d8ff;
  text-shadow:
    0 0 6px rgba(128, 216, 255, 0.7),
    0 0 16px rgba(100, 181, 246, 0.5);
  font-size: 0.9em;
}

@media (max-width: 700px) {
  .points-value {
    font-size: 24px;
  }
}

/* All animations removed by request */
</style>
