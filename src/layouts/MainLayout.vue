<template>
  <q-layout view="lHh lpr lFf" class="shadow-2 rounded-borders">
    <q-header elevated>
      <q-bar class="q-electron-drag bg-grey-10">
        <q-icon name="fa-duotone fa-microchip" size="14px" color="grey-4" />
        <div class="text-h6 text-weight-bold q-ml-md">{{ storeGlobal.app.name }}</div>
        <span class="q-ml-sm text-caption text-grey-4" style="font-style: italic">
          v{{ storeGlobal.app.version }}
        </span>
        <q-space />
        <q-btn
          dense
          flat
          icon="fa-duotone fa-window-minimize"
          @click="minimize"
          size="14px"
          color="grey-2"
        />
        <q-btn
          dense
          flat
          icon="fa-duotone fa-window-maximize"
          @click="toggleMaximize"
          size="14px"
          color="grey-2"
        />
        <q-btn dense flat icon="fa-duotone fa-xmark" @click="closeApp" size="22px" color="red-4" />
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

declare global {
  interface Window {
    myWindowAPI: {
      minimize: () => void;
      toggleMaximize: () => void;
      close: () => void;
    };
  }
}

const minimize = () => {
  if (process.env.MODE === 'electron') {
    window.myWindowAPI.minimize();
  }
};

const toggleMaximize = () => {
  if (process.env.MODE === 'electron') {
    window.myWindowAPI.toggleMaximize();
  }
};

const closeApp = () => {
  if (process.env.MODE === 'electron') {
    window.myWindowAPI.close();
  }
};
</script>
