const express = require('express');
const path = require('path');
const cors = require('cors');
const { runScan } = require('./backend/scan');
const { getConfig, updateConfig } = require('./backend/config');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors()); // Allow all CORS for simplicity in this demo
app.use(express.json());

// Logging Middleware
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

// Mount API on /api
app.use('/api', apiRouter);

// --- Frontend Static Serving ---
// Serve static files from the 'dist' directory created by 'npm run build'
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React Routing (SPA)
// For any request that doesn't match an API route or static file, send index.html
app.get('*', (req, res) => {
    // Check if client is expecting JSON (api call that missed)
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(404).json({ error: 'API route not found' });
    }
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
});