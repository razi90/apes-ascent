import React from 'react';
import {
    Box,
    Flex,
    Text,
    Spinner,
} from "@chakra-ui/react";
import { useQuery } from '@tanstack/react-query';
import { fetchPriceListMap } from '../../libs/data_services/PriceDataService';
import { UserAssetVault } from '../../libs/entities/UserAssetVault';
import VaultWithUserInfo from '../../components/UserAssetVault/VaultWithUserInfo';

interface DuelProps {
    player1: UserAssetVault;
    player2: UserAssetVault;
}

const Duel: React.FC<DuelProps> = ({ player1, player2 }) => {
    // Fetch price list
    const { data: priceList, isLoading, isError } = useQuery<Record<string, number>>({
        queryKey: ['price_list'],
        queryFn: fetchPriceListMap,
    });

    if (isLoading) {
        return (
            <Flex justify="center" align="center" h="100vh">
                <Spinner size="xl" />
                <Text ml={4} fontSize="xl">Loading duel data...</Text>
            </Flex>
        );
    }

    if (isError || !priceList) {
        return (
            <Flex justify="center" align="center" h="100vh">
                <Text fontSize="2xl" color="red.500">
                    Failed to load price data. Please try again later.
                </Text>
            </Flex>
        );
    }

    return (
        <Flex
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            p={6}
            gap={6}
            h="100vh"
        >
            <VaultWithUserInfo vault={player1} priceList={priceList} />
            <Box>
                <Text fontSize="4xl" fontWeight="bold" color="gray.700" textAlign="center" mb={4}>
                    VS
                </Text>
            </Box>
            <VaultWithUserInfo vault={player2} priceList={priceList} />
        </Flex>
    );
};

export default Duel;
