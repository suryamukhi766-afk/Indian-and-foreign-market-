import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { formatCurrency, formatPercent } from '../../utils/tradingMath';
import {
  TrendingUp,
  TrendingDown,
  XCircle,
  Clock,
  RotateCcw,
  CheckCircle,
  Layers,
  PieChart,
  AlertTriangle,
} from 'lucide-react';

interface TradingPositionsAndOrdersProps {
  onOpenResetModal: () => void;
}

export const TradingPositionsAndOrders: React.FC<TradingPositionsAndOrdersProps> = ({
  onOpenResetModal,
}) => {
  const {
    activeMarket,
    activePositions,
    activeOrders,
    activeBalance,
    activePortfolioSummary,
    closePosition,
    cancelOrder,
  } = useTrading();

  const [activeTab, setActiveTab] = useState<'positions' | 'pending' | 'history' | 'portfolio'>('positions');
  const [closingId, setClosingId] = useState<string | null>(null);

  const pendingOrders = activeOrders.filter((o) => o.status === 'PENDING');
  const historyOrders = activeOrders.filter((o) => o.status !== 'PENDING');

  const currency = activeMarket === 'IN' ? 'INR' : 'USD';

  const handleClose = (posId: string) => {
    setClosingId(posId);
    closePosition(posId);
    setTimeout(() => setClosingId(null), 600);
  };

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden shadow-xl flex flex-col">
      {/* Tab Navigation Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0a0e17] border-b border-[#1e293b] flex-wrap gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('positions')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'positions'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            aria-label="View Open Positions"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Open Positions</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === 'positions' ? 'bg-slate-900 text-emerald-300' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {activePositions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'pending'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            aria-label="View Pending Limit Orders"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Orders</span>
            {pendingOrders.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                {pendingOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            aria-label="View Order History"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Order History</span>
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'portfolio'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            aria-label="View Portfolio Analytics"
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Portfolio Summary</span>
          </button>
        </div>

        {/* Reset Demo Balance Button */}
        <button
          onClick={onOpenResetModal}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors"
          title={`Reset ${activeMarket === 'IN' ? 'Indian' : 'US'} Demo Balance`}
          aria-label="Reset Demo Balance"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Balance</span>
        </button>
      </div>

      {/* Tab 1: Open Positions */}
      {activeTab === 'positions' && (
        <div className="overflow-x-auto min-h-[180px]">
          {activePositions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
              <Layers className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-sm font-medium text-slate-300">No open positions in {activeMarket === 'IN' ? 'Indian' : 'Foreign'} market.</p>
              <p className="text-xs text-slate-500 mt-1">
                Select a stock from the watchlist and execute a BUY order to open a position.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0c121e] text-slate-400 uppercase text-[11px] border-b border-[#1e293b]">
                <tr>
                  <th className="px-4 py-2.5">Stock</th>
                  <th className="px-3 py-2.5">Qty</th>
                  <th className="px-3 py-2.5">Avg Buy Price</th>
                  <th className="px-3 py-2.5">LTP</th>
                  <th className="px-3 py-2.5">Invested Value</th>
                  <th className="px-3 py-2.5">Current Value</th>
                  <th className="px-3 py-2.5">Unrealized P&L</th>
                  <th className="px-4 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]/60">
                {activePositions.map((pos) => {
                  const isPositive = pos.unrealizedPnL >= 0;
                  return (
                    <tr key={pos.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 font-bold text-white">
                        <div className="flex items-center gap-1.5">
                          <span>{pos.symbol}</span>
                          <span className="text-[10px] text-slate-400 font-sans truncate max-w-[120px]">
                            {pos.stockName}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-slate-200">{pos.quantity}</td>
                      <td className="px-3 py-3 text-slate-300">
                        {formatCurrency(pos.avgBuyPrice, pos.currency)}
                      </td>
                      <td className="px-3 py-3 text-white font-semibold">
                        {formatCurrency(pos.currentPrice, pos.currency)}
                      </td>
                      <td className="px-3 py-3 text-slate-300">
                        {formatCurrency(pos.investedValue, pos.currency)}
                      </td>
                      <td className="px-3 py-3 text-white">
                        {formatCurrency(pos.currentValue, pos.currency)}
                      </td>
                      <td className="px-3 py-3 font-semibold">
                        <div
                          className={`flex items-center gap-1 ${
                            isPositive ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isPositive ? (
                            <TrendingUp className="w-3.5 h-3.5" />
                          ) : (
                            <TrendingDown className="w-3.5 h-3.5" />
                          )}
                          <span>{formatCurrency(pos.unrealizedPnL, pos.currency)}</span>
                          <span className="text-[11px] opacity-80">
                            ({formatPercent(pos.unrealizedPnLPercent)})
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleClose(pos.id)}
                          disabled={closingId === pos.id}
                          className="px-2.5 py-1 text-xs font-sans font-bold bg-rose-600 hover:bg-rose-500 text-white rounded transition-colors shadow"
                          aria-label={`Close position for ${pos.symbol}`}
                        >
                          {closingId === pos.id ? 'Closing...' : 'Close Position'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Tab 2: Pending Orders */}
      {activeTab === 'pending' && (
        <div className="overflow-x-auto min-h-[180px]">
          {pendingOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
              <Clock className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-sm font-medium text-slate-300">No pending limit orders.</p>
              <p className="text-xs text-slate-500 mt-1">
                Limit orders trigger automatically when market ticks reach your specified limit price.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0c121e] text-slate-400 uppercase text-[11px] border-b border-[#1e293b]">
                <tr>
                  <th className="px-4 py-2.5">Time</th>
                  <th className="px-3 py-2.5">Symbol</th>
                  <th className="px-3 py-2.5">Side</th>
                  <th className="px-3 py-2.5">Type</th>
                  <th className="px-3 py-2.5">Limit Price</th>
                  <th className="px-3 py-2.5">Quantity</th>
                  <th className="px-3 py-2.5">Total Value</th>
                  <th className="px-4 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]/60">
                {pendingOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(ord.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-3 py-3 font-bold text-white">{ord.symbol}</td>
                    <td className="px-3 py-3">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          ord.side === 'BUY'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {ord.side}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-300">{ord.type}</td>
                    <td className="px-3 py-3 text-amber-400 font-bold">
                      {formatCurrency(ord.limitPrice || ord.price, ord.currency)}
                    </td>
                    <td className="px-3 py-3 text-white">{ord.quantity}</td>
                    <td className="px-3 py-3 text-slate-200">
                      {formatCurrency(ord.totalAmount, ord.currency)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => cancelOrder(ord.id)}
                        className="px-2 py-1 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Tab 3: Order History */}
      {activeTab === 'history' && (
        <div className="overflow-x-auto min-h-[180px] max-h-72">
          {historyOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
              <CheckCircle className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-sm font-medium text-slate-300">No executed orders yet.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0c121e] text-slate-400 uppercase text-[11px] border-b border-[#1e293b]">
                <tr>
                  <th className="px-4 py-2.5">Date & Time</th>
                  <th className="px-3 py-2.5">Symbol</th>
                  <th className="px-3 py-2.5">Side</th>
                  <th className="px-3 py-2.5">Type</th>
                  <th className="px-3 py-2.5">Exec Price</th>
                  <th className="px-3 py-2.5">Quantity</th>
                  <th className="px-3 py-2.5">Amount</th>
                  <th className="px-4 py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]/60">
                {historyOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-2.5 text-slate-400">
                      {new Date(ord.timestamp).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-3 py-2.5 font-bold text-white">{ord.symbol}</td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          ord.side === 'BUY'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {ord.side}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-400">{ord.type}</td>
                    <td className="px-3 py-2.5 text-white">
                      {formatCurrency(ord.price, ord.currency)}
                    </td>
                    <td className="px-3 py-2.5 text-slate-300">{ord.quantity}</td>
                    <td className="px-3 py-2.5 text-slate-300">
                      {formatCurrency(ord.totalAmount, ord.currency)}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          ord.status === 'EXECUTED'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Tab 4: Portfolio Summary */}
      {activeTab === 'portfolio' && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#090d16] p-4 rounded-xl border border-[#1e293b]">
            <div className="text-xs text-slate-400 mb-1">Starting Virtual Balance</div>
            <div className="text-lg font-bold text-slate-200 font-mono">
              {formatCurrency(activePortfolioSummary.startingBalance, currency)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Guaranteed default demo fund</div>
          </div>

          <div className="bg-[#090d16] p-4 rounded-xl border border-[#1e293b]">
            <div className="text-xs text-slate-400 mb-1">Available Cash Balance</div>
            <div className="text-lg font-bold text-emerald-400 font-mono">
              {formatCurrency(activePortfolioSummary.availableBalance, currency)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Liquid cash ready for orders</div>
          </div>

          <div className="bg-[#090d16] p-4 rounded-xl border border-[#1e293b]">
            <div className="text-xs text-slate-400 mb-1">Active Invested Capital</div>
            <div className="text-lg font-bold text-white font-mono">
              {formatCurrency(activePortfolioSummary.investedBalance, currency)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              In {activePositions.length} positions
            </div>
          </div>

          <div className="bg-[#090d16] p-4 rounded-xl border border-[#1e293b]">
            <div className="text-xs text-slate-400 mb-1">Total Account Net Worth</div>
            <div className="text-lg font-bold text-white font-mono">
              {formatCurrency(activePortfolioSummary.totalPortfolioValue, currency)}
            </div>
            <div
              className={`text-xs font-semibold font-mono mt-1 ${
                activePortfolioSummary.totalUnrealizedPnL >= 0
                  ? 'text-emerald-400'
                  : 'text-rose-400'
              }`}
            >
              Unrealized P&L: {formatCurrency(activePortfolioSummary.totalUnrealizedPnL, currency)} ({formatPercent(activePortfolioSummary.totalPnLPercent)})
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
