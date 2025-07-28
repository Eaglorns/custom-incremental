<template>
  <q-page class="q-pa-lg bg-dark text-white">
    <div class="settings-container">
      <div class="q-gutter-y-lg">
        <div class="text-h4 text-weight-bold text-center">
          <q-icon name="fa-duotone fa-gear" size="32px" color="primary" class="q-mr-sm" />
          Настройки
        </div>
        <q-card class="bg-grey-9 text-white setting-card" flat bordered>
          <q-card-section class="q-pa-md">
            <div class="row items-center q-mb-md">
              <q-icon
                :name="volumeIcon"
                size="24px"
                :color="audioEnabled ? 'secondary' : 'grey-6'"
                class="q-mr-md"
              />
              <div
                class="text-subtitle1 text-weight-medium"
                :class="{ 'text-grey-6': !audioEnabled }"
              >
                Звук
              </div>
              <q-space />
              <div class="row items-center q-gutter-md">
                <div class="text-h6 text-weight-bold" :class="{ 'text-grey-6': !audioEnabled }">
                  {{ audioEnabled ? Math.round(audioVolume * 100) : 0 }}%
                </div>
                <q-toggle v-model="audioEnabled" color="primary" size="lg" :icon="volumeIcon" />
              </div>
            </div>
            <div class="row items-center">
              <q-icon
                name="fa-duotone fa-volume-off"
                size="16px"
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
              />
              <q-icon
                name="fa-duotone fa-volume-high"
                size="16px"
                :color="audioEnabled ? 'grey-5' : 'grey-7'"
                class="q-ml-sm"
              />
            </div>
          </q-card-section>
        </q-card>
        <q-card class="bg-grey-9 text-white" flat bordered>
          <q-card-section>
            <div class="text-h6 text-weight-bold q-mb-md">
              <q-icon name="fa-duotone fa-sliders" size="20px" color="secondary" class="q-mr-sm" />
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

const audioEnabled = computed({
  get: () => storeSetting.audio.enabled,
  set: (val: boolean) => {
    storeSetting.audio.enabled = val;
  },
});

const audioVolume = computed({
  get: () => storeSetting.audio.volume,
  set: (val: number) => {
    storeSetting.audio.volume = val;
  },
});

const volumeIcon = computed(() => {
  if (!audioEnabled.value) {
    return 'fa-duotone fa-volume-xmark';
  }

  const volume = audioVolume.value;
  if (volume === 0) {
    return 'fa-duotone fa-volume-off';
  } else if (volume <= 0.33) {
    return 'fa-duotone fa-volume-low';
  } else if (volume <= 0.66) {
    return 'fa-duotone fa-volume';
  } else {
    return 'fa-duotone fa-volume-high';
  }
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
