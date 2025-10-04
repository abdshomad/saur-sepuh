import React from 'react';
import { Building, Resource } from '../types';
import { getUpgradeCost } from '../constants';

interface UpgradeModalProps {
    building: Building;
    onClose: () => void;
    onConfirm: (building: Building, cost: number, resource: Resource, time: number) => void;
    resources: Record<Resource, number>;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ building, onClose, onConfirm, resources }) => {
    const { cost, resource, time } = getUpgradeCost(building.name, building.level + 1);
    const hasEnoughResources = resources[resource] >= cost;

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
            <div className="bg-gray-800 rounded-lg p-8 shadow-2xl border border-yellow-500 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-2 text-yellow-300">Tingkatkan {building.name}</h2>
                <p className="text-lg mb-6">Tingkatkan dari Tingkat {building.level} ke <span className="text-green-400 font-bold">Tingkat {building.level + 1}</span></p>

                <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
                        <span className="text-gray-300">Waktu:</span>
                        <span className="font-semibold text-white">{formatTime(time)}</span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
                        <span className="text-gray-300">Biaya:</span>
                        <div className={`font-semibold flex items-center ${hasEnoughResources ? 'text-white' : 'text-red-500'}`}>
                            <span className="text-xl mr-2">{resourceIcons[resource]}</span>
                            {cost.toLocaleString('id-ID')} {resource}
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
                        onClick={() => onConfirm(building, cost, resource, time)}
                        disabled={!hasEnoughResources}
                        className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-500 transition-colors duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        Tingkatkan
                    </button>
                </div>
            </div>
        </div>
    );
};
