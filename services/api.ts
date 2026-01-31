import { Config, ScanResponse } from '../types';

// CRITICAL FIX: Use relative path. 
// When deployed, the frontend and backend are on the same domain.
// Browsers handle relative paths automatically without CORS issues.
const API_BASE = '/api';

console.log(`[API] Initialized with base: ${API_BASE}`);

const handleResponse = async (res: Response) => {
    if (!res.ok) {
        const text = await res.text();
        try {
            const json = JSON.parse(text);
            throw new Error(json.error || json.message || `API Error: ${res.status}`);
        } catch (e: any) {
            if (e.message && e.message.startsWith('API Error')) throw e;
            throw new Error(`API Error: ${res.status} ${text.substring(0, 50)}`);
        }
    }
    return res.json();
};

export const fetchSettings = async (): Promise<Config> => {
    try {
        const res = await fetch(`${API_BASE}/settings`);
        return handleResponse(res);
    } catch (error: any) {
        console.error("[API] Fetch Settings Error:", error);
        throw error;
    }
};

export const updateSettings = async (config: Config): Promise<Config> => {
    try {
        const res = await fetch(`${API_BASE}/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config),
        });
        return handleResponse(res);
    } catch (error: any) {
        console.error("[API] Update Settings Error:", error);
        throw error;
    }
};

export const fetchScan = async (): Promise<ScanResponse> => {
    try {
        const res = await fetch(`${API_BASE}/scan`);
        return handleResponse(res);
    } catch (error: any) {
        console.error("[API] Fetch Scan Error:", error);
        throw error;
    }
};