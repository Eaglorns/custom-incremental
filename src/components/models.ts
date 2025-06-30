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
