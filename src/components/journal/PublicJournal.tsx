import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { JournalEntry, MarketType } from '../../types/trading';
import { formatCurrency, calculateRiskRewardRatio } from '../../utils/tradingMath';
import {
  BookOpen,
  PlusCircle,
  Heart,
  MessageSquare,
  Search,
  Filter,
  ShieldAlert,
  Trash2,
  Send,
  CheckCircle2,
  AlertTriangle,
  Info,
  TrendingUp,
  TrendingDown,
  X,
  Image as ImageIcon,
} from 'lucide-react';

export const PublicJournal: React.FC = () => {
  const {
    journalEntries,
    addJournalEntry,
    likeJournalEntry,
    addJournalComment,
    deleteJournalEntry,
    reportJournalEntry,
    indianStocks,
    usStocks,
  } = useTrading();

  const [searchQuery, setSearchQuery] = useState('');
  const [marketFilter, setMarketFilter] = useState<'ALL' | MarketType>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'TARGET_HIT' | 'STOPLOSS_HIT'>('ALL');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // New Post Form State
  const [newStockSymbol, setNewStockSymbol] = useState('RELIANCE');
  const [newStockName, setNewStockName] = useState('Reliance Industries Ltd.');
  const [newMarket, setNewMarket] = useState<MarketType>('IN');
  const [newDirection, setNewDirection] = useState<'BULLISH' | 'BEARISH'>('BULLISH');
  const [newEntryPrice, setNewEntryPrice] = useState('2940.00');
  const [newTargetPrice, setNewTargetPrice] = useState('3080.00');
  const [newStopLossPrice, setNewStopLossPrice] = useState('2880.00');
  const [newExplanation, setNewExplanation] = useState('');
  const [newImageUrl, setNewImageUrl] = useState(
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80'
  );

  // Sync symbol with name
  const handleStockSelect = (sym: string, market: MarketType) => {
    setNewStockSymbol(sym);
    const list = market === 'IN' ? indianStocks : usStocks;
    const match = list.find((s) => s.symbol === sym);
    if (match) {
      setNewStockName(match.name);
      setNewEntryPrice(match.currentPrice.toFixed(2));
      setNewTargetPrice((match.currentPrice * (newDirection === 'BULLISH' ? 1.05 : 0.95)).toFixed(2));
      setNewStopLossPrice((match.currentPrice * (newDirection === 'BULLISH' ? 0.98 : 1.02)).toFixed(2));
    }
  };

  const filteredEntries = journalEntries.filter((entry) => {
    // Hide reported spam
    if (entry.isReported) return false;

    if (marketFilter !== 'ALL' && entry.market !== marketFilter) return false;
    if (statusFilter !== 'ALL' && entry.status !== statusFilter) return false;

    const q = searchQuery.toLowerCase();
    return (
      entry.stockSymbol.toLowerCase().includes(q) ||
      entry.stockName.toLowerCase().includes(q) ||
      entry.authorName.toLowerCase().includes(q) ||
      entry.setupExplanation.toLowerCase().includes(q)
    );
  });

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entryNum = Number(newEntryPrice);
    const targetNum = Number(newTargetPrice);
    const slNum = Number(newStopLossPrice);

    if (!entryNum || !targetNum || !slNum) {
      alert('Please fill all price targets.');
      return;
    }

    const calculatedRR = calculateRiskRewardRatio(entryNum, targetNum, slNum);

    addJournalEntry({
      authorName: 'Alex TradingPro (You)',
      authorBadge: 'Verified Trader',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      stockSymbol: newStockSymbol,
      stockName: newStockName,
      market: newMarket,
      direction: newDirection,
      entryPrice: entryNum,
      targetPrice: targetNum,
      stopLossPrice: slNum,
      riskRewardRatio: calculatedRR,
      setupExplanation: newExplanation || 'Technical breakout setup observed on high volume with favorable risk to reward ratio.',
      chartImageUrl: newImageUrl,
      status: 'ACTIVE',
    });

    setIsPublishModalOpen(false);
    setNewExplanation('');
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    addJournalComment(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Educational Banner */}
      <div className="p-4 bg-[#0a1222] border border-[#1e293b] rounded-2xl flex items-start gap-3.5 shadow-lg">
        <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="font-bold text-white uppercase tracking-wider block mb-0.5">
            Public Trading Journal &amp; Idea Exchange
          </span>
          All journal setups published in this community are peer-generated educational studies.
          They do not constitute investment advice or actual financial execution. Practice ideas on the
          virtual paper trading terminal with disciplined risk management.
        </div>
      </div>

      {/* Header & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0f172a] border border-[#1e293b] p-4 rounded-2xl shadow-xl">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search trade setups, stocks, or traders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#131d2e] border border-[#1e293b] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Market Filter */}
          <div className="flex bg-[#131d2e] rounded-xl p-0.5 border border-[#1e293b]">
            <button
              onClick={() => setMarketFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                marketFilter === 'ALL' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Markets
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

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as unknown as typeof statusFilter)}
            className="bg-[#131d2e] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
            aria-label="Filter journal entries by status"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Setups</option>
            <option value="TARGET_HIT">Target Hit (Wins)</option>
            <option value="STOPLOSS_HIT">Stop Loss Hit</option>
          </select>

          {/* Publish Button */}
          <button
            onClick={() => setIsPublishModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/40 transition-all"
            aria-label="Publish a new trade setup"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish Trade Idea</span>
          </button>
        </div>
      </div>

      {/* Journal Entries List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEntries.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 bg-[#0f172a] rounded-2xl border border-[#1e293b]">
            <BookOpen className="w-10 h-10 mx-auto text-slate-600 mb-2" />
            <p className="text-base font-semibold text-slate-300">No trading setups found</p>
            <p className="text-xs text-slate-500 mt-1">Be the first to share an educational setup!</p>
          </div>
        ) : (
          filteredEntries.map((post) => {
            const isBullish = post.direction === 'BULLISH';
            const currency = post.market === 'IN' ? 'INR' : 'USD';
            const showComments = activeCommentPostId === post.id;

            return (
              <div
                key={post.id}
                className="bg-[#0f172a] border border-[#1e293b] rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                <div>
                  {/* Author Header */}
                  <div className="p-4 flex items-center justify-between border-b border-[#1e293b]/60 bg-[#0a0f1d]">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-9 h-9 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{post.authorName}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 font-medium">
                            {post.authorBadge}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {new Date(post.timestamp).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Stock Symbol Tag */}
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-white px-2 py-1 rounded bg-[#131d2e] border border-[#1e293b]">
                        {post.stockSymbol}
                      </span>
                    </div>
                  </div>

                  {/* Chart Image */}
                  <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                    <img
                      src={post.chartImageUrl}
                      alt={`${post.stockSymbol} chart setup`}
                      className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                    />
                    {/* Status Badge */}
                    <div className="absolute top-2.5 left-2.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow ${
                          post.status === 'TARGET_HIT'
                            ? 'bg-emerald-500 text-slate-950'
                            : post.status === 'STOPLOSS_HIT'
                            ? 'bg-rose-500 text-white'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {post.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow ${
                          isBullish ? 'bg-emerald-500/90 text-slate-950' : 'bg-rose-600/90 text-white'
                        }`}
                      >
                        {isBullish ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {post.direction}
                      </span>
                    </div>
                  </div>

                  {/* Trade Parameters Grid */}
                  <div className="p-4 grid grid-cols-4 gap-2 bg-[#090d16] border-y border-[#1e293b]/60 text-xs font-mono">
                    <div>
                      <div className="text-[10px] text-slate-500">Entry</div>
                      <div className="font-bold text-white">
                        {formatCurrency(post.entryPrice, currency)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">Target</div>
                      <div className="font-bold text-emerald-400">
                        {formatCurrency(post.targetPrice, currency)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">Stop Loss</div>
                      <div className="font-bold text-rose-400">
                        {formatCurrency(post.stopLossPrice, currency)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">R:R</div>
                      <div className="font-bold text-amber-400">{post.riskRewardRatio}</div>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="p-4 text-xs text-slate-300 leading-relaxed font-sans">
                    {post.setupExplanation}
                  </div>
                </div>

                {/* Footer Actions: Likes, Comments, Report */}
                <div className="p-4 border-t border-[#1e293b]/60 bg-[#0a0f1d] flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-4">
                      {/* Like button */}
                      <button
                        onClick={() => likeJournalEntry(post.id)}
                        className={`flex items-center gap-1.5 transition-colors ${
                          post.isLikedByUser ? 'text-rose-500 font-bold' : 'hover:text-white'
                        }`}
                        aria-label={`Like trade idea for ${post.stockSymbol}`}
                      >
                        <Heart className={`w-4 h-4 ${post.isLikedByUser ? 'fill-current' : ''}`} />
                        <span>{post.likes}</span>
                      </button>

                      {/* Comments toggle */}
                      <button
                        onClick={() =>
                          setActiveCommentPostId(showComments ? null : post.id)
                        }
                        className="flex items-center gap-1.5 hover:text-white transition-colors"
                        aria-label={`View comments on ${post.stockSymbol}`}
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.comments.length}</span>
                      </button>
                    </div>

                    {/* Report / Moderation button */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (confirm('Report this post for spam or policy violation?')) {
                            reportJournalEntry(post.id);
                          }
                        }}
                        className="text-slate-500 hover:text-amber-400 text-[11px] flex items-center gap-1"
                        title="Report inappropriate content"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Report</span>
                      </button>

                      {/* Delete button if user post */}
                      {post.authorName.includes('(You)') && (
                        <button
                          onClick={() => deleteJournalEntry(post.id)}
                          className="text-slate-500 hover:text-rose-400 text-[11px] p-1"
                          title="Delete your post"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Comment Thread Dropdown */}
                  {showComments && (
                    <div className="mt-2 pt-3 border-t border-[#1e293b] flex flex-col gap-2.5 animate-fade-in">
                      {post.comments.length > 0 && (
                        <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                          {post.comments.map((c) => (
                            <div key={c.id} className="bg-[#131d2e] p-2 rounded-lg text-xs">
                              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                                <span className="font-bold text-white">{c.userName}</span>
                                <span>{new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <p className="text-slate-300">{c.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* New Comment Input */}
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          placeholder="Write a constructive insight..."
                          value={commentInputs[post.id] || ''}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddComment(post.id);
                          }}
                          className="flex-1 bg-[#131d2e] border border-[#1e293b] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="p-1.5 bg-emerald-500 text-slate-950 rounded-lg hover:bg-emerald-400 transition-colors"
                          aria-label="Send comment"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Publish Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto text-slate-200">
            <button
              onClick={() => setIsPublishModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              aria-label="Close publish dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-400" />
              <span>Publish Educational Trade Setup</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Share your technical analysis with the Trade With Soni community.
            </p>

            <form onSubmit={handlePublishSubmit} className="space-y-4">
              {/* Market and Stock Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Market</label>
                  <select
                    value={newMarket}
                    onChange={(e) => {
                      const m = e.target.value as MarketType;
                      setNewMarket(m);
                      handleStockSelect(m === 'IN' ? 'RELIANCE' : 'AAPL', m);
                    }}
                    className="w-full bg-[#131d2e] border border-[#1e293b] rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="IN">🇮🇳 Indian (NSE)</option>
                    <option value="US">🇺🇸 US (NASDAQ/NYSE)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Select Stock</label>
                  <select
                    value={newStockSymbol}
                    onChange={(e) => handleStockSelect(e.target.value, newMarket)}
                    className="w-full bg-[#131d2e] border border-[#1e293b] rounded-lg px-3 py-2 text-xs text-white font-mono"
                  >
                    {(newMarket === 'IN' ? indianStocks : usStocks).map((s) => (
                      <option key={s.symbol} value={s.symbol}>
                        {s.symbol} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Direction */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">Trade Direction</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewDirection('BULLISH')}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      newDirection === 'BULLISH'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'bg-[#131d2e] border-[#1e293b] text-slate-400'
                    }`}
                  >
                    BULLISH (Long)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewDirection('BEARISH')}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      newDirection === 'BEARISH'
                        ? 'bg-rose-600 text-white border-rose-500'
                        : 'bg-[#131d2e] border-[#1e293b] text-slate-400'
                    }`}
                  >
                    BEARISH (Short)
                  </button>
                </div>
              </div>

              {/* Prices: Entry, Target, SL */}
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Entry Price</label>
                  <input
                    type="number"
                    step="0.05"
                    value={newEntryPrice}
                    onChange={(e) => setNewEntryPrice(e.target.value)}
                    className="w-full bg-[#131d2e] border border-[#1e293b] rounded-lg px-2.5 py-1.5 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Target Price</label>
                  <input
                    type="number"
                    step="0.05"
                    value={newTargetPrice}
                    onChange={(e) => setNewTargetPrice(e.target.value)}
                    className="w-full bg-[#131d2e] border border-[#1e293b] rounded-lg px-2.5 py-1.5 text-emerald-400 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Stop Loss</label>
                  <input
                    type="number"
                    step="0.05"
                    value={newStopLossPrice}
                    onChange={(e) => setNewStopLossPrice(e.target.value)}
                    className="w-full bg-[#131d2e] border border-[#1e293b] rounded-lg px-2.5 py-1.5 text-rose-400 font-bold"
                    required
                  />
                </div>
              </div>

              {/* Setup Explanation */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">Technical Setup Rationale</label>
                <textarea
                  rows={3}
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  placeholder="Describe candlestick triggers, support/resistance confluence, moving averages, or volume signals..."
                  className="w-full bg-[#131d2e] border border-[#1e293b] rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* Chart Image Picker */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">Chart Screenshot Image URL</label>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full bg-[#131d2e] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-white"
                  required
                />
                <div className="flex gap-2 mt-1.5 text-[10px] text-slate-400">
                  <span>Presets:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setNewImageUrl(
                        'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80'
                      )
                    }
                    className="underline text-emerald-400"
                  >
                    Candle Breakout
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setNewImageUrl(
                        'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=80'
                      )
                    }
                    className="underline text-emerald-400"
                  >
                    Tech Rally
                  </button>
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300">
                Notice: All submitted posts are subject to community guidelines and admin moderation.
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-lg shadow-lg shadow-emerald-950/40"
                >
                  Publish to Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
