import React from 'react';
import { Player, Resource } from '../types';
import { ProgressBar } from './ProgressBar';

interface HeaderProps {
    player: Player;
    resources: Record<Resource, number>;
    warehouseCapacity: number;
}

const ResourceItem: React.FC<{ icon: string, value: number, name: string, capacity?: number }> = ({ icon, value, name, capacity }) => (
    <div className="flex items-center bg-gray-800 bg-opacity-50 p-2 rounded-lg shadow-md min-w-[120px]">
        <span className="text-2xl mr-2">{icon}</span>
        <div>
            <span className="font-bold">{value.toLocaleString('id-ID')}</span>
            {capacity && <span className="text-xs text-gray-400"> / {capacity.toLocaleString('id-ID')}</span>}
            <div className="text-xs text-gray-300">{name}</div>
        </div>
    </div>
);

export const Header: React.FC<HeaderProps> = ({ player, resources, warehouseCapacity }) => {
    const resourceIcons: Record<Resource, string> = {
        [Resource.Pangan]: "🍞",
        [Resource.Kayu]: "🪵",
        [Resource.Batu]: "🪨",
        [Resource.BijihBesi]: "⛏️",
        [Resource.Emas]: "🪙",
    };

    return (
        <header className="p-4 bg-black bg-opacity-30 backdrop-blur-sm sticky top-0 z-10">
            <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="text-center">
                        <div className="text-lg font-bold text-yellow-400">{player.name}</div>
                        <div className="text-sm">Tingkat: {player.level} | Istana: {player.istanaLevel}</div>
                    </div>
                     <div className="w-48">
                        <ProgressBar 
                            progress={(player.experience / player.expToNextLevel) * 100}
                            label={`EXP: ${player.experience.toLocaleString('id-ID')} / ${player.expToNextLevel.toLocaleString('id-ID')}`}
                        />
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <ResourceItem icon={resourceIcons.Pangan} value={resources.Pangan} name="Pangan" capacity={warehouseCapacity} />
                    <ResourceItem icon={resourceIcons.Kayu} value={resources.Kayu} name="Kayu" capacity={warehouseCapacity} />
                    <ResourceItem icon={resourceIcons.Batu} value={resources.Batu} name="Batu" capacity={warehouseCapacity} />
                    <ResourceItem icon={resourceIcons.BijihBesi} value={resources.BijihBesi} name="Bijih Besi" capacity={warehouseCapacity} />
                    <ResourceItem icon={resourceIcons.Emas} value={resources.Emas} name="Emas" />
                </div>
            </div>
        </header>
    );
};
