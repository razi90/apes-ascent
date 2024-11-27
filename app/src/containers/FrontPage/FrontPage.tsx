import React from 'react';
import {
    Box,
    Center,
    Heading,
    Image,
    SimpleGrid,
    Text,
    VStack,
} from "@chakra-ui/react";
import { LayoutMode } from '../../Layout';
import { routePageBoxStyle } from '../../libs/styles/RoutePageBox';

interface FrontPageProps {
    layoutMode: LayoutMode;
}

const FrontPage: React.FC<FrontPageProps> = ({ layoutMode }) => {
    return (
        <Box sx={routePageBoxStyle(layoutMode)} bg="back.800" color="font.300">
            {/* Notification Banner */}
            <Box
                bg="orange.400"
                color="black"
                textAlign="center"
                p={4}
                borderRadius="md"
                mx={6}
                my={4}
                boxShadow="md"
            >
                <Text fontSize="lg" fontWeight="bold">
                    This application is running on the testnet and is currently under development.
                    Features may not work as expected.
                </Text>
            </Box>

            {/* Top Banner */}
            <Box mt={4} textAlign="center">
                <Image
                    src="/images/banner.webp"
                    alt="Ape's Ascent Banner"
                    width="100%" // Full width for responsiveness
                    maxWidth="900px" // Restrict max width
                    height="auto" // Maintain aspect ratio
                    objectFit="cover" // Ensure image fills the space properly
                    mx="auto" // Center the image
                    borderRadius="lg" // Rounded edges
                    boxShadow="shadow.primary.500" // Subtle shadow
                />
            </Box>

            {/* Game Modes Section */}
            <Box py={12} px={6}>
                <Heading
                    as="h2"
                    size="xl"
                    textAlign="center"
                    mb={8}
                    color="font.900"
                    textShadow="0 0 5px rgba(255, 255, 255, 0.1)"
                >
                    Choose Your Game Mode
                </Heading>

                <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={6}>
                    {/* Game Mode 1 */}
                    <GameModeCard
                        title="Free For All"
                        description="No limit competitions."
                        borderColor="gray.500"
                        hoverColor="primary.300"
                    />

                    {/* Game Mode 2 */}
                    <GameModeCard
                        title="Duels"
                        description="Create duels and challenge other apes."
                        borderColor="gray.500"
                        hoverColor="primary.300"
                    />

                    {/* Game Mode 3 */}
                    <GameModeCard
                        title="Clan Wars"
                        description="Create a clan and challenge another clan to a trade war."
                        borderColor="gray.500"
                        hoverColor="primary.300"
                    />
                </SimpleGrid>
            </Box>
        </Box>
    );
};

interface GameModeCardProps {
    title: string;
    description: string;
    borderColor: string;
    hoverColor: string;
}

const GameModeCard: React.FC<GameModeCardProps> = ({ title, description, borderColor, hoverColor }) => {
    return (
        <Box
            border="1px solid"
            borderColor={borderColor}
            borderRadius="md"
            boxShadow="sm"
            bg="back.700"
            p={6}
            _hover={{
                transform: "scale(1.05)",
                transition: "all 0.3s",
                borderColor: hoverColor,
                boxShadow: `0 0 10px ${hoverColor}`,
            }}
            textAlign="center"
        >
            <Heading as="h3" size="md" mb={4} color="font.800">
                {title}
            </Heading>
            <Text color="font.700">{description}</Text>
        </Box>
    );
};

export default FrontPage;
