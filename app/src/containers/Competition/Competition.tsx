import React from 'react';
import {
    Box,
    Center,
    Flex,
    Text,
    Spinner,
    VStack,
    Spacer,
} from "@chakra-ui/react";
import { routePageBoxStyle } from '../../libs/styles/RoutePageBox';
import { LayoutMode } from '../../types/layout';
import { useQuery } from '@tanstack/react-query';
import { fetchCompetitionData } from '../../libs/data_services/CompetitionDataService';
import { Competition as CompetitionEntity } from '../../libs/entities/Competition';
import { fetchPriceListMap } from '../../libs/data_services/PriceDataService';
import VaultWithUserInfo from '../../components/UserAssetVault/VaultWithUserInfo';
import { JoinButton } from '../../components/Button/JoinButton/JoinButton';

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
                <Text ml={4} fontSize="xl" color="font.300">Loading competition or price data...</Text>
            </Center>
        );
    }

    if (isError || priceError || !priceList) {
        return (
            <Center>
                <Text fontSize="2xl" color="primary.300">
                    Failed to load competition or price data. Please try again later.
                </Text>
            </Center>
        );
    }

    if (!competitionData || competitionData.user_vault.length === 0) {
        return (
            <Center>
                <Text fontSize="2xl" color="font.700">
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
        <Box
            sx={routePageBoxStyle(layoutMode)}
            p={4}
            borderRadius="lg"
        >
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
                    {/* Competition Dates */}
                    <Box textAlign="center" mb={8} bg="transperent" p={4} borderRadius="md" >
                        <Text fontSize="lg" fontWeight="bold" color="font.900">
                            Competition Dates:
                        </Text>
                        <Text fontSize="md" color="font.600">
                            {`Start: ${competitionData.start_date}`}
                        </Text>
                        <Text fontSize="md" color="font.600">
                            {`End: ${competitionData.end_date}`}
                        </Text>
                    </Box>

                    {/* Join Button */}
                    <Box textAlign="center" mb={8}>
                        <JoinButton isConnected={false}></JoinButton>
                    </Box>

                    {/* Ranked Vaults */}
                    {rankedVaults.map((vault) => (
                        <VaultWithUserInfo
                            key={vault.userId}
                            vault={vault}
                            priceList={priceList}
                        />
                    ))}
                </VStack>
            </Flex>
        </Box>
    );
};

export default Competition;
