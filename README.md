# NSE Intraday Scanner

A real-time stock scanner for NSE (National Stock Exchange) utilizing Yahoo Finance data.

## 🚀 Local Development

### 1. Start the Backend
The backend handles data fetching and indicator calculation.

```bash
cd backend
npm install
npm start
```
*Server runs on http://localhost:8080*

### 2. Start the Frontend
The frontend is built with React and Vite.

```bash
# In a new terminal (root directory)
npm install
npm run dev
```
*Frontend runs on http://localhost:3000*

---

## ☁️ Deployment Guide

### Backend (Railway)
1. Push this repo to GitHub.
2. Create a new project on **Railway**.
3. Select this repository.
4. **Important**: Go to Settings -> **Root Directory** and set it to `/backend`.
5. Railway will detect `package.json` and deploy.
6. Copy the **Public Domain** from the Networking tab (e.g., `https://nse-backend.up.railway.app`).

### Frontend (Vercel)
1. Create a new project on **Vercel**.
2. Select this repository.
3. Keep Root Directory as `./`.
4. Add Environment Variable:
   - **Name**: `VITE_API_URL`
   - **Value**: Your Railway Backend URL (e.g., `https://nse-backend.up.railway.app`)
5. Deploy.
