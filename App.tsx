import React, { useState, useEffect, useCallback } from 'react';
import { Building, GameState, Resource, Troop, View, GameEvent } from './types';
import { INITIAL_GAME_STATE } from './constants';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CityView } from './components/CityView';
import { CombatView } from './components/CombatView';
import { ResearchView } from './components/ResearchView';
import { EventModal } from './components/EventModal';
import { generateGameEvent } from './services/geminiService';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
    const [view, setView] = useState<View>(View.Kota);
    const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
    const [isEventLoading, setIsEventLoading] = useState<boolean>(false);

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
                const newResources = { ...prev.resources };
                let panganProduction = 0;
                let kayuProduction = 0;
                let batuProduction = 0;
                let bijihBesiProduction = 0;

                prev.buildings.forEach(building => {
                    switch (building.name) {
                        case 'Sawah': panganProduction += building.level * 5; break;
                        case 'Penggergajian': kayuProduction += building.level * 5; break;
                        case 'Tambang Batu': batuProduction += building.level * 5; break;
                        case 'Tambang Besi': bijihBesiProduction += building.level * 5; break;
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

                finishedTimers.forEach(timer => {
                    if (timer.type === 'building') {
                        newBuildings = newBuildings.map(b => b.id === timer.id ? { ...b, level: b.level + 1 } : b);
                        if (timer.details.name === 'Istana') {
                            newPlayer.istanaLevel += 1;
                        }
                    }
                });

                return {
                    ...prev,
                    resources: newResources,
                    timers: newTimers,
                    buildings: newBuildings,
                    player: newPlayer,
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
        switch (view) {
            case View.Kota:
                return <CityView gameState={gameState} setGameState={setGameState} />;
            case View.Pertempuran:
                return <CombatView gameState={gameState} setGameState={setGameState} />;
            case View.Penelitian:
                return <ResearchView />;
            default:
                return <CityView gameState={gameState} setGameState={setGameState} />;
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
