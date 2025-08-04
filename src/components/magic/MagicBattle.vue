<template>
  <div class="battle-panel">
    <div class="battle-area">
      <div class="battle-grid">
        <div class="monster-card">
          <div class="monster-header">
            <div class="monster-avatar">
              <i class="fas fa-dragon" style="color: #dc2626"></i>
            </div>
            <div class="monster-info">
              <h6 class="monster-name">Огненный дракон</h6>
              <div class="monster-level">Уровень 5</div>
            </div>
          </div>

          <div class="monster-health">
            <div class="health-label">Здоровье</div>
            <div class="health-bar">
              <div class="health-fill" style="width: 65%"></div>
              <div class="health-text">650/1000</div>
            </div>
          </div>

          <div class="essence-rewards">
            <div class="rewards-label">Награды:</div>
            <div class="rewards-list">
              <div class="reward-item">
                <i class="fas fa-fire" style="color: #dc2626"></i>
                <span>25</span>
              </div>
              <div class="reward-item">
                <i class="fas fa-star" style="color: #eab308"></i>
                <span>10</span>
              </div>
            </div>
          </div>

          <div class="monster-actions">
            <q-btn
              color="negative"
              label="Сменить цель"
              icon="fas fa-refresh"
              size="xs"
              class="full-width action-btn"
              unelevated
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.battle-panel {
  background: linear-gradient(145deg, #2a2d47, #1e2139);
  border: 1px solid #3a4763;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .battle-area {
    flex: 1;
    margin-bottom: 12px;

    .battle-grid {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }

    .monster-card {
      background: linear-gradient(145deg, #4a2c5a, #3a1f47);
      border: 2px solid #6b4678;
      border-radius: 16px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 450px;
      width: 100%;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      transition: all 0.3s ease;

      .monster-header {
        display: flex;
        align-items: center;
        gap: 16px;

        .monster-avatar {
          font-size: 36px;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(145deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2));
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .monster-info {
          flex: 1;

          .monster-name {
            color: #e5e7eb;
            margin: 0;
            font-size: 18px;
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
          }

          .monster-level {
            color: #a1a1aa;
            font-size: 14px;
            font-weight: 500;
          }
        }
      }

      .monster-health {
        .health-label {
          color: #a1a1aa;
          font-size: 13px;
          margin-bottom: 6px;
          font-weight: 500;
        }

        .health-bar {
          position: relative;
          height: 24px;
          background: linear-gradient(145deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4));
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);

          .health-fill {
            height: 100%;
            background: linear-gradient(90deg, #ef4444, #dc2626, #b91c1c);
            transition: width 0.5s ease;
            box-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
          }

          .health-text {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 13px;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
          }
        }
      }

      .essence-rewards {
        .rewards-label {
          color: #a1a1aa;
          font-size: 13px;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .rewards-list {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;

          .reward-item {
            display: flex;
            align-items: center;
            gap: 6px;
            background: linear-gradient(145deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2));
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 6px 10px;
            border-radius: 16px;
            font-size: 12px;
            color: #e5e7eb;
            font-weight: 500;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            transition: all 0.2s ease;

            &:hover {
              transform: translateY(-1px);
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            }
          }
        }
      }

      .monster-actions {
        .action-btn {
          border-radius: 10px;
          font-weight: 600;
          transition: all 0.2s ease;

          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
          }
        }
      }
    }
  }
}

// Адаптивность
@media (max-width: 768px) {
  .battle-panel {
    .battle-area {
      height: 400px;

      .monster-card {
        .monster-header .monster-avatar {
          font-size: 24px;
          width: 40px;
          height: 40px;
        }
      }
    }
  }
}
</style>
