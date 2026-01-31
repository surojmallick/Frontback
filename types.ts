export interface Config {
    mode: 'SCALP' | 'INTRADAY';
    riskPerTrade: number;
    maxTrades: number;
    emaShort: number;
    emaMid: number;
    emaLong: number;
    atrPeriod: number;
    atrMultiplier: number;
    volMultiplierScalp: number;
    volMultiplierIntraday: number;
    safety: {
        marketFilter: boolean;
        confirmClose: boolean;
    };
}

export interface TradeSignal {
    symbol: string;
    mode: string;
    signal: 'BUY' | 'SELL' | 'NO TRADE';
    reason?: string;
    entry?: number;
    stopLoss?: number;
    target?: number;
    currentPrice?: number;
    riskReward?: string;
    confidence?: string;
    timestamp?: string;
    source?: string;
    metrics?: {
        rvol: string;
        atrPct: string;
    };
}

export interface NiftyData {
    isFlat: boolean;
    rangePct?: string;
    trend?: string;
    currentPrice?: number;
    status?: string;
}

export interface ScanResponse {
    status: string;
    message?: string;
    niftyData: NiftyData;
    trades: TradeSignal[];
}