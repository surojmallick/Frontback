// backend/scan.js
const { fetchStockData } = require('./yahoo');
const { calculateEMA, calculateATR, calculateVWAP, calculateRVol } = require('./indicators');
const { getMarketStatus } = require('./market');
const { getConfig } = require('./config');

// Representative list of Nifty stocks to avoid immediate rate limits in this demo
const STOCKS = [
  "RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS", "ICICIBANK.NS", 
  "SBIN.NS", "BHARTIARTL.NS", "ITC.NS", "KOTAKBANK.NS", "LICI.NS",
  "LT.NS", "HINDUNILVR.NS", "AXISBANK.NS", "TATAMOTORS.NS", "MARUTI.NS",
  "ULTRACEMCO.NS", "ASIANPAINT.NS", "SUNPHARMA.NS", "TITAN.NS", "BAJFINANCE.NS"
];

const analyzeStock = (symbol, data, config, marketStatus) => {
  const candles = data.candles;
  if (candles.length < 50) return { symbol, signal: 'NO TRADE', reason: 'Insufficient Data' };

  const closePrices = candles.map(c => c.close);
  const volumes = candles.map(c => c.volume);
  const highPrices = candles.map(c => c.high);
  const lowPrices = candles.map(c => c.low);

  // Indicators
  const emaShort = calculateEMA(closePrices, config.emaShort);
  const emaMid = calculateEMA(closePrices, config.emaMid);
  const emaLong = calculateEMA(closePrices, config.emaLong);
  const vwap = calculateVWAP(candles);
  const atr = calculateATR(highPrices, lowPrices, closePrices, config.atrPeriod);
  const rvol = calculateRVol(volumes, 20);

  // Current Candle (Last completed candle)
  const lastIdx = candles.length - 1;
  const prevIdx = candles.length - 2;

  const currentPrice = closePrices[lastIdx];
  const cVWAP = vwap[lastIdx];
  const cRVol = rvol[lastIdx];
  const cATR = atr[lastIdx];
  
  // Logic Variables
  const isScalp = config.mode === 'SCALP';
  const minRVol = isScalp ? config.volMultiplierScalp : config.volMultiplierIntraday;
  const minAtrPct = isScalp ? 0.35 : 0.6;
  const atrPct = (cATR / currentPrice) * 100;

  // 1. Stock Filters
  if (cRVol < minRVol) return { symbol, signal: 'NO TRADE', reason: `Low Volume (RVol: ${cRVol.toFixed(2)})` };
  if (atrPct < minAtrPct) return { symbol, signal: 'NO TRADE', reason: `Low Volatility (ATR%: ${atrPct.toFixed(2)}%)` };
  
  // Sideways Check (20 candle range vs ATR)
  const last20High = Math.max(...highPrices.slice(lastIdx - 20, lastIdx));
  const last20Low = Math.min(...lowPrices.slice(lastIdx - 20, lastIdx));
  const range20 = last20High - last20Low;
  if (range20 < 1.2 * cATR) return { symbol, signal: 'NO TRADE', reason: 'Sideways Stock' };

  // 2. Trend Logic
  const e9 = emaShort[lastIdx];
  const e21 = emaMid[lastIdx];
  const e50 = emaLong[lastIdx];

  const isBuyTrend = e9 > e21 && e21 > e50 && currentPrice > cVWAP;
  const isSellTrend = e9 < e21 && e21 < e50 && currentPrice < cVWAP;

  if (!isBuyTrend && !isSellTrend) return { symbol, signal: 'NO TRADE', reason: 'No Trend' };

  // 3. Entry Logic (Confirmation)
  const candle = candles[lastIdx];
  const candleRange = candle.high - candle.low;
  const bodySize = Math.abs(candle.close - candle.open);
  
  if (config.safety.confirmClose && (bodySize / candleRange) < 0.6) {
    return { symbol, signal: 'NO TRADE', reason: 'Weak Candle Body' };
  }
  
  if (volumes[lastIdx] <= volumes[prevIdx]) {
    return { symbol, signal: 'NO TRADE', reason: 'Volume decreasing' };
  }

  // 4. Trade Setup
  let direction = isBuyTrend ? 'BUY' : 'SELL';
  let entry = isBuyTrend ? candle.high : candle.low; // Break of high/low
  
  // Stop Loss
  // Tighter of Structure (Prev candle Low/High) OR ATR
  let slStructure = isBuyTrend ? candles[lastIdx].low : candles[lastIdx].high;
  let slATR = isBuyTrend 
    ? entry - (cATR * (isScalp ? 0.6 : 1.0)) 
    : entry + (cATR * (isScalp ? 0.6 : 1.0));
  
  let stopLoss = isBuyTrend 
    ? Math.max(slStructure, slATR) // Higher logic for Buy SL
    : Math.min(slStructure, slATR); // Lower logic for Sell SL

  // Target
  const risk = Math.abs(entry - stopLoss);
  const rrRatio = isScalp ? 1.0 : 1.5;
  const target = isBuyTrend 
    ? entry + (risk * rrRatio)
    : entry - (risk * rrRatio);

  const confidence = 'High'; // Rule based is binary here, but we can add more conditions later

  return {
    symbol,
    mode: config.mode,
    signal: direction,
    entry: parseFloat(entry.toFixed(2)),
    stopLoss: parseFloat(stopLoss.toFixed(2)),
    target: parseFloat(target.toFixed(2)),
    currentPrice: parseFloat(currentPrice.toFixed(2)),
    riskReward: `1:${rrRatio}`,
    confidence,
    timestamp: new Date().toISOString(),
    source: 'Yahoo Finance (Real-time)',
    metrics: {
        rvol: cRVol.toFixed(2),
        atrPct: atrPct.toFixed(2)
    }
  };
};

const runScan = async () => {
  const config = getConfig();
  
  // Market Filter
  let market = { isFlat: false };
  if (config.safety.marketFilter) {
    market = await getMarketStatus();
    if (market.isFlat) {
        return { 
            status: "MARKET_FLAT", 
            message: "NIFTY 50 Range < 0.4%. Market is sideways.", 
            niftyData: market,
            trades: [] 
        };
    }
  }

  // Parallel Fetch (Batched ideally, but direct for simplicity here)
  const interval = config.mode === 'SCALP' ? '5m' : '15m';
  
  const promises = STOCKS.map(symbol => fetchStockData(symbol, interval, '1d'));
  const results = await Promise.all(promises);

  const trades = [];
  
  results.forEach((data, index) => {
    if (!data) return;
    const analysis = analyzeStock(STOCKS[index], data, config, market);
    trades.push(analysis);
  });

  return {
    status: "ACTIVE",
    niftyData: market,
    trades: trades
  };
};

module.exports = { runScan };