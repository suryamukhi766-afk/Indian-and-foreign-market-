import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  MarketType,
  StockQuote,
  Order,
  Position,
  PortfolioSummary,
  JournalEntry,
  VIPSignal,
  AcademyLesson,
  OrderType,
  OrderSide,
} from '../types/trading';
import { INDIAN_STOCKS, US_STOCKS } from '../data/mockStocks';
import { INITIAL_VIP_SIGNALS } from '../data/mockSignals';
import { INITIAL_JOURNAL_ENTRIES } from '../data/mockJournals';
import { ACADEMY_LESSONS } from '../data/mockAcademy';
import {
  calculatePnL,
  calculatePnLPercent,
  calculateInvestedValue,
  calculateNewAvgPrice,
  checkLimitOrderTrigger,
} from '../utils/tradingMath';

interface TradingContextType {
  activeMarket: MarketType;
  setActiveMarket: (market: MarketType) => void;
  selectedStock: StockQuote;
  setSelectedStock: (stock: StockQuote) => void;
  indianStocks: StockQuote[];
  usStocks: StockQuote[];
  currentStocks: StockQuote[];

  // Indian Market Trading
  inBalance: number;
  inPositions: Position[];
  inOrders: Order[];
  inPortfolioSummary: PortfolioSummary;

  // US Market Trading
  usBalance: number;
  usPositions: Position[];
  usOrders: Order[];
  usPortfolioSummary: PortfolioSummary;

  // Current active market portfolio & positions
  activeBalance: number;
  activePositions: Position[];
  activeOrders: Order[];
  activePortfolioSummary: PortfolioSummary;

  // Trading actions
  placeOrder: (params: {
    symbol: string;
    side: OrderSide;
    type: OrderType;
    quantity: number;
    limitPrice?: number;
  }) => { success: boolean; message: string };
  closePosition: (positionId: string) => { success: boolean; message: string };
  cancelOrder: (orderId: string) => { success: boolean; message: string };
  resetAccount: (market: MarketType) => void;

  // Sound & notification preferences
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  playExecutionSound: () => void;

  // Public Journal
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'likes' | 'comments' | 'timestamp'>) => void;
  likeJournalEntry: (id: string) => void;
  addJournalComment: (id: string, commentText: string) => void;
  deleteJournalEntry: (id: string) => void;
  reportJournalEntry: (id: string) => void;

  // VIP Signals
  vipSignals: VIPSignal[];
  addSignal: (signal: Omit<VIPSignal, 'id' | 'publishedAt'>) => void;
  updateSignalStatus: (id: string, status: VIPSignal['status']) => void;
  deleteSignal: (id: string) => void;

  // Soni Academy
  academyLessons: AcademyLesson[];
  completedLessonIds: string[];
  completeLesson: (lessonId: string, quizScore: number) => void;
  resetAcademyProgress: () => void;

  // Admin
  isAdmin: boolean;
  adminPin: string;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  updateStockBasePrice: (symbol: string, newPrice: number) => void;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

const STORAGE_KEYS = {
  IN_BALANCE: 'tws_in_balance_v1',
  IN_POSITIONS: 'tws_in_positions_v1',
  IN_ORDERS: 'tws_in_orders_v1',
  US_BALANCE: 'tws_us_balance_v1',
  US_POSITIONS: 'tws_us_positions_v1',
  US_ORDERS: 'tws_us_orders_v1',
  JOURNALS: 'tws_journals_v1',
  SIGNALS: 'tws_signals_v1',
  ACADEMY_COMPLETED: 'tws_academy_completed_v1',
  IS_ADMIN: 'tws_is_admin_v1',
  SOUND_ENABLED: 'tws_sound_v1',
};

const INITIAL_IN_BALANCE = 100000; // ₹1,00,000
const INITIAL_US_BALANCE = 100000; // $100,000

export const TradingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeMarket, setActiveMarket] = useState<MarketType>('IN');

  const [indianStocks, setIndianStocks] = useState<StockQuote[]>(INDIAN_STOCKS);
  const [usStocks, setUsStocks] = useState<StockQuote[]>(US_STOCKS);

  const [selectedSymbol, setSelectedSymbol] = useState<string>('RELIANCE');

  // Load balances from localStorage or fallback
  const [inBalance, setInBalance] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.IN_BALANCE);
    return saved ? Number(saved) : INITIAL_IN_BALANCE;
  });

  const [inPositions, setInPositions] = useState<Position[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.IN_POSITIONS);
    return saved ? JSON.parse(saved) : [];
  });

  const [inOrders, setInOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.IN_ORDERS);
    return saved ? JSON.parse(saved) : [];
  });

  const [usBalance, setUsBalance] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.US_BALANCE);
    return saved ? Number(saved) : INITIAL_US_BALANCE;
  });

  const [usPositions, setUsPositions] = useState<Position[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.US_POSITIONS);
    return saved ? JSON.parse(saved) : [];
  });

  const [usOrders, setUsOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.US_ORDERS);
    return saved ? JSON.parse(saved) : [];
  });

  // Sound setting
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
    return saved !== null ? saved === 'true' : true;
  });

  // Journal
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.JOURNALS);
    return saved ? JSON.parse(saved) : INITIAL_JOURNAL_ENTRIES;
  });

  // VIP Signals
  const [vipSignals, setVipSignals] = useState<VIPSignal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SIGNALS);
    return saved ? JSON.parse(saved) : INITIAL_VIP_SIGNALS;
  });

  // Academy
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACADEMY_COMPLETED);
    return saved ? JSON.parse(saved) : ['lesson-1'];
  });

  // Admin
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.IS_ADMIN) === 'true';
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IN_BALANCE, inBalance.toString());
  }, [inBalance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IN_POSITIONS, JSON.stringify(inPositions));
  }, [inPositions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IN_ORDERS, JSON.stringify(inOrders));
  }, [inOrders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.US_BALANCE, usBalance.toString());
  }, [usBalance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.US_POSITIONS, JSON.stringify(usPositions));
  }, [usPositions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.US_ORDERS, JSON.stringify(usOrders));
  }, [usOrders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SIGNALS, JSON.stringify(vipSignals));
  }, [vipSignals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACADEMY_COMPLETED, JSON.stringify(completedLessonIds));
  }, [completedLessonIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IS_ADMIN, isAdmin.toString());
  }, [isAdmin]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, soundEnabled.toString());
  }, [soundEnabled]);

  // Audio tone generator for crisp trading execution feedback
  const playExecutionSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.26);
    } catch {
      // Audio context might be restricted before first gesture; silently ignore
    }
  };

  // Switch default selected stock when market changes
  useEffect(() => {
    if (activeMarket === 'IN') {
      setSelectedSymbol('RELIANCE');
    } else {
      setSelectedSymbol('AAPL');
    }
  }, [activeMarket]);

  const currentStocks = useMemo(() => {
    return activeMarket === 'IN' ? indianStocks : usStocks;
  }, [activeMarket, indianStocks, usStocks]);

  const selectedStock = useMemo(() => {
    const list = activeMarket === 'IN' ? indianStocks : usStocks;
    const found = list.find((s) => s.symbol === selectedSymbol);
    return found || list[0];
  }, [activeMarket, indianStocks, usStocks, selectedSymbol]);

  const setSelectedStock = (stock: StockQuote) => {
    setSelectedSymbol(stock.symbol);
    if (stock.market !== activeMarket) {
      setActiveMarket(stock.market);
    }
  };

  // Simulated live market price ticks (Brownian walk)
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick 1-2 random stocks from Indian and US markets to tick
      setIndianStocks((prev) =>
        prev.map((stock) => {
          if (Math.random() > 0.4) return stock; // 60% of stocks update
          const volatility = 0.0015; // 0.15% max tick
          const delta = (Math.random() - 0.49) * stock.currentPrice * volatility;
          const newPrice = Math.max(1, Number((stock.currentPrice + delta).toFixed(2)));
          const high = Math.max(stock.highPrice, newPrice);
          const low = Math.min(stock.lowPrice, newPrice);
          const change = Number((newPrice - stock.previousClose).toFixed(2));
          const changePercent = Number(((change / stock.previousClose) * 100).toFixed(2));

          return {
            ...stock,
            currentPrice: newPrice,
            highPrice: high,
            lowPrice: low,
            change,
            changePercent,
          };
        })
      );

      setUsStocks((prev) =>
        prev.map((stock) => {
          if (Math.random() > 0.4) return stock;
          const volatility = 0.0018;
          const delta = (Math.random() - 0.49) * stock.currentPrice * volatility;
          const newPrice = Math.max(1, Number((stock.currentPrice + delta).toFixed(2)));
          const high = Math.max(stock.highPrice, newPrice);
          const low = Math.min(stock.lowPrice, newPrice);
          const change = Number((newPrice - stock.previousClose).toFixed(2));
          const changePercent = Number(((change / stock.previousClose) * 100).toFixed(2));

          return {
            ...stock,
            currentPrice: newPrice,
            highPrice: high,
            lowPrice: low,
            change,
            changePercent,
          };
        })
      );
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  // Update position current values and unrealized P&L whenever stocks tick
  useEffect(() => {
    setInPositions((prev) =>
      prev.map((pos) => {
        const quote = indianStocks.find((s) => s.symbol === pos.symbol);
        if (!quote) return pos;
        const currentPrice = quote.currentPrice;
        const currentValue = currentPrice * pos.quantity;
        const pnl = calculatePnL('BUY', pos.avgBuyPrice, currentPrice, pos.quantity);
        const pnlPercent = calculatePnLPercent(pos.avgBuyPrice, currentPrice, 'BUY');

        return {
          ...pos,
          currentPrice,
          currentValue,
          unrealizedPnL: Number(pnl.toFixed(2)),
          unrealizedPnLPercent: Number(pnlPercent.toFixed(2)),
        };
      })
    );
  }, [indianStocks]);

  useEffect(() => {
    setUsPositions((prev) =>
      prev.map((pos) => {
        const quote = usStocks.find((s) => s.symbol === pos.symbol);
        if (!quote) return pos;
        const currentPrice = quote.currentPrice;
        const currentValue = currentPrice * pos.quantity;
        const pnl = calculatePnL('BUY', pos.avgBuyPrice, currentPrice, pos.quantity);
        const pnlPercent = calculatePnLPercent(pos.avgBuyPrice, currentPrice, 'BUY');

        return {
          ...pos,
          currentPrice,
          currentValue,
          unrealizedPnL: Number(pnl.toFixed(2)),
          unrealizedPnLPercent: Number(pnlPercent.toFixed(2)),
        };
      })
    );
  }, [usStocks]);

  // Check pending limit orders against live ticks
  useEffect(() => {
    // Check Indian pending limit orders
    setInOrders((prevOrders) => {
      let balanceAdjustment = 0;
      let orderChanged = false;

      const updated = prevOrders.map((order) => {
        if (order.status !== 'PENDING' || order.type !== 'LIMIT' || !order.limitPrice) {
          return order;
        }

        const quote = indianStocks.find((s) => s.symbol === order.symbol);
        if (!quote) return order;

        const isTriggered = checkLimitOrderTrigger(order.side, order.limitPrice, quote.currentPrice);
        if (!isTriggered) return order;

        orderChanged = true;
        const execPrice = quote.currentPrice;

        if (order.side === 'BUY') {
          // Add to positions
          setInPositions((posList) => {
            const existing = posList.find((p) => p.symbol === order.symbol);
            if (existing) {
              const newAvg = calculateNewAvgPrice(existing.quantity, existing.avgBuyPrice, order.quantity, execPrice);
              const totalQty = existing.quantity + order.quantity;
              return posList.map((p) =>
                p.id === existing.id
                  ? {
                      ...p,
                      quantity: totalQty,
                      avgBuyPrice: Number(newAvg.toFixed(2)),
                      investedValue: Number((newAvg * totalQty).toFixed(2)),
                    }
                  : p
              );
            } else {
              const newPos: Position = {
                id: `pos-${Date.now()}-${Math.random()}`,
                symbol: order.symbol,
                stockName: order.stockName,
                market: 'IN',
                currency: 'INR',
                quantity: order.quantity,
                avgBuyPrice: execPrice,
                currentPrice: execPrice,
                investedValue: execPrice * order.quantity,
                currentValue: execPrice * order.quantity,
                unrealizedPnL: 0,
                unrealizedPnLPercent: 0,
                openedAt: Date.now(),
              };
              return [...posList, newPos];
            }
          });
        }

        return {
          ...order,
          status: 'EXECUTED' as const,
          price: execPrice,
          totalAmount: execPrice * order.quantity,
        };
      });

      if (balanceAdjustment !== 0) {
        setInBalance((b) => b + balanceAdjustment);
      }

      if (orderChanged) {
        playExecutionSound();
      }

      return updated;
    });
  }, [indianStocks]);

  // Compute Portfolio Summaries
  const inPortfolioSummary: PortfolioSummary = useMemo(() => {
    const investedBalance = inPositions.reduce((acc, p) => acc + p.investedValue, 0);
    const totalUnrealizedPnL = inPositions.reduce((acc, p) => acc + p.unrealizedPnL, 0);
    const totalCurrentValue = inPositions.reduce((acc, p) => acc + p.currentValue, 0);
    const totalPortfolioValue = inBalance + totalCurrentValue;

    // Realized PnL from closed orders
    const executedOrders = inOrders.filter((o) => o.status === 'EXECUTED');
    let realizedPnL = 0;
    // Basic realized calculation
    const totalPnLPercent =
      investedBalance > 0 ? (totalUnrealizedPnL / investedBalance) * 100 : 0;

    return {
      startingBalance: INITIAL_IN_BALANCE,
      availableBalance: inBalance,
      investedBalance,
      totalPortfolioValue,
      totalUnrealizedPnL,
      totalRealizedPnL: realizedPnL,
      totalPnLPercent,
    };
  }, [inBalance, inPositions, inOrders]);

  const usPortfolioSummary: PortfolioSummary = useMemo(() => {
    const investedBalance = usPositions.reduce((acc, p) => acc + p.investedValue, 0);
    const totalUnrealizedPnL = usPositions.reduce((acc, p) => acc + p.unrealizedPnL, 0);
    const totalCurrentValue = usPositions.reduce((acc, p) => acc + p.currentValue, 0);
    const totalPortfolioValue = usBalance + totalCurrentValue;

    const totalPnLPercent =
      investedBalance > 0 ? (totalUnrealizedPnL / investedBalance) * 100 : 0;

    return {
      startingBalance: INITIAL_US_BALANCE,
      availableBalance: usBalance,
      investedBalance,
      totalPortfolioValue,
      totalUnrealizedPnL,
      totalRealizedPnL: 0,
      totalPnLPercent,
    };
  }, [usBalance, usPositions]);

  // Active getters
  const activeBalance = activeMarket === 'IN' ? inBalance : usBalance;
  const activePositions = activeMarket === 'IN' ? inPositions : usPositions;
  const activeOrders = activeMarket === 'IN' ? inOrders : usOrders;
  const activePortfolioSummary = activeMarket === 'IN' ? inPortfolioSummary : usPortfolioSummary;

  // Place Order Logic
  const placeOrder = (params: {
    symbol: string;
    side: OrderSide;
    type: OrderType;
    quantity: number;
    limitPrice?: number;
  }): { success: boolean; message: string } => {
    const { symbol, side, type, quantity, limitPrice } = params;
    const isIndian = activeMarket === 'IN';
    const stocksList = isIndian ? indianStocks : usStocks;
    const stock = stocksList.find((s) => s.symbol === symbol);

    if (!stock) {
      return { success: false, message: 'Stock symbol not found.' };
    }

    if (quantity <= 0 || !Number.isInteger(quantity)) {
      return { success: false, message: 'Please enter a valid whole share quantity.' };
    }

    const currentPrice = stock.currentPrice;
    const execPrice = type === 'MARKET' ? currentPrice : limitPrice || currentPrice;
    const totalCost = execPrice * quantity;
    const currentBalance = isIndian ? inBalance : usBalance;
    const currentPosList = isIndian ? inPositions : usPositions;

    // BUY Order handling
    if (side === 'BUY') {
      if (totalCost > currentBalance) {
        return {
          success: false,
          message: `Insufficient virtual cash. Needed: ${isIndian ? '₹' : '$'}${totalCost.toFixed(2)}, Available: ${isIndian ? '₹' : '$'}${currentBalance.toFixed(2)}`,
        };
      }

      if (type === 'MARKET') {
        // Execute immediately
        if (isIndian) {
          setInBalance((b) => b - totalCost);
          setInPositions((prev) => {
            const existing = prev.find((p) => p.symbol === symbol);
            if (existing) {
              const newAvg = calculateNewAvgPrice(existing.quantity, existing.avgBuyPrice, quantity, execPrice);
              const totalQty = existing.quantity + quantity;
              return prev.map((p) =>
                p.id === existing.id
                  ? {
                      ...p,
                      quantity: totalQty,
                      avgBuyPrice: Number(newAvg.toFixed(2)),
                      investedValue: Number((newAvg * totalQty).toFixed(2)),
                      currentValue: Number((execPrice * totalQty).toFixed(2)),
                    }
                  : p
              );
            } else {
              const newPos: Position = {
                id: `pos-${Date.now()}`,
                symbol,
                stockName: stock.name,
                market: 'IN',
                currency: 'INR',
                quantity,
                avgBuyPrice: execPrice,
                currentPrice: execPrice,
                investedValue: totalCost,
                currentValue: totalCost,
                unrealizedPnL: 0,
                unrealizedPnLPercent: 0,
                openedAt: Date.now(),
              };
              return [...prev, newPos];
            }
          });

          const newOrder: Order = {
            id: `ord-${Date.now()}`,
            symbol,
            stockName: stock.name,
            market: 'IN',
            currency: 'INR',
            side: 'BUY',
            type: 'MARKET',
            quantity,
            price: execPrice,
            totalAmount: totalCost,
            status: 'EXECUTED',
            timestamp: Date.now(),
          };
          setInOrders((o) => [newOrder, ...o]);
        } else {
          // US Market
          setUsBalance((b) => b - totalCost);
          setUsPositions((prev) => {
            const existing = prev.find((p) => p.symbol === symbol);
            if (existing) {
              const newAvg = calculateNewAvgPrice(existing.quantity, existing.avgBuyPrice, quantity, execPrice);
              const totalQty = existing.quantity + quantity;
              return prev.map((p) =>
                p.id === existing.id
                  ? {
                      ...p,
                      quantity: totalQty,
                      avgBuyPrice: Number(newAvg.toFixed(2)),
                      investedValue: Number((newAvg * totalQty).toFixed(2)),
                      currentValue: Number((execPrice * totalQty).toFixed(2)),
                    }
                  : p
              );
            } else {
              const newPos: Position = {
                id: `pos-${Date.now()}`,
                symbol,
                stockName: stock.name,
                market: 'US',
                currency: 'USD',
                quantity,
                avgBuyPrice: execPrice,
                currentPrice: execPrice,
                investedValue: totalCost,
                currentValue: totalCost,
                unrealizedPnL: 0,
                unrealizedPnLPercent: 0,
                openedAt: Date.now(),
              };
              return [...prev, newPos];
            }
          });

          const newOrder: Order = {
            id: `ord-${Date.now()}`,
            symbol,
            stockName: stock.name,
            market: 'US',
            currency: 'USD',
            side: 'BUY',
            type: 'MARKET',
            quantity,
            price: execPrice,
            totalAmount: totalCost,
            status: 'EXECUTED',
            timestamp: Date.now(),
          };
          setUsOrders((o) => [newOrder, ...o]);
        }

        playExecutionSound();
        return {
          success: true,
          message: `Bought ${quantity} shares of ${symbol} at ${isIndian ? '₹' : '$'}${execPrice.toFixed(2)} (Market Order).`,
        };
      } else {
        // LIMIT BUY
        if (!limitPrice || limitPrice <= 0) {
          return { success: false, message: 'Please specify a valid limit price.' };
        }

        // Deduct/reserve funds for limit order
        if (isIndian) {
          setInBalance((b) => b - totalCost);
          const newOrder: Order = {
            id: `ord-${Date.now()}`,
            symbol,
            stockName: stock.name,
            market: 'IN',
            currency: 'INR',
            side: 'BUY',
            type: 'LIMIT',
            quantity,
            price: limitPrice,
            limitPrice,
            totalAmount: totalCost,
            status: 'PENDING',
            timestamp: Date.now(),
          };
          setInOrders((o) => [newOrder, ...o]);
        } else {
          setUsBalance((b) => b - totalCost);
          const newOrder: Order = {
            id: `ord-${Date.now()}`,
            symbol,
            stockName: stock.name,
            market: 'US',
            currency: 'USD',
            side: 'BUY',
            type: 'LIMIT',
            quantity,
            price: limitPrice,
            limitPrice,
            totalAmount: totalCost,
            status: 'PENDING',
            timestamp: Date.now(),
          };
          setUsOrders((o) => [newOrder, ...o]);
        }

        playExecutionSound();
        return {
          success: true,
          message: `Placed Limit Buy order for ${quantity} ${symbol} @ ${isIndian ? '₹' : '$'}${limitPrice.toFixed(2)}.`,
        };
      }
    }

    // SELL Order handling
    if (side === 'SELL') {
      const existingPos = currentPosList.find((p) => p.symbol === symbol);
      if (!existingPos || existingPos.quantity < quantity) {
        return {
          success: false,
          message: `Cannot sell ${quantity} shares. You currently hold ${existingPos ? existingPos.quantity : 0} shares of ${symbol}.`,
        };
      }

      if (type === 'MARKET') {
        const proceeds = currentPrice * quantity;
        if (isIndian) {
          setInBalance((b) => b + proceeds);
          setInPositions((prev) => {
            const pos = prev.find((p) => p.symbol === symbol)!;
            if (pos.quantity === quantity) {
              return prev.filter((p) => p.id !== pos.id);
            } else {
              const remainingQty = pos.quantity - quantity;
              return prev.map((p) =>
                p.id === pos.id
                  ? {
                      ...p,
                      quantity: remainingQty,
                      investedValue: p.avgBuyPrice * remainingQty,
                      currentValue: currentPrice * remainingQty,
                    }
                  : p
              );
            }
          });

          const newOrder: Order = {
            id: `ord-${Date.now()}`,
            symbol,
            stockName: stock.name,
            market: 'IN',
            currency: 'INR',
            side: 'SELL',
            type: 'MARKET',
            quantity,
            price: currentPrice,
            totalAmount: proceeds,
            status: 'EXECUTED',
            timestamp: Date.now(),
          };
          setInOrders((o) => [newOrder, ...o]);
        } else {
          // US
          setUsBalance((b) => b + proceeds);
          setUsPositions((prev) => {
            const pos = prev.find((p) => p.symbol === symbol)!;
            if (pos.quantity === quantity) {
              return prev.filter((p) => p.id !== pos.id);
            } else {
              const remainingQty = pos.quantity - quantity;
              return prev.map((p) =>
                p.id === pos.id
                  ? {
                      ...p,
                      quantity: remainingQty,
                      investedValue: p.avgBuyPrice * remainingQty,
                      currentValue: currentPrice * remainingQty,
                    }
                  : p
              );
            }
          });

          const newOrder: Order = {
            id: `ord-${Date.now()}`,
            symbol,
            stockName: stock.name,
            market: 'US',
            currency: 'USD',
            side: 'SELL',
            type: 'MARKET',
            quantity,
            price: currentPrice,
            totalAmount: proceeds,
            status: 'EXECUTED',
            timestamp: Date.now(),
          };
          setUsOrders((o) => [newOrder, ...o]);
        }

        playExecutionSound();
        return {
          success: true,
          message: `Sold ${quantity} shares of ${symbol} at ${isIndian ? '₹' : '$'}${currentPrice.toFixed(2)}.`,
        };
      } else {
        // LIMIT SELL
        if (!limitPrice || limitPrice <= 0) {
          return { success: false, message: 'Please specify a valid limit sell price.' };
        }

        const newOrder: Order = {
          id: `ord-${Date.now()}`,
          symbol,
          stockName: stock.name,
          market: isIndian ? 'IN' : 'US',
          currency: isIndian ? 'INR' : 'USD',
          side: 'SELL',
          type: 'LIMIT',
          quantity,
          price: limitPrice,
          limitPrice,
          totalAmount: limitPrice * quantity,
          status: 'PENDING',
          timestamp: Date.now(),
        };

        if (isIndian) {
          setInOrders((o) => [newOrder, ...o]);
        } else {
          setUsOrders((o) => [newOrder, ...o]);
        }

        playExecutionSound();
        return {
          success: true,
          message: `Placed Limit Sell order for ${quantity} ${symbol} @ ${isIndian ? '₹' : '$'}${limitPrice.toFixed(2)}.`,
        };
      }
    }

    return { success: false, message: 'Unknown order parameters.' };
  };

  // Close Position (Market Sell Full)
  const closePosition = (positionId: string): { success: boolean; message: string } => {
    const isIndian = activeMarket === 'IN';
    const posList = isIndian ? inPositions : usPositions;
    const pos = posList.find((p) => p.id === positionId);

    if (!pos) {
      return { success: false, message: 'Position not found.' };
    }

    const stocksList = isIndian ? indianStocks : usStocks;
    const quote = stocksList.find((s) => s.symbol === pos.symbol);
    const execPrice = quote ? quote.currentPrice : pos.currentPrice;
    const totalProceeds = execPrice * pos.quantity;

    if (isIndian) {
      setInBalance((b) => b + totalProceeds);
      setInPositions((prev) => prev.filter((p) => p.id !== positionId));
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        symbol: pos.symbol,
        stockName: pos.stockName,
        market: 'IN',
        currency: 'INR',
        side: 'SELL',
        type: 'MARKET',
        quantity: pos.quantity,
        price: execPrice,
        totalAmount: totalProceeds,
        status: 'EXECUTED',
        timestamp: Date.now(),
      };
      setInOrders((o) => [newOrder, ...o]);
    } else {
      setUsBalance((b) => b + totalProceeds);
      setUsPositions((prev) => prev.filter((p) => p.id !== positionId));
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        symbol: pos.symbol,
        stockName: pos.stockName,
        market: 'US',
        currency: 'USD',
        side: 'SELL',
        type: 'MARKET',
        quantity: pos.quantity,
        price: execPrice,
        totalAmount: totalProceeds,
        status: 'EXECUTED',
        timestamp: Date.now(),
      };
      setUsOrders((o) => [newOrder, ...o]);
    }

    playExecutionSound();
    return {
      success: true,
      message: `Closed position for ${pos.quantity} shares of ${pos.symbol} at ${isIndian ? '₹' : '$'}${execPrice.toFixed(2)}.`,
    };
  };

  // Cancel Pending Limit Order
  const cancelOrder = (orderId: string): { success: boolean; message: string } => {
    const isIndian = activeMarket === 'IN';
    const ordersList = isIndian ? inOrders : usOrders;
    const order = ordersList.find((o) => o.id === orderId);

    if (!order || order.status !== 'PENDING') {
      return { success: false, message: 'Only pending orders can be cancelled.' };
    }

    if (isIndian) {
      // Refund reserved cash if it was a buy order
      if (order.side === 'BUY') {
        setInBalance((b) => b + order.totalAmount);
      }
      setInOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'CANCELLED' as const } : o))
      );
    } else {
      if (order.side === 'BUY') {
        setUsBalance((b) => b + order.totalAmount);
      }
      setUsOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'CANCELLED' as const } : o))
      );
    }

    return { success: true, message: `Order #${orderId.slice(-6)} cancelled.` };
  };

  // Reset Demo Account
  const resetAccount = (market: MarketType) => {
    if (market === 'IN') {
      setInBalance(INITIAL_IN_BALANCE);
      setInPositions([]);
      setInOrders([]);
    } else {
      setUsBalance(INITIAL_US_BALANCE);
      setUsPositions([]);
      setUsOrders([]);
    }
  };

  // Public Journal Handlers
  const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'likes' | 'comments' | 'timestamp'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: `journal-${Date.now()}`,
      likes: 0,
      isLikedByUser: false,
      comments: [],
      timestamp: Date.now(),
    };
    setJournalEntries((prev) => [newEntry, ...prev]);
  };

  const likeJournalEntry = (id: string) => {
    setJournalEntries((prev) =>
      prev.map((j) => {
        if (j.id === id) {
          const isLiked = !j.isLikedByUser;
          return {
            ...j,
            isLikedByUser: isLiked,
            likes: isLiked ? j.likes + 1 : Math.max(0, j.likes - 1),
          };
        }
        return j;
      })
    );
  };

  const addJournalComment = (id: string, content: string) => {
    if (!content.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      userName: 'Paper Trader (You)',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      content: content.trim(),
      timestamp: Date.now(),
    };

    setJournalEntries((prev) =>
      prev.map((j) => (j.id === id ? { ...j, comments: [...j.comments, newComment] } : j))
    );
  };

  const deleteJournalEntry = (id: string) => {
    setJournalEntries((prev) => prev.filter((j) => j.id !== id));
  };

  const reportJournalEntry = (id: string) => {
    setJournalEntries((prev) =>
      prev.map((j) => (j.id === id ? { ...j, isReported: true } : j))
    );
  };

  // VIP Signal Handlers
  const addSignal = (signal: Omit<VIPSignal, 'id' | 'publishedAt'>) => {
    const newSignal: VIPSignal = {
      ...signal,
      id: `sig-${Date.now()}`,
      publishedAt: new Date().toLocaleString(),
    };
    setVipSignals((prev) => [newSignal, ...prev]);
  };

  const updateSignalStatus = (id: string, status: VIPSignal['status']) => {
    setVipSignals((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  const deleteSignal = (id: string) => {
    setVipSignals((prev) => prev.filter((s) => s.id !== id));
  };

  // Academy Handlers
  const completeLesson = (lessonId: string) => {
    setCompletedLessonIds((prev) => {
      if (prev.includes(lessonId)) return prev;
      return [...prev, lessonId];
    });
  };

  const resetAcademyProgress = () => {
    setCompletedLessonIds(['lesson-1']);
  };

  // Admin Login
  const loginAdmin = (pin: string): boolean => {
    // Demo secure admin pin
    if (pin === 'admin123' || pin === 'soni2026') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
  };

  const updateStockBasePrice = (symbol: string, newPrice: number) => {
    if (newPrice <= 0) return;
    setIndianStocks((prev) =>
      prev.map((s) => (s.symbol === symbol ? { ...s, currentPrice: newPrice } : s))
    );
    setUsStocks((prev) =>
      prev.map((s) => (s.symbol === symbol ? { ...s, currentPrice: newPrice } : s))
    );
  };

  return (
    <TradingContext.Provider
      value={{
        activeMarket,
        setActiveMarket,
        selectedStock,
        setSelectedStock,
        indianStocks,
        usStocks,
        currentStocks,

        inBalance,
        inPositions,
        inOrders,
        inPortfolioSummary,

        usBalance,
        usPositions,
        usOrders,
        usPortfolioSummary,

        activeBalance,
        activePositions,
        activeOrders,
        activePortfolioSummary,

        placeOrder,
        closePosition,
        cancelOrder,
        resetAccount,

        soundEnabled,
        setSoundEnabled,
        playExecutionSound,

        journalEntries,
        addJournalEntry,
        likeJournalEntry,
        addJournalComment,
        deleteJournalEntry,
        reportJournalEntry,

        vipSignals,
        addSignal,
        updateSignalStatus,
        deleteSignal,

        academyLessons: ACADEMY_LESSONS,
        completedLessonIds,
        completeLesson,
        resetAcademyProgress,

        isAdmin,
        adminPin: 'admin123',
        loginAdmin,
        logoutAdmin,
        updateStockBasePrice,
      }}
    >
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = (): TradingContextType => {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
};
