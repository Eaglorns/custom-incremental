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
      </q-bar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useStoreGlobal } from 'src/stores/global';

const storeGlobal = useStoreGlobal();
</script>
