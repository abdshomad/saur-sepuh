import React, { useState } from 'react';
import { GameState, Technology } from '../types';
import { TECHNOLOGY_TREE } from '../constants';
import { ResearchCard } from './ResearchCard';
import { ResearchModal } from './ResearchModal';
import { ProgressBar } from './ProgressBar';

interface ResearchViewProps {
    gameState: GameState;
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export const ResearchView: React.FC<ResearchViewProps> = ({ gameState, setGameState }) => {
    const [selectedTech, setSelectedTech] = useState<Technology | null>(null);

    const handleResearchClick = (tech: Technology) => {
        setSelectedTech(tech);
    };

    const handleConfirmResearch = (tech: Technology) => {
        setGameState(prev => {
            if (prev.resources[tech.cost.resource] < tech.cost.amount) {
                alert("Sumber daya tidak cukup!");
                return prev;
            }

            if (prev.timers.some(t => t.type === 'research')) {
                alert("Anda sudah meneliti teknologi lain!");
                return prev;
            }

            const newResources = { ...prev.resources, [tech.cost.resource]: prev.resources[tech.cost.resource] - tech.cost.amount };
            const newTimer = {
                id: Date.now(), // Use a unique ID for research timer
                type: 'research' as const,
                timeLeft: tech.researchTime,
                details: { name: tech.id, level: 1 } // Store tech ID in name
            };

            return {
                ...prev,
                resources: newResources,
                timers: [...prev.timers, newTimer]
            };
        });
        setSelectedTech(null);
    };

    const categories = ['Kemajuan', 'Militer', 'Pertahanan', 'Medis'];
    const researchTimer = gameState.timers.find(t => t.type === 'research');
    const currentlyResearchingTech = researchTimer ? TECHNOLOGY_TREE[researchTimer.details.name] : null;

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h > 0 ? h.toString().padStart(2, '0') + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-yellow-300">Perguruan - Pohon Teknologi</h1>
            {researchTimer && currentlyResearchingTech ? (
                <div className="bg-gray-800 bg-opacity-80 p-4 rounded-lg mb-8 border border-blue-500">
                    <h3 className="text-xl font-semibold text-blue-300 mb-2">Sedang Meneliti: {currentlyResearchingTech.name}</h3>
                    <ProgressBar
                        progress={((currentlyResearchingTech.researchTime - researchTimer.timeLeft) / currentlyResearchingTech.researchTime) * 100}
                        label={formatTime(researchTimer.timeLeft)}
                    />
                </div>
            ) : (
                 <p className="mb-8 text-gray-300">Teliti teknologi baru untuk memperkuat kerajaanmu.</p>
            )}

            {categories.map(category => (
                <div key={category} className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-300 border-b-2 border-blue-800 pb-2">{category}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.values(TECHNOLOGY_TREE)
                            .filter(tech => tech.category === category)
                            .map(tech => (
                                <ResearchCard
                                    key={tech.id}
                                    tech={tech}
                                    gameState={gameState}
                                    onResearchClick={handleResearchClick}
                                    researchTimer={researchTimer}
                                />
                            ))}
                    </div>
                </div>
            ))}
            
            {selectedTech && (
                <ResearchModal
                    tech={selectedTech}
                    onClose={() => setSelectedTech(null)}
                    onConfirm={handleConfirmResearch}
                    resources={gameState.resources}
                />
            )}
        </div>
    );
};