// backend/config.js
let config = {
  mode: 'INTRADAY', // SCALP or INTRADAY
  riskPerTrade: 1, // %
  maxTrades: 5,
  emaShort: 9,
  emaMid: 21,
  emaLong: 50,
  atrPeriod: 14,
  atrMultiplier: 1.5,
  volMultiplierScalp: 1.8,
  volMultiplierIntraday: 1.4,
  safety: {
    marketFilter: true,
    confirmClose: true
  }
};

const getConfig = () => config;

const updateConfig = (newConfig) => {
  config = { ...config, ...newConfig };
  return config;
};

module.exports = { getConfig, updateConfig };