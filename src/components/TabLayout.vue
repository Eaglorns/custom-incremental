<template>
  <div class="tab-layout text-xs sm:text-sm">
    <template v-if="isMobile">
      <q-tabs
        :model-value="activeTab"
        @update:model-value="(val) => $emit('update:activeTab', val as string)"
        align="justify"
        class="text-teal"
      >
        <q-tab
          v-for="tab in tabs"
          :key="tab.name"
          :name="tab.name"
          :disable="tab.disabled"
          :class="{ 'cursor-not-allowed': tab.disabled }"
        >
          <template v-slot:default>
            <div class="q-tab__content row">
              <i
                :class="tab.disabled && tab.disabledIcon ? tab.disabledIcon : tab.icon"
                class="q-tab__icon"
              />
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
            <q-tab
              v-for="tab in tabs"
              :key="tab.name"
              :name="tab.name"
              :disable="tab.disabled"
              :class="{ 'cursor-not-allowed': tab.disabled }"
            >
              <template v-slot:default>
                <div class="q-tab__content column">
                  <i
                    :class="tab.disabled && tab.disabledIcon ? tab.disabledIcon : tab.icon"
                    class="q-tab__icon"
                  />
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
  disabled?: boolean;
  disabledIcon?: string;
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
  min-height: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.q-tab__icon {
  font-size: 18px;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.q-tab__label {
  transition: all 0.3s ease;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.q-tab__content.row {
  flex-direction: row;
  gap: 8px;
}

.q-tab__content.row .q-tab__icon {
  width: 20px;
  text-align: center;
}

.q-tab__content.row .q-tab__label {
  flex: 1;
  min-width: 0;
}

.q-tab__content.column {
  flex-direction: column;
  gap: 4px;
  min-width: 80px;
  padding: 8px 4px;
}

.q-tab__content.column .q-tab__icon {
  width: 100%;
  text-align: center;
}

.q-tab__content.column .q-tab__label {
  width: 100%;
  font-size: 12px;
  line-height: 1.2;
}

:deep(.q-tab--active) .q-tab__content {
  background-color: rgba(26, 188, 156, 0.1);
  border-radius: 8px;
  transform: scale(1.02);
}

:deep(.q-tab--active) .q-tab__icon {
  color: #1abc9c;
  font-weight: bold;
}

:deep(.q-tab--active) .q-tab__label {
  color: #1abc9c;
  font-weight: bold;
}

:deep(.q-tab:hover:not(.q-tab--active)) .q-tab__content {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transform: scale(1.01);
}

:deep(.q-tab:hover:not(.q-tab--active)) .q-tab__icon {
  color: #26c6da;
}

:deep(.q-tab:hover:not(.q-tab--active)) .q-tab__label {
  color: #26c6da;
}

:deep(.q-tab--active)::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 3px;
  background-color: #1abc9c;
  border-radius: 2px;
}

:deep(.q-tabs--vertical .q-tab--active)::before {
  bottom: auto;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 30px;
}
</style>
