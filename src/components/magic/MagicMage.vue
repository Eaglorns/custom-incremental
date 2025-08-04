<template>
  <div class="magic-mages">
    <div class="mages-layout">
      <div class="mage-panel-placeholder">
        <div class="mage-list">
          <div
            v-for="mage in mages"
            :key="mage.id"
            class="mage-item"
            :class="{ active: selectedMage.id === mage.id }"
            @click="selectMage(mage)"
          >
            <div class="mage-avatar">
              <i :class="mage.icon" :style="{ color: mage.iconColor }"></i>
            </div>
            <div class="mage-info">
              <div class="mage-name">{{ mage.name }}</div>
              <div class="mage-level">Уровень {{ mage.level }}</div>
              <div class="mage-rank">{{ mage.rank }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="mage-management">
        <div class="selected-mage-info">
          <div class="mage-details">
            <div class="mage-avatar">
              <i :class="selectedMage.icon" :style="{ color: selectedMage.iconColor }"></i>
            </div>
            <div class="mage-info">
              <h6 class="mage-name">{{ selectedMage.name }}</h6>
              <div class="mage-level">Уровень {{ selectedMage.level }}</div>
              <div class="mage-location">{{ selectedMage.location }}</div>
            </div>
          </div>

          <div class="mage-stats">
            <div class="stat-row">
              <span class="stat-label">Звание:</span>
              <span class="stat-value rank-badge" :class="selectedMage.rankClass">{{
                selectedMage.rank
              }}</span>
            </div>
            <div class="experience-section">
              <div class="exp-header">
                <span class="stat-label">Опыт:</span>
                <span class="stat-value"
                  >{{ selectedMage.experience.current }}/{{ selectedMage.experience.max }}</span
                >
              </div>
              <div class="exp-bar-container">
                <div class="exp-bar">
                  <div class="exp-fill" :style="{ width: getExpPercentage() + '%' }"></div>
                  <div class="exp-text">{{ getExpPercentage() }}%</div>
                </div>
              </div>
              <div class="exp-to-next">
                <span class="next-rank">До следующего уровня: {{ getExpToNext() }} опыта</span>
              </div>
            </div>
          </div>

          <div class="mage-runes">
            <div class="rune-header">
              <h6>Уровни рун</h6>
            </div>
            <div class="rune-grid">
              <div
                v-for="rune in selectedMage.runes"
                :key="rune.type"
                class="rune-item"
                :class="rune.type"
              >
                <div class="rune-icon">
                  <i :class="rune.icon"></i>
                </div>
                <div class="rune-level">{{ rune.level }}</div>
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
import { ref } from 'vue';

interface Mage {
  id: number;
  name: string;
  level: number;
  rank: string;
  rankClass: string;
  location: string;
  icon: string;
  iconColor: string;
  experience: { current: number; max: number };
  runes: Array<{
    type: string;
    level: number;
    name: string;
    icon: string;
  }>;
}

const mages = ref<Mage[]>([
  {
    id: 1,
    name: 'Арканус',
    level: 12,
    rank: 'Подмастерье',
    rankClass: 'apprentice',
    location: 'В бою',
    icon: 'fas fa-hat-wizard',
    iconColor: '#3b82f6',
    experience: { current: 1200, max: 1300 },
    runes: [
      { type: 'fire', level: 12, name: 'Огонь', icon: 'fas fa-fire' },
      { type: 'ice', level: 8, name: 'Лёд', icon: 'fas fa-snowflake' },
      { type: 'earth', level: 5, name: 'Земля', icon: 'fas fa-mountain' },
      { type: 'arcane', level: 15, name: 'Магия', icon: 'fas fa-magic' },
      { type: 'lightning', level: 3, name: 'Молния', icon: 'fas fa-bolt' },
      { type: 'shadow', level: 7, name: 'Тьма', icon: 'fas fa-moon' },
      { type: 'wind', level: 4, name: 'Ветер', icon: 'fas fa-wind' },
      { type: 'light', level: 9, name: 'Свет', icon: 'fas fa-sun' },
      { type: 'water', level: 6, name: 'Вода', icon: 'fas fa-tint' },
      { type: 'nature', level: 2, name: 'Природа', icon: 'fas fa-leaf' },
      { type: 'metal', level: 8, name: 'Металл', icon: 'fas fa-shield-alt' },
      { type: 'spirit', level: 1, name: 'Дух', icon: 'fas fa-ghost' },
    ],
  },
  {
    id: 2,
    name: 'Пироклазм',
    level: 8,
    rank: 'Новичок',
    rankClass: 'novice',
    location: 'В городе',
    icon: 'fas fa-fire',
    iconColor: '#dc2626',
    experience: { current: 450, max: 600 },
    runes: [
      { type: 'fire', level: 15, name: 'Огонь', icon: 'fas fa-fire' },
      { type: 'lightning', level: 6, name: 'Молния', icon: 'fas fa-bolt' },
      { type: 'earth', level: 3, name: 'Земля', icon: 'fas fa-mountain' },
      { type: 'light', level: 4, name: 'Свет', icon: 'fas fa-sun' },
    ],
  },
  {
    id: 3,
    name: 'Криомант',
    level: 5,
    rank: 'Новичок',
    rankClass: 'novice',
    location: 'Тренируется',
    icon: 'fas fa-snowflake',
    iconColor: '#06b6d4',
    experience: { current: 180, max: 400 },
    runes: [
      { type: 'ice', level: 12, name: 'Лёд', icon: 'fas fa-snowflake' },
      { type: 'water', level: 8, name: 'Вода', icon: 'fas fa-tint' },
      { type: 'wind', level: 5, name: 'Ветер', icon: 'fas fa-wind' },
    ],
  },
]);

const selectedMage = ref<Mage>(
  mages.value[0] ?? {
    id: 0,
    name: '',
    level: 0,
    rank: '',
    rankClass: '',
    location: '',
    icon: '',
    iconColor: '',
    experience: { current: 0, max: 1 },
    runes: [],
  },
);

const selectMage = (mage: Mage) => {
  selectedMage.value = mage;
};

const getExpPercentage = () => {
  return Math.round(
    (selectedMage.value.experience.current / selectedMage.value.experience.max) * 100,
  );
};

const getExpToNext = () => {
  return selectedMage.value.experience.max - selectedMage.value.experience.current;
};
</script>

<style scoped lang="scss">
:root {
  --fire-color: #ef4444;
  --fire-bg: rgba(239, 68, 68, 0.3);
  --fire-border: rgba(239, 68, 68, 0.4);
  --fire-text: #fca5a5;

  --ice-color: #06b6d4;
  --ice-bg: rgba(6, 182, 212, 0.3);
  --ice-border: rgba(6, 182, 212, 0.4);
  --ice-text: #67e8f9;

  --earth-color: #65a30d;
  --earth-bg: rgba(101, 163, 13, 0.3);
  --earth-border: rgba(101, 163, 13, 0.4);
  --earth-text: #bef264;

  --arcane-color: #8b5cf6;
  --arcane-bg: rgba(139, 92, 246, 0.3);
  --arcane-border: rgba(139, 92, 246, 0.4);
  --arcane-text: #c4b5fd;

  --lightning-color: #f59e0b;
  --lightning-bg: rgba(245, 158, 11, 0.3);
  --lightning-border: rgba(245, 158, 11, 0.4);
  --lightning-text: #fed7aa;

  --shadow-color: #4b5563;
  --shadow-bg: rgba(75, 85, 99, 0.3);
  --shadow-border: rgba(75, 85, 99, 0.4);
  --shadow-text: #d1d5db;

  --wind-color: #9ca3af;
  --wind-bg: rgba(156, 163, 175, 0.3);
  --wind-border: rgba(156, 163, 175, 0.4);
  --wind-text: #e5e7eb;

  --light-color: #fbbf24;
  --light-bg: rgba(251, 191, 36, 0.3);
  --light-border: rgba(251, 191, 36, 0.4);
  --light-text: #fef3c7;

  --water-color: #0e7490;
  --water-bg: rgba(14, 116, 144, 0.3);
  --water-border: rgba(14, 116, 144, 0.4);
  --water-text: #a7f3d0;

  --nature-color: #22c55e;
  --nature-bg: rgba(34, 197, 94, 0.3);
  --nature-border: rgba(34, 197, 94, 0.4);
  --nature-text: #bbf7d0;

  --metal-color: #78716c;
  --metal-bg: rgba(120, 113, 108, 0.3);
  --metal-border: rgba(120, 113, 108, 0.4);
  --metal-text: #e7e5e4;

  --spirit-color: #c4b5fd;
  --spirit-bg: rgba(196, 181, 253, 0.3);
  --spirit-border: rgba(196, 181, 253, 0.4);
  --spirit-text: #ede9fe;
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

    .mage-list {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .mage-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: linear-gradient(145deg, #363a5c, #2d3251);
        border: 1px solid #4a5578;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: linear-gradient(145deg, #4a5578, #363a5c);
          transform: translateY(-1px);
        }

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
            color: #10b981;
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

              &.novice {
                background: linear-gradient(45deg, #6b7280, #4b5563);
                color: #f3f4f6;
                border: 1px solid #9ca3af;
              }

              &.apprentice {
                background: linear-gradient(45deg, #059669, #047857);
                color: #d1fae5;
                border: 1px solid #10b981;
              }

              &.adept {
                background: linear-gradient(45deg, #2563eb, #1d4ed8);
                color: #dbeafe;
                border: 1px solid #3b82f6;
              }

              &.expert {
                background: linear-gradient(45deg, #7c3aed, #6d28d9);
                color: #ede9fe;
                border: 1px solid #8b5cf6;
              }

              &.master {
                background: linear-gradient(45deg, #dc2626, #b91c1c);
                color: #fecaca;
                border: 1px solid #ef4444;
              }

              &.grandmaster {
                background: linear-gradient(45deg, #f59e0b, #d97706);
                color: #fef3c7;
                border: 1px solid #f59e0b;
              }
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

          .exp-to-next {
            .next-rank {
              color: #a78bfa;
              font-size: 9px;
              font-style: italic;
              text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
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
            transition: all 0.2s ease;

            &:hover {
              transform: translateY(-1px);
              box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
            }

            .rune-icon {
              font-size: 16px;
              width: 28px;
              height: 28px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 50%;
              margin-bottom: 4px;
            }

            .rune-level {
              font-size: 12px;
              font-weight: bold;
              margin-bottom: 2px;
              text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
            }

            .rune-name {
              font-size: 8px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 0.3px;
              opacity: 0.8;
              text-align: center;
            }

            // Оптимизированные стили для всех типов рун
            @each $type in fire, ice, earth, arcane, lightning, shadow, wind, light, water, nature,
              metal, spirit
            {
              &.#{$type} {
                border: 1px solid var(--#{$type}-border);

                .rune-icon {
                  background: linear-gradient(145deg, var(--#{$type}-bg), var(--#{$type}-bg));
                  border: 1px solid var(--#{$type}-border);
                  color: var(--#{$type}-color);
                }

                .rune-level {
                  color: var(--#{$type}-text);
                }

                .rune-name {
                  color: var(--#{$type}-color);
                }
              }
            }
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
