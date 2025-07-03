<template>
  <q-page class="q-pa-lg">
    <q-card class="q-pa-xl q-mx-auto" style="max-width: 900px">
      <div class="text-h4 text-primary q-mb-md">Справка по игре</div>
      <div class="q-mb-lg">
        <div class="text-h6 text-bold q-mb-sm">Основная цель</div>
        <div>
          Вы — учёный, который решил найти самое большое
          <q-icon name="fa-solid fa-infinity" color="deep-orange-5" size="20px" class="q-mx-xs" />
          <span class="text-deep-orange-5 text-bold">ЧИСЛО</span>. Ваша задача — увеличивать
          <q-icon name="fa-duotone fa-coins" color="amber-7" size="18px" class="q-mx-xs" />
          <span class="text-amber-7 text-bold">ЧИСЛО</span>
          (основная валюта) и
          <q-icon name="fa-duotone fa-database" color="secondary" size="18px" class="q-mx-xs" />
          <span class="text-secondary text-bold">ХРАНИЛИЩЕ</span>
          (ёмкость, в которой хранится число), покупая и улучшая различные ресурсы, исследуя новые
          технологии и нанимая помощников.<br />
          Игра построена на механиках <span class="text-primary">incremental/idle</span>: прогресс
          идёт даже при минимальных действиях, но грамотное управление значительно ускоряет
          развитие.
        </div>
      </div>
      <div class="q-mb-lg">
        <div class="text-h6 text-bold q-mb-sm">Магазин</div>
        <ul>
          <li>
            <q-icon name="fa-duotone fa-microchip" color="primary" size="16px" class="q-mr-xs" />
            <q-icon name="fa-duotone fa-memory" color="teal" size="16px" class="q-mr-xs" />
            <q-icon name="fa-duotone fa-hard-drive" color="blue-grey" size="16px" class="q-mr-xs" />
            <span class="text-bold">CPU, RAM, HDD</span> — основные ресурсы, приобретаемые за
            <span class="text-amber-7 text-bold">ЧИСЛО</span>.
          </li>
          <li>
            Покупка ресурсов увеличивает их параметры, что напрямую влияет на скорость генерации
            <span class="text-amber-7 text-bold">ЧИСЛА</span> и объём
            <span class="text-secondary text-bold">ХРАНИЛИЩА</span>.
          </li>
          <li>
            <q-icon
              name="fa-duotone fa-arrow-up-right-dots"
              color="positive"
              size="16px"
              class="q-mr-xs"
            />
            Множитель покупки позволяет приобретать сразу несколько ресурсов за одну цену. Каждое
            последующее увеличение множителя стоит значительно дороже.
          </li>
        </ul>
      </div>
      <div class="q-mb-lg">
        <div class="text-h6 text-bold q-mb-sm">Исследования</div>
        <ul>
          <li>
            <q-icon name="fa-duotone fa-flask" color="secondary" size="16px" class="q-mr-xs" />
            Исследования открывают новые бонусы и возможности. Для начала исследования требуются
            <span class="text-amber-7 text-bold">ЧИСЛО</span> и время.
          </li>
          <li>
            <q-icon name="fa-duotone fa-list-check" color="info" size="16px" class="q-mr-xs" />
            Параметры исследования: стоимость, время, бонус, уровень, максимальный уровень.
          </li>
          <li>
            <q-icon name="fa-duotone fa-bolt" color="positive" size="16px" class="q-mr-xs" />
            Исследования ускоряют прогресс, повышают эффективность ресурсов и открывают новые
            механики.
          </li>
        </ul>
      </div>
      <div class="q-mb-lg">
        <div class="text-h6 text-bold q-mb-sm">Автоматизация</div>
        <ul>
          <li>
            <q-icon name="fa-duotone fa-robot" color="deep-purple-5" size="16px" class="q-mr-xs" />
            Помощники (CPU, HDD, RAM) автоматически покупают соответствующие ресурсы с определённым
            шансом.
          </li>
          <li>
            <q-icon name="fa-duotone fa-user-plus" color="primary" size="16px" class="q-mr-xs" />
            Можно нанимать новых помощников и улучшать их шанс покупки.
          </li>
          <li>
            <q-icon
              name="fa-duotone fa-arrow-trend-up"
              color="positive"
              size="16px"
              class="q-mr-xs"
            />
            Шанс покупки растёт медленно, но при большом количестве помощников автоматизация
            становится очень эффективной.
          </li>
          <li>
            <q-icon name="fa-duotone fa-coins" color="amber-7" size="16px" class="q-mr-xs" />
            Покупка и улучшение помощников требует
            <span class="text-amber-7 text-bold">ЧИСЛО</span>.
          </li>
        </ul>
      </div>
      <div class="q-mb-lg">
        <div class="text-h6 text-bold q-mb-sm">Сохранение и автосохранение</div>
        <ul>
          <li>
            <q-icon name="fa-duotone fa-floppy-disk" color="info" size="16px" class="q-mr-xs" />
            Игра автоматически сохраняет прогресс каждые 60 секунд.
          </li>
          <li>
            <q-icon
              name="fa-duotone fa-shield-check"
              color="positive"
              size="16px"
              class="q-mr-xs"
            />
            Ваши достижения не потеряются при перезагрузке страницы.
          </li>
        </ul>
      </div>
    </q-card>
  </q-page>
</template>

<script setup lang="ts"></script>
