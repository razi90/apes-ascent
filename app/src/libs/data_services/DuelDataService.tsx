import { Duel } from "../entities/Duel";

export const fetchDuelsData = async (): Promise<Duel[]> => {
    // Simulate a network request delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mocked Duel Data
    return [
        {
            id: 'duel1',
            player1Id: '#0#',
            player2Id: '#1#',
            startDate: '2024-11-01',
            endDate: '2024-11-05',
            betAmount: 100,
            status: 'active',
            description: 'Best of 3 trades',
            createdAt: '2024-10-30T10:00:00Z',
            lastModified: '2024-10-30T10:00:00Z',
        },
        {
            id: 'duel2',
            player1Id: '#0#',
            player2Id: null,
            startDate: '2024-11-02',
            endDate: '2024-11-06',
            betAmount: 50,
            status: 'open',
            description: 'First to reach 10% profit',
            createdAt: '2024-10-31T15:00:00Z',
            lastModified: '2024-10-31T15:00:00Z',
        },
        {
            id: 'duel3',
            player1Id: '#2#',
            player2Id: '#3#',
            startDate: '2024-11-03',
            endDate: '2024-11-07',
            betAmount: 200,
            status: 'completed',
            winnerId: '#2#',
            description: 'Highest ROI wins',
            createdAt: '2024-11-01T09:00:00Z',
            lastModified: '2024-11-07T18:00:00Z',
        },
    ];
};

interface CreateDuelParams {
    startDate: string;
    duration: number; // in hours
    betAmount: number;
    player1Id: string;
    description?: string;
}

export const createDuel = async (params: CreateDuelParams): Promise<Duel> => {
    // Simulate a network request delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const startDate = new Date(params.startDate);
    const endDate = new Date(startDate.getTime() + params.duration * 60 * 60 * 1000);
    const now = new Date();

    // Mock response - in a real implementation, this would be a POST request to your backend
    const newDuel: Duel = {
        id: `duel${Date.now()}`, // Generate a unique ID
        player1Id: params.player1Id,
        player2Id: null, // Initially null as the duel is open for acceptance
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        betAmount: params.betAmount,
        status: 'open',
        description: params.description,
        createdAt: now.toISOString(),
        lastModified: now.toISOString(),
    };

    return newDuel;
};
