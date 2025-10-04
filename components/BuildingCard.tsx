import React from 'react';
import { Building, Timer, TroopType } from '../types';
import { getUpgradeCost, MILITARY_BUILDINGS, TROOP_STATS, BUILDING_TO_TROOP_MAP } from '../constants';
import { ProgressBar } from './ProgressBar';

interface BuildingCardProps {
    building: Building;
    onUpgradeClick: (building: Building) => void;
    onTrainClick: (building: Building) => void;
    upgradeTimer?: Timer;
    trainingTimer?: Timer;
    buildingSpeedBonus: number;
}

export const BuildingCard: React.FC<BuildingCardProps> = ({ building, onUpgradeClick, onTrainClick, upgradeTimer, trainingTimer, buildingSpeedBonus }) => {
    const originalUpgradeTime = getUpgradeCost(building.name, building.level + 1, 0).time;
    
    let originalTrainingTime = 0;
    if (trainingTimer && trainingTimer.details.name && trainingTimer.details.count) {
        const troopType = trainingTimer.details.name as TroopType;
        const troopStats = TROOP_STATS[troopType];
        if (troopStats) {
            originalTrainingTime = troopStats.time * trainingTimer.details.count;
        }
    }
    
    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        let timeString = '';
        if (h > 0) timeString += `${h.toString().padStart(2, '0')}:`;
        timeString += `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        return timeString;
    };

    const isLocked = building.level === 0;
    const isMilitary = MILITARY_BUILDINGS.includes(building.name);
    const isBusy = !!upgradeTimer || !!trainingTimer;

    const renderTimer = () => {
        if (upgradeTimer) {
            return (
                <div>
                    <p className="text-center text-yellow-400 mb-2">Meningkatkan ke Tkt. {upgradeTimer.details.level}...</p>
                    <ProgressBar 
                        progress={((originalUpgradeTime - upgradeTimer.timeLeft) / originalUpgradeTime) * 100} 
                        label={formatTime(upgradeTimer.timeLeft)}
                    />
                </div>
            );
        }
        if (trainingTimer) {
            return (
                 <div>
                    <p className="text-center text-green-400 mb-2">Melatih {trainingTimer.details.count} {trainingTimer.details.name}...</p>
                    <ProgressBar 
                        progress={((originalTrainingTime - trainingTimer.timeLeft) / originalTrainingTime) * 100} 
                        label={formatTime(trainingTimer.timeLeft)}
                    />
                </div>
            )
        }
        return null;
    }

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
            
            {isBusy ? renderTimer() : (
                <div className="flex gap-2">
                    <button
                        onClick={() => onUpgradeClick(building)}
                        disabled={isLocked}
                        className="w-full bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-500 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        {isLocked ? 'Terkunci' : 'Tingkatkan'}
                    </button>
                    {isMilitary && !isLocked && (
                        <button
                            onClick={() => onTrainClick(building)}
                            className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-500 transition-colors duration-200"
                        >
                            Latih
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};