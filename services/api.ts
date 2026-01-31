import { Config, ScanResponse } from '../types';

// Use environment variable if defined, otherwise fallback to relative path
const API_PREFIX = import.meta.env.VITE_API_URL || '/api';

const handleResponse = async (res: Response) => {
    if (!res.ok) {
        const text = await res.text();
        // Try to parse JSON error if possible
        try {
            const json = JSON.parse(text);
            throw new Error(json.error || json.message || `API Error: ${res.status}`);
        } catch (e) {
            // If not JSON, throw the raw text or status
            throw new Error(`API Error: ${res.status} ${text.substring(0, 100)}`);
        }
    }
    return res.json();
};

export const fetchSettings = async (): Promise<Config> => {
    const url = `${API_PREFIX}/settings`;
    console.log(`Fetching settings from: ${url}`);
    try {
        const res = await fetch(url);
        return handleResponse(res);
    } catch (error: any) {
        console.error("Fetch Settings Error:", error);
        throw new Error(error.message || "Failed to fetch settings");
    }
};

export const updateSettings = async (config: Config): Promise<Config> => {
    const url = `${API_PREFIX}/settings`;
    try {
        const res = await fetch(url, {
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
    const url = `${API_PREFIX}/scan`;
    console.log(`Fetching scan from: ${url}`);
    try {
        const res = await fetch(url);
        return handleResponse(res);
    } catch (error: any) {
        console.error("Fetch Scan Error:", error);
        throw new Error(error.message || "Failed to fetch scan data");
    }
};