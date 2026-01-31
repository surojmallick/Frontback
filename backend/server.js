// backend/server.js
const express = require('express');
const cors = require('cors');
const { runScan } = require('./scan');
const { getConfig, updateConfig } = require('./config');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/', (req, res) => {
  res.send('NSE Scanner Backend is Running');
});

// Get Configuration
app.get('/settings', (req, res) => {
  res.json(getConfig());
});

// Update Configuration
app.post('/settings', (req, res) => {
  const newConfig = req.body;
  const updated = updateConfig(newConfig);
  res.json(updated);
});

// Run Scan
app.get('/scan', async (req, res) => {
  try {
    const results = await runScan();
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Scan failed', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});