import { fetchMockUserAssetVaults, fetchUserAssetVaults } from './VaultDataService';
import { UserAssetVault } from '../entities/UserAssetVault';
import { Competition } from '../entities/Competition';
import { gatewayApi } from '../radix-dapp-toolkit/rdt';
import { COMPETITION_ADDRESS } from '../../Config';
import { formatUnixTimestampToUTC } from '../etc/StringOperations';

export const fetchCompetitionData = async (): Promise<Competition> => {
    // Initialize start and end dates
    let startDate: string | null = null;
    let endDate: string | null = null;

    // Fetch competition ledger data
    const competitionLedgerData: any = await gatewayApi.state.getEntityDetailsVaultAggregated(
        COMPETITION_ADDRESS
    );

    // Extract competition start and end dates
    competitionLedgerData.details.state.fields.forEach((field: any) => {
        if (field.field_name === "competition_data") {
            field.fields.forEach((dataField: any) => {
                if (dataField.field_name === "competition_start") {
                    startDate = formatUnixTimestampToUTC(dataField.value);
                }
                if (dataField.field_name === "competition_end") {
                    endDate = formatUnixTimestampToUTC(dataField.value);
                }
            });
        }
    });

    // Validate extracted dates
    if (!startDate || !endDate) {
        throw new Error("Competition start or end date is missing.");
    }

    // Fetch user asset vaults
    const userVaults: UserAssetVault[] = await fetchUserAssetVaults();

    // Create and return the Competition object
    return {
        start_date: startDate,
        end_date: endDate,
        user_vault: userVaults,
    };
};