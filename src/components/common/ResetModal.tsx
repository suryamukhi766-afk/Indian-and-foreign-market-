import React from 'react';
import { useTrading } from '../../context/TradingContext';
import { MarketType } from '../../types/trading';
import { AlertTriangle, RotateCcw, X } from 'lucide-react';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  market: MarketType;
}

export const ResetModal: React.FC<ResetModalProps> = ({ isOpen, onClose, market }) => {
  const { resetAccount } = useTrading();

  if (!isOpen) return null;

  const isIndian = market === 'IN';
  const targetCurrency = isIndian ? '₹1,00,000' : '$100,000';
  const marketName = isIndian ? 'Indian Stock Market' : 'Foreign US Market';

  const handleConfirmReset = () => {
    resetAccount(market);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-white mb-2">
          Reset {marketName} Virtual Portfolio?
        </h3>

        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          This action will restore your virtual paper trading balance back to{' '}
          <span className="font-bold text-emerald-400 font-mono">{targetCurrency}</span>, close all
          current open positions, and clear pending limit orders for the {marketName}.
        </p>

        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 mb-6">
          ⚠️ Note: The other market&apos;s portfolio and balances will remain completely unaffected.
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmReset}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-lg shadow-rose-950/40 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Confirm Reset to {targetCurrency}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
