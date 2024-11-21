import React from 'react';
import {
    Box,
    Center,
    VStack,
    Flex,
    Avatar,
    WrapItem,
} from "@chakra-ui/react";
import { routePageBoxStyle } from '../../libs/styles/RoutePageBox';
import { useQuery } from '@tanstack/react-query';
import { fetchUserInfo, fetchUserInfoById } from '../../libs/data_services/UserDataService';
import { User } from '../../libs/entities/User';
import { FaDiscord, FaTelegram, FaTwitter } from 'react-icons/fa';
import ProfileEditButton from '../../components/Button/ProfileEditButton/ProfileEditButton';
import { PrimerCard } from '../../components/Card/PrimerCard';
import { DescriptionCard } from '../../components/Card/DescriptionCard';
import { SocialButton } from '../../components/Button/SocialButton/SocialButton';
import { useParams } from 'react-router-dom';
import { LayoutMode } from '../../Layout';

interface ProfileProps {
    layoutMode: LayoutMode;
}

// Component for Profile Info (Avatar, Social Links)
const ProfileInfo: React.FC<{ profile: User | undefined }> = ({ profile }) => (
    <VStack pt={4} alignItems="center">
        <WrapItem>
            <Avatar size="2xl" name={profile?.name} src={profile?.avatar !== '' ? profile?.avatar : ''} />{' '}
        </WrapItem>
        <Flex justifyContent="center">
            {profile?.twitter && (
                <Box mx={2}>
                    <SocialButton label={'Twitter'} href={`https://www.twitter.com/${profile?.twitter}`}>
                        <FaTwitter />
                    </SocialButton>
                </Box>
            )}
            {profile?.telegram && (
                <Box mx={2}>
                    <SocialButton label={'Telegram'} href={`https://t.me/@${profile?.telegram}`}>
                        <FaTelegram />
                    </SocialButton>
                </Box>
            )}
            {profile?.discord && (
                <Box mx={2}>
                    <SocialButton label={'Discord'} href={`https://discord.gg/${profile?.discord}`}>
                        <FaDiscord />
                    </SocialButton>
                </Box>
            )}
        </Flex>
    </VStack>
);

// Component for Profile Description and Value Cards
const ProfileDetails: React.FC<{ profile: User | undefined; totalFollowers: number | undefined; totalEquity: number | undefined; isLoading: boolean }> = ({ profile, isLoading }) => (
    <>
        <DescriptionCard title="Description" isLoading={isLoading}>
            {profile?.bio}
        </DescriptionCard>
    </>
);

const Profile: React.FC<ProfileProps> = ({ layoutMode }) => {
    const { id } = useParams();

    const { data: user, isLoading: isLoading, isError: isUserFetchError } = useQuery<User>({ queryKey: ['user_info'], queryFn: fetchUserInfo });
    const { data: profile, isLoading: isProfileLoading, isError: isProfileFetchError } = useQuery<User>({ queryKey: ['ext_user_info'], queryFn: () => fetchUserInfoById(`#${id}#`) });

    if (isUserFetchError) {
        return <Box sx={routePageBoxStyle(layoutMode)}>Error loading data</Box>;
    }

    const isLoadingProfile = isLoading || isProfileLoading;

    return (
        <>
            <Box sx={routePageBoxStyle(layoutMode)} p="8">
                <Center>
                    <Box maxW="6xl" minH="xl" width="100vw">
                        {layoutMode === LayoutMode.DesktopExpanded ? (
                            <Flex p={4}>
                                <PrimerCard cardTitle={profile?.name} cardWidth="50%" cardHeight="100%" isLoading={isLoadingProfile}>
                                    <Flex flex="1" p={1}>
                                        <ProfileInfo profile={profile} />
                                        <Box flex="1">
                                            {user?.id === profile?.id && (
                                                <Flex justifyContent="flex-end" w="100%" pr={3} mt={4}>
                                                    <ProfileEditButton user={user} isLoading={isLoadingProfile || isLoading} />
                                                </Flex>
                                            )}
                                        </Box>
                                    </Flex>
                                </PrimerCard>
                            </Flex>
                        ) : (
                            <VStack spacing={4} p={4}>
                                <PrimerCard cardTitle={profile?.name} cardWidth="100%" cardHeight="auto" isLoading={isLoadingProfile}>
                                    <VStack align="stretch">
                                        <ProfileInfo profile={profile} />
                                        {user?.id === profile?.id && (
                                            <Flex justifyContent="flex-end" w="100%" pr={3} mt={4}>
                                                <ProfileEditButton user={user} isLoading={isLoadingProfile || isLoading} />
                                            </Flex>
                                        )}
                                    </VStack>
                                </PrimerCard>
                            </VStack>
                        )}
                    </Box>
                </Center>
            </Box>
        </>
    );
};

export default Profile;
