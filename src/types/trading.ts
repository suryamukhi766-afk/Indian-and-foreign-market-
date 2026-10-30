export type MarketType = 'IN' | 'US';

export interface StockQuote {
  symbol: string;
  name: string;
  market: MarketType;
  currency: 'INR' | 'USD';
  currentPrice: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  volume: number;
  sector: string;
  exchange: string;
  category?: 'STOCK' | 'COMMODITY' | 'CRYPTO';
}

export interface CandleData {
  time: number | string; // Unix timestamp in seconds or YYYY-MM-DD
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export type OrderType = 'MARKET' | 'LIMIT';
export type OrderSide = 'BUY' | 'SELL';
export type OrderStatus = 'EXECUTED' | 'PENDING' | 'CANCELLED' | 'REJECTED';

export interface Order {
  id: string;
  symbol: string;
  stockName: string;
  market: MarketType;
  currency: 'INR' | 'USD';
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price: number; // Order execution price or limit price
  limitPrice?: number;
  totalAmount: number;
  status: OrderStatus;
  timestamp: number;
}

export interface Position {
  id: string;
  symbol: string;
  stockName: string;
  market: MarketType;
  currency: 'INR' | 'USD';
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  investedValue: number;
  currentValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  openedAt: number;
}

export interface PortfolioSummary {
  startingBalance: number;
  availableBalance: number;
  investedBalance: number;
  totalPortfolioValue: number;
  totalUnrealizedPnL: number;
  totalRealizedPnL: number;
  totalPnLPercent: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AcademyLesson {
  id: string;
  level: number;
  levelName: string;
  title: string;
  durationMinutes: number;
  summary: string;
  youtubeId: string;
  content: string;
  keyTakeaways: string[];
  patternDiagram?: string;
  quiz: QuizQuestion[];
}

export interface JournalComment {
  id: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: number;
}

export interface JournalEntry {
  id: string;
  authorName: string;
  authorBadge: string;
  authorAvatar: string;
  stockSymbol: string;
  stockName: string;
  market: MarketType;
  direction: 'BULLISH' | 'BEARISH';
  entryPrice: number;
  targetPrice: number;
  stopLossPrice: number;
  riskRewardRatio: string;
  setupExplanation: string;
  chartImageUrl: string;
  likes: number;
  isLikedByUser?: boolean;
  comments: JournalComment[];
  timestamp: number;
  status: 'ACTIVE' | 'TARGET_HIT' | 'STOPLOSS_HIT' | 'CLOSED';
  isReported?: boolean;
}

export interface VIPSignal {
  id: string;
  stockSymbol: string;
  stockName: string;
  market: MarketType;
  direction: 'LONG' | 'SHORT';
  entryZone: string; // e.g. "₹2,920 - ₹2,940" or "$180 - $182"
  entryPrice: number;
  target1: number;
  target2: number;
  stopLoss: number;
  riskReward: string;
  timeframe: string;
  technicalRationale: string;
  status: 'ACTIVE' | 'TARGET_1_HIT' | 'TARGET_2_HIT' | 'STOPLOSS_HIT' | 'EXPIRED';
  publishedAt: string;
  expiresAt: string;
  isVipOnly: boolean;
}

export interface AdminStats {
  totalTrades: number;
  totalVolumeINR: number;
  totalVolumeUSD: number;
  activeUsers: number;
  signalsCount: number;
  journalCount: number;
}
