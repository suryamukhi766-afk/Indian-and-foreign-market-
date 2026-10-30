import React, { useState, useEffect } from 'react';
import { useTrading } from '../../context/TradingContext';
import { OrderSide, OrderType } from '../../types/trading';
import { formatCurrency, calculateRiskRewardRatio } from '../../utils/tradingMath';
import { AlertCircle, CheckCircle2, DollarSign, Percent, ShieldCheck, ArrowRightLeft } from 'lucide-react';

interface OrderPanelProps {
  initialSide?: OrderSide;
}

export const OrderPanel: React.FC<OrderPanelProps> = ({ initialSide = 'BUY' }) => {
  const {
    selectedStock,
    activeMarket,
    activeBalance,
    activePositions,
    placeOrder,
  } = useTrading();

  const [side, setSide] = useState<OrderSide>(initialSide);
  const [type, setType] = useState<OrderType>('MARKET');
  const [quantity, setQuantity] = useState<number>(10);
  const [limitPrice, setLimitPrice] = useState<string>(selectedStock.currentPrice.toFixed(2));
  const [stopLoss, setStopLoss] = useState<string>('');
  const [takeProfit, setTakeProfit] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sync limit price with stock change if switching stocks
  useEffect(() => {
    setLimitPrice(selectedStock.currentPrice.toFixed(2));
    const sl = side === 'BUY'
      ? (selectedStock.currentPrice * 0.98).toFixed(2)
      : (selectedStock.currentPrice * 1.02).toFixed(2);
    const tp = side === 'BUY'
      ? (selectedStock.currentPrice * 1.05).toFixed(2)
      : (selectedStock.currentPrice * 0.95).toFixed(2);
    setStopLoss(sl);
    setTakeProfit(tp);
  }, [selectedStock.symbol, selectedStock.currentPrice, side]);

  useEffect(() => {
    if (initialSide) setSide(initialSide);
  }, [initialSide]);

  // Current holding for selected stock
  const currentHolding = activePositions.find((p) => p.symbol === selectedStock.symbol);
  const holdingQty = currentHolding ? currentHolding.quantity : 0;

  const currentPrice = selectedStock.currentPrice;
  const effectivePrice = type === 'MARKET' ? currentPrice : Number(limitPrice) || currentPrice;
  const estimatedTotal = effectivePrice * quantity;

  // Quick percentage allocation
  const handleQuickPercent = (pct: number) => {
    if (side === 'BUY') {
      const budget = activeBalance * (pct / 100);
      const calculatedQty = Math.max(1, Math.floor(budget / effectivePrice));
      setQuantity(calculatedQty);
    } else {
      const calculatedQty = Math.max(1, Math.floor(holdingQty * (pct / 100)));
      setQuantity(calculatedQty);
    }
  };

  const calculatedRR = React.useMemo(() => {
    const slNum = Number(stopLoss);
    const tpNum = Number(takeProfit);
    if (!slNum || !tpNum || slNum === effectivePrice) return null;
    return calculateRiskRewardRatio(effectivePrice, tpNum, slNum);
  }, [effectivePrice, stopLoss, takeProfit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const res = placeOrder({
      symbol: selectedStock.symbol,
      side,
      type,
      quantity: Number(quantity),
      limitPrice: type === 'LIMIT' ? Number(limitPrice) : undefined,
    });

    if (res.success) {
      setStatusMessage({ type: 'success', text: res.message });
      setTimeout(() => setStatusMessage(null), 5000);
    } else {
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

  const isIndian = activeMarket === 'IN';

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 shadow-xl flex flex-col gap-4">
      {/* Header with Title and Mode */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Order Execution Desk
          </div>
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <span>{selectedStock.name}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono">
              {isIndian ? 'NSE / INR' : 'US / USD'}
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[11px] text-slate-400">Available Virtual Cash</div>
          <div className="text-sm font-mono font-bold text-emerald-400">
            {formatCurrency(activeBalance, selectedStock.currency)}
          </div>
        </div>
      </div>

      {/* Buy / Sell Tabs */}
      <div className="grid grid-cols-2 gap-2 bg-[#090d16] p-1 rounded-lg border border-[#1e293b]">
        <button
          type="button"
          onClick={() => setSide('BUY')}
          className={`py-2 text-sm font-bold rounded-md transition-all ${
            side === 'BUY'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Select Buy side"
        >
          BUY (Long)
        </button>
        <button
          type="button"
          onClick={() => setSide('SELL')}
          className={`py-2 text-sm font-bold rounded-md transition-all ${
            side === 'SELL'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Select Sell side"
        >
          SELL (Exit)
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        {/* Order Type Selector */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Order Type</span>
          <div className="flex bg-[#131d2e] rounded-lg p-0.5 border border-[#1e293b]">
            <button
              type="button"
              onClick={() => setType('MARKET')}
              className={`px-3 py-1 text-xs font-semibold rounded ${
                type === 'MARKET' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Market
            </button>
            <button
              type="button"
              onClick={() => setType('LIMIT')}
              className={`px-3 py-1 text-xs font-semibold rounded ${
                type === 'LIMIT' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Limit
            </button>
          </div>
        </div>

        {/* Limit Price Input if Type == LIMIT */}
        {type === 'LIMIT' && (
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Limit Trigger Price</span>
              <span className="font-mono text-slate-400">
                LTP: {formatCurrency(selectedStock.currentPrice, selectedStock.currency)}
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.05"
                min="0.01"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                className="w-full bg-[#131d2e] border border-[#1e293b] rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                required
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">
                {selectedStock.currency}
              </span>
            </div>
          </div>
        )}

        {/* Quantity Input */}
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Share Quantity</span>
            {side === 'SELL' && (
              <span className="text-xs text-amber-400 font-mono">
                Position held: {holdingQty} shares
              </span>
            )}
          </div>
          <div className="relative">
            <input
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-[#131d2e] border border-[#1e293b] rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
              required
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400">Qty</span>
          </div>
        </div>

        {/* Quick Percent Sizing */}
        <div className="grid grid-cols-4 gap-1.5">
          {[25, 50, 75, 100].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => handleQuickPercent(pct)}
              className="py-1 text-[11px] font-mono font-medium rounded bg-[#131d2e] hover:bg-slate-800 text-slate-300 border border-[#1e293b] transition-colors"
            >
              {pct === 100 ? 'Max' : `${pct}%`}
            </button>
          ))}
        </div>

        {/* Soni Academy Risk-Reward Calculator Module */}
        <div className="p-2.5 bg-[#131d2e]/70 border border-[#1e293b] rounded-lg flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Soni Risk / Reward Setup
            </span>
            {calculatedRR && (
              <span className="font-mono text-emerald-400 text-xs px-1.5 py-0.5 rounded bg-emerald-500/10">
                R:R = {calculatedRR}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-400">Target (TP)</span>
              <input
                type="number"
                step="0.05"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                placeholder="Target price"
                className="w-full bg-[#0a0e17] border border-slate-800 rounded px-2 py-1 text-emerald-400 font-mono text-xs focus:outline-none"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Stop Loss (SL)</span>
              <input
                type="number"
                step="0.05"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                placeholder="Stop loss price"
                className="w-full bg-[#0a0e17] border border-slate-800 rounded px-2 py-1 text-rose-400 font-mono text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Trade Cost Summary */}
        <div className="p-3 bg-[#0a0e17] rounded-lg border border-[#1e293b] flex flex-col gap-1.5 text-xs font-mono">
          <div className="flex justify-between text-slate-400">
            <span>Execution Price:</span>
            <span className="text-white">
              {formatCurrency(effectivePrice, selectedStock.currency)}
            </span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Order Volume Value:</span>
            <span className="text-white font-semibold">
              {formatCurrency(estimatedTotal, selectedStock.currency)}
            </span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Virtual Brokerage:</span>
            <span className="text-emerald-400">
              {isIndian ? '₹0.00' : '$0.00'} / Free (Paper Demo)
            </span>
          </div>
        </div>

        {/* Status Alerts */}
        {statusMessage && (
          <div
            className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Submit Execution Button */}
        <button
          type="submit"
          className={`w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wide transition-all shadow-lg active:scale-[0.98] ${
            side === 'BUY'
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-950/40'
              : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/40'
          }`}
        >
          {side === 'BUY'
            ? `Buy ${quantity} ${selectedStock.symbol} (${type})`
            : `Sell ${quantity} ${selectedStock.symbol} (${type})`}
        </button>
      </form>
    </div>
  );
};
