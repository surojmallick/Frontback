const express = require('express');
const path = require('path');
const cors = require('cors');
const { runScan } = require('./backend/scan');
const { getConfig, updateConfig } = require('./backend/config');

const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// --- API Logic ---
const apiRouter = express.Router();

apiRouter.get('/settings', (req, res) => {
    res.json(getConfig());
});

apiRouter.post('/settings', (req, res) => {
    const newConfig = req.body;
    const updated = updateConfig(newConfig);
    res.json(updated);
});

apiRouter.get('/scan', async (req, res) => {
    try {
        const results = await runScan();
        res.json(results);
    } catch (error) {
        console.error("Scan Error:", error);
        res.status(500).json({ error: 'Scan failed', details: error.message });
    }
});

apiRouter.get('/health', (req, res) => {
    res.send('OK');
});

// Mount API router on BOTH /api and / to handle prefix variations
app.use('/api', apiRouter);
app.use('/', apiRouter);

// --- Catch-All for Frontend ---
// This must be after API routes
app.get('*', (req, res) => {
    // If it looks like an API call but wasn't caught above, return 404 json
    if (req.url.startsWith('/api/') || req.headers.accept?.includes('application/json')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    // Otherwise serve index.html for SPA
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});