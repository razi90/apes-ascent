import { User } from '../entities/User';
import { USER_NFT_RESOURCE_ADDRESS } from '../../Config';
import { gatewayApi, rdt } from '../radix-dapp-toolkit/rdt';
import { WalletDataState } from '@radixdlt/radix-dapp-toolkit';
import { fetchConnectedWallet } from './WalletDataService';

// Type definitions for ledger data
interface NonFungibleData {
    data: {
        programmatic_json: {
            fields: Array<{
                value: string;
                kind: string;
                field_name: string;
            }>;
        };
    };
}

interface UserLedgerData {
    non_fungible_resources: {
        items: Array<{
            resource_address: string;
            vaults: {
                items: Array<{
                    items: string[];
                }>;
            };
        }>;
    };
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

interface NonFungibleLocation {
    owning_vault_parent_ancestor_address: string;
}

// Default user state
const createDefaultUser = (): User => ({
    account: undefined,
    persona: undefined,
    id: '',
    name: '',
    bio: '',
    avatar: '',
    twitter: '',
    telegram: '',
    discord: '',
    assets: new Map<string, number>(),
});

export const fetchUserInfo = async (): Promise<User> => {
    try {
        const walletData: WalletDataState = await fetchConnectedWallet();
        let user = createDefaultUser();

        if (walletData.accounts.length === 0) {
            return user;
        }

        user.account = walletData.accounts[0].address;
        user.persona = walletData.persona?.label;

        const userLedgerData = await gatewayApi.state.getEntityDetailsVaultAggregated(user.account) as UserLedgerData;
        user.id = getId(userLedgerData);

        if (user.id === '') {
            return user;
        }

        user = await getUserDataFromNft(user);
        user.assets = getUserAssets(userLedgerData);

        return user;
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
    }
};

export const fetchUserInfoByAccount = async (account: string): Promise<User> => {
    try {
        let user = createDefaultUser();
        user.account = account;
        user = await getUserDataFromNft(user);
        return user;
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
    }
};

export const fetchUserInfoById = async (userId: string): Promise<User> => {
    try {
        let user = createDefaultUser();
        user.id = userId;
        user = await getUserDataFromNft(user);
        user.account = await getUserAccount(userId);

        const userLedgerData = await gatewayApi.state.getEntityDetailsVaultAggregated(user.account) as UserLedgerData;
        user.assets = getUserAssets(userLedgerData);

        return user;
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
    }
};

async function getUserDataFromNft(user: User): Promise<User> {
    const userTokenLedgerData = await gatewayApi.state.getNonFungibleData(USER_NFT_RESOURCE_ADDRESS, user.id) as NonFungibleData;
    const userTokenData = userTokenLedgerData.data.programmatic_json.fields;

    user.name = getMetaData(userTokenData, "user_name");
    user.bio = getMetaData(userTokenData, "bio");
    user.avatar = getMetaData(userTokenData, "pfp_url");
    user.twitter = getMetaData(userTokenData, "twitter");
    user.telegram = getMetaData(userTokenData, "telegram");
    user.discord = getMetaData(userTokenData, "discord");

    return user;
}

function getId(userLedgerData: UserLedgerData): string {
    const userNft = userLedgerData.non_fungible_resources.items.find(
        item => item.resource_address === USER_NFT_RESOURCE_ADDRESS
    );

    return userNft?.vaults.items[0]?.items[0] || '';
}

function getMetaData(userTokenData: NonFungibleData['data']['programmatic_json']['fields'], key: string): string {
    const field = userTokenData.find(field => field.field_name === key);
    return field?.value || 'N/A';
}

function getUserAssets(userLedgerData: UserLedgerData): Map<string, number> {
    const assets = new Map<string, number>();

    userLedgerData.fungible_resources.items.forEach(item => {
        const address = item.resource_address;
        const amount = parseFloat(item.vaults.items[0].amount);
        assets.set(address, amount);
    });

    return assets;
}

async function getUserAccount(userId: string): Promise<string> {
    const userNftHolderData = await gatewayApi.state.getNonFungibleLocation(USER_NFT_RESOURCE_ADDRESS, [userId]) as NonFungibleLocation[];
    return userNftHolderData[0].owning_vault_parent_ancestor_address;
}