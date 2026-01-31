import React, { useEffect, useState } from 'react';
import { fetchSettings, updateSettings } from '../services/api';
import { Config } from '../types';
import { Link } from 'react-router-dom';

const Settings: React.FC = () => {
    const [config, setConfig] = useState<Config | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings().then(setConfig).catch(console.error);
    }, []);

    const handleSave = async () => {
        if (!config) return;
        setSaving(true);
        try {
            await updateSettings(config);
            alert('Settings saved successfully!');
        } catch (e) {
            alert('Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    if (!config) return <div className="p-8 text-white">Loading config...</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                    <h1 className="text-2xl font-bold">System Configuration</h1>
                    <Link to="/" className="text-blue-400 hover:text-blue-300">Back to Dashboard</Link>
                </div>

                <div className="space-y-6 bg-gray-800 p-6 rounded-lg border border-gray-700">
                    
                    {/* EMA Settings */}
                    <div>
                        <h3 className="text-lg font-medium text-blue-400 mb-4">EMA Periods</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Short (Signal)</label>
                                <input 
                                    type="number" 
                                    value={config.emaShort}
                                    onChange={e => setConfig({...config, emaShort: parseInt(e.target.value)})}
                                    className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Mid (Trend)</label>
                                <input 
                                    type="number" 
                                    value={config.emaMid}
                                    onChange={e => setConfig({...config, emaMid: parseInt(e.target.value)})}
                                    className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Long (Baseline)</label>
                                <input 
                                    type="number" 
                                    value={config.emaLong}
                                    onChange={e => setConfig({...config, emaLong: parseInt(e.target.value)})}
                                    className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Volatility Settings */}
                    <div>
                        <h3 className="text-lg font-medium text-purple-400 mb-4">Volatility Filters</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">ATR Period</label>
                                <input 
                                    type="number" 
                                    value={config.atrPeriod}
                                    onChange={e => setConfig({...config, atrPeriod: parseInt(e.target.value)})}
                                    className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:border-purple-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Min RVol (Scalp)</label>
                                <input 
                                    type="number" 
                                    step="0.1"
                                    value={config.volMultiplierScalp}
                                    onChange={e => setConfig({...config, volMultiplierScalp: parseFloat(e.target.value)})}
                                    className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:border-purple-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Safety Settings */}
                    <div>
                        <h3 className="text-lg font-medium text-green-400 mb-4">Safety Protocols</h3>
                        <div className="space-y-3">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input 
                                    type="checkbox"
                                    checked={config.safety.marketFilter}
                                    onChange={e => setConfig({...config, safety: {...config.safety, marketFilter: e.target.checked}})}
                                    className="w-5 h-5 rounded text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                                />
                                <span className="text-gray-300">NIFTY 50 Filter (Block trades if flat)</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input 
                                    type="checkbox"
                                    checked={config.safety.confirmClose}
                                    onChange={e => setConfig({...config, safety: {...config.safety, confirmClose: e.target.checked}})}
                                    className="w-5 h-5 rounded text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                                />
                                <span className="text-gray-300">Candle Body Confirmation (&gt;60%)</span>
                            </label>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-700">
                        <button 
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition"
                        >
                            {saving ? 'Saving...' : 'Update Strategy Configuration'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Settings;