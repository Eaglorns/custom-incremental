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

        <div v-if="mageViews.length === 0" class="no-mages">
          <div class="empty-state">
            <i :class="iconStyle + 'fa-users fa-3x'"></i>
            <p>Нет нанятых магов</p>
          </div>
        </div>

        <div v-else class="mage-list">
          <div v-for="mv in mageViews" :key="mv.mage.id" class="mage-item">
            <div class="mage-card">
              <div class="mage-avatar">
                <i :class="iconStyle + mv.mage.icon" :style="{ color: mv.mage.iconColor }"></i>
              </div>
              <div class="mage-info">
                <div class="mage-header">
                  <div class="mage-name">{{ mv.mage.name }}</div>
                  <div class="mage-rank" :style="{ color: mv.mage.rank.color }">
                    {{ mv.mage.rank.name }}
                  </div>
                </div>
                <div class="mage-level">Уровень {{ formatNumber(mv.mage.level) }}</div>

                <div class="mobile-mage-details">
                  <div class="experience-section">
                    <div class="exp-header">
                      <span class="exp-label">Опыт:</span>
                      <span class="exp-values">
                        {{ formatNumber(mv.progress.current) }} /
                        {{ formatNumber(mv.progress.max) }}
                      </span>
                    </div>
                    <div class="exp-bar-container">
                      <q-linear-progress
                        :value="mv.progress.percentage / 100"
                        color="primary"
                        track-color="grey-8"
                        size="8px"
                        rounded
                        class="exp-progress"
                      />
                    </div>
                  </div>

                  <div v-if="mv.runes.length > 0" class="mobile-runes">
                    <div class="runes-label">Руны:</div>
                    <div class="rune-grid-mobile">
                      <div
                        v-for="rune in mv.runes"
                        :key="rune.id"
                        class="rune-item-mobile"
                        :style="{ color: rune.color }"
                      >
                        <i :class="iconStyle + rune.icon"></i>
                        <span class="rune-quantity">
                          {{ formatNumber(mv.mage.runeQuantities[rune.id] || new Decimal(0)) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
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
import { useStoreMagic } from 'stores/magic';
import { useStoreSetting } from 'src/stores/setting';

const storeMagic = useStoreMagic();
const storeData = useStoreData();
const storeSetting = useStoreSetting();

const iconStyle = computed(() => {
  return storeSetting.iconStyle;
});

const formatNumber = storeData.formatNumber;

const runeMetaMap = new Map<string, (typeof RUNE_META)[number]>(RUNE_META.map((m) => [m.id, m]));

const mageViews = computed(() =>
  storeMagic.mages.map((mage) => {
    const progress = storeMagic.getMageExperienceProgress(mage);
    const runes = mage.runeIds
      .map((id) => runeMetaMap.get(id))
      .filter((r): r is NonNullable<typeof r> => Boolean(r))
      .sort((a, b) => {
        const qa = mage.runeQuantities[a.id] || new Decimal(0);
        const qb = mage.runeQuantities[b.id] || new Decimal(0);
        return qb.cmp(qa);
      });
    return { mage, progress, runes };
  }),
);
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
    grid-template-columns: 1fr;
    gap: 16px;
    height: auto;
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
      column-width: 320px;
      column-gap: 12px;
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
        display: inline-block;
        width: 100%;
        margin: 0 0 12px;
        break-inside: avoid;
        -webkit-column-break-inside: avoid;
        -moz-column-break-inside: avoid;
      }

      .mage-card {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 12px;
        background: linear-gradient(145deg, #363a5c, #2d3251);
        border: 1px solid #4a5578;
        border-radius: 8px;
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
          display: block;

          .mobile-runes {
            .rune-grid-mobile {
              display: flex;
              flex-wrap: wrap;
              gap: 6px;
              align-items: center;
            }
            .rune-item-mobile {
              display: flex;
              align-items: center;
              gap: 4px;
              padding: 3px 6px;
              background: rgba(0, 0, 0, 0.25);
              border-radius: 4px;
              border: 1px solid currentColor;
              i {
                font-size: 12px;
              }
              .rune-quantity {
                font-size: 10px;
                font-weight: bold;
              }
            }
            .more-runes {
              color: #a1a1aa;
              font-size: 10px;
              font-style: italic;
              padding: 2px 6px;
              background: rgba(161, 161, 170, 0.2);
              border-radius: 4px;
            }
          }
        }
      }
    }
  }

  .mage-management {
    display: none !important;
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
      padding: 12px;

      .mage-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .mage-card {
        gap: 8px;
        padding: 10px;
      }

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

    .mage-management {
      display: none;
    }
  }
}
</style>
