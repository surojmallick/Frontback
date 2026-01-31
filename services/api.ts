import { Config, ScanResponse } from '../types';

// Use environment variable if defined, otherwise fallback to relative path (useful for local dev with proxy)
const API_PREFIX = import.meta.env.VITE_API_URL || '/api';

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