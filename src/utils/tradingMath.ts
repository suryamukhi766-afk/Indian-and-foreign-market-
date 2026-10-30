/**
 * Pure calculation logic for paper trading, position math, and technical indicators.
 * Fully decoupled for unit testing.
 */

export function calculatePnL(
  side: 'BUY' | 'SELL',
  avgPrice: number,
  currentPrice: number,
  quantity: number
): number {
  if (quantity <= 0 || avgPrice <= 0) return 0;
  if (side === 'BUY') {
    return (currentPrice - avgPrice) * quantity;
  } else {
    return (avgPrice - currentPrice) * quantity;
  }
}

export function calculatePnLPercent(
  avgPrice: number,
  currentPrice: number,
  side: 'BUY' | 'SELL' = 'BUY'
): number {
  if (avgPrice <= 0) return 0;
  if (side === 'BUY') {
    return ((currentPrice - avgPrice) / avgPrice) * 100;
  } else {
    return ((avgPrice - currentPrice) / avgPrice) * 100;
  }
}

export function calculateInvestedValue(avgPrice: number, quantity: number): number {
  return Math.max(0, avgPrice * quantity);
}

export function calculateNewAvgPrice(
  currentQty: number,
  currentAvg: number,
  addedQty: number,
  newPrice: number
): number {
  const totalQty = currentQty + addedQty;
  if (totalQty <= 0) return 0;
  const totalCost = currentQty * currentAvg + addedQty * newPrice;
  return totalCost / totalQty;
}

export function calculateRiskRewardRatio(
  entryPrice: number,
  targetPrice: number,
  stopLossPrice: number
): string {
  if (entryPrice <= 0 || targetPrice <= 0 || stopLossPrice <= 0) return '1 : 1';
  const risk = Math.abs(entryPrice - stopLossPrice);
  const reward = Math.abs(targetPrice - entryPrice);
  if (risk === 0) return '1 : ∞';
  const ratio = (reward / risk).toFixed(2);
  return `1 : ${ratio}`;
}

export function checkLimitOrderTrigger(
  side: 'BUY' | 'SELL',
  limitPrice: number,
  currentPrice: number
): boolean {
  if (side === 'BUY') {
    // Buy limit triggers when price drops to or below the limit price
    return currentPrice <= limitPrice;
  } else {
    // Sell limit triggers when price rises to or above the limit price
    return currentPrice >= limitPrice;
  }
}

export function formatCurrency(
  amount: number,
  currency: 'INR' | 'USD',
  compact: boolean = false
): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  if (currency === 'INR') {
    if (compact) {
      if (absAmount >= 10000000) {
        return `${isNegative ? '-' : ''}₹${(absAmount / 10000000).toFixed(2)} Cr`;
      }
      if (absAmount >= 100000) {
        return `${isNegative ? '-' : ''}₹${(absAmount / 100000).toFixed(2)} L`;
      }
      if (absAmount >= 1000) {
        return `${isNegative ? '-' : ''}₹${(absAmount / 1000).toFixed(1)}k`;
      }
    }
    const formatted = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(absAmount);
    return `${isNegative ? '-' : ''}₹${formatted}`;
  } else {
    if (compact && absAmount >= 1000) {
      if (absAmount >= 1000000) {
        return `${isNegative ? '-' : ''}$${(absAmount / 1000000).toFixed(2)}M`;
      }
      return `${isNegative ? '-' : ''}$${(absAmount / 1000).toFixed(1)}k`;
    }
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(absAmount);
    return `${isNegative ? '-' : ''}$${formatted}`;
  }
}

export function formatPercent(percent: number, showSign: boolean = true): string {
  const sign = percent > 0 && showSign ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
}

/**
 * Technical Indicator calculations
 */
export function calculateSMA(data: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j];
      }
      result.push(sum / period);
    }
  }
  return result;
}

export function calculateEMA(data: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  const k = 2 / (period + 1);
  let prevEma: number | null = null;

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else if (i === period - 1) {
      // First EMA is SMA
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j];
      }
      prevEma = sum / period;
      result.push(prevEma);
    } else {
      const currentEma: number = data[i] * k + (prevEma as number) * (1 - k);
      result.push(currentEma);
      prevEma = currentEma;
    }
  }
  return result;
}

export function calculateRSI(closes: number[], period: number = 14): (number | null)[] {
  const result: (number | null)[] = [];
  if (closes.length < period + 1) {
    return closes.map(() => null);
  }

  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    gains.push(diff >= 0 ? diff : 0);
    losses.push(diff < 0 ? -diff : 0);
  }

  // Initial average gain & loss
  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  for (let i = 0; i < period; i++) {
    result.push(null);
  }

  const firstRS = avgLoss === 0 ? 100 : avgGain / avgLoss;
  const firstRSI = avgLoss === 0 ? 100 : 100 - 100 / (1 + firstRS);
  result.push(firstRSI);

  for (let i = period + 1; i < closes.length; i++) {
    const currentGain = gains[i - 1];
    const currentLoss = losses[i - 1];

    avgGain = (avgGain * (period - 1) + currentGain) / period;
    avgLoss = (avgLoss * (period - 1) + currentLoss) / period;

    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = avgLoss === 0 ? 100 : 100 - 100 / (1 + rs);
    result.push(rsi);
  }

  return result;
}
