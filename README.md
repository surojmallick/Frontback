# NSE Algo Scanner

Real-time stock scanner for NSE (National Stock Exchange of India) using Yahoo Finance data.

## Features

- Real-time scanning of Nifty 50 stocks
- Scalp (5m) and Intraday (15m) modes
- Configurable indicators (EMA, ATR, RVol)
- Nifty 50 Market Filter
- Railway-ready deployment

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server (Frontend + Backend):
   ```bash
   # Terminal 1: Backend
   node backend/server.js

   # Terminal 2: Frontend
   npm run dev
   ```

3. Build for Production:
   ```bash
   npm run build
   npm start
   ```

## Deployment

This app is configured for Railway.
- Entry point: `npm start`
- Port: `PORT` env variable (default 8080)
