import Decimal from 'break_eternity.js';

export const buyMax = (points: Decimal, price: Decimal, count: Decimal) => {
  if (price.lte(0) || points.lte(0) || count.lte(0)) {
    return { bought: new Decimal(0), rest: new Decimal(0) };
  }
  const maxCanBuy = points.div(price).floor();
  const bought = Decimal.min(count, maxCanBuy);
  const rest = bought.mul(price);
  return { bought, rest };
};

export const toDec = (v?: string | number | Decimal, def = '0') => new Decimal(v ?? def);
