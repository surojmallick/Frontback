// backend/indicators.js

// Simple EMA calculation
const calculateEMA = (data, period) => {
  const k = 2 / (period + 1);
  let emaArray = [data[0]];
  for (let i = 1; i < data.length; i++) {
    emaArray.push(data[i] * k + emaArray[i - 1] * (1 - k));
  }
  return emaArray;
};

// Simple ATR calculation
const calculateATR = (high, low, close, period) => {
  let tr = [high[0] - low[0]];
  for (let i = 1; i < high.length; i++) {
    const hl = high[i] - low[i];
    const hc = Math.abs(high[i] - close[i - 1]);
    const lc = Math.abs(low[i] - close[i - 1]);
    tr.push(Math.max(hl, hc, lc));
  }

  // First ATR is simple average of TR
  let atr = [tr.slice(0, period).reduce((a, b) => a + b, 0) / period];
  for (let i = period; i < tr.length; i++) {
    atr.push((atr[i - period] * (period - 1) + tr[i]) / period);
  }
  
  // Pad the beginning to match data length
  const padding = new Array(period - 1).fill(null);
  return [...padding, ...atr];
};

// Intraday VWAP calculation
const calculateVWAP = (candles) => {
  let cumulativeTPV = 0;
  let cumulativeVolume = 0;
  return candles.map(c => {
    const typicalPrice = (c.high + c.low + c.close) / 3;
    cumulativeTPV += typicalPrice * c.volume;
    cumulativeVolume += c.volume;
    return cumulativeTPV / cumulativeVolume;
  });
};

const calculateRVol = (volumes, period = 20) => {
  const rvol = [];
  for (let i = 0; i < volumes.length; i++) {
    if (i < period) {
      rvol.push(1); // Not enough data
      continue;
    }
    const slice = volumes.slice(i - period, i);
    const avgVol = slice.reduce((a, b) => a + b, 0) / period;
    rvol.push(volumes[i] / (avgVol || 1));
  }
  return rvol;
};

module.exports = { calculateEMA, calculateATR, calculateVWAP, calculateRVol };