import { Config, ScanResponse } from '../types';

// Logic:
// 1. If VITE_API_URL is set (e.g., https://frontback-production.up.railway.app/api), use it.
// 2. Otherwise, fall back to '/api' (relative path for production same-origin serving).
let API_BASE = import.meta.env.VITE_API_URL || '/api';

// Remove trailing slash to prevent double slashes (e.g. /api//scan)
if (API_BASE.endsWith('/')) {
    API_BASE = API_BASE.slice(0, -1);
}

console.log(`[API] Initialized with base: ${API_BASE}`);

const handleResponse = async (res: Response) => {
    if (!res.ok) {
        const text = await res.text();
        try {
            // Try to parse JSON error from backend
            const json = JSON.parse(text);
            throw new Error(json.error || json.message || `API Error: ${res.status}`);
        } catch (e: any) {
            // If already parsed, rethrow. Otherwise throw raw text.
            if (e.message && e.message.startsWith('API Error')) throw e;
            throw new Error(`API Error: ${res.status} ${text.substring(0, 50)}...`);
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