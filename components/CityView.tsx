import React, { useState } from 'react';
import { GameState, Building as BuildingType, BuildingName, Timer, TroopType, Resource } from '../types';
import { BuildingCard } from './BuildingCard';
import { UpgradeModal } from './UpgradeModal';
import { TrainingModal } from './TrainingModal';
// FIX: Import TROOP_STATS to fix a reference error.
import { BUILDING_TO_TROOP_MAP, TROOP_STATS } from '../constants';

interface CityViewProps {
    gameState: GameState;
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
    buildingSpeedBonus: number;
}

export const CityView: React.FC<CityViewProps> = ({ gameState, setGameState, buildingSpeedBonus }) => {
    const [selectedBuilding, setSelectedBuilding] = useState<BuildingType | null>(null);
    const [trainingBuilding, setTrainingBuilding] = useState<BuildingType | null>(null);

    const handleUpgradeClick = (building: BuildingType) => {
        const isUpgrading = gameState.timers.some(t => t.id === building.id && t.type === 'building');
        if (isUpgrading) return;
        setSelectedBuilding(building);
    };

    const handleTrainClick = (building: BuildingType) => {
        const isTraining = gameState.timers.some(t => t.id === building.id && t.type === 'training');
        if (isTraining) return;
        setTrainingBuilding(building);
    };

    const handleConfirmUpgrade = (building: BuildingType, cost: number, resource: string, time: number) => {
        setGameState(prev => {
            if (prev.resources[resource as keyof typeof prev.resources] < cost) {
                alert("Sumber daya tidak cukup!");
                return prev;
            }

            const newResources = { ...prev.resources, [resource]: prev.resources[resource as keyof typeof prev.resources] - cost };
            const newTimer: Timer = {
                id: building.id,
                type: 'building',
                timeLeft: time,
                details: { name: building.name, level: building.level + 1 }
            };

            return {
                ...prev,
                resources: newResources,
                timers: [...prev.timers, newTimer]
            };
        });
        setSelectedBuilding(null);
    };
    
    const handleConfirmTraining = (troopType: TroopType, quantity: number, totalCost: Partial<Record<Resource, number>>, totalTime: number) => {
        setGameState(prev => {
            if (!trainingBuilding) return prev;

            const hasEnough = Object.entries(totalCost).every(([res, amount]) => prev.resources[res as Resource] >= (amount || 0));
            if (!hasEnough) {
                alert("Sumber daya tidak cukup!");
                return prev;
            }

            if (prev.timers.some(t => t.id === trainingBuilding.id && t.type === 'training')) {
                 alert("Bangunan ini sudah melatih prajurit!");
                 return prev;
            }

            const newResources = { ...prev.resources };
            for (const [res, amount] of Object.entries(totalCost)) {
                newResources[res as Resource] -= (amount || 0);
            }

            const newTimer: Timer = {
                id: trainingBuilding.id,
                type: 'training',
                timeLeft: totalTime,
                details: { name: troopType, count: quantity }
            };

            return {
                ...prev,
                resources: newResources,
                timers: [...prev.timers, newTimer]
            };
        });
        setTrainingBuilding(null);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-yellow-300">Kerajaanmu</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {gameState.buildings
                    .filter(b => b.level > 0 || Object.values(BUILDING_TO_TROOP_MAP).some(troop => TROOP_STATS[troop].building === b.name))
                    .sort((a,b) => a.id - b.id)
                    .map(building => {
                        const upgradeTimer = gameState.timers.find(t => t.id === building.id && t.type === 'building');
                        const trainingTimer = gameState.timers.find(t => t.id === building.id && t.type === 'training');
                        return (
                            <BuildingCard 
                                key={building.id} 
                                building={building}
                                onUpgradeClick={handleUpgradeClick}
                                onTrainClick={handleTrainClick}
                                upgradeTimer={upgradeTimer}
                                trainingTimer={trainingTimer}
                                buildingSpeedBonus={buildingSpeedBonus}
                            />
                        );
                 })}
            </div>

            {selectedBuilding && (
                <UpgradeModal
                    building={selectedBuilding}
                    onClose={() => setSelectedBuilding(null)}
                    onConfirm={handleConfirmUpgrade}
                    resources={gameState.resources}
                    buildingSpeedBonus={buildingSpeedBonus}
                />
            )}
            
            {trainingBuilding && (
                <TrainingModal
                    building={trainingBuilding}
                    onClose={() => setTrainingBuilding(null)}
                    onConfirm={handleConfirmTraining}
                    resources={gameState.resources}
                />
            )}
        </div>
    );
};
