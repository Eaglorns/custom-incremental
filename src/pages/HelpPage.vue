<template>
  <q-page class="p-2 sm:p-6 text-xs sm:text-sm">
    <q-card class="p-3 sm:p-8 q-mx-auto help-card">
      <div class="text-2xl sm:text-h4 text-primary q-mb-lg">Справка</div>
      <div class="help-section orange">
        <i :class="iconStyle + 'fa-bullseye'" color="primary" size="22px" class="q-mr-sm" />
        <span class="text-base sm:text-h6 text-bold">Цель</span>
        <div class="q-mt-sm">
          Найдите самое большое <span class="text-deep-orange-5 text-bold">ЧИСЛО</span>.
        </div>
      </div>
      <div class="help-section blue">
        <i :class="iconStyle + 'fa-store'" color="primary" size="22px" class="q-mr-sm" />
        <span class="text-base sm:text-h6 text-bold">Магазин</span>
        <ul class="q-pl-lg q-mt-xs">
          <li><span class="text-bold">Процессоры</span> — увеличивают генерацию</li>
          <li><span class="text-bold">Жёсткие диски</span> — множитель генерации</li>
          <li><span class="text-bold">ОЗУ</span> — ускоряет исследования</li>
          <li>
            <span class="text-bold">Работники</span> — зарабатывают монеты для покупки комплектующих
          </li>
        </ul>
      </div>
      <div class="help-section green" v-if="storeData.stage >= storeData.stageScientist">
        <i :class="iconStyle + 'fa-flask-vial'" color="primary" size="22px" class="q-mr-sm" />
        <span class="text-base sm:text-h6 text-bold">Исследования</span>
        <ul class="q-pl-lg q-mt-xs">
          <li><span class="text-bold">Учёные</span> — генерируют очки исследований</li>
          <li v-if="storeData.stage >= storeData.stageResearch">
            <span class="text-bold">Базовые исследования</span> — бонусы к генерации, снижению цен и
            др.
          </li>
        </ul>
        <div class="text-grey-7 q-mt-xs" v-if="storeData.stage >= storeData.stageResearch">
          Прокачка увеличивает бонус, но растёт цена и время.
        </div>
      </div>
      <div class="help-section yellow" v-if="storeData.stage >= storeData.stageAutomatic">
        <i :class="iconStyle + 'fa-robot'" color="primary" size="22px" class="q-mr-sm" />
        <span class="text-base sm:text-h6 text-bold">Автоматизация</span>
        <ul class="q-pl-lg q-mt-xs">
          <li><span class="text-bold">Помощники</span> — автоматически увеличивают ресурсы</li>
        </ul>
        <div class="text-grey-7 q-mt-xs">Можно прокачивать количество и шанс срабатывания.</div>
      </div>
      <div class="help-section red" v-if="storeData.stage >= storeData.stagePrestige">
        <i :class="iconStyle + 'fa-award'" color="primary" size="22px" class="q-mr-sm" />
        <span class="text-base sm:text-h6 text-bold">Престиж</span>
        <div class="q-mt-xs">
          Сбросьте прогресс ради очков престижа для особых улучшений. Они ускоряют генерацию и
          открывают новые возможности.
        </div>
      </div>
      <div class="help-section purple" v-if="storeData.stage >= storeData.stageEternity">
        <i :class="iconStyle + 'fa-hat-wizard'" color="primary" size="22px" class="q-mr-sm" />
        <span class="text-base sm:text-h6 text-bold">Магия</span>
        <ul class="q-pl-lg q-mt-xs">
          <li>
            <span class="text-bold">Маги</span> — сражаются с монстрами и получают опыт. Их сила
            зависит от набора рун; Уровни определяют генерацию маны. На каждых степенях 10 (10, 100,
            1000 и т.д.) вклад мага дополнительно удваивается.
          </li>
          <li>
            <span class="text-bold">Битвы</span> — по одному монстру за раз. У монстра есть
            здоровье, броня и регенерация; в бою могут накладываться эффекты (яд, горение, мороз и
            т. п.), см. вкладку «Крафт» для деталей.
          </li>
          <li>
            <span class="text-bold">Награды</span> — эссенции разных типов. Они выпадают из боёв и
            используются для крафта рун; количество и тип эссенций зависят от уровня и суффикса
            монстра.
          </li>
          <li>
            <span class="text-bold">Руны</span> — усиливают конкретные типы урона или эффекты. Для
            крафта требуются определённые эссенции. Индикаторы: зелёная рамка — крафт доступен;
            жёлтая — ресурсов недостаточно.
          </li>
          <li>
            <span class="text-bold">Крафт</span> — кликните, чтобы выбрать руну; удерживайте, чтобы
            запустить прогресс и создать руну. Иконка молотка означает, что крафт возможен. Длинное
            удержание автоматически повторяет крафт, пока хватает ресурсов.
          </li>
          <li>
            <span class="text-bold">Добыча рун</span> — маги иногда находят дополнительные руны в
            боях; накопленные копии усиливают эффект рун и повышают общую силу мага.
          </li>
        </ul>
      </div>
      <div class="help-section red">
        <i :class="iconStyle + 'fa-trophy-star'" color="primary" size="22px" class="q-mr-sm" />
        <span class="text-base sm:text-h6 text-bold">Достижения</span>
        <div class="q-mt-xs">
          Дают бонус к генерации <span class="text-deep-orange-5 text-bold">ЧИСЛА</span>.
          Сохраняются при сбросах.
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useStoreSetting } from 'stores/setting';
import { useStoreData } from 'stores/data';
import { computed } from 'vue';

const storeSetting = useStoreSetting();
const storeData = useStoreData();

const iconStyle = computed(() => {
  return storeSetting.iconStyle;
});
</script>

<style lang="scss" scoped>
.help-card {
  min-width: 100%;
  background: none;
  box-shadow: none;
  padding: 0;
}
.help-section {
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 10px 12px 8px 12px;
  margin-bottom: 10px;
  background: #fff;
  &.orange {
    background: rgba(255, 165, 0, 0.07);
  }
  &.blue {
    background: rgba(33, 150, 243, 0.07);
  }
  &.green {
    background: rgba(76, 175, 80, 0.07);
  }
  &.yellow {
    background: rgba(255, 235, 59, 0.07);
  }
  &.red {
    background: rgba(244, 67, 54, 0.07);
  }
  &.purple {
    background: rgba(103, 58, 183, 0.08);
  }
}
@media (max-width: 600px) {
  .help-card {
    padding: 0;
  }
  .help-section {
    padding: 6px 6px 4px 6px;
    margin-bottom: 6px;
    border-radius: 7px;
  }
  .text-h4 {
    font-size: 1.2rem;
  }
  .text-h6 {
    font-size: 1rem;
  }
}
</style>
