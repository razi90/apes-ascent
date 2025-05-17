import { DataRequestBuilder, RadixDappToolkit, RadixNetwork, WalletDataState } from '@radixdlt/radix-dapp-toolkit';
import { GatewayApiClient } from '@radixdlt/babylon-gateway-api-sdk'
import { QueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { Subscription } from 'rxjs';

// Maximum number of retry attempts
const MAX_RETRY_ATTEMPTS = 3;
// Delay between retries in milliseconds
const RETRY_DELAY = 2000;

// Type for the Radix Dapp Toolkit configuration
interface RadixConfig {
    dAppDefinitionAddress: string;
    networkId: typeof RadixNetwork[keyof typeof RadixNetwork];
    applicationName: string;
    applicationVersion: string;
}

// Type for initialization result
interface InitResult {
    success: boolean;
    error?: string;
}

// Type for the global window object with our custom properties
declare global {
    interface Window {
        __radixSubscription?: Subscription;
    }
}

// Radix Dapp Toolkit configuration
const radixConfig: RadixConfig = {
    dAppDefinitionAddress: 'account_tdx_2_12ygy30qjq3w3gsrmwvm7y4e9y46kn9vyphyd54rd9ljqe63v9k05qe',
    networkId: RadixNetwork.Stokenet,
    applicationName: "Ape's Ascent",
    applicationVersion: '0.1.0',
};

export const rdt = RadixDappToolkit(radixConfig);

export const gatewayApi = GatewayApiClient.initialize(
    rdt.gatewayApi.clientConfig,
);

export const initRadixDappToolkit = async (
    queryClient: QueryClient,
    retryCount: number = 0
): Promise<InitResult> => {
    try {
        // Set up the wallet theme
        rdt.buttonApi.setTheme('white-with-outline');

        // Set up wallet data request
        rdt.walletApi.setRequestData(DataRequestBuilder.accounts().atLeast(1));

        // Subscribe to wallet data
        const subscription = rdt.walletApi.walletData$.subscribe((state: WalletDataState) => {
            queryClient.setQueryData<WalletDataState>(['wallet_data'], state);
        });

        // Store the subscription for cleanup
        window.__radixSubscription = subscription;

        return { success: true };
    } catch (error) {
        console.error('Failed to initialize Radix Dapp Toolkit:', error);

        if (retryCount < MAX_RETRY_ATTEMPTS) {
            console.log(`Retrying initialization (${retryCount + 1}/${MAX_RETRY_ATTEMPTS})...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return initRadixDappToolkit(queryClient, retryCount + 1);
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error during initialization'
        };
    }
};

export const cleanupRadixDappToolkit = (): void => {
    if (window.__radixSubscription) {
        window.__radixSubscription.unsubscribe();
        window.__radixSubscription = undefined;
    }
};

