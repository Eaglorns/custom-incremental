<template>
  <div
    class="q-gutter-md row wrap items-stretch q-pa-md research-container"
    style="overflow-y: auto"
  >
    <q-card
      v-for="meta in researchBaseMeta"
      :key="meta.key"
      flat
      bordered
      class="q-pa-md column flex justify-between research-card text-slate-100"
      :class="{
        'research-inactive': isMaxLevel(meta.key).value,
      }"
    >
      <div
        v-if="isMaxLevel(meta.key).value"
        class="q-pa-md flex flex-center text-white text-bold research-completed-banner"
      >
        <span class="research-completed-text">Завершено</span>
      </div>
      <q-tooltip
        anchor="top middle"
        self="bottom middle"
        :offset="[0, 10]"
        class="bg-slate-800 text-slate-100 research-tooltip"
      >
        <div class="text-bold research-tooltip-title">
          {{ meta.title }}
        </div>
        <div class="research-tooltip-desc">{{ meta.description }}</div>
      </q-tooltip>
      <q-card-section class="q-pa-xs">
        <div class="text-subtitle2 row items-start no-wrap research-title-row q-mb-sm">
          <q-icon :name="iconStyle + meta.icon" size="18px" class="text-blue-400 q-mr-xs" />
          <span class="research-title-text">{{ meta.title }}</span>
        </div>
      </q-card-section>
      <div class="column q-px-sm q-pt-xs q-pb-none flex-1">
        <div
          class="row items-center text-slate-400 q-mb-md"
          style="font-size: 13px; font-weight: 600"
        >
          <q-icon name="fa-duotone fa-signal-bars" class="q-mr-xs text-blue-400" />
          Уровень: {{ getResearch(meta.key).level }} / {{ getResearch(meta.key).maxLevel }}
        </div>
        <div class="row justify-between items-center q-mb-md research-info-row">
          <div class="row items-center research-cost-info">
            <q-icon
              :name="iconStyle + 'fa-flask-vial'"
              size="15px"
              class="q-mr-xs text-emerald-400"
            />
            <q-badge class="q-pa-xs text-bold research-badge">{{
              formatNumber(getResearchCost(meta.key).value)
            }}</q-badge>
          </div>
          <div class="row items-center research-time-info">
            <q-icon :name="iconStyle + 'fa-clock'" size="15px" class="q-mr-xs text-amber-400" />
            <q-badge class="q-pa-xs text-bold research-badge">{{
              storeData.formatTime(getResearchTime(meta.key).value)
            }}</q-badge>
          </div>
        </div>
        <div v-if="getResearch(meta.key).maxLevel.gt(1)">
          <q-linear-progress
            :value="getResearch(meta.key).level.div(getResearch(meta.key).maxLevel).toNumber()"
            color="green"
            size="6px"
            rounded
          />
        </div>
        <div v-else>
          <q-badge
            :color="getResearch(meta.key).level ? 'green' : 'grey'"
            style="font-size: 11px"
            >{{ getResearch(meta.key).level ? 'Изучено' : 'Не изучено' }}</q-badge
          >
        </div>

        <div class="research-actions q-mt-sm">
          <q-btn
            :disable="
              isMaxLevel(meta.key).value ||
              (!storeResearch.points.gte(getResearchCost(meta.key).value) &&
                !getResearch(meta.key).currentTime.gt(0)) ||
              (getResearchTime(meta.key).value.gt(1000) && !getResearch(meta.key).currentTime.gt(0))
            "
            size="sm"
            dense
            :label="
              getResearch(meta.key).currentTime.gt(0)
                ? `Отменить (${storeData.formatTime(getResearch(meta.key).currentTime)})`
                : 'Улучшить'
            "
            @click="startResearch(meta.key, false)"
            class="research-btn"
            :color="
              isMaxLevel(meta.key).value
                ? 'grey-8'
                : getResearch(meta.key).currentTime.gt(0)
                  ? 'negative'
                  : 'primary'
            "
          />
        </div>
      </div>
      <q-separator spaced class="q-my-xs" />
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useStoreData } from 'stores/data';
import Decimal from 'break_eternity.js';
import type { ResearchBase } from 'src/constants/models';
import { researchBaseMeta } from 'src/constants/researchBaseMeta';
import { useStoreResearch } from 'stores/research';
import { useStoreSetting } from 'stores/setting';

const storeData = useStoreData();
const storeResearch = useStoreResearch();
const storeSetting = useStoreSetting();

const iconStyle = computed(() => {
  return storeSetting.iconStyle;
});

const formatNumber = storeData.formatNumber;

const researchList = storeResearch.base as Record<string, ResearchBase>;

function getResearch(key: string) {
  if (!researchList[key])
    return {
      cost: new Decimal(0),
      currentTime: new Decimal(0),
      time: new Decimal(0),
      bonus: new Decimal(0),
      level: new Decimal(0),
      costMultiply: new Decimal(1),
      timeMultiply: new Decimal(1),
      maxLevel: new Decimal(1),
    };
  return researchList[key];
}

function isMaxLevel(metaKey: string) {
  return computed(() => {
    const research = getResearch(metaKey);
    return research.level.gte(research.maxLevel);
  });
}

function getResearchCost(key: string) {
  const research = researchList[key];
  if (!research) return computed(() => new Decimal(0));
  return computed(() =>
    research.level.eq(0)
      ? research.cost
      : research.cost.mul(research.costMultiply.pow(research.level)),
  );
}

function getResearchTime(key: string) {
  const research = researchList[key];
  if (!research) return computed(() => new Decimal(0));
  return computed(() => {
    const divTime = storeResearch.speed.gt(0) ? storeResearch.getResearchSpeed : new Decimal(1);
    const result = research.level.lt(1)
      ? research.time.div(divTime)
      : research.time.mul(research.timeMultiply.pow(research.level)).div(divTime);
    return result;
  });
}

function startResearch(key: string, isLoad: boolean) {
  const research = researchList[key];
  if (!research) return;

  if (!isLoad && research.currentTime.gt(0)) {
    cancelResearch(key);
    return;
  }

  if (!isLoad) {
    if (isMaxLevel(key).value) return;
    if (research.currentTime.gt(0)) return;
  }

  const cost = getResearchCost(key).value;
  const time = getResearchTime(key).value;

  if (!isLoad) {
    if (!storeResearch.points.gte(cost)) return;
    storeResearch.points = storeResearch.points.minus(cost);
    research.currentTime = time;
    research.isActive = true;
  } else {
    research.isActive = true;
  }
}

function cancelResearch(key: string) {
  const research = researchList[key];
  if (!research) return;
  storeResearch.points = storeResearch.points.plus(getResearchCost(key).value);
  research.currentTime = new Decimal(0);
  research.isActive = false;
}

onMounted(() => {
  Object.entries(researchList).forEach(([key, research]) => {
    if (research.currentTime && research.currentTime.gt(0)) {
      startResearch(key, true);
    }
  });
});
</script>

<style lang="sass" scoped>
.research-container
  justify-content: center
  gap: 20px
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)
  border-radius: 12px
  padding: 24px !important

.research-card
  background: linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%)
  border: 2px solid #333
  border-radius: 16px
  min-width: 240px
  max-width: 240px
  width: 240px
  min-height: 20vh
  max-height: 40vh
  position: relative
  box-sizing: border-box
  flex: 0 0 240px
  box-shadow: 0 8px 32px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)
  backdrop-filter: blur(10px)
  overflow: hidden

.research-card::before
  content: ''
  position: absolute
  top: 0
  left: 0
  right: 0
  height: 3px
  background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)
  border-radius: 16px 16px 0 0

.research-card:hover
  box-shadow: 0 12px 40px rgba(99, 102, 241, 0.15), 0 4px 16px rgba(0,0,0,0.3)
  border-color: #6366f1

.research-actions
  display: flex
  justify-content: flex-end
  align-items: center
  padding: 0 !important
  overflow: hidden
  width: 100%
  box-sizing: border-box

.research-btn
  min-width: 120px
  max-width: 90%
  width: auto
  border-radius: 12px
  font-weight: 600
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)
  border: none
  color: white
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3)
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
  box-sizing: border-box
  padding: 10px 16px
  font-size: 13px
  flex-shrink: 0
  text-transform: uppercase
  letter-spacing: 0.5px

.research-btn:hover:not(:disabled)
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4)
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)

.research-btn:disabled
  background: linear-gradient(135deg, #374151 0%, #4b5563 100%) !important
  box-shadow: none !important

.research-btn.bg-negative
  background: linear-gradient(135deg, #ef4444 0%, #f59e0b 100%) !important

.research-btn.bg-negative:hover:not(:disabled)
  background: linear-gradient(135deg, #dc2626 0%, #d97706 100%) !important

// Мобильные устройства (до 480px)
@media (max-width: 480px)
  .research-container
    padding: 8px !important
    gap: 12px
    justify-content: center

  .research-card
    min-width: calc(100vw - 32px)
    max-width: calc(100vw - 32px)
    width: calc(100vw - 32px)
    flex: 0 0 calc(100vw - 32px)
    margin: 0 auto

  .research-btn
    min-width: 80px !important
    max-width: 90% !important
    width: auto !important
    font-size: 11px
    padding: 8px 12px !important

  .research-actions
    padding: 0 !important
    justify-content: center !important

  .research-info-row
    flex-direction: column
    gap: 8px
    align-items: flex-start !important

  .research-cost-info, .research-time-info
    width: 100%
    justify-content: flex-start

  .research-badge
    font-size: 10px !important
    max-width: calc(100% - 30px)
    word-break: break-all

  .research-title-text
    max-width: calc(100% - 30px) !important
    font-size: 13px !important
    line-height: 1.2 !important
    word-wrap: break-word !important
    hyphens: none !important
    word-break: normal !important

// Планшеты портретная ориентация (481px - 768px)
@media (min-width: 481px) and (max-width: 768px)
  .research-container
    padding: 12px !important
    gap: 14px

  .research-card
    min-width: 200px
    max-width: 200px
    width: 200px
    flex: 0 0 200px

  .research-btn
    min-width: 80px !important
    max-width: 85% !important
    font-size: 12px
    padding: 7px 10px

// Планшеты альбомная и небольшие десктопы (769px - 1024px)
@media (min-width: 769px) and (max-width: 1024px)
  .research-card
    min-width: 220px
    max-width: 220px
    width: 220px
    flex: 0 0 220px

  .research-btn
    min-width: 100px !important
    max-width: 85% !important

.q-linear-progress
  height: 12px !important
  border-radius: 8px !important
  background: #1e293b !important
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.3)
  overflow: hidden

.q-linear-progress .q-linear-progress__track
  background: linear-gradient(90deg, #10b981 0%, #34d399 50%, #6ee7b7 100%) !important
  border-radius: 8px !important
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.3)

.research-inactive
  opacity: 0.4
  filter: grayscale(0.8)
  pointer-events: none

.research-completed-banner
  background: linear-gradient(135deg, #059669 0%, #10b981 100%)
  color: white
  font-size: 18px
  letter-spacing: 1px
  z-index: 2
  pointer-events: none
  border-radius: 12px
  text-shadow: 0 2px 4px rgba(0,0,0,0.3)
  position: absolute
  top: 50%
  left: 50%
  width: calc(100% - 32px)
  transform: translate(-50%, -50%)
  text-align: center
  font-weight: 700
  box-shadow: 0 8px 32px rgba(5, 150, 105, 0.4)
  user-select: none
  padding: 16px 12px
  display: flex
  align-items: center
  justify-content: center
  border: 2px solid #34d399

.research-completed-text
  width: 100%
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
  display: block
  text-align: center

.research-tooltip
  max-width: 280px
  font-size: 13px
  line-height: 1.5
  border-radius: 12px
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%) !important
  border: 1px solid #475569
  box-shadow: 0 12px 48px rgba(0,0,0,0.3)
  backdrop-filter: blur(10px)

.research-tooltip-title
  font-size: 16px
  margin-bottom: 8px
  color: #f1f5f9
  font-weight: 600

.research-tooltip-desc
  font-size: 13px
  color: #cbd5e1
  line-height: 1.4

.research-title-row
  max-width: 100%
  overflow: visible
  background: rgba(30, 41, 59, 0.2)
  border-radius: 8px
  padding: 8px 10px
  min-height: auto
  align-items: flex-start

.research-badge
  font-size: 11px
  word-break: break-word
  max-width: 100%
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%) !important
  color: #60a5fa !important
  border: 1px solid #374151
  border-radius: 8px
  font-weight: 600
  box-shadow: 0 2px 8px rgba(0,0,0,0.2)

.research-info-row
  width: 100%
  background: rgba(15, 23, 42, 0.3)
  border-radius: 12px
  padding: 12px
  border: 1px solid #334155

.research-cost-info, .research-time-info
  flex-shrink: 1
  min-width: 0

.research-title-text
  max-width: calc(100% - 30px)
  overflow: visible
  text-overflow: clip
  white-space: normal
  color: #e2e8f0
  font-weight: 600
  line-height: 1.3
  font-size: 14px
  word-wrap: break-word
  hyphens: none
  word-break: normal

.research-card .column
  max-width: 100%
  word-break: break-word
  position: relative
  z-index: 1

.research-card .q-btn
  max-width: 100%
  word-break: break-word
  box-sizing: border-box

// Анимация для иконок
.research-card .q-icon
  // Убраны анимации

.research-card:hover .q-icon
  // Убраны анимации
</style>
