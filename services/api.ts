import { Config, ScanResponse } from '../types';

// Use relative paths. 
// In development, vite.config.ts proxy handles forwarding to localhost:8080.
// In production, the backend serves the frontend, so relative paths work natively.
const BASE_URL = '';

export const fetchSettings = async (): Promise<Config> => {
    try {
        const res = await fetch(`${BASE_URL}/settings`);
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`API Error: ${res.status} ${text || res.statusText}`);
        }
        return res.json();
    } catch (error: any) {
        console.error("Fetch Settings Error:", error);
        throw new Error(error.message || "Failed to fetch settings");
    }
};

export const updateSettings = async (config: Config): Promise<Config> => {
    try {
        const res = await fetch(`${BASE_URL}/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config),
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`API Error: ${res.status} ${text || res.statusText}`);
        }
        return res.json();
    } catch (error: any) {
        console.error("Update Settings Error:", error);
        throw new Error(error.message || "Failed to update settings");
    }
};

export const fetchScan = async (): Promise<ScanResponse> => {
    try {
        const res = await fetch(`${BASE_URL}/scan`);
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`API Error: ${res.status} ${text || res.statusText}`);
        }
        return res.json();
    } catch (error: any) {
        console.error("Fetch Scan Error:", error);
        throw new Error(error.message || "Failed to fetch scan data");
    }
};