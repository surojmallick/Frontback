// backend/yahoo.js
const axios = require('axios');

const fetchStockData = async (symbol, interval = '5m', range = '1d') => {
  try {
    const url = `https://query2.finance.yahoo.com/v8/finance/chart/${symbol}`;
    const response = await axios.get(url, {
      params: {
        interval: interval,
        range: range,
        events: 'history',
        includeAdjustedClose: 'true'
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Origin': 'https://finance.yahoo.com',
        'Referer': `https://finance.yahoo.com/quote/${symbol}`
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
    // Return null to allow other stocks to proceed
    return null;
  }
};

module.exports = { fetchStockData };