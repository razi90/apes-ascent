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
import { fetchUserInfoById } from '../../libs/data_services/UserDataService';
import { UserAssetVault } from '../../libs/entities/UserAssetVault';
import { User } from '../../libs/entities/User';

interface CompetitionProps {
    layoutMode: LayoutMode;
}

const Competition: React.FC<CompetitionProps> = ({ layoutMode }) => {
    // Fetch all asset vaults
    const { data: assetVaults, isLoading, isError } = useQuery<UserAssetVault[]>({
        queryKey: ['asset_vault_info'],
        queryFn: fetchUserAssetVaults,
    });

    if (isLoading) {
        return (
            <Center>
                <Spinner size="xl" />
                <Text ml={4} fontSize="xl">Loading asset vaults...</Text>
            </Center>
        );
    }

    if (isError) {
        return (
            <Center>
                <Text fontSize="2xl" color="red.500">
                    Failed to load user asset vaults. Please try again later.
                </Text>
            </Center>
        );
    }

    if (!assetVaults || assetVaults.length === 0) {
        return (
            <Center>
                <Text fontSize="2xl" color="gray.500">
                    No user asset vaults found.
                </Text>
            </Center>
        );
    }

    return (
        <Box sx={routePageBoxStyle(layoutMode)}>
            <Flex
                w="100%"
                h="80vh"
                direction="column"
                alignItems="center"
                justifyContent="start"
            >
                <VStack
                    w="100%"
                    maxW="800px"
                    spacing={6}
                    alignItems="stretch"
                    mt={8}
                >
                    {assetVaults.map((vault) => (
                        <VaultWithUserInfo key={vault.userId} vault={vault} />
                    ))}
                </VStack>
            </Flex>
        </Box>
    );
};

interface VaultWithUserInfoProps {
    vault: UserAssetVault;
}

const VaultWithUserInfo: React.FC<VaultWithUserInfoProps> = ({ vault }) => {
    // Fetch user info for the given userId
    const { data: user, isLoading, isError } = useQuery<User>({
        queryKey: ['user_info', vault.userId],
        queryFn: () => fetchUserInfoById(vault.userId),
    });

    return (
        <Box
            p={4}
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            boxShadow="sm"
            _hover={{ boxShadow: "md", bg: "gray.50" }}
        >
            {isLoading && (
                <Text fontSize="sm" color="gray.500">
                    Loading user info...
                </Text>
            )}
            {isError && (
                <Text fontSize="sm" color="red.500">
                    Failed to load user info.
                </Text>
            )}
            {user && (
                <VStack align="start" spacing={2}>
                    <HStack justifyContent="space-between" w="100%">
                        <Text fontWeight="bold">User ID:</Text>
                        <Text>{user.id}</Text>
                    </HStack>
                    <HStack justifyContent="space-between" w="100%">
                        <Text fontWeight="bold">Name:</Text>
                        <Text>{user.name}</Text>
                    </HStack>
                    <HStack justifyContent="space-between" w="100%">
                        <Text fontWeight="bold">Email:</Text>
                        <Text>{user.account}</Text>
                    </HStack>
                </VStack>
            )}
            <Divider my={4} />
            <VStack align="start" spacing={2}>
                <Text fontWeight="bold">Assets:</Text>
                {Array.from(vault.assets.entries()).map(([asset, amount]) => (
                    <HStack key={asset} justifyContent="space-between" w="100%">
                        <Text>{asset}</Text>
                        <Text>{amount}</Text>
                    </HStack>
                ))}
            </VStack>
        </Box>
    );
};

export default Competition;
