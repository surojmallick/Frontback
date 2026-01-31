import { Config, ScanResponse } from '../types';

// Use environment variable if available (Vercel), otherwise localhost (Dev)
// Remove trailing slash if present
const BASE_URL = ((import.meta as any).env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');

export const fetchSettings = async (): Promise<Config> => {
    try {
        const res = await fetch(`${BASE_URL}/settings`);
        if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
        return res.json();
    } catch (error) {
        console.error("Fetch Settings Error:", error);
        throw error;
    }
};

export const updateSettings = async (config: Config): Promise<Config> => {
    try {
        const res = await fetch(`${BASE_URL}/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config),
        });
        if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
        return res.json();
    } catch (error) {
        console.error("Update Settings Error:", error);
        throw error;
    }
};

export const fetchScan = async (): Promise<ScanResponse> => {
    try {
        const res = await fetch(`${BASE_URL}/scan`);
        if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
        return res.json();
    } catch (error) {
        console.error("Fetch Scan Error:", error);
        throw error;
    }
};