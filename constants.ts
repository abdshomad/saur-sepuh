import { GameState, BuildingName, TroopType, Resource, Technology, Quest, QuestGoalType, Achievement, AchievementGoalType } from './types';

export const WAREHOUSE_CAPACITY_PER_LEVEL = 50000;

export const TROOP_STATS: Record<TroopType, {
    cost: Partial<Record<Resource, number>>;
    time: number; // seconds per unit
    building: BuildingName;
    attack: number;
    defense: number;
    icon: string;
}> = {
    [TroopType.PrajuritInfanteri]: {
        cost: { [Resource.Pangan]: 50, [Resource.BijihBesi]: 10 },
        time: 15,
        building: BuildingName.BarakPrajurit,
        attack: 10,
        defense: 10,
        icon: '⚔️',
    },
    [TroopType.Pemanah]: {
        cost: { [Resource.Pangan]: 30, [Resource.Kayu]: 40 },
        time: 25,
        building: BuildingName.LapanganPanah,
        attack: 12,
        defense: 8,
        icon: '🏹',
    },
    [TroopType.PrajuritBerkuda]: {
        cost: { [Resource.Pangan]: 100, [Resource.BijihBesi]: 50 },
        time: 60,
        building: BuildingName.KandangKuda,
        attack: 15,
        defense: 6,
        icon: '🐎',
    },
    [TroopType.MesinPengepung]: {
        cost: { [Resource.Kayu]: 150, [Resource.Batu]: 150 },
        time: 180,
        building: BuildingName.BengkelSenjata,
        attack: 20,
        defense: 4,
        icon: '⚙️',
    },
};

export const BUILDING_TO_TROOP_MAP: Partial<Record<BuildingName, TroopType>> = {
    [BuildingName.BarakPrajurit]: TroopType.PrajuritInfanteri,
    [BuildingName.LapanganPanah]: TroopType.Pemanah,
    [BuildingName.KandangKuda]: TroopType.PrajuritBerkuda,
    [BuildingName.BengkelSenjata]: TroopType.MesinPengepung,
};

export const MILITARY_BUILDINGS = Object.keys(BUILDING_TO_TROOP_MAP) as BuildingName[];

export const QUESTS: Record<string, Quest> = {
    'QUEST_1': {
        id: 'QUEST_1',
        title: "Fondasi Pangan",
        description: "Sang Prabu, lumbung kita perlu diperkuat. Tingkatkan Sawah hingga Tingkat 3 untuk memastikan pasokan pangan bagi rakyat dan prajurit.",
        goal: { type: QuestGoalType.BUILDING_LEVEL, buildingName: BuildingName.Sawah, target: 3 },
        rewards: { experience: 100, resources: { [Resource.Kayu]: 500, [Resource.Emas]: 10 } },
        nextQuestId: 'QUEST_2',
    },
    'QUEST_2': {
        id: 'QUEST_2',
        title: "Garda Madangkara",
        description: "Ancaman para durjana selalu mengintai. Latihlah 200 Prajurit Infanteri untuk menjaga keamanan ibukota.",
        goal: { type: QuestGoalType.TROOP_COUNT, troopType: TroopType.PrajuritInfanteri, target: 200 },
        rewards: { experience: 250, resources: { [Resource.Pangan]: 1000, [Resource.Emas]: 25 } },
        nextQuestId: 'QUEST_3',
    },
     'QUEST_3': {
        id: 'QUEST_3',
        title: "Ilmu Kanuragan",
        description: "Pengetahuan adalah kekuatan. Teliti 'Penempaan Pedang' di Perguruan untuk memperkuat bilah senjata para prajurit.",
        goal: { type: QuestGoalType.RESEARCH_TECH, techId: 'MILITER_1', target: 1 },
        rewards: { experience: 500, resources: { [Resource.BijihBesi]: 1500, [Resource.Emas]: 50 } },
        nextQuestId: null,
    },
};

export const ACHIEVEMENTS: Record<string, Achievement> = {
    'ACH_BUILD_1': {
        id: 'ACH_BUILD_1',
        title: "Arsitek Madangkara",
        description: "Tingkatkan Istana hingga Tingkat 5.",
        icon: '👑',
        goal: { type: AchievementGoalType.BUILDING_LEVEL, buildingName: BuildingName.Istana, target: 5 },
        rewards: { [Resource.Emas]: 100 }
    },
    'ACH_TROOP_1': {
        id: 'ACH_TROOP_1',
        title: "Panglima Perang",
        description: "Latih total 1,000 Prajurit Infanteri.",
        icon: '⚔️',
        goal: { type: AchievementGoalType.TROOP_COUNT, troopType: TroopType.PrajuritInfanteri, target: 1000 },
        rewards: { [Resource.Emas]: 100 }
    },
    'ACH_RESEARCH_1': {
        id: 'ACH_RESEARCH_1',
        title: "Cendekiawan Agung",
        description: "Selesaikan 3 penelitian di Perguruan.",
        icon: '🧠',
        goal: { type: AchievementGoalType.RESEARCH_COUNT, target: 3 },
        rewards: { [Resource.Emas]: 150 }
    },
    'ACH_RESOURCE_1': {
        id: 'ACH_RESOURCE_1',
        title: "Lumbung Emas",
        description: "Kumpulkan 100,000 Pangan.",
        icon: '🍞',
        goal: { type: AchievementGoalType.RESOURCE_AMOUNT, resource: Resource.Pangan, target: 100000 },
        rewards: { [Resource.Emas]: 50 }
    },
};

export const INITIAL_GAME_STATE: GameState = {
    player: {
        name: 'Brama Kumbara',
        level: 1,
        experience: 0,
        expToNextLevel: 1000,
        istanaLevel: 1,
        vipLevel: 1,
    },
    resources: {
        [Resource.Pangan]: 10000,
        [Resource.Kayu]: 10000,
        [Resource.Batu]: 10000,
        [Resource.BijihBesi]: 5000,
        [Resource.Emas]: 500,
    },
    warehouseCapacity: 0, // Dihitung saat startup berdasarkan level Gudang
    buildings: [
        { id: 1, name: BuildingName.Istana, level: 1, description: "Jantung kerajaanmu. Meningkatkannya akan membuka bangunan dan fitur baru.", icon: "🏰" },
        { id: 2, name: BuildingName.Sawah, level: 1, description: "Menghasilkan Pangan untuk prajurit dan rakyatmu.", icon: "🌾" },
        { id: 3, name: BuildingName.Penggergajian, level: 1, description: "Menghasilkan Kayu untuk pembangunan.", icon: "🪵" },
        { id: 4, name: BuildingName.TambangBatu, level: 1, description: "Menghasilkan Batu untuk bangunan tingkat lanjut.", icon: "🪨" },
        { id: 5, name: BuildingName.TambangBesi, level: 1, description: "Menghasilkan Bijih Besi untuk militer dan penelitian.", icon: "⛏️" },
        { id: 6, name: BuildingName.BarakPrajurit, level: 1, description: "Melatih Prajurit Infanteri.", icon: "⚔️" },
        { id: 7, name: BuildingName.LapanganPanah, level: 0, description: "Melatih Pemanah.", icon: "🏹" },
        { id: 8, name: BuildingName.KandangKuda, level: 0, description: "Melatih Prajurit Berkuda.", icon: "🐎" },
        { id: 9, name: BuildingName.BengkelSenjata, level: 0, description: "Menciptakan Mesin Pengepung.", icon: "⚙️" },
        { id: 10, name: BuildingName.Perguruan, level: 1, description: "Teliti teknologi dan ilmu kanuragan di sini.", icon: "📜" },
        { id: 11, name: BuildingName.Benteng, level: 1, description: "Mempertahankan kotamu dari penyerbu.", icon: "🧱" },
        { id: 12, name: BuildingName.Gudang, level: 1, description: "Meningkatkan kapasitas penyimpanan dan melindungi sumber dayamu dari penjarahan.", icon: "📦" },
        { id: 13, name: BuildingName.Tabib, level: 1, description: "Menyembuhkan prajuritmu yang terluka.", icon: "⚕️" },
    ],
    troops: Object.values(TroopType).map(type => ({
        type: type,
        count: type === TroopType.PrajuritInfanteri ? 100 : 0,
        attack: TROOP_STATS[type].attack,
        defense: TROOP_STATS[type].defense,
    })),
    timers: [],
    researchedTechnologies: [],
    currentQuestId: 'QUEST_1',
    completedAchievements: [],
};

export const BUILDING_UPGRADE_COST: Record<BuildingName, { resource: Resource, baseCost: number, growthFactor: number }> = {
    [BuildingName.Istana]: { resource: Resource.Kayu, baseCost: 1000, growthFactor: 2.5 },
    [BuildingName.Sawah]: { resource: Resource.Kayu, baseCost: 100, growthFactor: 1.5 },
    [BuildingName.Penggergajian]: { resource: Resource.Pangan, baseCost: 100, growthFactor: 1.5 },
    [BuildingName.TambangBatu]: { resource: Resource.Kayu, baseCost: 250, growthFactor: 1.6 },
    [BuildingName.TambangBesi]: { resource: Resource.Kayu, baseCost: 250, growthFactor: 1.6 },
    [BuildingName.BarakPrajurit]: { resource: Resource.Pangan, baseCost: 300, growthFactor: 1.8 },
    [BuildingName.LapanganPanah]: { resource: Resource.Kayu, baseCost: 500, growthFactor: 1.8 },
    [BuildingName.KandangKuda]: { resource: Resource.Pangan, baseCost: 500, growthFactor: 1.8 },
    [BuildingName.BengkelSenjata]: { resource: Resource.Batu, baseCost: 800, growthFactor: 2.0 },
    [BuildingName.Perguruan]: { resource: Resource.Kayu, baseCost: 600, growthFactor: 2.2 },
    [BuildingName.Benteng]: { resource: Resource.Batu, baseCost: 400, growthFactor: 1.9 },
    [BuildingName.Gudang]: { resource: Resource.Kayu, baseCost: 200, growthFactor: 1.7 },
    [BuildingName.Tabib]: { resource: Resource.Batu, baseCost: 300, growthFactor: 1.8 },
};

export const getUpgradeCost = (buildingName: BuildingName, level: number, buildingSpeedBonus: number = 0) => {
    const config = BUILDING_UPGRADE_COST[buildingName];
    if (!config) return { resource: Resource.Pangan, cost: Infinity, time: Infinity };
    const cost = Math.floor(config.baseCost * Math.pow(config.growthFactor, level - 1));
    let time = Math.floor(cost / 100) * 5; // 5 seconds per 100 resource cost
    time = Math.floor(time / (1 + buildingSpeedBonus / 100)); // Apply bonus
    return { resource: config.resource, cost, time };
};

export const TECHNOLOGY_TREE: Record<string, Technology> = {
    'KEMAJUAN_1': {
        id: 'KEMAJUAN_1',
        name: "Irigasi Modern",
        description: "Meningkatkan produksi Pangan sebesar 10%.",
        icon: "💧",
        category: 'Kemajuan',
        cost: { resource: Resource.Kayu, amount: 2000 },
        researchTime: 180, // 3 minutes
        bonus: { type: 'RESOURCE_PRODUCTION', resource: Resource.Pangan, percentage: 10 },
        dependencies: [],
        requiredBuildingLevel: { name: BuildingName.Perguruan, level: 1 },
    },
    'KEMAJUAN_2': {
        id: 'KEMAJUAN_2',
        name: "Gergaji Besi",
        description: "Meningkatkan produksi Kayu sebesar 10%.",
        icon: "🪚",
        category: 'Kemajuan',
        cost: { resource: Resource.Pangan, amount: 2000 },
        researchTime: 180, // 3 minutes
        bonus: { type: 'RESOURCE_PRODUCTION', resource: Resource.Kayu, percentage: 10 },
        dependencies: [],
        requiredBuildingLevel: { name: BuildingName.Perguruan, level: 1 },
    },
    'KEMAJUAN_3': {
        id: 'KEMAJUAN_3',
        name: "Arsitektur Dasar",
        description: "Mempercepat kecepatan pembangunan sebesar 5%.",
        icon: "📐",
        category: 'Kemajuan',
        cost: { resource: Resource.Batu, amount: 3000 },
        researchTime: 300, // 5 minutes
        bonus: { type: 'BUILDING_SPEED', percentage: 5 },
        dependencies: ['KEMAJUAN_1', 'KEMAJUAN_2'],
        requiredBuildingLevel: { name: BuildingName.Perguruan, level: 2 },
    },
    'MILITER_1': {
        id: 'MILITER_1',
        name: "Penempaan Pedang",
        description: "Meningkatkan serangan Prajurit Infanteri sebesar 5%.",
        icon: "🗡️",
        category: 'Militer',
        cost: { resource: Resource.BijihBesi, amount: 2500 },
        researchTime: 240, // 4 minutes
        bonus: { type: 'TROOP_ATTACK', troopType: TroopType.PrajuritInfanteri, percentage: 5 },
        dependencies: [],
        requiredBuildingLevel: { name: BuildingName.Perguruan, level: 1 },
    },
    'MILITER_2': {
        id: 'MILITER_2',
        name: "Baju Zirah Kulit",
        description: "Meningkatkan pertahanan Prajurit Infanteri sebesar 5%.",
        icon: "🛡️",
        category: 'Militer',
        cost: { resource: Resource.Pangan, amount: 3000 },
        researchTime: 240, // 4 minutes
        bonus: { type: 'TROOP_DEFENSE', troopType: TroopType.PrajuritInfanteri, percentage: 5 },
        dependencies: ['MILITER_1'],
        requiredBuildingLevel: { name: BuildingName.Perguruan, level: 2 },
    },
};