import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { formatCurrency } from '../../utils/tradingMath';
import {
  TrendingUp,
  GraduationCap,
  BookOpen,
  Zap,
  Shield,
  Volume2,
  VolumeX,
  Menu,
  X,
  Wallet,
  Activity,
  Award,
} from 'lucide-react';
import { TradeWithSoniLogo } from '../common/TradeWithSoniLogo';

export type NavTab = 'terminal' | 'academy' | 'journal' | 'signals' | 'admin';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const {
    activeMarket,
    setActiveMarket,
    inBalance,
    usBalance,
    soundEnabled,
    setSoundEnabled,
    completedLessonIds,
    isAdmin,
  } = useTrading();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0b0f17]/95 border-b border-[#1e293b] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleTabClick('terminal')}
              className="flex items-center text-left group focus:outline-none"
              aria-label="TRADE WITH SONI Home"
            >
              <TradeWithSoniLogo size="md" />
            </button>
          </div>

          {/* Center Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-[#0f172a] p-1 rounded-xl border border-[#1e293b]">
            <button
              onClick={() => handleTabClick('terminal')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentTab === 'terminal'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              aria-label="Open Trading Terminal"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Trading Desk</span>
            </button>

            <button
              onClick={() => handleTabClick('academy')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentTab === 'academy'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              aria-label="Open Soni Academy"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Soni Academy</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                {completedLessonIds.length}/10
              </span>
            </button>

            <button
              onClick={() => handleTabClick('journal')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentTab === 'journal'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              aria-label="Open Public Trading Journal"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Public Journal</span>
            </button>

            <button
              onClick={() => handleTabClick('signals')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentTab === 'signals'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              aria-label="Open VIP Signals"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>VIP Signals</span>
            </button>

            <button
              onClick={() => handleTabClick('admin')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentTab === 'admin'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              aria-label="Open Admin Dashboard"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin {isAdmin && '●'}</span>
            </button>
          </nav>

          {/* Right Area: Market Switcher, Balance Badges, Sound */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Quick Market Switcher */}
            <div className="flex bg-[#0f172a] rounded-xl p-1 border border-[#1e293b]">
              <button
                onClick={() => setActiveMarket('IN')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeMarket === 'IN'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Switch to Indian Stocks"
                aria-label="Switch to Indian Market"
              >
                <span>🇮🇳</span>
                <span className="font-mono">{formatCurrency(inBalance, 'INR', true)}</span>
              </button>

              <button
                onClick={() => setActiveMarket('US')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeMarket === 'US'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Switch to US Stocks"
                aria-label="Switch to US Market"
              >
                <span>🇺🇸</span>
                <span className="font-mono">{formatCurrency(usBalance, 'USD', true)}</span>
              </button>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 text-slate-400 hover:text-white bg-[#0f172a] border border-[#1e293b] rounded-xl transition-colors"
              aria-label={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
              title={soundEnabled ? 'Execution Sound: ON' : 'Execution Sound: OFF'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Mobile Market Indicator */}
            <button
              onClick={() => setActiveMarket(activeMarket === 'IN' ? 'US' : 'IN')}
              className="px-2.5 py-1 bg-[#0f172a] border border-[#1e293b] rounded-lg text-xs font-mono font-bold text-emerald-400 flex items-center gap-1"
            >
              <span>{activeMarket === 'IN' ? '🇮🇳 ₹' : '🇺🇸 $'}</span>
              <span>
                {formatCurrency(activeMarket === 'IN' ? inBalance : usBalance, activeMarket === 'IN' ? 'INR' : 'USD', true)}
              </span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white bg-[#0f172a] border border-[#1e293b] rounded-xl"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#1e293b] py-3 px-2 flex flex-col gap-2 bg-[#0b0f17] animate-fade-in">
            <button
              onClick={() => handleTabClick('terminal')}
              className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold text-left flex items-center gap-2.5 ${
                currentTab === 'terminal' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Trading Terminal (Indian &amp; US Paper Trading)</span>
            </button>

            <button
              onClick={() => handleTabClick('academy')}
              className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold text-left flex items-center gap-2.5 ${
                currentTab === 'academy' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Soni Academy (Level 1 to 10 Curriculum)</span>
            </button>

            <button
              onClick={() => handleTabClick('journal')}
              className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold text-left flex items-center gap-2.5 ${
                currentTab === 'journal' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Public Trading Journal</span>
            </button>

            <button
              onClick={() => handleTabClick('signals')}
              className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold text-left flex items-center gap-2.5 ${
                currentTab === 'signals' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>VIP Signals Desk</span>
            </button>

            <button
              onClick={() => handleTabClick('admin')}
              className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold text-left flex items-center gap-2.5 ${
                currentTab === 'admin' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </button>

            {/* Mobile Market Selector */}
            <div className="pt-2 border-t border-[#1e293b] flex gap-2">
              <button
                onClick={() => setActiveMarket('IN')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg border flex items-center justify-center gap-1.5 ${
                  activeMarket === 'IN'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : 'bg-[#131d2e] border-[#1e293b] text-slate-400'
                }`}
              >
                <span>🇮🇳 Indian Paper</span>
                <span className="font-mono">₹1.00L</span>
              </button>

              <button
                onClick={() => setActiveMarket('US')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg border flex items-center justify-center gap-1.5 ${
                  activeMarket === 'US'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : 'bg-[#131d2e] border-[#1e293b] text-slate-400'
                }`}
              >
                <span>🇺🇸 US Paper</span>
                <span className="font-mono">$100k</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
