import { WalletDataState } from "@radixdlt/radix-dapp-toolkit";
import { rdt } from "../radix-dapp-toolkit/rdt";

class WalletError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'WalletError';
    }
}

export const fetchConnectedWallet = async (): Promise<WalletDataState> => {
    try {
        const walletData = rdt.walletApi.getWalletData();

        if (!walletData) {
            throw new WalletError('No wallet data available');
        }

        return walletData;
    } catch (error) {
        if (error instanceof WalletError) {
            throw error;
        }
        throw new WalletError('Failed to fetch wallet data');
    }
};
