const express = require('express');
const path = require('path');
const cors = require('cors');
const { runScan } = require('./backend/scan');
const { getConfig, updateConfig } = require('./backend/config');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Request logging middleware for debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
app.get('/api/settings', (req, res) => {
    res.json(getConfig());
});

app.post('/api/settings', (req, res) => {
    const newConfig = req.body;
    const updated = updateConfig(newConfig);
    res.json(updated);
});

app.get('/api/scan', async (req, res) => {
    try {
        const results = await runScan();
        res.json(results);
    } catch (error) {
        console.error("Scan Error:", error);
        res.status(500).json({ error: 'Scan failed', details: error.message });
    }
});

app.get('/health', (req, res) => {
    res.send('OK');
});

// Handle SPA routing: return index.html for any unknown route NOT starting with /api
app.get('*', (req, res) => {
    if (req.url.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});