import React from 'react';
import { Technology, Resource } from '../types';

interface ResearchModalProps {
    tech: Technology;
    onClose: () => void;
    onConfirm: (tech: Technology) => void;
    resources: Record<Resource, number>;
}

export const ResearchModal: React.FC<ResearchModalProps> = ({ tech, onClose, onConfirm, resources }) => {
    const hasEnoughResources = resources[tech.cost.resource] >= tech.cost.amount;

    const resourceIcons: Record<Resource, string> = {
        [Resource.Pangan]: "🍞",
        [Resource.Kayu]: "🪵",
        [Resource.Batu]: "🪨",
        [Resource.BijihBesi]: "⛏️",
        [Resource.Emas]: "🪙",
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h > 0 ? h + 'j ' : ''}${m > 0 ? m + 'm ' : ''}${s}d`;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-8 shadow-2xl border border-blue-500 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-2 text-blue-300">Teliti: {tech.name}</h2>
                <p className="text-lg mb-6">{tech.description}</p>

                <div className="space-y-4 mb-8">
                     <div className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
                        <span className="text-gray-300">Bonus:</span>
                        <span className="font-semibold text-green-400">{tech.bonus.percentage}% {tech.bonus.type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
                        <span className="text-gray-300">Waktu:</span>
                        <span className="font-semibold text-white">{formatTime(tech.researchTime)}</span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
                        <span className="text-gray-300">Biaya:</span>
                        <div className={`font-semibold flex items-center ${hasEnoughResources ? 'text-white' : 'text-red-500'}`}>
                            <span className="text-xl mr-2">{resourceIcons[tech.cost.resource]}</span>
                            {tech.cost.amount.toLocaleString('id-ID')} {tech.cost.resource}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-500 transition-colors duration-200"
                    >
                        Batal
                    </button>
                    <button
                        onClick={() => onConfirm(tech)}
                        disabled={!hasEnoughResources}
                        className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-500 transition-colors duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        Mulai Teliti
                    </button>
                </div>
            </div>
        </div>
    );
};