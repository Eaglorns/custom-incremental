import Decimal from 'break_eternity.js';

const ZERO = new Decimal(0);

export const buyMax = (points: Decimal, price: Decimal, count: Decimal) => {
  if (price.lte(0) || points.lte(0) || count.lte(0)) {
    return { bought: ZERO, rest: ZERO };
  }

  const bought = Decimal.min(count, points.div(price).floor());
  const rest = bought.mul(price);

  return { bought, rest };
};

export const toDec = (v?: string | number | Decimal, def = '0'): Decimal => {
  if (v instanceof Decimal) return v;
  return new Decimal(v ?? def);
};
