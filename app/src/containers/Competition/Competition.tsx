import React from 'react';
import {
    Box,
    Center,
    Flex,
    Text,
    Spinner,
    VStack,
    HStack,
    Image,
    Divider,
    Spacer,
} from "@chakra-ui/react";
import { routePageBoxStyle } from '../../libs/styles/RoutePageBox';
import { LayoutMode } from '../../Layout';
import { useQuery } from '@tanstack/react-query';
import { fetchUserInfoById } from '../../libs/data_services/UserDataService';
import { UserAssetVault } from '../../libs/entities/UserAssetVault';
import { User } from '../../libs/entities/User';
import { fetchCompetitionData } from '../../libs/data_services/CompetitionDataService';
import { Competition as CompetitionEntity } from '../../libs/entities/Competition';
import { fetchPriceListMap } from '../../libs/data_services/PriceDataService';
import { assetMap } from '../../libs/entities/Asset';


interface CompetitionProps {
    layoutMode: LayoutMode;
}

const Competition: React.FC<CompetitionProps> = ({ layoutMode }) => {
    // Fetch competition data
    const { data: competitionData, isLoading, isError } = useQuery<CompetitionEntity>({
        queryKey: ['competition_data'],
        queryFn: fetchCompetitionData,
    });

    // Fetch price list
    const { data: priceList, isLoading: priceLoading, isError: priceError } = useQuery<Record<string, number>>({
        queryKey: ['price_list'],
        queryFn: fetchPriceListMap,
    });

    if (isLoading || priceLoading) {
        return (
            <Center>
                <Spinner size="xl" />
                <Text ml={4} fontSize="xl">Loading competition or price data...</Text>
            </Center>
        );
    }

    if (isError || priceError || !priceList) {
        return (
            <Center>
                <Text fontSize="2xl" color="red.500">
                    Failed to load competition or price data. Please try again later.
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

    // Calculate rankings based on total asset values
    const rankedVaults = [...competitionData.user_vault].sort((a, b) => {
        const totalA = Array.from(a.assets.entries()).reduce((sum, [assetAddress, amount]) => {
            const price = priceList[assetAddress] || 0;
            return sum + amount * price;
        }, 0);

        const totalB = Array.from(b.assets.entries()).reduce((sum, [assetAddress, amount]) => {
            const price = priceList[assetAddress] || 0;
            return sum + amount * price;
        }, 0);

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
                            {`Start: ${competitionData.start_date}`}
                        </Text>
                        <Text fontSize="md" color="gray.500">
                            {`End: ${competitionData.end_date}`}
                        </Text>
                    </Box>

                    {rankedVaults.map((vault, index) => (
                        <VaultWithUserInfo key={vault.userId} vault={vault} rank={index + 1} priceList={priceList} />
                    ))}
                </VStack>
            </Flex>
        </Box>
    );
};


interface VaultWithUserInfoProps {
    vault: UserAssetVault;
    rank: number;
    priceList: Record<string, number>;
}

const VaultWithUserInfo: React.FC<VaultWithUserInfoProps> = ({ vault, rank, priceList }) => {
    // Fetch user info for the given userId
    const { data: user, isLoading, isError } = useQuery<User>({
        queryKey: ['user_info', vault.userId],
        queryFn: () => fetchUserInfoById(vault.userId),
    });

    // Calculate the total asset value
    const totalAssetValue = Array.from(vault.assets.entries()).reduce((sum, [assetAddress, amount]) => {
        const price = priceList[assetAddress] || 0;
        return sum + amount * price;
    }, 0);

    return (
        <Box
            p={6}
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            boxShadow="md"
            _hover={{ boxShadow: "lg", bg: "gray.50" }}
        >
            {/* Header Section */}
            <Flex alignItems="center" direction="column" mb={6}>
                {/* Profile Picture */}
                {isLoading ? (
                    <Spinner size="lg" />
                ) : isError ? (
                    <Text fontSize="sm" color="red.500">
                        Failed to load user info
                    </Text>
                ) : (
                    <Image
                        boxSize="80px"
                        borderRadius="full"
                        src={user?.avatar || "/images/ape-logo.webp"}
                        alt={`${user?.name}'s Avatar`}
                        mb={2}
                    />
                )}

                {/* User Name */}
                <Text fontWeight="bold" fontSize="lg">
                    {user?.name || 'Unknown User'}
                </Text>
            </Flex>

            <Divider my={4} />

            {/* Main Content */}
            <Flex direction={{ base: "column", md: "row" }} justifyContent="space-between" gap={4}>
                {/* Total Asset Value */}
                <Box
                    flex="1"
                    p={4}
                    borderRadius="md"
                    bg="gray.100"
                    textAlign="center"
                    boxShadow="sm"
                >
                    <Text fontSize="md" fontWeight="bold" mb={2}>
                        Total Asset Value
                    </Text>
                    <Text
                        fontSize="xl"
                        fontWeight="bold"
                        color={totalAssetValue > 10000 ? 'green.500' : 'red.500'}
                    >
                        ${totalAssetValue.toFixed(2)}
                    </Text>
                    <Text
                        fontSize="sm"
                        fontWeight="bold"
                        color={totalAssetValue > 10000 ? 'green.500' : 'red.500'}
                    >
                        Difference: ${Math.abs(totalAssetValue - 10000).toFixed(2)} (
                        {((Math.abs(totalAssetValue - 10000) / 10000) * 100).toFixed(2)}%)
                    </Text>
                </Box>

                {/* Assets List */}
                <Box flex="2">
                    <Text fontWeight="bold" fontSize="lg" mb={4}>
                        Assets
                    </Text>
                    {Array.from(vault.assets.entries()).map(([asset, amount]) => {
                        const price = priceList[asset] || 0; // Get the price for the asset or default to 0
                        const totalValue = amount * price; // Calculate the total value of the asset
                        const assetInfo = assetMap[asset]; // Get the asset information from the asset map

                        return (
                            <Flex
                                key={asset}
                                justifyContent="space-between"
                                alignItems="center"
                                py={2}
                                borderBottom="1px solid"
                                borderColor="gray.200"
                            >
                                {/* Asset Icon and Name */}
                                <HStack>
                                    {assetInfo?.symbol || <Text>Unknown</Text>}
                                    <Text ml={2} fontWeight="bold">{assetInfo?.ticker || 'Unknown Asset'}</Text>
                                </HStack>

                                {/* Total Value */}
                                <Text fontWeight="bold" textAlign="right" w="120px">
                                    ${totalValue.toFixed(2) || 'N/A'}
                                </Text>
                            </Flex>
                        );
                    })}
                </Box>
            </Flex>
        </Box>
    );
};

export default Competition;
