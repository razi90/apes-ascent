import { fetchMockUserAssetVaults } from './VaultDataService';
import { UserAssetVault } from '../entities/UserAssetVault';

export interface Competition {
    start_date: Date;
    end_date: Date;
    user_vault: UserAssetVault[];
}

export const fetchMockCompetitionData = async (): Promise<Competition> => {
    // Mock start and end dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 7); // Set the end date to 7 days later

    // Fetch user asset vaults
    const userVaults: UserAssetVault[] = await fetchMockUserAssetVaults();

    // Create and return a mock Competition object
    return {
        start_date: startDate,
        end_date: endDate,
        user_vault: userVaults,
    };
};
