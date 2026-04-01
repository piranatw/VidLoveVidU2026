export type UserStatus = 'Single' | 'Not Single' | '???';
export type TransportMode = 'Walk' | 'Bike' | 'Motorcycle' | 'Bus' | 'Private Car' | 'Train' | 'Other';
export type UserType = 'Student' | 'Public' | 'Alumni';

export interface User {
    id: string; // UUID from Supabase or generated locally if offline
    type: UserType;
    name: string;
    gender: string;
    phone: string;
    status: UserStatus;
    transport: TransportMode;

    // Student specific
    studentId?: string;
    year?: string;

    // Meta
    registeredAt: string;
    hasEntryPass: boolean;
}

export interface LostItem {
    id: string;
    name: string;
    description: string;
    location: string;
    imageUrl?: string; // URL
    foundAt: string; // ISO date
    isClaimed: boolean;
    contactInfo?: string; // Optional, maybe hidden for public
}

// Game Engine Types
export type SceneType = 'narrative' | 'question' | 'pivot';

export interface Choice {
    text: string;
    traits: { [key: string]: number }; // e.g., { E: 1 }
    position?: {
        top?: string;
        left?: string;
        right?: string;
        bottom?: string;
    };
}

export interface GameScene {
    type: SceneType;
    text?: string; // For question scenes
    dialogue?: string[]; // For narrative scenes (multi-step)
    background?: string;
    choices?: Choice[];
}

export interface GameResult {
    id: string;
    userId: string;
    mbti: string; // e.g., 'INFP'
    archetype: string; // Key name e.g. "Just Us"
    archetypeTitle: string; // "Just Us (เพื่อน)"
    archetypeQuote: string;
    archetypeDescription: string;
    scores: {
        E: number;
        I: number;
        S: number;
        N: number;
        T: number;
        F: number;
        J: number;
        P: number;
    };
    playedAt: string;
}
