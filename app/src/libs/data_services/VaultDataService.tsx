import {
    KeyValueStoreKeysRequest,
    StateKeyValueStoreDataRequest,
    StateKeyValueStoreDataRequestKeyItem,
} from "@radixdlt/babylon-gateway-api-sdk";
import { UserAssetVault } from "../entities/UserAssetVault";
import { USER_ASSET_VAULT_STORE } from "../../Config";
import { gatewayApi } from "../radix-dapp-toolkit/rdt";

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
        const userAssetVaults = await processLedgerEntries(userAssetVaultLedgerData.entries);

        console.log(userAssetVaults);

        return userAssetVaults;
    } catch (error) {
        console.error("Error fetching user asset vaults:", error);
        throw error;
    }
};

const fetchKeys = async (storeAddress: string) => {
    const stateKeyValueStoreKeysRequest: KeyValueStoreKeysRequest = {
        stateKeyValueStoreKeysRequest: {
            key_value_store_address: storeAddress,
        },
    };
    return gatewayApi.state.innerClient.keyValueStoreKeys(stateKeyValueStoreKeysRequest);
};

const prepareDataRequest = (
    storeAddress: string,
    keysResponse: any
): StateKeyValueStoreDataRequest => {
    const keys: StateKeyValueStoreDataRequestKeyItem[] = keysResponse.items.map((key: any) => ({
        key_hex: key.key.raw_hex,
    }));

    return {
        key_value_store_address: storeAddress,
        keys,
    };
};

const fetchLedgerData = async (dataRequest: StateKeyValueStoreDataRequest) => {
    return gatewayApi.state.innerClient.keyValueStoreData({
        stateKeyValueStoreDataRequest: dataRequest,
    });
};

const processLedgerEntries = async (entries: any[]): Promise<UserAssetVault[]> => {
    const userAssetVaults: UserAssetVault[] = [];

    for (const entry of entries) {
        const { userId, userVaultAddress } = extractUserVaultDetails(entry);

        // Fetch aggregated ledger state for the vault
        const ledger_state = await gatewayApi.state.getEntityDetailsVaultAggregated(userVaultAddress);

        // Extract assets and their amounts from the ledger state
        const assets = extractAssets(ledger_state);

        // Create a UserAssetVault object
        userAssetVaults.push({ userId, assets });
    }

    return userAssetVaults;
};

const extractUserVaultDetails = (entry: any) => {
    const typedEntry = entry as any;
    const userId = typedEntry.key.programmatic_json.value;
    const userVaultAddress = typedEntry.value.programmatic_json.value;
    return { userId, userVaultAddress };
};

const extractAssets = (ledger_state: any): Map<string, number> => {
    const assets = new Map<string, number>();

    ledger_state.fungible_resources.items.forEach((item: any) => {
        const resource_address = item.resource_address;
        const amount = parseFloat(item.vaults.items[0].amount);
        assets.set(resource_address, amount);
    });

    return assets;
};
