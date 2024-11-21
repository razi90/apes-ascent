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
    Image,
} from "@chakra-ui/react";
import { routePageBoxStyle } from '../../libs/styles/RoutePageBox';
import { LayoutMode } from '../../Layout';
import { useQuery } from '@tanstack/react-query';
import { fetchUserInfoById } from '../../libs/data_services/UserDataService';
import { UserAssetVault } from '../../libs/entities/UserAssetVault';
import { User } from '../../libs/entities/User';
import { fetchMockCompetitionData } from '../../libs/data_services/CompetitionDataService';
import { Competition as CompetitionEntity } from '../../libs/entities/Competition';


interface CompetitionProps {
    layoutMode: LayoutMode;
}

const Competition: React.FC<CompetitionProps> = ({ layoutMode }) => {
    // Fetch competition data
    const { data: competitionData, isLoading, isError } = useQuery<CompetitionEntity>({
        queryKey: ['competition_data'],
        queryFn: fetchMockCompetitionData,
    });

    if (isLoading) {
        return (
            <Center>
                <Spinner size="xl" />
                <Text ml={4} fontSize="xl">Loading competition data...</Text>
            </Center>
        );
    }

    if (isError) {
        return (
            <Center>
                <Text fontSize="2xl" color="red.500">
                    Failed to load competition data. Please try again later.
                </Text>
            </Center>
        );
    }

    if (!competitionData || competitionData.user_vault.length === 0) {
        return (
            <Center>
                <Text fontSize="2xl" color="gray.500">
                    No user vaults found in the competition.
                </Text>
            </Center>
        );
    }

    // Calculate rankings based on total asset amounts
    const rankedVaults = [...competitionData.user_vault].sort((a, b) => {
        const totalA = Array.from(a.assets.values()).reduce((sum, amount) => sum + amount, 0);
        const totalB = Array.from(b.assets.values()).reduce((sum, amount) => sum + amount, 0);
        return totalB - totalA; // Sort in descending order
    });

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
                    <Box textAlign="center" mb={8}>
                        <Text fontSize="lg" fontWeight="bold" color="gray.700">
                            Competition Dates:
                        </Text>
                        <Text fontSize="md" color="gray.500">
                            {`Start: ${new Date(competitionData.start_date).toLocaleDateString()}`}
                        </Text>
                        <Text fontSize="md" color="gray.500">
                            {`End: ${new Date(competitionData.end_date).toLocaleDateString()}`}
                        </Text>
                    </Box>

                    {rankedVaults.map((vault, index) => (
                        <VaultWithUserInfo key={vault.userId} vault={vault} rank={index + 1} />
                    ))}
                </VStack>
            </Flex>
        </Box>
    );
};


interface VaultWithUserInfoProps {
    vault: UserAssetVault;
    rank: number;
}

const VaultWithUserInfo: React.FC<VaultWithUserInfoProps> = ({ vault, rank }) => {
    // Fetch user info for the given userId
    const { data: user, isLoading, isError } = useQuery<User>({
        queryKey: ['user_info', vault.userId],
        queryFn: () => fetchUserInfoById(vault.userId),
    });

    // Calculate the total assets for the user
    const totalAssets = Array.from(vault.assets.values()).reduce((sum, amount) => sum + amount, 0);

    return (
        <Box
            p={4}
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            boxShadow="sm"
            _hover={{ boxShadow: "md", bg: "gray.50" }}
        >
            <HStack spacing={4} alignItems="center" mb={4}>
                {/* Rank */}
                <Text fontSize="xl" fontWeight="bold" color="teal.500">
                    #{rank}
                </Text>

                {/* User Avatar */}
                {isLoading ? (
                    <Spinner size="sm" />
                ) : isError ? (
                    <Text fontSize="sm" color="red.500">
                        Failed to load user info
                    </Text>
                ) : (
                    <Image
                        boxSize="50px"
                        borderRadius="full"
                        src={user?.avatar || "/images/ape-logo.webp"}
                        alt={`${user?.name}'s Avatar`}
                    />
                )}

                {/* User Info */}
                <VStack align="start" spacing={1}>
                    <Text fontWeight="bold">{user?.name || 'Unknown User'}</Text>
                    <Text fontSize="sm" color="gray.500">
                        Total Assets: {totalAssets}
                    </Text>
                </VStack>
            </HStack>

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
