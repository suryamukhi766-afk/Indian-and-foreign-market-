import React from 'react';
import { ShieldCheck, Info, Activity } from 'lucide-react';
import { NavTab } from './Navbar';
import { TradeWithSoniLogo } from '../common/TradeWithSoniLogo';

interface FooterProps {
  onSelectTab: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-[#070a10] border-t border-[#1e293b] mt-16 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <TradeWithSoniLogo size="sm" />
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              A premium, professional trading education and virtual paper trading platform. Master Indian (NSE) and US (NASDAQ/NYSE) equity markets with real-time simulated order matching, Level 1 to 10 curriculum, and peer journal setups.
            </p>
          </div>

          {/* Col 2: Platform Links */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Trading Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectTab('terminal')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Indian Market (₹1,00,000 Demo)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('terminal')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Foreign US Market ($100,000 Demo)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('signals')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  VIP Educational Signals
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('admin')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Admin Operations Console
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Education */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Soni Academy</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectTab('academy')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Level 1-10 Complete Curriculum
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('academy')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Candlestick Patterns &amp; Geometry
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('academy')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Risk Management (1:2 R:R Formula)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('journal')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Public Trading Journal Community
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory & Educational Disclaimer */}
        <div className="pt-6 border-t border-[#1e293b]/60 flex flex-col gap-3">
          <div className="p-4 bg-[#0a0f1d] border border-[#1e293b] rounded-xl text-[11px] text-slate-400 leading-relaxed flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-200">Legal &amp; Regulatory Educational Notice: </span>
              TRADE WITH SONI is purely an educational simulation and training application. All stock prices, order executions, portfolios, and account balances are strictly virtual simulations. No real capital is ever transferred, deposited, or traded. All educational lessons, trade ideas, and VIP signals are for academic analysis and illustrative demonstration only and do not constitute registered investment, tax, or financial advisory.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
            <div>
              &copy; {new Date().getFullYear()} TRADE WITH SONI. Engineered for disciplined traders.
            </div>
            <div className="flex items-center gap-4">
              <span>Paper Trading Mode Active</span>
              <span>NSE &bull; NASDAQ &bull; NYSE Simulated</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
