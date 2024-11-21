import React from 'react';
import {
    Box,
    Center,
    Flex,
    Text,
    Spinner,
    VStack,
    HStack,
    Divider,
} from "@chakra-ui/react";
import { routePageBoxStyle } from '../../libs/styles/RoutePageBox';
import { LayoutMode } from '../../Layout';
import { useQuery } from '@tanstack/react-query';
import { fetchUserAssetVaults } from '../../libs/data_services/VaultDataService';
import { UserAssetVault } from '../../libs/entities/UserAssetVault';

interface CompetitionProps {
    layoutMode: LayoutMode;
}

const Competition: React.FC<CompetitionProps> = ({ layoutMode }) => {
    const { data: assetVaults, isLoading, isError } = useQuery<UserAssetVault[]>({
        queryKey: ['asset_vault_info'],
        queryFn: fetchUserAssetVaults,
    });

    return (
        <Box sx={routePageBoxStyle(layoutMode)}>
            <Flex
                w="100%"
                h="80vh"
                direction="column"
                alignItems="center"
                justifyContent="center"
            >
                {isLoading && (
                    <Center>
                        <Spinner size="xl" />
                        <Text ml={4} fontSize="xl">Loading asset vaults...</Text>
                    </Center>
                )}
                {isError && (
                    <Center>
                        <Text fontSize="2xl" color="red.500">
                            Failed to load user asset vaults. Please try again later.
                        </Text>
                    </Center>
                )}
                {assetVaults && assetVaults.length > 0 && (
                    <VStack
                        w="100%"
                        maxW="800px"
                        spacing={6}
                        alignItems="stretch"
                        mt={8}
                    >
                        {assetVaults.map((vault, index) => (
                            <Box
                                key={index}
                                p={4}
                                border="1px solid"
                                borderColor="gray.200"
                                borderRadius="md"
                                boxShadow="sm"
                                _hover={{ boxShadow: "md", bg: "gray.50" }}
                            >
                                <HStack justifyContent="space-between" mb={2}>
                                    <Text fontWeight="bold">User ID:</Text>
                                    <Text>{vault.userId}</Text>
                                </HStack>
                                <Divider />
                                <VStack align="start" spacing={2} mt={4}>
                                    <Text fontWeight="bold">Assets:</Text>
                                    {Array.from(vault.assets.entries()).map(([asset, amount]) => (
                                        <HStack key={asset} justifyContent="space-between" w="100%">
                                            <Text>{asset}</Text>
                                            <Text>{amount}</Text>
                                        </HStack>
                                    ))}
                                </VStack>
                            </Box>
                        ))}
                    </VStack>
                )}
                {!isLoading && !isError && assetVaults && assetVaults.length === 0 && (
                    <Center>
                        <Text fontSize="2xl" color="gray.500">
                            No user asset vaults found.
                        </Text>
                    </Center>
                )}
            </Flex>
        </Box>
    );
};

export default Competition;
