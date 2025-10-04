import React from 'react';
import { GameState, Quest, QuestGoalType } from '../types';

interface QuestTrackerProps {
    quest: Quest;
    gameState: GameState;
}

const getQuestProgress = (quest: Quest, gameState: GameState): { current: number, target: number } => {
    const { goal } = quest;
    switch (goal.type) {
        case QuestGoalType.BUILDING_LEVEL:
            const building = gameState.buildings.find(b => b.name === goal.buildingName);
            return { current: building?.level || 0, target: goal.target };
        case QuestGoalType.TROOP_COUNT:
            const troop = gameState.troops.find(t => t.type === goal.troopType);
            return { current: troop?.count || 0, target: goal.target };
        case QuestGoalType.RESEARCH_TECH:
            const isResearched = gameState.researchedTechnologies.includes(goal.techId!);
            return { current: isResearched ? 1 : 0, target: 1 };
        default:
            return { current: 0, target: 1 };
    }
};

const QuestProgressBar: React.FC<{ current: number, target: number }> = ({ current, target }) => {
    const progress = target > 0 ? (current / target) * 100 : 0;
    return (
        <div className="w-full bg-gray-700 rounded-full h-4 mt-2 border border-gray-600 relative">
            <div
                className="bg-gradient-to-r from-purple-500 to-purple-400 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, progress)}%` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white text-shadow-sm">
                {current.toLocaleString('id-ID')} / {target.toLocaleString('id-ID')}
            </div>
        </div>
    );
};


export const QuestTracker: React.FC<QuestTrackerProps> = ({ quest, gameState }) => {
    const { current, target } = getQuestProgress(quest, gameState);
    const resourceIcons = { Pangan: "🍞", Kayu: "🪵", Batu: "🪨", BijihBesi: "⛏️", Emas: "🪙" };

    return (
        <div className="bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-lg p-4 mb-6 shadow-lg border border-purple-500">
            <h3 className="text-lg font-bold text-purple-300 flex items-center">
                <span className="mr-2 text-xl">📜</span> Titah Prabu: {quest.title}
            </h3>
            <p className="text-sm text-gray-300 mt-1">{quest.description}</p>
            
            <QuestProgressBar current={current} target={target} />

            <div className="mt-3 text-xs text-gray-400 flex items-center flex-wrap">
                <span className="font-semibold mr-2">Hadiah:</span>
                <span className="text-yellow-300 mr-3">{quest.rewards.experience.toLocaleString('id-ID')} EXP</span>
                {Object.entries(quest.rewards.resources).map(([res, amount]) => (
                    <span key={res} className="text-green-300 flex items-center mr-3">
                        {resourceIcons[res as keyof typeof resourceIcons]}
                        <span className="ml-1">
                            {amount.toLocaleString('id-ID')}
                        </span>
                    </span>
                ))}
            </div>
        </div>
    );
};