import React, { useState, useMemo } from 'react';
import { Building, Resource, TroopType } from '../types';
import { TROOP_STATS, BUILDING_TO_TROOP_MAP } from '../constants';

interface TrainingModalProps {
    building: Building;
    onClose: () => void;
    onConfirm: (troopType: TroopType, quantity: number, totalCost: Partial<Record<Resource, number>>, totalTime: number) => void;
    resources: Record<Resource, number>;
}

const resourceIcons: Record<Resource, string> = {
    [Resource.Pangan]: "🍞",
    [Resource.Kayu]: "🪵",
    [Resource.Batu]: "🪨",
    [Resource.BijihBesi]: "⛏️",
    [Resource.Emas]: "🪙",
};

export const TrainingModal: React.FC<TrainingModalProps> = ({ building, onClose, onConfirm, resources }) => {
    const [quantity, setQuantity] = useState(1);

    const troopType = useMemo(() => BUILDING_TO_TROOP_MAP[building.name], [building.name]);
    
    if (!troopType) {
        // This should not happen if the modal is opened correctly
        return null;
    }

    const troopStats = TROOP_STATS[troopType];

    const maxTrainable = useMemo(() => {
        let max = Infinity;
        for (const [resource, cost] of Object.entries(troopStats.cost)) {
            const amountPlayerHas = resources[resource as Resource] || 0;
            const maxForThisResource = Math.floor(amountPlayerHas / cost);
            if (maxForThisResource < max) {
                max = maxForThisResource;
            }
        }
        return max === Infinity ? 0 : max;
    }, [resources, troopStats.cost]);

    if (quantity > maxTrainable && maxTrainable > 0) {
        setQuantity(maxTrainable);
    } else if (maxTrainable === 0 && quantity > 0) {
        setQuantity(0);
    }

    const totalCost = useMemo(() => {
        const cost: Partial<Record<Resource, number>> = {};
        for (const [resource, amount] of Object.entries(troopStats.cost)) {
            cost[resource as Resource] = amount * quantity;
        }
        return cost;
    }, [quantity, troopStats.cost]);

    const totalTime = troopStats.time * quantity;
    const canTrain = quantity > 0 && maxTrainable > 0;

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h > 0 ? h + 'j ' : ''}${m > 0 ? m + 'm ' : ''}${s}d`;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-8 shadow-2xl border border-green-500 max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-2 text-green-300">Latih {troopType}</h2>
                <p className="text-sm mb-4 text-gray-400">di {building.name} Tingkat {building.level}</p>

                <div className="flex items-center bg-gray-900 p-4 rounded-lg mb-6">
                    <span className="text-6xl mr-6">{troopStats.icon}</span>
                    <div>
                        <h3 className="text-xl font-bold">{troopType}</h3>
                        <p className="text-sm text-yellow-400">Serangan: {troopStats.attack}</p>
                        <p className="text-sm text-blue-400">Pertahanan: {troopStats.defense}</p>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center">
                        <label htmlFor="quantity" className="font-semibold">Jumlah:</label>
                        <span className="text-2xl font-bold text-white">{quantity.toLocaleString('id-ID')}</span>
                    </div>
                    <input
                        id="quantity"
                        type="range"
                        min="0"
                        max={maxTrainable}
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        disabled={maxTrainable === 0}
                    />
                    <div className="text-xs text-right text-gray-400">Maks: {maxTrainable.toLocaleString('id-ID')}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                     <div className="bg-gray-700 p-3 rounded-md text-center">
                        <span className="text-gray-300 block">Total Waktu:</span>
                        <span className="font-semibold text-white text-lg">{formatTime(totalTime)}</span>
                    </div>
                     <div className="bg-gray-700 p-3 rounded-md text-center">
                        <span className="text-gray-300 block">Total Biaya:</span>
                        <div className="font-semibold text-white text-lg flex justify-center items-center gap-2">
                             {Object.entries(totalCost).map(([resource, cost]) => (
                                 <div key={resource} className={`flex items-center gap-1 ${resources[resource as Resource] < cost ? 'text-red-500' : 'text-white'}`}>
                                     <span>{resourceIcons[resource as Resource]}</span>
                                     <span>{cost.toLocaleString('id-ID')}</span>
                                 </div>
                             ))}
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
                        onClick={() => onConfirm(troopType, quantity, totalCost, totalTime)}
                        disabled={!canTrain}
                        className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-500 transition-colors duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        Latih
                    </button>
                </div>
            </div>
        </div>
    );
};