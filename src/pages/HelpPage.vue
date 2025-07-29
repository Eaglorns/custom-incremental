<template>
  <q-page class="q-pa-lg">
    <q-card class="q-pa-xl q-mx-auto help-card">
      <div class="text-h4 text-primary q-mb-lg">Справка</div>
      <div class="help-section orange">
        <q-icon name="fa-solid fa-bullseye" color="primary" size="22px" class="q-mr-sm" />
        <span class="text-h6 text-bold">Цель</span>
        <div class="q-mt-sm">
          Найдите самое большое <span class="text-deep-orange-5 text-bold">ЧИСЛО</span>
          <q-icon name="fa-solid fa-infinity" color="deep-orange-5" size="18px" class="q-mx-xs" /> —
          основная валюта игры.
        </div>
        <ul class="q-pl-lg q-mt-xs">
          <li>Покупайте и улучшайте ресурсы</li>
          <li>Исследуйте технологии</li>
          <li>Нанимайте помощников</li>
        </ul>
        <div class="text-grey-7 q-mt-xs">
          Прогресс идёт даже без действий, но активность ускоряет развитие.
        </div>
      </div>
      <div class="help-section blue">
        <q-icon name="fa-duotone fa-store" color="primary" size="22px" class="q-mr-sm" />
        <span class="text-h6 text-bold">Магазин</span>
        <ul class="q-pl-lg q-mt-xs">
          <li><span class="text-bold">Процессоры</span> — увеличивают генерацию</li>
          <li><span class="text-bold">Жёсткие диски</span> — множитель генерации</li>
          <li><span class="text-bold">ОЗУ</span> — ускоряет исследования</li>
        </ul>
        <div class="text-grey-7 q-mt-xs">
          Множители увеличивают прирост при покупке. Престиж — больше покупок за раз.
        </div>
      </div>
      <div class="help-section green">
        <q-icon name="fa-duotone fa-flask-vial" color="primary" size="22px" class="q-mr-sm" />
        <span class="text-h6 text-bold">Исследования</span>
        <ul class="q-pl-lg q-mt-xs">
          <li><span class="text-bold">Учёные</span> — генерируют очки исследований</li>
          <li>
            <span class="text-bold">Базовые исследования</span> — бонусы к генерации, снижению цен и
            др.
          </li>
        </ul>
        <div class="text-grey-7 q-mt-xs">Прокачка увеличивает бонус, но растёт цена и время.</div>
      </div>
      <div class="help-section yellow">
        <q-icon name="fa-duotone fa-robot" color="primary" size="22px" class="q-mr-sm" />
        <span class="text-h6 text-bold">Автоматизация</span>
        <ul class="q-pl-lg q-mt-xs">
          <li><span class="text-bold">Помощники</span> — автоматически увеличивают ресурсы</li>
        </ul>
        <div class="text-grey-7 q-mt-xs">Можно прокачивать количество и шанс срабатывания.</div>
      </div>
      <div class="help-section red">
        <q-icon name="fa-duotone fa-award" color="primary" size="22px" class="q-mr-sm" />
        <span class="text-h6 text-bold">Престиж</span>
        <div class="q-mt-xs">Сбросьте прогресс ради очков престижа для особых улучшений.</div>
      </div>
      <div class="help-section red">
        <q-icon name="fa-duotone fa-trophy-star" color="primary" size="22px" class="q-mr-sm" />
        <span class="text-h6 text-bold">Достижения</span>
        <div class="q-mt-xs">
          Дают бонус к генерации <span class="text-deep-orange-5 text-bold">ЧИСЛА</span>.
          Сохраняются при сбросах.
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup lang="ts"></script>

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
