import React from 'react';
import { Achievement } from '../types';
import { ProgressBar } from './ProgressBar';

interface AchievementCardProps {
    achievement: Achievement;
    isUnlocked: boolean;
    progress: {
        current: number;
        target: number;
    };
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, isUnlocked, progress }) => {
    const { title, description, icon, rewards } = achievement;
    const rewardEmas = rewards.Emas || 0;

    return (
        <div className={`relative bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-lg p-4 shadow-lg border transition-all duration-300 ${isUnlocked ? 'border-yellow-500' : 'border-gray-700 opacity-70 hover:opacity-100'}`}>
            {isUnlocked && (
                <div className="absolute top-2 right-2 text-2xl" title="Telah Diraih">
                    🏆
                </div>
            )}
            <div className="flex items-start mb-3">
                <span className="text-4xl mr-4">{icon}</span>
                <div>
                    <h3 className={`text-xl font-bold ${isUnlocked ? 'text-yellow-300' : 'text-white'}`}>{title}</h3>
                    <p className="text-sm text-gray-400 h-10">{description}</p>
                </div>
            </div>
            
            {isUnlocked ? (
                 <div className="text-center text-green-400 font-semibold p-3 bg-gray-900 rounded-md">
                    Telah Diraih
                </div>
            ) : (
                <div>
                    <div className="text-xs text-gray-300 mb-1">Kemajuan:</div>
                    <ProgressBar 
                        progress={(progress.current / progress.target) * 100}
                        label={`${progress.current.toLocaleString('id-ID')} / ${progress.target.toLocaleString('id-ID')}`}
                    />
                    <div className="mt-2 text-center text-sm">
                        <span className="text-gray-400">Hadiah: </span>
                        <span className="font-bold text-yellow-400 flex items-center justify-center">
                            🪙 <span className="ml-1">{rewardEmas.toLocaleString('id-ID')}</span>
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};
