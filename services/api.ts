import { Config, ScanResponse } from '../types';

// Get URL from .env file
const API_BASE = import.meta.env.VITE_API_URL;

if (!API_BASE) {
    console.error("VITE_API_URL is missing in .env file!");
}

console.log(`[API] Connecting to: ${API_BASE}`);

const handleResponse = async (res: Response) => {
    if (!res.ok) {
        const text = await res.text();
        try {
            const json = JSON.parse(text);
            throw new Error(json.error || json.message || `API Error: ${res.status}`);
        } catch (e: any) {
            if (e.message && e.message.startsWith('API Error')) throw e;
            throw new Error(`API Error: ${res.status}`);
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
        console.error("Update Settings Error:", error);
        throw error;
    }
};

export const fetchScan = async (): Promise<ScanResponse> => {
    try {
        const res = await fetch(`${API_BASE}/scan`);
        return handleResponse(res);
    } catch (error: any) {
        console.error("Fetch Scan Error:", error);
        throw error;
    }
};