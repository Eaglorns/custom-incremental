import type Decimal from 'break_eternity.js';

export interface ResearchBase {
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

export interface ResearchScientist {
  id: string;
  level: Decimal;
  exp: Decimal;
  intellect: Decimal;
  efficiency: Decimal;
}

export interface AutomaticShopHelpers {
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

export interface PrestigeUpgrade {
  key: string;
  icon: string;
  title: string;
  description: string;
  cost: Decimal;
  level: Decimal;
  costGrowth: Decimal;
  maxLevel: number;
}
