import React from 'react';
import { GameState, Technology, Timer } from '../types';
import { TECHNOLOGY_TREE } from '../constants';

interface ResearchCardProps {
    tech: Technology;
    gameState: GameState;
    onResearchClick: (tech: Technology) => void;
    researchTimer?: Timer;
}

const checkDependencies = (tech: Technology, researched: string[]): boolean => {
    if (tech.dependencies.length === 0) return true;
    return tech.dependencies.every(depId => researched.includes(depId));
};

export const ResearchCard: React.FC<ResearchCardProps> = ({ tech, gameState, onResearchClick, researchTimer }) => {
    const isResearched = gameState.researchedTechnologies.includes(tech.id);
    const dependenciesMet = checkDependencies(tech, gameState.researchedTechnologies);
    const perguruan = gameState.buildings.find(b => b.name === tech.requiredBuildingLevel.name);
    const buildingLevelMet = perguruan ? perguruan.level >= tech.requiredBuildingLevel.level : false;
    const isResearchingThis = researchTimer?.details.name === tech.id;
    
    let buttonState = 'locked';
    let buttonText = 'Terkunci';

    if (isResearched) {
        buttonState = 'researched';
        buttonText = 'Telah Diteliti';
    } else if (isResearchingThis) {
        buttonState = 'researching';
        buttonText = 'Sedang Diteliti...';
    } else if (researchTimer) {
        buttonState = 'locked';
        buttonText = 'Perguruan Sibuk';
    } else if (dependenciesMet && buildingLevelMet) {
        buttonState = 'available';
        buttonText = 'Teliti';
    } else if (!buildingLevelMet) {
        buttonText = `Butuh ${tech.requiredBuildingLevel.name} Lv.${tech.requiredBuildingLevel.level}`;
    } else if (!dependenciesMet) {
        buttonText = 'Butuh Riset Lain';
    }

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}d`;
    };

    return (
        <div className={`bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-lg p-4 shadow-lg border border-gray-700 transition-all duration-300 ${buttonState === 'locked' || isResearched ? 'opacity-60' : 'hover:border-blue-500'}`}>
            <div className="flex items-center mb-3">
                <span className="text-4xl mr-4">{tech.icon}</span>
                <div>
                    <h3 className="text-xl font-bold">{tech.name}</h3>
                    <p className="text-sm text-gray-400">Biaya: {tech.cost.amount.toLocaleString('id-ID')} {tech.cost.resource}</p>
                    <p className="text-sm text-gray-400">Waktu: {formatTime(tech.researchTime)}</p>
                </div>
            </div>
            <p className="text-sm text-gray-300 mb-4 h-10">{tech.description}</p>
            {tech.dependencies.length > 0 && (
                <div className="mb-2 text-xs text-gray-500">
                    Butuh: {tech.dependencies.map(dep => TECHNOLOGY_TREE[dep]?.name || '').join(', ')}
                </div>
            )}
            <button
                onClick={() => onResearchClick(tech)}
                disabled={buttonState !== 'available'}
                className={`w-full font-bold py-2 px-4 rounded-lg transition-colors duration-200 ${
                    buttonState === 'available' ? 'bg-blue-600 hover:bg-blue-500 text-white' :
                    buttonState === 'researched' ? 'bg-green-700 text-white cursor-default' :
                    'bg-gray-600 text-gray-300 cursor-not-allowed'
                }`}
            >
                {buttonText}
            </button>
        </div>
    );
};