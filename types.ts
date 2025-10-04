export enum Resource {
    Pangan = 'Pangan',
    Kayu = 'Kayu',
    Batu = 'Batu',
    BijihBesi = 'BijihBesi',
    Emas = 'Emas',
}

export enum BuildingName {
    Istana = 'Istana',
    Sawah = 'Sawah',
    Penggergajian = 'Penggergajian',
    TambangBatu = 'Tambang Batu',
    TambangBesi = 'Tambang Besi',
    BarakPrajurit = 'Barak Prajurit',
    LapanganPanah = 'Lapangan Panah',
    KandangKuda = 'Kandang Kuda',
    BengkelSenjata = 'Bengkel Senjata',
    Perguruan = 'Perguruan',
    Benteng = 'Benteng',
    Gudang = 'Gudang',
    Tabib = 'Tabib',
}

export enum TroopType {
    PrajuritInfanteri = 'Prajurit Infanteri',
    Pemanah = 'Pemanah',
    PrajuritBerkuda = 'Prajurit Berkuda',
    MesinPengepung = 'Mesin Pengepung',
}

export enum View {
    Kerajaan = 'Kerajaan',
    Pertempuran = 'Pertempuran',
    Penelitian = 'Penelitian',
}

export enum QuestGoalType {
    BUILDING_LEVEL = 'BUILDING_LEVEL',
    TROOP_COUNT = 'TROOP_COUNT',
    RESEARCH_TECH = 'RESEARCH_TECH',
}

export interface Quest {
    id: string;
    title: string;
    description: string;
    goal: {
        type: QuestGoalType;
        buildingName?: BuildingName;
        troopType?: TroopType;
        techId?: string;
        target: number;
    };
    rewards: {
        experience: number;
        resources: Partial<Record<Resource, number>>;
    };
    nextQuestId: string | null;
}

export interface Player {
    name: string;
    level: number;
    experience: number;
    expToNextLevel: number;
    istanaLevel: number;
    vipLevel: number;
}

export interface Building {
    id: number;
    name: BuildingName;
    level: number;
    description: string;
    icon: string;
}

export interface Troop {
    type: TroopType;
    count: number;
    attack: number;
    defense: number;
}

export interface Timer {
    id: number; // Corresponds to building ID or a unique ID for research
    type: 'building' | 'research' | 'training';
    timeLeft: number; // in seconds
    details: { name: string; level?: number; count?: number }; // BuildingName, Tech ID or TroopType
}

export interface TechnologyBonus {
    type: 'RESOURCE_PRODUCTION' | 'TROOP_ATTACK' | 'TROOP_DEFENSE' | 'BUILDING_SPEED';
    resource?: Resource;
    troopType?: TroopType;
    percentage: number;
}

export interface Technology {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: 'Kemajuan' | 'Militer' | 'Pertahanan' | 'Medis';
    cost: {
        resource: Resource;
        amount: number;
    };
    researchTime: number; // in seconds
    bonus: TechnologyBonus;
    dependencies: string[]; // array of technology IDs
    requiredBuildingLevel: { name: BuildingName; level: number };
}

export interface GameState {
    player: Player;
    resources: Record<Resource, number>;
    warehouseCapacity: number;
    buildings: Building[];
    troops: Troop[];
    timers: Timer[];
    researchedTechnologies: string[];
    currentQuestId: string | null;
}

export interface GameEvent {
    title: string;
    description: string;
    choices: {
        text: string;
        consequences: {
            resource: Resource;
            amount: number;
        }[];
    }[];
}