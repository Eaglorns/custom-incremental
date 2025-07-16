<template>
  <div class="q-gutter-md row wrap items-stretch q-pa-md" style="overflow-y: auto">
    <q-card
      v-for="meta in researchMeta"
      :key="meta.key"
      flat
      bordered
      class="q-pa-md column flex justify-between research-card bg-grey-10 text-white"
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
        class="bg-grey-9 text-white research-tooltip"
      >
        <div class="text-bold research-tooltip-title">
          {{ meta.title }}
        </div>
        <div class="research-tooltip-desc">{{ meta.description }}</div>
      </q-tooltip>
      <q-card-section class="q-pa-sm">
        <div class="text-subtitle2 row items-center no-wrap ellipsis research-title-row q-mb-md">
          <q-icon :name="meta.icon" size="18px" class="text-primary q-mr-xs" />
          <span class="ellipsis research-title-text">{{ meta.title }}</span>
        </div>
      </q-card-section>
      <div class="column q-px-sm q-pt-xs q-pb-none flex-1">
        <div class="row items-center text-grey-7 q-mb-md" style="font-size: 13px; font-weight: 600">
          <q-icon name="fa-duotone fa-signal-bars" class="q-mr-xs" />
          Уровень: {{ getResearch(meta.key).level }} / {{ getResearch(meta.key).maxLevel }}
        </div>
        <div class="row justify-between items-center q-mb-md">
          <div class="row items-center">
            <q-icon name="fa-duotone fa-coins" size="15px" class="q-mr-xs text-grey-7" />
            <q-badge class="q-pa-xs text-bold bg-grey-3 text-primary" style="font-size: 11px">{{
              formatNumber(getResearchCost(meta.key).value)
            }}</q-badge>
          </div>
          <div class="row items-center">
            <q-icon name="fa-duotone fa-clock" size="15px" class="q-mr-xs text-grey-7" />
            <q-badge class="q-pa-xs text-bold bg-grey-3 text-primary" style="font-size: 11px"
              >{{ formatNumber(getResearchTime(meta.key).value) }} сек</q-badge
            >
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
      </div>
      <q-separator spaced class="q-my-xs" />
      <q-card-actions align="right" class="q-pa-none q-mt-auto">
        <q-btn
          :disable="
            isMaxLevel(meta.key).value ||
            (!storeGame.researchPoint.gte(getResearchCost(meta.key).value) &&
              !getResearch(meta.key).currentTime.gt(0)) ||
            (getResearchTime(meta.key).value.gt(1000) && !getResearch(meta.key).currentTime.gt(0))
          "
          size="sm"
          dense
          :label="
            getResearch(meta.key).currentTime.gt(0)
              ? `Отменить (${formatNumber(getResearch(meta.key).currentTime)} сек.)`
              : 'Улучшить'
          "
          @click="startResearch(meta.key, false)"
          class="q-mx-xs"
          :color="
            isMaxLevel(meta.key).value
              ? 'grey-8'
              : getResearch(meta.key).currentTime.gt(0)
                ? 'negative'
                : 'primary'
          "
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useStoreGame } from 'src/stores/game';
import Decimal from 'break_eternity.js';
import type { Research } from 'src/constants/models';
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
    const divTime = storeGame.getResearchSpeed;
    return research.level.eq(0)
      ? research.time.div(divTime)
      : research.time.mul(research.timeMultiply.pow(research.level)).div(divTime);
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
    if (!storeGame.researchPoint.gte(cost)) return;
    storeGame.researchPoint = storeGame.researchPoint.minus(cost);
    research.currentTime = time;
    research.isActive = true;
  }
}

function cancelResearch(key: string) {
  const research = researchList[key];
  if (!research) return;
  storeGame.researchPoint = storeGame.researchPoint.plus(getResearchCost(key).value);
  research.currentTime = new Decimal(0);
}

onMounted(() => {
  Object.entries(researchList).forEach(([key, research]) => {
    if (research.currentTime && research.currentTime.gt(0)) {
      startResearch(key, true);
    }
  });
});
</script>

<style lang="sass">
.research-card
  background: var(--color-card-bg)
  border-color: var(--color-card-border)
  min-width: 260px
  max-width: 260px
  min-height: 14vh
  max-height: 24vh
  position: relative
  box-sizing: border-box
  flex: 0 0 260px
  background-color: #181a1b !important

.research-inactive
  opacity: 0.55
  filter: grayscale(0.5)
  pointer-events: none

.research-completed-banner
  background: var(--color-banner-completed-bg)
  color: var(--color-banner-completed-text)
  font-size: 22px
  letter-spacing: 2px
  z-index: 2
  pointer-events: none
  border-radius: 8px
  text-shadow: 0 1px 2px #fff, 0 0 1px #fff, 0 0 2px #fff
  position: absolute
  top: 50%
  left: 50%
  width: 100%
  max-width: 240px
  transform: translate(-50%, -50%)
  text-align: center
  font-weight: 900
  box-shadow: 0 2px 12px rgba(0,0,0,0.25)
  user-select: none
  padding: 12px 0
  display: flex
  align-items: center
  justify-content: center

.research-completed-text
  width: 100%
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
  display: block
  text-align: center

.research-tooltip
  max-width: 240px
  font-size: 13px
  line-height: 1.4
  border-radius: 10px
  box-shadow: 0 2px 12px 0 rgba(80, 100, 200, 0.1)

.research-tooltip-title
  font-size: 15px
  margin-bottom: 6px
  color: #fff

.research-tooltip-desc
  font-size: 13px
  color: #fff

.research-title-row
  max-width: 100%
  overflow: hidden

.research-title-text
  max-width: 180px
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap
</style>
