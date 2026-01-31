import React, { useEffect, useState, useCallback } from 'react';
import { StockTable } from '../components/StockTable';
import { ModeToggle } from '../components/ModeToggle';
import { fetchScan, fetchSettings, updateSettings } from '../services/api';
import { Config, ScanResponse, TradeSignal } from '../types';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const [scanData, setScanData] = useState<ScanResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<'SCALP' | 'INTRADAY'>('SCALP');
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const loadScan = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // First ensure backend has correct mode
            const currentConfig = await fetchSettings();
            if (currentConfig.mode !== mode) {
                await updateSettings({ ...currentConfig, mode });
            }
            
            const data = await fetchScan();
            setScanData(data);
            setLastUpdated(new Date());
        } catch (err: any) {
            console.error(err);
            // Display the actual error message from the API or Network
            setError(err.message || 'Failed to connect to scanner service.');
        } finally {
            setLoading(false);
        }
    }, [mode]);

    useEffect(() => {
        loadScan();
        const interval = setInterval(loadScan, 60000); // Auto-refresh every 1 min
        return () => clearInterval(interval);
    }, [loadScan]);

    const activeTrades = scanData?.trades.filter(t => t.signal !== 'NO TRADE') || [];
    const ignoredTrades = scanData?.trades.filter(t => t.signal === 'NO TRADE') || [];

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
            <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-blue-400">NSE Algo Scanner</h1>
                    <p className="text-sm text-gray-500">
                        {lastUpdated ? `Updated: ${lastUpdated.toLocaleTimeString()}` : 'Initializing...'}
                    </p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={loadScan} 
                        disabled={loading}
                        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded transition"
                    >
                        {loading ? 'Scanning...' : 'Refresh'}
                    </button>
                    <Link 
                        to="/settings"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition flex items-center"
                    >
                        Settings
                    </Link>
                </div>
            </header>

            {scanData?.status === 'MARKET_FLAT' && (
                <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-200 p-4 rounded mb-6">
                    <strong>⚠️ Market Filter Active:</strong> {scanData.message}
                </div>
            )}
            
            {scanData?.niftyData && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-800 p-4 rounded border border-gray-700">
                        <div className="text-gray-400 text-xs">NIFTY 50 Trend</div>
                        <div className={`text-lg font-bold ${scanData.niftyData.trend === 'UP' ? 'text-green-400' : 'text-red-400'}`}>
                            {scanData.niftyData.trend || 'FLAT'}
                        </div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded border border-gray-700">
                        <div className="text-gray-400 text-xs">Day Range</div>
                        <div className="text-lg font-bold text-white">{scanData.niftyData.rangePct}%</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded border border-gray-700">
                        <div className="text-gray-400 text-xs">NIFTY Level</div>
                        <div className="text-lg font-bold text-white">{scanData.niftyData.currentPrice}</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded border border-gray-700">
                        <div className="text-gray-400 text-xs">Active Signals</div>
                        <div className="text-lg font-bold text-blue-400">{activeTrades.length}</div>
                    </div>
                </div>
            )}

            <ModeToggle mode={mode} onChange={setMode} />

            {error && (
                <div className="bg-red-900/20 border border-red-800 text-red-400 p-4 rounded mb-4">
                    <strong>Error:</strong> {error}
                    <div className="text-xs text-red-300 mt-2">
                        Ensure the backend server is running on port 8080.
                    </div>
                </div>
            )}

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-green-400">Actionable Signals</h2>
                <StockTable trades={activeTrades} />
            </div>

            <div className="opacity-60">
                <h2 className="text-xl font-semibold mb-4 text-gray-400">Filtered Out (No Trade)</h2>
                <StockTable trades={ignoredTrades} />
            </div>
            
            <footer className="mt-12 text-center text-xs text-gray-600 border-t border-gray-800 pt-4">
                Disclaimer: Trading involves risk. This tool uses Yahoo Finance data which may be delayed. 
                Not financial advice.
            </footer>
        </div>
    );
};

export default Dashboard;