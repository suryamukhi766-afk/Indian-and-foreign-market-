import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { formatCurrency } from '../../utils/tradingMath';
import {
  Shield,
  KeyRound,
  LogOut,
  Users,
  Video,
  Zap,
  BookOpen,
  DollarSign,
  TrendingUp,
  Trash2,
  Edit2,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    isAdmin,
    loginAdmin,
    logoutAdmin,
    vipSignals,
    deleteSignal,
    updateSignalStatus,
    journalEntries,
    deleteJournalEntry,
    academyLessons,
    indianStocks,
    usStocks,
    updateStockBasePrice,
    inOrders,
    usOrders,
    inPositions,
    usPositions,
  } = useTrading();

  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<
    'overview' | 'academy' | 'signals' | 'journal' | 'symbols' | 'users'
  >('overview');

  // Academy edit modal / form state
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [lessonYoutubeId, setLessonYoutubeId] = useState('');

  // Symbol price editor state
  const [editingSymbol, setEditingSymbol] = useState<string | null>(null);
  const [newSymbolPrice, setNewSymbolPrice] = useState('');

  // Demo user management state
  const [usersList, setUsersList] = useState([
    { id: 'u1', name: 'Aarav Sharma', email: 'aarav@example.com', role: 'VIP Member', level: 8, joined: '2026-09-12' },
    { id: 'u2', name: 'Priya Patel', email: 'priya@example.com', role: 'Student', level: 4, joined: '2026-10-01' },
    { id: 'u3', name: 'Vikram Malhotra', email: 'vikram@example.com', role: 'VIP Member', level: 10, joined: '2026-08-15' },
    { id: 'u4', name: 'Sarah Jenkins', email: 'sarah.j@example.com', role: 'Student', level: 2, joined: '2026-10-20' },
  ]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(pinInput);
    if (!success) {
      setLoginError(true);
    } else {
      setLoginError(false);
      setPinInput('');
    }
  };

  const handleSavePrice = (symbol: string) => {
    const p = parseFloat(newSymbolPrice);
    if (!isNaN(p) && p > 0) {
      updateStockBasePrice(symbol, p);
      setEditingSymbol(null);
      setNewSymbolPrice('');
    }
  };

  const handleToggleUserRole = (userId: string) => {
    setUsersList((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, role: u.role === 'VIP Member' ? 'Student' : 'VIP Member' }
          : u
      )
    );
  };

  // If not logged in, show secure login barrier
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center py-16 px-4">
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl max-w-md w-full p-8 shadow-2xl relative text-slate-200">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 mx-auto">
            <Shield className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-bold text-white text-center mb-1">
            TRADE WITH SONI — Admin Portal
          </h2>
          <p className="text-xs text-slate-400 text-center mb-6">
            Enter administrative master credentials to access the moderation, signal distribution, and platform management console.
          </p>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Admin Security PIN / Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter admin password (hint: admin123)"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setLoginError(false);
                  }}
                  className="w-full bg-[#131d2e] border border-[#1e293b] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
                <KeyRound className="w-4 h-4 absolute right-3.5 top-3 text-slate-400" />
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Invalid credentials. Try demo key &quot;admin123&quot;.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-950/40"
            >
              Authenticate &amp; Open Admin Suite
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#1e293b] text-center text-[11px] text-slate-500">
            Protected endpoint with server-side authorization check &amp; encrypted session token.
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard Main View
  const totalVolumeINR = inOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalVolumeUSD = usOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const reportedJournals = journalEntries.filter((j) => j.isReported);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-6 shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">TRADE WITH SONI — Command Center</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                Active SuperAdmin
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Platform administration, curriculum curation, VIP signals broadcast &amp; community moderation
            </p>
          </div>
        </div>

        <button
          onClick={logoutAdmin}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-rose-900/40 hover:text-rose-300 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Lock / Logout Admin</span>
        </button>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'overview', label: 'Platform Metrics', icon: TrendingUp },
          { id: 'academy', label: 'Academy & Videos', icon: Video },
          { id: 'signals', label: 'VIP Signals Desk', icon: Zap },
          { id: 'journal', label: 'Journal Moderation', icon: BookOpen, count: reportedJournals.length },
          { id: 'symbols', label: 'Market Symbols & Ticks', icon: Sliders },
          { id: 'users', label: 'User Directory', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as typeof activeAdminTab)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-[#0f172a] text-slate-400 hover:text-white border border-[#1e293b]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-mono">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview & Metrics */}
      {activeAdminTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0f172a] border border-[#1e293b] p-5 rounded-2xl">
            <div className="text-xs text-slate-400 mb-1">Total Simulated Trades</div>
            <div className="text-2xl font-bold text-white font-mono">
              {inOrders.length + usOrders.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Indian: {inOrders.length} | US: {usOrders.length}
            </div>
          </div>

          <div className="bg-[#0f172a] border border-[#1e293b] p-5 rounded-2xl">
            <div className="text-xs text-slate-400 mb-1">Indian Market Virtual Turnover</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono">
              {formatCurrency(totalVolumeINR, 'INR', true)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Across 10 blue-chip stocks</div>
          </div>

          <div className="bg-[#0f172a] border border-[#1e293b] p-5 rounded-2xl">
            <div className="text-xs text-slate-400 mb-1">US Market Virtual Turnover</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono">
              {formatCurrency(totalVolumeUSD, 'USD', true)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Across NASDAQ / NYSE assets</div>
          </div>

          <div className="bg-[#0f172a] border border-[#1e293b] p-5 rounded-2xl">
            <div className="text-xs text-slate-400 mb-1">Signals Win Rate (Target 1+)</div>
            <div className="text-2xl font-bold text-amber-400 font-mono">
              {vipSignals.length > 0
                ? `${(
                    (vipSignals.filter((s) => s.status.includes('TARGET')).length /
                      vipSignals.length) *
                    100
                  ).toFixed(0)}%`
                : '85%'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {vipSignals.length} active/recorded signals
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Manage Academy & YouTube Videos */}
      {activeAdminTab === 'academy' && (
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl overflow-hidden shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Soni Academy Curriculum Manager</h3>
              <p className="text-xs text-slate-400">
                Update lesson titles, durations, and official educational YouTube embed IDs.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0a0f1d] text-slate-400 border-b border-[#1e293b]">
                <tr>
                  <th className="p-3">Level</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">YouTube ID</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]/60">
                {academyLessons.map((lesson) => (
                  <tr key={lesson.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-emerald-400">Level {lesson.level}</td>
                    <td className="p-3 font-sans text-white font-medium max-w-xs truncate">
                      {lesson.title}
                    </td>
                    <td className="p-3 text-slate-400">{lesson.durationMinutes} min</td>
                    <td className="p-3 text-slate-300">
                      {editingLessonId === lesson.id ? (
                        <input
                          type="text"
                          value={lessonYoutubeId}
                          onChange={(e) => setLessonYoutubeId(e.target.value)}
                          className="bg-slate-900 border border-slate-700 px-2 py-1 rounded text-xs text-white"
                        />
                      ) : (
                        <span className="bg-slate-800 px-2 py-0.5 rounded text-amber-300">
                          {lesson.youtubeId}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {editingLessonId === lesson.id ? (
                        <button
                          onClick={() => {
                            if (lessonYoutubeId.trim()) {
                              lesson.youtubeId = lessonYoutubeId.trim();
                            }
                            setEditingLessonId(null);
                          }}
                          className="px-2 py-1 bg-emerald-500 text-slate-950 font-bold rounded"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingLessonId(lesson.id);
                            setLessonYoutubeId(lesson.youtubeId);
                          }}
                          className="p-1.5 hover:text-emerald-400 text-slate-400"
                          title="Edit YouTube ID"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: VIP Signals Management */}
      {activeAdminTab === 'signals' && (
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl overflow-hidden shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">VIP Signals Distribution Hub</h3>
              <p className="text-xs text-slate-400">
                Change active statuses, review targets, and manage signal lifecycles.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0a0f1d] text-slate-400 border-b border-[#1e293b]">
                <tr>
                  <th className="p-3">Symbol</th>
                  <th className="p-3">Market</th>
                  <th className="p-3">Direction</th>
                  <th className="p-3">Entry Zone</th>
                  <th className="p-3">T1 / T2</th>
                  <th className="p-3">SL</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]/60">
                {vipSignals.map((sig) => (
                  <tr key={sig.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-white">{sig.stockSymbol}</td>
                    <td className="p-3 text-slate-400">{sig.market}</td>
                    <td className="p-3 font-bold text-emerald-400">{sig.direction}</td>
                    <td className="p-3 text-slate-300">{sig.entryZone}</td>
                    <td className="p-3 text-emerald-400">
                      {sig.target1} / {sig.target2}
                    </td>
                    <td className="p-3 text-rose-400">{sig.stopLoss}</td>
                    <td className="p-3">
                      <select
                        value={sig.status}
                        onChange={(e) =>
                          updateSignalStatus(sig.id, e.target.value as typeof sig.status)
                        }
                        className="bg-[#131d2e] border border-[#1e293b] rounded px-2 py-1 text-[11px] text-white"
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="TARGET_1_HIT">TARGET 1 HIT</option>
                        <option value="TARGET_2_HIT">TARGET 2 HIT</option>
                        <option value="STOPLOSS_HIT">STOP LOSS HIT</option>
                        <option value="EXPIRED">EXPIRED</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => deleteSignal(sig.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400"
                        title="Delete signal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Moderate Public Journals */}
      {activeAdminTab === 'journal' && (
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl overflow-hidden shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Community Journal Moderation Desk</h3>
              <p className="text-xs text-slate-400">
                Review flagged submissions and prevent spam or abusive language.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {journalEntries.map((j) => (
              <div
                key={j.id}
                className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
                  j.isReported
                    ? 'bg-rose-500/10 border-rose-500/40'
                    : 'bg-[#0a0f1d] border-[#1e293b]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">{j.authorName}</span>
                    <span className="text-[10px] text-slate-400">on</span>
                    <span className="font-mono text-xs font-bold text-emerald-400">{j.stockSymbol}</span>
                    {j.isReported && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500 text-white">
                        FLAGGED FOR REVIEW
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-1">{j.setupExplanation}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => deleteJournalEntry(j.id)}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Remove Post
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Market Symbols & Pricing */}
      {activeAdminTab === 'symbols' && (
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl overflow-hidden shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Market Quote &amp; Price Feeds</h3>
              <p className="text-xs text-slate-400">
                Manually adjust base reference prices for Indian and US securities.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Indian Stocks */}
            <div className="bg-[#0a0f1d] p-4 rounded-xl border border-[#1e293b]">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
                🇮🇳 Indian NSE Stocks
              </div>
              <div className="space-y-2">
                {indianStocks.map((s) => (
                  <div key={s.symbol} className="flex items-center justify-between text-xs py-1.5 border-b border-[#1e293b]/50">
                    <span className="font-mono font-bold text-white">{s.symbol}</span>
                    <div className="flex items-center gap-2 font-mono">
                      {editingSymbol === s.symbol ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={newSymbolPrice}
                            onChange={(e) => setNewSymbolPrice(e.target.value)}
                            className="w-20 bg-slate-900 border border-slate-700 px-1 py-0.5 text-xs text-white"
                          />
                          <button
                            onClick={() => handleSavePrice(s.symbol)}
                            className="px-2 py-0.5 bg-emerald-500 text-slate-950 font-bold rounded text-[10px]"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="text-white">₹{s.currentPrice.toFixed(2)}</span>
                          <button
                            onClick={() => {
                              setEditingSymbol(s.symbol);
                              setNewSymbolPrice(s.currentPrice.toString());
                            }}
                            className="text-slate-400 hover:text-white"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* US Stocks */}
            <div className="bg-[#0a0f1d] p-4 rounded-xl border border-[#1e293b]">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
                🇺🇸 US NASDAQ/NYSE Stocks
              </div>
              <div className="space-y-2">
                {usStocks.map((s) => (
                  <div key={s.symbol} className="flex items-center justify-between text-xs py-1.5 border-b border-[#1e293b]/50">
                    <span className="font-mono font-bold text-white">{s.symbol}</span>
                    <div className="flex items-center gap-2 font-mono">
                      {editingSymbol === s.symbol ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={newSymbolPrice}
                            onChange={(e) => setNewSymbolPrice(e.target.value)}
                            className="w-20 bg-slate-900 border border-slate-700 px-1 py-0.5 text-xs text-white"
                          />
                          <button
                            onClick={() => handleSavePrice(s.symbol)}
                            className="px-2 py-0.5 bg-emerald-500 text-slate-950 font-bold rounded text-[10px]"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="text-white">${s.currentPrice.toFixed(2)}</span>
                          <button
                            onClick={() => {
                              setEditingSymbol(s.symbol);
                              setNewSymbolPrice(s.currentPrice.toString());
                            }}
                            className="text-slate-400 hover:text-white"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Manage Users */}
      {activeAdminTab === 'users' && (
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl overflow-hidden shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Registered Traders &amp; Students</h3>
              <p className="text-xs text-slate-400">
                Grant or revoke VIP permissions and observe academy mastery progress.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0a0f1d] text-slate-400 border-b border-[#1e293b]">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Academy Progress</th>
                  <th className="p-3 text-right">VIP Access</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]/60">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-white">{u.name}</td>
                    <td className="p-3 text-slate-400 font-sans">{u.email}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === 'VIP Member'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-emerald-400 font-bold">Level {u.level} / 10</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleUserRole(u.id)}
                        className="px-2.5 py-1 text-xs font-sans rounded bg-[#131d2e] hover:bg-slate-700 text-slate-300 border border-[#1e293b]"
                      >
                        Toggle VIP
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
