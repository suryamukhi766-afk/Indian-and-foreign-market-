import React from 'react';
import { useTrading } from '../../context/TradingContext';
import { formatCurrency, formatPercent } from '../../utils/tradingMath';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const MarketTicker: React.FC = () => {
  const { indianStocks, usStocks, setSelectedStock } = useTrading();

  // Combine top stocks and global commodities/crypto for marquee
  const tickerStocks = [
    ...indianStocks.slice(0, 5),
    ...usStocks.filter((s) => ['XAUUSD', 'BTCUSD', 'NVDA', 'AAPL', 'TSLA', 'ETHUSD'].includes(s.symbol)),
  ];

  return (
    <div className="w-full bg-[#070a10] border-b border-[#1e293b]/70 overflow-hidden py-1.5 select-none">
      <div className="flex items-center gap-6 whitespace-nowrap animate-marquee">
        {tickerStocks.map((stock) => {
          const isUp = stock.change >= 0;
          return (
            <button
              key={`${stock.market}-${stock.symbol}`}
              onClick={() => setSelectedStock(stock)}
              className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity font-mono text-xs px-2 py-0.5 rounded hover:bg-slate-800/40"
              aria-label={`View ${stock.symbol} chart`}
            >
              <span className="font-bold text-white">{stock.symbol}</span>
              <span className="text-slate-300">
                {formatCurrency(stock.currentPrice, stock.currency)}
              </span>
              <span
                className={`flex items-center text-[10px] font-semibold ${
                  isUp ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isUp ? '+' : ''}
                {stock.changePercent.toFixed(2)}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
