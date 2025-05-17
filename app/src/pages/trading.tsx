import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchUserAssetVaults } from '../libs/data_services/VaultDataService';
import Trading from '../containers/Trading/Trading';
import { LayoutMode } from '../types/layout';
import { Center, Spinner, Text } from '@chakra-ui/react';

const TradingPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const vaultId = searchParams.get('vaultId');

    // Fetch vaults
    const { data: vaults, isLoading, isError } = useQuery({
        queryKey: ['user_asset_vaults'],
        queryFn: fetchUserAssetVaults,
    });

    if (isLoading) {
        return (
            <Center h="100vh">
                <Spinner size="xl" color="green.400" />
                <Text ml={4} fontSize="xl" color="white">Loading vault data...</Text>
            </Center>
        );
    }

    if (isError || !vaults) {
        return (
            <Center h="100vh">
                <Text fontSize="2xl" color="red.500">
                    Failed to load vault data. Please try again later.
                </Text>
            </Center>
        );
    }

    // Find the vault with the matching ID
    const vault = vaults.find(v => v.userId === vaultId);

    if (!vault) {
        return (
            <Center h="100vh">
                <Text fontSize="2xl" color="red.500">
                    Vault not found. Please try again.
                </Text>
            </Center>
        );
    }

    return <Trading layoutMode={LayoutMode.DesktopExpanded} vault={vault} />;
};

export default TradingPage;