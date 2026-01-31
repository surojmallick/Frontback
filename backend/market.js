// backend/market.js
const { fetchStockData } = require('./yahoo');

const getMarketStatus = async () => {
  // Use ^NSEI for Nifty 50
  const data = await fetchStockData('^NSEI', '15m', '1d');
  
  if (!data || data.candles.length < 2) {
    return { isFlat: false, rangePct: 1.0, status: "DATA_UNAVAILABLE" };
  }

  const candles = data.candles;
  const dayOpen = candles[0].open;
  const lastClose = candles[candles.length - 1].close;
  
  // Calculate day's high/low
  const highs = candles.map(c => c.high);
  const lows = candles.map(c => c.low);
  const dayHigh = Math.max(...highs);
  const dayLow = Math.min(...lows);

  const range = dayHigh - dayLow;
  const rangePct = (range / dayOpen) * 100;

  // If range is less than 0.4%, market is flat
  const isFlat = rangePct < 0.4;

  return {
    isFlat,
    rangePct: rangePct.toFixed(2),
    trend: lastClose > dayOpen ? 'UP' : 'DOWN',
    currentPrice: lastClose
  };
};

module.exports = { getMarketStatus };