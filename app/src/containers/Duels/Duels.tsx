import React from 'react';
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
} from "@chakra-ui/react";
import { useQuery } from '@tanstack/react-query';
import { Duel as DuelEntity } from '../../libs/entities/Duel';
import { fetchUserInfoById } from '../../libs/data_services/UserDataService';
import { fetchDuelsData } from '../../libs/data_services/DuelDataService';

const DuelsPage: React.FC = () => {
    // Fetch active duels
    const { data: duels, isLoading, isError } = useQuery<DuelEntity[]>({
        queryKey: ['active_duels'],
        queryFn: fetchDuelsData,
    });

    if (isLoading) {
        return (
            <Flex justify="center" align="center" h="100vh">
                <Spinner size="xl" />
                <Text ml={4} fontSize="xl">Loading active duels...</Text>
            </Flex>
        );
    }

    if (isError || !duels || duels.length === 0) {
        return (
            <Flex justify="center" align="center" h="100vh">
                <Text fontSize="2xl" color="red.500">
                    No active duels found. Please check back later.
                </Text>
            </Flex>
        );
    }

    return (
        <Flex
            direction="column"
            align="center"
            justify="center"
            h="100vh"
            w="100%"
            bg="gray.50" // Optional: Add background for better visual clarity
            p={6}
        >
            <Text fontSize="3xl" fontWeight="bold" mb={8} textAlign="center">
                Active Duels
            </Text>
            <VStack spacing={6} align="stretch" w="100%" maxW="800px">
                {duels.map((duel) => (
                    <DuelOverview key={duel.id} duel={duel} />
                ))}
            </VStack>
        </Flex>
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

    return (
        <Box
            p={6}
            border="1px solid"
            borderColor="gray.300"
            borderRadius="lg"
            boxShadow="md"
            _hover={{ boxShadow: "lg", bg: "gray.50" }}
        >
            <Flex
                alignItems="center"
                justifyContent="space-between"
                textAlign="center"
                direction="row"
                gap={6}
            >
                {/* Player 1 */}
                <PlayerOverview
                    user={user1}
                    isLoading={user1Loading}
                    isError={user1Error}
                    side="Player 1"
                />

                {/* VS Separator */}
                <Text fontSize="2xl" fontWeight="bold" color="gray.600">
                    VS
                </Text>

                {/* Player 2 */}
                <PlayerOverview
                    user={user2}
                    isLoading={user2Loading}
                    isError={user2Error}
                    side="Player 2"
                />
            </Flex>

            <Divider my={4} />

            {/* Duel Actions */}
            <Flex justifyContent="center">
                <Button colorScheme="blue" size="sm" mr={4}>
                    View Details
                </Button>
                <Button colorScheme="green" size="sm">
                    Join
                </Button>
            </Flex>
        </Box>
    );
};

interface PlayerOverviewProps {
    user: any;
    isLoading: boolean;
    isError: boolean;
    side: string;
}

const PlayerOverview: React.FC<PlayerOverviewProps> = ({ user, isLoading, isError, side }) => {
    return (
        <Flex
            direction="column"
            alignItems="center"
            justifyContent="center"
            w="150px"
            textAlign="center"
            h="100%" // Ensures it takes up the full height of its parent
        >
            <Badge colorScheme="blue" mb={2}>{side}</Badge>
            {isLoading ? (
                <Spinner size="lg" />
            ) : isError ? (
                <Text fontSize="sm" color="red.500">
                    Failed to load user info
                </Text>
            ) : (
                <>
                    <Image
                        boxSize="80px"
                        borderRadius="full"
                        src={user?.avatar || "/images/ape-logo.webp"}
                        alt={`${user?.name}'s Avatar`}
                        mb={2}
                    />
                    <Text fontWeight="bold">{user?.name || 'Unknown User'}</Text>
                </>
            )}
        </Flex>
    );
};

export default DuelsPage;
