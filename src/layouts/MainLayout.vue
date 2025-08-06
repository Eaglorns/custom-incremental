<template>
  <q-layout view="lHh lpr lFf" class="shadow-2 rounded-borders">
    <q-header elevated>
      <q-bar class="q-electron-drag bg-grey-10">
        <div class="text-h6 text-weight-bold q-ml-md">
          <i :class="iconStyle + 'fa-arrow-trend-up'" size="16px" color="grey-4" />
          {{ storeGame.name }}
        </div>
        <div class="text-h6 text-weight-bold q-ml-md">v{{ storeGame.version }}</div>
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

<style lang="sass" scoped>
.q-bar.q-electron-drag
  display: flex
  flex-direction: row
  flex-wrap: nowrap
  align-items: center
  overflow: hidden
  min-width: 0
  i, .text-h6, .text-caption, .q-select
    min-width: 0
    max-width: 100%
    overflow: hidden
    text-overflow: ellipsis
  .q-space
    flex: 1 1 auto
  .q-select
    max-width: 150px
    min-width: 60px
    font-size: 14px
    margin-left: 8px
  .text-h6
    margin-left: 8px
  .text-caption
    margin-left: 4px
  i
    margin-right: 4px
@media (max-width: 700px)
  .text-h6
    font-size: 15px
    text-align: left
  i
    margin-right: 8px
    margin-bottom: 0
  .q-select
    right: 0
    font-size: 14px
  .text-caption
    margin: 0 0 4px 0
    font-size: 13px
</style>
