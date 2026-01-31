import React from 'react';

interface Props {
    mode: 'SCALP' | 'INTRADAY';
    onChange: (mode: 'SCALP' | 'INTRADAY') => void;
}

export const ModeToggle: React.FC<Props> = ({ mode, onChange }) => {
    return (
        <div className="flex bg-gray-800 p-1 rounded-lg inline-flex mb-4">
            <button
                onClick={() => onChange('SCALP')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    mode === 'SCALP' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
            >
                SCALP (5m)
            </button>
            <button
                onClick={() => onChange('INTRADAY')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    mode === 'INTRADAY' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
            >
                INTRADAY (15m)
            </button>
        </div>
    );
};