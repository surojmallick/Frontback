import { Config, ScanResponse } from '../types';

// Use relative paths with /api prefix.
// In development, vite.config.ts proxy forwards /api to localhost:8080.
// In production, server.js handles /api routes directly.
const API_PREFIX = '/api';

export const fetchSettings = async (): Promise<Config> => {
    try {
        const res = await fetch(`${API_PREFIX}/settings`);
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`API Error: ${res.status} ${text.substring(0, 100)}`);
        }
        return res.json();
    } catch (error: any) {
        console.error("Fetch Settings Error:", error);
        throw new Error(error.message || "Failed to fetch settings");
    }
};

export const updateSettings = async (config: Config): Promise<Config> => {
    try {
        const res = await fetch(`${API_PREFIX}/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config),
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`API Error: ${res.status} ${text.substring(0, 100)}`);
        }
        return res.json();
    } catch (error: any) {
        console.error("Update Settings Error:", error);
        throw new Error(error.message || "Failed to update settings");
    }
};

export const fetchScan = async (): Promise<ScanResponse> => {
    try {
        const res = await fetch(`${API_PREFIX}/scan`);
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`API Error: ${res.status} ${text.substring(0, 100)}`);
        }
        return res.json();
    } catch (error: any) {
        console.error("Fetch Scan Error:", error);
        throw new Error(error.message || "Failed to fetch scan data");
    }
};