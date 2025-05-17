import React from 'react';
import {
    Box,
    Container,
    Heading,
    Image,
    SimpleGrid,
    Text,
    VStack,
    Flex,
    Icon,
    useColorModeValue,
    Button,
    HStack,
    Link,
} from "@chakra-ui/react";
import { Link as RouterLink } from 'react-router-dom';
import { LayoutMode } from '../../types/layout';
import { routePageBoxStyle } from '../../libs/styles/RoutePageBox';
import { FaTrophy, FaUsers, FaChartLine, FaRocket, FaShieldAlt, FaGamepad } from 'react-icons/fa';
import { GiMonkey, GiBorderedShield, GiSwordman } from 'react-icons/gi';

interface FrontPageProps {
    layoutMode: LayoutMode;
}

const FrontPage: React.FC<FrontPageProps> = ({ layoutMode }) => {
    const bgColor = useColorModeValue("gray.50", "gray.900");
    const cardBgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const textColor = useColorModeValue("gray.800", "white");
    const accentColor = "green.400";
    const neonGlow = "0 0 10px rgba(72, 187, 120, 0.3)";

    return (
        <Container maxW="container.xl" px={4}>
            {/* Hero Section */}
            <Box
                py={20}
                textAlign="center"
                position="relative"
                _before={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "linear-gradient(180deg, rgba(72, 187, 120, 0.1) 0%, transparent 100%)",
                    zIndex: 0,
                }}
            >
                <VStack spacing={6} position="relative" zIndex={1}>
                    <Heading
                        as="h1"
                        size="2xl"
                        bgGradient="linear(to-r, green.400, blue.400)"
                        bgClip="text"
                        fontWeight="extrabold"
                        letterSpacing="tight"
                    >
                        Welcome to Ape's Ascent
                    </Heading>
                    <Text fontSize="xl" color={textColor} maxW="2xl">
                        Join the ultimate trading competition platform. Test your skills, challenge others, and climb the ranks to become the top trader.
                    </Text>
                    <Button
                        size="lg"
                        colorScheme="green"
                        bg={accentColor}
                        _hover={{
                            transform: "translateY(-2px)",
                            boxShadow: neonGlow,
                        }}
                        leftIcon={<Icon as={FaRocket} />}
                    >
                        Get Started
                    </Button>
                </VStack>
            </Box>

            {/* Game Modes Section */}
            <Box py={16}>
                <VStack spacing={12}>
                    <VStack spacing={4}>
                        <Icon as={FaGamepad} w={12} h={12} color={accentColor} />
                        <Heading
                            as="h2"
                            size="xl"
                            textAlign="center"
                            color={textColor}
                            textShadow={neonGlow}
                        >
                            Choose Your Game Mode
                        </Heading>
                        <Text fontSize="lg" color={textColor} opacity={0.8} textAlign="center">
                            Select your preferred competition style and start trading
                        </Text>
                    </VStack>

                    <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={8}>
                        <GameModeCard
                            title="Free For All"
                            description="No limit competitions. Trade against everyone and climb the global leaderboard."
                            icon={GiMonkey}
                            borderColor={borderColor}
                            hoverColor={accentColor}
                            bgColor={cardBgColor}
                            link="/free_for_all"
                        />

                        <GameModeCard
                            title="Duels"
                            description="Create duels and challenge other apes. One-on-one trading battles."
                            icon={GiSwordman}
                            borderColor={borderColor}
                            hoverColor={accentColor}
                            bgColor={cardBgColor}
                            link="/duels"
                        />

                        <GameModeCard
                            title="Clan Wars"
                            description="Create a clan and challenge another clan to a trade war. Team up and dominate."
                            icon={GiBorderedShield}
                            borderColor={borderColor}
                            hoverColor={accentColor}
                            bgColor={cardBgColor}
                            isComingSoon={true}
                        />
                    </SimpleGrid>
                </VStack>
            </Box>

            {/* Features Section */}
            <Box py={16}>
                <VStack spacing={12}>
                    <VStack spacing={4}>
                        <Icon as={FaShieldAlt} w={12} h={12} color={accentColor} />
                        <Heading
                            as="h2"
                            size="xl"
                            textAlign="center"
                            color={textColor}
                            textShadow={neonGlow}
                        >
                            Platform Features
                        </Heading>
                        <Text fontSize="lg" color={textColor} opacity={0.8} textAlign="center">
                            Everything you need to succeed in your trading journey
                        </Text>
                    </VStack>

                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                        <FeatureCard
                            title="Real-time Leaderboards"
                            description="Track your progress and compete with other traders in real-time."
                            icon={FaTrophy}
                            bgColor={cardBgColor}
                            borderColor={borderColor}
                        />
                        <FeatureCard
                            title="Community Driven"
                            description="Join a vibrant community of traders and share strategies."
                            icon={FaUsers}
                            bgColor={cardBgColor}
                            borderColor={borderColor}
                        />
                        <FeatureCard
                            title="Advanced Analytics"
                            description="Get detailed insights into your trading performance."
                            icon={FaChartLine}
                            bgColor={cardBgColor}
                            borderColor={borderColor}
                        />
                    </SimpleGrid>
                </VStack>
            </Box>
        </Container>
    );
};

interface GameModeCardProps {
    title: string;
    description: string;
    icon: any;
    borderColor: string;
    hoverColor: string;
    bgColor: string;
    isComingSoon?: boolean;
    link?: string;
}

const GameModeCard: React.FC<GameModeCardProps> = ({
    title,
    description,
    icon,
    borderColor,
    hoverColor,
    bgColor,
    isComingSoon = false,
    link = "#"
}) => {
    const CardContent = (
        <Box
            border="1px solid"
            borderColor={borderColor}
            borderRadius="lg"
            bg={bgColor}
            p={6}
            transition="all 0.3s ease"
            position="relative"
            opacity={isComingSoon ? 0.7 : 1}
            _hover={{
                transform: isComingSoon ? "none" : "translateY(-2px)",
                borderColor: isComingSoon ? borderColor : hoverColor,
                boxShadow: isComingSoon ? "none" : "0 0 15px rgba(72, 187, 120, 0.1)",
            }}
            cursor={isComingSoon ? "not-allowed" : "pointer"}
        >
            {isComingSoon && (
                <Text
                    position="absolute"
                    top="-10px"
                    left="50%"
                    transform="translateX(-50%)"
                    bg="red.400"
                    color="white"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="sm"
                    fontWeight="bold"
                    whiteSpace="nowrap"
                >
                    Coming Soon
                </Text>
            )}
            <VStack spacing={4} align="start">
                <Icon as={icon} w={8} h={8} color={hoverColor} />
                <VStack align="start" spacing={2}>
                    <Heading as="h3" size="md">
                        {title}
                    </Heading>
                    <Text color="gray.500" fontSize="sm">
                        {description}
                    </Text>
                </VStack>
            </VStack>
        </Box>
    );

    return isComingSoon ? CardContent : (
        <RouterLink to={link}>
            {CardContent}
        </RouterLink>
    );
};

interface FeatureCardProps {
    title: string;
    description: string;
    icon: any;
    bgColor: string;
    borderColor: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, bgColor, borderColor }) => {
    return (
        <Box
            border="1px solid"
            borderColor={borderColor}
            borderRadius="lg"
            bg={bgColor}
            p={6}
            transition="all 0.3s ease"
            _hover={{
                transform: "translateY(-2px)",
                borderColor: "green.400",
                boxShadow: "0 0 15px rgba(72, 187, 120, 0.1)",
            }}
        >
            <HStack spacing={4} align="start">
                <Icon as={icon} w={6} h={6} color="green.400" />
                <VStack align="start" spacing={2}>
                    <Heading as="h4" size="md">
                        {title}
                    </Heading>
                    <Text color="gray.500" fontSize="sm">
                        {description}
                    </Text>
                </VStack>
            </HStack>
        </Box>
    );
};

export default FrontPage;
