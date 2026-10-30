import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { VIPSignal, MarketType } from '../../types/trading';
import { formatCurrency } from '../../utils/tradingMath';
import {
  Zap,
  Shield,
  Clock,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Lock,
  PlusCircle,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
} from 'lucide-react';

interface VipSignalsProps {
  onNavigateToTerminal?: () => void;
}

export const VipSignals: React.FC<VipSignalsProps> = ({ onNavigateToTerminal }) => {
  const {
    vipSignals,
    activeMarket,
    setSelectedStock,
    currentStocks,
    isAdmin,
    addSignal,
    updateSignalStatus,
    deleteSignal,
    indianStocks,
    usStocks,
  } = useTrading();

  const [tierFilter, setTierFilter] = useState<'ALL' | 'FREE' | 'VIP'>('ALL');
  const [marketFilter, setMarketFilter] = useState<'ALL' | MarketType>('ALL');
  const [isAddSignalModalOpen, setIsAddSignalModalOpen] = useState(false);
  const [isVipSimModalOpen, setIsVipSimModalOpen] = useState(false);

  // New Signal Form State
  const [sigStock, setSigStock] = useState('RELIANCE');
  const [sigMarket, setSigMarket] = useState<MarketType>('IN');
  const [sigDirection, setSigDirection] = useState<'LONG' | 'SHORT'>('LONG');
  const [sigEntryZone, setSigEntryZone] = useState('₹2,920 - ₹2,940');
  const [sigEntryPrice, setSigEntryPrice] = useState('2930');
  const [sigTarget1, setSigTarget1] = useState('3000');
  const [sigTarget2, setSigTarget2] = useState('3060');
  const [sigStopLoss, setSigStopLoss] = useState('2880');
  const [sigRiskReward, setSigRiskReward] = useState('1 : 2.60');
  const [sigTimeframe, setSigTimeframe] = useState('Swing (3-7 Days)');
  const [sigRationale, setSigRationale] = useState('');
  const [sigIsVip, setSigIsVip] = useState(true);

  const filteredSignals = vipSignals.filter((sig) => {
    if (marketFilter !== 'ALL' && sig.market !== marketFilter) return false;
    if (tierFilter === 'FREE' && sig.isVipOnly) return false;
    if (tierFilter === 'VIP' && !sig.isVipOnly) return false;
    return true;
  });

  const handleSimulateTrade = (sig: VIPSignal) => {
    const list = sig.market === 'IN' ? indianStocks : usStocks;
    const match = list.find((s) => s.symbol === sig.stockSymbol);
    if (match) {
      setSelectedStock(match);
      if (onNavigateToTerminal) {
        onNavigateToTerminal();
      }
    }
  };

  const handleCreateSignalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const list = sigMarket === 'IN' ? indianStocks : usStocks;
    const stockObj = list.find((s) => s.symbol === sigStock);

    addSignal({
      stockSymbol: sigStock,
      stockName: stockObj ? stockObj.name : sigStock,
      market: sigMarket,
      direction: sigDirection,
      entryZone: sigEntryZone,
      entryPrice: Number(sigEntryPrice),
      target1: Number(sigTarget1),
      target2: Number(sigTarget2),
      stopLoss: Number(sigStopLoss),
      riskReward: sigRiskReward,
      timeframe: sigTimeframe,
      technicalRationale:
        sigRationale ||
        'Confluence of 4H demand retest with bullish moving average crossover and volume spike.',
      status: 'ACTIVE',
      expiresAt: new Date(Date.now() + 7 * 86400000).toLocaleDateString(),
      isVipOnly: sigIsVip,
    });

    setIsAddSignalModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Educational Disclaimer Banner */}
      <div className="p-4 bg-[#0a1222] border border-[#1e293b] rounded-2xl flex items-start gap-3.5 shadow-lg">
        <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="font-bold text-white uppercase tracking-wider block mb-0.5">
            VIP Signals &amp; Market Intelligence (Educational Simulation)
          </span>
          All signals and setup levels provided below represent educational case studies illustrating technical analysis, risk-reward ratios, and trade structure. They are not personalized investment advice. No guaranteed profits. Never risk capital you cannot afford to lose.
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0f172a] border border-[#1e293b] p-4 rounded-2xl shadow-xl">
        {/* Tier switcher */}
        <div className="flex bg-[#131d2e] rounded-xl p-0.5 border border-[#1e293b]">
          <button
            onClick={() => setTierFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              tierFilter === 'ALL' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Signals ({vipSignals.length})
          </button>
          <button
            onClick={() => setTierFilter('FREE')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              tierFilter === 'FREE' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Free Signals
          </button>
          <button
            onClick={() => setTierFilter('VIP')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              tierFilter === 'VIP' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-amber-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>VIP Desk</span>
          </button>
        </div>

        {/* Market Filter & Admin Action */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-[#131d2e] rounded-xl p-0.5 border border-[#1e293b]">
            <button
              onClick={() => setMarketFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                marketFilter === 'ALL' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setMarketFilter('IN')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                marketFilter === 'IN' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              🇮🇳 Indian
            </button>
            <button
              onClick={() => setMarketFilter('US')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                marketFilter === 'US' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              🇺🇸 US
            </button>
          </div>

          <button
            onClick={() => setIsVipSimModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>VIP Membership Info</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setIsAddSignalModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl shadow-lg transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Admin: Publish Signal</span>
            </button>
          )}
        </div>
      </div>

      {/* Signals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSignals.map((sig) => {
          const isLong = sig.direction === 'LONG';
          const currency = sig.market === 'IN' ? 'INR' : 'USD';

          return (
            <div
              key={sig.id}
              className={`bg-[#0f172a] border rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between transition-all ${
                sig.isVipOnly ? 'border-amber-500/30 shadow-amber-950/10' : 'border-[#1e293b]'
              }`}
            >
              <div>
                {/* Header */}
                <div className="p-4 bg-[#0a0f1d] border-b border-[#1e293b] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-white">{sig.stockSymbol}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isLong ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                      }`}
                    >
                      {isLong ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {sig.direction}
                    </span>
                    {sig.isVipOnly && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5" /> VIP
                      </span>
                    )}
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono ${
                      sig.status === 'TARGET_1_HIT' || sig.status === 'TARGET_2_HIT'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : sig.status === 'STOPLOSS_HIT'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}
                  >
                    {sig.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Stock Full Name & Timeframe */}
                <div className="px-4 pt-3 flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium truncate max-w-[170px]">
                    {sig.stockName}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" /> {sig.timeframe}
                  </span>
                </div>

                {/* Entry Zone & Key Levels */}
                <div className="p-4 grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-[#131d2e] p-2.5 rounded-xl border border-[#1e293b]">
                    <div className="text-[10px] text-slate-400 font-sans">Entry Zone</div>
                    <div className="font-bold text-white text-xs mt-0.5">{sig.entryZone}</div>
                  </div>

                  <div className="bg-[#131d2e] p-2.5 rounded-xl border border-[#1e293b]">
                    <div className="text-[10px] text-slate-400 font-sans">Stop Loss (SL)</div>
                    <div className="font-bold text-rose-400 text-xs mt-0.5">
                      {formatCurrency(sig.stopLoss, currency)}
                    </div>
                  </div>

                  <div className="bg-[#131d2e] p-2.5 rounded-xl border border-[#1e293b]">
                    <div className="text-[10px] text-slate-400 font-sans">Target 1 (T1)</div>
                    <div className="font-bold text-emerald-400 text-xs mt-0.5">
                      {formatCurrency(sig.target1, currency)}
                    </div>
                  </div>

                  <div className="bg-[#131d2e] p-2.5 rounded-xl border border-[#1e293b]">
                    <div className="text-[10px] text-slate-400 font-sans">Target 2 / R:R</div>
                    <div className="font-bold text-emerald-300 text-xs mt-0.5">
                      {formatCurrency(sig.target2, currency)}{' '}
                      <span className="text-amber-400 text-[10px]">({sig.riskReward})</span>
                    </div>
                  </div>
                </div>

                {/* Technical Rationale */}
                <div className="px-4 pb-4">
                  <div className="text-[11px] font-bold text-slate-400 mb-1">Technical Rationale:</div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans bg-[#0a0e17] p-2.5 rounded-xl border border-[#1e293b]/60">
                    {sig.technicalRationale}
                  </p>
                </div>
              </div>

              {/* Card Footer: Simulation Button & Admin Controls */}
              <div className="p-4 bg-[#0a0f1d] border-t border-[#1e293b] flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Issued: {sig.publishedAt}</span>
                  <span>Expires: {sig.expiresAt}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSimulateTrade(sig)}
                    className="flex-1 py-2 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-1.5 transition-all shadow"
                  >
                    <Target className="w-3.5 h-3.5" />
                    <span>Test on Paper Terminal</span>
                  </button>

                  {/* Admin status toggles */}
                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateSignalStatus(sig.id, 'TARGET_1_HIT')}
                        className="p-2 text-xs bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30"
                        title="Mark Target 1 Hit"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => updateSignalStatus(sig.id, 'STOPLOSS_HIT')}
                        className="p-2 text-xs bg-rose-500/20 text-rose-400 rounded-lg hover:bg-rose-500/30"
                        title="Mark Stop Loss Hit"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteSignal(sig.id)}
                        className="p-2 text-xs bg-slate-800 text-slate-400 hover:text-rose-400 rounded-lg"
                        title="Delete Signal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Add Signal Modal */}
      {isAddSignalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-slate-200">
            <button
              onClick={() => setIsAddSignalModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Admin: Publish Educational Signal</span>
            </h3>

            <form onSubmit={handleCreateSignalSubmit} className="space-y-3.5 mt-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Market</label>
                  <select
                    value={sigMarket}
                    onChange={(e) => {
                      const m = e.target.value as MarketType;
                      setSigMarket(m);
                      setSigStock(m === 'IN' ? 'RELIANCE' : 'AAPL');
                    }}
                    className="w-full bg-[#131d2e] border border-[#1e293b] rounded-lg px-2.5 py-2 text-white"
                  >
                    <option value="IN">Indian (NSE)</option>
                    <option value="US">US (NASDAQ/NYSE)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Stock</label>
                  <select
                    value={sigStock}
                    onChange={(e) => setSigStock(e.target.value)}
                    className="w-full bg-[#131d2e] border border-[#1e293b] rounded-lg px-2.5 py-2 text-white font-mono"
                  >
                    {(sigMarket === 'IN' ? indianStocks : usStocks).map((s) => (
                      <option key={s.symbol} value={s.symbol}>
                        {s.symbol} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Direction</label>
                  <select
                    value={sigDirection}
                    onChange={(e) => setSigDirection(e.target.value as 'LONG' | 'SHORT')}
                    className="w-full bg-[#131d2e] border border-[#1e293b] rounded-lg px-2.5 py-2 text-white font-bold"
                  >
                    <option value="LONG">LONG (Bullish)</option>
                    <option value="SHORT">SHORT (Bearish)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Entry Zone</label>
                  <input
                    type="text"
                    value={sigEntryZone}
                    onChange={(e) => setSigEntryZone(e.target.value)}
                    className="w-full bg-[#131d2e] border border-[#1e293b] rounded-lg px-2.5 py-2 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div>
                  <label className="block text-slate-400 mb-1">Target 1</label>
                  <input
                    type="number"
                    value={sigTarget1}
                    onChange={(e) => setSigTarget1(e.target.value)}
                    className="w-full bg-[#131d2e] border border-[#1e293b] rounded-lg px-2 py-1.5 text-emerald-400 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Target 2</label>
                  <input
                    type="number"
                    value={sigTarget2}
                    onChange={(e) => setSigTarget2(e.target.value)}
                    className="w-full bg-[#131d2e] border border-[#1e293b] rounded-lg px-2 py-1.5 text-emerald-300 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Stop Loss</label>
                  <input
                    type="number"
                    value={sigStopLoss}
                    onChange={(e) => setSigStopLoss(e.target.value)}
                    className="w-full bg-[#131d2e] border border-[#1e293b] rounded-lg px-2 py-1.5 text-rose-400 font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Technical Explanation</label>
                <textarea
                  rows={2}
                  value={sigRationale}
                  onChange={(e) => setSigRationale(e.target.value)}
                  placeholder="Explain the pattern, moving average, or level breakout..."
                  className="w-full bg-[#131d2e] border border-[#1e293b] rounded-lg p-2.5 text-xs text-white"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="vip-checkbox"
                  checked={sigIsVip}
                  onChange={(e) => setSigIsVip(e.target.checked)}
                  className="accent-amber-400"
                />
                <label htmlFor="vip-checkbox" className="text-xs text-slate-300 cursor-pointer">
                  Tag as VIP exclusive signal
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddSignalModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-lg"
                >
                  Publish Signal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIP Membership Preview Modal */}
      {isVipSimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0f172a] border border-amber-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-slate-200">
            <button
              onClick={() => setIsVipSimModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
              <Zap className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              TRADE WITH SONI — VIP Educational Desk
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Premium institutional trade setups and high-probability swing research.
            </p>

            <div className="space-y-2.5 text-xs text-slate-300 mb-6 bg-[#0a0f1d] p-4 rounded-xl border border-[#1e293b]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Daily Indian Nifty 50 &amp; Bank Nifty Swing Breakouts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>US Tech Giants (Nvidia, Apple, Tesla) Positional Setups</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1:2.5+ Minimum Risk-to-Reward Ratio filtering</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direct Access to Soni Mentorship Q&amp;A Webinars</span>
              </div>
            </div>

            <p className="text-[11px] text-amber-300/80 mb-4">
              * Note: Educational demonstration only. No payment gateway is attached or active.
            </p>

            <button
              type="button"
              onClick={() => setIsVipSimModalOpen(false)}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all"
            >
              Close &amp; Continue Educational Practice
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
