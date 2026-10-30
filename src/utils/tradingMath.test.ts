import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePnL,
  calculatePnLPercent,
  calculateInvestedValue,
  calculateNewAvgPrice,
  calculateRiskRewardRatio,
  checkLimitOrderTrigger,
  formatCurrency,
  formatPercent,
  calculateSMA,
} from './tradingMath';

test('calculatePnL handles buy positions correctly', () => {
  // Bought 10 shares at 100, current price 120 -> PnL = (120 - 100) * 10 = 200
  assert.equal(calculatePnL('BUY', 100, 120, 10), 200);
  // Bought 10 shares at 100, current price 80 -> PnL = (80 - 100) * 10 = -200
  assert.equal(calculatePnL('BUY', 100, 80, 10), -200);
});

test('calculatePnLPercent returns accurate percentage', () => {
  // 100 to 120 -> +20%
  assert.equal(calculatePnLPercent(100, 120, 'BUY'), 20);
  // 100 to 80 -> -20%
  assert.equal(calculatePnLPercent(100, 80, 'BUY'), -20);
});

test('calculateInvestedValue calculates proper capital outlay', () => {
  assert.equal(calculateInvestedValue(2500, 4), 10000);
  assert.equal(calculateInvestedValue(0, 4), 0);
});

test('calculateNewAvgPrice performs weighted averaging', () => {
  // 10 shares @ 100 = 1000. Add 10 shares @ 200 = 2000. Total 3000 / 20 = 150
  const avg = calculateNewAvgPrice(10, 100, 10, 200);
  assert.equal(avg, 150);
});

test('calculateRiskRewardRatio computes correct ratio string', () => {
  // Entry: 100, Target: 130 (reward 30), SL: 90 (risk 10) -> 1 : 3.00
  const rr = calculateRiskRewardRatio(100, 130, 90);
  assert.equal(rr, '1 : 3.00');
});

test('checkLimitOrderTrigger checks limit conditions accurately', () => {
  // BUY limit at 100 triggers if price <= 100
  assert.equal(checkLimitOrderTrigger('BUY', 100, 99), true);
  assert.equal(checkLimitOrderTrigger('BUY', 100, 100), true);
  assert.equal(checkLimitOrderTrigger('BUY', 100, 101), false);

  // SELL limit at 100 triggers if price >= 100
  assert.equal(checkLimitOrderTrigger('SELL', 100, 101), true);
  assert.equal(checkLimitOrderTrigger('SELL', 100, 99), false);
});

test('formatCurrency handles INR and USD properly', () => {
  assert.equal(formatCurrency(100000, 'INR'), '₹1,00,000.00');
  assert.equal(formatCurrency(100000, 'USD'), '$100,000.00');
  assert.equal(formatCurrency(-500, 'INR'), '-₹500.00');
});

test('formatPercent handles signs and decimals', () => {
  assert.equal(formatPercent(5.25), '+5.25%');
  assert.equal(formatPercent(-3.5), '-3.50%');
  assert.equal(formatPercent(0), '0.00%');
});

test('calculateSMA generates moving average', () => {
  const sma = calculateSMA([10, 20, 30, 40, 50], 3);
  assert.deepEqual(sma, [null, null, 20, 30, 40]);
});
