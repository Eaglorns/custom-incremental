<template>
  <div class="tab-layout">
    <template v-if="isMobile">
      <q-tabs
        :model-value="activeTab"
        @update:model-value="(val) => $emit('update:activeTab', val as string)"
        align="justify"
        class="text-teal"
      >
        <q-tab v-for="tab in tabs" :key="tab.name" :name="tab.name">
          <template v-slot:default>
            <div class="q-tab__content row no-wrap flex-center q-tab__content--inline">
              <i :class="tab.icon" class="q-tab__icon" />
              <div class="q-tab__label">{{ tab.label }}</div>
            </div>
          </template>
        </q-tab>
      </q-tabs>
      <q-tab-panels
        :model-value="activeTab"
        @update:model-value="(val) => $emit('update:activeTab', val as string)"
        transition-prev="slide-down"
        transition-next="slide-up"
      >
        <q-tab-panel v-for="tab in tabs" :key="tab.name" :name="tab.name">
          <slot :name="tab.name" />
        </q-tab-panel>
      </q-tab-panels>
    </template>

    <template v-else>
      <q-splitter
        :model-value="splitterModel"
        @update:model-value="(val) => $emit('update:splitterModel', val as number)"
      >
        <template v-slot:before>
          <q-tabs
            :model-value="activeTab"
            @update:model-value="(val) => $emit('update:activeTab', val as string)"
            vertical
            align="left"
            class="text-teal"
          >
            <q-tab v-for="tab in tabs" :key="tab.name" :name="tab.name">
              <template v-slot:default>
                <div class="q-tab__content column no-wrap flex-center q-tab__content--inline">
                  <i :class="tab.icon" class="q-tab__icon" />
                  <div class="q-tab__label">{{ tab.label }}</div>
                </div>
              </template>
            </q-tab>
          </q-tabs>
        </template>
        <template v-slot:after>
          <q-tab-panels
            :model-value="activeTab"
            @update:model-value="(val) => $emit('update:activeTab', val as string)"
            transition-prev="slide-down"
            transition-next="slide-up"
          >
            <q-tab-panel v-for="tab in tabs" :key="tab.name" :name="tab.name">
              <slot :name="tab.name" />
            </q-tab-panel>
          </q-tab-panels>
        </template>
      </q-splitter>
    </template>
  </div>
</template>

<script setup lang="ts">
interface Tab {
  name: string;
  icon: string;
  label: string;
}

interface Props {
  tabs: Tab[];
  activeTab: string;
  splitterModel: number;
  isMobile: boolean;
}

defineProps<Props>();

defineEmits<{
  'update:activeTab': [value: string];
  'update:splitterModel': [value: number];
}>();
</script>

<style scoped>
.tab-layout {
  width: 100%;
  height: 100%;
}

.q-tab__content {
  transition: all 0.3s ease;
}

.q-tab__icon {
  font-size: 18px;
  transition: all 0.3s ease;
}

.q-tab__label {
  transition: all 0.3s ease;
}

/* Мобильная версия - иконки и текст в ряд */
.q-tab__content.row .q-tab__icon {
  margin-right: 8px;
}

/* Десктопная версия - иконки и текст в колонку */
.q-tab__content.column .q-tab__icon {
  margin-bottom: 4px;
}
</style>
