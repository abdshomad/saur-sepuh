import React from 'react';
import { Building, Timer } from '../types';
import { getUpgradeCost } from '../constants';
import { ProgressBar } from './ProgressBar';

interface BuildingCardProps {
    building: Building;
    onUpgradeClick: (building: Building) => void;
    timer?: Timer;
}

export const BuildingCard: React.FC<BuildingCardProps> = ({ building, onUpgradeClick, timer }) => {
    const { cost, resource, time } = getUpgradeCost(building.name, building.level + 1);
    
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const isLocked = building.level === 0;

    return (
        <div className={`bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-lg p-4 shadow-lg border border-gray-700 transition-all duration-300 hover:border-yellow-500 hover:shadow-yellow-500/20 ${isLocked ? 'opacity-60' : ''}`}>
            <div className="flex items-center mb-3">
                <span className="text-4xl mr-4">{building.icon}</span>
                <div>
                    <h3 className="text-xl font-bold">{building.name}</h3>
                    <p className="text-sm text-gray-400">Tingkat {building.level}</p>
                </div>
            </div>
            <p className="text-sm text-gray-300 mb-4 h-10">{building.description}</p>
            
            {timer ? (
                <div>
                    <p className="text-center text-yellow-400 mb-2">Meningkatkan ke Tingkat {timer.details.level}...</p>
                    <ProgressBar 
                        progress={((time - timer.timeLeft) / time) * 100} 
                        label={formatTime(timer.timeLeft)}
                    />
                </div>
            ) : (
                <button
                    onClick={() => onUpgradeClick(building)}
                    disabled={isLocked}
                    className="w-full bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-500 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    {isLocked ? 'Terkunci' : 'Tingkatkan'}
                </button>
            )}
        </div>
    );
};
