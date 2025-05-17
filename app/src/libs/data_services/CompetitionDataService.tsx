import { fetchMockUserAssetVaults, fetchUserAssetVaults } from './VaultDataService';
import { UserAssetVault } from '../entities/UserAssetVault';
import { Competition } from '../entities/Competition';
import { gatewayApi } from '../radix-dapp-toolkit/rdt';
import { COMPETITION_ADDRESS } from '../../Config';
import { formatUnixTimestampToUTC } from '../etc/StringOperations';

export const fetchCompetitionData = async (): Promise<Competition> => {
    try {
        // For testing, use mock data
        const userVaults = await fetchMockUserAssetVaults();

        // Create and return the Competition object with mock dates
        return {
            start_date: "2024-03-01T00:00:00Z",
            end_date: "2024-04-30T23:59:59Z",
            user_vault: userVaults,
        };
    } catch (error) {
        console.error("Error fetching competition data:", error);
        throw error;
    }
};