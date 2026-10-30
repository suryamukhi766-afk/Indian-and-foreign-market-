import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { AdvancedTradingChart } from '../charts/AdvancedTradingChart';
import { OrderPanel } from './OrderPanel';
import { StockWatchlist } from './StockWatchlist';
import { TradingPositionsAndOrders } from './TradingPositionsAndOrders';
import { ResetModal } from '../common/ResetModal';
import { OrderSide } from '../../types/trading';

export const TradingTerminal: React.FC = () => {
  const { selectedStock, activeMarket } = useTrading();
  const [isFullscreenChart, setIsFullscreenChart] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [activeSide, setActiveSide] = useState<OrderSide>('BUY');

  const handleQuickOrder = (side: OrderSide) => {
    setActiveSide(side);
    // Smoothly scroll to order panel on mobile if needed
    const panel = document.getElementById('order-panel-container');
    if (panel) {
      panel.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Upper Section: Watchlist + Chart + Order Execution Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Watchlist: 3 cols on large screen */}
        <div className="lg:col-span-3">
          <StockWatchlist />
        </div>

        {/* Chart: 6 cols on large screen */}
        <div className="lg:col-span-6">
          <AdvancedTradingChart
            stock={selectedStock}
            isFullscreen={isFullscreenChart}
            onToggleFullscreen={() => setIsFullscreenChart((v) => !v)}
            onQuickOrder={handleQuickOrder}
          />
        </div>

        {/* Order Panel: 3 cols on large screen */}
        <div id="order-panel-container" className="lg:col-span-3">
          <OrderPanel initialSide={activeSide} />
        </div>
      </div>

      {/* Lower Section: Positions, Pending Orders, Order History, Portfolio Summary */}
      <div className="w-full">
        <TradingPositionsAndOrders onOpenResetModal={() => setIsResetModalOpen(true)} />
      </div>

      {/* Reset Modal */}
      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        market={activeMarket}
      />
    </div>
  );
};
