import type Decimal from 'break_eternity.js';

export interface Research {
  isActive: boolean;
  cost: Decimal;
  currentTime: Decimal;
  time: Decimal;
  bonus: Decimal;
  level: Decimal;
  costMultiply: Decimal;
  timeMultiply: Decimal;
  maxLevel: Decimal;
}

export interface Scientist {
  id: string;
  level: Decimal;
  exp: Decimal;
  intellect: Decimal;
  efficiency: Decimal;
}

export interface HelperState {
  key: string;
  icon: string;
  title: string;
  count: Decimal;
  percent: Decimal;
  cost: {
    count: Decimal;
    countMultiply: Decimal;
    percent: Decimal;
    percentMultiply: Decimal;
  };
}
