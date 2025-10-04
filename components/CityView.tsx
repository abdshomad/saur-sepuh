import React, { useState } from 'react';
import { GameState, Building as BuildingType, BuildingName } from '../types';
import { BuildingCard } from './BuildingCard';
import { UpgradeModal } from './UpgradeModal';
import { Timer } from '../types';

interface CityViewProps {
    gameState: GameState;
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export const CityView: React.FC<CityViewProps> = ({ gameState, setGameState }) => {
    const [selectedBuilding, setSelectedBuilding] = useState<BuildingType | null>(null);

    const handleUpgradeClick = (building: BuildingType) => {
        const isUpgrading = gameState.timers.some(t => t.id === building.id && t.type === 'building');
        if (isUpgrading) return;
        setSelectedBuilding(building);
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

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-yellow-300">Kerajaanmu</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {gameState.buildings
                    .filter(b => b.level > 0 || b.name === BuildingName.LapanganPanah || b.name === BuildingName.KandangKuda || b.name === BuildingName.BengkelSenjata)
                    .sort((a,b) => a.id - b.id)
                    .map(building => {
                        const timer = gameState.timers.find(t => t.id === building.id && t.type === 'building');
                        return (
                            <BuildingCard 
                                key={building.id} 
                                building={building}
                                onUpgradeClick={handleUpgradeClick}
                                timer={timer}
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
                />
            )}
        </div>
    );
};
