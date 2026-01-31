// backend/yahoo.js
const axios = require('axios');

const fetchStockData = async (symbol, interval = '5m', range = '1d') => {
  try {
    const url = `https://query2.finance.yahoo.com/v8/finance/chart/${symbol}`;
    const response = await axios.get(url, {
      params: {
        interval: interval,
        range: range,
        events: 'history'
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const result = response.data.chart.result[0];
    if (!result || !result.timestamp) {
      return null;
    }

    const quotes = result.indicators.quote[0];
    const timestamps = result.timestamp;

    const candles = timestamps.map((t, i) => ({
      time: t * 1000,
      open: quotes.open[i],
      high: quotes.high[i],
      low: quotes.low[i],
      close: quotes.close[i],
      volume: quotes.volume[i]
    })).filter(c => c.close !== null && c.volume !== null); // Filter incomplete data

    return {
      symbol: result.meta.symbol,
      candles: candles,
      meta: result.meta
    };

  } catch (error) {
    console.error(`Error fetching data for ${symbol}: ${error.message}`);
    return null;
  }
};

module.exports = { fetchStockData };