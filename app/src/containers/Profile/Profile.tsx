import React from 'react';
import {
    Box,
    Center,
    VStack,
    Flex,
    Avatar,
    WrapItem,
    Text,
    Grid,
    GridItem,
    Heading,
    HStack,
    Icon,
    Progress,
    Badge,
    useColorModeValue,
    Divider,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    Container,
} from "@chakra-ui/react";
import { routePageBoxStyle } from '../../libs/styles/RoutePageBox';
import { useQuery } from '@tanstack/react-query';
import { fetchUserInfo, fetchUserInfoById } from '../../libs/data_services/UserDataService';
import { User } from '../../libs/entities/User';
import { FaDiscord, FaTelegram, FaTwitter, FaTrophy, FaChartLine, FaCoins, FaMedal, FaStar } from 'react-icons/fa';
import { GiSwordman, GiBorderedShield } from 'react-icons/gi';
import ProfileEditButton from '../../components/Button/ProfileEditButton/ProfileEditButton';
import { PrimerCard } from '../../components/Card/PrimerCard';
import { DescriptionCard } from '../../components/Card/DescriptionCard';
import { SocialButton } from '../../components/Button/SocialButton/SocialButton';
import { useParams } from 'react-router-dom';
import { LayoutMode } from '../../types/layout';
import { OutlineButton } from '../../components/Button/OutlineButton/OutlineButton';

interface ProfileProps {
    layoutMode: LayoutMode;
}

// Component for Profile Header (Avatar, Name, Social Links)
const ProfileHeader: React.FC<{ profile: User | undefined; isOwnProfile: boolean }> = ({ profile, isOwnProfile }) => {
    const accentColor = "green.400";
    const textColor = useColorModeValue("white", "white");
    const secondaryTextColor = useColorModeValue("gray.400", "gray.400");
    const cardBgColor = useColorModeValue("gray.800", "gray.800");
    const borderColor = useColorModeValue("gray.700", "gray.700");

    return (
        <Box
            p={8}
            bg={cardBgColor}
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
            <Flex align="center" justify="space-between">
                <Flex align="center" gap={6}>
                    <WrapItem>
                        <Avatar
                            size="2xl"
                            name={profile?.name}
                            src={profile?.avatar || "/images/ape-logo.webp"}
                            border="2px solid"
                            borderColor={accentColor}
                            _hover={{
                                transform: "scale(1.05)",
                                boxShadow: "0 0 15px rgba(72, 187, 120, 0.4)",
                            }}
                            transition="all 0.2s"
                        />
                    </WrapItem>
                    <Box>
                        <Heading size="xl" mb={2} color={textColor}>{profile?.name}</Heading>
                        <Text fontSize="lg" color={secondaryTextColor} mb={4}>
                            {profile?.bio}
                        </Text>
                        <HStack spacing={4}>
                            {profile?.twitter && (
                                <SocialButton label={'Twitter'} href={`https://www.twitter.com/${profile?.twitter}`}>
                                    <FaTwitter />
                                </SocialButton>
                            )}
                            {profile?.telegram && (
                                <SocialButton label={'Telegram'} href={`https://t.me/@${profile?.telegram}`}>
                                    <FaTelegram />
                                </SocialButton>
                            )}
                            {profile?.discord && (
                                <SocialButton label={'Discord'} href={`https://discord.gg/${profile?.discord}`}>
                                    <FaDiscord />
                                </SocialButton>
                            )}
                        </HStack>
                    </Box>
                </Flex>
                {isOwnProfile && (
                    <ProfileEditButton user={profile} isLoading={false} />
                )}
            </Flex>
        </Box>
    );
};

// Component for Profile Stats
const ProfileStats: React.FC = () => {
    const cardBgColor = useColorModeValue("gray.800", "gray.800");
    const borderColor = useColorModeValue("gray.700", "gray.700");
    const textColor = useColorModeValue("white", "white");
    const secondaryTextColor = useColorModeValue("gray.400", "gray.400");
    const accentColor = "green.400";

    return (
        <Grid templateColumns="repeat(4, 1fr)" gap={6} p={6}>
            <GridItem>
                <Box
                    p={4}
                    bg={cardBgColor}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor={borderColor}
                >
                    <Stat>
                        <StatLabel color={secondaryTextColor}>Total Duels</StatLabel>
                        <StatNumber color={textColor}>24</StatNumber>
                        <StatHelpText>
                            <StatArrow type="increase" />
                            <Text as="span" color={accentColor}>12% this week</Text>
                        </StatHelpText>
                    </Stat>
                </Box>
            </GridItem>
            <GridItem>
                <Box
                    p={4}
                    bg={cardBgColor}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor={borderColor}
                >
                    <Stat>
                        <StatLabel color={secondaryTextColor}>Win Rate</StatLabel>
                        <StatNumber color={textColor}>68%</StatNumber>
                        <StatHelpText>
                            <StatArrow type="increase" />
                            <Text as="span" color={accentColor}>5% this month</Text>
                        </StatHelpText>
                    </Stat>
                </Box>
            </GridItem>
            <GridItem>
                <Box
                    p={4}
                    bg={cardBgColor}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor={borderColor}
                >
                    <Stat>
                        <StatLabel color={secondaryTextColor}>Total Earnings</StatLabel>
                        <StatNumber color={textColor}>12,500 XRD</StatNumber>
                        <StatHelpText>
                            <StatArrow type="increase" />
                            <Text as="span" color={accentColor}>2,500 XRD today</Text>
                        </StatHelpText>
                    </Stat>
                </Box>
            </GridItem>
            <GridItem>
                <Box
                    p={4}
                    bg={cardBgColor}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor={borderColor}
                >
                    <Stat>
                        <StatLabel color={secondaryTextColor}>Rank</StatLabel>
                        <StatNumber color={textColor}>#42</StatNumber>
                        <StatHelpText>
                            <StatArrow type="increase" />
                            <Text as="span" color={accentColor}>Top 5%</Text>
                        </StatHelpText>
                    </Stat>
                </Box>
            </GridItem>
        </Grid>
    );
};

// Component for Achievements
const Achievements: React.FC = () => {
    const cardBgColor = useColorModeValue("gray.800", "gray.800");
    const borderColor = useColorModeValue("gray.700", "gray.700");
    const textColor = useColorModeValue("white", "white");
    const secondaryTextColor = useColorModeValue("gray.400", "gray.400");
    const accentColor = "green.400";

    const achievements = [
        { icon: FaTrophy, title: "Duel Master", description: "Won 10 duels", progress: 100 },
        { icon: GiSwordman, title: "Warrior", description: "Completed 50 trades", progress: 75 },
        { icon: GiBorderedShield, title: "Clan Leader", description: "Led a clan to victory", progress: 50 },
        { icon: FaStar, title: "Rising Star", description: "Reached top 100", progress: 100 },
    ];

    return (
        <Box p={6}>
            <Heading size="md" mb={6} color={textColor}>Achievements</Heading>
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                {achievements.map((achievement, index) => (
                    <GridItem key={index}>
                        <Box
                            p={4}
                            bg={cardBgColor}
                            borderRadius="xl"
                            border="1px solid"
                            borderColor={borderColor}
                        >
                            <HStack spacing={4} mb={4}>
                                <Icon as={achievement.icon} boxSize={6} color={accentColor} />
                                <Box>
                                    <Text color={textColor} fontWeight="bold">{achievement.title}</Text>
                                    <Text color={secondaryTextColor} fontSize="sm">{achievement.description}</Text>
                                </Box>
                            </HStack>
                            <Progress
                                value={achievement.progress}
                                size="sm"
                                colorScheme="green"
                                bg="gray.700"
                                borderRadius="full"
                            />
                        </Box>
                    </GridItem>
                ))}
            </Grid>
        </Box>
    );
};

// Component for Recent Activity
const RecentActivity: React.FC = () => {
    const cardBgColor = useColorModeValue("gray.800", "gray.800");
    const borderColor = useColorModeValue("gray.700", "gray.700");
    const textColor = useColorModeValue("white", "white");
    const secondaryTextColor = useColorModeValue("gray.400", "gray.400");
    const accentColor = "green.400";

    const activities = [
        { type: "duel", title: "Won Duel", description: "Defeated Trader123", time: "2 hours ago", result: "win" },
        { type: "trade", title: "New Trade", description: "Bought 100 XRD", time: "5 hours ago", result: "neutral" },
        { type: "achievement", title: "New Achievement", description: "Reached Top 100", time: "1 day ago", result: "win" },
    ];

    return (
        <Box p={6}>
            <Heading size="md" mb={6} color={textColor}>Recent Activity</Heading>
            <VStack spacing={4} align="stretch">
                {activities.map((activity, index) => (
                    <Box
                        key={index}
                        p={4}
                        bg={cardBgColor}
                        borderRadius="xl"
                        border="1px solid"
                        borderColor={borderColor}
                    >
                        <Flex justify="space-between" align="center">
                            <Box>
                                <Text color={textColor} fontWeight="bold">{activity.title}</Text>
                                <Text color={secondaryTextColor} fontSize="sm">{activity.description}</Text>
                            </Box>
                            <HStack spacing={4}>
                                <Text color={secondaryTextColor} fontSize="sm">{activity.time}</Text>
                                <Badge
                                    colorScheme={activity.result === "win" ? "green" : "gray"}
                                    px={2}
                                    py={1}
                                    borderRadius="full"
                                >
                                    {activity.result === "win" ? "Win" : "Neutral"}
                                </Badge>
                            </HStack>
                        </Flex>
                    </Box>
                ))}
            </VStack>
        </Box>
    );
};

const Profile: React.FC<ProfileProps> = ({ layoutMode }) => {
    const { id } = useParams();
    const { data: user } = useQuery<User>({ queryKey: ['user_info'], queryFn: fetchUserInfo });
    const { data: profile, isLoading: isProfileLoading } = useQuery<User>({
        queryKey: ['ext_user_info'],
        queryFn: () => fetchUserInfoById(`#${id}#`)
    });

    const isOwnProfile = user?.id === profile?.id;
    const bgColor = useColorModeValue("gray.900", "gray.900");
    const cardBgColor = useColorModeValue("gray.800", "gray.800");
    const borderColor = useColorModeValue("gray.700", "gray.700");

    if (isProfileLoading) {
        return (
            <Box sx={routePageBoxStyle(layoutMode)}>
                <Center h="100vh">
                    <Text>Loading profile...</Text>
                </Center>
            </Box>
        );
    }

    return (
        <Container maxW="container.lg" py={8}>
            <Box
                sx={routePageBoxStyle(layoutMode)}
                bg={bgColor}
                borderRadius="2xl"
                boxShadow="lg"
                border="1px solid"
                borderColor={borderColor}
                overflow="hidden"
            >
                <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} />
                <Box bg={cardBgColor}>
                    <ProfileStats />
                    <Divider borderColor={borderColor} />
                    <Achievements />
                    <Divider borderColor={borderColor} />
                    <RecentActivity />
                </Box>
            </Box>
        </Container>
    );
};

export default Profile;
