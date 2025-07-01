<template>
  <div class="q-gutter-md row wrap items-stretch q-pa-md" style="overflow-y: auto">
    <q-card
      v-for="meta in researchMeta"
      :key="meta.key"
      flat
      bordered
      class="q-pa-md column flex justify-between"
      :style="{
        background: 'var(--color-card-bg)',
        borderColor: 'var(--color-card-border)',
        minWidth: '260px',
        maxWidth: '260px',
        minHeight: '14vh',
        maxHeight: '24vh',
        position: 'relative',
        boxSizing: 'border-box',
        flex: '0 0 260px',
      }"
      :class="{
        'bg-grey-1': !isMaxLevel(meta.key).value,
        'bg-grey-3': isMaxLevel(meta.key).value,
      }"
    >
      <div
        v-if="isMaxLevel(meta.key).value"
        class="q-pa-md flex flex-center text-white text-bold"
        :style="{
          background: 'var(--color-banner-completed-bg)',
          color: 'var(--color-banner-completed-text)',
          fontSize: '22px',
          letterSpacing: '2px',
          zIndex: 2,
          pointerEvents: 'none',
          borderRadius: '8px',
          textShadow: '0 1px 2px #fff, 0 0 1px #fff, 0 0 2px #fff',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '140%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          fontWeight: 900,
          boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
          userSelect: 'none',
          padding: '12px 0',
        }"
      >
        Завершено
      </div>
      <q-tooltip
        anchor="top middle"
        self="bottom middle"
        :offset="[0, 10]"
        class="bg-grey-9 text-white"
        style="
          max-width: 240px;
          font-size: 13px;
          line-height: 1.4;
          border-radius: 10px;
          box-shadow: 0 2px 12px 0 rgba(80, 100, 200, 0.1);
        "
      >
        <div class="text-bold" style="font-size: 15px; margin-bottom: 6px; color: #fff">
          {{ meta.title }}
        </div>
        <div style="font-size: 13px; color: #fff">{{ meta.description }}</div>
      </q-tooltip>
      <q-card-section class="q-pa-sm">
        <div class="text-subtitle2 row items-center no-wrap ellipsis">
          <q-icon :name="meta.icon" size="18px" class="text-primary q-mr-xs" />
          {{ meta.title }}
        </div>
      </q-card-section>
      <div class="column q-px-sm q-pt-xs q-pb-none flex-1">
        <div class="row items-center text-grey-7 q-mb-xs" style="font-size: 13px; font-weight: 600">
          <q-icon name="fa-duotone fa-signal-bars" class="q-mr-xs" />
          Уровень: {{ getResearch(meta.key).level }} / {{ getResearch(meta.key).maxLevel }}
        </div>
        <div class="row justify-between items-center q-mb-xs">
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
          class="q-mx-xs"
          :color="
            researchingKey === meta.key && getResearch(meta.key).currentTime.gt(0)
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
