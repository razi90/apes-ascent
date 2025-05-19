export interface Duel {
    id: string;
    player1Id: string;
    player2Id: string | null; // null when the duel is open for acceptance
    startDate: string;
    endDate: string;
    betAmount: number;
    status: 'open' | 'active' | 'completed' | 'cancelled';
    winnerId?: string; // Only set when status is 'completed'
    description?: string; // Optional description of the duel rules/conditions
    createdAt: string; // When the duel was created
    lastModified: string; // Last time the duel was modified
}

// Duel configuration constants
export const DUEL_CONFIG = {
    MIN_DURATION_HOURS: 1,
    MAX_DURATION_HOURS: 168, // 1 week
    MIN_BET_AMOUNT: 10, // Minimum bet amount in XRD
    MAX_BET_AMOUNT: 10000, // Maximum bet amount in XRD
    MAX_OPEN_DUELS: 3, // Maximum number of open duels a player can have
} as const;