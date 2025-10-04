import React from 'react';
import { GameState, Achievement, AchievementGoalType } from '../types';
import { ACHIEVEMENTS } from '../constants';
import { AchievementCard } from './AchievementCard';

interface AchievementsViewProps {
    gameState: GameState;
}

const getAchievementProgress = (achievement: Achievement, gameState: GameState): { current: number, target: number } => {
    const { goal } = achievement;
    switch (goal.type) {
        case AchievementGoalType.BUILDING_LEVEL:
            const building = gameState.buildings.find(b => b.name === goal.buildingName);
            return { current: building?.level || 0, target: goal.target };
        case AchievementGoalType.TROOP_COUNT:
            const troop = gameState.troops.find(t => t.type === goal.troopType);
            return { current: troop?.count || 0, target: goal.target };
        case AchievementGoalType.RESEARCH_COUNT:
            return { current: gameState.researchedTechnologies.length, target: goal.target };
        case AchievementGoalType.RESOURCE_AMOUNT:
            return { current: goal.resource ? gameState.resources[goal.resource] : 0, target: goal.target };
        default:
            return { current: 0, target: 1 };
    }
};

export const AchievementsView: React.FC<AchievementsViewProps> = ({ gameState }) => {
    const allAchievements = Object.values(ACHIEVEMENTS);
    const unlockedAchievements = allAchievements.filter(ach => gameState.completedAchievements.includes(ach.id));
    const lockedAchievements = allAchievements.filter(ach => !gameState.completedAchievements.includes(ach.id));

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-yellow-300">Gelar Kehormatan</h1>
            
            {unlockedAchievements.length > 0 && (
                 <div className="mb-10">
                    <h2 className="text-2xl font-semibold mb-4 text-yellow-300 border-b-2 border-yellow-800 pb-2">Gelar yang Telah Diraih</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {unlockedAchievements.map(ach => (
                            <AchievementCard 
                                key={ach.id}
                                achievement={ach}
                                isUnlocked={true}
                                progress={{ current: ach.goal.target, target: ach.goal.target }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {lockedAchievements.length > 0 && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-300 border-b-2 border-gray-700 pb-2">Gelar yang Tersedia</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {lockedAchievements.map(ach => (
                             <AchievementCard 
                                key={ach.id}
                                achievement={ach}
                                isUnlocked={false}
                                progress={getAchievementProgress(ach, gameState)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
