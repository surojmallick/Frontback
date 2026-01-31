import React from 'react';
import { TradeSignal } from '../types';

interface Props {
    trades: TradeSignal[];
}

export const StockTable: React.FC<Props> = ({ trades }) => {
    if (trades.length === 0) {
        return <div className="p-8 text-center text-gray-500">No signals found. Market might be closed or sideways.</div>;
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="min-w-full divide-y divide-gray-700 bg-gray-800">
                <thead className="bg-gray-700">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Symbol</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Signal</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Entry</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">SL</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Target</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">R:R</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stats</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                    {trades.map((trade) => (
                        <tr key={trade.symbol} className="hover:bg-gray-750 transition-colors">
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-200">
                                {trade.symbol.replace('.NS', '')}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    trade.signal === 'BUY' ? 'bg-green-100 text-green-800' :
                                    trade.signal === 'SELL' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-600 text-gray-300'
                                }`}>
                                    {trade.signal}
                                </span>
                                {trade.reason && (
                                    <div className="text-xs text-gray-500 mt-1">{trade.reason}</div>
                                )}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                                {trade.currentPrice || '-'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-400 font-medium">
                                {trade.entry || '-'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-red-400">
                                {trade.stopLoss || '-'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-green-400">
                                {trade.target || '-'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">
                                {trade.riskReward || '-'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500">
                                {trade.metrics && (
                                    <>
                                        <div>RVol: {trade.metrics.rvol}x</div>
                                        <div>ATR: {trade.metrics.atrPct}%</div>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};