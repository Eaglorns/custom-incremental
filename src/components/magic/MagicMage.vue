<template>
  <div class="magic-mages">
    <div class="mages-layout">
      <div class="mage-panel-placeholder">
        <div class="hire-section">
          <q-btn
            color="primary"
            icon="fas fa-plus"
            label="Нанять мага"
            @click="storeMagic.hireMage"
            class="hire-button"
          />
        </div>

        <div v-if="mages.length === 0" class="no-mages">
          <div class="empty-state">
            <i :class="iconStyle + 'fa-users fa-3x'"></i>
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
              <i :class="iconStyle + mage.icon" :style="{ color: mage.iconColor }"></i>
            </div>
            <div class="mage-info">
              <div class="mage-header">
                <div class="mage-name">{{ mage.name }}</div>
                <div class="mage-rank" :style="{ color: mage.rank.color }">
                  {{ mage.rank.name }}
                </div>
              </div>
              <div class="mage-level">Уровень {{ formatNumber(mage.level) }}</div>

              <!-- Мобильная информация о маге -->
              <div class="mobile-mage-details">
                <div class="experience-section">
                  <div class="exp-header">
                    <span class="exp-label">Опыт:</span>
                    <span class="exp-values">
                      {{ formatNumber(storeMagic.getMageExperienceProgress(mage).current) }} /
                      {{ formatNumber(storeMagic.getMageExperienceProgress(mage).max) }}
                    </span>
                  </div>
                  <div class="exp-bar-container">
                    <q-linear-progress
                      :value="storeMagic.getMageExperienceProgress(mage).percentage / 100"
                      color="primary"
                      track-color="grey-8"
                      size="8px"
                      rounded
                      class="exp-progress"
                    />
                  </div>
                </div>

                <div v-if="getMageRunes(mage).length > 0" class="mobile-runes">
                  <div class="runes-label">Руны:</div>
                  <div class="rune-grid-mobile">
                    <div
                      v-for="rune in getMageRunes(mage).slice(0, 6)"
                      :key="rune.id"
                      class="rune-item-mobile"
                      :style="{ color: rune.color }"
                    >
                      <i :class="iconStyle + rune.icon"></i>
                      <span class="rune-quantity">
                        {{ formatNumber(mage.runeQuantities[rune.id] || new Decimal(0)) }}
                      </span>
                    </div>
                    <div v-if="getMageRunes(mage).length > 6" class="more-runes">
                      +{{ getMageRunes(mage).length - 6 }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mage-management">
        <div v-if="!selectedMage" class="no-selection">
          <div class="empty-state">
            <i :class="iconStyle + 'fa-hand-pointer fa-3x'"></i>
            <p>Выберите мага для управления</p>
          </div>
        </div>

        <div v-else class="selected-mage-info">
          <div class="mage-details">
            <div class="mage-avatar">
              <i
                :class="iconStyle + selectedMage.icon"
                :style="{ color: selectedMage.iconColor }"
              ></i>
            </div>
            <div class="mage-info">
              <h6 class="mage-name">
                {{ selectedMage.name }}
                <span
                  class="stat-value rank-badge"
                  :style="{
                    background: rankStyle.background,
                    color: rankStyle.color,
                    borderColor: rankStyle.borderColor,
                    boxShadow: rankStyle.boxShadow,
                  }"
                  >{{ selectedMage.rank.name }}</span
                >
              </h6>

              <div class="mage-level">Уровень {{ formatNumber(selectedMage.level) }}</div>
            </div>
          </div>

          <div class="mage-stats">
            <div class="stat-row"></div>
            <div class="experience-section">
              <div class="exp-header">
                <span class="stat-value">{{
                  formatNumber(storeMagic.getMageExperienceProgress(selectedMage).current)
                }}</span>
                <span class="stat-value">{{
                  formatNumber(storeMagic.getMageExperienceProgress(selectedMage).max)
                }}</span>
              </div>
              <div class="exp-bar-container">
                <q-linear-progress
                  :value="storeMagic.getMageExperienceProgress(selectedMage).percentage / 100"
                  color="primary"
                  track-color="grey-8"
                  size="12px"
                  rounded
                  class="exp-progress"
                />
              </div>
            </div>
          </div>

          <div class="mage-runes">
            <div v-if="selectedMageRunes.length === 0" class="no-runes" />
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
                  <i :class="iconStyle + rune.icon"></i>
                </div>
                <div class="rune-quantity">
                  {{ formatNumber(selectedMage.runeQuantities[rune.id] || new Decimal(0)) }}
                </div>
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
import { computed } from 'vue';
import { RUNE_META } from 'src/constants/magicMeta';
import Decimal from 'break_eternity.js';
import { useStoreData } from 'stores/data';
import type { Mage } from 'stores/magic';
import { useStoreMagic } from 'stores/magic';
import { useStoreSetting } from 'src/stores/setting';

const storeMagic = useStoreMagic();
const storeData = useStoreData();
const storeSetting = useStoreSetting();

const iconStyle = computed(() => {
  return storeSetting.iconStyle;
});

const formatNumber = storeData.formatNumber;

const mages = computed(() => storeMagic.mages);
const selectedMage = computed(() => storeMagic.selectedMage);

const rankStyle = computed(() => {
  if (!selectedMage.value) return { background: '', color: '', borderColor: '', boxShadow: '' };
  return storeMagic.getMageRankStyles(selectedMage.value.rank.class);
});

const selectedMageRunes = computed(() => {
  if (!selectedMage.value) return [];
  return selectedMage.value.runeIds
    .map((runeId) => RUNE_META.find((meta) => meta.id === runeId))
    .filter((rune): rune is NonNullable<typeof rune> => Boolean(rune));
});

const getMageRunes = (mage: Mage) => {
  return mage.runeIds
    .map((runeId) => RUNE_META.find((meta) => meta.id === runeId))
    .filter((rune): rune is NonNullable<typeof rune> => Boolean(rune));
};

const selectMage = (mage: Mage) => {
  storeMagic.selectedMage = mage;
};
</script>

<style scoped lang="scss">
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
        align-items: flex-start;
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
          flex-shrink: 0;
        }

        .mage-info {
          flex: 1;
          min-width: 0;

          .mage-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;

            .mage-name {
              color: #e5e7eb;
              font-size: 14px;
              font-weight: bold;
              margin: 0;
            }

            .mage-rank {
              font-size: 10px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              padding: 2px 6px;
              border-radius: 4px;
              background: rgba(0, 0, 0, 0.3);
              border: 1px solid currentColor;
            }
          }

          .mage-level {
            color: #a1a1aa;
            font-size: 12px;
            margin: 0 0 8px 0;
          }

          .mobile-mage-details {
            display: none;
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
            position: relative;

            .exp-progress {
              border-radius: 6px;
              box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
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
              pointer-events: none;
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

            .rune-quantity {
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

@media (max-width: 768px) {
  .magic-mages {
    .mages-layout {
      grid-template-columns: 1fr;
      grid-template-rows: auto;
      height: auto;
    }

    .mage-panel-placeholder {
      .mage-item {
        .mobile-mage-details {
          display: block !important;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid #4a5578;

          .experience-section {
            margin-bottom: 8px;

            .exp-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 4px;

              .exp-label {
                color: #a1a1aa;
                font-size: 10px;
                font-weight: 500;
              }

              .exp-values {
                color: #e5e7eb;
                font-size: 10px;
                font-weight: bold;
              }
            }

            .exp-bar-container {
              .exp-progress {
                border-radius: 4px;
                box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
              }
            }
          }

          .mobile-runes {
            .runes-label {
              color: #a1a1aa;
              font-size: 10px;
              font-weight: 500;
              margin-bottom: 4px;
            }

            .rune-grid-mobile {
              display: flex;
              gap: 4px;
              flex-wrap: wrap;
              align-items: center;

              .rune-item-mobile {
                display: flex;
                align-items: center;
                gap: 2px;
                padding: 2px 4px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 4px;
                border: 1px solid currentColor;

                i {
                  font-size: 10px;
                }

                .rune-quantity {
                  font-size: 9px;
                  font-weight: bold;
                }
              }

              .more-runes {
                color: #a1a1aa;
                font-size: 9px;
                font-style: italic;
                padding: 2px 4px;
                background: rgba(161, 161, 170, 0.2);
                border-radius: 4px;
              }
            }
          }
        }
      }
    }

    .mage-management {
      display: none;
    }
  }
}
</style>
