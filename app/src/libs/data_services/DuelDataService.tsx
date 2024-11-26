import { Duel } from "../entities/Duel";

export const fetchDuelsData = async (): Promise<Duel[]> => {
    // Simulate a network request delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mocked Duel Data
    return [
        {
            id: 'duel1',
            player1Id: '#0#',
            player2Id: '#0#',
            startDate: '2024-11-01',
            endDate: '2024-11-05',
        },
        {
            id: 'duel2',
            player1Id: '#0#',
            player2Id: '#0#',
            startDate: '2024-11-02',
            endDate: '2024-11-06',
        },
        {
            id: 'duel3',
            player1Id: '#0#',
            player2Id: '#0#',
            startDate: '2024-11-03',
            endDate: '2024-11-07',
        },
    ];
};
