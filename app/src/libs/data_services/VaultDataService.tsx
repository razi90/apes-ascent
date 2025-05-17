import {
    KeyValueStoreKeysRequest,
    StateKeyValueStoreDataRequest,
    StateKeyValueStoreDataRequestKeyItem,
    StateKeyValueStoreKeysResponse,
    StateKeyValueStoreDataResponse,
    StateKeyValueStoreDataResponseItem,
    ProgrammaticScryptoSborValue,
} from "@radixdlt/babylon-gateway-api-sdk";
import { UserAssetVault } from "../entities/UserAssetVault";
import { USER_ASSET_VAULT_STORE } from "../../Config";
import { gatewayApi } from "../radix-dapp-toolkit/rdt";

class VaultError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'VaultError';
    }
}

interface LedgerEntry {
    key: {
        programmatic_json: ProgrammaticScryptoSborValue;
    };
    value: {
        programmatic_json: ProgrammaticScryptoSborValue;
    };
}

interface LedgerState {
    fungible_resources: {
        items: Array<{
            resource_address: string;
            vaults: {
                items: Array<{
                    amount: string;
                }>;
            };
        }>;
    };
}

export const fetchUserAssetVaults = async (): Promise<UserAssetVault[]> => {
    try {
        // Fetch the keys for the user asset vault store
        const keysResponse = await fetchKeys(USER_ASSET_VAULT_STORE);

        // Prepare the data request using the fetched keys
        const stateKeyValueStoreDataRequest = prepareDataRequest(
            USER_ASSET_VAULT_STORE,
            keysResponse
        );

        // Fetch user asset vault data from the ledger
        const userAssetVaultLedgerData = await fetchLedgerData(stateKeyValueStoreDataRequest);

        // Process each ledger entry into a UserAssetVault object
        const userAssetVaults = await processLedgerEntries(userAssetVaultLedgerData.entries as unknown as LedgerEntry[]);

        return userAssetVaults;
    } catch (error) {
        console.error("Error fetching user asset vaults:", error);
        throw new VaultError('Failed to fetch user asset vaults');
    }
};

export const fetchMockUserAssetVaults = async (): Promise<UserAssetVault[]> => {
    // Mock vaults with realistic data
    const vaults: UserAssetVault[] = [
        {
            userId: "#user1#",
            assets: new Map([
                ["xrd", 150000],
                ["btc", 2.5],
                ["eth", 15],
            ]),
        },
        {
            userId: "#user2#",
            assets: new Map([
                ["xrd", 120000],
                ["btc", 1.8],
                ["eth", 12],
            ]),
        },
        {
            userId: "#user3#",
            assets: new Map([
                ["xrd", 100000],
                ["btc", 1.5],
                ["eth", 10],
            ]),
        },
        {
            userId: "#user4#",
            assets: new Map([
                ["xrd", 80000],
                ["btc", 1.2],
                ["eth", 8],
            ]),
        },
        {
            userId: "#user5#",
            assets: new Map([
                ["xrd", 60000],
                ["btc", 1.0],
                ["eth", 6],
            ]),
        },
        {
            userId: "#user6#",
            assets: new Map([
                ["xrd", 40000],
                ["btc", 0.8],
                ["eth", 4],
            ]),
        },
        {
            userId: "#user7#",
            assets: new Map([
                ["xrd", 30000],
                ["btc", 0.6],
                ["eth", 3],
            ]),
        },
        {
            userId: "#user8#",
            assets: new Map([
                ["xrd", 20000],
                ["btc", 0.4],
                ["eth", 2],
            ]),
        },
    ];

    return new Promise((resolve) => setTimeout(() => resolve(vaults), 1000)); // Simulate async fetch
};

const fetchKeys = async (storeAddress: string): Promise<StateKeyValueStoreKeysResponse> => {
    try {
        const stateKeyValueStoreKeysRequest: KeyValueStoreKeysRequest = {
            stateKeyValueStoreKeysRequest: {
                key_value_store_address: storeAddress,
            },
        };
        return await gatewayApi.state.innerClient.keyValueStoreKeys(stateKeyValueStoreKeysRequest);
    } catch (error) {
        throw new VaultError('Failed to fetch vault keys');
    }
};

const prepareDataRequest = (
    storeAddress: string,
    keysResponse: StateKeyValueStoreKeysResponse
): StateKeyValueStoreDataRequest => {
    const keys: StateKeyValueStoreDataRequestKeyItem[] = keysResponse.items.map((key: { key: { raw_hex: string } }) => ({
        key_hex: key.key.raw_hex,
    }));

    return {
        key_value_store_address: storeAddress,
        keys,
    };
};

const fetchLedgerData = async (dataRequest: StateKeyValueStoreDataRequest): Promise<StateKeyValueStoreDataResponse> => {
    try {
        return await gatewayApi.state.innerClient.keyValueStoreData({
            stateKeyValueStoreDataRequest: dataRequest,
        });
    } catch (error) {
        throw new VaultError('Failed to fetch ledger data');
    }
};

const processLedgerEntries = async (entries: LedgerEntry[]): Promise<UserAssetVault[]> => {
    const userAssetVaults: UserAssetVault[] = [];

    for (const entry of entries) {
        const { userId, userVaultAddress } = extractUserVaultDetails(entry);

        // Fetch aggregated ledger state for the vault
        const ledger_state = await gatewayApi.state.getEntityDetailsVaultAggregated(userVaultAddress) as LedgerState;

        // Extract assets and their amounts from the ledger state
        const assets = extractAssets(ledger_state);

        // Create a UserAssetVault object
        userAssetVaults.push({ userId, assets });
    }

    return userAssetVaults;
};

const extractUserVaultDetails = (entry: LedgerEntry): { userId: string; userVaultAddress: string } => {
    const userId = (entry.key.programmatic_json as any).value;
    const userVaultAddress = (entry.value.programmatic_json as any).value;
    return { userId, userVaultAddress };
};

const extractAssets = (ledger_state: LedgerState): Map<string, number> => {
    const assets = new Map<string, number>();

    ledger_state.fungible_resources.items.forEach(item => {
        const resource_address = item.resource_address;
        const amount = parseFloat(item.vaults.items[0].amount);
        assets.set(resource_address, amount);
    });

    return assets;
};
