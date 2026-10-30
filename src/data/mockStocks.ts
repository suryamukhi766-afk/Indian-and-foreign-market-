import { StockQuote, CandleData, MarketType } from '../types/trading';

export const INDIAN_STOCKS: StockQuote[] = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    market: 'IN',
    currency: 'INR',
    currentPrice: 2942.50,
    openPrice: 2920.00,
    highPrice: 2955.00,
    lowPrice: 2912.00,
    previousClose: 2915.20,
    change: 27.30,
    changePercent: 0.94,
    volume: 8421000,
    sector: 'Energy & Conglomerate',
    exchange: 'NSE',
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    market: 'IN',
    currency: 'INR',
    currentPrice: 4125.80,
    openPrice: 4095.00,
    highPrice: 4140.00,
    lowPrice: 4082.00,
    previousClose: 4098.50,
    change: 27.30,
    changePercent: 0.67,
    volume: 2150000,
    sector: 'Information Technology',
    exchange: 'NSE',
  },
  {
    symbol: 'INFY',
    name: 'Infosys Limited',
    market: 'IN',
    currency: 'INR',
    currentPrice: 1845.20,
    openPrice: 1860.00,
    highPrice: 1868.50,
    lowPrice: 1838.00,
    previousClose: 1858.40,
    change: -13.20,
    changePercent: -0.71,
    volume: 5320000,
    sector: 'Information Technology',
    exchange: 'NSE',
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd.',
    market: 'IN',
    currency: 'INR',
    currentPrice: 1682.40,
    openPrice: 1670.00,
    highPrice: 1690.00,
    lowPrice: 1665.00,
    previousClose: 1668.75,
    change: 13.65,
    changePercent: 0.82,
    volume: 14200000,
    sector: 'Banking & Financial',
    exchange: 'NSE',
  },
  {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Ltd.',
    market: 'IN',
    currency: 'INR',
    currentPrice: 1264.10,
    openPrice: 1255.00,
    highPrice: 1272.50,
    lowPrice: 1251.00,
    previousClose: 1252.30,
    change: 11.80,
    changePercent: 0.94,
    volume: 9800000,
    sector: 'Banking & Financial',
    exchange: 'NSE',
  },
  {
    symbol: 'SBIN',
    name: 'State Bank of India',
    market: 'IN',
    currency: 'INR',
    currentPrice: 815.65,
    openPrice: 808.00,
    highPrice: 822.40,
    lowPrice: 806.20,
    previousClose: 809.10,
    change: 6.55,
    changePercent: 0.81,
    volume: 18500000,
    sector: 'Public Sector Banking',
    exchange: 'NSE',
  },
  {
    symbol: 'ITC',
    name: 'ITC Limited',
    market: 'IN',
    currency: 'INR',
    currentPrice: 488.90,
    openPrice: 486.00,
    highPrice: 492.50,
    lowPrice: 485.10,
    previousClose: 485.80,
    change: 3.10,
    changePercent: 0.64,
    volume: 11200000,
    sector: 'FMCG & Consumer Goods',
    exchange: 'NSE',
  },
  {
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Ltd.',
    market: 'IN',
    currency: 'INR',
    currentPrice: 948.30,
    openPrice: 935.00,
    highPrice: 955.00,
    lowPrice: 932.00,
    previousClose: 936.50,
    change: 11.80,
    changePercent: 1.26,
    volume: 16400000,
    sector: 'Automobile',
    exchange: 'NSE',
  },
  {
    symbol: 'BHARTIARTL',
    name: 'Bharti Airtel Ltd.',
    market: 'IN',
    currency: 'INR',
    currentPrice: 1698.75,
    openPrice: 1685.00,
    highPrice: 1712.00,
    lowPrice: 1680.00,
    previousClose: 1682.30,
    change: 16.45,
    changePercent: 0.98,
    volume: 4800000,
    sector: 'Telecommunications',
    exchange: 'NSE',
  },
  {
    symbol: 'LT',
    name: 'Larsen & Toubro Ltd.',
    market: 'IN',
    currency: 'INR',
    currentPrice: 3620.00,
    openPrice: 3590.00,
    highPrice: 3645.00,
    lowPrice: 3582.00,
    previousClose: 3595.00,
    change: 25.00,
    changePercent: 0.70,
    volume: 2450000,
    sector: 'Infrastructure & Capital Goods',
    exchange: 'NSE',
  },
];

export const US_STOCKS: StockQuote[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    market: 'US',
    currency: 'USD',
    currentPrice: 232.50,
    openPrice: 230.10,
    highPrice: 234.20,
    lowPrice: 229.80,
    previousClose: 230.25,
    change: 2.25,
    changePercent: 0.98,
    volume: 48900000,
    sector: 'Consumer Electronics',
    exchange: 'NASDAQ',
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    market: 'US',
    currency: 'USD',
    currentPrice: 448.20,
    openPrice: 442.00,
    highPrice: 450.80,
    lowPrice: 441.50,
    previousClose: 443.10,
    change: 5.10,
    changePercent: 1.15,
    volume: 21300000,
    sector: 'Enterprise Software & Cloud',
    exchange: 'NASDAQ',
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    market: 'US',
    currency: 'USD',
    currentPrice: 141.80,
    openPrice: 138.50,
    highPrice: 143.50,
    lowPrice: 137.90,
    previousClose: 138.90,
    change: 2.90,
    changePercent: 2.09,
    volume: 98400000,
    sector: 'Semiconductors & AI Hardware',
    exchange: 'NASDAQ',
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    market: 'US',
    currency: 'USD',
    currentPrice: 178.60,
    openPrice: 176.40,
    highPrice: 179.90,
    lowPrice: 175.80,
    previousClose: 176.80,
    change: 1.80,
    changePercent: 1.02,
    volume: 28400000,
    sector: 'Internet & Cloud Services',
    exchange: 'NASDAQ',
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    market: 'US',
    currency: 'USD',
    currentPrice: 194.30,
    openPrice: 192.00,
    highPrice: 195.80,
    lowPrice: 191.20,
    previousClose: 192.50,
    change: 1.80,
    changePercent: 0.94,
    volume: 37500000,
    sector: 'E-Commerce & Cloud Services',
    exchange: 'NASDAQ',
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    market: 'US',
    currency: 'USD',
    currentPrice: 262.40,
    openPrice: 255.00,
    highPrice: 266.80,
    lowPrice: 253.40,
    previousClose: 254.90,
    change: 7.50,
    changePercent: 2.94,
    volume: 89000000,
    sector: 'Electric Vehicles & Clean Energy',
    exchange: 'NASDAQ',
  },
  {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    market: 'US',
    currency: 'USD',
    currentPrice: 585.10,
    openPrice: 580.00,
    highPrice: 591.20,
    lowPrice: 578.40,
    previousClose: 579.50,
    change: 5.60,
    changePercent: 0.97,
    volume: 15600000,
    sector: 'Social Media & AI',
    exchange: 'NASDAQ',
  },
  {
    symbol: 'AMD',
    name: 'Advanced Micro Devices',
    market: 'US',
    currency: 'USD',
    currentPrice: 158.90,
    openPrice: 156.20,
    highPrice: 161.40,
    lowPrice: 155.10,
    previousClose: 156.70,
    change: 2.20,
    changePercent: 1.40,
    volume: 42100000,
    sector: 'Semiconductors',
    exchange: 'NASDAQ',
    category: 'STOCK',
  },
  {
    symbol: 'XAUUSD',
    name: 'Gold / US Dollar (Spot)',
    market: 'US',
    currency: 'USD',
    currentPrice: 2748.60,
    openPrice: 2736.00,
    highPrice: 2758.40,
    lowPrice: 2732.10,
    previousClose: 2736.50,
    change: 12.10,
    changePercent: 0.44,
    volume: 584000,
    sector: 'Precious Metals & Commodities',
    exchange: 'METALS / FOREX',
    category: 'COMMODITY',
  },
  {
    symbol: 'BTCUSD',
    name: 'Bitcoin / US Dollar',
    market: 'US',
    currency: 'USD',
    currentPrice: 68450.00,
    openPrice: 67100.00,
    highPrice: 69200.00,
    lowPrice: 66800.00,
    previousClose: 67350.00,
    change: 1100.00,
    changePercent: 1.63,
    volume: 3820000000,
    sector: 'Cryptocurrency (Digital Gold)',
    exchange: 'CRYPTO',
    category: 'CRYPTO',
  },
  {
    symbol: 'ETHUSD',
    name: 'Ethereum / US Dollar',
    market: 'US',
    currency: 'USD',
    currentPrice: 2642.50,
    openPrice: 2595.00,
    highPrice: 2670.00,
    lowPrice: 2585.00,
    previousClose: 2601.20,
    change: 41.30,
    changePercent: 1.59,
    volume: 1840000000,
    sector: 'Smart Contracts Platform',
    exchange: 'CRYPTO',
    category: 'CRYPTO',
  },
  {
    symbol: 'SOLUSD',
    name: 'Solana / US Dollar',
    market: 'US',
    currency: 'USD',
    currentPrice: 178.60,
    openPrice: 172.00,
    highPrice: 181.50,
    lowPrice: 171.20,
    previousClose: 173.10,
    change: 5.50,
    changePercent: 3.18,
    volume: 890000000,
    sector: 'High Speed Blockchain',
    exchange: 'CRYPTO',
    category: 'CRYPTO',
  },
];

/**
 * Deterministic pseudo-random number generator for historical candles
 */
function createSeededRandom(seed: number) {
  let s = seed;
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export type ChartTimeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '1D' | '1W';

export function generateCandlesticks(
  symbol: string,
  basePrice: number,
  timeframe: ChartTimeframe,
  count: number = 80
): CandleData[] {
  const candles: CandleData[] = [];
  // Use symbol hash for deterministic pattern
  let seed = 0;
  for (let i = 0; i < symbol.length; i++) {
    seed += symbol.charCodeAt(i) * (i + 1);
  }
  const rand = createSeededRandom(seed + timeframe.length);

  // Time step in seconds
  let stepSec = 60; // 1m
  if (timeframe === '5m') stepSec = 300;
  else if (timeframe === '15m') stepSec = 900;
  else if (timeframe === '1h') stepSec = 3600;
  else if (timeframe === '4h') stepSec = 14400;
  else if (timeframe === '1D') stepSec = 86400;
  else if (timeframe === '1W') stepSec = 604800;

  const nowSec = Math.floor(Date.now() / 1000);
  const startTime = nowSec - count * stepSec;

  // Volatility percentage per bar
  const volFactor =
    timeframe === '1m' ? 0.003 :
    timeframe === '5m' ? 0.005 :
    timeframe === '15m' ? 0.008 :
    timeframe === '1h' ? 0.012 :
    timeframe === '4h' ? 0.018 :
    timeframe === '1D' ? 0.025 : 0.04;

  let currentClose = basePrice * (1 - 0.04 * (rand() - 0.5));

  for (let i = 0; i < count; i++) {
    const time = startTime + i * stepSec;
    const open = currentClose;
    const direction = rand() > 0.48 ? 1 : -1;
    const change = open * volFactor * rand() * direction;
    const close = Math.max(1, open + change);
    const wick1 = Math.max(open, close) + open * volFactor * rand() * 0.7;
    const wick2 = Math.min(open, close) - open * volFactor * rand() * 0.7;
    const high = Math.max(open, close, wick1);
    const low = Math.min(open, close, wick2);
    const volume = Math.floor(10000 + rand() * 85000);

    candles.push({
      time,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    });

    currentClose = close;
  }

  // Adjust last candle close to match current stock price
  if (candles.length > 0) {
    const last = candles[candles.length - 1];
    last.close = basePrice;
    last.high = Math.max(last.high, basePrice);
    last.low = Math.min(last.low, basePrice);
  }

  return candles;
}
