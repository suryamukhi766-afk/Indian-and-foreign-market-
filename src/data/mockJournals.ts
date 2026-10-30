import { JournalEntry } from '../types/trading';

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'journal-1',
    authorName: 'Soni MasterTrader',
    authorBadge: 'Lead Mentor',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    stockSymbol: 'RELIANCE',
    stockName: 'Reliance Industries Ltd.',
    market: 'IN',
    direction: 'BULLISH',
    entryPrice: 2940.00,
    targetPrice: 3080.00,
    stopLossPrice: 2880.00,
    riskRewardRatio: '1 : 2.33',
    setupExplanation: 'Multi-month trendline breakout followed by volume accumulation above the ₹2,900 psychological boundary. Expecting institutional rotation into blue-chip energy and retail segments. Risking 60 points for 140 points potential gain.',
    chartImageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    likes: 42,
    isLikedByUser: false,
    timestamp: Date.now() - 1000 * 60 * 60 * 6, // 6 hours ago
    status: 'ACTIVE',
    comments: [
      {
        id: 'c-1',
        userName: 'Aarav Sharma',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        content: 'Clean breakout on the daily timeframe! Added this to my paper trading watchlist.',
        timestamp: Date.now() - 1000 * 60 * 60 * 4,
      },
      {
        id: 'c-2',
        userName: 'Priya Patel',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        content: 'RSI at 58 with expanding volume gives solid conviction. Thanks for sharing the setup!',
        timestamp: Date.now() - 1000 * 60 * 60 * 2,
      }
    ]
  },
  {
    id: 'journal-2',
    authorName: 'Dev Trader',
    authorBadge: 'Level 8 Scholar',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    stockSymbol: 'NVDA',
    stockName: 'NVIDIA Corporation',
    market: 'US',
    direction: 'BULLISH',
    entryPrice: 141.00,
    targetPrice: 154.00,
    stopLossPrice: 136.00,
    riskRewardRatio: '1 : 2.60',
    setupExplanation: 'High tight flag breakout on the 4H chart after consolidating above previous resistance at $138. Volume spike on the hourly candle signals buyers absorbing liquidity before the next leg up.',
    chartImageUrl: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=80',
    likes: 29,
    isLikedByUser: false,
    timestamp: Date.now() - 1000 * 60 * 60 * 18,
    status: 'ACTIVE',
    comments: [
      {
        id: 'c-3',
        userName: 'Marcus Vance',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        content: 'Holding 10 shares in US paper account. Stop loss firmly parked at $136.',
        timestamp: Date.now() - 1000 * 60 * 60 * 12,
      }
    ]
  },
  {
    id: 'journal-3',
    authorName: 'Ananya Roy',
    authorBadge: 'Price Action Analyst',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    stockSymbol: 'HDFCBANK',
    stockName: 'HDFC Bank Ltd.',
    market: 'IN',
    direction: 'BULLISH',
    entryPrice: 1675.00,
    targetPrice: 1735.00,
    stopLossPrice: 1648.00,
    riskRewardRatio: '1 : 2.22',
    setupExplanation: 'Double bottom formation at major structural support ₹1,650. Neckline retest successfully held on the 15-minute timeframe with a strong bullish engulfing candle.',
    chartImageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80',
    likes: 19,
    isLikedByUser: false,
    timestamp: Date.now() - 1000 * 60 * 60 * 36,
    status: 'TARGET_HIT',
    comments: []
  }
];
