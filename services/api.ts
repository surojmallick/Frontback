import { Config, ScanResponse } from '../types';

// In production (same origin), use relative path. 
// In development, use localhost or specified URL.
const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8080' : '');

export const fetchSettings = async (): Promise<Config> => {
    try {
        const res = await fetch(`${BASE_URL}/settings`);
        if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`);
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
        if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`);
        return res.json();
    } catch (error) {
        console.error("Update Settings Error:", error);
        throw error;
    }
};

export const fetchScan = async (): Promise<ScanResponse> => {
    try {
        const res = await fetch(`${BASE_URL}/scan`);
        if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`);
        return res.json();
    } catch (error) {
        console.error("Fetch Scan Error:", error);
        throw error;
    }
};