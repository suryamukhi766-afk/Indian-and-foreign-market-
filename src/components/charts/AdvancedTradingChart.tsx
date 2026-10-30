import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickSeries,
  LineSeries,
  HistogramSeries,
  CandlestickData,
  LineData,
  HistogramData,
  ColorType,
  Time,
} from 'lightweight-charts';
import { StockQuote } from '../../types/trading';
import { generateCandlesticks, ChartTimeframe } from '../../data/mockStocks';
import { calculateEMA, calculateSMA, calculateRSI, formatCurrency } from '../../utils/tradingMath';
import {
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Activity,
  Layers,
  TrendingUp,
  Info,
} from 'lucide-react';

interface AdvancedTradingChartProps {
  stock: StockQuote;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onQuickOrder?: (side: 'BUY' | 'SELL') => void;
}

export const AdvancedTradingChart: React.FC<AdvancedTradingChartProps> = ({
  stock,
  isFullscreen = false,
  onToggleFullscreen,
  onQuickOrder,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartApiRef = useRef<IChartApi | null>(null);

  // Series refs
  const mainSeriesRef = useRef<ISeriesApi<'Candlestick'> | ISeriesApi<'Line'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const ema20SeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const sma50SeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const sma200SeriesRef = useRef<ISeriesApi<'Line'> | null>(null);

  const [timeframe, setTimeframe] = useState<ChartTimeframe>('15m');
  const [chartType, setChartType] = useState<'candles' | 'line'>('candles');

  // Indicators toggle
  const [showEMA20, setShowEMA20] = useState<boolean>(true);
  const [showSMA50, setShowSMA50] = useState<boolean>(true);
  const [showSMA200, setShowSMA200] = useState<boolean>(false);
  const [showVolume, setShowVolume] = useState<boolean>(true);
  const [showRSI, setShowRSI] = useState<boolean>(false);
  const [showIndicatorsMenu, setShowIndicatorsMenu] = useState<boolean>(false);

  // Hover data display
  const [hoverData, setHoverData] = useState<{
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
    change: number;
    changePercent: number;
  } | null>(null);

  // Generate historical data based on stock and timeframe
  const candles = useMemo(() => {
    return generateCandlesticks(stock.symbol, stock.currentPrice, timeframe, 100);
  }, [stock.symbol, timeframe, stock.currentPrice]);

  // Derived indicator data
  const closes = useMemo(() => candles.map((c) => c.close), [candles]);
  const ema20Values = useMemo(() => calculateEMA(closes, 20), [closes]);
  const sma50Values = useMemo(() => calculateSMA(closes, 50), [closes]);
  const sma200Values = useMemo(() => calculateSMA(closes, 200), [closes]);
  const rsiValues = useMemo(() => calculateRSI(closes, 14), [closes]);

  const latestRSI = useMemo(() => {
    for (let i = rsiValues.length - 1; i >= 0; i--) {
      if (rsiValues[i] !== null) return Number(rsiValues[i]?.toFixed(1));
    }
    return 54.2;
  }, [rsiValues]);

  // Initialize and update chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Clean up previous chart instance
    if (chartApiRef.current) {
      chartApiRef.current.remove();
      chartApiRef.current = null;
    }

    const container = chartContainerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 460;

    const chart = createChart(container, {
      width,
      height,
      layout: {
        background: { type: ColorType.Solid, color: '#0d131f' },
        textColor: '#94a3b8',
        fontSize: 12,
        fontFamily: "'JetBrains Mono', monospace",
      },
      grid: {
        vertLines: { color: 'rgba(30, 41, 59, 0.6)', style: 1 },
        horzLines: { color: 'rgba(30, 41, 59, 0.6)', style: 1 },
      },
      crosshair: {
        mode: 0,
        vertLine: {
          color: '#38bdf8',
          width: 1,
          style: 3,
          labelBackgroundColor: '#0369a1',
        },
        horzLine: {
          color: '#38bdf8',
          width: 1,
          style: 3,
          labelBackgroundColor: '#0369a1',
        },
      },
      timeScale: {
        borderColor: '#1e293b',
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: '#1e293b',
        scaleMargins: {
          top: 0.1,
          bottom: showVolume ? 0.22 : 0.1,
        },
      },
    });

    chartApiRef.current = chart;

    // Create Main Series (Candles or Line)
    if (chartType === 'candles') {
      const candlestickSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#10b981',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#10b981',
        wickDownColor: '#ef4444',
      });

      const formattedCandles: CandlestickData<Time>[] = candles.map((c) => ({
        time: c.time as Time,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      }));
      candlestickSeries.setData(formattedCandles);
      mainSeriesRef.current = candlestickSeries;
    } else {
      const lineSeries = chart.addSeries(LineSeries, {
        color: '#10b981',
        lineWidth: 2,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 4,
      });

      const formattedLine: LineData<Time>[] = candles.map((c) => ({
        time: c.time as Time,
        value: c.close,
      }));
      lineSeries.setData(formattedLine);
      mainSeriesRef.current = lineSeries;
    }

    // Volume Series
    if (showVolume) {
      const volumeSeries = chart.addSeries(HistogramSeries, {
        color: '#26a69a',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '',
      });

      volumeSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.82,
          bottom: 0,
        },
      });

      const volumeData: HistogramData<Time>[] = candles.map((c) => ({
        time: c.time as Time,
        value: c.volume || 10000,
        color: c.close >= c.open ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)',
      }));
      volumeSeries.setData(volumeData);
      volumeSeriesRef.current = volumeSeries;
    }

    // Technical Indicator: EMA 20 (Gold)
    if (showEMA20) {
      const emaSeries = chart.addSeries(LineSeries, {
        color: '#f59e0b',
        lineWidth: 1,
        title: 'EMA 20',
        priceLineVisible: false,
      });
      const emaData: LineData<Time>[] = [];
      candles.forEach((c, i) => {
        const val = ema20Values[i];
        if (val !== null) {
          emaData.push({ time: c.time as Time, value: Number(val.toFixed(2)) });
        }
      });
      emaSeries.setData(emaData);
      ema20SeriesRef.current = emaSeries;
    }

    // Technical Indicator: SMA 50 (Cyan)
    if (showSMA50) {
      const sma50Series = chart.addSeries(LineSeries, {
        color: '#06b6d4',
        lineWidth: 1,
        title: 'SMA 50',
        priceLineVisible: false,
      });
      const smaData: LineData<Time>[] = [];
      candles.forEach((c, i) => {
        const val = sma50Values[i];
        if (val !== null) {
          smaData.push({ time: c.time as Time, value: Number(val.toFixed(2)) });
        }
      });
      sma50Series.setData(smaData);
      sma50SeriesRef.current = sma50Series;
    }

    // Technical Indicator: SMA 200 (Purple)
    if (showSMA200) {
      const sma200Series = chart.addSeries(LineSeries, {
        color: '#a855f7',
        lineWidth: 1,
        title: 'SMA 200',
        priceLineVisible: false,
      });
      const smaData: LineData<Time>[] = [];
      candles.forEach((c, i) => {
        const val = sma200Values[i];
        if (val !== null) {
          smaData.push({ time: c.time as Time, value: Number(val.toFixed(2)) });
        }
      });
      sma200Series.setData(smaData);
      sma200SeriesRef.current = sma200Series;
    }

    // Subscribe to crosshair move for OHLC inspection
    chart.subscribeCrosshairMove((param) => {
      if (!param || !param.time || !param.seriesData) {
        setHoverData(null);
        return;
      }

      if (mainSeriesRef.current) {
        const price = param.seriesData.get(mainSeriesRef.current) as CandlestickData<Time> | LineData<Time> | undefined;
        if (price) {
          const isCandle = 'open' in price;
          const open = isCandle ? (price as CandlestickData<Time>).open : price.value;
          const high = isCandle ? (price as CandlestickData<Time>).high : price.value;
          const low = isCandle ? (price as CandlestickData<Time>).low : price.value;
          const close = isCandle ? (price as CandlestickData<Time>).close : price.value;
          const change = close - open;
          const changePercent = open > 0 ? (change / open) * 100 : 0;

          const dateStr = typeof param.time === 'number'
            ? new Date(param.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : String(param.time);

          setHoverData({
            time: dateStr,
            open,
            high,
            low,
            close,
            change,
            changePercent,
          });
        }
      }
    });

    // Fit content smoothly
    chart.timeScale().fitContent();

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0 || !chartApiRef.current) return;
      const { width: newWidth, height: newHeight } = entries[0].contentRect;
      chartApiRef.current.applyOptions({
        width: Math.max(300, newWidth),
        height: Math.max(250, newHeight),
      });
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (chartApiRef.current) {
        chartApiRef.current.remove();
        chartApiRef.current = null;
      }
    };
  }, [
    candles,
    chartType,
    showVolume,
    showEMA20,
    showSMA50,
    showSMA200,
    ema20Values,
    sma50Values,
    sma200Values,
  ]);

  // Zoom controls
  const handleZoomIn = () => {
    if (!chartApiRef.current) return;
    const timeScale = chartApiRef.current.timeScale();
    const visibleRange = timeScale.getVisibleLogicalRange();
    if (visibleRange) {
      const span = visibleRange.to - visibleRange.from;
      const delta = span * 0.2;
      timeScale.setVisibleLogicalRange({
        from: visibleRange.from + delta,
        to: visibleRange.to - delta,
      });
    }
  };

  const handleZoomOut = () => {
    if (!chartApiRef.current) return;
    const timeScale = chartApiRef.current.timeScale();
    const visibleRange = timeScale.getVisibleLogicalRange();
    if (visibleRange) {
      const span = visibleRange.to - visibleRange.from;
      const delta = span * 0.2;
      timeScale.setVisibleLogicalRange({
        from: visibleRange.from - delta,
        to: visibleRange.to + delta,
      });
    }
  };

  const handleResetZoom = () => {
    if (chartApiRef.current) {
      chartApiRef.current.timeScale().fitContent();
    }
  };

  const isUp = stock.change >= 0;

  return (
    <div
      className={`relative flex flex-col bg-[#0b0f17] border border-[#1e293b] rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' : 'w-full h-full min-h-[520px]'
      }`}
    >
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-[#0f172a]/90 border-b border-[#1e293b] backdrop-blur-md gap-2">
        {/* Stock Title & Live Quote */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-white font-mono">{stock.symbol}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
              {stock.exchange}
            </span>
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
            <span className="font-mono text-base font-bold text-white">
              {formatCurrency(stock.currentPrice, stock.currency)}
            </span>
            <span
              className={`text-xs font-semibold font-mono flex items-center px-1.5 py-0.5 rounded ${
                isUp ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
              }`}
            >
              {isUp ? '+' : ''}
              {stock.change.toFixed(2)} ({isUp ? '+' : ''}
              {stock.changePercent.toFixed(2)}%)
            </span>
          </div>

          {/* Educational Disclaimer Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[11px] text-amber-300 font-medium">
            <Info className="w-3 h-3 shrink-0" />
            <span>Simulated Educational Feed (Tick: Real-Time Algorithmic)</span>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Timeframe Selector */}
          <div className="flex items-center bg-[#131d2e] rounded-lg p-0.5 border border-[#1e293b]">
            {(['1m', '5m', '15m', '1h', '4h', '1D', '1W'] as ChartTimeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 text-xs font-mono font-medium rounded transition-colors ${
                  timeframe === tf
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                aria-label={`Select ${tf} timeframe`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Type Toggle */}
          <div className="flex items-center bg-[#131d2e] rounded-lg p-0.5 border border-[#1e293b]">
            <button
              onClick={() => setChartType('candles')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                chartType === 'candles'
                  ? 'bg-slate-700 text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
              aria-label="Candlestick Chart"
            >
              Candles
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                chartType === 'line'
                  ? 'bg-slate-700 text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
              aria-label="Line Chart"
            >
              Line
            </button>
          </div>

          {/* Indicators Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowIndicatorsMenu((v) => !v)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
                showIndicatorsMenu
                  ? 'bg-slate-700 text-white border-slate-600'
                  : 'bg-[#131d2e] text-slate-300 border-[#1e293b] hover:bg-slate-800'
              }`}
              aria-label="Toggle Technical Indicators Menu"
              aria-expanded={showIndicatorsMenu}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Indicators</span>
            </button>

            {showIndicatorsMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-[#0f172a] border border-[#1e293b] rounded-xl shadow-2xl p-2.5 z-50 flex flex-col gap-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
                  Technical Overlays
                </div>
                <label className="flex items-center justify-between text-xs text-slate-200 px-2 py-1.5 hover:bg-slate-800 rounded cursor-pointer">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    EMA 20 (Trend Momentum)
                  </span>
                  <input
                    type="checkbox"
                    checked={showEMA20}
                    onChange={(e) => setShowEMA20(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-slate-200 px-2 py-1.5 hover:bg-slate-800 rounded cursor-pointer">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                    SMA 50 (Intermediate)
                  </span>
                  <input
                    type="checkbox"
                    checked={showSMA50}
                    onChange={(e) => setShowSMA50(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-slate-200 px-2 py-1.5 hover:bg-slate-800 rounded cursor-pointer">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                    SMA 200 (Long-Term Baseline)
                  </span>
                  <input
                    type="checkbox"
                    checked={showSMA200}
                    onChange={(e) => setShowSMA200(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-slate-200 px-2 py-1.5 hover:bg-slate-800 rounded cursor-pointer">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    Volume Sub-Bars
                  </span>
                  <input
                    type="checkbox"
                    checked={showVolume}
                    onChange={(e) => setShowVolume(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-slate-200 px-2 py-1.5 hover:bg-slate-800 rounded cursor-pointer">
                  <span className="flex items-center gap-2">
                    <Activity className="w-3 h-3 text-pink-400" />
                    RSI (14) Oscillator
                  </span>
                  <input
                    type="checkbox"
                    checked={showRSI}
                    onChange={(e) => setShowRSI(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center bg-[#131d2e] rounded-lg border border-[#1e293b]">
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-l"
              aria-label="Zoom in on chart"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Zoom out on chart"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-r"
              aria-label="Reset chart scale"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Buy/Sell Buttons on Chart Header */}
          {onQuickOrder && (
            <div className="flex items-center gap-1.5 pl-1">
              <button
                onClick={() => onQuickOrder('BUY')}
                className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded transition-colors shadow"
              >
                BUY
              </button>
              <button
                onClick={() => onQuickOrder('SELL')}
                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded transition-colors shadow"
              >
                SELL
              </button>
            </div>
          )}

          {/* Fullscreen Button */}
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className="p-1.5 bg-[#131d2e] text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg border border-[#1e293b] transition-colors"
              aria-label={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
              title={isFullscreen ? 'Exit Full Screen' : 'Full Screen Chart'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Floating OHLC crosshair readout bar */}
      <div className="flex flex-wrap items-center gap-4 px-4 py-1.5 bg-[#0b0f17]/95 border-b border-[#1e293b]/60 text-xs font-mono text-slate-400">
        {hoverData ? (
          <>
            <div><span className="text-slate-500">Time:</span> <span className="text-slate-200">{hoverData.time}</span></div>
            <div><span className="text-slate-500">O:</span> <span className="text-slate-200">{hoverData.open.toFixed(2)}</span></div>
            <div><span className="text-slate-500">H:</span> <span className="text-emerald-400">{hoverData.high.toFixed(2)}</span></div>
            <div><span className="text-slate-500">L:</span> <span className="text-rose-400">{hoverData.low.toFixed(2)}</span></div>
            <div><span className="text-slate-500">C:</span> <span className="text-white font-semibold">{hoverData.close.toFixed(2)}</span></div>
            <div className={hoverData.change >= 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
              {hoverData.change >= 0 ? '+' : ''}{hoverData.change.toFixed(2)} ({hoverData.changePercent.toFixed(2)}%)
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4 text-slate-400">
            <span>Hover over candles to inspect precise OHLC bars</span>
            {showEMA20 && <span className="text-amber-400 font-medium">● EMA 20 Active</span>}
            {showSMA50 && <span className="text-cyan-400 font-medium">● SMA 50 Active</span>}
            {showSMA200 && <span className="text-purple-400 font-medium">● SMA 200 Active</span>}
          </div>
        )}
      </div>

      {/* Chart Canvas Container */}
      <div className="relative flex-1 w-full min-h-[360px]" ref={chartContainerRef} />

      {/* Optional RSI Panel Footer */}
      {showRSI && (
        <div className="h-24 bg-[#0a0e17] border-t border-[#1e293b] px-4 py-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-pink-400 font-bold flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> RSI (14): {latestRSI}
            </span>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="text-rose-400">Overbought: 70</span>
              <span className="text-emerald-400">Oversold: 30</span>
            </div>
          </div>

          {/* Visual RSI Gauge Bar */}
          <div className="relative w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            {/* Zones */}
            <div className="absolute inset-y-0 left-0 w-[30%] bg-emerald-500/10 border-r border-emerald-500/30" />
            <div className="absolute inset-y-0 right-0 w-[30%] bg-rose-500/10 border-l border-rose-500/30" />
            {/* Current marker */}
            <div
              className="absolute top-0 bottom-0 w-1.5 bg-pink-400 shadow-[0_0_8px_#f43f5e] transition-all duration-300"
              style={{ left: `${Math.min(100, Math.max(0, latestRSI))}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0 (Extremely Oversold)</span>
            <span>50 (Equilibrium)</span>
            <span>100 (Extremely Overbought)</span>
          </div>
        </div>
      )}
    </div>
  );
};
