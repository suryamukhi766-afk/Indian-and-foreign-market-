import React, { useState } from 'react';
import { TradingProvider } from './context/TradingContext';
import { Navbar, NavTab } from './components/layout/Navbar';
import { MarketTicker } from './components/layout/MarketTicker';
import { TradingTerminal } from './components/trading/TradingTerminal';
import { SoniAcademy } from './components/academy/SoniAcademy';
import { PublicJournal } from './components/journal/PublicJournal';
import { VipSignals } from './components/signals/VipSignals';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Footer } from './components/layout/Footer';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<NavTab>('terminal');

  return (
    <div className="min-h-screen bg-[#070a10] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Running Market Ticker */}
      <MarketTicker />

      {/* Main Top Navigation */}
      <Navbar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* App Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'terminal' && <TradingTerminal />}
        {currentTab === 'academy' && <SoniAcademy />}
        {currentTab === 'journal' && <PublicJournal />}
        {currentTab === 'signals' && (
          <VipSignals onNavigateToTerminal={() => setCurrentTab('terminal')} />
        )}
        {currentTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Platform Footer */}
      <Footer onSelectTab={setCurrentTab} />
    </div>
  );
}

export default function App() {
  return (
    <TradingProvider>
      <AppContent />
    </TradingProvider>
  );
}
