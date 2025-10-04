import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Resource, View, GameEvent, TroopType } from './types';
import { INITIAL_GAME_STATE, TECHNOLOGY_TREE } from './constants';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CityView } from './components/CityView';
import { CombatView } from './components/CombatView';
import { ResearchView } from './components/ResearchView';
import { EventModal } from './components/EventModal';
import { generateGameEvent } from './services/geminiService';

const LOCAL_STORAGE_KEY = 'saur_sepuh_game_state';

const loadGameState = (): GameState => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Gabungkan dengan state awal untuk memastikan properti baru ditambahkan
      // jika state yang disimpan berasal dari versi yang lebih lama.
      const mergedState = {
        ...INITIAL_GAME_STATE,
        ...parsed,
        player: { ...INITIAL_GAME_STATE.player, ...(parsed.player || {}) },
        resources: { ...INITIAL_GAME_STATE.resources, ...(parsed.resources || {}) },
        buildings: parsed.buildings || INITIAL_GAME_STATE.buildings,
        troops: parsed.troops || INITIAL_GAME_STATE.troops,
        timers: parsed.timers || INITIAL_GAME_STATE.timers,
        researchedTechnologies: parsed.researchedTechnologies || INITIAL_GAME_STATE.researchedTechnologies,
      };
      return mergedState;
    }
  } catch (e) {
    console.error("Tidak dapat memuat state permainan dari local storage, memulai dari awal.", e);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
  return INITIAL_GAME_STATE;
};


const calculateBonuses = (researchedTechnologies: string[]) => {
    const bonuses = {
        resourceProduction: {} as Record<Resource, number>,
        troopAttack: {} as Record<TroopType, number>,
        troopDefense: {} as Record<TroopType, number>,
        buildingSpeed: 0,
    };

    researchedTechnologies.forEach(techId => {
        const tech = TECHNOLOGY_TREE[techId];
        if (!tech) return;
        switch (tech.bonus.type) {
            case 'RESOURCE_PRODUCTION':
                if (tech.bonus.resource) {
                    bonuses.resourceProduction[tech.bonus.resource] = (bonuses.resourceProduction[tech.bonus.resource] || 0) + tech.bonus.percentage;
                }
                break;
            case 'TROOP_ATTACK':
                 if (tech.bonus.troopType) {
                    bonuses.troopAttack[tech.bonus.troopType] = (bonuses.troopAttack[tech.bonus.troopType] || 0) + tech.bonus.percentage;
                }
                break;
            case 'TROOP_DEFENSE':
                 if (tech.bonus.troopType) {
                    bonuses.troopDefense[tech.bonus.troopType] = (bonuses.troopDefense[tech.bonus.troopType] || 0) + tech.bonus.percentage;
                }
                break;
            case 'BUILDING_SPEED':
                bonuses.buildingSpeed += tech.bonus.percentage;
                break;
        }
    });

    return bonuses;
};


const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(loadGameState);
    const [view, setView] = useState<View>(View.Kerajaan);
    const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
    const [isEventLoading, setIsEventLoading] = useState<boolean>(false);

    // Efek untuk menyimpan state permainan ke local storage setiap kali berubah
    useEffect(() => {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState));
        } catch (e) {
            console.error("Tidak dapat menyimpan state permainan ke local storage", e);
        }
    }, [gameState]);

    const triggerRandomEvent = useCallback(async () => {
        if (isEventLoading) return;
        setIsEventLoading(true);
        try {
            const event = await generateGameEvent();
            if (event) {
                setActiveEvent(event);
            }
        } catch (error) {
            console.error("Gagal membuat event permainan:", error);
        } finally {
            setIsEventLoading(false);
        }
    }, [isEventLoading]);

    useEffect(() => {
        const gameLoop = setInterval(() => {
            setGameState(prev => {
                const currentBonuses = calculateBonuses(prev.researchedTechnologies);
                const newResources = { ...prev.resources };
                let panganProduction = 0;
                let kayuProduction = 0;
                let batuProduction = 0;
                let bijihBesiProduction = 0;

                prev.buildings.forEach(building => {
                    let production = 0;
                    let resourceType: Resource | null = null;
                    switch (building.name) {
                        case 'Sawah': production = building.level * 5; resourceType = Resource.Pangan; break;
                        case 'Penggergajian': production = building.level * 5; resourceType = Resource.Kayu; break;
                        case 'Tambang Batu': production = building.level * 5; resourceType = Resource.Batu; break;
                        case 'Tambang Besi': production = building.level * 5; resourceType = Resource.BijihBesi; break;
                    }

                    if (resourceType) {
                        const bonusPercentage = currentBonuses.resourceProduction[resourceType] || 0;
                        production *= (1 + bonusPercentage / 100);

                        if (resourceType === Resource.Pangan) panganProduction += production;
                        else if (resourceType === Resource.Kayu) kayuProduction += production;
                        else if (resourceType === Resource.Batu) batuProduction += production;
                        else if (resourceType === Resource.BijihBesi) bijihBesiProduction += production;
                    }
                });

                newResources.Pangan = Math.min(prev.warehouseCapacity, newResources.Pangan + panganProduction);
                newResources.Kayu = Math.min(prev.warehouseCapacity, newResources.Kayu + kayuProduction);
                newResources.Batu = Math.min(prev.warehouseCapacity, newResources.Batu + batuProduction);
                newResources.BijihBesi = Math.min(prev.warehouseCapacity, newResources.BijihBesi + bijihBesiProduction);

                const newTimers = prev.timers.map(timer => ({ ...timer, timeLeft: timer.timeLeft - 1 })).filter(timer => timer.timeLeft > 0);
                const finishedTimers = prev.timers.filter(timer => timer.timeLeft <= 1);
                
                let newBuildings = [...prev.buildings];
                let newPlayer = {...prev.player};
                let newResearchedTechnologies = [...prev.researchedTechnologies];
                let newTroops = [...prev.troops];

                finishedTimers.forEach(timer => {
                    if (timer.type === 'building') {
                        newBuildings = newBuildings.map(b => b.id === timer.id ? { ...b, level: b.level + 1 } : b);
                        if (timer.details.name === 'Istana') {
                            newPlayer.istanaLevel += 1;
                        }
                    } else if (timer.type === 'research') {
                        if (!newResearchedTechnologies.includes(timer.details.name)) {
                            newResearchedTechnologies.push(timer.details.name);
                        }
                    } else if (timer.type === 'training') {
                        const troopType = timer.details.name as TroopType;
                        const count = timer.details.count || 0;
                        newTroops = newTroops.map(t => 
                            t.type === troopType ? { ...t, count: t.count + count } : t
                        );
                    }
                });

                return {
                    ...prev,
                    resources: newResources,
                    timers: newTimers,
                    buildings: newBuildings,
                    player: newPlayer,
                    researchedTechnologies: newResearchedTechnologies,
                    troops: newTroops,
                };
            });
        }, 1000);

        const eventTimer = setInterval(() => {
            // ~33% chance to trigger an event every 2 minutes
            if (Math.random() < 0.33) {
                triggerRandomEvent();
            }
        }, 120000); 

        return () => {
            clearInterval(gameLoop);
            clearInterval(eventTimer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleEventChoice = (consequences: { resource: Resource; amount: number }[]) => {
        setGameState(prev => {
            const newResources = { ...prev.resources };
            consequences.forEach(c => {
                newResources[c.resource] = Math.max(0, newResources[c.resource] + c.amount);
            });
            return { ...prev, resources: newResources };
        });
        setActiveEvent(null);
    };

    const renderView = () => {
        const bonuses = calculateBonuses(gameState.researchedTechnologies);
        switch (view) {
            case View.Kerajaan:
                return <CityView gameState={gameState} setGameState={setGameState} buildingSpeedBonus={bonuses.buildingSpeed} />;
            case View.Pertempuran:
                return <CombatView gameState={gameState} setGameState={setGameState} bonuses={{ troopAttack: bonuses.troopAttack, troopDefense: bonuses.troopDefense }} />;
            case View.Penelitian:
                return <ResearchView gameState={gameState} setGameState={setGameState} />;
            default:
                return <CityView gameState={gameState} setGameState={setGameState} buildingSpeedBonus={bonuses.buildingSpeed} />;
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans bg-cover bg-center" style={{backgroundImage: "url('https://picsum.photos/seed/madangkara/1920/1080')"}}>
            <div className="bg-black bg-opacity-70 min-h-screen">
                <Header player={gameState.player} resources={gameState.resources} warehouseCapacity={gameState.warehouseCapacity} />
                <div className="flex">
                    <Sidebar setView={setView} activeView={view} />
                    <main className="flex-1 p-4 md:p-6 lg:p-8">
                        {renderView()}
                    </main>
                </div>
                {activeEvent && (
                    <EventModal 
                        event={activeEvent}
                        onChoice={handleEventChoice}
                        onClose={() => setActiveEvent(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default App;