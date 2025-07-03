import type Decimal from 'break_eternity.js';

export interface Research {
  cost: Decimal;
  currentTime: Decimal;
  time: Decimal;
  bonus: Decimal;
  level: Decimal;
  costMultiply: Decimal;
  timeMultiply: Decimal;
  maxLevel: Decimal;
}

export interface HelperState {
  key: string;
  icon: string;
  title: string;
  description: string;
  count: Decimal;
  percent: Decimal;
  chance: Decimal;
  cost: {
    count: Decimal;
    countMultiply: Decimal;
    percent: Decimal;
    percentMultiply: Decimal;
  };
}
