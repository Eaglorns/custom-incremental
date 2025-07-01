<template>
  <div class="research-card-container">
    <q-card
      v-for="meta in researchMeta"
      :key="meta.key"
      class="card-main-custom q-pa-md research-card"
      flat
      bordered
      :class="{
        active: researchingKey === meta.key,
        inactive: (researchingKey && researchingKey !== meta.key) || isMaxLevel(meta.key).value,
        completed: isMaxLevel(meta.key).value,
      }"
    >
      <div v-if="isMaxLevel(meta.key).value" class="completed-banner">Завершено</div>
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 10]" class="tooltip-desc">
        <div class="tooltip-title">{{ meta.title }}</div>
        <div class="tooltip-text">
          {{ meta.description }}
        </div>
      </q-tooltip>
      <q-card-section class="q-pa-sm card-section-fixed">
        <div class="text-subtitle2 row items-center no-wrap">
          <q-icon :name="meta.icon" size="18px" class="icon-cpu-custom q-mr-xs research-icon" />
          {{ meta.title }}
        </div>
      </q-card-section>
      <div class="research-bottom q-px-sm q-pt-xs q-pb-none">
        <div class="level-info q-mb-xs">
          <q-icon name="fa-duotone fa-signal-bars" class="level-icon" />
          Уровень: {{ getResearch(meta.key).level }} / {{ getResearch(meta.key).maxLevel }}
        </div>
        <div class="row justify-between items-center q-mb-xs research-cost-time-row">
          <div class="row items-center">
            <q-icon name="fa-duotone fa-coins" size="15px" class="q-mr-xs cost-icon" />
            <q-badge class="text-label-custom" style="font-size: 11px">
              {{ formatNumber(getResearchCost(meta.key).value) }}
            </q-badge>
          </div>
          <div class="row items-center">
            <q-icon name="fa-duotone fa-clock" size="15px" class="q-mr-xs time-icon" />
            <q-badge class="text-label-custom" style="font-size: 11px">
              {{ formatNumber(getResearchTime(meta.key).value) }} сек
            </q-badge>
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
          <q-badge :color="getResearch(meta.key).level ? 'green' : 'grey'" style="font-size: 11px">
            {{ getResearch(meta.key).level ? 'Изучено' : 'Не изучено' }}
          </q-badge>
        </div>
      </div>
      <q-separator spaced class="q-my-xs" />
      <q-card-actions align="right" class="q-pa-none q-mt-auto">
        <q-btn
          :disable="
            (researchingKey && researchingKey !== meta.key) ||
            isMaxLevel(meta.key).value ||
            (!storeGame.epicNumber.gte(getResearchCost(meta.key).value) &&
              !(researchingKey === meta.key && getResearch(meta.key).currentTime.gt(0))) ||
            (getResearchTime(meta.key).value.gt(1000) &&
              !(researchingKey === meta.key && getResearch(meta.key).currentTime.gt(0)))
          "
          size="sm"
          dense
          :label="
            researchingKey === meta.key && getResearch(meta.key).currentTime.gt(0)
              ? `Отменить (${formatNumber(getResearch(meta.key).currentTime)} сек.)`
              : 'Улучшить'
          "
          @click="startResearch(meta.key, false)"
          :class="[
            'btn-main-custom',
            { cancel: researchingKey === meta.key && getResearch(meta.key).currentTime.gt(0) },
          ]"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useStoreGame } from 'src/stores/game';
import Decimal from 'break_eternity.js';
import type { Research } from 'components/models';
import { researchMeta } from 'src/constants/researchMeta';

const storeGame = useStoreGame();
const formatNumber = storeGame.formatNumber;

const researchList = storeGame.research.list as Record<string, Research>;

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

const researchingKey = computed(() => storeGame.research.researchingKey);

function getResearchCost(key: string) {
  const research = researchList[key];
  if (!research) return computed(() => new Decimal(0));
  return computed(() =>
    research.level.eq(0)
      ? research.cost
      : research.cost.mul(research.costMultiply.mul(research.level)),
  );
}

function getResearchTime(key: string) {
  const research = researchList[key];
  if (!research) return computed(() => new Decimal(0));
  return computed(() =>
    research.level.eq(0)
      ? research.time
      : research.time.mul(research.timeMultiply.mul(research.level)),
  );
}

function startResearch(key: string, isLoad: boolean) {
  const research = researchList[key];
  if (!research) return;

  if (!isLoad && researchingKey.value === key && research.currentTime.gt(0)) {
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
    if (!storeGame.epicNumber.gte(cost)) return;
    storeGame.epicNumber = storeGame.epicNumber.minus(cost);
    storeGame.research.researchingKey = key;
    research.currentTime = time;
  }
}

function cancelResearch(key: string) {
  const research = researchList[key];
  if (!research) return;

  research.currentTime = new Decimal(0);
  storeGame.research.researchingKey = '';
}

onMounted(() => {
  if (storeGame.research.researchingKey != '') {
    if (researchList[storeGame.research.researchingKey]?.currentTime.gt(0))
      startResearch(storeGame.research.researchingKey, true);
  }
});
</script>

<style lang="sass">
@import 'src/css/theme-colors';

.research-card-container
  flex: 1 1 auto
  min-height: 0
  min-width: 0
  width: 100%
  display: flex
  flex-wrap: wrap
  align-items: stretch
  align-content: flex-start
  gap: 0.8vw
  padding: 0.8vw
  overflow-y: auto

.research-card
  flex: 0 0 260px
  min-width: 260px
  max-width: 260px
  min-height: 14vh
  max-height: 24vh
  margin: 0
  display: flex
  flex-direction: column
  position: relative
  box-sizing: border-box

.card-section-fixed
  display: flex
  flex-direction: column
  flex: 0 0 auto
  justify-content: flex-start
  padding-top: 8px !important
  padding-bottom: 0 !important

.research-bottom
  flex: 1 1 auto
  display: flex
  flex-direction: column
  justify-content: flex-end
  min-height: 40px

  .text-label-custom
    @include badge-main
    font-size: 11px
    margin-bottom: 2px
    text-shadow: none

  .q-badge.text-label-custom
    @include badge-main
    font-size: 11px
    margin-bottom: 2px

  .q-badge[style*="color: green"]
    @include badge-success

  .q-badge[style*="color: grey"]
    @include badge-muted

  .level-info
    @include level-info

  .level-info .level-icon
    color: var(--color-level)
    font-size: 15px
    margin-right: 2px

.text-subtitle2
  @include card-title
  min-height: 24px
  max-height: 48px
  overflow: hidden
  text-overflow: ellipsis
  white-space: normal
  display: -webkit-box
  -webkit-line-clamp: 2
  -webkit-box-orient: vertical

.research-icon
  flex: 0 0 18px

.tooltip-desc
  max-width: 240px
  white-space: normal
  font-size: 13px
  line-height: 1.4
  padding: 10px 14px
  border-radius: 10px
  box-shadow: 0 2px 12px 0 rgba(80,100,200,0.10)
  background: rgba(120, 100, 200, 0.70)
  color: #222

.tooltip-title
  font-size: 15px
  font-weight: bold
  margin-bottom: 6px
  color: #222

.tooltip-text
  font-size: 13px
  color: #fff

.q-badge
  padding: 2px 6px

.q-card-actions
  margin-top: 2px
  flex-shrink: 0

.completed-banner
  position: absolute
  top: 50%
  left: 50%
  width: 140%
  transform: translate(-50%, -50%)
  background: rgba(60, 60, 60, 0.40)
  color: #fff
  text-align: center
  font-size: 22px
  font-weight: 900
  letter-spacing: 2px
  z-index: 2
  pointer-events: none
  padding: 12px 0
  box-shadow: 0 2px 12px rgba(0,0,0,0.25)
  user-select: none
  border-radius: 8px
  text-shadow: 0 1px 2px #fff, 0 0 1px #fff, 0 0 2px #fff

.research-cost-time-row
  width: 100%

  .cost-icon,
  .time-icon
    color: var(--q-color-grey-7)
    font-size: 15px
</style>
