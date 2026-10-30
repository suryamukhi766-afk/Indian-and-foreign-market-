import { AcademyLesson } from '../types/trading';

export const ACADEMY_LESSONS: AcademyLesson[] = [
  {
    id: 'lesson-1',
    level: 1,
    levelName: 'Level 1: Market Fundamentals',
    title: 'Introduction to Financial Markets & How Trading Works',
    durationMinutes: 18,
    youtubeId: 'b-bB6qV5hY0', // Quality educational stock market foundation
    summary: 'Master the core mechanics of stock exchanges, bid-ask spreads, order books, and market participants.',
    content: `Financial markets exist to facilitate the exchange of capital between buyers and sellers. Whether trading on the National Stock Exchange (NSE) in India or NASDAQ/NYSE in the United States, price discovery operates via an auction mechanism.

### Key Concepts:
1. **The Order Book:** Buyers place bids (highest price they are willing to pay) and sellers place asks (lowest price they will accept). The difference between the highest bid and lowest ask is the **Bid-Ask Spread**.
2. **Market vs. Limit Orders:**
   - **Market Order:** Guarantees instant execution at the best available current market price. Use when speed of entry is prioritized over exact price.
   - **Limit Order:** Guarantees execution only at your specified price or better. Use when entering near precise support levels or avoiding slippage.
3. **Volume and Liquidity:** Liquidity refers to how easily an asset can be converted into cash without drastically moving its market price. Highly liquid stocks (like Reliance, Apple, TCS, NVIDIA) exhibit tight spreads and low slippage.`,
    keyTakeaways: [
      'Bid is what buyers pay; Ask is what sellers demand.',
      'Slippage occurs during volatile fast markets when using market orders.',
      'Never trade illiquid stocks without observing order book depth.',
    ],
    quiz: [
      {
        id: 'q1-1',
        question: 'What is the primary difference between a Market Order and a Limit Order?',
        options: [
          'Market order guarantees price; Limit order guarantees speed',
          'Market order guarantees execution speed; Limit order guarantees execution price',
          'Market orders can only be placed after market hours',
          'Limit orders never incur brokerage fees'
        ],
        correctIndex: 1,
        explanation: 'Market orders execute immediately at whatever price is available, whereas limit orders only execute at your target price or better.'
      },
      {
        id: 'q1-2',
        question: 'What does a narrow Bid-Ask spread generally signify?',
        options: [
          'High stock illiquidity',
          'High liquidity and active trading volume',
          'The stock is under circuit filter limit',
          'Brokerage commission is waived'
        ],
        correctIndex: 1,
        explanation: 'A narrow spread indicates heavy liquidity and many buyers and sellers competing closely on price.'
      }
    ]
  },
  {
    id: 'lesson-2',
    level: 2,
    levelName: 'Level 2: Candlestick Anatomy',
    title: 'Mastering Candlestick Charts & Price Action Footprints',
    durationMinutes: 24,
    youtubeId: 'C3tKffo7Z-s', // Candlestick patterns masterclass
    summary: 'Decode open, high, low, close (OHLC) dynamics, wicks, and top single & dual candlestick reversal patterns.',
    content: `Japanese candlesticks were developed in the 18th century by rice merchant Munehisa Homma to visually map trader psychology.

### Anatomy of a Candle:
- **Body:** Distance between Open and Close. Green/White indicates buyers drove price up (Close > Open). Red/Black indicates sellers prevailed (Close < Open).
- **Upper Wick / Shadow:** Highest price reached during that time period before rejection.
- **Lower Wick / Shadow:** Lowest price reached before buyers stepped in.

### High-Probability Candlestick Patterns:
1. **Hammer (Bullish):** Long lower shadow (at least 2x body height), minimal upper shadow, appearing at the base of a downtrend. Indicates aggressive buyer defense.
2. **Shooting Star (Bearish):** Long upper shadow with close near the lows after an uptrend. Indicates exhaustion of buying pressure.
3. **Bullish & Bearish Engulfing:** A larger candle completely covers the range of the preceding counter-trend candle, showing a decisive momentum shift.
4. **Doji:** Open and Close are virtually identical. Indicates pure market equilibrium and pending breakout.`,
    keyTakeaways: [
      'Wicks show price rejection; bodies show conviction.',
      'A candlestick pattern is only valid when confirmed by key support/resistance levels.',
      'Context always trumps individual candle shapes.',
    ],
    quiz: [
      {
        id: 'q2-1',
        question: 'What psychological message is conveyed by a Hammer candle with a long lower shadow at support?',
        options: [
          'Sellers have total control of the market',
          'Sellers pushed price lower, but buyers aggressively bought the dip and defended the level',
          'Trading volume is reaching zero',
          'Market is halting for trading halt circuit'
        ],
        correctIndex: 1,
        explanation: 'The long lower shadow proves that aggressive demand absorbed all selling pressure and pushed price back up towards the open.'
      }
    ]
  },
  {
    id: 'lesson-3',
    level: 3,
    levelName: 'Level 3: Support & Resistance',
    title: 'Horizontal Levels, Supply/Demand Zones & Polarity Principle',
    durationMinutes: 28,
    youtubeId: 'eGA4R9qXoY8', // Support and resistance strategy
    summary: 'Identify institutional price pivot zones, the role-reversal principle, and how to avoid fake breakouts.',
    content: `Support and Resistance (S/R) levels are the bedrock of technical analysis. They represent institutional supply and demand battlegrounds.

### What is Support?
A price floor where buying interest is strong enough to overcome selling pressure. When price approaches support, buyers enter and sellers hesitate.

### What is Resistance?
A price ceiling where selling pressure overpowers buying appetite, halting further advances.

### The Principle of Role Reversal (Polarity):
Once a major resistance level is cleanly broken on high volume, it flips to become **new support**. Conversely, broken support transforms into tough overhead resistance on subsequent retests.

### Spotting True Breakouts vs Bull Traps:
- **True Breakout:** Strong candle close beyond the level accompanied by surging volume.
- **Bull Trap / Liquidity Grab:** Price briefly pierces resistance to trigger retail stop-orders, then rapidly slams back inside the range with long upper wick.`,
    keyTakeaways: [
      'Think in zones, not razor-thin single price lines.',
      'The more times a level is tested, the weaker it gets because resting limit orders get filled.',
      'Wait for a candle close confirmation and retest before aggressive entry.',
    ],
    quiz: [
      {
        id: 'q3-1',
        question: 'According to the Polarity Principle, what happens when a strong resistance level is decisively broken?',
        options: [
          'It becomes irrelevant',
          'It flips into a potential new support level',
          'It guarantees a 50% price crash',
          'It locks trading for the remainder of the session'
        ],
        correctIndex: 1,
        explanation: 'Broken resistance becomes support because traders who missed the breakout or shorted it look to buy on any pullback to breakeven.'
      }
    ]
  },
  {
    id: 'lesson-4',
    level: 4,
    levelName: 'Level 4: Trendlines & Chart Formations',
    title: 'Trend Structures, Channels, Head & Shoulders and Triangles',
    durationMinutes: 26,
    youtubeId: 'qWnOD8yC-6c', // Trend analysis and classical chart patterns
    summary: 'Analyze market market structure (Higher Highs / Higher Lows), ascending triangles, double bottoms, and breakout mechanics.',
    content: `Charles Dow established that markets move in recognizable trends:
- **Uptrend (Bull Market):** Series of Higher Highs (HH) and Higher Lows (HL).
- **Downtrend (Bear Market):** Series of Lower Highs (LH) and Lower Lows (LL).
- **Sideways / Consolidation:** Range-bound oscillation between bounds.

### Classical Continuation & Reversal Patterns:
1. **Double Bottom (W Pattern):** Bullish reversal pattern where price tests a floor twice, fails to break, and bursts above the neckline.
2. **Head and Shoulders:** Bearish distribution formation signaling the climax of a bull run.
3. **Ascending Triangle:** Flat horizontal resistance paired with rising higher lows, reflecting persistent buyer pressure pressing against a ceiling until a massive upside eruption.`,
    keyTakeaways: [
      'Always trade in the direction of the dominant higher-timeframe trend.',
      'Trendlines require at least 3 distinct touches to be considered confirmed.',
      'Measure target using the height of the pattern projected from the breakout point.',
    ],
    quiz: [
      {
        id: 'q4-1',
        question: 'Which of the following defines an uptrend in market structure?',
        options: [
          'Consecutive Lower Lows and Lower Highs',
          'Consecutive Higher Highs and Higher Lows',
          'Flat price with zero volume',
          'Alternating red and green candles indefinitely'
        ],
        correctIndex: 1,
        explanation: 'An uptrend is structurally defined by higher highs and higher lows, confirming that buyers are willing to purchase at increasingly higher price points.'
      }
    ]
  },
  {
    id: 'lesson-5',
    level: 5,
    levelName: 'Level 5: Technical Indicators',
    title: 'Moving Averages (EMA 20, 50, 200), RSI & MACD Momentum',
    durationMinutes: 32,
    youtubeId: '702U3mG19wM', // RSI and Moving Averages trading guide
    summary: 'Combine trend filters (200 SMA), dynamic trailing support (20 EMA), overbought/oversold oscillators (RSI), and MACD divergences.',
    content: `Indicators should never be used in isolation; they are mathematical derivatives of price. When aligned with market structure, they provide powerful confluence.

### 1. Moving Averages:
- **200 SMA (Simple Moving Average):** Institutional baseline for the long-term trend. When price is above 200 SMA, look primarily for long setups.
- **20 & 50 EMA (Exponential Moving Average):** Weighs recent price action heavily. The 20 EMA serves as dynamic pull-back support in strong trends.
- **Golden Cross:** 50 MA crossing above 200 MA (macro bullish). **Death Cross:** 50 MA crossing below 200 MA (macro bearish).

### 2. RSI (Relative Strength Index - 14):
- Oscillates between 0 and 100.
- Values above 70 indicate overbought conditions; below 30 indicate oversold.
- **RSI Bullish Divergence:** Price prints a lower low while RSI forms a higher low—alerting that seller momentum is dying before the bounce occurs.

### 3. MACD (Moving Average Convergence Divergence):
- Tracks the difference between 12 EMA and 26 EMA smoothed by a 9-period signal line.
- Signal crossovers confirm shifts in short-term acceleration.`,
    keyTakeaways: [
      'Indicators do not predict the future; they filter noise and confirm momentum.',
      'Divergences between price and RSI are far more potent than raw overbought/oversold levels.',
      'Avoid indicator clutter: 2 well-understood tools beat 10 overlapping ones.',
    ],
    quiz: [
      {
        id: 'q5-1',
        question: 'What does a Bullish RSI Divergence indicate?',
        options: [
          'Price is making new highs and RSI is at 99',
          'Price forms a lower low, but RSI forms a higher low, showing fading downside momentum',
          'The stock must be shorted immediately',
          'The moving average has stopped computing'
        ],
        correctIndex: 1,
        explanation: 'A bullish divergence occurs when price makes a lower low while the momentum oscillator forms a higher low, signaling imminent exhaustion of sellers.'
      }
    ]
  },
  {
    id: 'lesson-6',
    level: 6,
    levelName: 'Level 6: Volume & Order Flow',
    title: 'Volume Spread Analysis (VSA) & Institutional Clues',
    durationMinutes: 22,
    youtubeId: 'F3QpgXUr-KE', // Volume analysis guide
    summary: 'Learn how large institutions accumulate and distribute shares using volume footprint, climactic volume, and absorption.',
    content: `Price is the headline; Volume is the truth. Volume represents the fuel behind every market move.

### Principles of Volume Analysis:
1. **Effort vs. Result:** If a candle has massive volume (effort) but a tiny narrow spread body (result), institutional absorption is happening. Someone is capping or absorbing the liquidity.
2. **Volume Climax:** An explosive vertical price spike accompanied by the highest volume of the month usually marks the termination of a move, not the beginning of one.
3. **Low-Volume Pullback:** When an uptrending stock pulls back towards a support zone on shrinking volume, it proves institutional players are not selling. This is the prime entry spot for swing traders.`,
    keyTakeaways: [
      'Breakouts without heavy volume are prone to fast failure.',
      'Volume dry-ups on pullbacks validate trend continuation.',
      'Ultra-high volume after extended rallies indicates distribution.',
    ],
    quiz: [
      {
        id: 'q6-1',
        question: 'A stock breaks out to new all-time highs on extremely low volume. What is the highest probability outcome?',
        options: [
          'Instant 100% rally',
          'A high-risk false breakout (Bull Trap) due to lack of institutional sponsorship',
          'Trading will be paused permanently',
          'Dividends will double'
        ],
        correctIndex: 1,
        explanation: 'Without institutional volume backing the breakout, the move lacks sustainable fuel and often quickly collapses back into the prior range.'
      }
    ]
  },
  {
    id: 'lesson-7',
    level: 7,
    levelName: 'Level 7: Professional Risk Management',
    title: 'Capital Preservation, Position Sizing & 1:2 R:R Rule',
    durationMinutes: 30,
    youtubeId: 'b-bB6qV5hY0', // Risk management and capital preservation
    summary: 'Master the mathematical formula for survival in markets: 1% risk rule, stop-loss placement, and expectancy calculations.',
    content: `Amateurs focus on how much money they can make. Professionals focus strictly on how much they stand to lose.

### The 1% Rule:
Never risk more than **1% to 2%** of your total portfolio on any single trade idea. If you have ₹1,00,000, your maximum loss on a trade should be capped at ₹1,000 to ₹2,000.

### Calculating Position Size:
\`\`\`
Position Size (Quantity) = (Account Capital × Risk %) / (Entry Price - Stop Loss Price)
\`\`\`
Example:
- Capital = ₹1,00,000
- Risk per trade = 1% = ₹1,000
- Stock Entry = ₹2,000
- Stop Loss = ₹1,950 (Risk per share = ₹50)
- **Max Quantity to buy = ₹1,000 / ₹50 = 20 shares.**

### The 1:2 Risk-to-Reward (R:R) Minimum:
If your risk is ₹50 per share, your profit target must be at least ₹100 per share. With a 1:2 R:R, you can be wrong on 60% of your trades and still generate healthy positive net profit!`,
    keyTakeaways: [
      'Stop losses must be determined BEFORE placing the order, never adjusted mid-trade.',
      'Position size varies with volatility: wider stop loss means smaller share quantity.',
      'A trader who loses 50% needs a 100% gain just to return to even.',
    ],
    quiz: [
      {
        id: 'q7-1',
        question: 'If your account is ₹1,00,000 and you adhere to a 1% risk limit with a ₹20 stop loss per share, how many shares can you buy?',
        options: [
          '100 shares',
          '50 shares',
          '1,000 shares',
          '200 shares'
        ],
        correctIndex: 1,
        explanation: '1% of ₹1,00,000 is ₹1,000 risk capital. ₹1,000 divided by ₹20 risk per share equals exactly 50 shares.'
      }
    ]
  },
  {
    id: 'lesson-8',
    level: 8,
    levelName: 'Level 8: Trading Psychology & Discipline',
    title: 'Conquering FOMO, Revenge Trading & Trader Mindset',
    durationMinutes: 25,
    youtubeId: 'C3tKffo7Z-s', // Trading psychology masterclass
    summary: 'Eliminate emotional cognitive biases, cope with drawdowns, and build an ironclad daily trading routine.',
    content: `The market is a mirror that exposes every human emotional weakness: fear, greed, hope, and ego. Mark Douglas in *Trading in the Zone* emphasizes that trading is 80% psychology.

### Toxic Psychological Traps:
1. **FOMO (Fear of Missing Out):** Jumping into a parabolic green candle after the move has already extended, guaranteeing you buy the top right before the pullback.
2. **Revenge Trading:** Immediately doubling position size after a loss to win back lost money, spiraling into account blowouts.
3. **Holding Losers in Hope:** Refusing to take a small planned stop loss because "it will come back", turning a 1% loss into a 30% catastrophic loss.

### The Professional Playbook:
- View every trade as just one probabilistic sample in a series of 1,000 trades.
- Walk away from screens after 2 consecutive stop-outs in a day.
- Maintain a structured Trading Journal to review emotional triggers.`,
    keyTakeaways: [
      'Losing trades are the standard operational cost of doing business in financial markets.',
      'Never trade when angry, exhausted, or desperate to make money.',
      'Process execution matters far more than short-term outcome.',
    ],
    quiz: [
      {
        id: 'q8-1',
        question: 'What is revenge trading?',
        options: [
          'Trading against an institution that shorted your stock',
          'Emotionally placing hasty, oversized trades immediately after a loss to force profits back',
          'Taking legal action against your brokerage firm',
          'Switching between Indian and US markets'
        ],
        correctIndex: 1,
        explanation: 'Revenge trading is an emotional response to taking a loss where discipline is abandoned in a reckless attempt to recoup capital quickly.'
      }
    ]
  },
  {
    id: 'lesson-9',
    level: 9,
    levelName: 'Level 9: Price Action & Liquidity Pools',
    title: 'Fair Value Gaps (FVG), Order Blocks & Market Structure Shifts',
    durationMinutes: 35,
    youtubeId: 'eGA4R9qXoY8', // Smart money concepts & price action
    summary: 'Understand modern Smart Money Concepts (SMC): Liquidity sweeps, Order Blocks, and premium vs discount valuation.',
    content: `Modern markets are dominated by algorithmic execution and high-frequency trading (HFT). To trade alongside institutional orderflow, traders study liquidity sweeps and institutional footprints.

### Key Concepts:
- **Liquidity Sweep (Stop Hunt):** Algorithms push price slightly above obvious swing highs or below swing lows to trigger clustered stop orders before reversing aggressively in the intended direction.
- **Fair Value Gap (FVG):** An aggressive 3-candle imbalance where candle 1 high and candle 3 low do not overlap, leaving unfilled orders that price frequently re-visits.
- **Market Structure Shift (MSS):** The first decisive candle close breaking the swing high/low that led to the recent extreme.`,
    keyTakeaways: [
      'Obvious retail stop-loss clusters are targets for algorithmic liquidity sweeps.',
      'Enter trades after the sweep has completed and structure shifts.',
      'Fair value gaps act as high-probability entry magnets.',
    ],
    quiz: [
      {
        id: 'q9-1',
        question: 'What is a liquidity sweep in price action trading?',
        options: [
          'When an exchange clears all order histories at midnight',
          'When price momentarily breaches a key high or low to trigger retail stop orders before reversing',
          'When a stock pays out all its retained earnings as cash',
          'When volume drops to 0 during market holidays'
        ],
        correctIndex: 1,
        explanation: 'A liquidity sweep is an engineered price movement that taps into the liquidity pools (stop-loss orders) resting beyond swing points before reversing.'
      }
    ]
  },
  {
    id: 'lesson-10',
    level: 10,
    levelName: 'Level 10: Institutional Execution & Plan',
    title: 'Building a Complete Trading Business & Performance Auditing',
    durationMinutes: 40,
    youtubeId: 'qWnOD8yC-6c', // Professional trading business blueprint
    summary: 'Integrate pre-market prep, trade checklists, risk parameters, and mathematical expectancy into a lifelong career.',
    content: `Trading is not a game of predictions; it is an odds-based business of risk management. Congratulations on reaching Level 10 of SONI ACADEMY!

### The Complete 5-Step Execution Routine:
1. **Macro & Sector Alignment:** Is the broader index (Nifty 50 or S&P 500) supporting your directional bias?
2. **Setup Identification:** Does the chart display high-timeframe trend confluence + key level + rejection trigger?
3. **Risk Calculations:** Compute position size based strictly on your 1% account risk rule.
4. **Order Execution:** Set Limit order with predefined Stop Loss and Target orders simultaneously.
5. **Post-Trade Journaling:** Log the screenshot, the emotional state, whether rules were followed, and calculate your rolling Profit Factor and Win Rate.`,
    keyTakeaways: [
      'A trading plan removes emotion from execution.',
      'Consistency comes from executing identical high-expectancy setups repeatedly.',
      'Protect your capital above all else; opportunities in financial markets are infinite.',
    ],
    quiz: [
      {
        id: 'q10-1',
        question: 'What is the most crucial attribute of a consistently profitable professional trader?',
        options: [
          'Predicting exact market tops and bottoms 100% of the time',
          'Strict risk management, disciplined execution of an edge, and capital preservation',
          'Using 20 different technical indicators at once',
          'Trading only during news announcements'
        ],
        correctIndex: 1,
        explanation: 'Long-term profitability is driven by discipline, risk management, and mathematical expectancy, not magical prediction.'
      }
    ]
  }
];
