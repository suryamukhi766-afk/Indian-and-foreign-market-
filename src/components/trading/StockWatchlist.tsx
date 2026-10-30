import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { StockQuote } from '../../types/trading';
import { formatCurrency, formatPercent } from '../../utils/tradingMath';
import { Search, TrendingUp, TrendingDown, Star } from 'lucide-react';

export const StockWatchlist: React.FC = () => {
  const {
    currentStocks,
    selectedStock,
    setSelectedStock,
    activeMarket,
    setActiveMarket,
  } = useTrading();

  const [searchQuery, setSearchQuery] = useState('');
  const [usCategoryFilter, setUsCategoryFilter] = useState<'ALL' | 'STOCK' | 'COMMODITY' | 'CRYPTO'>('ALL');

  const filteredStocks = currentStocks.filter((s) => {
    // If in US market and category filter is active
    if (activeMarket === 'US' && usCategoryFilter !== 'ALL') {
      if (usCategoryFilter === 'COMMODITY' && s.symbol !== 'XAUUSD') return false;
      if (usCategoryFilter === 'CRYPTO' && s.category !== 'CRYPTO') return false;
      if (usCategoryFilter === 'STOCK' && (s.category === 'CRYPTO' || s.symbol === 'XAUUSD')) return false;
    }

    const q = searchQuery.toLowerCase();
    return s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q);
  });

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden shadow-xl flex flex-col h-full max-h-[720px]">
      {/* Market Switcher Tabs */}
      <div className="p-2.5 bg-[#0a0e17] border-b border-[#1e293b] flex gap-2">
        <button
          onClick={() => {
            setActiveMarket('IN');
            setUsCategoryFilter('ALL');
          }}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeMarket === 'IN'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-800/60'
          }`}
          aria-label="Switch to Indian Market (NSE)"
        >
          <span>🇮🇳</span>
          <span>Indian Stocks</span>
        </button>

        <button
          onClick={() => setActiveMarket('US')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeMarket === 'US'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-800/60'
          }`}
          aria-label="Switch to US Market (NASDAQ/NYSE)"
        >
          <span>🇺🇸</span>
          <span>US &amp; Crypto</span>
        </button>
      </div>

      {/* Global / US Category Sub-tabs if activeMarket == US */}
      {activeMarket === 'US' && (
        <div className="px-2.5 py-1.5 bg-[#080d16] border-b border-[#1e293b] flex items-center gap-1 overflow-x-auto text-[11px]">
          <button
            onClick={() => setUsCategoryFilter('ALL')}
            className={`px-2 py-0.5 rounded font-semibold transition-colors ${
              usCategoryFilter === 'ALL'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setUsCategoryFilter('STOCK')}
            className={`px-2 py-0.5 rounded font-semibold transition-colors ${
              usCategoryFilter === 'STOCK'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Stocks
          </button>
          <button
            onClick={() => setUsCategoryFilter('COMMODITY')}
            className={`px-2 py-0.5 rounded font-bold transition-colors flex items-center gap-1 ${
              usCategoryFilter === 'COMMODITY'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-amber-400/80 hover:text-amber-300'
            }`}
          >
            <span>🪙</span>
            <span>Gold (XAUUSD)</span>
          </button>
          <button
            onClick={() => setUsCategoryFilter('CRYPTO')}
            className={`px-2 py-0.5 rounded font-bold transition-colors flex items-center gap-1 ${
              usCategoryFilter === 'CRYPTO'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-cyan-400/80 hover:text-cyan-300'
            }`}
          >
            <span>⚡</span>
            <span>Crypto</span>
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className="p-3 border-b border-[#1e293b]">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${activeMarket === 'IN' ? 'Reliance, TCS...' : 'Gold, Bitcoin, Apple...'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#131d2e] border border-[#1e293b] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Stocks List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#1e293b]/50">
        {filteredStocks.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            No assets matched &quot;{searchQuery}&quot;
          </div>
        ) : (
          filteredStocks.map((stock) => {
            const isSelected = selectedStock.symbol === stock.symbol;
            const isUp = stock.change >= 0;

            const isGold = stock.symbol === 'XAUUSD';
            const isCrypto = stock.category === 'CRYPTO';

            return (
              <button
                key={stock.symbol}
                onClick={() => setSelectedStock(stock)}
                className={`w-full px-3.5 py-2.5 flex items-center justify-between text-left transition-colors ${
                  isSelected
                    ? 'bg-emerald-500/10 border-l-2 border-emerald-400'
                    : 'hover:bg-slate-800/40'
                }`}
                aria-label={`Select ${stock.symbol}`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white font-mono flex items-center gap-1">
                      {isGold && <span>🪙</span>}
                      {isCrypto && <span>⚡</span>}
                      {stock.symbol}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        isGold
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : isCrypto
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isGold ? 'METALS' : isCrypto ? 'CRYPTO' : stock.exchange}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[130px]">
                    {stock.name}
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-xs font-bold text-white">
                    {formatCurrency(stock.currentPrice, stock.currency)}
                  </div>
                  <div
                    className={`text-[10px] font-semibold flex items-center justify-end gap-0.5 ${
                      isUp ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isUp ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                    <span>{formatPercent(stock.changePercent)}</span>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="px-3 py-2 bg-[#0a0e17] border-t border-[#1e293b] text-[10px] text-slate-500 flex items-center justify-between">
        <span>{filteredStocks.length} symbols</span>
        <span className="text-emerald-400 font-mono">Simulated Live Tick</span>
      </div>
    </div>
  );
};
