import { Config, ScanResponse } from '../types';

// Logic:
// 1. If VITE_API_URL is set (from .env), use it.
// 2. Otherwise, use relative '/api' path (assumes frontend served by backend).
let API_BASE = import.meta.env.VITE_API_URL || '/api';

// Remove trailing slash if present to avoid // in urls
if (API_BASE.endsWith('/')) {
    API_BASE = API_BASE.slice(0, -1);
}

console.log(`API Service Initialized. Base URL: ${API_BASE}`);

const handleResponse = async (res: Response) => {
    if (!res.ok) {
        const text = await res.text();
        try {
            const json = JSON.parse(text);
            throw new Error(json.error || json.message || `API Error: ${res.status}`);
        } catch (e: any) {
            // Re-throw if it was already our parsed error, otherwise throw generic
            if (e.message && e.message.startsWith('API Error')) throw e;
            throw new Error(`API Error: ${res.status} ${text.substring(0, 100)}`);
        }
    }
    return res.json();
};

export const fetchSettings = async (): Promise<Config> => {
    try {
        const res = await fetch(`${API_BASE}/settings`);
        return handleResponse(res);
    } catch (error: any) {
        console.error("Fetch Settings Error:", error);
        throw new Error(error.message || "Failed to fetch settings");
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
        console.error("Update Settings Error:", error);
        throw new Error(error.message || "Failed to update settings");
    }
};

export const fetchScan = async (): Promise<ScanResponse> => {
    try {
        const res = await fetch(`${API_BASE}/scan`);
        return handleResponse(res);
    } catch (error: any) {
        console.error("Fetch Scan Error:", error);
        throw new Error(error.message || "Failed to fetch scan data");
    }
};