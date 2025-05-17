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

// Mock user data for testing
const mockUsers: Record<string, User> = {
    "#user1#": {
        account: "account_1",
        persona: "CryptoKing",
        id: "#user1#",
        name: "CryptoKing",
        bio: "Crypto enthusiast and trader",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CryptoKing",
        twitter: "@cryptoking",
        telegram: "cryptoking",
        discord: "cryptoking#1234",
        assets: new Map(),
    },
    "#user2#": {
        account: "account_2",
        persona: "DiamondHands",
        id: "#user2#",
        name: "DiamondHands",
        bio: "HODL to the moon!",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DiamondHands",
        twitter: "@diamondhands",
        telegram: "diamondhands",
        discord: "diamondhands#1234",
        assets: new Map(),
    },
    "#user3#": {
        account: "account_3",
        persona: "MoonShot",
        id: "#user3#",
        name: "MoonShot",
        bio: "Always aiming for the stars",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MoonShot",
        twitter: "@moonshot",
        telegram: "moonshot",
        discord: "moonshot#1234",
        assets: new Map(),
    },
    "#user4#": {
        account: "account_4",
        persona: "HODLer",
        id: "#user4#",
        name: "HODLer",
        bio: "Diamond hands, diamond mind",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=HODLer",
        twitter: "@hodler",
        telegram: "hodler",
        discord: "hodler#1234",
        assets: new Map(),
    },
    "#user5#": {
        account: "account_5",
        persona: "TraderPro",
        id: "#user5#",
        name: "TraderPro",
        bio: "Professional crypto trader",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TraderPro",
        twitter: "@traderpro",
        telegram: "traderpro",
        discord: "traderpro#1234",
        assets: new Map(),
    },
    "#user6#": {
        account: "account_6",
        persona: "CryptoNinja",
        id: "#user6#",
        name: "CryptoNinja",
        bio: "Stealthy crypto operations",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CryptoNinja",
        twitter: "@cryptoninja",
        telegram: "cryptoninja",
        discord: "cryptoninja#1234",
        assets: new Map(),
    },
    "#user7#": {
        account: "account_7",
        persona: "BlockchainWizard",
        id: "#user7#",
        name: "BlockchainWizard",
        bio: "Master of the blockchain",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=BlockchainWizard",
        twitter: "@blockchainwiz",
        telegram: "blockchainwiz",
        discord: "blockchainwiz#1234",
        assets: new Map(),
    },
    "#user8#": {
        account: "account_8",
        persona: "DeFiMaster",
        id: "#user8#",
        name: "DeFiMaster",
        bio: "DeFi expert and yield farmer",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DeFiMaster",
        twitter: "@defimaster",
        telegram: "defimaster",
        discord: "defimaster#1234",
        assets: new Map(),
    },
};

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
        // Check if we have mock data for this user
        if (mockUsers[userId]) {
            return mockUsers[userId];
        }

        // If no mock data, proceed with real data fetching
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