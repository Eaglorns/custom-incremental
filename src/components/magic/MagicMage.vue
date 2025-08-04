<template>
  <div class="magic-mages">
    <div class="mages-layout">
      <div class="mage-panel-placeholder">
        <div class="hire-section">
          <q-btn
            color="primary"
            icon="fas fa-plus"
            label="Нанять мага"
            @click="hireMage"
            :disable="mages.length >= 24"
            class="hire-button"
          />
          <div v-if="mages.length >= 24" class="hire-limit">Достигнут лимит магов</div>
        </div>

        <div v-if="mages.length === 0" class="no-mages">
          <div class="empty-state">
            <i class="fas fa-users fa-3x"></i>
            <p>Нет нанятых магов</p>
          </div>
        </div>

        <div v-else class="mage-list">
          <div
            v-for="mage in mages"
            :key="mage.id"
            class="mage-item"
            :class="{ active: selectedMage?.id === mage.id }"
            @click="selectMage(mage)"
          >
            <div class="mage-avatar">
              <i :class="mage.icon" :style="{ color: mage.iconColor }"></i>
            </div>
            <div class="mage-info">
              <div class="mage-name">{{ mage.name }}</div>
              <div class="mage-level">Уровень {{ mage.level }}</div>
              <div class="mage-rank" :style="{ color: getMageRank(mage.level).color }">
                {{ getMageRank(mage.level).name }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mage-management">
        <div v-if="!selectedMage" class="no-selection">
          <div class="empty-state">
            <i class="fas fa-hand-pointer fa-3x"></i>
            <p>Выберите мага для управления</p>
          </div>
        </div>

        <div v-else class="selected-mage-info">
          <div class="mage-details">
            <div class="mage-avatar">
              <i :class="selectedMage.icon" :style="{ color: selectedMage.iconColor }"></i>
            </div>
            <div class="mage-info">
              <h6 class="mage-name">{{ selectedMage.name }}</h6>
              <div class="mage-level">Уровень {{ selectedMage.level }}</div>
            </div>
          </div>

          <div class="mage-stats">
            <div class="stat-row">
              <span class="stat-label">Звание:</span>
              <span
                class="stat-value rank-badge"
                :style="{
                  background: getRankStyles(getMageRank(selectedMage.level).class).background,
                  color: getRankStyles(getMageRank(selectedMage.level).class).color,
                  borderColor: getRankStyles(getMageRank(selectedMage.level).class).borderColor,
                  boxShadow: getRankStyles(getMageRank(selectedMage.level).class).boxShadow,
                }"
                >{{ getMageRank(selectedMage.level).name }}</span
              >
            </div>
            <div class="experience-section">
              <div class="exp-header">
                <span class="stat-label">Опыт:</span>
                <span class="stat-value"
                  >{{ getExperienceProgress(selectedMage).current }}/{{
                    getExperienceProgress(selectedMage).max
                  }}</span
                >
              </div>
              <div class="exp-bar-container">
                <div class="exp-bar">
                  <div
                    class="exp-fill"
                    :style="{ width: getExperienceProgress(selectedMage).percentage + '%' }"
                  ></div>
                  <div class="exp-text">{{ getExperienceProgress(selectedMage).percentage }}%</div>
                </div>
              </div>
            </div>
          </div>

          <div class="mage-runes">
            <div class="rune-header">
              <h6>Уровни рун</h6>
            </div>
            <div v-if="selectedMageRunes.length === 0" class="no-runes">
              <p>Маг пока не изучил ни одной руны</p>
            </div>
            <div v-else class="rune-grid">
              <div
                v-for="rune in selectedMageRunes"
                :key="rune.id"
                class="rune-item"
                :style="{
                  borderColor: rune.color + '66',
                  '--rune-color': rune.color,
                  '--rune-bg': rune.color + '33',
                  '--rune-border': rune.color + '66',
                  '--rune-text': rune.color + 'CC',
                }"
              >
                <div class="rune-icon">
                  <i :class="rune.icon"></i>
                </div>
                <div class="rune-level">{{ selectedMage.level }}</div>
                <div class="rune-name">{{ rune.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { RUNE_META } from 'src/constants/magicMeta';

interface Mage {
  id: number;
  name: string;
  level: number;
  experience: number;
  icon: string;
  iconColor: string;
  runeIds: string[];
}

const RANKS = [
  { id: 1, name: 'Послушник', class: 'novice', minLevel: 1, color: '#6b7280' },
  { id: 2, name: 'Ученик', class: 'apprentice', minLevel: 5, color: '#059669' },
  { id: 3, name: 'Подмастерье', class: 'journeyman', minLevel: 10, color: '#0891b2' },
  { id: 4, name: 'Адепт', class: 'adept', minLevel: 15, color: '#2563eb' },
  { id: 5, name: 'Специалист', class: 'specialist', minLevel: 20, color: '#7c3aed' },
  { id: 6, name: 'Эксперт', class: 'expert', minLevel: 25, color: '#c2410c' },
  { id: 7, name: 'Мастер', class: 'master', minLevel: 30, color: '#dc2626' },
  { id: 8, name: 'Архимаг', class: 'archmage', minLevel: 35, color: '#be185d' },
  { id: 9, name: 'Повелитель', class: 'lord', minLevel: 40, color: '#a21caf' },
  { id: 10, name: 'Владыка', class: 'overlord', minLevel: 45, color: '#9333ea' },
  { id: 11, name: 'Магистр', class: 'magistrate', minLevel: 50, color: '#7c2d12' },
  { id: 12, name: 'Верховный', class: 'supreme', minLevel: 60, color: '#b45309' },
  { id: 13, name: 'Легендарный', class: 'legendary', minLevel: 70, color: '#ca8a04' },
  { id: 14, name: 'Мифический', class: 'mythical', minLevel: 80, color: '#eab308' },
  { id: 15, name: 'Божественный', class: 'divine', minLevel: 100, color: '#fbbf24' },
];

const MAGE_SYLLABLES =
  'ар ир ор ур эр ал ил ол ул эл ан ин он ун эн ас ис ос ус эс ат ит от ут эт аж иж ож уж эж ай ий ой уй эй ам им ом ум эм ав ив ов ув эв аг иг ог уг эг ад ид од уд эд аз из оз уз эз ак ик ок ук эк ап ип оп уп эп аф иф оф уф эф ах их ох ух эх ац иц оц уц эц аш иш ош уш эш ба би бо бу бэ ва ви во ву вэ га ги го гу гэ да ди до ду дэ за зи зо зу зэ ка ки ко ку кэ ла ли ло лу лэ ма ми мо му мэ на ни но ну нэ па пи по пу пэ ра ри ро ру рэ са си со су сэ та ти то ту тэ фа фи фо фу фэ ха ки хо ху хэ ца ци цо цу цэ ша ши шо шу шэ я йе йо йу йа';

const MAGE_ICONS = [
  { icon: 'fas fa-hat-wizard', color: '#3b82f6' },
  { icon: 'fas fa-fire', color: '#dc2626' },
  { icon: 'fas fa-snowflake', color: '#06b6d4' },
  { icon: 'fas fa-bolt', color: '#eab308' },
  { icon: 'fas fa-mountain', color: '#a3a3a3' },
  { icon: 'fas fa-water', color: '#0ea5e9' },
  { icon: 'fas fa-sun', color: '#f59e0b' },
  { icon: 'fas fa-moon', color: '#8b5cf6' },
  { icon: 'fas fa-wind', color: '#10b981' },
  { icon: 'fas fa-seedling', color: '#22c55e' },
  { icon: 'fas fa-skull', color: '#ef4444' },
  { icon: 'fas fa-eye', color: '#f97316' },
];

const mages = ref<Mage[]>([]);
const selectedMage = ref<Mage | null>(null);
let levelUpInterval: NodeJS.Timeout | null = null;

// Вычисляемые свойства
const getRequiredExperience = computed(() => (level: number) => {
  // Экспоненциальный рост: базовый опыт * (уровень^1.5)
  return Math.floor(100 * Math.pow(level, 1.5));
});

const getMageRank = computed(() => (level: number) => {
  // Находим подходящий ранг для уровня
  for (let i = RANKS.length - 1; i >= 0; i--) {
    const rank = RANKS[i];
    if (rank && level >= rank.minLevel) {
      return rank;
    }
  }
  return RANKS[0]!; // Если не найден, возвращаем первый ранг
});

const getExperienceProgress = computed(() => (mage: Mage) => {
  const currentLevelExp = getRequiredExperience.value(mage.level);
  const nextLevelExp = getRequiredExperience.value(mage.level + 1);
  const expInCurrentLevel = mage.experience - currentLevelExp;
  const expNeededForNextLevel = nextLevelExp - currentLevelExp;

  return {
    current: expInCurrentLevel,
    max: expNeededForNextLevel,
    percentage: Math.round((expInCurrentLevel / expNeededForNextLevel) * 100),
  };
});

// Computed для получения рун мага из магической мета
const selectedMageRunes = computed(() => {
  if (!selectedMage.value) return [];
  return selectedMage.value.runeIds
    .map((runeId) => RUNE_META.find((meta) => meta.id === runeId))
    .filter((rune): rune is NonNullable<typeof rune> => Boolean(rune));
});

// Функции
const selectMage = (mage: Mage) => {
  selectedMage.value = mage;
};

const getRankStyles = (rankClass: string) => {
  const styles = {
    novice: {
      background: 'linear-gradient(45deg, #6b7280, #4b5563)',
      color: '#f3f4f6',
      borderColor: '#9ca3af',
      boxShadow: 'none',
    },
    apprentice: {
      background: 'linear-gradient(45deg, #059669, #047857)',
      color: '#d1fae5',
      borderColor: '#10b981',
      boxShadow: 'none',
    },
    journeyman: {
      background: 'linear-gradient(45deg, #0891b2, #0e7490)',
      color: '#cffafe',
      borderColor: '#06b6d4',
      boxShadow: 'none',
    },
    adept: {
      background: 'linear-gradient(45deg, #2563eb, #1d4ed8)',
      color: '#dbeafe',
      borderColor: '#3b82f6',
      boxShadow: 'none',
    },
    specialist: {
      background: 'linear-gradient(45deg, #7c3aed, #6d28d9)',
      color: '#ede9fe',
      borderColor: '#8b5cf6',
      boxShadow: 'none',
    },
    expert: {
      background: 'linear-gradient(45deg, #c2410c, #9a3412)',
      color: '#fed7aa',
      borderColor: '#ea580c',
      boxShadow: 'none',
    },
    master: {
      background: 'linear-gradient(45deg, #dc2626, #b91c1c)',
      color: '#fecaca',
      borderColor: '#ef4444',
      boxShadow: 'none',
    },
    archmage: {
      background: 'linear-gradient(45deg, #be185d, #9d174d)',
      color: '#fce7f3',
      borderColor: '#ec4899',
      boxShadow: 'none',
    },
    lord: {
      background: 'linear-gradient(45deg, #a21caf, #86198f)',
      color: '#f3e8ff',
      borderColor: '#c084fc',
      boxShadow: 'none',
    },
    overlord: {
      background: 'linear-gradient(45deg, #9333ea, #7c3aed)',
      color: '#ede9fe',
      borderColor: '#a855f7',
      boxShadow: 'none',
    },
    magistrate: {
      background: 'linear-gradient(45deg, #7c2d12, #651e10)',
      color: '#fed7aa',
      borderColor: '#c2410c',
      boxShadow: 'none',
    },
    supreme: {
      background: 'linear-gradient(45deg, #b45309, #92400e)',
      color: '#fef3c7',
      borderColor: '#d97706',
      boxShadow: 'none',
    },
    legendary: {
      background: 'linear-gradient(45deg, #ca8a04, #a16207)',
      color: '#fef3c7',
      borderColor: '#eab308',
      boxShadow: 'none',
    },
    mythical: {
      background: 'linear-gradient(45deg, #eab308, #ca8a04)',
      color: '#fffbeb',
      borderColor: '#f59e0b',
      boxShadow: 'none',
    },
    divine: {
      background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
      color: '#fffbeb',
      borderColor: '#fbbf24',
      boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)',
    },
  };

  return styles[rankClass as keyof typeof styles] || styles.novice;
};

const hireMage = () => {
  // Генерируем уникальное имя из 2 слогов
  const generateUniqueName = (): string => {
    let attempts = 0;
    const maxAttempts = 100;
    const syllables = MAGE_SYLLABLES.split(' ');

    while (attempts < maxAttempts) {
      const syllable1 = syllables[Math.floor(Math.random() * syllables.length)]!;
      const syllable2 = syllables[Math.floor(Math.random() * syllables.length)]!;

      // Соединяем слоги и делаем первую букву заглавной
      const generatedName =
        (syllable1 + syllable2).charAt(0).toUpperCase() + (syllable1 + syllable2).slice(1);

      // Проверяем, что такого имени ещё нет
      if (!mages.value.some((mage) => mage.name === generatedName)) {
        return generatedName;
      }

      attempts++;
    }

    // Если не удалось сгенерировать уникальное имя, возвращаем с номером
    return `Маг${mages.value.length + 1}`;
  };

  const newName = generateUniqueName();
  const randomIcon = MAGE_ICONS[Math.floor(Math.random() * MAGE_ICONS.length)]!;

  const newMage: Mage = {
    id: Date.now(),
    name: newName,
    level: 1,
    experience: 0,
    icon: randomIcon.icon,
    iconColor: randomIcon.color,
    runeIds: [], // Новые маги начинают без рун
  };

  mages.value.push(newMage);

  // Если это первый маг, выбираем его
  if (!selectedMage.value) {
    selectedMage.value = newMage;
  }
};

const levelUpRandomMage = () => {
  if (mages.value.length === 0) return;

  const randomMage = mages.value[Math.floor(Math.random() * mages.value.length)]!;
  const expToAdd = Math.floor(Math.random() * 200) + 50; // 50-250 опыта

  addExperience(randomMage, expToAdd);
};

const addExperience = (mage: Mage, amount: number) => {
  mage.experience += amount;

  // Проверяем, можно ли повысить уровень
  while (mage.experience >= getRequiredExperience.value(mage.level + 1)) {
    mage.level++;

    // При повышении уровня можем добавить случайную руну
    if (mage.level % 3 === 0 && mage.runeIds.length < 6) {
      const availableRunes = RUNE_META.filter((rune) => !mage.runeIds.includes(rune.id));
      if (availableRunes.length > 0) {
        const randomRune = availableRunes[Math.floor(Math.random() * availableRunes.length)]!;
        mage.runeIds.push(randomRune.id);
      }
    }
  }
};

onMounted(() => {
  // Запускаем интервал повышения уровня каждую секунду
  levelUpInterval = setInterval(levelUpRandomMage, 1000);
});

onUnmounted(() => {
  if (levelUpInterval) {
    clearInterval(levelUpInterval);
  }
});
</script>

<style scoped lang="scss">
// CSS переменные для рангов
:root {
  --rank-novice-bg: linear-gradient(45deg, #6b7280, #4b5563);
  --rank-novice-color: #f3f4f6;
  --rank-novice-border: #9ca3af;

  --rank-apprentice-bg: linear-gradient(45deg, #059669, #047857);
  --rank-apprentice-color: #d1fae5;
  --rank-apprentice-border: #10b981;

  --rank-journeyman-bg: linear-gradient(45deg, #0891b2, #0e7490);
  --rank-journeyman-color: #cffafe;
  --rank-journeyman-border: #06b6d4;

  --rank-adept-bg: linear-gradient(45deg, #2563eb, #1d4ed8);
  --rank-adept-color: #dbeafe;
  --rank-adept-border: #3b82f6;

  --rank-specialist-bg: linear-gradient(45deg, #7c3aed, #6d28d9);
  --rank-specialist-color: #ede9fe;
  --rank-specialist-border: #8b5cf6;

  --rank-expert-bg: linear-gradient(45deg, #c2410c, #9a3412);
  --rank-expert-color: #fed7aa;
  --rank-expert-border: #ea580c;

  --rank-master-bg: linear-gradient(45deg, #dc2626, #b91c1c);
  --rank-master-color: #fecaca;
  --rank-master-border: #ef4444;

  --rank-archmage-bg: linear-gradient(45deg, #be185d, #9d174d);
  --rank-archmage-color: #fce7f3;
  --rank-archmage-border: #ec4899;

  --rank-lord-bg: linear-gradient(45deg, #a21caf, #86198f);
  --rank-lord-color: #f3e8ff;
  --rank-lord-border: #c084fc;

  --rank-overlord-bg: linear-gradient(45deg, #9333ea, #7c3aed);
  --rank-overlord-color: #ede9fe;
  --rank-overlord-border: #a855f7;

  --rank-magistrate-bg: linear-gradient(45deg, #7c2d12, #651e10);
  --rank-magistrate-color: #fed7aa;
  --rank-magistrate-border: #c2410c;

  --rank-supreme-bg: linear-gradient(45deg, #b45309, #92400e);
  --rank-supreme-color: #fef3c7;
  --rank-supreme-border: #d97706;

  --rank-legendary-bg: linear-gradient(45deg, #ca8a04, #a16207);
  --rank-legendary-color: #fef3c7;
  --rank-legendary-border: #eab308;

  --rank-mythical-bg: linear-gradient(45deg, #eab308, #ca8a04);
  --rank-mythical-color: #fffbeb;
  --rank-mythical-border: #f59e0b;

  --rank-divine-bg: linear-gradient(45deg, #fbbf24, #f59e0b);
  --rank-divine-color: #fffbeb;
  --rank-divine-border: #fbbf24;
  --rank-divine-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
}

.magic-mages {
  .mages-layout {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 16px;
    height: 600px;
  }

  .mage-panel-placeholder {
    background: linear-gradient(145deg, #2a2d47, #1e2139);
    border: 1px solid #3a4763;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .hire-section {
      margin-bottom: 16px;
      text-align: center;
      flex-shrink: 0;

      .hire-button {
        width: 100%;
        padding: 8px 16px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .hire-limit {
        margin-top: 8px;
        color: #f59e0b;
        font-size: 12px;
        font-style: italic;
      }
    }

    .no-mages {
      padding: 40px 20px;
      text-align: center;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;

      .empty-state {
        color: #6b7280;

        i {
          margin-bottom: 16px;
          opacity: 0.5;
        }

        p {
          margin: 0;
          font-size: 14px;
          font-style: italic;
        }
      }
    }

    .mage-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
      overflow-y: auto;
      padding-right: 4px;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 3px;

        &:hover {
          background: rgba(255, 255, 255, 0.4);
        }
      }

      .mage-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: linear-gradient(145deg, #363a5c, #2d3251);
        border: 1px solid #4a5578;
        border-radius: 8px;
        cursor: pointer;

        &.active {
          border-color: #3b82f6;
          background: linear-gradient(145deg, #3b5998, #2d4782);
        }

        .mage-avatar {
          font-size: 20px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(145deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2));
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        }

        .mage-info {
          flex: 1;

          .mage-name {
            color: #e5e7eb;
            font-size: 14px;
            font-weight: bold;
            margin: 0;
          }

          .mage-level {
            color: #a1a1aa;
            font-size: 12px;
            margin: 2px 0 0 0;
          }

          .mage-rank {
            font-size: 10px;
            font-weight: bold;
            margin: 2px 0 0 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
        }
      }
    }
  }

  .mage-management {
    background: linear-gradient(145deg, #2a2d47, #1e2139);
    border: 1px solid #3a4763;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;

    .panel-header {
      margin-bottom: 16px;
    }

    .selected-mage-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;

      .mage-details {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: linear-gradient(145deg, #363a5c, #2d3251);
        border: 1px solid #4a5578;
        border-radius: 8px;

        .mage-avatar {
          font-size: 24px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(145deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2));
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .mage-info {
          flex: 1;

          .mage-name {
            color: #e5e7eb;
            margin: 0;
            font-size: 14px;
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
          }

          .mage-level {
            color: #a1a1aa;
            font-size: 11px;
            margin: 1px 0;
          }

          .mage-location {
            color: #10b981;
            font-size: 9px;
            font-style: italic;
          }
        }
      }

      .mage-stats {
        background: linear-gradient(145deg, #363a5c, #2d3251);
        border: 1px solid #4a5578;
        border-radius: 8px;
        padding: 12px;

        .stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;

          &:last-child {
            margin-bottom: 0;
          }

          .stat-label {
            color: #a1a1aa;
            font-size: 11px;
          }

          .stat-value {
            color: #e5e7eb;
            font-weight: bold;
            font-size: 11px;

            &.rank-badge {
              padding: 3px 6px;
              border-radius: 10px;
              font-size: 9px;
              text-transform: uppercase;
              font-weight: bold;
              letter-spacing: 0.4px;
              background: var(--rank-bg);
              color: var(--rank-color);
              border: 1px solid var(--rank-border);
              box-shadow: var(--rank-shadow, none);
            }
          }
        }

        .experience-section {
          margin-top: 8px;

          .exp-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
          }

          .exp-bar-container {
            margin-bottom: 4px;

            .exp-bar {
              position: relative;
              width: 100%;
              height: 12px;
              background: linear-gradient(90deg, #1f2937, #111827);
              border: 1px solid #374151;
              border-radius: 6px;
              overflow: hidden;
              box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);

              .exp-fill {
                height: 100%;
                background: linear-gradient(90deg, #3b82f6, #1d4ed8);
                border-radius: 5px;
                transition: width 0.3s ease;
              }

              .exp-text {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #f3f4f6;
                font-size: 9px;
                font-weight: bold;
                text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
                z-index: 1;
              }
            }
          }
        }
      }

      .mage-runes {
        background: linear-gradient(145deg, #363a5c, #2d3251);
        border: 1px solid #4a5578;
        border-radius: 8px;
        padding: 16px;

        .rune-header {
          margin-bottom: 16px;

          h6 {
            color: #e5e7eb;
            margin: 0;
            font-size: 14px;
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
          }
        }

        .rune-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;

          .rune-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 8px 4px;
            background: linear-gradient(145deg, #2d3251, #363a5c);
            border-radius: 6px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);

            .rune-icon {
              font-size: 16px;
              width: 28px;
              height: 28px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 50%;
              margin-bottom: 4px;
              border: 1px solid;
              color: var(--rune-color);
              background: var(--rune-bg);
              border-color: var(--rune-border);
            }

            .rune-level {
              font-size: 12px;
              font-weight: bold;
              margin-bottom: 2px;
              text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
              color: var(--rune-text);
            }

            .rune-name {
              font-size: 8px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 0.3px;
              opacity: 0.8;
              text-align: center;
              color: var(--rune-color);
            }
          }
        }

        .no-runes {
          text-align: center;
          padding: 20px;
          color: #6b7280;

          p {
            margin: 0;
            font-size: 12px;
            font-style: italic;
          }
        }
      }

      .mage-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
    }

    .no-selection {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;

      .empty-state {
        text-align: center;

        p {
          margin-top: 16px;
          font-size: 14px;
        }
      }
    }
  }
}

// Адаптивность
@media (max-width: 768px) {
  .magic-mages {
    .mages-layout {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
      height: auto;
    }
  }
}
</style>
