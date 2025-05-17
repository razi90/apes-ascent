import React, { useState } from 'react';
import {
    Box,
    Flex,
    VStack,
    Text,
    Image,
    Spinner,
    Divider,
    Badge,
    Button,
    Container,
    Heading,
    useColorModeValue,
    Icon,
    HStack,
    Input,
    Select,
    Progress,
    Tooltip,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
    Grid,
} from "@chakra-ui/react";
import { useQuery } from '@tanstack/react-query';
import { Duel as DuelEntity } from '../../libs/entities/Duel';
import { fetchUserInfoById } from '../../libs/data_services/UserDataService';
import { fetchDuelsData } from '../../libs/data_services/DuelDataService';
import { LayoutMode } from '../../types/layout';
import { User } from '../../libs/entities/User';
import { routePageBoxStyle } from '../../libs/styles/RoutePageBox';
import { GiSwordman, GiCrossedSwords } from 'react-icons/gi';
import { FaClock, FaTrophy, FaCoins, FaChartLine, FaSearch, FaFilter, FaEye, FaSort } from 'react-icons/fa';
import { OutlineButton } from '../../components/Button/OutlineButton/OutlineButton';
import PageContainer from '../../components/Container/PageContainer/PageContainer';

interface DuelsPageProps {
    layoutMode: LayoutMode;
}

interface DuelWithStatus extends DuelEntity {
    status: 'active' | 'pending' | 'completed';
    prizePool: string;
}

const DuelsPage: React.FC<DuelsPageProps> = ({ layoutMode }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('time');

    const bgColor = useColorModeValue("gray.900", "gray.900");
    const cardBgColor = useColorModeValue("gray.800", "gray.800");
    const borderColor = useColorModeValue("gray.700", "gray.700");
    const textColor = useColorModeValue("white", "white");
    const secondaryTextColor = useColorModeValue("gray.400", "gray.400");
    const accentColor = "green.400";
    const neonGlow = "0 0 10px rgba(72, 187, 120, 0.5)";

    // Fetch active duels
    const { data: duels, isLoading, isError } = useQuery<DuelEntity[]>({
        queryKey: ['active_duels'],
        queryFn: fetchDuelsData,
    });

    // Filter and sort duels
    const filteredDuels = duels?.filter(duel => {
        const matchesSearch = duel.player1Id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            duel.player2Id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || statusFilter === 'active';
        return matchesSearch && matchesStatus;
    }).sort((a, b) => {
        switch (sortBy) {
            case 'time':
                return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
            case 'prize':
                return 0;
            default:
                return 0;
        }
    });

    if (isLoading) {
        return (
            <PageContainer layoutMode={layoutMode} maxW="container.xl">
                <Flex justify="center" align="center" h="100vh">
                    <Spinner size="xl" color={accentColor} />
                    <Text ml={4} fontSize="xl" color={textColor}>Loading active duels...</Text>
                </Flex>
            </PageContainer>
        );
    }

    if (isError || !duels || duels.length === 0) {
        return (
            <PageContainer layoutMode={layoutMode} maxW="container.xl">
                <Flex justify="center" align="center" h="100vh">
                    <Text fontSize="2xl" color="red.500">
                        No active duels found. Please check back later.
                    </Text>
                </Flex>
            </PageContainer>
        );
    }

    return (
        <PageContainer layoutMode={layoutMode} maxW="container.xl">
            {/* Header Section */}
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
                <Flex align="center" justify="space-between" mb={6}>
                    <Flex align="center">
                        <Icon
                            as={GiSwordman}
                            w={10}
                            h={10}
                            color={accentColor}
                            mr={4}
                        />
                        <Box>
                            <Heading size="xl" mb={2} color={textColor}>Duels</Heading>
                            <Text fontSize="lg" color={secondaryTextColor}>
                                Challenge other traders in head-to-head competitions!
                            </Text>
                        </Box>
                    </Flex>
                    <OutlineButton tooltipLabel="Create a new duel">
                        Create Duel
                    </OutlineButton>
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
                        <Text color={secondaryTextColor} fontSize="sm" mb={1}>Total Duels</Text>
                        <Text color={textColor} fontSize="2xl" fontWeight="bold">24</Text>
                        <HStack mt={2}>
                            <Icon as={FaChartLine} color="green.400" />
                            <Text color="green.400" fontSize="sm">+12% this week</Text>
                        </HStack>
                    </Box>
                    <Box
                        p={4}
                        bg={cardBgColor}
                        borderRadius="xl"
                        border="1px solid"
                        borderColor={borderColor}
                    >
                        <Text color={secondaryTextColor} fontSize="sm" mb={1}>Active Duels</Text>
                        <Text color={textColor} fontSize="2xl" fontWeight="bold">8</Text>
                        <HStack mt={2}>
                            <Icon as={FaChartLine} color="green.400" />
                            <Text color="green.400" fontSize="sm">+3 new today</Text>
                        </HStack>
                    </Box>
                    <Box
                        p={4}
                        bg={cardBgColor}
                        borderRadius="xl"
                        border="1px solid"
                        borderColor={borderColor}
                    >
                        <Text color={secondaryTextColor} fontSize="sm" mb={1}>Total Prize Pool</Text>
                        <Text color={textColor} fontSize="2xl" fontWeight="bold">12,500 XRD</Text>
                        <HStack mt={2}>
                            <Icon as={FaChartLine} color="green.400" />
                            <Text color="green.400" fontSize="sm">+2,500 XRD today</Text>
                        </HStack>
                    </Box>
                    <Box
                        p={4}
                        bg={cardBgColor}
                        borderRadius="xl"
                        border="1px solid"
                        borderColor={borderColor}
                    >
                        <Text color={secondaryTextColor} fontSize="sm" mb={1}>Average Duration</Text>
                        <Text color={textColor} fontSize="2xl" fontWeight="bold">7 days</Text>
                        <HStack mt={2}>
                            <Icon as={FaClock} color={secondaryTextColor} />
                            <Text color={secondaryTextColor} fontSize="sm">Most popular</Text>
                        </HStack>
                    </Box>
                </Grid>
            </Box>

            <Divider borderColor={borderColor} />

            {/* Duels List */}
            <Box p={8}>
                <VStack spacing={6} p={6} align="stretch">
                    {filteredDuels?.map((duel) => (
                        <DuelOverview key={duel.id} duel={duel} />
                    ))}
                </VStack>
            </Box>
        </PageContainer>
    );
};

interface DuelOverviewProps {
    duel: DuelEntity;
}

const DuelOverview: React.FC<DuelOverviewProps> = ({ duel }) => {
    const { data: user1, isLoading: user1Loading, isError: user1Error } = useQuery({
        queryKey: ['user_info', duel.player1Id],
        queryFn: () => fetchUserInfoById(duel.player1Id),
    });

    const { data: user2, isLoading: user2Loading, isError: user2Error } = useQuery({
        queryKey: ['user_info', duel.player2Id],
        queryFn: () => fetchUserInfoById(duel.player2Id),
    });

    const cardBgColor = useColorModeValue("gray.800", "gray.800");
    const borderColor = useColorModeValue("gray.700", "gray.700");
    const textColor = useColorModeValue("white", "white");
    const secondaryTextColor = useColorModeValue("gray.400", "gray.400");
    const accentColor = "green.400";
    const neonGlow = "0 0 10px rgba(72, 187, 120, 0.5)";

    // Calculate time remaining with hours and minutes
    const endDate = new Date(duel.endDate);
    const now = new Date();
    const timeRemaining = endDate.getTime() - now.getTime();
    const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hoursRemaining = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

    // Calculate progress
    const startDate = new Date(duel.startDate);
    const totalDuration = endDate.getTime() - startDate.getTime();
    const progress = ((now.getTime() - startDate.getTime()) / totalDuration) * 100;

    // Mock prize pool (replace with actual data)
    const prizePool = "1,000 XRD";

    return (
        <Box
            p={4}
            bg={cardBgColor}
            border="1px solid"
            borderColor={borderColor}
            borderRadius="lg"
            boxShadow="md"
            _hover={{
                transform: "translateY(-2px)",
                boxShadow: neonGlow,
                borderColor: accentColor,
            }}
            transition="all 0.2s"
        >
            {/* Status Badge */}
            <Flex justify="flex-end" mb={2}>
                <Badge
                    colorScheme="green"
                    px={2}
                    py={1}
                    borderRadius="full"
                    fontSize="xs"
                    bg={accentColor}
                    color="white"
                >
                    Active
                </Badge>
            </Flex>

            <Flex
                alignItems="center"
                justifyContent="space-between"
                textAlign="center"
                direction="row"
                gap={4}
            >
                {/* Player 1 */}
                <PlayerOverview
                    user={user1}
                    isLoading={user1Loading}
                    isError={user1Error}
                    side="Player 1"
                />

                {/* VS Separator */}
                <Box
                    position="relative"
                    px={6}
                    py={3}
                    _before={{
                        content: '""',
                        position: "absolute",
                        top: "50%",
                        left: 0,
                        right: 0,
                        height: "1px",
                        background: "linear-gradient(90deg, transparent, green.400, transparent)",
                        transform: "translateY(-50%)",
                    }}
                >
                    <Icon
                        as={GiCrossedSwords}
                        w={12}
                        h={12}
                        color={accentColor}
                        bg={cardBgColor}
                        position="relative"
                        px={2}
                        zIndex={1}
                        _hover={{
                            transform: "scale(1.1)",
                            filter: "drop-shadow(0 0 8px rgba(72, 187, 120, 0.5))",
                        }}
                        transition="all 0.2s"
                    />
                    <VStack spacing={2} mt={2}>
                        <HStack color={secondaryTextColor} fontSize="xs" justify="center">
                            <Icon as={FaClock} />
                            <Text>
                                {new Date(duel.startDate).toLocaleDateString()} - {new Date(duel.endDate).toLocaleDateString()}
                            </Text>
                        </HStack>
                        <HStack color={accentColor} fontSize="xs" justify="center">
                            <Icon as={FaCoins} />
                            <Text fontWeight="bold">{prizePool}</Text>
                        </HStack>
                        <Progress
                            value={progress}
                            size="sm"
                            w="200px"
                            colorScheme="green"
                            bg="gray.700"
                            borderRadius="full"
                        />
                        <Tooltip label={`${hoursRemaining}h ${minutesRemaining}m remaining`}>
                            <Text fontSize="xs" color={daysRemaining <= 3 ? "red.400" : "green.400"}>
                                {daysRemaining} days remaining
                            </Text>
                        </Tooltip>
                    </VStack>
                </Box>

                {/* Player 2 */}
                <PlayerOverview
                    user={user2}
                    isLoading={user2Loading}
                    isError={user2Error}
                    side="Player 2"
                />
            </Flex>

            <Divider my={3} borderColor={borderColor} />

            {/* Duel Actions */}
            <Flex justifyContent="center" gap={3}>
                <Button
                    colorScheme="blue"
                    size="sm"
                    leftIcon={<FaChartLine />}
                    _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "0 0 10px rgba(66, 153, 225, 0.5)",
                    }}
                    transition="all 0.2s"
                >
                    View Details
                </Button>
                <Button
                    colorScheme="green"
                    size="sm"
                    leftIcon={<FaTrophy />}
                    _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: neonGlow,
                    }}
                    transition="all 0.2s"
                >
                    Join
                </Button>
                <Button
                    colorScheme="purple"
                    size="sm"
                    leftIcon={<FaEye />}
                    _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "0 0 10px rgba(159, 122, 234, 0.5)",
                    }}
                    transition="all 0.2s"
                >
                    Watch
                </Button>
            </Flex>
        </Box>
    );
};

interface PlayerOverviewProps {
    user: User | undefined;
    isLoading: boolean;
    isError: boolean;
    side: string;
}

const PlayerOverview: React.FC<PlayerOverviewProps> = ({ user, isLoading, isError, side }) => {
    const textColor = useColorModeValue("white", "white");
    const secondaryTextColor = useColorModeValue("gray.400", "gray.400");
    const accentColor = "green.400";

    return (
        <Flex
            direction="column"
            alignItems="center"
            justifyContent="center"
            w="150px"
            textAlign="center"
            h="100%"
        >
            {isLoading ? (
                <Spinner size="md" color={accentColor} />
            ) : isError ? (
                <Text fontSize="xs" color="red.500">
                    Failed to load user info
                </Text>
            ) : (
                <>
                    <Image
                        boxSize="60px"
                        borderRadius="full"
                        src={user?.avatar || "/images/ape-logo.webp"}
                        alt={`${user?.name}'s Avatar`}
                        mb={1}
                        border="2px solid"
                        borderColor={accentColor}
                        _hover={{
                            transform: "scale(1.05)",
                            boxShadow: "0 0 10px rgba(72, 187, 120, 0.5)",
                        }}
                        transition="all 0.2s"
                    />
                    <Text fontWeight="bold" color={textColor} fontSize="sm" noOfLines={1}>
                        {user?.name || 'Unknown User'}
                    </Text>

                    {/* Player Stats with Tooltips */}
                    <VStack spacing={1} mt={2} w="full">
                        <Tooltip label="Total number of trades in this duel">
                            <HStack justify="space-between" w="full" fontSize="xs">
                                <Text color={secondaryTextColor}>Trades:</Text>
                                <Text color={textColor}>24</Text>
                            </HStack>
                        </Tooltip>
                        <Tooltip label="Win rate in this duel">
                            <HStack justify="space-between" w="full" fontSize="xs">
                                <Text color={secondaryTextColor}>Win Rate:</Text>
                                <Text color={accentColor}>68%</Text>
                            </HStack>
                        </Tooltip>
                        <Tooltip label="Current return in this duel">
                            <HStack justify="space-between" w="full" fontSize="xs">
                                <Text color={secondaryTextColor}>Return:</Text>
                                <Text color="green.400">+15%</Text>
                            </HStack>
                        </Tooltip>
                    </VStack>
                </>
            )}
        </Flex>
    );
};

export default DuelsPage;
