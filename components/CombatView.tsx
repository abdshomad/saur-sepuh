import React, { useState } from 'react';
import { GameState, Troop, TroopType, Resource } from '../types';

interface CombatViewProps {
    gameState: GameState;
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

interface BattleReport {
    victory: boolean;
    playerLosses: Record<TroopType, number>;
    enemyLosses: number;
    rewards: {
        experience: number;
        resources: string;
    };
}

const MONSTERS = [
    { name: "Celeng Raksasa", power: 1000, type: TroopType.PrajuritInfanteri, rewards: { exp: 100, res: "1000 Pangan" } },
    { name: "Garuda", power: 3000, type: TroopType.PrajuritBerkuda, rewards: { exp: 300, res: "2000 Kayu" } },
    { name: "Raksasa Batu", power: 8000, type: TroopType.MesinPengepung, rewards: { exp: 800, res: "5000 Batu" } },
];

export const CombatView: React.FC<CombatViewProps> = ({ gameState, setGameState }) => {
    const [battleReport, setBattleReport] = useState<BattleReport | null>(null);

    const calculateArmyPower = (troops: Troop[]): number => {
        return troops.reduce((total, troop) => total + troop.count * troop.attack, 0);
    };
    
    const troopCounter: Record<TroopType, TroopType> = {
        [TroopType.PrajuritInfanteri]: TroopType.Pemanah,
        [TroopType.Pemanah]: TroopType.PrajuritBerkuda,
        [TroopType.PrajuritBerkuda]: TroopType.PrajuritInfanteri,
        [TroopType.MesinPengepung]: TroopType.PrajuritInfanteri, // Simplified
    };

    const handleAttack = (monster: typeof MONSTERS[0]) => {
        const playerArmyPower = calculateArmyPower(gameState.troops);
        
        // Counter bonus
        let finalPlayerPower = playerArmyPower;
        gameState.troops.forEach(troop => {
            if (troopCounter[troop.type] === monster.type) {
                finalPlayerPower += (troop.count * troop.attack) * 0.5; // 50% bonus
            }
        });

        const victory = finalPlayerPower > monster.power;
        const powerRatio = Math.min(finalPlayerPower / monster.power, 2);

        let playerLosses: Record<TroopType, number> = {
            [TroopType.PrajuritInfanteri]: 0,
            [TroopType.Pemanah]: 0,
            [TroopType.PrajuritBerkuda]: 0,
            [TroopType.MesinPengepung]: 0,
        };

        if (victory) {
            gameState.troops.forEach(troop => {
                const lossPercentage = 0.1 / powerRatio; // Fewer losses on decisive victory
                playerLosses[troop.type] = Math.floor(troop.count * lossPercentage);
            });
        } else {
             gameState.troops.forEach(troop => {
                const lossPercentage = 0.8 * (monster.power / finalPlayerPower);
                playerLosses[troop.type] = Math.floor(troop.count * Math.min(1, lossPercentage));
            });
        }

        setBattleReport({
            victory,
            playerLosses,
            enemyLosses: victory ? monster.power : Math.floor(finalPlayerPower),
            rewards: victory ? { experience: monster.rewards.exp, resources: monster.rewards.res } : { experience: 0, resources: "Tidak ada" }
        });
        
        // Apply changes to game state
        setGameState(prev => {
            const newTroops = prev.troops.map(troop => ({
                ...troop,
                count: troop.count - playerLosses[troop.type],
            }));

            let newPlayer = { ...prev.player };
            let newResources = { ...prev.resources };

            if(victory) {
                newPlayer.experience += monster.rewards.exp;
                const [amountStr, resType] = monster.rewards.res.split(' ');
                const amount = parseInt(amountStr);
                newResources[resType as keyof typeof newResources] += amount;
            }

            return { ...prev, troops: newTroops, player: newPlayer, resources: newResources };
        });
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-yellow-300">Peta Dunia (PvE)</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MONSTERS.map(monster => (
                    <div key={monster.name} className="bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-lg p-4 shadow-lg border border-red-700">
                        <h3 className="text-xl font-bold text-red-400">{monster.name}</h3>
                        <p>Kekuatan: {monster.power.toLocaleString('id-ID')}</p>
                        <p>Hadiah: {monster.rewards.exp} EXP, {monster.rewards.res}</p>
                        <p className="text-sm text-gray-400">Kuat Melawan: {troopCounter[monster.type]}</p>
                        <button onClick={() => handleAttack(monster)} className="mt-4 w-full bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-500 transition-colors">
                            Serang
                        </button>
                    </div>
                ))}
            </div>
            {battleReport && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className={`bg-gray-800 rounded-lg p-8 shadow-2xl border ${battleReport.victory ? 'border-green-500' : 'border-red-500'} max-w-lg w-full`}>
                        <h2 className={`text-3xl font-bold mb-4 ${battleReport.victory ? 'text-green-400' : 'text-red-400'}`}>
                            {battleReport.victory ? 'Kemenangan!' : 'Kekalahan!'}
                        </h2>
                        <div className="space-y-2">
                            <h4 className="font-bold text-lg">Korban di Pihakmu:</h4>
                            {Object.entries(battleReport.playerLosses).map(([type, count]) => count > 0 && (
                                <p key={type}>{type}: {count.toLocaleString('id-ID')}</p>
                            ))}
                            {battleReport.victory && (
                                <>
                                    <h4 className="font-bold text-lg mt-4">Hadiah yang Didapat:</h4>
                                    <p>Pengalaman: {battleReport.rewards.experience.toLocaleString('id-ID')}</p>
                                    <p>Sumber Daya: {battleReport.rewards.resources}</p>
                                </>
                            )}
                        </div>
                        <button onClick={() => setBattleReport(null)} className="mt-6 bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-yellow-500">
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
