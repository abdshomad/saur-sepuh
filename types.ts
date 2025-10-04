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
    Kota = 'Kota',
    Pertempuran = 'Pertempuran',
    Penelitian = 'Penelitian',
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
    id: number; // Corresponds to building ID or research ID
    type: 'building' | 'research' | 'training';
    timeLeft: number; // in seconds
    details: { name: string; level: number };
}

export interface GameState {
    player: Player;
    resources: Record<Resource, number>;
    warehouseCapacity: number;
    buildings: Building[];
    troops: Troop[];
    timers: Timer[];
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
