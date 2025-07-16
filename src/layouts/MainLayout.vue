<template>
  <q-layout view="lHh lpr lFf" class="shadow-2 rounded-borders">
    <q-header elevated>
      <q-bar class="q-electron-drag bg-grey-10">
        <q-icon name="fa-duotone fa-arrow-trend-up" size="16px" color="grey-4" />
        <div class="text-h6 text-weight-bold q-ml-md">{{ storeGlobal.app.name }}</div>
        <span class="q-ml-sm text-caption text-grey-4" style="font-style: italic">
          v{{ storeGlobal.app.version }}
        </span>
        <q-space />
        <q-select
          v-model="locale"
          :options="localeOptions"
          label="Quasar Language"
          dense
          borderless
          emit-value
          map-options
          options-dense
          style="min-width: 150px"
        />
      </q-bar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useStoreGlobal } from 'src/stores/global';
import { useI18n } from 'vue-i18n';

const storeGlobal = useStoreGlobal();

const { locale } = useI18n({ useScope: 'global' });

const localeOptions = [
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
];
</script>
