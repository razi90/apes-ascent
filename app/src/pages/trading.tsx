import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchUserAssetVaults } from '../libs/data_services/VaultDataService';
import { LayoutMode } from '../types/layout';
import { Center, Spinner, Text, VStack, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import VaultDetail from '../containers/VaultDetail/VaultDetail';

const TradingPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
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

    // If no vaults exist, show a message
    if (vaults.length === 0) {
        return (
            <Center h="100vh">
                <VStack spacing={4}>
                    <Text fontSize="2xl" color="white">
                        You don't have any vaults yet.
                    </Text>
                    <Button
                        colorScheme="green"
                        onClick={() => navigate('/free_for_all')}
                    >
                        Create a Vault
                    </Button>
                </VStack>
            </Center>
        );
    }

    // If no vaultId is provided, use the first vault
    const selectedVault = vaultId ? vaults.find(v => v.userId === vaultId) : vaults[0];

    if (!selectedVault) {
        return (
            <Center h="100vh">
                <VStack spacing={4}>
                    <Text fontSize="2xl" color="white">
                        Selected vault not found.
                    </Text>
                    <Button
                        colorScheme="green"
                        onClick={() => navigate('/free_for_all')}
                    >
                        Go to Vaults
                    </Button>
                </VStack>
            </Center>
        );
    }

    return <VaultDetail layoutMode={LayoutMode.DesktopExpanded} vault={selectedVault} />;
};

export default TradingPage;