# NSE Algo Scanner

A production-ready web application for scanning NSE stocks using Yahoo Finance data.

## Features
- Real-time stock scanning
- Scalp (5m) and Intraday (15m) modes
- Configurable strategies (EMA, ATR, Volume)
- Mobile-responsive UI

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the backend:
   ```bash
   node server.js
   ```

3. Start the frontend (in a separate terminal):
   ```bash
   npm run dev
   ```

## Deployment (Railway)

The application is configured for deployment on Railway.

1. Connect your GitHub repository to Railway.
2. Railway will automatically detect `package.json` and the `start` script.
3. The build script (`npm run build`) will compile the React frontend to `dist/`.
4. The `start` script (`node server.js`) will launch the Express server which serves both the API and the static frontend files.

## Environment Variables
- `PORT`: Set automatically by Railway (defaults to 8080 locally).
