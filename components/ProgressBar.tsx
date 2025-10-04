
import React from 'react';

interface ProgressBarProps {
    progress: number;
    label: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label }) => {
    const safeProgress = Math.max(0, Math.min(100, progress));

    return (
        <div className="w-full bg-gray-700 rounded-full h-5 relative overflow-hidden border border-gray-600">
            <div
                className="bg-gradient-to-r from-yellow-500 to-yellow-300 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${safeProgress}%` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-black text-shadow">
                {label}
            </div>
        </div>
    );
};
