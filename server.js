const express = require('express');
const path = require('path');
const cors = require('cors');
const { runScan } = require('./backend/scan');
const { getConfig, updateConfig } = require('./backend/config');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
app.get('/settings', (req, res) => {
    res.json(getConfig());
});

app.post('/settings', (req, res) => {
    const newConfig = req.body;
    const updated = updateConfig(newConfig);
    res.json(updated);
});

app.get('/scan', async (req, res) => {
    try {
        const results = await runScan();
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Scan failed', details: error.message });
    }
});

// Handle SPA routing: return index.html for any unknown route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});