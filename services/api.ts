import { Config, ScanResponse } from '../types';

// Robust URL handling: Remove trailing slash if present
const RAW_URL = import.meta.env.VITE_API_URL || '';
const API_BASE = RAW_URL.replace(/\/$/, '');

console.log(`[API] Configuration Base: ${API_BASE}`);

const handleResponse = async (res: Response, endpoint: string) => {
    if (!res.ok) {
        // Try to read error text
        const text = await res.text();
        console.error(`[API Error] ${endpoint} returned ${res.status}: ${text}`);
        
        try {
            const json = JSON.parse(text);
            throw new Error(json.error || json.message || `API Error: ${res.status}`);
        } catch (e: any) {
            if (e.message && e.message.startsWith('API Error')) throw e;
            throw new Error(`API Error: ${res.status} on ${endpoint}`);
        }
    }
    return res.json();
};

export const fetchSettings = async (): Promise<Config> => {
    try {
        const url = `${API_BASE}/settings`;
        console.log(`[API] Fetching: ${url}`);
        const res = await fetch(url);
        return handleResponse(res, url);
    } catch (error: any) {
        console.error("Fetch Settings Error:", error);
        throw error;
    }
};

export const updateSettings = async (config: Config): Promise<Config> => {
    try {
        const url = `${API_BASE}/settings`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config),
        });
        return handleResponse(res, url);
    } catch (error: any) {
        console.error("Update Settings Error:", error);
        throw error;
    }
};

export const fetchScan = async (): Promise<ScanResponse> => {
    try {
        const url = `${API_BASE}/scan`;
        console.log(`[API] Fetching: ${url}`);
        const res = await fetch(url);
        return handleResponse(res, url);
    } catch (error: any) {
        console.error("Fetch Scan Error:", error);
        throw error;
    }
};

export const getApiUrl = () => API_BASE;