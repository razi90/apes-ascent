import React from 'react';
import {
    Box,
    Center,
    Heading,
    Image,
    SimpleGrid,
    Text,
} from "@chakra-ui/react";
import { LayoutMode } from '../../Layout';
import { routePageBoxStyle } from '../../libs/styles/RoutePageBox';

interface FrontPageProps {
    layoutMode: LayoutMode;
}

const FrontPage: React.FC<FrontPageProps> = ({ layoutMode }) => {
    return (
        <Box sx={routePageBoxStyle(layoutMode)}>
            {/* Top Image */}
            <Box mt={4}>
                <Image
                    src="/images/banner.webp"
                    alt="Ape's Ascent Banner"
                    width="100%"              // Ensures the image spans the container width
                    maxWidth="600px"         // Restricts the maximum width of the image
                    height="auto"             // Automatically adjusts the height to maintain aspect ratio
                    objectFit="contain"       // Ensures the image is fully visible without cutting off
                    mx="auto"                 // Centers the image horizontally
                />
            </Box>

            {/* Game Modes Section */}
            <Box py={8} px={4}>
                <Heading as="h2" size="lg" textAlign="center" mb={6}>
                    Choose Your Game Mode
                </Heading>

                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
                    {/* Game Mode 1 */}
                    <Box
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                        boxShadow="md"
                        p={6}
                        _hover={{ transform: "scale(1.05)", transition: "all 0.3s" }}
                    >
                        <Heading as="h3" size="md" mb={4}>
                            Free For All
                        </Heading>
                        <Text>
                            No limit competitions.
                        </Text>
                    </Box>

                    {/* Game Mode 2 */}
                    <Box
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                        boxShadow="md"
                        p={6}
                        _hover={{ transform: "scale(1.05)", transition: "all 0.3s" }}
                    >
                        <Heading as="h3" size="md" mb={4}>
                            Duels
                        </Heading>
                        <Text>
                            Create duels and challenge other apes.
                        </Text>
                    </Box>

                    {/* Game Mode 3 */}
                    <Box
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                        boxShadow="md"
                        p={6}
                        _hover={{ transform: "scale(1.05)", transition: "all 0.3s" }}
                    >
                        <Heading as="h3" size="md" mb={4}>
                            Clan Wars
                        </Heading>
                        <Text>
                            Create a clan and challenge another clan to a trade war.
                        </Text>
                    </Box>
                </SimpleGrid>
            </Box>
        </Box>
    );
};

export default FrontPage;
