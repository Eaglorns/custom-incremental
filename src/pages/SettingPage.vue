<template>
  <q-page class="p-2 sm:p-6 bg-dark text-white text-xs sm:text-sm">
    <div class="settings-container">
      <div class="q-gutter-y-lg">
        <div class="text-2xl sm:text-h4 text-weight-bold text-center">
          <i :class="iconStyle + 'fa-gear'" size="32px" color="primary" class="q-mr-sm" />
          Настройки
        </div>
        <q-card class="bg-grey-9 text-white setting-card" flat bordered>
          <q-card-section class="q-pa-md">
            <div class="row items-center q-mb-md">
              <i
                :class="iconStyle + volumeIcon"
                size="24px"
                :color="audioEnabled ? 'secondary' : 'grey-6'"
                class="q-mr-md"
              />
              <div
                class="text-sm sm:text-subtitle1 text-weight-medium"
                :class="{ 'text-grey-6': !audioEnabled }"
              >
                Звук
              </div>
              <q-space />
              <div class="row items-center q-gutter-md">
                <div
                  class="text-base sm:text-h6 text-weight-bold"
                  :class="{ 'text-grey-6': !audioEnabled }"
                >
                  {{ volumePercent }}%
                </div>
                <q-toggle
                  v-model="audioEnabled"
                  color="primary"
                  size="lg"
                  :icon="iconStyle + volumeIcon"
                />
              </div>
            </div>
            <div class="row items-center">
              <i
                :class="iconStyle + 'fa-volume-off'"
                size="20px"
                :color="audioEnabled ? 'grey-5' : 'grey-7'"
                class="q-mr-sm"
              />
              <q-slider
                v-model="audioVolume"
                :min="0"
                :max="1"
                :step="0.01"
                :color="audioEnabled ? 'primary' : 'grey-6'"
                track-color="grey-7"
                class="col"
                :disable="!audioEnabled"
              />
              <i
                :class="iconStyle + 'fa-volume-high'"
                size="20px"
                :color="audioEnabled ? 'grey-5' : 'grey-7'"
                class="q-ml-sm"
              />
            </div>
          </q-card-section>
        </q-card>
        <q-card class="bg-grey-9 text-white" flat bordered>
          <q-card-section>
            <div class="text-base sm:text-h6 text-weight-bold q-mb-md">
              <i :class="iconStyle + 'fa-icons'" size="20px" color="secondary" class="q-mr-sm" />
              Стиль иконок
            </div>
            <div class="q-gutter-md">
              <q-option-group
                v-model="selectedIconStyle"
                :options="iconStyleOptions"
                color="primary"
                type="radio"
                class="text-white"
              >
                <template v-slot:label="opt">
                  <div class="column q-gutter-xs">
                    <div class="row items-center q-gutter-sm">
                      <span class="text-weight-medium">{{ opt.label }}</span>
                    </div>
                    <div class="row items-center q-gutter-sm">
                      <i :class="opt.value + 'fa-star'" size="22px" />
                      <i :class="opt.value + 'fa-heart'" size="22px" />
                      <i :class="opt.value + 'fa-home'" size="22px" />
                      <i :class="opt.value + 'fa-user'" size="22px" />
                      <i :class="opt.value + 'fa-cog'" size="22px" />
                      <i :class="opt.value + 'fa-chart-line'" size="22px" />
                      <i :class="opt.value + 'fa-shield'" size="22px" />
                      <i :class="opt.value + 'fa-lightning-bolt'" size="22px" />
                    </div>
                  </div>
                </template>
              </q-option-group>
            </div>
          </q-card-section>
        </q-card>
        <q-card class="bg-grey-9 text-white" flat bordered>
          <q-card-section>
            <div class="text-base sm:text-h6 text-weight-bold q-mb-md">
              <i :class="iconStyle + 'fa-sliders'" size="20px" color="secondary" class="q-mr-sm" />
              Общие настройки
            </div>
            <div class="text-center text-grey-5 q-py-lg">В разработке</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStoreSetting } from 'stores/setting';

const storeSetting = useStoreSetting();

const iconStyle = computed(() => {
  return storeSetting.iconStyle;
});

const audioEnabled = computed({
  get: () => storeSetting.audio.enabled,
  set: (val: boolean) => {
    storeSetting.audio.enabled = val;
  },
});

const audioVolume = computed({
  get: () => storeSetting.audio.volume,
  set: (val: number) => {
    storeSetting.setVolume(val);
  },
});

const volumePercent = computed(() =>
  audioEnabled.value ? Math.round(audioVolume.value * 100) : 0,
);

const volumeIcon = computed(() => {
  if (!audioEnabled.value) {
    return 'fa-volume-xmark';
  }

  const volume = audioVolume.value;
  if (volume === 0) {
    return 'fa-volume-off';
  } else if (volume <= 0.33) {
    return 'fa-volume-low';
  } else if (volume <= 0.66) {
    return 'fa-volume';
  } else {
    return 'fa-volume-high';
  }
});

const iconStyleOptions = [
  { label: 'Duotone', value: 'fa-duotone ' },
  { label: 'Sharp Duotone', value: 'fa-sharp-duotone ' },
  { label: 'Classic', value: 'fa-solid ' },
  { label: 'Sharp', value: 'fa-sharp ' },
];

const selectedIconStyle = computed({
  get: () => storeSetting.iconStyle,
  set: (val: string) => {
    storeSetting.iconStyle = val;
  },
});
</script>

<style lang="scss" scoped>
.settings-container {
  max-width: 800px;
  margin: 0 auto;
}

.setting-card {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.setting-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.disabled-card {
  opacity: 0.6;
}

.disabled-card:hover {
  transform: none;
  box-shadow: none;
}

.q-card {
  border-radius: 12px;
}

.q-toggle {
  transform: scale(1.1);
}

.q-slider {
  min-width: 200px;
}
</style>
