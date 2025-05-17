import React from 'react';
import {
    Box,
    Flex,
    Text,
    VStack,
    HStack,
    Badge,
    Icon,
    Link,
    useColorModeValue,
    Tooltip,
} from "@chakra-ui/react";
import { FaTrophy, FaUsers, FaClock, FaChartLine, FaMedal, FaCrown, FaHistory } from 'react-icons/fa';
import { GiMonkey, GiSwordman } from "react-icons/gi";
import { useQuery } from '@tanstack/react-query';
import { User } from '../../libs/entities/User';
import { fetchUserInfo } from '../../libs/data_services/UserDataService';

interface ActiveParticipationsProps {
    userId: string;
}

const ActiveParticipations: React.FC<ActiveParticipationsProps> = ({ userId }) => {
    const cardBgColor = useColorModeValue("gray.800", "gray.800");
    const borderColor = useColorModeValue("gray.700", "gray.700");
    const textColor = useColorModeValue("white", "white");
    const secondaryTextColor = useColorModeValue("gray.400", "gray.400");
    const accentColor = "green.400";
    const neonGlow = "0 0 10px rgba(72, 187, 120, 0.5)";

    // Fetch user data
    const { data: user, isLoading } = useQuery<User>({
        queryKey: ['user_info', userId],
        queryFn: () => fetchUserInfo(),
    });

    // Dummy data for demonstration - replace with actual data from your backend
    const activeParticipations = [
        {
            id: 1,
            type: 'competition',
            name: "Free For All Competition",
            startDate: "2024-03-01",
            endDate: "2024-03-31",
            currentRank: 5,
            totalParticipants: 256,
            prize: "$10,000",
            performance: "+15.3%",
            link: "/free_for_all"
        },
        {
            id: 2,
            type: 'duel',
            name: "Trading Duel #123",
            opponent: "CryptoKing",
            startDate: "2024-03-15",
            endDate: "2024-03-16",
            currentScore: "1,250",
            opponentScore: "1,100",
            prize: "$500",
            link: "/duels/123"
        }
    ];

    if (isLoading) {
        return (
            <Box p={4}>
                <Text color={textColor}>Loading participations...</Text>
            </Box>
        );
    }

    return (
        <Box p={4}>
            <Flex align="center" mb={6}>
                <Icon as={FaTrophy} w={6} h={6} color={accentColor} mr={3} />
                <Text fontSize="xl" fontWeight="bold" color={textColor}>Active Participations</Text>
            </Flex>
            <VStack spacing={4} align="stretch">
                {activeParticipations.map((participation) => (
                    <Link
                        key={participation.id}
                        href={participation.link}
                        _hover={{ textDecoration: 'none' }}
                    >
                        <Box
                            p={4}
                            bg={cardBgColor}
                            borderRadius="xl"
                            border="1px solid"
                            borderColor={borderColor}
                            _hover={{
                                transform: "translateY(-2px)",
                                boxShadow: neonGlow,
                                borderColor: accentColor,
                            }}
                            transition="all 0.2s"
                        >
                            <Flex justify="space-between" align="center" mb={2}>
                                <HStack spacing={3}>
                                    <Icon
                                        as={participation.type === 'competition' ? GiMonkey : GiSwordman}
                                        color={accentColor}
                                        boxSize={5}
                                    />
                                    <Text fontSize="lg" fontWeight="bold" color={textColor}>
                                        {participation.name}
                                    </Text>
                                </HStack>
                                <Badge
                                    colorScheme={participation.type === 'competition' ? 'green' : 'purple'}
                                    px={3}
                                    py={1}
                                    borderRadius="full"
                                >
                                    {participation.type === 'competition' ? 'Competition' : 'Duel'}
                                </Badge>
                            </Flex>

                            <HStack spacing={4} mb={2}>
                                <Tooltip label="Time Remaining">
                                    <HStack>
                                        <Icon as={FaClock} color={secondaryTextColor} />
                                        <Text color={secondaryTextColor} fontSize="sm">
                                            {new Date(participation.endDate).toLocaleDateString()}
                                        </Text>
                                    </HStack>
                                </Tooltip>
                                {participation.type === 'competition' ? (
                                    <>
                                        <Tooltip label="Current Rank">
                                            <HStack>
                                                <Icon as={FaMedal} color="yellow.400" />
                                                <Text color={textColor} fontSize="sm">
                                                    Rank #{participation.currentRank}
                                                </Text>
                                            </HStack>
                                        </Tooltip>
                                        <Tooltip label="Total Participants">
                                            <HStack>
                                                <Icon as={FaUsers} color={secondaryTextColor} />
                                                <Text color={secondaryTextColor} fontSize="sm">
                                                    {participation.totalParticipants} participants
                                                </Text>
                                            </HStack>
                                        </Tooltip>
                                    </>
                                ) : (
                                    <>
                                        <Tooltip label="Current Score">
                                            <HStack>
                                                <Icon as={FaChartLine} color={accentColor} />
                                                <Text color={textColor} fontSize="sm">
                                                    {participation.currentScore} vs {participation.opponentScore}
                                                </Text>
                                            </HStack>
                                        </Tooltip>
                                        <Tooltip label="Opponent">
                                            <HStack>
                                                <Icon as={FaUsers} color={secondaryTextColor} />
                                                <Text color={secondaryTextColor} fontSize="sm">
                                                    vs {participation.opponent}
                                                </Text>
                                            </HStack>
                                        </Tooltip>
                                    </>
                                )}
                            </HStack>

                            <Flex justify="space-between" align="center">
                                <Text color={accentColor} fontSize="sm" fontWeight="bold">
                                    {participation.type === 'competition' ?
                                        `Performance: ${participation.performance}` :
                                        `Prize: ${participation.prize}`
                                    }
                                </Text>
                                <Text color={accentColor} fontSize="sm" fontWeight="bold">
                                    Prize: {participation.prize}
                                </Text>
                            </Flex>
                        </Box>
                    </Link>
                ))}
            </VStack>
        </Box>
    );
};

export default ActiveParticipations;