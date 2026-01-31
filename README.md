# NSE Algo Scanner

A real-time stock scanner for NSE (National Stock Exchange) using Yahoo Finance data.

## Features
- **Scalp Mode (5m)** & **Intraday Mode (15m)**
- Real-time technical analysis (EMA, VWAP, ATR, RVol)
- NIFTY 50 Market Filter (Detects sideways market)
- Automated Trade Signals (Entry, SL, Target)
- No Database required (In-memory processing)

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server (Frontend + Backend):
   ```bash
   # Terminal 1: Frontend
   npm run dev
   
   # Terminal 2: Backend
   node backend/server.js
   ```

## Production Deployment (Railway)

The app is configured to run as a single unit (Node.js serving React static build).

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Environment Variables
- `PORT`: (Optional) Server port, defaults to 8080.
