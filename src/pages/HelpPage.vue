<template>
  <q-page class="help-page">
    <div class="help-container">
      <q-card class="help-card">
        <div class="text-h4 text-primary q-mb-md">Справка по игре</div>
        <div class="help-section help-section--goal">
          <div class="help-section__header">
            <q-icon name="fa-solid fa-bullseye" color="primary" size="24px" class="q-mr-sm" />
            <div class="text-h6 text-bold">Основная цель</div>
          </div>
          <div class="q-mb-sm">
            Вы — <span class="text-bold">учёный</span>, который стремится найти самое большое
            <q-icon name="fa-solid fa-infinity" color="deep-orange-5" size="20px" class="q-mx-xs" />
            <span class="text-deep-orange-5 text-bold">ЧИСЛО</span>.<br />
            <span class="text-deep-orange-5 text-bold">ЧИСЛО</span> — основная валюта игры
            <q-icon name="fa-duotone fa-coins" color="amber-7" size="18px" class="q-mx-xs" />.
          </div>
          <ul class="q-pl-lg q-mb-sm">
            <li>Покупайте и улучшайте ресурсы</li>
            <li>Исследуйте новые технологии</li>
            <li>Нанимайте помощников</li>
          </ul>
          <div>
            Игра построена на механиках <span class="text-primary">incremental/idle</span>:<br />
            <span class="text-grey-8"
              >Прогресс идёт даже без активных действий, но грамотное управление ускоряет
              развитие.</span
            >
          </div>
        </div>
        <div class="help-section help-section--shop">
          <div class="help-section__header">
            <q-icon name="fa-duotone fa-store" color="primary" size="24px" class="q-mr-sm" />
            <div class="text-h6 text-bold">Магазин</div>
          </div>
          <ul class="q-pl-lg">
            <li>
              <span class="text-bold">Процессоры</span> — увеличивают генерацию
              <span class="text-deep-orange-5 text-bold">ЧИСЛА</span>
            </li>
            <li>
              <span class="text-bold">Жёсткие диски</span> — увеличивают множитель генерации
              <span class="text-deep-orange-5 text-bold">ЧИСЛА</span>
            </li>
            <li><span class="text-bold">Оперативная память</span> — ускоряет исследования</li>
          </ul>
          <div class="q-mt-sm">
            Покупка множителей увеличивает прирост значения при нажатии "Купить".
          </div>
        </div>
        <div class="help-section help-section--research">
          <div class="help-section__header">
            <q-icon name="fa-duotone fa-flask-vial" color="primary" size="24px" class="q-mr-sm" />
            <div class="text-h6 text-bold">Исследования</div>
          </div>
          <ul class="q-pl-lg">
            <li>
              <span class="text-bold">Учёные</span> — генерируют очки исследований, имеют интеллект
              и эффективность
              <ul class="q-pl-md text-grey-8">
                <li>Интеллект — увеличивает прирост опыта учёного</li>
                <li>Эффективность — увеличивает количество очков исследований</li>
                <li>Уровень учёного влияет на общий прирост</li>
              </ul>
            </li>
            <li>
              <span class="text-bold">Базовые исследования</span> — дают бонусы: увеличение
              генерации <span class="text-deep-orange-5 text-bold">ЧИСЛА</span>, снижение стоимости,
              рост эффективности учёных и др.
              <ul class="q-pl-md text-grey-8">
                <li>Каждое исследование можно прокачивать многократно</li>
                <li>С каждым уровнем бонус растёт, но увеличивается цена и время</li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="help-section help-section--automation">
          <div class="help-section__header">
            <q-icon name="fa-duotone fa-robot" color="primary" size="24px" class="q-mr-sm" />
            <div class="text-h6 text-bold">Автоматизация</div>
          </div>
          <ul class="q-pl-lg">
            <li>
              <span class="text-bold">Помощники</span> — автоматически увеличивают ресурсы каждый
              тик
              <ul class="q-pl-md text-grey-8">
                <li>Каждый помощник работает независимо</li>
                <li>Количество и шанс увеличения можно прокачивать</li>
                <li>
                  Помощники не расходуют <span class="text-deep-orange-5 text-bold">ЧИСЛО</span>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="help-section help-section--achievements">
          <div class="help-section__header">
            <q-icon name="fa-duotone fa-trophy-star" color="primary" size="24px" class="q-mr-sm" />
            <div class="text-h6 text-bold">Достижения</div>
          </div>
          <ul class="q-pl-lg">
            <li>
              Каждое достижение даёт бонус к генерации
              <span class="text-deep-orange-5 text-bold">ЧИСЛА</span>
              <ul class="q-pl-md text-grey-8">
                <li>Бонусы от достижений складываются</li>
                <li>Достижения можно прокачивать бесконечно</li>
                <li>При сбросах достижения сохраняются</li>
              </ul>
            </li>
          </ul>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
$mobile-breakpoint: 700px;

.help-page {
  padding: 24px;

  @media (max-width: $mobile-breakpoint) {
    padding: 16px;
  }
}

.help-container {
  max-width: 800px;
  margin: 0 auto;
}

.help-card {
  padding: 32px;

  @media (max-width: $mobile-breakpoint) {
    padding: 20px;
  }
}

.help-section {
  margin-bottom: 24px;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  &__header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }

  &--goal {
    background: rgba(255, 165, 0, 0.07);
    box-shadow: 0 2px 8px rgba(255, 165, 0, 0.08);
  }

  &--shop {
    background: rgba(33, 150, 243, 0.07);
    box-shadow: 0 2px 8px rgba(33, 150, 243, 0.08);
  }

  &--research {
    background: rgba(76, 175, 80, 0.07);
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.08);
  }

  &--automation {
    background: rgba(255, 235, 59, 0.07);
    box-shadow: 0 2px 8px rgba(255, 235, 59, 0.08);
  }

  &--achievements {
    background: rgba(244, 67, 54, 0.07);
    box-shadow: 0 2px 8px rgba(244, 67, 54, 0.08);
  }

  @media (max-width: $mobile-breakpoint) {
    margin-bottom: 16px;
    padding: 12px;

    &__header {
      margin-bottom: 8px;

      .q-icon {
        font-size: 20px !important;
      }

      .text-h6 {
        font-size: 1.1rem;
      }
    }
  }
}
</style>
