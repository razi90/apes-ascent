import React from 'react';
import {
    Box,
    Center,
    Flex,
    Text,
    Spinner,
    VStack,
    Spacer,
    Heading,
    Badge,
    useColorModeValue,
    Grid,
    GridItem,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    Divider,
    Container,
} from "@chakra-ui/react";
import { routePageBoxStyle } from '../../libs/styles/RoutePageBox';
import { LayoutMode } from '../../types/layout';
import { useQuery } from '@tanstack/react-query';
import { fetchCompetitionData } from '../../libs/data_services/CompetitionDataService';
import { Competition as CompetitionEntity } from '../../libs/entities/Competition';
import { fetchPriceListMap } from '../../libs/data_services/PriceDataService';
import VaultWithUserInfo from '../../components/UserAssetVault/VaultWithUserInfo';
import { JoinButton } from '../../components/Button/JoinButton/JoinButton';
import { FaTrophy, FaUsers, FaClock } from 'react-icons/fa';
import { UserAssetVault } from '../../libs/entities/UserAssetVault';

// Dummy data for demonstration
const dummyVaults: UserAssetVault[] = [
    {
        userId: "#user1#",
        assets: new Map([
            ["xrd", 150000],
            ["btc", 2.5],
            ["eth", 15],
        ]),
    },
    {
        userId: "#user2#",
        assets: new Map([
            ["xrd", 120000],
            ["btc", 1.8],
            ["eth", 12],
        ]),
    },
    {
        userId: "#user3#",
        assets: new Map([
            ["xrd", 100000],
            ["btc", 1.5],
            ["eth", 10],
        ]),
    },
    {
        userId: "#user4#",
        assets: new Map([
            ["xrd", 80000],
            ["btc", 1.2],
            ["eth", 8],
        ]),
    },
    {
        userId: "#user5#",
        assets: new Map([
            ["xrd", 60000],
            ["btc", 1.0],
            ["eth", 6],
        ]),
    },
    {
        userId: "#user6#",
        assets: new Map([
            ["xrd", 40000],
            ["btc", 0.8],
            ["eth", 4],
        ]),
    },
    {
        userId: "#user7#",
        assets: new Map([
            ["xrd", 30000],
            ["btc", 0.6],
            ["eth", 3],
        ]),
    },
    {
        userId: "#user8#",
        assets: new Map([
            ["xrd", 20000],
            ["btc", 0.4],
            ["eth", 2],
        ]),
    },
];

// Dummy price list
const dummyPriceList = {
    "xrd": 0.5,
    "btc": 50000,
    "eth": 3000,
};

interface CompetitionProps {
    layoutMode: LayoutMode;
}

const Competition: React.FC<CompetitionProps> = ({ layoutMode }) => {
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const textColor = useColorModeValue("gray.800", "white");
    const secondaryTextColor = useColorModeValue("gray.600", "gray.400");

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
            <Center h="100vh">
                <Spinner size="xl" color="primary.500" />
                <Text ml={4} fontSize="xl" color={textColor}>Loading competition data...</Text>
            </Center>
        );
    }

    if (isError || priceError || !priceList) {
        return (
            <Center h="100vh">
                <Text fontSize="2xl" color="red.500">
                    Failed to load competition data. Please try again later.
                </Text>
            </Center>
        );
    }

    // Use dummy data for demonstration
    const displayVaults = competitionData?.user_vault.length ? competitionData.user_vault : dummyVaults;
    const displayPriceList = priceList || dummyPriceList;

    // Calculate rankings based on total asset values
    const rankedVaults = [...displayVaults].sort((a, b) => {
        const totalA = Array.from(a.assets.entries()).reduce((sum, [assetAddress, amount]) => {
            const price = displayPriceList[assetAddress] || 0;
            return sum + amount * price;
        }, 0);

        const totalB = Array.from(b.assets.entries()).reduce((sum, [assetAddress, amount]) => {
            const price = displayPriceList[assetAddress] || 0;
            return sum + amount * price;
        }, 0);

        return totalB - totalA; // Sort in descending order
    });

    // Calculate competition statistics
    const totalParticipants = rankedVaults.length;
    const totalValue = rankedVaults.reduce((sum, vault) => {
        return sum + Array.from(vault.assets.entries()).reduce((vaultSum, [assetAddress, amount]) => {
            const price = displayPriceList[assetAddress] || 0;
            return vaultSum + amount * price;
        }, 0);
    }, 0);

    // Calculate daily change (dummy data)
    const dailyChange = 23.36;
    const newParticipants = 5;

    return (
        <Container maxW="container.xl" py={8}>
            <Box
                sx={routePageBoxStyle(layoutMode)}
                bg={bgColor}
                borderRadius="xl"
                boxShadow="lg"
                border="1px solid"
                borderColor={borderColor}
                overflow="hidden"
            >
                {/* Competition Header */}
                <Box p={8} bg="primary.500" color="white">
                    <Heading size="xl" mb={2}>Free For All Competition</Heading>
                    <Text fontSize="lg" opacity={0.9}>
                        Trade your way to the top of the leaderboard!
                    </Text>
                </Box>

                {/* Competition Stats */}
                <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6} p={8}>
                    <GridItem>
                        <Stat>
                            <StatLabel color={secondaryTextColor}>Total Value</StatLabel>
                            <StatNumber color={textColor}>${totalValue.toLocaleString()}</StatNumber>
                            <StatHelpText>
                                <StatArrow type="increase" />
                                {dailyChange}%
                            </StatHelpText>
                        </Stat>
                    </GridItem>
                    <GridItem>
                        <Stat>
                            <StatLabel color={secondaryTextColor}>Participants</StatLabel>
                            <StatNumber color={textColor}>{totalParticipants}</StatNumber>
                            <StatHelpText>
                                <StatArrow type="increase" />
                                {newParticipants} new today
                            </StatHelpText>
                        </Stat>
                    </GridItem>
                    <GridItem>
                        <Stat>
                            <StatLabel color={secondaryTextColor}>Time Remaining</StatLabel>
                            <StatNumber color={textColor}>7d 12h</StatNumber>
                            <StatHelpText>
                                Ends {competitionData?.end_date || "2024-04-30"}
                            </StatHelpText>
                        </Stat>
                    </GridItem>
                </Grid>

                <Divider />

                {/* Join Button */}
                <Box p={8} textAlign="center">
                    <JoinButton isConnected={false} />
                </Box>

                {/* Leaderboard */}
                <Box p={8}>
                    <Heading size="lg" mb={6} color={textColor}>Leaderboard</Heading>
                    <VStack spacing={4} align="stretch">
                        {rankedVaults.map((vault, index) => (
                            <Box
                                key={vault.userId}
                                position="relative"
                                transition="all 0.2s"
                                _hover={{
                                    transform: "translateY(-2px)",
                                    boxShadow: "md",
                                }}
                            >
                                {index < 3 && (
                                    <Badge
                                        position="absolute"
                                        top={-2}
                                        right={-2}
                                        colorScheme={index === 0 ? "yellow" : index === 1 ? "gray" : "orange"}
                                        fontSize="md"
                                        px={3}
                                        py={1}
                                        borderRadius="full"
                                    >
                                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                                    </Badge>
                                )}
                                <VaultWithUserInfo
                                    vault={vault}
                                    priceList={displayPriceList}
                                />
                            </Box>
                        ))}
                    </VStack>
                </Box>
            </Box>
        </Container>
    );
};

export default Competition;
