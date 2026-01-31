import { Config, ScanResponse } from '../types';

// In production (served by same origin), use relative path (empty string)
// In development, use localhost:8080 (assuming backend is running there)
const BASE_URL = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');

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