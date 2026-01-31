import React, { useEffect, useState, useCallback } from 'react';
import { StockTable } from '../components/StockTable';
import { ModeToggle } from '../components/ModeToggle';
import { fetchScan, fetchSettings, updateSettings, getApiUrl } from '../services/api';
import { ScanResponse } from '../types';
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
            // Attempt to sync settings first
            try {
                const currentConfig = await fetchSettings();
                if (currentConfig.mode !== mode) {
                    await updateSettings({ ...currentConfig, mode });
                }
            } catch (configErr) {
                console.warn("Settings sync failed (minor), continuing to scan:", configErr);
            }
            
            const data = await fetchScan();
            setScanData(data);
            setLastUpdated(new Date());
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to connect to scanner service.');
        } finally {
            setLoading(false);
        }
    }, [mode]);

    useEffect(() => {
        loadScan();
        const interval = setInterval(loadScan, 60000); // Refresh every 1 min
        return () => clearInterval(interval);
    }, [loadScan]);

    const activeTrades = scanData?.trades?.filter(t => t.signal !== 'NO TRADE') || [];
    const ignoredTrades = scanData?.trades?.filter(t => t.signal === 'NO TRADE') || [];
    
    // Check if we have data issues (like in your screenshot where all are "Insufficient Data")
    const hasDataIssues = ignoredTrades.length > 0 && activeTrades.length === 0 && ignoredTrades.every(t => t.reason === 'Insufficient Data');

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6 flex flex-col">
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

            {error && (
                <div className="bg-red-900/20 border border-red-800 text-red-400 p-4 rounded mb-4">
                    <strong>Connection Error:</strong> {error}
                    <div className="text-xs mt-2 opacity-75">
                        Frontend tried to fetch: <strong>{getApiUrl()}/scan</strong><br/>
                        Check console logs for details.
                    </div>
                </div>
            )}

            {hasDataIssues && (
                 <div className="bg-yellow-900/20 border border-yellow-800 text-yellow-500 p-4 rounded mb-6">
                    <strong>Note:</strong> Stocks are returning "Insufficient Data". The backend may be waiting for Yahoo Finance data or the market has just opened.
                </div>
            )}

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

            <div className="mb-8 flex-grow">
                <h2 className="text-xl font-semibold mb-4 text-green-400">Actionable Signals</h2>
                <StockTable trades={activeTrades} />
            </div>

            <div className="opacity-60 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-400">Filtered Out</h2>
                <StockTable trades={ignoredTrades} />
            </div>

            <footer className="text-xs text-gray-600 border-t border-gray-800 pt-4 mt-auto">
                Connected to: {getApiUrl()}
            </footer>
        </div>
    );
};

export default Dashboard;