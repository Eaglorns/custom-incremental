<template>
  <q-layout view="lHh lpr lFf" class="shadow-2 rounded-borders min-h-screen text-xs sm:text-sm">
    <q-header elevated>
      <q-bar
        class="q-electron-drag bg-grey-10 flex min-w-0 flex-nowrap items-center overflow-hidden px-1 py-1 sm:px-2"
      >
        <div class="ml-1 min-w-0 truncate text-xs font-bold sm:ml-3 sm:text-lg">
          <i
            :class="[iconStyle + 'fa-arrow-trend-up', 'mr-1 sm:mr-2']"
            size="20px"
            color="grey-4"
          />
          {{ storeGame.name }}
        </div>
        <div class="ml-1 shrink-0 text-[10px] font-bold sm:ml-3 sm:text-base md:text-lg">
          v{{ storeGame.version }}
        </div>
        <q-space />
        <q-select
          v-model="locale"
          :options="localeOptions"
          label="Language"
          dense
          borderless
          emit-value
          map-options
          options-dense
          class="ml-2 w-20 max-w-30 text-xs sm:w-32 sm:max-w-37.5 sm:text-sm"
        />
      </q-bar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useStoreGame } from 'stores/game';
import { useI18n } from 'vue-i18n';
import { useStoreSetting } from 'stores/setting';
import { computed } from 'vue';

const storeGame = useStoreGame();
const storeSetting = useStoreSetting();

const iconStyle = computed(() => {
  return storeSetting.iconStyle;
});

const { locale } = useI18n({ useScope: 'global' });

const localeOptions = [
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
];
</script>
