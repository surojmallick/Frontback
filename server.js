const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const { runScan } = require('./backend/scan');
const { getConfig, updateConfig } = require('./backend/config');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// --- API Routes ---
const apiRouter = express.Router();

apiRouter.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

apiRouter.get('/settings', (req, res) => {
    res.json(getConfig());
});

apiRouter.post('/settings', (req, res) => {
    try {
        const newConfig = req.body;
        const updated = updateConfig(newConfig);
        res.json(updated);
    } catch (err) {
        console.error("Settings Update Error:", err);
        res.status(500).json({ error: 'Failed to update settings' });
    }
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

// Mount API
app.use('/api', apiRouter);

// --- Frontend Static Serving ---
const distPath = path.join(__dirname, 'dist');

// Check if build exists
if (!fs.existsSync(distPath)) {
    console.error("CRITICAL: 'dist' directory not found. Did the build run?");
}

app.use(express.static(distPath));

// Handle React Routing (SPA)
app.get('*', (req, res) => {
    // If it's an API request that fell through, return 404 JSON
    if (req.url.startsWith('/api') || (req.headers.accept && req.headers.accept.includes('application/json'))) {
        return res.status(404).json({ error: 'API route not found' });
    }
    
    // Otherwise serve index.html
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(500).send('Application is building or missing. Please check server logs.');
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at /api`);
});