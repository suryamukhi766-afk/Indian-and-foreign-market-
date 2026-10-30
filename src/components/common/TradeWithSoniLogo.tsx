import React from 'react';

interface TradeWithSoniLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const TradeWithSoniLogo: React.FC<TradeWithSoniLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  const sizeClasses = {
    sm: 'h-9',
    md: 'h-11',
    lg: 'h-14',
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Primary SVG Logo Crest with integrated "TRADE WITH SONI" */}
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizeClasses} w-auto aspect-square drop-shadow-[0_4px_12px_rgba(16,185,129,0.3)] transition-transform duration-300 group-hover:scale-105`}
        aria-label="TRADE WITH SONI Official Logo"
      >
        <defs>
          {/* Neon & Metallic Gradients */}
          <linearGradient id="twsBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#065F46" />
          </linearGradient>

          <linearGradient id="twsBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="60%" stopColor="#090D16" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <linearGradient id="twsCandleGreen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          <linearGradient id="twsCandleRed" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>

          <filter id="twsGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Text path for curved text around the top edge */}
          <path
            id="twsTopArc"
            d="M 28 80 A 52 52 0 0 1 132 80"
            fill="none"
          />
        </defs>

        {/* Outer Hexagonal Shield Ring */}
        <polygon
          points="80,8 144,38 144,122 80,152 16,122 16,38"
          fill="url(#twsBgGrad)"
          stroke="url(#twsBorderGrad)"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Inner subtle glow line */}
        <polygon
          points="80,16 136,43 136,117 80,144 24,117 24,43"
          fill="none"
          stroke="#10B981"
          strokeWidth="1"
          strokeOpacity="0.3"
          strokeLinejoin="round"
        />

        {/* Candlestick Charts in Background */}
        <g opacity="0.85">
          {/* Bearish candle */}
          <line x1="50" y1="48" x2="50" y2="76" stroke="#EF4444" strokeWidth="1.5" />
          <rect x="46" y="54" width="8" height="15" rx="1.5" fill="url(#twsCandleRed)" />

          {/* Bullish breakout candle 1 */}
          <line x1="68" y1="42" x2="68" y2="78" stroke="#10B981" strokeWidth="1.5" />
          <rect x="64" y="47" width="8" height="22" rx="1.5" fill="url(#twsCandleGreen)" />

          {/* Institutional Big Green Candle */}
          <line x1="88" y1="32" x2="88" y2="76" stroke="#34D399" strokeWidth="1.5" />
          <rect x="84" y="38" width="8" height="30" rx="1.5" fill="url(#twsCandleGreen)" />

          {/* Breakout Candle 3 */}
          <line x1="108" y1="28" x2="108" y2="68" stroke="#34D399" strokeWidth="1.5" />
          <rect x="104" y="32" width="8" height="26" rx="1.5" fill="url(#twsCandleGreen)" />
        </g>

        {/* Rising Trendline with Glow */}
        <path
          d="M 38 74 Q 68 70 82 50 T 120 32"
          fill="none"
          stroke="#10B981"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#twsGlow)"
        />
        {/* Breakout Arrow Head */}
        <polygon points="120,32 112,34 116,42" fill="#34D399" />

        {/* Integrated Brand Name Banner Bar in Middle/Lower Crest */}
        <rect
          x="22"
          y="86"
          width="116"
          height="46"
          rx="6"
          fill="#0B1322"
          stroke="url(#twsBorderGrad)"
          strokeWidth="1.5"
        />

        {/* Written inside logo: "TRADE WITH" */}
        <text
          x="80"
          y="102"
          fill="#94A3B8"
          fontSize="9"
          fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
          fontWeight="800"
          letterSpacing="2.5"
          textAnchor="middle"
        >
          TRADE WITH
        </text>

        {/* Written inside logo: "SONI" */}
        <text
          x="80"
          y="124"
          fill="#10B981"
          fontSize="18"
          fontFamily="'JetBrains Mono', monospace"
          fontWeight="900"
          letterSpacing="3"
          textAnchor="middle"
        >
          SONI
        </text>

        {/* Base Foundation Dot / Accent */}
        <circle cx="80" cy="140" r="2.5" fill="#34D399" />
      </svg>

      {/* Accompanying Wordmark and Subtitle */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-extrabold text-base md:text-lg tracking-wider text-white">
            TRADE WITH <span className="text-emerald-400">SONI</span>
          </span>
          <span className="hidden sm:inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono">
            PRO
          </span>
        </div>

        {showSubtitle && (
          <span className="text-[10px] text-slate-400 tracking-widest uppercase font-semibold mt-1">
            Trading Terminal &amp; Academy
          </span>
        )}
      </div>
    </div>
  );
};
