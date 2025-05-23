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
    Progress,
    Tooltip,
    Icon,
    HStack,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
} from "@chakra-ui/react";
import { routePageBoxStyle } from '../../libs/styles/RoutePageBox';
import { LayoutMode } from '../../types/layout';
import { useQuery } from '@tanstack/react-query';
import { fetchCompetitionData } from '../../libs/data_services/CompetitionDataService';
import { Competition as CompetitionEntity } from '../../libs/entities/Competition';
import { fetchPriceListMap } from '../../libs/data_services/PriceDataService';
import VaultWithUserInfo from '../../components/UserAssetVault/VaultWithUserInfo';
import { JoinButton } from '../../components/Button/JoinButton/JoinButton';
import { FaTrophy, FaUsers, FaClock, FaChartLine, FaMedal, FaCrown, FaHistory } from 'react-icons/fa';
import { UserAssetVault } from '../../libs/entities/UserAssetVault';
import PageContainer from '../../components/Container/PageContainer/PageContainer';

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

// Add PastCompetitions component
const PastCompetitions: React.FC = () => {
    const cardBgColor = useColorModeValue("gray.800", "gray.800");
    const borderColor = useColorModeValue("gray.700", "gray.700");
    const textColor = useColorModeValue("white", "white");
    const secondaryTextColor = useColorModeValue("gray.400", "gray.400");
    const accentColor = "green.400";

    const pastCompetitions = [
        {
            id: 1,
            name: "Summer Trading Championship 2024",
            startDate: "2024-02-01",
            endDate: "2024-02-28",
            participants: 256,
            totalPrize: "$50,000",
            winner: "TraderPro",
            winnerPrize: "$15,000",
            topPerformers: [
                { rank: 1, name: "TraderPro", prize: "$15,000" },
                { rank: 2, name: "CryptoKing", prize: "$10,000" },
                { rank: 3, name: "BlockchainQueen", prize: "$7,500" }
            ]
        },
        {
            id: 2,
            name: "Winter Duel Masters 2023",
            startDate: "2023-12-01",
            endDate: "2023-12-31",
            participants: 128,
            totalPrize: "$30,000",
            winner: "CryptoKing",
            winnerPrize: "$10,000",
            topPerformers: [
                { rank: 1, name: "CryptoKing", prize: "$10,000" },
                { rank: 2, name: "TraderPro", prize: "$7,000" },
                { rank: 3, name: "BlockchainQueen", prize: "$5,000" }
            ]
        }
    ];

    return (
        <Box p={8} bg={cardBgColor}>
            <Flex align="center" mb={6}>
                <Icon as={FaHistory} w={6} h={6} color={accentColor} mr={3} />
                <Heading size="lg" color={textColor}>Past Competitions</Heading>
            </Flex>
            <VStack spacing={6} align="stretch">
                {pastCompetitions.map((competition) => (
                    <Box
                        key={competition.id}
                        p={6}
                        bg="gray.800"
                        borderRadius="xl"
                        border="1px solid"
                        borderColor={borderColor}
                        _hover={{
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            borderColor: accentColor,
                        }}
                        transition="all 0.2s"
                    >
                        <Grid templateColumns="2fr 1fr" gap={6}>
                            <Box>
                                <Flex align="center" gap={3} mb={4}>
                                    <Icon as={FaTrophy} boxSize={6} color="yellow.400" />
                                    <Heading size="md" color={textColor}>{competition.name}</Heading>
                                </Flex>
                                <Text color={secondaryTextColor} mb={4}>
                                    {new Date(competition.startDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })} - {new Date(competition.endDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </Text>
                                <HStack spacing={4} mb={4}>
                                    <Badge colorScheme="green" px={3} py={1} borderRadius="full">
                                        {competition.participants} Participants
                                    </Badge>
                                    <Badge colorScheme="purple" px={3} py={1} borderRadius="full">
                                        Total Prize: {competition.totalPrize}
                                    </Badge>
                                </HStack>
                            </Box>
                            <Box>
                                <Table variant="unstyled" size="sm">
                                    <Thead>
                                        <Tr>
                                            <Th color={secondaryTextColor}>Rank</Th>
                                            <Th color={secondaryTextColor}>Trader</Th>
                                            <Th color={secondaryTextColor} isNumeric>Prize</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {competition.topPerformers.map((performer) => (
                                            <Tr key={performer.rank}>
                                                <Td color={textColor}>
                                                    <Flex align="center" gap={2}>
                                                        {performer.rank === 1 ? (
                                                            <Icon as={FaCrown} color="yellow.400" />
                                                        ) : (
                                                            <Icon as={FaMedal} color={performer.rank === 2 ? "gray.400" : "orange.400"} />
                                                        )}
                                                        #{performer.rank}
                                                    </Flex>
                                                </Td>
                                                <Td color={textColor}>{performer.name}</Td>
                                                <Td color={textColor} isNumeric>{performer.prize}</Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </Box>
                        </Grid>
                    </Box>
                ))}
            </VStack>
        </Box>
    );
};

const Competition: React.FC<CompetitionProps> = ({ layoutMode }) => {
    // Updated color scheme
    const bgColor = useColorModeValue("gray.900", "gray.900");
    const cardBgColor = useColorModeValue("gray.800", "gray.800");
    const borderColor = useColorModeValue("gray.700", "gray.700");
    const textColor = useColorModeValue("white", "white");
    const secondaryTextColor = useColorModeValue("gray.400", "gray.400");
    const accentColor = "green.400";
    const neonGlow = "0 0 10px rgba(72, 187, 120, 0.5)";

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
            <PageContainer layoutMode={layoutMode} maxW="container.xl">
                <Center h="100vh">
                    <Spinner size="xl" color={accentColor} />
                    <Text ml={4} fontSize="xl" color={textColor}>Loading competition data...</Text>
                </Center>
            </PageContainer>
        );
    }

    if (isError || priceError || !priceList) {
        return (
            <PageContainer layoutMode={layoutMode} maxW="container.xl">
                <Center h="100vh">
                    <Text fontSize="2xl" color="red.500">
                        Failed to load competition data. Please try again later.
                    </Text>
                </Center>
            </PageContainer>
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

    // Calculate time remaining
    const endDate = new Date(competitionData?.end_date || "2024-04-30");
    const now = new Date();
    const timeRemaining = endDate.getTime() - now.getTime();
    const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hoursRemaining = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const progressPercentage = ((30 - daysRemaining) / 30) * 100;

    return (
        <PageContainer layoutMode={layoutMode} maxW="container.xl">
            {/* Competition Header */}
            <Box
                p={8}
                bg="gray.800"
                borderBottom="1px solid"
                borderColor={borderColor}
                position="relative"
                _after={{
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "1px",
                    background: "linear-gradient(90deg, transparent, green.400, transparent)",
                    opacity: 0.5,
                }}
            >
                <Flex align="center" justify="space-between" mb={4}>
                    <Flex align="center">
                        <Icon as={FaTrophy} w={8} h={8} color={accentColor} mr={4} />
                        <Box>
                            <Heading size="xl" mb={2} color={textColor}>Free For All Competition</Heading>
                            <Text fontSize="lg" color={secondaryTextColor}>
                                Trade your way to the top of the leaderboard!
                            </Text>
                        </Box>
                    </Flex>
                    <JoinButton isConnected={false} />
                </Flex>

                {/* Stats Section */}
                <Grid templateColumns="repeat(4, 1fr)" gap={6} mt={8}>
                    <Box
                        p={4}
                        bg={cardBgColor}
                        borderRadius="xl"
                        border="1px solid"
                        borderColor={borderColor}
                    >
                        <Text color={secondaryTextColor} fontSize="sm" mb={1}>Total Participants</Text>
                        <Text color={textColor} fontSize="2xl" fontWeight="bold">{totalParticipants}</Text>
                        <HStack mt={2}>
                            <Icon as={FaUsers} color="green.400" />
                            <Text color="green.400" fontSize="sm">+{newParticipants} new today</Text>
                        </HStack>
                    </Box>
                    <Box
                        p={4}
                        bg={cardBgColor}
                        borderRadius="xl"
                        border="1px solid"
                        borderColor={borderColor}
                    >
                        <Text color={secondaryTextColor} fontSize="sm" mb={1}>Total Value</Text>
                        <Text color={textColor} fontSize="2xl" fontWeight="bold">${totalValue.toLocaleString()}</Text>
                        <HStack mt={2}>
                            <Icon as={FaChartLine} color="green.400" />
                            <Text color="green.400" fontSize="sm">+{dailyChange}% today</Text>
                        </HStack>
                    </Box>
                    <Box
                        p={4}
                        bg={cardBgColor}
                        borderRadius="xl"
                        border="1px solid"
                        borderColor={borderColor}
                    >
                        <Text color={secondaryTextColor} fontSize="sm" mb={1}>Time Remaining</Text>
                        <Text color={textColor} fontSize="2xl" fontWeight="bold">{daysRemaining}d</Text>
                        <HStack mt={2}>
                            <Icon as={FaClock} color={secondaryTextColor} />
                            <Text color={secondaryTextColor} fontSize="sm">{hoursRemaining}h remaining</Text>
                        </HStack>
                    </Box>
                    <Box
                        p={4}
                        bg={cardBgColor}
                        borderRadius="xl"
                        border="1px solid"
                        borderColor={borderColor}
                    >
                        <Text color={secondaryTextColor} fontSize="sm" mb={1}>Top Prize</Text>
                        <Text color={textColor} fontSize="2xl" fontWeight="bold">$10,000</Text>
                        <HStack mt={2}>
                            <Icon as={FaMedal} color="yellow.400" />
                            <Text color="yellow.400" fontSize="sm">1st Place Reward</Text>
                        </HStack>
                    </Box>
                </Grid>

                <Box mt={4}>
                    <Text color={secondaryTextColor} mb={2}>Competition Progress</Text>
                    <Tooltip label={`${daysRemaining}d ${hoursRemaining}h remaining`}>
                        <Progress
                            value={progressPercentage}
                            size="sm"
                            colorScheme="green"
                            bg="gray.700"
                            borderRadius="full"
                            hasStripe
                            isAnimated
                        />
                    </Tooltip>
                </Box>
            </Box>

            <Divider borderColor={borderColor} />

            {/* Leaderboard */}
            <Box p={8} bg={cardBgColor}>
                <Flex align="center" mb={6}>
                    <Icon as={FaMedal} w={6} h={6} color={accentColor} mr={3} />
                    <Heading size="lg" color={textColor}>Leaderboard</Heading>
                </Flex>
                <VStack spacing={4} align="stretch">
                    {rankedVaults.map((vault, index) => (
                        <Box
                            key={vault.userId}
                            position="relative"
                            transition="all 0.2s"
                            bg="gray.800"
                            borderRadius="lg"
                            border="1px solid"
                            borderColor={borderColor}
                            _hover={{
                                transform: "translateY(-2px)",
                                boxShadow: neonGlow,
                                borderColor: accentColor,
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
                                    boxShadow={neonGlow}
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

            <Divider borderColor={borderColor} />

            {/* Past Competitions */}
            <PastCompetitions />
        </PageContainer>
    );
};

export default Competition;
